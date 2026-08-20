// The shape and the numbers both halves of /viral-reels agree on.
//
// Kept apart from search.ts on purpose: that module reads the service-role key
// and the OpenAI key at import time, and the client components need these
// constants. Splitting them means the browser bundle can never reach the
// server module at all, rather than relying on the bundler to shake it out.

export const QUERY_MAX = 200;
/** How many hits the API asks pgvector for. The page shows three and keeps the
 *  rest behind one click, so "more like this" costs no second round trip. */
export const RESULT_COUNT = 12;
/** How many of those are on screen before the visitor asks for more. */
export const TOP_COUNT = 3;

/** One row of `match_reels`. Every field is nullable because the database is
 *  still being enriched and a half-written reel must not break the page. */
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
