import { test, expect, type Page } from "@playwright/test";

// Tests 88+: /viral-reels-creators, the semantic search over the PEOPLE behind
// the viral reel database, and the per-creator page it opens onto.
//
// Everything here is deterministic without a secret. The API guard rails all
// return before the route reaches OpenAI or Supabase, and the page renders its
// search box, its four range filters and its nav before any search runs, so a
// key-free environment exercises the same code paths a live one does. The
// filters are drawn from the scales, not from the data, so every structural
// assertion below holds with an empty index too.
//
// The happy path (a query -> twelve ranked creators, and a creator page with
// their reels in score order) needs a live index and an embedding call, and is
// verified by hand against the real project, not here.

const MOBILE_ONLY = (testInfo: { project: { name: string } }) =>
  test.skip(testInfo.project.name !== "mobile", "mobile only");

const MIN_TAP = 44;

/**
 * Every filter, as its URL param and its top thumb position.
 *
 * The param is the identifier a filter carries everywhere: in the address bar,
 * in the API body, and in the test id the slider renders. The reel library names
 * its filters the same way, so one convention covers both pages.
 */
const SCALE_TOPS = [
  ["aud", 12],
  ["worth", 10],
  ["form", 10],
  ["ent", 10],
  ["edu", 10],
  ["insp", 10],
] as const;

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

  test("a malformed range is dropped, never passed on", async ({ request }) => {
    const res = await request.post("/api/viral-reels/creators", {
      data: { query: "people who cook", aud: "not-a-range", edu: { $ne: null } },
    });
    // 503 with no key configured, 200 with one. Never a crash.
    expect([200, 503]).toContain(res.status());
    if (res.status() === 200) {
      const json = await res.json();
      expect(json.filters.followers).toEqual([0, 12]);
      expect(json.filters.educational).toEqual([0, 10]);
      expect(Array.isArray(json.results)).toBe(true);
    }
  });
});

// ── The page ─────────────────────────────────────────────────────────────────

test("89 - creators: the page is the search box, the filters and the roster", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  await expect(page.locator("#creator-query")).toBeVisible();
  await expect(page.getByRole("button", { name: "search" })).toBeVisible();
  // Six ranges, twelve thumbs: audience, worth studying, doing well now, and
  // the three 1-10 reads. The reel-count filter was removed outright.
  await expect(page.locator("input[type=range]")).toHaveCount(12);
  await expect(page.getByRole("button", { name: /reels$/ })).toHaveCount(0);

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

test("91 - creators: a ?q= link prefills the box", async ({ page }) => {
  await settle(page, "/viral-reels-creators?q=fitness%20coaches");
  await expect(page.locator("#creator-query")).toHaveValue("fitness coaches");
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
  ];
  for (const t of targets) {
    const box = await t.boundingBox();
    expect(box, "tap target box").not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
  }
});

// ── The filters ──────────────────────────────────────────────────────────────
//
// Tests 97+: four range filters, drawn as histograms with two thumbs across
// them, rewritten from the min-only floors on 2026-08-24.
//
// Two rules carry the feature and both are tested here. Every filter is
// OPTIONAL, so an untouched one sits at full extent and asks nothing rather
// than quietly excluding every creator the scoring pass has not reached yet.
// And the filters COMPOSE: each histogram counts only the creators the other
// three allow, so the shape on screen describes what is actually left.

/** The bar counts a chart is drawn from, read off its own label. */
async function chartTotal(page: Page, label: string): Promise<number> {
  const text = await page
    .getByRole("img", { name: new RegExp(`^${label}:`) })
    .getAttribute("aria-label");
  return Number(/how the (\d+) creators/.exec(text ?? "")?.[1] ?? -1);
}

test("97 - creators: the filters render and start unset", async ({ page }) => {
  await settle(page, "/viral-reels-creators");

  // Both thumbs at the ends of their tracks on all six scales: 0 to 12 on the
  // audience ladder, 0 to 10 on each 1-10 scale.
  for (const [param, top] of SCALE_TOPS) {
    await expect(page.getByTestId(`range-${param}-min`)).toHaveValue("0");
    await expect(page.getByTestId(`range-${param}-max`)).toHaveValue(String(top));
  }
  await expect(page.getByText("any size")).toBeVisible();

  // Nothing is set, so there is nothing to clear. A permanent "clear filters"
  // beside untouched controls reads as though the page is already filtering.
  await expect(page.getByRole("button", { name: /clear filters/i })).toHaveCount(0);
});

test("98 - creators: a filtered URL positions the thumbs", async ({ page }) => {
  // The audience ladder carries thumb indices; the 1-10 scales carry their real
  // values, so "edu=4-8" reads as the sentence it is. A top thumb is one past
  // the last value inside the range, because a bar covers [edge, nextEdge).
  await settle(page, "/viral-reels-creators?aud=3-9&edu=4-8");
  await expect(page.getByTestId("range-aud-min")).toHaveValue("3");
  await expect(page.getByTestId("range-aud-max")).toHaveValue("9");
  await expect(page.getByTestId("range-edu-min")).toHaveValue("3");
  await expect(page.getByTestId("range-edu-max")).toHaveValue("8");
  await expect(page.getByText("100K to 10M")).toBeVisible();
  await expect(page.getByText("4 to 8")).toBeVisible();

  // Untouched, and saying so.
  await expect(page.getByTestId("range-ent-min")).toHaveValue("0");
  await expect(page.getByTestId("range-ent-max")).toHaveValue("10");
  await expect(page.getByRole("button", { name: /clear filters/i })).toBeVisible();
});

test("98b - creators: a junk range falls back to unset, never clamped", async ({
  page,
}) => {
  // Clamping would silently answer a question nobody asked and return almost
  // nothing, which reads as an empty database rather than as a rejected input.
  // The backwards pair is the one that matters: it is the only junk a real
  // control could ever emit.
  await settle(page, "/viral-reels-creators?aud=9-3&edu=99-1&ent=abc&insp=");
  for (const [param, top] of SCALE_TOPS) {
    await expect(page.getByTestId(`range-${param}-min`)).toHaveValue("0");
    await expect(page.getByTestId(`range-${param}-max`)).toHaveValue(String(top));
  }
  await expect(page.getByRole("button", { name: /clear filters/i })).toHaveCount(0);
});

test("98c - creators: a filter redraws the other histograms, never its own", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  const wholeIndex = await chartTotal(page, "audience size");
  test.skip(wholeIndex <= 0, "needs a live index");

  const eduBefore = await chartTotal(page, "educational");

  const min = page.getByTestId("range-aud-min");
  await min.focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
  await expect(min).toHaveValue("5");

  // The other charts describe the creators this filter left behind. That is the
  // whole point of the cross-filter: the next filter is chosen against what is
  // actually left rather than against a library that is no longer on screen.
  expect(await chartTotal(page, "educational")).toBeLessThan(eduBefore);
  // Its own chart does not move, or dragging a thumb would eat the bars it is
  // being dragged across.
  expect(await chartTotal(page, "audience size")).toBe(wholeIndex);
});

test("98d - creators: moving a thumb narrows the count and writes the URL", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  test.skip((await chartTotal(page, "audience size")) <= 0, "needs a live index");

  const max = page.getByTestId("range-edu-max");
  await max.focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowLeft");
  await expect(max).toHaveValue("6");
  await expect(page.getByText("6 or less")).toBeVisible();

  // Shareable, and without a page load: the roster is re-fetched, not reloaded.
  await expect(page).toHaveURL(/edu=1-6/);
  await expect(page.getByText(/of \d+ creators match/)).toBeVisible();

  await page.getByRole("button", { name: /clear filters/i }).click();
  await expect(page.getByTestId("range-edu-max")).toHaveValue("10");
  await expect(page).not.toHaveURL(/edu=/);
});

test("98e - creators: opening a creator and coming back keeps the filters", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  test.skip((await chartTotal(page, "audience size")) <= 0, "needs a live index");

  const min = page.getByTestId("range-aud-min");
  await min.focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/aud=5-12/);
  const narrowed = await page.getByText(/of \d+ creators match/).innerText();

  // Click somewhere neutral first: the roster is still settling from the
  // filter, and a row that is replaced between mousedown and mouseup eats the
  // click. A person pauses; a test has to say so.
  await page.mouse.click(10, 10);
  const card = page.locator("a[href^='/viral-reels-creators/']").first();
  const href = await card.getAttribute("href");
  await card.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));

  // The filters are written with replaceState, so the router's cached entry for
  // this route is the render the server did for the UNFILTERED url. Back serves
  // that: right address, every thumb reset. The URL has to win.
  await page.goBack();
  await expect(page).toHaveURL(/aud=5-12/);
  await expect(page.getByTestId("range-aud-min")).toHaveValue("5");
  await expect(page.getByText("500K+")).toBeVisible();
  await expect(page.getByText(/of \d+ creators match/)).toHaveText(narrowed);
  await expect(page.getByRole("button", { name: /clear filters/i })).toBeVisible();
});

test("99 - creators: an arbitrary range never reaches the RPC", async ({
  request,
}) => {
  const res = await request.post("/api/viral-reels/creators", {
    data: {
      query: "people who cook",
      aud: "0-999",
      edu: "; drop table creator_search",
      ent: "-1-4",
      insp: "8-2",
    },
  });
  expect([200, 503]).toContain(res.status());
  if (res.status() === 200) {
    const json = await res.json();
    expect(json.filters).toEqual({
      followers: [0, 12],
      worth_studying: [0, 10],
      form: [0, 10],
      entertaining: [0, 10],
      educational: [0, 10],
      inspirational: [0, 10],
    });
  }
});

test("99b - creators: the filters survive a roster page link", async ({ page }) => {
  await settle(page, "/viral-reels-creators?aud=0-6");
  const next = page.getByRole("link", { name: "more" });
  if ((await next.count()) && (await next.getAttribute("href"))) {
    // Paging must not silently drop the filter: page two of a filtered roster
    // has to still be filtered.
    expect(await next.getAttribute("href")).toContain("aud=0-6");
  }
});

test("99c - creators: the range tracks are >=44px tap targets", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/viral-reels-creators");
  for (const [param] of SCALE_TOPS) {
    for (const end of ["min", "max"]) {
      const box = await page.getByTestId(`range-${param}-${end}`).boundingBox();
      expect(box, `tap target ${param} ${end}`).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
    }
  }
});

test("99d - creators: the roster survives an unreachable filter", async ({
  page,
}) => {
  // Nobody is 10 out of 10 on all three scales at once. An empty answer has to
  // read as an empty answer rather than as a broken page.
  await settle(page, "/viral-reels-creators?ent=10-10&edu=10-10&insp=10-10");
  await expect(page.locator("input[type=range]")).toHaveCount(12);
  await expect(page.getByRole("button", { name: /clear filters/i })).toBeVisible();
});

// ── the creator's own page: Instagram's grid ─────────────────────────────────
//
// These need a live index, because a grid with nothing in it proves nothing.
// They skip rather than fail without one, the same way the filter tests do.

async function openFirstCreator(page: Page): Promise<boolean> {
  await settle(page, "/viral-reels-creators");
  const card = page.locator("a[href^='/viral-reels-creators/']").first();
  if ((await card.count()) === 0) return false;
  await card.click();
  await page.waitForURL(/\/viral-reels-creators\/[^/]+$/);
  return (await page.locator("main div.grid > a").count()) > 0;
}

test("100 - a creator's reels are a grid of 9:16 thumbnails, four to a row", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop widths");
  test.skip(!(await openFirstCreator(page)), "needs a live index");

  const tiles = page.locator("main div.grid > a");
  const first = (await tiles.first().boundingBox())!;

  // 9:16, the shape of a reel, within a pixel of rounding.
  expect(Math.abs(first.height / first.width - 16 / 9)).toBeLessThan(0.02);

  // Big. The old row gave the thumbnail 50px; the point of the redesign is that
  // the picture is the page.
  expect(first.width).toBeGreaterThan(200);

  // Four to a row: the fifth tile is the one that starts a new line.
  const tops = await tiles.evaluateAll((els) =>
    els.slice(0, 8).map((e) => Math.round(e.getBoundingClientRect().top)),
  );
  expect(new Set(tops.slice(0, 4)).size).toBe(1);
  expect(tops[4]).toBeGreaterThan(tops[0]);
});

test("101 - every tile carries views, likes and a date, and nothing else", async ({
  page,
}) => {
  test.skip(!(await openFirstCreator(page)), "needs a live index");

  const strip = page.locator("main div.grid > a div.backdrop-blur-md").first();
  await expect(strip).toBeVisible();

  // Three numbers, addressed by name rather than by their place among the
  // strip's children. A fourth would be the comment count or the outlier score
  // creeping back on, which is exactly what Oleg asked to be rid of here: on one
  // creator's page the audience is a constant, so the score normalises nothing.
  await expect(strip.locator("[data-field]")).toHaveCount(3);
  for (const field of ["views", "date", "likes"]) {
    await expect(strip.locator(`[data-field="${field}"]`)).toHaveCount(1);
  }
  await expect(strip.locator('[data-field="score"]')).toHaveCount(0);

  // The age is relative and coarse: today, yesterday, or N of one unit. Never a
  // calendar date, which makes the reader do the subtraction themselves.
  const dates = await page
    .locator('main div.grid > a [data-field="date"]')
    .allInnerTexts();
  expect(dates.length).toBeGreaterThan(0);
  for (const d of dates) {
    expect(d).toMatch(/^(-|today|yesterday|\d+ (day|week|month|year)s? ago)$/);
  }
});

test("102 - every stats strip is the same height", async ({ page }) => {
  test.skip(!(await openFirstCreator(page)), "needs a live index");

  // Two fixed rows at every width, on purpose. What must not happen is SOME
  // tiles wrapping and others not: "today" is a lot narrower than "3 weeks ago",
  // a credit line is wider than both, and a strip taller than its neighbours
  // reads as a bug rather than as a long number. This is the assertion that
  // caught it when the credit line was added.
  const heights = await page
    .locator("main div.grid > a div.backdrop-blur-md")
    .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
  expect(heights.length).toBeGreaterThan(0);
  expect(new Set(heights).size).toBe(1);
});

test("103 - a tile opens the reel on instagram, in a new tab", async ({ page }) => {
  test.skip(!(await openFirstCreator(page)), "needs a live index");

  const tile = page.locator("main div.grid > a").first();
  await expect(tile).toHaveAttribute("href", /instagram\.com\//);
  await expect(tile).toHaveAttribute("target", "_blank");
  await expect(tile).toHaveAttribute("rel", /noopener/);
});

test("104 - a creator opens newest first, and the order is a switch", async ({
  page,
}) => {
  test.skip(!(await openFirstCreator(page)), "needs a live index");

  const dates = () =>
    page.locator('main div.grid > a [data-field="date"]').allInnerTexts();
  // The strip says "3 weeks ago", so age is compared in days. Coarse on
  // purpose: it only has to be monotonic, and two reels from the same week
  // legitimately read the same.
  const UNIT: Record<string, number> = { day: 1, week: 7, month: 30, year: 365 };
  const stamp = (d: string) => {
    if (d === "today") return 0;
    if (d === "yesterday") return 1;
    const [n, unit] = d.split(" ");
    return Number(n) * UNIT[unit.replace(/s$/, "")];
  };
  const views = () =>
    page.locator('main div.grid > a [data-field="views"]').allInnerTexts();

  // Default: newest first, no ?sort= in the address.
  await expect(page).not.toHaveURL(/sort=/);
  const ages = (await dates()).filter((d) => d !== "-").map(stamp);
  expect(ages.length).toBeGreaterThan(0);
  for (let i = 1; i < ages.length; i++) {
    expect(ages[i], `reel ${i} is not older than the one above it`).toBeGreaterThanOrEqual(
      ages[i - 1],
    );
  }

  // The other order is one click away and says so in the URL.
  const newest = await views();
  await page.getByRole("link", { name: "most viewed" }).click();
  await page.waitForURL(/sort=views/);
  const popular = await views();
  expect(popular).not.toEqual(newest);

  // And back, to the bare address rather than to ?sort=new.
  await page.getByRole("link", { name: "newest first" }).click();
  await page.waitForURL(/\/viral-reels-creators\/[^/?]+$/);
  expect(await views()).toEqual(newest);
});

test("105 - a junk sort falls back to newest, and paging keeps the order", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  const href = await page
    .locator("a[href^='/viral-reels-creators/']")
    .first()
    .getAttribute("href");
  test.skip(!href, "needs a live index");

  await settle(page, `${href}?sort=nonsense`);
  await expect(page.getByRole("link", { name: "newest first" })).toHaveAttribute(
    "aria-current",
    "true",
  );

  // Every page link past the first carries the order, or page two silently
  // reorders under the visitor.
  await settle(page, `${href}?sort=views`);
  const next = page.getByRole("link", { name: /less viewed|older/ });
  if (await next.count()) await expect(next).toHaveAttribute("href", /sort=views/);
});

test("106 - a creator's header carries the three ratings and one link out", async ({
  page,
}) => {
  test.skip(!(await openFirstCreator(page)), "needs a live index");

  const header = page.locator("main header");
  for (const label of ["entertaining", "educational", "inspirational"]) {
    await expect(header.getByText(label, { exact: true })).toBeVisible();
  }

  // Dropped on purpose: a cumulative view count of whatever happens to be in
  // the database is not a fact about the creator, and the newest reel's date is
  // the first tile of the grid.
  await expect(header.getByText("views in here")).toHaveCount(0);
  await expect(header.getByText("newest", { exact: true })).toHaveCount(0);

  // Exactly one way out to Instagram from the header, and it is the handle.
  const out = header.locator("a[href*='instagram.com']");
  await expect(out).toHaveCount(1);
  await expect(out).toContainText("@");
});

// ── the scrolling list ───────────────────────────────────────────────────────
//
// A search answers with up to 50 creators in one payload and the list draws ten
// of them, another ten each time the bottom comes into view. Deterministic here
// because the answer is mocked: what is being tested is the reveal, not the
// ranking.

/** `n` card rows, the shape /api/viral-reels/creators actually answers with. */
function cardRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    account: `creator${i}`,
    name: `Creator ${i}`,
    profile_url: `https://www.instagram.com/creator${i}/`,
    bio: "makes things",
    niche: "ai, tools",
    followers: 100_000 - i,
    verified: false,
    best_views: 2_000_000,
    total_views: 40_000_000,
    // Null on purpose: a card with no avatar draws its placeholder and the test
    // makes no network request for an image.
    avatar_url: null,
    similarity: 0.5 - i * 0.002,
  }));
}

async function mockCreatorSearch(page: Page, n: number) {
  await page.route("**/api/viral-reels/creators", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ query: "ai", filters: {}, results: cardRows(n) }),
    });
  });
}

async function toBottom(page: Page) {
  await page.evaluate(() => globalThis.scrollTo(0, document.body.scrollHeight));
}

test("107 - the creator list reveals 10 at a time and stops at 50", async ({
  page,
}) => {
  await mockCreatorSearch(page, 50);
  await settle(page, "/viral-reels-creators?q=ai");

  const cards = page.getByRole("article");
  await expect(cards).toHaveCount(10);

  for (const expected of [20, 30, 40, 50]) {
    await toBottom(page);
    await expect(cards).toHaveCount(expected);
  }

  // And there it ends. The sentinel leaves the tree at the cap, so scrolling
  // again reveals nothing and asks for nothing.
  await toBottom(page);
  await page.waitForTimeout(300);
  await expect(cards).toHaveCount(50);
});

test("108 - a shorter creator answer stops where it runs out", async ({
  page,
}) => {
  await mockCreatorSearch(page, 14);
  await settle(page, "/viral-reels-creators?q=ai");

  const cards = page.getByRole("article");
  await expect(cards).toHaveCount(10);
  await toBottom(page);
  await expect(cards).toHaveCount(14);
  await toBottom(page);
  await page.waitForTimeout(300);
  await expect(cards).toHaveCount(14);
});

test("109 - a second creator search starts at the top of its own answer", async ({
  page,
}) => {
  await mockCreatorSearch(page, 50);
  await settle(page, "/viral-reels-creators?q=ai");

  const cards = page.getByRole("article");
  await toBottom(page);
  await expect(cards).toHaveCount(20);

  await page.fill("#creator-query", "people who cook");
  await page.getByRole("button", { name: "search" }).click();
  await expect(cards).toHaveCount(10);
});
