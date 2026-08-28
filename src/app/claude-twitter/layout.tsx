import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "An X Content Machine Built With Claude Code",
  description:
    "Analyse what made competitors' posts work, then reuse the structure on your own subject. Free setup guide, the two configs, and where it goes wrong.",
  keywords: [
    "Claude Code",
    "Claude AI",
    "AI Twitter content",
    "AI X content",
    "Claude Code tutorial",
    "AI social media marketing",
    "Twitter content strategy",
    "AI social media posts",
    "Claude Code for marketing",
    "AI content creation",
  ],
  openGraph: {
    title: "X/Twitter Content System with Claude Code: Free Setup Guide",
    description:
      "Build an X/Twitter content system with Claude Code. Study your competitors' best tweets and generate posts in your own voice.",
    type: "article",
    url: "https://www.oleg.ae/claude-twitter",
    publishedTime: "2026-05-12T00:00:00Z",
    modifiedTime: "2026-05-13T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "X/Twitter Content System with Claude Code",
    description:
      "Study your competitors' best tweets and generate ready-to-publish posts in your own voice with Claude Code.",
  },
  alternates: {
    canonical: "https://www.oleg.ae/claude-twitter",
  },
};

export default function ClaudeTwitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
