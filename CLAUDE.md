# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Is

This is the workspace for **Oleg Melnikov's personal landing page** — a one-pager website that quickly communicates who Oleg is to the public world: his story, expertise, what he offers, and how to connect.

**Repo:** `oleg-site` (github.com/melnikoff-oleg/oleg-site) — renamed 2026-07-06 from `oleeeg-landing` (GitHub, Vercel project, local folder, package name). No Inngest in this project, so the rename had no async-jobs implications.

**Oleg** is an AI software entrepreneur with 5 years in AI. Former big tech (Yandex, JetBrains) and hedge fund (Amsterdam). Now runs Boldane (boldane.com — premium personal branding that helps founders with real expertise become known and trusted; $2K/mo) and a growing YouTube channel (19K+ subs, AI for marketing tutorials). Core idea: bridging media and software so people with real stories become known. Not positioned as "an AI tool" or "fully automated"; AI is a capability under the hood, not the pitch.

**This file (CLAUDE.md) is the foundation.** It is automatically loaded at the start of every session. Keep it current — it is the single source of truth for how Claude should understand and operate within this workspace.

---

## The Claude-User Relationship

Claude operates as an **agent assistant** with access to the workspace folders, context files, commands, and outputs. The relationship is:

- **User**: Defines goals, provides context about their role/function, and directs work through commands
- **Claude**: Reads context, understands the user's objectives, executes commands, produces outputs, and maintains workspace consistency

Claude should always orient itself through `/prime` at session start, then act with full awareness of who the user is, what they're trying to achieve, and how this workspace supports that.

---

## Workspace Structure

```
.
├── CLAUDE.md              # This file — core context, always loaded
├── .claude/
│   └── commands/          # Slash commands Claude can execute
│       ├── prime.md       # /prime — session initialization
│       ├── create-plan.md  # /create-plan — create implementation plans
│       ├── implement.md   # /implement — execute plans
│       └── scrape-video.md # /scrape-video — YouTube URL → full MD file
├── context/               # Background context about the user and project
│                          # (User should populate with role, goals, strategies)
├── plans/                 # Implementation plans created by /create-plan
├── outputs/               # Work products and deliverables
├── reference/             # Templates, examples, reusable patterns
└── scripts/               # Automation scripts (if applicable)
```

**Key directories:**

| Directory    | Purpose                                                                             |
| ------------ | ----------------------------------------------------------------------------------- |
| `context/`   | Who the user is, their role, current priorities, strategies. Read by `/prime`.      |
| `plans/`     | Detailed implementation plans. Created by `/create-plan`, executed by `/implement`. |
| `outputs/`   | Deliverables, analyses, reports, and work products.                                 |
| `reference/` | Helpful docs, templates and patterns to assist in various workflows.                |
| `scripts/`   | Any automation or tooling scripts.                                                  |

---

## Commands

### /prime

**Purpose:** Initialize a new session with full context awareness.

Run this at the start of every session. Claude will:

1. Read CLAUDE.md and context files
2. Summarize understanding of the user, workspace, and goals
3. Confirm readiness to assist

### /create-plan [request]

**Purpose:** Create a detailed implementation plan before making changes.

Use when adding new functionality, commands, scripts, or making structural changes. Produces a thorough plan document in `plans/` that captures context, rationale, and step-by-step tasks.

Example: `/create-plan add a competitor analysis command`

### /implement [plan-path]

**Purpose:** Execute a plan created by /create-plan.

Reads the plan, executes each step in order, validates the work, and updates the plan status.

Example: `/implement plans/2026-01-28-competitor-analysis-command.md`

### /scrape-video [youtube-url]

**Purpose:** Scrape a YouTube video's metadata and transcript, then save as a clean markdown file.

Uses two Apify actors in parallel:
- `pintostudio/youtube-transcript-scraper` — full transcript
- `streamers/youtube-scraper` — title, views, likes, duration, description, etc.

Produces a single MD file in `outputs/video-{slug}.md` with metadata table, description, timestamps, links, and cleaned transcript.

Requires `APIFY_KEY` in `.env`.

Example: `/scrape-video https://youtu.be/JQQhT0edXXw`

---

## Critical Instruction: Maintain This File

**Whenever Claude makes changes to the workspace, Claude MUST consider whether CLAUDE.md needs updating.**

After any change — adding commands, scripts, workflows, or modifying structure — ask:

1. Does this change add new functionality users need to know about?
2. Does it modify the workspace structure documented above?
3. Should a new command be listed?
4. Does context/ need new files to capture this?

If yes to any, update the relevant sections. This file must always reflect the current state of the workspace so future sessions have accurate context.

**Examples of changes requiring CLAUDE.md updates:**

- Adding a new slash command → add to Commands section
- Creating a new output type → document in Workspace Structure or create a section
- Adding a script → document its purpose and usage
- Changing workflow patterns → update relevant documentation

---

## Landing Page Goals

This site should convey:

- **Who Oleg is** -- AI software entrepreneur, 5 years in AI, big tech + hedge fund background, math olympiad winner
- **The arc** -- Built AI in big tech and as an entrepreneur; now focused on AI systems for marketing
- **What he offers** -- Boldane (premium personal branding for founders with real expertise), YouTube (AI for marketing tutorials), Skool community
- **Social proof** -- 2.5M+ client views, Mike Kamo, $60K generated by a client in the first 30 days, 19K YouTube subs, 650K+ YouTube views, math/CS credentials
- **How to connect** -- YouTube (@Oleg-Melnikov), LinkedIn (/olegane), Instagram, Telegram (t.me/melnikoff_oleg), email (oleg@boldane.com), boldane.com

Key references in the main repo (`/Users/olegmelnikov/Desktop/Software Projects/oleeeg`) contain deeper context if needed.

---

## SEO

Ongoing goal: optimize the site for search around keywords like **"AI systems for marketing"**, **"Claude Code"**, **"Claude Code for marketing"**.

**Done:**
- Sitemap (`src/app/sitemap.ts`) + robots.txt (`src/app/robots.ts`)
- Keyword-rich meta tags (title, description, keywords, OG, Twitter cards) on all pages
- Proper heading hierarchy (`h1` → `h2`) across all sections
- Plausible analytics (`src/components/plausible.tsx`, domain: oleg.ae, `outboundLinks: true` since 2026-07-06 so clicks to boldane.com/GitHub/Calendly are measurable; the event is "Outbound Link: Click" — add it as a goal in the Plausible dashboard to see it there. Stats API queryable with the key in the boldane-site repo's `.env`)

**Still to do:**
- Open Graph images (branded preview for social shares)
- Structured data / JSON-LD (Person schema)
- Internal linking (resource pages are interlinked via `ResourceFooter`, which now leads with the `NextUp` ranked picks and keeps the full link list in a collapsed `see all free resources` disclosure so every internal link stays crawlable; the homepage deliberately links to NO resource pages since 2026-07-09 — Oleg wants it to end on "cheers, oleg" — so any homepage → resource linking would need a different, subtle form if ever revisited)
- Performance audit (Lighthouse, image optimization)
- More content pages (each YouTube video = a potential resource page targeting keywords)
- Google Search Console verification (blocked for now, revisit later)

---

## Session Workflow

1. **Start**: Run `/prime` to load context
2. **Work**: Use commands or direct Claude with tasks
3. **Plan changes**: Use `/create-plan` before significant additions
4. **Execute**: Use `/implement` to execute plans
5. **Maintain**: Claude updates CLAUDE.md and context/ as the workspace evolves

---

## Tech Stack

- **Framework:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 (tokens in `@theme inline` inside `globals.css`, no `tailwind.config`)
- **UI primitives:** `src/components/ui/{button,card}.tsx` (`class-variance-authority` + `@radix-ui/react-slot`, merged via `cn()` in `src/lib/utils.ts`)
- **Animations:** CSS keyframes + IntersectionObserver via the `Reveal` primitives (`src/components/motion/reveal.tsx`: `Reveal` / `RevealGroup`, keyframes in `globals.css`). These replaced Framer Motion for the marketing surface (homepage + all resource pages) so those routes ship **no animation-runtime JS** (each resource page dropped ~47 kB First Load JS; homepage 165→124 kB). `TextEffect` / `AnimatedGroup` are CSS reimplementations keeping their old DOM + API. Framer Motion still powers the `/marketing-brain` chat only (context-drawer, chat-message) and a few not-yet-migrated pages (ads-ai, high-converting-website, 60k-linkedin-post, 5-levels-ai, marketing-brain-knowledge). Reveals honor `prefers-reduced-motion` (show immediately). Real wheel/touch scroll triggers them; programmatic scrolls must be instant (the site sets `scroll-behavior: smooth`), see `settle()` in `tests/e2e/visual.spec.ts`.
- **Tests:** Playwright (`@playwright/test` + `@axe-core/playwright`), see Testing below
- **Deployment target:** Vercel

### Design System (Boldane-aligned)

The site shares boldane.com's visual identity (premium dark navy). Source of truth: `src/app/globals.css`.

- **Colors (tokens):** `navy` `#020b18` (page bg), `navy-raised` `#07142a`, `vivid-blue` `#2863f0` (accent/CTA), `silver` `#d0d6e0` (primary text), `silver-muted` `#8a93a3` (secondary text), `hairline` `rgba(208,214,224,0.1)` (all borders/dividers). Use these tokens, never `zinc-*` / `bg-white/*` / pure black.
- **Fonts (`next/font/google`):** Inter (`font-sans`, default), DM Sans (`font-display`, headings), Space Grotesk (`font-body`, body). Loaded in `src/app/layout.tsx`.
- **Signature classes:** `.text-metallic` / `.brand-wordmark` (metallic gradient headings + wordmark), `.surface-card` (gradient + hairline card), `.surface-raised`, `.bg-dotgrid`, `.glow-blue`, `.eyebrow` (uppercase `tracking-[0.2em]`, paired with `text-vivid-blue/80`).
- **Buttons:** use the `Button` primitive (variants `primary` / `outline` / `ghost`; sizes `sm` / `md` / `lg`), all pill-shaped (`rounded-full`).
- When building new pages/components, reuse these tokens and primitives so the brand stays consistent.

### Mobile-First (MANDATORY for every page)

**Every page and component must be fully usable and beautiful on a 390px phone. This is not optional and is not a follow-up pass: design and build mobile-first, then enhance for wider screens.** Mobile is the primary viewport (most traffic is phones); a layout that only works on desktop is unfinished.

Rules:
- **Never ship horizontal scrolling of content.** The page body must never scroll sideways at 390px. If something is wider than the viewport, it is a bug, not a scroll affordance.
- **No fixed-min-width layout inside `overflow-x-auto` as the mobile answer.** A wide table/grid in an `overflow-x` box does NOT clip gracefully: on a phone it hides the off-screen columns entirely (this is exactly what broke `/5-levels-ai`). Instead, below the breakpoint, **swap wide multi-column layouts for a stacked / card layout** driven by the same data (render both from one data source; `hidden lg:block` desktop + `lg:hidden` mobile). See `/5-levels-ai` (`src/app/5-levels-ai/page.tsx`) for the reference pattern: a comparison table at `lg`+, a rung-card stack below `lg`.
- **Pick the swap breakpoint from the content width, not by habit.** A `min-w-[52rem]` (832px) table needs ~880px to fit, so swap at `lg` (1024px), not `md` (768px), or scroll returns on tablets.
- **Long unbreakable strings** (commands, URLs, emails) get `[overflow-wrap:anywhere]` or wrap, so they never push past the viewport edge; keep numbers/labels that must stay on one line as `whitespace-nowrap` in a `shrink-0` slot next to a `min-w-0` sibling.
- **Verify before shipping** at 390px: run the Playwright `mobile` project (390px viewport) and eyeball a real mobile screenshot (see the [mobile screenshot verification] memory: headless `--screenshot` lies for mobile; use CDP device-metrics or Playwright's mobile project). Add a mobile assertion/snapshot for any new page with non-trivial layout, following `tests/e2e/mobile-ladder.spec.ts`.
- **Touch + readability:** tap targets ~44px, body text stays legible (don't shrink below the site's `text-sm` for primary copy), respect safe gutters (`px-6`).

### Dev Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run test         # Playwright suite (builds + starts, then runs the full e2e suite)
npm run test:update  # Regenerate visual-regression baselines
```

### Testing

`tests/` holds a Playwright suite (`tests/playwright.config.ts`, specs in `tests/e2e/`) run against a production build on desktop + a Chromium iPhone-sized viewport (~140 test instances across both projects). Angles:
- Route health (1-6), design-token/brand fidelity (7-11), visual-regression snapshots desktop + mobile (12-15, 28), interactions (16-18), a11y + no-em-dash content rules (19-20).
- `/5-levels-ai` mobile ladder (`mobile-ladder.spec.ts`, 21-27: below `lg` the wide comparison table is swapped for a rail-threaded rung-card stack so no field is clipped on a phone; at `lg`+ the original table is preserved).
- Site-wide mobile refinement (`mobile-audit.spec.ts`, 29-39): ≥44px tap targets, ≥16px primary copy, no eager YouTube iframe (`YouTubeEmbed` facade present + click-to-load), no-horizontal-overflow on every route.
- Hero CTA (`hero-cta.spec.ts`, 40-44): the three repo pages + two non-repo download pages render an above-the-fold primary CTA that sits before the video facade.
- `/opus-5` (`opus-5.spec.ts`, 52-58): all five rule sections and their anchors, a sample of the sourced numbers, every source link external + `rel=noopener` (scoped by `data-testid="source-link"`), the rail's five anchors, the no-em-dash copy rule, plus mobile-only checks that the benchmark table is swapped for the 9-card stack and that the hero toy stays inside the 390px viewport with rule prose at ≥16px.
- NextUp "up next" recommendations (`next-up.spec.ts`, 45-51): one hero + 1-2 ranked secondary picks, all internal and never self-recommending, hero visually dominant and first, the full library collapsed behind the `see all free resources` disclosure, plus mobile ≥44px tap targets / ≥16px hero copy / no 390px overflow. Robust to `recommendations.json` regeneration (scoped to the grid container, not specific pick names).
- **Backend + coverage (code-review-hardening):** `mobile-overflow.spec.ts` (390px no-horizontal-scroll on EVERY route, skipping intentional `overflow-x` scrollers); `api-chat.spec.ts` / `api-memory.spec.ts` (deterministic, key-free validation branches — bad body, empty, missing/invalid/private-host url, size cap — use a raw `Buffer` for malformed-JSON bodies since Playwright re-serializes string `data` under a JSON content-type); `retriever.spec.ts` (pure unit test of the BM25 invariants: PER_SOURCE cap, RESERVE_VIDEOS floor, identity folding — runs from repo root, retriever reads `chunks.json` via `process.cwd()`); `brain-chat.spec.ts` (drives the chat with a **stubbed** NDJSON stream via `page.route`: source cards, streamed text, `max_tokens`→continue / dropped-stream→try-again banners, fully offline).

Route list is a single source of truth: `tests/e2e/routes.ts` (`ROUTES` / `FOOTER_ROUTES`), imported by `routes.spec` + `design-tokens.spec` + `mobile-overflow.spec` + `mobile-audit.spec` so a new page can't be silently absent from half the suite — add new routes there. (`mobile-audit.spec` kept its own hand-copied route list until 2026-07-25, when it had already drifted; it now imports `ROUTES` too.) Config is `PORT`-configurable (default 3000) so a server another git worktree holds on :3000 can't make the suite silently test a stale build (`PORT=3100 npm run test`). Requires `@playwright/test` **≥ 1.61.1** (1.61.0's transform hook throws `context.conditions?.includes` on any relative test import under Node 22). Snapshot baselines live under `tests/e2e/visual.spec.ts-snapshots/` and are committed; regenerate with `npm run test:update` after intentional visual changes. Tests have their own `tests/tsconfig.json` (node resolution) and are excluded from the app `tsconfig.json`.

### Site Structure

**Main page** (`/`) — single page with 6 sections:
1. **Hero** — Tagline, photo, CTAs (`src/components/hero-section.tsx`)
2. **About** — What Oleg does now (`src/components/about-section.tsx`)
3. **Results** — Stats, client proof, credentials (`src/components/results-section.tsx`)
4. **Video** — Looping 5s muted preview, blur + "watch on youtube" on hover (`src/components/video-section.tsx`)
5. **Connect** — Social links + footer (`src/components/connect-section.tsx`)
6. **Header** — Floating nav, blurs on scroll (`src/components/header.tsx`)

**Resource pages** — YouTube video companion pages with setup guides:
- `/claude-outreach` — Claude Code for cold outreach
- `/claude-twitter` — X/Twitter content machine
- `/claude-tiktok` — Viral TikTok videos
- `/claude-website` — Build personal website
- `/claude-social-growth` — Viral social media growth
- `/claude-trend-scanner` — Trend scanner for 10x more views
- `/claude-b2b-outreach` — B2B outreach (35% reply rate)
- `/claude-seo` — SEO optimization
- `/claude-cowork-outreach` — Claude Cowork for cold outreach
- `/claude-marketing` — Marketing (SMM, ads, outreach)
- `/claude-reels` — Viral Instagram Reels
- `/claude-content` — Content creation in 10 minutes
- `/claude-interviewer` — AI voice interviewer for content creation

**Tool pages** — free open-source tool lead magnets (GitHub download + setup guide):
- `/ads-ai` — AI ads creator (study competitors' Meta ads, generate ad concepts)
- `/high-converting-website` — kit that builds a high-converting landing page with Claude Code, deployed to a live domain. Carries a distilled conversion playbook (Hormozi + top marketers, the value equation) so the page sells, not just looks nice. Repo: `melnikoff-oleg/high-converting-website`. Proof: Oleg built boldane.com with it and closed a B2B deal. YouTube walkthrough ("How I Built a High-Converting Landing Using Claude Code") to be added later (see the commented placeholder in `page.tsx`; `ArticleJsonLd` now takes optional `videoId`/`videoTitle`).

**Lead magnet pages** — prompt-based giveaways (no code setup, just copy-paste prompts):
- `/60k-linkedin-post` — 3 AI prompts for LinkedIn content that sells ($60K client case study)
- `/opus-5` — "Opus 5, no hype: 5 rules nobody is talking about" (added 2026-07-25). A long-form, data-dense argument page ported from a Claude artifact into the navy design system: 5 sourced rules (effort levels, deleting verification from prompts, skipping Fable 5, model-per-task, the security numbers) plus a release-to-release closer, every claim linked to Anthropic's own charts and docs. Structure is bespoke, NOT `ResourcePageShell`: sticky `RuleRail` scroll-spy (`rule-rail.tsx`), a draggable CSS-3D `VoxelClawd` hero toy (`voxel-clawd.tsx`), then five rule sections each with a "do this" card, figures and a sourced notes block. Mobile-first per the mandate: the 3-column benchmark table swaps to a card stack below `md` (never a sideways scroller), the use-case chart drops its bar + model chip onto full-width rows below `sm`, and the Frontier-Bench chart opens full size on tap since its axis labels are unreadable at 390px. The two client leaves are the rail and the toy; the toy pauses its rAF loop off-screen or on a hidden tab, honors `prefers-reduced-motion`, uses `touch-action: pan-y` so a vertical swipe still scrolls, and scales to its container so it can never poke past the viewport.

**Marketing Brain pages** — the `marketing-brain/` knowledge base, surfaced on the site:
- `/marketing-brain-knowledge` — static gallery of the whole corpus (8 books + 75 talks, grouped by expert). Data is generated from `marketing-brain/manifest.json` into `src/app/marketing-brain-knowledge/data.ts`. Book covers are served from `public/marketing-brain/book-covers/`.
- `/marketing-brain` — **AI chat** (RAG), branded **"$1B Marketing Brain"**: ask a marketing question, get a streamed, cited answer with visual source cards (book cover + page, or video thumbnail/embed + timecode). This is the visual twin of `marketing-brain/scripts/query.py`. The hero/empty state is deliberately minimal (Jobs-style: title, faces, starter prompts, input, personalize link, nothing else). It shows an **expert portrait strip** (`src/app/marketing-brain/components/expert-strip.tsx`) of the four faces behind the corpus (Hormozi, Brunson, Cialdini, Godin) so visitors instantly grasp whose minds power the answers; portraits are bright color (they appear in a YouTube thumbnail), square face-centered webp crops in `public/marketing-brain/experts/`, unified by a rounded frame + ring + soft drop shadow, with color/lift on hover. Keep visible body text lean (target under ~300 chars).

The two pages are cross-linked (chat header → "browse the sources"; knowledge header + footer → "ask the brain"). The chat (`/marketing-brain`) is also listed in `ResourceFooter`, so it appears in the "more free resources" grid on every resource/tool/lead-magnet page; the knowledge gallery renders the `ResourceFooter` too, linking it to the rest of the site.

Resource pages follow a shared pattern: minimal header, hero (repo-backed pages carry a `RepoCta` here; the two non-repo app-download pages carry a download-variant `RepoCta`, see below), accordion setup steps (first step open by default via `defaultOpen={0}`), a `YouTubeEmbed` **facade** lower on the page, cross-linked resource footer. The 13 `claude-*` pages render this pattern through the shared **`ResourcePageShell`** (see the Code-review hardening section) — each is just a data object; only the bespoke tool pages hand-inline it. Tool pages follow the same pattern but replace the video embed with a GitHub download CTA and "how it works" overview. Lead magnet pages have their own structure: prompts with copy buttons, how-it-works overview, and client proof. Each lives in `src/app/{slug}/page.tsx` with its own `layout.tsx` for metadata. **The video is deliberately NOT the hero** even though the pattern once put it first: these are near-100% YouTube entry pages, so the visitor already watched it (see `RepoCta` above; grounded in Plausible entry-page + referrer analysis).

**Mobile refinement pass (2026-07-23, branch `mobile-optimization`):** site-wide mobile-friendliness lift grounded in the Plausible traffic profile. Primary reading copy is >=16px (`text-base`) everywhere; interactive tap targets are >=44px (header hamburger `size-11`, chat send `size-11`, starter chips, copy buttons, knowledge sticky-nav chips + an always-visible "ask" CTA); section eyebrows went `text-vivid-blue/80 text-xs` -> `text-vivid-blue text-[13px]` for AA contrast; mobile section padding `py-24` -> `py-16`; the shared `Accordion` body copy is `text-silver` (was the borderline `text-silver-muted`). Every resource page's eager YouTube iframe became a `YouTubeEmbed` facade (see above). Verified by `tests/e2e/mobile-audit.spec.ts`.

**Boldane soft CTAs (2026-07-06):** 7 resource pages carry a `BoldaneCta` card (shared component `src/components/boldane-cta.tsx`, extracted from the `/60k-linkedin-post` inline pattern) placed after the video section, before the `ResourceFooter`. Two angles, chosen by page relevance from Plausible traffic analysis: **DIY-vs-done-for-you** on the content pages (`claude-interviewer`, `claude-content`, `claude-twitter`, `claude-social-growth`) and **profile-authority** ("prospects check your LinkedIn before replying") on the outreach pages (`claude-cowork-outreach`, `claude-b2b-outreach`, `claude-outreach`). Deliberately NOT on `/claude-reels`, `/claude-tiktok`, `/ads-ai`, `/claude-seo`, `/claude-trend-scanner`, `/marketing-brain` — wrong audience intent for a done-for-you LinkedIn service; a hard plug there would read as an ad. Copy follows Boldane's rules: no em dashes, never imply ghostwriting ("what you said", not "in your voice" / "in your own words" / "sound like you"), service voice ("a real team", "done for you"). `/60k-linkedin-post` keeps its own inline version. (The homepage previously carried a `ConsultCta` for a paid ~$300 1:1 consult via calendly.com/boldane/ai-consult; removed 2026-07-09, component deleted.)

**Boldane presence policy (de-repetition pass 2026-07-06 — PERMANENT RULE):** **one deliberate Boldane pitch per page, never two.** Organic proof (the Mike Kamo results card) and navigation (connect icon) don't count; pitches do. Repetition reads as insecure, not premium. Concretely: the `ResourceFooter` credit line ("free guides by oleg, founder of Boldane") is behind an opt-in `boldaneCredit` prop, ON only for the 8 pages with no other Boldane mention (claude-reels, claude-tiktok, ads-ai, claude-seo, claude-trend-scanner, claude-website, marketing-brain-knowledge, opus-5) and OFF everywhere else (homepage, the 7 `BoldaneCta` pages, 60k-linkedin-post, high-converting-website). `/marketing-brain` (the chat) renders no ResourceFooter, so it has no Boldane presence at all. The homepage about-section was also de-duplicated against the hero: paragraph order is now media/software thesis first, then "boldane is that idea as a company" (the hero keeps the only "i run boldane"), and the YouTube subscriber count is said once in prose (hero only; 19K+ as of 2026-07-09). When adding a new page: give it either one `BoldaneCta` (content-from-expertise or outreach topics) or `boldaneCredit` (everything else), never both.

**Backend (the site is no longer fully static).** The `/marketing-brain` chat is powered by a serverless Route Handler at `src/app/api/marketing-brain/chat/route.ts`:
- **Retrieval:** TypeScript BM25 (`src/lib/marketing-brain/retriever.ts`) over `src/app/marketing-brain/_data/chunks.json`. Ranking model (keep `query.py` in parity): (1) each chunk's identity (book title+author / video title+expert) is folded into the indexed tokens so a source is matchable by name; (2) the final score is **normalized relevance + a quality prior** (`BM25/maxBM25 + BETA*qualityPrior`, BETA 0.35), NOT a flat multiplier — a multiplier let weakly-matching books hijack video-native topics (e.g. a MrBeast-thumbnails question). Every source has a value score in `src/lib/marketing-brain/quality-scores.json` (books 8-10 by authority; videos 2-7 by view count + depth, each rated individually) generated by `marketing-brain/scripts/build-quality-scores.py`; books get a strong prior (0.90-1.00) so they lead timeless/principle topics, videos a smaller view-graded prior (0.00-0.40). (3) results are capped at `PER_SOURCE` (2) chunks per book/video, and (4) at least `RESERVE_VIDEOS` (2) videos are guaranteed so the best clips are never fully buried. This model was reverse-engineered from 20 diverse scenarios with ideal-mix expectations (`marketing-brain/scripts/sim-ranking-policies.py`): it scored 19/20 vs ~14/20 for the best multiplicative variant. `chunks.json` is a server-only corpus generated by `marketing-brain/scripts/build-web-index.py` (faithful port of `query.py`; rerun after any KB change, after `build-kb.py`). `chunks.json` contains full book text, so it is **server-only** (never under `public/`) and the repo is private; `next.config.ts` adds it to `outputFileTracingIncludes` so it ships with the function on Vercel.
- **Synthesis:** Claude (`@anthropic-ai/sdk`, model `claude-sonnet-4-6`) streams a cited answer; the route emits sources first, then text deltas, then a final `done` frame carrying the Anthropic `stop_reason` (NDJSON: `sources | delta | error | done`). Requires **`ANTHROPIC_API_KEY`** in `.env` locally and in Vercel env vars.
- **Incomplete-answer UX:** the `done` frame lets the client tell apart a clean finish, a length-cap cutoff, and a dropped/timed-out stream (no `done` frame ever arrives). On length-cap (`done` reason `max_tokens`) the message shows an amber banner with a **continue** button that extends the same answer in place; on a dropped stream it shows a red banner with a **try again** button that re-answers. `max_tokens` is 8000 and `maxDuration` is 60s to make real cutoffs rare. Logic lives in `use-brain-chat.ts` (`send`/`retry`/`continueLast`) and `components/chat-message.tsx`.
- **Abuse protection:** in-memory per-IP daily cap of 30 (`src/lib/marketing-brain/rate-limit.ts`); on limit the UI shows a "reach out on LinkedIn (linkedin.com/in/olegane)" notice. Approximate (per-instance); upgrade to Vercel KV / Upstash for a hard cap if needed.
- **Copyright:** answers quote sources only briefly (~25 words, attributed); full chunk text never reaches the client.
- **Business-context memory (personalization):** the chat can be taught about the user's business so its advice is personalized. A markdown file `business-context.md` holds it. Storage: locally it sits at the repo root (`marketing-brain-memory/`, gitignored); on Vercel `process.cwd()` (`/var/task`) is read-only, so `src/lib/marketing-brain/memory.ts` bases the dir on `os.tmpdir()` (`/tmp`) when `process.env.VERCEL` is set. Vercel `/tmp` is per-instance and ephemeral (intentional for this MVP; a durable store, Vercel KV / Blob, is the later upgrade). **Because of that, the chat does not rely on the server file in production:** the client sends its loaded "your context" text with each `/api/marketing-brain/chat` request (`businessContext` in the body), and the route prefers it (capped at `MAX_CONTEXT_CHARS`), falling back to the server file only for local dev. This makes personalization work regardless of Vercel's ephemeral fs, and is also correct for multiple visitors (each browser uses its own context). Managed via the "your context" drawer on `/marketing-brain`: paste/edit text, upload files (PDF via `unpdf`, txt/md), or scrape a website (Firecrawl `/v1/scrape` → distilled with `claude-sonnet-4-6`). Routes: `src/app/api/marketing-brain/memory/{route,scrape,upload,extract}`. Auto-capture: after each turn, `memory/extract` (Sonnet 4.6) appends durable business facts the user mentions, with an undo toast + a persisted toggle. Requires `FIRECRAWL_API_KEY` (already in `.env`). Helpers: `src/lib/marketing-brain/{memory,firecrawl,distill}.ts`. Integration tests: with the server running, `node scripts/test-marketing-brain-memory.mjs` (snapshots + restores the real memory; exercises scrape/upload/chat/extract; 18 assertions).

**Shared components:**
- UI primitives in `src/components/ui/` (`Button`, `Card`) — see Design System above
- Animation primitives in `src/components/motion/` (TextEffect, AnimatedGroup)
- `src/components/accordion.tsx` — Reusable accordion for setup steps (used by resource pages)
- `src/components/resources-data.ts` — the single source of truth for the free-resource pool: `RESOURCES` (slug + title + description + `lucide-react` icon) and `RESOURCE_BY_SLUG`. Shared by `ResourceFooter` and `NextUp`. **When adding a new resource page, add it here** (and regenerate recommendations, below).
- `src/components/next-up.tsx` — `NextUp`, the "up next" recommendation surface that replaces the old wall of ~18 equal links as the FIRST thing a visitor sees after grabbing a resource. YouTube-style hierarchy: one prominent **hero** pick (largest, on top, with the blue glow), then 1-2 ranked **secondary** cards, framed by a "keep going / a couple more, picked for you" title (neutral so it reads true on the non-video footer pages too). Picks come from `src/lib/recommendations.json` (precomputed, see the build script), so runtime does ZERO LLM/analytics calls; returns null when a slug has no picks. Motivation: Plausible showed 1.48 pages/visit, so each page was a dead end; this hands visitors 2-3 relevant, popular, quality next steps. Covered by `tests/e2e/next-up.spec.ts` (45-51).
- `scripts/build-recommendations.mjs` — build-time generator for `src/lib/recommendations.json`. Pulls per-page popularity (unique visitors, 90d) from Plausible (`PLAUSIBLE_*` in `.env`, `site_id = oleg.ae`), reads each resource's topic from `resources-data.ts`, then asks Claude **once** (`claude-sonnet-4-6`, `ANTHROPIC_API_KEY`) to pick + rank the best 3 next pages per page, balancing relevance + popularity + quality (a small quality boost list for `marketing-brain` / `high-converting-website` / `5-levels-ai`). Output is validated (known slugs only, exactly 3, never self, popularity-backfilled). **Regenerate after adding/removing a resource page or to refresh popularity:** `node scripts/build-recommendations.mjs`.
- `src/components/resource-footer.tsx` — Cross-linked footer rendered on every resource/tool/lead-magnet page and the Marketing Brain knowledge gallery. NOT on the homepage (removed 2026-07-09: "more free resources" read wrong there and Oleg wants the page to end on the connect section's "cheers, oleg"; the homepage has no footer/copyright line at all). It now leads with `<NextUp>` (the ranked picks) and collapses the FULL library behind a `see all free resources` `<details>` disclosure (`data-testid="see-all-resources"`), so it is no longer a flat wall of equal links but every internal link stays in the HTML for SEO/crawlers. Imports the pool from `resources-data.ts`. Takes an opt-in `boldaneCredit` prop for the "founder of Boldane" credit line — see the Boldane presence policy above for which pages get it.
- `src/components/boldane-cta.tsx` — `BoldaneCta` (soft-CTA card, copy passed as children) + `BoldaneLink` (styled boldane.com link). Used on 7 resource pages (see "Boldane soft CTAs" above); when adding a new resource page, decide whether a Boldane plug is relevant (content-from-expertise or outreach topics: yes; virality/ads/SEO topics: no).
- `src/components/youtube-embed.tsx` — `YouTubeEmbed` click-to-load YouTube **facade** (poster + play button; swaps in the real iframe only on tap). Used on every resource/tool page instead of an eager iframe (which pulled ~0.5-1MB of player JS on load). Poster is ytimg `hqdefault` (maxres 404s for many videos); degrades to a clean play tile if the poster 404s (private/removed video). When adding a resource page, use `<YouTubeEmbed videoId={VIDEO_ID} title="..." />`, never a raw `<iframe>`.
- `src/components/repo-cta.tsx` — `RepoCta`, the single above-the-fold primary CTA for resource pages. Default is a "get it on github" button with the GitHub icon (repo-backed pages: claude-reels, claude-tiktok, ads-ai). It also takes an optional `icon` prop (export `DOWNLOAD_ICON` for a tray-arrow) + `label`, so **non-repo pages that hand over an app** use the same component: `/claude-cowork-outreach` ("download claude cowork" -> claude.ai/download; #2 page by volume, 79% bounce) and `/claude-social-growth` ("get claude code" -> claude.ai/download; previously converted 232 visitors at 0.4% with no hero action). Rationale: resource pages are near-100% YouTube *entry* pages (Plausible: /claude-reels 96% entry, cowork-outreach 95%), so the visitor already watched the video; the fold's job is to hand them the thing they clicked through for, not re-show the demo. That is also why the video stays LOW on the page (as a facade), not hero. This reconciled the earlier `analytics-ux`/`HeroActions` experiment: `RepoCta` is the one hero-CTA component, so a page never gets two. Covered by `tests/e2e/hero-cta.spec.ts`.

---

## Code-review hardening (branch `code-review-hardening`, 2026-07-23)

A full-codebase review pass. Key permanent changes beyond the animation swap (Tech Stack) and test additions (Testing):

- **`ResourcePageShell` (`src/components/resource-page-shell.tsx`)** — the 13 `claude-*` resource pages delegate to one server-rendered shell that encapsulates the whole shared pattern from the section above: minimal header, hero (+ optional `repoCta` above-the-fold CTA), setup `Accordion` (`defaultOpen={0}`), an optional `YouTubeEmbed` **facade**, optional `BoldaneCta`, and footer. Each `page.tsx` is reduced to its data. Props: `steps`, `title`, `subhead`, `jsonLd`; `videoId`+`videoTitle` (**omit both** on the 4 pages whose video was removed — seo/outreach/interviewer/trend-scanner — so no facade and no video schema render); `repoCta={{ href, label?, icon? }}` for repo/app pages (reels, tiktok → GitHub; social-growth, cowork → `claude.ai/download` with `DOWNLOAD_ICON`); and `boldaneCta` (7 pages) **or** `boldaneCredit` (never both — see Boldane presence policy). Ships no animation-runtime JS (uses the `Reveal` primitives). ads-ai / high-converting-website / 60k-linkedin-post keep bespoke layouts (they still import `YouTubeEmbed`/`RepoCta` directly and still use Framer Motion). When adding a resource page, prefer `ResourcePageShell` over hand-inlining.
- **Security (marketing-brain backend):** the paid routes (`scrape`/`upload`/`extract`) and `PUT /memory` are rate-limited (`rate-limit.ts` now has namespaced buckets + a `MEMORY_DAILY_LIMIT`, opportunistic pruning, and a non-spoofable client IP via `x-real-ip`/right-most XFF). Business context is **client-owned** (browser `localStorage`, sent as `businessContext` each request); the write routes append to the client-sent context via the pure `mergeSection` (no shared server-file bleed), and `GET /memory` returns empty on Vercel. The chat route validates/clamps the `messages` array (fixes a 500 on malformed input, bounds prompt cost) and passes `req.signal` so the Anthropic stream aborts on client disconnect. `scrape` rejects private/loopback/metadata hosts and returns generic errors; `upload` caps PDF pages + extracted chars.
- **Assets/perf:** `hero.jpg` is the ~24 MP camera original re-exported to **2560×1706 (KEEP the 3:2 aspect — the source is 3:2; do NOT force 16:9 or the face distorts), quality 90, ~550 KB, EXIF stripped**; the `<Image>` in `hero-section.tsx` declares matching `width={2560} height={1706} quality={90}` + `sizes`. `preview.mp4` re-encoded 1.9 MB→~300 KB and lazy-loaded via `LazyVideo` (`preload=none` + poster, plays on viewport); dead Space Grotesk 300 weight dropped; `next.config.ts` adds AVIF + `Cache-Control` on static `public/` media. When re-exporting an image, always match the `<Image>` width/height to the file's real aspect ratio and verify with a screenshot.
- **Merged with `mobile-optimization` (2026-07-23):** this branch was merged into `main` on top of the mobile-optimization pass. The combined result keeps both: the shell + CSS reveals + security hardening here, AND the mobile refinements (YouTubeEmbed facade, RepoCta hero, ≥44px tap targets, ≥16px copy, `text-[13px]` eyebrows, `py-16` mobile padding, `defaultOpen={0}`). The facade + RepoCta + video-removal now flow through `ResourcePageShell` props (above).

## Notes

- Keep context minimal but sufficient — avoid bloat
- Plans live in `plans/` with dated filenames for history
- Outputs are organized by type/purpose in `outputs/`
- Reference materials go in `reference/` for reuse
