import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code vs Cursor, Codex and the Rest",
  description:
    "Editor or agent is the real question, not which one wins. Prices, shapes, how Codex and Gemini CLI differ, and what Claude Code is genuinely worse at.",
  keywords: [
    "Claude Code vs Cursor",
    "Cursor vs Claude Code",
    "Claude Code vs Codex",
    "Codex vs Claude Code",
    "Gemini CLI vs Claude Code",
    "OpenCode vs Claude Code",
    "Claude vs Claude Code",
    "Claude Code alternative",
  ],
  openGraph: {
    title: "Claude Code vs Cursor, Codex and the Rest: An Honest Comparison",
    description:
      "Editor or agent is the real question. Prices, shapes, and what Claude Code is genuinely worse at.",
    type: "article",
    url: "https://oleg.ae/claude-code-vs-cursor",
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code vs Cursor, Codex and the Rest",
    description:
      "Editor or agent is the real question. Prices, shapes, and what Claude Code is genuinely worse at.",
  },
  alternates: { canonical: "https://oleg.ae/claude-code-vs-cursor" },
};

export default function ClaudeCodeVsCursorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
