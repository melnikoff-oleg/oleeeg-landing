import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "An AI Second Brain With Claude Code and Obsidian",
  description:
    "Turn your Obsidian vault into notes that answer back, with Claude Code reading and writing them directly. Free step-by-step setup guide.",
  keywords: [
    "AI second brain",
    "Claude Code second brain",
    "second brain",
    "Claude Code Obsidian",
    "Obsidian second brain",
    "Claude Code tutorial",
    "Second brain setup",
    "How to build a second brain",
    "Personal knowledge management",
    "Claude Code for beginners",
  ],
  openGraph: {
    title: "AI Second Brain with Claude Code & Obsidian: Free Setup Guide",
    description:
      "Set up an AI second brain in about 10 minutes: VS Code, Obsidian, Claude Code, one shared folder, and the one prompt that builds the vault itself.",
    type: "article",
    url: "https://oleg.ae/claude-code-second-brain",
    publishedTime: "2026-08-07T00:00:00Z",
    modifiedTime: "2026-08-07T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Second Brain with Claude Code & Obsidian: Free Setup Guide",
    description:
      "Set up an AI second brain in about 10 minutes: VS Code, Obsidian, Claude Code, one shared folder, and one prompt that builds the vault itself.",
  },
  alternates: {
    canonical: "https://oleg.ae/claude-code-second-brain",
  },
};

export default function ClaudeCodeSecondBrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
