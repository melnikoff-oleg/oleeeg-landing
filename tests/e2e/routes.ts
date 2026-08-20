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
  "/claude-code-second-brain",
  "/claude-code-ads",
  "/marketing-brain",
  "/marketing-brain-knowledge",
  "/viral-reels",
  "/viral-reels/browse",
  "/ideas",
] as const;

// The two /viral-reels pages are in ROUTES (they must still return 200, render
// one h1 and log no console errors) but render no shared shell at all: no
// wordmark, no footer, no copy. That is the design, not an oversight. One is a
// search box and its results, the other is the library and its filters, and
// each carries a single link to the other. So the shell specs skip them by name.
export const SHELL_ROUTES = ROUTES.filter((r) => !r.startsWith("/viral-reels"));

// Pages that render the cross-linked ResourceFooter (all except the homepage,
// the chat and the bare search).
export const FOOTER_ROUTES = SHELL_ROUTES.filter(
  (r) => r !== "/" && r !== "/marketing-brain",
);
