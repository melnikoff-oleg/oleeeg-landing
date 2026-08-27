import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "@/lib/seo/slug";

test("headings become stable, url-safe anchors", () => {
  assert.equal(slugify("What Claude Cowork actually does"), "what-claude-cowork-actually-does");
  assert.equal(slugify("what does it cost?"), "what-does-it-cost");
  assert.equal(slugify("step 1: install"), "step-1-install");
});

test("punctuation never leaks into the anchor", () => {
  // A stray dot or slash in an id makes querySelector('#id') throw, which is
  // how a table of contents silently stops scrolling anywhere.
  assert.equal(slugify("apify, apollo & $1.50/1,000 leads"), "apify-apollo-1-50-1-000-leads");
  assert.equal(slugify("  spaced  out  "), "spaced-out");
});

test("accents fold rather than vanishing the word", () => {
  assert.equal(slugify("café résumé"), "cafe-resume");
});
