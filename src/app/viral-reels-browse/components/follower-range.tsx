"use client";

import { compactNumber } from "@/lib/reels/format";
import { FOLLOWER_MAX_INDEX, FOLLOWER_STOPS } from "@/lib/reels/types";

/** "0" and "any" are the open ends; everything between is a real number. */
function endLabel(index: number, side: "min" | "max"): string {
  if (side === "min" && index === 0) return "0";
  if (side === "max" && index === FOLLOWER_MAX_INDEX) return "any";
  return compactNumber(FOLLOWER_STOPS[index]);
}

/**
 * The audience-size filter: two thumbs on one log-spaced track.
 *
 * The values are indices, not follower counts, so the thumbs move in equal
 * steps while the numbers under them go 10K, 25K, 50K and so on. Dragging in
 * real follower counts would put every account under a million inside the first
 * one percent of the track.
 */
export function FollowerRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const pct = (i: number) => (i / FOLLOWER_MAX_INDEX) * 100;
  const whole = min === 0 && max === FOLLOWER_MAX_INDEX;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-body text-xs text-silver-muted">followers</span>
        <span className="font-display text-xs tabular-nums text-silver">
          {whole
            ? "any size"
            : `${endLabel(min, "min")} to ${endLabel(max, "max")}`}
        </span>
      </div>

      <div className="relative mt-1 h-11">
        {/* The track and the selected span, drawn once, with the inputs
            transparent on top. Inset by half a thumb at each end so the fill
            lines up with the thumb centres rather than running past them, and
            the percentages inside are then exact. */}
        <div className="pointer-events-none absolute inset-x-[11px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-silver/10">
          <div
            className="absolute inset-y-0 rounded-full bg-vivid-blue"
            style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={FOLLOWER_MAX_INDEX}
          step={1}
          value={min}
          onChange={(e) => onChange(Math.min(Number(e.target.value), max), max)}
          aria-label="smallest audience"
          aria-valuetext={`${endLabel(min, "min")} followers`}
          // Raised above the other thumb only when this one is at the far right,
          // where the two sit on top of each other and the lower thumb would
          // otherwise be impossible to drag back down.
          className="range-input absolute inset-0 h-11 w-full"
          style={{ zIndex: min >= FOLLOWER_MAX_INDEX - 1 ? 5 : 3 }}
        />
        <input
          type="range"
          min={0}
          max={FOLLOWER_MAX_INDEX}
          step={1}
          value={max}
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min))}
          aria-label="largest audience"
          aria-valuetext={`${endLabel(max, "max")} followers`}
          className="range-input absolute inset-0 h-11 w-full"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}
