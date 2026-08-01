import { test, expect, type Page, type TestInfo } from "@playwright/test";

// Tests 59+: /elon-ai, the companion page to "How Elon Musk Uses AI Daily".
//
// The page is filmed, so its contract is unusually strict and worth locking:
// exactly seven rules, every rule body under 300 characters, every clip a
// facade that opens on the exact second Elon says the line, and no eager
// iframes. Runs on both projects unless a test opts into mobile only.

const ROUTE = "/elon-ai";
const MAX_BODY_CHARS = 300;
const MIN_TAP = 44;

// Video id + the second each clip must open on. Kept here, deliberately
// duplicated from src/app/elon-ai/rules.ts, so a fat-fingered timestamp in the
// page data fails the suite instead of silently shipping a clip that opens on
// the wrong sentence.
const CLIPS = [
  { videoId: "q-MFKzvqFOk", start: 1946 },
  { videoId: "RSNuB9pj9P8", start: 151 },
  { videoId: "O4wBUysNe2k", start: 4256 },
  { videoId: "qeZqZBRA-6Q", start: 1617 },
  { videoId: "BYXbuik3dgA", start: 2578 },
  { videoId: "JN3KPFbWCy8", start: 2181 },
  { videoId: "XuoqKYxDHVc", start: 930 },
];

function MOBILE_ONLY(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== "mobile", "mobile-only check");
}

async function settle(page: Page) {
  await page.goto(ROUTE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

test("59 - elon-ai: exactly seven rules, each numbered and anchored", async ({
  page,
}) => {
  await settle(page);

  const rules = page.getByTestId("rule");
  await expect(rules).toHaveCount(7);

  for (let i = 0; i < 7; i++) {
    const rule = rules.nth(i);
    await expect(rule).toHaveAttribute("id", `r${i + 1}`);
    // Every rule carries its own h2, so the page reads as a list of claims.
    await expect(rule.locator("h2")).toHaveCount(1);
  }
});

test("60 - elon-ai: every rule body stays under 300 characters", async ({
  page,
}) => {
  await settle(page);

  const bodies = await page
    .getByTestId("rule")
    .locator("h2 + p")
    .allInnerTexts();

  expect(bodies).toHaveLength(7);
  for (const body of bodies) {
    expect(
      body.trim().length,
      `rule body over ${MAX_BODY_CHARS} chars: ${body.slice(0, 60)}...`,
    ).toBeLessThanOrEqual(MAX_BODY_CHARS);
    expect(body.trim().length, "rule body suspiciously short").toBeGreaterThan(
      40,
    );
  }
});

test("61 - elon-ai: seven facades, no eager iframe", async ({ page }) => {
  await settle(page);

  expect(
    await page.locator("iframe[src*='youtube']").count(),
    "eager youtube iframes",
  ).toBe(0);
  await expect(page.getByTestId("youtube-facade")).toHaveCount(7);
});

test("62 - elon-ai: source links point at the exact second, external and safe", async ({
  page,
}) => {
  await settle(page);

  const links = page.getByTestId("clip-source");
  await expect(links).toHaveCount(7);

  for (let i = 0; i < CLIPS.length; i++) {
    const clip = CLIPS[i];
    const href = await links.nth(i).getAttribute("href");
    expect(href, `clip ${i + 1} href`).toBe(
      `https://www.youtube.com/watch?v=${clip.videoId}&t=${clip.start}s`,
    );
    await expect(links.nth(i)).toHaveAttribute("target", "_blank");
    expect(await links.nth(i).getAttribute("rel")).toContain("noopener");
  }
});

test("63 - elon-ai: tapping a clip loads that clip at its start time", async ({
  page,
}) => {
  await settle(page);

  const facade = page.getByTestId("youtube-facade").first();
  await facade.scrollIntoViewIfNeeded();
  await facade.click();

  const iframe = page.locator("iframe[src*='youtube']").first();
  await expect(iframe).toBeVisible({ timeout: 10_000 });

  const src = await iframe.getAttribute("src");
  expect(src).toContain(CLIPS[0].videoId);
  expect(src).toContain(`start=${CLIPS[0].start}`);
});

test("64 - elon-ai: rule one explains its three questions in plain words", async ({
  page,
}) => {
  await settle(page);

  const terms = page.locator("#r1 dl dt");
  await expect(terms).toHaveCount(3);
  await expect(terms.nth(0)).toHaveText("The Fermi paradox");

  // Each term is followed by a plain-English gloss, never left bare.
  const glosses = page.locator("#r1 dl dd");
  await expect(glosses).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    expect((await glosses.nth(i).innerText()).trim().length).toBeGreaterThan(20);
  }
});

test("65 - elon-ai: no em or en dashes anywhere on the page", async ({
  page,
}) => {
  await settle(page);

  const text = await page.evaluate(() => document.body.innerText);
  expect(text.includes("—"), "em dash").toBe(false);
  expect(text.includes("–"), "en dash").toBe(false);
});

test("66 - elon-ai: readable and tappable on a 390px phone", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page);

  // Rule prose never drops below the site's 16px floor.
  const bodies = page.getByTestId("rule").locator("h2 + p");
  for (let i = 0; i < 7; i++) {
    const size = await bodies
      .nth(i)
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, `rule ${i + 1} body font size`).toBeGreaterThanOrEqual(16);
  }

  // Source links are real tap targets, not 20px of text.
  const link = page.getByTestId("clip-source").first();
  const box = await link.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(MIN_TAP);

  // Nothing pokes past the viewport.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow, "horizontal overflow at 390px").toBeLessThanOrEqual(1);
});
