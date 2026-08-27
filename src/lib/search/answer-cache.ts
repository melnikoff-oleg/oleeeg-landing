// The answers this browser has already been given.
//
// The instant-feel half of the search work. However fast the server gets, a
// query the visitor has already run this session should cost nothing at all:
// clicking a chip, pressing Back, retyping a word they just cleared. This is
// the same idea as the server's own result cache in src/lib/creators/search.ts,
// moved one hop closer to the eye, and it is bounded by the same reasoning.
//
// It expires, and the embedding cache beside it does not. That difference is
// the point. A vector is immutable; a RANKING is not -- it lives in SQL and a
// migration changes it with no deploy of this app, so an answer held for an
// hour would be a lie with nothing on screen admitting it. Ninety seconds
// absorbs the repeats this exists for and bounds the lie at a minute and a half.

export const ANSWER_TTL_MS = 90_000;

/**
 * The identity of a question: the words, and every filter that was on when it
 * was asked.
 *
 * Filters are sorted by name because their object order is an accident of how
 * they were built, and two callers asking the same question must not miss each
 * other's answer over it. The same words under DIFFERENT filters are a
 * different question, and serving one for the other is the classic cache bug:
 * it looks exactly like a filter that does nothing.
 */
export function answerKey(query: string, filters: Record<string, readonly number[]>): string {
  const parts = Object.keys(filters)
    .sort()
    .map((name) => `${name}=${filters[name].join("-")}`);
  return [query.trim().toLowerCase().replace(/\s+/g, " "), ...parts].join("|");
}

export class AnswerCache<T> {
  #max: number;
  #ttl: number;
  #now: () => number;
  #map = new Map<string, { at: number; value: T }>();

  constructor(max = 30, ttl = ANSWER_TTL_MS, now: () => number = Date.now) {
    this.#max = Math.max(1, max);
    this.#ttl = ttl;
    this.#now = now;
  }

  get(key: string): T | null {
    const entry = this.#map.get(key);
    if (!entry) return null;
    if (this.#now() - entry.at > this.#ttl) {
      this.#map.delete(key);
      return null;
    }
    // Re-insert so the map stays in least-recently-used order.
    this.#map.delete(key);
    this.#map.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T): void {
    this.#map.delete(key);
    this.#map.set(key, { at: this.#now(), value });
    while (this.#map.size > this.#max) {
      const oldest = this.#map.keys().next().value;
      if (oldest === undefined) break;
      this.#map.delete(oldest);
    }
  }
}
