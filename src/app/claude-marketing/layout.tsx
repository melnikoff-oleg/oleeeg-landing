import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Claude Code for Marketing: SMM, Ads, Outreach",
  description:
    "One workspace that knows your business, running competitor ad analysis, content and outreach. Five real use cases, the two APIs, and what they cost.",
  keywords: [
    "Claude Code for marketing",
    "Claude Code",
    "Claude AI",
    "AI marketing automation",
    "AI for marketers",
    "Claude AI marketing",
    "Claude Code tutorial",
    "AI social media marketing",
    "AI content creation",
    "AI marketing tools 2026",
  ],
  openGraph: {
    title: "Claude Code for Marketing: AI Marketing Automation Guide",
    description:
      "Five real marketing use cases with Claude Code: Instagram Reels, competitor analysis, ad campaigns, cold outreach, and content automation.",
    type: "article",
    url: "https://www.oleg.ae/claude-marketing",
    publishedTime: "2026-05-12T00:00:00Z",
    modifiedTime: "2026-05-13T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code for Marketing: AI Marketing Automation Guide",
    description:
      "Five real marketing use cases with Claude Code: Reels, competitor analysis, ads, outreach, and content automation.",
  },
  alternates: {
    canonical: "https://www.oleg.ae/claude-marketing",
  },
};

export default function ClaudeMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
