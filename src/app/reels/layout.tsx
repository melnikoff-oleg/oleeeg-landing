import type { Metadata } from "next";
import { silka } from "@/fonts/silka";
import "./reels.css";

const title = "The Viral Reels Wall: Search 2,000+ Instagram Reels That Went Viral";
const description =
  "One page over the whole viral Instagram reels library. Search it by describing the reel you want to make, filter it by topic, recency and audience size, and open any reel to see its hook, what held the viewer and what they got out of it.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "viral reels",
    "viral Instagram reels",
    "Instagram reels database",
    "viral reel examples",
    "reel hook ideas",
    "Instagram outlier reels",
    "short form video research",
    "Oleg Melnikov",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://oleg.ae/reels",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://oleg.ae/reels" },
};

/**
 * The wrapper that makes this page a different place from the rest of the site.
 *
 * Two things hang off it. `silka.variable` scopes the typeface to this subtree,
 * so the root layout's Inter / DM Sans / Space Grotesk keep every other route
 * and no fourth font is preloaded on pages that do not use it. `reels-root` is
 * the selector every rule in reels.css is nested under, so the paper, the ink
 * and the stickers cannot leak into the dark navy the site is otherwise built
 * in, and deleting the page means deleting one folder.
 */
export default function ReelsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${silka.variable} reels-root`}>{children}</div>;
}
