// Durable per-IP daily caps for the /ideas board, counted out of the audit log.
//
// Deliberately NOT the in-memory limiter in marketing-brain/rate-limit.ts: that
// one is per serverless instance and resets on every cold start, which is fine
// for throttling a paid endpoint but would let anyone stuff votes just by
// waiting for a new instance. We reuse its getClientIp() though, since it
// already handles Vercel's non-spoofable x-real-ip and the right-most XFF hop.

import { countTodayByIp, type VoteAction } from "./db";

export const SUBMIT_DAILY_LIMIT = 3;
export const VOTE_DAILY_LIMIT = 60;

// The event kinds the caps count. These MUST be the exact strings the routes
// log, and the first version of this file got that wrong (it counted "vote" /
// "unvote" while the route logged "voted" / "unvoted"), which silently disabled
// the vote cap entirely. So both lists are now tied to the types the routes use:
// VOTE_KINDS is derived from a Record over the action union, which fails to
// compile if an action is added or renamed and not accounted for here.
export const SUBMIT_KINDS = ["submit", "submit_rejected", "submit_duplicate"] as const;
export type SubmitKind = (typeof SUBMIT_KINDS)[number];

const VOTE_KIND_MAP: Record<VoteAction, true> = { voted: true, unvoted: true };
export const VOTE_KINDS = Object.keys(VOTE_KIND_MAP) as VoteAction[];

export async function submitAllowed(ip: string): Promise<boolean> {
  return (await countTodayByIp(ip, [...SUBMIT_KINDS])) < SUBMIT_DAILY_LIMIT;
}

export async function voteAllowed(ip: string): Promise<boolean> {
  return (await countTodayByIp(ip, VOTE_KINDS)) < VOTE_DAILY_LIMIT;
}

// ---- shared field limits (client inputs and server validation read these, so
// the two can never drift into "the form let me type it, the server rejected it") ----

export const TITLE_MAX = 100;
export const DETAIL_MAX = 300;
export const NAME_MAX = 40;
export const TITLE_MIN = 8;
