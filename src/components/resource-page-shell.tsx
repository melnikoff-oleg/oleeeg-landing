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
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  FaqJsonLd,
  HowToJsonLd,
} from "@/components/json-ld";
import { GuideFaq } from "@/components/guide-faq";
import type { FaqEntry, HowToStep } from "@/lib/seo/schema";
import { BoldaneCta } from "@/components/boldane-cta";
import { RepoCta } from "@/components/repo-cta";
import { VideoChapters, VideoProof, YouTubeEmbed } from "@/components/youtube-embed";
import { Troubleshooting } from "@/components/troubleshooting";
import { faqEntriesFor, type FixKey } from "@/components/troubleshooting-data";
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
   * Keys from FIXES, rendered as a collapsed "If you get stuck" section right
   * after the setup guide. Pick only what applies to the page. See
   * troubleshooting.tsx for where the list came from.
   */
  troubleshooting?: FixKey[];
  jsonLd: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified: string;
  };
  /**
   * The written guide: the video's content as a readable article, rendered
   * visibly (not behind the accordion) after the setup steps. This is what
   * makes the page worth landing on from a search result rather than only from
   * a video description. Compose it from src/components/guide.tsx.
   */
  guide?: ReactNode;
  /**
   * Questions people really type, answered on the page and mirrored into
   * FAQPage schema from the same array so the two can never drift.
   */
  faq?: FaqEntry[];
  /**
   * Emits HowTo schema. Pass the same steps the guide renders: the step urls
   * point at the `#step-N` ids GuideSteps writes, so a rich result deep links
   * into the walkthrough. Omit on pages that are not how-tos (pricing,
   * comparisons).
   */
  howTo?: { name: string; description: string; steps: HowToStep[]; totalTime?: string };
  /** Trail below Home, for BreadcrumbList. Defaults to the page itself. */
  breadcrumb?: { name: string; path: string }[];
  /** Inner content of a BoldaneCta card, rendered after the video (optional). */
  boldaneCta?: ReactNode;
  /** Show the "Founder of Boldane" footer credit (only on pages with no other Boldane mention). */
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
  guide,
  faq,
  howTo,
  breadcrumb,
  boldaneCta,
  boldaneCredit,
}: ResourcePageShellProps) {
  const trail = breadcrumb ?? [{ name: title, path: `/${slug}` }];
  // ONE FAQPage per page, built from the page's own questions plus the exact
  // troubleshooting entries it renders. Two FAQPage blocks on one document is a
  // validation smell, and the troubleshooting answers are the long-tail queries
  // people type verbatim ("Command not found Claude", "credit balance too
  // low"), so leaving them out of the markup wastes the best-matching copy on
  // the page.
  const faqEntries = [...(faq ?? []), ...faqEntriesFor(troubleshooting ?? [])];
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
      <BreadcrumbJsonLd trail={trail} />
      {faqEntries.length ? <FaqJsonLd entries={faqEntries} /> : null}
      {howTo ? (
        <HowToJsonLd
          name={howTo.name}
          description={howTo.description}
          url={jsonLd.url}
          steps={howTo.steps}
          totalTime={howTo.totalTime}
        />
      ) : null}
      {/* Minimal header */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="brand-wordmark font-display text-lg tracking-tight"
          >
            Oleg Melnikov
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
            YouTube
          </Link>
        </div>
      </header>

      <main>
        {/*
          The hero.

          Two shapes, chosen by whether the page has a video.

          With one, it is a two-column fold: the claim, the answer and the
          primary button on the left, the player on the right. The video moved
          up here from the bottom of the page for two reasons that point the
          same way. Google will not treat a page as a watch page, and will not
          show a video thumbnail for it, unless the video is the main content
          rather than a footnote. And a reader who arrived from a search result
          has never heard of Oleg: a player showing a six-figure view count is
          the fastest honest answer to "why should I trust this page".

          The button still comes before the player in the DOM, on every screen.
          That ordering is worth 17% versus 2-7% conversion (see RepoCta), and
          most arrivals here have already watched the thing.

          Without a video the old centered hero is still right: there is nothing
          to put in the second column.
        */}
        <section className="pt-12 pb-10 md:pt-20 md:pb-14">
          {videoId ? (
            <RevealGroup
              immediate
              stagger={0.15}
              className="mx-auto max-w-5xl px-6"
            >
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
                <div>
                  <span className="eyebrow inline-block rounded-full border border-hairline bg-vivid-blue/10 px-4 py-1.5 font-body text-xs text-vivid-blue/90">
                    {eyebrow}
                  </span>

                  <h1 className="text-metallic mt-6 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
                    {title}
                  </h1>

                  <p className="mt-4 font-body text-lg text-silver-muted md:text-xl">
                    {subhead}
                  </p>

                  {repoCta ? (
                    <div className="mt-7 flex flex-col items-start gap-3">
                      <RepoCta
                        href={repoCta.href}
                        label={repoCta.label}
                        icon={repoCta.icon}
                        align="start"
                      />
                    </div>
                  ) : null}

                  {/*
                    The one line that serves both arrivals at once. Someone from
                    the video description wants the steps and has no use for the
                    player; someone from Google wants to know there is a written
                    version before they commit to sixteen minutes of video.
                  */}
                  <p className="mt-6 font-body text-sm text-silver-muted">
                    <a
                      href="#setup-guide"
                      className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                    >
                      Jump to the setup steps
                    </a>
                    {guide ? (
                      <>
                        {" "}
                        or{" "}
                        <a
                          href="#written-guide"
                          className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                        >
                          read the whole thing in writing
                        </a>
                      </>
                    ) : null}
                    .
                  </p>
                </div>

                <div>
                  <YouTubeEmbed videoId={videoId} title={videoTitle ?? title} />
                  <VideoProof videoId={videoId} />
                </div>
              </div>

              <VideoChapters videoId={videoId} />
            </RevealGroup>
          ) : (
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
          )}
        </section>

        {/* Setup guide */}
        <section id="setup-guide" className="scroll-mt-8 pb-16 md:pb-20">
          <RevealGroup stagger={0.12} className="mx-auto max-w-3xl px-6">
            <h2 className="eyebrow font-body text-[13px] text-vivid-blue">
              Setup guide
            </h2>

            <div className="mt-8">
              <Accordion items={steps} defaultOpen={0} />
            </div>
          </RevealGroup>
        </section>

        {/* The written guide. Visible prose, no toggle: the accordion above is a
            checklist, this is the article. */}
        {guide}

        {/* The recurring failures, answered where people get stuck: right after
            the steps, not at the bottom of the page. */}
        {troubleshooting?.length ? (
          <Troubleshooting items={troubleshooting} />
        ) : null}

        {faq?.length ? <GuideFaq entries={faq} /> : null}

        {boldaneCta ? <BoldaneCta>{boldaneCta}</BoldaneCta> : null}
      </main>

      <ResourceFooter currentSlug={slug} boldaneCredit={boldaneCredit} />
    </>
  );
}
