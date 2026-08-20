// GET /api/viral-reels/browse -> one page of the reel library, filtered.
//
// GET rather than POST, unlike the search route: this is an idempotent listing
// with no secret in the query, so it can be cached, shared and re-fetched by
// the browser without a second thought.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { browseReels, reelBrowseConfigured } from "@/lib/reels/browse";
import {
  FOLLOWER_MAX_INDEX,
  normalizeDays,
  normalizeFollowerIndex,
  normalizePage,
} from "@/lib/reels/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

// Higher than search's 300 because a page turn is one cheap database read, not
// an embedding. It exists to stop a scraper walking the whole table, not a
// visitor clicking through the library.
const DAILY_LIMIT = 2000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const days = normalizeDays(url.searchParams.get("d"));
  const minIndex = normalizeFollowerIndex(url.searchParams.get("fmin"), 0);
  // A dragged-past-itself pair is clamped rather than rejected: the slider can
  // produce it mid-drag and an empty page is a worse answer than a narrow one.
  const maxIndex = Math.max(
    minIndex,
    normalizeFollowerIndex(url.searchParams.get("fmax"), FOLLOWER_MAX_INDEX),
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
      { days, minIndex, maxIndex, page },
      req.signal,
    );
    return NextResponse.json({
      days,
      minIndex,
      maxIndex,
      page,
      total,
      results: rows,
    });
  } catch (err) {
    console.error("reel browse failed", err);
    return NextResponse.json({ error: "browse_failed" }, { status: 502 });
  }
}
