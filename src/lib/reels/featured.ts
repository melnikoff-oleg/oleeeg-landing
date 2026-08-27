// The screen /reels opens on: 24 reels picked for what they teach, not for how
// hard they beat their audience.
//
// The wall used to open on the whole library ordered by outlier score, which is
// the right answer to "what went furthest" and the wrong first thing to show a
// visitor: the biggest outliers in this corpus are brain rot, and the first
// screen is what somebody decides the whole database is. So the resting state of
// the page is a hand-picked screenful and everything else -- every filter, every
// search, and an explicit "see all" -- is the library exactly as it was.
//
// This is a DEFAULT, never a restriction. Nothing here narrows what the filters
// or the search can reach; it only decides what is on screen before anyone has
// asked a question.
//
// Kept out of browse.ts because it reads a second table: browse.ts is one
// PostgREST read of reel_search and stays that way.

import "server-only";
import type { ReelTileRow } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** How many reels the default screen holds. Oleg's number: one screenful. */
export const FEATURED_REEL_COUNT = 24;

/**
 * How good the CREATOR has to be, on Oleg's own 1-10 read of how much there is
 * to learn from them.
 *
 * 7 keeps 195 of 384 creators, which is wide enough that the pick is not the
 * same twenty accounts forever and narrow enough that nothing he rated a 3 can
 * reach the front page.
 */
const MIN_WORTH_STUDYING = 7;

/**
 * How much the REEL itself has to give, on its own 1-10 axes.
 *
 * Educational OR inspirational, never both: a shadow-art reel teaches nothing
 * and is worth the screen, and an AI-tools reel inspires nobody and is worth the
 * screen. What this excludes is the reel that is neither, which is the whole
 * definition of the thing being kept off the front page.
 *
 * The axes are per reel, so a good creator's throwaway post is dropped while
 * their best one is kept. That is the point of filtering the reel and the
 * creator separately rather than trusting either alone.
 */
const MIN_REEL_AXIS = 6;

/**
 * How many creators the handle list may carry.
 *
 * The handles go into the reel query as `account=in.(...)`, so this is a URL
 * length: 195 handles is a 2.9 KB request today. Ordered by rank_base, so if the
 * index ever grows past this the ones dropped are the least worth studying of an
 * already-filtered set, not an arbitrary alphabetical tail.
 */
const MAX_HANDLES = 250;

/**
 * How many reels are ranked before the one-per-creator rule thins them.
 *
 * Deduplication has to happen after the ordering and cannot happen in PostgREST,
 * so the query returns the best 300 and this module keeps the best one from each
 * account. 300 has produced 24 distinct creators every time it has been
 * measured; if it ever did not, the screen would come back short rather than
 * wrong, and the caller falls back to the ordinary wall.
 */
const CANDIDATES = 300;

/** Ten fields, not twenty-eight. The wall draws a thumbnail and four numbers. */
const TILE_COLUMNS = [
  "shortcode",
  "url",
  "account",
  "creator",
  "posted_on",
  "score",
  "views",
  "likes",
  "thumb_url",
].join(",");

function headers(): HeadersInit {
  return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };
}

/**
 * The 24 reels the page opens on.
 *
 * Two reads rather than one, because reel_search and creator_search share no
 * foreign key and PostgREST cannot join them. Both are the same answer for every
 * visitor and both change only when the pipeline runs, so both are cached for a
 * minute: after the first visitor of the minute the default screen costs nothing
 * at all. The wall's own count is NOT cached, and this deliberately carries no
 * count, so there is no number on screen that a stale read could contradict.
 *
 * Returns an empty array rather than throwing on an empty result, so the caller
 * can fall back to the ordinary wall. An empty front page is the one outcome
 * worse than an ugly one.
 */
export async function featuredReels(signal?: AbortSignal): Promise<ReelTileRow[]> {
  const handleParams = new URLSearchParams();
  handleParams.set("select", "account");
  handleParams.set("worth_studying", `gte.${MIN_WORTH_STUDYING}`);
  handleParams.set("order", "rank_base.desc.nullslast");
  handleParams.set("limit", String(MAX_HANDLES));

  const handleRes = await fetch(
    `${SUPABASE_URL}/rest/v1/creator_search?${handleParams}`,
    { headers: headers(), signal, next: { revalidate: 60 } },
  );
  if (!handleRes.ok) throw new Error(`featured handles failed: ${handleRes.status}`);
  const handleRows = (await handleRes.json()) as { account: string }[];
  if (!Array.isArray(handleRows)) throw new Error("featured handles returned a non-array");

  // Instagram handles are [A-Za-z0-9._] and nothing else, so none of them can
  // break out of the list. Anything that is not one is dropped rather than
  // escaped, because a handle that needs escaping did not come from Instagram.
  const handles = handleRows
    .map((r) => r.account)
    .filter((a) => /^[A-Za-z0-9._]{1,64}$/.test(a));
  if (!handles.length) return [];

  const params = new URLSearchParams();
  params.set("select", TILE_COLUMNS);
  params.set("account", `in.(${handles.join(",")})`);
  // Either axis clears the bar. See MIN_REEL_AXIS.
  params.set(
    "or",
    `(educational.gte.${MIN_REEL_AXIS},inspirational.gte.${MIN_REEL_AXIS})`,
  );
  // Best first, and a reel whose score never got computed sorts to the very end
  // rather than to the top, which is where Postgres puts nulls by default.
  params.set("order", "score.desc.nullslast,posted_on.desc");
  params.set("limit", String(CANDIDATES));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/reel_search?${params}`, {
    headers: headers(),
    signal,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`featured reels failed: ${res.status}`);
  const rows = (await res.json()) as ReelTileRow[];
  if (!Array.isArray(rows)) throw new Error("featured reels returned a non-array");

  // One reel per creator. Without this the screen is four reels by one person
  // who happens to own the top of the score column, which reads as a small
  // database rather than a broad one.
  const seen = new Set<string>();
  const picked: ReelTileRow[] = [];
  for (const row of rows) {
    if (seen.has(row.account)) continue;
    seen.add(row.account);
    picked.push(row);
    if (picked.length >= FEATURED_REEL_COUNT) break;
  }
  return picked;
}
