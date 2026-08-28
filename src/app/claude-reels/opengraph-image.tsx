import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "Viral Instagram Reels with Claude Code";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "Viral Instagram Reels with Claude Code", eyebrow: "Free guide" });
}
