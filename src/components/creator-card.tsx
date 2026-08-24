import Link from "next/link";
import { BadgeCheck, Eye, Film, Flame, Users } from "lucide-react";
import { compactNumber, formatScore } from "@/lib/reels/format";
import type { CreatorRow } from "@/lib/creators/types";

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
 * Three of the creator's own thumbnails, as the card's picture.
 *
 * Not an avatar, on purpose. Every profilePicUrl Instagram hands out is a signed
 * CDN link it expires after about a day, so a stored avatar 403s within a day of
 * the scrape. These are the creator's three most viral reels, they live in our
 * own public bucket, and they answer "what does this person actually make"
 * better than a headshot does.
 */
function ThumbStrip({ thumbs, alt }: { thumbs: string[]; alt: string }) {
  if (!thumbs.length) {
    return (
      <div className="flex w-20 shrink-0 items-center justify-center rounded-xl border border-hairline bg-navy-raised sm:w-28">
        <Film className="size-5 text-silver-muted/50" aria-hidden />
      </div>
    );
  }
  return (
    <div className="flex w-20 shrink-0 gap-1 sm:w-28" aria-hidden>
      {thumbs.slice(0, 3).map((src, i) => (
        <div
          key={src}
          // Equal widths, so the three 9:16 boxes are the same height and the
          // strip has a flat bottom edge. Weighting the first one wider left the
          // other two short and the card looked half-empty under them.
          className="flex-1 overflow-hidden rounded-lg border border-hairline bg-navy-raised"
        >
          <div className="aspect-[9/16] w-full">
            {/* The thumbnails are 360x640 JPEGs served immutable from Supabase
                storage and painted at 30-60px wide, so they are already smaller
                than any optimizer pass would make them. A plain <img> keeps them
                off Vercel's transformation quota. */}
            <img
              src={src}
              alt={i === 0 ? alt : ""}
              width={360}
              height={640}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CreatorCard({
  creator,
  rank,
}: {
  creator: CreatorRow;
  rank?: number;
}) {
  const handle = `@${creator.account}`;
  // Never empty: an empty <h3> is both an accessibility violation and a hole in
  // the card. A creator always has at least a handle.
  const name = creator.name?.trim() || handle;
  const href = `/viral-reels-creators/${creator.account}`;
  const tags = creator.tags ?? [];

  return (
    <article className="surface-card overflow-hidden transition-colors hover:border-vivid-blue/40">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <Link href={href} className="shrink-0" tabIndex={-1} aria-hidden>
          <ThumbStrip thumbs={creator.top_thumbs ?? []} alt="" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 className="min-w-0 font-display text-base leading-snug text-white sm:text-lg">
              {/* The whole card is one destination, so the name is the link and
                  nothing else inside the card competes with it for the tap. */}
              <Link href={href} className="hover:text-vivid-blue">
                {name}
                {creator.verified ? (
                  <BadgeCheck
                    className="ml-1.5 inline size-4 -translate-y-px text-vivid-blue"
                    aria-label="verified"
                  />
                ) : null}
              </Link>
            </h3>
            {typeof rank === "number" && (
              <span className="shrink-0 font-display text-xs tabular-nums text-silver-muted/70">
                {rank}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-silver-muted [overflow-wrap:anywhere]">
            {handle}
            {creator.niche ? ` · ${creator.niche}` : ""}
          </p>

          {creator.bio ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-silver-muted">
              {creator.bio}
            </p>
          ) : null}

          {/* A wrapping flex row, not a grid. The values are Instagram-sized
              ("382M top reel") and a grid cell that wraps makes its whole row
              taller, which strands the stat beside it half a line up. A flex row
              just flows. */}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2.5">
            <Stat
              icon={Users}
              value={compactNumber(creator.followers)}
              label="followers"
            />
            <Stat
              icon={Film}
              value={String(creator.reels_indexed)}
              label="reels read"
            />
            <Stat
              icon={Flame}
              value={`${formatScore(creator.top_score)}x`}
              label="best"
            />
            <Stat
              icon={Eye}
              value={compactNumber(creator.best_views)}
              label="top reel"
            />
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-hairline px-4 py-3 sm:px-5">
          {/* Eight, not twenty-four. The row is a fingerprint of what they make,
              and a fingerprint that wraps to four lines is a paragraph. */}
          {tags.slice(0, 8).map((tag, i) => (
            <span
              key={`${i}-${tag}`}
              className="rounded-full border border-hairline px-2.5 py-1 text-[11px] text-silver-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
