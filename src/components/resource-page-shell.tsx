// Shared shell for the video resource pages (claude-*). Renders the minimal
// header + hero (+ optional hero RepoCta) + setup guide + optional YouTube facade
// + optional Boldane CTA + footer, driven by props, so each page.tsx is reduced
// to its unique data. Server component; the only client leaves are Reveal
// (entrance animation), Accordion, and the YouTubeEmbed facade, so the pages ship
// no animation-runtime JS.

import Link from "next/link";
import type { ReactNode } from "react";
import { Accordion } from "@/components/accordion";
import { ResourceFooter } from "@/components/resource-footer";
import { ArticleJsonLd } from "@/components/json-ld";
import { BoldaneCta } from "@/components/boldane-cta";
import { RepoCta } from "@/components/repo-cta";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Troubleshooting, type FIXES } from "@/components/troubleshooting";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

type Step = { title: string; content: ReactNode };

type ResourcePageShellProps = {
  slug: string;
  /** Omit on pages whose YouTube video was removed (no embed, no video schema). */
  videoId?: string;
  videoTitle?: string;
  eyebrow?: string;
  title: string;
  subhead: ReactNode;
  steps: Step[];
  /**
   * Above-the-fold hero CTA (repo-backed / app pages). Rendered before the video
   * so a skimmer meets the primary action first. Most traffic is
   * already-watched-the-video YouTube arrivals, so the fold hands them the thing
   * they clicked through for.
   */
  repoCta?: { href: string; label?: string; icon?: ReactNode };
  /**
   * Keys from FIXES, rendered as a collapsed "if you get stuck" section right
   * after the setup guide. Pick only what applies to the page. See
   * troubleshooting.tsx for where the list came from.
   */
  troubleshooting?: (keyof typeof FIXES)[];
  jsonLd: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified: string;
  };
  /** Inner content of a BoldaneCta card, rendered after the video (optional). */
  boldaneCta?: ReactNode;
  /** Show the "founder of Boldane" footer credit (only on pages with no other Boldane mention). */
  boldaneCredit?: boolean;
};

export function ResourcePageShell({
  slug,
  videoId,
  videoTitle,
  eyebrow = "free resource",
  title,
  subhead,
  steps,
  repoCta,
  troubleshooting,
  jsonLd,
  boldaneCta,
  boldaneCredit,
}: ResourcePageShellProps) {
  return (
    <>
      <ArticleJsonLd
        title={jsonLd.title}
        description={jsonLd.description}
        url={jsonLd.url}
        datePublished={jsonLd.datePublished}
        dateModified={jsonLd.dateModified}
        videoId={videoId}
        videoTitle={videoTitle}
      />
      {/* Minimal header */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="brand-wordmark font-display text-lg tracking-tight"
          >
            oleg melnikov
          </Link>
          <Link
            href="https://www.youtube.com/@Oleg-Melnikov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            youtube
          </Link>
        </div>
      </header>

      <main>
        {/* Hero / title */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <RevealGroup
            immediate
            stagger={0.15}
            className="mx-auto max-w-3xl px-6 text-center"
          >
            <span className="eyebrow inline-block rounded-full border border-hairline bg-vivid-blue/10 px-4 py-1.5 font-body text-xs text-vivid-blue/90">
              {eyebrow}
            </span>

            <h1 className="text-metallic mt-8 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>

            <p className="mt-4 font-body text-lg text-silver-muted md:text-xl">
              {subhead}
            </p>

            {repoCta ? (
              <div className="mt-8">
                <RepoCta href={repoCta.href} label={repoCta.label} icon={repoCta.icon} />
              </div>
            ) : null}
          </RevealGroup>
        </section>

        {/* Setup guide */}
        <section className="pb-16 md:pb-20">
          <RevealGroup stagger={0.12} className="mx-auto max-w-3xl px-6">
            <h2 className="eyebrow font-body text-[13px] text-vivid-blue">
              setup guide
            </h2>

            <div className="mt-8">
              <Accordion items={steps} defaultOpen={0} />
            </div>
          </RevealGroup>
        </section>

        {/* The recurring failures, answered where people get stuck: right after
            the steps, not at the bottom of the page. */}
        {troubleshooting?.length ? (
          <Troubleshooting items={troubleshooting} />
        ) : null}

        {/* YouTube video (click-to-load facade). Omitted when videoId is unset. */}
        {videoId ? (
          <Reveal as="section" className="pb-16 md:pb-32">
            <div className="mx-auto max-w-3xl px-6">
              <YouTubeEmbed videoId={videoId} title={videoTitle ?? title} />
            </div>
          </Reveal>
        ) : null}

        {boldaneCta ? <BoldaneCta>{boldaneCta}</BoldaneCta> : null}
      </main>

      <ResourceFooter currentSlug={slug} boldaneCredit={boldaneCredit} />
    </>
  );
}
