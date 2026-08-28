import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "10 Things Claude Code's Creator Does With AI";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "10 Things Claude Code's Creator Does With AI", eyebrow: "The evidence" });
}
