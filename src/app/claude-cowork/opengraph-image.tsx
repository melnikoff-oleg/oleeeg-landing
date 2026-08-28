import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "Claude Cowork, from someone who runs it daily";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "Claude Cowork, from someone who runs it daily", eyebrow: "Claude Cowork" });
}
