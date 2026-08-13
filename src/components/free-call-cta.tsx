// The site-wide invitation to a free 30 minute call with Oleg.
//
// Mounted on every public route in the same shape: through ResourcePageShell on
// the 16 claude-* pages, by hand on the homepage, the six bespoke tool/lead
// magnet pages and the chat, and as an inline-styled twin inside
// FilmedPageOutro on the six filmed pages (those can carry neither Tailwind nor
// client JS). Copy lives in src/lib/free-call.ts so the two implementations
// cannot drift, and so closing the window is a one-file edit.
//
// Placement rule: it goes AFTER the hero, never inside it. Resource pages are
// near-100% YouTube entry pages, so the fold's job is still to hand over the
// asset the visitor clicked through for (see RepoCta); this card is the very
// next thing they meet. That also keeps the hero CTA the first external link in
// <main>, which tests/e2e/hero-cta.spec.ts asserts.
//
// Design: the one card on the page that is lit rather than flat. A blue wash
// from the top edge, a hairline of accent along it, a solid vivid-blue button
// as the only saturated element, and everything centered so it reads the same
// on a 390px phone and a wide desktop. The badge stays outline-and-tint (not
// solid blue) so the button keeps the single point of visual gravity.

import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { FREE_CALL } from "@/lib/free-call";

export function FreeCallCta({ className }: { className?: string }) {
  return (
    <Reveal
      as="section"
      aria-labelledby="free-call-title"
      className={className ?? "pb-16 md:pb-24"}
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="relative isolate overflow-hidden rounded-2xl border border-vivid-blue/25 bg-navy-raised p-6 text-center shadow-[0_24px_80px_-32px_rgba(40,99,240,0.55)] sm:p-10">
          {/* Lit-from-above wash. Spans the whole card and fades out inside it,
              so there is no hard gradient edge landing across the headline.
              Sits behind the content and never catches taps. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_58%_at_50%_0%,rgba(40,99,240,0.34),transparent_70%)]"
          />
          {/* A single hairline of accent along the top edge. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(40,99,240,0.85),transparent)]"
          />

          <div className="relative">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-hairline bg-vivid-blue/10 px-3.5 py-1.5 font-body text-[11px] text-silver sm:text-xs">
              <span aria-hidden className="size-1.5 rounded-full bg-vivid-blue" />
              {FREE_CALL.badge}
            </span>

            <h2
              id="free-call-title"
              // Solid white, NOT .text-metallic: the metallic gradient's dark
              // stops land on the end of a short line, which dimmed the one word
              // that has to land ("free").
              className="mt-5 font-display text-2xl font-medium leading-[1.1] tracking-tight text-white sm:text-3xl md:text-4xl"
            >
              {FREE_CALL.title}
            </h2>

            <p className="mx-auto mt-4 max-w-lg font-body text-base leading-relaxed text-silver sm:text-lg">
              {FREE_CALL.body}
            </p>

            <div className="mt-7">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="w-full sm:w-auto"
              >
                <a
                  href={FREE_CALL.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="free-call-link"
                >
                  {FREE_CALL.action}
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </Button>
            </div>

            <p className="mt-5 font-body text-sm font-medium text-silver">
              {FREE_CALL.limit}
            </p>
            <p className="mt-1.5 font-body text-sm text-silver-muted">
              {FREE_CALL.note}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
