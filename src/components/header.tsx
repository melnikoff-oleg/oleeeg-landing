"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Results", href: "#results" },
  { name: "Watch", href: "#watch" },
  { name: "Connect", href: "#connect" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    // Passive listener (never blocks scroll compositing) that only triggers a
    // re-render when the boolean actually flips, not on every scroll event.
    const onScroll = () => setScrolled((prev) => {
      const next = window.scrollY > 50;
      return next === prev ? prev : next;
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed z-50 w-full px-2">
      <div
        className={cn(
          "mx-auto mt-2 max-w-6xl rounded-2xl border px-6 transition-all duration-300 lg:px-12",
          scrolled
            ? "max-w-4xl border-hairline bg-navy/70 backdrop-blur-md lg:px-5"
            : "border-transparent"
        )}
      >
        <div className="relative flex items-center justify-between py-3 lg:py-4">
          <Link
            href="/"
            className="brand-wordmark font-display text-lg tracking-tight"
          >
            Oleg Melnikov
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:block">
            <ul className="flex gap-8 font-body text-sm">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-silver-muted transition-colors hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-50 -mr-2.5 flex size-11 items-center justify-center lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-0.5 w-5 bg-silver transition-all duration-200",
                  menuOpen && "translate-y-2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-silver transition-all duration-200",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-silver transition-all duration-200",
                  menuOpen && "-translate-y-2 -rotate-45"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-navy/95 backdrop-blur-md lg:hidden">
          <div className="flex h-full flex-col items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl text-silver transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
