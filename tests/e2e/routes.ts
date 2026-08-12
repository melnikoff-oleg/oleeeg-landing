// Single source of truth for the site's public routes, imported by every spec
// that iterates them (routes, design-tokens, mobile-overflow). Keeping one list
// means a new page can't be silently absent from half the suite.
//
// Two live routes are deliberately NOT here: /elon-musk-ai and /boris-cherny-ai.
// They are the filmed evidence-wall pages, ported in from the vault, and they
// render none of the shared shell — no header, no footer, no design tokens, and
// their own scoped ground — so every spec that iterates this list would fail on
// them for reasons that are the point of the pages. Adding one means teaching
// those specs to skip it; excluding it is the cheaper truth.

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
  "/marketing-brain",
  "/marketing-brain-knowledge",
] as const;

// Pages that render the cross-linked ResourceFooter (all except the homepage
// and the chat).
export const FOOTER_ROUTES = ROUTES.filter(
  (r) => r !== "/" && r !== "/marketing-brain",
);
