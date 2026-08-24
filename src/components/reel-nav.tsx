import Link from "next/link";

/**
 * The four doors into the reel library, on every one of the four pages.
 *
 * There used to be a single ad-hoc link between search and browse, which was
 * fine for two pages and stops working at three. This is deliberately the only
 * chrome any of them carries: no wordmark, no hero, no footer, because the
 * whole point of these pages is that nothing sits between a visitor and a reel.
 *
 * The order is the order of the questions: what reel is like this, who is in
 * here at all, who makes this kind of thing, and what should I film. Creators
 * sits after library because it answers a question about the same corpus from
 * the other end, and its own detail pages hang under it.
 */
const PAGES = [
  { href: "/viral-reels", label: "search" },
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
