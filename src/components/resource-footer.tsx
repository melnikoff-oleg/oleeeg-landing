import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { RESOURCES } from "@/components/resources-data";
import { NextUp } from "@/components/next-up";

export function ResourceFooter({
  currentSlug,
  boldaneCredit = false,
}: {
  currentSlug: string;
  /** Show the "founder of Boldane" credit line. Opt in ONLY on pages with no
   *  other Boldane mention — one Boldane moment per page, never two. */
  boldaneCredit?: boolean;
}) {
  const filtered = RESOURCES.filter((r) => r.slug !== currentSlug);

  return (
    <footer className="mx-auto max-w-3xl px-6 pb-12">
      <div className="mt-16">
        {/* Ranked "up next" surface: one hero pick + a short list, not a wall. */}
        <NextUp currentSlug={currentSlug} />

        {/* The full library, collapsed by default so it is no longer a dead-end
            grid of equal links, but every internal link stays in the HTML for
            crawlers and for visitors who want to browse everything. */}
        <details className="group mt-6">
          <summary
            data-testid="see-all-resources"
            className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-full text-sm font-medium text-silver-muted transition-colors hover:text-white [&::-webkit-details-marker]:hidden"
          >
            see all free resources
            <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" />
          </summary>

          <div
            data-testid="all-resources-grid"
            className="mx-auto mt-6 grid max-w-4xl gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((resource) => (
              <Link
                key={resource.slug}
                href={`/${resource.slug}`}
                className="group/item flex items-start gap-3 rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-vivid-blue/10"
              >
                <resource.icon className="mt-0.5 size-4 shrink-0 text-vivid-blue transition-colors group-hover/item:text-white" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-silver transition-colors group-hover/item:text-white">
                    {resource.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-silver-muted">
                    {resource.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-3 shrink-0 text-silver-muted/60 transition-all duration-150 group-hover/item:translate-x-0.5 group-hover/item:text-white" />
              </Link>
            ))}
          </div>
        </details>
      </div>

      {/* The one internal entry point to the ideas board. Deliberately a single
          line rather than a card: it sits after the library, so it reads as a
          way to keep going, not as another thing to grab. */}
      {currentSlug !== "ideas" && (
        <p className="mt-8 text-center text-sm text-silver-muted">
          got an idea for a video?{" "}
          <Link
            href="/ideas"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            vote on what i build next
          </Link>
        </p>
      )}

      {boldaneCredit && (
        <p
          className={`${currentSlug !== "ideas" ? "mt-3" : "mt-8"} text-center text-sm text-silver-muted`}
        >
          free guides by oleg, founder of{" "}
          <a
            href="https://www.boldane.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            Boldane
          </a>
        </p>
      )}

      <p className="mt-3 text-center text-sm text-silver-muted">
        &copy; 2026 oleg melnikov
      </p>
    </footer>
  );
}
