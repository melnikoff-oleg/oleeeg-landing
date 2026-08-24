// Semantic search over the creators behind the viral reels database.
//
// The sibling of src/lib/reels/search.ts. That one ranks reels; this one ranks
// the people who made them, so a visitor can ask "who makes street interviews"
// and get accounts back rather than clips.
//
// The corpus lives in Supabase (`creator_search`), one row per creator with at
// least one reel the database has read end to end. It is built and kept fresh
// by `search/creators.py` in the reels-database repo, never by this site.
//
// A search is two hops: embed the visitor's words with the same model the rows
// were embedded with, then let pgvector rank the corpus by cosine distance in
// the `creator_search_match` function.
//
// If the env vars are missing the module degrades instead of throwing: the page
// still renders and reports `configured: false`. That is what lets the
// Playwright suite run in an environment with no secrets.

// A build error, not a runtime one, if this module is ever pulled into a client
// bundle. It reads three secrets at import time.
import "server-only";
import {
  CREATOR_MIN_SIMILARITY,
  CREATOR_RESULT_COUNT,
  type CreatorHit,
  type DepthReels,
} from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";

// Must match search/creators.py, and match src/lib/reels/search.ts, because all
// three corpora are embedded by the same model. Changing either value
// invalidates every stored vector, so the index has to be rebuilt in the same
// commit.
const EMBED_MODEL = "text-embedding-3-large";
const EMBED_DIMS = 3072;
// Prefixed like the table, so it cannot collide with another feature's match_*
// function in this shared Supabase project.
const MATCH_FN = "creator_search_match";

export const creatorSearchConfigured = Boolean(
  SUPABASE_URL && SERVICE_KEY && OPENAI_KEY,
);

// ---------------------------------------------------------------- query cache
//
// The example chips and the obvious searches repeat constantly, and every
// repeat would otherwise pay for an embedding. A warm instance answers those
// from memory in a few milliseconds.

const CACHE_TTL_MS = 15 * 60 * 1000;
const CACHE_MAX = 200;
const cache = new Map<string, { at: number; hits: CreatorHit[] }>();

function cacheGet(key: string): CreatorHit[] | null {
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

function cacheSet(key: string, hits: CreatorHit[]) {
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

async function matchCreators(
  embedding: number[],
  count: number,
  minReels: DepthReels,
  signal: AbortSignal,
): Promise<CreatorHit[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${MATCH_FN}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    // The depth filter is applied in SQL, before the limit, so a filtered
    // search still returns a full page of creators rather than whatever
    // survives filtering an unfiltered top twelve.
    body: JSON.stringify({
      query_embedding: embedding,
      match_count: count,
      min_reels: minReels,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`${MATCH_FN} failed: ${res.status}`);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error(`${MATCH_FN} returned ${typeof rows}`);
  return rows as CreatorHit[];
}

/**
 * The top `count` creators for a query, most similar first.
 *
 * Throws on a failed upstream call so the route can answer 502 rather than an
 * empty result set, which would read to the visitor as "nobody matched".
 */
export async function searchCreators(
  query: string,
  minReels: DepthReels = 1,
  count: number = CREATOR_RESULT_COUNT,
  callerSignal?: AbortSignal,
): Promise<CreatorHit[]> {
  // The depth is part of the key: the same words at a different depth are a
  // different answer, and serving one for the other is the classic cache bug.
  const key = `${count}:${minReels}:${query.toLowerCase()}`;
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
    const ranked = await matchCreators(embedding, count, minReels, controller.signal);
    // pgvector orders by distance and stops at the limit; it never judges
    // whether the nearest creator is near at all. Dropping the far ones here is
    // what lets the page say "nobody is close" instead of filling twelve slots
    // with the least-far creators in the index.
    const hits = ranked.filter((c) => c.similarity >= CREATOR_MIN_SIMILARITY);
    cacheSet(key, hits);
    return hits;
  } finally {
    clearTimeout(timer);
  }
}
