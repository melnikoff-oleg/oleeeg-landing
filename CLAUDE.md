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
├── seo/                   # Search optimization: log, backlog, keyword map, audits
└── scripts/               # Automation scripts (if applicable)
```

**Key directories:**

| Directory    | Purpose                                                                             |
| ------------ | ----------------------------------------------------------------------------------- |
| `context/`   | Who the user is, their role, current priorities, strategies. Read by `/prime`.      |
| `plans/`     | Detailed implementation plans. Created by `/create-plan`, executed by `/implement`. |
| `outputs/`   | Deliverables, analyses, reports, and work products.                                 |
| `reference/` | Helpful docs, templates and patterns to assist in various workflows.                |
| `seo/`       | All search-optimization work: shipped log, prioritized backlog, keyword map, audits. |
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

**All SEO work lives in `seo/`.** That folder is the single source of truth for search optimization now: `seo/LOG.md` is what has shipped, `seo/BACKLOG.md` is what is queued and prioritized, `seo/keywords.md` is the keyword-to-page map, `seo/audits/` holds dated state snapshots, and `seo/ubersuggest/` is where raw Ubersuggest exports get dropped before triage. Read `seo/README.md` for the workflow. Do not track SEO tasks in this file, add them to the backlog.

Ongoing goal: optimize the site for search around keywords like **"AI systems for marketing"**, **"Claude Code"**, **"Claude Code for marketing"**.

Two facts that constrain every SEO decision here, kept in this file because they bite outside SEO work too:

- **Plausible's Stats API is NOT queryable as of 2026-08-12.** Both the key in this repo's `.env` and the one in boldane-site's return `"The account that owns this API key does not have access to Stats API"`. Any analytics-driven work has to fall back to YouTube view counts, which is arguably the truer signal anyway since 84% of traffic is YouTube-fed. `scripts/build-recommendations.mjs` calls the Stats API and will need its popularity source swapped, or the plan upgraded, before it can be regenerated. Plausible itself still tracks (`src/components/plausible.tsx`, domain oleg.ae, `outboundLinks: true` since 2026-07-06; the event is "Outbound Link: Click" and needs adding as a goal in the dashboard to be visible there).
- **The homepage deliberately links to NO resource pages** since 2026-07-09. Oleg wants it to end on the connect section's "cheers, oleg". Any homepage to resource linking, however good for SEO, would need a different and subtle form, and his sign-off.

The audit baseline as of 2026-08-24 is in `seo/audits/2026-08-24-baseline.md`: sitemap, robots, per-page canonicals (all 32 layouts, no gaps), `ArticleJsonLd` on 23 pages and the `NextUp` internal-linking surface are in place; Open Graph images, homepage Person schema, FAQPage schema on the troubleshooting blocks, and Search Console verification are the open gaps.

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
- `/claude-code-instagram` — Claude Code as an Instagram video *editor* (added 2026-08-01). Companion to **Reel Studio** (`melnikoff-oleg/reel-studio`), a local app that drives Claude Code + the HyperFrames skills. Distinct from `/claude-reels`, which is about *writing* Reels scripts from competitor analysis; this one is about *cutting the video*. **Five** accordion steps, rewritten down from nine on 2026-08-01: VS Code → a Claude plan (Pro minimum; the free plan has no Claude Code) → Claude Code (install + sign-in) → **one pasted prompt that installs everything else** → first video. The collapse is the point: once `claude` exists it can install Node/ffmpeg/Python, clone the repo, `npm install` and start the server itself, so steps 2/6/7/8 of the old version became `SETUP_PROMPT` in `page.tsx`. Two format rules a rewrite must keep: **each step is a list of short imperative actions** ("open this link", "press the blue button"), never a paragraph; and every explanation, caveat and troubleshooting note lives in a **`Why` disclosure, shut by default** (local `<details>` component matching `ResourceFooter`'s pattern). Oleg's words: a wall of reassurance next to every instruction "looks monstrous for people who are non-technical". The subhead is deliberately about half the length of a normal one. No `videoId` yet (the YouTube video is unpublished — add it to `page.tsx` + `layout.tsx` when it goes live, and only then add the route to `YT_FACADE_ROUTES` in `mobile-audit.spec.ts` and `SPECS` in `hero-cta.spec.ts`). Every install fact was verified against primary docs on 2026-08-01; the version numbers and winget package IDs will rot, so re-check before re-promoting the page.

**Tool pages** — free open-source tool lead magnets (GitHub download + setup guide):
- `/ads-ai` — AI ads creator (study competitors' Meta ads, generate ad concepts)
- `/high-converting-website` — kit that builds a high-converting landing page with Claude Code, deployed to a live domain. Carries a distilled conversion playbook (Hormozi + top marketers, the value equation) so the page sells, not just looks nice. Repo: `melnikoff-oleg/high-converting-website`. Proof: Oleg built boldane.com with it and closed a B2B deal. YouTube walkthrough ("How I Built a High-Converting Landing Using Claude Code") to be added later (see the commented placeholder in `page.tsx`; `ArticleJsonLd` now takes optional `videoId`/`videoTitle`).

**Lead magnet pages** — prompt-based giveaways (no code setup, just copy-paste prompts):
- `/60k-linkedin-post` — 3 AI prompts for LinkedIn content that sells ($60K client case study)
- `/opus-5` — "Opus 5, no hype: 5 rules nobody is talking about" (added 2026-07-25). A long-form, data-dense argument page ported from a Claude artifact into the navy design system: 5 sourced rules (effort levels, deleting verification from prompts, skipping Fable 5, model-per-task, the security numbers) plus a release-to-release closer, every claim linked to Anthropic's own charts and docs. Structure is bespoke, NOT `ResourcePageShell`: sticky `RuleRail` scroll-spy (`rule-rail.tsx`), a draggable CSS-3D `VoxelClawd` hero toy (`voxel-clawd.tsx`), then five rule sections each with a "do this" card, figures and a sourced notes block. Mobile-first per the mandate: the 3-column benchmark table swaps to a card stack below `md` (never a sideways scroller), the use-case chart drops its bar + model chip onto full-width rows below `sm`, and the Frontier-Bench chart opens full size on tap since its axis labels are unreadable at 390px. The two client leaves are the rail and the toy; the toy pauses its rAF loop off-screen or on a hidden tab, honors `prefers-reduced-motion`, uses `touch-action: pan-y` so a vertical swipe still scrolls, and scales to its container so it can never poke past the viewport.
- `/elon-musk-ai` — "Seven things Elon Musk actually does with AI" (added 2026-08-05). Companion to the YouTube video "How Elon Musk Uses AI Daily", and the older sibling of `/boris-cherny-ai`: same evidence-wall design, same filmed contract, same two extra fonts (Newsreader for Elon's verbatim quotes, Roboto so the interview cards read as YouTube). A fold that is the whole argument the reading happened — headline, portrait, three interviews as YouTube renders them, three posts as X renders them, the rest of the corpus a numeral in the rail (31 interviews, 997 posts) — then seven numbered rules, each a claim, his own words, a link to the exact second, and one illustration. **Not authored here.** The vault copy at `areas/youtube_videos/2026-07-30_elon_musk_ai_daily/web/` is the source of truth and `scripts/16` in that folder generates `page.tsx` + `page.css` + `public/elon-musk-ai/`; edit this route by hand and the next port silently overwrites you. Only `layout.tsx` (metadata + the two next/font loaders) is hand-written. Two things a rewrite must keep: (1) **no `Reveal`, no client JavaScript** — the site's `Reveal` starts elements hidden and a fast programmatic scroll outruns the intersection observer, leaving a band blank for a beat, which is invisible to a reader and fatal on camera; (2) every selector in `page.css` stays prefixed `.elon-page`, and its `rise`/`fade` keyframes are global, which is why `/boris-cherny-ai` renamed its own. Deliberately **absent from `tests/e2e/routes.ts`** — it renders none of the shared shell the route specs assert. (It replaced an earlier site-native page at `/elon-ai`, deleted 2026-08-12.)

- `/boris-cherny-ai` — "10 things the creator of Claude Code actually does with AI" (added 2026-08-07). Companion to the Boris Cherny video, and a **sibling of the older `/elon-musk-ai`**: same evidence-wall design, same filmed contract, same four-font layout (Newsreader for the subject's verbatim quotes, Roboto so the YouTube cards read as YouTube; DM Sans and Space Grotesk come from the root layout). A fold that is the whole argument the work happened — headline, portrait, three interviews as YouTube renders them, three posts as X renders them, the rest of the corpus a numeral in the rail (+24, +1,343) — then ten numbered rules and one bonus, each a claim, his own words verbatim, and a link to the exact second. **Not authored here.** The vault copy at `areas/youtube_videos/2026-08-02_boris_cherny/web/` is the source of truth and `scripts/07_port_page_to_site.py` in that folder generates `page.tsx` + `page.css` + `public/boris-cherny-ai/`; edit this route by hand and the next port silently overwrites you. Only `layout.tsx` (metadata + the two next/font loaders) is hand-written. Three things a rewrite must keep: (1) **no `Reveal`, no client JavaScript** — same reason `/elon-musk-ai` gives, a fast programmatic scroll outruns the intersection observer and leaves a band blank for a beat, which is fatal on camera; (2) every selector in `page.css` stays prefixed `.boris-page`, and the keyframes are renamed `borisRise`/`borisFade` because `/elon-musk-ai` ships its own `rise`/`fade` and `@keyframes` are global whatever the selector says; (3) the folded plain-Russian explanation under each rule (`<details class="explain">`, shut by default) is the layer the video script is written from — it is not decoration. Cut from 20 rules to 11 on 2026-08-07 against Oleg's own tiering; the mapping and the merge rationale are in the vault README. Like `/elon-musk-ai` it is deliberately **absent from `tests/e2e/routes.ts`** — it renders none of the shared shell the route specs assert.

**Audience page** — the one route that takes input instead of giving something away:
- `/ideas` — a public board where the audience suggests the next video and votes on the ideas already there (added 2026-08-18). Two jobs: test video concepts cheaply before filming one (Oleg adds candidate titles himself, unbadged so they compete honestly), and let viewers see their own suggestion appear and then move to `planned` / `filming` / `published` with a link. Backed by **Supabase**, and specifically by the **shared Boldane production project** (`wmvvifhaffhwguzlhuqk`, the same database boldane-app and boldane-admin use, keys lifted from `~/Desktop/Boldane/Development/boldane-app/.env.local` on Oleg's instruction). Tables `yt_idea`, `yt_idea_vote`, `yt_idea_event`, DDL in `scripts/ideas-schema.sql`, RLS on with NO policies so only the service-role key gets in. **The `yt_` prefix is load bearing**: it marks the only three tables this site may touch in a database that also holds Boldane's customer, Stripe and LinkedIn data. Note this puts a service-role key for that database in a public site's env, which is the cost of sharing the project; a separate free Supabase project would isolate it and needs only the two env vars swapped plus a re-run of the DDL. boldane-app's own CLAUDE.md reserves DDL for humans (`supabase db push` is called a landmine there), so schema changes here go through the Management API with the reviewed file, never `db push`. Data layer `src/lib/ideas/{db,session,limits,screen}.ts`, routes `src/app/api/ideas/{route,vote/route,admin/route}.ts`, admin at `/ideas/admin` behind `IDEAS_ADMIN_SECRET`.
  - **Anti-abuse, all four layers, no signup anywhere:** an httpOnly HMAC-signed browser id (`IDEAS_COOKIE_SECRET`, minted on the first write since a server component cannot set a cookie); `primary key (idea_id, voter_id)` so a repeat vote is a database error the route reads as "unvote"; durable per-IP daily caps counted out of `yt_idea_event` (3 submissions, 60 vote actions) rather than the marketing-brain in-memory limiter, which is per-instance and resets on cold start and so would be useless here; and a full event log carrying the raw IP for cleanup. **The cap's event kinds are tied to the routes' types on purpose** (`SUBMIT_KINDS` / `VOTE_KINDS` in `limits.ts`, the latter derived from a `Record<VoteAction, true>` so a renamed action fails to compile): the first version counted `vote`/`unvote` while the route logged `voted`/`unvoted`, which silently disabled the vote cap with no error anywhere. `votes_count` is kept honest by a Postgres trigger, never by route arithmetic. Clearing cookies still buys one extra vote: that residue is deliberate, because hard per-IP dedupe silently blocks office and carrier NAT.
  - **The screen** (`screen.ts`): one `claude-sonnet-5` call with `output_config.format` json_schema, run before anything is inserted. It rejects spam/links/abuse/off-topic **with a reason written in the site's voice** (the submitter reads it), and folds near-duplicates onto the existing card instead of letting one idea fragment across five entries, which would make the vote counts meaningless. If the call fails or times out the idea is saved as `hidden` and held for review, never dropped. **Duplicate is checked before rejection in the route**, because the screen naturally reports a duplicate as a kind of rejection (`verdict: "reject"` WITH `duplicate_of` set); checking rejection first, as the first version did, meant a reworded duplicate got a "no" instead of the existing card to vote for.
  - **Degrades on purpose:** with `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` absent, reads return empty and the page renders a 200 empty state while writes return 503. That is what lets the Playwright suite (`tests/e2e/ideas.spec.ts`, 59-65) run key-free. Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `IDEAS_COOKIE_SECRET`, `IDEAS_ADMIN_SECRET` (plus the existing `ANTHROPIC_API_KEY`). Linked from `ResourceFooter` on every footer page (one line, suppressed on `/ideas` itself); deliberately NOT in `RESOURCES`, since it is not a free guide and a new slug there would feed a `recommendations.json` that cannot currently be regenerated. The homepage is untouched by design.

**Marketing Brain pages** — the `marketing-brain/` knowledge base, surfaced on the site:
- `/marketing-brain-knowledge` — static gallery of the whole corpus (8 books + 75 talks, grouped by expert). Data is generated from `marketing-brain/manifest.json` into `src/app/marketing-brain-knowledge/data.ts`. Book covers are served from `public/marketing-brain/book-covers/`.
- `/marketing-brain` — **AI chat** (RAG), branded **"$1B Marketing Brain"**: ask a marketing question, get a streamed, cited answer with visual source cards (book cover + page, or video thumbnail/embed + timecode). This is the visual twin of `marketing-brain/scripts/query.py`. The hero/empty state is deliberately minimal (Jobs-style: title, faces, starter prompts, input, personalize link, nothing else). It shows an **expert portrait strip** (`src/app/marketing-brain/components/expert-strip.tsx`) of the four faces behind the corpus (Hormozi, Brunson, Cialdini, Godin) so visitors instantly grasp whose minds power the answers; portraits are bright color (they appear in a YouTube thumbnail), square face-centered webp crops in `public/marketing-brain/experts/`, unified by a rounded frame + ring + soft drop shadow, with color/lift on hover. Keep visible body text lean (target under ~300 chars).

The two pages are cross-linked (chat header → "browse the sources"; knowledge header + footer → "ask the brain"). The chat (`/marketing-brain`) is also listed in `ResourceFooter`, so it appears in the "more free resources" grid on every resource/tool/lead-magnet page; the knowledge gallery renders the `ResourceFooter` too, linking it to the rest of the site.

Resource pages follow a shared pattern: minimal header, hero (repo-backed pages carry a `RepoCta` here; the two non-repo app-download pages carry a download-variant `RepoCta`, see below), accordion setup steps (first step open by default via `defaultOpen={0}`), a `YouTubeEmbed` **facade** lower on the page, cross-linked resource footer. The 14 `claude-*` pages render this pattern through the shared **`ResourcePageShell`** (see the Code-review hardening section) — each is just a data object; only the bespoke tool pages hand-inline it. Tool pages follow the same pattern but replace the video embed with a GitHub download CTA and "how it works" overview. Lead magnet pages have their own structure: prompts with copy buttons, how-it-works overview, and client proof. Each lives in `src/app/{slug}/page.tsx` with its own `layout.tsx` for metadata. **The video is deliberately NOT the hero** even though the pattern once put it first: these are near-100% YouTube entry pages, so the visitor already watched it (see `RepoCta` above; grounded in Plausible entry-page + referrer analysis).

**Mobile refinement pass (2026-07-23, branch `mobile-optimization`):** site-wide mobile-friendliness lift grounded in the Plausible traffic profile. Primary reading copy is >=16px (`text-base`) everywhere; interactive tap targets are >=44px (header hamburger `size-11`, chat send `size-11`, starter chips, copy buttons, knowledge sticky-nav chips + an always-visible "ask" CTA); section eyebrows went `text-vivid-blue/80 text-xs` -> `text-vivid-blue text-[13px]` for AA contrast; mobile section padding `py-24` -> `py-16`; the shared `Accordion` body copy is `text-silver` (was the borderline `text-silver-muted`). Every resource page's eager YouTube iframe became a `YouTubeEmbed` facade (see above). Verified by `tests/e2e/mobile-audit.spec.ts`.

**Boldane soft CTAs (2026-07-06):** 7 resource pages carry a `BoldaneCta` card (shared component `src/components/boldane-cta.tsx`, extracted from the `/60k-linkedin-post` inline pattern) placed after the video section, before the `ResourceFooter`. Two angles, chosen by page relevance from Plausible traffic analysis: **DIY-vs-done-for-you** on the content pages (`claude-interviewer`, `claude-content`, `claude-twitter`, `claude-social-growth`) and **profile-authority** ("prospects check your LinkedIn before replying") on the outreach pages (`claude-cowork-outreach`, `claude-b2b-outreach`, `claude-outreach`). Deliberately NOT on `/claude-reels`, `/claude-tiktok`, `/ads-ai`, `/claude-seo`, `/claude-trend-scanner`, `/marketing-brain` — wrong audience intent for a done-for-you LinkedIn service; a hard plug there would read as an ad. Copy follows Boldane's rules: no em dashes, never imply ghostwriting ("what you said", not "in your voice" / "in your own words" / "sound like you"), service voice ("a real team", "done for you"). `/60k-linkedin-post` keeps its own inline version. (The homepage previously carried a `ConsultCta` for a paid ~$300 1:1 consult via calendly.com/boldane/ai-consult; removed 2026-07-09, component deleted.)

**Boldane presence policy (de-repetition pass 2026-07-06 — PERMANENT RULE):** **one deliberate Boldane pitch per page, never two.** Organic proof (the Mike Kamo results card) and navigation (connect icon) don't count; pitches do. Repetition reads as insecure, not premium. Concretely: the `ResourceFooter` credit line ("free guides by oleg, founder of Boldane") is behind an opt-in `boldaneCredit` prop, ON only for the 9 pages with no other Boldane mention (claude-reels, claude-tiktok, claude-code-instagram, ads-ai, claude-seo, claude-trend-scanner, claude-website, marketing-brain-knowledge, opus-5) and OFF everywhere else (homepage, the 7 `BoldaneCta` pages, 60k-linkedin-post, high-converting-website). `/marketing-brain` (the chat) renders no ResourceFooter, so it has no Boldane presence at all. The homepage about-section was also de-duplicated against the hero: paragraph order is now media/software thesis first, then "boldane is that idea as a company" (the hero keeps the only "i run boldane"), and the YouTube subscriber count is said once in prose (hero only; 19K+ as of 2026-07-09). When adding a new page: give it either one `BoldaneCta` (content-from-expertise or outreach topics) or `boldaneCredit` (everything else), never both.

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
- `src/components/troubleshooting.tsx` — `Troubleshooting` + the `FIXES` map: the recurring YouTube-comment failures, answered on the page. Rendered through `ResourcePageShell`'s `troubleshooting` prop (an array of `FIXES` keys), placed **right after the setup guide**, since that is where people are standing when they get stuck. Each entry is a `<details>` shut by default, following the `/claude-code-instagram` rule that a wall of caveats beside every instruction "looks monstrous for people who are non-technical". Ten entries: `claudeNotFound`, `crAlias`, `noEnvFile`, `costs`, `costsScraping`, `creditBalance`, `geminiQuota`, `skipPermissions`, `linkedinBan`, `scrapingSafety`. (`costs` was split 2026-08-12: `costs` is the generic Claude-plan answer for every page; `costsScraping` carries the Apify/Google AI Studio bills and belongs ONLY on the 10 scraper-pipeline pages, so pure-Claude pages stop describing bills they do not have.) Built from all 593 comments on the 17 Claude-era videos (230 of them questions, clustered by frequency, scraped with `yt-dlp --write-comments`), and every fact checked against primary docs on 2026-08-12. **Pick only what applies to a page** (a competitor-research page should not carry a LinkedIn ban warning). Wired on 16 pages; see each `page.tsx`.
- `src/components/filmed-page-outro.tsx` — `FilmedPageOutro`, the end card for the six **filmed** pages (`/elon-musk-ai`, `/boris-cherny-ai`, `/sam-altman-ai`, `/andrej-karpathy-ai`, `/claude-code-sessions`, `/claude-riemann-hypothesis`). Those render none of the shared shell and had **zero internal links of any kind**, so a visitor from search hit the end of the argument with no route to the video or the site. It respects both of their constraints: **zero client JS** (the video is a thumbnail inside a plain `<a>`, not the click-to-load facade, because a fast programmatic scroll outruns any observer and blanks a band on camera) and **total style isolation** (every value inline, including the font stack, since one of those pages sets Comic Neue as a label face). `videoId`/`videoTitle` are **optional** since 2026-08-12: while a companion video is unpublished (boris, sam, karpathy today) the card renders a "more from oleg" variant with channel + free-guides links, and gains the video block when the id is added. Mounted on ALL six filmed routes, after `{children}`, outside the scoped ground div. **Ownership caveat:** on the deck routes (boris, sam, karpathy) and riemann, `layout.tsx` is GENERATED by the vault port script, so the outro mount lives in each port script's layout template; `claude-code-sessions`'s port script seeds `layout.tsx` only when missing; elon's is hand-written. When a filmed video publishes, add `videoId`/`videoTitle` in the port-script template (not the site file) and re-port.
- `src/components/repo-cta.tsx` — `RepoCta`, the single above-the-fold primary CTA for resource pages. Default is a "get it on github" button with the GitHub icon (repo-backed pages: claude-reels, claude-tiktok, ads-ai). It also takes an optional `icon` prop (export `DOWNLOAD_ICON` for a tray-arrow) + `label`, so **non-repo pages that hand over an app** use the same component: `/claude-cowork-outreach` ("download claude cowork" -> claude.ai/download; #2 page by volume, 79% bounce) and `/claude-social-growth` ("get claude code" -> claude.ai/download; previously converted 232 visitors at 0.4% with no hero action). Rationale: resource pages are near-100% YouTube *entry* pages (Plausible: /claude-reels 96% entry, cowork-outreach 95%), so the visitor already watched the video; the fold's job is to hand them the thing they clicked through for, not re-show the demo. That is also why the video stays LOW on the page (as a facade), not hero. This reconciled the earlier `analytics-ux`/`HeroActions` experiment: `RepoCta` is the one hero-CTA component, so a page never gets two. Covered by `tests/e2e/hero-cta.spec.ts`.

---

## Code-review hardening (branch `code-review-hardening`, 2026-07-23)

A full-codebase review pass. Key permanent changes beyond the animation swap (Tech Stack) and test additions (Testing):

- **`ResourcePageShell` (`src/components/resource-page-shell.tsx`)** — the 14 `claude-*` resource pages delegate to one server-rendered shell that encapsulates the whole shared pattern from the section above: minimal header, hero (+ optional `repoCta` above-the-fold CTA), setup `Accordion` (`defaultOpen={0}`), an optional `YouTubeEmbed` **facade**, optional `BoldaneCta`, and footer. Each `page.tsx` is reduced to its data. Props: `steps`, `title`, `subhead`, `jsonLd`; `videoId`+`videoTitle` (**omit both** on the 4 pages whose video was removed — seo/outreach/interviewer/trend-scanner — and on claude-code-instagram until its video is published, so no facade and no video schema render); `repoCta={{ href, label?, icon? }}` for repo/app pages (reels, tiktok, code-instagram → GitHub; social-growth, cowork → `claude.ai/download` with `DOWNLOAD_ICON`); and `boldaneCta` (7 pages) **or** `boldaneCredit` (never both — see Boldane presence policy). Ships no animation-runtime JS (uses the `Reveal` primitives). ads-ai / high-converting-website / 60k-linkedin-post keep bespoke layouts (they still import `YouTubeEmbed`/`RepoCta` directly and still use Framer Motion). When adding a resource page, prefer `ResourcePageShell` over hand-inlining.
- **Security (marketing-brain backend):** the paid routes (`scrape`/`upload`/`extract`) and `PUT /memory` are rate-limited (`rate-limit.ts` now has namespaced buckets + a `MEMORY_DAILY_LIMIT`, opportunistic pruning, and a non-spoofable client IP via `x-real-ip`/right-most XFF). Business context is **client-owned** (browser `localStorage`, sent as `businessContext` each request); the write routes append to the client-sent context via the pure `mergeSection` (no shared server-file bleed), and `GET /memory` returns empty on Vercel. The chat route validates/clamps the `messages` array (fixes a 500 on malformed input, bounds prompt cost) and passes `req.signal` so the Anthropic stream aborts on client disconnect. `scrape` rejects private/loopback/metadata hosts and returns generic errors; `upload` caps PDF pages + extracted chars.
- **Assets/perf:** `hero.jpg` is the ~24 MP camera original re-exported to **2560×1706 (KEEP the 3:2 aspect — the source is 3:2; do NOT force 16:9 or the face distorts), quality 90, ~550 KB, EXIF stripped**; the `<Image>` in `hero-section.tsx` declares matching `width={2560} height={1706} quality={90}` + `sizes`. `preview.mp4` re-encoded 1.9 MB→~300 KB and lazy-loaded via `LazyVideo` (`preload=none` + poster, plays on viewport); dead Space Grotesk 300 weight dropped; `next.config.ts` adds AVIF + `Cache-Control` on static `public/` media. When re-exporting an image, always match the `<Image>` width/height to the file's real aspect ratio and verify with a screenshot.
- **Merged with `mobile-optimization` (2026-07-23):** this branch was merged into `main` on top of the mobile-optimization pass. The combined result keeps both: the shell + CSS reveals + security hardening here, AND the mobile refinements (YouTubeEmbed facade, RepoCta hero, ≥44px tap targets, ≥16px copy, `text-[13px]` eyebrows, `py-16` mobile padding, `defaultOpen={0}`). The facade + RepoCta + video-removal now flow through `ResourcePageShell` props (above).

## YouTube sync pass (2026-08-12)

A sweep to bring the site back in line with the channel, driven by scraping the channel and every comment on it.

**Tooling note, read this first.** The two data sources the old scripts assumed are both down:
- **Apify is blocked** on this account: every actor run returns `{"error":{"type":"platform-feature-disabled","message":"Too many outstanding invoices"}}`. So `/scrape-video` and the `dantane` Apify scrapers (`software/apify_scrapers/youtube/`) cannot run until the invoices are paid.
- **Plausible's Stats API is off the plan** (see the SEO section above).
- What worked instead: **`yt-dlp`** (installed, `/opt/homebrew/bin/yt-dlp`). `--flat-playlist --dump-single-json` for the channel list, `--dump-json` for full metadata including descriptions, and `--skip-download --write-comments --write-info-json` for comments. Free, local, no key. Channel id is `UCoq3taBUIFhIBCnteeG84rQ`.
- Video liveness is cheapest via `https://www.youtube.com/oembed?url=...&format=json`: 200 live, 401 embedding disabled but live, 403 private/removed. Confirm 403s against the watch page: `"status":"LOGIN_REQUIRED"` means **private**, not deleted.

**The channel-to-page map is in the video descriptions.** Every video links its companion page, so `yt-dlp --dump-json` piped through a grep for `oleg.ae/...` is the authoritative mapping. Use that rather than guessing from titles.

**Videos embedded** (they existed on the channel but no page showed them): `/claude-code-instagram` (`SUZYKyIujQY`, the video CLAUDE.md said was unpublished, live since 2026-08-04), `/claude-code-second-brain` (`TdYYRm_Ph5E`), `/5-levels-ai` (`mFYKAsGcnso`, hand-wired since the page is bespoke), and the three filmed pages via `FilmedPageOutro`. `/claude-code-ads` still has no video: the Ads Studio video is unpublished. `/marketing-brain` deliberately stays bare (the Jobs-style hero rule).

**Five pages have a private source video** (`LOGIN_REQUIRED`, so gone for the public): `/claude-website` (`Iew4mx03C3s`), `/claude-outreach` (`aUO7kUc8aJU`), `/claude-seo` (`KOK8-0v4mUc`), `/claude-interviewer` (`Na1ET0-s4CA`), `/claude-trend-scanner` (`gVpAjLUnD2c`). Four had already been stripped in commit `63157cf`; `/claude-website` was still rendering a dead embed and dead video schema and is now stripped too. **All five pages are still live and were kept on purpose**: they work as standalone guides and carry inbound `NextUp` links. `/claude-website` is the one worth retiring (fully superseded by `/high-converting-website`, which has a public repo and real proof) but that is Oleg's call, pending.

**Bugs the comments exposed, all fixed:**
- **`APIFY_API_KEY` vs `APIFY_API_TOKEN`.** Every repo reads `process.env.APIFY_API_TOKEN`; `/claude-reels`, `/claude-tiktok` and `/claude-twitter` all told people to write `APIFY_API_KEY`. Wrong name, silent failure. Fixed on those three. **The four pages that still say `APIFY_API_KEY` are correct and must NOT be "fixed"** (`claude-b2b-outreach`, `claude-marketing`, `claude-outreach`, `claude-trend-scanner`). Those downloads are not Next.js apps: they are **Claude Code workspaces** (`~/Desktop/Software Projects/old/{outbound-ai,claude-code-marketing,content-creation}`) where nothing compiles the key, Claude reads it out of `.env` on demand, and the name is set by convention in each workspace's own `CLAUDE.md`, which says `APIFY_API_KEY`. So the rule is: **`APIFY_API_TOKEN` for the Next.js app repos** (`social-media`, `tiktok-ai`, `x-ai`, `ads-ai`), **`APIFY_API_KEY` for the workspace-style projects**. Check the project's own `CLAUDE.md` before changing either.
- **`/claude-twitter` was missing a required key entirely.** `x-ai` needs `KIE_AI_API_KEY` for the infographic images, which is most of what the system posts. Added, plus the repo now has an above-the-fold `RepoCta`.
- **Skool.** Four pages sent people to the Skool community for the source code (`claude-twitter`, `claude-b2b-outreach`, `claude-trend-scanner`, `claude-website`). The group is live and free (7.1k members) but has **no discoverable files section**, which is why the comments are full of "where is the code", "the links are gone" and "you are a scammer". `/claude-twitter` now points at the public `x-ai` repo instead, which needs no signup. The other three have no public repo, so they still point at Skool: **giving them a real download is the biggest remaining win.** Note `/claude-content`'s Google Drive link does work (`content-creation-template`, verified public).
- **Do NOT publish `old/content-creation` or `old/claude-code-marketing`** (in `~/Desktop/Software Projects/old/`). The first is Oleg's personal content vault with his real brand voice; the second is a client workspace for Ellington Properties. Neither can be made public as-is.

**Repos updated and pushed** (both public):
- **`melnikoff-oleg/social-media`** (the `/claude-reels` download, 117k-view video): its live code hardcoded **`gemini-2.0-flash`, which Google has retired** and which no longer appears in the model list at all, so the analysis step failed for everyone who downloaded it. Now `GEMINI_MODEL` from `.env`, defaulting to `gemini-2.5-flash` (what the sibling repos already run). Retries went from a flat 5s x3 to 2s/4s/8s with jitter, and 429/404/bad-key now explain themselves instead of dumping raw JSON. Added `.env.example` and a real `README.md`. Verify live model ids with `curl "https://generativelanguage.googleapis.com/v1/models?key=$GEMINI_API_KEY"` (a key is in `dantane/.env`).
- **`melnikoff-oleg/tiktok-ai`**: added `.env.example` + `README.md`, and rewrote the stale "this is a Claude Workspace Template" opener in `CLAUDE.md` to say what the project is and where `.env` goes (root, not `app/`, because `app/next.config.ts` loads it from the parent).
- `x-ai` and `ads-ai` already had correct `.env.example` files. `social-media` and `tiktok-ai` were the two that did not.

**Channel-side link audit (the other direction: video descriptions out).** Every URL in all 31 descriptions, checked 2026-08-12. Apify works again as of this date (plan STARTER, user `endearing_querist`), so `/scrape-video` is usable, but `yt-dlp` is free and did all of this.
- **`skool.com/n8nlab/about` is DEAD (404). It is linked from 7 videos totalling 169,284 views**, and it is the "access the database" link on the two biggest n8n videos (95k and 37k). Verified against a control: `skool.com/ai-automation-7100` loads fine ("Oleg's AI Lab", 7.1k members) while `n8nlab` 404s. 127 comments in the n8n era are asking where the template database is. The asset is **not on disk anywhere** (only the video project folders under `~/Desktop/Content/Long Videos/Very Old/`), so it cannot be republished; the fix is editing those descriptions to point somewhere live. Needs YouTube Studio, no API credentials in this environment.
- `buildauthority.ai` correctly redirects to `boldane.com`, but `/viral` and `/authentic` redirect to the **homepage**, not to the lead magnet they promise, so ~39k views land somewhere generic.
- **Three different LinkedIn handles** appear across descriptions: `/in/melnikoff-oleg` (14 videos, 269k views), `/in/olegane` (11 videos, 240k views, the canonical one) and `/in/olegai` (1 video). LinkedIn answers bots with HTTP 999 so which of these resolve could not be verified from here.
- Healthy: all 6 Google Docs/Drive lead magnets are live and public, `evolva.ai` is live, and all 14 `oleg.ae` links in descriptions point at real routes.
- The old n8n videos belong to a **different funnel** (`skool.com/n8nlab` + `evolva.ai`), not oleg.ae or Boldane. Building oleg.ae pages for them would be a strategy call about re-capturing ~250k views of legacy n8n traffic into the Claude Code brand, not a bug fix.

**Full comment corpus: 2,217 comments across all 31 videos** (`yt-dlp --write-comments`). The 17 Claude-era videos gave 593 (230 questions), the 14 n8n-era ones 1,114 non-owner comments whose top clusters are error/not-working (153), wants-the-template (127), cost (80) and API credentials (33). The n8n-era ones drove no site changes because those videos point at the legacy funnel.

**Marketing Brain: 10 sources could not play.** All ten Alex Hormozi videos in the corpus have **embedding disabled by the owner** (oembed returns 401; they are live, not removed). The `SourceCard` iframe therefore rendered YouTube's grey "Video unavailable" panel, and Hormozi is the top-ranked expert in the corpus, so those were the most likely cards to be shown and tapped. An iframe that refuses to load cannot be detected from the page, so `src/lib/marketing-brain/no-embed.ts` holds the precomputed set (with the regeneration one-liner in its header) and `SourceCard` turns the poster and the timecode chips into links to the exact second on YouTube for those. 65 of the 75 videos are embeddable and still play in place.

**Honesty note now on the outreach pages.** The most-liked question on the Cowork video (18 likes) is whether LinkedIn will ban you, and the top reply was detection-evasion advice. The `linkedinBan` entry says plainly that automating LinkedIn is against LinkedIn's user agreement **and** against Anthropic's own usage policy (which forbids using Claude to circumvent another platform's terms), gives the lower-risk shape (automate the research, send by hand), and explicitly refuses to hand out evasion tricks or a "safe" daily number, because LinkedIn publishes no such number and every figure online is vendor folklore.

## Mobile clarity pass (2026-08-12, branch `mobile-optimize`)

A full 30-route mobile audit at 390px (multi-agent, real-screenshot-driven, judged from the seat of a YouTube viewer on a phone), then fixes on every page. The suite is green (211 passed / 0 failed) and the no-horizontal-overflow probe stays clean on all 30 routes. New permanent rules and what changed:

- **Fold rule extended: every resource page hands its promised asset over above the fold.** New hero CTAs: `/claude-content` (Drive, "get the project files"), `/claude-b2b-outreach` + `/claude-trend-scanner` ("get the source code") and `/claude-website` ("get the starter template"), the last three pointing at the Skool about page with step copy naming the **Classroom** section (a public repo replacing Skool remains the biggest win, unchanged). `/claude-social-growth`'s hero CTA now points at `claude.com/claude-code` (was `claude.ai/download`, which hands over the desktop app and contradicted the terminal guide; step 2 references the same destination). All registered in `hero-cta.spec.ts` (11 entries; `hasVideo: false` rows assert CTA-above-setup-guide since those pages ship no facade).
- **Every paste-able prompt has one-tap copy.** New shared `src/components/copy-button.tsx` (`CopyButton`, extracted from the 60k pattern: 44px, never wraps, brief "copied" state). Wired on claude-outreach, claude-social-growth, claude-code-second-brain, claude-code-ads, ads-ai, high-converting-website; `/5-levels-ai` uses a local tap-to-copy CmdChip because its commands must wrap; 60k keeps its local button (now `shrink-0 whitespace-nowrap`). Prompts live in consts so the button and the display never drift.
- **Command/code blocks wrap, never scroll or clip.** Every font-mono `.env`/`git clone`/install block on the resource pages carries `[overflow-wrap:anywhere]` (the `Cmd` pattern from troubleshooting.tsx); the shared `Accordion` content wrapper has a defensive `[overflow-wrap:anywhere]` too. `overflow-x-auto` on a command block is banned: on a phone it hides the end of the line and people copy half a command.
- **Price standard: Claude Pro is $20/mo.** The stale $19 figure was corrected on 9 pages (claude-seo even said "through the Max plan"). Say it in the page's voice, never $19.
- **`/60k-linkedin-post`**: the three prompts are no longer nested scrollers; collapsed `max-h-80 overflow-hidden` with a bottom fade + 44px "show full prompt" toggle; the hero gained a "jump to the prompts" anchor so the fold has an action.
- **`/marketing-brain`**: every focusable input computes to 16px at 390px (under 16px, iOS Safari auto-zooms on focus; never "fix" that by capping user zoom); drawer close/scrape/save are 44px; Escape closes the drawer.
- **`/marketing-brain-knowledge`**: each expert shows their top 3 talks, the rest behind a native `<details>` "see all N talks" (`data-testid="see-all-talks"`); the page dropped 32.4k → 15.3k px at 390px and initial thumbnail requests 76 → 27; every link stays in the server-rendered HTML for crawlers.
- **`/opus-5`**: the rule rail now self-scrolls the active chip into view (container `scrollTo`, never `scrollIntoView` which can shift the page vertically) with a right-edge fade cue that hides at the scroll end.
- **Homepage video**: the "watch on youtube" label is a visible pill below `lg` (general rule: hover-only affordances do not exist on phones).
- **NextUp**: `claude-code-second-brain` + `marketing-brain-knowledge` entries hand-added to `recommendations.json` (build script still cannot regenerate, Plausible API off); hero description clamped `line-clamp-3`, hero arrow hidden below `sm`, the claude-code-instagram description shortened in `resources-data.ts`.
- **Mobile rhythm**: `BoldaneCta` and the shell's video section are `pb-16 md:pb-32` (the ~160px dead bands are gone); `BoldaneCta` copy is `text-base`.
- **Small content fixes**: claude-marketing step 3 now creates the workspace before referencing it; claude-interviewer step 1 has real install actions; claude-website recommends live registrars (Google Domains is defunct); second-brain's setup prompt lost its em dash (doc comment warns not to revert).
- **Filmed pages, all six, fixed in the VAULT and re-ported** (dantane repo, `areas/youtube_videos/*`; the port scripts re-ran cleanly and the filming contract was verified: nothing changes above each page's mobile breakpoint). The deck pages (boris, sam, karpathy) got a mobile-only masthead h1 + slides packed to natural height (no more 100svh voids); the receipts/evidence walls stack to one column below 900px (boris and sam were unreadable 22-28px letter columns, the audit's two criticals; boris 13.1k → 7.6k px, karpathy 18.8k → 11.9k). The `.prefix @font-face` port bug (invalid selector, fonts silently never loaded) is fixed in the boris/sam port scripts. Russian filming rails/notes are hidden on touch devices. Riemann's prose em dashes were rewritten at the vault source and it gained a web-only hero fold (its first h1), shown only below 900px. Elon's cite chips are 44px with 12px gaps. See the `FilmedPageOutro` bullet for the layout.tsx ownership caveat this pass corrected.

## /reels and /creators, the two reel pages (2026-08-20, renamed 2026-08-27)

Two flat slugs over one Supabase table of viral Instagram reels: `/reels` is the library (a search box, five range filters and the whole corpus as a wall of stills) and `/creators` is the same corpus from the other end, the people who made it, with a profile page each. Every reel carries its thumbnail, Instagram link, full metrics, date and the five-field write-up (idea, hook, retain, reward, tags).

**Renamed on 2026-08-27, on Oleg's instruction.** `/viral-reels-browse` became `/reels`, `/viral-reels-creators` became `/creators`, and `/viral-reels-ideas` (the chat that turned a brand description into things to film) was deleted whole, along with its route, its prompt, its three tools and the effort heuristic. `/reels` was taken at the time by a separate one-page view of the same corpus (search + topic chips + wall, riso-sticker design, linked from nothing but the sitemap); it and its `/api/reels/*` routes were deleted so the library could have the slug. Every retired slug is a permanent redirect in `next.config.ts`, including the ~245 creator pages at `/viral-reels-creators/:account`. The API routes keep their `/api/viral-reels/` folder: only the page slugs moved. `src/lib/reels/topics.ts` went with the deleted page, so the vault's `scripts/build_topics.py` has nothing to write to any more.

- **The corpus is not in this repo.** It is built in the vault (`dantane`, `software/viral_reels_database/search/`, moved there from `areas/youtube_videos/` on 2026-08-25) by `sync.py`, which embeds each reel and upserts it into the shared Boldane Supabase project. Adding reels needs no deploy here: the page reads Supabase live. The SQL that created `reel_search`, `reel_search_match` and the `reel-thumbs` bucket lives in that same folder as `schema.sql`.
- **A search is two hops**: embed the query with OpenAI, then rank by cosine distance in the `reel_search_match` pgvector function. Measured about 500 ms end to end. `src/lib/reels/search.ts` also holds a 15-minute in-memory LRU, keyed on the window as well as the words, so repeat queries cost nothing on a warm instance.
- **The model and the dimension count (`text-embedding-3-large`, 3072) are written in two places**, `src/lib/reels/search.ts` and the vault's `sync.py`. Changing one without the other silently breaks every search, because the query and the rows would then live in different vector spaces.
- **`src/lib/reels/types.ts` exists so the client never imports the server module.** `search.ts` reads the service-role and OpenAI keys at import time; the client components need `ReelHit`, `QUERY_MAX`, `RESULT_COUNT` and `WINDOWS`, so those live in a module with no secrets in it rather than relying on the bundler to shake the rest out.
- **The API validates before it checks config**, same order as `/api/ideas`, so the guard-rail branches in `tests/e2e/viral-reels.spec.ts` (tests 66-72) are deterministic in a key-free environment. Per-IP cap is 300 searches a day.
- **Env:** `OPENAI_API_KEY` (added to Vercel production 2026-08-20) alongside the `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` the ideas board already uses.
- **Both pages are deliberately bare (2026-08-20).** No header, no wordmark, no hero, no copy, no ResourceFooter. That is why `/reels` and `/creators` are excluded from `SHELL_ROUTES` and `FOOTER_ROUTES` in `tests/e2e/routes.ts` by name (`BARE_ROUTES`); both stay in `ROUTES` so they must still answer 200, render exactly one `h1` and log no console errors. The `h1` is `sr-only`, because a page still owes a screen reader one heading and neither has anything on it to use. The one piece of chrome they share is `ReelNav`, two links since 2026-08-27.
- **The slugs are flat, and `/viral-reels/browse` redirects (2026-08-20).** Oleg asked for one path segment per page, so the library moved from `/viral-reels/browse` to `/reels` and `next.config.ts` carries a permanent redirect, because the old URL was linked and is in a sitemap Google already fetched. The API routes keep their folder (`/api/viral-reels/browse`); only the page slugs are flat.
- **The recency filter runs in SQL, not in the browser.** `reel_search_match` takes `since_days` (7, 30, 60, 90, 365, or null for all time) and applies it before the `limit`, so a filtered search still returns a full ten rather than whatever survives filtering an unfiltered top ten. A reel with no `posted_on` is dropped as soon as a window is asked for. `normalizeDays` in `types.ts` is the only gate: anything not one of the six offered windows becomes all time, so a hand-made request can never reach the RPC with an arbitrary interval.
- **A similarity floor, `MIN_SIMILARITY = 0.2`, is what makes the search honest.** pgvector orders by distance and stops at the limit; it never judges whether the nearest reel is near at all, so without a floor every query filled all ten slots and a query the library cannot answer came back looking confident and wrong. Measured over the live 694-reel index: a covered query lands at 0.29 to 0.53 with 25 reels above 0.22, an uncovered one ("how to file taxes in germany") tops out at 0.08 with nothing above 0.20, and the junk a narrow window surfaced sat at 0.09 to 0.17. The two populations are well separated and 0.20 sits in the gap. A search returning four reels, or none, is the feature.
- **`/reels` is the library, ranked by outlier score (2026-08-20).** The other half of the feature: search answers "what is close to this idea", browse answers "what is in here at all". Twenty reels a page, ordered `score.desc.nullslast,posted_on.desc`, filtered by the same six recency windows plus an audience-size range. `src/lib/reels/browse.ts` is one PostgREST read and touches neither OpenAI nor the vector column, so a page turn costs nothing.
- **The browse read is `cache: "no-store"`, and must stay that way.** It shipped with `next: { revalidate: 60 }` and Vercel's Data Cache went on serving the pre-sync answer long past that TTL: the day the library grew from 694 reels to 1033, the page still reported 7 reels under a million followers in the last 60 days while the database held 108. The rows only change when `sync.py` runs, which is exactly the moment a stale count is most misleading, and the query is a single indexed read. Correctness wins.
- **The follower slider carries indices, not follower counts.** `FOLLOWER_STOPS` in `types.ts` is thirteen log-spaced stops from 10K to 100M, because the library spans 47.9K to 88.9M and a linear track would leave 30 of the 33 accounts inside its first few pixels. Index 0 and the last index are open ends that add no SQL filter at all, so the full range is genuinely unfiltered rather than "between 10K and 100M", which would silently drop anything outside. Two stacked native `<input type="range">` over one drawn track (the `.range-input` block in `globals.css`) keeps it keyboard operable; the lower thumb takes a raised `z-index` at the far right or it becomes impossible to drag back.
- **Browse selects its columns by name.** `select=*` would also fetch `embedding` (3072 floats, ~24 KB of JSON a row) and `doc`, turning a 60 KB page into a 550 KB one for data no browser reads. The list in `browse.ts` must stay in step with `ReelRow`.
- **`ReelRow` and `ReelHit` are split** so the card can paint a browse row that has no `similarity`. `ReelHit = ReelRow & { similarity: number }`; only the search produces one.
- **The first browse page is server-rendered**, so the list is in the HTML for a crawler and for a visitor before any JavaScript arrives. Every later page and every filter change is the client component calling `GET /api/viral-reels/browse`. That route clamps rather than rejects: an out-of-range window, a negative page, a min dragged past the max all become the nearest legal request, because the slider can emit a crossed pair mid-drag and an empty page is a worse answer than a narrow one. `normalizePage` also caps at 10,000, since a page number is an offset Postgres has to count past.
- **Thumbnails are plain `<img>`, not `next/image`**, on purpose: they are 360x640 JPEGs served immutable from Supabase storage and painted at 96-128px, so an optimizer pass would only spend Vercel transformation quota.

## Notes

- Keep context minimal but sufficient — avoid bloat
- Plans live in `plans/` with dated filenames for history
- Outputs are organized by type/purpose in `outputs/`
- Reference materials go in `reference/` for reuse
