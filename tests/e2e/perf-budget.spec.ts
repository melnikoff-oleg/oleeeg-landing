import { test, expect } from "@playwright/test";

/**
 * Tests 81-84: performance budgets.
 *
 * Real perf work had shipped here and had never been measured, so there was no
 * number to regress against. These are budgets, not benchmarks: they are set a
 * little above where the site actually sits, so ordinary work does not trip
 * them and a genuine regression does.
 *
 * Measured with the Resource Timing API in a cold context (Playwright gives
 * each test a fresh one), so these are first-visit numbers, which is the visit
 * that matters when 84% of traffic arrives from a video description.
 */

type Weights = { doc: number; js: number; css: number; font: number; media: number; total: number };

async function weigh(page: import("@playwright/test").Page, route: string): Promise<Weights> {
  await page.goto(route, { waitUntil: "networkidle" });
  return page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const w = { doc: nav.transferSize, js: 0, css: 0, font: 0, media: 0, total: 0 };
    for (const e of res) {
      if (/\.js(\?|$)/.test(e.name)) w.js += e.transferSize;
      else if (/\.css(\?|$)/.test(e.name)) w.css += e.transferSize;
      else if (/\.(woff2?|ttf)(\?|$)/.test(e.name)) w.font += e.transferSize;
      else if (/\.(png|jpe?g|webp|avif|svg|mp4)(\?|$)/.test(e.name) || e.name.includes("/_next/image"))
        w.media += e.transferSize;
    }
    w.total = w.doc + w.js + w.css + w.font + w.media;
    return w;
  });
}

const KB = 1024;

// Test 81: the homepage is the cold-start page and carries the whole shared
// payload, so it is the one worth budgeting hardest.
test("81 - the homepage stays under its weight budget", async ({ page }) => {
  const w = await weigh(page, "/");
  expect(w.font / KB, "fonts").toBeLessThan(70);
  expect(w.js / KB, "javascript").toBeLessThan(140);
  expect(w.total / KB, "total").toBeLessThan(280);
});

// Test 82: a guide page is pure server-rendered reading matter. It must not
// start shipping a runtime because someone reached for a client component to
// solve a layout problem.
test("82 - a guide page ships almost no javascript of its own", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" }); // warm the shared chunks
  const before = await page.evaluate(
    () =>
      (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
        .filter((e) => /\.js(\?|$)/.test(e.name))
        .reduce((a, e) => a + e.transferSize, 0),
  );
  expect(before).toBeGreaterThan(0);
  const w = await weigh(page, "/claude-code-tutorial");
  // Its own route chunk, not the shared runtime, which the homepage already paid for.
  expect(w.js / KB, "route javascript").toBeLessThan(140);
  expect(w.doc / KB, "server-rendered html").toBeGreaterThan(20);
});

// Test 83: no route may ship a font family it does not render. Three families
// were loaded and one of them (Inter) appeared on nothing: it was the body
// default and every element overrode it, so 47 kB was downloaded on every cold
// visit to render almost no text.
test("83 - only the fonts the design uses are downloaded", async ({ page }) => {
  const w = await weigh(page, "/claude-code-tutorial");
  const files = await page.evaluate(
    () =>
      (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
        .filter((e) => /\.woff2?(\?|$)/.test(e.name)).length,
  );
  expect(files, "font files").toBeLessThanOrEqual(2);
  expect(w.font / KB, "font bytes").toBeLessThan(70);
});

// Test 84: content paints fast. Guide pages are static HTML, so a slow first
// paint means something started blocking it.
test("84 - first contentful paint is prompt on a guide page", async ({ page }) => {
  await page.goto("/claude-cowork-outreach", { waitUntil: "load" });
  // The paint entry can land after the load event, so wait for it rather than
  // reading a buffer that may not have been filled yet.
  const fcp = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const seen = performance
          .getEntriesByType("paint")
          .find((p) => p.name === "first-contentful-paint");
        if (seen) return resolve(seen.startTime);
        new PerformanceObserver((list, obs) => {
          for (const e of list.getEntries()) {
            if (e.name === "first-contentful-paint") {
              obs.disconnect();
              resolve(e.startTime);
            }
          }
        }).observe({ type: "paint", buffered: true });
      }),
  );
  // Generous against a local server: this is a smoke alarm for a render-blocking
  // resource creeping in, not a Lighthouse score.
  expect(fcp, "first contentful paint (ms)").toBeLessThan(1500);
});
