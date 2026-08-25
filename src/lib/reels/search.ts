// Semantic search over the viral Instagram reels database.
//
// The corpus lives in Supabase (`reel_search`), one row per reel that has been
// watched end to end and written up as the five fields. It is built and kept
// fresh by `search/sync.py` in the reels-database repo, never by this site.
//
// A search is two hops: embed the visitor's words with the same model the rows
// were embedded with, then let pgvector rank the corpus by cosine distance in
// the `reel_search_match` function. Both hops are small, so a cold search lands in
// well under a second and a repeated one is served from memory.
//
// If the env vars are missing the module degrades instead of throwing: the page
// still renders and the search reports `configured: false`. That is what lets
// the Playwright suite run in an environment with no secrets.

// A build error, not a runtime one, if this module is ever pulled into a client
// bundle. It reads three secrets at import time, and `src/lib/ideas/db.ts` is
// the proof this can happen by accident: its module-level env expression is
// visible in the shipped /ideas client chunk.
import "server-only";
import { rangesKey } from "@/lib/filters/range";
import {
  NO_REEL_FILTERS,
  reelRangeArgs,
  REEL_FILTERS,
  type ReelFilters,
} from "./filters";
import { MIN_SIMILARITY, RESULT_COUNT, type ReelHit } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";

// Must match search/sync.py. Changing either value invalidates every stored
// vector, so the corpus has to be re-embedded in the same commit.
const EMBED_MODEL = "text-embedding-3-large";
const EMBED_DIMS = 3072;
// Prefixed like the table, so it cannot collide with another feature's
// match_* function in this shared Supabase project. It superseded
// reel_search_match on 2026-08-25: same vector scan, but it takes a min and an
// exclusive max per filter instead of a single recency window, and it returns
// the three 1-10 score columns.
const MATCH_FN = "reel_library_match";

/**
 * Bumped whenever reel_library_match changes, so the whole cache is bypassed on
 * the next deploy rather than aged out. It is a manual step because the ranking
 * lives in another repo's SQL; the short TTL below is the backstop for the times
 * it is forgotten.
 */
const RANK_VERSION = "v2";

export const reelSearchConfigured = Boolean(SUPABASE_URL && SERVICE_KEY && OPENAI_KEY);

// ---------------------------------------------------------------- query cache
//
// The example chips and the obvious searches ("hook", "transformation") repeat
// constantly, and every repeat would otherwise pay for an embedding. A warm
// instance answers those from memory in a few milliseconds.

const CACHE_TTL_MS = 15 * 60 * 1000;
const CACHE_MAX = 200;
const cache = new Map<string, { at: number; hits: ReelHit[] }>();

function cacheGet(key: string): ReelHit[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  // Re-insert so the map stays in least-recently-used order.
  cache.delete(key);
  cache.set(key, entry);
  return entry.hits;
}

function cacheSet(key: string, hits: ReelHit[]) {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), hits });
}

// --------------------------------------------------------------------- search

async function embedQuery(query: string, signal: AbortSignal): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: query, dimensions: EMBED_DIMS }),
    signal,
  });
  if (!res.ok) throw new Error(`embedding failed: ${res.status}`);
  const json = (await res.json()) as { data?: { embedding: number[] }[] };
  const vector = json.data?.[0]?.embedding;
  if (!vector) throw new Error("embedding failed: no vector");
  return vector;
}

async function matchReels(
  embedding: number[],
  count: number,
  ranges: ReelFilters,
  signal: AbortSignal,
): Promise<ReelHit[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${MATCH_FN}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    // Every filter is applied in SQL, before the limit, so a filtered search
    // still returns a full page of reels rather than whatever survives
    // filtering an unfiltered top ten. One date for the whole call, so the two
    // posted_on bounds cannot straddle a midnight.
    body: JSON.stringify({
      query_embedding: embedding,
      match_count: count,
      ...reelRangeArgs(ranges, new Date()),
    }),
    signal,
  });
  if (!res.ok) throw new Error(`${MATCH_FN} failed: ${res.status}`);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error(`${MATCH_FN} returned ${typeof rows}`);
  return rows as ReelHit[];
}

/**
 * The top `count` reels for a query, most similar first.
 *
 * Throws on a failed upstream call so the route can answer 502 rather than an
 * empty result set, which would read to the visitor as "nothing matched".
 */
export async function searchReels(
  query: string,
  ranges: ReelFilters = NO_REEL_FILTERS,
  count: number = RESULT_COUNT,
  callerSignal?: AbortSignal,
): Promise<ReelHit[]> {
  // Every filter is part of the key. The same words under different filters are
  // a different answer, and serving one for the other is the classic cache bug:
  // it would look exactly like a filter that does nothing.
  const key = [
    RANK_VERSION,
    count,
    rangesKey(REEL_FILTERS, ranges),
    query.toLowerCase(),
  ].join(":");
  const cached = cacheGet(key);
  if (cached) return cached;

  // One budget for both hops. A hung upstream must not hold the function open
  // for the platform maximum.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  // The visitor typed again and the browser dropped the request; there is no
  // point finishing the embedding they will never see.
  callerSignal?.addEventListener("abort", () => controller.abort(), { once: true });
  try {
    const embedding = await embedQuery(query, controller.signal);
    const ranked = await matchReels(embedding, count, ranges, controller.signal);
    // pgvector orders by distance and stops at the limit; it never judges
    // whether the nearest reel is near at all. Dropping the far ones here is
    // what lets the page say "nothing is close" instead of filling ten slots
    // with the least-far reels in the window.
    const hits = ranked.filter((r) => r.similarity >= MIN_SIMILARITY);
    cacheSet(key, hits);
    return hits;
  } finally {
    clearTimeout(timer);
  }
}
