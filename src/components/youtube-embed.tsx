import { clock, compactViews, videoMeta, watchUrl } from "@/lib/videos";

/**
 * A real YouTube player.
 *
 * This used to be a click-to-load facade: a poster plus a play button that
 * swapped in the iframe on tap, which saved about half a megabyte on load.
 * Google's video documentation rules that out in one line: a video "must not
 * rely on user actions (such as swiping, clicking, or typing) to load", and a
 * page whose video cannot be loaded is not eligible for a video result at all.
 * The facade was buying page weight at the cost of the entire feature, on the
 * pages whose whole reason to exist is a video.
 *
 * So the iframe is real and its `src` is in the HTML. `loading="lazy"` keeps it
 * off the critical path without hiding it from a crawler: the browser fetches
 * it on approach, no interaction required.
 *
 * A bonus of the swap: this is now a server component, so the resource pages
 * ship less JavaScript than they did with the facade, not more.
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
  return (
    <div
      className={`glow-blue overflow-hidden rounded-2xl border border-hairline ${className ?? ""}`}
    >
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          data-testid="youtube-embed"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

/**
 * The credibility line under the player.
 *
 * Someone arriving from a search result has no idea who wrote this. The single
 * most useful thing the page can tell them in one glance is that the video it
 * is built from has been watched a hundred thousand times. The numbers are real
 * and dated (src/lib/videos.ts), never rounded up.
 */
export function VideoProof({ videoId }: { videoId: string }) {
  const meta = videoMeta(videoId);
  if (!meta) return null;
  const posted = new Date(`${meta.uploadDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm text-silver-muted">
      <a
        href={watchUrl(videoId)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-silver transition-colors hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4 text-[#ff0000]">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        <strong className="font-medium">{compactViews(meta.views)} views</strong>
      </a>
      <span aria-hidden>&middot;</span>
      <span>{clock(meta.seconds)} long</span>
      <span aria-hidden>&middot;</span>
      <span>Published {posted}</span>
    </p>
  );
}

/**
 * The chapters, as links into the exact second on YouTube.
 *
 * Oleg already writes these into every description, so they cost nothing to
 * surface, and they do three jobs at once: they tell a reader from Google what
 * the video actually covers before committing sixteen minutes; they let a
 * reader from YouTube jump back to the part they came looking for; and they are
 * the visible half of the `hasPart` Clip data that makes a result eligible for
 * Google's key-moments treatment.
 */
export function VideoChapters({ videoId }: { videoId: string }) {
  const meta = videoMeta(videoId);
  if (!meta || meta.chapters.length < 2) return null;
  return (
    <nav aria-label="Video chapters" className="mt-4">
      <ul className="flex flex-wrap gap-2">
        {meta.chapters.map((c) => (
          <li key={c.start}>
            <a
              href={watchUrl(videoId, c.start)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-3.5 py-2 font-body text-sm text-silver-muted transition-colors hover:border-vivid-blue/50 hover:text-white"
            >
              <span className="font-mono text-xs text-vivid-blue">{clock(c.start)}</span>
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
