import type { MetadataRoute } from "next";
import { creatorRosterConfigured, listCreatorHandles } from "@/lib/creators/roster";
import { SITEMAP_ROUTES } from "@/lib/seo/sitemap-routes";
import { SITE_URL } from "@/lib/seo/schema";

// The static routes come from src/lib/seo/sitemap-routes.ts, which carries a
// real per-page lastModified and is checked against src/app by a unit test. The
// creator pages are read out of the database instead: there are ~245 of them
// and creators.py adds more every time the library grows, so a hand-kept list
// would be wrong within the week. One narrow read of a 245-row table, and a
// failure costs the sitemap those entries rather than the whole file.
export const revalidate = 3600;

async function creatorEntries(): Promise<MetadataRoute.Sitemap> {
  if (!creatorRosterConfigured) return [];
  try {
    const handles = await listCreatorHandles();
    return handles.map((account) => ({
      url: `${SITE_URL}/creators/${account}`,
      // These genuinely do change when the library is re-synced, and unlike the
      // static pages there is no honest fixed date to give them.
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
  const statics: MetadataRoute.Sitemap = SITEMAP_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(r.lastModified),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
  return [...statics, ...(await creatorEntries())];
}
