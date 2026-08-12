import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RESOURCE_BY_SLUG } from "@/components/resources-data";
import recs from "@/lib/recommendations.json";

const RECOMMENDATIONS = recs.recommendations as Record<string, string[]>;

/**
 * "Up next" recommendation surface, YouTube-style: one prominent hero pick on
 * top, then a short ranked list of secondary picks. It replaces the old wall of
 * ~18 equal links as the FIRST thing a visitor sees after they grab a resource,
 * so the best next step is obvious instead of buried.
 *
 * Picks are precomputed at build time (relevance + popularity + quality) into
 * src/lib/recommendations.json by scripts/build-recommendations.mjs. Zero LLM or
 * analytics calls happen at runtime. Regenerate that file when resources change.
 *
 * Returns null when the current slug has no recommendations, so the footer can
 * fall back to just the full "see all" list.
 */
export function NextUp({ currentSlug }: { currentSlug: string }) {
  const picks = (RECOMMENDATIONS[currentSlug] ?? [])
    .map((slug) => RESOURCE_BY_SLUG[slug])
    .filter(Boolean);

  if (picks.length === 0) return null;

  const [hero, ...secondary] = picks;

  return (
    <section aria-labelledby="next-up-title" data-testid="next-up">
      <p
        id="next-up-title"
        className="eyebrow text-center text-[13px] font-medium text-vivid-blue"
      >
        keep going
      </p>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-silver-muted">
        a couple more, picked for you
      </p>

      {/* Hero "up next": the single most obvious next step, largest and first. */}
      <Link
        href={`/${hero.slug}`}
        data-testid="next-up-hero"
        className="group surface-card glow-blue mt-6 flex items-center gap-4 rounded-2xl px-5 py-5 transition-colors duration-150 hover:border-vivid-blue/40 sm:gap-5 sm:px-7 sm:py-6"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-vivid-blue/10 text-vivid-blue transition-colors group-hover:bg-vivid-blue/20 sm:size-14">
          <hero.icon className="size-6 sm:size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold text-silver transition-colors group-hover:text-white sm:text-xl">
            {hero.title}
          </p>
          <p className="mt-1 line-clamp-3 text-base leading-relaxed text-silver-muted">
            {hero.description}
          </p>
        </div>
        <ArrowRight className="hidden size-5 shrink-0 self-center text-silver-muted transition-all duration-150 group-hover:translate-x-1 group-hover:text-white sm:block" />
      </Link>

      {/* Ranked secondary picks: a short, digestible list, never a wall. */}
      {secondary.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {secondary.map((r) => (
            <Link
              key={r.slug}
              href={`/${r.slug}`}
              data-testid="next-up-secondary"
              className="group surface-card flex items-start gap-3 rounded-xl px-4 py-4 transition-colors duration-150 hover:border-vivid-blue/40"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-vivid-blue/10 text-vivid-blue transition-colors group-hover:bg-vivid-blue/20">
                <r.icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-silver transition-colors group-hover:text-white">
                  {r.title}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-silver-muted">
                  {r.description}
                </p>
              </div>
              <ArrowRight className="mt-1 size-4 shrink-0 text-silver-muted/60 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
