// The five filters over the reel library, and the numbers both halves of
// /viral-reels-browse agree on.
//
// Kept apart from browse.ts and search.ts for the same reason types.ts is: those
// modules read the service-role key and the OpenAI key at import time, and the
// client components need these constants. Splitting them means the browser
// bundle can never reach a server module at all, rather than relying on the
// bundler to shake it out.
//
// The geometry lives in src/lib/filters/range.ts and is shared with
// /viral-reels-creators. Everything here is the reel-shaped half: which five
// scales, what they are called, and how "posted 30 to 90 days ago" becomes two
// dates the database can answer.

import {
  boundsOf,
  fullRanges,
  type FilterSet,
  type Ranges,
  type Scale,
} from "@/lib/filters/range";
import { compactNumber, formatAge } from "./format";
import { FOLLOWER_STOPS } from "./types";

/**
 * The 1-10 scales, as bin edges.
 *
 * Eleven edges for ten bars: bar i covers [i+1, i+2), which is the single value
 * i+1. Writing a discrete scale as edges rather than as values is what lets the
 * scores, the audience ladder and the age scale share one slider, one histogram
 * and one bounds calculation instead of three of each that drift apart.
 */
const SCORE_EDGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

/**
 * How old a reel is, in days, as bin edges.
 *
 * Oleg asked for buckets rather than a free date pair, and these are the buckets
 * a person filming this week actually thinks in: this week, this fortnight, this
 * month, then coarser and coarser as the answer stops mattering. The axis runs
 * NEWEST on the left, because a library of viral reels is read as a run of form
 * and the first question is always "what is working now".
 *
 * The last edge is ten years, well past the oldest reel here, so the top bar
 * catches everything and nothing falls off the chart. It is never a real bound:
 * a top thumb at the last stop asks for no maximum at all.
 */
const AGE_EDGES = [0, 7, 14, 30, 60, 90, 180, 365, 730, 3650] as const;

/** The wording every 1-10 score shares. */
const SCORE_PHRASE = {
  any: "any",
  under: (to: string) => `${to} or less`,
  over: (from: string) => `${from} or more`,
  both: (from: string, to: string) => `${from} to ${to}`,
};

function scoreScale(label: string, param: string): Scale {
  return {
    label,
    edges: SCORE_EDGES,
    param,
    urlIsValue: true,
    format: String,
    phrase: SCORE_PHRASE,
    minLabel: `lowest ${label}`,
    maxLabel: `highest ${label}`,
  };
}

export const REEL_FILTER_KEYS = [
  "followers",
  "age",
  "entertaining",
  "educational",
  "inspirational",
] as const;

export type ReelFilterKey = (typeof REEL_FILTER_KEYS)[number];

export const REEL_FILTERS: FilterSet<ReelFilterKey> = {
  keys: REEL_FILTER_KEYS,
  scales: {
    // The same ladder /viral-reels-creators offers, so "1M to 5M" means one
    // thing across the site.
    followers: {
      label: "audience size",
      edges: FOLLOWER_STOPS,
      param: "aud",
      urlIsValue: false,
      format: compactNumber,
      phrase: {
        any: "any size",
        under: (to) => `under ${to}`,
        over: (from) => `${from}+`,
        both: (from, to) => `${from} to ${to}`,
      },
      minLabel: "smallest audience",
      maxLabel: "largest audience",
    },
    // Read as an AGE and written as one, because the number that means anything
    // about a reel is how long ago it landed, not the calendar date it landed
    // on. The database is asked in dates; see ageBounds.
    age: {
      label: "posted",
      edges: AGE_EDGES,
      param: "posted",
      urlIsValue: false,
      format: formatAge,
      phrase: {
        any: "any time",
        under: (to) => `last ${to}`,
        over: (from) => `older than ${from}`,
        both: (from, to) => `${from} to ${to} ago`,
      },
      minLabel: "oldest",
      maxLabel: "newest",
    },
    entertaining: scoreScale("entertaining", "ent"),
    educational: scoreScale("educational", "edu"),
    inspirational: scoreScale("inspirational", "insp"),
  },
};

export type ReelFilters = Ranges<ReelFilterKey>;

export const NO_REEL_FILTERS: ReelFilters = fullRanges(REEL_FILTERS);

/** How many characters one packed row of reel bins takes. */
export const REEL_BIN_WIDTH = REEL_FILTER_KEYS.length;

/**
 * How many reels one page of the library shows.
 *
 * 60, not 20. These are thumbnails four to a row now rather than full write-up
 * cards, so a page is fifteen rows of pictures and a visitor scrolls it in
 * seconds. The same number the creator profile grid uses, for the same reason.
 */
export const LIBRARY_PAGE_SIZE = 60;

/**
 * How many reels one screenful of a search is.
 *
 * More than the ten the old search page showed, because the answer is a wall of
 * thumbnails rather than ten write-ups, and a wall of ten has a hole in it.
 *
 * Since the wall scrolls (see LIBRARY_RESULT_MAX) this is no longer how many
 * reels come back. It is how many are ON SCREEN at first and how many more
 * appear each time the bottom comes into view: six rows of four on a desktop,
 * twelve rows of two on a phone.
 */
export const LIBRARY_RESULT_COUNT = 24;

/**
 * How many reels one search returns in total, at most.
 *
 * 120, five screenfuls, Oleg's number: "four extra pages in total, I think it
 * will be more than enough". Reached by scrolling, Instagram-style, 24 at a
 * time, and then the wall ends.
 *
 * ALL 120 ARRIVE IN THE FIRST ANSWER, and the scroll only reveals what is
 * already here. One embedding and one indexed read serve the whole search, so
 * reaching the bottom costs nothing and never fails halfway; paging the server
 * would have meant an embedding per page for a corpus of 4,885 rows, where the
 * entire answer is 42 KB.
 *
 * It is 42 KB because /api/viral-reels/search sends TILE ROWS. The wall draws a
 * thumbnail and four numbers and reads none of the write-ups, so a full row is
 * 2,730 bytes of which the page uses 360. Trimmed, five times as many reels
 * cost a third of what 24 full ones did.
 *
 * reel_library_match caps its own limit at 200 (search/reel_library_page.sql in
 * the reels-database repo), which is deliberately above this number so raising
 * it is a deploy rather than a migration.
 */
export const LIBRARY_RESULT_MAX = 120;

/**
 * The age range as the two dates the database can actually compare.
 *
 * age >= A means posted on or before today - A; age < B means posted after
 * today - B. The half-open top is the same rule every other filter follows: bar
 * i covers [edges[i], edges[i+1]), so a row sitting exactly on the top edge is
 * outside a range that stops there, and the count on screen agrees with the
 * chart under it.
 *
 * Null at either end means no bound at all, which is what an untouched thumb
 * asks for. A reel with no posted_on is dropped as soon as either bound is set,
 * the same rule reel_search_match already follows: "we do not know when this
 * ran" cannot answer "in the last 30 days".
 *
 * `today` is passed in rather than read here so the server and the SQL agree on
 * one date for one request, and so this is testable without mocking a clock.
 */
export function ageBounds(
  range: ReelFilters["age"],
  today: Date,
): { from: string | null; after: string | null } {
  const scale = REEL_FILTERS.scales.age;
  const [lo, hi] = range;
  const top = scale.edges.length - 1;
  return {
    // The newest a reel in this range may be.
    from: lo === 0 ? null : daysBefore(today, scale.edges[lo]),
    // Exclusive: strictly newer than this date.
    after: hi === top ? null : daysBefore(today, scale.edges[hi]),
  };
}

/** An ISO date `days` before `from`, in UTC. */
export function daysBefore(from: Date, days: number): string {
  const d = new Date(from.getTime());
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * The four score-and-size filters as PostgREST params, plus the two dates.
 *
 * Pure, so the one place a range becomes a query lives beside the one place it
 * becomes a chart, and both can be checked without a database. Two params on one
 * column is legal in PostgREST and ANDs, which is why this returns pairs rather
 * than an object.
 *
 * A range at full extent adds nothing at all rather than a bound at its own end:
 * a reel scored after the last pass has null scores, and any numeric bound would
 * drop every one of them from a filter the visitor never set. PostgREST drops
 * null rows from `gte`/`lt` comparisons, which is exactly what the histogram
 * already assumes.
 */
export function reelRangeParams(
  ranges: ReelFilters,
  today: Date,
): [string, string][] {
  const out: [string, string][] = [];
  for (const key of REEL_FILTER_KEYS) {
    if (key === "age") continue;
    const { min, below } = boundsOf(REEL_FILTERS.scales[key], ranges[key]);
    // The key names ARE the column names, which is what keeps this a loop.
    if (min !== null) out.push([key, `gte.${min}`]);
    if (below !== null) out.push([key, `lt.${below}`]);
  }
  const { from, after } = ageBounds(ranges.age, today);
  if (from !== null) out.push(["posted_on", `lte.${from}`]);
  if (after !== null) out.push(["posted_on", `gt.${after}`]);
  return out;
}

/**
 * The same ranges as arguments to reel_library_match.
 *
 * Named after the columns, so five ranges expand into ten arguments the same way
 * they expand into ten query params above. null, not 0 or a sentinel date, for
 * an end that is asking nothing: the function treats null as "do not filter",
 * and a reel scored after the last pass has nulls that any bound would exclude.
 */
export function reelRangeArgs(
  ranges: ReelFilters,
  today: Date,
): Record<string, number | string | null> {
  const args: Record<string, number | string | null> = {};
  for (const key of REEL_FILTER_KEYS) {
    if (key === "age") continue;
    const { min, below } = boundsOf(REEL_FILTERS.scales[key], ranges[key]);
    args[`min_${key}`] = min;
    args[`below_${key}`] = below;
  }
  const { from, after } = ageBounds(ranges.age, today);
  args.posted_from = from;
  args.posted_after = after;
  return args;
}

/**
 * The older pages' `days` chip and follower-stop pair, as ranges.
 *
 * /reels and the ideas chat both ask for recency as "the last N days" and for
 * audience as two indices into FOLLOWER_STOPS. Those are the same two questions
 * this file already answers, so they are converted here rather than kept as a
 * second filter vocabulary inside the reader.
 *
 * Two deliberate differences from what those callers used to get, both in the
 * direction of the chart: the top of the audience range is now exclusive, so an
 * account sitting exactly on a slider stop belongs to the bar above it; and a
 * collapsed pair is widened to one bar rather than passed through, because a
 * range that selects no bars at all is not a range. Neither can move a real reel
 * more than one slider stop.
 */
export function reelFiltersFromWindow({
  days = null,
  minIndex = 0,
  maxIndex = Number.POSITIVE_INFINITY,
}: {
  days?: number | null;
  minIndex?: number;
  maxIndex?: number;
} = {}): ReelFilters {
  const followerTop = REEL_FILTERS.scales.followers.edges.length - 1;
  const lo = Math.min(Math.max(0, minIndex), followerTop - 1);
  const hi = Math.min(followerTop, Math.max(maxIndex, lo + 1));

  const ageEdges = REEL_FILTERS.scales.age.edges;
  const ageStop = days === null ? -1 : ageEdges.indexOf(days);
  return {
    ...NO_REEL_FILTERS,
    followers: [lo, hi],
    // A window that is not one of the age scale's own edges cannot be drawn as a
    // range, so it asks nothing rather than being rounded to a question nobody
    // typed. Every window the two pages offer is an edge.
    age: ageStop > 0 ? [0, ageStop] : NO_REEL_FILTERS.age,
  };
}

/** How many whole days ago a reel was posted, or null when the date is unknown. */
export function ageInDays(
  posted: string | null | undefined,
  today: Date,
): number | null {
  if (!posted) return null;
  const then = Date.parse(`${posted.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(then)) return null;
  const start = Date.parse(`${today.toISOString().slice(0, 10)}T00:00:00Z`);
  // A date in the future is a clock disagreement, not a scheduled post, and it
  // belongs in the newest bucket rather than off the left of the chart.
  return Math.max(0, Math.round((start - then) / 86_400_000));
}
