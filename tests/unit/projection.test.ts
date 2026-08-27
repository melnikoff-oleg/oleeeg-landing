import { test } from "node:test";
import assert from "node:assert/strict";
import { REEL_TILE_COLUMNS, REEL_TILE_SELECT, toTileRow } from "@/lib/reels/types";
import { CREATOR_TILE_COLUMNS, CREATOR_TILE_SELECT, toCreatorTile } from "@/lib/creators/types";

// The whole point of these lists is that the database stops sending what the
// page never reads. Measured 2026-08-27 against the live project: the reel
// match returned 501 KB where the wall reads 66 KB of it, and the creator match
// 140 KB where the cards read 22 KB. That waste was crossing an ocean.
//
// The risk the lists introduce is drift: a column added to the tile and not to
// the select arrives undefined, which renders as a blank number rather than as
// an error. So the two are checked against each other here.

const REEL_ROW = Object.fromEntries(
  [...REEL_TILE_COLUMNS, "similarity", "caption", "idea", "tags"].map((k) => [k, 1]),
);
const CREATOR_ROW = Object.fromEntries(
  [...CREATOR_TILE_COLUMNS, "similarity", "rank_score", "tags", "top_ideas"].map((k) => [k, 1]),
);

test("the reel select asks for the tile's columns and similarity, nothing more", () => {
  assert.deepEqual(REEL_TILE_SELECT.split(","), [...REEL_TILE_COLUMNS, "similarity"]);
});

test("the creator select asks for the card's columns, similarity and the rank it is ordered by", () => {
  assert.deepEqual(CREATOR_TILE_SELECT.split(","), [
    ...CREATOR_TILE_COLUMNS,
    "similarity",
    "rank_score",
  ]);
});

test("a projected reel row survives toTileRow with nothing missing", () => {
  const tile = toTileRow(REEL_ROW as never);
  for (const column of REEL_TILE_COLUMNS) {
    assert.notEqual(tile[column], undefined, `${column} did not survive`);
  }
  assert.equal(tile.similarity, 1);
});

test("a projected creator row survives toCreatorTile with nothing missing", () => {
  const card = toCreatorTile(CREATOR_ROW as never);
  for (const column of CREATOR_TILE_COLUMNS) {
    assert.notEqual(card[column], undefined, `${column} did not survive`);
  }
  assert.equal(card.similarity, 1);
});

test("neither select carries a column the tile does not use", () => {
  // The direction the type system cannot check. `Pick` will complain about a
  // column that does not exist on the row; nothing complains about a column
  // that exists, is fetched, crosses the network and is then dropped.
  const reel = toTileRow(REEL_ROW as never);
  assert.deepEqual(Object.keys(reel).sort(), [...REEL_TILE_COLUMNS, "similarity"].sort());
  const creator = toCreatorTile(CREATOR_ROW as never);
  assert.deepEqual(Object.keys(creator).sort(), [...CREATOR_TILE_COLUMNS, "similarity"].sort());
});

test("no column name could be mistaken for PostgREST syntax", () => {
  // The lists go into a query string as a comma-separated select. A name with
  // a comma, a colon or a bracket in it would parse as a rename, an embed or a
  // cast, and the request would come back short rather than fail.
  for (const column of [...REEL_TILE_COLUMNS, ...CREATOR_TILE_COLUMNS]) {
    assert.match(column, /^[a-z_][a-z0-9_]*$/, column);
  }
});
