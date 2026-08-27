import { test, expect } from "@playwright/test";
import {
  barCount,
  barLabel,
  binOf,
  boundsOf,
  fullRange,
  fullRanges,
  highThumbLabel,
  histogram,
  isFullRange,
  lowThumbLabel,
  matchCount,
  moveThumb,
  packBins,
  passes,
  rangeLabel,
  rangesAreEmpty,
  rangesKey,
  rangesToBody,
  readRange,
  readRanges,
  topStop,
  unpackBins,
  writeRange,
  writeRanges,
  type BinRow,
  type FilterSet,
  type Range,
} from "../../src/lib/filters/range";
import {
  ageBounds,
  ageInDays,
  daysBefore,
  NO_REEL_FILTERS,
  REEL_BIN_WIDTH,
  REEL_FILTERS,
  REEL_FILTER_KEYS,
  type ReelFilterKey,
} from "../../src/lib/reels/filters";
import { formatAge } from "../../src/lib/reels/format";

// Tests 200+: the filter geometry behind /reels and
// /creators. Pure functions, no browser, no network, no secrets:
// they run in every environment and they are the only place the "a thumb sits
// on a bar boundary" rule is actually checked.

const S = REEL_FILTERS.scales;

test.describe("scale geometry", () => {
  test("edges make one more thumb position than bars", () => {
    for (const key of REEL_FILTER_KEYS) {
      expect(topStop(S[key])).toBe(barCount(S[key]) + 0);
      expect(barCount(S[key])).toBe(S[key].edges.length - 1);
    }
  });

  test("every scale's edges strictly ascend", () => {
    for (const key of REEL_FILTER_KEYS) {
      const { edges } = S[key];
      for (let i = 1; i < edges.length; i++) {
        expect(edges[i]).toBeGreaterThan(edges[i - 1]);
      }
    }
  });

  test("a full range asks nothing and lets a null through", () => {
    for (const key of REEL_FILTER_KEYS) {
      const full = fullRange(S[key]);
      expect(isFullRange(S[key], full)).toBe(true);
      expect(boundsOf(S[key], full)).toEqual({ min: null, below: null });
      expect(passes(S[key], null, full)).toBe(true);
    }
    expect(rangesAreEmpty(REEL_FILTERS, NO_REEL_FILTERS)).toBe(true);
  });

  test("a narrowed range excludes a row with no number", () => {
    expect(passes(S.educational, null, [3, 10])).toBe(false);
  });

  test("the top bound is exclusive, so the chart and the count agree", () => {
    // Score bar 6 covers [7, 8): a top thumb at stop 7 means "below 7".
    expect(boundsOf(S.educational, [0, 7])).toEqual({ min: null, below: 8 });
    expect(boundsOf(S.educational, [6, 10])).toEqual({ min: 7, below: null });
    // A value sitting exactly on the exclusive edge is out, and its bar is not
    // highlighted either.
    expect(passes(S.educational, binOf(S.educational, 8), [0, 7])).toBe(false);
    expect(passes(S.educational, binOf(S.educational, 7), [0, 7])).toBe(true);
  });

  test("bins fold at both ends so nothing falls off the chart", () => {
    // Below the first edge and above the last both land on a real bar.
    expect(binOf(S.followers, 1)).toBe(0);
    expect(binOf(S.followers, 900_000_000)).toBe(barCount(S.followers) - 1);
    expect(binOf(S.followers, null)).toBe(null);
    expect(binOf(S.followers, Number.NaN)).toBe(null);
  });

  test("a bin is equivalent to the bound it came from, at every thumb", () => {
    // The whole reason the histogram can be counted off bins instead of values:
    // if these ever disagree the chart becomes a decoration that lies.
    const scale = S.followers;
    const values = [0, 9_999, 10_000, 60_000, 999_999, 1_000_000, 5e8];
    for (let lo = 0; lo < topStop(scale); lo++) {
      for (let hi = lo + 1; hi <= topStop(scale); hi++) {
        const range: Range = [lo, hi];
        const { min, below } = boundsOf(scale, range);
        for (const v of values) {
          const byBound =
            (min === null || v >= min) && (below === null || v < below);
          expect(passes(scale, binOf(scale, v), range)).toBe(byBound);
        }
      }
    }
  });
});

test.describe("the query string", () => {
  test("a score round-trips as its own values", () => {
    expect(writeRange(S.educational, [3, 8])).toBe("4-8");
    expect(readRange(S.educational, "4-8")).toEqual([3, 8]);
  });

  test("an index-mode scale round-trips as thumb positions", () => {
    expect(writeRange(S.followers, [2, 7])).toBe("2-7");
    expect(readRange(S.followers, "2-7")).toEqual([2, 7]);
    expect(writeRange(S.age, [1, 4])).toBe("1-4");
    expect(readRange(S.age, "1-4")).toEqual([1, 4]);
  });

  test("an unset range writes nothing at all", () => {
    for (const key of REEL_FILTER_KEYS) {
      expect(writeRange(S[key], fullRange(S[key]))).toBe(null);
    }
    const params = new URLSearchParams("aud=2-7&edu=4-8");
    writeRanges(REEL_FILTERS, params, NO_REEL_FILTERS);
    expect(params.toString()).toBe("");
    expect(rangesToBody(REEL_FILTERS, NO_REEL_FILTERS)).toEqual({});
  });

  test("junk reads as unset rather than being clamped", () => {
    const junk = ["", "nonsense", "-1-4", "4", "4-", "9-2", "0-99", "3.5-6", null, 7];
    for (const raw of junk) {
      expect(readRange(S.educational, raw)).toEqual(fullRange(S.educational));
    }
    // An out-of-range pair on the audience ladder too.
    expect(readRange(S.followers, "0-99")).toEqual(fullRange(S.followers));
  });

  test("every scale uses a different param, and readRanges finds each", () => {
    const params = REEL_FILTER_KEYS.map((k) => S[k].param);
    expect(new Set(params).size).toBe(params.length);

    const read = readRanges(REEL_FILTERS, {
      aud: "2-7",
      posted: "0-3",
      ent: "6-10",
      edu: "1-3",
      insp: "8-10",
    });
    expect(read.followers).toEqual([2, 7]);
    expect(read.age).toEqual([0, 3]);
    expect(read.entertaining).toEqual([5, 10]);
    expect(read.educational).toEqual([0, 3]);
    expect(read.inspirational).toEqual([7, 10]);
  });

  test("a round trip through a URL reproduces the ranges exactly", () => {
    const ranges = { ...NO_REEL_FILTERS, followers: [1, 6] as Range, educational: [4, 9] as Range };
    const params = new URLSearchParams();
    writeRanges(REEL_FILTERS, params, ranges);
    expect(readRanges(REEL_FILTERS, Object.fromEntries(params.entries()))).toEqual(ranges);
  });

  test("a collapsed pair is not a range", () => {
    // lo === hi highlights no bars at all, while boundsOf would read it as
    // "everything from edges[lo] up". It reads as no filter instead.
    expect(readRange(S.followers, "12-12")).toEqual(fullRange(S.followers));
    expect(readRange(S.educational, "7-6")).toEqual(fullRange(S.educational));
  });

  test("a thumb cannot be dragged onto the other one", () => {
    // Both thumbs to the far right.
    expect(moveThumb(S.followers, [0, 12], "lo", 12)).toEqual([11, 12]);
    // Both to the far left.
    expect(moveThumb(S.followers, [0, 12], "hi", 0)).toEqual([0, 1]);
    // And an out-of-range drag is clamped onto the scale, not rejected.
    expect(moveThumb(S.followers, [0, 12], "lo", 99)).toEqual([11, 12]);
    expect(moveThumb(S.followers, [3, 8], "lo", -4)).toEqual([0, 8]);
  });

  test("rangesKey separates two different filter sets", () => {
    const a = rangesKey(REEL_FILTERS, NO_REEL_FILTERS);
    const b = rangesKey(REEL_FILTERS, { ...NO_REEL_FILTERS, age: [0, 2] });
    expect(a).not.toBe(b);
    expect(rangesKey(REEL_FILTERS, fullRanges(REEL_FILTERS))).toBe(a);
  });
});

test.describe("the wording", () => {
  test("a score range reads as whole numbers inside it", () => {
    expect(rangeLabel(S.educational, fullRange(S.educational))).toBe("any");
    expect(rangeLabel(S.educational, [0, 8])).toBe("8 or less");
    expect(rangeLabel(S.educational, [6, 10])).toBe("7 or more");
    expect(rangeLabel(S.educational, [3, 8])).toBe("4 to 8");
    expect(barLabel(S.educational, 6)).toBe("7");
  });

  test("the audience range reads in the library's own shorthand", () => {
    expect(rangeLabel(S.followers, fullRange(S.followers))).toBe("any size");
    expect(rangeLabel(S.followers, [0, 4])).toBe("under 250K");
    expect(rangeLabel(S.followers, [6, 12])).toBe("1M+");
    expect(barLabel(S.followers, 0)).toBe("10K to 25K");
  });

  test("the age range reads as time, newest first", () => {
    expect(rangeLabel(S.age, fullRange(S.age))).toBe("any time");
    expect(rangeLabel(S.age, [0, 3])).toBe("last 1 month");
    expect(rangeLabel(S.age, [7, 9])).toBe("older than 1 year");
    expect(rangeLabel(S.age, [1, 5])).toBe("1 week to 3 months ago");
  });

  test("formatAge steps its unit up as the answer gets older", () => {
    expect(formatAge(1)).toBe("1 day");
    expect(formatAge(7)).toBe("1 week");
    expect(formatAge(14)).toBe("2 weeks");
    expect(formatAge(30)).toBe("1 month");
    expect(formatAge(90)).toBe("3 months");
    expect(formatAge(180)).toBe("6 months");
    expect(formatAge(365)).toBe("1 year");
    expect(formatAge(730)).toBe("2 years");
  });

  test("an untouched thumb reads as no bound", () => {
    for (const key of REEL_FILTER_KEYS) {
      const full = fullRange(S[key]);
      expect(lowThumbLabel(S[key], full)).toBe("no minimum");
      expect(highThumbLabel(S[key], full)).toBe("no maximum");
    }
    expect(lowThumbLabel(S.educational, [3, 11])).toBe("at least 4");
    expect(highThumbLabel(S.educational, [0, 8])).toBe("at most 8");
  });
});

test.describe("histograms", () => {
  // Five reels, as bins, in REEL_FILTER_KEYS order:
  // followers, age, entertaining, educational, inspirational.
  const rows: BinRow[] = [
    [0, 0, 9, 0, 0], // tiny account, posted this week, 10/1/1
    [0, 0, 9, 0, 0],
    [5, 4, 0, 8, 0], // 500K, two months old, 1/9/1
    [11, 8, 4, 4, 4], // huge, ancient, all 5s
    [5, 4, 0, null, 0], // 500K, two months old, never scored on educational
  ];

  test("with nothing set, a histogram counts the whole index", () => {
    const bars = histogram(REEL_FILTERS, rows, NO_REEL_FILTERS, "followers");
    expect(bars[0]).toBe(2);
    expect(bars[5]).toBe(2);
    expect(bars[11]).toBe(1);
    expect(bars.reduce((a, b) => a + b, 0)).toBe(5);
    expect(matchCount(REEL_FILTERS, rows, NO_REEL_FILTERS)).toBe(5);
  });

  test("a filter narrows every chart except its own", () => {
    const ranges = { ...NO_REEL_FILTERS, followers: [5, 6] as Range };
    // Its own chart is untouched, or a thumb would eat the bars it is dragged
    // across.
    expect(histogram(REEL_FILTERS, rows, ranges, "followers").reduce((a, b) => a + b, 0)).toBe(5);
    // Every other chart now describes the two 500K reels alone.
    expect(histogram(REEL_FILTERS, rows, ranges, "age").reduce((a, b) => a + b, 0)).toBe(2);
    expect(matchCount(REEL_FILTERS, rows, ranges)).toBe(2);
  });

  test("a row with no number is counted nowhere but excluded only when asked", () => {
    // The unscored reel is absent from the educational chart either way.
    const bars = histogram(REEL_FILTERS, rows, NO_REEL_FILTERS, "educational");
    expect(bars.reduce((a, b) => a + b, 0)).toBe(4);
    // But it still matches while the filter is unset...
    expect(matchCount(REEL_FILTERS, rows, NO_REEL_FILTERS)).toBe(5);
    // ...and drops out the moment educational becomes a question, even one
    // every scored reel here answers.
    const asked = { ...NO_REEL_FILTERS, educational: [0, 9] as Range };
    expect(matchCount(REEL_FILTERS, rows, asked)).toBe(4);
  });

  test("filters compose", () => {
    const ranges = {
      ...NO_REEL_FILTERS,
      followers: [0, 1] as Range,
      entertaining: [8, 10] as Range,
    };
    expect(matchCount(REEL_FILTERS, rows, ranges)).toBe(2);
  });
});

test.describe("packing", () => {
  test("bins survive a round trip", () => {
    const rows: BinRow[] = [
      [0, 1, 2, 3, 4],
      [11, 8, 9, null, 0],
    ];
    const packed = packBins(rows);
    expect(packed.length).toBe(rows.length * REEL_BIN_WIDTH);
    expect(unpackBins(packed, REEL_BIN_WIDTH)).toEqual(rows);
  });

  test("a missing number is not bin zero", () => {
    expect(packBins([[null]])).not.toBe(packBins([[0]]));
    expect(unpackBins(packBins([[null]]), 1)).toEqual([[null]]);
  });

  test("a bin too big to write throws rather than lying", () => {
    expect(() => packBins([[36]])).toThrow();
    expect(() => packBins([[-1]])).toThrow();
    expect(() => packBins([[1.5]])).toThrow();
  });

  test("a truncated payload drops the half row rather than padding it", () => {
    expect(unpackBins("012340123", 5)).toEqual([[0, 1, 2, 3, 4]]);
    expect(unpackBins("", 5)).toEqual([]);
  });

  test("every bin a reel scale can produce fits one character", () => {
    for (const key of REEL_FILTER_KEYS) {
      expect(barCount(S[key])).toBeLessThanOrEqual(36);
    }
  });
});

test.describe("the age filter in dates", () => {
  const today = new Date("2026-08-25T12:00:00Z");

  test("an untouched range asks for no dates", () => {
    expect(ageBounds(fullRange(S.age), today)).toEqual({ from: null, after: null });
  });

  test("the last month is one exclusive lower bound", () => {
    // [0, 3] = 0 to 30 days old: posted after 2026-07-26, no upper age bound.
    expect(ageBounds([0, 3], today)).toEqual({ from: null, after: "2026-07-26" });
  });

  test("older than a year is one upper bound", () => {
    expect(ageBounds([7, 9], today)).toEqual({ from: "2025-08-25", after: null });
  });

  test("a middle bucket is both, and they do not overlap the next one", () => {
    const a = ageBounds([1, 3], today); // 7 to 30 days old
    const b = ageBounds([3, 5], today); // 30 to 90 days old
    expect(a.from).toBe("2026-08-18");
    expect(a.after).toBe("2026-07-26");
    // a's exclusive floor is b's inclusive ceiling, so no reel is in both and
    // none falls between them.
    expect(a.after).toBe(b.from);
  });

  test("daysBefore crosses a month and a year correctly", () => {
    expect(daysBefore(new Date("2026-03-01T00:00:00Z"), 1)).toBe("2026-02-28");
    expect(daysBefore(new Date("2026-01-01T00:00:00Z"), 1)).toBe("2025-12-31");
  });

  test("ageInDays counts whole days and never goes negative", () => {
    expect(ageInDays("2026-08-25", today)).toBe(0);
    expect(ageInDays("2026-08-18", today)).toBe(7);
    expect(ageInDays("2026-09-01", today)).toBe(0);
    expect(ageInDays(null, today)).toBe(null);
    expect(ageInDays("not a date", today)).toBe(null);
  });

  test("an age lands in the bucket its own bounds describe", () => {
    for (let days = 0; days < 900; days += 1) {
      const bin = binOf(S.age, days);
      expect(bin).not.toBe(null);
      const range: Range = [bin as number, (bin as number) + 1];
      const { from, after } = ageBounds(range, today);
      const posted = daysBefore(today, days);
      if (from !== null) expect(posted <= from).toBe(true);
      if (after !== null) expect(posted > after).toBe(true);
    }
  });
});

test.describe("the reel filter set", () => {
  test("carries exactly the five filters Oleg asked for", () => {
    expect([...REEL_FILTER_KEYS]).toEqual([
      "followers",
      "age",
      "entertaining",
      "educational",
      "inspirational",
    ]);
    // Worth studying and doing well are creator judgements and stay on the
    // creator page; they were dropped from the library by name.
    const set: FilterSet<ReelFilterKey> = REEL_FILTERS;
    expect(Object.keys(set.scales).sort()).toEqual(
      ["age", "educational", "entertaining", "followers", "inspirational"].sort(),
    );
  });

  test("the packed width matches the number of filters", () => {
    expect(REEL_BIN_WIDTH).toBe(REEL_FILTER_KEYS.length);
  });
});
