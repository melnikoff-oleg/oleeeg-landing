import { test } from "node:test";
import assert from "node:assert/strict";
import { AnswerCache, answerKey } from "@/lib/search/answer-cache";

test("the same question is the same key", () => {
  assert.equal(answerKey(" AI  Automation ", { a: [0, 3] }), answerKey("ai automation", { a: [0, 3] }));
});

test("the same words under different filters are different questions", () => {
  assert.notEqual(answerKey("ai", { a: [0, 3] }), answerKey("ai", { a: [1, 3] }));
});

test("filter order cannot change the key", () => {
  // Object key order is an accident of how the filters were built. Two callers
  // that ask the same question must not miss each other's cached answer.
  assert.equal(answerKey("ai", { a: [0, 1], b: [2, 3] }), answerKey("ai", { b: [2, 3], a: [0, 1] }));
});

test("an answer comes back exactly as it went in", () => {
  const cache = new AnswerCache<number[]>(4, 1000);
  cache.set("k", [1, 2, 3]);
  assert.deepEqual(cache.get("k"), [1, 2, 3]);
});

test("an answer goes stale, because the ranking behind it can change", () => {
  // The mirror of the embedding cache, and for the reason written there: a
  // vector is immutable, a RANKING is not. The SQL behind it changes with a
  // migration and no deploy, so a result held for an hour is a lie nobody can
  // see. Short enough to bound that, long enough to make a retyped query free.
  let now = 0;
  const cache = new AnswerCache<number>(4, 1000, () => now);
  cache.set("k", 1);
  now = 999;
  assert.equal(cache.get("k"), 1);
  now = 1001;
  assert.equal(cache.get("k"), null);
});

test("the cache is bounded and drops the least recently used", () => {
  const cache = new AnswerCache<number>(2, 1000);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.get("a");
  cache.set("c", 3);
  assert.equal(cache.get("b"), null);
  assert.equal(cache.get("a"), 1);
  assert.equal(cache.get("c"), 3);
});

test("a miss is null and never a throw", () => {
  assert.equal(new AnswerCache<number>(2, 10).get("nothing"), null);
});
