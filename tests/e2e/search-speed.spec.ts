import { test, expect, type Page } from "@playwright/test";

/**
 * The speed work of 2026-08-27, in the browser.
 *
 * The unit suite proves the pieces (npm run test:unit); this proves they are
 * wired to the page. Every one of these describes something that WAS wrong: the
 * top row was lazy, a new search blanked the wall it was replacing, a repeated
 * search went back to the server, and nothing on a response said where its time
 * had gone. plans/search-speed.md has the measurements.
 */

async function settle(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

/** Run a search and wait for its answer, whatever it is. */
async function search(page: Page, words: string) {
  await page.locator("#library-query").fill(words);
  await page.getByRole("button", { name: "search" }).click();
}

test("the top row of the wall is fetched first, and the tail is not fetched at all", async ({
  page,
}) => {
  await settle(page, "/reels?all=1");
  const images = page.locator("article img");
  const count = await images.count();
  test.skip(count < 24, "no database configured");

  // The first row: eager and high. These are the only pictures on screen when
  // the page paints, and before this they were `lazy` like everything else.
  for (let i = 0; i < 4; i++) {
    await expect(images.nth(i)).toHaveAttribute("loading", "eager");
    await expect(images.nth(i)).toHaveAttribute("fetchpriority", "high");
  }
  // The rest of the first screen: fetched now, but yielding. Not "high" -- over
  // one HTTP/2 connection, twenty pictures all claiming to be the most
  // important share the bandwidth equally, which is the state being left.
  await expect(images.nth(8)).toHaveAttribute("loading", "eager");
  await expect(images.nth(8)).toHaveAttribute("fetchpriority", "low");
  // Past the first screen: not requested until scrolled towards.
  await expect(images.nth(30)).toHaveAttribute("loading", "lazy");
});

test("a creator's grid prioritises its top row too", async ({ page }) => {
  await settle(page, "/reels?all=1");
  const handle = page.locator("article a[href^='/creators/']").first();
  test.skip((await handle.count()) === 0, "no database configured");
  await handle.click();
  await page.waitForURL(/\/creators\/[^/]+$/);
  // The creator tile's root is the link to Instagram, not an <article>, and the
  // page also carries an avatar. Scope to the grid's own pictures.
  const images = page.locator("a[href*='instagram.com'] img");
  test.skip((await images.count()) < 24, "creator has too few reels");
  await expect(images.first()).toHaveAttribute("fetchpriority", "high");
  await expect(images.nth(30)).toHaveAttribute("loading", "lazy");
});

test("a search answers with where its time went", async ({ request }) => {
  const res = await request.post("/api/viral-reels/search", {
    data: { query: "street interviews" },
  });
  test.skip(res.status() === 503, "no database configured");
  expect(res.ok()).toBeTruthy();
  const timing = res.headers()["server-timing"] ?? "";
  // Named hops, each with a duration. This project has twice been wrong about
  // its own speed by reasoning instead of measuring; the header is what makes
  // measuring the cheap option.
  expect(timing).toMatch(/(embed|answer-hit);dur=/);
});

test("the same search twice does not go back to the server", async ({ page }) => {
  await settle(page, "/reels");
  test.skip((await page.locator("article img").count()) === 0, "no database configured");

  let calls = 0;
  page.on("request", (r) => {
    if (r.url().includes("/api/viral-reels/search")) calls++;
  });

  await search(page, "street interviews");
  await expect(page.getByText(/closest reels to that/)).toBeVisible({ timeout: 30_000 });
  const afterFirst = calls;

  // Clear the box, which puts the library back, then ask the same thing again.
  await page.locator("#library-query").fill("");
  await search(page, "street interviews");
  await expect(page.getByText(/closest reels to that/)).toBeVisible({ timeout: 30_000 });

  // The answer cache holds it for ninety seconds. Anything above the first call
  // here is a round trip the visitor should never have paid for. Prefetching
  // may add one BEFORE the first answer, so the comparison is against what had
  // been spent by then, not against one.
  expect(calls).toBe(afterFirst);
});

test("a second search replaces the wall in place, it does not blank it", async ({ page }) => {
  await settle(page, "/reels");
  test.skip((await page.locator("article img").count()) === 0, "no database configured");

  await search(page, "street interviews");
  await expect(page.getByText(/closest reels to that/)).toBeVisible({ timeout: 30_000 });

  // Hold the second answer at the door so the loading state can be looked at.
  await page.route("**/api/viral-reels/search", async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.continue();
  });
  await search(page, "cooking at home in a small kitchen");

  // Mid-flight: real reels, dimmed, under a progress hairline. Before this the
  // wall was replaced by eight pulsing grey rectangles, which is a page getting
  // worse while it works.
  await expect(page.locator("article img").first()).toBeVisible();
  await expect(page.locator(".opacity-45").first()).toBeVisible();
});

test("a pause before Enter costs one request, not two", async ({ page }) => {
  await settle(page, "/reels");
  test.skip((await page.locator("article img").count()) === 0, "no database configured");

  const sent: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/viral-reels/search")) sent.push(r.url());
  });

  // Type, then pause the way somebody does before reaching for Enter. The
  // prefetch fires during the pause.
  await page.locator("#library-query").pressSequentially("antique clock repair", { delay: 20 });
  await page.waitForTimeout(700);
  expect(sent.length).toBe(1);

  // Enter must JOIN that request, not start a second one. Without the shared
  // register the keypress fires its own identical call and waits on that, so
  // the prefetch has bought nothing and cost one extra request.
  await page.getByRole("button", { name: "search" }).click();
  await expect(page.getByText(/closest reels to that/)).toBeVisible({ timeout: 30_000 });
  expect(sent.length).toBe(1);
});

test("typing on does not spend a request per keystroke", async ({ page }) => {
  await settle(page, "/reels");
  test.skip((await page.locator("article img").count()) === 0, "no database configured");

  const sent: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/viral-reels/search")) sent.push(r.url());
  });

  // Twenty-six keystrokes with one pause in the middle of them.
  await page.locator("#library-query").pressSequentially("antique clocks", { delay: 20 });
  await page.waitForTimeout(600);
  await page.locator("#library-query").pressSequentially(" and watches", { delay: 20 });
  await page.waitForTimeout(700);

  // One per PAUSE, never one per key. A superseded guess is left to finish
  // rather than aborted -- the request may belong to a later caller by then,
  // and an answer already paid for is worth keeping in case the visitor
  // backspaces to it -- so the debounce is what has to hold the count down.
  expect(sent.length).toBe(2);
});
