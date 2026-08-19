import { test, expect, type Page, type Locator } from "@playwright/test";

// Tests 59+: the /ideas board (suggest a video, vote on the ones already there).
//
// Two halves, both deterministic without any secret:
//  - the API guard rails, which all return before the route touches Supabase or
//    Anthropic, so they cost nothing and cannot flake on a network call;
//  - the page itself, which renders a 200 empty state when the database env is
//    absent (that graceful degradation is a design requirement precisely so this
//    suite runs in a key-free environment).
//
// The vote/submit happy paths need a live database and are verified by hand
// against a real Supabase project, not here.

const MOBILE_ONLY = (testInfo: { project: { name: string } }) =>
  test.skip(testInfo.project.name !== "mobile", "mobile only");

const MIN_TAP = 44;

async function settle(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

async function fontSize(loc: Locator) {
  return loc.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
}

// ── API guard rails ──────────────────────────────────────────────────────────

test.describe("59 - ideas api validation", () => {
  test("submit with a non-JSON body -> 400 bad_request", async ({ request }) => {
    // Raw Buffer so Playwright doesn't re-serialize the string into valid JSON.
    const res = await request.post("/api/ideas", { data: Buffer.from("}{") });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("bad_request");
  });

  test("submit with no title -> 400 missing_title", async ({ request }) => {
    const res = await request.post("/api/ideas", { data: { detail: "hi" } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("missing_title");
  });

  test("submit with a two-word title -> 400 too_short", async ({ request }) => {
    const res = await request.post("/api/ideas", { data: { title: "hi ok" } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("too_short");
  });

  test("submit over the length caps -> 400 too_long", async ({ request }) => {
    const res = await request.post("/api/ideas", { data: { title: "a".repeat(101) } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("too_long");
  });

  test("vote with a non-uuid ideaId -> 400 invalid_idea", async ({ request }) => {
    const res = await request.post("/api/ideas/vote", { data: { ideaId: "1; drop" } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("invalid_idea");
  });

  test("vote with no body -> 400", async ({ request }) => {
    const res = await request.post("/api/ideas/vote", { data: Buffer.from("nope") });
    expect(res.status()).toBe(400);
  });

  test("admin actions are refused without the secret", async ({ request }) => {
    const res = await request.post("/api/ideas/admin", {
      data: { action: "delete", id: "whatever" },
    });
    expect(res.status()).toBe(401);
    expect((await res.json()).error).toBe("denied");
  });

  test("admin login with a wrong secret does not let you in", async ({ request }) => {
    const res = await request.post("/api/ideas/admin", {
      data: { action: "login", secret: "definitely-not-it" },
    });
    // 401 when a secret is configured, 503 when the env var is absent (CI).
    expect([401, 503]).toContain(res.status());
    expect(res.headers()["set-cookie"]).toBeUndefined();
  });
});

// ── The page ─────────────────────────────────────────────────────────────────

test("60 - ideas: hero, submit form and board render", async ({ page }) => {
  await settle(page, "/ideas");

  await expect(page.locator("h1")).toHaveText(/what should i build next/i);

  const title = page.locator("#idea-title");
  await expect(title).toBeVisible();
  await expect(page.getByRole("button", { name: /add it to the board/i })).toBeVisible();

  // The sort control is the board's own affordance and must always be there,
  // whether or not the board has any ideas on it yet.
  await expect(page.getByRole("group", { name: /sort ideas/i })).toBeVisible();
});

test("61 - ideas: the submit button stays disabled until the title is real", async ({
  page,
}) => {
  await settle(page, "/ideas");
  const send = page.getByRole("button", { name: /add it to the board/i });
  await expect(send).toBeDisabled();

  await page.locator("#idea-title").fill("hey");
  await expect(send).toBeDisabled();

  await page.locator("#idea-title").fill("claude code that writes my newsletter");
  await expect(send).toBeEnabled();
});

test("62 - ideas: no em dashes in the copy", async ({ page }) => {
  await settle(page, "/ideas");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/[–—]/);
});

test("63 - ideas admin: locked behind the secret", async ({ page }) => {
  await settle(page, "/ideas/admin");
  // The login form, and nothing else: no idea list, no activity log.
  await expect(page.locator("#admin-secret")).toBeVisible();
  await expect(page.getByText(/recent activity/i)).toHaveCount(0);
});

// ── Mobile ───────────────────────────────────────────────────────────────────

test("64 - ideas: inputs are 16px so iOS does not zoom on focus", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/ideas");
  for (const sel of ["#idea-title", "#idea-detail", "#idea-name"]) {
    expect(await fontSize(page.locator(sel)), `${sel} font size`).toBeGreaterThanOrEqual(16);
  }
});

test("65 - ideas: form and sort controls are >=44px tap targets", async ({
  page,
}, testInfo) => {
  MOBILE_ONLY(testInfo);
  await settle(page, "/ideas");

  const targets = [
    page.locator("#idea-title"),
    page.locator("#idea-name"),
    page.getByRole("button", { name: /add it to the board/i }),
    page.getByRole("button", { name: "top", exact: true }),
    page.getByRole("button", { name: "new", exact: true }),
  ];
  for (const t of targets) {
    const box = await t.boundingBox();
    expect(box, "tap target box").not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP);
  }
});
