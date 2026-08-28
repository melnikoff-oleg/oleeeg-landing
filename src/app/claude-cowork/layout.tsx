import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Cowork: What It Is and How To Use It",
  description:
    "What Claude Cowork actually does, how it differs from Claude Code, the new built-in browser, and the eight jobs I hand it every week. Plus what it is bad at.",
  keywords: [
    "Claude Cowork",
    "What is Claude Cowork",
    "How to use Claude Cowork",
    "Claude Cowork use cases",
    "Claude Cowork for Windows",
    "Claude Cowork vs Claude Code",
    "Claude Cowork download",
    "Anthropic Cowork",
  ],
  openGraph: {
    title: "Claude Cowork: What It Is, What It Costs, How To Use It",
    description:
      "What Claude Cowork actually does, how it differs from Claude Code, real pricing, the built-in browser, and eight jobs it does well.",
    type: "article",
    url: "https://oleg.ae/claude-cowork",
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Cowork: What It Is, What It Costs, How To Use It",
    description:
      "A practitioner's guide: what it does, how it differs from Claude Code, real pricing, and what it is bad at.",
  },
  alternates: { canonical: "https://oleg.ae/claude-cowork" },
};

export default function ClaudeCoworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
