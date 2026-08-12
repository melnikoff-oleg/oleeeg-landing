"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export function Accordion({ items, defaultOpen }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(
    defaultOpen ?? null
  );

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="surface-card overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-vivid-blue/[0.06]"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-vivid-blue/15 font-body text-sm font-medium text-vivid-blue">
                {index + 1}
              </span>
              <span className="flex-1 font-display text-lg font-medium text-silver">{item.title}</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
                className={cn(
                  "size-5 shrink-0 text-silver-muted transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* CSS-only expand/collapse (grid 0fr -> 1fr) — no animation-runtime JS.
                `hidden` when collapsed so the clipped content is truly hidden
                from AT, keyboard, and find-in-page, not just visually. */}
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div
                  hidden={!isOpen}
                  className="px-6 pb-6 pt-0 font-body text-silver leading-relaxed [overflow-wrap:anywhere]"
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
