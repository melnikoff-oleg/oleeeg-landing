// What is actually in the library, in one small object.
//
// The single most useful thing the chat can know before it answers. Without it
// the model guesses, and it guesses generously: asked for photography reels it
// will happily describe the ones it wishes existed. With it, the model can see
// that the library is 65 accounts weighted towards comedy, fitness, food and
// visual effects, say so plainly, and pivot to the cross-niche play, which is
// the more valuable answer anyway.
//
// One PostgREST read of four narrow columns, cached in module memory. It is the
// same for every visitor and changes only when sync.py runs.

import "server-only";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const TABLE = "reel_search";

/** Long, because the underlying table is rewritten by hand a few times a week. */
const TTL_MS = 30 * 60 * 1000;
/** PostgREST's own ceiling per request; the table is smaller than two pages. */
const PAGE = 1000;
/** Enough tags to show the shape of the corpus, few enough to stay cheap. */
const TOP_TAGS = 60;

export type AccountSummary = {
  account: string;
  followers: number | null;
  reels: number;
  /** The account's best outlier score, so the model can weight who to trust. */
  top_score: number | null;
};

export type LibraryOverview = {
  total_reels: number;
  accounts: AccountSummary[];
  /** The most common tags with counts. The corpus's centre of gravity. */
  top_tags: { tag: string; reels: number }[];
  oldest_post: string | null;
  newest_post: string | null;
};

type Slim = {
  account: string;
  followers: number | null;
  tags: string[] | null;
  posted_on: string | null;
  score: number | null;
};

let cached: { at: number; value: LibraryOverview } | null = null;
// Concurrent callers share one fetch rather than each starting their own, which
// on a cold instance is the difference between one 1033-row read and ten.
let inflight: Promise<LibraryOverview> | null = null;

async function fetchAll(signal?: AbortSignal): Promise<Slim[]> {
  const rows: Slim[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const params = new URLSearchParams({
      select: "account,followers,tags,posted_on,score",
      limit: String(PAGE),
      offset: String(offset),
    });
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?${params}`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`overview failed: ${res.status}`);
    const batch = (await res.json()) as Slim[];
    if (!Array.isArray(batch)) throw new Error("overview returned a non-array");
    rows.push(...batch);
    if (batch.length < PAGE) return rows;
    // A runaway loop against a table that grew unexpectedly would be a silent
    // way to spend a function's whole budget. The library is ~1k rows.
    if (rows.length >= 20_000) return rows;
  }
}

function summarize(rows: Slim[]): LibraryOverview {
  const byAccount = new Map<string, AccountSummary>();
  const tagCounts = new Map<string, number>();
  let oldest: string | null = null;
  let newest: string | null = null;

  for (const row of rows) {
    const key = row.account || "unknown";
    const entry = byAccount.get(key);
    if (!entry) {
      byAccount.set(key, {
        account: key,
        followers: row.followers,
        reels: 1,
        top_score: row.score,
      });
    } else {
      entry.reels += 1;
      // Follower counts are scraped per reel and drift; keep the largest, which
      // is the most recent pull for an account that is still growing.
      if ((row.followers ?? 0) > (entry.followers ?? 0)) {
        entry.followers = row.followers;
      }
      if ((row.score ?? 0) > (entry.top_score ?? 0)) entry.top_score = row.score;
    }

    // One count per reel per tag, so a reel that repeats a tag cannot inflate it.
    for (const tag of new Set(row.tags ?? [])) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }

    if (row.posted_on) {
      if (!oldest || row.posted_on < oldest) oldest = row.posted_on;
      if (!newest || row.posted_on > newest) newest = row.posted_on;
    }
  }

  const accounts = [...byAccount.values()].sort((a, b) => b.reels - a.reels);
  const top_tags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TOP_TAGS)
    .map(([tag, reels]) => ({ tag, reels }));

  return {
    total_reels: rows.length,
    accounts,
    top_tags,
    oldest_post: oldest,
    newest_post: newest,
  };
}

/**
 * Takes no abort signal on purpose. Concurrent callers share one fetch, so the
 * first visitor navigating away must not cancel the read everyone else is
 * waiting on. It is one small query against a ~1k-row table.
 */
export async function getLibraryOverview(): Promise<LibraryOverview> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
  if (inflight) return inflight;
  inflight = fetchAll()
    .then((rows) => {
      const value = summarize(rows);
      cached = { at: Date.now(), value };
      return value;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
