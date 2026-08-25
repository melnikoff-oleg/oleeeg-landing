# SEO

The working folder for search optimization of **oleg.ae**. Everything about SEO lives here: what has shipped, what is queued, what the target keywords are, and the raw reports the queue was built from.

Target keywords, in priority order: **AI systems for marketing**, **Claude Code**, **Claude Code for marketing**. See `keywords.md` for the full map.

## The files

| File | What it holds |
| --- | --- |
| `LOG.md` | Dated record of every SEO change actually shipped. Append-only. This is the "what did we already do" answer. |
| `BACKLOG.md` | Prioritized open tasks, scored by impact and effort. This is the "what next" answer. |
| `keywords.md` | Keyword to page map. One primary keyword per page, no two pages competing for the same term. |
| `audits/` | Dated snapshots of the site's SEO state. `2026-08-24-baseline.md` is the starting point. |
| `ubersuggest/` | Raw Ubersuggest exports and screenshots, dropped in as-is. Nothing here is edited, it is evidence. |

## Workflow

1. **A suggestion arrives** (Ubersuggest, Search Console, a manual audit). Drop the raw export into `ubersuggest/` or `audits/` with a dated filename.
2. **Triage it into `BACKLOG.md`.** Not every Ubersuggest suggestion is worth doing: some are generic checklist items that do not apply to a Next.js site, some are already done, some cost more than they return. Reject explicitly with a reason rather than silently skipping, so the same item does not get re-triaged next month.
3. **Ship the change** in the codebase as normal.
4. **Move the line to `LOG.md`** with the date and the commit, and mark it done in `BACKLOG.md`.
5. **Re-audit periodically** into a new dated file in `audits/` so progress is measurable against a fixed baseline.

## Rules that constrain SEO work here

These come from CLAUDE.md and are not negotiable, so check a proposed change against them before doing it:

- **No em dashes** in any site copy. Rewrite with commas, colons or periods.
- **Mobile-first is mandatory.** Every page fully usable at 390px, no horizontal scroll. An SEO change that adds a wide table or a keyword-stuffed block that breaks the phone layout is a regression, not a win.
- **One Boldane pitch per page, never two.** Adding an internal link or a CTA for SEO reasons must respect this.
- **The homepage deliberately links to no resource pages.** Oleg wants it to end on "cheers, oleg". Any homepage internal-linking proposal needs his sign-off, it is not a free win.
- **Plausible's Stats API is off the plan**, so page-level traffic data cannot be pulled programmatically. YouTube view counts and Search Console are the available signals.
