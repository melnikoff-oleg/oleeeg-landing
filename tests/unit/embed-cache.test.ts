import { test } from "node:test";
import assert from "node:assert/strict";
import { cacheKey, VectorMemo, resolveEmbedding } from "@/lib/search/embed-cache";

const VEC = [0.1, 0.2, 0.3];

// ------------------------------------------------------------------- the key

test("the key ignores the things that do not change an embedding", () => {
  const a = cacheKey("  Street   Interviews ", "m", 3072);
  const b = cacheKey("street interviews", "m", 3072);
  assert.equal(a, b);
});

test("the key is not shared across models or dimensions", () => {
  const base = cacheKey("x", "text-embedding-3-large", 3072);
  assert.notEqual(base, cacheKey("x", "text-embedding-3-small", 3072));
  assert.notEqual(base, cacheKey("x", "text-embedding-3-large", 1024));
});

test("different words never collide", () => {
  assert.notEqual(cacheKey("ai", "m", 1), cacheKey("ia", "m", 1));
});

test("the key is a fixed-length hex digest, so it fits a primary key", () => {
  assert.match(cacheKey("a".repeat(5000), "m", 1), /^[0-9a-f]{64}$/);
});

// ------------------------------------------------------- the in-process memo

test("the memo hands back what it was given", () => {
  const memo = new VectorMemo(3);
  memo.set("k", VEC);
  assert.deepEqual(memo.get("k"), VEC);
});

test("the memo never expires an entry", async () => {
  // An embedding of a given string under a given model is the same forever.
  // This is the whole reason it may be cached harder than a search result: the
  // ranking can change under you, a vector cannot.
  const memo = new VectorMemo(3);
  memo.set("k", VEC);
  await new Promise((r) => setTimeout(r, 30));
  assert.deepEqual(memo.get("k"), VEC);
});

test("the memo drops the least recently used when it is full", () => {
  const memo = new VectorMemo(2);
  memo.set("a", [1]);
  memo.set("b", [2]);
  memo.get("a"); // "a" is now the fresher of the two
  memo.set("c", [3]);
  assert.deepEqual(memo.get("a"), [1]);
  assert.equal(memo.get("b"), null);
  assert.deepEqual(memo.get("c"), [3]);
});

// ----------------------------------------------------------------- the race

function deps(over: Partial<Parameters<typeof resolveEmbedding>[0]> = {}) {
  return {
    key: "k",
    memo: new VectorMemo(10),
    lookup: async () => null,
    embed: async () => VEC,
    store: async () => {},
    ...over,
  } as Parameters<typeof resolveEmbedding>[0];
}

test("memory wins without touching either upstream", async () => {
  const memo = new VectorMemo(10);
  memo.set("k", VEC);
  let touched = false;
  const got = await resolveEmbedding(
    deps({
      memo,
      lookup: async () => { touched = true; return null; },
      embed: async () => { touched = true; return VEC; },
    }),
  );
  assert.equal(got.source, "memory");
  assert.deepEqual(got.vector, VEC);
  assert.equal(touched, false);
});

test("a stored vector is used and the paid call is abandoned", async () => {
  let aborted = false;
  const got = await resolveEmbedding(
    deps({
      lookup: async () => VEC,
      embed: (_q, signal) =>
        new Promise((resolve, reject) => {
          signal.addEventListener("abort", () => { aborted = true; reject(new Error("aborted")); });
          setTimeout(() => resolve([9, 9, 9]), 500);
        }),
    }),
  );
  assert.equal(got.source, "db");
  assert.deepEqual(got.vector, VEC);
  // The point of racing is not only speed: a hit must stop us paying OpenAI.
  await new Promise((r) => setTimeout(r, 5));
  assert.equal(aborted, true);
});

test("a miss falls through to the paid call and writes the answer back", async () => {
  const written: number[][] = [];
  const got = await resolveEmbedding(
    deps({ lookup: async () => null, store: async (v) => { written.push(v); } }),
  );
  assert.equal(got.source, "openai");
  assert.deepEqual(written, [VEC]);
});

test("a broken cache slows a search down, it never breaks one", async () => {
  const got = await resolveEmbedding(
    deps({ lookup: async () => { throw new Error("supabase is down"); } }),
  );
  assert.equal(got.source, "openai");
  assert.deepEqual(got.vector, VEC);
});

test("a failed write-back is not a failed search", async () => {
  const got = await resolveEmbedding(
    deps({ store: async () => { throw new Error("read-only replica"); } }),
  );
  assert.deepEqual(got.vector, VEC);
});

test("whatever answered, the memo holds it afterwards", async () => {
  const memo = new VectorMemo(10);
  await resolveEmbedding(deps({ memo, lookup: async () => VEC }));
  assert.deepEqual(memo.get("k"), VEC);
});

test("when the paid call answers first the lookup is not waited on", async () => {
  const started = Date.now();
  const got = await resolveEmbedding(
    deps({
      lookup: () => new Promise((r) => setTimeout(() => r(null), 400)),
      embed: async () => VEC,
    }),
  );
  assert.equal(got.source, "openai");
  assert.ok(Date.now() - started < 300, "the slow lookup was waited on");
});

test("the failure that matters is still a failure", async () => {
  await assert.rejects(
    resolveEmbedding(deps({ embed: async () => { throw new Error("no key"); } })),
    /no key/,
  );
});
