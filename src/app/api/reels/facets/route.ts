// GET /api/reels/facets -> everything the /reels chrome needs, in one call.
//
// The header strip prints how big the library is and how far back it goes, and
// the chip row is built from the topic list. Both are the same for every
// visitor and neither depends on what the visitor has filtered to, so they are
// one request made once on load rather than two requests remade on every
// filter change.
//
// Nearly free: getLibraryOverview keeps its answer in module memory for thirty
// minutes and shares one in-flight read between concurrent callers, so a warm
// instance answers this without touching Supabase at all.

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
// overview.ts exports no configured flag of its own, and it may not be edited.
// This one is the correct proxy rather than a convenient one: browse.ts reads
// exactly the same two variables, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY,
// so the two modules are configured or unconfigured together, always.
import { reelBrowseConfigured } from "@/lib/reels/browse";
import { getLibraryOverview } from "@/lib/reels/overview";
import { TOPICS } from "@/lib/reels/topics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Only ever slow on a cold cache, which is three paged reads of five narrow
// columns over a ~2.4k-row table.
export const maxDuration = 20;

const BUCKET = "reels-facets";

// As generous as the wall's own bucket. This call paints the header and the
// chips, so a visitor who runs out here loses the page's chrome while the wall
// underneath still works, which is a worse failure than a slow page.
const DAILY_LIMIT = 4000;

export async function GET(req: Request) {
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
    // No signal is passed, and none can be: getLibraryOverview takes none by
    // design, because concurrent callers share one read and the first visitor
    // navigating away must not cancel the read everyone else is waiting on.
    const overview = await getLibraryOverview();
    // Four numbers and the topic list, and nothing else. The full accounts array
    // is 161 objects and top_tags is 60 more, several kilobytes the page never
    // reads, on a request it makes on every single load.
    return NextResponse.json({
      total_reels: overview.total_reels,
      accounts: overview.accounts.length,
      oldest_post: overview.oldest_post,
      newest_post: overview.newest_post,
      topics: TOPICS,
    });
  } catch (err) {
    console.error("reel facets failed", err);
    return NextResponse.json({ error: "facets_failed" }, { status: 502 });
  }
}
