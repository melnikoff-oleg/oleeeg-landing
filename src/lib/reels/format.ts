// Presentation helpers for the reel cards. Pure functions, no React, so the
// number rules live in one place and can be checked without a browser.

const UNITS = [
  { at: 1_000_000_000, suffix: "B" },
  { at: 1_000_000, suffix: "M" },
  { at: 1_000, suffix: "K" },
] as const;

/** 271463033 -> "271M". Instagram's own shorthand, so the card reads like the app. */
export function compactNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "-";
  const abs = Math.abs(n);
  for (const [i, unit] of UNITS.entries()) {
    if (abs < unit.at) continue;
    const value = round(n / unit.at);
    // Rounding can push a value up into the next unit: 999,500 views is 999.5K
    // before rounding and "1000K" after it, which is not a number anyone writes.
    if (Math.abs(value) >= 1000 && i > 0) return `1${UNITS[i - 1].suffix}`;
    return `${value}${unit.suffix}`;
  }
  return String(Math.round(n));
}

// One decimal below ten so 1.4M does not collapse to 1M, none above it so 271M
// does not become 271.5M and cost a character for no information.
function round(v: number): number {
  return Math.abs(v) < 10 ? Math.round(v * 10) / 10 : Math.round(v);
}

/** "2026-04-26" -> "26 Apr 2026". Parsed as UTC so the day never shifts west. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** 14.2 -> "14s", 75 -> "1:15". */
export function formatDuration(sec: number | null | undefined): string {
  if (!sec || !Number.isFinite(sec) || sec <= 0) return "-";
  const whole = Math.round(sec);
  if (whole < 60) return `${whole}s`;
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** Likes per view, as the percentage the reel database gates on. */
export function engagementRate(
  likes: number | null | undefined,
  views: number | null | undefined,
): string {
  // A missing count is unknown; a zero one is a real answer, so only the
  // divisor can disqualify the sum.
  if (likes === null || likes === undefined || !views) return "-";
  return `${((likes / views) * 100).toFixed(1)}%`;
}

/**
 * The outlier score, rounded for display.
 *
 * It is views over the square root of the creator's follower count, so a reel
 * that beat its own audience scores high whether the account is small or huge.
 * Everything in the database clears 5.
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || !Number.isFinite(score)) return "-";
  if (score >= 100) return String(Math.round(score));
  return score.toFixed(1);
}

/**
 * "2026-04-26" -> "5 days ago". How old a reel is, in the coarsest useful unit.
 *
 * A grid of sixty stills is read as a run of form, and "3 weeks ago" answers
 * that in one glance where "2 Aug 26" makes the reader do the subtraction. The
 * unit steps up as the answer gets older, because nobody needs "63 days ago".
 *
 * Computed against the server's clock on a page that is already force-dynamic,
 * so there is no cached "2 days ago" going stale and no hydration mismatch.
 */
const DAY_MS = 86_400_000;

function ago(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "-";
  const then = Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(then)) return "-";

  // Floored, so a reel is "1 day ago" for the whole of the day after it landed
  // rather than for one hour of it. A future date means a clock disagreement,
  // not a scheduled post, and reads as today.
  const days = Math.floor((Date.now() - then) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return ago(days, "day");
  if (days < 30) return ago(Math.floor(days / 7), "week");
  // 30.44 and 365.25 rather than 30 and 365: over the four-year span this
  // library covers, the rounder numbers drift a reel a whole month early.
  if (days < 365) return ago(Math.max(1, Math.floor(days / 30.44)), "month");
  return ago(Math.max(1, Math.floor(days / 365.25)), "year");
}
