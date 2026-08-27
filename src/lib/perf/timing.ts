// A stopwatch whose readings leave the server on the response.
//
// This exists because of a rule the reels project learned the hard way and
// wrote into its own CLAUDE.md: speed work here has been wrong twice by
// reasoning instead of measuring. The two wrong guesses both looked obvious.
// So every search now answers with a Server-Timing header naming each hop and
// what it cost, which means the next person to ask "why is search slow" reads
// a number off a response instead of arguing from the source.
//
// Server-Timing is a standard header, it costs about sixty bytes, and Chrome's
// network panel draws it as a bar chart with no setup at all.

export type Span = { name: string; ms: number };

/**
 * Server-Timing names are tokens: no spaces, no commas, no semicolons. A name
 * carrying one of those does not produce an invalid header, it produces a
 * VALID header that parses as different metrics, which is worse -- the reading
 * would be wrong rather than absent. So a name is reduced to what a token may
 * hold rather than trusted.
 */
function token(name: string): string {
  return (
    name
      .replace(/[^A-Za-z0-9!#$%&'*+.^_`|~-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "span"
  );
}

export class Stopwatch {
  #spans: Span[] = [];

  /** Start a span. The returned function ends it. */
  start(name: string): () => void {
    const at = performance.now();
    let stopped = false;
    return () => {
      // Calling it twice must not record the span twice, or a `finally` that
      // runs after an early return quietly doubles a hop in the header.
      if (stopped) return;
      stopped = true;
      this.record(name, performance.now() - at);
    };
  }

  /**
   * Time a promise, hand back exactly what it resolved to.
   *
   * The span is recorded whether the promise resolves or rejects, because a
   * hop that failed after four seconds is precisely the reading worth having.
   */
  async time<T>(name: string, run: () => Promise<T>): Promise<T> {
    const done = this.start(name);
    try {
      return await run();
    } finally {
      done();
    }
  }

  record(name: string, ms: number): void {
    this.#spans.push({ name, ms });
  }

  spans(): readonly Span[] {
    return this.#spans;
  }

  /**
   * The header value, or "" when nothing was measured.
   *
   * A repeated name is suffixed rather than merged: two calls to the same
   * upstream are two facts, and adding them together hides a retry.
   */
  header(): string {
    const used = new Map<string, number>();
    return this.#spans
      .map(({ name, ms }) => {
        const base = token(name);
        const seen = (used.get(base) ?? 0) + 1;
        used.set(base, seen);
        const unique = seen === 1 ? base : `${base}-${seen}`;
        return `${unique};dur=${Math.round(ms * 10) / 10}`;
      })
      .join(", ");
  }
}
