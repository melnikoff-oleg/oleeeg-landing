import { test } from "node:test";
import assert from "node:assert/strict";
import { Stopwatch } from "@/lib/perf/timing";

test("a span records the time between start and stop", async () => {
  const w = new Stopwatch();
  const done = w.start("embed");
  await new Promise((r) => setTimeout(r, 20));
  done();
  const [span] = w.spans();
  assert.equal(span.name, "embed");
  assert.ok(span.ms >= 15, `expected >= 15ms, got ${span.ms}`);
});

test("time() times a promise and hands its value straight back", async () => {
  const w = new Stopwatch();
  const value = await w.time("match", async () => {
    await new Promise((r) => setTimeout(r, 10));
    return 42;
  });
  assert.equal(value, 42);
  assert.equal(w.spans()[0].name, "match");
});

test("a throwing promise is still timed, and still throws", async () => {
  const w = new Stopwatch();
  await assert.rejects(
    w.time("match", async () => {
      throw new Error("upstream is down");
    }),
    /upstream is down/,
  );
  // A failure that takes four seconds is exactly the one worth measuring, so
  // the span must survive the throw.
  assert.equal(w.spans().length, 1);
});

test("the header is what Server-Timing expects", () => {
  const w = new Stopwatch();
  w.record("embed", 281.4);
  w.record("match", 92);
  assert.equal(w.header(), "embed;dur=281.4, match;dur=92");
});

test("a name that is not a token cannot get into the header", () => {
  const w = new Stopwatch();
  // Server-Timing names are tokens. A space, a comma or a semicolon would
  // produce a header that parses as something else entirely, so the name is
  // reduced rather than trusted.
  w.record("embed miss; x,y", 1);
  assert.equal(w.header(), "embed-miss-x-y;dur=1");
});

test("an empty stopwatch produces no header at all", () => {
  assert.equal(new Stopwatch().header(), "");
});

test("durations are rounded to a tenth of a millisecond", () => {
  const w = new Stopwatch();
  w.record("x", 12.3456);
  assert.equal(w.header(), "x;dur=12.3");
});

test("the same name twice keeps both, in order", () => {
  const w = new Stopwatch();
  w.record("hop", 1);
  w.record("hop", 2);
  assert.equal(w.header(), "hop;dur=1, hop-2;dur=2");
});
