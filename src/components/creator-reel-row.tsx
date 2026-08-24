import { Eye, Heart, MessageCircle } from "lucide-react";
import { compactNumber, formatDate } from "@/lib/reels/format";
import type { CreatorReel } from "@/lib/creators/types";

/**
 * One reel on a creator's page: a thumbnail, three numbers, a date.
 *
 * Deliberately not ReelCard. That card paints the whole Gemini write-up, and
 * only a fifth of the reels here have one -- but more than that, Oleg asked for
 * exactly three numbers and named the ones he did not want: shares, saves,
 * duration, like percentage. The follower count is gone too; it belongs once at
 * the top of the page, not repeated on all 95 rows.
 *
 * The whole row opens the reel on Instagram, because that is the only thing
 * anyone wants to do from here.
 */
function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Eye;
  value: number | null;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <Icon className="size-3.5 shrink-0 text-silver-muted/70" aria-hidden />
      <span className="font-display text-xs tabular-nums text-silver">
        {compactNumber(value)}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function CreatorReelRow({ reel }: { reel: CreatorReel }) {
  return (
    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="surface-card flex items-center gap-3 p-2.5 transition-colors hover:border-vivid-blue/40 sm:gap-4 sm:p-3"
    >
      <div className="w-12 shrink-0 overflow-hidden rounded-lg border border-hairline bg-navy-raised sm:w-14">
        <div className="aspect-[9/16] w-full">
          {reel.thumb_url ? (
            // A plain <img>: 360x640 JPEGs served immutable from our own bucket
            // and painted at ~50px wide, already smaller than an optimizer pass
            // would make them, and it keeps 60 of them per page off Vercel's
            // transformation quota.
            //
            // A reel whose thumbnail never made it into the bucket leaves the
            // box empty rather than showing a broken-image glyph.
            <img
              src={reel.thumb_url}
              alt=""
              width={360}
              height={640}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : null}
        </div>
      </div>

      {/* The three numbers take the space they need and the date sits at the far
          end, so the row uses its whole width instead of stacking everything
          into the left third and leaving half the card blank. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Metric icon={Eye} value={reel.views} label="views" />
          <Metric icon={Heart} value={reel.likes} label="likes" />
          <Metric icon={MessageCircle} value={reel.comments} label="comments" />
        </div>
        <p className="font-body text-[11px] text-silver-muted">
          {formatDate(reel.posted_on)}
          {/* Said out loud rather than left to guess. Most reels here have never
              been through Gemini, and a row with no write-up should read as "not
              read yet", not as "nothing to say about this one". */}
          {reel.analyzed ? " · read" : ""}
        </p>
      </div>
    </a>
  );
}
