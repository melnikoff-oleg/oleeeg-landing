import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "A Month of Social Content in One Command",
  description:
    "Ten finished posts with your own photos and on-brand infographics, from one prompt. The full Claude Code setup, what it costs, and what it does badly.",
  keywords: [
    "Claude Code",
    "Claude AI",
    "AI content creation",
    "AI content creation tools 2026",
    "AI social media content",
    "Claude Code tutorial",
    "content creation system",
    "AI social media posts",
    "Claude Code for marketing",
    "AI social media content generator",
  ],
  openGraph: {
    title: "Content Creation System with Claude Code: Free Setup Guide",
    description:
      "Produce weeks of social media content with custom visuals (infographics, carousels, personal images) from one prompt using Claude Code.",
    type: "article",
    url: "https://oleg.ae/claude-content",
    publishedTime: "2026-05-12T00:00:00Z",
    modifiedTime: "2026-05-13T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Creation System with Claude Code",
    description:
      "Produce weeks of social media content with custom visuals from a single prompt using Claude Code.",
  },
  alternates: {
    canonical: "https://oleg.ae/claude-content",
  },
};

export default function ClaudeContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
