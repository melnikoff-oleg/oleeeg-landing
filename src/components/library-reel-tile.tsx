import Link from "next/link";
import { Eye, Film, Flame, Heart } from "lucide-react";
import { compactNumber, formatRelative, formatScore } from "@/lib/reels/format";
import type { ReelTileRow } from "@/lib/reels/types";

/**
 * One reel in the library wall: the thumbnail, big, and nothing else until the
 * frosted strip along its bottom.
 *
 * The same grid the creator profile uses, because that is the layout the eye is
 * already trained on and because it is the one Oleg asked for by name: a wall of
 * 9:16 stills at four to a row, hairline gaps, numbers laid over the picture
 * rather than beside it. The list of write-up cards this replaced gave a 50px
 * thumbnail four fifths of a card's width of prose, which is exactly backwards
 * for a page whose job is "show me what went viral".
 *
 * FOUR numbers on the strip, at four sizes, in Oleg's order, because they are
 * not equally important and reading them as a row of equals is what made the old
 * strip slow:
 *
 *   1. views          the headline, twice the size of anything else
 *   2. outlier score  how far it beat its own creator's audience
 *   3. how long ago
 *   4. likes          smallest, because a like count is only ever read against
 *                     the view count above it
 *
 * The outlier score is here and deliberately NOT on the creator profile's
 * version of this tile. On one creator's page the audience is a constant, so the
 * score has nothing left to normalise; here every tile is a different account
 * and it is the only number that makes 400K from a small creator comparable to
 * 4M from a huge one.
 *
 * The handle sits above the strip rather than in it, and it is the one link that
 * does not go to Instagram: from a wall of many creators, "who made this" is the
 * question the tile cannot answer without it.
 */
export function LibraryReelTile({ reel }: { reel: ReelTileRow }) {
  const posted = formatRelative(reel.posted_on);
  const score = formatScore(reel.score);

  return (
    // A group, not an anchor. The tile's own link covers the picture and the
    // handle's link sits above it: nesting the two would be invalid HTML and
    // the handle would stop being clickable.
    <article className="group relative overflow-hidden rounded-lg border border-hairline bg-navy-raised">
      <div className="aspect-[9/16] w-full">
        {reel.thumb_url ? (
          // A plain <img>. These are 360x640 JPEGs served immutable from our own
          // bucket, painted here at up to ~290px wide, and there are 60 of them
          // on a page: running the lot through Vercel's optimizer would spend
          // the transformation quota to make them barely smaller.
          <img
            src={reel.thumb_url}
            alt=""
            width={360}
            height={640}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Film className="size-6 text-silver-muted/30" aria-hidden />
          </div>
        )}
      </div>

      {/* A scrim at each end. Frosting alone is not enough over a blown-out
          frame, and a reel thumbnail is very often a white studio or a sky. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-navy/70 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/75 via-navy/25 to-transparent"
        aria-hidden
      />

      {/* The whole picture is the link to Instagram, and it carries the reel's
          only accessible name. */}
      <a
        href={reel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">
          {`open this reel on instagram: ${compactNumber(reel.views)} views, ${score}x outlier, posted ${posted}`}
        </span>
      </a>

      {/* Above the picture link, so it stays clickable. */}
      <Link
        href={`/viral-reels-creators/${reel.account}`}
        className="absolute left-2 top-2 z-20 max-w-[calc(100%-1rem)] truncate rounded-full bg-navy/55 px-2 py-1 font-body text-[11px] font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-navy/80 hover:text-white sm:text-xs"
      >
        @{reel.account}
      </Link>

      {/* TWO fixed rows, never a wrapping list. Four things at four sizes wrap
          at a different point on every tile, so a grid of sixty strips came out
          ragged and the same number sat on a different line from one tile to the
          next. The big two lead, the small two follow, and every strip is one
          height. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-1.5 sm:p-2">
        <div className="rounded-xl border border-white/10 bg-navy/50 px-2.5 py-2 backdrop-blur-md sm:px-3 sm:py-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* The headline. Big, white, and first, because it is the whole
                reason the tile exists. */}
            <span data-field="views" className="inline-flex min-w-0 items-center gap-1.5">
              <Eye className="size-4 shrink-0 text-white/80" aria-hidden />
              <span className="truncate font-display text-lg font-semibold leading-none tabular-nums text-white sm:text-xl">
                {compactNumber(reel.views)}
              </span>
              <span className="sr-only">views</span>
            </span>

            {/* Second, and the only coloured thing on the strip. It is what
                makes two different creators comparable, so it gets the one
                signal the eye finds before it reads anything. */}
            <span data-field="score" className="inline-flex shrink-0 items-center gap-1 text-amber-300">
              <Flame className="size-3.5 shrink-0" aria-hidden />
              <span className="font-display text-sm font-semibold leading-none tabular-nums sm:text-base">
                {score}x
              </span>
              <span className="sr-only">their own audience</span>
            </span>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            {/* Third. No icon: a date needs no glyph to be read as a date, and
                leaving it off is what stops the strip reading as a row of equal
                badges. */}
            <span data-field="date" className="truncate font-body text-[11px] font-medium tabular-nums text-white/75 sm:text-xs">
              {posted}
            </span>

            {/* Fourth, and deliberately the smallest number on the tile. A like
                count is only ever read against the view count above it. */}
            <span data-field="likes" className="inline-flex shrink-0 items-center gap-1 text-white/60">
              <Heart className="size-3 shrink-0" aria-hidden />
              <span className="font-body text-[11px] font-medium tabular-nums sm:text-xs">
                {compactNumber(reel.likes)}
              </span>
              <span className="sr-only">likes</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
