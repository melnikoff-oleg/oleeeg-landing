import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Rebuild Setup Guide",
  description:
    "Rebuild a local business website with Claude Code and Fable 5.1 in one prompt, then sell it. The exact setup, the prompt, the three API keys and the cost.",
  keywords: ["fable 5.1", "claude fable", "claude code", "make money with claude code", "sell websites to local businesses", "ai website builder"],
  openGraph: {
    title: "Website Rebuild Setup Guide",
    description:
      "Rebuild a local business website with Claude Code and Fable 5.1 in one prompt, then sell it.",
    type: "article",
    url: "https://www.oleg.ae/fable-money",
    publishedTime: "2026-09-03T00:00:00Z",
    modifiedTime: "2026-09-03T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Rebuild Setup Guide",
    description: "Rebuild a local business website with Claude Code and Fable 5.1 in one prompt, then sell it.",
  },
  alternates: { canonical: "https://www.oleg.ae/fable-money" },
};

export default function FableMoneyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
