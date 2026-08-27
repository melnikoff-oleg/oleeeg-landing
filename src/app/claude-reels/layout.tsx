import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viral Instagram Reels With Claude Code",
  description:
    "Scrape the reels winning in your niche, analyse hook and retention, and generate ready-to-film scripts. Free setup guide plus what the system gets wrong.",
  keywords: [
    "Claude Code",
    "Claude AI",
    "AI Instagram Reels",
    "AI Reels creator",
    "Instagram Reels strategy",
    "Claude Code tutorial",
    "AI Instagram marketing",
    "AI video marketing",
    "Reels script generator",
    "Claude Code for marketing",
  ],
  openGraph: {
    title: "AI Instagram Reels with Claude Code: Free Setup Guide",
    description:
      "Study the Reels winning in your niche and generate ready-to-film scripts with sharp hooks, retention analysis, and clear visual direction.",
    type: "article",
    url: "https://oleg.ae/claude-reels",
    publishedTime: "2026-05-12T00:00:00Z",
    modifiedTime: "2026-05-13T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Instagram Reels with Claude Code: Free Setup Guide",
    description:
      "Study the Reels winning in your niche and generate ready-to-film scripts with Claude Code.",
  },
  alternates: {
    canonical: "https://oleg.ae/claude-reels",
  },
};

export default function ClaudeReelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
