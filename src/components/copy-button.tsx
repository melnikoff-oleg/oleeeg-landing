"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared copy-to-clipboard button for prompts and commands. Extracted from the
 * /60k-linkedin-post inline pattern so every page that hands out a paste-able
 * prompt can offer one-tap copy (on a phone, selecting a long prompt by hand is
 * the single most fiddly interaction on the site).
 *
 * 44px min tap target, never wraps (whitespace-nowrap + shrink-0), brief
 * "copied" confirmation state.
 */
export function CopyButton({
  text,
  label = "copy prompt",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={cn(
        "inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white",
        className
      )}
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          copied
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-4"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
