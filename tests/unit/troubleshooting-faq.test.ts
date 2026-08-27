import { test } from "node:test";
import assert from "node:assert/strict";
import { FIXES, faqEntriesFor } from "@/components/troubleshooting-data";

test("every troubleshooting answer has a plain-text twin for schema", () => {
  // The rendered answer is JSX and cannot go into JSON-LD. Keeping the plain
  // text on the same object is what stops the two versions saying different
  // things, which is the failure mode structured-data spam is made of.
  for (const [key, fix] of Object.entries(FIXES)) {
    assert.ok(fix.q.length > 10, `${key}: question too short`);
    assert.ok(fix.aText.length > 80, `${key}: schema answer too thin`);
    assert.ok(!/<[a-z]/i.test(fix.aText), `${key}: schema answer contains markup`);
  }
});

test("no answer carries an em dash", () => {
  for (const [key, fix] of Object.entries(FIXES)) {
    assert.equal(/[–—]/.test(fix.aText), false, `${key}: em dash in answer`);
    assert.equal(/[–—]/.test(fix.q), false, `${key}: em dash in question`);
  }
});

test("faq entries are built only from the keys a page actually renders", () => {
  // A page about competitor research must not emit a LinkedIn ban answer just
  // because the answer exists.
  const entries = faqEntriesFor(["claudeNotFound", "costs"]);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].q, FIXES.claudeNotFound.q);
  assert.equal(entries[0].a, FIXES.claudeNotFound.aText);
});

test("an unknown key is dropped rather than emitting an empty question", () => {
  const entries = faqEntriesFor(["claudeNotFound", "nope" as keyof typeof FIXES]);
  assert.equal(entries.length, 1);
});

test("no page's questions collide with each other", () => {
  // Two Question nodes with the same name in one FAQPage is a validation error.
  const qs = Object.values(FIXES).map((f) => f.q);
  assert.equal(new Set(qs).size, qs.length);
});
