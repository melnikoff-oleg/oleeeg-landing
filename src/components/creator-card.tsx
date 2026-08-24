import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { compactNumber } from "@/lib/reels/format";
import type { CreatorRow } from "@/lib/creators/types";

/**
 * The creator's own profile picture.
 *
 * A real avatar, which the card could not show before: every profilePicUrl
 * Instagram hands out is a signed CDN link it expires after about a day, so
 * storing one guaranteed a broken image inside a day. scripts/harvest_avatars.py
 * downloads it while it is alive and it is served from our own public bucket.
 *
 * 237 of 240 creators have one. The other three fall back to their initial
 * rather than to a grey box, so the card never looks broken.
 */
function Avatar({ src, handle }: { src: string | null; handle: string }) {
  if (!src) {
    return (
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-full border border-hairline bg-navy-raised font-display text-lg text-silver-muted sm:size-16"
        aria-hidden
      >
        {handle.slice(0, 1).toUpperCase()}
      </div>
    );
  }
  return (
    // A plain <img>, not next/image: these are small square JPEGs served
    // immutable from Supabase storage and painted at 56-64px, already smaller
    // than an optimizer pass would make them, and this keeps them off Vercel's
    // transformation quota.
    <img
      src={src}
      alt=""
      width={160}
      height={160}
      loading="lazy"
      decoding="async"
      className="size-14 shrink-0 rounded-full border border-hairline object-cover sm:size-16"
    />
  );
}

/**
 * One creator, as minimal as the information allows.
 *
 * Oleg's brief, near enough verbatim: the picture, the username, the follower
 * count, something about their views, the bio the way Instagram lays it out,
 * and the short niche line. Everything else that used to be here is gone -- the
 * tag row, the three-thumbnail strip, the reels-read count, the outlier score.
 */
export function CreatorCard({ creator }: { creator: CreatorRow }) {
  const handle = `@${creator.account}`;
  const href = `/viral-reels-creators/${creator.account}`;

  return (
    <article className="surface-card transition-colors hover:border-vivid-blue/40">
      <div className="flex gap-4 p-4 sm:p-5">
        <Link href={href} className="shrink-0" tabIndex={-1} aria-hidden>
          <Avatar src={creator.avatar_url} handle={creator.account} />
        </Link>

        <div className="min-w-0 flex-1">
          {/* The handle is the heading. The real name used to be, but Oleg asked
              for the username, and a card headed "The AI Filmmaker" gives no way
              to find the account again. */}
          <h3 className="font-display text-base leading-snug text-white sm:text-lg">
            <Link href={href} className="hover:text-vivid-blue [overflow-wrap:anywhere]">
              {handle}
              {creator.verified ? (
                <BadgeCheck
                  className="ml-1.5 inline size-4 -translate-y-px text-vivid-blue"
                  aria-label="verified"
                />
              ) : null}
            </Link>
          </h3>

          <p className="mt-1 font-body text-xs text-silver-muted">
            <span className="tabular-nums text-silver">
              {compactNumber(creator.followers)}
            </span>{" "}
            followers
            {creator.total_views ? (
              <>
                {" · "}
                <span className="tabular-nums text-silver">
                  {compactNumber(creator.total_views)}
                </span>{" "}
                views
              </>
            ) : null}
            {creator.best_views ? (
              <>
                {" · "}
                <span className="tabular-nums text-silver">
                  {compactNumber(creator.best_views)}
                </span>{" "}
                best reel
              </>
            ) : null}
          </p>

          {creator.bio ? (
            // whitespace-pre-line, so the bio keeps the line breaks the creator
            // typed. Instagram bios are written as three short lines far more
            // often than as a paragraph, and flattening them loses the shape
            // that makes them readable at a glance.
            <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-silver-muted [overflow-wrap:anywhere]">
              {creator.bio}
            </p>
          ) : null}

          {creator.niche ? (
            <p className="mt-2 font-body text-xs text-vivid-blue/80">
              {creator.niche}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
