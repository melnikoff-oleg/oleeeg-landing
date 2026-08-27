import type { Metadata } from "next";
import {
  creatorRosterConfigured,
  listCreatorFacts,
  listCreators,
} from "@/lib/creators/roster";
import {
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

  let roster: CreatorRow[] = [];
  let total = 0;
  // Every creator as five numbers, for the histograms. Small enough to ship
  // with the page, which is what lets the charts redraw mid-drag instead of
  // once a round trip.
  let facts: CreatorFact[] = [];
  if (creatorRosterConfigured) {
    // Two independent reads. Sequential, they would add a whole upstream
    // round trip to the first paint for no reason.
    const [rosterResult, factsResult] = await Promise.allSettled([
      listCreators({ page, filters }),
      listCreatorFacts(),
    ]);
    if (rosterResult.status === "fulfilled") {
      roster = rosterResult.value.rows;
      total = rosterResult.value.total;
    } else {
      // A dead upstream must not 500 the page: the search box still works from
      // the client, and an empty roster beats an error screen.
      console.error("creator roster ssr failed", rosterResult.reason);
    }
    if (factsResult.status === "fulfilled") facts = factsResult.value;
    // Charts with no bars, sliders that still work. The filters are applied by
    // the database either way, so losing this costs the preview, not the
    // filtering.
    else console.error("creator facts ssr failed", factsResult.reason);
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
      />
    </main>
  );
}
