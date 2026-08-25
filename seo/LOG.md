# SEO log

Append-only record of SEO work that actually shipped. Newest first. Dates and commits are from git history, not memory.

Format: `### YYYY-MM-DD  Title` then what changed, why, and the commit if there is one.

---

### 2026-08-24  Ubersuggest opportunities p1 triaged

10 of 24 rows reviewed. 1 accepted (`U-01`), 7 folded into one existing-page upgrade (`U-02`), 2 rejected on intent (`U-03`). Full reasoning in `ubersuggest/2026-08-24-opportunities.md`. Chasing the accepted row surfaced a larger finding: 17 pages declare "Claude Code tutorial" as a keyword and no page owns it, with no hub page anywhere in `src/app/`.

### 2026-08-24  `S-03` /sam-altman-ai added to the sitemap

It was the only route with a `page.tsx` and no sitemap entry, found by diffing the route folders against the sitemap URL list. Its four filmed siblings were all listed. `src/app/sitemap.ts`, typecheck clean.

### 2026-08-24  SEO folder created

This folder. Baseline audit written from the codebase (`audits/2026-08-24-baseline.md`), backlog seeded with 8 findings, keyword map drafted. No site changes yet.

### 2026-08-12  YouTube sync pass

Not framed as SEO work, but it fixed content accuracy across the resource pages, which is a ranking input. Dead video embeds and dead `VideoObject` schema stripped from `/claude-website` (four sibling pages had been stripped earlier in `63157cf`). Wrong env var names, a missing required key and stale prices corrected on 9 pages. `Troubleshooting` component added, built from clustering 593 YouTube comments into 10 real questions, wired onto 16 pages.

Also audited every URL in all 31 YouTube video descriptions. `skool.com/n8nlab/about` is dead (404) and is linked from 7 videos totalling 169,284 views. Fixing those descriptions needs YouTube Studio and is still open.

### 2026-08-12  Mobile clarity pass (`mobile-optimize`, commit `5f9b10f`)

All 30 routes audited at 390px and fixed. Mobile usability is a direct ranking factor and this pass closed it out: no horizontal overflow on any route, tap targets at 44px, primary copy at 16px, command blocks that wrap instead of clipping. Suite green at 211 tests.

### 2026-07-23  Performance pass (commit `1e14b08` era, branch `code-review-hardening`)

Framer Motion dropped from the homepage and 13 resource pages in favour of CSS keyframes plus IntersectionObserver. Homepage First Load JS went 165 to 124 kB, each resource page dropped about 47 kB. Eager YouTube iframes (0.5 to 1 MB of player JS on load) replaced with a click-to-load facade. `hero.jpg` re-exported to 2560x1706 at ~550 kB with EXIF stripped, `preview.mp4` re-encoded 1.9 MB to ~300 KB and lazy-loaded. AVIF plus `Cache-Control` headers added in `next.config.ts`.

### 2026-07-23  Internal linking rebuilt: `NextUp` (commit `1e14b08`)

The resource footer was a flat wall of about 18 equal links, so every page was a dead end at 1.48 pages per visit. Replaced with one prominent hero pick plus 1 to 2 ranked secondary picks from a precomputed `recommendations.json`, with the full library kept behind a `see all free resources` `<details>` so every internal link stays in the crawlable HTML.

Note: `scripts/build-recommendations.mjs` **cannot currently be regenerated**, because it sources popularity from the Plausible Stats API, which is off the plan. New entries have been hand-added since.

### 2026-07-06  Outbound link tracking (commit `d6d7594`)

Plausible `outboundLinks: true` so clicks to boldane.com, GitHub and Calendly are measurable. The event is `Outbound Link: Click` and still needs to be added as a goal in the Plausible dashboard to be visible there.

### 2026-06-28  `ArticleJsonLd` gains optional video fields (commit `0b243c1`)

`videoId` and `videoTitle` made optional so pages without a published video render Article schema without a broken `VideoObject`.

### 2026-05-13  Keyword optimization of all 12 resource pages (commit `da56147`)

Keyword-rich title, description, keywords, OpenGraph and Twitter metadata written for every resource page from keyword research. `ArticleJsonLd` introduced in the same pass, with Person author and `sameAs` links to YouTube, LinkedIn and Instagram. Proper h1 to h2 hierarchy enforced across sections.

### 2026-05-12  Sitemap and robots.txt (commit `15f7f10`)

`src/app/sitemap.ts` and `src/app/robots.ts` added alongside the first 10 resource pages. Every new page has been added to the sitemap since, with one miss: `/sam-altman-ai` (see backlog `S-03`).

### 2026-05-12  Plausible analytics (commit `f1bcdd2`)

Domain `oleg.ae`. The only analytics on the site. Its Stats API stopped being queryable at some point before 2026-08-12.
