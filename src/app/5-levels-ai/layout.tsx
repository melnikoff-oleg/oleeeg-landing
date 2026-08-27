import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 5 Levels of AI Adoption",
  description:
    "Anthropic's own research on how the top 1% actually use AI, as five levels. Where most people stop, and what changes at each rung.",
  keywords: [
    "AI adoption levels",
    "Claude Code",
    "AI agents",
    "agentic AI",
    "Claude Agent SDK",
    "AI for founders",
    "AI orchestration",
    "levels of AI",
    "AI automation",
    "Boldane",
  ],
  openGraph: {
    title: "The Builder's Ladder: the 5 Levels of AI Adoption",
    description:
      "From copy-pasting out of a chat window to a thousand agents that launch themselves. Find your level and the exact move to the next one.",
    type: "article",
    url: "https://oleg.ae/5-levels-ai",
    publishedTime: "2026-07-21T00:00:00Z",
    modifiedTime: "2026-07-21T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Builder's Ladder: the 5 Levels of AI Adoption",
    description:
      "From copy-pasting out of a chat window to a thousand agents that launch themselves. Find your level and the exact move to the next one.",
  },
  alternates: {
    canonical: "https://oleg.ae/5-levels-ai",
  },
};

export default function FiveLevelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
