// The three tools the ideas chat can call against the reel library.
//
// Everything here is server-side and read-only. The model never sees Supabase,
// never sees a key, and never gets to choose a table or a column: it picks a
// tool name and fills in a schema, and this module turns that into one of three
// queries that were written by hand. A prompt-injected instruction inside a
// reel caption can therefore change what the model *says*, but not what it can
// *reach*, which is the property that matters.
//
// Every tool returns two things: `forModel`, the JSON the model reads, and
// `reels`, the full rows the browser needs to draw a card. They are separate
// because the model does not need a thumbnail URL and the browser does not need
// the analysis prose twice.

import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { browseReels } from "./browse";
import { estimateEffort, normalizeMaxEffort } from "./effort";
import { getLibraryOverview } from "./overview";
import { searchReels } from "./search";
import {
  FOLLOWER_MAX_INDEX,
  FOLLOWER_STOPS,
  normalizeDays,
  normalizeQuery,
  type ReelRow,
  type WindowDays,
} from "./types";

/** Most reels one tool call can return. Ten is a page of references and about
 *  3k tokens; more crowds the context without changing the answer. */
const MAX_RESULTS = 10;
/**
 * How many rows a semantic search asks pgvector for, as a multiple of what it
 * will keep.
 *
 * Always over-fetches, for two reasons. `reel_search_match` can filter by date
 * but knows nothing about followers or production effort, so those are applied
 * here, after the fact. And the nearest neighbours to a query are frequently
 * the same creator over and over, which the diversity cap below then thins out.
 */
const SEARCH_OVERFETCH = 6;
const SEARCH_MAX_ROWS = 60;
/**
 * Most reels one account may contribute to one result set.
 *
 * Without this the search is dominated by whoever posts most about the subject:
 * "using AI tools to get work done faster" returned six reels, four of them the
 * same creator, which is one creator's habits presented as evidence about a
 * niche. Two is enough to show a creator has a repeatable format and few enough
 * that five ideas cannot all come from one person.
 */
const DEFAULT_PER_ACCOUNT = 2;
/** Analysis points are the most useful part of a row and the longest. Cap them. */
const MAX_POINTS = 5;
const MAX_TAGS = 8;

export const TOOL_NAMES = [
  "library_overview",
  "search_reels",
  "top_reels",
] as const;
export type ToolName = (typeof TOOL_NAMES)[number];

export type ToolOutcome = {
  forModel: unknown;
  /** Rows surfaced by this call, in the order the model sees them. */
  reels: ReelRow[];
};

// ------------------------------------------------------------------ schemas

const WINDOW_ENUM = [7, 30, 60, 90, 365] as const;

const followerProps = {
  min_followers: {
    type: "integer",
    description:
      "Only reels from accounts with at least this many followers. Omit for no lower bound.",
  },
  max_followers: {
    type: "integer",
    description:
      "Only reels from accounts with at most this many followers. Use this to find creators the size of the person you are advising, whose results are reachable.",
  },
} as const;

const effortProp = {
  max_effort: {
    type: "string",
    enum: ["easy", "medium", "hard"],
    description:
      "The most production work you are willing to look at. 'easy' is one person, a phone and one sitting. 'medium' is a real edit, a small setup, or an AI generation tool. 'hard' needs effects, a crew or a build.",
  },
} as const;

const sinceProp = {
  since_days: {
    type: "integer",
    enum: [...WINDOW_ENUM],
    description:
      "Only reels posted in the last N days. Omit for all time. Short windows show what is working right now; all time shows what has always worked.",
  },
} as const;

export const REEL_TOOLS: Anthropic.Tool[] = [
  {
    name: "library_overview",
    description:
      "What is actually in the reel library: how many reels, which creator accounts and how big they are, the most common tags, and the date range. Call this FIRST, before any search, so you know which niches the library really covers and which it does not. Takes no arguments.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "search_reels",
    description:
      "Find reels by meaning. Describe the kind of reel you are looking for in plain words: a topic ('gym form mistakes'), a format ('one person reacting to a screen recording'), an emotion ('makes you feel behind'), or a hook shape ('starts with a number nobody believes'). Format and emotion queries reach across niches and are usually the more useful search; a bare topic only works when the library covers that topic.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "What you are looking for, in plain words. Under 200 characters.",
        },
        ...sinceProp,
        ...followerProps,
        ...effortProp,
        limit: {
          type: "integer",
          description: `How many reels to return, 1 to ${MAX_RESULTS}. Default 8.`,
        },
        max_per_account: {
          type: "integer",
          description: `Most reels one creator may contribute, so the results are evidence about a niche and not about one person's habits. Default ${DEFAULT_PER_ACCOUNT}. Raise it only when you deliberately want to study a single creator's format.`,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "top_reels",
    description:
      "The highest-scoring reels in the library, filtered. Score is how far a reel beat its own creator's audience, so a small account's runaway hit outranks a huge account's ordinary one. Use this to find proven FORMATS to borrow, especially from niches unrelated to the user's. Pass tags (taken from library_overview) to stay inside a subject.",
    input_schema: {
      type: "object",
      properties: {
        ...sinceProp,
        ...followerProps,
        ...effortProp,
        tags: {
          type: "array",
          items: { type: "string" },
          description:
            "Keep only reels carrying at least one of these tags. Use the exact strings from library_overview's top_tags; invented tags match nothing.",
        },
        limit: {
          type: "integer",
          description: `How many reels to return, 1 to ${MAX_RESULTS}. Default 8.`,
        },
        max_per_account: {
          type: "integer",
          description: `Most reels one creator may contribute. Default ${DEFAULT_PER_ACCOUNT}.`,
        },
      },
    },
  },
];

// ------------------------------------------------------------- serialization

function trim<T>(list: T[] | null | undefined, n: number): T[] | undefined {
  if (!list || !list.length) return undefined;
  return list.slice(0, n);
}

/** One reel as the model reads it. Nulls are dropped rather than sent as null,
 *  which is a real saving across ten rows and reads better in the transcript. */
function forModel(reel: ReelRow, similarity?: number) {
  const effort = estimateEffort(reel);
  const out: Record<string, unknown> = {
    // The model cites reels by this, and the client turns the citation into a
    // card, so it has to come first and it has to be exact.
    shortcode: reel.shortcode,
    account: reel.account,
    followers: reel.followers ?? undefined,
    posted_on: reel.posted_on ?? undefined,
    outlier_score: reel.score ?? undefined,
    views: reel.views ?? undefined,
    likes: reel.likes ?? undefined,
    duration_sec: reel.duration_sec ?? undefined,
    shots: reel.shots ?? undefined,
    effort: effort.level,
    effort_reason: effort.reason,
    idea: reel.idea ?? undefined,
    hook: reel.hook_summary ?? undefined,
    why_they_stayed: reel.retain_summary ?? undefined,
    what_they_got: reel.reward_summary ?? undefined,
    hook_details: trim(reel.hook_points, MAX_POINTS),
    retain_details: trim(reel.retain_points, MAX_POINTS),
    tags: trim(reel.tags, MAX_TAGS),
  };
  if (similarity !== undefined) out.similarity = Number(similarity.toFixed(3));
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
  return out;
}

// ------------------------------------------------------------------ filtering

function clampLimit(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return 8;
  return Math.min(MAX_RESULTS, Math.max(1, Math.floor(n)));
}

function clampFollowers(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

/** Follower bounds are stops on the browse slider, so a free-form number has to
 *  be widened to one. Widened, never narrowed: asking for "up to 500,000" must
 *  not silently drop a 500,001-follower account the user would have wanted. */
function toStopIndex(value: number | null, side: "min" | "max"): number {
  if (value === null) return side === "min" ? 0 : FOLLOWER_MAX_INDEX;
  if (side === "min") {
    let i = 0;
    while (i + 1 <= FOLLOWER_MAX_INDEX && FOLLOWER_STOPS[i + 1] <= value) i += 1;
    return i;
  }
  let i = FOLLOWER_MAX_INDEX;
  while (i - 1 >= 0 && FOLLOWER_STOPS[i - 1] >= value) i -= 1;
  return i;
}

type Bounds = { min: number | null; max: number | null; effort: number | null };

function readBounds(input: Record<string, unknown>): Bounds {
  const min = clampFollowers(input.min_followers);
  let max = clampFollowers(input.max_followers);
  // A crossed pair is the model's mistake, not the user's; widening the top is
  // the reading that still returns the accounts it was aiming at.
  if (min !== null && max !== null && max < min) max = null;
  return { min, max, effort: normalizeMaxEffort(input.max_effort) };
}

/**
 * Thin a ranked list so no account appears more than `cap` times, keeping the
 * best-ranked of each. Order is preserved, so the top result is still the top
 * result; only the fourth reel by the same creator moves out of the way.
 */
function diversify<T extends ReelRow>(rows: T[], cap: number): T[] {
  const seen = new Map<string, number>();
  const kept: T[] = [];
  for (const row of rows) {
    const n = seen.get(row.account) ?? 0;
    if (n >= cap) continue;
    seen.set(row.account, n + 1);
    kept.push(row);
  }
  return kept;
}

/** Read an untrusted `max_per_account`, or fall back to the default. */
function perAccount(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_PER_ACCOUNT;
  return Math.min(MAX_RESULTS, Math.floor(n));
}

function applyBounds<T extends ReelRow>(rows: T[], b: Bounds): T[] {
  return rows.filter((r) => {
    if (b.min !== null && (r.followers ?? 0) < b.min) return false;
    if (b.max !== null && (r.followers ?? Number.POSITIVE_INFINITY) > b.max) {
      return false;
    }
    if (b.effort !== null && estimateEffort(r).rank > b.effort) return false;
    return true;
  });
}

/** The names of whichever filters could have thinned a result set. */
function activeFilters(b: Bounds, cap: number): string[] {
  const names: string[] = [];
  if (b.min !== null || b.max !== null) names.push("the follower range");
  if (b.effort !== null) names.push("the effort limit");
  if (cap < MAX_RESULTS) names.push(`the ${cap}-per-creator cap`);
  return names;
}

/**
 * What to tell the model when it got back fewer reels than it asked for.
 *
 * Silence here is the dangerous case: a tool that quietly returns three reels
 * for a request for six reads as "the library only has three", and the model
 * will write that down as a fact. Saying which filter did the cutting is what
 * lets it widen and try again.
 */
function shortfallNote(
  kept: number,
  asked: number,
  scanned: number,
  b: Bounds,
  cap: number,
): string | undefined {
  if (kept >= asked) return undefined;
  const names = activeFilters(b, cap);
  if (!names.length) {
    return kept === 0
      ? undefined
      : `Only ${kept} reels matched. That is everything the library has for this.`;
  }
  const filters = names.join(", ");
  if (kept === 0) {
    return `${scanned} reels matched before filtering and none survived ${filters}. Try again with a wider range, or without it.`;
  }
  return `Only ${kept} of the ${asked} you asked for survived ${filters}. Widen it if you need more, or use what is here.`;
}

// ------------------------------------------------------------------ dispatch

export async function runReelTool(
  name: string,
  rawInput: unknown,
  signal?: AbortSignal,
): Promise<ToolOutcome> {
  const input =
    rawInput && typeof rawInput === "object"
      ? (rawInput as Record<string, unknown>)
      : {};

  if (name === "library_overview") {
    const o = await getLibraryOverview();
    return {
      reels: [],
      forModel: {
        total_reels: o.total_reels,
        creator_accounts: o.accounts.length,
        posted_between: [o.oldest_post, o.newest_post],
        note: "Every reel here beat its own creator's audience by at least 5x. The library is a sample of what works, not a census of Instagram: a niche missing from this list is missing from the library, not from Instagram.",
        accounts: o.accounts.map((a) => ({
          account: a.account,
          followers: a.followers ?? undefined,
          reels: a.reels,
        })),
        top_tags: o.top_tags,
      },
    };
  }

  if (name === "search_reels") {
    const query = normalizeQuery(String(input.query ?? ""));
    if (!query) {
      return { reels: [], forModel: { error: "query was empty" } };
    }
    const limit = clampLimit(input.limit);
    const days: WindowDays = normalizeDays(input.since_days);
    const bounds = readBounds(input);
    const cap = perAccount(input.max_per_account);

    const hits = await searchReels(
      query,
      days,
      Math.min(SEARCH_MAX_ROWS, limit * SEARCH_OVERFETCH),
      signal,
    );
    const inBounds = applyBounds(hits, bounds);
    const kept = diversify(inBounds, cap).slice(0, limit);
    const note =
      hits.length === 0
        ? "Nothing in the library is close to this. Say so rather than inventing a reel, then try a query about the FORMAT or the FEELING instead of the topic."
        : shortfallNote(kept.length, limit, hits.length, bounds, cap);

    return {
      reels: kept,
      forModel: {
        query,
        matched: kept.length,
        note,
        reels: kept.map((r) => forModel(r, r.similarity)),
      },
    };
  }

  if (name === "top_reels") {
    const limit = clampLimit(input.limit);
    const bounds = readBounds(input);
    const tags = Array.isArray(input.tags)
      ? input.tags.filter((t): t is string => typeof t === "string")
      : undefined;

    const cap = perAccount(input.max_per_account);
    // Neither effort nor the diversity cap is something SQL can express, so the
    // query has to bring back more rows than the caller asked to keep. The
    // effort filter is the expensive one: "easy only" throws away most of the
    // top of the ranking, because the reels that beat their audience hardest
    // tend to be the ones somebody worked on.
    const want = Math.min(
      100,
      bounds.effort !== null ? limit * 8 : Math.max(limit, limit * 3),
    );
    const { rows, total } = await browseReels(
      {
        days: normalizeDays(input.since_days),
        minIndex: toStopIndex(bounds.min, "min"),
        maxIndex: toStopIndex(bounds.max, "max"),
        page: 1,
        limit: want,
        tags,
      },
      signal,
    );
    // The follower bounds went to SQL as slider stops, which are wider than
    // what was asked for, so the exact numbers are enforced again here.
    const kept = diversify(applyBounds(rows, bounds), cap).slice(0, limit);
    const note =
      rows.length === 0
        ? "No reel in the library matches those filters. If you passed tags, take the exact strings from library_overview, or drop them and filter by follower size instead."
        : shortfallNote(kept.length, limit, rows.length, bounds, cap);

    return {
      reels: kept,
      forModel: {
        matched: kept.length,
        // Named for what it actually counts. The effort limit and the
        // per-creator cap are applied in TypeScript, after this number comes
        // back from SQL, so it is always at least `matched` and often much more.
        total_before_effort_and_diversity: total,
        note,
        reels: kept.map((r) => forModel(r)),
      },
    };
  }

  return { reels: [], forModel: { error: `unknown tool: ${name}` } };
}
