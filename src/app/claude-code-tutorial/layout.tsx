import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code Tutorial for Non-Developers",
  description:
    "What Claude Code is, how to install it on any machine, and the four ideas that make it click. Written by someone who uses it for marketing, not engineering.",
  keywords: [
    "Claude Code tutorial",
    "what is Claude Code",
    "how to use Claude Code",
    "Claude Code guide",
    "Claude Code for beginners",
    "learn Claude Code",
    "Claude Code for non developers",
    "install Claude Code",
  ],
  openGraph: {
    title: "Claude Code Tutorial: A Guide For People Who Are Not Developers",
    description:
      "What it is, how to install it, your first twenty minutes, and the four ideas that make it click. No codebase required.",
    type: "article",
    url: "https://oleg.ae/claude-code-tutorial",
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Tutorial: A Guide For People Who Are Not Developers",
    description:
      "What it is, how to install it, and the four ideas that make it click. No codebase required.",
  },
  alternates: { canonical: "https://oleg.ae/claude-code-tutorial" },
};

export default function ClaudeCodeTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
