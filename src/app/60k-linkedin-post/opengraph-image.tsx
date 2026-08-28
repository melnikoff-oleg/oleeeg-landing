import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "The LinkedIn prompts behind a $60K month";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "The LinkedIn prompts behind a $60K month", eyebrow: "Free prompts" });
}
