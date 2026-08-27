import { test, expect, type Page } from "@playwright/test";

// Tests 66+: /reels, the library. Search, five range filters and
// the whole corpus as a wall of stills.
//
// It absorbed /viral-reels on 2026-08-25: that page was a search box over an
// empty screen and this one was the same corpus under two filters, which is two
// pages asking two halves of one question.
//
// Everything here is deterministic without a secret. The API guard rails all
// return before the route reaches OpenAI or Supabase, and the page renders its
// full shell (search box, five histograms, sliders) before any row arrives, so a
// key-free environment exercises the same code paths a live one does.
//
// The happy path (a query -> a wall of ranked reels) needs a live index and an
// embedding call, and is verified against the real project, not here.

const MOBILE_ONLY = (testInfo: { project: { name: string } }) =>
  test.skip(testInfo.project.name !== "mobile", "mobile only");

const MIN_TAP = 44;

/** The five filters, as the accessible names of their two thumbs. */
const FILTERS = [
  ["smallest audience", "largest audience"],
  ["oldest", "newest"],
  ["lowest entertaining", "highest entertaining"],
  ["lowest educational", "highest educational"],
  ["lowest inspirational", "highest inspirational"],
] as const;

async function settle(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

// ── API guard rails ──────────────────────────────────────────────────────────

test.describe("66 - library search api validation", () => {
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

  test("junk filters never reach the database as a question", async ({
    request,
  }) => {
    // Every one of these is malformed on its own scale, so each reads as unset.
    // The route must answer normally rather than 400 or 500: a hand-made request
    // cannot put an arbitrary value into a SQL filter.
    const res = await request.post("/api/viral-reels/search", {
      data: {
        query: "street interview",
        aud: "9-2",
        posted: "0-99",
        edu: "'; drop table reel_search; --",
        ent: 7,
        insp: null,
      },
    });
    expect([200, 429, 502, 503]).toContain(res.status());
    expect(res.status()).not.toBe(500);
  });
});

// ── The page ─────────────────────────────────────────────────────────────────

test("67 - library: the page is the search box, the five filters, nothing else", async ({
  page,
}) => {
  await settle(page, "/reels");
  await expect(page.locator("#library-query")).toBeVisible();
  await expect(page.getByRole("button", { name: "search" })).toBeVisible();

  // Oleg's five, by name. Worth studying and doing well are creator judgements
  // and stay on the creator page; they were dropped from here deliberately.
  for (const [min, max] of FILTERS) {
    await expect(page.getByRole("slider", { name: min })).toBeVisible();
    await expect(page.getByRole("slider", { name: max })).toBeVisible();
  }
  await expect(page.getByRole("slider")).toHaveCount(FILTERS.length * 2);
  await expect(page.getByRole("slider", { name: "worth studying", exact: false })).toHaveCount(0);

  // The whole point of the redesign: no shell, no copy, no links out.
  await expect(page.getByRole("link", { name: /oleg melnikov/i })).toHaveCount(0);
  await expect(page.getByTestId("see-all-resources")).toHaveCount(0);
  // The one heading is present for screen readers and search engines but takes
  // no space on screen. Playwright counts an sr-only clip as visible, so this
  // measures the box instead of asking.
  await expect(page.locator("h1")).toHaveCount(1);
  const h1 = await page.locator("h1").boundingBox();
  expect(h1!.height).toBeLessThanOrEqual(1);
});

test("68 - library: the search button is disabled until there is a query", async ({
  page,
}) => {
  await settle(page, "/reels");
  const button = page.getByRole("button", { name: "search" });
  await expect(button).toBeDisabled();
  await page.fill("#library-query", "a dog doing something funny");
  await expect(button).toBeEnabled();
});

test("69 - library: every filter draws a histogram, not a bare slider", async ({
  page,
}) => {
  await settle(page, "/reels");
  // One chart per filter, each labelled with what it is a spread of. Without
  // them a visitor has to guess where the library actually sits.
  const charts = page.getByRole("img", { name: /how the .* reels are spread/ });
  await expect(charts).toHaveCount(FILTERS.length);
});

test("70 - library: no em dashes in the copy", async ({ page }) => {
  await settle(page, "/reels");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/[–—]/);
});

// ── Mobile ───────────────────────────────────────────────────────────────────

test("71 - library: the query input is 16px so iOS does not zoom on focus", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/reels");
  const size = await page
    .locator("#library-query")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});

test("72 - library: the search controls and every thumb are >=44px tap targets", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/reels");

  const targets = [
    page.locator("#library-query"),
    page.getByRole("button", { name: "search" }),
    ...FILTERS.flatMap(([min, max]) => [
      page.getByRole("slider", { name: min }),
      page.getByRole("slider", { name: max }),
    ]),
  ];
  for (const t of targets) {
    const box = await t.boundingBox();
    expect(box, "tap target box").not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
  }
});

// ── The wall, its filters and its urls ───────────────────────────────────────

test.describe("73 - library browse api validation", () => {
  test("junk ranges and a junk page still answer, never 500", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/viral-reels/browse?page=-4&aud=99-1&posted=abc&edu=12-14",
    );
    // 503 with no key configured, 200 with one. Never a crash, and never a 400:
    // every parameter on this route reads as unset rather than being rejected.
    expect([200, 503]).toContain(res.status());
    if (res.status() === 200) {
      const json = await res.json();
      expect(json.page).toBe(1);
      expect(Array.isArray(json.results)).toBe(true);
      expect(json.results.length).toBeLessThanOrEqual(60);
    }
  });
});

test("74 - library: the url carries every filter, and junk reads as unset", async ({
  page,
}) => {
  await settle(page, "/reels?aud=2-8&posted=0-3&edu=4-8");
  await expect(page.getByRole("slider", { name: "smallest audience" })).toHaveValue("2");
  await expect(page.getByRole("slider", { name: "largest audience" })).toHaveValue("8");
  await expect(page.getByRole("slider", { name: "oldest" })).toHaveValue("0");
  await expect(page.getByRole("slider", { name: "newest" })).toHaveValue("3");
  // A score writes its own values, so edu=4-8 is thumbs 3 and 8.
  await expect(page.getByRole("slider", { name: "lowest educational" })).toHaveValue("3");
  await expect(page.getByRole("slider", { name: "highest educational" })).toHaveValue("8");
  // A filter that was never set is at full extent.
  await expect(page.getByRole("slider", { name: "lowest inspirational" })).toHaveValue("0");
  await expect(page.getByRole("slider", { name: "highest inspirational" })).toHaveValue("10");
  // And a set filter announces itself, so the reader can see the page is
  // narrowed without reading the address bar.
  await expect(page.getByText("clear filters")).toBeVisible();

  // Junk is unset, not clamped: a range nobody could have typed must not
  // silently answer a question nobody asked.
  await settle(page, "/reels?aud=9-2&edu=0-99&posted=7-7");
  for (const [min, max] of FILTERS) {
    const lo = Number(await page.getByRole("slider", { name: min }).inputValue());
    const hi = Number(await page.getByRole("slider", { name: max }).inputValue());
    expect(lo).toBe(0);
    expect(hi).toBeGreaterThan(lo);
  }
  await expect(page.getByText("clear filters")).toHaveCount(0);
});

test("74b - library: a ?q= link prefills the box", async ({ page }) => {
  await settle(page, "/reels?q=street%20interview");
  await expect(page.locator("#library-query")).toHaveValue("street interview");
});

test("74c - library: the filter count describes the whole library, not a page of it", async ({
  page,
}) => {
  // The bins that draw the histograms are shipped with the page, and PostgREST
  // caps a read at 1,000 rows however big the `limit` is. This shipped once
  // saying "1,000 reels" under a wall that paged to 4,896, which is a chart
  // describing a fifth of the library while the number beside it came from the
  // database. Nothing but real data can catch it.
  await settle(page, "/reels");
  const line = (await page.locator("[aria-live='polite']").first().innerText()).trim();
  test.skip(!line, "no database configured");

  const shipped = Number(line.replace(/[^0-9]/g, ""));
  const pageLine = await page.getByText(/page \d+ of \d+/).first().innerText();
  const pages = Number(pageLine.split(" of ")[1]);
  // The wall pages at 60, so the library holds more than (pages - 1) * 60. The
  // bins have to cover at least that many reels.
  expect(shipped).toBeGreaterThan((pages - 1) * 60);
});

test("75 - viral reels: the two pages reach each other", async ({ page }) => {
  // Both carry the same nav, so either can reach the other in one click. Walk
  // the ring.
  const nav = () => page.getByRole("navigation", { name: "viral reels" });
  await settle(page, "/reels");
  await nav().getByRole("link", { name: "creators" }).click();
  await expect(page).toHaveURL(/\/creators$/);
  await nav().getByRole("link", { name: "reels" }).click();
  await expect(page).toHaveURL(/\/reels$/);
  // The search tab is gone (the library has the box) and so is the ideas chat.
  await expect(nav().getByRole("link", { name: "search" })).toHaveCount(0);
  await expect(nav().getByRole("link", { name: "ideas" })).toHaveCount(0);
  await expect(nav().getByRole("link")).toHaveCount(2);
});

test("75b - every retired url still resolves", async ({ page }) => {
  // All of them were linked and are in a sitemap Google already fetched, so
  // each has to land on a live page rather than 404.
  for (const from of ["/viral-reels/browse", "/viral-reels", "/viral-reels-browse"]) {
    await page.goto(from);
    await expect(page).toHaveURL(/\/reels$/);
  }
  await page.goto("/viral-reels-ideas");
  await expect(page).toHaveURL(/\/reels$/);
  await page.goto("/viral-reels-creators");
  await expect(page).toHaveURL(/\/creators$/);
});

test("76 - library: dragging a thumb narrows the count and writes the url", async ({
  page,
}) => {
  await settle(page, "/reels");
  const before = await page.locator("[aria-live='polite']").first().innerText();

  // Straight to the keyboard: it is the same code path a drag takes and it does
  // not depend on where the thumb happens to sit in pixels.
  const thumb = page.getByRole("slider", { name: "lowest educational" });
  await thumb.focus();
  for (let i = 0; i < 5; i++) await thumb.press("ArrowRight");

  await expect(page).toHaveURL(/edu=6-10/);
  await expect(page.getByText("clear filters")).toBeVisible();
  // The count is computed in the browser off the shipped bins, so it is already
  // right before any request comes back. With no database configured there are
  // no bins and the line stays empty, which is why this only asserts a change
  // when there was something to change.
  if (before.trim()) {
    await expect(page.locator("[aria-live='polite']").first()).not.toHaveText(before);
  }
});

test("77 - library: clearing puts every thumb back", async ({ page }) => {
  await settle(page, "/reels?aud=2-8&edu=4-8");
  await page.getByText("clear filters").click();
  await expect(page.getByText("clear filters")).toHaveCount(0);
  for (const [min] of FILTERS) {
    await expect(page.getByRole("slider", { name: min })).toHaveValue("0");
  }
  // And the url says so too, or a reload would bring the filters back.
  await expect(page).not.toHaveURL(/aud=|edu=/);
});

test("78 - library: a thumb can never be dragged onto the other one", async ({
  page,
}) => {
  // A collapsed pair highlights no bars while the query it builds is
  // open-ended, which is the one state where the chart and the results
  // disagree. The slider itself is what prevents it.
  await settle(page, "/reels");
  const min = page.getByRole("slider", { name: "lowest entertaining" });
  await min.focus();
  for (let i = 0; i < 15; i++) await min.press("ArrowRight");
  const lo = Number(await min.inputValue());
  const hi = Number(
    await page.getByRole("slider", { name: "highest entertaining" }).inputValue(),
  );
  expect(lo).toBeLessThan(hi);
});


// ── the scrolling wall ───────────────────────────────────────────────────────
//
// A search answers with up to 120 reels in one payload and the wall draws 24 of
// them, another 24 each time the bottom comes into view. Deterministic here
// because the answer is mocked: what is being tested is the reveal, not the
// ranking.

/** `n` tile rows, the shape /api/viral-reels/search actually answers with. */
function tileRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    shortcode: `TILE${i}`,
    url: `https://www.instagram.com/p/TILE${i}/`,
    account: "someone",
    creator: "Someone",
    posted_on: "2026-08-01",
    score: 12.5,
    views: 1_000_000 - i,
    likes: 10_000,
    // Null on purpose: a tile with no thumbnail draws its placeholder and the
    // test makes no network request for an image.
    thumb_url: null,
    similarity: 0.4 - i * 0.001,
  }));
}

async function mockSearch(page: Page, n: number) {
  await page.route("**/api/viral-reels/search", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ query: "test", results: tileRows(n) }),
    });
  });
}

async function toBottom(page: Page) {
  await page.evaluate(() => globalThis.scrollTo(0, document.body.scrollHeight));
}

test("88 - the library wall reveals 24 at a time and stops at 120", async ({
  page,
}) => {
  await mockSearch(page, 120);
  await settle(page, "/reels?q=test");

  const tiles = page.getByRole("article");
  await expect(tiles).toHaveCount(24);
  // The count above the wall is the whole answer, not the part drawn.
  await expect(page.getByText("the 120 closest reels to that")).toBeVisible();

  for (const expected of [48, 72, 96, 120]) {
    await toBottom(page);
    await expect(tiles).toHaveCount(expected);
  }

  // And there it ends. The sentinel leaves the tree at the cap, so scrolling
  // again reveals nothing and asks for nothing.
  await toBottom(page);
  await page.waitForTimeout(300);
  await expect(tiles).toHaveCount(120);
});

test("89 - a shorter answer stops where it runs out", async ({ page }) => {
  // 30 reels is one full screenful and six more, and the wall must not pad, spin
  // or keep a sentinel alive under them.
  await mockSearch(page, 30);
  await settle(page, "/reels?q=test");

  const tiles = page.getByRole("article");
  await expect(tiles).toHaveCount(24);
  await toBottom(page);
  await expect(tiles).toHaveCount(30);
  await toBottom(page);
  await page.waitForTimeout(300);
  await expect(tiles).toHaveCount(30);
});

test("90 - a second search starts at the top of its own answer", async ({
  page,
}) => {
  // Scroll depth belongs to an answer. Carrying it into the next one opens a
  // fresh search six rows down.
  await mockSearch(page, 120);
  await settle(page, "/reels?q=test");

  const tiles = page.getByRole("article");
  await toBottom(page);
  await expect(tiles).toHaveCount(48);

  await page.getByLabel("what is your reel about?").fill("something else");
  await page.getByRole("button", { name: "search" }).click();
  await expect(tiles).toHaveCount(24);
});
