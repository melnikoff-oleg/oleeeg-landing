// POST /api/viral-reels/search -> the closest reels in the database to a query.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { reelSearchConfigured, searchReels } from "@/lib/reels/search";
import { normalizeQuery, RESULT_COUNT } from "@/lib/reels/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Two short upstream hops with a 12s budget of their own; this only stops a
// wedged function from holding open for the platform maximum.
export const maxDuration = 20;

// Generous, because searching is the whole point of the page and one search
// costs a fraction of a cent. It exists to stop a script, not a visitor.
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
  const query = normalizeQuery(typeof raw.query === "string" ? raw.query : "");
  if (!query) {
    return NextResponse.json({ error: "missing_query" }, { status: 400 });
  }

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
    const results = await searchReels(query, RESULT_COUNT, req.signal);
    return NextResponse.json({ query, results });
  } catch (err) {
    console.error("reel search failed", err);
    return NextResponse.json({ error: "search_failed" }, { status: 502 });
  }
}
