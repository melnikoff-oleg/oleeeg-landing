import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Ads Creator: Study Competitors' Meta Ads",
  description:
    "A free open-source tool that reads the Meta ads your competitors are really running and generates new concepts: copy, visuals and video scripts.",
  keywords: [
    "AI ad creator",
    "AI ad generator",
    "Meta ads AI",
    "AI advertising tool",
    "Claude Code",
    "AI marketing tool",
    "competitor ad analysis",
    "AI ad copy",
    "open source AI tool",
    "Claude Code for marketing",
  ],
  openGraph: {
    title: "AI Ads Creator: Free Open Source Tool",
    description:
      "Study the Meta ads your competitors are actually running, understand why they convert, and generate new ad concepts: copy, visuals, and video scripts.",
    type: "article",
    url: "https://oleg.ae/ads-ai",
    publishedTime: "2026-05-31T00:00:00Z",
    modifiedTime: "2026-05-31T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Ads Creator: Free Open Source Tool",
    description:
      "Study the Meta ads your competitors are actually running, understand why they convert, and generate new ad concepts: copy, visuals, and video scripts.",
  },
  alternates: {
    canonical: "https://oleg.ae/ads-ai",
  },
};

export default function AdsAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
