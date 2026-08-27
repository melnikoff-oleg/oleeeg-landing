// Two callers, one question, one request.
//
// The prefetch (src/lib/search/prefetch.ts) starts a search when the visitor
// pauses typing. The visitor then presses Enter, usually a few hundred
// milliseconds later. Without this, that keypress starts a SECOND request for
// the identical question and waits on it, so the prefetch has bought nothing
// and cost one extra call -- the exact opposite of what it is for.
//
// This holds REQUESTS, not answers. Answers are the answer cache's job and it
// expires them for reasons written there; a promise kept past its request would
// be a second cache with no expiry, and the ranking behind it can change.

export class Pending<T> {
  #map = new Map<string, Promise<T>>();

  has(key: string): boolean {
    return this.#map.has(key);
  }

  /**
   * The in-flight request for `key`, or a new one.
   *
   * The entry is dropped as soon as the promise settles, either way. A rejected
   * promise kept in the map would hand the same failure to every later caller,
   * which turns one bad second into a permanently broken search box.
   */
  share(key: string, start: () => Promise<T>): Promise<T> {
    const existing = this.#map.get(key);
    if (existing) return existing;
    const promise = start().finally(() => {
      // Only if it is still ours: a slow request that was superseded must not
      // delete the entry belonging to the one that replaced it.
      if (this.#map.get(key) === promise) this.#map.delete(key);
    });
    this.#map.set(key, promise);
    return promise;
  }
}
