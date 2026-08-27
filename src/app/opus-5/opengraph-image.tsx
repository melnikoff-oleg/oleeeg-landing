import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "Opus 5, no hype: five rules nobody mentions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "Opus 5, no hype: five rules nobody mentions", eyebrow: "the numbers" });
}
