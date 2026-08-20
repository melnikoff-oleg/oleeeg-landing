import type { Metadata } from "next";

const title = "Viral Reels Database: Search Instagram Reels That Went Viral";
const description =
  "Search hundreds of Instagram reels that beat their creator's audience by 5x or more. Describe your idea and get the closest viral references, each with its hook, what held the viewer, and what they got out of it.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "viral reels",
    "viral Instagram reels",
    "Instagram reels database",
    "reel hook ideas",
    "viral reel examples",
    "Instagram reel references",
    "short form video research",
    "Oleg Melnikov",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://oleg.ae/viral-reels",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://oleg.ae/viral-reels" },
};

export default function ViralReelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
