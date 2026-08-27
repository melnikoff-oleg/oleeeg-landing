import type { Metadata } from "next";
import { browseReels, listReelFacts, reelBrowseConfigured } from "@/lib/reels/browse";
import { featuredReels } from "@/lib/reels/featured";
import { LIBRARY_PAGE_SIZE, REEL_FILTERS, type ReelFilters } from "@/lib/reels/filters";
import { rangesAreEmpty, readRanges } from "@/lib/filters/range";
import { normalizePage, normalizeQuery, type ReelTileRow } from "@/lib/reels/types";
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
    url: "https://oleg.ae/reels",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://oleg.ae/reels" },
};

// The wall depends on searchParams and on a table sync.py rewrites, so it is
// rendered per request. The facts read beside it caches for a minute, which is
// what keeps a burst of paging off that query.
// Mumbai, where this project's Supabase lives. The argument is written out in
// full in src/app/api/viral-reels/search/route.ts: the function used to run in
// Washington DC and every read crossed an ocean each way. This page is
// database calls and nothing else, so it is the clearest case of the lot.
export const preferredRegion = ["bom1"];
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

  // "Show me everything", the one thing the hand-picked default takes away. It
  // is a URL rather than client state so that it survives a reload and a shared
  // link, exactly like every filter on this page.
  const showAll = first(params.all) === "1";

  // The resting state of the page: nothing typed, nothing filtered, page one,
  // and no request for the whole library. That, and only that, gets the
  // hand-picked screen.
  const resting =
    !query && page === 1 && !showAll && rangesAreEmpty(REEL_FILTERS, ranges);

  let rows: ReelTileRow[] = [];
  let total = 0;
  let facts = "";
  let count = 0;
  let featured = false;
  let failed = false;

  if (reelBrowseConfigured) {
    // Three independent reads, and only two of them ever run. Sequential, they
    // would add a whole upstream round trip to the first paint for no reason.
    const [wall, factsResult] = await Promise.allSettled([
      resting
        ? featuredReels()
        : browseReels({ ranges, page, limit: LIBRARY_PAGE_SIZE }),
      listReelFacts(),
    ]);
    if (factsResult.status === "fulfilled") {
      facts = factsResult.value.packed;
      count = factsResult.value.count;
    } else {
      // Charts with no bars, sliders that still work. The filters are applied by
      // the database either way, so losing this costs the preview, not the
      // filtering.
      console.error("reel facts ssr failed", factsResult.reason);
    }

    if (wall.status === "fulfilled") {
      if (resting) {
        rows = wall.value as ReelTileRow[];
        // How many reels there are, so the "see all" link can say so. The wall
        // itself is 24 rows and carries no count of its own.
        total = count;
        featured = rows.length > 0;
      } else {
        const browsed = wall.value as { rows: ReelTileRow[]; total: number };
        rows = browsed.rows;
        total = browsed.total;
      }
    } else {
      // A dead upstream must not 500 the page: the client can retry by moving a
      // filter, and an empty wall with an explanation beats an error screen.
      console.error("library ssr failed", wall.reason);
      failed = true;
    }

    // A featured read that came back empty is not an error and must not be one
    // on screen. Fall back to the library the page has always shown rather than
    // to nothing, because an empty front page is worse than an ugly one.
    if (resting && !featured && !failed) {
      try {
        const fallback = await browseReels({ ranges, page, limit: LIBRARY_PAGE_SIZE });
        rows = fallback.rows;
        total = fallback.total;
      } catch (err) {
        console.error("library fallback ssr failed", err);
        failed = true;
      }
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <h1 className="sr-only">viral reels library</h1>
      <ReelNav current="/reels" />
      <Library
        initialQuery={query}
        initialRanges={ranges}
        facts={facts}
        rows={rows}
        total={total}
        page={page}
        configured={reelBrowseConfigured}
        initialFailed={failed}
        initialFeatured={featured}
        libraryTotal={count}
      />
    </main>
  );
}
