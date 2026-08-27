import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Cowork Pricing: Is It Free?",
  description:
    "No. Pro is $20 a month and includes Claude Code too. Every tier compared, when Max is worth it, and the real monthly bill for running outreach through it.",
  keywords: [
    "Claude Cowork pricing",
    "is Claude Cowork free",
    "Claude Cowork cost",
    "Claude Cowork price",
    "how much is Claude Cowork",
    "how much does Claude Cowork cost",
    "Claude Cowork plans",
  ],
  openGraph: {
    title: "Claude Cowork Pricing: Is It Free, And What It Really Costs",
    description:
      "Not free. Pro is $20 a month and includes Claude Code too. Every plan compared, plus the real monthly bill.",
    type: "article",
    url: "https://oleg.ae/claude-cowork-pricing",
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Cowork Pricing: Is It Free, And What It Really Costs",
    description:
      "Not free. Pro is $20 a month and includes Claude Code too. Every plan compared.",
  },
  alternates: { canonical: "https://oleg.ae/claude-cowork-pricing" },
};

export default function ClaudeCoworkPricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
