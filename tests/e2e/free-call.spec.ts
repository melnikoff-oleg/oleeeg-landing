import { test, expect } from "@playwright/test";
import { ROUTES } from "./routes";

/**
 * Tests 59-63: the free 30 minute call, offered on EVERY public route.
 *
 * The point of the element is reach: it is a short customer-development window
 * (see src/lib/free-call.ts) and a page that quietly misses it is a page whose
 * visitors never hear about it. So this iterates the shared ROUTES list AND the
 * six filmed pages, which are deliberately absent from that list because they
 * render none of the shared shell but still carry the card, via FilmedPageOutro.
 *
 * When the window closes, delete this spec along with the component.
 */

const CALENDLY = "https://calendly.com/boldane/free-30min-consult";

// The filmed evidence-wall pages. Not in ROUTES (they share no shell), but they
// mount the inline-styled twin of the card from their layout.tsx.
const FILMED_ROUTES = [
  "/elon-musk-ai",
  "/boris-cherny-ai",
  "/sam-altman-ai",
  "/andrej-karpathy-ai",
  "/claude-code-sessions",
  "/claude-riemann-hypothesis",
];

const ALL = [...ROUTES, ...FILMED_ROUTES];

// Tests 59-60, once per route in a single page load: the booking link is
// present exactly ONCE (a second copy would read as a hard sell, the opposite of
// what the card says about itself), is a safe external link, and carries the
// three things a visitor has to get in ten seconds: that it is free, that it is
// time-boxed, and that it is not a pitch.
for (const route of ALL) {
  test(`59 - free-call offer renders on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const links = page.locator(`a[href="${CALENDLY}"]`);
    await expect(links, `${route} booking link count`).toHaveCount(1);
    await expect(links.first(), `${route} link visible`).toBeVisible();
    expect(await links.first().getAttribute("target"), `${route} target`).toBe("_blank");
    expect(await links.first().getAttribute("rel"), `${route} rel`).toContain("noopener");

    const text = await page.evaluate(() => document.body.innerText.toLowerCase());
    expect(text, `${route} says it is free`).toContain("free 30 min call");
    expect(text, `${route} says the window`).toContain("this week and next week only");
    expect(text, `${route} says it is not a pitch`).toContain("not a sales call");
  });
}

// Test 61: no em or en dash reached the card. The site-wide copy rule, re-checked
// here because this string ships to thirty routes at once.
test("61 - free-call copy has no em or en dashes", async ({ page }) => {
  await page.goto("/claude-reels", { waitUntil: "domcontentloaded" });
  const card = page.locator("section", { has: page.locator(`a[href="${CALENDLY}"]`) }).last();
  const text = await card.innerText();
  expect(text.includes("—"), "em dash").toBe(false);
  expect(text.includes("–"), "en dash").toBe(false);
});

// Test 62: mobile tap target. The button is the whole point of the card, so it
// clears the 44px floor on a phone (and goes full width, which is why the width
// assertion is generous rather than exact).
test("62 - free-call button is a >=44px tap target on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  for (const route of ["/", "/claude-reels", "/opus-5", "/elon-musk-ai"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const box = await page.locator(`a[href="${CALENDLY}"]`).first().boundingBox();
    expect(box, `${route} button box`).not.toBeNull();
    expect(box!.height, `${route} button height ${box!.height}`).toBeGreaterThanOrEqual(44 - 0.5);
    expect(box!.width, `${route} button width ${box!.width}`).toBeGreaterThanOrEqual(120);
  }
});

// Test 63: the card's body copy stays at the site's 16px legibility floor on a
// phone. It is primary reading copy, not a caption.
test("63 - free-call body copy is >=16px on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await page.goto("/claude-reels", { waitUntil: "networkidle" });
  const body = page.getByText(/ask me anything you're stuck on/i).first();
  await expect(body).toBeVisible();
  const px = await body.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(px, `body copy ${px}px`).toBeGreaterThanOrEqual(16);
});
