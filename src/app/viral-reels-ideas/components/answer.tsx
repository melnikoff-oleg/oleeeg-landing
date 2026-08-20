"use client";

import { Children, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { REEL_CITATION } from "@/lib/reels/ideas-types";
import type { ReelRow } from "@/lib/reels/types";
import { ReelCite, ReelCiteMissing } from "./reel-cite";

/**
 * Swap every `[[reel:SHORTCODE]]` in a text node for its card.
 *
 * Runs on the rendered children of each markdown block rather than on the raw
 * text, so a citation is never mistaken for one inside a code span, and the
 * markdown parser never sees the brackets as a link reference.
 *
 * A fresh regex per call: REEL_CITATION carries the global flag, and sharing one
 * across concurrent renders means sharing its lastIndex.
 */
function withCitations(children: ReactNode, reels: Record<string, ReelRow>) {
  return Children.map(children, (child) => {
    if (typeof child !== "string") return child;
    const re = new RegExp(REEL_CITATION.source, "g");
    // split() with one capture group interleaves the captures, so the odd
    // indices are exactly the shortcodes and the even ones are the prose.
    const parts = child.split(re);
    if (parts.length === 1) return child;
    return parts.map((part, i) => {
      if (i % 2 === 0) return part;
      const reel = reels[part];
      return reel ? (
        <ReelCite key={`${part}-${i}`} reel={reel} />
      ) : (
        <ReelCiteMissing key={`${part}-${i}`} shortcode={part} />
      );
    });
  });
}

export function Answer({
  text,
  reels,
  streaming,
  tone,
}: {
  text: string;
  reels: Record<string, ReelRow>;
  streaming?: boolean;
  tone?: "error";
}) {
  const cite = (children: ReactNode) => withCitations(children, reels);
  return (
    <div
      className={`font-body text-base leading-relaxed ${
        tone === "error" ? "text-amber-200/90" : "text-silver"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{cite(children)}</p>,
          li: ({ children }) => <li className="mb-1.5">{cite(children)}</li>,
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
          ),
          h1: ({ children }) => (
            <h2 className="mt-5 mb-2 font-display text-lg text-white">{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-2 font-display text-lg text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 font-display text-base text-white">{children}</h3>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-2 hover:decoration-white"
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
      {streaming && (
        <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-vivid-blue align-text-bottom" />
      )}
    </div>
  );
}
