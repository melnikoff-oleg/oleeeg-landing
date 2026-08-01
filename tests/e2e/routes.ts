// Single source of truth for the site's public routes, imported by every spec
// that iterates them (routes, design-tokens, mobile-overflow). Keeping one list
// means a new page can't be silently absent from half the suite.

export const ROUTES = [
  "/",
  "/claude-outreach",
  "/claude-b2b-outreach",
  "/claude-cowork-outreach",
  "/claude-twitter",
  "/claude-content",
  "/claude-reels",
  "/claude-tiktok",
  "/claude-social-growth",
  "/claude-trend-scanner",
  "/claude-marketing",
  "/claude-seo",
  "/claude-website",
  "/claude-interviewer",
  "/ads-ai",
  "/high-converting-website",
  "/60k-linkedin-post",
  "/5-levels-ai",
  "/opus-5",
  "/claude-code-instagram",
  "/elon-ai",
  "/marketing-brain",
  "/marketing-brain-knowledge",
] as const;

// Pages that render the cross-linked ResourceFooter (all except the homepage
// and the chat).
export const FOOTER_ROUTES = ROUTES.filter(
  (r) => r !== "/" && r !== "/marketing-brain",
);
