import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make Video Ads With Claude Code",
  description:
    "Go from ad concept to finished cut inside one Claude Code workspace. Free setup guide, the prompts, and what the whole thing costs to run.",
  keywords: [
    "Claude Code",
    "Claude Code video ads",
    "AI video ads",
    "Make video ads with AI",
    "AI ad generator",
    "Free AI video ads",
    "HyperFrames",
    "Claude Code tutorial",
    "AI commercial generator",
    "Make money with Claude Code",
  ],
  openGraph: {
    title: "Make Video Ads With Claude Code: Free Setup Guide",
    description:
      "Paste a company's website, get a finished video ad in their own brand. Every step from installing VS Code to your first render.",
    type: "article",
    url: "https://www.oleg.ae/claude-code-ads",
    publishedTime: "2026-08-07T00:00:00Z",
    modifiedTime: "2026-08-07T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Make Video Ads With Claude Code: Free Setup Guide",
    description:
      "Paste a company's website, get a finished video ad in their own brand. Local, free per ad.",
  },
  alternates: {
    canonical: "https://www.oleg.ae/claude-code-ads",
  },
};

export default function ClaudeCodeAdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
