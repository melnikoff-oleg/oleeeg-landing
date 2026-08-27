import { test, expect } from "@playwright/test";
import { ROUTES } from "./routes";

// /reels and /creators are Oleg's own tools and are out of scope by his
// instruction, so their metadata is left exactly as he wrote it.
const OUT_OF_SCOPE = new Set(["/reels", "/creators"]);
const CHECKED = ROUTES.filter((r) => !OUT_OF_SCOPE.has(r));

/**
 * Tests 85-87: the metadata that becomes the search result.
 *
 * Length matters here in a way it does not elsewhere: Google truncates the
 * title around 60 characters and the description around 160, and what gets cut
 * is the end, which is where the specific words live. A 79-character title is
 * not a longer title, it is a title missing its tail.
 */

const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 165;

test("85 - every title fits in a search result", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "metadata, not layout");
  const long: string[] = [];
  for (const route of CHECKED) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    expect(title.length, `${route}: has no title`).toBeGreaterThan(10);
    if (title.length > TITLE_MAX) long.push(`${route} (${title.length}): ${title}`);
  }
  expect(long, "titles Google will truncate").toEqual([]);
});

test("86 - every description fits, and says something", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "metadata, not layout");
  const bad: string[] = [];
  for (const route of CHECKED) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const desc =
      (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    if (desc.length < DESC_MIN || desc.length > DESC_MAX)
      bad.push(`${route} (${desc.length})`);
  }
  expect(bad, `descriptions outside ${DESC_MIN}-${DESC_MAX} chars`).toEqual([]);
});

// Test 87: one canonical per page, absolute, and pointing at itself. A
// canonical that points somewhere else de-indexes the page it is on.
test("87 - canonicals are self-referential and absolute", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "metadata, not layout");
  for (const route of CHECKED) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const links = page.locator('link[rel="canonical"]');
    expect(await links.count(), `${route}: canonical count`).toBe(1);
    const href = await links.getAttribute("href");
    expect(href, `${route}: canonical`).toBe(
      route === "/" ? "https://oleg.ae" : `https://oleg.ae${route}`,
    );
  }
});
