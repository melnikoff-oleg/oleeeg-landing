import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "Claude Code vs Cursor, Codex and the rest";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "Claude Code vs Cursor, Codex and the rest", eyebrow: "comparison" });
}
