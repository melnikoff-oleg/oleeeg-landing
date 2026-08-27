import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SITEMAP_ROUTES } from "@/lib/seo/sitemap-routes";

const APP = join(process.cwd(), "src", "app");

/** Every folder under src/app that is a real, publicly reachable page. */
function routeFolders(): string[] {
  return readdirSync(APP, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !name.startsWith("_") && name !== "api")
    .filter((name) => existsSync(join(APP, name, "page.tsx")));
}

test("no route can ship without a sitemap entry", () => {
  // /sam-altman-ai went months without one because the list was hand-kept prose
  // and nothing compared it to reality. This is that comparison.
  const listed = new Set(SITEMAP_ROUTES.map((r) => r.path.replace(/^\//, "")));
  const missing = routeFolders().filter((f) => !listed.has(f));
  assert.deepEqual(missing, [], `routes missing from the sitemap: ${missing.join(", ")}`);
});

test("the sitemap never lists a route that does not exist", () => {
  // The other direction: a redirected or deleted slug left in the sitemap sends
  // Google to a 308 and wastes crawl budget on a page that is gone.
  const folders = new Set(routeFolders());
  const stale = SITEMAP_ROUTES.map((r) => r.path.replace(/^\//, ""))
    .filter((p) => p !== "")
    .filter((p) => !folders.has(p));
  assert.deepEqual(stale, [], `sitemap lists dead routes: ${stale.join(", ")}`);
});

test("the homepage is the only priority 1 entry", () => {
  const top = SITEMAP_ROUTES.filter((r) => r.priority === 1);
  assert.equal(top.length, 1);
  assert.equal(top[0].path, "");
});

test("no entry claims to have changed in the future", () => {
  // A lastModified in the future is the same credibility problem as stamping
  // new Date() on everything, just less obvious.
  const today = new Date().toISOString().slice(0, 10);
  for (const r of SITEMAP_ROUTES) {
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(r.lastModified), `${r.path}: bad date`);
    assert.ok(r.lastModified <= today, `${r.path}: lastModified is in the future`);
  }
});

test("paths are absolute-from-root and carry no trailing slash", () => {
  for (const r of SITEMAP_ROUTES) {
    if (r.path === "") continue;
    assert.ok(r.path.startsWith("/"), `${r.path}: must start with /`);
    assert.ok(!r.path.endsWith("/"), `${r.path}: no trailing slash`);
  }
});

test("no route is listed twice", () => {
  // Two entries for one url is a sitemap error, and it happens when a page is
  // moved between sections of the list by hand.
  const seen = new Set<string>();
  for (const r of SITEMAP_ROUTES) {
    assert.ok(!seen.has(r.path), `${r.path} listed twice`);
    seen.add(r.path);
  }
});
