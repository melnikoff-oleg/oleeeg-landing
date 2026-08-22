"use client";

import { Sticker } from "./sticker";
import { compactNumber } from "@/lib/reels/format";
import {
  FOLLOWER_MAX_INDEX,
  FOLLOWER_STOPS,
  WINDOWS,
  type WindowDays,
} from "@/lib/reels/types";
import type { Topic } from "@/lib/reels/topics";

/**
 * The colour a topic chip takes when it is on.
 *
 * Five inks cycled by position rather than mapped by name. The mapping does not
 * carry meaning, it only stops two neighbours from taking the same ink, and a
 * cycle survives the taxonomy being regenerated with different topics in it.
 * A named map would silently fall back to one colour the day a topic is added.
 */
const INKS = ["#2c5be6", "#f04e37", "#2fa46a", "#ffbe3d", "#ff9ecf"] as const;

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
 * one percent of a track that has to reach 88.9M.
 */
function FollowerRange({
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
    <div className="min-w-[220px] max-w-[340px] flex-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="caption">audience</span>
        <span className="ui text-xs tabular-nums text-[#16233f]">
          {whole ? "any size" : `${endLabel(min, "min")} to ${endLabel(max, "max")}`}
        </span>
      </div>

      <div className="relative mt-1 h-10">
        {/* The track and the selected span are drawn once, with the two native
            inputs transparent on top. Inset by half a thumb at each end so the
            fill lines up with the thumb centres. */}
        <div className="pointer-events-none absolute inset-x-[11px] top-1/2 h-[6px] -translate-y-1/2 rounded-full border-2 border-[#16233f] bg-[#ece0cc]">
          <div
            className="absolute inset-y-0 -my-[2px] rounded-full border-2 border-[#16233f] bg-[#2c5be6]"
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
          // Raised above the other thumb only at the far right, where the two
          // sit on top of each other and the lower one would otherwise be
          // impossible to drag back down.
          className="rail absolute inset-0 h-10 w-full"
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
          className="rail absolute inset-0 h-10 w-full"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}

export type FilterState = {
  topics: string[];
  days: WindowDays;
  minIndex: number;
  maxIndex: number;
};

/**
 * Topics, recency and audience size, on one piece of paper.
 *
 * All three narrow the same wall, and all three also narrow a search, so they
 * live above the results rather than inside either mode. A visitor who has
 * picked "food, last 30 days, under 500K" keeps that when they type a query.
 */
export function Filters({
  topics,
  state,
  onChange,
  onClear,
}: {
  topics: Topic[];
  state: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
}) {
  const on = new Set(state.topics);
  const dirty =
    state.topics.length > 0 ||
    state.days !== null ||
    state.minIndex !== 0 ||
    state.maxIndex !== FOLLOWER_MAX_INDEX;

  return (
    <div className="paper-card relative p-4 sm:p-5">
      <span className="tape left-8 top-[-13px] -rotate-3" aria-hidden />

      <div className="flex items-center gap-2">
        <Sticker name="tag" size={26} tilt={-10} />
        <h2 className="eyebrow text-[#16233f]">narrow it down</h2>
        {dirty ? (
          <button
            type="button"
            onClick={onClear}
            className="ui ml-auto text-xs text-[#2c5be6] underline decoration-2 underline-offset-2"
          >
            clear all
          </button>
        ) : null}
      </div>

      {/* Topics. The chips are the whole reason the tag column exists: the raw
          tags are 18,331 strings, most of them creator names. One is live at a
          time, so the row is a radio group rather than a set of toggles. */}
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="topic">
        {topics.map((topic, i) => {
          const active = on.has(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              className="chip"
              data-on={active}
              role="radio"
              aria-checked={active}
              style={{ "--chip": INKS[i % INKS.length] } as React.CSSProperties}
              // One topic at a time, and clicking the live one clears it.
              // Not a taste call: browseReels caps its tag list at 12, which is
              // exactly one topic's worth, so a second topic could only get in
              // by taking slots from the first. Measured on the live table,
              // comedy alone matched 714 reels and comedy + food matched 691,
              // and a filter that makes an OR smaller is broken however nice it
              // looks. normalizeTopics enforces the same 1 on the server, so a
              // hand-typed ?t=comedy,food cannot reach it either.
              onClick={() =>
                onChange({ ...state, topics: active ? [] : [topic.id] })
              }
            >
              {topic.label}
              <span className="caption text-[10px] opacity-70">{topic.reels}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-4 border-t-2 border-dashed border-[rgba(22,35,63,0.2)] pt-4">
        <div>
          <span className="caption">posted</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {WINDOWS.map((w) => {
              const active = state.days === w.days;
              return (
                <button
                  key={w.label}
                  type="button"
                  className="chip !min-h-[34px] !px-3 !text-[13px]"
                  data-on={active}
                  aria-pressed={active}
                  style={{ "--chip": "#16233f" } as React.CSSProperties}
                  onClick={() => onChange({ ...state, days: w.days })}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
        </div>

        <FollowerRange
          min={state.minIndex}
          max={state.maxIndex}
          onChange={(minIndex, maxIndex) => onChange({ ...state, minIndex, maxIndex })}
        />
      </div>
    </div>
  );
}
