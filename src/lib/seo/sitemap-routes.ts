// Every static route on the site, with an HONEST last-modified date.
//
// Two bugs this file exists to kill.
//
// 1. The old sitemap stamped `lastModified: new Date()` on all 35 entries, on
//    every fetch. That tells Google every page changed within the hour, every
//    hour, which is not credible, so it discounts the field entirely and the
//    sitemap's one useful signal is thrown away. The dates below are real: they
//    come from when the page's files actually last changed.
// 2. /sam-altman-ai shipped without a sitemap entry and nobody noticed for
//    months, because the list was hand-kept prose with no check. A unit test now
//    reads src/app and fails if a route folder is missing from this list, so the
//    same gap cannot open again.
//
// When you change a page, update its date here. Nothing enforces the date's
// accuracy (nothing can), but a stale honest date is still worth more than a
// fresh dishonest one.

export type SitemapRoute = {
  /** Path after the origin, "" for the homepage. */
  path: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const CLUSTER = 0.9;
const GUIDE = 0.8;
const SECONDARY = 0.6;

export const SITEMAP_ROUTES: SitemapRoute[] = [
  { path: "", lastModified: "2026-08-27", changeFrequency: "weekly", priority: 1 },

  // The search cluster, built 2026-08-27 for keywords that exist. Highest
  // priority after the homepage because they are the pages meant to rank.
  { path: "/claude-code-tutorial", lastModified: "2026-08-27", changeFrequency: "weekly", priority: CLUSTER },
  { path: "/claude-code-pricing", lastModified: "2026-08-27", changeFrequency: "weekly", priority: CLUSTER },
  { path: "/claude-code-vs-cursor", lastModified: "2026-08-27", changeFrequency: "weekly", priority: CLUSTER },
  { path: "/claude-cowork", lastModified: "2026-08-27", changeFrequency: "weekly", priority: CLUSTER },
  { path: "/claude-cowork-pricing", lastModified: "2026-08-27", changeFrequency: "weekly", priority: CLUSTER },

  // The video guides, each rewritten as a standalone article.
  { path: "/claude-cowork-outreach", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-b2b-outreach", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-reels", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-code-instagram", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-tiktok", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-twitter", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-content", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-social-growth", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-marketing", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-code-second-brain", lastModified: "2026-08-12", changeFrequency: "monthly", priority: GUIDE },
  { path: "/claude-code-ads", lastModified: "2026-08-12", changeFrequency: "monthly", priority: GUIDE },

  // Tools and lead magnets.
  { path: "/high-converting-website", lastModified: "2026-08-15", changeFrequency: "monthly", priority: GUIDE },
  { path: "/ads-ai", lastModified: "2026-08-27", changeFrequency: "monthly", priority: GUIDE },
  { path: "/60k-linkedin-post", lastModified: "2026-08-15", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/5-levels-ai", lastModified: "2026-08-15", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/opus-5", lastModified: "2026-08-15", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/fable-money", lastModified: "2026-09-03", changeFrequency: "monthly", priority: GUIDE },

  // The marketing brain.
  { path: "/marketing-brain", lastModified: "2026-08-15", changeFrequency: "monthly", priority: GUIDE },
  { path: "/marketing-brain-knowledge", lastModified: "2026-08-15", changeFrequency: "monthly", priority: SECONDARY },

  // Filmed pages. They render none of the shared shell, by design.
  { path: "/elon-musk-ai", lastModified: "2026-08-27", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/boris-cherny-ai", lastModified: "2026-08-12", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/sam-altman-ai", lastModified: "2026-08-12", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/andrej-karpathy-ai", lastModified: "2026-08-13", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/claude-code-sessions", lastModified: "2026-08-12", changeFrequency: "monthly", priority: SECONDARY },
  { path: "/claude-riemann-hypothesis", lastModified: "2026-08-12", changeFrequency: "monthly", priority: SECONDARY },

  // Audience and tool surfaces. These genuinely change often.
  { path: "/ideas", lastModified: "2026-08-27", changeFrequency: "daily", priority: SECONDARY },
  { path: "/reels", lastModified: "2026-08-27", changeFrequency: "daily", priority: SECONDARY },
  { path: "/creators", lastModified: "2026-08-27", changeFrequency: "weekly", priority: SECONDARY },
];
