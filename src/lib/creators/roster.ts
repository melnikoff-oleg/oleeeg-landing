// The creator roster and one creator's page. The other half of
// /viral-reels-creators.
//
// Search answers "who is close to this description"; the roster answers "who is
// in here at all", and getCreator answers "what did this one actually make". No
// embedding, no OpenAI, so all three are plain PostgREST reads that cost nothing
// per visitor.
//
// Kept apart from search.ts so the two cannot share a cache key or a code path
// by accident: one is ranked by distance to a vector, the other by how much of
// the creator the database has read.

import "server-only";
import type { ReelRow } from "@/lib/reels/types";
import {
  CREATOR_REELS_PAGE_SIZE,
  ROSTER_PAGE_SIZE,
  type CreatorRow,
  type DepthReels,
} from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const TABLE = "creator_search";
const REELS_TABLE = "reel_search";

export const creatorRosterConfigured = Boolean(SUPABASE_URL && SERVICE_KEY);

// Named explicitly rather than `*`, because `*` would also fetch `embedding`
// (3072 floats, ~24 KB of JSON per row) and `doc`, neither of which any browser
// reads. At 24 rows a page that is the difference between a 40 KB response and
// a 620 KB one. Must stay in step with the CreatorRow type.
const COLUMNS = [
  "account",
  "name",
  "profile_url",
  "bio",
  "niche",
  "followers",
  "posts_count",
  "verified",
  "external_url",
  "reels_indexed",
  "reels_pulled",
  "deep_scraped",
  "top_score",
  "median_score",
  "best_views",
  "total_views",
  "first_posted",
  "last_posted",
  "tags",
  "signature",
  "top_ideas",
  "top_codes",
  "top_thumbs",
].join(",");

// The reel columns a creator's page paints. The same list browse.ts uses, and
// for the same reason: `*` would drag the embedding along.
const REEL_COLUMNS = [
  "shortcode",
  "url",
  "account",
  "creator",
  "posted_on",
  "score",
  "views",
  "likes",
  "comments",
  "shares",
  "saves",
  "followers",
  "duration_sec",
  "shots",
  "music",
  "idea",
  "hook_summary",
  "hook_points",
  "retain_summary",
  "retain_points",
  "reward_summary",
  "reward_points",
  "tags",
  "caption",
  "thumb_url",
].join(",");

function headers(count = false): HeadersInit {
  const h: Record<string, string> = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  };
  // The total is what turns "page 3" into "page 3 of 11". `estimated` would be
  // cheaper but wrong on a table this small, where the planner's row estimate
  // can be out by a factor of two.
  if (count) h.Prefer = "count=exact";
  return h;
}

/** "0-23/245". The count sits after the slash; PostgREST sends "*" when none
 *  was asked for, so fall back to what actually arrived. */
function totalFrom(res: Response, fallback: number): number {
  const total = Number(res.headers.get("content-range")?.split("/")[1]);
  return Number.isFinite(total) ? total : fallback;
}

export type RosterPage = {
  rows: CreatorRow[];
  /** How many creators match the filter, not how many are on this page. */
  total: number;
};

/**
 * The roster, deepest first.
 *
 * Ordered by how many of a creator's reels the database has read, because that
 * is exactly what a visitor gets by opening one: a creator with 95 reels on
 * their page is worth more of an unfocused browse than one with two. Followers
 * break the tie, so the front page is not a wall of accounts nobody has heard of
 * that happen to have been scraped hard.
 */
export async function listCreators(
  { minReels = 1, page = 1 }: { minReels?: DepthReels; page?: number },
  signal?: AbortSignal,
): Promise<RosterPage> {
  const params = new URLSearchParams();
  params.set("select", COLUMNS);
  params.set("order", "reels_indexed.desc,followers.desc.nullslast");
  params.set("limit", String(ROSTER_PAGE_SIZE));
  params.set("offset", String((page - 1) * ROSTER_PAGE_SIZE));
  if (minReels > 1) params.set("reels_indexed", `gte.${minReels}`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?${params}`, {
    headers: headers(true),
    signal,
    // Never cached. Vercel's Data Cache once kept serving a pre-sync answer long
    // past its TTL on the reel browse page, so the count on screen disagreed
    // with the database for a day. This is one indexed query; pay for it.
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`roster failed: ${res.status}`);
  const rows = (await res.json()) as CreatorRow[];
  if (!Array.isArray(rows)) throw new Error("roster returned a non-array");
  return { rows, total: totalFrom(res, rows.length) };
}

/** One creator, or null if that handle is not in the index. */
export async function getCreator(
  account: string,
  signal?: AbortSignal,
): Promise<CreatorRow | null> {
  const params = new URLSearchParams();
  params.set("select", COLUMNS);
  // The caller validates the handle against [A-Za-z0-9._] before it gets here,
  // which is what makes it safe to interpolate into a filter.
  params.set("account", `eq.${account}`);
  params.set("limit", "1");

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?${params}`, {
    headers: headers(),
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`creator failed: ${res.status}`);
  const rows = (await res.json()) as CreatorRow[];
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

export type CreatorReelsPage = {
  rows: ReelRow[];
  total: number;
};

/**
 * One creator's reels, most viral first.
 *
 * This is the payoff of the whole page: a visitor found a creator, and now they
 * want that creator's best work in order. Score descending, and a reel whose
 * score never got computed sorts to the very end rather than to the top, which
 * is where Postgres puts nulls in a descending sort by default.
 */
export async function getCreatorReels(
  account: string,
  page: number,
  signal?: AbortSignal,
): Promise<CreatorReelsPage> {
  const params = new URLSearchParams();
  params.set("select", REEL_COLUMNS);
  params.set("account", `eq.${account}`);
  params.set("order", "score.desc.nullslast,posted_on.desc");
  params.set("limit", String(CREATOR_REELS_PAGE_SIZE));
  params.set("offset", String((page - 1) * CREATOR_REELS_PAGE_SIZE));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${REELS_TABLE}?${params}`, {
    headers: headers(true),
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`creator reels failed: ${res.status}`);
  const rows = (await res.json()) as ReelRow[];
  if (!Array.isArray(rows)) throw new Error("creator reels returned a non-array");
  return { rows, total: totalFrom(res, rows.length) };
}

/**
 * Every handle in the index, for the sitemap.
 *
 * The one read on this page that is deliberately NOT `no-store`. A sitemap does
 * not need the roster to the minute, and `no-store` here is not merely wasteful:
 * it opts /sitemap.xml out of static rendering, which Next reports as an error
 * the caller catches, so the sitemap ships with every creator page silently
 * missing. Cached for an hour, matching the route's own revalidate.
 */
export async function listCreatorHandles(signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=account&order=account.asc&limit=1000`,
    { headers: headers(), signal, next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error(`handles failed: ${res.status}`);
  const rows = (await res.json()) as { account: string }[];
  return Array.isArray(rows) ? rows.map((r) => r.account) : [];
}
