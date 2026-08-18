// GET  /api/ideas  -> the public board
// POST /api/ideas  -> submit an idea (screened by Claude, then published)

import { NextResponse } from "next/server";
import {
  createIdea,
  listIdeas,
  logEvent,
  toggleVote,
  writesConfigured,
} from "@/lib/ideas/db";
import { screenIdea } from "@/lib/ideas/screen";
import {
  DETAIL_MAX,
  NAME_MAX,
  TITLE_MAX,
  TITLE_MIN,
  submitAllowed,
  type SubmitKind,
} from "@/lib/ideas/limits";
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
// The screen is one Claude call; 30s is plenty and keeps a hung call from
// holding the function open for the platform maximum.
export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({ ideas: await listIdeas() });
}

export async function POST(req: Request) {
  // Validation first, before any Supabase or Anthropic call, so the guard-rail
  // branches are deterministic and cost nothing.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const detail = typeof raw.detail === "string" ? raw.detail.trim() : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "missing_title" }, { status: 400 });
  }
  if (title.length < TITLE_MIN) {
    return NextResponse.json({ error: "too_short" }, { status: 400 });
  }
  if (title.length > TITLE_MAX || detail.length > DETAIL_MAX || name.length > NAME_MAX) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }

  if (!writesConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = getClientIp(req);
  const country = req.headers.get("x-vercel-ip-country");
  const userAgent = req.headers.get("user-agent");

  if (!(await submitAllowed(ip))) {
    return NextResponse.json({ error: "daily_limit" }, { status: 429 });
  }

  // The submitter's browser id: minted here if they have never voted, so their
  // own idea can start with their vote on it.
  const existingVoterId = readVoterId(cookieFrom(req, VOTER_COOKIE));
  const minted = existingVoterId ? null : mintVoterId();
  const voterId = existingVoterId ?? minted!.id;

  const board = await listIdeas();
  const verdict = await screenIdea(
    { title, detail },
    board.map((i) => ({ id: i.id, title: i.title })),
    req.signal,
  );

  const respond = (data: object, status = 200) => {
    const res = NextResponse.json(data, { status });
    if (minted) res.headers.set("Set-Cookie", voterCookieHeader(minted.cookieValue));
    return res;
  };

  const logBase = { voterId, ip, country, userAgent };

  // Duplicate is checked FIRST on purpose: the screen reports a duplicate as a
  // kind of rejection (verdict "reject" WITH duplicate_of set), and pointing the
  // visitor at the card to vote for beats telling them no. Neither branch
  // writes an idea, so the only thing at stake is which answer they get.
  if (verdict?.duplicate_of) {
    await logEvent({
      ...logBase,
      kind: "submit_duplicate" satisfies SubmitKind,
      ideaId: verdict.duplicate_of,
      payload: { title, detail },
    });
    return respond({ status: "duplicate", ideaId: verdict.duplicate_of });
  }

  if (verdict?.verdict === "reject") {
    await logEvent({
      ...logBase,
      kind: "submit_rejected" satisfies SubmitKind,
      payload: { title, detail, reason: verdict.reason },
    });
    return respond({ status: "rejected", reason: verdict.reason });
  }

  // No verdict means the screen could not run (no key, API error, timeout). Keep
  // the visitor's words and hold them for review rather than dropping them.
  const held = !verdict;
  const idea = await createIdea({
    title: verdict?.normalized_title?.trim() || title,
    detail: detail || null,
    authorName: name || null,
    status: held ? "hidden" : "live",
  });

  if (!idea) {
    return respond({ error: "write_failed" }, 500);
  }

  await logEvent({
    ...logBase,
    kind: "submit" satisfies SubmitKind,
    ideaId: idea.id,
    payload: { title, detail, name, held },
  });

  if (!held) {
    // Their own suggestion starts with their vote on it, which is what everyone
    // expects from a board like this and saves a second tap.
    await toggleVote(idea.id, voterId, hashIp(ip));
    idea.votes_count = 1;
  }

  return respond({ status: held ? "held" : "published", idea });
}
