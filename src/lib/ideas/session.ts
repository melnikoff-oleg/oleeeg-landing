// Anonymous voter identity for the /ideas board.
//
// The whole point of the board is that voting takes one tap and no signup, so
// there is no account. Instead each browser gets an opaque id in an httpOnly
// cookie, signed with an HMAC so a visitor cannot hand-write a fresh id per
// vote by editing document.cookie (they can still clear cookies, which is the
// accepted residual gap, see the plan). The id is what the database uniqueness
// constraint on (idea_id, voter_id) keys on.

import { createHmac, randomUUID, timingSafeEqual, createHash } from "node:crypto";

export const VOTER_COOKIE = "ideas_vid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // a year

function secret(): string {
  // Falling back to a constant would silently make signatures forgeable, so we
  // fail loudly at the call site instead (see ideasConfigured in db.ts).
  return process.env.IDEAS_COOKIE_SECRET ?? "";
}

function sign(id: string): string {
  return createHmac("sha256", secret()).update(id).digest("base64url");
}

/** Hash an IP for storage next to a vote. The raw IP lives only in the private
 *  event log; the vote row keeps a salted hash, which is enough to spot a
 *  pattern without carrying an identifier around the public table. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${secret()}:${ip}`).digest("hex").slice(0, 32);
}

/** Parse a cookie value into a voter id, or null if absent or tampered with. */
export function readVoterId(cookieValue: string | undefined | null): string | null {
  if (!cookieValue) return null;
  const idx = cookieValue.lastIndexOf(".");
  if (idx <= 0) return null;
  const id = cookieValue.slice(0, idx);
  const mac = cookieValue.slice(idx + 1);
  const expected = sign(id);
  // Constant-time compare; timingSafeEqual throws on length mismatch.
  if (mac.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  return id;
}

export function mintVoterId(): { id: string; cookieValue: string } {
  const id = randomUUID();
  return { id, cookieValue: `${id}.${sign(id)}` };
}

/** Set-Cookie header value for a freshly minted voter id. */
export function voterCookieHeader(cookieValue: string): string {
  const parts = [
    `${VOTER_COOKIE}=${cookieValue}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${COOKIE_MAX_AGE}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

// ---- admin session ----

export const ADMIN_COOKIE = "ideas_admin";

export function adminCookieValue(): string {
  const s = process.env.IDEAS_ADMIN_SECRET ?? "";
  return createHmac("sha256", secret()).update(`admin:${s}`).digest("base64url");
}

export function isAdmin(cookieValue: string | undefined | null): boolean {
  const s = process.env.IDEAS_ADMIN_SECRET;
  if (!s || !cookieValue) return false;
  const expected = adminCookieValue();
  if (cookieValue.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected));
}

export function adminCookieHeader(value: string): string {
  const parts = [
    `${ADMIN_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 24 * 30}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

/** Read one cookie off a Request. Route handlers get the raw header, so this
 *  avoids pulling in next/headers (async in Next 15) for a two-line parse. */
export function cookieFrom(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return undefined;
}
