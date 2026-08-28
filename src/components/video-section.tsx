import Link from "next/link";
import { RevealGroup } from "@/components/motion/reveal";
import { LazyVideo } from "@/components/lazy-video";

const YOUTUBE_URL = "https://youtu.be/AKtT6NLZGoM";

export function VideoSection() {
  return (
    <section id="watch" className="py-16 md:py-32">
      <RevealGroup stagger={0.15} className="mx-auto max-w-4xl px-6">
        <h2 className="eyebrow font-body text-[13px] text-vivid-blue">
          Watch
        </h2>

        <p className="mt-8 font-body text-xl text-silver md:text-2xl">
          I share my journey building with AI on YouTube.
        </p>

        {/* Looping video preview */}
        <div className="mt-10">
          <Link
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="surface-card glow-blue group relative block overflow-hidden p-0"
          >
            <LazyVideo
              src="/preview.mp4"
              poster="/preview-poster.jpg"
              className="w-full transition-all duration-500 group-hover:scale-105 group-hover:blur-md"
            />

            {/* Subtle darkening + overlay. Phones have no hover, so the label
                is always visible below lg and hover-revealed on desktop. */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/40 transition-all duration-500 group-hover:bg-navy/50 lg:bg-navy/20">
              <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-navy/70 px-5 py-2.5 font-display text-lg font-medium tracking-tight text-silver opacity-100 backdrop-blur-sm transition-all duration-500 md:text-2xl lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-xl lg:opacity-0 lg:backdrop-blur-none lg:group-hover:opacity-100">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4 lg:hidden">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
                watch on YouTube
              </span>
            </div>
          </Link>
        </div>

        <p className="mt-6 text-center font-body text-silver-muted">
          New Claude Code and AI-for-marketing tutorials every week.
        </p>
      </RevealGroup>
    </section>
  );
}
