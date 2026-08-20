// The whole reel library, filtered and paged. The other half of /viral-reels.
//
// Search answers "what is close to this idea"; browse answers "what is in here
// at all". It never embeds anything and never calls OpenAI, so it is a single
// PostgREST read against `reel_search` and costs nothing per visitor.
//
// Kept apart from search.ts so the two cannot share a cache key or a code path
// by accident: one is ranked by distance to a vector, the other by outlier
// score, and a row that is right for one is not necessarily right for the other.

import "server-only";
import {
  BROWSE_PAGE_SIZE,
  FOLLOWER_MAX_INDEX,
  FOLLOWER_STOPS,
  type ReelRow,
  type WindowDays,
} from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const TABLE = "reel_search";

export const reelBrowseConfigured = Boolean(SUPABASE_URL && SERVICE_KEY);

// Named explicitly rather than `*`, because `*` would also fetch `embedding`
// (3072 floats, ~24 KB of JSON per row) and `doc`, neither of which any browser
// reads. At 20 rows a page that is the difference between a 60 KB response and
// a 550 KB one. Must stay in step with the ReelRow type.
const COLUMNS = [
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

export type BrowseFilters = {
  days: WindowDays;
  /** Indices into FOLLOWER_STOPS. Both ends are open, see the constant. */
  minIndex: number;
  maxIndex: number;
  page: number;
};

export type BrowsePage = {
  rows: ReelRow[];
  /** How many reels match the filters, not how many are on this page. */
  total: number;
};

/** The date a `since_days` window starts, as PostgREST wants it. */
function windowStart(days: WindowDays): string | null {
  if (days === null) return null;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function browseReels(
  filters: BrowseFilters,
  signal?: AbortSignal,
): Promise<BrowsePage> {
  const { days, minIndex, maxIndex, page } = filters;
  const params = new URLSearchParams();
  params.set("select", COLUMNS);
  // Highest outlier first, and a reel whose score never got computed sorts to
  // the very end rather than to the top, which is where Postgres puts nulls in
  // a descending sort by default.
  params.set("order", "score.desc.nullslast,posted_on.desc");
  params.set("limit", String(BROWSE_PAGE_SIZE));
  params.set("offset", String((page - 1) * BROWSE_PAGE_SIZE));

  // Index 0 and the last index are the open ends of the slider, so they add no
  // filter at all. Anything in between becomes a real bound.
  if (minIndex > 0)
    params.append("followers", `gte.${FOLLOWER_STOPS[minIndex]}`);
  if (maxIndex < FOLLOWER_MAX_INDEX) {
    params.append("followers", `lte.${FOLLOWER_STOPS[maxIndex]}`);
  }

  // A reel with no posted_on is dropped as soon as a window is asked for, the
  // same rule reel_search_match follows: "we do not know when this ran" cannot
  // answer "in the last 30 days". `gte` on a null date already excludes it.
  const start = windowStart(days);
  if (start) params.set("posted_on", `gte.${start}`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?${params}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      // The total is what turns "page 3" into "page 3 of 35". `estimated` would
      // be cheaper but wrong on a table this small, where the planner's row
      // estimate can be out by a factor of two.
      Prefer: "count=exact",
    },
    signal,
    // The rows change only when sync.py runs. A minute of edge cache turns a
    // burst of paging into one database read without ever showing a stale page
    // for long enough to notice.
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`browse failed: ${res.status}`);

  const rows = (await res.json()) as ReelRow[];
  if (!Array.isArray(rows)) throw new Error("browse returned a non-array");

  // "0-19/696". The count sits after the slash; PostgREST sends "*" for it when
  // no count was asked for, so fall back to what actually arrived.
  const total = Number(res.headers.get("content-range")?.split("/")[1]);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}
