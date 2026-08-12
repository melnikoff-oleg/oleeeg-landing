import type { Metadata } from "next";
import { Nunito, Comic_Neue } from "next/font/google";
import { FilmedPageOutro } from "@/components/filmed-page-outro";

// The deck's two faces, the same pair /claude-riemann-hypothesis and
// /boris-cherny-ai load and for the same reasons. Nunito carries the slide
// titles — heavy, round and friendly, so a hard idea does not look severe.
// Comic Neue is the hand-drawn label face inside the diagrams; it is what makes
// the Excalidraw-style artwork read as drawn rather than rendered.
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

const TITLE = "20 Things Andrej Karpathy Actually Does With AI";
const DESCRIPTION = "Twenty rules read out of 37 interviews and 3,035 posts by Andrej Karpathy, one to a slide. Why he rambles at a microphone for ten minutes, why he never asks a model what it thinks, why he asks for HTML instead of text, why his agents' ideas are bad and their hands are good, and why he writes two thousand lines of code to throw away.";
const SHORT = "Twenty rules from Andrej Karpathy, one to a slide, read out of 37 interviews and 3,035 of his posts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Andrej Karpathy",
    "how Andrej Karpathy uses AI",
    "Karpathy LLM knowledge base",
    "Karpathy autoresearch",
    "agentic engineering",
    "vibe coding",
    "Claude Code",
    "AI coding agents",
    "how to use LLMs",
    "Anthropic",
  ],
  openGraph: {
    title: TITLE,
    description: SHORT,
    type: "article",
    url: "https://oleg.ae/andrej-karpathy-ai",
    publishedTime: "2026-08-12T00:00:00Z",
    modifiedTime: "2026-08-12T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT,
  },
  alternates: {
    canonical: "https://oleg.ae/andrej-karpathy-ai",
  },
};

export default function AndrejKarpathyAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The route owns its own ground, reset and type scale, all of it scoped under
  // .akd-page in page.css. The font variables have to land on the same node.
  //
  // FilmedPageOutro sits OUTSIDE the scoped div, the same mount the other
  // filmed pages use: without it the deck's last link is an external tally and
  // the page dead-ends. No videoId yet, the Karpathy video is unpublished; add
  // videoId + videoTitle here (in the port script's template) when it goes
  // live, then re-port.
  return (
    <>
      <div className={`akd-page ${nunito.variable} ${comic.variable}`}>
        {children}
      </div>
      <FilmedPageOutro />
    </>
  );
}
