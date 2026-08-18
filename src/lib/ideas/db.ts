// Supabase data layer for the /ideas board.
//
// Everything here runs server-side with the SERVICE ROLE key. The three tables
// have RLS on with no policies (see scripts/ideas-schema.sql), so this module is
// the only way in: the anon key cannot read a row even if it leaks into a
// bundle.
//
// If the env vars are missing the module degrades instead of throwing: reads
// return empty and writes report `configured: false`. That is what lets the
// page render a 200 empty state and lets the Playwright suite run in an
// environment with no secrets.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type IdeaStatus = "live" | "hidden" | "planned" | "filming" | "published";

export type Idea = {
  id: string;
  title: string;
  detail: string | null;
  author_name: string | null;
  status: IdeaStatus;
  video_url: string | null;
  source: "visitor" | "oleg";
  votes_count: number;
  created_at: string;
};

export type IdeaEvent = {
  id: number;
  kind: string;
  idea_id: string | null;
  voter_id: string | null;
  ip: string | null;
  country: string | null;
  user_agent: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
};

/** Statuses a visitor is allowed to see. `hidden` is the admin's off switch. */
export const PUBLIC_STATUSES: IdeaStatus[] = ["live", "planned", "filming", "published"];

export const dbConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/** Writes additionally need the HMAC secret that signs the voter cookie. */
export const writesConfigured = dbConfigured && Boolean(process.env.IDEAS_COOKIE_SECRET);

let cached: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (!cached) {
    cached = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false } },
    );
  }
  return cached;
}

// ---- reads ----

export async function listIdeas(): Promise<Idea[]> {
  if (!dbConfigured) return [];
  const { data, error } = await db()
    .from("yt_idea")
    .select("*")
    .in("status", PUBLIC_STATUSES)
    .order("votes_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) {
    console.error("[ideas] listIdeas", error.message);
    return [];
  }
  return (data ?? []) as Idea[];
}

export async function listAllIdeas(): Promise<Idea[]> {
  if (!dbConfigured) return [];
  const { data, error } = await db()
    .from("yt_idea")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    console.error("[ideas] listAllIdeas", error.message);
    return [];
  }
  return (data ?? []) as Idea[];
}

/** The idea ids this browser has already voted for, so the board can render the
 *  pressed state on a server render instead of flashing unvoted then correcting. */
export async function votedIdeaIds(voterId: string | null): Promise<string[]> {
  if (!dbConfigured || !voterId) return [];
  const { data, error } = await db()
    .from("yt_idea_vote")
    .select("idea_id")
    .eq("voter_id", voterId);
  if (error) {
    console.error("[ideas] votedIdeaIds", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.idea_id as string);
}

export async function listEvents(limit = 200): Promise<IdeaEvent[]> {
  if (!dbConfigured) return [];
  const { data, error } = await db()
    .from("yt_idea_event")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[ideas] listEvents", error.message);
    return [];
  }
  return (data ?? []) as IdeaEvent[];
}

// ---- writes ----

export async function createIdea(input: {
  title: string;
  detail?: string | null;
  authorName?: string | null;
  status?: IdeaStatus;
  source?: "visitor" | "oleg";
  videoUrl?: string | null;
}): Promise<Idea | null> {
  if (!dbConfigured) return null;
  const { data, error } = await db()
    .from("yt_idea")
    .insert({
      title: input.title,
      detail: input.detail ?? null,
      author_name: input.authorName ?? null,
      status: input.status ?? "live",
      source: input.source ?? "visitor",
      video_url: input.videoUrl ?? null,
    })
    .select("*")
    .single();
  if (error) {
    console.error("[ideas] createIdea", error.message);
    return null;
  }
  return data as Idea;
}

export type VoteAction = "voted" | "unvoted";

export type VoteResult =
  | { ok: true; action: VoteAction; votes: number }
  | { ok: false; reason: "not_found" | "error" };

/**
 * Toggle this browser's vote on one idea.
 *
 * The insert is the guard: the table's primary key is (idea_id, voter_id), so a
 * second vote from the same browser fails with 23505 rather than double
 * counting, and we read that as "they tapped again, so unvote". Doing it this
 * way (rather than read-then-write) means two racing requests cannot both see
 * "not voted yet" and both insert. `votes_count` is maintained by a trigger, so
 * we re-read the row afterwards rather than doing our own arithmetic.
 */
export async function toggleVote(
  ideaId: string,
  voterId: string,
  ipHash: string,
): Promise<VoteResult> {
  if (!dbConfigured) return { ok: false, reason: "error" };

  const { error: insertError } = await db()
    .from("yt_idea_vote")
    .insert({ idea_id: ideaId, voter_id: voterId, ip_hash: ipHash });

  let action: VoteAction;
  if (!insertError) {
    action = "voted";
  } else if (insertError.code === "23505") {
    const { error: delError } = await db()
      .from("yt_idea_vote")
      .delete()
      .eq("idea_id", ideaId)
      .eq("voter_id", voterId);
    if (delError) {
      console.error("[ideas] toggleVote delete", delError.message);
      return { ok: false, reason: "error" };
    }
    action = "unvoted";
  } else if (insertError.code === "23503") {
    // Foreign key: the idea id does not exist (or was deleted).
    return { ok: false, reason: "not_found" };
  } else {
    console.error("[ideas] toggleVote insert", insertError.message);
    return { ok: false, reason: "error" };
  }

  const { data } = await db()
    .from("yt_idea")
    .select("votes_count")
    .eq("id", ideaId)
    .single();

  return { ok: true, action, votes: (data?.votes_count as number) ?? 0 };
}

export async function updateIdea(
  id: string,
  patch: Partial<Pick<Idea, "title" | "detail" | "status" | "video_url">>,
): Promise<boolean> {
  if (!dbConfigured) return false;
  const { error } = await db().from("yt_idea").update(patch).eq("id", id);
  if (error) console.error("[ideas] updateIdea", error.message);
  return !error;
}

export async function deleteIdea(id: string): Promise<boolean> {
  if (!dbConfigured) return false;
  const { error } = await db().from("yt_idea").delete().eq("id", id);
  if (error) console.error("[ideas] deleteIdea", error.message);
  return !error;
}

/** Append to the audit log. Never throws and never blocks the caller's result:
 *  a board action must not fail because logging did. */
export async function logEvent(input: {
  kind: string;
  ideaId?: string | null;
  voterId?: string | null;
  ip?: string | null;
  country?: string | null;
  userAgent?: string | null;
  payload?: Record<string, unknown> | null;
}): Promise<void> {
  if (!dbConfigured) return;
  const { error } = await db().from("yt_idea_event").insert({
    kind: input.kind,
    idea_id: input.ideaId ?? null,
    voter_id: input.voterId ?? null,
    ip: input.ip ?? null,
    country: input.country ?? null,
    user_agent: input.userAgent?.slice(0, 300) ?? null,
    payload: input.payload ?? null,
  });
  if (error) console.error("[ideas] logEvent", error.message);
}

/** Count this IP's actions of the given kinds since UTC midnight. This is what
 *  makes the daily caps durable: the in-memory limiter used by the marketing
 *  brain resets on every cold start and is per-instance, which is fine for an
 *  approximate cap on a paid endpoint but useless against vote stuffing. */
export async function countTodayByIp(ip: string, kinds: string[]): Promise<number> {
  if (!dbConfigured) return 0;
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;
  const { count, error } = await db()
    .from("yt_idea_event")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .in("kind", kinds)
    .gte("created_at", since);
  if (error) {
    console.error("[ideas] countTodayByIp", error.message);
    return 0;
  }
  return count ?? 0;
}
