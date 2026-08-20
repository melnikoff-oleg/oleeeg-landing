"use client";

import { Flame, Eye, Users } from "lucide-react";
import { compactNumber, formatScore } from "@/lib/reels/format";
import { estimateEffort } from "@/lib/reels/effort";
import type { ReelRow } from "@/lib/reels/types";

const EFFORT_STYLE = {
  easy: "bg-emerald-400/10 text-emerald-300",
  medium: "bg-amber-400/10 text-amber-300",
  hard: "bg-red-400/10 text-red-300",
} as const;

/**
 * A cited reel, inline in the answer.
 *
 * Built entirely from spans, not divs. It is rendered inside whatever markdown
 * element the citation landed in, which is usually a `<p>` or an `<li>`, and a
 * `<div>` inside a `<p>` is invalid HTML that React reparents at hydration,
 * producing a mismatch that only shows up in production.
 *
 * Deliberately smaller than the card on the search and library pages. Ten ideas
 * each carrying the full hook / retain / reward breakdown is a wall; here the
 * job is to prove the reel is real and get out of the way, so it carries the
 * thumbnail, who made it, how far it beat them, and what it would take to film.
 */
export function ReelCite({ reel }: { reel: ReelRow }) {
  const effort = estimateEffort(reel);
  return (
    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-2 flex w-full items-center gap-3 rounded-xl border border-hairline bg-navy-raised/60 p-2 no-underline transition-colors hover:border-vivid-blue/50"
    >
      <span className="block w-12 shrink-0 overflow-hidden rounded-lg bg-navy">
        <span className="block aspect-[9/16] w-full">
          {reel.thumb_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel.thumb_url}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          ) : null}
        </span>
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-display text-sm font-medium text-white">
          @{reel.account}
        </span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-silver-muted">
          <span className="inline-flex items-center gap-1">
            <Flame className="size-3 shrink-0 text-vivid-blue" aria-hidden />
            <span className="tabular-nums">{formatScore(reel.score)}x</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3 shrink-0" aria-hidden />
            <span className="tabular-nums">{compactNumber(reel.views)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3 shrink-0" aria-hidden />
            <span className="tabular-nums">{compactNumber(reel.followers)}</span>
          </span>
        </span>
      </span>

      <span
        className={`shrink-0 rounded-full px-2 py-1 font-body text-[11px] ${EFFORT_STYLE[effort.level]}`}
        title={effort.reason}
      >
        {effort.level}
      </span>
    </a>
  );
}

/** The fallback when the model cites a shortcode the browser never received.
 *  It should not happen, and if it does the visitor still gets a working link
 *  rather than a raw `[[reel:...]]` in the middle of a sentence. */
export function ReelCiteMissing({ shortcode }: { shortcode: string }) {
  return (
    <a
      href={`https://www.instagram.com/reel/${shortcode}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-2 hover:decoration-white"
    >
      this reel
    </a>
  );
}
