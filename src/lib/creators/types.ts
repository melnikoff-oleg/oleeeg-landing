// The shape and the numbers both halves of /creators agree on.
//
// Kept apart from search.ts for the same reason src/lib/reels/types.ts is: that
// module reads the service-role key and the OpenAI key at import time, and the
// client components need these constants. Splitting them means the browser
// bundle can never reach the server module at all, rather than relying on the
// bundler to shake it out.

import {
  binOf,
  fullRanges,
  rangesAreEmpty,
  rangesKey,
  rangesToBody,
  readRanges,
  writeRanges,
  type BinRow,
  type FilterSet,
  type Ranges,
  type Scale,
} from "@/lib/filters/range";
import { compactNumber } from "@/lib/reels/format";
import { FOLLOWER_STOPS } from "@/lib/reels/types";

export type { Range } from "@/lib/filters/range";

export const CREATOR_QUERY_MAX = 200;

/**
 * How many creators one screenful of a search is.
 *
 * 10 rather than the 12 that used to be the whole answer. Since the list scrolls
 * (see CREATOR_RESULT_MAX) this is what is on screen at first and how many more
 * appear each time the bottom comes into view.
 */
export const CREATOR_RESULT_COUNT = 10;

/**
 * How many creators one search returns in total, at most.
 *
 * 50, five screenfuls, Oleg's number, and the same shape the library wall got:
 * ten to begin with, another ten each time the bottom arrives, four more times,
 * and then it ends.
 *
 * All 50 arrive in the first answer and the scroll only reveals them, so
 * reaching the bottom costs no second embedding and cannot fail halfway. That is
 * affordable because /api/viral-reels/creators sends CARD ROWS: the card paints
 * an avatar, a handle, three numbers, the bio and the niche, and never reads
 * top_ideas, which alone is half the bytes of a row. 50 trimmed creators are
 * ~15 KB against the 135 KB the same 50 full rows weigh.
 *
 * It is exactly creator_search_match's own ceiling (least(match_count, 50)), so
 * raising this number means a migration first. The library's ceiling was lifted
 * to 200 for that reason; this one has not needed it.
 */
export const CREATOR_RESULT_MAX = 50;

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
  /** craft x form, stored by the database. What the roster is ordered by. */
  rank_base?: number | null;
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
// Six range filters, drawn the way Airbnb draws a price filter: a histogram of
// the whole index with two thumbs over it, so the shape of the library is
// visible before anything is narrowed.
//
// The geometry lives in src/lib/filters/range.ts and is shared with the reel
// library. Everything here is the creator-shaped half: which six scales, and
// what they are called.
//
// The histograms are computed in the browser off `CreatorFact[]`, every creator
// in the index reduced to the six numbers a filter asks about. 245 creators is
// about 5 KB that way, which is what buys a histogram that redraws on every
// pixel of a drag instead of on a round trip. (The reel library is 4,896 rows,
// twenty times as many, so it ships its bins packed instead. Same charts, same
// geometry, different payload.)

/**
 * One creator as the filters see them: six numbers and no name.
 *
 * A tuple rather than an object because all 245 are inlined into the page's
 * HTML, and the six repeated keys would triple that payload for nothing.
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

/**
 * The 1-10 scales, as bin edges.
 *
 * Eleven edges for ten bars: bar i covers [i+1, i+2), which is the single value
 * i+1. Writing a discrete scale as edges rather than as values is what lets the
 * scores and the audience ladder share one slider, one histogram and one bounds
 * calculation instead of two of each that drift apart.
 */
const SCORE_EDGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

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

export const CREATOR_FILTERS: FilterSet<FilterKey> = {
  keys: FILTER_KEYS,
  scales: {
    // The same ladder the reel library offers, so "1M to 5M" means one thing
    // across the site.
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
    // Oleg's own 1-10 answer to "how much is there to learn from this person".
    // It is also what ORDERS a search now (search/creator_worth.sql multiplies
    // relevance by it), so this control is the explicit version of a nudge the
    // page already applies: use it to demand an 8, not to discover the score.
    worth_studying: scoreScale("worth studying", "worth"),
    // Computed, not judged: the decile rank of how their last 90 days went. It
    // is the second thing the search multiplies by, so this control is the
    // explicit version of a nudge the page already applies -- use it to demand a
    // creator who is winning NOW, not to discover the number.
    form: scoreScale("doing well now", "form"),
    entertaining: scoreScale("entertaining", "ent"),
    educational: scoreScale("educational", "edu"),
    inspirational: scoreScale("inspirational", "insp"),
  },
};

/** Kept as a name because half this page's props are typed with it. */
export const SCALES = CREATOR_FILTERS.scales;

export type CreatorFilters = Ranges<FilterKey>;

export const NO_FILTERS: CreatorFilters = fullRanges(CREATOR_FILTERS);

/** True when nothing is set, so the page can skip rendering a "clear" affordance. */
export function filtersAreEmpty(f: CreatorFilters): boolean {
  return rangesAreEmpty(CREATOR_FILTERS, f);
}

/**
 * A creator's six numbers as six bin indices.
 *
 * The histogram and the match count both work on bins, because a bar boundary IS
 * a bound: see the note on BinRow. This runs once per render of the filter bar
 * over 245 rows, which is nothing, and it means there is exactly one binOf call
 * in the codebase per page.
 */
export function creatorBins(facts: readonly CreatorFact[]): BinRow[] {
  return facts.map((fact) =>
    FILTER_KEYS.map((key, i) => binOf(SCALES[key], fact[i])),
  );
}

export function readCreatorFilters(raw: Record<string, unknown>): CreatorFilters {
  return readRanges(CREATOR_FILTERS, raw);
}

/**
 * Put the filters on a URLSearchParams, deleting every one that is unset.
 *
 * Deleting rather than writing an empty value keeps a shared link honest: a URL
 * with no `edu=` in it filters on nothing, which is exactly what it looks like.
 */
export function writeCreatorFilters(params: URLSearchParams, f: CreatorFilters) {
  writeRanges(CREATOR_FILTERS, params, f);
}

/** The filters as an API body: the same keys the URL uses, so one parser reads both. */
export function filtersToBody(f: CreatorFilters): Record<string, string> {
  return rangesToBody(CREATOR_FILTERS, f);
}

/** One string standing for a whole filter set, for comparing two of them. */
export function filtersKey(f: CreatorFilters): string {
  return rangesKey(CREATOR_FILTERS, f);
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

/**
 * A creator as the search list actually draws them.
 *
 * Ten fields of the forty a search returns. The card is an avatar, a handle,
 * three colour-coded numbers, the bio and the short niche; it reads none of the
 * tags, signatures, top ideas, thumbnails or scores, and top_ideas alone is
 * 1,416 bytes of a 2,774-byte row. Sending the rest was affordable at 12
 * creators and is not at 50.
 *
 * CreatorRow satisfies this structurally, so the roster, which has full rows on
 * the server, draws the same card with no conversion.
 */
/**
 * The columns a card actually draws, as data rather than as a type, because
 * this list has a second job: it is what the database is ASKED for.
 *
 * Measured 2026-08-27 against the live project, `creator_search_match` returns
 * 140 KB for 50 creators and the cards read 22 KB of it -- the tags,
 * signatures, top ideas and thumbnails are four fifths of a payload nothing on
 * this page opens. The route always dropped them; it dropped them AFTER they
 * had crossed a network. PostgREST projects an RPC's result in SQL when it is
 * given `select=`, so the columns below are the only ones that ever leave
 * Postgres.
 *
 * `as const` so CreatorTileRow is derived FROM the list. One list, and a column
 * that is not on CreatorRow is a build error rather than an undefined at
 * runtime.
 */
export const CREATOR_TILE_COLUMNS = [
  "account",
  "name",
  "profile_url",
  "bio",
  "niche",
  "followers",
  "verified",
  "best_views",
  "total_views",
  "avatar_url",
] as const satisfies readonly (keyof CreatorRow)[];

/**
 * What goes in PostgREST's `select`.
 *
 * `similarity` is what the 0.20 floor is applied to and `rank_score` is what
 * the rows are ORDERED by -- the two are not interchangeable and the argument
 * is in search/creator_worth.sql. rank_score is fetched despite no card
 * reading it, because the order has to be asked for explicitly once the result
 * is projected: a bare projection happens to preserve the function's own
 * ordering today, and "happens to" is not a thing to rank a page on.
 */
export const CREATOR_TILE_SELECT = [
  ...CREATOR_TILE_COLUMNS,
  "similarity",
  "rank_score",
].join(",");

export type CreatorTileRow = Pick<CreatorRow, (typeof CREATOR_TILE_COLUMNS)[number]>;

export type CreatorTileHit = CreatorTileRow & { similarity: number };

/** The fields above, and nothing else, off a full search hit. */
export function toCreatorTile(c: CreatorTileHit): CreatorTileHit {
  return {
    account: c.account,
    name: c.name,
    profile_url: c.profile_url,
    bio: c.bio,
    niche: c.niche,
    followers: c.followers,
    verified: c.verified,
    best_views: c.best_views,
    total_views: c.total_views,
    avatar_url: c.avatar_url,
    similarity: c.similarity,
  };
}

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
