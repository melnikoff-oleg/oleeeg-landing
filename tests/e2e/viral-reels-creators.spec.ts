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
  // Four ranges, eight thumbs. The reel-count filter was removed outright.
  await expect(page.locator("input[type=range]")).toHaveCount(8);
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

  // Both thumbs at the ends of their tracks on all four scales: 0 to 12 on the
  // audience ladder, 0 to 10 on each 1-10 scale.
  for (const [key, top] of [
    ["followers", 12],
    ["entertaining", 10],
    ["educational", 10],
    ["inspirational", 10],
  ] as const) {
    await expect(page.getByTestId(`range-${key}-min`)).toHaveValue("0");
    await expect(page.getByTestId(`range-${key}-max`)).toHaveValue(String(top));
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
  await expect(page.getByTestId("range-followers-min")).toHaveValue("3");
  await expect(page.getByTestId("range-followers-max")).toHaveValue("9");
  await expect(page.getByTestId("range-educational-min")).toHaveValue("3");
  await expect(page.getByTestId("range-educational-max")).toHaveValue("8");
  await expect(page.getByText("100K to 10M")).toBeVisible();
  await expect(page.getByText("4 to 8")).toBeVisible();

  // Untouched, and saying so.
  await expect(page.getByTestId("range-entertaining-min")).toHaveValue("0");
  await expect(page.getByTestId("range-entertaining-max")).toHaveValue("10");
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
  for (const [key, top] of [
    ["followers", 12],
    ["entertaining", 10],
    ["educational", 10],
    ["inspirational", 10],
  ] as const) {
    await expect(page.getByTestId(`range-${key}-min`)).toHaveValue("0");
    await expect(page.getByTestId(`range-${key}-max`)).toHaveValue(String(top));
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

  const min = page.getByTestId("range-followers-min");
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

  const max = page.getByTestId("range-educational-max");
  await max.focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowLeft");
  await expect(max).toHaveValue("6");
  await expect(page.getByText("6 or less")).toBeVisible();

  // Shareable, and without a page load: the roster is re-fetched, not reloaded.
  await expect(page).toHaveURL(/edu=1-6/);
  await expect(page.getByText(/of \d+ creators match/)).toBeVisible();

  await page.getByRole("button", { name: /clear filters/i }).click();
  await expect(page.getByTestId("range-educational-max")).toHaveValue("10");
  await expect(page).not.toHaveURL(/edu=/);
});

test("98e - creators: opening a creator and coming back keeps the filters", async ({
  page,
}) => {
  await settle(page, "/viral-reels-creators");
  test.skip((await chartTotal(page, "audience size")) <= 0, "needs a live index");

  const min = page.getByTestId("range-followers-min");
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
  await expect(page.getByTestId("range-followers-min")).toHaveValue("5");
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
  for (const key of ["followers", "entertaining", "educational", "inspirational"]) {
    for (const end of ["min", "max"]) {
      const box = await page.getByTestId(`range-${key}-${end}`).boundingBox();
      expect(box, `tap target ${key} ${end}`).not.toBeNull();
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
  await expect(page.locator("input[type=range]")).toHaveCount(8);
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

  // Three fields. A fourth would be the comment count or the outlier score
  // creeping back on, which is exactly what Oleg asked to be rid of here.
  await expect(strip.locator("> *")).toHaveCount(3);
  await expect(strip).toContainText(/\d+ [A-Z][a-z]{2} \d\d$/);

  // The month never runs to four letters, or a September tile wraps alone.
  const dates = await page
    .locator("main div.grid > a div.backdrop-blur-md > span:last-child")
    .allInnerTexts();
  for (const d of dates) expect(d).toMatch(/^(-|\d{1,2} [A-Z][a-z]{2} \d\d)$/);
});

test("102 - the stats strip stays on one line on a phone", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  test.skip(!(await openFirstCreator(page)), "needs a live index");

  // A wrapped strip is measurably taller than an unwrapped one, and one wrapped
  // tile among sixty reads as a bug rather than as a long number.
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
