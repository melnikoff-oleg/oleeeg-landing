import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/schema";

// Everything is crawlable, assistants included. Half the point of writing the
// guides out in full is being useful when someone asks ChatGPT or Perplexity
// rather than Google, and blocking those crawlers to "protect the content"
// would trade the audience for nothing. The site holds no private data: the
// server-only corpora (marketing-brain chunks, reel embeddings) are never under
// public/ and are not reachable as urls.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
