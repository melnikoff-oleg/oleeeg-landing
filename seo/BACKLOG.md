# SEO backlog

Open work, highest value first. IDs are stable, so a task keeps its ID after it moves to `LOG.md`.

**ID prefixes:** `S-` from the site audit, `U-` from an Ubersuggest report, `G-` from Search Console.

**Impact** is the expected effect on search traffic. **Effort** is rough build time.

---

## Do next

| ID | Task | Impact | Effort | Notes |
| --- | --- | --- | --- | --- |
| S-06 | **Google Search Console verification** | High | 15 min | Everything else is guesswork until this exists. Plausible's Stats API is off the plan, so GSC is the only source of query-level truth, and Ubersuggest is estimating what GSC would tell you for free. Verify via a `google-site-verification` meta tag in the root layout, or a DNS TXT record at the registrar. Was marked "blocked, revisit" in CLAUDE.md, worth unblocking first. |
| S-01 | **Open Graph images** | High | Half a day | Zero exist site-wide. The root layout declares `summary_large_image` and supplies no image, so it asks for a large card and gives nothing. Traffic is social and YouTube-fed, which is exactly where the preview image decides the click. Suggested approach: one Next.js `opengraph-image.tsx` generator so every route gets a branded card automatically (navy background, the metallic wordmark, page title), rather than 35 hand-made files. |
| U-01 | **A "Claude Code tutorials" hub page, and stop 17 pages fighting over the term** | High | 1 day | From the Ubersuggest row "claude code tutorial", but the real finding is bigger than the row. **17 pages declare `Claude Code tutorial` in their keywords and no page owns it**, while the root title claims "Claude Code Tutorials" site-wide and `src/app/` has no `/guides` or `/tutorials` index at all. Two parts: build the hub page that can actually rank for the head term and link down to all 17, and thin the keyword out of the pages that should be targeting their own specific term instead. This is the site's second stated target keyword, so it earns the slot regardless of Ubersuggest. See `ubersuggest/2026-08-24-opportunities.md`. |
| S-02 | **Stop stamping `lastModified: new Date()` on every sitemap entry** | Medium | 1 hour | All 35 entries claim they changed within the hour, every fetch. Google discounts a `lastModified` it cannot trust, which throws away the sitemap's one useful signal. Options: git file mtime per route at build time, or a hand-kept date per entry, or drop the field on static pages and keep it only on the genuinely dynamic ones (`/ideas`, `/reels`, the creator pages). |

## Worth doing

| ID | Task | Impact | Effort | Notes |
| --- | --- | --- | --- | --- |
| S-05 | **FAQPage schema on the troubleshooting blocks** | Medium | 2 hours | `troubleshooting.tsx` already holds 10 real Q&A entries rendered on 16 pages, built from clustering 593 YouTube comments. They are exactly the long-tail queries people type verbatim ("claude not found", "credit balance exceeded", "gemini quota"). Emit `FAQPage` JSON-LD from the same `FIXES` data so the markup can never drift from the copy. Only include the entries actually rendered on that page. |
| U-02 | **Work out why `/claude-content` is not winning its cluster, then fix that page** | Medium | Half a day | Ubersuggest emitted 7 separate "create new content" rows for one topic (automatic / automate / automating content creation, ai content creation, ai content creators, ai content creation tools, best ai tools for content creation). Do **not** build 7 pages: that is a doorway-page pattern and Google treats those morphological variants as one query anyway. `/claude-content` already targets this cluster and already declares those keywords. The work is diagnosis then a single-page upgrade, not new URLs. Blocked on Search Console (`S-06`) to see what it currently ranks for. |
| S-04 | **Person and WebSite schema on the homepage** | Medium | 1 hour | `src/app/page.tsx` renders no JSON-LD at all. Person schema with `sameAs` to YouTube, LinkedIn, Instagram and boldane.com consolidates the entity for "Oleg Melnikov" queries. Named as a to-do in CLAUDE.md. `ArticleJsonLd` already has the author block to copy. |
| S-08 | **Lighthouse and Core Web Vitals baseline** | Medium | 2 hours | Real perf work has shipped and has never been measured, so there is no before number and no idea which page is worst. Run Lighthouse across the route list, record the numbers in `audits/`, then fix whatever fails. |

## Needs a decision from Oleg

| ID | Task | Impact | Effort | Notes |
| --- | --- | --- | --- | --- |
| S-07 | **The five pages whose source video is private** | Medium | Varies | `/claude-website`, `/claude-outreach`, `/claude-seo`, `/claude-interviewer`, `/claude-trend-scanner`. All still work as standalone guides and carry inbound `NextUp` links, which is why they were kept. But they are the thinnest pages in the index. `/claude-website` is fully superseded by `/high-converting-website` (public repo, real proof) and is the obvious candidate to redirect into it, which would also consolidate its link equity. Oleg's call. |
| S-09 | **Dead `skool.com/n8nlab` link in 7 YouTube descriptions** | High, off-site | 30 min | 404s. Linked from 7 videos totalling 169,284 views, including the "access the database" link on the 95k and 37k n8n videos. 127 comments asking where the template went. Not an oleg.ae SEO item strictly, but it is the single largest pool of wasted attention pointing at a dead end, and redirecting it at the site would be the cheapest traffic gain available. Needs YouTube Studio access, no API credentials in this environment. |

## Waiting on input

| ID | Task | Notes |
| --- | --- | --- |
| U-04 | **Triage Ubersuggest opportunities pages 2 and 3** | Only 10 of 24 rows have been reviewed. Screenshot the remaining two pages into `seo/ubersuggest/`. |
| G-01 | **Validate the keyword map against real data** | Every row in `keywords.md` is `assumed`. Needs Search Console (`S-06`) plus Ubersuggest volume and difficulty columns, which the Opportunities view does not show. |

---

## Triage note for Ubersuggest items

Ubersuggest runs a generic checklist and does not know this codebase. Before adding one of its suggestions here, check it against these, because several of its standard findings are already handled or are deliberate:

- **"Missing canonical tags"** -> all 32 child layouts already have one. If the tool disagrees it is reading a snapshot before hydration.
- **"Thin content" on `/viral-reels`, `/viral-reels-browse`, `/viral-reels-ideas`** -> deliberate. Those pages are intentionally bare with an `sr-only` h1.
- **"Missing h1"** on the filmed pages -> check the real rendered HTML first, those pages ship no shared chrome by design.
- **"Low word count"** -> only act on this where the page genuinely under-serves the query, never by padding.
- **"Add internal links from the homepage"** -> the homepage deliberately links to no resource pages. Needs Oleg's sign-off, it is not a free win.
- **Anything about keyword density** -> ignore.

---

## Rejected

Recorded so the same suggestion does not get re-triaged next month.

| ID | Item | Source | Why |
| --- | --- | --- | --- |
| U-03 | Pages for "individual branding" and "example of individual branding" | Ubersuggest, 2026-08-24 | Wrong intent, not wrong difficulty. "Individual branding" is a brand-architecture term from marketing textbooks (each product gets its own brand name, the Procter and Gamble pattern), not personal branding. The searcher is a student wanting a definition. Zero commercial fit with a $2K per month done-for-you service for founders, and it would put a textbook explainer on a site arguing that Oleg builds AI systems. Ubersuggest matched on string similarity to Boldane's positioning language. |

---

## Done

| ID | Task | Shipped |
| --- | --- | --- |
| S-03 | Add `/sam-altman-ai` to the sitemap | 2026-08-24, see `LOG.md` |
