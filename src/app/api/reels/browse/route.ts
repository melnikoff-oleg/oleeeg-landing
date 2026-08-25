// GET /api/reels/browse -> one page of the reel wall, filtered by window,
// follower range and topic.
//
// The /reels page's own copy of /api/viral-reels/browse. It is a separate route
// rather than a query param on the old one because /viral-reels-browse is
// deployed and working, and the rule for this build is that nothing the three
// older pages touch may change. The data layer is shared, only the entry point
// is new.
//
// GET rather than POST, for the same reason the older route is: this is an
// idempotent listing with no secret in the query, so it can be cached, shared
// and re-fetched by the browser without a second thought.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { browseReels, reelBrowseConfigured } from "@/lib/reels/browse";
import { reelFiltersFromWindow } from "@/lib/reels/filters";
import { normalizeTopics, tagsForTopics } from "@/lib/reels/topics";
import {
  FOLLOWER_MAX_INDEX,
  normalizeDays,
  normalizeFollowerIndex,
  normalizePage,
} from "@/lib/reels/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

// Its own bucket, not the older page's "reels-browse". Sharing one would mean a
// visitor who spent the day on /viral-reels-browse arrives at /reels already
// rate limited, for usage that had nothing to do with this page.
const BUCKET = "reels-wall";

// Higher than the older browse route's 2000 because this page turns a page for
// more than paging: every topic chip and every slider drag is a fresh read, so
// one honest session costs several times what a session on /viral-reels-browse
// does. It exists to stop a scraper walking the whole table, not a visitor
// clicking through the library.
const DAILY_LIMIT = 4000;

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
  // "t" is comma-joined topic ids. normalizeTopics drops anything that is not a
  // real topic, so a hand-typed or stale id can never reach the tag filter, and
  // the accepted ids are echoed below so the client can see one was dropped
  // rather than silently browsing a filter it did not ask for.
  const topics = normalizeTopics(url.searchParams.get("t"));
  const tags = tagsForTopics(topics);

  if (!reelBrowseConfigured) {
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
    // No topics selected means no tags, and browseReels treats an empty array as
    // no filter at all rather than as "match nothing", which is what makes the
    // unfiltered wall the default.
    const { rows, total } = await browseReels(
      { ranges: reelFiltersFromWindow({ days, minIndex, maxIndex }), page, tags },
      req.signal,
    );
    return NextResponse.json({
      days,
      minIndex,
      maxIndex,
      page,
      topics,
      total,
      results: rows,
    });
  } catch (err) {
    // PostgREST answers 416 Range Not Satisfiable when the offset is past the
    // last row, and browseReels turns any non-ok status into a throw. That is a
    // real answer, not a failure: page 200 of a 141-page library is empty. The
    // page's own "more reels" button can never ask for it, but a hand-typed
    // ?page=200 could, and a 502 there would read as the library being down.
    //
    // Sniffed out of the message rather than caught as a type, because
    // browse.ts throws `new Error(\`browse failed: ${res.status}\`)` at
    // browse.ts:151 and that file may not be edited from here. If that string
    // is ever reworded this branch stops firing and an over-range page quietly
    // reverts to 502, so the dependency is named here on purpose.
    if (err instanceof Error && /\b416\b/.test(err.message)) {
      // `total` is deliberately absent, not zero. The count for these filters is
      // unknown on this path, and a fabricated 0 reads as data: the client does
      // `count = json.total ?? results.length` and prints "N of M", so a zero
      // would have the page announce that the library is empty.
      return NextResponse.json({
        days,
        minIndex,
        maxIndex,
        page,
        topics,
        results: [],
      });
    }
    console.error("reel wall browse failed", err);
    return NextResponse.json({ error: "browse_failed" }, { status: 502 });
  }
}
