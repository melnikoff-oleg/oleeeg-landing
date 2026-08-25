"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import {
  histogram,
  matchCount,
  rangesAreEmpty,
  type BinRow,
  type FilterSet,
  type Ranges,
} from "@/lib/filters/range";
import { RangeFilter } from "./range-filter";

/**
 * A page's whole filter set: one histogram-with-two-thumbs per scale, and the
 * count they add up to.
 *
 * Every filter is off by default, which is the whole point: Oleg asked for
 * filters he can set, not a shape the page forces on him. Nothing here narrows
 * anything until a thumb is moved.
 *
 * The filters COMPOSE, and the histograms compose with them: each chart counts
 * only the rows the OTHER filters allow. Pick 1M to 10M followers and the
 * educational chart redraws to describe that group alone, so the next filter is
 * chosen against what is actually left rather than against a library that is no
 * longer on screen. A filter never narrows its own chart, or dragging a thumb
 * would eat the bars it is being dragged across.
 *
 * Shared by /viral-reels-browse and /viral-reels-creators. The two differ only
 * in which scales they hand it and what they call a row.
 */
export function FilterBar<K extends string>({
  set,
  rows,
  ranges,
  noun,
  onInput,
  onCommit,
  onReset,
}: {
  set: FilterSet<K>;
  /** Every row in the index, as one bin per filter. The charts are drawn from
   *  this in the browser, which is what lets them redraw mid-drag. */
  rows: readonly BinRow[];
  ranges: Ranges<K>;
  /** What one row is called: "reels", "creators". Always plural. */
  noun: string;
  onInput: (next: Ranges<K>) => void;
  /**
   * A thumb was released. Deliberately carries NO ranges.
   *
   * A pointerup and the last change of a drag are separate DOM events, so a
   * commit that shipped this component's `ranges` prop could ship the range from
   * before the drag if React had not re-rendered in between. The parent holds
   * the live value in a ref and reads it there instead.
   */
  onCommit: () => void;
  onReset: () => void;
}) {
  const empty = rangesAreEmpty(set, ranges);

  // One chart and one count per pass over the index. Memoised because it runs
  // on every step of a drag, not because any single pass is expensive.
  const charts = useMemo(
    () => set.keys.map((key) => ({ key, bins: histogram(set, rows, ranges, key) })),
    [set, rows, ranges],
  );
  const matches = useMemo(() => matchCount(set, rows, ranges), [set, rows, ranges]);

  return (
    <div className="surface-card mt-3 p-4 sm:p-5">
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {charts.map(({ key, bins }) => (
          <RangeFilter
            key={key}
            scale={set.scales[key]}
            bins={bins}
            range={ranges[key]}
            noun={noun}
            onInput={(next) => onInput({ ...ranges, [key]: next })}
            onCommit={onCommit}
          />
        ))}
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {/* Counted in the browser off the same numbers the charts are drawn
            from, so it is already right while the drag is still happening and
            the server has not been asked anything yet. */}
        <p className="font-body text-xs text-silver-muted" aria-live="polite">
          {rows.length === 0
            ? ""
            : empty
              ? `${rows.length.toLocaleString("en-GB")} ${noun}`
              : `${matches.toLocaleString("en-GB")} of ${rows.length.toLocaleString("en-GB")} ${noun} match`}
        </p>

        {/* Only rendered once something is set. A permanent "clear" next to
            untouched controls suggests the page is already filtering. */}
        {!empty && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center gap-1.5 font-body text-xs text-silver-muted transition-colors hover:text-white"
          >
            <X className="size-3.5" aria-hidden />
            clear filters
          </button>
        )}
      </div>
    </div>
  );
}
