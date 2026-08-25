// The geometry behind every histogram-with-two-thumbs filter on the site.
//
// One implementation, shared by /viral-reels-browse (five filters over reels)
// and /viral-reels-creators (six over creators). It was written for the second
// and copied nowhere: a page's filter set is a list of SCALES handed to these
// functions, so adding a filter is a scale, and adding a page is a scale set.
//
// The geometry is exact rather than approximate, and that is load-bearing. A
// scale is a list of EDGES: bar i covers [edges[i], edges[i+1]) and thumb
// position i sits on edges[i], so a thumb always lands on a bar boundary and the
// highlighted bars are precisely the rows the filter will return. The moment
// those two disagree the chart becomes a decoration that lies.
//
// Nothing here reads a secret or touches the network, so both the server and the
// browser import it.

/**
 * Thumb positions, `[lo, hi]`, on a scale's edges. It selects bars lo to hi-1.
 *
 * `lo` is always strictly below `hi`, which is an invariant and not a
 * convention: lo === hi highlights NO bars while `boundsOf` reads it as
 * "everything from edges[lo] up", so the chart would show an empty selection
 * while the database returned rows. Both places a range can be born enforce it:
 * `readRange` rejects a collapsed pair as junk, and the slider keeps one bar
 * between its two thumbs.
 */
export type Range = [lo: number, hi: number];

/** How one scale says "under X", "X or more" and "anything". */
export type Phrase = {
  /** What the summary says when nothing is narrowed. */
  any: string;
  /** Only the top thumb has moved. */
  under: (to: string) => string;
  /** Only the bottom thumb has moved. */
  over: (from: string) => string;
  both: (from: string, to: string) => string;
};

export type Scale = {
  /** What the control calls itself. */
  label: string;
  /**
   * Ascending bin edges. Bar i covers [edges[i], edges[i+1]), so there are
   * edges.length - 1 bars and edges.length thumb positions, and a thumb always
   * sits on a bar boundary rather than in the middle of one.
   */
  edges: readonly number[];
  /** The query-string key. */
  param: string;
  /**
   * Whether the URL writes this filter as its real values or as thumb indices.
   *
   * The 1-10 scores write values, because "edu=4-8" is a sentence Oleg can read
   * off a shared link. The audience ladder and the age scale write indices:
   * their two ends are open, so "aud=10000-100000000" would read as a hard floor
   * and ceiling the slider does not actually apply, and their edges are not
   * unit-spaced, which value mode assumes.
   */
  urlIsValue: boolean;
  /** One edge value, written the way this scale writes numbers. */
  format: (edge: number) => string;
  phrase: Phrase;
  /** What a screen reader calls the bottom thumb. */
  minLabel?: string;
  /** What a screen reader calls the top thumb. */
  maxLabel?: string;
};

/** A page's filters: the keys, in display order, and a scale for each. */
export type FilterSet<K extends string> = {
  keys: readonly K[];
  scales: Record<K, Scale>;
};

export type Ranges<K extends string> = Record<K, Range>;

/**
 * One row of the index reduced to a bin index per filter, or null where the
 * number is missing. Same order as the set's `keys`.
 *
 * Bins rather than values on purpose. They are what the histogram counts and
 * what the client-side match count tests, they are equivalent to the values for
 * every thumb position (a bar boundary IS a bound), and they are small enough
 * that the whole index ships with the page, which is what lets the charts redraw
 * on every pixel of a drag instead of once a round trip.
 */
export type BinRow = readonly (number | null)[];

// --------------------------------------------------------------- the geometry

/** How many bars this scale's histogram has. */
export function barCount(scale: Scale): number {
  return scale.edges.length - 1;
}

/** The top thumb position: one past the last bar. */
export function topStop(scale: Scale): number {
  return scale.edges.length - 1;
}

export function fullRange(scale: Scale): Range {
  return [0, topStop(scale)];
}

/** True when this filter is asking nothing at all. */
export function isFullRange(scale: Scale, [lo, hi]: Range): boolean {
  return lo === 0 && hi === topStop(scale);
}

export function fullRanges<K extends string>(set: FilterSet<K>): Ranges<K> {
  const out = {} as Ranges<K>;
  for (const key of set.keys) out[key] = fullRange(set.scales[key]);
  return out;
}

/** True when nothing is set, so the page can skip rendering a "clear" affordance. */
export function rangesAreEmpty<K extends string>(
  set: FilterSet<K>,
  ranges: Ranges<K>,
): boolean {
  return set.keys.every((key) => isFullRange(set.scales[key], ranges[key]));
}

/**
 * Which bar a value lands in, or null when there is no value.
 *
 * Values below the first edge fold into the first bar and values at or above the
 * last fold into the last, so nothing falls off the chart. The FILTER does not
 * fold, and it does not need to: a row past the top edge is excluded by a range
 * that stops short of it and included by one whose top thumb is at the end,
 * which is exactly what the folded bin does too.
 */
export function binOf(scale: Scale, value: number | null | undefined): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const { edges } = scale;
  for (let i = edges.length - 2; i >= 0; i--) if (value >= edges[i]) return i;
  return 0;
}

/**
 * The bounds a range asks the database for.
 *
 * `below` is EXCLUSIVE. Bar i covers [edges[i], edges[i+1]), so a top thumb at
 * stop h selects bars 0 to h-1, which is everything strictly below edges[h]. An
 * inclusive bound would admit a row sitting exactly on the edge whose bar is not
 * highlighted, and the count on screen would disagree with the chart under it.
 * Null at either end means no bound at all.
 */
export function boundsOf(
  scale: Scale,
  [lo, hi]: Range,
): { min: number | null; below: number | null } {
  const { edges } = scale;
  return {
    min: lo === 0 ? null : edges[lo],
    below: hi === topStop(scale) ? null : edges[hi],
  };
}

/**
 * Does one bin clear one range?
 *
 * A range at full extent asks nothing, so it lets a null through: a row scored
 * after the last pass has no number, and hiding it from a filter nobody set
 * would be a filter nobody set. The moment either thumb moves the range is a
 * question, and a null cannot answer it.
 */
export function passes(scale: Scale, bin: number | null, range: Range): boolean {
  if (isFullRange(scale, range)) return true;
  if (bin === null) return false;
  const [lo, hi] = range;
  return lo <= bin && bin + 1 <= hi;
}

/** Does this row clear every filter except `except`? */
function passesExcept<K extends string>(
  set: FilterSet<K>,
  row: BinRow,
  ranges: Ranges<K>,
  except: K | null,
): boolean {
  for (const [i, key] of set.keys.entries()) {
    if (key === except) continue;
    if (!passes(set.scales[key], row[i] ?? null, ranges[key])) return false;
  }
  return true;
}

/**
 * One filter's histogram, counted over the rows the OTHER filters allow.
 *
 * This is the whole point of the cross-filter: pick 1M-10M creators and the
 * educational histogram redraws to describe only them, so the next filter is
 * chosen against what is actually left rather than against the whole library. A
 * filter never narrows its own histogram, or dragging a thumb would eat the bars
 * it is being dragged across.
 */
export function histogram<K extends string>(
  set: FilterSet<K>,
  rows: readonly BinRow[],
  ranges: Ranges<K>,
  key: K,
): number[] {
  const column = set.keys.indexOf(key);
  const bars = new Array<number>(barCount(set.scales[key])).fill(0);
  for (const row of rows) {
    if (!passesExcept(set, row, ranges, key)) continue;
    const bin = row[column];
    if (bin !== null && bin !== undefined) bars[bin] += 1;
  }
  return bars;
}

/** How many rows clear every filter. The number under the controls. */
export function matchCount<K extends string>(
  set: FilterSet<K>,
  rows: readonly BinRow[],
  ranges: Ranges<K>,
): number {
  let n = 0;
  for (const row of rows) if (passesExcept(set, row, ranges, null)) n += 1;
  return n;
}

// ------------------------------------------------------------ the query string

/** Two non-negative integers with one hyphen. Anything else is not a range. */
const RANGE_RE = /^(\d+)-(\d+)$/;

/**
 * Read one range off a URL param or an API body.
 *
 * Anything out of range becomes UNSET rather than clamped, which is the rule
 * every floor on these pages follows and for the same reason: a clamped 99
 * silently answers a question nobody asked and returns almost nothing, which
 * reads as an empty database rather than as a rejected input.
 */
export function readRange(scale: Scale, raw: unknown): Range {
  const full = fullRange(scale);
  if (typeof raw !== "string") return full;
  const m = RANGE_RE.exec(raw.trim());
  if (!m) return full;

  const base = scale.urlIsValue ? scale.edges[0] : 0;
  const lo = Number(m[1]) - base;
  const hi = Number(m[2]) - base + (scale.urlIsValue ? 1 : 0);

  const top = topStop(scale);
  // `lo >= hi`, not `lo > hi`: a collapsed pair selects no bars at all, and
  // boundsOf would still hand the database an open-ended lower bound. It is not
  // a range, so it reads as no filter.
  if (lo < 0 || hi > top || lo >= hi) return full;
  return [lo, hi];
}

/**
 * Move one thumb, keeping at least one bar between the two.
 *
 * The clamp is what makes `lo < hi` an invariant rather than a hope: a native
 * range input will happily drag its thumb onto the other one, and the pair that
 * lands there is the one case where the chart and the query disagree.
 */
export function moveThumb(
  scale: Scale,
  [lo, hi]: Range,
  end: "lo" | "hi",
  to: number,
): Range {
  const top = topStop(scale);
  const stop = Math.min(top, Math.max(0, Math.round(to)));
  return end === "lo"
    ? [Math.min(stop, hi - 1), hi]
    : [lo, Math.max(stop, lo + 1)];
}

/** The param value for one range, or null when it is asking nothing. */
export function writeRange(scale: Scale, range: Range): string | null {
  if (isFullRange(scale, range)) return null;
  return scale.urlIsValue
    ? `${scale.edges[range[0]]}-${scale.edges[range[1]] - 1}`
    : `${range[0]}-${range[1]}`;
}

export function readRanges<K extends string>(
  set: FilterSet<K>,
  raw: Record<string, unknown>,
): Ranges<K> {
  const out = {} as Ranges<K>;
  for (const key of set.keys) {
    out[key] = readRange(set.scales[key], raw[set.scales[key].param]);
  }
  return out;
}

/**
 * Put the ranges on a URLSearchParams, deleting every one that is unset.
 *
 * Deleting rather than writing an empty value keeps a shared link honest: a URL
 * with no `edu=` in it filters on nothing, which is exactly what it looks like.
 */
export function writeRanges<K extends string>(
  set: FilterSet<K>,
  params: URLSearchParams,
  ranges: Ranges<K>,
) {
  for (const key of set.keys) {
    const value = writeRange(set.scales[key], ranges[key]);
    if (value === null) params.delete(set.scales[key].param);
    else params.set(set.scales[key].param, value);
  }
}

/** The ranges as an API body: the same keys the URL uses, so one parser reads both. */
export function rangesToBody<K extends string>(
  set: FilterSet<K>,
  ranges: Ranges<K>,
): Record<string, string> {
  const body: Record<string, string> = {};
  for (const key of set.keys) {
    const value = writeRange(set.scales[key], ranges[key]);
    if (value !== null) body[set.scales[key].param] = value;
  }
  return body;
}

/** One string standing for a whole range set, for comparing two of them. */
export function rangesKey<K extends string>(
  set: FilterSet<K>,
  ranges: Ranges<K>,
): string {
  return set.keys.map((k) => ranges[k].join("-")).join("|");
}

// ----------------------------------------------------------------- the wording

/** The bottom of a range: the first value inside it. */
function lowEdge(scale: Scale, stop: number): string {
  return scale.format(scale.edges[stop]);
}

/**
 * The top of a range: the last value INSIDE it, not the exclusive edge.
 *
 * Only in value mode, where the values are whole numbers and "up to 7" means the
 * bound is 8. An index-mode scale has no such thing, so its top reads as the
 * edge itself.
 */
function highEdge(scale: Scale, stop: number): string {
  return scale.format(scale.urlIsValue ? scale.edges[stop] - 1 : scale.edges[stop]);
}

/** The summary beside the control: "1M to 10M", "7 or more", "any size". */
export function rangeLabel(scale: Scale, range: Range): string {
  if (isFullRange(scale, range)) return scale.phrase.any;
  const [lo, hi] = range;
  if (lo === 0) return scale.phrase.under(highEdge(scale, hi));
  if (hi === topStop(scale)) return scale.phrase.over(lowEdge(scale, lo));
  return scale.phrase.both(lowEdge(scale, lo), highEdge(scale, hi));
}

/** One bar of the histogram, for its tooltip: "25K to 50K", or "6". */
export function barLabel(scale: Scale, bar: number): string {
  return scale.urlIsValue
    ? scale.format(scale.edges[bar])
    : `${scale.format(scale.edges[bar])} to ${scale.format(scale.edges[bar + 1])}`;
}

/** What a screen reader reads off the low thumb. */
export function lowThumbLabel(scale: Scale, [lo]: Range): string {
  return lo === 0 ? "no minimum" : `at least ${lowEdge(scale, lo)}`;
}

/** What a screen reader reads off the high thumb. */
export function highThumbLabel(scale: Scale, [, hi]: Range): string {
  return hi === topStop(scale) ? "no maximum" : `at most ${highEdge(scale, hi)}`;
}

// -------------------------------------------------------------------- packing
//
// The reel index is 4,896 rows where the creator index is 245, so the tuple-of-
// numbers shape that ships fine for one is 120 KB of page for the other. A bin
// index is never above 35 on any scale here, so one row is one character per
// filter and the whole library is a 25 KB string.

const BIN_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";
/** No number for this row on this scale. Never a bin, so it cannot be confused
 *  with bin 0. */
const NO_BIN = "-";

/** Bins to a string, `width` characters a row. Throws on a bin it cannot write,
 *  rather than writing a character that decodes to something else. */
export function packBins(rows: readonly BinRow[]): string {
  let out = "";
  for (const row of rows) {
    for (const bin of row) {
      if (bin === null || bin === undefined) {
        out += NO_BIN;
        continue;
      }
      if (!Number.isInteger(bin) || bin < 0 || bin >= BIN_CHARS.length) {
        throw new Error(`bin ${bin} does not fit one character`);
      }
      out += BIN_CHARS[bin];
    }
  }
  return out;
}

/**
 * A packed string back into rows.
 *
 * A trailing partial row is dropped rather than padded: half a row is not a row,
 * and padding it would invent a bin. An unknown character reads as "no number",
 * which is the same thing a missing score already means.
 */
export function unpackBins(packed: string, width: number): BinRow[] {
  if (width < 1) return [];
  const rows: BinRow[] = [];
  for (let i = 0; i + width <= packed.length; i += width) {
    const row: (number | null)[] = [];
    for (let c = 0; c < width; c++) {
      const bin = BIN_CHARS.indexOf(packed[i + c]);
      row.push(bin === -1 ? null : bin);
    }
    rows.push(row);
  }
  return rows;
}
