"use client";

import {
  barCount,
  barLabel,
  highThumbLabel,
  lowThumbLabel,
  rangeLabel,
  SCALES,
  type FilterKey,
  type Range,
} from "@/lib/creators/types";

/**
 * One filter: a histogram of the index with two thumbs across it.
 *
 * The Airbnb price control, applied to four dimensions instead of one. The bars
 * are what make it worth building: a slider alone asks the visitor to guess
 * where the creators are, and the answer here is nothing like uniform. Half the
 * index sits under a million followers and the educational scores pile up at
 * the bottom, which you can see at a glance and cannot guess.
 *
 * The geometry is exact rather than approximate, and that is load-bearing. A
 * scale is a list of EDGES: bar i covers [edges[i], edges[i+1]) and thumb
 * position i sits on edges[i], so a thumb always lands on a bar boundary and
 * the highlighted bars are precisely the creators the filter will return. The
 * moment those two disagree the chart becomes a decoration that lies.
 *
 * Both scales are drawn this way, including the 1-10 ones, whose eleven edges
 * make ten single-value bars. One geometry, one component, one bounds
 * calculation, rather than a discrete variant that drifts from the continuous
 * one the first time either is touched.
 */
export function RangeFilter({
  filterKey,
  bins,
  range,
  onInput,
  onCommit,
}: {
  filterKey: FilterKey;
  /** One count per bar, already narrowed by the OTHER filters. */
  bins: number[];
  range: Range;
  /** Live, on every step of a drag. Cheap: it only redraws bars. */
  onInput: (next: Range) => void;
  /** On release. This is the one that costs a round trip. */
  onCommit: () => void;
}) {
  const scale = SCALES[filterKey];
  const bars = barCount(filterKey);
  const [lo, hi] = range;
  // The tallest bar sets the scale. Never zero, so an empty chart divides by 1
  // and draws nothing rather than NaN.
  const peak = Math.max(1, ...bins);
  const pct = (stop: number) => (stop / bars) * 100;
  const shown = bins.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-body text-xs text-silver-muted">{scale.label}</span>
        <span className="font-display text-xs tabular-nums text-silver">
          {rangeLabel(filterKey, range)}
        </span>
      </div>

      {/* Inset by half a thumb, exactly like the track below it. A native range
          input moves its thumb CENTRE from thumbWidth/2 to width - thumbWidth/2,
          so an 11px inset on a 22px thumb is what makes bar boundary i and thumb
          position i the same pixel. */}
      <div
        className="mx-[11px] mt-2 flex h-9 items-stretch gap-[2px]"
        role="img"
        aria-label={`${scale.label}: how the ${shown} creators are spread`}
      >
        {bins.map((count, i) => {
          const inRange = lo <= i && i + 1 <= hi;
          return (
            <div
              key={i}
              className="flex flex-1 items-end"
              title={`${barLabel(filterKey, i)} · ${count} ${count === 1 ? "creator" : "creators"}`}
            >
              {/* An empty bar keeps a 2px stub so the axis reads as continuous
                  rather than as a hole where the chart failed to draw. */}
              <div
                className={`w-full rounded-t-[2px] transition-colors ${
                  inRange ? "bg-vivid-blue" : "bg-silver/15"
                }`}
                style={{
                  height: count ? `${Math.max(8, (count / peak) * 100)}%` : "2px",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Pulled up so the track sits under the bars it belongs to instead of
          floating half a control away from them. */}
      <div className="relative -mt-2 h-11">
        <div className="pointer-events-none absolute inset-x-[11px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-silver/10">
          <div
            className="absolute inset-y-0 rounded-full bg-vivid-blue"
            style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={bars}
          step={1}
          value={lo}
          onChange={(e) => onInput([Math.min(Number(e.target.value), hi), hi])}
          onPointerUp={onCommit}
          onKeyUp={onCommit}
          onBlur={onCommit}
          aria-label={`smallest ${scale.label}`}
          aria-valuetext={lowThumbLabel(filterKey, range)}
          data-testid={`range-${filterKey}-min`}
          // Raised above the other thumb only when this one is at the far right,
          // where the two sit on top of each other and the lower thumb would
          // otherwise be impossible to drag back down.
          className="range-input absolute inset-0 h-11 w-full"
          style={{ zIndex: lo >= bars - 1 ? 5 : 3 }}
        />
        <input
          type="range"
          min={0}
          max={bars}
          step={1}
          value={hi}
          onChange={(e) => onInput([lo, Math.max(Number(e.target.value), lo)])}
          onPointerUp={onCommit}
          onKeyUp={onCommit}
          onBlur={onCommit}
          aria-label={`largest ${scale.label}`}
          aria-valuetext={highThumbLabel(filterKey, range)}
          data-testid={`range-${filterKey}-max`}
          className="range-input absolute inset-0 h-11 w-full"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}
