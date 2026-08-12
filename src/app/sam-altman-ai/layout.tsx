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

const TITLE = "20 Things Sam Altman Actually Does With AI";
const DESCRIPTION = "Twenty things Sam Altman says he actually does with AI, one rule to a slide. Why he trusts an idea only when ChatGPT disagrees with him, what he handed his agents first, the vow about his own computer he broke in a few hours, and the one part of his life he keeps the tools out of.";
const SHORT = "Twenty rules from Sam Altman, one to a slide, read out of 63 interviews and 1,947 of his posts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Sam Altman",
    "how Sam Altman uses AI",
    "Sam Altman ChatGPT",
    "ChatGPT tips",
    "how to use ChatGPT",
    "Sam Altman advice",
    "Codex",
    "AI agents",
    "OpenAI",
    "ChatGPT",
  ],
  openGraph: {
    title: TITLE,
    description: SHORT,
    type: "article",
    url: "https://oleg.ae/sam-altman-ai",
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
    canonical: "https://oleg.ae/sam-altman-ai",
  },
};

export default function SamAltmanAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The route owns its own ground, reset and type scale, all of it scoped under
  // .sad-page in page.css. The font variables have to land on the same node.
  return (
    <div className={`sad-page ${nunito.variable} ${comic.variable}`}>
      {children}
    </div>
  );
}
