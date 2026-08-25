import Link from "next/link";

/**
 * The three doors into the reel library, on every one of its pages.
 *
 * There were four until 2026-08-25. "search" was a search box over an empty
 * screen and "library" was the same corpus listed under two filters, which is
 * two pages asking two halves of one question; the search moved into the library
 * and /viral-reels is now a redirect. This is deliberately the only chrome any
 * of them carries: no wordmark, no hero, no footer, because the whole point of
 * these pages is that nothing sits between a visitor and a reel.
 *
 * The order is the order of the questions: what reels are in here, who makes
 * this kind of thing, and what should I film. Creators sits after library
 * because it answers a question about the same corpus from the other end, and
 * its own detail pages hang under it.
 */
const PAGES = [
  { href: "/viral-reels-browse", label: "library" },
  { href: "/viral-reels-creators", label: "creators" },
  { href: "/viral-reels-ideas", label: "ideas" },
] as const;

export type ReelPage = (typeof PAGES)[number]["href"];

export function ReelNav({ current }: { current: ReelPage }) {
  return (
    <nav aria-label="viral reels" className="mb-5 flex items-center gap-1">
      {PAGES.map((p) => {
        const active = p.href === current;
        return (
          <Link
            key={p.href}
            href={p.href}
            // The current page keeps its link so the row reads the same either
            // way; aria-current is what tells a screen reader which one it is.
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-4 font-body text-xs transition-colors ${
              active
                ? "bg-vivid-blue/15 text-white"
                : "text-silver-muted hover:bg-silver/5 hover:text-white"
            }`}
          >
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
