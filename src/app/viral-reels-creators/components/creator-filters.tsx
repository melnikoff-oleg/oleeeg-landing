"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import {
  FILTER_KEYS,
  filtersAreEmpty,
  histogram,
  matchCount,
  type CreatorFact,
  type CreatorFilters,
} from "@/lib/creators/types";
import { RangeFilter } from "./range-filter";

/**
 * The five range filters over the creator index.
 *
 * Every one of them is off by default, which is the whole point: Oleg asked for
 * filters he can set, not a shape the page forces on him. Nothing here narrows
 * anything until a thumb is moved.
 *
 * Three of the four are his own 1-10 judgements of each account, so "4 to 7
 * educational" is a real question the data can answer. A creator judged after
 * the last pass scores null on all three; an untouched filter leaves them alone
 * rather than scoring them zero and excluding them everywhere.
 *
 * The filters COMPOSE, and the histograms compose with them: each chart counts
 * only the creators the other three filters allow. Pick 1M to 10M followers and
 * the educational chart redraws to describe that group alone, so the next
 * filter is chosen against what is actually left rather than against a library
 * that is no longer on screen. A filter never narrows its own chart, or
 * dragging a thumb would eat the bars it is being dragged across.
 */
export function CreatorFilterBar({
  facts,
  filters,
  onInput,
  onCommit,
  onReset,
}: {
  /** Every creator in the index, as five numbers. The charts are drawn from
   *  this in the browser, which is what lets them redraw mid-drag. */
  facts: readonly CreatorFact[];
  filters: CreatorFilters;
  onInput: (next: CreatorFilters) => void;
  /**
   * A thumb was released. Deliberately carries NO filters.
   *
   * A pointerup and the last change of a drag are separate DOM events, so a
   * commit that shipped this component's `filters` prop could ship the range
   * from before the drag if React had not re-rendered in between. The parent
   * holds the live value in a ref and reads it here instead.
   */
  onCommit: () => void;
  onReset: () => void;
}) {
  const empty = filtersAreEmpty(filters);

  // Four charts and a count off one pass each over 240 rows. Memoised because
  // it runs on every step of a drag, not because it is expensive.
  const charts = useMemo(
    () =>
      FILTER_KEYS.map((key) => ({ key, bins: histogram(facts, filters, key) })),
    [facts, filters],
  );
  const matches = useMemo(() => matchCount(facts, filters), [facts, filters]);

  return (
    <div className="surface-card mt-3 p-4 sm:p-5">
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {charts.map(({ key, bins }) => (
          <RangeFilter
            key={key}
            filterKey={key}
            bins={bins}
            range={filters[key]}
            onInput={(next) => onInput({ ...filters, [key]: next })}
            onCommit={onCommit}
          />
        ))}
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {/* Counted in the browser off the same numbers the charts are drawn
            from, so it is already right while the drag is still happening and
            the server has not been asked anything yet. */}
        <p className="font-body text-xs text-silver-muted" aria-live="polite">
          {facts.length === 0
            ? ""
            : empty
              ? `${facts.length} creators`
              : `${matches} of ${facts.length} creators match`}
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
