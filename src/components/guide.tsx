// The long-form written guide that sits under every resource page.
//
// Why it exists: the resource pages were a place to grab files. Everything that
// made the video worth watching stayed in the video, so a visitor from Google
// landed on a download button and left, and Google had nothing to rank. These
// primitives render the video's actual content as a readable article.
//
// Three rules they all follow:
//
// 1. ZERO client JavaScript. Every component here is a server component and
//    ships as plain HTML. The reading surface of the site does not need a
//    runtime, and the fastest script is the one that is never sent.
// 2. Nothing is hidden. The setup accordion above stays collapsible because it
//    is a checklist, but the article body is visible prose: content behind a
//    toggle is content a reader has to work for and a crawler discounts.
// 3. Real headings with real anchors. h2/h3 with ids from slugify(), matching
//    the HowTo step urls and the table of contents, so a rich result can deep
//    link into the answer.

import type { ReactNode } from "react";
import { slugify } from "@/lib/seo/slug";

/** The article wrapper. One per page, holding the whole written guide. */
export function Guide({ children }: { children: ReactNode }) {
  return (
    <section className="pb-16 md:pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* `prose-guide` (globals.css) styles the raw p/ul/ol/strong/a inside,
            so a section's body can be written as plain markup. */}
        <article className="prose-guide">{children}</article>
      </div>
    </section>
  );
}

/**
 * One h2 section of the guide. `title` doubles as the anchor id, so the table
 * of contents and the heading can never disagree.
 */
export function GuideSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  const anchor = id ?? slugify(title);
  return (
    <section id={anchor} className="mt-14 scroll-mt-24 first:mt-0">
      <h2 className="font-display text-2xl font-medium leading-tight tracking-tight text-silver md:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

/**
 * The numbered walkthrough. Deliberately NOT an accordion: this is the part a
 * reader came for. Each step gets `id="step-N"`, which is exactly what
 * howToSchema() points its step urls at.
 */
export function GuideSteps({
  steps,
  start = 1,
}: {
  steps: { title: string; body: ReactNode }[];
  /**
   * The number the first step in this block carries. Pages that split one
   * walkthrough across several sections pass an offset so the numbering keeps
   * running and the `step-N` ids stay unique: rendering three slices that all
   * start at 1 produces three elements with id="step-1", which is invalid HTML
   * and makes the HowTo anchors point at whichever one the browser finds first.
   */
  start?: number;
}) {
  return (
    <ol className="mt-6 space-y-8" start={start}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          id={`step-${start + i}`}
          className="scroll-mt-24 border-l-2 border-vivid-blue/25 pl-5 md:pl-6"
        >
          <h3 className="flex items-baseline gap-3 font-display text-lg font-medium text-silver md:text-xl">
            <span className="font-body text-sm text-vivid-blue">{start + i}</span>
            <span>{s.title}</span>
          </h3>
          <div className="mt-3 space-y-4">{s.body}</div>
        </li>
      ))}
    </ol>
  );
}

/**
 * A two-column facts table: what you need, what it costs, how long it takes.
 * This shape is what Google lifts into a featured snippet, and it answers the
 * "is claude cowork free" class of query in the first screen.
 *
 * Mobile: it stacks. A two-column table at 390px with a long right-hand value
 * is the exact pattern that produces sideways scroll, so below `sm` each row is
 * a label above its value instead.
 */
export function KeyFacts({
  rows,
  caption,
}: {
  rows: { label: string; value: ReactNode }[];
  caption?: string;
}) {
  return (
    <div className="surface-card mt-6 overflow-hidden">
      <dl className="divide-y divide-hairline">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6 md:px-6"
          >
            <dt className="font-body text-sm text-silver-muted sm:w-44 sm:shrink-0">
              {r.label}
            </dt>
            <dd className="min-w-0 font-body text-base text-silver [overflow-wrap:anywhere]">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      {caption ? (
        <p className="border-t border-hairline px-5 py-3 font-body text-sm text-silver-muted md:px-6">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

/** A short aside: a warning, a gotcha, a number worth pulling out. */
export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: "note" | "warn";
  title?: string;
  children: ReactNode;
}) {
  const accent =
    tone === "warn"
      ? "border-amber-400/30 bg-amber-400/[0.06]"
      : "border-vivid-blue/25 bg-vivid-blue/[0.06]";
  return (
    <div className={`mt-6 rounded-xl border ${accent} px-5 py-4 md:px-6`}>
      {title ? (
        <p className="font-display text-base font-medium text-silver">{title}</p>
      ) : null}
      <div className="space-y-3 font-body text-base text-silver [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}

/**
 * Inline code and a wrapping command block, matching troubleshooting.tsx.
 * `overflow-wrap:anywhere` rather than `overflow-x-auto`: on a phone a
 * sideways-scrolling command block hides the end of the line and people copy
 * half a command.
 */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-[0.9em] text-silver [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}

export function Block({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-hairline bg-navy-raised p-4 font-mono text-xs leading-relaxed text-silver [overflow-wrap:anywhere]">
      {children}
    </pre>
  );
}

/** An external link, styled like every other one on the site. */
export function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
    >
      {children}
    </a>
  );
}

/**
 * Table of contents. Real anchor links, so they work with JavaScript disabled
 * and give Google the section list it needs to offer jump-to sitelinks.
 */
export function GuideToc({ sections }: { sections: string[] }) {
  return (
    <nav aria-label="on this page" className="surface-card mt-8 px-5 py-4 md:px-6">
      <p className="eyebrow font-body text-[13px] text-vivid-blue">on this page</p>
      <ul className="mt-3 space-y-2">
        {sections.map((s) => (
          <li key={s}>
            <a
              href={`#${slugify(s)}`}
              className="inline-flex min-h-[44px] items-center font-body text-base text-silver transition-colors hover:text-white"
            >
              {s}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * A comparison table that is a card stack on a phone.
 *
 * Both layouts render from ONE array, so they cannot drift, and the mobile one
 * is a stack rather than a sideways scroller: an `overflow-x` box on a 390px
 * screen hides the columns off the right edge entirely, which is exactly what
 * broke /5-levels-ai. The swap is at `lg`, not `md`, because a four-column
 * table needs more than 768px before it stops wrapping into soup.
 */
export function CompareTable({
  caption,
  columns,
  rows,
}: {
  caption?: string;
  /** Column headers. The first is the row label column. */
  columns: string[];
  rows: { label: string; cells: ReactNode[] }[];
}) {
  return (
    <div className="mt-6">
      {/* Desktop: a real table, which is also what a crawler reads best. */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline">
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-3 py-3 font-body text-sm font-medium text-vivid-blue first:pl-0"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-hairline/60">
                <th
                  scope="row"
                  className="py-4 pr-3 align-top font-body text-base font-normal text-silver-muted"
                >
                  {r.label}
                </th>
                {r.cells.map((cell, i) => (
                  <td
                    key={i}
                    className="px-3 py-4 align-top font-body text-base text-silver"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: one card per column, so no field is off-screen. */}
      <div className="space-y-4 lg:hidden">
        {columns.slice(1).map((col, ci) => (
          <div key={col} className="surface-card px-5 py-4">
            <p className="font-display text-lg font-medium text-silver">{col}</p>
            <dl className="mt-3 divide-y divide-hairline">
              {rows.map((r) => (
                <div key={r.label} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                  <dt className="font-body text-sm text-silver-muted">{r.label}</dt>
                  <dd className="font-body text-base text-silver [overflow-wrap:anywhere]">
                    {r.cells[ci]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {caption ? (
        <p className="mt-3 font-body text-sm text-silver-muted">{caption}</p>
      ) : null}
    </div>
  );
}
