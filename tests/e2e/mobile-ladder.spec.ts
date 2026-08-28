import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Tests 21-27: the /5-levels-ai "builder's ladder".
//
// The page was originally a single wide <table> (min-w-[52rem]) inside an
// overflow-x-auto box. On a phone the two prose columns ("what it looks like" /
// "what keeps you stuck") and the move-band chips were clipped entirely
// off-screen: the content a visitor most needs was invisible. These tests lock
// in the responsive swap: a climbable rung-card ladder below the lg breakpoint,
// the original comparison table at lg and up. They are written to FAIL against
// the old single-table layout.

const PAGE = "/5-levels-ai";

const ROLES = [
  "The Chatter",
  "The Micromanager",
  "The Orchestrator",
  "The Manager",
  "The CEO",
];

async function settle(page: Page) {
  await page.goto(PAGE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

// Test 21: on a phone the page never scrolls sideways and nothing spills past
// the viewport edge (the core "impossible to look at" failure of the old table,
// whose off-screen columns extended far beyond 390px).
test("21 - ladder: no horizontal overflow on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await settle(page);

  const doc = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  expect(doc.scrollW, "document scrollWidth").toBeLessThanOrEqual(doc.clientW);

  // Stronger than a page-level check: no *visible* element may extend past the
  // right edge. The old table's right-hand cells sat ~832px out, so this fails
  // loudly on the pre-fix layout even though the clipped box hid the scrollbar.
  const overflowing = await page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const bad: { tag: string; right: number }[] = [];
    for (const el of Array.from(document.querySelectorAll("main *"))) {
      const r = el.getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0;
      if (visible && r.right > w + 1) {
        bad.push({
          tag: `${el.tagName}.${(el.getAttribute("class") || "").slice(0, 40)}`,
          right: Math.round(r.right),
        });
      }
    }
    return { w, count: bad.length, sample: bad.slice(0, 8) };
  });
  expect(overflowing.count, JSON.stringify(overflowing, null, 2)).toBe(0);
});

// Test 22: on a phone the comparison table is swapped out for the rung ladder.
test("22 - ladder: table hidden, rung ladder shown on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await settle(page);
  await expect(page.locator("table")).toBeHidden();
  await expect(page.getByTestId("ladder-cards")).toBeVisible();
  // one rung node per level, each threaded on the rail
  await expect(page.getByTestId("rung-node")).toHaveCount(ROLES.length);
  await expect(page.getByTestId("ladder-rail")).toBeVisible();
});

// Test 23: every level shows all four fields (role, agent count, "what it looks
// like", "what keeps you stuck") with nothing collapsed or clipped. The old
// layout hid the two prose columns off-screen; the design brief also forbids a
// disclosure/accordion, so the punchy "stuck" copy must be present in the DOM.
test("23 - ladder: every field visible on mobile, nothing hidden", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await settle(page);
  const ladder = page.getByTestId("ladder-cards");

  for (const role of ROLES) {
    await expect(ladder.getByText(role, { exact: true })).toBeVisible();
  }
  for (const agents of ["0", "1", "~10", "~100", "1,000+"]) {
    await expect(ladder.getByText(agents, { exact: true })).toBeVisible();
  }
  // both column labels repeat per card
  await expect(ladder.getByText("what it looks like").first()).toBeVisible();
  await expect(ladder.getByText("what keeps you stuck").first()).toBeVisible();
  // representative copy from each formerly-clipped column
  await expect(ladder.getByText(/never touches your files/i)).toBeVisible();
  await expect(ladder.getByText(/it barely counts/i)).toBeVisible();
  await expect(ladder.getByText(/your clarity/i)).toBeVisible();
});

// Test 24: the escalating agent count is a scannable ramp, so "1,000+" must not
// wrap to a second line (whitespace-nowrap).
test("24 - ladder: '1,000+' stays on one line on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await settle(page);
  const big = page.getByTestId("ladder-cards").getByText("1,000+", { exact: true });
  await expect(big).toBeVisible();
  const lines = await big.evaluate((el) => {
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    return Math.round(el.getBoundingClientRect().height / lh);
  });
  expect(lines, "'1,000+' rendered line count").toBe(1);
});

// Test 25: all four move-bands render, and the longest command chip stays
// inside its band (no clip / horizontal spill), proving the full-width band
// choice holds even for `npm install -g @anthropic-ai/claude-code`.
test("25 - ladder: move-band chips never overflow their band on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await settle(page);
  const ladder = page.getByTestId("ladder-cards");

  for (const to of ["level 1", "level 2", "level 3", "level 4"]) {
    await expect(ladder.getByText(`how to get to ${to}`)).toBeVisible();
  }

  const longest = "npm install -g @anthropic-ai/claude-code";
  const chip = ladder.getByText(longest, { exact: true });
  await expect(chip).toBeVisible();
  const fits = await chip.evaluate((el) => {
    // the chip's immediate parent is the wrapping flex row, which stretches to
    // the band's content box; if [overflow-wrap:anywhere] were dropped, the
    // unbreakable command token would spill past this and the check would fire.
    const wrapper = el.closest("div");
    if (!wrapper) return false;
    const c = el.getBoundingClientRect();
    const w = wrapper.getBoundingClientRect();
    return c.right <= w.right + 1 && c.left >= w.left - 1;
  });
  expect(fits, "longest chip stays within its wrapper").toBe(true);
});

// Test 26: the rail actually threads the rungs, i.e. every icon node's
// horizontal center sits on the rail line (within 1.5px). Guards against the
// rail drifting off the nodes if the gutter or node size ever changes.
test("26 - ladder: rail threads every rung node on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await settle(page);
  const geom = await page.evaluate(() => {
    const rail = document.querySelector('[data-testid="ladder-rail"]');
    const nodes = Array.from(document.querySelectorAll('[data-testid="rung-node"]'));
    if (!rail || !nodes.length) return null;
    const rr = rail.getBoundingClientRect();
    const railX = rr.left + rr.width / 2;
    return {
      railX,
      offsets: nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return Math.abs(r.left + r.width / 2 - railX);
      }),
    };
  });
  expect(geom, "rail + nodes present").not.toBeNull();
  const worst = Math.max(...geom!.offsets);
  expect(worst, `node-center to rail offset px: ${JSON.stringify(geom!.offsets)}`).toBeLessThanOrEqual(1.5);
});

// Test 27: on desktop the original comparison table is preserved (the ladder is
// mobile-only) and the page has no critical a11y violations.
test("27 - ladder: table preserved on desktop, no critical a11y", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await settle(page);
  await expect(page.locator("table")).toBeVisible();
  await expect(page.getByTestId("ladder-cards")).toBeHidden();

  // .exclude("iframe"): the embedded YouTube player carries violations in
  // YouTube's own markup. See a11y-content.spec.ts.
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude("iframe")
    .analyze();
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical, JSON.stringify(critical.map((v) => v.id))).toEqual([]);

  // standing site rule: no em/en dashes in rendered text
  const text = await page.evaluate(() => document.body.innerText);
  expect(text.includes("—"), "em dash").toBe(false);
  expect(text.includes("–"), "en dash").toBe(false);
});
