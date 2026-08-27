import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code Pricing: Is It Free?",
  description:
    "No. It is included in every paid Claude plan from $20 a month, or billed per token on the API. Every plan compared, plus what developers really spend.",
  keywords: [
    "Claude Code pricing",
    "Claude Code price",
    "Claude Code cost",
    "is Claude Code free",
    "how much does Claude Code cost",
    "Claude Code subscription",
    "Claude Code Max",
    "Claude Code Pro plan",
  ],
  openGraph: {
    title: "Claude Code Pricing: Is It Free, And What It Really Costs",
    description:
      "Not free. Included in every paid plan from $20 a month, or per token on the API. Every plan compared, plus what developers really spend.",
    type: "article",
    url: "https://oleg.ae/claude-code-pricing",
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Pricing: Is It Free, And What It Really Costs",
    description:
      "Not free. Included in every paid plan from $20 a month, or per token on the API. Every plan compared.",
  },
  alternates: { canonical: "https://oleg.ae/claude-code-pricing" },
};

export default function ClaudeCodePricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
