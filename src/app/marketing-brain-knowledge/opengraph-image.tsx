import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "8 books and 75 talks, one knowledge base";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "8 books and 75 talks, one knowledge base", eyebrow: "the corpus" });
}
