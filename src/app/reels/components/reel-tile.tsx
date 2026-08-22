"use client";

import { Zap } from "lucide-react";
import { Sticker } from "./sticker";
import { compactNumber, formatScore } from "@/lib/reels/format";
import type { ReelRow } from "@/lib/reels/types";

/**
 * One reel on the wall, as a piece of paper.
 *
 * The thumbnail is the tile. Everything else sits on top of it: the outlier
 * score top left, the view count bottom left, the play sticker on hover. The
 * handle and the idea sit underneath on the card's own paper, because reading
 * white text off an arbitrary 9:16 frame is a coin toss and this page has
 * hundreds of frames.
 *
 * A <button>, not an <a>: it opens the detail sheet rather than navigating. The
 * sheet is where the Instagram link lives, so a visitor is never one stray
 * click from leaving the page they came to browse.
 */
export function ReelTile({
  reel,
  rank,
  tilt,
  delay,
  onOpen,
}: {
  reel: ReelRow;
  rank: number;
  /** Degrees of resting tilt. Small, and different per tile. */
  tilt: number;
  /** Seconds. Staggers the deal-in so a page of results lands like cards. */
  delay: number;
  onOpen: () => void;
}) {
  const handle = `@${reel.account}`;
  const title = reel.idea?.trim() || reel.hook_summary?.trim() || handle;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="tile deal group"
      style={
        {
          "--tilt": `${tilt}deg`,
          "--deal-delay": `${delay}s`,
        } as React.CSSProperties
      }
      aria-label={`${title}, by ${handle}. Open the breakdown.`}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#ece0cc]">
        {reel.thumb_url ? (
          <img
            src={reel.thumb_url}
            alt=""
            width={360}
            height={640}
            loading="lazy"
            decoding="async"
            className="tile-img"
          />
        ) : null}

        {/* The one number that says why this reel is in the library at all. */}
        {/* A lucide bolt rather than the bolt sticker. The stickers are drawn
            at 400px with a halftone in the shading, and at 13px that halftone
            is a smudge; a stroke icon is the one that survives the size. */}
        <span className="badge absolute left-2 top-2">
          <Zap className="size-3 fill-[#16233f]" aria-hidden />
          {formatScore(reel.score)}x
        </span>

        {/* Views, on a solid paper chip rather than over the image, so it is
            legible on a white frame and a black one alike. */}
        <span
          className="ui absolute bottom-2 left-2 rounded-full border-2 border-[#16233f] bg-[#fffaf1] px-2 py-0.5 text-[11px] tabular-nums"
          title="views"
        >
          {compactNumber(reel.views)} views
        </span>

        <span className="tile-play absolute inset-0 flex items-center justify-center">
          <Sticker name="play" size={64} tilt={-6} />
        </span>

        <span className="caption absolute right-2 top-2 rounded-full border-2 border-[#16233f] bg-[#fffaf1] px-1.5 py-0.5 text-[10px] tabular-nums text-[#16233f]">
          {rank}
        </span>
      </div>

      <div className="border-t-2 border-[#16233f] px-3 py-2.5">
        <p className="ui truncate text-[13px] text-[#16233f]">{handle}</p>
        {/* Two lines and then it stops. A wall only works if every tile is the
            same height, and the ideas run from four words to forty. */}
        <p className="prose mt-1 line-clamp-2 text-[13px] text-[#5d6478]">{title}</p>
      </div>
    </button>
  );
}
