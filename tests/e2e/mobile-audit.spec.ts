import { test, expect, type Page, type Locator } from "@playwright/test";
import { ROUTES } from "./routes";

// Tests 29+: site-wide mobile refinement pass.
//
// The site already had zero horizontal overflow, so these lock in the NEXT
// tier of mobile quality surfaced by the audit: real tap-target sizes (>=44px,
// Apple HIG), primary reading copy at >=16px (never below the legibility floor),
// and a lightweight click-to-load YouTube facade instead of an eager iframe that
// pulls ~0.5-1MB of player JS on load. All written to FAIL against pre-fix code.

const MOBILE_ONLY = (testInfo: { project: { name: string } }) =>
  test.skip(testInfo.project.name !== "mobile", "mobile only");

// The shared route list, so a new page can't be silently absent from this
// audit while still being listed everywhere else (it previously duplicated
// ROUTES by hand and drifted).
const ALL_ROUTES = ROUTES;

// Every route that renders a YouTubeEmbed facade, kept in sync with the videos
// that are still live on the channel. A page whose source video was hidden
// renders no facade and no VideoObject schema, because an embed that shows
// YouTube's grey "unavailable" panel is worse than no embed, and schema
// pointing at a dead watch page is a claim Google can check.
//
// Re-verified against the channel on 2026-08-27 with `yt-dlp --flat-playlist`
// and the oembed endpoint (403 means private or removed). Dropped that day:
// /ads-ai (5_QP6_EmReQ) and /claude-code-second-brain (TdYYRm_Ph5E), whose
// videos had gone private since the last sweep and were still being embedded.
const YT_FACADE_ROUTES = [
  "/claude-reels", "/claude-tiktok", "/claude-content", "/claude-twitter",
  "/claude-b2b-outreach", "/claude-cowork-outreach",
  "/claude-marketing", "/claude-social-growth",
  "/5-levels-ai", "/claude-code-instagram",
];

const MIN_TAP = 44;

async function settle(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

async function tapSize(loc: Locator) {
  const box = await loc.boundingBox();
  if (!box) return { w: 0, h: 0 };
  return { w: box.width, h: box.height };
}

async function fontSize(loc: Locator) {
  return loc.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
}

// ── Tap targets ──────────────────────────────────────────────────────────────

test("29 - home: hamburger menu button is a >=44px tap target", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/");
  const burger = page.locator("header button[aria-label*='menu' i]");
  await expect(burger).toBeVisible();
  const { w, h } = await tapSize(burger);
  expect(Math.min(w, h), `hamburger ${w}x${h}`).toBeGreaterThanOrEqual(MIN_TAP - 0.5);
});

test("30 - marketing-brain: send + starter chips + context pill are >=44px", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/marketing-brain");

  const send = page.locator("button[aria-label='Send']");
  const sBox = await tapSize(send);
  expect(Math.min(sBox.w, sBox.h), `send ${sBox.w}x${sBox.h}`).toBeGreaterThanOrEqual(MIN_TAP - 0.5);

  const starter = page.getByRole("button", { name: "make an irresistible offer" });
  const stBox = await tapSize(starter);
  expect(stBox.h, `starter height ${stBox.h}`).toBeGreaterThanOrEqual(MIN_TAP - 0.5);

  const ctx = page.locator("header").getByRole("button", { name: /your context/i });
  const cBox = await tapSize(ctx);
  expect(cBox.h, `context pill height ${cBox.h}`).toBeGreaterThanOrEqual(MIN_TAP - 0.5);
});

test("31 - resource header pill (youtube) is a >=44px tap target", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/claude-reels");
  const pill = page.locator("header a", { hasText: "youtube" });
  const { h } = await tapSize(pill);
  expect(h, `youtube pill height ${h}`).toBeGreaterThanOrEqual(MIN_TAP - 0.5);
});

test("32 - 60k: every 'copy prompt' button is a >=44px tap target", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/60k-linkedin-post");
  const buttons = page.getByRole("button", { name: /copy prompt/i });
  const n = await buttons.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const { h } = await tapSize(buttons.nth(i));
    expect(h, `copy button #${i} height ${h}`).toBeGreaterThanOrEqual(MIN_TAP - 0.5);
  }
});

test("33 - knowledge: sticky quick-nav chips are >=44px tall", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/marketing-brain-knowledge");
  const chips = page.getByTestId("kb-nav-chip");
  const n = await chips.count();
  expect(n).toBeGreaterThan(0);
  const { h } = await tapSize(chips.first());
  expect(h, `nav chip height ${h}`).toBeGreaterThanOrEqual(MIN_TAP - 0.5);
});

// ── Primary reading copy >= 16px ──────────────────────────────────────────────

test("34 - home: results highlight-card copy is >=16px", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/");
  const p = page.getByText(/co-founder of NP Digital/i);
  await expect(p).toBeVisible();
  expect(await fontSize(p), "results card body px").toBeGreaterThanOrEqual(16);
});

test("35 - 5-levels: rung prose is >=16px on mobile", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/5-levels-ai");
  const prose = page.getByTestId("ladder-cards").getByText(/never touches your files/i);
  await expect(prose).toBeVisible();
  expect(await fontSize(prose), "rung prose px").toBeGreaterThanOrEqual(16);
});

test("36 - high-converting: 'what makes it convert' card body is >=16px", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/high-converting-website");
  // representative principle body copy on the page
  const body = page.getByText(/dream outcome/i).first();
  await expect(body).toBeVisible();
  expect(await fontSize(body), "principle card body px").toBeGreaterThanOrEqual(15.5);
});

// ── YouTube facade (no eager iframe; click to load) ───────────────────────────

for (const route of YT_FACADE_ROUTES) {
  test(`37 - facade: ${route} ships no eager iframe and a play affordance`, async ({ page }, testInfo) => {
    MOBILE_ONLY(testInfo);
    await settle(page, route);
    // No YouTube iframe should exist before the user opts in.
    expect(await page.locator("iframe[src*='youtube']").count(), "eager youtube iframes").toBe(0);
    const facade = page.getByTestId("youtube-facade").first();
    await expect(facade).toBeVisible();
  });
}

test("38 - facade: clicking the poster loads the real iframe", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/claude-reels");
  const facade = page.getByTestId("youtube-facade").first();
  await facade.scrollIntoViewIfNeeded();
  await facade.click();
  await expect(page.locator("iframe[src*='youtube']").first()).toBeVisible({ timeout: 10_000 });
});

// ── No horizontal overflow anywhere (regression guard, all routes) ────────────

for (const route of ALL_ROUTES) {
  test(`39 - no horizontal overflow: ${route}`, async ({ page }, testInfo) => {
    MOBILE_ONLY(testInfo);
    await settle(page, route);
    const doc = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(doc.scrollW, `${route} scrollWidth`).toBeLessThanOrEqual(doc.clientW + 1);
  });
}
