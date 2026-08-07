import type { Metadata } from "next";
import { Newsreader, Roboto } from "next/font/google";

// Two faces the rest of the site does not load, same pair and same reasons as
// /elon-musk-ai. Newsreader carries Boris's verbatim quotes, so his words never
// look like Oleg's words. Roboto is required — the interview cards are copies of
// YouTube's own design and they stop reading as YouTube the moment the type is
// anything else. DM Sans and Space Grotesk already come from the root layout
// under the same variable names.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500"],
  display: "swap",
});

const TITLE = "10 Things The Creator Of Claude Code Actually Does With AI";
const DESCRIPTION =
  "Ten things Boris Cherny, the creator of Claude Code, says he actually does with AI, each one linked to the exact second he says it. Why he tells you to delete your CLAUDE.md every six months, why the most expensive model is the cheap one, why he runs five agents by day and hundreds by night, and why he says experience is now a liability.";
const SHORT =
  "Ten things he actually does with AI, each linked to the exact second he says it. Read from 27 interviews and 1,346 of his posts.";

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
    modifiedTime: "2026-08-07T00:00:00Z",
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
  // The page owns its own ground, reset and type scale, all of it scoped under
  // .boris-page in page.css. The font variables have to land on the same node.
  return (
    <div className={`boris-page ${newsreader.variable} ${roboto.variable}`}>
      {children}
    </div>
  );
}
