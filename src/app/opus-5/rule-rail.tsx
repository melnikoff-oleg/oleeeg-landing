"use client";

// Sticky jump-nav for the five rules, with a scroll-spy highlight. Horizontal
// chip rail that scrolls inside its own box on a phone, so the page itself
// never scrolls sideways.

import { useEffect, useRef, useState } from "react";

export type RailItem = { id: string; num: string; label: string };

export function RuleRail({ items }: { items: readonly RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  // True while more chips hide past the rail's right edge, driving the fade cue.
  const [clippedRight, setClippedRight] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef(new Map<string, HTMLAnchorElement>());

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

  // Keep the active chip visible: the rail scrolls itself inside its own box
  // (scrollTo on the container, never scrollIntoView, which can also shift the
  // page vertically) so on a phone the highlight can't sit half off-screen.
  useEffect(() => {
    if (!active) return;
    const rail = railRef.current;
    const chip = chipRefs.current.get(active);
    if (!rail || !chip || rail.scrollWidth <= rail.clientWidth) return;
    // Measured via rects, not offsetLeft, so the math holds regardless of
    // which ancestor is the chips' offsetParent.
    const railBox = rail.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    const left =
      rail.scrollLeft +
      (chipBox.left - railBox.left) -
      (rail.clientWidth - chipBox.width) / 2;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    rail.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  // Fade at the right edge whenever chips are clipped there, so the rail
  // reads as scrollable even with its scrollbar hidden.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      setClippedRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav
      aria-label="Jump to a rule"
      className="sticky top-0 z-50 border-b border-hairline bg-navy/85 backdrop-blur-md"
    >
      <div
        ref={railRef}
        className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-6 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const on = active === item.id;
          return (
            <a
              key={item.id}
              ref={(el) => {
                if (el) chipRefs.current.set(item.id, el);
                else chipRefs.current.delete(item.id);
              }}
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
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-navy to-transparent transition-opacity duration-200 ${
          clippedRight ? "opacity-100" : "opacity-0"
        }`}
      />
    </nav>
  );
}
