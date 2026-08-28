import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Cowork for LinkedIn Cold Outreach",
  description:
    "Cowork reads a prospect's last ten posts and writes a message about what they said. The whole system: the Apify setup, the prompt, and what it costs.",
  keywords: [
    "Claude Cowork",
    "Claude AI",
    "AI LinkedIn automation",
    "Cold outreach AI",
    "B2B sales AI",
    "Claude Code tutorial",
    "AI sales automation",
    "LinkedIn lead generation AI",
    "AI outreach tool",
    "Claude Code for marketing",
  ],
  openGraph: {
    title: "Claude Cowork for Cold Outreach: AI LinkedIn Automation Guide",
    description:
      "Run LinkedIn cold outreach with Claude Cowork. Research prospects, write personalized messages, and send connections, all for you.",
    type: "article",
    url: "https://oleg.ae/claude-cowork-outreach",
    publishedTime: "2026-05-12T00:00:00Z",
    modifiedTime: "2026-05-13T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Cowork for Cold Outreach: AI LinkedIn Automation",
    description:
      "Run LinkedIn cold outreach with Claude Cowork. Research prospects, write personalized messages, and send connections, all for you.",
  },
  alternates: {
    canonical: "https://oleg.ae/claude-cowork-outreach",
  },
};

export default function ClaudeCoworkOutreachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
