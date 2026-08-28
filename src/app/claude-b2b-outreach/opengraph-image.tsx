import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "B2B outreach with Claude Code, 35% reply rate";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "B2B outreach with Claude Code, 35% reply rate", eyebrow: "B2B sales" });
}
