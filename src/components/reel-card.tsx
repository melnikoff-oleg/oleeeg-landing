import {
  Bookmark,
  ChevronDown,
  Clock,
  Eye,
  Flame,
  Heart,
  MessageCircle,
  Percent,
  Play,
  Send,
  Users,
} from "lucide-react";
import {
  compactNumber,
  engagementRate,
  formatDate,
  formatDuration,
  formatScore,
} from "@/lib/reels/format";
import type { ReelRow } from "@/lib/reels/types";

/** One number under one label. The whole metrics strip is built from these. */
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

/**
 * One of hook / retain / reward: the one-line verdict always visible, the
 * bullets behind a native disclosure so three reels stay comparable at a glance
 * and the detail is one tap away. `<details>` keeps this zero-JS.
 */
function Field({
  label,
  summary,
  points,
}: {
  label: string;
  summary: string | null;
  points: string[] | null;
}) {
  const bullets = points ?? [];
  if (!summary && bullets.length === 0) return null;

  return (
    <details className="group/field border-t border-hairline py-3 first:border-t-0">
      <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow mt-0.5 w-16 shrink-0 text-[10px] text-vivid-blue">
          {label}
        </span>
        <span className="min-w-0 flex-1 text-sm leading-relaxed text-silver">
          {summary ?? `${bullets.length} notes`}
        </span>
        {bullets.length > 0 && (
          <ChevronDown
            className="mt-0.5 size-4 shrink-0 text-silver-muted/60 transition-transform duration-200 group-open/field:rotate-180"
            aria-hidden
          />
        )}
      </summary>

      {bullets.length > 0 && (
        <ul className="mt-3 space-y-2 pl-16">
          {bullets.map((point, i) => (
            <li
              key={`${i}-${point}`}
              className="relative pl-4 text-sm leading-relaxed text-silver-muted before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-vivid-blue/60"
            >
              {point}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}

export function ReelCard({ reel, rank }: { reel: ReelRow; rank: number }) {
  const handle = `@${reel.account}`;
  // Never empty: an empty <h3> is both an accessibility violation and a hole in
  // the card. A reel always has at least an account.
  const title =
    reel.idea?.trim() || reel.hook_summary?.trim() || reel.caption?.trim() || handle;
  const hasWriteUp = Boolean(
    reel.hook_summary || reel.retain_summary || reel.reward_summary ||
    reel.hook_points?.length || reel.retain_points?.length || reel.reward_points?.length,
  );
  // The thumbnails are 360x640 JPEGs served immutable from Supabase storage and
  // painted at 96-128px wide, so they are already smaller than any optimizer pass
  // would make them. A plain <img> keeps them off Vercel's transformation quota.
  const thumb = reel.thumb_url;

  return (
    <article className="surface-card overflow-hidden">
      {/* A grid rather than a flex row, so the metrics can sit beside the
          thumbnail on a wide card and drop to the card's full width on a phone,
          where a column of ~230px would break every "1.8K comments" in half. */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 p-4 sm:gap-x-5 sm:p-5">
        {/* self-start, or the row stretches the frame to the full card height
            and leaves an empty box under a 9:16 thumbnail. */}
        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative row-span-2 block w-24 self-start overflow-hidden rounded-xl border border-hairline bg-navy-raised sm:row-span-3 sm:w-32"
          aria-label={`Open ${handle} on Instagram`}
        >
          <div className="aspect-[9/16] w-full">
            {thumb ? (
              <img
                src={thumb}
                alt=""
                width={360}
                height={640}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : null}
          </div>
          <span className="absolute inset-0 flex items-center justify-center bg-navy/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex size-9 items-center justify-center rounded-full bg-vivid-blue/90">
              <Play className="size-4 translate-x-px fill-white text-white" aria-hidden />
            </span>
          </span>
          <span className="absolute left-1.5 top-1.5 rounded-md bg-navy/80 px-1.5 py-0.5 font-display text-[11px] font-medium tabular-nums text-silver">
            {rank}
          </span>
        </a>

        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 self-start">
          {/* Handle, name and date wrap as one unit, so a narrow screen never
              strands the separator on a line of its own. */}
          <p className="min-w-0 text-xs text-silver-muted [overflow-wrap:anywhere]">
            <a
              href={`https://www.instagram.com/${reel.account}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-sm font-medium text-silver transition-colors hover:text-white"
            >
              {handle}
            </a>
            {reel.creator && reel.creator.toLowerCase() !== reel.account.toLowerCase()
              ? ` ${reel.creator}`
              : ""}
            {` · ${formatDate(reel.posted_on)}`}
          </p>
          {/* The one number that says why this reel is in the database at all. */}
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-vivid-blue/10 px-2.5 py-1 font-display text-xs font-medium tabular-nums text-vivid-blue"
            title="how far the reel beat its own creator: views over the square root of their follower count, over 100"
          >
            <Flame className="size-3.5" aria-hidden />
            {formatScore(reel.score)}x outlier
          </span>
        </div>

        <h3 className="min-w-0 self-start font-display text-base leading-snug text-white sm:text-lg">
          {title}
        </h3>

        {/* Full card width on a phone (row three spans both columns), beside the
            thumbnail from sm up. */}
        <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:col-span-1 sm:grid-cols-4">
          <Stat icon={Eye} value={compactNumber(reel.views)} label="views" />
          <Stat icon={Heart} value={compactNumber(reel.likes)} label="likes" />
          <Stat icon={MessageCircle} value={compactNumber(reel.comments)} label="comments" />
          <Stat icon={Send} value={compactNumber(reel.shares)} label="shares" />
          <Stat icon={Bookmark} value={compactNumber(reel.saves)} label="saves" />
          <Stat icon={Users} value={compactNumber(reel.followers)} label="followers" />
          <Stat icon={Clock} value={formatDuration(reel.duration_sec)} label="long" />
          <Stat icon={Percent} value={engagementRate(reel.likes, reel.views)} label="liked" />
        </div>
      </div>

      {hasWriteUp && (
        <div className="border-t border-hairline px-4 sm:px-5">
          <Field label="hook" summary={reel.hook_summary} points={reel.hook_points} />
          <Field label="retain" summary={reel.retain_summary} points={reel.retain_points} />
          <Field label="reward" summary={reel.reward_summary} points={reel.reward_points} />
        </div>
      )}

      {reel.tags && reel.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-hairline px-4 py-3 sm:px-5">
          {reel.tags.map((tag, i) => (
            <span
              key={`${i}-${tag}`}
              className="rounded-full border border-hairline px-2.5 py-1 text-[11px] text-silver-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3 sm:px-5">
        <p className="min-w-0 truncate text-xs text-silver-muted" title={reel.caption ?? ""}>
          {reel.caption}
        </p>
        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-hairline px-4 text-xs font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
        >
          watch on instagram
        </a>
      </div>
    </article>
  );
}
