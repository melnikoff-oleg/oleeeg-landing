// What a search actually costs, end to end, against a running site.
//
//   node --experimental-strip-types scripts/search-bench.ts [origin]
//
// The origin defaults to production. Every search answers with a Server-Timing
// header naming its hops (src/lib/perf/timing.ts), so this prints not just the
// total but where the total went -- which is the whole point. This project has
// twice been wrong about its own speed by reasoning instead of measuring, and
// both wrong guesses looked obvious at the time.
//
// The queries below are deliberately odd. A benchmark that reuses the same
// words measures the cache and calls it the search.

const ORIGIN = process.argv[2] ?? "https://www.oleg.ae";

/**
 * Real questions, made unrepeatable.
 *
 * A benchmark that sends the same words twice measures the cache and calls it
 * the search. Both caches this site now has are keyed on the words -- the
 * embedding cache in Postgres, which never expires, and the answer cache in the
 * instance, which lasts ninety seconds -- so a second run of a fixed list comes
 * back in under 200 ms and reports a search that never happened. The suffix is
 * the run's own minute: enough to miss every cache, few enough words changed
 * that the question is still a real one.
 */
const SALT = new Date().toISOString().slice(0, 16).replace(/[^0-9]/g, "");
const QUERIES = [
  "kitchen renovation before and after",
  "sourdough starter troubleshooting",
  "second hand furniture flipping",
  "marathon training for beginners",
  "small boat restoration",
  "learning classical guitar late",
].map((q) => `${q} ${SALT}`);

type Row = { label: string; ms: number; timing: string; count: number };

async function once(path: string, body: unknown, label: string): Promise<Row> {
  const at = performance.now();
  const res = await fetch(`${ORIGIN}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { results?: unknown[] };
  return {
    label,
    ms: performance.now() - at,
    // The server's own breakdown. Absent means an old deployment, or a reply
    // that never reached the search at all (rate limit, bad request).
    timing: res.headers.get("server-timing") ?? `(none, http ${res.status})`,
    count: json.results?.length ?? 0,
  };
}

function report(name: string, rows: Row[]) {
  const times = rows.map((r) => r.ms).sort((a, b) => a - b);
  const at = (p: number) => times[Math.min(times.length - 1, Math.floor(p * times.length))];
  console.log(`\n${name}  median ${Math.round(at(0.5))} ms   worst ${Math.round(at(1))} ms`);
  for (const r of rows) {
    console.log(
      `  ${String(Math.round(r.ms)).padStart(5)} ms  ${String(r.count).padStart(3)} rows  ${r.label.slice(0, 34).padEnd(34)} ${r.timing}`,
    );
  }
}

const reels: Row[] = [];
const creators: Row[] = [];
// Sequential on purpose. Firing six at once measures how well the platform
// parallelises, which is not the number anybody waiting on a search feels.
for (const q of QUERIES) {
  reels.push(await once("/api/viral-reels/search", { query: q }, q));
  creators.push(await once("/api/viral-reels/creators", { query: q }, q));
}
report("reels    ", reels);
report("creators ", creators);

// The same query twice: the first pays for the embedding, the second must not.
const warm = QUERIES[1];
report("repeat   ", [
  await once("/api/viral-reels/search", { query: warm }, "second time"),
]);

export {};
