// The shape and the numbers both halves of /viral-reels-creators agree on.
//
// Kept apart from search.ts for the same reason src/lib/reels/types.ts is: that
// module reads the service-role key and the OpenAI key at import time, and the
// client components need these constants. Splitting them means the browser
// bundle can never reach the server module at all, rather than relying on the
// bundler to shake it out.

import { compactNumber } from "@/lib/reels/format";
import { FOLLOWER_STOPS } from "@/lib/reels/types";

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
 * The two orders a creator's reels can be read in.
 *
 * "new" is the default and it is the one that answers "what are they making
 * NOW": a creator's shelf in date order is their run of form, and a two-year-old
 * monster at the top of every page hides the fact that the last ten reels
 * flopped. "views" is the other question, kept one click away.
 */
export const CREATOR_SORTS = ["new", "views"] as const;
export type CreatorSort = (typeof CREATOR_SORTS)[number];

export function normalizeCreatorSort(raw: string | null | undefined): CreatorSort {
  return raw === "views" ? "views" : "new";
}

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
   * Null, never 0, for a creator judged after the last pass. A missing score is
   * "unknown", and the filters treat it as such: see `passesOne`.
   */
  worth_studying: number | null;
  entertaining: number | null;
  educational: number | null;
  inspirational: number | null;
  /**
   * How well they are doing RIGHT NOW, 1-10, computed and never typed.
   *
   * Decile rank of `median views over the last 90 days x sqrt(reels in that
   * window) / followers^0.7`. The sibling of worth_studying and the opposite
   * kind of number: that one is Oleg's read of their craft and deliberately
   * ignores results, this one is only results. The search multiplies both.
   * Null for a creator with no reel in the last 90 days.
   */
  form: number | null;
  /**
   * One sentence on who this creator is worth studying FOR.
   *
   * "bakeries and food businesses; 66 outliers in 90 days, all of them recent."
   * Written per creator by the judging pass and carried in the sheet's
   * `who_should_study_it` column; the only prose anywhere in this database that
   * says what a creator is for, as opposed to how they score.
   *
   * Optional, not just nullable: the roster selects it by name but the search
   * RPC does not return it, so a search hit genuinely does not carry the key.
   * Only the profile header paints it, and that page always comes from the
   * roster read.
   */
  study_note?: string | null;
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
  /**
   * The other accounts Instagram credits on this reel, owner removed.
   *
   * Empty for the four fifths that are one creator's own work. Instagram spells
   * it two ways across the two scrapers and the pipeline merges both; a reel
   * re-credited to the bigger partner has the smaller one put back in here, so
   * a collab never reads as "with themselves".
   */
  collab_with: string[] | null;
  /**
   * Instagram's own paid-partnership flag, or null when the row came from a
   * source that never carried it.
   *
   * Three states, painted as two: only `true` gets a badge. false is a real
   * denial and null is an absence, and they must not be conflated in any count.
   */
  sponsored: boolean | null;
};

// ------------------------------------------------------------------- filtering
//
// Five range filters, drawn the way Airbnb draws a price filter: a histogram of
// the whole index with two thumbs over it, so the shape of the library is
// visible before anything is narrowed.
//
// The histograms are computed in the browser off `CreatorFact[]`, every creator
// in the index reduced to the five numbers a filter asks about. 240 creators is
// about 5 KB that way, which is what buys a histogram that redraws on every
// pixel of a drag instead of on a round trip.

/**
 * One creator as the filters see them: five numbers and no name.
 *
 * A tuple rather than an object because all 240 are inlined into the page's
 * HTML, and the four repeated keys would triple that payload for nothing.
 */
export type CreatorFact = [
  followers: number | null,
  worth_studying: number | null,
  form: number | null,
  entertaining: number | null,
  educational: number | null,
  inspirational: number | null,
];

export const FILTER_KEYS = [
  "followers",
  "worth_studying",
  "form",
  "entertaining",
  "educational",
  "inspirational",
] as const;

export type FilterKey = (typeof FILTER_KEYS)[number];

/** Where each filter's number sits in a CreatorFact. Same order as FILTER_KEYS. */
const FACT_INDEX: Record<FilterKey, 0 | 1 | 2 | 3 | 4 | 5> = {
  followers: 0,
  worth_studying: 1,
  form: 2,
  entertaining: 3,
  educational: 4,
  inspirational: 5,
};

/**
 * The 1-10 scales, as bin edges.
 *
 * Eleven edges for ten bars: bar i covers [i+1, i+2), which is the single value
 * i+1. Writing a discrete scale as edges rather than as values is what lets the
 * scores and the audience ladder share one slider, one histogram and one
 * bounds calculation instead of two of each that drift apart.
 */
const SCORE_EDGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

type Scale = {
  /** What the control calls itself. */
  label: string;
  /** What the summary says when nothing is narrowed. */
  anyLabel: string;
  /**
   * Ascending bin edges. Bar i covers [edges[i], edges[i+1]), so there are
   * edges.length - 1 bars and edges.length thumb positions, and a thumb always
   * sits on a bar boundary rather than in the middle of one.
   */
  edges: readonly number[];
  /**
   * Whether the URL writes this filter as its real values or as thumb indices.
   *
   * The scores write values, because "edu=4-8" is a sentence Oleg can read off a
   * shared link. The audience ladder writes indices, because its two ends are
   * open and "aud=10000-100000000" would read as a hard floor and ceiling that
   * the slider does not actually apply. Value mode assumes unit-step edges,
   * which only the score scales have.
   */
  urlIsValue: boolean;
  /** The query-string key. */
  param: string;
};

export const SCALES: Record<FilterKey, Scale> = {
  // The same ladder /viral-reels-browse offers, so "1M to 5M" means one thing
  // across the site. This page reads consecutive stops as bin edges, which the
  // browse page has no need to do because it draws no histogram.
  followers: {
    label: "audience size",
    anyLabel: "any size",
    edges: FOLLOWER_STOPS,
    urlIsValue: false,
    param: "aud",
  },
  // Oleg's own 1-10 answer to "how much is there to learn from this person".
  // It is also what ORDERS a search now (search/creator_worth.sql multiplies
  // relevance by it), so this control is the explicit version of a nudge the
  // page already applies: use it to demand an 8, not to discover the score.
  worth_studying: {
    label: "worth studying",
    anyLabel: "any",
    edges: SCORE_EDGES,
    urlIsValue: true,
    param: "worth",
  },
  // Computed, not judged: the decile rank of how their last 90 days went. It is
  // the second thing the search multiplies by, so this control is the explicit
  // version of a nudge the page already applies -- use it to demand a creator
  // who is winning NOW, not to discover the number.
  form: {
    label: "doing well now",
    anyLabel: "any",
    edges: SCORE_EDGES,
    urlIsValue: true,
    param: "form",
  },
  entertaining: {
    label: "entertaining",
    anyLabel: "any",
    edges: SCORE_EDGES,
    urlIsValue: true,
    param: "ent",
  },
  educational: {
    label: "educational",
    anyLabel: "any",
    edges: SCORE_EDGES,
    urlIsValue: true,
    param: "edu",
  },
  inspirational: {
    label: "inspirational",
    anyLabel: "any",
    edges: SCORE_EDGES,
    urlIsValue: true,
    param: "insp",
  },
};

/** Inclusive thumb positions, `[lo, hi]`, on a scale's edges. */
export type Range = [lo: number, hi: number];

export type CreatorFilters = Record<FilterKey, Range>;

/** How many bars this scale's histogram has. */
export function barCount(key: FilterKey): number {
  return SCALES[key].edges.length - 1;
}

/** The top thumb position: one past the last bar. */
function topStop(key: FilterKey): number {
  return SCALES[key].edges.length - 1;
}

export function fullRange(key: FilterKey): Range {
  return [0, topStop(key)];
}

/** True when this filter is asking nothing at all. */
export function isFullRange(key: FilterKey, [lo, hi]: Range): boolean {
  return lo === 0 && hi === topStop(key);
}

export const NO_FILTERS: CreatorFilters = {
  followers: fullRange("followers"),
  worth_studying: fullRange("worth_studying"),
  form: fullRange("form"),
  entertaining: fullRange("entertaining"),
  educational: fullRange("educational"),
  inspirational: fullRange("inspirational"),
};

/** True when nothing is set, so the page can skip rendering a "clear" affordance. */
export function filtersAreEmpty(f: CreatorFilters): boolean {
  return FILTER_KEYS.every((key) => isFullRange(key, f[key]));
}

/**
 * Which bar a value lands in, or null when there is no value.
 *
 * Values below the first edge fold into the first bar and values at or above
 * the last fold into the last, so nobody falls off the chart. The FILTER does
 * not fold: a creator past the top edge is excluded by a range that stops
 * short of it and included by one whose top thumb is at the end.
 */
export function binOf(key: FilterKey, value: number | null | undefined): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const { edges } = SCALES[key];
  for (let i = edges.length - 2; i >= 0; i--) if (value >= edges[i]) return i;
  return 0;
}

/**
 * The bounds a range asks the database for.
 *
 * `below` is EXCLUSIVE. Bar i covers [edges[i], edges[i+1]), so a top thumb at
 * stop h selects bars 0 to h-1, which is everything strictly below edges[h]. An
 * inclusive bound would admit a creator sitting exactly on the edge whose bar is
 * not highlighted, and the count on screen would disagree with the chart under
 * it. Null at either end means no bound at all.
 */
export function boundsOf(
  key: FilterKey,
  [lo, hi]: Range,
): { min: number | null; below: number | null } {
  const { edges } = SCALES[key];
  return {
    min: lo === 0 ? null : edges[lo],
    below: hi === topStop(key) ? null : edges[hi],
  };
}

/**
 * Does one value clear one range?
 *
 * A range at full extent asks nothing, so it lets a null through: a creator
 * judged after the last scoring pass has no scores, and hiding them from a
 * filter nobody set would be a filter nobody set. The moment either thumb
 * moves the range is a question, and a null cannot answer it.
 */
function passesOne(key: FilterKey, value: number | null, range: Range): boolean {
  if (isFullRange(key, range)) return true;
  if (value === null || !Number.isFinite(value)) return false;
  const { min, below } = boundsOf(key, range);
  if (min !== null && value < min) return false;
  if (below !== null && value >= below) return false;
  return true;
}

/** Does this creator clear every filter except `except`? */
function passesExcept(
  fact: CreatorFact,
  filters: CreatorFilters,
  except: FilterKey | null,
): boolean {
  for (const key of FILTER_KEYS) {
    if (key === except) continue;
    if (!passesOne(key, fact[FACT_INDEX[key]], filters[key])) return false;
  }
  return true;
}

/**
 * One filter's histogram, counted over the creators the OTHER filters allow.
 *
 * This is the whole point of the cross-filter: pick 1M-10M creators and the
 * educational histogram redraws to describe only them, so the next filter is
 * chosen against what is actually left rather than against the whole library.
 * A filter never narrows its own histogram, or dragging a thumb would eat the
 * bars it is being dragged across.
 */
export function histogram(
  facts: readonly CreatorFact[],
  filters: CreatorFilters,
  key: FilterKey,
): number[] {
  const bars = new Array<number>(barCount(key)).fill(0);
  for (const fact of facts) {
    if (!passesExcept(fact, filters, key)) continue;
    const bin = binOf(key, fact[FACT_INDEX[key]]);
    if (bin !== null) bars[bin] += 1;
  }
  return bars;
}

/** How many creators clear every filter. The number under the controls. */
export function matchCount(
  facts: readonly CreatorFact[],
  filters: CreatorFilters,
): number {
  let n = 0;
  for (const fact of facts) if (passesExcept(fact, filters, null)) n += 1;
  return n;
}

// ------------------------------------------------------------ the query string

/** Two non-negative integers with one hyphen. Anything else is not a range. */
const RANGE_RE = /^(\d+)-(\d+)$/;

/**
 * Read one range off a URL param or an API body.
 *
 * Anything out of range becomes UNSET rather than clamped, which is the same
 * rule the old floors had and for the same reason: a clamped 99 silently
 * answers a question nobody asked and returns almost nothing, which reads as an
 * empty database rather than as a rejected input.
 */
export function readRange(key: FilterKey, raw: unknown): Range {
  const full = fullRange(key);
  if (typeof raw !== "string") return full;
  const m = RANGE_RE.exec(raw.trim());
  if (!m) return full;

  const scale = SCALES[key];
  const base = scale.urlIsValue ? scale.edges[0] : 0;
  const lo = Number(m[1]) - base;
  const hi = Number(m[2]) - base + (scale.urlIsValue ? 1 : 0);

  const top = topStop(key);
  if (lo < 0 || hi > top || lo > hi) return full;
  return [lo, hi];
}

/** The param value for one range, or null when it is asking nothing. */
export function writeRange(key: FilterKey, range: Range): string | null {
  if (isFullRange(key, range)) return null;
  const scale = SCALES[key];
  return scale.urlIsValue
    ? `${scale.edges[range[0]]}-${scale.edges[range[1]] - 1}`
    : `${range[0]}-${range[1]}`;
}

export function readCreatorFilters(raw: Record<string, unknown>): CreatorFilters {
  return {
    followers: readRange("followers", raw[SCALES.followers.param]),
    worth_studying: readRange("worth_studying", raw[SCALES.worth_studying.param]),
    form: readRange("form", raw[SCALES.form.param]),
    entertaining: readRange("entertaining", raw[SCALES.entertaining.param]),
    educational: readRange("educational", raw[SCALES.educational.param]),
    inspirational: readRange("inspirational", raw[SCALES.inspirational.param]),
  };
}

/**
 * Put the filters on a URLSearchParams, deleting every one that is unset.
 *
 * Deleting rather than writing an empty value keeps a shared link honest: a URL
 * with no `edu=` in it filters on nothing, which is exactly what it looks like.
 */
export function writeCreatorFilters(params: URLSearchParams, f: CreatorFilters) {
  for (const key of FILTER_KEYS) {
    const value = writeRange(key, f[key]);
    if (value === null) params.delete(SCALES[key].param);
    else params.set(SCALES[key].param, value);
  }
}

/** The filters as an API body: the same keys the URL uses, so one parser reads both. */
export function filtersToBody(f: CreatorFilters): Record<string, string> {
  const body: Record<string, string> = {};
  for (const key of FILTER_KEYS) {
    const value = writeRange(key, f[key]);
    if (value !== null) body[SCALES[key].param] = value;
  }
  return body;
}

// ----------------------------------------------------------------- the wording

/** One edge, written the way its scale writes numbers. */
function edgeLabel(key: FilterKey, stop: number): string {
  const { edges, urlIsValue } = SCALES[key];
  // In value mode a thumb at stop h means "up to edges[h] - 1", because the
  // bound is exclusive and the values are whole numbers.
  return urlIsValue ? String(edges[stop]) : compactNumber(edges[stop]);
}

/** The summary beside the control: "1M to 10M", "7 or more", "any size". */
export function rangeLabel(key: FilterKey, range: Range): string {
  if (isFullRange(key, range)) return SCALES[key].anyLabel;
  const [lo, hi] = range;
  const scale = SCALES[key];
  const top = topStop(key);
  const from = edgeLabel(key, lo);
  // The top of a range is the last value INSIDE it, not the exclusive edge.
  const to = scale.urlIsValue ? String(scale.edges[hi] - 1) : edgeLabel(key, hi);
  if (lo === 0) return scale.urlIsValue ? `${to} or less` : `under ${to}`;
  if (hi === top) return scale.urlIsValue ? `${from} or more` : `${from}+`;
  return `${from} to ${to}`;
}

/** One bar of the histogram, for its tooltip: "25K to 50K", or "6". */
export function barLabel(key: FilterKey, bar: number): string {
  const { edges, urlIsValue } = SCALES[key];
  return urlIsValue
    ? String(edges[bar])
    : `${compactNumber(edges[bar])} to ${compactNumber(edges[bar + 1])}`;
}

/** What a screen reader reads off the low thumb. */
export function lowThumbLabel(key: FilterKey, [lo]: Range): string {
  return lo === 0 ? "no minimum" : `at least ${edgeLabel(key, lo)}`;
}

/** What a screen reader reads off the high thumb. */
export function highThumbLabel(key: FilterKey, [, hi]: Range): string {
  const scale = SCALES[key];
  if (hi === topStop(key)) return "no maximum";
  return `at most ${scale.urlIsValue ? scale.edges[hi] - 1 : edgeLabel(key, hi)}`;
}

// ---------------------------------------------------------------- everything else

/**
 * A `creator_search_match` row: a creator, how close they were, and where they
 * ranked.
 *
 * TWO numbers, and they are not interchangeable. `similarity` is pure relevance
 * and is what CREATOR_MIN_SIMILARITY filters on. `rank_score` is that multiplied
 * by the study score and is what the database ORDERED by; the rows arrive in
 * that order, so nothing here needs to re-sort. Filtering on `rank_score` would
 * silently move the floor by up to 40%. See search/creator_worth.sql.
 */
export type CreatorHit = CreatorRow & {
  similarity: number;
  rank_score: number;
};

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
