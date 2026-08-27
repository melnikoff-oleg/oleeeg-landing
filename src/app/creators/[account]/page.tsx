import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Film,
  GraduationCap,
  Laugh,
  Link2,
  Sparkles,
  Users,
} from "lucide-react";
import {
  creatorRosterConfigured,
  getCreator,
  getCreatorReels,
} from "@/lib/creators/roster";
import {
  CREATOR_REELS_PAGE_SIZE,
  normalizeCreatorSort,
  normalizeHandle,
  type CreatorReel,
  type CreatorRow,
  type CreatorSort,
} from "@/lib/creators/types";
import { compactNumber, formatScore } from "@/lib/reels/format";
import { normalizePage } from "@/lib/reels/types";
import { CreatorReelTile } from "@/components/creator-reel-tile";

// One creator, read live from a table creators.py rewrites.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ account: string }> };
type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const handle = normalizeHandle((await params).account);
  if (!handle || !creatorRosterConfigured) return { title: "Creator" };

  let creator: CreatorRow | null = null;
  try {
    creator = await getCreator(handle);
  } catch {
    // A dead upstream costs the page its title, not its existence.
  }
  if (!creator) return { title: "Creator" };

  const name = creator.name?.trim() || `@${creator.account}`;
  const title = `${name} (@${creator.account}): Their Most Viral Instagram Reels`;
  const description = [
    `${name} makes ${creator.niche || "Instagram reels"}`,
    `for ${compactNumber(creator.followers)} followers.`,
    `${creator.reels_pulled ?? creator.reels_indexed} of their reels are in the database,`,
    `the best one beating their own audience by ${formatScore(creator.top_score)}x.`,
  ].join(" ");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://oleg.ae/creators/${creator.account}`,
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `https://oleg.ae/creators/${creator.account}`,
    },
  };
}

/**
 * The header's two headline counts: how big they are, and how much of them we
 * hold.
 *
 * Seven identical rows used to sit here -- followers, reels, best outlier,
 * typical, and the three 1-10 reads -- in one grid at one size, so nothing on
 * the card said which number to look at first. Two of the seven are gone by
 * Oleg's instruction (the outlier scores: on one creator's page the audience is
 * a constant, so "beat their own audience by 394x" is a fact about one old reel
 * and not about the person) and the five that remain are now two ranks.
 *
 * These are the big rank. Number above, label below, at a size that reads from
 * across the room, and the same two hues the roster card uses for the same two
 * ideas -- silver for the audience, blue for how much of their work is here.
 */
function Headline({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  tone: "silver" | "blue";
}) {
  const hue =
    tone === "blue"
      ? "border-vivid-blue/25 bg-vivid-blue/[0.07] text-vivid-blue"
      : "border-silver/15 bg-silver/[0.05] text-silver";
  return (
    <div className={`rounded-xl border px-3.5 py-2.5 ${hue}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="font-display text-xl font-semibold leading-none tabular-nums sm:text-2xl">
          {value}
        </span>
      </div>
      <p className="mt-1.5 font-body text-[11px] text-silver-muted">{label}</p>
    </div>
  );
}

/**
 * One of Oleg's three 1-10 reads of what a creator makes.
 *
 * The small rank, and one shape for all three so they read as a set rather than
 * as three more facts: the same "n/10" on a track that fills to n, which turns
 * comparing them into comparing bar lengths instead of parsing three numbers.
 * A creator judged after the last pass has no score, and that draws as an empty
 * track and a dash -- unknown, never a zero out of ten.
 */
function Rating({
  icon: Icon,
  score,
  label,
  bar,
  text,
}: {
  icon: typeof Laugh;
  score: number | null | undefined;
  label: string;
  bar: string;
  text: string;
}) {
  const known = score !== null && score !== undefined && Number.isFinite(score);
  const n = known ? Math.min(10, Math.max(0, score as number)) : 0;
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Icon className={`size-3.5 shrink-0 ${known ? text : "text-silver-muted/40"}`} aria-hidden />
        <span className="font-body text-[11px] text-silver-muted">{label}</span>
        <span
          className={`ml-auto font-display text-xs font-semibold tabular-nums ${
            known ? text : "text-silver-muted/50"
          }`}
        >
          {known ? `${score}/10` : "-"}
        </span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-silver/10">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${n * 10}%` }} />
      </div>
    </div>
  );
}

/**
 * The two orders, as links rather than as a client component.
 *
 * The page is a server component that reads the database on every request, so
 * the order is a URL, and a URL is a link. That buys the back button, an
 * openable-in-a-new-tab control and a shareable address for free, and it costs
 * no JavaScript at all.
 */
function SortTabs({
  account,
  sort,
}: {
  account: string;
  sort: CreatorSort;
}) {
  const tabs: { key: CreatorSort; label: string }[] = [
    { key: "new", label: "newest first" },
    { key: "views", label: "most viewed" },
  ];
  return (
    <div className="flex shrink-0 gap-1 rounded-full border border-hairline p-1">
      {tabs.map(({ key, label }) => {
        const on = key === sort;
        return (
          <Link
            key={key}
            href={reelsHref(account, 1, key)}
            aria-current={on ? "true" : undefined}
            className={`inline-flex min-h-9 items-center rounded-full px-3.5 font-body text-xs transition-colors ${
              on
                ? "bg-vivid-blue text-white"
                : "text-silver-muted hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

// Page one of the default order is the bare address. Everything else says so.
function reelsHref(account: string, page: number, sort: CreatorSort): string {
  const params = new URLSearchParams();
  if (sort !== "new") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/creators/${account}${query ? `?${query}` : ""}`;
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex min-h-11 items-center rounded-full border border-hairline px-5 font-body text-xs transition-colors";
  if (disabled) {
    return (
      <span className={`${base} text-silver-muted/40`} aria-disabled>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} text-silver hover:border-vivid-blue/50 hover:text-white`}
    >
      {children}
    </Link>
  );
}

/**
 * One creator, and every reel of theirs the scrape holds, newest first.
 *
 * This is what the search is for. The header is who they are; everything under
 * it is the evidence, laid out as Instagram's own profile grid, in one of two
 * orders the visitor picks: newest, which shows their run of form, or most
 * viewed, which shows their ceiling. Never the outlier score, because on one
 * creator's page the audience is a constant.
 */
export default async function CreatorPage({ params, searchParams }: Params & Search) {
  const handle = normalizeHandle((await params).account);
  // An unparseable handle is a 404, not a database query: nothing that is not a
  // handle can be a creator, and it must never reach a filter.
  if (!handle) notFound();

  const query = await searchParams;
  const page = normalizePage(first(query.page));
  const sort = normalizeCreatorSort(first(query.sort));

  if (!creatorRosterConfigured) notFound();

  let creator: CreatorRow | null = null;
  let reels: CreatorReel[] = [];
  let total = 0;
  let failed = false;
  try {
    // One round trip's worth of latency rather than two: the creator row and
    // their reels are independent reads of two different tables.
    const [row, reelPage] = await Promise.all([
      getCreator(handle),
      getCreatorReels(handle, page, sort),
    ]);
    creator = row;
    reels = reelPage.rows;
    total = reelPage.total;
  } catch (err) {
    console.error("creator page failed", err);
    failed = true;
  }

  // A handle that is not in the index is genuinely not here. A handle the
  // database could not be asked about is a different thing, and answering 404
  // for it would tell a crawler to forget a page that exists.
  if (!creator && !failed) notFound();

  const pages = Math.max(1, Math.ceil(total / CREATOR_REELS_PAGE_SIZE));
  const name = creator?.name?.trim() || `@${handle}`;
  const signature = creator?.signature ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <Link
        href="/creators"
        className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-body text-xs text-silver-muted transition-colors hover:bg-silver/5 hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        all creators
      </Link>

      {failed && (
        <p className="rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
          the database did not answer. reload in a moment.
        </p>
      )}

      {creator && (
        <>
          <header className="surface-card p-4 sm:p-5">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
              <div className="flex min-w-0 gap-4">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt=""
                    width={160}
                    height={160}
                    className="size-16 shrink-0 rounded-full border border-hairline object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                <h1 className="font-display text-xl leading-tight text-white sm:text-2xl">
                  {name}
                  {creator.verified ? (
                    <BadgeCheck
                      className="ml-2 inline size-5 -translate-y-px text-vivid-blue"
                      aria-label="verified"
                    />
                  ) : null}
                </h1>
                {/* The handle IS the link to Instagram. There used to be a
                    button beside it doing the same thing, which is two targets
                    for one action and one of them a whole button's worth of
                    room. */}
                <p className="mt-1 text-xs text-silver-muted [overflow-wrap:anywhere]">
                  <a
                    href={creator.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-base font-medium text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
                  >
                    @{creator.account}
                  </a>
                  {creator.niche ? ` · ${creator.niche}` : ""}
                </p>
                </div>
              </div>
            </div>

            {creator.bio ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-silver">
                {creator.bio}
              </p>
            ) : null}

            {creator.external_url ? (
              <p className="mt-2 flex items-center gap-2 text-xs text-silver-muted">
                <Link2 className="size-3.5 shrink-0" aria-hidden />
                <a
                  href={creator.external_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="truncate transition-colors hover:text-white"
                >
                  {creator.external_url}
                </a>
              </p>
            ) : null}

            {/* Two ranks, split by a gap and not by a divider: the two counts
                that say how big this creator is and how much of them we hold,
                then the three 1-10 reads of what they actually make. The order
                is Oleg's. */}
            <div className="mt-4 border-t border-hairline pt-4">
              <div className="grid grid-cols-2 gap-2 sm:max-w-md">
                <Headline
                  icon={Users}
                  value={compactNumber(creator.followers)}
                  label="followers"
                  tone="silver"
                />
                <Headline
                  icon={Film}
                  value={`${total}`}
                  label="reels scraped"
                  tone="blue"
                />
              </div>

              {/* Capped, and at the same width as the two blocks above it: a
                  1-10 bar stretched across a 1200px card puts its label and its
                  number half a screen apart, and three of those read as three
                  unrelated rows rather than as one comparable set. */}
              <div className="mt-4 grid max-w-3xl grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
                <Rating
                  icon={Laugh}
                  score={creator.entertaining}
                  label="entertaining"
                  bar="bg-amber-400"
                  text="text-amber-300"
                />
                <Rating
                  icon={GraduationCap}
                  score={creator.educational}
                  label="educational"
                  bar="bg-emerald-400"
                  text="text-emerald-300"
                />
                <Rating
                  icon={Sparkles}
                  score={creator.inspirational}
                  label="inspirational"
                  bar="bg-violet-400"
                  text="text-violet-300"
                />
              </div>
            </div>

            {/* What this person is actually FOR. It is the only sentence in the
                database that answers that, it existed all along in the sheet's
                `who_should_study_it` column, and until now it stopped there --
                so a header could say 9/10 educational and never say what they
                teach. 243 of 243 creators have one. */}
            {creator.study_note ? (
              <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-silver">
                <span className="eyebrow mr-2 text-[10px] text-vivid-blue">
                  worth studying for
                </span>
                {creator.study_note}
              </p>
            ) : null}

            {signature.length > 0 && (
              <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-silver-muted">
                <span className="eyebrow mr-2 text-[10px] text-vivid-blue">
                  how they make them
                </span>
                {signature.slice(0, 8).join(", ")}
              </p>
            )}
          </header>

          <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-sm text-silver-muted">
              {total} {total === 1 ? "reel" : "reels"} scraped
            </h2>
            <SortTabs account={creator.account} sort={sort} />
          </div>

          {reels.length === 0 ? (
            <p className="rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
              nothing on this page. go back to page one.
            </p>
          ) : (
            // Instagram's own profile grid: four to a row on a desktop, three on
            // a tablet, two on a phone, hairline gaps. The whole point of this
            // page is the wall of stills, so the thumbnails get the width and
            // the numbers ride on top of them.
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4">
              {reels.map((reel, i) => (
                <CreatorReelTile key={reel.shortcode} reel={reel} index={i} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav
              aria-label="reel pages"
              className="mt-6 flex items-center justify-between gap-3"
            >
              <PageLink href={reelsHref(creator.account, page - 1, sort)} disabled={page <= 1}>
                {sort === "views" ? "more viewed" : "newer"}
              </PageLink>
              <span className="font-body text-xs tabular-nums text-silver-muted">
                page {page} of {pages}
              </span>
              <PageLink href={reelsHref(creator.account, page + 1, sort)} disabled={page >= pages}>
                {sort === "views" ? "less viewed" : "older"}
              </PageLink>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
