import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Ideas: Vote On What I Build Next",
  description:
    "Suggest a video about Claude Code, AI agents or AI for marketing, and vote on the ideas already on the board. The ideas with the most votes are the ones I make next.",
  keywords: [
    "video ideas",
    "Claude Code tutorials",
    "AI for marketing",
    "AI video requests",
    "Oleg Melnikov",
    "vote on video ideas",
  ],
  openGraph: {
    title: "Video Ideas: Vote On What I Build Next",
    description:
      "Suggest a video, or vote for one that is already on the board. The ideas with the most votes get made.",
    type: "website",
    url: "https://oleg.ae/ideas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Ideas: Vote On What I Build Next",
    description:
      "Suggest a video, or vote for one that is already on the board. The ideas with the most votes get made.",
  },
  alternates: {
    canonical: "https://oleg.ae/ideas",
  },
};

export default function IdeasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
