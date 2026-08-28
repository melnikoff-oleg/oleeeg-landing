"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ResourceFooter } from "@/components/resource-footer";
import { books, experts, stats, type Video } from "./data";

// talks shown per expert before the fold; data.ts sorts each expert's
// videos by views, so these are the top talks. The rest stay in the HTML
// inside a <details>, which keeps the page from being a 38-screen scroll
// on a phone while every link remains crawlable.
const TOP_TALKS = 3;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

// subtle per-expert accent for the monogram chips
const accents: Record<string, string> = {
  hormozi: "from-amber-500/30 to-orange-500/10 text-amber-200",
  brunson: "from-sky-500/30 to-blue-500/10 text-sky-200",
  cialdini: "from-violet-500/30 to-purple-500/10 text-violet-200",
  vaynerchuk: "from-rose-500/30 to-red-500/10 text-rose-200",
  ogilvy: "from-emerald-500/30 to-teal-500/10 text-emerald-200",
  godin: "from-fuchsia-500/30 to-pink-500/10 text-fuchsia-200",
  ralston: "from-cyan-500/30 to-sky-500/10 text-cyan-200",
  patel: "from-lime-500/30 to-green-500/10 text-lime-200",
  mrbeast: "from-indigo-500/30 to-blue-500/10 text-indigo-200",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

function formatDuration(d: string) {
  const parts = d.split(":").map(Number);
  let h = 0,
    m = 0,
    s = 0;
  if (parts.length === 3) [h, m, s] = parts;
  else if (parts.length === 2) [m, s] = parts;
  const pad = (x: number) => String(x).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function VideoCard({ v }: { v: Video }) {
  return (
    <motion.a
      variants={fadeUp}
      href={v.url}
      target="_blank"
      rel="noopener noreferrer"
      className="surface-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-vivid-blue/40"
    >
      <div className="surface-raised relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={v.thumb}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-[1.01] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60" />
        <span className="absolute bottom-2 right-2 rounded-md bg-navy/80 px-1.5 py-0.5 font-body text-[11px] font-medium tabular-nums text-silver backdrop-blur-sm">
          {formatDuration(v.duration)}
        </span>
        {/* play glyph on hover */}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-vivid-blue/25 backdrop-blur-md ring-1 ring-vivid-blue/40">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 size-5 text-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-base font-medium leading-snug text-silver sm:text-sm">
          {v.title}
        </h3>
        <p className="mt-1.5 font-body text-xs text-silver-muted">
          {v.channel} · {formatViews(v.views)} views
        </p>
        <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-silver-muted sm:text-xs">
          {v.summary}
        </p>
      </div>
    </motion.a>
  );
}

export default function MarketingBrainKnowledgePage() {
  return (
    <>
      {/* Minimal header */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="brand-wordmark font-display text-lg tracking-tight"
          >
            Oleg Melnikov
          </Link>
          <Link
            href="/marketing-brain"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-vivid-blue px-4 py-2 font-body text-sm font-medium text-white shadow-[0_10px_40px_-12px_rgba(40,99,240,0.7)] transition-colors hover:bg-[#1b50d8]"
          >
            ask the brain →
          </Link>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(40,99,240,0.18),transparent)]"
        />

        {/* Hero */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="mx-auto max-w-3xl px-6 text-center"
          >
            <motion.span
              variants={fadeUp}
              className="eyebrow inline-block rounded-full border border-hairline bg-vivid-blue/10 px-4 py-1.5 font-body text-xs text-vivid-blue/90"
            >
              curated knowledge base
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-metallic mt-8 w-full min-w-0 font-display text-[1.9rem] leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
            >
              $1B Marketing Brain
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl font-body text-lg text-silver-muted md:text-xl"
            >
              The greatest marketing minds, distilled into one searchable brain:
              every book and every talk that shapes how I think about growth,
              offers, and building an audience.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-body text-sm text-silver-muted"
            >
              {[
                `${stats.experts} legendary experts`,
                `${stats.books} books`,
                `${stats.videos} talks`,
                `${formatViews(stats.totalViews)}+ views distilled`,
              ].map((s, i) => (
                <span key={s} className="flex items-center gap-3">
                  {i > 0 && <span className="text-silver-muted/50">·</span>}
                  <span className="font-medium text-silver">{s}</span>
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Books */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="pb-20 md:pb-28"
        >
          <div className="mx-auto max-w-6xl px-6">
            <motion.h2
              variants={fadeUp}
              className="eyebrow font-body text-[13px] text-vivid-blue"
            >
              The bookshelf
            </motion.h2>
            <motion.div
              variants={stagger}
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
            >
              {books.map((b) => (
                <motion.div key={b.slug} variants={fadeUp} className="group">
                  <div className="relative aspect-2/3 overflow-hidden rounded-lg ring-1 ring-hairline transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-vivid-blue/20 group-hover:ring-vivid-blue/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.cover}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-3 font-display text-sm font-medium leading-snug text-silver">
                    {b.title}
                  </p>
                  <p className="font-body text-xs text-silver-muted">{b.author}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Expert quick-nav (sticky on the long scroll) with an always-present CTA */}
        <div className="sticky top-0 z-20 border-y border-hairline bg-navy/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-6">
            <div className="relative min-w-0 flex-1">
              <nav className="flex gap-3 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {experts.map((e) => (
                  <a
                    key={e.slug}
                    href={`#${e.slug}`}
                    data-testid="kb-nav-chip"
                    className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-hairline px-3 font-body text-sm font-medium text-silver-muted transition-colors hover:border-vivid-blue/50 hover:text-white sm:px-4"
                  >
                    {e.name}
                  </a>
                ))}
              </nav>
              {/* fade hint: the scrollbar is hidden, so this is what says
                  the rail scrolls instead of a chip looking hard-clipped */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-navy to-transparent"
              />
            </div>
            <Link
              href="/marketing-brain"
              className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-vivid-blue px-4 font-body text-sm font-medium text-white shadow-[0_10px_40px_-12px_rgba(40,99,240,0.7)] transition-colors hover:bg-[#1b50d8]"
            >
              ask&nbsp;→
            </Link>
          </div>
        </div>

        {/* Experts + videos */}
        <div className="mx-auto max-w-6xl px-6 pt-16">
          {experts.map((e) => {
            const totalViews = e.videos.reduce((a, v) => a + v.views, 0);
            return (
              <motion.section
                key={e.slug}
                id={e.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
                className="scroll-mt-20 pb-20 md:pb-28"
              >
                {/* expert header */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap items-center gap-4 border-b border-hairline pb-6"
                >
                  <span
                    className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                      accents[e.slug] ?? "from-vivid-blue/30 to-vivid-blue/10 text-silver"
                    } text-lg font-semibold ring-1 ring-hairline`}
                  >
                    {initials(e.name)}
                  </span>
                  {/* flex-1 keeps the name beside the avatar on every expert;
                      without it the block wraps below on long subtitles */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-metallic font-display text-2xl tracking-tight md:text-3xl">
                      {e.name}
                    </h2>
                    <p className="mt-1 font-body text-sm text-silver-muted">
                      {e.books.length > 0 && (
                        <span className="text-silver">
                          {e.books.join(" · ")}
                          {"  ·  "}
                        </span>
                      )}
                      {e.videos.length} talks · {formatViews(totalViews)} views
                    </p>
                  </div>
                </motion.div>

                {/* videos grid: top talks up front, the rest folded */}
                <motion.div
                  variants={stagger}
                  className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {e.videos.slice(0, TOP_TALKS).map((v) => (
                    <VideoCard key={v.id} v={v} />
                  ))}
                </motion.div>
                {e.videos.length > TOP_TALKS && (
                  /* named group: VideoCard uses the bare `group` class, so an
                     unnamed group here would leak hover into every card */
                  <details className="group/talks mt-5">
                    <summary
                      data-testid="see-all-talks"
                      className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-full text-sm font-medium text-silver-muted transition-colors hover:text-white [&::-webkit-details-marker]:hidden"
                    >
                      see all {e.videos.length} talks
                      <ChevronDown className="size-4 transition-transform duration-200 group-open/talks:rotate-180" />
                    </summary>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {e.videos.slice(TOP_TALKS).map((v) => (
                        <VideoCard key={v.id} v={v} />
                      ))}
                    </div>
                  </details>
                )}
              </motion.section>
            );
          })}
        </div>

        {/* Footer CTA */}
        <section className="border-t border-hairline py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-metallic font-display text-2xl tracking-tight md:text-3xl">
              This is the brain behind the content
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-silver-muted">
              I built an AI system that turns these minds into answers I can
              query, every claim cited to the exact page or timecode. Ask it
              anything, or follow along as I build AI systems for marketing in
              public.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/marketing-brain"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-vivid-blue px-5 py-2.5 font-body text-sm font-medium text-white shadow-[0_10px_40px_-12px_rgba(40,99,240,0.7)] transition-colors hover:bg-[#1b50d8]"
              >
                ask the brain
              </Link>
              <a
                href="https://www.youtube.com/@Oleg-Melnikov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-5 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
              >
                watch on YouTube
              </a>
            </div>
          </div>
        </section>

        <ResourceFooter currentSlug="marketing-brain" boldaneCredit />
      </main>
    </>
  );
}
