import type { MetadataRoute } from "next";
import { creatorRosterConfigured, listCreatorHandles } from "@/lib/creators/roster";

// The creator pages are read out of the database rather than listed here: there
// are 245 of them and creators.py adds more every time the library grows, so a
// hand-kept list would be wrong within the week. One narrow read of a 245-row
// table, and a failure costs the sitemap those entries rather than the whole
// file.
export const revalidate = 3600;

async function creatorEntries(): Promise<MetadataRoute.Sitemap> {
  if (!creatorRosterConfigured) return [];
  try {
    const handles = await listCreatorHandles();
    return handles.map((account) => ({
      url: `https://oleg.ae/viral-reels-creators/${account}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch (err) {
    console.error("sitemap creator entries failed", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://oleg.ae",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://oleg.ae/claude-outreach",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-twitter",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-tiktok",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-website",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/high-converting-website",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-social-growth",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-trend-scanner",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-b2b-outreach",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-seo",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-cowork-outreach",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-marketing",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-reels",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-content",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-interviewer",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/ads-ai",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/60k-linkedin-post",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/5-levels-ai",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/opus-5",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-code-instagram",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-code-second-brain",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-code-ads",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/elon-musk-ai",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/boris-cherny-ai",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/andrej-karpathy-ai",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/sam-altman-ai",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-code-sessions",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/claude-riemann-hypothesis",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/marketing-brain-knowledge",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://oleg.ae/reels",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      // The library, which absorbed /viral-reels (the old search page) on
      // 2026-08-25. That slug is a permanent redirect now, so it is gone from
      // here: a sitemap that lists a 308 tells a crawler to fetch a page twice.
      url: "https://oleg.ae/viral-reels-browse",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/viral-reels-creators",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/viral-reels-ideas",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://oleg.ae/ideas",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: "https://oleg.ae/marketing-brain",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...(await creatorEntries()),
  ];
}
