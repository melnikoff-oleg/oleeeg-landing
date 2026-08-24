import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Eye,
  Film,
  Flame,
  Link2,
  Users,
} from "lucide-react";
import {
  creatorRosterConfigured,
  getCreator,
  getCreatorReels,
} from "@/lib/creators/roster";
import {
  CREATOR_REELS_PAGE_SIZE,
  normalizeHandle,
  type CreatorRow,
} from "@/lib/creators/types";
import { compactNumber, formatDate, formatScore } from "@/lib/reels/format";
import { normalizePage, type ReelRow } from "@/lib/reels/types";
import { ReelCard } from "@/components/reel-card";

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
    `${creator.reels_indexed} of their reels are in the database, read end to end,`,
    `the best one beating their own audience by ${formatScore(creator.top_score)}x.`,
  ].join(" ");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://oleg.ae/viral-reels-creators/${creator.account}`,
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `https://oleg.ae/viral-reels-creators/${creator.account}`,
    },
  };
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Eye;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-silver-muted/70" aria-hidden />
      <span className="min-w-0">
        <span className="font-display text-sm font-medium tabular-nums text-silver">
          {value}
        </span>{" "}
        <span className="text-xs text-silver-muted">{label}</span>
      </span>
    </div>
  );
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
 * One creator, and every reel of theirs the database has read, most viral first.
 *
 * This is what the search is for. The header is who they are; everything under
 * it is the evidence, ranked by how far each reel beat their own audience rather
 * than by raw views, so their real outliers sit at the top whatever their size.
 */
export default async function CreatorPage({ params, searchParams }: Params & Search) {
  const handle = normalizeHandle((await params).account);
  // An unparseable handle is a 404, not a database query: nothing that is not a
  // handle can be a creator, and it must never reach a filter.
  if (!handle) notFound();

  const page = normalizePage(first((await searchParams).page));

  if (!creatorRosterConfigured) notFound();

  let creator: CreatorRow | null = null;
  let reels: ReelRow[] = [];
  let total = 0;
  let failed = false;
  try {
    // One round trip's worth of latency rather than two: the creator row and
    // their reels are independent reads of two different tables.
    const [row, reelPage] = await Promise.all([
      getCreator(handle),
      getCreatorReels(handle, page),
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
  const tags = creator?.tags ?? [];
  const signature = creator?.signature ?? [];

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <Link
        href="/viral-reels-creators"
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
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
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
                <p className="mt-1 text-xs text-silver-muted [overflow-wrap:anywhere]">
                  <a
                    href={creator.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-sm font-medium text-silver transition-colors hover:text-white"
                  >
                    @{creator.account}
                  </a>
                  {creator.niche ? ` · ${creator.niche}` : ""}
                </p>
              </div>
              <a
                href={creator.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-hairline px-4 text-xs font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
              >
                open on instagram
              </a>
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

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-hairline pt-4 sm:grid-cols-3">
              <Stat
                icon={Users}
                value={compactNumber(creator.followers)}
                label="followers"
              />
              <Stat
                icon={Film}
                value={`${creator.reels_indexed}`}
                label="reels read"
              />
              <Stat
                icon={Flame}
                value={`${formatScore(creator.top_score)}x`}
                label="best outlier"
              />
              <Stat
                icon={Flame}
                value={`${formatScore(creator.median_score)}x`}
                label="typical"
              />
              <Stat
                icon={Eye}
                value={compactNumber(creator.total_views)}
                label="views in here"
              />
              <Stat
                icon={Calendar}
                value={formatDate(creator.last_posted)}
                label="newest"
              />
            </div>

            {signature.length > 0 && (
              <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-silver-muted">
                <span className="eyebrow mr-2 text-[10px] text-vivid-blue">
                  how they make them
                </span>
                {signature.slice(0, 8).join(", ")}
              </p>
            )}

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-hairline pt-4">
                {tags.map((tag, i) => (
                  <span
                    key={`${i}-${tag}`}
                    className="rounded-full border border-hairline px-2.5 py-1 text-[11px] text-silver-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <h2 className="mt-8 mb-4 font-display text-sm text-silver-muted">
            {total} {total === 1 ? "reel" : "reels"} in the database, most viral
            first
          </h2>

          {reels.length === 0 ? (
            <p className="rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
              nothing on this page. go back to page one.
            </p>
          ) : (
            <div className="space-y-4">
              {reels.map((reel, i) => (
                <ReelCard
                  key={reel.shortcode}
                  reel={reel}
                  rank={(page - 1) * CREATOR_REELS_PAGE_SIZE + i + 1}
                />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav
              aria-label="reel pages"
              className="mt-6 flex items-center justify-between gap-3"
            >
              <PageLink
                href={`/viral-reels-creators/${creator.account}${
                  page - 1 > 1 ? `?page=${page - 1}` : ""
                }`}
                disabled={page <= 1}
              >
                more viral
              </PageLink>
              <span className="font-body text-xs tabular-nums text-silver-muted">
                page {page} of {pages}
              </span>
              <PageLink
                href={`/viral-reels-creators/${creator.account}?page=${page + 1}`}
                disabled={page >= pages}
              >
                less viral
              </PageLink>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
