import type { Metadata } from "next";
import {
  creatorRosterConfigured,
  featuredCreators,
  listCreatorFacts,
  listCreators,
} from "@/lib/creators/roster";
import {
  filtersAreEmpty,
  normalizeCreatorQuery,
  readCreatorFilters,
  type CreatorFact,
  type CreatorRow,
} from "@/lib/creators/types";
import { normalizePage } from "@/lib/reels/types";
import { ReelNav } from "@/components/reel-nav";
import { CreatorSearch } from "./components/creator-search";

const title = "Viral Reel Creators: Search the People Behind the Reels";
const description =
  "Search hundreds of Instagram creators by what they actually make. Describe a kind of creator and get the accounts closest to it, each with their niche, their audience and their most viral reels in order.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "instagram creators",
    "viral instagram creators",
    "find instagram creators by niche",
    "creator database",
    "instagram reel creators",
    "short form creators",
    "Oleg Melnikov",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://oleg.ae/creators",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://oleg.ae/creators" },
};

// The roster depends on searchParams and on a table creators.py rewrites, so it
// is rendered per request.
// Mumbai, where this project's Supabase lives. The argument is written out in
// full in src/app/api/viral-reels/search/route.ts: the function used to run in
// Washington DC and every read crossed an ocean each way. This page is
// database calls and nothing else, so it is the clearest case of the lot.
export const preferredRegion = ["bom1"];
export const dynamic = "force-dynamic";

/**
 * Semantic search over the creators in the reel database.
 *
 * The third door onto the same corpus. /viral-reels finds a reel, this finds the
 * person, and opening one lands on every reel of theirs the database has read,
 * most viral first.
 *
 * The roster is fetched on the server so the page is not an empty box: it is the
 * half a crawler can read and the half that works before any JavaScript arrives.
 * Search itself is the client component talking to /api/viral-reels/creators.
 */
export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const initialQuery = normalizeCreatorQuery(first(params.q) ?? "");
  const page = normalizePage(first(params.page));
  // Every filter is validated here rather than trusted: these reach a PostgREST
  // filter, and anything that is not a well-formed range on the offered scale
  // becomes "unset" instead of being clamped into a question nobody asked.
  const filters = readCreatorFilters({
    aud: first(params.aud),
    worth: first(params.worth),
    form: first(params.form),
    ent: first(params.ent),
    edu: first(params.edu),
    insp: first(params.insp),
  });

  // "Show me everyone", the one thing the hand-picked default takes away. It is
  // a URL rather than client state so that it survives a reload and a shared
  // link, exactly like every filter on this page.
  const showAll = first(params.all) === "1";

  // The resting state of the page: nothing typed, nothing filtered, page one,
  // and no request for the whole roster. That, and only that, gets the
  // hand-picked screen.
  const resting =
    !initialQuery && page === 1 && !showAll && filtersAreEmpty(filters);

  let roster: CreatorRow[] = [];
  let total = 0;
  let featured = false;
  // Every creator as five numbers, for the histograms. Small enough to ship
  // with the page, which is what lets the charts redraw mid-drag instead of
  // once a round trip.
  let facts: CreatorFact[] = [];
  if (creatorRosterConfigured) {
    // Two independent reads. Sequential, they would add a whole upstream
    // round trip to the first paint for no reason.
    const [rosterResult, factsResult] = await Promise.allSettled([
      resting ? featuredCreators() : listCreators({ page, filters }),
      listCreatorFacts(),
    ]);
    if (factsResult.status === "fulfilled") facts = factsResult.value;
    // Charts with no bars, sliders that still work. The filters are applied by
    // the database either way, so losing this costs the preview, not the
    // filtering.
    else console.error("creator facts ssr failed", factsResult.reason);

    if (rosterResult.status === "fulfilled") {
      if (resting) {
        roster = rosterResult.value as CreatorRow[];
        // How many creators there are, so the "see all" link can say so. The
        // picked screen is 16 rows and carries no count of its own.
        total = facts.length;
        featured = roster.length > 0;
      } else {
        const listed = rosterResult.value as { rows: CreatorRow[]; total: number };
        roster = listed.rows;
        total = listed.total;
      }
    } else {
      // A dead upstream must not 500 the page: the search box still works from
      // the client, and an empty roster beats an error screen.
      console.error("creator roster ssr failed", rosterResult.reason);
    }

    // A featured read that came back empty is not an error and must not be one
    // on screen. Fall back to the roster the page has always shown rather than
    // to nothing, because an empty front page is worse than an ugly one.
    if (resting && !featured) {
      try {
        const fallback = await listCreators({ page, filters });
        roster = fallback.rows;
        total = fallback.total;
      } catch (err) {
        console.error("creator roster fallback ssr failed", err);
      }
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <h1 className="sr-only">viral reel creators</h1>
      <ReelNav current="/creators" />
      <CreatorSearch
        initialQuery={initialQuery}
        initialFilters={filters}
        facts={facts}
        roster={roster}
        rosterTotal={total}
        rosterPage={page}
        initialFeatured={featured}
        rosterAll={facts.length}
      />
    </main>
  );
}
