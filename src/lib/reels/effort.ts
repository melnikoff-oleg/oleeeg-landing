// How much work a reel would be to make.
//
// The database has no production-cost column, and adding one would mean a paid
// re-analysis of all 1033 reels. It does not need one: every row already
// carries `shots` (a plain integer, "1" through "40"), `duration_sec`, and the
// analysis prose, which is where the crew, the props and the effects actually
// get described. This module reads those and returns one of three levels.
//
// It is a heuristic and it is meant to be. It exists so the chat can offer
// "only show me things I could film today" as a real filter rather than a
// promise, and so a card can carry an honest label. The model still sees the
// full write-up and can disagree with it in prose.

import type { ReelRow } from "./types";

/** Ordered cheapest first. The ordinal is what the tool filters on. */
export const EFFORT_LEVELS = ["easy", "medium", "hard"] as const;
export type Effort = (typeof EFFORT_LEVELS)[number];

export type EffortVerdict = {
  level: Effort;
  /** 1, 2, 3. Ordinal so `max_effort: 2` is a comparison, not a set. */
  rank: number;
  /** One short phrase, shown on the card and given to the model. */
  reason: string;
};

/**
 * Things you cannot do by trying harder: a skill, a crew, or a permit.
 *
 * Deliberately narrow. A word that merely appears near expensive work (like
 * "camera") would catch every reel ever filmed, so each entry here has to name
 * the expensive thing itself.
 */
const HARD = [
  "visual effect",
  "vfx",
  "cgi",
  "green screen",
  "chroma key",
  "magic trick",
  "camera trick",
  "seamless transition",
  "match cut",
  "invisible cut",
  "stop motion",
  "stunt",
  "drone",
  "aerial shot",
  "prosthetic",
  "set build",
  "film crew",
  "cast of",
  "location shoot",
  "underwater",
  "motion control",
];

/**
 * Gear and bodies: a step up from a phone in your hand, not a production.
 *
 * These used to sit in HARD and were the main source of wrong answers. Two men
 * talking to each other about flags was being called hard because the write-up
 * happened to mention studio lighting. Borrowing a light or roping in a friend
 * is a medium, and calling it hard hides exactly the reels a small creator
 * could copy this week.
 */
const NEEDS_SETUP = [
  "studio lighting",
  "professional camera",
  "cinema camera",
  "slider shot",
  "costume change",
  "multiple actors",
  "second person filming",
];

/**
 * The 2026 exception, and the reason this file exists at all.
 *
 * A reel that looks like a week of VFX can now be a prompt and twenty minutes.
 * These markers beat the HARD list rather than adding to it: an AI-generated
 * shot is not free, but it is a tool you rent, not a crew you hire, so it lands
 * at medium however impossible the result looks.
 */
const AI_MADE = [
  "ai video",
  "ai generated",
  "ai-generated",
  "ai film",
  "ai filmmaker",
  "generative video",
  "text to video",
  "veo",
  "sora",
  "midjourney",
  "runway",
  "kling",
  "higgsfield",
  "ai avatar",
  "ai voice",
];

/** Markers of a reel that is one person, one room, one sitting. */
const CHEAP = [
  "talking to camera",
  "talking directly to the camera",
  "speaks directly",
  "piece to camera",
  "selfie",
  "front camera",
  "screen recording",
  "screen record",
  "phone screen",
  "voiceover",
  "voice over",
  "text on screen",
  "one take",
  "single take",
  "single continuous shot",
  "one continuous shot",
  "handheld",
  "simple key props",
  "no props",
  "sitting at a desk",
];

/** Everything a reel says about itself, lowercased once. */
function haystack(reel: ReelRow): string {
  return [
    reel.idea,
    reel.hook_summary,
    reel.retain_summary,
    reel.reward_summary,
    ...(reel.hook_points ?? []),
    ...(reel.retain_points ?? []),
    ...(reel.reward_points ?? []),
    ...(reel.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hit(text: string, markers: string[]): string | null {
  for (const m of markers) if (text.includes(m)) return m;
  return null;
}

/** `shots` is stored as text but holds an integer. Junk reads as unknown. */
function shotCount(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const RANK: Record<Effort, number> = { easy: 1, medium: 2, hard: 3 };

export function estimateEffort(reel: ReelRow): EffortVerdict {
  const text = haystack(reel);
  const shots = shotCount(reel.shots);
  const secs = reel.duration_sec ?? 0;

  const verdict = (level: Effort, reason: string): EffortVerdict => ({
    level,
    rank: RANK[level],
    reason,
  });

  // Checked before HARD on purpose: an AI shot matches both lists, and the
  // whole point is that it is no longer the expensive one.
  const ai = hit(text, AI_MADE);
  if (ai) return verdict("medium", `made with AI tools (${ai})`);

  const hard = hit(text, HARD);
  if (hard) return verdict("hard", `needs ${hard}`);

  // A pile of shots is editing time, not money, so it can never on its own make
  // a reel hard. The one exception is a pile of shots across a long runtime,
  // which is not an evening at a laptop, it is a day of filming.
  const bigShoot = shots !== null && shots > 25 && secs > 60;
  if (bigShoot) return verdict("hard", `${shots} shots over ${Math.round(secs)}s`);

  const setup = hit(text, NEEDS_SETUP);

  // Base level from the two numbers every row has.
  let level: Effort;
  if (shots === null) level = "medium";
  else if (shots <= 3) level = "easy";
  else level = "medium";

  // A long reel is a long day whatever the shot count says.
  if (secs > 60) level = "medium";

  const cheap = hit(text, CHEAP);
  // A cheap marker cannot undo a setup the reel says it needed, and it cannot
  // undo a long cut list either: "voiceover" on a 41-shot reel describes how the
  // sound was made, not how long the edit took.
  const manyCuts = shots !== null && shots > 12;
  if (cheap && level === "medium" && !setup && !manyCuts) {
    return verdict("easy", cheap);
  }
  if (setup && level === "easy") return verdict("medium", `needs ${setup}`);

  if (level === "easy") {
    return verdict(
      "easy",
      shots === null ? "short and simple" : `${shots} shot${shots === 1 ? "" : "s"}`,
    );
  }
  if (setup) return verdict("medium", `needs ${setup}`);
  return verdict(
    "medium",
    shots === null ? "a real edit" : `${shots} shots to cut together`,
  );
}

/** Parse an untrusted `max_effort` into a rank, or null for no filter. */
export function normalizeMaxEffort(raw: unknown): number | null {
  if (typeof raw === "string") {
    const found = EFFORT_LEVELS.indexOf(raw.trim().toLowerCase() as Effort);
    return found >= 0 ? found + 1 : null;
  }
  if (typeof raw === "number" && Number.isInteger(raw)) {
    return Math.min(3, Math.max(1, raw));
  }
  return null;
}
