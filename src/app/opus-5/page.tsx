import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { ResourceFooter } from "@/components/resource-footer";
import { ArticleJsonLd } from "@/components/json-ld";
import { RuleRail, type RailItem } from "./rule-rail";
import { VoxelClawd } from "./voxel-clawd";

// A long-form lead magnet: the five practical rules for Claude Opus 5, every
// claim sourced to Anthropic's own charts and docs. Server component; the only
// client leaves are Reveal (entrance animation), the sticky RuleRail and the
// hero VoxelClawd toy, so the page ships no animation-runtime JS.

const RAIL: readonly RailItem[] = [
  { id: "r1", num: "01", label: "effort" },
  { id: "r2", num: "02", label: "prompt" },
  { id: "r3", num: "03", label: "fable 5" },
  { id: "r4", num: "04", label: "which model" },
  { id: "r5", num: "05", label: "security" },
];

/* ---------------------------------------------------------------- primitives */

/** The one thing to actually do, called out beside every rule. */
function Act({
  tag = "do this",
  tone = "blue",
  children,
}: {
  tag?: string;
  tone?: "blue" | "amber";
  children: ReactNode;
}) {
  return (
    <div
      className={`surface-card mt-8 flex flex-col gap-3 rounded-r-xl border-l-4 p-5 sm:flex-row sm:gap-5 sm:p-6 md:mt-10 ${
        tone === "amber" ? "border-l-amber-400" : "border-l-vivid-blue"
      }`}
    >
      <span className="eyebrow shrink-0 pt-1 font-body text-[13px] text-silver-muted sm:w-20">
        {tag}
      </span>
      <p className="font-display text-lg font-medium leading-snug tracking-tight text-white sm:text-xl">
        {children}
      </p>
    </div>
  );
}

/** Figure caption, styled as the small headline above a chart. */
function FigureTitle({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
      {children}
    </p>
  );
}

/** Footnote block under a rule: the receipts, plus the links they came from. */
function Notes({ children }: { children: ReactNode }) {
  return (
    <div className="mt-10 flex flex-col gap-3 border-t border-dashed border-hairline pt-5">
      <p className="eyebrow font-body text-[13px] text-silver-muted">notes</p>
      {children}
    </div>
  );
}

function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="font-body text-base leading-relaxed text-silver-muted">
      <strong className="font-semibold text-silver">{label}</strong> {children}
    </p>
  );
}

function Sources({
  links,
}: {
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.href + link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="source-link"
          className="inline-flex min-h-11 items-center rounded-lg border border-hairline px-3.5 font-body text-[13px] text-silver-muted transition-colors hover:border-vivid-blue/60 hover:text-white"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

/** Section header: big rule number, headline, and the why underneath. */
function RuleHead({
  num,
  title,
  why,
}: {
  num: string;
  title: string;
  why: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-7">
      <span className="font-body text-3xl font-bold leading-none tracking-tight text-silver/25 md:text-5xl">
        {num}
      </span>
      <div>
        <h2 className="max-w-[20ch] font-display text-2xl font-semibold leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-[44ch] font-body text-lg leading-snug text-silver-muted md:text-xl">
          {why}
        </p>
      </div>
    </div>
  );
}

function Rule({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-hairline py-14 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-6">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------- charts */

type Bar = {
  label: string;
  value: string;
  /** Bar length as a percentage of the row. */
  width: number;
  className: string;
  emphasis?: boolean;
};

/** Plain label / bar / value chart. Stays two columns even at 390px. */
function BarChart({ rows }: { rows: readonly Bar[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[7rem_1fr_auto] sm:gap-4"
        >
          <span
            className={`min-w-0 font-body text-[15px] sm:text-base ${
              row.emphasis ? "font-semibold text-white" : "text-silver-muted"
            }`}
          >
            {row.label}
          </span>
          <span className="flex h-6 items-center">
            <span
              aria-hidden
              className={`h-full rounded-r-md ${row.className}`}
              style={{ width: `${row.width}%` }}
            />
          </span>
          <span className="whitespace-nowrap font-body text-[15px] font-bold tabular-nums text-white sm:text-base">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

type UseCase = {
  label: string;
  share: string;
  width: number;
  model: "haiku" | "sonnet" | "opus";
};

const MODEL_CHIP: Record<UseCase["model"], { text: string; className: string }> =
  {
    haiku: {
      text: "Haiku 4.5",
      className: "border-emerald-400/40 bg-emerald-400/15 text-emerald-300",
    },
    sonnet: {
      text: "Sonnet 5",
      className: "border-sky-400/40 bg-sky-400/15 text-sky-300",
    },
    opus: {
      text: "Opus 5",
      className: "border-fuchsia-400/40 bg-fuchsia-400/15 text-fuchsia-300",
    },
  };

/**
 * Usage share per task, with the model to run it on. Four columns on desktop;
 * below sm the bar and the model chip drop onto their own full-width rows so
 * nothing is squeezed or clipped on a phone.
 */
function UseCaseChart({ rows }: { rows: readonly UseCase[] }) {
  return (
    <div className="flex flex-col gap-5 sm:gap-2.5">
      {rows.map((row) => {
        const chip = MODEL_CHIP[row.model];
        return (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 sm:grid-cols-[11rem_1fr_3.5rem_6.5rem] sm:gap-x-4 sm:gap-y-0"
          >
            <span className="min-w-0 font-body text-base font-semibold leading-tight text-white">
              {row.label}
            </span>
            <span className="whitespace-nowrap font-body text-base font-bold tabular-nums text-white sm:order-3">
              {row.share}
            </span>
            <span className="col-span-2 flex h-4 items-center sm:order-2 sm:col-span-1 sm:h-7">
              <span
                aria-hidden
                className="h-full rounded-r-md bg-silver/25"
                style={{ width: `${row.width}%` }}
              />
            </span>
            <span
              className={`col-span-2 inline-flex w-fit items-center rounded-lg border px-2.5 py-1.5 font-body text-[13px] font-bold sm:order-4 sm:col-span-1 sm:w-full sm:justify-center ${chip.className}`}
            >
              {chip.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ rule 3 data */

type BenchRow = { name: string; opus: string; fable: string; winner: "opus" | "fable" };

const BENCHMARKS: readonly BenchRow[] = [
  { name: "Frontier-Bench", opus: "43.3%", fable: "33.7%", winner: "opus" },
  { name: "AutomationBench", opus: "26.0%", fable: "17.4%", winner: "opus" },
  { name: "OSWorld 2.0", opus: "70.6%", fable: "66.1%", winner: "opus" },
  { name: "BrowseComp", opus: "90.8%", fable: "87.4%", winner: "opus" },
  { name: "ARC-AGI-3", opus: "30.2%", fable: "no score", winner: "opus" },
  { name: "Legal Agent", opus: "11.7%", fable: "13.3%", winner: "fable" },
  { name: "DeepSWE", opus: "68.8%", fable: "69.7%", winner: "fable" },
  { name: "HLE, no tools", opus: "56.3%", fable: "56.5%", winner: "fable" },
  { name: "FrontierCode", opus: "53.4%", fable: "53.5%", winner: "fable" },
];

const OPUS_PRICE = "$5 / $25";
const FABLE_PRICE = "$10 / $50";

/**
 * The benchmark board. A real table from md up; below that the same rows become
 * cards, because a 3-column table in a sideways scroller hides columns on a
 * phone instead of degrading.
 */
function BenchmarkBoard() {
  return (
    <>
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="eyebrow border-b border-hairline px-3 py-3 font-body text-[13px] font-semibold text-silver-muted">
                benchmark
              </th>
              <th className="eyebrow border-b border-hairline px-3 py-3 font-body text-[13px] font-semibold text-silver-muted">
                opus 5 <span className="tabular-nums">{OPUS_PRICE}</span>
              </th>
              <th className="eyebrow border-b border-hairline px-3 py-3 font-body text-[13px] font-semibold text-silver-muted">
                fable 5 <span className="tabular-nums">{FABLE_PRICE}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {BENCHMARKS.map((row) => (
              <tr key={row.name}>
                <td className="border-b border-hairline px-3 py-3 font-body text-base font-semibold text-white">
                  {row.name}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-hairline px-3 py-3 font-body text-base font-bold tabular-nums ${
                    row.winner === "opus" ? "text-vivid-blue" : "text-silver-muted"
                  }`}
                >
                  {row.opus}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-hairline px-3 py-3 font-body text-base font-bold tabular-nums ${
                    row.winner === "fable" ? "text-amber-400" : "text-silver-muted"
                  }`}
                >
                  {row.fable}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul
        data-testid="benchmark-cards"
        className="flex list-none flex-col gap-2.5 md:hidden"
      >
        {BENCHMARKS.map((row) => (
          <li
            key={row.name}
            className="surface-card rounded-xl px-4 py-3.5"
          >
            <p className="font-body text-base font-semibold text-white">
              {row.name}
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <div className="min-w-0">
                <p className="eyebrow font-body text-[13px] text-silver-muted">
                  opus 5
                </p>
                <p
                  className={`mt-1 font-body text-lg font-bold tabular-nums ${
                    row.winner === "opus" ? "text-vivid-blue" : "text-silver-muted"
                  }`}
                >
                  {row.opus}
                </p>
              </div>
              <div className="min-w-0">
                <p className="eyebrow font-body text-[13px] text-silver-muted">
                  fable 5
                </p>
                <p
                  className={`mt-1 font-body text-lg font-bold tabular-nums ${
                    row.winner === "fable" ? "text-amber-400" : "text-silver-muted"
                  }`}
                >
                  {row.fable}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="font-body text-base text-silver-muted md:hidden">
        price per million tokens, input then output. opus 5 {OPUS_PRICE}, fable 5{" "}
        {FABLE_PRICE}.
      </p>
    </>
  );
}

/* ---------------------------------------------------------------------- page */

export default function Opus5Page() {
  return (
    <>
      <ArticleJsonLd
        title="Opus 5, no hype: 5 rules nobody is talking about"
        description="Five practical rules for Claude Opus 5, every one taken from Anthropic's own charts and docs. Why max effort makes answers worse, what to delete from your prompt, why to skip Fable 5, which model to run per task, and what the security numbers actually say."
        url="https://oleg.ae/opus-5"
        datePublished="2026-07-25T00:00:00Z"
        dateModified="2026-07-25T00:00:00Z"
      />

      {/* Minimal header, matching the rest of the resource pages. */}
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

      <RuleRail items={RAIL} />

      <main>
        {/* Hero */}
        <section className="pt-12 pb-10 md:pt-20 md:pb-16">
          <div className="mx-auto grid max-w-3xl items-center gap-8 px-6 md:grid-cols-[1.25fr_0.75fr] md:gap-8">
            <div className="order-2 md:order-1">
              <RevealGroup immediate stagger={0.12}>
                <p className="eyebrow font-body text-[13px] text-vivid-blue">
                  claude opus 5 &middot; released 24 july 2026
                </p>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl">
                  Opus 5, no hype.
                  <br />5 rules nobody is{" "}
                  <span className="text-amber-400">talking about</span>.
                </h1>
                <p className="mt-5 max-w-[36ch] font-body text-lg text-silver-muted">
                  Everything here comes from Anthropic&apos;s own charts and
                  docs. Including the parts that make them look bad.
                </p>
              </RevealGroup>
            </div>
            <div className="order-1 md:order-2">
              <VoxelClawd />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- rule 1 */}
        <Rule id="r1">
          <Reveal>
            <RuleHead
              num="01"
              title="Never use max effort."
              why="It costs 14% more and gives you a worse answer. The peak is one setting below."
            />
          </Reveal>

          <Reveal>
            <Act>
              Coding goes to <b className="text-vivid-blue">xhigh</b>. Everything
              else starts at <b className="text-vivid-blue">medium</b>.
            </Act>
          </Reveal>

          <Reveal as="figure" className="mt-10 flex flex-col gap-4 md:mt-12">
            <FigureTitle>
              The line goes up, then turns down at the last dot
            </FigureTitle>
            {/* The chart's own axis labels are tiny at 390px, so the whole
                figure opens full size on tap. The two numbers that matter are
                restated in the notes below either way. */}
            <a
              href="/opus-5/effort-curve.webp"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-blue"
            >
              <Image
                src="/opus-5/effort-curve.webp"
                alt="Anthropic's Frontier-Bench chart plotting score against cost per attempt. The Opus 5 line rises to 44.4 percent at about 14.50 dollars and then falls to 43.3 percent at about 16.50 dollars."
                width={2000}
                height={1125}
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full rounded-xl border border-hairline"
              />
              <span className="mt-2.5 flex min-h-11 items-center font-body text-[15px] text-silver-muted transition-colors group-hover:text-white md:hidden">
                tap the chart to open it full size
              </span>
            </a>
          </Reveal>

          <Notes>
            <Note label="The numbers.">
              Last two dots on the red Opus 5 line: 44.4% at $14.50, then 43.3%
              at $16.50. More money, lower score. Each dot is one effort level:
              low, medium, high, xhigh, max.
            </Note>
            <Note label="Also true.">
              The same dip appears on two more benchmarks. The AA Coding Agent
              Index loses 2.8% for 16% more money. Humanity&apos;s Last Exam with
              tools costs 38% more to score the same. Anthropic&apos;s summary
              table prints the max number, so their headline understates their
              own model.
            </Note>
            <Sources
              links={[
                {
                  href: "https://www.anthropic.com/news/claude-opus-5",
                  label: "announcement",
                },
                {
                  href: "https://platform.claude.com/docs/en/build-with-claude/effort",
                  label: "effort docs",
                },
              ]}
            />
          </Notes>
        </Rule>

        {/* ---------------------------------------------------------- rule 2 */}
        <Rule id="r2">
          <Reveal>
            <RuleHead
              num="02"
              title={`Delete "verify your work" from your prompt.`}
              why="Opus 5 already checks itself. Telling it to check makes it check twice and bill you for both."
            />
          </Reveal>

          <Reveal>
            <Act>
              Open your prompt file.{" "}
              <b className="text-vivid-blue">Delete the red. Paste the blue.</b>{" "}
              One minute, works forever.
            </Act>
          </Reveal>

          <Reveal as="figure" className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2">
            <div className="flex flex-col gap-3.5 rounded-xl border-2 border-amber-500/50 bg-amber-500/5 p-5 sm:p-6">
              <p className="eyebrow font-body text-[13px] text-silver-muted">
                old way
              </p>
              <p className="font-display text-lg font-bold tracking-tight text-amber-400">
                Written for Opus 4.8
              </p>
              <ul className="flex list-none flex-col gap-2.5">
                {[
                  "Always verify your work before responding.",
                  "Double-check your answer.",
                  "Use a subagent to verify the result.",
                  "Delegate aggressively to subagents.",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 font-body text-base leading-relaxed text-amber-200/90"
                  >
                    <span aria-hidden className="font-bold">
                      &times;
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3.5 rounded-xl border-2 border-vivid-blue/60 bg-vivid-blue/10 p-5 sm:p-6">
              <p className="eyebrow font-body text-[13px] text-silver-muted">
                new way
              </p>
              <p className="font-display text-lg font-bold tracking-tight text-vivid-blue">
                Written for Opus 5
              </p>
              <ul className="flex list-none flex-col gap-2.5">
                {[
                  "Keep responses focused, brief, and concise.",
                  "Delegate to a subagent only for large tasks that are genuinely independent and parallelizable.",
                  "Do not use subagents to verify your own work.",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 font-body text-base font-medium leading-relaxed text-silver"
                  >
                    <span aria-hidden className="font-bold text-vivid-blue">
                      +
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Notes>
            <Note label="Anthropic's own wording.">
              Verification instructions &quot;cause over-verification on Claude
              Opus 5, and removing them reduces wasted tokens with no loss in
              quality.&quot; Every line in the blue card is lifted straight from
              their prompting guide.
            </Note>
            <Note label="The conciseness line is a separate fix.">
              Effort controls how much the model thinks, not how much it says.
              Turning effort down will not shorten the answer, so you have to ask
              for it.
            </Note>
            <Sources
              links={[
                {
                  href: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5",
                  label: "prompting guide",
                },
                {
                  href: "https://platform.claude.com/docs/en/about-claude/models/migration-guide",
                  label: "migration guide",
                },
              ]}
            />
          </Notes>
        </Rule>

        {/* ---------------------------------------------------------- rule 3 */}
        <Rule id="r3">
          <Reveal>
            <RuleHead
              num="03"
              title="Skip Fable 5."
              why="Twice the price of Opus 5. Loses on 9 of the 14 benchmarks Anthropic published."
            />
          </Reveal>

          <Reveal>
            <Act>
              Use <b className="text-vivid-blue">Opus 5</b>. Touch Fable only
              after xhigh has failed the same problem twice.
            </Act>
          </Reveal>

          <Reveal as="figure" className="mt-10 flex flex-col gap-4 md:mt-12">
            <FigureTitle>
              Opus 5 wins the five that matter. Fable 5 wins four by a rounding
              error.
            </FigureTitle>
            <BenchmarkBoard />
          </Reveal>

          <Notes>
            <Note label="The rounding errors.">
              Fable 5&apos;s last three wins are 0.9, 0.2 and 0.1 points. Its one
              real win is legal work, where the best score on the entire board is
              13.3%, so every model fails 87% of the time there.
            </Note>
            <Note label="Never shown on a chart.">
              Fable 5 requires 30 day data retention, cannot be used under zero
              data retention, and its safety classifiers interrupt roughly seven
              times more often than Opus 5&apos;s.
            </Note>
            <Sources
              links={[
                {
                  href: "https://www.anthropic.com/news/claude-opus-5",
                  label: "benchmark table",
                },
                {
                  href: "https://platform.claude.com/docs/en/about-claude/pricing",
                  label: "pricing",
                },
              ]}
            />
          </Notes>
        </Rule>

        {/* ---------------------------------------------------------- rule 4 */}
        <Rule id="r4">
          <Reveal>
            <RuleHead
              num="04"
              title="Match the model to the task."
              why="The gap between cheapest and priciest is ten times. Most people run one model for everything."
            />
          </Reveal>

          <Reveal>
            <Act>
              <span className="font-bold text-emerald-400">Haiku</span> for
              boring repeat work.{" "}
              <span className="font-bold text-sky-400">Sonnet</span> for writing
              and answers.{" "}
              <span className="font-bold text-fuchsia-400">Opus</span> for long
              jobs it finishes on its own.
            </Act>
          </Reveal>

          <Reveal as="figure" className="mt-10 flex flex-col gap-4 md:mt-12">
            <FigureTitle>
              What people actually use Claude for, and what to run it on
            </FigureTitle>

            <div className="grid grid-cols-3 overflow-hidden rounded-xl border-2 border-silver/30">
              {[
                { label: "Work", value: "43%" },
                { label: "Personal", value: "40%" },
                { label: "Coursework", value: "17%" },
              ].map((cell, i) => (
                <div
                  key={cell.label}
                  className={`px-2 py-5 text-center sm:px-3 sm:py-7 ${
                    i < 2 ? "border-r-2 border-silver/30" : ""
                  }`}
                >
                  <p className="font-body text-base font-bold tracking-tight text-white sm:text-lg">
                    {cell.label}
                  </p>
                  <p className="mt-1 font-display text-4xl font-bold leading-none tracking-tight tabular-nums text-white sm:text-5xl">
                    {cell.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <UseCaseChart
                rows={[
                  { label: "Content creation", share: "22.9%", width: 91.6, model: "sonnet" },
                  { label: "Education & learning", share: "12.8%", width: 51.2, model: "sonnet" },
                  { label: "Software development", share: "11.7%", width: 46.8, model: "opus" },
                  { label: "Research", share: "10.9%", width: 43.6, model: "opus" },
                  { label: "Hobbies & lifestyle", share: "9.3%", width: 37.2, model: "haiku" },
                  { label: "Business ops", share: "4.6%", width: 18.4, model: "opus" },
                  { label: "Document processing", share: "4.1%", width: 16.4, model: "haiku" },
                  { label: "Data analysis", share: "3.5%", width: 14.0, model: "sonnet" },
                ]}
              />
            </div>
          </Reveal>

          <Reveal as="figure" className="mt-12 flex flex-col gap-4">
            <FigureTitle>
              The cheapest model is 10 times cheaper than the priciest
            </FigureTitle>
            <BarChart
              rows={[
                { label: "Haiku 4.5", value: "$1 / $5", width: 10, className: "bg-emerald-400" },
                { label: "Sonnet 5", value: "$3 / $15", width: 30, className: "bg-sky-400" },
                { label: "Opus 5", value: "$5 / $25", width: 50, className: "bg-fuchsia-400" },
                { label: "Fable 5", value: "$10 / $50", width: 100, className: "bg-amber-400" },
              ]}
            />
          </Reveal>

          <Notes>
            <Note label="Price is per million tokens, input then output.">
              Output always costs five times input, on every model without
              exception. Bar length is the input price.
            </Note>
            <Note label="Real tasks.">
              Haiku: clean 200 messy addresses, 50 subject line variants, tag a
              folder of receipts. Sonnet: draft the email, summarize the 40 page
              PDF, write one function, explain a contract. Opus: refactor 20
              files, run an agent unattended for an hour, automate a workflow end
              to end.
            </Note>
            <Note label="The overspend.">
              Hobbies and lifestyle is 9.3% of all usage and the single biggest
              place people burn Opus money for zero gain.
            </Note>
            <Sources
              links={[
                {
                  href: "https://platform.claude.com/docs/en/about-claude/pricing",
                  label: "pricing",
                },
                {
                  href: "https://www.anthropic.com/news/claude-opus-5",
                  label: "benchmarks",
                },
              ]}
            />
          </Notes>
        </Rule>

        {/* ---------------------------------------------------------- rule 5 */}
        <Rule id="r5">
          <Reveal>
            <RuleHead
              num="05"
              title="It finds security bugs. Do not believe it cannot exploit them."
              why="Anthropic says the gap between finding and weaponizing is what makes Opus 5 safe to ship."
            />
          </Reveal>

          <Reveal as="figure" className="mt-10 flex flex-col gap-4 md:mt-12">
            <FigureTitle>
              Finding the hole: Opus 5 is already at the frontier
            </FigureTitle>
            <BarChart
              rows={[
                { label: "Opus 4.8", value: "61.5%", width: 77, className: "bg-vivid-blue" },
                { label: "Opus 5", value: "79.4%", width: 99, className: "bg-vivid-blue", emphasis: true },
                { label: "Mythos 5", value: "80.0%", width: 100, className: "bg-vivid-blue" },
              ]}
            />
          </Reveal>

          <Reveal as="figure" className="mt-12 flex flex-col gap-4">
            <FigureTitle>Building the weapon: Opus 5 is far behind</FigureTitle>
            <BarChart
              rows={[
                { label: "Opus 4.8", value: "0", width: 2, className: "bg-amber-400" },
                { label: "Opus 5", value: "4", width: 31, className: "bg-amber-400", emphasis: true },
                { label: "Mythos 5", value: "13", width: 100, className: "bg-vivid-blue" },
              ]}
            />
          </Reveal>

          <Reveal>
            <Act tag="my take" tone="amber">
              Finding the flaw needs{" "}
              <b className="text-amber-400">intelligence</b>. Writing the exploit
              needs <b className="text-amber-400">time</b>. They gated the cheap
              half.
            </Act>
          </Reveal>

          <Notes>
            <Note label="What the charts measure.">
              Top: percentage of OSS-Fuzz challenges where the model correctly
              identified the vulnerability, higher is better. Bottom: number of
              challenges where it produced a working exploit, out of the same
              set. Mythos 5 is Anthropic&apos;s restricted top model, so Opus 5
              is 0.6 points off the frontier at finding and three times behind at
              weaponizing.
            </Note>
            <Note label="The tell.">
              Anthropic runs a Cyber Verification Program that hands approved
              companies a build of Opus 5 with the safeguards removed. The
              classifiers block binary scanning, penetration testing and exploit
              writing, while explicitly allowing source code vulnerability
              hunting.
            </Note>
            <Note label="The fair counter.">
              Turning a memory bug into a working exploit really does need
              separate skills, like defeating memory layout randomization. This is
              opinion, not a finding.
            </Note>
            <Sources
              links={[
                {
                  href: "https://www.anthropic.com/news/claude-opus-5",
                  label: "oss-fuzz chart",
                },
                {
                  href: "https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude-opus-and-sonnet",
                  label: "cyber verification program",
                },
                {
                  href: "https://www.anthropic.com/claude-opus-5-system-card",
                  label: "system card",
                },
              ]}
            />
          </Notes>
        </Rule>

        {/* ---------------------------------------------------------- closer */}
        <section className="border-t border-hairline py-16 md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <p className="eyebrow font-body text-[13px] text-vivid-blue">
                the bottom line
              </p>
              <h2 className="mt-5 max-w-[22ch] font-display text-2xl font-semibold leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl">
                57 days. Same price. Double the score.
              </h2>
              <p className="mt-4 max-w-[44ch] font-body text-lg leading-snug text-silver-muted md:text-xl">
                The last Opus came out in May. This one costs exactly the same
                and scores twice as high on agentic coding.
              </p>
            </Reveal>

            <Reveal className="mt-10 grid overflow-hidden rounded-xl border-2 border-silver/30 md:mt-12 md:grid-cols-2">
              <div className="border-b-2 border-silver/30 p-5 sm:p-7 md:border-b-0 md:border-r-2">
                <p className="eyebrow font-body text-[13px] text-silver-muted">
                  28 may 2026
                </p>
                <p className="mt-1.5 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                  Claude Opus 4.8
                </p>
                <p className="mt-2.5 font-display text-4xl font-bold leading-none tracking-tight tabular-nums text-silver-muted sm:text-5xl">
                  21.1%
                </p>
                <p className="mt-2 font-body text-[15px] text-silver-muted">
                  $5 in / $25 out
                </p>
              </div>
              <div className="p-5 sm:p-7">
                <p className="eyebrow font-body text-[13px] text-silver-muted">
                  24 july 2026 &middot; 57 days later
                </p>
                <p className="mt-1.5 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                  Claude Opus 5
                </p>
                <p className="mt-2.5 font-display text-4xl font-bold leading-none tracking-tight tabular-nums text-vivid-blue sm:text-5xl">
                  43.3%
                </p>
                <p className="mt-2 font-body text-[15px] text-silver-muted">
                  $5 in / $25 out
                </p>
              </div>
            </Reveal>

            <Notes>
              <Note label="The score.">
                Frontier-Bench v0.1, agentic terminal coding, at max effort for
                both models. Opus 4.8 scored 21.1%, Opus 5 scored 43.3%, and the
                price per token did not move between the two releases.
              </Note>
              <Note label="The point.">
                Every cost curve in this release shifted sideways toward cheaper,
                not upward toward a new ceiling. So the move is to spend less for
                the same result, not more for a better one. All five rules are
                versions of that.
              </Note>
              <Sources
                links={[
                  {
                    href: "https://www.anthropic.com/news/claude-opus-4-8",
                    label: "opus 4.8 announcement",
                  },
                  {
                    href: "https://www.anthropic.com/news/claude-opus-5",
                    label: "opus 5 announcement",
                  },
                ]}
              />
            </Notes>
          </div>
        </section>
      </main>

      {/* One Boldane moment per page: this topic gets the footer credit line,
          not a soft CTA card. */}
      <ResourceFooter currentSlug="opus-5" boldaneCredit />
    </>
  );
}
