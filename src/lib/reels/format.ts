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
 * "2026-04-26" -> "26 Apr 26". The grid version of formatDate.
 *
 * A thumbnail overlay has room for about ten characters, and the century is the
 * one part of a date nobody reading a reel from this decade needs.
 *
 * The months are spelled out here rather than left to `toLocaleDateString`,
 * which abbreviates September to "Sept" in en-GB. Four characters where every
 * other month has three is what pushes the overlay onto a second line on a
 * phone, and one wrapped tile in a grid of sixty reads as a bug.
 */
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "-";
  const year = String(d.getUTCFullYear() % 100).padStart(2, "0");
  return `${d.getUTCDate()} ${SHORT_MONTHS[d.getUTCMonth()]} ${year}`;
}
