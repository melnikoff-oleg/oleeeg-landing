import Link from "next/link";
import { browseReels, reelBrowseConfigured } from "@/lib/reels/browse";
import { reelFiltersFromWindow } from "@/lib/reels/filters";
import { getLibraryOverview } from "@/lib/reels/overview";
import {
  FOLLOWER_MAX_INDEX,
  normalizeDays,
  normalizeFollowerIndex,
  normalizeQuery,
  type ReelRow,
} from "@/lib/reels/types";
import { normalizeTopics, TOPICS } from "@/lib/reels/topics";
import { ReelsApp } from "./components/reels-app";
import { Sticker } from "./components/sticker";

// The wall depends on searchParams and on a table sync.py rewrites by hand a
// few times a week, so it is rendered per request. browse.ts reads with
// cache: "no-store" for the reason written up in its own comment: a count that
// lags the database is worse than a count that costs one indexed query.
export const dynamic = "force-dynamic";

/** One number and the word for it, on the strip under the headline. */
function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[26px] font-medium leading-none tracking-[-0.02em] tabular-nums sm:text-[34px]">
        {value}
      </p>
      <p className="caption mt-1.5">{label}</p>
    </div>
  );
}

/**
 * /reels: the whole library on one page.
 *
 * The three older pages split this three ways, one job each: /viral-reels
 * searches, /viral-reels-browse lists, /viral-reels-ideas chats. All three stay
 * exactly as they are. This one puts the search, the filters and the wall
 * together, because a visitor deciding what to film moves between those three
 * moves constantly and a page turn between them costs the thread.
 *
 * The first page of the wall is fetched here, on the server, so the reels are
 * in the HTML: that is the half of the page a crawler can read and the half
 * that works before any JavaScript arrives. Every filter change and every page
 * after the first is the client component talking to /api/reels/*.
 */
export default async function ReelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const days = normalizeDays(first(params.d));
  const minIndex = normalizeFollowerIndex(first(params.fmin), 0);
  const maxIndex = Math.max(
    minIndex,
    normalizeFollowerIndex(first(params.fmax), FOLLOWER_MAX_INDEX),
  );
  const topics = normalizeTopics(first(params.t));
  // Read but not acted on here: a search is an embedding call and a POST, and
  // running one during the server render would put an OpenAI round trip in
  // front of the first paint of a page whose wall does not need it. The client
  // picks it up on mount.
  const initialQuery = normalizeQuery(first(params.q) ?? "");

  let rows: ReelRow[] = [];
  let total = 0;
  let failed = false;
  let accounts = 0;
  let oldest: string | null = null;

  if (reelBrowseConfigured) {
    // Both reads at once. The overview is served from module memory on a warm
    // instance, so on a cold one this is the difference between two sequential
    // Supabase round trips and one.
    const [wall, overview] = await Promise.allSettled([
      browseReels({
        // This page's chips and slider, as the ranges the reader speaks.
        ranges: reelFiltersFromWindow({ days, minIndex, maxIndex }),
        page: 1,
        tags: TOPICS.filter((t) => topics.includes(t.id)).flatMap((t) => t.tags),
      }),
      getLibraryOverview(),
    ]);
    if (wall.status === "fulfilled") {
      rows = wall.value.rows;
      total = wall.value.total;
    } else {
      // A dead upstream must not 500 the page. An empty wall with a line of
      // explanation is a better answer than an error screen, and the client can
      // retry by moving any filter.
      console.error("reels wall ssr failed", wall.reason);
      failed = true;
    }
    if (overview.status === "fulfilled") {
      accounts = overview.value.accounts.length;
      oldest = overview.value.oldest_post;
      total = total || overview.value.total_reels;
    }
  }

  // The headline number. Falls back to the topic table's own total so the hero
  // never prints a zero on a request where only the overview failed.
  const libraryTotal = total || TOPICS.reduce((n, t) => Math.max(n, t.reels), 0);

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-6 sm:px-8 sm:pt-8">
      {/* --------------------------------------------------------------- nav */}
      <nav className="flex items-center justify-between gap-4" aria-label="site">
        <Link href="/" className="ui flex items-center gap-2 text-[15px]">
          <Sticker name="star" size={20} tilt={-12} />
          oleg.ae
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/viral-reels-ideas" className="chip !min-h-[36px] !text-[13px]">
            ideas chat
          </Link>
        </div>
      </nav>

      {/* ------------------------------------------------------------- hero */}
      <header className="relative mt-10 sm:mt-16">
        {/* The stickers are decoration and nothing else, so they are hidden
            from assistive tech and pulled out of the flow on a phone, where
            they would otherwise push the headline below the fold. */}
        <div className="pointer-events-none absolute right-0 top-[-18px] hidden items-start gap-5 sm:flex">
          <Sticker name="rocket" size={78} tilt={9} drift={0} />
          <Sticker name="phone" size={70} tilt={-7} drift={1.4} priority />
          <Sticker name="bolt" size={56} tilt={13} drift={2.6} />
        </div>

        <p className="eyebrow flex items-center gap-2 text-[#2c5be6]">
          <span className="inline-block size-2 rounded-full bg-[#f04e37]" aria-hidden />
          the viral reels library
        </p>

        <h1 className="display mt-4 max-w-[15ch]">
          {libraryTotal.toLocaleString("en-GB")} reels that beat their own creator.
        </h1>

        <p className="sub mt-6 max-w-[54ch]">
          every one of them watched end to end and written up: the hook, what held you,
          and what you got for staying. describe the reel you want to make and the
          closest ones come back, or just look at the wall.
        </p>

        <div className="mt-8 flex items-center gap-4 sm:hidden">
          <Sticker name="rocket" size={54} tilt={-8} drift={0} priority />
          <Sticker name="phone" size={50} tilt={6} drift={1.2} />
          <Sticker name="bolt" size={40} tilt={-12} drift={2.2} />
          <Sticker name="flame" size={44} tilt={9} drift={3} />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t-2 border-[#16233f] pt-6 sm:mt-10 sm:flex sm:flex-wrap sm:items-end sm:gap-x-10">
          <Fact value={libraryTotal.toLocaleString("en-GB")} label="reels" />
          <Fact value={accounts ? String(accounts) : "161"} label="accounts" />
          <Fact value="5x+" label="over their audience" />
          <Fact value={oldest ? oldest.slice(0, 4) : "2022"} label="reaching back to" />
          <div className="ml-auto hidden lg:block">
            <Sticker name="flame" size={54} tilt={-6} drift={0.8} />
          </div>
        </div>
      </header>

      <ReelsApp
        topics={TOPICS}
        initialRows={rows}
        initialTotal={total}
        initialFailed={failed}
        configured={reelBrowseConfigured}
        initialQuery={initialQuery}
        initialTopics={topics}
        initialDays={days}
        initialMinIndex={minIndex}
        initialMaxIndex={maxIndex}
      />

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-[rgba(22,35,63,0.25)] pt-6">
        <p className="prose text-[13px] text-[#5d6478]">
          built by{" "}
          <Link href="/" className="text-[#2c5be6] underline decoration-2 underline-offset-2">
            oleg melnikov
          </Link>
          . the same library also powers{" "}
          <Link
            href="/viral-reels-ideas"
            className="text-[#2c5be6] underline decoration-2 underline-offset-2"
          >
            the ideas chat
          </Link>
          .
        </p>
        <Sticker name="heart" size={30} tilt={8} />
      </footer>
    </main>
  );
}
