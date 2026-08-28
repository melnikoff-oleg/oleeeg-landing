import type { Metadata } from "next";
import { Newsreader, Roboto } from "next/font/google";
import { FilmedPageOutro } from "@/components/filmed-page-outro";

// Two faces the rest of the site does not load. Newsreader carries Elon's
// verbatim quotes, so his words never look like Oleg's words. Roboto is
// required — the interview cards are copies of YouTube's own design and they
// stop reading as YouTube the moment the type is anything else.
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

const TITLE = "Seven Things Elon Musk Actually Does With AI";
const DESCRIPTION =
  "Seven things Elon Musk says he actually does with AI, each one linked to the exact second he says it. The three questions he asks every new model, why he photographs a problem instead of describing it, why ten times the compute is only twice the intelligence, and why he says the smartest model on earth is not his.";
const SHORT =
  "Seven things he actually does with AI, each linked to the exact second he says it. Read from 31 interviews and 997 of his posts.";

// SERP note (2026-08-27): `description` is SHORT, not DESCRIPTION. DESCRIPTION runs
// 200 to 320 characters, and Google cuts a description at about 160, so the tail
// (which is where the specific words are) never showed. SHORT was already written
// to be the one-line version. Enforced by tests/e2e/metadata.spec.ts (86).
export const metadata: Metadata = {
  title: TITLE,
  description: SHORT,
  keywords: [
    "How Elon Musk uses AI",
    "Elon Musk AI",
    "Elon Musk Grok",
    "Elon Musk AI rules",
    "How to use AI daily",
    "Which AI model is best",
    "AI prompting",
    "Anthropic Fable",
    "Grok 4.5",
    "Claude Code",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "https://oleg.ae/elon-musk-ai",
    publishedTime: "2026-08-05T00:00:00Z",
    modifiedTime: "2026-08-05T00:00:00Z",
    authors: ["Oleg Melnikov"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT,
  },
  alternates: {
    canonical: "https://oleg.ae/elon-musk-ai",
  },
};

export default function ElonMuskAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The page owns its own ground, reset and type scale, all of it scoped under
  // .elon-page in page.css. The font variables have to land on the same node.
  //
  // The outro sits OUTSIDE that node on purpose: the page's scoped reset must
  // not reach it, and it must not reach the page. It lives here rather than in
  // page.tsx because page.tsx is generated from the vault and gets overwritten.
  return (
    <>
      <div className={`elon-page ${newsreader.variable} ${roboto.variable}`}>
        {children}
      </div>
      {/* The companion video (ieTgCMWYsoQ) went private some time before
          2026-08-27: the oembed endpoint 403s and it is no longer on the
          channel. Without videoId the outro renders its "More from Oleg"
          variant (channel + free guides) instead of a thumbnail that links to a
          dead watch page. Put the id back if the video is republished. */}
      <FilmedPageOutro />
    </>
  );
}
