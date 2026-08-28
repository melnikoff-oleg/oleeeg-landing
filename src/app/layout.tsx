import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Plausible } from "@/components/plausible";
import "./globals.css";

// Inter used to be loaded here as the body default. It was the largest font
// file on the site (about 47 kB on every cold visit) and it rendered almost
// nothing: `font-sans` appeared exactly twice in the whole codebase, once being
// the <body> tag below, because every element specifies font-display (DM Sans)
// or font-body (Space Grotesk). Removing it takes roughly 45% off the font
// payload and changes nothing anyone can see. --font-sans now points at the
// body face, so text that specifies no family inherits the one the design
// already uses for body copy. Guarded by tests/e2e/perf-budget.spec.ts (83).

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  // 300 was dead: the only font-light usages sit on font-display (DM Sans),
  // which renders them at 400. Dropping it saves a woff2 + a preload.
  // 700 is here for `.prose-guide strong`, which is the emphasis inside the
  // written guides. Without it the browser synthesises a fake bold off the 500
  // face, which on a body face this geometric looks smeared rather than strong.
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oleg.ae"),
  title: {
    default: "Oleg Melnikov: AI Systems for Marketing & Claude Code Tutorials",
    template: "%s | Oleg Melnikov",
  },
  description:
    "AI software entrepreneur. Free, complete guides to running marketing with Claude Code and Claude Cowork, from someone who runs every system on this site.",
  keywords: [
    "AI systems for marketing",
    "Claude Code",
    "Claude Code for marketing",
    "Personal branding for founders",
    "AI for B2B founders",
    "Boldane",
    "Oleg Melnikov",
  ],
  openGraph: {
    title: "Oleg Melnikov: AI Systems for Marketing & Claude Code Tutorials",
    description:
      "AI software entrepreneur bridging media and software. I run Boldane, helping founders with real expertise become known, and teach AI systems for marketing and Claude Code to 19K+ on YouTube.",
    type: "website",
    url: "https://oleg.ae",
    siteName: "Oleg Melnikov",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oleg Melnikov: AI Systems for Marketing & Claude Code Tutorials",
    description:
      "AI software entrepreneur bridging media and software. I run Boldane, helping founders with real expertise become known, and teach AI systems for marketing and Claude Code to 19K+ on YouTube.",
  },
  alternates: {
    canonical: "https://oleg.ae",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased">
        <Plausible />
        {children}
      </body>
    </html>
  );
}
