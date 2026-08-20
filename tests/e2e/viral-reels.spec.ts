import { test, expect, type Page } from "@playwright/test";

// Tests 66+: /viral-reels, the semantic search over the viral reel database.
//
// Everything here is deterministic without a secret. The API guard rails all
// return before the route reaches OpenAI or Supabase, and the page renders its
// full shell (hero, search box, example chips) before any search runs, so a
// key-free environment exercises the same code paths a live one does.
//
// The happy path (a query -> three ranked cards) needs a live index and an
// embedding call, and is verified by hand against the real project, not here.

const MOBILE_ONLY = (testInfo: { project: { name: string } }) =>
  test.skip(testInfo.project.name !== "mobile", "mobile only");

const MIN_TAP = 44;

async function settle(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

// ── API guard rails ──────────────────────────────────────────────────────────

test.describe("66 - viral reels api validation", () => {
  test("a non-JSON body -> 400 bad_request", async ({ request }) => {
    // Raw Buffer so Playwright doesn't re-serialize the string into valid JSON.
    const res = await request.post("/api/viral-reels/search", {
      data: Buffer.from("}{"),
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("bad_request");
  });

  test("no query -> 400 missing_query", async ({ request }) => {
    const res = await request.post("/api/viral-reels/search", { data: {} });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("missing_query");
  });

  test("a whitespace-only query -> 400 missing_query", async ({ request }) => {
    const res = await request.post("/api/viral-reels/search", {
      data: { query: "   \n\t " },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("missing_query");
  });

  test("a non-string query -> 400 missing_query", async ({ request }) => {
    const res = await request.post("/api/viral-reels/search", {
      data: { query: { $ne: null } },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("missing_query");
  });
});

// ── The page ─────────────────────────────────────────────────────────────────

test("67 - viral reels: the page is the search box and the window filter, nothing else", async ({
  page,
}) => {
  await settle(page, "/viral-reels");
  await expect(page.locator("#reel-query")).toBeVisible();
  await expect(page.getByRole("button", { name: "search" })).toBeVisible();
  await expect(page.getByRole("button", { name: "all time" })).toBeVisible();
  await expect(page.getByRole("button", { name: "7 days" })).toBeVisible();

  // The whole point of the redesign: no shell, no copy, no links out.
  await expect(page.getByRole("link", { name: /oleg melnikov/i })).toHaveCount(
    0,
  );
  await expect(page.getByTestId("see-all-resources")).toHaveCount(0);
  // The one heading is present for screen readers and search engines but takes
  // no space on screen. Playwright counts an sr-only clip as visible, so this
  // measures the box instead of asking.
  await expect(page.locator("h1")).toHaveCount(1);
  const h1 = await page.locator("h1").boundingBox();
  expect(h1!.height).toBeLessThanOrEqual(1);
});

test("68 - viral reels: the search button is disabled until there is a query", async ({
  page,
}) => {
  await settle(page, "/viral-reels");
  const button = page.getByRole("button", { name: "search" });
  await expect(button).toBeDisabled();
  await page.fill("#reel-query", "a dog doing something funny");
  await expect(button).toBeEnabled();
});

test("69 - viral reels: a ?q= link prefills the box and ?d= picks the window", async ({
  page,
}) => {
  await settle(page, "/viral-reels?q=street%20interview&d=30");
  await expect(page.locator("#reel-query")).toHaveValue("street interview");
  await expect(page.getByRole("button", { name: "30 days" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  // All time is the default, and an unknown window falls back to it.
  await settle(page, "/viral-reels?q=street%20interview&d=13");
  await expect(page.getByRole("button", { name: "all time" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("70 - viral reels: no em dashes in the copy", async ({ page }) => {
  await settle(page, "/viral-reels");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/[–—]/);
});

// ── Mobile ───────────────────────────────────────────────────────────────────

test("71 - viral reels: the query input is 16px so iOS does not zoom on focus", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/viral-reels");
  const size = await page
    .locator("#reel-query")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});

test("72 - viral reels: the search controls are >=44px tap targets", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/viral-reels");

  const targets = [
    page.locator("#reel-query"),
    page.getByRole("button", { name: "search" }),
    page.getByRole("button", { name: "all time" }),
  ];
  for (const t of targets) {
    const box = await t.boundingBox();
    expect(box, "tap target box").not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
  }
});

// ── /viral-reels/browse: the whole library, filtered and paged ───────────────
//
// Same deal as above: everything here is deterministic without a secret. With
// no Supabase key the page renders its filters and says the library is not
// connected, which is the same DOM a live environment builds before its rows
// arrive.

test.describe("73 - viral reels browse api validation", () => {
  test("an unknown window and a junk page still answer, never 500", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/viral-reels/browse?d=13&page=-4&fmin=99&fmax=abc",
    );
    // 503 with no key configured, 200 with one. Never a crash, and never a 400:
    // every parameter on this route is clamped rather than rejected.
    expect([200, 503]).toContain(res.status());
    const json = await res.json();
    if (res.status() === 200) {
      expect(json.days).toBeNull();
      expect(json.page).toBe(1);
      expect(json.minIndex).toBeLessThanOrEqual(json.maxIndex);
      expect(Array.isArray(json.results)).toBe(true);
      expect(json.results.length).toBeLessThanOrEqual(20);
    }
  });
});

test("74 - viral reels browse: filters render, and the page stays bare", async ({
  page,
}) => {
  await settle(page, "/viral-reels/browse");
  await expect(
    page.getByRole("group", { name: "how new the reel is" }),
  ).toBeVisible();
  await expect(
    page.getByRole("slider", { name: "smallest audience" }),
  ).toBeVisible();
  await expect(
    page.getByRole("slider", { name: "largest audience" }),
  ).toBeVisible();
  // No shell, exactly like the search page.
  await expect(page.getByTestId("see-all-resources")).toHaveCount(0);
  await expect(page.locator("h1")).toHaveCount(1);
  const h1 = await page.locator("h1").boundingBox();
  expect(h1!.height).toBeLessThanOrEqual(1);
});

test("75 - viral reels browse: the two pages link to each other", async ({
  page,
}) => {
  await settle(page, "/viral-reels");
  await page.getByRole("link", { name: "browse all" }).click();
  await expect(page).toHaveURL(/\/viral-reels\/browse/);
  await page.getByRole("link", { name: "search instead" }).click();
  await expect(page).toHaveURL(/\/viral-reels(\?|$)/);
});

test("76 - viral reels browse: the url carries the filters", async ({
  page,
}) => {
  await settle(page, "/viral-reels/browse?d=90&fmin=2&fmax=8");
  await expect(page.getByRole("button", { name: "90 days" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByRole("slider", { name: "smallest audience" }),
  ).toHaveValue("2");
  await expect(
    page.getByRole("slider", { name: "largest audience" }),
  ).toHaveValue("8");
  // A min dragged past the max is clamped, not accepted, so the pair the page
  // renders is always a range the database can answer.
  await settle(page, "/viral-reels/browse?fmin=9&fmax=3");
  const min = Number(
    await page.getByRole("slider", { name: "smallest audience" }).inputValue(),
  );
  const max = Number(
    await page.getByRole("slider", { name: "largest audience" }).inputValue(),
  );
  expect(min).toBeLessThanOrEqual(max);
});

test("77 - viral reels browse: no em dashes in the copy", async ({ page }) => {
  await settle(page, "/viral-reels/browse");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/[–—]/);
});

test("78 - viral reels browse: the window pills are >=44px tap targets", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/viral-reels/browse");
  for (const name of ["all time", "30 days"]) {
    const box = await page.getByRole("button", { name }).boundingBox();
    expect(box, `tap target ${name}`).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
  }
});
