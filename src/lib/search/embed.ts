// Turning a visitor's words into a vector. One implementation, both searches.
//
// src/lib/reels/search.ts and src/lib/creators/search.ts each carried their own
// copy of this, character for character, which is fine right up to the moment
// one of them needs fixing -- and on 2026-08-27 both did. The model and the
// dimension count MUST match what the corpus was embedded with (search/sync.py
// and search/creator_facets.py in the reels-database repo), so having the
// constants written twice was a way for half the site to drift silently. The
// same argument as src/lib/filters/range.ts: one implementation, handed what
// differs.
//
// SINCE 2026-08-27 THE PAID CALL IS THE LAST RESORT, not the first move.
// Measured that day, this hop is 270-1,900 ms and it is the slowest single
// thing in a search. It is also the only thing in a search that can be cached
// forever, because an embedding of a given string under a given model at a
// given width never changes. src/lib/search/embed-cache.ts holds that argument
// and the race; this file supplies the two upstreams it races.
//
// A build error, not a runtime one, if this is ever pulled into a client
// bundle. It reads a secret at call time.
import "server-only";
import {
  cacheKey,
  resolveEmbedding,
  VectorMemo,
  type EmbeddingSource,
} from "./embed-cache";

/**
 * Must match search/sync.py and search/creator_facets.py in the reels-database
 * repo. Changing either value invalidates every stored vector, so the corpora
 * have to be re-embedded in the same commit.
 */
export const EMBED_MODEL = "text-embedding-3-large";
export const EMBED_DIMS = 3072;

/**
 * How long the FIRST attempt gets before it is abandoned and tried again.
 *
 * Measured on 2026-08-27 over 40 queries: this call normally answers in 280 to
 * 430 ms, and it spiked to 2,494 ms once. So 4 seconds is roughly ten times the
 * usual and well past the worst honest one -- a call still running at 4 seconds
 * is not slow, it is stuck, and starting a second one costs a tenth of a cent
 * and usually answers before the first would have.
 */
const FIRST_ATTEMPT_MS = 4_000;

/** A status worth trying again: rate limiting and the provider's own faults. */
function worthRetrying(status: number): boolean {
  return status === 429 || status >= 500;
}

async function attempt(
  query: string,
  outer: AbortSignal,
  budgetMs: number,
): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY ?? "";
  // This attempt's own deadline, folded together with the caller's. Its own,
  // because abandoning attempt one must not abandon the search; the caller's,
  // because a visitor who typed again is owed nothing.
  const control = new AbortController();
  const relay = () => control.abort();
  outer.addEventListener("abort", relay, { once: true });
  const timer =
    budgetMs === Infinity ? undefined : setTimeout(() => control.abort(), budgetMs);
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: EMBED_MODEL, input: query, dimensions: EMBED_DIMS }),
      signal: control.signal,
    });
    if (!res.ok) {
      const err = new Error(`embedding failed: ${res.status}`);
      // Carried on the error rather than read from a closed-over variable, so
      // the retry decision is made from the thing that actually failed.
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    const json = (await res.json()) as { data?: { embedding: number[] }[] };
    const vector = json.data?.[0]?.embedding;
    if (!vector) throw new Error("embedding failed: no vector");
    return vector;
  } finally {
    clearTimeout(timer);
    outer.removeEventListener("abort", relay);
  }
}

/**
 * The query as a vector, with one retry.
 *
 * The retry is here and not on the database hop because this is the only part
 * of a search that belongs to somebody else. The Supabase call is one indexed
 * read against a function that answers in well under a second (search/
 * creator_probe.sql, search/reel_probe.sql); when it fails it is because the
 * query was genuinely too slow, and asking again would fail the same way,
 * slower. This one fails because a third party had a bad second.
 *
 * A 4xx is not retried -- a wrong key or a malformed body will be just as wrong
 * the second time -- and neither is an abort from the caller, which means the
 * visitor typed again and nobody is waiting for this answer.
 */
async function embedFresh(query: string, signal: AbortSignal): Promise<number[]> {
  try {
    return await attempt(query, signal, FIRST_ATTEMPT_MS);
  } catch (err) {
    if (signal.aborted) throw err;
    const status = (err as { status?: number }).status;
    if (status !== undefined && !worthRetrying(status)) throw err;
    // Whatever is left of the caller's budget. The caller owns the total; this
    // function only owns how that total is divided between two tries.
    return attempt(query, signal, Infinity);
  }
}

// ------------------------------------------------------------- the two caches

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function supabaseHeaders(): HeadersInit {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * Survives a cold instance, which the memo does not. Created by
 * search/query_embedding.sql in the reels-database repo.
 *
 * A LOOKUP THAT FAILS MUST READ AS A MISS, never as a failure. This whole file
 * is an optimisation, and the only acceptable failure mode for an optimisation
 * is that a search costs what it cost before there was one.
 */
async function lookupStored(key: string, signal: AbortSignal): Promise<number[] | null> {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;
  const params = new URLSearchParams({
    select: "embedding",
    key: `eq.${key}`,
    limit: "1",
  });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/query_embedding?${params}`, {
    headers: supabaseHeaders(),
    signal,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as { embedding?: string | number[] }[];
  const stored = rows?.[0]?.embedding;
  if (!stored) return null;
  // pgvector comes back over PostgREST as its own text form, "[0.1,0.2,...]",
  // which is also valid JSON. Parsed rather than trusted: a row written by a
  // different model, or half-written, must read as a miss.
  const vector = typeof stored === "string" ? (JSON.parse(stored) as unknown) : stored;
  if (!Array.isArray(vector) || vector.length !== EMBED_DIMS) return null;
  return vector as number[];
}

/** Fire and forget. A cache that cannot be written is still a cache. */
async function storeVector(key: string, query: string, vector: number[]): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/rpc/remember_query_embedding`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({
      k: key,
      q: query,
      m: EMBED_MODEL,
      d: EMBED_DIMS,
      v: vector,
    }),
  });
}

/**
 * Bounded and never expired: see the argument in embed-cache.ts. 200 vectors is
 * roughly 5 MB, which a serverless instance has hundreds of.
 */
const memo = new VectorMemo(200);

/**
 * The query as a vector, from the cheapest place that has it.
 *
 * `source` is returned rather than logged because it goes onto the response as
 * a Server-Timing metric: "was that search slow because it was a new query, or
 * is something else wrong" is the first question anyone asks, and it should be
 * answerable off a response header rather than by reasoning.
 */
export async function embedQuery(
  query: string,
  signal: AbortSignal,
): Promise<{ vector: number[]; source: EmbeddingSource }> {
  const key = cacheKey(query, EMBED_MODEL, EMBED_DIMS);
  return resolveEmbedding({
    key,
    memo,
    lookup: (k) => lookupStored(k, signal),
    // The key is what the cache is keyed on; the WORDS are what OpenAI is sent.
    embed: (_k, paidSignal) => embedFresh(query, paidSignal),
    store: (vector) => storeVector(key, query, vector),
  });
}
