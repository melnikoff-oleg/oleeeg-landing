// The shape and the numbers both halves of /viral-reels agree on.
//
// Kept apart from search.ts on purpose: that module reads the service-role key
// and the OpenAI key at import time, and the client components need these
// constants. Splitting them means the browser bundle can never reach the
// server module at all, rather than relying on the bundler to shake it out.

export const QUERY_MAX = 200;
/** How many reels one search returns, and shows. All of them, no second click. */
export const RESULT_COUNT = 10;

/**
 * How close a reel has to be before it is worth showing.
 *
 * Cosine similarity between a query and a write-up. Without a floor the search
 * always fills its slots, so a query the library has no answer for came back
 * looking confident and wrong: "relationships" narrowed to 30 days returned a
 * Zach King transition reel at 0.17 rather than saying nothing was close.
 *
 * 0.15 SINCE 2026-08-25, down from 0.20. Oleg read all 100 of the best "AI"
 * matches from the last 30 days by hand and called every one of them relevant,
 * including the 41 that sat below the old floor. The floor was set when the
 * index held 694 reels; it holds 4,885 now, and both populations moved.
 *
 * Re-measured against the live index the day it changed, top match and how many
 * of the top 50 clear each floor:
 *
 *   how to file taxes in germany     0.228   2 above .20    2 above .15
 *   how to fix a diesel engine turbo 0.264   4              19
 *   medieval castle architecture     0.257   9              50
 *   relationships                    0.299  50              50
 *   AI                               0.349  50              50
 *   street interview                 0.476  50              50
 *
 * So the change costs nothing on a query the library cannot answer -- German
 * tax law returns the same two reels either way -- and buys a full page on the
 * ones it half answers, which is the case the old floor was quietly eating.
 *
 * NOTE the first line of that table, because it is the real lesson: a query the
 * library has no answer for used to top out at 0.08 and now tops out at 0.228.
 * A bigger index means more chances for something to be accidentally near, so
 * this floor drifts upward in meaning as the corpus grows and is worth
 * re-measuring rather than reasoning about. It never made "nothing matched"
 * impossible; it only made it rare.
 */
export const MIN_SIMILARITY = 0.15;

/**
 * The recency filter.
 *
 * `days: null` is all time. Everything else is a window counted back from today
 * by reel_search_match, which drops any reel whose posted_on is unknown as soon
 * as a window is asked for.
 */
export const WINDOWS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "60 days", days: 60 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
  { label: "all time", days: null },
] as const;

export type WindowDays = (typeof WINDOWS)[number]["days"];

const ALLOWED_DAYS: ReadonlySet<number> = new Set(
  WINDOWS.flatMap((w) => (w.days === null ? [] : [w.days as number])),
);

/** Anything that is not one of the six offered windows becomes all time. */
export function normalizeDays(raw: unknown): WindowDays {
  const n = typeof raw === "string" ? Number(raw) : raw;
  return typeof n === "number" && ALLOWED_DAYS.has(n) ? (n as WindowDays) : null;
}

/** How many reels one page of the browse list shows. */
export const BROWSE_PAGE_SIZE = 20;

/**
 * The stops on the follower range slider.
 *
 * Log-spaced on purpose. The library spans 47.9K to 88.9M followers, so a
 * linear slider would leave 30 of the 33 accounts inside its first few pixels
 * and give the whole right half of the track to MrBeast alone.
 *
 * Both ends are open: index 0 means no lower bound and the last index means no
 * upper bound, so the full range is genuinely no filter rather than "between
 * 10K and 100M", which would quietly drop any account outside those numbers.
 */
export const FOLLOWER_STOPS = [
  10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_000_000,
  5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000,
] as const;

export const FOLLOWER_MAX_INDEX = FOLLOWER_STOPS.length - 1;

/** Clamp an untrusted value onto the slider's own indices. */
export function normalizeFollowerIndex(raw: unknown, fallback: number): number {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (typeof n !== "number" || !Number.isInteger(n)) return fallback;
  return Math.min(FOLLOWER_MAX_INDEX, Math.max(0, n));
}

/**
 * Clamp an untrusted page number.
 *
 * Capped rather than merely floored: PostgREST turns a page into an offset the
 * database has to count past, so `?page=999999999` would otherwise be a free
 * table scan for anyone who typed it.
 */
export function normalizePage(raw: unknown): number {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, 10_000);
}

/** One reel as the card paints it. Every field but the first three is nullable
 *  because the database is still being enriched and a half-written reel must
 *  not break the page. The browse list and the search share this shape; only
 *  search adds a similarity, which is why the two types are split. */
export type ReelRow = {
  shortcode: string;
  url: string;
  account: string;
  creator: string | null;
  posted_on: string | null;
  score: number | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  followers: number | null;
  duration_sec: number | null;
  shots: string | null;
  music: string | null;
  idea: string | null;
  hook_summary: string | null;
  hook_points: string[] | null;
  retain_summary: string | null;
  retain_points: string[] | null;
  reward_summary: string | null;
  reward_points: string[] | null;
  tags: string[] | null;
  caption: string | null;
  thumb_url: string | null;
  /**
   * The three 1-10 reads of what a reel gives a viewer: how much fun it is, how
   * much you learn, how much it moves you.
   *
   * One row per reel, from analysis/axes in the reels-database repo, and the
   * three axes the library filters on. Null, never 0, for a reel indexed since
   * the last scoring pass: a missing score is "unknown", and the filters treat
   * it as such rather than as a zero out of ten.
   *
   * Optional as well as nullable, because /reels and the ideas chat read this
   * same type through paths that do not select them.
   */
  entertaining?: number | null;
  educational?: number | null;
  inspirational?: number | null;
};

/** A `reel_search_match` row: a reel plus how close it was to the query. */
export type ReelHit = ReelRow & { similarity: number };

/**
 * A reel as the library wall actually draws it.
 *
 * Ten fields of the twenty-eight a search returns. The tile is a thumbnail with
 * four numbers over it and a handle above it; it never reads the idea, the
 * three write-ups, the tags or the caption, which together are seven eighths of
 * a row's bytes. Sending them anyway was affordable at 24 rows and is not at
 * 120: full rows are 2,730 bytes each, these are 360.
 *
 * ReelRow satisfies this structurally, so the browse wall, which does have full
 * rows on the server, needs no conversion to draw the same tile.
 */
export type ReelTileRow = Pick<
  ReelRow,
  "shortcode" | "url" | "account" | "creator" | "posted_on" | "score" | "views" | "likes" | "thumb_url"
>;

export type ReelTileHit = ReelTileRow & { similarity: number };

/** The fields above, and nothing else, off any fuller row. */
export function toTileRow(reel: ReelHit): ReelTileHit {
  return {
    shortcode: reel.shortcode,
    url: reel.url,
    account: reel.account,
    creator: reel.creator,
    posted_on: reel.posted_on,
    score: reel.score,
    views: reel.views,
    likes: reel.likes,
    thumb_url: reel.thumb_url,
    similarity: reel.similarity,
  };
}

/** Trim, collapse whitespace and cap the length. Returns "" for junk input. */
export function normalizeQuery(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, QUERY_MAX);
}
