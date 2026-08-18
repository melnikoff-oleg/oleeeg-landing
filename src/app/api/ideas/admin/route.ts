// POST /api/ideas/admin -> Oleg's controls: log in, add an idea, change a
// status, delete. Everything here is gated on the IDEAS_ADMIN_SECRET cookie set
// by the login action, so the page itself carries no secret in its URL.

import { NextResponse } from "next/server";
import {
  createIdea,
  deleteIdea,
  logEvent,
  updateIdea,
  writesConfigured,
  type IdeaStatus,
} from "@/lib/ideas/db";
import {
  ADMIN_COOKIE,
  adminCookieHeader,
  adminCookieValue,
  cookieFrom,
  isAdmin,
} from "@/lib/ideas/session";
import { getClientIp } from "@/lib/marketing-brain/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES: IdeaStatus[] = ["live", "hidden", "planned", "filming", "published"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (typeof parsed !== "object" || parsed === null) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action : "";

  if (action === "login") {
    const secret = process.env.IDEAS_ADMIN_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    if (body.secret !== secret) {
      // Deliberately vague and unconditional: no hint about which half is wrong.
      return NextResponse.json({ error: "denied" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", adminCookieHeader(adminCookieValue()));
    return res;
  }

  if (!isAdmin(cookieFrom(req, ADMIN_COOKIE))) {
    return NextResponse.json({ error: "denied" }, { status: 401 });
  }
  if (!writesConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = getClientIp(req);

  if (action === "create") {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return NextResponse.json({ error: "missing_title" }, { status: 400 });
    const idea = await createIdea({
      title,
      detail: typeof body.detail === "string" ? body.detail.trim() || null : null,
      source: "oleg",
      status: "live",
    });
    if (!idea) return NextResponse.json({ error: "write_failed" }, { status: 500 });
    await logEvent({ kind: "admin", ideaId: idea.id, ip, payload: { action, title } });
    return NextResponse.json({ ok: true, idea });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  if (action === "delete") {
    const ok = await deleteIdea(id);
    await logEvent({ kind: "admin", ideaId: id, ip, payload: { action } });
    return NextResponse.json({ ok });
  }

  if (action === "update") {
    const patch: Record<string, unknown> = {};
    if (typeof body.status === "string") {
      if (!STATUSES.includes(body.status as IdeaStatus)) {
        return NextResponse.json({ error: "invalid_status" }, { status: 400 });
      }
      patch.status = body.status;
    }
    if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
    if (typeof body.video_url === "string") patch.video_url = body.video_url.trim() || null;
    if (!Object.keys(patch).length) {
      return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
    }
    const ok = await updateIdea(id, patch);
    await logEvent({ kind: "admin", ideaId: id, ip, payload: { action, ...patch } });
    return NextResponse.json({ ok });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
