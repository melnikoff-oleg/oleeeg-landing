// Start the search while the visitor is still reaching for Enter.
//
// The measured budget for a search nobody has run before, after everything else
// in plans/search-speed.md: about 300-700 ms to turn the words into a vector,
// then 130-250 ms to rank the library against it. The first of those two is
// somebody else's server and cannot be made faster from here. It can be spent
// EARLIER, though, and this is the only part of the latency budget that can be
// spent before the visitor has asked for anything.
//
// A visitor types a phrase in a second or two, stops, and then moves to Enter.
// That stop is the signal: it is what "they have typed a whole thought" looks
// like from here. A request sent at the stop is usually finished before the
// keypress lands, and the answer cache turns Enter into a memory read.
//
// The rule that makes this safe is that a prefetch NEVER touches the screen.
// It writes to the answer cache and nothing else. So a wrong guess costs one
// request that nobody sees, and a right guess costs nothing at all -- there is
// no state to roll back, no flash of an answer to a query that was still being
// typed, and no way for a late prefetch to overwrite a real search.

/** Short enough to be a real pause, long enough not to fire inside a word. */
export const PREFETCH_DELAY_MS = 400;

/**
 * Below this a query is not a question yet. Two characters describe a third of
 * the library; sending them buys a useless answer and spends a request out of
 * the daily allowance that a real search may need later.
 */
export const PREFETCH_MIN_CHARS = 4;

/** Exactly what a search would send, so a prefetch and a search share a key. */
export function normalize(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export type PrefetchCheck = {
  /** What is in the box right now. */
  query: string;
  /** The query whose answer is already on screen. */
  applied: string;
  /** Whether an answer for this query is already held. */
  known: (query: string) => boolean;
};

/** Whether the words in the box are worth fetching before they are asked for. */
export function shouldPrefetch({ query, applied, known }: PrefetchCheck): boolean {
  const words = normalize(query);
  if (words.length < PREFETCH_MIN_CHARS) return false;
  // Already the answer on screen. Fetching it again would be a request whose
  // best possible outcome is that nothing changes.
  if (words === normalize(applied)) return false;
  return !known(words);
}
