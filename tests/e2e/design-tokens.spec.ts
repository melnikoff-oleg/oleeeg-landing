import { test, expect } from "@playwright/test";
import { ROUTES } from "./routes";

const SAMPLE_RESOURCE = "/claude-b2b-outreach";

// Tests 7-11: brand fidelity to the Boldane design system.

const NAVY = "rgb(2, 11, 24)"; // #020b18
const VIVID_BLUE = "rgb(40, 99, 240)"; // #2863f0
const HAIRLINE = "rgba(208, 214, 224, 0.1)";

// Test 7: body background is navy on every route.
test("7 - body background is navy", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bg, `${route} body bg`).toBe(NAVY);
  }
});

// Test 8: the vivid-blue accent appears (as color or background) on each of a
// few representative pages.
test("8 - vivid-blue accent is present", async ({ page }) => {
  for (const route of ["/", SAMPLE_RESOURCE, "/marketing-brain-knowledge"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const hasAccent = await page.evaluate((blue) => {
      return [...document.querySelectorAll("*")].some((el) => {
        const s = getComputedStyle(el);
        return s.backgroundColor === blue || s.color === blue;
      });
    }, VIVID_BLUE);
    expect(hasAccent, `${route} accent`).toBe(true);
  }
});

// Test 9: the brand fonts are actually loaded.
test("9 - DM Sans, Space Grotesk and Inter are loaded", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => ({
    dmSans: document.fonts.check('16px "DM Sans"'),
    spaceGrotesk: document.fonts.check('16px "Space Grotesk"'),
    inter: document.fonts.check('16px "Inter"'),
  }));
  expect(loaded.dmSans, "DM Sans").toBe(true);
  expect(loaded.spaceGrotesk, "Space Grotesk").toBe(true);
  expect(loaded.inter, "Inter").toBe(true);
});

// Test 10: no legacy color classes survive anywhere in the rendered DOM.
test("10 - no legacy zinc/white-opacity/black classes in DOM", async ({
  page,
}) => {
  const forbidden = [
    "text-zinc-",
    "bg-white/",
    "border-white/",
    "bg-black",
    "from-black",
    "to-black",
    "decoration-zinc",
  ];
  for (const route of ["/", SAMPLE_RESOURCE, "/marketing-brain", "/marketing-brain-knowledge"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const hits = await page.evaluate((bad) => {
      const found = new Set<string>();
      for (const el of document.querySelectorAll("*")) {
        const cls = el.getAttribute("class") || "";
        for (const token of bad) if (cls.includes(token)) found.add(token);
      }
      return [...found];
    }, forbidden);
    expect(hits, `${route} legacy classes`).toEqual([]);
  }
});

// Test 11: hairline border color is used on surface cards.
test("11 - hairline borders on surface cards", async ({ page }) => {
  await page.goto(SAMPLE_RESOURCE, { waitUntil: "networkidle" });
  const card = page.locator(".surface-card").first();
  await expect(card).toBeVisible();
  const borderColor = await card.evaluate(
    (el) => getComputedStyle(el).borderTopColor
  );
  expect(borderColor).toBe(HAIRLINE);
});
