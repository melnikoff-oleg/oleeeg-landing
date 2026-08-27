import { test } from "node:test";
import assert from "node:assert/strict";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  personSchema,
  websiteSchema,
  SITE_URL,
} from "@/lib/seo/schema";

const article = {
  title: "Claude Cowork for cold outreach",
  description: "How the system works end to end.",
  url: `${SITE_URL}/claude-cowork-outreach`,
  datePublished: "2026-05-12",
  dateModified: "2026-08-27",
};

test("article schema carries the author entity, not just a name", () => {
  const s = articleSchema(article);
  assert.equal(s["@type"], "Article");
  assert.equal(s.author["@type"], "Person");
  assert.equal(s.author.name, "Oleg Melnikov");
  // sameAs is what consolidates the entity across YouTube/LinkedIn/Instagram.
  assert.ok(s.author.sameAs.some((u: string) => u.includes("youtube.com")));
  assert.ok(s.author.sameAs.some((u: string) => u.includes("linkedin.com")));
});

test("article schema omits the video block when there is no video", () => {
  // Five source videos are private and three more were removed. A VideoObject
  // pointing at a dead watch page is a lie Google can check.
  assert.equal("video" in articleSchema(article), false);
  const withVideo = articleSchema({ ...article, videoId: "QoiFASDh8J8" });
  assert.equal(withVideo.video["@type"], "VideoObject");
  assert.ok(withVideo.video.embedUrl.endsWith("QoiFASDh8J8"));
});

test("faq schema mirrors exactly the questions the page renders", () => {
  const s = faqSchema([
    { q: "is claude cowork free", a: "No. It needs a paid Claude plan." },
    { q: "what does it cost", a: "Pro is $20 a month." },
  ]);
  assert.equal(s["@type"], "FAQPage");
  assert.equal(s.mainEntity.length, 2);
  assert.equal(s.mainEntity[0]["@type"], "Question");
  assert.equal(s.mainEntity[0].name, "is claude cowork free");
  assert.equal(s.mainEntity[0].acceptedAnswer["@type"], "Answer");
  assert.equal(s.mainEntity[0].acceptedAnswer.text, "No. It needs a paid Claude plan.");
});

test("faq schema refuses to emit an empty FAQPage", () => {
  // An FAQPage with no questions is a structured-data error in Search Console,
  // not a harmless no-op, so the builder returns null and the caller renders
  // nothing.
  assert.equal(faqSchema([]), null);
});

test("howTo steps are positioned from one and keep their own anchors", () => {
  const s = howToSchema({
    name: "Set up Claude Cowork for LinkedIn outreach",
    description: "Ten minutes, no code.",
    url: `${SITE_URL}/claude-cowork-outreach`,
    steps: [
      { name: "install claude cowork", text: "Download it from claude.ai/download." },
      { name: "connect apify", text: "Settings, then connectors." },
    ],
  });
  assert.equal(s["@type"], "HowTo");
  assert.equal(s.step.length, 2);
  assert.equal(s.step[0].position, 1);
  assert.equal(s.step[1].position, 2);
  // A step URL is what lets Google deep-link into the guide.
  assert.equal(s.step[0].url, `${SITE_URL}/claude-cowork-outreach#step-1`);
});

test("breadcrumbs are absolute and positioned from one", () => {
  const s = breadcrumbSchema([
    { name: "Guides", path: "/claude-code-tutorial" },
    { name: "Claude Cowork", path: "/claude-cowork" },
  ]);
  assert.equal(s.itemListElement.length, 3, "home is prepended");
  assert.equal(s.itemListElement[0].item, SITE_URL);
  assert.equal(s.itemListElement[0].position, 1);
  assert.equal(s.itemListElement[2].item, `${SITE_URL}/claude-cowork`);
  assert.equal(s.itemListElement[2].position, 3);
});

test("the person and website entities agree on one canonical id", () => {
  // Two entities disagreeing about the site's identity is worse than one.
  const p = personSchema();
  const w = websiteSchema();
  assert.equal(p["@id"], `${SITE_URL}/#person`);
  assert.equal(w.publisher["@id"], `${SITE_URL}/#person`);
  assert.equal(w.url, SITE_URL);
});

test("no schema text carries an em dash", () => {
  // House rule, and it leaks into search snippets when it appears in a
  // description.
  const blob = JSON.stringify([
    articleSchema(article),
    personSchema(),
    websiteSchema(),
    faqSchema([{ q: "a", a: "b" }]),
  ]);
  assert.equal(/[–—]/.test(blob), false);
});

test("howTo step anchors are unique", () => {
  // /claude-b2b-outreach splits one walkthrough across three sections. When
  // each GuideSteps block restarted its numbering at 1 the page rendered three
  // elements with id="step-1", and the HowTo anchors pointed at whichever one
  // the browser found first.
  const s = howToSchema({
    name: "n",
    description: "d",
    url: `${SITE_URL}/x`,
    steps: Array.from({ length: 6 }, (_, i) => ({ name: `s${i}`, text: `t${i}` })),
  });
  const urls = s.step.map((x: { url: string }) => x.url);
  assert.equal(new Set(urls).size, urls.length);
  assert.deepEqual(urls.at(-1), `${SITE_URL}/x#step-6`);
});
