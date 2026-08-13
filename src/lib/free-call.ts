// The free 30-minute customer-development call, offered site-wide.
//
// WHAT IT IS: Oleg is opening a short window to talk to the people who watch
// the videos and download the guides, so he learns what they are actually stuck
// on and can make better free stuff. It is deliberately NOT a sales call, and
// the copy says so, because the audience is a YouTube audience that has been
// pitched at by everyone else.
//
// ── REMOVE OR REFRESH AFTER 2026-08-23 ───────────────────────────────────────
// The window opened Thursday 2026-08-13 and runs to the end of the following
// week (Sunday 2026-08-23). The visible copy says "this week and next week
// only", which stops being true after that date. When the window closes, either
// delete the <FreeCallCta /> mounts (grep for FreeCallCta and FREE_CALL) or move
// the dates and rewrite LIMIT. A stale scarcity line is worse than no line.
//
// One source of truth for the copy so the Tailwind card
// (components/free-call-cta.tsx) and the inline-styled variant on the filmed
// pages (components/filmed-page-outro.tsx, which can carry no Tailwind and no
// client JS) can never drift apart.
//
// Copy rules in force here: no em or en dashes anywhere (site-wide rule, and
// tests/e2e/a11y-content.spec.ts asserts it), all lowercase in the site voice,
// third-grade reading level, and short enough that the badge + title + limit +
// button read in about ten seconds.

export const FREE_CALL = {
  url: "https://calendly.com/boldane/free-30min-consult",
  /** Small pill above the heading. Says the two things that matter first. */
  badge: "free 30 min call",
  title: "let's talk. it's free.",
  body: "ask me anything you're stuck on and i'll help. i just want to learn what you need, so i can make better videos for you.",
  /** The honest scarcity line. Dates, not vague urgency. */
  limit: "this week and next week only. spots are limited.",
  action: "book your free call",
  /** The reassurance, because the whole point is that this is not a pitch. */
  note: "not a sales call. i just want to learn.",
} as const;
