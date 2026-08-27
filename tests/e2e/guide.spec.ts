import { test, expect } from "@playwright/test";
import { GUIDE_ROUTES, REDIRECTED_ROUTES } from "./routes";

// Tests 73-80: the standalone-guide contract.
//
// The whole point of this pass: a page must answer its query for someone who
// has never seen the video. Every assertion here is a way of asking "would this
// page be worth landing on from Google". They run on desktop only where the
// check is about content rather than layout, because the markup is identical.

/** Visible text of <main>, which is the article a reader actually gets. */
async function visibleWords(page: import("@playwright/test").Page) {
  const text = await page.locator("main").innerText();
  return text.split(/\s+/).filter(Boolean).length;
}

// Test 73: every guide page carries enough written substance to stand alone.
// 900 words is roughly where a page stops being a caption for a video and
// starts being the thing itself. The videos run 1,400 to 3,200 transcript
// words, so this is a floor, not a target.
test("73 - every guide page is a standalone article", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "content check, not layout");
  for (const route of GUIDE_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const words = await visibleWords(page);
    expect(words, `${route} visible word count`).toBeGreaterThan(900);
  }
});

// Test 74: the article is structured, not a wall. h2s are how a reader skims
// and how Google works out what the page covers.
test("74 - every guide page has a real heading structure", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "content check, not layout");
  for (const route of GUIDE_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(await page.locator("h1").count(), `${route} h1`).toBe(1);
    expect(await page.locator("main h2").count(), `${route} h2 count`).toBeGreaterThanOrEqual(4);
  }
});

// Test 75: the guide body is visible without clicking anything.
// The setup accordion above it is deliberately collapsible; the article is not.
// Content behind a toggle is content a reader has to work for.
test("75 - the guide body is visible on load", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "content check, not layout");
  for (const route of GUIDE_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const guide = page.locator("article.prose-guide");
    await expect(guide, `${route} guide article`).toBeVisible();
    const words = (await guide.innerText()).split(/\s+/).filter(Boolean).length;
    expect(words, `${route} guide word count`).toBeGreaterThan(500);
  }
});

/** Every JSON-LD blob on the page, parsed. */
async function jsonLd(page: import("@playwright/test").Page) {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  return raw.map((r) => JSON.parse(r));
}

// Test 76: the FAQ markup mirrors questions that are really on the page.
// Schema that describes content the page does not show is the definition of
// structured-data spam, and it is checkable, so it gets checked here.
test("76 - FAQ schema matches the visible copy", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "content check, not layout");
  for (const route of GUIDE_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const faq = (await jsonLd(page)).find((d) => d["@type"] === "FAQPage");
    expect(faq, `${route} has FAQPage schema`).toBeTruthy();
    expect(faq.mainEntity.length, `${route} FAQ entries`).toBeGreaterThanOrEqual(3);
    const body = (await page.locator("main").innerText()).toLowerCase();
    for (const q of faq.mainEntity) {
      expect(body, `${route}: "${q.name}" is not rendered`).toContain(
        q.name.toLowerCase(),
      );
      expect(q.acceptedAnswer.text.length, `${route}: answer too thin`).toBeGreaterThan(40);
    }
  }
});

// Test 77: every HowTo step url points at an id that exists on the page.
// A rich result deep-linking to #step-4 that scrolls nowhere is worse than no
// rich result.
test("77 - HowTo step anchors resolve", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "content check, not layout");
  for (const route of GUIDE_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const howTo = (await jsonLd(page)).find((d) => d["@type"] === "HowTo");
    if (!howTo) continue; // not every guide is a how-to (comparisons, pricing)
    for (const step of howTo.step) {
      const id = new URL(step.url).hash.slice(1);
      await expect(page.locator(`#${id}`), `${route} ${step.url}`).toHaveCount(1);
    }
  }
});

// Test 78: breadcrumbs everywhere, so the cluster reads as a cluster.
test("78 - every guide page emits breadcrumbs", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "content check, not layout");
  for (const route of GUIDE_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const crumbs = (await jsonLd(page)).find((d) => d["@type"] === "BreadcrumbList");
    expect(crumbs, `${route} breadcrumbs`).toBeTruthy();
    expect(crumbs.itemListElement[0].item).toBe("https://oleg.ae");
    const last = crumbs.itemListElement.at(-1);
    expect(last.item, `${route} breadcrumb tail`).toContain(route);
  }
});

// Test 79: the consolidated slugs answer with a permanent redirect.
// They are still linked from old video descriptions and from
// recommendations.json, so a 404 there loses the visitor and the equity.
test("79 - consolidated slugs redirect permanently", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "server behaviour, not layout");
  for (const [from, to] of Object.entries(REDIRECTED_ROUTES)) {
    const res = await page.goto(from, { waitUntil: "domcontentloaded" });
    expect(res, `${from} response`).not.toBeNull();
    expect(res!.status(), `${from} final status`).toBe(200);
    expect(new URL(page.url()).pathname, `${from} lands on`).toBe(to);
    // 308 is Next's permanent redirect. A 307 would tell Google to keep the old
    // url indexed, which is the opposite of consolidating.
    const chain = res!.request().redirectedFrom();
    expect(chain, `${from} was redirected`).not.toBeNull();
    const first = await chain!.response();
    expect(first!.status(), `${from} redirect code`).toBe(308);
  }
});

// Test 80: the YouTube path is not broken. 84% of traffic arrives having
// already watched the video and wants the asset; the written guide must sit
// BELOW the hero CTA, never above it.
test("80 - the hero CTA still comes before the guide", async ({ page }) => {
  for (const route of GUIDE_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const guide = page.locator("article.prose-guide");
    const cta = page.getByTestId("hero-cta").first();
    if ((await cta.count()) === 0) continue; // pages with nothing to hand over
    const ctaBox = await cta.boundingBox();
    const guideBox = await guide.boundingBox();
    expect(ctaBox, `${route} cta box`).not.toBeNull();
    expect(guideBox, `${route} guide box`).not.toBeNull();
    expect(ctaBox!.y, `${route}: guide must not outrank the CTA`).toBeLessThan(
      guideBox!.y,
    );
  }
});
