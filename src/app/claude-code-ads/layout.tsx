import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make Video Ads With Claude Code: Free Setup Guide (2026)",
  description:
    "Ads Studio turns Claude Code into a video ad maker that runs on your own laptop. Paste a company's website, say what kind of ad you want, get a finished MP4 with their real colours, fonts and logo. Seven steps from zero, no editing skills, nothing to pay per ad.",
  keywords: [
    "Claude Code",
    "Claude Code video ads",
    "AI video ads",
    "make video ads with AI",
    "AI ad generator",
    "free AI video ads",
    "HyperFrames",
    "Claude Code tutorial",
    "AI commercial generator",
    "make money with Claude Code",
  ],
  openGraph: {
    title: "Make Video Ads With Claude Code: Free Setup Guide",
    description:
      "Paste a company's website, get a finished video ad in their own brand. Every step from installing VS Code to your first render.",
    type: "article",
    url: "https://oleg.ae/claude-code-ads",
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
    canonical: "https://oleg.ae/claude-code-ads",
  },
};

export default function ClaudeCodeAdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
