import type { Metadata } from "next";
import { browseReels, reelBrowseConfigured } from "@/lib/reels/browse";
import {
  FOLLOWER_MAX_INDEX,
  normalizeDays,
  normalizeFollowerIndex,
  normalizePage,
  type ReelRow,
} from "@/lib/reels/types";
import { ReelBrowser } from "./components/reel-browser";

const title = "Viral Reels Library: Every Reel in the Database, Ranked";
const description =
  "Browse the whole viral Instagram reels library, ranked by how far each reel beat its own creator's audience. Filter by account size and by how recently it was posted.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "viral reels library",
    "Instagram reels database",
    "top viral reels",
    "viral reel examples",
    "Instagram outlier reels",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://oleg.ae/viral-reels/browse",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://oleg.ae/viral-reels/browse" },
};

// The list depends on searchParams and on a table that sync.py rewrites, so it
// is rendered per request. browse.ts still caches the upstream read for a
// minute, which is what keeps a burst of paging off the database.
export const dynamic = "force-dynamic";

/**
 * The whole library, ranked by outlier score.
 *
 * The first page is fetched on the server so the list is there in the HTML: it
 * is the half of /viral-reels that a crawler can read and that works before any
 * JavaScript arrives. Every later page and every filter change is the client
 * component talking to /api/viral-reels/browse.
 */
export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const days = normalizeDays(first(params.d));
  const minIndex = normalizeFollowerIndex(first(params.fmin), 0);
  const maxIndex = Math.max(
    minIndex,
    normalizeFollowerIndex(first(params.fmax), FOLLOWER_MAX_INDEX),
  );
  const page = normalizePage(first(params.page));
  const initial = { days, minIndex, maxIndex, page };

  let rows: ReelRow[] = [];
  let total = 0;
  let failed = false;
  if (reelBrowseConfigured) {
    try {
      const result = await browseReels(initial);
      rows = result.rows;
      total = result.total;
    } catch (err) {
      // A dead upstream must not 500 the page: the client can retry by moving
      // a filter, and an empty list with an explanation beats an error screen.
      console.error("browse ssr failed", err);
      failed = true;
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <h1 className="sr-only">viral reels library</h1>
      <ReelBrowser
        initial={initial}
        initialRows={rows}
        initialTotal={total}
        initialFailed={failed}
        configured={reelBrowseConfigured}
      />
    </main>
  );
}
