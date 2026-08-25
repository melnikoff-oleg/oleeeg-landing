// POST /api/viral-reels/creators -> the creators in the database closest to a query.
//
// The sibling of /api/viral-reels/search. Same two hops, same guard rails, same
// bucket-free cost: one embedding and one indexed read, a fraction of a cent.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { creatorSearchConfigured, searchCreators } from "@/lib/creators/search";
import {
  CREATOR_RESULT_MAX,
  normalizeCreatorQuery,
  readCreatorFilters,
  toCreatorTile,
} from "@/lib/creators/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Two short upstream hops with a 12s budget of their own; this only stops a
// wedged function from holding open for the platform maximum.
export const maxDuration = 20;

// Generous, because searching is the whole point of the page and one search
// costs a fraction of a cent. It exists to stop a script, not a visitor. Shared
// with the reel search on purpose: the two pages are one tool, and a visitor
// moving between them should meet one budget rather than two.
const DAILY_LIMIT = 300;

export async function POST(req: Request) {
  // Validation first, before any config or upstream call, so the guard-rail
  // branches are deterministic and cost nothing.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const raw = (body ?? {}) as Record<string, unknown>;
  const query = normalizeCreatorQuery(typeof raw.query === "string" ? raw.query : "");
  if (!query) {
    return NextResponse.json({ error: "missing_query" }, { status: 400 });
  }
  // Same parser the page runs on its own query string, for the same reason: a
  // hand-made request must not be able to put an arbitrary value into a SQL
  // filter. Anything that is not a well-formed range on the offered scale reads
  // as "unset" rather than being clamped into a question nobody asked.
  const filters = readCreatorFilters(raw);

  if (!creatorSearchConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { allowed } = checkRateLimit(getClientIp(req), {
    bucket: "reels",
    limit: DAILY_LIMIT,
  });
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const hits = await searchCreators(query, filters, CREATOR_RESULT_MAX, req.signal);
    // Card rows, not full ones. The card paints an avatar, a handle, three
    // numbers, the bio and the niche; the tags, signatures, top ideas and
    // thumbnails it never reads are four fifths of the payload. At 50 creators
    // that is ~15 KB rather than 135 KB, which is what makes sending the whole
    // answer at once cheaper than sending twelve rows used to be.
    return NextResponse.json({ query, filters, results: hits.map(toCreatorTile) });
  } catch (err) {
    // A dropped request is not a failure. Every filter change can abort the one
    // before it, and clicking into a creator aborts whatever was in flight, so
    // logging these would bury the failures that matter under the ones that
    // never happened. Nobody is listening for the body either way.
    if (!req.signal.aborted) console.error("creator search failed", err);
    return NextResponse.json({ error: "search_failed" }, { status: 502 });
  }
}
