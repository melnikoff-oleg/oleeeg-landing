// POST /api/reels/search -> the closest reels in the database to a query,
// optionally narrowed to a set of topics.
//
// The /reels page's own copy of /api/viral-reels/search. Separate for the same
// reason the wall's browse route is separate: /viral-reels is deployed and must
// keep behaving exactly as it does, so this page gets its own entry point and
// its own rate-limit allowance over the same unchanged data layer.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { reelSearchConfigured, searchReels } from "@/lib/reels/search";
import { normalizeTopics, tagsForTopics } from "@/lib/reels/topics";
import {
  normalizeDays,
  normalizeQuery,
  type ReelHit,
  RESULT_COUNT,
} from "@/lib/reels/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Two short upstream hops with a 12s budget of their own; this only stops a
// wedged function from holding open for the platform maximum.
export const maxDuration = 20;

// Its own bucket, so a day spent searching on /viral-reels does not arrive here
// as an exhausted allowance, and neither does the reverse.
const BUCKET = "reels-find";

// Generous, because searching is half the point of the page and one search
// costs a fraction of a cent. It exists to stop a script, not a visitor.
const DAILY_LIMIT = 400;

/**
 * How many hits to ask pgvector for when a topic filter is on.
 *
 * searchReels applies its recency window inside the SQL, before the limit, but
 * it knows nothing about tags, so the topic filter has to run here in
 * TypeScript, after the ranking. Asking for the usual ten and then filtering
 * them would routinely leave two or three: the top ten for "morning routine" are
 * the top ten overall, not the top ten inside the chosen topics. Asking for more
 * and cutting back to ten costs the same single embedding and one slightly wider
 * RPC, and it is the only way to fill the page without touching search.ts.
 *
 * Deliberately not unbounded: a topic that genuinely has no close reels should
 * come back short and let the page say so, rather than scanning the corpus for
 * the least-far thing that carries the tag.
 */
const TOPIC_OVERFETCH = 60;

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
  // Anything that is not one of the six offered windows falls back to all time,
  // so a hand-made request can never reach the RPC with an arbitrary interval.
  const days = normalizeDays(raw.days);
  // The wall passes its topic ids as a comma-joined string in a query param, so
  // an array is flattened to the same shape here and both callers hit exactly
  // one code path in normalizeTopics. Unknown ids are dropped there.
  const topics = normalizeTopics(
    Array.isArray(raw.topics) ? raw.topics.join(",") : raw.topics,
  );
  const tags = new Set(tagsForTopics(topics));

  if (!reelSearchConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { allowed } = checkRateLimit(getClientIp(req), {
    bucket: BUCKET,
    limit: DAILY_LIMIT,
  });
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const count = tags.size ? TOPIC_OVERFETCH : RESULT_COUNT;
    const hits = await searchReels(query, days, count, req.signal);
    // Exact string overlap, the same rule browseReels' PostgREST `ov` filter
    // applies, so a chip means the same thing on the wall and in the search.
    // The stored tags are already lower case, checked against the live table.
    const results: ReelHit[] = tags.size
      ? hits.filter((r) => (r.tags ?? []).some((t) => tags.has(t))).slice(0, RESULT_COUNT)
      : hits;
    return NextResponse.json({ query, days, topics, results });
  } catch (err) {
    console.error("reel wall search failed", err);
    return NextResponse.json({ error: "search_failed" }, { status: 502 });
  }
}
