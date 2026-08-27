// GET /api/viral-reels/creators/roster -> one page of the creator index, filtered.
//
// GET rather than POST, like /api/viral-reels/browse and unlike the search route
// beside it: this is an idempotent listing with no secret in the query, so it can
// be shared and re-fetched without a second thought.
//
// It exists so that moving a filter is not a page load. The roster is still
// server-rendered on first paint, which is what a crawler and a visitor with no
// JavaScript get; this is what the five sliders talk to afterwards.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { creatorRosterConfigured, listCreators } from "@/lib/creators/roster";
import { readCreatorFilters } from "@/lib/creators/types";
import { normalizePage } from "@/lib/reels/types";

export const runtime = "nodejs";
// Mumbai, where this project's Supabase lives. The argument is written out in
// full in src/app/api/viral-reels/search/route.ts: the function used to run in
// Washington DC and every read crossed an ocean each way. This page is
// database calls and nothing else, so it is the clearest case of the lot.
export const preferredRegion = ["bom1"];
export const dynamic = "force-dynamic";
export const maxDuration = 20;

// Higher than search's 300 because a filter change is one cheap indexed read,
// not an embedding. It exists to stop a scraper walking the whole table, not a
// visitor dragging a slider.
const DAILY_LIMIT = 2000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  // The same parser the page uses on its own query string, so a filter means
  // one thing whether it arrives in a link or in a fetch, and anything that is
  // not a well-formed range reads as unset rather than reaching a SQL filter.
  const filters = readCreatorFilters(
    Object.fromEntries(url.searchParams.entries()),
  );
  const page = normalizePage(url.searchParams.get("page"));

  if (!creatorRosterConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { allowed } = checkRateLimit(getClientIp(req), {
    bucket: "creator-roster",
    limit: DAILY_LIMIT,
  });
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const { rows, total } = await listCreators({ page, filters }, req.signal);
    return NextResponse.json({ page, total, filters, results: rows });
  } catch (err) {
    // A dropped request is not a failure. Every filter change can abort the one
    // before it, and clicking into a creator aborts whatever was in flight, so
    // logging these would bury the failures that matter under the ones that
    // never happened. Nobody is listening for the body either way.
    if (!req.signal.aborted) console.error("creator roster failed", err);
    return NextResponse.json({ error: "roster_failed" }, { status: 502 });
  }
}
