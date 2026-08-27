import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "Social media growth, from 2,000 competitor videos";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "Social media growth, from 2,000 competitor videos", eyebrow: "free guide" });
}
