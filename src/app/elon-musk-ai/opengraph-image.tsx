import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "Seven things Elon Musk actually does with AI";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "Seven things Elon Musk actually does with AI", eyebrow: "The evidence" });
}
