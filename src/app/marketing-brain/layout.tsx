import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The $1B Marketing Brain: Ask the Greats",
  description:
    "An AI chat grounded in 8 marketing books and 75 talks from Hormozi, Brunson, Cialdini and Godin. Every answer cited to the page or the timecode.",
  keywords: [
    "Marketing AI chat",
    "Ask marketing experts AI",
    "AI marketing assistant",
    "Alex Hormozi AI",
    "Marketing knowledge base",
    "AI systems for marketing",
    "Claude Code for marketing",
  ],
  openGraph: {
    title: "$1B Marketing Brain: Ask the Greatest Marketing Minds (AI Chat)",
    description:
      "An AI chat grounded in the best marketing books and talks, with every answer cited to the exact page or video timecode.",
    type: "website",
    url: "https://www.oleg.ae/marketing-brain",
  },
  twitter: {
    card: "summary_large_image",
    title: "$1B Marketing Brain: Ask the Greatest Marketing Minds (AI Chat)",
    description:
      "An AI chat grounded in the best marketing books and talks, every answer cited to the exact page or timecode.",
  },
  alternates: {
    canonical: "https://www.oleg.ae/marketing-brain",
  },
};

export default function MarketingBrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
