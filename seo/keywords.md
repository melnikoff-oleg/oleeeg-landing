# Keyword map

One primary keyword per page. The point of the map is that **no two pages compete for the same
term**: when they do, Google splits the signal and ranks neither.

Status column:
- `validated` = volume and difficulty pulled from Ubersuggest (US, `locId` 2840) on the date shown
- `assumed` = derived from the page's title metadata, never checked against real data
- `ranking` = confirmed to actually rank, with the position noted

**Everything below marked `validated` was measured on 2026-08-27.** Volume is monthly US searches,
SD is Ubersuggest's search difficulty (0-100; under 30 is realistically winnable at DA 3).

Nothing is `ranking` yet, because the site ranks for nothing: `domain_overview` returns 0 organic
keywords. That is the number this map exists to move, and Search Console (`S-06`) is what will
tell us whether it did.

## The finding that reorganised this file

The old map targeted the video titles. Measured, those terms do not exist:

| Old target | Volume |
| --- | --- |
| claude code instagram | **0** |
| claude code cold outreach | **0** |
| claude code content creation | **0** |
| claude code tiktok | **0** |
| claude code b2b outreach | **0** |
| claude code linkedin | 10 |
| claude code seo | 10 |
| claude code ads | 50 |
| claude code marketing | 90 |
| claude code twitter | 110 |

So the map now separates two jobs. **Cluster pages** are aimed at demand that exists and are the
traffic engine. **Guide pages** keep their descriptive slugs, serve YouTube arrivals, and earn
long-tail traffic through depth rather than through a head term nobody types.

## Cluster pages: built for measured demand

| Page | Primary keyword | Volume | SD | Status |
| --- | --- | --- | --- | --- |
| `/claude-cowork` | claude cowork | 74,000 | 51 | validated |
| | what is claude cowork | 6,600 | 39 | validated |
| | how to use claude cowork | 1,900 | 43 | validated |
| | claude cowork use cases | 590 | 20 | validated |
| `/claude-cowork-pricing` | claude cowork pricing | 1,600 | **19** | validated |
| | is claude cowork free | 880 | **15** | validated |
| | claude cowork cost | 720 | **23** | validated |
| | claude cowork price | 480 | **16** | validated |
| `/claude-code-pricing` | claude code price / pricing | 27,100 | **26** | validated |
| | claude code prices | 22,200 | **25** | validated |
| | is claude code free | 3,600 | **29** | validated |
| | claude code max | 2,400 | **20** | validated |
| | how much does claude code cost | 1,600 | **12** | validated |
| `/claude-code-vs-cursor` | claude code vs cursor | 8,100 | 30 | validated |
| | cursor vs claude code | 6,600 | **28** | validated |
| | codex vs claude code | 6,600 | **23** | validated |
| | claude code vs codex | 3,600 | **14** | validated |
| | gemini cli vs claude code | 1,900 | **16** | validated |
| `/claude-code-tutorial` | claude code tutorial | 2,400 | **20** | validated |
| | what is claude code | 8,100 | 37 | validated |
| | how to use claude code | 6,600 | 49 | validated |

`U-01` is closed by that last row: `/claude-code-tutorial` is the hub, it is the breadcrumb parent
of every guide below, and the shared head term has been dropped from the pages that were all
declaring it.

## Guide pages: depth, long tail, and the YouTube arrival

These keep their slugs. Their job is to be the best page on the internet for their specific
system, and to convert the visitor who just watched the video. They earn search traffic through
the questions inside them (each carries 6 to 8 FAQ entries, in FAQPage markup) rather than through
a head term.

| Page | What it owns | Status |
| --- | --- | --- |
| `/claude-cowork-outreach` | claude cowork linkedin outreach, cowork apify | assumed, long tail |
| `/claude-b2b-outreach` | value-first b2b outreach with AI, lead scoring | assumed, long tail |
| `/claude-reels` | viral instagram reels research with AI | assumed, long tail |
| `/claude-code-instagram` | claude code video editing, reel studio | assumed, long tail |
| `/claude-tiktok` | viral tiktok research with AI | assumed, long tail |
| `/claude-twitter` | x/twitter content system with AI | assumed, long tail |
| `/claude-content` | ai social content generation with own photos | assumed, long tail |
| `/claude-marketing` | claude code marketing workspace | 90/mo, validated |
| `/claude-social-growth` | competitor video analysis, ICE scoring | assumed, long tail |
| `/claude-code-second-brain` | claude code obsidian | 720/mo, SD 14, validated |
| `/claude-code-ads` | ai video ads | assumed |
| `/high-converting-website` | high-converting landing page with claude code | assumed |
| `/ads-ai` | competitor meta ads analysis tool | assumed |

**`/claude-code-second-brain` is the one to look at next**: "claude code obsidian" is 720 a month
at SD 14, which is the same shape of opportunity as the cluster pages above, and the page has not
been rewritten to target it.

## Lead magnets and argument pages

| Page | Primary keyword | Status |
| --- | --- | --- |
| `/opus-5` | claude opus 5 rules / tips | assumed |
| `/5-levels-ai` | levels of AI adoption | assumed |
| `/60k-linkedin-post` | AI prompts for LinkedIn posts | assumed |
| `/marketing-brain` | ask marketing experts AI | assumed |
| `/marketing-brain-knowledge` | marketing books and talks knowledge base | assumed |

## Filmed pages

Person-plus-AI queries, news-driven, and the pages most likely to already be picking up
impressions. First thing to check once Search Console is connected.

| Page | Primary keyword | Status |
| --- | --- | --- |
| `/elon-musk-ai` | how Elon Musk uses AI | assumed |
| `/sam-altman-ai` | how Sam Altman uses AI | assumed |
| `/boris-cherny-ai` | Boris Cherny / creator of Claude Code | assumed |
| `/andrej-karpathy-ai` | how Andrej Karpathy uses AI | assumed |
| `/claude-code-sessions` | claude code sessions talking to each other | assumed |
| `/claude-riemann-hypothesis` | claude riemann hypothesis | assumed |

## Consolidated, 2026-08-27

Permanent redirects. Each had a private or removed source video and a target keyword under 20
searches a month, so it was splitting the site's signal rather than adding to it.

| Was | Now | Its old keyword's volume |
| --- | --- | --- |
| `/claude-outreach` | `/claude-b2b-outreach` | 0 |
| `/claude-trend-scanner` | `/claude-social-growth` | 0 |
| `/claude-interviewer` | `/claude-content` | 0 |
| `/claude-website` | `/high-converting-website` | see note |
| `/claude-seo` | `/claude-code-tutorial` | 10 |

Note on `/claude-website`: the bare term "claude code website" measures 4,400 at SD 20, but the
expansion is navigational (people looking for Claude Code's official site), and the only
commercial variant, "claude code website builder", is 110. Not worth a page, and
`/high-converting-website` covers the intent that is real.

## Deliberately not targeting anything

`/reels`, `/creators`, `/ideas`. Tools and audience surfaces, intentionally bare. Do not write
keyword copy onto them. `/reels` and `/creators` are also out of scope by Oleg's instruction.
