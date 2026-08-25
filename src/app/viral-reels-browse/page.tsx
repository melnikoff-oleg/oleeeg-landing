import type { Metadata } from "next";
import { browseReels, listReelFacts, reelBrowseConfigured } from "@/lib/reels/browse";
import { LIBRARY_PAGE_SIZE, REEL_FILTERS, type ReelFilters } from "@/lib/reels/filters";
import { readRanges } from "@/lib/filters/range";
import { normalizePage, normalizeQuery, type ReelRow } from "@/lib/reels/types";
import { ReelNav } from "@/components/reel-nav";
import { Library } from "./components/library";

const title = "Viral Reels Library: Search Every Reel in the Database";
const description =
  "Search thousands of viral Instagram reels by what they are about, then filter them by how entertaining, educational and inspirational they are, by when they were posted and by the size of the account that posted them.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "viral reels library",
    "Instagram reels database",
    "search viral reels",
    "top viral reels",
    "viral reel examples",
    "Instagram outlier reels",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://oleg.ae/viral-reels-browse",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://oleg.ae/viral-reels-browse" },
};

// The wall depends on searchParams and on a table sync.py rewrites, so it is
// rendered per request. The facts read beside it caches for a minute, which is
// what keeps a burst of paging off that query.
export const dynamic = "force-dynamic";

/**
 * The library: search, five filters, and the whole corpus as a wall of stills.
 *
 * One page where there were two. /viral-reels was a search box over an empty
 * screen and this was a list under two filters; they asked different questions
 * about the same corpus and a visitor moved between them constantly, so the
 * search moved in here and that page is now a redirect.
 *
 * The first page of the wall is fetched on the server so the library is there in
 * the HTML: it is the half a crawler can read and the half that works before any
 * JavaScript arrives. Every later page, every filter change and every search is
 * the client component talking to /api/viral-reels/.
 */
export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const query = normalizeQuery(first(params.q) ?? "");
  const page = normalizePage(first(params.page));
  // Every filter is validated here rather than trusted: these reach a PostgREST
  // filter, and anything that is not a well-formed range on the offered scale
  // becomes "unset" instead of being clamped into a question nobody asked.
  const ranges: ReelFilters = readRanges(
    REEL_FILTERS,
    Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, first(v)]),
    ),
  );

  let rows: ReelRow[] = [];
  let total = 0;
  let facts = "";
  let failed = false;

  if (reelBrowseConfigured) {
    // Two independent reads. Sequential, they would add a whole upstream round
    // trip to the first paint for no reason.
    const [wall, factsResult] = await Promise.allSettled([
      browseReels({ ranges, page, limit: LIBRARY_PAGE_SIZE }),
      listReelFacts(),
    ]);
    if (wall.status === "fulfilled") {
      rows = wall.value.rows;
      total = wall.value.total;
    } else {
      // A dead upstream must not 500 the page: the client can retry by moving a
      // filter, and an empty wall with an explanation beats an error screen.
      console.error("library ssr failed", wall.reason);
      failed = true;
    }
    // Charts with no bars, sliders that still work. The filters are applied by
    // the database either way, so losing this costs the preview, not the
    // filtering.
    if (factsResult.status === "fulfilled") facts = factsResult.value.packed;
    else console.error("reel facts ssr failed", factsResult.reason);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <h1 className="sr-only">viral reels library</h1>
      <ReelNav current="/viral-reels-browse" />
      <Library
        initialQuery={query}
        initialRanges={ranges}
        facts={facts}
        rows={rows}
        total={total}
        page={page}
        configured={reelBrowseConfigured}
        initialFailed={failed}
      />
    </main>
  );
}
