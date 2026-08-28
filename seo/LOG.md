# SEO log

Append-only record of SEO work that actually shipped. Newest first. Dates and commits are from git history, not memory.

Format: `### YYYY-MM-DD  Title` then what changed, why, and the commit if there is one.

---

### 2026-08-28  The readable-pages pass: sentence case, visuals, and the player back in the fold

Driven by Oleg, not by a tool. Three asks that shared a root cause, plus one
finding that only turned up because of them. Full detail in CLAUDE.md.

**The video was disqualifying its own pages.** Google's video documentation is
explicit that a video "must not rely on user actions (such as swiping, clicking,
or typing) to load", and that a watch page is one where the video is the main
content. The site did both things wrong: a click-to-load facade, placed at the
foot of the page. So the fourteen pages that exist *because* of a video were
ineligible for a video result, and the credibility a six-figure view count buys
was invisible to anyone arriving from a search result. The facade is gone (a
real `<iframe loading="lazy">`, which is also a server component now, so the
pages ship less of their own JavaScript), and the player sits in a two-column
hero with the view count, runtime and publish date under it. The above-the-fold
`RepoCta` did not move: `hero-cta.spec.ts` now asserts document order rather
than a smaller `y`, since the two are level in the new layout.

Measured cost, stated plainly: about **1.1 MB of third-party bytes** on a page
with a player, against ~65 kB of the site's own payload. That is the price of
being eligible at all, and it is the reason the facade existed.

**VideoObject stopped guessing.** `uploadDate` had been the *page's* publish
date, which is a different date and simply wrong; `duration` and
`interactionStatistic` were missing entirely. All three now come from
`src/lib/videos.ts`, generated from YouTube by `scripts/build-video-meta.mjs`.
The chapters Oleg already writes into every description are emitted as `hasPart`
Clips with a `SeekToAction`, which is the requirement for Google's key-moments
treatment, and they render on the page as links into the exact second.

**The wall of text was a CSS bug, not a writing problem.** Every paragraph in
every written guide had `margin-top: 0` and `margin-bottom: 0`: Tailwind v4
emits `space-y-*` inside `:where()`, which has zero specificity, so
`.prose-guide p { margin: 0 }` won. The guides had been rendering as one
undifferentiated block since they shipped last week. Fixed with explicit rules
that carry specificity.

**The guides are now illustrated from the videos.** 32 stills in `public/guide/`,
each deep linked to the second it came from, plus new `Answer` / `Stats` /
`Checklist` / `Quote` primitives. `Answer` matters most for search: a section
headed "Is Claude Code free" now opens with the answer instead of three
sentences of context, which is the shape an answer engine can lift. Guarded by
`guide.spec.ts` 111 and 112.

**Sentence case, site-wide.** About 2,300 strings across 85 files. Beyond
legibility this is an entity-recognition fix: "claude code" appeared 184 times
in copy, reading as a common noun rather than a product. Test 110 fails any
lowercase-initial heading.

**Two versions per topic was considered and rejected.** Splitting each topic
into a YouTube page and a Google page splits link equity and reads as duplicate
content, and a referrer-based swap shows Google only the default. The difference
between the two intents is order, not content, and one hero serves both. If they
ever need measuring apart, `?from=yt` in the video descriptions and Plausible,
not a second URL.

Suite: 458 e2e passing, 87 unit passing, 0 failing.

### 2026-08-27  The standalone-guide rewrite, and a keyword map that matches reality

The big one. Full write-up in `2026-08-27-strategy.md`; the short version:

**The diagnosis.** `domain_overview("oleg.ae")` in Ubersuggest returns **0 organic keywords, 0
organic traffic, DA 3, 7 backlinks**, and twelve consecutive months of zero. The cause turned out
not to be thin content alone. Every resource page targeted a keyword with no search volume:
"claude code instagram", "claude code cold outreach", "claude code content creation" and
"claude code b2b outreach" all return **zero** monthly searches, and the whole cluster together is
under 300. Ranking first for all of them would still be roughly no traffic. YouTube demand is not
Google demand.

**Move 1: every page now answers its query without the video.** New `Guide` primitives
(`src/components/guide.tsx`, zero client JS) render the video's actual content as a readable
article under the existing setup accordion. 14 pages rewritten from the transcripts of the live
videos, pulled with `yt-dlp`: 2,400 to 4,000 visible words each, 9 to 12 h2s, 6 to 8 FAQ entries.
The above-the-fold `RepoCta` did not move, because 84% of traffic still arrives having watched the
video and wants the asset. Guarded by `tests/e2e/guide.spec.ts` (73-80).

**Move 2: five new pages, aimed at keywords that exist.** `/claude-cowork` (74,000/mo head term,
about 85,000 across the cluster), `/claude-cowork-pricing` (SD 15-23), `/claude-code-pricing`
(27,100/mo at SD 26), `/claude-code-tutorial` (the hub `U-01` asked for, and the parent every
guide now breadcrumbs to), `/claude-code-vs-cursor` (about 25,000/mo, most of it under SD 30).

**Move 3: five thin pages consolidated.** `/claude-outreach`, `/claude-trend-scanner`,
`/claude-interviewer`, `/claude-website` and `/claude-seo` are 308s into stronger siblings. Each
had a private or removed source video and a target keyword under 20 searches a month.

**Corrections found while writing.** The Cowork page was repeating a figure Oleg corrects on
camera (3,000 free Apify leads, not 5,000); Cowork shipped a built-in browser on 2026-08-26 which
makes the Chrome-extension setup in every existing tutorial obsolete; and three pages were still
embedding videos that have since gone private (`/ads-ai`, `/claude-code-second-brain`, and the
`FilmedPageOutro` on `/elon-musk-ai`), rendering YouTube's grey unavailable panel and claiming a
`VideoObject` that Google can check. All fixed.

**Structured data.** Schema moved to pure functions in `src/lib/seo/schema.ts` with unit tests.
Every guide page now emits Article, BreadcrumbList, one FAQPage and (where it is a how-to) HowTo.
The FAQPage merges the page's own questions with the exact troubleshooting entries it renders, so
those ten real long-tail queries are finally machine-readable, and `guide.spec.ts` test 76 fails if
the markup ever claims a question the page does not show. Homepage gained Person and WebSite
(`S-04`).

**Open Graph (`S-01`), closed.** Zero existed while every page declared `summary_large_image`. One
generator (`src/lib/seo/og.tsx`) plus 31 three-line route files, rendered at build time, so the
crawler gets a static PNG and no function ever runs.

**Sitemap (`S-02`), closed.** `lastModified: new Date()` on all 35 entries told Google every page
changed within the hour, every hour, so it discounted the field entirely. Now real per-page dates
from `src/lib/seo/sitemap-routes.ts`, with unit tests that diff the list against `src/app` in both
directions, which is the check that would have caught the `/sam-altman-ai` gap.

**Performance.** `Inter` was the largest font on the site (47 kB every cold visit) and rendered
almost nothing: `font-sans` appeared twice in the whole codebase, once being the `<body>` tag,
because every element specifies `font-display` or `font-body`. Removed. Fonts went 106 kB to 58 kB
and the homepage's cold weight 299 kB to 252 kB, with the visual snapshots unchanged. Budgets are
now enforced by `tests/e2e/perf-budget.spec.ts` (81-84) so this is measurable from here on.

**`/llms.txt`** added, and `robots.ts` documented as deliberately open to assistant crawlers, since
being useful inside ChatGPT is half the point of writing the guides out in full.


**Metadata lengths, site-wide.** 24 titles and 27 descriptions were long enough that Google
truncates them, which does not make a longer snippet, it makes one missing its tail. All rewritten
to fit (titles under 65 characters including the brand suffix, descriptions 70 to 165), and
enforced by `tests/e2e/metadata.spec.ts` (85-87), which also checks every canonical is
self-referential. `/reels` and `/creators` are excluded by name: they are Oleg's own tools and out
of scope by his instruction.

**Found by the code review, and fixed:**

- **`sameAs` named handles the site contradicted.** The schema listed `instagram.com/oleg_tech`
  while `connect-section.tsx` linked `instagram.com/melnikoff_oleg`. `sameAs` is precisely the
  field that tells Google which accounts are one person, so a disagreement there merges the entity
  with the wrong one. Resolved on evidence: `oleg_tech` appears in 20 of the 24 live video
  descriptions and `melnikoff_oleg` only in the four oldest, so the **visible link was the stale
  one** and is now updated, with Telegram added to `sameAs`.
- **The Cowork page's structured data told readers to install the Chrome extension** while the
  visible copy said the built-in browser makes that unnecessary. A rich result would have handed a
  searcher the obsolete setup. This was the only place in the pass where schema and copy disagreed.
- **A $200 Max price was on 16 pages and Anthropic does not publish it.** Their pricing page says
  only "from $100" with 5x and 20x tiers. The site now says exactly that and stops there, and the
  Cowork pricing FAQ no longer claims both tiers start at the same number.
- **`.prose-guide strong` asked for weight 600 from a face loaded at 400 and 500**, so every bold
  word in the new article body was a browser-synthesised fake bold. Space Grotesk now loads 700,
  which still fits inside the font budget because next/font ships one variable file per family.
- Two pages had reopened the price-drift `pricing.ts` exists to close (a dead import on one, six
  hardcoded figures on the other); both now read from the module. Plus a dead constant and a dead
  `GuideHeading` export removed, and `FixKey` narrowed from `string` to the literal key union, so a
  typo in a troubleshooting key is a compile error instead of a section that silently renders
  nothing.

**The visual content of the videos, extracted as text rather than screenshots.** The first attempt
at screenshots failed because YouTube refuses video downloads to the installed `yt-dlp` (2026.03.03,
which hits the SABR-only experiment and 403s). Running a current yt-dlp in a throwaway venv, leaving
the global install alone, unblocked it. Two things came out of actually looking at the frames:

- **The screenshots were the wrong deliverable.** What the frames contained was readable *text*:
  Oleg's two real config prompts for the reels system, the report's own definitions of the ICE axes
  and its top-scored tip in full, the audience segments with their real weights, and the "image
  notes" block the content system attaches to every post. All of that is now on the pages as
  copy-pasteable, indexable text, which beats a picture of a spreadsheet on every axis that matters.
  `/claude-reels` carries both configs verbatim with a copy button (one en dash changed to a comma),
  `/claude-social-growth` carries the real ICE definitions, the 1,000-scored tip and the 45/30/15/10
  segment split, and `/claude-content` carries both shapes of the image-notes block.
- **One frame must not be published, and the rule is worth writing down.** The lead-scoring frame in
  the B2B video is a spreadsheet of real prospects: named companies, logos, profile URLs. Oleg put it
  in his own video, but re-publishing a still of third-party personal data as a page asset is a
  different act with a different risk. **Do not screenshot anything containing a real lead list.**

Suite: 455 passing, 0 failing. Unit: 87 passing.

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
