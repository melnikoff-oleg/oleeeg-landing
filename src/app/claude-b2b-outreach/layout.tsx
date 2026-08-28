import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "B2B Outreach With Claude Code: 35% Replies",
  description:
    "Find leads in Sales Navigator, score them against your own criteria, and send a free asset built for each one. The full system, and the LinkedIn caveat.",
  keywords: [
    "Claude Code",
    "Claude AI",
    "AI B2B outreach",
    "AI lead generation",
    "LinkedIn outreach AI",
    "Claude Code tutorial",
    "AI sales outreach",
    "Personalized outreach automation",
    "Claude Code for marketing",
    "B2B lead gen AI",
  ],
  openGraph: {
    title: "AI B2B Outreach with Claude Code (35% Reply Rate): Free Setup Guide",
    description:
      "Build a deeply personalized B2B outreach system with Claude Code. Find leads, score them, and write value-driven messages that earn real replies.",
    type: "article",
    url: "https://www.oleg.ae/claude-b2b-outreach",
    publishedTime: "2026-05-12T00:00:00Z",
    modifiedTime: "2026-05-13T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI B2B Outreach with Claude Code (35% Reply Rate)",
    description:
      "Build a deeply personalized B2B outreach system. Find leads, score them, and write value-driven messages with custom visuals.",
  },
  alternates: {
    canonical: "https://www.oleg.ae/claude-b2b-outreach",
  },
};

export default function ClaudeB2bOutreachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
