import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "Claude and the Riemann Hypothesis, Explained";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "Claude and the Riemann Hypothesis, Explained", eyebrow: "explained" });
}
