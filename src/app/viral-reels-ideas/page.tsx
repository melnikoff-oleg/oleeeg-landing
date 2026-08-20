import type { Metadata } from "next";
import { ReelNav } from "@/components/reel-nav";
import { IdeasChat } from "./components/ideas-chat";

const title = "Reel Ideas: Describe Your Brand, Get Video Ideas That Already Worked";
const description =
  "Describe what you sell and who it's for. An AI reads a library of Instagram reels that each beat their creator's audience by 5x, then gives you video ideas: angles proven in your own niche, and formats stolen from niches that have nothing to do with you.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "instagram reel ideas",
    "viral video ideas generator",
    "content ideas for my brand",
    "reel hook ideas",
    "short form video ideas",
    "ai content strategist",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://oleg.ae/viral-reels-ideas",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://oleg.ae/viral-reels-ideas" },
};

// Nothing on this page can be rendered ahead of time: it is empty until someone
// types, and everything after that streams.
export const dynamic = "force-static";

export default function ReelIdeasPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <h1 className="sr-only">reel ideas for your brand</h1>
      <ReelNav current="/viral-reels-ideas" />
      <IdeasChat />
    </main>
  );
}
