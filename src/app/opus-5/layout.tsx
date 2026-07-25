import type { Metadata } from "next";

const TITLE = "Opus 5, No Hype: 5 Rules Nobody Is Talking About";
const DESCRIPTION =
  "Five practical rules for Claude Opus 5, every one taken from Anthropic's own charts and docs. Why max effort makes answers worse, what to delete from your prompt, why to skip Fable 5, which model to run per task, and what the security numbers actually say.";
const SHORT =
  "Max effort makes answers worse. Verification prompts cost you double. Fable 5 loses to a model half its price. Five rules, all from Anthropic's own numbers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Claude Opus 5",
    "Opus 5 effort levels",
    "Claude Opus 5 prompting",
    "Claude Code",
    "Fable 5",
    "Claude model pricing",
    "Anthropic benchmarks",
    "which Claude model to use",
    "AI systems for marketing",
    "Boldane",
  ],
  openGraph: {
    title: TITLE,
    description: SHORT,
    type: "article",
    url: "https://oleg.ae/opus-5",
    publishedTime: "2026-07-25T00:00:00Z",
    modifiedTime: "2026-07-25T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT,
  },
  alternates: {
    canonical: "https://oleg.ae/opus-5",
  },
};

export default function Opus5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
