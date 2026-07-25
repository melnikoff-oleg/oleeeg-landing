import { test, expect, type Page } from "@playwright/test";

// Tests 52-58: the /opus-5 lead magnet page.
//
// It is the site's densest data page (five rule sections, three bar charts, a
// benchmark board, a before/after pair and a 3D hero toy), so these lock in the
// things most likely to regress: the content actually arrived from the source
// artifact, the wide benchmark table becomes cards on a phone instead of being
// clipped, the hero toy stays inside the viewport, and the copy rules hold.

const ROUTE = "/opus-5";

const MOBILE_ONLY = (testInfo: { project: { name: string } }) =>
  test.skip(testInfo.project.name !== "mobile", "mobile only");

async function settle(page: Page) {
  await page.goto(ROUTE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

// Test 52: every rule section from the artifact is present and anchored.
test("52 - all five rules render with their anchors", async ({ page }) => {
  await settle(page);

  await expect(page.locator("h1")).toContainText("Opus 5, no hype");

  const rules: [string, string][] = [
    ["r1", "Never use max effort."],
    ["r2", "Delete \"verify your work\" from your prompt."],
    ["r3", "Skip Fable 5."],
    ["r4", "Match the model to the task."],
    ["r5", "It finds security bugs. Do not believe it cannot exploit them."],
  ];

  for (const [id, heading] of rules) {
    const section = page.locator(`section#${id}`);
    await expect(section, `#${id} exists`).toHaveCount(1);
    await expect(section.locator("h2"), `#${id} heading`).toHaveText(heading);
  }

  // The closer, which carries the release-to-release comparison.
  await expect(
    page.getByRole("heading", { name: "57 days. Same price. Double the score." }),
  ).toBeVisible();
});

// Test 53: the sourced numbers survived the port (a sample across sections).
test("53 - the sourced numbers are on the page", async ({ page }) => {
  await settle(page);
  const text = await page.evaluate(() => document.body.innerText);

  for (const n of [
    "44.4%", // rule 1: the peak before max effort
    "43.3%", // rule 1 + closer: max-effort Frontier-Bench
    "90.8%", // rule 3: BrowseComp
    "22.9%", // rule 4: content creation share
    "79.4%", // rule 5: Opus 5 vulnerability finding
    "21.1%", // closer: Opus 4.8
  ]) {
    expect(text, `missing ${n}`).toContain(n);
  }
});

// Test 54: every source link points at a real Anthropic-owned domain and opens
// safely (the page's whole claim is "these are their numbers, not mine").
test("54 - source links are external and rel-protected", async ({ page }) => {
  await settle(page);
  const links = page.getByTestId("source-link");
  const n = await links.count();
  expect(n, "source link count").toBeGreaterThanOrEqual(10);

  for (let i = 0; i < n; i++) {
    const link = links.nth(i);
    const href = await link.getAttribute("href");
    const rel = (await link.getAttribute("rel")) ?? "";
    expect(href, `link ${i} href`).toMatch(
      /^https:\/\/(www\.anthropic\.com|platform\.claude\.com|support\.claude\.com)\//,
    );
    expect(rel, `link ${i} rel`).toContain("noopener");
  }
});

// Test 55: the rule rail jumps to each section.
test("55 - the sticky rail links to every rule", async ({ page }) => {
  await settle(page);
  const chips = page.getByTestId("rule-rail-chip");
  await expect(chips).toHaveCount(5);
  for (let i = 0; i < 5; i++) {
    await expect(chips.nth(i)).toHaveAttribute("href", `#r${i + 1}`);
  }
});

// Test 56: the standing copy rule (no em/en dashes anywhere on the page).
test("56 - no em or en dashes", async ({ page }) => {
  await settle(page);
  const text = await page.evaluate(() => document.body.innerText);
  expect(text.includes("—"), "em dash").toBe(false);
  expect(text.includes("–"), "en dash").toBe(false);
});

// Test 57: on a phone the 3-column benchmark table is swapped for a card stack,
// so no column can be hidden off-screen (the CLAUDE.md mobile mandate).
test("57 - mobile swaps the benchmark table for cards", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page);

  await expect(page.locator("table")).toBeHidden();

  const cards = page.getByTestId("benchmark-cards").locator("li");
  await expect(cards).toHaveCount(9);

  // Both model scores are visible on the card, not clipped into a scroller.
  const first = cards.first();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toContainText("Frontier-Bench");
  await expect(first).toContainText("43.3%");
  await expect(first).toContainText("33.7%");
});

// Test 58: the 3D hero toy fits the viewport and its copy is legible.
test("58 - mobile hero toy stays inside the viewport", async ({ page }, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page);

  const scene = page.getByTestId("voxel-scene");
  await expect(scene).toBeVisible();
  const box = await scene.boundingBox();
  expect(box, "scene box").not.toBeNull();
  expect(box!.x, "scene left edge").toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width, "scene right edge").toBeLessThanOrEqual(391);

  // Rule prose is primary reading copy: >=16px on a phone.
  const why = page.getByText(/The peak is one setting below/);
  await why.scrollIntoViewIfNeeded();
  const px = await why.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(px, "rule prose px").toBeGreaterThanOrEqual(16);
});
