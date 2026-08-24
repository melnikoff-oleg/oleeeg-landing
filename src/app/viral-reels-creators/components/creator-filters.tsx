"use client";

import { X } from "lucide-react";
import {
  AUDIENCE_BANDS,
  filtersAreEmpty,
  NO_FILTERS,
  type CreatorFilters,
} from "@/lib/creators/types";

/**
 * The optional filters over the creator index.
 *
 * Every one of them is off by default, which is the whole point: Oleg asked for
 * filters he can set, not a shape the page forces on him. Nothing here narrows
 * anything until it is touched.
 *
 * The three value scales are his own 1-10 judgements of each account, so "at
 * least 5 educational" is a real question the data can answer. A creator judged
 * after the last pass scores null on all three and is simply left alone by an
 * unset filter rather than being scored zero and excluded everywhere.
 */

/** The minimums the dropdowns offer. Below 5 no creator is meaningfully filtered
 *  out, so the list starts where it starts being useful. */
const FLOORS = [5, 6, 7, 8, 9, 10] as const;

function ScorePicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number | null;
  onChange: (next: number | null) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <label htmlFor={id} className="font-body text-xs text-silver-muted">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className={`min-h-11 rounded-full border bg-navy-raised px-3 font-body text-xs outline-none transition-colors focus:border-vivid-blue/60 ${
          value === null
            ? "border-hairline text-silver-muted"
            : "border-vivid-blue bg-vivid-blue/10 text-white"
        }`}
      >
        <option value="">any</option>
        {FLOORS.map((n) => (
          <option key={n} value={n}>
            {n}+
          </option>
        ))}
      </select>
    </span>
  );
}

export function CreatorFilterBar({
  filters,
  onChange,
}: {
  filters: CreatorFilters;
  onChange: (next: CreatorFilters) => void;
}) {
  const empty = filtersAreEmpty(filters);

  return (
    <div className="mt-3 space-y-2.5">
      <div
        role="group"
        aria-label="audience size"
        className="flex flex-wrap gap-2"
      >
        {AUDIENCE_BANDS.map((band, i) => {
          const active = filters.band === i;
          return (
            <button
              key={band.label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ ...filters, band: i })}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 font-body text-xs transition-colors ${
                active
                  ? "border-vivid-blue bg-vivid-blue/10 text-white"
                  : "border-hairline text-silver-muted hover:border-vivid-blue/50 hover:text-white"
              }`}
            >
              {band.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <ScorePicker
          id="f-entertaining"
          label="entertaining"
          value={filters.minEntertaining}
          onChange={(minEntertaining) => onChange({ ...filters, minEntertaining })}
        />
        <ScorePicker
          id="f-educational"
          label="educational"
          value={filters.minEducational}
          onChange={(minEducational) => onChange({ ...filters, minEducational })}
        />
        <ScorePicker
          id="f-inspirational"
          label="inspirational"
          value={filters.minInspirational}
          onChange={(minInspirational) => onChange({ ...filters, minInspirational })}
        />

        {/* Only rendered once something is set. A permanent "clear" next to
            untouched controls suggests the page is already filtering. */}
        {!empty && (
          <button
            type="button"
            onClick={() => onChange(NO_FILTERS)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-body text-xs text-silver-muted transition-colors hover:text-white"
          >
            <X className="size-3.5" aria-hidden />
            clear filters
          </button>
        )}
      </div>
    </div>
  );
}
