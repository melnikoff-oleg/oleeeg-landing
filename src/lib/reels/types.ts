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

/** One row of `reel_search_match`. Every field is nullable because the database
 *  is still being enriched and a half-written reel must not break the page. */
export type ReelHit = {
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
  similarity: number;
};

/** Trim, collapse whitespace and cap the length. Returns "" for junk input. */
export function normalizeQuery(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, QUERY_MAX);
}
