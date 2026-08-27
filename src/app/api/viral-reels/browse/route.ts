// GET /api/viral-reels/browse -> one page of the reel library, filtered.
//
// GET rather than POST, like the creator roster and unlike the search route
// beside it: this is an idempotent listing with no secret in the query, so it
// can be cached, shared and re-fetched by the browser without a second thought.
//
// It exists so that moving a filter is not a page load. The first page is still
// server-rendered, which is what a crawler and a visitor with no JavaScript get;
// this is what the five sliders talk to afterwards.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { readRanges } from "@/lib/filters/range";
import { browseReels, reelBrowseConfigured } from "@/lib/reels/browse";
import { LIBRARY_PAGE_SIZE, REEL_FILTERS } from "@/lib/reels/filters";
import { normalizePage } from "@/lib/reels/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

// Higher than search's 300 because a page turn is one cheap database read, not
// an embedding. It exists to stop a scraper walking the whole table, not a
// visitor dragging a slider.
const DAILY_LIMIT = 2000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  // The same parser the page runs on its own query string, so a filter means one
  // thing whether it arrives in a link or in a fetch, and anything that is not a
  // well-formed range reads as unset rather than reaching a SQL filter.
  const ranges = readRanges(
    REEL_FILTERS,
    Object.fromEntries(url.searchParams.entries()),
  );
  const page = normalizePage(url.searchParams.get("page"));

  if (!reelBrowseConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { allowed } = checkRateLimit(getClientIp(req), {
    bucket: "reels-browse",
    limit: DAILY_LIMIT,
  });
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const { rows, total } = await browseReels(
      { ranges, page, limit: LIBRARY_PAGE_SIZE },
      req.signal,
    );
    return NextResponse.json({ page, total, results: rows });
  } catch (err) {
    // PostgREST answers 416 Range Not Satisfiable when the offset is past the
    // last row, and browseReels turns any non-ok status into a throw. That is a
    // real answer, not a failure: page 200 of an 82-page library is empty. The
    // page's own controls can never ask for it, but a hand-typed ?page=200
    // could, and a 502 there would read as the library being down.
    if (err instanceof Error && err.message.includes("416")) {
      return NextResponse.json({ page, total: 0, results: [] });
    }
    // A dropped request is not a failure. Every filter change can abort the one
    // before it, so logging these would bury the failures that matter under the
    // ones that never happened.
    if (!req.signal.aborted) console.error("reel browse failed", err);
    return NextResponse.json({ error: "browse_failed" }, { status: 502 });
  }
}
