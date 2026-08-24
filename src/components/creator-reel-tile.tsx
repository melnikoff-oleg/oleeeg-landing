import { Eye, Film, Heart } from "lucide-react";
import { compactNumber, formatShortDate } from "@/lib/reels/format";
import type { CreatorReel } from "@/lib/creators/types";

/**
 * One reel in a creator's grid: the thumbnail, big, and nothing else until the
 * frosted strip along its bottom.
 *
 * This is Instagram's own profile grid, because that is the layout the eye is
 * already trained on: a wall of 9:16 stills at four to a row, hairline gaps,
 * and the numbers laid over the picture rather than beside it. The old row
 * layout gave a 50px thumbnail four fifths of a card's width of text, which is
 * exactly backwards for a page whose whole job is "show me what they make".
 *
 * Three numbers on the overlay and no more, by Oleg's instruction: views, likes,
 * date. The outlier score, the comment count and the read/unread marker all
 * belong to a page that ranks reels against each other; here the audience is one
 * constant creator, so views ARE the ranking and the rest is furniture.
 */
export function CreatorReelTile({ reel }: { reel: CreatorReel }) {
  const posted = formatShortDate(reel.posted_on);

  return (
    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-lg border border-hairline bg-navy-raised"
    >
      <div className="aspect-[9/16] w-full">
        {reel.thumb_url ? (
          // A plain <img>. These are 360x640 JPEGs served immutable from our own
          // bucket, painted here at up to ~290px wide, and there are 60 of them
          // on a page: running the lot through Vercel's optimizer would spend
          // the transformation quota to make them barely smaller.
          //
          // A reel whose thumbnail never reached the bucket falls through to the
          // placeholder rather than showing a broken-image glyph.
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

      {/* A scrim under the strip. Frosting alone is not enough over a blown-out
          frame, and a reel thumbnail is very often a white studio or a sky. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent"
        aria-hidden
      />

      {/* Frosted rather than solid, so the still keeps reading through it the
          way Instagram's own overlays do. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-1.5 sm:p-2">
        {/* Sized to keep views, likes and the date on ONE line at 390px, the
            narrowest phone worth designing for: two tiles side by side leave the
            strip 144px of inside width, and the widest case measured across the
            library needs 137. It still wraps rather than overflows on anything
            narrower, which is why the gap has a vertical component at all. */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-lg border border-white/10 bg-navy/45 px-2 py-1.5 backdrop-blur-md sm:gap-x-2.5">
          <span className="inline-flex items-center gap-0.5 sm:gap-1">
            <Eye className="size-3 shrink-0 text-white/60" aria-hidden />
            <span className="font-display text-[10px] tabular-nums text-white sm:text-xs">
              {compactNumber(reel.views)}
            </span>
            <span className="sr-only">views</span>
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1">
            <Heart className="size-3 shrink-0 text-white/60" aria-hidden />
            <span className="font-display text-[10px] tabular-nums text-white sm:text-xs">
              {compactNumber(reel.likes)}
            </span>
            <span className="sr-only">likes</span>
          </span>
          <span className="ml-auto font-body text-[10px] tabular-nums text-white/60 sm:text-[11px]">
            {posted}
          </span>
        </div>
      </div>
    </a>
  );
}
