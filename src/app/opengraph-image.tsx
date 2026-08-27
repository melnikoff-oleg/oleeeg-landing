import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

// The site-wide default. Next applies the nearest opengraph-image in the
// segment tree, so any route without its own falls back to this one.
export const alt = "Oleg Melnikov: AI systems for marketing, and Claude Code";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    title: "AI systems for marketing, built with Claude Code",
    eyebrow: "oleg melnikov",
  });
}
