import { test, expect } from "@playwright/test";
import { ROUTES, SHELL_ROUTES, FOOTER_ROUTES } from "./routes";

// Tests 1-6: route health across the whole site.

// Test 1: every route returns HTTP 200.
test("1 - every route responds 200", async ({ page }) => {
  for (const route of ROUTES) {
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res, `no response for ${route}`).not.toBeNull();
    expect(res!.status(), `${route} status`).toBe(200);
  }
});

// Test 2: every route renders exactly one <h1>.
test("2 - every route has exactly one h1", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const count = await page.locator("h1").count();
    expect(count, `${route} h1 count`).toBe(1);
  }
});

// Test 3: the header wordmark renders on every route.
test("3 - header wordmark present on every route", async ({ page }) => {
  for (const route of SHELL_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const wordmark = page.getByRole("link", { name: /oleg melnikov/i }).first();
    await expect(wordmark, `${route} wordmark`).toBeVisible();
  }
});

// Test 4: the cross-linked ResourceFooter renders on every
// resource/tool/lead-magnet/knowledge page. The wall of equal links is now
// collapsed behind a "see all free resources" disclosure, always present.
test("4 - resource footer renders on footer routes", async ({ page }) => {
  for (const route of FOOTER_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByTestId("see-all-resources"),
      `${route} footer`
    ).toBeVisible();
  }
});

// Test 5: no uncaught console errors on any route load.
test("5 - no console errors on load", async ({ page }) => {
  // Two independent buckets so an origin-scoped failure can never be dropped by
  // a third-party-noise text filter:
  //  - resourceFails: same-origin (localhost) responses with status >=400,
  //    classified by URL ORIGIN in the handler. These are ALWAYS meaningful; a
  //    same-origin path that merely contains a brand word (e.g. /youtube-x.svg)
  //    must not be filtered out.
  //  - consoleErrors: console.error messages, noise-filtered. A failed *resource*
  //    load only surfaces in the console as a generic, URL-less "Failed to load
  //    resource: ... 404", so that line is dropped here (the response listener
  //    already accounts for every failed request, with its URL and origin).
  const resourceFails: Record<string, string[]> = {};
  const consoleErrors: Record<string, string[]> = {};
  page.on("response", (resp) => {
    if (resp.status() < 400) return;
    const rurl = resp.url();
    let sameOrigin = false;
    try {
      // Port-agnostic (the suite may run on any $PORT, not just 3000).
      sameOrigin = new URL(rurl).origin === new URL(page.url()).origin;
    } catch {
      /* opaque/data URL — treat as third-party */
    }
    if (sameOrigin && !/\/favicon/i.test(rurl)) {
      (resourceFails[page.url()] ||= []).push(`resource ${resp.status()}: ${rurl}`);
    }
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      (consoleErrors[page.url()] ||= []).push(msg.text());
    }
  });
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
  }
  // Ignore noise from third-party embeds (YouTube iframes, analytics).
  const meaningfulConsole = Object.entries(consoleErrors)
    .map(([url, msgs]) => [
      url,
      msgs.filter(
        (m) =>
          !/youtube|ytimg|ggpht|plausible|googletagmanager|gstatic|doubleclick/i.test(m) &&
          // the bare, URL-less resource-load line; the response listener covers these
          !/failed to load resource/i.test(m) &&
          !/favicon/i.test(m) &&
          // permissions-policy noise emitted by the embedded YouTube iframes
          !/permissions policy|compute-pressure/i.test(m)
      ),
    ])
    .filter(([, msgs]) => (msgs as string[]).length > 0);

  const meaningfulResources = Object.entries(resourceFails).filter(
    ([, msgs]) => msgs.length > 0
  );

  expect(
    { console: meaningfulConsole, resources: meaningfulResources },
    JSON.stringify({ console: meaningfulConsole, resources: meaningfulResources }, null, 2)
  ).toEqual({ console: [], resources: [] });
});

// Test 6: homepage section anchors resolve.
test("6 - homepage section anchors exist", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const id of ["about", "results", "watch", "connect"]) {
    await expect(page.locator(`#${id}`), `#${id}`).toHaveCount(1);
  }
});
