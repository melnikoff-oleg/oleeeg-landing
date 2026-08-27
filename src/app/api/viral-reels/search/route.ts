// POST /api/viral-reels/search -> the closest reels in the library to a query,
// under the same five filters the wall is under.
//
// The sibling of /api/viral-reels/creators. Same two hops, same guard rails,
// same bucket-free cost: one embedding and one indexed read, a fraction of a
// cent.

import { NextResponse } from "next/server";
import { Stopwatch } from "@/lib/perf/timing";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { readRanges } from "@/lib/filters/range";
import { LIBRARY_RESULT_MAX, REEL_FILTERS } from "@/lib/reels/filters";
import { reelSearchConfigured, searchReels } from "@/lib/reels/search";
import { normalizeQuery, toTileRow } from "@/lib/reels/types";

export const runtime = "nodejs";
// SAME CITY AS THE DATABASE. Measured 2026-08-27: `x-vercel-id` read
// `fra1::iad1::...`, so the function ran in Washington DC while the Supabase
// project's region is `ap-south-1`, Mumbai. Every database call was crossing
// 12,000 km and back, plus a fresh TLS handshake on a cold instance, which is
// why a read that costs 220 ms straight to Supabase cost 700-1,260 ms through
// a route. `bom1` is Vercel's Mumbai region. The trade is real and it was
// checked: the OpenAI hop gets slower from here, but a search makes that call
// at most once and now usually not at all (src/lib/search/embed-cache.ts),
// while every page and every filter change is database calls only.
export const preferredRegion = ["bom1"];
export const dynamic = "force-dynamic";
// Two short upstream hops with a 12s budget of their own; this only stops a
// wedged function from holding open for the platform maximum.
export const maxDuration = 20;

// Generous, because searching is the whole point of the page and one search
// costs a fraction of a cent. It exists to stop a script, not a visitor. Shared
// with the creator search on purpose: the two pages are one tool, and a visitor
// moving between them should meet one budget rather than two.
const DAILY_LIMIT = 300;

export async function POST(req: Request) {
  const watch = new Stopwatch();
  // Validation first, before any config or upstream call, so the guard-rail
  // branches are deterministic and cost nothing.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const raw = (body ?? {}) as Record<string, unknown>;
  const query = normalizeQuery(typeof raw.query === "string" ? raw.query : "");
  if (!query) {
    return NextResponse.json({ error: "missing_query" }, { status: 400 });
  }
  // The same parser the page runs on its own query string, for the same reason:
  // a hand-made request must not be able to put an arbitrary value into a SQL
  // filter. Anything that is not a well-formed range on the offered scale reads
  // as "unset" rather than being clamped into a question nobody asked.
  const ranges = readRanges(REEL_FILTERS, raw);

  if (!reelSearchConfigured) {
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
    const hits = await searchReels(query, ranges, LIBRARY_RESULT_MAX, req.signal, watch);
    // Tile rows, not full ones. The wall draws a thumbnail and four numbers, so
    // the write-ups, tags and caption are seven eighths of a payload nothing on
    // the page reads. At 120 reels that is the difference between 320 KB and
    // 42 KB, which is what makes sending the whole answer at once the cheap
    // option rather than the expensive one.
    return NextResponse.json(
      { query, results: hits.map(toTileRow) },
      // Every hop, on the response. Chrome's network panel draws it as a bar
      // chart with no setup, so "why was that slow" is read off a header rather
      // than argued from the source.
      { headers: { "Server-Timing": watch.header() } },
    );
  } catch (err) {
    // A dropped request is not a failure. Every filter change can abort the one
    // before it, and clicking into a reel aborts whatever was in flight, so
    // logging these would bury the failures that matter under the ones that
    // never happened. Nobody is listening for the body either way.
    if (!req.signal.aborted) console.error("reel search failed", err);
    return NextResponse.json({ error: "search_failed" }, { status: 502 });
  }
}
