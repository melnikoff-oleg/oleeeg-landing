import Link from "next/link";
import { ResourceFooter } from "@/components/resource-footer";
import { ArticleJsonLd } from "@/components/json-ld";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { RULES, THREE_QUESTIONS } from "./rules";

// Companion page to the YouTube video "How Elon Musk Uses AI Daily".
//
// This page is deliberately plainer than the rest of the site. It is filmed:
// Oleg screen-records it and talks over it, so every element on screen has to
// be either the rule or the proof of the rule. No cards, no callouts, no
// summary boxes, no "why this matters". One number, one headline, three lines,
// one clip that opens on the exact second he says it.
//
// Deliberately NO scroll reveal animation, unlike every other page here. The
// site's Reveal starts elements at opacity 0 and fades them in on intersection,
// and a fast programmatic scroll can outrun the observer and leave a section
// blank for a beat. That is invisible to a normal reader and fatal on a page
// whose whole job is to be scrolled through on camera. Everything renders.
//
// The only client leaves are the YouTubeEmbed facades, which ship no iframe
// until you tap play.

const PUBLISHED = "2026-08-01T00:00:00Z";

function watchUrl(videoId: string, start: number) {
  return `https://www.youtube.com/watch?v=${videoId}&t=${start}s`;
}

export default function ElonAiPage() {
  return (
    <>
      <ArticleJsonLd
        title="How Elon Musk uses AI daily: his seven rules"
        description="Seven rules for using AI, taken from what Elon Musk says he actually does. Every rule is one short paragraph and one clip that opens on the exact second he says it."
        url="https://oleg.ae/elon-ai"
        datePublished={PUBLISHED}
        dateModified={PUBLISHED}
      />

      {/* Minimal header, matching the rest of the resource pages. */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-2xl items-center justify-between px-6 py-4">
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
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="size-4"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            youtube
          </Link>
        </div>
      </header>

      <main>
        {/* Hero. Three lines and nothing else, so the first rule is almost
            above the fold even on a phone. */}
        <section className="mx-auto max-w-2xl px-6 pt-10 pb-12 md:pt-16 md:pb-16">
          <p className="eyebrow font-body text-[13px] text-vivid-blue">
            how elon musk uses ai daily
          </p>
          <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl">
            His seven rules
          </h1>
          <p className="mt-6 max-w-[38ch] font-body text-lg leading-relaxed text-silver-muted sm:text-xl">
            Seven things he actually does, and the clip where he says each one.
            Tap play on any of them.
          </p>
        </section>

        {/* The seven. */}
        <div className="mx-auto max-w-2xl px-6 pb-4">
          {RULES.map((rule) => (
            <section
              key={rule.id}
              id={rule.id}
              data-testid="rule"
              className="border-t border-hairline py-14 first:border-t-0 first:pt-0 md:py-20"
            >
              {/* Number, then a hairline running to the edge of the measure.
                  Reads as a chapter mark, and stays legible at 390px where a
                  big ghost numeral would fight the headline. */}
              <div className="flex items-center gap-4">
                <span className="font-body text-[13px] font-bold tabular-nums tracking-[0.2em] text-vivid-blue">
                  {rule.num}
                </span>
                <span aria-hidden className="h-px flex-1 bg-hairline" />
              </div>

              <h2 className="mt-7 font-display text-[1.75rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl">
                {rule.title}
              </h2>

              <p className="mt-5 max-w-[44ch] font-body text-lg leading-relaxed text-silver sm:text-xl">
                {rule.body}
              </p>

              {/* Rule one names three questions almost nobody can define, so
                  each one gets a plain-English line. This is the only place on
                  the page carrying anything beyond the rule itself. */}
              {rule.id === "r1" && (
                <>
                  <dl className="mt-8 flex flex-col gap-4 border-l-2 border-vivid-blue/50 pl-5">
                    {THREE_QUESTIONS.map((item) => (
                      <div key={item.q}>
                        <dt className="font-display text-lg font-semibold tracking-tight text-white">
                          {item.q}
                        </dt>
                        <dd className="mt-1 font-body text-base leading-relaxed text-silver-muted">
                          {item.plain}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 max-w-[44ch] font-body text-base leading-relaxed text-silver-muted">
                    His verdict on all three, in the clip below: terrible.
                  </p>
                </>
              )}

              <div className="mt-9 md:mt-10">
                <YouTubeEmbed
                  videoId={rule.videoId}
                  start={rule.start}
                  title={rule.clipTitle}
                />
                <a
                  href={watchUrl(rule.videoId, rule.start)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="clip-source"
                  className="mt-3 flex min-h-11 items-center font-body text-[15px] text-silver-muted transition-colors hover:text-white"
                >
                  {rule.source}, from {rule.at}
                </a>
              </div>
            </section>
          ))}
        </div>

        {/* Close. One thing to do, and the reason to believe the page. */}
        <section className="mx-auto max-w-2xl px-6 pb-16 md:pb-20">
          <div className="border-t border-hairline pt-14 md:pt-20">
            <h2 className="font-display text-[1.75rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl">
              Start with rule one.
            </h2>
            <p className="mt-5 max-w-[44ch] font-body text-lg leading-relaxed text-silver sm:text-xl">
              Write down three questions you already know the answers to. That
              is your test for every model that comes out from now on.
            </p>
            <p className="mt-8 max-w-[46ch] font-body text-base leading-relaxed text-silver-muted">
              Every clip on this page is him saying it, uncut, at the second it
              was said. Nothing here is a paraphrase.
            </p>
          </div>
        </section>
      </main>

      {/* One Boldane moment per page: this one gets the footer credit line. */}
      <ResourceFooter currentSlug="elon-ai" boldaneCredit />
    </>
  );
}
