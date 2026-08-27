import { test } from "node:test";
import assert from "node:assert/strict";
import { Pending } from "@/lib/search/pending";

test("a request already on its way is joined, not started again", async () => {
  const pending = new Pending<number>();
  let starts = 0;
  const start = () => {
    starts++;
    return new Promise<number>((r) => setTimeout(() => r(7), 30));
  };
  const first = pending.share("k", start);
  const second = pending.share("k", start);
  assert.equal(await first, 7);
  assert.equal(await second, 7);
  // This is the whole point. A visitor who presses Enter while the speculative
  // request for the very words they typed is still in flight used to start a
  // second, identical one and wait for that instead.
  assert.equal(starts, 1);
});

test("a different question starts its own request", async () => {
  const pending = new Pending<number>();
  let starts = 0;
  const start = () => {
    starts++;
    return Promise.resolve(1);
  };
  await Promise.all([pending.share("a", start), pending.share("b", start)]);
  assert.equal(starts, 2);
});

test("once it has answered, the next ask starts fresh", async () => {
  // Pending holds requests, not answers. Holding answers is the answer cache's
  // job and it has a TTL for reasons written there; a promise that outlived its
  // request would be a second, invisible cache with no expiry at all.
  const pending = new Pending<number>();
  let starts = 0;
  const start = () => {
    starts++;
    return Promise.resolve(1);
  };
  await pending.share("k", start);
  await pending.share("k", start);
  assert.equal(starts, 2);
});

test("a failure is not remembered either", async () => {
  const pending = new Pending<number>();
  let starts = 0;
  const start = () => {
    starts++;
    return Promise.reject(new Error("upstream"));
  };
  await assert.rejects(pending.share("k", start));
  await assert.rejects(pending.share("k", start));
  assert.equal(starts, 2);
});

test("both callers see the same failure", async () => {
  const pending = new Pending<number>();
  const start = () => Promise.reject(new Error("upstream"));
  const a = pending.share("k", start);
  const b = pending.share("k", start);
  await assert.rejects(a, /upstream/);
  await assert.rejects(b, /upstream/);
});

test("nothing is in flight to begin with", () => {
  assert.equal(new Pending<number>().has("k"), false);
});
