import type { Metadata } from "next";

const TITLE = "How Elon Musk Uses AI Daily: His 7 Rules";
const DESCRIPTION =
  "The seven rules Elon Musk actually follows when he uses AI, each one with the clip where he says it. The three questions he asks every new model, why he photographs problems instead of describing them, why he never asks a model to be right, and why he says the smartest model is not his.";
const SHORT =
  "The three questions he asks every new model, why he photographs the problem instead of describing it, and why he says the smartest model on earth is not his.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "how Elon Musk uses AI",
    "Elon Musk AI",
    "Elon Musk Grok",
    "Elon Musk AI rules",
    "how to use AI daily",
    "AI prompting",
    "which AI model is best",
    "Anthropic Fable",
    "Claude Code",
    "AI systems for marketing",
  ],
  openGraph: {
    title: TITLE,
    description: SHORT,
    type: "article",
    url: "https://oleg.ae/elon-ai",
    publishedTime: "2026-08-01T00:00:00Z",
    modifiedTime: "2026-08-01T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT,
  },
  alternates: {
    canonical: "https://oleg.ae/elon-ai",
  },
};

export default function ElonAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
