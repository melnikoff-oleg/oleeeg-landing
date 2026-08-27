import { test } from "node:test";
import assert from "node:assert/strict";
import { EAGER_TILES, LEAD_TILES, tileImage } from "@/lib/reels/paint-order";

test("the first row is fetched at once and at high priority", () => {
  for (let i = 0; i < LEAD_TILES; i++) {
    assert.deepEqual(tileImage(i), { loading: "eager", fetchPriority: "high" });
  }
});

test("the rest of the first screen is fetched at once but yields to the lead", () => {
  const after = tileImage(LEAD_TILES);
  assert.equal(after.loading, "eager");
  // Not "high". Twenty pictures all claiming to be the most important is the
  // same as none of them claiming it: over one HTTP/2 connection they would
  // share the bandwidth equally and the top row would land last.
  assert.equal(after.fetchPriority, "low");
});

test("everything past the first screen waits until it is scrolled towards", () => {
  assert.deepEqual(tileImage(EAGER_TILES), { loading: "lazy", fetchPriority: "auto" });
  assert.deepEqual(tileImage(500), { loading: "lazy", fetchPriority: "auto" });
});

test("the lead is a whole desktop row and no more", () => {
  // The wall is four to a row on a desktop. A lead of three would leave a hole
  // in the first row; a lead of eight is two rows, and the second one is under
  // the fold on a laptop.
  assert.equal(LEAD_TILES, 4);
  assert.ok(EAGER_TILES > LEAD_TILES);
});

test("an index nothing sensible could produce is still safe", () => {
  assert.deepEqual(tileImage(-1), { loading: "eager", fetchPriority: "high" });
  assert.equal(tileImage(Number.NaN).loading, "lazy");
});
