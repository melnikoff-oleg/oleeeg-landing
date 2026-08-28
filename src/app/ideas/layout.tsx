import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggest the Next Video",
  description:
    "A public board for the next YouTube video. Suggest an idea, vote on the ones already there, and watch them move from suggested to filmed to published.",
  keywords: [
    "video ideas",
    "Claude Code tutorials",
    "AI for marketing",
    "AI video requests",
    "Oleg Melnikov",
    "Vote on video ideas",
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
