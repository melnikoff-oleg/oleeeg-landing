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
// were embedded with, then let `creator_search_match` rank the corpus. That
// function is no longer one cosine against one vector per creator. It blends
// the creator's profile vector with the best match among their FACETS -- one
// short vector per reel, per topic cluster, and per unread reel's caption --
// and a lexical channel over their own words. The rebuild is documented in
// search/creator_facets.sql in the reels-database repo.
//
// If the env vars are missing the module degrades instead of throwing: the page
// still renders and reports `configured: false`. That is what lets the
// Playwright suite run in an environment with no secrets.

// A build error, not a runtime one, if this module is ever pulled into a client
// bundle. It reads three secrets at import time.
import "server-only";
import { boundsOf } from "@/lib/filters/range";
import {
  CREATOR_MIN_SIMILARITY,
  CREATOR_RESULT_COUNT,
  FILTER_KEYS,
  NO_FILTERS,
  SCALES,
  type CreatorFilters,
  type CreatorHit,
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
// The ranking creator_search_match implements, as of the migration named.
// search/creator_handle.sql, 2026-08-27: sim^2.5 x craft x form, and an exact
// handle floors similarity at 0.95 so naming a creator returns that creator.
const RANK_VERSION = "2026-08-27-handle";

export const creatorSearchConfigured = Boolean(
  SUPABASE_URL && SERVICE_KEY && OPENAI_KEY,
);

// ---------------------------------------------------------------- query cache
//
// The example chips and the obvious searches repeat constantly, and every
// repeat would otherwise pay for an embedding. A warm instance answers those
// from memory in a few milliseconds.
//
// THE TTL IS 90 SECONDS AND NOT 15 MINUTES, and the reason is worth keeping.
// The ranking lives in SQL -- creator_search_match, which is changed by running
// a migration against Supabase and needs no deploy of this app. So a ranking
// change used to be invisible here for up to fifteen minutes on every warm
// instance, with nothing on screen saying so: on 2026-08-25 the database was
// serving a corrected order for "tech" while this cache kept handing back the
// old one, and it read exactly like the fix had never shipped.
//
// A cache whose key cannot express what produced its contents must not outlive
// the thing it is caching by much. 90 seconds still absorbs the repeat traffic
// the cache exists for (a chip clicked twice, a query retyped) and bounds the
// lie at a minute and a half.
const CACHE_TTL_MS = 90 * 1000;
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
  query: string,
  count: number,
  filters: CreatorFilters,
  signal: AbortSignal,
): Promise<CreatorHit[]> {
  // The RPC takes a min and an exclusive max per filter, named after the
  // column, so the five ranges expand into ten arguments the same way the
  // roster's expand into ten query params. Adding a filter is one entry in
  // FILTER_KEYS and one pair of parameters in the SQL; nothing here changes.
  //
  // null, not 0 or -1, for an end that is asking nothing: the function treats
  // null as "do not filter", and a creator judged after the last scoring pass
  // has null scores that any numeric bound would exclude.
  const bounds: Record<string, number | null> = {};
  for (const key of FILTER_KEYS) {
    const { min, below } = boundsOf(SCALES[key], filters[key]);
    bounds[`min_${key}`] = min;
    bounds[`below_${key}`] = below;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${MATCH_FN}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    // Every filter is applied in SQL, before the limit, so a filtered search
    // still returns a full page of creators rather than whatever survives
    // filtering an unfiltered top twelve.
    body: JSON.stringify({
      query_embedding: embedding,
      match_count: count,
      // The words as well as the vector. A two-character query like "AI" is one
      // token against documents of hundreds, and cosine distance has no notion
      // of a term being PRESENT, so the function scores a lexical channel over
      // the creator's own name, niche, tags and reel write-ups alongside the
      // vector one. Omitting it is safe: the parameter defaults to null and the
      // ranking simply loses that term.
      query_text: query,
      ...bounds,
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
  filters: CreatorFilters = NO_FILTERS,
  count: number = CREATOR_RESULT_COUNT,
  callerSignal?: AbortSignal,
): Promise<CreatorHit[]> {
  // Every filter is part of the key. The same words under different filters are
  // a different answer, and serving one for the other is the classic cache bug:
  // it would look exactly like a filter that does nothing.
  const key = [
    // Bump RANK_VERSION whenever creator_search_match changes, and the whole
    // cache is bypassed on the next deploy rather than aged out. It is a
    // manual step because the ranking lives in another repo's SQL; the short
    // TTL above is the backstop for the times it is forgotten, which is what
    // actually happened the first time.
    RANK_VERSION,
    count,
    ...FILTER_KEYS.map((k) => filters[k].join("-")),
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
    const ranked = await matchCreators(embedding, query, count, filters, controller.signal);
    // pgvector orders by distance and stops at the limit; it never judges
    // whether the nearest creator is near at all. Dropping the far ones here is
    // what lets the page say "nobody is close" instead of filling twelve slots
    // with the least-far creators in the index.
    //
    // On `similarity` and NEVER on `rank_score`. Since 2026-08-25 the database
    // ORDERS by relevance multiplied by Oleg's 1-10 study score, and that
    // product runs up to 40% below the relevance it came from. Filtering on it
    // would quietly raise this floor and start reporting "nobody matched" for
    // queries the library answers. The rows already arrive in rank order, so
    // this filter only removes; it never reorders.
    const hits = ranked.filter((c) => c.similarity >= CREATOR_MIN_SIMILARITY);
    cacheSet(key, hits);
    return hits;
  } finally {
    clearTimeout(timer);
  }
}
