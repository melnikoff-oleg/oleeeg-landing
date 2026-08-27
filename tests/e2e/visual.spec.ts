import { test, expect, type Page, type Locator } from "@playwright/test";

const SAMPLE_RESOURCE = "/claude-b2b-outreach";

// Tests 12-15: visual regression snapshots. The first run establishes the
// baselines (committed); later runs diff against them.
//
// We capture with `page.screenshot()` + `toMatchSnapshot()` rather than
// `expect(page).toHaveScreenshot()`: the latter forces `animations: "disabled"`
// (its default, and even "allow" misbehaved here), which cancels Framer Motion's
// WAAPI entrance animations and yields blank screenshots. `page.screenshot()`
// captures the real, settled page. Looping <video>/<iframe>/<img> regions are
// masked so they never cause false diffs.

const DIFF = { maxDiffPixelRatio: 0.05 };

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  // Sections animate in on scroll (IntersectionObserver reveals, `once`). Step
  // down the full page so they reveal and stay revealed, then return to top, so
  // a full-page screenshot captures real content rather than blank sections.
  // IMPORTANT: force instant scrolling. The site sets `scroll-behavior: smooth`,
  // which makes programmatic scrollTo animate and lag, so stepped scrolls never
  // actually reach the lower sections within the pauses (they'd stay hidden).
  await page.evaluate(async () => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const step = window.innerHeight;
    const bottom = () => root.scrollHeight - window.innerHeight;
    for (let y = 0; y <= bottom(); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    // Ensure the very bottom (final section) is reached, then return to top.
    window.scrollTo(0, bottom());
    await new Promise((r) => setTimeout(r, 200));
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  });
  // Let the hero's on-mount entrance (staggered, up to ~2.5s) fully finish.
  await page.waitForTimeout(1800);
}

async function snapshot(page: Page, name: string, mask: Locator[]) {
  const buffer = await page.screenshot({ fullPage: true, mask });
  expect(buffer).toMatchSnapshot(name, DIFF);
}

// Test 12: homepage (desktop).
test("12 - homepage visual (desktop)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.goto("/");
  await settle(page);
  await snapshot(page, "home-desktop.png", [page.locator("video")]);
});

// Test 13: a representative resource page (desktop).
test("13 - resource page visual (desktop)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.goto(SAMPLE_RESOURCE);
  await settle(page);
  await snapshot(page, "resource-desktop.png", [page.locator("iframe")]);
});

// Test 14: marketing-brain empty state (desktop).
test("14 - marketing-brain visual (desktop)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.goto("/marketing-brain");
  await settle(page);
  await snapshot(page, "marketing-brain-desktop.png", [page.locator("img")]);
});

// Test 15: homepage (mobile / iPhone viewport).
test("15 - homepage visual (mobile)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await page.goto("/");
  await settle(page);
  await snapshot(page, "home-mobile.png", [page.locator("video")]);
});

// Test 28: the 5-levels ladder on mobile (the rung-card layout that replaces the
// wide comparison table below lg). Locks in the responsive redesign.
test("28 - 5-levels ladder visual (mobile)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await page.goto("/5-levels-ai");
  await settle(page);
  await snapshot(page, "ladder-mobile.png", []);
});
