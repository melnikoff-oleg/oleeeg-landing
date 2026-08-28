import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "A second brain with Claude Code and Obsidian";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "A second brain with Claude Code and Obsidian", eyebrow: "Free guide" });
}
