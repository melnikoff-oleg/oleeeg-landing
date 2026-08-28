import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Social Media Growth With Claude Code",
  description:
    "A growth report built from 2,000 competitor videos, ICE-scored so you know what to do first. Free setup guide, plus the iteration that made it 5x better.",
  keywords: [
    "Claude Code",
    "Claude AI",
    "AI social media growth",
    "AI content strategy",
    "Competitor content analysis",
    "Claude Code tutorial",
    "YouTube growth AI",
    "AI social media marketing",
    "Claude Code for marketing",
    "AI for social media",
  ],
  openGraph: {
    title: "AI Social Media Growth with Claude Code: Free Setup Guide",
    description:
      "Analyze thousands of competitor videos, find the standout performers, and build a data-driven content strategy for YouTube, Instagram, and TikTok.",
    type: "article",
    url: "https://oleg.ae/claude-social-growth",
    publishedTime: "2026-05-12T00:00:00Z",
    modifiedTime: "2026-05-13T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Social Media Growth with Claude Code",
    description:
      "Analyze competitor videos, find the standout performers, and build a data-driven content growth strategy with Claude Code.",
  },
  alternates: {
    canonical: "https://oleg.ae/claude-social-growth",
  },
};

export default function ClaudeSocialGrowthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
