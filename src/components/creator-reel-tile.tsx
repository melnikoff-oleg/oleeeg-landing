import { Eye, Film, Handshake, Heart, Users2 } from "lucide-react";
import { compactNumber, formatRelative } from "@/lib/reels/format";
import type { CreatorReel } from "@/lib/creators/types";

/**
 * How many collaborators the strip names before it counts the rest.
 *
 * One. A reel with four co-owners is almost always a brand campaign, and four
 * handles at this size wrap the strip to a third line on a phone; "@openai +2"
 * says the same thing in the width of a word.
 */
const NAMED_COLLABS = 1;

/**
 * The credit line: who else made this, and whether it was paid for.
 *
 * Both are real facts about how a number was earned. A reel that did 28M views
 * as a paid partnership with a brand that pushed it, or as a collab posted to
 * two audiences at once, is not the same evidence as one that did 28M off the
 * creator's own following, and the grid gave no way to tell them apart. 819 of
 * the 24,252 reels here are declared ads and 3,405 carry a co-owner.
 *
 * Subtle, on Oleg's instruction, but visible: no fill and no colour of its own,
 * just an outline and an icon at the size of the date, on the bottom row beside
 * the smallest number. It is the fourth thing on the card and it looks like the
 * fourth thing. It truncates rather than wrapping, because a credit line that
 * took its own line on some tiles and not others is what made a grid of sixty
 * strips come out ragged.
 *
 * `sponsored` is tri-state and only `true` paints. false is Instagram asking and
 * the creator saying no; null is a row from a source that never carried the
 * field. Neither is a claim worth a badge, and painting them the same way is
 * the point -- they are both "nothing to declare".
 */
function Credits({ reel }: { reel: CreatorReel }) {
  const collab = reel.collab_with ?? [];
  if (!reel.sponsored && collab.length === 0) return null;

  const named = collab.slice(0, NAMED_COLLABS);
  const rest = collab.length - named.length;

  return (
    <div className="flex min-w-0 items-center justify-end gap-1">
      {reel.sponsored ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-1.5 py-0.5 font-body text-[11px] font-medium tracking-wide text-white/80 sm:text-xs">
          <Handshake className="size-3 shrink-0" aria-hidden />
          paid
        </span>
      ) : null}
      {named.length > 0 ? (
        <span className="inline-flex min-w-0 items-center gap-1 rounded-full border border-white/25 px-1.5 py-0.5 font-body text-[11px] font-medium text-white/80 sm:text-xs">
          <Users2 className="size-3 shrink-0" aria-hidden />
          {/* Truncated rather than wrapped: an Instagram handle can be 30
              characters and the tile is ~140px wide on a phone. */}
          <span className="truncate">@{named.join(", @")}</span>
          {rest > 0 ? <span className="shrink-0">+{rest}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

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
 * Four things on the overlay, in Oleg's order and at four sizes, because on one
 * creator's page they are not equally important and reading them as a row of
 * equals is what made the old strip slow: views, then the date, then likes,
 * then the credit line. TWO FIXED ROWS, never a wrapping list, so every strip in
 * the grid is exactly one height whether or not it carries a credit. Views is the ranking (the audience is one constant
 * creator, so the outlier score has nothing left to normalise) and it is set
 * twice the size of everything else. Likes only ever qualify a view count, so
 * they drop to the date's size and the date's dimness.
 *
 * Still no outlier score, comment count or read/unread marker: those belong to a
 * page that ranks reels from different creators against each other.
 */
export function CreatorReelTile({ reel }: { reel: CreatorReel }) {
  const posted = formatRelative(reel.posted_on);

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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/75 via-navy/25 to-transparent"
        aria-hidden
      />

      {/* Frosted rather than solid, so the still keeps reading through it the
          way Instagram's own overlays do. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-1.5 sm:p-2">
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

            {/* Second. No icon: a date needs no glyph to be read as a date, and
                leaving it off is what stops the strip reading as a row of three
                equal badges again. */}
            <span
              data-field="date"
              className="shrink-0 font-body text-[11px] font-medium tabular-nums text-white/75 sm:text-xs"
            >
              {posted}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            {/* Third, and deliberately the smallest number on the tile. A like
                count is only ever read against the view count above it. */}
            {/* The same box as the credit pill beside it, with a transparent
                border instead of a visible one: identical padding and identical
                type size is what makes the bottom row one height on every tile,
                credited or not. */}
            <span
              data-field="likes"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-transparent px-1.5 py-0.5 text-white/60"
            >
              <Heart className="size-3 shrink-0" aria-hidden />
              <span className="font-body text-[11px] font-medium tabular-nums sm:text-xs">
                {compactNumber(reel.likes)}
              </span>
              <span className="sr-only">likes</span>
            </span>

            <Credits reel={reel} />
          </div>
        </div>
      </div>
    </a>
  );
}
