"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Eye, Heart, Search, X, Zap } from "lucide-react";
import { Sticker } from "./sticker";
import {
  compactNumber,
  engagementRate,
  formatDate,
  formatDuration,
  formatScore,
} from "@/lib/reels/format";
import type { ReelRow } from "@/lib/reels/types";

/** One measured number under one word. The whole metrics block is these. */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border-2 border-[#16233f] bg-[#f5eee1] px-3 py-2">
      <p className="ui text-base tabular-nums text-[#16233f]">{value}</p>
      <p className="caption mt-0.5 text-[10px]">{label}</p>
    </div>
  );
}

/**
 * One of the three fields the library is written in.
 *
 * Always open here, unlike the older cards' <details>. A visitor who has
 * clicked one reel out of two thousand wants the whole write-up, not three more
 * things to click.
 */
function Field({
  icon: Icon,
  label,
  summary,
  points,
  colour,
}: {
  icon: typeof Eye;
  label: string;
  summary: string | null;
  points: string[] | null;
  colour: string;
}) {
  const bullets = points ?? [];
  if (!summary && bullets.length === 0) return null;
  return (
    <section className="border-t-2 border-dashed border-[rgba(22,35,63,0.2)] pt-4">
      <div className="flex items-center gap-2">
        <span
          className="flex size-6 items-center justify-center rounded-full border-2 border-[#16233f]"
          style={{ background: colour }}
          aria-hidden
        >
          <Icon className="size-3 text-[#fffaf1]" />
        </span>
        <h4 className="eyebrow" style={{ color: colour }}>
          {label}
        </h4>
      </div>
      {summary ? (
        <p className="ui mt-2 text-[15px] text-[#16233f]">{summary}</p>
      ) : null}
      {bullets.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {bullets.map((point, i) => (
            <li
              key={`${i}-${point}`}
              className="prose relative pl-4 text-[14px] text-[#5d6478]"
            >
              {/* The bullet is a real element rather than a ::before, because
                  its colour changes per field and a pseudo-element cannot take
                  an inline style. */}
              <span
                aria-hidden
                className="absolute left-0 top-[0.62em] size-1.5 rounded-full"
                style={{ background: colour }}
              />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/**
 * The breakdown of one reel, in a native <dialog>.
 *
 * Native rather than a hand-rolled overlay because showModal() already gives
 * the four things such an overlay always gets wrong: the top layer, Escape to
 * close, the inert background, and focus moved into the dialog and returned to
 * the tile on close. The only things left to write are the backdrop click and
 * locking the page scroll behind it.
 */
export function ReelSheet({
  reel,
  onClose,
}: {
  reel: ReelRow | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reel && !el.open) el.showModal();
    if (!reel && el.open) el.close();
  }, [reel]);

  // The page behind a modal must not scroll under the thumb. Restoring the
  // previous value rather than clearing it, so this cannot fight another
  // component that had its own reason to lock.
  useEffect(() => {
    if (!reel) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [reel]);

  if (!reel) return null;

  const handle = `@${reel.account}`;
  const title = reel.idea?.trim() || reel.hook_summary?.trim() || handle;
  const tags = (reel.tags ?? []).slice(0, 10);

  return (
    <dialog
      ref={ref}
      // Escape fires a cancel; close covers the backdrop click below and any
      // other route out, so the parent's state can never drift from the DOM.
      onCancel={onClose}
      onClose={onClose}
      // The dialog's own box is the backdrop's hit area, so a click that lands
      // on the element itself rather than on the card inside it is a click
      // outside. currentTarget === target is what distinguishes them.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="reel-sheet"
      aria-label={`${title}, by ${handle}`}
    >
      <div className="paper-card relative w-full max-w-[720px] overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border-2 border-[#16233f] bg-[#f04e37] text-[#fffaf1] transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="max-h-[86svh] overflow-y-auto overscroll-contain p-5 sm:p-7">
          <div className="grid grid-cols-[112px_1fr] gap-5 sm:grid-cols-[152px_1fr]">
            <a
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block self-start overflow-hidden rounded-xl border-2 border-[#16233f] bg-[#ece0cc]"
              aria-label={`open this reel on instagram`}
            >
              <div className="aspect-[9/16] w-full">
                {reel.thumb_url ? (
                  <img
                    src={reel.thumb_url}
                    alt=""
                    width={360}
                    height={640}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Sticker name="play" size={52} tilt={-6} />
              </span>
            </a>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">
                  <Zap className="size-3.5 fill-[#16233f]" aria-hidden />
                  {formatScore(reel.score)}x outlier
                </span>
                <span className="caption">{formatDate(reel.posted_on)}</span>
              </div>

              <h3 className="mt-2 text-[19px] font-medium leading-[1.15] tracking-[-0.02em] text-[#16233f] sm:text-[23px]">
                {title}
              </h3>

              <p className="ui mt-2 text-[14px] text-[#5d6478]">
                <a
                  href={`https://www.instagram.com/${reel.account}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2c5be6] underline decoration-2 underline-offset-2"
                >
                  {handle}
                </a>
                {reel.creator && reel.creator.toLowerCase() !== reel.account.toLowerCase()
                  ? ` ${reel.creator}`
                  : ""}
                {reel.followers ? ` · ${compactNumber(reel.followers)} followers` : ""}
              </p>

              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-coral mt-4 w-full sm:w-auto"
              >
                watch it on instagram
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat value={compactNumber(reel.views)} label="views" />
            <Stat value={compactNumber(reel.likes)} label="likes" />
            <Stat value={compactNumber(reel.comments)} label="comments" />
            <Stat value={compactNumber(reel.shares)} label="shares" />
            <Stat value={compactNumber(reel.saves)} label="saves" />
            <Stat value={formatDuration(reel.duration_sec)} label="long" />
            <Stat value={engagementRate(reel.likes, reel.views)} label="liked" />
            <Stat value={compactNumber(reel.followers)} label="followers" />
          </div>

          <div className="mt-6 space-y-4">
            <Field
              icon={Search}
              label="the hook"
              summary={reel.hook_summary}
              points={reel.hook_points}
              colour="#2c5be6"
            />
            <Field
              icon={Eye}
              label="what held them"
              summary={reel.retain_summary}
              points={reel.retain_points}
              colour="#f04e37"
            />
            <Field
              icon={Heart}
              label="what they got"
              summary={reel.reward_summary}
              points={reel.reward_points}
              colour="#2fa46a"
            />
          </div>

          {tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-1.5 border-t-2 border-dashed border-[rgba(22,35,63,0.2)] pt-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="caption rounded-full border border-[rgba(22,35,63,0.25)] px-2 py-1 text-[10px] text-[#5d6478]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
