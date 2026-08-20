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
 * always fills its ten slots, so a query the library has no answer for came
 * back looking confident and wrong: "relationships" narrowed to 30 days
 * returned a Zach King transition reel at 0.17 rather than saying nothing was
 * close.
 *
 * Measured over the live index at 694 reels. A query the library really covers
 * lands at 0.29 to 0.53 and has 25 reels above 0.22. A query it does not cover
 * at all ("how to file taxes in germany") tops out at 0.08 with nothing above
 * 0.20. The junk a narrow window used to surface sat at 0.09 to 0.17. The two
 * populations are well separated, and 0.20 sits in the gap.
 */
export const MIN_SIMILARITY = 0.2;

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
};

/** A `reel_search_match` row: a reel plus how close it was to the query. */
export type ReelHit = ReelRow & { similarity: number };

/** Trim, collapse whitespace and cap the length. Returns "" for junk input. */
export function normalizeQuery(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, QUERY_MAX);
}
