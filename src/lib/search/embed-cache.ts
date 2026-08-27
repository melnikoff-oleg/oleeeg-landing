// Never pay for the same embedding twice.
//
// A search is two hops: turn the visitor's words into a vector, then rank the
// corpus against it. Measured on 2026-08-27 the first hop is 270 to 1,900 ms
// and it is the only part of a search that belongs to somebody else's server.
//
// It is also the one part that can be cached without limit. src/lib/creators/
// search.ts caches finished RESULTS for ninety seconds and the comment there
// explains why it must be that short: the ranking lives in SQL, a migration can
// change it with no deploy, and a cache whose key cannot express what produced
// its contents must not outlive it. None of that applies here. An embedding of
// a given string, under a given model, at a given width, is the same number
// today and next year. So it is cached in two places and expired in neither:
// a bounded map inside the running instance, and a table in Postgres that
// survives the instance.
//
// The two upstreams are RACED rather than tried in order. Asking Postgres first
// and OpenAI second makes a miss cost the sum; asking both at once makes it cost
// the slower, and a hit still stops us paying for the call.
import "server-only";
import { createHash } from "node:crypto";

/**
 * The identity of an embedding: the model, its width, and the words, with the
 * whitespace and case that no embedding model distinguishes taken out first.
 *
 * SHA-256 rather than the cheap FNV hash used for shuffling elsewhere, because
 * this key is a primary key in a shared table: a collision would hand one query
 * another query's vector, and the search would be quietly, unreproducibly wrong
 * rather than broken.
 */
export function cacheKey(query: string, model: string, dims: number): string {
  const words = query.trim().toLowerCase().replace(/\s+/g, " ");
  return createHash("sha256").update(`${model}|${dims}|${words}`).digest("hex");
}

/**
 * A bounded, never-expiring map of key to vector, in the running instance.
 *
 * No TTL, on purpose: see the header. The bound is on COUNT rather than bytes
 * because every entry is the same size -- 3,072 doubles, about 25 KB, so 200 of
 * them is roughly 5 MB and a serverless instance has hundreds.
 */
export class VectorMemo {
  #max: number;
  #map = new Map<string, number[]>();

  constructor(max = 200) {
    this.#max = Math.max(1, max);
  }

  get(key: string): number[] | null {
    const hit = this.#map.get(key);
    if (!hit) return null;
    // Re-insert, so the map stays in least-recently-used order and `set` can
    // evict from the front.
    this.#map.delete(key);
    this.#map.set(key, hit);
    return hit;
  }

  set(key: string, vector: number[]): void {
    this.#map.delete(key);
    this.#map.set(key, vector);
    while (this.#map.size > this.#max) {
      const oldest = this.#map.keys().next().value;
      if (oldest === undefined) break;
      this.#map.delete(oldest);
    }
  }
}

export type EmbeddingSource = "memory" | "db" | "openai";

export type ResolveArgs = {
  key: string;
  memo: VectorMemo;
  /** The stored vector for this key, or null. Never throws the search. */
  lookup: (key: string) => Promise<number[] | null>;
  /** The paid call. Its signal is aborted the moment the cache wins. */
  embed: (key: string, signal: AbortSignal) => Promise<number[]>;
  /** Write-back. Fire and forget; a failure here is not a failed search. */
  store: (vector: number[]) => Promise<void>;
};

/**
 * The vector for a query, from the cheapest place that has it.
 *
 * Only a failure of `embed` fails: a cache that is down, slow or wrong makes a
 * search cost what it cost before there was a cache, which is the only
 * acceptable failure mode for an optimisation.
 */
export async function resolveEmbedding(
  args: ResolveArgs,
): Promise<{ vector: number[]; source: EmbeddingSource }> {
  const { key, memo, lookup, embed, store } = args;

  const remembered = memo.get(key);
  if (remembered) return { vector: remembered, source: "memory" };

  // The paid call starts NOW, beside the lookup rather than behind it. If the
  // lookup wins, this is aborted before it is billed.
  const paidControl = new AbortController();
  const paid = embed(key, paidControl.signal);
  // Claimed immediately: an unhandled rejection here would take the process
  // down on the path where the lookup wins and nobody ever awaits this.
  const paidSettled = paid.then(
    (vector) => ({ ok: true as const, vector }),
    (error: unknown) => ({ ok: false as const, error }),
  );

  const cached = await Promise.race([
    lookup(key).catch(() => null),
    // The lookup only gets to win by being FASTER. Once the paid call has
    // answered there is nothing left to save, so we stop waiting on the cache
    // rather than let a slow one hold a finished search open.
    paidSettled.then(() => null),
  ]);

  if (cached && cached.length) {
    paidControl.abort();
    memo.set(key, cached);
    return { vector: cached, source: "db" };
  }

  const settled = await paidSettled;
  if (!settled.ok) throw settled.error;
  memo.set(key, settled.vector);
  // Not awaited: the visitor is owed an answer, not a write.
  void store(settled.vector).catch(() => {});
  return { vector: settled.vector, source: "openai" };
}
