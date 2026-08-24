// The shape and the numbers both halves of /viral-reels-creators agree on.
//
// Kept apart from search.ts for the same reason src/lib/reels/types.ts is: that
// module reads the service-role key and the OpenAI key at import time, and the
// client components need these constants. Splitting them means the browser
// bundle can never reach the server module at all, rather than relying on the
// bundler to shake it out.

export const CREATOR_QUERY_MAX = 200;

/** How many creators one search returns, and shows. All of them, no second click. */
export const CREATOR_RESULT_COUNT = 12;

/**
 * How close a creator has to be before they are worth showing.
 *
 * Cosine similarity between a query and a creator profile. Measured over the
 * live index at 245 creators, with the same method the reel floor was set by:
 * a query the library really covers lands at 0.29 to 0.57 ("creators who make
 * AI tool tutorials" tops out at 0.574, "people who do street interviews about
 * money" at 0.377), and a query it has no answer for tops out at 0.115 ("how to
 * file taxes in germany"). The two populations are well separated and 0.20 sits
 * in the gap, which is where the reel floor landed too.
 *
 * Without a floor the search always fills its twelve slots, so a query with no
 * answer comes back looking confident and wrong.
 */
export const CREATOR_MIN_SIMILARITY = 0.2;

/**
 * The depth filter: how many of a creator's reels the database has to have read
 * before they are worth returning.
 *
 * A creator with two reels in the database is a real creator with a real viral
 * reel, but their profile was written from two write-ups, so it reads thin and
 * a query can land on them for one accidental word. The default is deliberately
 * low rather than zero: the point of the filter is to let a visitor ask for
 * depth, not to hide most of the library by default.
 */
export const DEPTH_STOPS = [
  { label: "any", reels: 1 },
  { label: "5+ reels", reels: 5 },
  { label: "20+ reels", reels: 20 },
  { label: "50+ reels", reels: 50 },
] as const;

export type DepthReels = (typeof DEPTH_STOPS)[number]["reels"];

const ALLOWED_DEPTH: ReadonlySet<number> = new Set(DEPTH_STOPS.map((d) => d.reels));

/** Anything that is not one of the four offered depths becomes "any". */
export function normalizeDepth(raw: unknown): DepthReels {
  const n = typeof raw === "string" ? Number(raw) : raw;
  return typeof n === "number" && ALLOWED_DEPTH.has(n) ? (n as DepthReels) : 1;
}

/** How many creators one page of the roster shows. */
export const ROSTER_PAGE_SIZE = 24;

/**
 * How many of a creator's reels one page of their profile shows.
 *
 * 60, not 20. These are compact rows now rather than full write-up cards, and a
 * creator with 95 reels was five clicks deep at 20 a page.
 */
export const CREATOR_REELS_PAGE_SIZE = 60;

/**
 * One creator as the card paints them.
 *
 * Every field but the first three is nullable because the database is still
 * growing and a creator whose account was never profiled — @nba is the one, its
 * reels reached the library through a collab — must not break the page.
 */
export type CreatorRow = {
  account: string;
  name: string | null;
  profile_url: string;
  bio: string | null;
  /** The short niche line: two or three keywords written from their own reels. */
  niche: string | null;
  followers: number | null;
  posts_count: number | null;
  verified: boolean | null;
  external_url: string | null;
  /** Reels of theirs the database has actually read. The honest number. */
  reels_indexed: number;
  /** Reels the scrape attempted. Always the bigger of the two. */
  reels_pulled: number | null;
  deep_scraped: boolean | null;
  top_score: number | null;
  median_score: number | null;
  best_views: number | null;
  total_views: number | null;
  first_posted: string | null;
  last_posted: string | null;
  tags: string[] | null;
  /** The craft labels that repeat across their reels: "fast cuts", "bright kitchen". */
  signature: string[] | null;
  top_ideas: string[] | null;
  top_codes: string[] | null;
  top_thumbs: string[] | null;
  /** The creator's face, in our own bucket. Null when the harvest never got one. */
  avatar_url: string | null;
  /**
   * Oleg's hand-written 1-10 judgements, the same numbers the sheet carries.
   *
   * Null, never 0, for a creator judged after the last pass. The filters compare
   * with `>=`, so a 0 would quietly exclude an unjudged creator from every
   * filter while a null leaves them alone until a filter is actually set.
   */
  worth_studying: number | null;
  entertaining: number | null;
  educational: number | null;
  inspirational: number | null;
};

/**
 * One reel on a creator's page.
 *
 * Deliberately not ReelRow. That type carries the whole Gemini write-up and only
 * 5,233 reels have one; this covers all 24,578 the scrape holds, so a creator's
 * page shows everything they made rather than the fifth of it that has been
 * read. Four numbers and a picture is all the page paints.
 */
export type CreatorReel = {
  shortcode: string;
  account: string;
  url: string;
  posted_on: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  score: number | null;
  analyzed: boolean;
  thumb_url: string | null;
};

/**
 * The audience bands the filter offers.
 *
 * Bands rather than a free number box: "how many followers" has no natural unit
 * to type and every visitor would guess a different one. `max` is null on the
 * top band because there is no ceiling above 10M.
 */
export const AUDIENCE_BANDS = [
  { label: "any size", min: null, max: null },
  { label: "under 100K", min: null, max: 100_000 },
  { label: "100K - 1M", min: 100_000, max: 1_000_000 },
  { label: "1M - 10M", min: 1_000_000, max: 10_000_000 },
  { label: "10M+", min: 10_000_000, max: null },
] as const;

export type AudienceBand = (typeof AUDIENCE_BANDS)[number];

/** Anything that is not an offered band index becomes "any size". */
export function normalizeBand(raw: unknown): number {
  const n = typeof raw === "string" ? Number(raw) : raw;
  return typeof n === "number" && Number.isInteger(n) && n >= 0 && n < AUDIENCE_BANDS.length
    ? n
    : 0;
}

/**
 * A 1-10 minimum off the three value scales, or null for "do not filter".
 *
 * 0 and null both mean unfiltered, which is what makes every one of these
 * optional. Anything outside 1-10 is treated as unset rather than clamped: a
 * clamped 99 would silently become "10+" and return almost nothing, which reads
 * as an empty database rather than as a rejected input.
 */
export function normalizeScoreFloor(raw: unknown): number | null {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > 10) return null;
  return n;
}

/** The three optional value filters, as the page and the API pass them around. */
export type CreatorFilters = {
  band: number;
  minEntertaining: number | null;
  minEducational: number | null;
  minInspirational: number | null;
};

export const NO_FILTERS: CreatorFilters = {
  band: 0,
  minEntertaining: null,
  minEducational: null,
  minInspirational: null,
};

/** True when nothing is set, so the page can skip rendering a "clear" affordance. */
export function filtersAreEmpty(f: CreatorFilters): boolean {
  return (
    f.band === 0 &&
    f.minEntertaining === null &&
    f.minEducational === null &&
    f.minInspirational === null
  );
}

export function readFilters(raw: Record<string, unknown>): CreatorFilters {
  return {
    band: normalizeBand(raw.band),
    minEntertaining: normalizeScoreFloor(raw.minEntertaining),
    minEducational: normalizeScoreFloor(raw.minEducational),
    minInspirational: normalizeScoreFloor(raw.minInspirational),
  };
}

/** A `creator_search_match` row: a creator plus how close they were to the query. */
export type CreatorHit = CreatorRow & { similarity: number };

/** Trim, collapse whitespace and cap the length. Returns "" for junk input. */
export function normalizeCreatorQuery(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, CREATOR_QUERY_MAX);
}

/**
 * An Instagram handle, or "" if the string is not one.
 *
 * The detail page's URL segment reaches a PostgREST filter, so it is validated
 * rather than escaped. Instagram allows letters, digits, dots and underscores
 * and nothing else, which excludes every character that could break out of the
 * filter.
 */
export function normalizeHandle(raw: string): string {
  const handle = decodeURIComponent(raw ?? "").trim().replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,64}$/.test(handle) ? handle : "";
}
