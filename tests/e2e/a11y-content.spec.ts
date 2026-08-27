import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SAMPLE_RESOURCE = "/claude-b2b-outreach";

// Tests 19-20: accessibility + content rules.

// Test 19: no critical a11y violations and no heading-order violations.
test("19 - no critical a11y or heading-order violations", async ({ page }) => {
  for (const route of ["/", SAMPLE_RESOURCE]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(
      critical,
      `${route} critical: ${JSON.stringify(critical.map((v) => v.id))}`
    ).toEqual([]);

    const headingOrder = results.violations.filter(
      (v) => v.id === "heading-order"
    );
    expect(headingOrder, `${route} heading-order`).toEqual([]);
  }
});

// Test 20: no em/en dashes in rendered text (a standing copy rule for the site).
test("20 - no em or en dashes in rendered text", async ({ page }) => {
  for (const route of ["/", SAMPLE_RESOURCE, "/marketing-brain"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const text = await page.evaluate(() => document.body.innerText);
    const emDash = text.includes("—");
    const enDash = text.includes("–");
    expect(emDash, `${route} contains em dash`).toBe(false);
    expect(enDash, `${route} contains en dash`).toBe(false);
  }
});
