// The creator roster and one creator's page. The other half of
// /creators.
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
import { boundsOf } from "@/lib/filters/range";
import {
  CREATOR_REELS_PAGE_SIZE,
  FILTER_KEYS,
  NO_FILTERS,
  ROSTER_PAGE_SIZE,
  SCALES,
  type CreatorFact,
  type CreatorFilters,
  type CreatorReel,
  type CreatorRow,
  type CreatorSort,
} from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const TABLE = "creator_search";
// Every reel the scrape holds, not the fifth of them Gemini has read. See the
// CreatorReel type for why this is not reel_search.
const REELS_TABLE = "creator_reel";
/** How many creators the histograms will read. See listCreatorFacts. */
const FACTS_LIMIT = 2000;

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
  "avatar_url",
  "worth_studying",
  // Craft x form, stored and generated. What the roster is ordered by.
  "rank_base",
  // How the last 90 days went, 1-10. Computed by scripts/form_score.py, and the
  // second thing creator_search_match multiplies relevance by.
  "form",
  "entertaining",
  "educational",
  "inspirational",
  // The sentence saying what this creator is worth studying for. Read here and
  // not from the search RPC, which returns a fixed column list; the profile
  // header is the only thing that paints it and it always comes through here.
  "study_note",
].join(",");

// Four numbers and a picture. The write-up columns are gone from this page on
// purpose: Oleg asked for views, likes and comments and explicitly not shares,
// saves, duration or like percentage, and this table has no write-up anyway.
const REEL_COLUMNS = [
  "shortcode",
  "url",
  "account",
  "posted_on",
  "views",
  "likes",
  "comments",
  "score",
  "analyzed",
  "thumb_url",
  // Who else is credited, and whether Instagram was told it is an ad. Two more
  // columns on a row that is already four integers and a URL, and they are what
  // separates "this creator can do 28M on their own" from "this creator did 28M
  // once, with a brand paying for it".
  "collab_with",
  "sponsored",
].join(",");

/**
 * Turn the four ranges into PostgREST query params.
 *
 * A range at full extent adds nothing at all rather than a bound at its own
 * end: a creator judged after the last scoring pass has null scores, and any
 * numeric bound would drop every one of them from a filter the visitor never
 * set. PostgREST drops null rows from `gte`/`lt` comparisons, which is exactly
 * the behaviour the histogram already assumes.
 *
 * The upper bound is `lt`, not `lte`, because a bar covers [edge, nextEdge) and
 * the count under the chart has to be the same number the chart draws.
 */
function applyFilters(params: URLSearchParams, f: CreatorFilters) {
  for (const key of FILTER_KEYS) {
    const { min, below } = boundsOf(SCALES[key], f[key]);
    // The FilterKey names are the column names, which is why this loop can
    // stay a loop. Two params on one column is legal in PostgREST and ANDs.
    if (min !== null) params.append(key, `gte.${min}`);
    if (below !== null) params.append(key, `lt.${below}`);
  }
}

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
 * The roster, most worth studying first.
 *
 * `worth_studying` is Oleg's own 1-10 answer to "how much is there to learn from
 * this person", and browsing with an empty box is exactly the question it
 * answers, so it leads. Before 2026-08-25 the column existed, was selected here,
 * and ordered nothing.
 *
 * Then depth, because that is what a visitor actually gets by opening one: a
 * creator with 95 reels on their page is worth more of an unfocused browse than
 * one with two. Then followers, so the front page is not a wall of accounts
 * nobody has heard of that happen to have been scraped hard.
 *
 * `nullslast` on the score: a creator judged after the last scoring pass has
 * none, and sorting them to the top would put the least-known accounts first.
 * The search does the opposite with a null and deliberately -- see the header of
 * search/creator_worth.sql -- because there a null is one term in a product, not
 * the whole order.
 */
export async function listCreators(
  {
    page = 1,
    filters = NO_FILTERS,
  }: { page?: number; filters?: CreatorFilters },
  signal?: AbortSignal,
): Promise<RosterPage> {
  const params = new URLSearchParams();
  params.set("select", COLUMNS);
  params.set(
    "order",
    // rank_base, not "worth then form". It is a stored generated column holding
    // craft MULTIPLIED by form, the identical expression creator_search_match
    // ranks with, so the front page and the search results cannot disagree
    // about who is best.
    //
    // Sorting by craft and using form to break ties is a different question and
    // it gave a different answer: a creator rated 10 whose form is 1 outranked
    // every creator rated 9 whose form is 10, which put @aiconversation -- the
    // whole reason form exists -- 6th on the page Oleg actually opens.
    "rank_base.desc.nullslast,reels_indexed.desc,followers.desc.nullslast",
  );
  params.set("limit", String(ROSTER_PAGE_SIZE));
  params.set("offset", String((page - 1) * ROSTER_PAGE_SIZE));
  applyFilters(params, filters);

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

/**
 * How many creators the default screen holds. Oleg's number.
 */
export const FEATURED_CREATOR_COUNT = 16;

/**
 * The screen /creators opens on: 16 accounts worth opening, not 24 of whoever
 * scores highest.
 *
 * The roster is ordered by rank_base, which is right and was still opening on
 * accounts nobody wants as a first impression: the top of that order is comedy
 * skits, carpet cleaning and satisfying-floor ASMR, because craft times form has
 * no opinion about what a creator is FOR. So the resting state of the page is a
 * hand-picked screenful and everything else -- every filter, every search, and
 * an explicit "see all" -- is the roster exactly as it was.
 *
 * Four conditions, each of them Oleg's words:
 *
 *   under a million followers   an account with 40M is not a model anybody can
 *                               copy, and it is the one everybody has seen.
 *   worth studying 7+           his own 1-10 read of how much there is to learn.
 *   doing well now 6+           `form` is the decile rank of median views over
 *                               the last 90 days x sqrt(reels in that window),
 *                               over followers^0.7, so "consistent, frequent and
 *                               winning lately" is already one number and this
 *                               is it. A creator with no reel in 90 days has no
 *                               form at all and is dropped, which is the
 *                               intended reading of "lately".
 *   educational or inspirational 5+
 *                               either one clears the bar, never both: an
 *                               account can be worth the screen for what it
 *                               teaches or for what it makes you want to do. It
 *                               is being neither that this excludes.
 *
 * That leaves 23 of 384 creators today, ordered by rank_base like the roster
 * itself, so the front page is the best of the ones that pass rather than a
 * different ranking nobody else on the site uses.
 *
 * Cached for a minute: it is the same answer for every visitor and it only moves
 * when creators.py runs. It deliberately carries no count, so there is no number
 * on screen a stale read could contradict.
 *
 * Returns an empty array rather than throwing on an empty result, so the caller
 * can fall back to the ordinary roster. An empty front page is the one outcome
 * worse than an ugly one.
 */
export async function featuredCreators(signal?: AbortSignal): Promise<CreatorRow[]> {
  const params = new URLSearchParams();
  params.set("select", COLUMNS);
  params.set("followers", "lt.1000000");
  params.set("worth_studying", "gte.7");
  params.set("form", "gte.6");
  params.set("or", "(educational.gte.5,inspirational.gte.5)");
  params.set("order", "rank_base.desc.nullslast,followers.desc.nullslast");
  params.set("limit", String(FEATURED_CREATOR_COUNT));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?${params}`, {
    headers: headers(),
    signal,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`featured creators failed: ${res.status}`);
  const rows = (await res.json()) as CreatorRow[];
  if (!Array.isArray(rows)) throw new Error("featured creators returned a non-array");
  return rows;
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
  rows: CreatorReel[];
  total: number;
};

/**
 * One creator's reels, newest first by default or most viewed on request.
 *
 * Newest is the default because a creator's shelf in date order is their run of
 * form: it answers what they are making NOW, which a two-year-old monster
 * pinned to the top of every page hides.
 *
 * When it is views, it is views and never the outlier score. On one creator's
 * own page the audience is a constant, so views ARE the ranking; sorting by
 * score there would push their biggest reel down under an early one that beat a
 * much smaller following.
 *
 * Each order carries the other as its tie-breaker, so the sequence is total and
 * a reel cannot appear on two pages or on none. Nulls sort last either way,
 * which is where Postgres puts them in a descending sort by default: those are
 * the 478 pre-Reels video posts Instagram never recorded a number for.
 */
const REEL_ORDER: Record<CreatorSort, string> = {
  new: "posted_on.desc.nullslast,views.desc.nullslast,shortcode.asc",
  views: "views.desc.nullslast,posted_on.desc.nullslast,shortcode.asc",
};

export async function getCreatorReels(
  account: string,
  page: number,
  sort: CreatorSort = "new",
  signal?: AbortSignal,
): Promise<CreatorReelsPage> {
  const params = new URLSearchParams();
  params.set("select", REEL_COLUMNS);
  params.set("account", `eq.${account}`);
  params.set("order", REEL_ORDER[sort]);
  params.set("limit", String(CREATOR_REELS_PAGE_SIZE));
  params.set("offset", String((page - 1) * CREATOR_REELS_PAGE_SIZE));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${REELS_TABLE}?${params}`, {
    headers: headers(true),
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`creator reels failed: ${res.status}`);
  const rows = (await res.json()) as CreatorReel[];
  if (!Array.isArray(rows)) throw new Error("creator reels returned a non-array");
  return { rows, total: totalFrom(res, rows.length) };
}

/**
 * Every creator in the index reduced to the five numbers the filters ask about.
 *
 * This is what makes the histograms instant: the whole index is about 5 KB in
 * this shape, so it ships with the page and every bar redraws in the browser on
 * every pixel of a drag. Asking the server for a histogram per filter change
 * would be four round trips to draw four charts nobody has committed to yet.
 *
 * A tuple, not an object: the four keys repeated 240 times would triple the
 * payload and buy nothing, since the order is fixed by the CreatorFact type.
 *
 * Cached for a minute rather than `no-store`. It is the same answer for every
 * visitor and it only moves when creators.py runs, which is a handful of times
 * a week; the roster next to it stays uncached because its count is on screen.
 */
export async function listCreatorFacts(signal?: AbortSignal): Promise<CreatorFact[]> {
  const params = new URLSearchParams();
  params.set(
    "select",
    "followers,worth_studying,form,entertaining,educational,inspirational",
  );
  // Without `order` a paged read has no defined order at all. It costs nothing
  // here and it makes the payload byte-identical between two renders, which is
  // what keeps the client's histograms from shifting under a refresh.
  params.set("order", "account.asc");
  params.set("limit", String(FACTS_LIMIT));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?${params}`, {
    headers: headers(),
    signal,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`creator facts failed: ${res.status}`);
  const rows = (await res.json()) as {
    followers: number | null;
    worth_studying: number | null;
    form: number | null;
    entertaining: number | null;
    educational: number | null;
    inspirational: number | null;
  }[];
  if (!Array.isArray(rows)) throw new Error("creator facts returned a non-array");
  // A silent truncation here would not break anything visibly: the charts would
  // simply describe a prefix of the index and the count under them would
  // disagree with the roster's own. Say so instead. 2000 is eight times the
  // current 240 and PostgREST would need its own max-rows raised past it too.
  if (rows.length >= FACTS_LIMIT) {
    console.error(`creator facts hit the ${FACTS_LIMIT}-row cap; the histograms are now a prefix of the index`);
  }
  // Order fixed by CreatorFact, which is fixed by FILTER_KEYS. Adding a filter
  // means adding it in both places or the histograms silently describe the
  // wrong column.
  return rows.map((r) => [
    r.followers,
    r.worth_studying,
    r.form,
    r.entertaining,
    r.educational,
    r.inspirational,
  ]);
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
