# Keyword map

One primary keyword per page. The point of the map is that **no two pages compete for the same term**: when they do, Google splits the signal and ranks neither.

Status column:
- `assumed` = derived from the page's existing title metadata, never validated against real search data
- `validated` = confirmed against Ubersuggest or Search Console volume and difficulty
- `ranking` = confirmed to actually rank, with the position noted

Everything below is `assumed` as of 2026-08-24. The whole table needs a validation pass once Search Console is connected (`S-06`) and the Ubersuggest report is in. Titles were written from keyword research in May 2026 (commit `da56147`) but that research is not recorded anywhere, which is part of why this file now exists.

## Site-level targets

The three terms named in CLAUDE.md as the ongoing goal:

| Keyword | Owner page | Status |
| --- | --- | --- |
| AI systems for marketing | `/` (homepage) | assumed |
| Claude Code | no single owner, this is a head term the resource pages compete for collectively | assumed |
| Claude Code tutorial | **nobody, and 17 pages are fighting over it, see `U-01`** | assumed |
| Claude Code for marketing | `/claude-marketing` | assumed |

## Resource pages, the Claude Code cluster

These are the traffic core. Each targets "X with Claude Code" plus a modifier.

| Page | Primary keyword | Status |
| --- | --- | --- |
| `/claude-marketing` | Claude Code for marketing | assumed |
| `/claude-outreach` | Claude Code cold outreach | assumed |
| `/claude-b2b-outreach` | AI B2B outreach | assumed |
| `/claude-cowork-outreach` | Claude Cowork cold outreach | assumed |
| `/claude-reels` | AI Instagram Reels with Claude Code | assumed |
| `/claude-code-instagram` | Claude Code Instagram video editor | assumed |
| `/claude-tiktok` | AI TikTok content with Claude Code | assumed |
| `/claude-twitter` | X/Twitter content system with Claude Code | assumed |
| `/claude-social-growth` | AI social media growth with Claude Code | assumed |
| `/claude-content` | content creation system with Claude Code | assumed |
| `/claude-code-second-brain` | AI second brain with Claude Code and Obsidian | assumed |
| `/claude-code-ads` | make video ads with Claude Code | assumed |
| `/claude-seo` | AI SEO optimization with Claude Code | assumed |
| `/claude-website` | build a website with AI using Claude Code | assumed, **overlaps `/high-converting-website`, see `S-07`** |
| `/high-converting-website` | high-converting landing page with Claude Code | assumed, **overlaps `/claude-website`** |
| `/claude-interviewer` | AI interviewer for content | assumed |
| `/claude-trend-scanner` | AI trend scanner | assumed |

**Known conflict 1:** `/claude-website` and `/high-converting-website` both target building a site with Claude Code. Resolving `S-07` resolves this too.

**Known conflict 2, the big one:** **17 pages declare `Claude Code tutorial` in their keywords** and none owns it: every `claude-*` page above plus `/ideas`. The root layout's title claims "Claude Code Tutorials" site-wide while `src/app/` has no `/guides` or `/tutorials` hub for the term to land on. Backlog `U-01`. When it is fixed, each page in the table above should keep only its own specific term and drop the shared head term.

## Lead magnets and argument pages

| Page | Primary keyword | Status |
| --- | --- | --- |
| `/opus-5` | Opus 5 rules / Claude Opus 5 tips | assumed |
| `/5-levels-ai` | levels of AI adoption | assumed |
| `/60k-linkedin-post` | AI prompts for LinkedIn posts | assumed |
| `/ads-ai` | AI ads creator tool | assumed |
| `/marketing-brain` | ask marketing experts AI | assumed |
| `/marketing-brain-knowledge` | marketing books and talks knowledge base | assumed |

## Filmed pages, the "what X does with AI" cluster

These target person-plus-AI queries, which are high volume and news-driven. They are the pages most likely to already be ranking for something, and the first thing to check in Search Console.

| Page | Primary keyword | Status |
| --- | --- | --- |
| `/elon-musk-ai` | how Elon Musk uses AI | assumed |
| `/sam-altman-ai` | how Sam Altman uses AI | assumed, **and missing from the sitemap, see `S-03`** |
| `/boris-cherny-ai` | Boris Cherny Claude Code / creator of Claude Code | assumed |
| `/andrej-karpathy-ai` | how Andrej Karpathy uses AI | assumed |
| `/claude-code-sessions` | Claude Code sessions / windows talking | assumed |
| `/claude-riemann-hypothesis` | Claude Riemann hypothesis | assumed |

## Deliberately not targeting anything

`/viral-reels`, `/viral-reels-browse`, `/viral-reels-ideas`, `/viral-reels-creators`, `/reels`, `/ideas`. Tools and audience surfaces, intentionally bare. Do not write keyword copy onto them.
