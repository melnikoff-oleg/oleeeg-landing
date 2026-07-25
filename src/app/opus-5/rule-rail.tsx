"use client";

// Sticky jump-nav for the five rules, with a scroll-spy highlight. Horizontal
// chip rail that scrolls inside its own box on a phone, so the page itself
// never scrolls sideways.

import { useEffect, useState } from "react";

export type RailItem = { id: string; num: string; label: string };

export function RuleRail({ items }: { items: readonly RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // Recompute from every section's live position rather than from the
    // callback's entries, so a jump (anchor click, scroll-to-top) that skips
    // past sections still lands on the right chip, and scrolling above the
    // first rule clears the highlight instead of stranding it on the last one.
    const pick = () => {
      const mid = window.innerHeight / 2;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= mid) current = section.id;
      }
      setActive(current);
    };

    const io = new IntersectionObserver(pick, {
      // A narrow band across the middle of the viewport: the observer only has
      // to wake us when a section crosses it.
      rootMargin: "-45% 0px -50% 0px",
    });
    for (const section of sections) io.observe(section);

    // The band is a percentage of viewport height, so a resize (notably a
    // phone address bar collapsing) moves it without any section crossing it.
    window.addEventListener("resize", pick);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", pick);
    };
  }, [items]);

  return (
    <nav
      aria-label="Jump to a rule"
      className="sticky top-0 z-50 border-b border-hairline bg-navy/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-6 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const on = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-testid="rule-rail-chip"
              aria-current={on ? "true" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 font-body text-[13px] transition-colors ${
                on
                  ? "border-vivid-blue bg-vivid-blue text-white"
                  : "border-transparent text-silver-muted hover:border-hairline hover:text-white"
              }`}
            >
              <span className="tabular-nums opacity-70">{item.num}</span>
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
