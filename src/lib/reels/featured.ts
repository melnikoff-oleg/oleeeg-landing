// The screen /reels opens on: 24 reels by the ten accounts in
// src/lib/featured/accounts.ts, mixed so no two in a row are the same person.
//
// The wall used to open on the whole library ordered by outlier score, which is
// the right answer to "what went furthest" and the wrong first thing to show a
// visitor: the biggest outliers in this corpus are brain rot, and the first
// screen is what somebody decides the whole database is. A rule over the scores
// was tried first and rejected -- see the header of the accounts module.
//
// This is a DEFAULT, never a restriction. Nothing here narrows what the filters
// or the search can reach; it only decides what is on screen before anyone has
// asked a question.
//
// Kept out of browse.ts because that module is one PostgREST read of reel_search
// with no opinion about which rows matter, and stays that way.

import "server-only";
import {
  FEATURED_ACCOUNTS,
  interleave,
  mixedAccounts,
} from "@/lib/featured/accounts";
import type { ReelTileRow } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** How many reels the default screen holds. Oleg's number: one screenful. */
export const FEATURED_REEL_COUNT = 24;

/**
 * How many of one account's reels may be read.
 *
 * The wall takes two or three from each of ten accounts, so this only has to be
 * comfortably above three. It exists so that mytechceo's 87 indexed reels do not
 * arrive to have 85 of them thrown away.
 */
const PER_ACCOUNT = 6;

/** Ten fields, not twenty-eight. The wall draws a thumbnail and four numbers. */
const TILE_COLUMNS = [
  "shortcode",
  "url",
  "account",
  "creator",
  "posted_on",
  "score",
  "views",
  "likes",
  "thumb_url",
].join(",");

/**
 * The 24 reels the page opens on.
 *
 * One read. Every reel these ten accounts have in the index comes back ordered
 * by outlier score, and the picking happens here: their best `PER_ACCOUNT` each,
 * then one from each account in turn until the screen is full. Ordering in SQL
 * and grouping in TypeScript rather than the other way round, because PostgREST
 * has no `distinct on` and a per-account query would be ten round trips.
 *
 * The same answer for every visitor and it only moves when sync.py runs, so it
 * is cached for a minute: after the first visitor of the minute the default
 * screen costs nothing at all. It deliberately carries no count, so there is no
 * number on screen that a stale read could contradict.
 *
 * Returns an empty array rather than throwing on an empty result, so the caller
 * can fall back to the ordinary wall. An empty front page is the one outcome
 * worse than an ugly one.
 */
export async function featuredReels(signal?: AbortSignal): Promise<ReelTileRow[]> {
  const params = new URLSearchParams();
  params.set("select", TILE_COLUMNS);
  // Instagram handles are [A-Za-z0-9._] and nothing else, so none of them can
  // break out of the list. The constant is checked rather than trusted, because
  // a typo added to it years from now should drop one account, not corrupt a
  // filter.
  const handles = FEATURED_ACCOUNTS.filter((a) => /^[A-Za-z0-9._]{1,64}$/.test(a));
  if (!handles.length) return [];
  params.set("account", `in.(${handles.join(",")})`);
  // Best first, and a reel whose score never got computed sorts to the very end
  // rather than to the top, which is where Postgres puts nulls by default.
  params.set("order", "score.desc.nullslast,posted_on.desc");
  // Everything these ten have. 287 rows today; the cap is a runaway guard, not a
  // budget, and a short read would only cost the tail of somebody's shelf.
  params.set("limit", String(handles.length * 100));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/reel_search?${params}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    signal,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`featured reels failed: ${res.status}`);
  const rows = (await res.json()) as ReelTileRow[];
  if (!Array.isArray(rows)) throw new Error("featured reels returned a non-array");

  // Their best few each, still in score order within an account.
  const groups = new Map<string, ReelTileRow[]>();
  for (const row of rows) {
    const group = groups.get(row.account);
    if (!group) groups.set(row.account, [row]);
    else if (group.length < PER_ACCOUNT) group.push(row);
  }

  return interleave(groups, mixedAccounts(), FEATURED_REEL_COUNT);
}
