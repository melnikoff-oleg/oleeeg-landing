// Which pictures the browser is told to fetch, and in what order.
//
// A wall answer is up to 120 reels and every thumbnail is about 57 KB, so the
// pictures are two thirds of a minute's bandwidth and all of the time between
// "the answer arrived" and "I can see the answer". Before this file every tile
// on the wall was `loading="lazy"`, the top row included, which is the one
// setting that guarantees the four pictures the visitor is actually looking at
// are fetched no earlier than the ninety they are not.
//
// Three bands, and the middle one is the part that is easy to get wrong:
//
//   the lead      eager, high  -- the top row, the only thing on screen
//   the screen    eager, low   -- fetched now, but yielding to the lead
//   the rest      lazy         -- not fetched until it is scrolled towards
//
// The middle band is `low` and not `high` because these all share one HTTP/2
// connection to the thumbnail bucket. Priority there is relative: twenty
// pictures each claiming to be the most important share the bandwidth equally,
// which is exactly the state we are trying to leave. Four high and sixteen low
// gets the top row painted while the rest arrive underneath it.

/** One row of the desktop wall. Four to a row, hairline gaps. */
export const LEAD_TILES = 4;

/**
 * How many are fetched without waiting to be scrolled towards. A screenful and
 * a little: enough that a small scroll finds pictures already there, few enough
 * that an answer of 120 does not open 120 requests.
 */
export const EAGER_TILES = 24;

export type TileImage = {
  loading: "eager" | "lazy";
  fetchPriority: "high" | "low" | "auto";
};

const LEAD: TileImage = { loading: "eager", fetchPriority: "high" };
const SCREEN: TileImage = { loading: "eager", fetchPriority: "low" };
const REST: TileImage = { loading: "lazy", fetchPriority: "auto" };

/** How the tile at `index` should ask for its picture. */
export function tileImage(index: number): TileImage {
  // A NaN compares false against everything, so it would fall through both
  // bands and land on the lead by accident. The safe end of this range is the
  // lazy one: a picture fetched late is a picture, a picture fetched eagerly
  // for a tile nobody can see is stolen bandwidth.
  if (!Number.isFinite(index)) return REST;
  if (index < LEAD_TILES) return LEAD;
  if (index < EAGER_TILES) return SCREEN;
  return REST;
}
