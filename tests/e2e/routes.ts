// Single source of truth for the site's public routes, imported by every spec
// that iterates them (routes, design-tokens, mobile-overflow). Keeping one list
// means a new page can't be silently absent from half the suite.
//
// Four live routes are deliberately NOT here: /elon-musk-ai, /boris-cherny-ai,
// /claude-code-sessions and /claude-riemann-hypothesis. They are the filmed
// pages, ported in from the vault, and they render none of the shared shell — no
// header, no footer, no design tokens, and their own scoped ground — so every
// spec that iterates this list would fail on them for reasons that are the point
// of the pages. Adding one means teaching those specs to skip it; excluding it
// is the cheaper truth. (They are not link dead ends any more: each one whose
// video is live carries a FilmedPageOutro from its layout.tsx.)

export const ROUTES = [
  "/",
  // The search cluster: pages built for keywords that exist, rather than for
  // the video titles. See seo/2026-08-27-strategy.md.
  "/claude-code-tutorial",
  "/claude-code-pricing",
  "/claude-code-vs-cursor",
  "/claude-cowork",
  "/claude-cowork-pricing",
  "/claude-b2b-outreach",
  "/claude-cowork-outreach",
  "/claude-twitter",
  "/claude-content",
  "/claude-reels",
  "/claude-tiktok",
  "/claude-social-growth",
  "/claude-marketing",
  "/ads-ai",
  "/high-converting-website",
  "/60k-linkedin-post",
  "/5-levels-ai",
  "/opus-5",
  "/claude-code-instagram",
  "/claude-code-second-brain",
  "/claude-code-ads",
  "/marketing-brain",
  "/marketing-brain-knowledge",
  "/reels",
  "/creators",
  "/ideas",
] as const;

// The two reel pages are in ROUTES (they must still return 200, render one h1
// and log no console errors) but render no shared shell at all: no wordmark, no
// footer, no copy. That is the design, not an oversight. One is the library, its
// search box and its five filters, the other is the creators behind it, and each
// carries only the two-way nav. So the shell specs skip them by name. The slugs
// they used to live on are permanent redirects, which are not routes to test as
// pages: /viral-reels folded into the library on 2026-08-25, and on 2026-08-27
// /viral-reels-browse became /reels, /viral-reels-creators became /creators, and
// /viral-reels-ideas was deleted outright.
const BARE_ROUTES: readonly string[] = ["/reels", "/creators"];

export const SHELL_ROUTES = ROUTES.filter((r) => !BARE_ROUTES.includes(r));

// Pages that render the cross-linked ResourceFooter (all except the homepage,
// the chat and the bare search).
export const FOOTER_ROUTES = SHELL_ROUTES.filter(
  (r) => r !== "/" && r !== "/marketing-brain",
);

// The routes that carry a full written guide: the video's content as a readable
// article, so the page answers the query without the video. guide.spec.ts holds
// the contract they all have to satisfy.
export const GUIDE_ROUTES = [
  "/claude-code-tutorial",
  "/claude-code-pricing",
  "/claude-code-vs-cursor",
  "/claude-cowork",
  "/claude-cowork-pricing",
  "/claude-cowork-outreach",
  "/claude-b2b-outreach",
  "/claude-reels",
  "/claude-code-instagram",
  "/claude-content",
  "/claude-marketing",
  "/claude-social-growth",
  "/claude-tiktok",
  "/claude-twitter",
] as const;

// Slugs consolidated into a stronger sibling on 2026-08-27. Each one had a
// private or removed source video and a target keyword under 20 searches a
// month, so it was splitting equity rather than earning any. They must answer
// with a permanent redirect, never a 404: they are still linked from old video
// descriptions and from recommendations.json.
export const REDIRECTED_ROUTES: Record<string, string> = {
  "/claude-outreach": "/claude-b2b-outreach",
  "/claude-trend-scanner": "/claude-social-growth",
  "/claude-interviewer": "/claude-content",
  "/claude-website": "/high-converting-website",
  "/claude-seo": "/claude-code-tutorial",
};
