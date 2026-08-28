// The visible half of the FAQ. Its entries come from the same array the page
// passes to FaqJsonLd, so the markup can never claim a question the page does
// not answer (guide.spec.ts test 76 checks exactly that).
//
// Rendered as plain visible copy rather than <details>: these are the queries
// people type verbatim, and an answer folded behind a toggle is one a reader
// has to go looking for.

import type { FaqEntry } from "@/lib/seo/schema";

export function GuideFaq({ entries }: { entries: FaqEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <section className="pb-16 md:pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2
          id="faq"
          className="scroll-mt-24 font-display text-2xl font-medium tracking-tight text-silver md:text-3xl"
        >
          Questions people ask
        </h2>
        <dl className="mt-8 space-y-8">
          {entries.map((e) => (
            <div key={e.q}>
              <dt className="font-display text-lg font-medium text-silver md:text-xl">
                {e.q}
              </dt>
              <dd className="mt-2 font-body text-base leading-relaxed text-silver">
                {e.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
