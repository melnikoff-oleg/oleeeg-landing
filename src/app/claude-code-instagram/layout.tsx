import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code as an Instagram Video Editor",
  description:
    "Drop in unsorted footage, describe the video, get an edited reel back. About 50 cents each. The full Reel Studio setup and the style-first workflow.",
  keywords: [
    "Claude Code",
    "Claude Code video editor",
    "Claude Code Instagram",
    "AI video editor",
    "AI Instagram Reels",
    "Make reels with AI",
    "HyperFrames",
    "Free AI video editing",
    "Claude Code tutorial",
    "AI reels editor",
  ],
  openGraph: {
    title: "Claude Code Instagram Video Editor: Free Setup Guide",
    description:
      "Turn Claude Code into a local video editor. Photos and a voice take in, a finished Instagram Reel out. Every step from installing VS Code to your first render.",
    type: "article",
    url: "https://www.oleg.ae/claude-code-instagram",
    publishedTime: "2026-08-01T00:00:00Z",
    modifiedTime: "2026-08-01T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Instagram Video Editor: Free Setup Guide",
    description:
      "Turn Claude Code into a local video editor. Photos and a voice take in, a finished Instagram Reel out.",
  },
  alternates: {
    canonical: "https://www.oleg.ae/claude-code-instagram",
  },
};

export default function ClaudeCodeInstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
