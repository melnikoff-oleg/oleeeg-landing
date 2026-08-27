# SEO backlog

Open work, highest value first. IDs are stable, so a task keeps its ID after it moves to `LOG.md`.

**ID prefixes:** `S-` from the site audit, `U-` from an Ubersuggest report, `G-` from Search Console.

**Impact** is the expected effect on search traffic. **Effort** is rough build time.

---

## Do next

| ID | Task | Impact | Effort | Notes |
| --- | --- | --- | --- | --- |
| S-06 | **Google Search Console verification** | High | 15 min | **Now the single highest-value item on this list.** The 2026-08-27 pass shipped 14 rewritten guides and 5 new cluster pages against measured demand, and there is no way to see whether any of it lands without GSC. Ubersuggest estimates what GSC reports for free. Verify with a `google-site-verification` meta tag in the root layout or a DNS TXT record at the registrar, then submit the sitemap. Needs Oleg to open the GSC account; the code side is one line. |
| S-10 | **Get backlinks, because DA 3 is now the binding constraint** | High | Ongoing | 7 backlinks from 3 referring domains. The content problem is fixed; this one is not, and it is what decides whether the SD 15-30 terms are actually winnable. Cheapest real sources, in order: the YouTube descriptions (already pointing at oleg.ae, but a link from a 121k-view video description is worth asking whether it is `nofollow`), the GitHub repos (`social-media`, `tiktok-ai`, `x-ai`, `ads-ai` READMEs should link the guide page for each), the Skool community, and Boldane's own site. None of that needs outreach. |
| S-11 | **Rewrite `/claude-code-second-brain` for "claude code obsidian"** | Medium | 2 hours | 720 searches a month at **SD 14**, which is the same shape as the cluster pages that got built, and the page already exists and covers the topic. It just does not target the term and has no written guide yet. Highest ratio of value to effort left on the site. |

## Worth doing

| ID | Task | Impact | Effort | Notes |
| --- | --- | --- | --- | --- |
| U-02 | **Work out why `/claude-content` is not winning its cluster, then fix that page** | Medium | Half a day | Ubersuggest emitted 7 separate "create new content" rows for one topic. Do **not** build 7 pages: that is a doorway-page pattern and Google treats those morphological variants as one query anyway. `/claude-content` now carries a full written guide and 7 FAQ entries, so the thin-content half is done. What is left is diagnosis, and it is blocked on Search Console (`S-06`). |
| S-12 | **Real-device Core Web Vitals, on the deployed site** | Medium | 2 hours | `tests/e2e/perf-budget.spec.ts` (81-84) now enforces payload budgets against a local server, which catches regressions but is not a field measurement. Run PageSpeed Insights across the route list once this is deployed, record it in `audits/`, and fix whatever LCP or CLS says. Ubersuggest has a `pagespeed_audit` tool that wraps PSI if it is easier than the web UI. |
| S-16 | **Real screenshots on the guide pages** | Medium | Half a day | The rewritten guides are text, tables and callouts, with the YouTube facade thumbnail as the only image. Real screenshots of the dashboards being described (the reels concept table, the b2b lead scoring page, the content dashboard) would make them more credible and give the pages image-search surface. **Blocked on tooling, not on the idea**: YouTube now refuses video downloads to the installed `yt-dlp` (2026.03.03, over 90 days old, hits the SABR-only experiment and 403s). Updating yt-dlp should unblock it. Do NOT substitute generated images for this: the value is that the screenshots are real. |
| S-13 | **Refresh the prices** | Low | 20 min | Every price on the site now comes from `src/lib/pricing.ts`, read off the vendors' own pages on 2026-08-27. Anthropic changes plans, so this is a recurring chore rather than a task: re-read `claude.com/pricing` and `cursor.com/pricing`, update the one file, and bump `PRICING_CHECKED`. Unit tests catch a transcription slip; nothing catches a stale-but-consistent number. |

## Needs a decision from Oleg

| ID | Task | Impact | Effort | Notes |
| --- | --- | --- | --- | --- |
| S-14 | **Should the homepage link into the guide cluster?** | Medium | 15 min | Still Oleg's call and still unchanged: the homepage deliberately links to no resource pages so it ends on "cheers, oleg". It is now the only page on the site that does not feed the cluster, and it is the page with the most authority. Not proposing a wall of links, just one line. Needs his sign-off. |
| S-15 | **The 12 n8n videos, about 280,000 views, with no pages at all** | Medium | Varies | Half the live channel is the n8n era and none of it points at oleg.ae: those descriptions feed a separate funnel (`skool.com/n8nlab`, now dead, and `evolva.ai`). Building pages for them would re-capture real traffic, and it would also put n8n content on a site that now argues Oleg builds with Claude Code. That is a positioning call, not a bug fix. |
| S-09 | **Dead `skool.com/n8nlab` link in 7 YouTube descriptions** | High, off-site | 30 min | 404s. Linked from 7 videos totalling 169,284 views, including the "access the database" link on the 95k and 37k n8n videos. 127 comments asking where the template went. Not an oleg.ae SEO item strictly, but it is the single largest pool of wasted attention pointing at a dead end, and redirecting it at the site would be the cheapest traffic gain available. Needs YouTube Studio access, no API credentials in this environment. |

## Waiting on input

| ID | Task | Notes |
| --- | --- | --- |
| U-04 | **Triage Ubersuggest opportunities pages 2 and 3** | Only 10 of 24 rows have been reviewed. Screenshot the remaining two pages into `seo/ubersuggest/`. Lower priority than it was: the 2026-08-27 pass went at the keyword data directly through the MCP rather than through the Opportunities view, which is a better source. |
| G-02 | **Re-measure once indexed** | Re-run `domain_overview("oleg.ae")` in about 8 weeks. The baseline to beat is 0 organic keywords and 0 traffic on 2026-08-27. If it is still zero with the sitemap submitted, the problem is authority (`S-10`), not content. |

---

## Triage note for Ubersuggest items

Ubersuggest runs a generic checklist and does not know this codebase. Before adding one of its suggestions here, check it against these, because several of its standard findings are already handled or are deliberate:

- **"Missing canonical tags"** -> all 32 child layouts already have one. If the tool disagrees it is reading a snapshot before hydration.
- **"Thin content" on `/reels` and `/creators`** -> deliberate. Those pages are intentionally bare with an `sr-only` h1.
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
| S-01 | Open Graph images, every route | 2026-08-27. One build-time generator plus 31 route files. |
| S-02 | Honest `lastModified` in the sitemap | 2026-08-27. Real per-page dates, plus unit tests that diff the list against `src/app` both ways. |
| S-03 | Add `/sam-altman-ai` to the sitemap | 2026-08-24 |
| S-04 | Person and WebSite schema on the homepage | 2026-08-27 |
| S-05 | FAQPage schema from the troubleshooting data | 2026-08-27. Merged into each page's single FAQPage rather than a second block, and a test fails if the markup claims a question the page does not render. |
| S-07 | The five private-video pages | 2026-08-27. Consolidated into stronger siblings with 308s, rather than kept or deleted. |
| S-08 | A measured performance baseline | 2026-08-27. `perf-budget.spec.ts` (81-84). Dropping the unused Inter font took the homepage from 299 kB to 252 kB cold. |
| U-01 | The Claude Code hub, and 17 pages fighting over one term | 2026-08-27. `/claude-code-tutorial`, and it is the breadcrumb parent of the whole cluster. |
| G-01 | Validate the keyword map | 2026-08-27. Every cluster-page row in `keywords.md` now carries measured volume and difficulty. |
