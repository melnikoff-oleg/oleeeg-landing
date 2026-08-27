import { test } from "node:test";
import assert from "node:assert/strict";
import { PREFETCH_DELAY_MS, PREFETCH_MIN_CHARS, shouldPrefetch } from "@/lib/search/prefetch";

// A visitor types for a second or two and then reaches for Enter. The answer to
// what they have already typed can be on its way during that reach, so that
// pressing Enter costs a cache read rather than a round trip to OpenAI and
// back. This is the only part of the latency budget that can be spent BEFORE
// the visitor asks for anything.

test("a long enough query that nothing has answered is worth starting", () => {
  assert.equal(shouldPrefetch({ query: "ai automation", applied: "", known: () => false }), true);
});

test("a query already in hand is not fetched again", () => {
  assert.equal(shouldPrefetch({ query: "ai automation", applied: "", known: () => true }), false);
});

test("the query already on screen is not fetched again", () => {
  assert.equal(
    shouldPrefetch({ query: "ai automation", applied: "ai automation", known: () => false }),
    false,
  );
});

test("what is on screen is compared the way a search would compare it", () => {
  // Trimmed and case-folded, because "AI Automation " and "ai automation" are
  // one question and re-fetching between them is a request nobody asked for.
  assert.equal(
    shouldPrefetch({ query: "  AI Automation ", applied: "ai automation", known: () => false }),
    false,
  );
});

test("a few characters are not a question yet", () => {
  for (const query of ["", " ", "a", "ai", "ai "]) {
    assert.equal(shouldPrefetch({ query, applied: "", known: () => false }), false, query);
  }
  assert.ok(PREFETCH_MIN_CHARS >= 3, "too short a floor spends a request on every keystroke");
});

test("the delay is long enough to be a pause and short enough to be useful", () => {
  // Under ~200 ms fires mid-word and spends a request per keystroke; over
  // ~600 ms the visitor has pressed Enter before anything was sent.
  assert.ok(PREFETCH_DELAY_MS >= 250 && PREFETCH_DELAY_MS <= 600, String(PREFETCH_DELAY_MS));
});

test("the check asks the cache with the query it would actually send", () => {
  const asked: string[] = [];
  shouldPrefetch({
    query: "  Street Interviews  ",
    applied: "",
    known: (q) => {
      asked.push(q);
      return false;
    },
  });
  assert.deepEqual(asked, ["street interviews"]);
});
