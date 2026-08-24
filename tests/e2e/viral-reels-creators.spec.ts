import { test, expect, type Page } from "@playwright/test";

// Tests 88+: /viral-reels-creators, the semantic search over the PEOPLE behind
// the viral reel database, and the per-creator page it opens onto.
//
// Everything here is deterministic without a secret. The API guard rails all
// return before the route reaches OpenAI or Supabase, and the page renders its
// search box, its depth filter and its nav before any search runs, so a key-free
// environment exercises the same code paths a live one does.
//
// The happy path (a query -> twelve ranked creators, and a creator page with
// their reels in score order) needs a live index and an embedding call, and is
// verified by hand against the real project, not here.

const MOBILE_ONLY = (testInfo: { project: { name: string } }) =>
  test.skip(testInfo.project.name !== "mobile", "mobile only");

const MIN_TAP = 44;

async function settle(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

// ── API guard rails ──────────────────────────────────────────────────────────

test.describe("88 - creator search api validation", () => {
  test("a non-JSON body -> 400 bad_request", async ({ request }) => {
    // Raw Buffer so Playwright doesn't re-serialize the string into valid JSON.
    const res = await request.post("/api/viral-reels/creators", {
      data: Buffer.from("}{"),
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("bad_request");
  });

  test("no query -> 400 missing_query", async ({ request }) => {
    const res = await request.post("/api/viral-reels/creators", { data: {} });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("missing_query");
  });

  test("a whitespace-only query -> 400 missing_query", async ({ request }) => {
    const res = await request.post("/api/viral-reels/creators", {
      data: { query: "   \n\t " },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("missing_query");
  });

  test("a non-string query -> 400 missing_query", async ({ request }) => {
    const res = await request.post("/api/viral-reels/creators", {
      data: { query: { $ne: null } },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("missing_query");
  });

  test("an arbitrary depth is clamped to one of the four, never passed on", async ({
    request,
  }) => {
    const res = await request.post("/api/viral-reels/creators", {
      data: { query: "people who cook", minReels: 999 },
    });
    // 503 with no key configured, 200 with one. Never a crash, and never the 999.
    expect([200, 503]).toContain(res.status());
    if (res.status() === 200) {
      const json = await res.json();
      expect([1, 5, 20, 50]).toContain(json.minReels);
      expect(Array.isArray(json.results)).toBe(true);
    }
  });
});

// ── The page ─────────────────────────────────────────────────────────────────

test("89 - creators: the page is the search box, the depth filter and the roster", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  await expect(page.locator("#creator-query")).toBeVisible();
  await expect(page.getByRole("button", { name: "search" })).toBeVisible();
  await expect(page.getByRole("button", { name: "any", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "50+ reels" })).toBeVisible();

  // Same rule as the other reel pages: no shell, no copy, no links out.
  await expect(page.getByRole("link", { name: /oleg melnikov/i })).toHaveCount(0);
  await expect(page.getByTestId("see-all-resources")).toHaveCount(0);
  // The one heading is present for screen readers and search engines but takes
  // no space on screen. Playwright counts an sr-only clip as visible, so this
  // measures the box instead of asking.
  await expect(page.locator("h1")).toHaveCount(1);
  const h1 = await page.locator("h1").boundingBox();
  expect(h1!.height).toBeLessThanOrEqual(1);
});

test("90 - creators: the search button is disabled until there is a query", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  const button = page.getByRole("button", { name: "search" });
  await expect(button).toBeDisabled();
  await page.fill("#creator-query", "someone who films street interviews");
  await expect(button).toBeEnabled();
});

test("91 - creators: a ?q= link prefills the box and ?r= picks the depth", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators?q=fitness%20coaches&r=20");
  await expect(page.locator("#creator-query")).toHaveValue("fitness coaches");
  await expect(page.getByRole("button", { name: "20+ reels" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  // "any" is the default, and an unknown depth falls back to it rather than
  // reaching the RPC as an arbitrary threshold.
  await settle(page, "/viral-reels-creators?q=fitness%20coaches&r=13");
  await expect(
    page.getByRole("button", { name: "any", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("92 - creators: no em dashes in the copy", async ({ page }) => {
  await settle(page, "/viral-reels-creators");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/[–—]/);
});

// ── One creator ──────────────────────────────────────────────────────────────

test("93 - creators: a handle that is not a handle is a 404, not a query", async ({
  page,
}) => {
  // The URL segment reaches a PostgREST filter, so anything outside
  // [A-Za-z0-9._] must be refused before the database is asked about it.
  for (const bad of ["a%2Cb%29", "..%2F..%2Fetc", "a%20b"]) {
    const res = await page.goto(`/viral-reels-creators/${bad}`);
    expect(res!.status()).toBe(404);
  }
});

test("94 - creators: an unknown handle is a 404", async ({ page }) => {
  const res = await page.goto("/viral-reels-creators/definitely_not_a_creator_x9");
  // 404 with a live index (nobody by that name), 404 with no key either (the
  // page cannot be built at all). One answer, both ways.
  expect(res!.status()).toBe(404);
});

// ── Mobile ───────────────────────────────────────────────────────────────────

test("95 - creators: the query input is 16px so iOS does not zoom on focus", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/viral-reels-creators");
  const size = await page
    .locator("#creator-query")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});

test("96 - creators: the search controls are >=44px tap targets", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/viral-reels-creators");

  const targets = [
    page.locator("#creator-query"),
    page.getByRole("button", { name: "search" }),
    page.getByRole("button", { name: "any", exact: true }),
  ];
  for (const t of targets) {
    const box = await t.boundingBox();
    expect(box, "tap target box").not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
  }
});

// ── The filters ──────────────────────────────────────────────────────────────
//
// Tests 97+: the audience band and the three 1-10 value floors, added 2026-08-24.
// Every one of them is optional, and the point of these tests is that an unset
// filter is genuinely unset rather than a zero that quietly excludes every
// creator the scoring pass has not reached yet.

test("97 - creators: the filters render and start unset", async ({ page }) => {
  await settle(page, "/viral-reels-creators");
  await expect(
    page.getByRole("button", { name: "any size", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  for (const id of ["#f-entertaining", "#f-educational", "#f-inspirational"]) {
    await expect(page.locator(id)).toHaveValue("");
  }
  // Nothing is set, so there is nothing to clear. A permanent "clear filters"
  // beside untouched controls reads as though the page is already filtering.
  await expect(page.getByRole("button", { name: /clear filters/i })).toHaveCount(0);
});

test("98 - creators: a filtered URL selects its controls", async ({ page }) => {
  await settle(page, "/viral-reels-creators?band=3&edu=7&ent=5");
  await expect(
    page.getByRole("button", { name: "1M - 10M", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#f-educational")).toHaveValue("7");
  await expect(page.locator("#f-entertaining")).toHaveValue("5");
  await expect(page.locator("#f-inspirational")).toHaveValue("");
  await expect(page.getByRole("button", { name: /clear filters/i })).toBeVisible();
});

test("98b - creators: out-of-range filters fall back to unset, never clamped", async ({
  page,
}) => {
  // Clamping a 99 into "10+" would silently answer a question nobody asked and
  // return almost nothing, which reads as an empty database rather than as a
  // rejected input.
  await settle(page, "/viral-reels-creators?band=99&edu=99&ent=-3&insp=abc");
  await expect(
    page.getByRole("button", { name: "any size", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  for (const id of ["#f-entertaining", "#f-educational", "#f-inspirational"]) {
    await expect(page.locator(id)).toHaveValue("");
  }
});

test("99 - creators: an arbitrary filter never reaches the RPC", async ({
  request,
}) => {
  const res = await request.post("/api/viral-reels/creators", {
    data: {
      query: "people who cook",
      band: 999,
      minEducational: 99,
      minEntertaining: "; drop table creator_search",
      minInspirational: -1,
    },
  });
  expect([200, 503]).toContain(res.status());
  if (res.status() === 200) {
    const json = await res.json();
    expect(json.filters).toEqual({
      band: 0,
      minEntertaining: null,
      minEducational: null,
      minInspirational: null,
    });
  }
});

test("99b - creators: the filters survive a roster page link", async ({ page }) => {
  await settle(page, "/viral-reels-creators?band=2");
  const next = page.getByRole("link", { name: "more" });
  if ((await next.count()) && (await next.getAttribute("href"))) {
    // Paging must not silently drop the filter: page two of a filtered roster
    // has to still be filtered.
    expect(await next.getAttribute("href")).toContain("band=2");
  }
});

test("99c - creators: the filter selects are >=44px tap targets", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/viral-reels-creators");
  for (const id of ["#f-entertaining", "#f-educational", "#f-inspirational"]) {
    const box = await page.locator(id).boundingBox();
    expect(box, `tap target ${id}`).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
  }
  const band = await page
    .getByRole("button", { name: "any size", exact: true })
    .boundingBox();
  expect(band!.height).toBeGreaterThanOrEqual(MIN_TAP);
});
