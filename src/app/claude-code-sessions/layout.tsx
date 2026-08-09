import type { Metadata } from "next";
import { Nunito, Comic_Neue } from "next/font/google";

// Two faces the rest of the site does not load. Nunito carries the slide titles
// — heavy, round and friendly, so a hard idea does not look severe. Comic Neue
// is the hand-drawn label face inside the diagrams; it is what makes the
// Excalidraw-style artwork read as drawn rather than rendered.
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["800", "900"],
  display: "swap",
});

const comic = Comic_Neue({
  subsets: ["latin"],
  variable: "--font-comic",
  weight: ["700"],
  display: "swap",
});

const TITLE = "Claude Code windows can talk now";
const DESCRIPTION = "Claude Code sessions can now message each other. What that actually means, in plain words: one window sends another a short note, the other one reads it and can answer on its own, and no files or history ever cross between them.";
const SHORT = "One window sends another a short note. No files, no history \u2014 and the other side can answer on its own.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Claude Code",
    "Claude Code sessions",
    "cross-session messaging",
    "Claude Code tips",
    "AI agents",
    "run two Claude Code sessions",
    "Claude Code multi session",
    "AI for productivity",
  ],
  openGraph: {
    title: TITLE,
    description: SHORT,
    type: "article",
    url: "https://oleg.ae/claude-code-sessions",
    publishedTime: "2026-08-09T00:00:00Z",
    modifiedTime: "2026-08-09T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT,
  },
  alternates: {
    canonical: "https://oleg.ae/claude-code-sessions",
  },
};

export default function ClaudeCodeSessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The route owns its own ground, reset and type scale, all of it scoped under
  // .cct-page in page.css. The font variables have to land on the same node.
  return (
    <div className={`cct-page ${nunito.variable} ${comic.variable}`}>
      {children}
    </div>
  );
}
