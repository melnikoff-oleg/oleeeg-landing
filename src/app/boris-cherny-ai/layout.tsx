import type { Metadata } from "next";
import { Nunito, Comic_Neue } from "next/font/google";

// The deck's two faces, the same pair /claude-riemann-hypothesis loads and for
// the same reasons. Nunito carries the slide titles — heavy, round and friendly,
// so a hard idea does not look severe. Comic Neue is the hand-drawn label face
// inside the diagrams; it is what makes the Excalidraw-style artwork read as
// drawn rather than rendered.
//
// The four faces this route used to load (Newsreader, Roboto, DM Sans, Space
// Grotesk) went with the article build: there are no verbatim quotes and no
// YouTube card copies on the deck.
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["600", "800", "900"],
  display: "swap",
});

const comic = Comic_Neue({
  subsets: ["latin"],
  variable: "--font-comic",
  weight: ["700"],
  display: "swap",
});

const TITLE = "10 Things The Creator Of Claude Code Actually Does With AI";
const DESCRIPTION = "Ten things Boris Cherny, the creator of Claude Code, says he actually does with AI, one rule to a slide. Why he tells you to delete your CLAUDE.md every six months, why the most expensive model is the cheap one, why he runs five agents by day and hundreds by night, and why he says experience is now a handicap.";
const SHORT = "Ten rules from the creator of Claude Code, one to a slide, read out of 27 interviews and 1,346 of his posts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Boris Cherny",
    "creator of Claude Code",
    "how to use Claude Code",
    "Claude Code tips",
    "Claude Code workflow",
    "CLAUDE.md",
    "Claude Code skills",
    "AI coding agents",
    "Anthropic",
    "Claude Code",
  ],
  openGraph: {
    title: TITLE,
    description: SHORT,
    type: "article",
    url: "https://oleg.ae/boris-cherny-ai",
    publishedTime: "2026-08-07T00:00:00Z",
    modifiedTime: "2026-08-12T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT,
  },
  alternates: {
    canonical: "https://oleg.ae/boris-cherny-ai",
  },
};

export default function BorisChernyAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The route owns its own ground, reset and type scale, all of it scoped under
  // .bcd-page in page.css. The font variables have to land on the same node.
  return (
    <div className={`bcd-page ${nunito.variable} ${comic.variable}`}>
      {children}
    </div>
  );
}
