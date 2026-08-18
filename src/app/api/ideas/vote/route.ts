// POST /api/ideas/vote -> toggle this browser's vote on one idea.

import { NextResponse } from "next/server";
import { logEvent, toggleVote, writesConfigured } from "@/lib/ideas/db";
import { voteAllowed } from "@/lib/ideas/limits";
import {
  cookieFrom,
  hashIp,
  mintVoterId,
  readVoterId,
  VOTER_COOKIE,
  voterCookieHeader,
} from "@/lib/ideas/session";
import { getClientIp } from "@/lib/marketing-brain/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const ideaId =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).ideaId
      : undefined;
  if (typeof ideaId !== "string" || !UUID.test(ideaId)) {
    return NextResponse.json({ error: "invalid_idea" }, { status: 400 });
  }

  if (!writesConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = getClientIp(req);
  if (!(await voteAllowed(ip))) {
    return NextResponse.json({ error: "daily_limit" }, { status: 429 });
  }

  // No cookie yet means this is the visitor's first action, so mint an identity
  // now and hand it back on the response. A server component cannot set a
  // cookie, which is why this happens on the first write rather than on render.
  const existing = readVoterId(cookieFrom(req, VOTER_COOKIE));
  const minted = existing ? null : mintVoterId();
  const voterId = existing ?? minted!.id;

  const result = await toggleVote(ideaId, voterId, hashIp(ip));
  if (!result.ok) {
    const status = result.reason === "not_found" ? 404 : 500;
    return NextResponse.json({ error: result.reason }, { status });
  }

  await logEvent({
    kind: result.action,
    ideaId,
    voterId,
    ip,
    country: req.headers.get("x-vercel-ip-country"),
    userAgent: req.headers.get("user-agent"),
  });

  const res = NextResponse.json({ action: result.action, votes: result.votes });
  if (minted) res.headers.set("Set-Cookie", voterCookieHeader(minted.cookieValue));
  return res;
}
