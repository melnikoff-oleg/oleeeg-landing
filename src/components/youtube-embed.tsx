"use client";

import { useState } from "react";

/**
 * Lightweight YouTube facade. Renders a poster + play button (a few KB) and only
 * swaps in the real ~0.5-1MB player iframe once the user actually taps play.
 * On phones arriving over mobile data this cuts first-load weight sharply on the
 * top-traffic resource pages, with no layout shift (fixed 16:9 box).
 *
 * Drop-in replacement for the old inline block:
 *   <div className="glow-blue overflow-hidden rounded-2xl border border-hairline">
 *     <div style={{ paddingBottom: "56.25%" }}><iframe .../></div>
 *   </div>
 */
export function YouTubeEmbed({
  videoId,
  title,
  className,
}: {
  videoId: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [posterOk, setPosterOk] = useState(true);

  return (
    <div
      className={`glow-blue overflow-hidden rounded-2xl border border-hairline ${className ?? ""}`}
    >
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            data-testid="youtube-facade"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer bg-navy-raised"
          >
            {/* Poster. hqdefault exists for every public video; if it 404s (a
                private/removed video), we drop it and keep the clean play tile
                rather than showing a broken image. */}
            {posterOk && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                onError={() => setPosterOk(false)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}
            {/* Scrim for contrast on the play button */}
            <span className="absolute inset-0 bg-navy/25 transition-colors duration-300 group-hover:bg-navy/40" />
            {/* Play button */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-silver/25 bg-navy/60 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-vivid-blue md:size-20">
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-7 text-white md:size-9">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
