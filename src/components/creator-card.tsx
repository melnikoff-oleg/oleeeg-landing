import Link from "next/link";
import { BadgeCheck, Eye, Flame, Users } from "lucide-react";
import { compactNumber } from "@/lib/reels/format";
import type { CreatorTileRow } from "@/lib/creators/types";

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
 * One of the three numbers on a card, in its own colour.
 *
 * They used to be one grey sentence -- "48K followers · 39M views · 4.6M best
 * reel" -- and Oleg kept reading the follower count as the view count, which is
 * exactly what that layout invites: three numbers in the same weight, the same
 * colour and the same size, separated by a dot, told apart only by a word set
 * SMALLER than the number it labels.
 *
 * Three signals now do the separating instead of one. Each number gets its own
 * pill with its own border, its own icon, and its own hue -- silver for the
 * audience, blue for total views, amber for the best single reel -- so which is
 * which is answered by colour and shape before any word is read. The hues are
 * not decoration: they are the same three the profile page uses for the same
 * three things, so the association survives the click.
 */
const TONES = {
  silver: "border-silver/15 bg-silver/[0.06] text-silver",
  blue: "border-vivid-blue/30 bg-vivid-blue/10 text-vivid-blue",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
} as const;

function Metric({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Eye;
  value: string;
  label: string;
  tone: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${TONES[tone]}`}
    >
      <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
      <span className="font-display text-sm font-semibold tabular-nums">
        {value}
      </span>
      {/* The label is deliberately dimmer than the number and never colour-
          coded: the colour is already carrying the meaning, so the word is a
          caption for the first read and furniture after that. */}
      <span className="font-body text-[11px] text-silver-muted">{label}</span>
    </span>
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
export function CreatorCard({ creator }: { creator: CreatorTileRow }) {
  const handle = `@${creator.account}`;
  const href = `/creators/${creator.account}`;

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

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Metric
              icon={Users}
              value={compactNumber(creator.followers)}
              label="followers"
              tone="silver"
            />
            {creator.total_views ? (
              <Metric
                icon={Eye}
                value={compactNumber(creator.total_views)}
                label="views"
                tone="blue"
              />
            ) : null}
            {creator.best_views ? (
              <Metric
                icon={Flame}
                value={compactNumber(creator.best_views)}
                label="best reel"
                tone="amber"
              />
            ) : null}
          </div>

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
