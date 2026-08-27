// The ten accounts both reel pages open on, and the mixing they are shown in.
//
// This replaces a rule -- worth studying 7+, form 6+, educational or
// inspirational 5+ -- that Oleg read the output of and rejected. The rule was
// defensible and it was still the wrong list, because "how much is there to
// learn from this person" and "who do I want somebody to meet first" are not the
// same question and no threshold over the first answers the second. So the front
// page of both pages is a list, hand-written, and the database ranks nothing
// until somebody types or drags something.
//
// Nothing here reads a secret or touches the network, so the server and the
// browser both import it.

/**
 * Oleg's ten, in the order he wrote them.
 *
 * Never displayed in this order -- see `mixedAccounts` -- but kept in it,
 * because this is the list he can edit and diff. Adding or removing a handle is
 * a one-line change here and nothing else on the site needs to know.
 *
 * A handle that is not in the database costs nothing: it simply matches no rows,
 * and both pages fall back to their ordinary listing if the whole list ever
 * comes back empty.
 */
export const FEATURED_ACCOUNTS = [
  "davidexplains",
  "austingeorgas",
  "chandlerintelligence",
  "jack_boudreau_",
  "kaye.creatives",
  "mytechceo",
  "kaiacreativehouse",
  "sternstoic",
  "gracenfaithg",
  "theaifilmmaker",
] as const;

/** FNV-1a, 32-bit. Not a security hash: a cheap, stable number from a string. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * The ten in display order: mixed, and the same mix every time.
 *
 * Sorted by a hash of the handle, so the order is neither the order they were
 * written in nor alphabetical nor anything a visitor could read a ranking into.
 *
 * DETERMINISTIC on purpose. A random shuffle would differ between the server's
 * render and the browser's hydration of the same page, which React reports as a
 * mismatch and repairs by throwing one of the two away; a shuffle seeded on the
 * clock would do the same thing across a cached render. A stable mix is also the
 * only kind a screenshot of this page stays true to.
 */
export function mixedAccounts(): string[] {
  return [...FEATURED_ACCOUNTS].sort((a, b) => hash(a) - hash(b));
}

/**
 * How far the account order rotates between one pass and the next.
 *
 * Without it the wall is the same ten handles repeated: rows of four over a
 * cycle of ten never line up vertically, but the sequence is still there to be
 * read, and Oleg's word for what he wanted was "properly".
 *
 * 3, and the one value it must not be is `order.length - 1`. Rotating by that
 * puts the account that ended one pass at the start of the next, which is the
 * single arrangement this function exists to prevent. Any other step keeps the
 * no-two-in-a-row property for free, and the guard below covers the case where
 * an account runs out mid-wall and the rotation is no longer what decides.
 */
const ROTATION = 3;

/**
 * One item from each account in turn, until there are `limit` of them.
 *
 * This is what "mixed" means on the reel wall: no two tiles in a row from the
 * same person, and no readable repeat down the page. Grouping the same wall by
 * creator shows four reels by whoever owns the top of the score column, which
 * reads as a small database rather than a broad one.
 *
 * Every pass takes one item from each account that still has one, in an order
 * rotated by ROTATION from the pass before. An account that runs out is skipped
 * rather than padded, so a creator with three reels in the index contributes
 * three and the wall fills from the others.
 *
 * `groups` is keyed by account; accounts absent from it are skipped. The result
 * is at most `limit` long and can be shorter, which is the honest answer when
 * the ten accounts between them hold fewer items than that.
 */
export function interleave<T>(
  groups: Map<string, T[]>,
  order: readonly string[],
  limit: number,
): T[] {
  const out: T[] = [];
  if (!order.length) return out;

  const cursor = new Map<string, number>();
  const hasMore = (account: string) =>
    (cursor.get(account) ?? 0) < (groups.get(account)?.length ?? 0);

  let last = "";
  for (let pass = 0; out.length < limit; pass++) {
    const from = (pass * ROTATION) % order.length;
    let took = 0;

    for (let i = 0; i < order.length; i++) {
      const account = order[(from + i) % order.length];
      if (!hasMore(account)) continue;
      // Never two in a row from the same person -- unless they are the only one
      // with anything left, in which case a short wall would be the worse
      // answer. This is the guard the rotation cannot give on its own: an
      // account running dry mid-wall changes who ends a pass.
      if (
        account === last &&
        order.some((other) => other !== account && hasMore(other))
      ) {
        continue;
      }
      const items = groups.get(account) as T[];
      const at = cursor.get(account) ?? 0;
      cursor.set(account, at + 1);
      out.push(items[at]);
      last = account;
      took++;
      if (out.length >= limit) break;
    }

    // A whole pass that took nothing means every account is exhausted. Without
    // this the loop would spin on a half-empty database.
    if (!took) break;
  }
  return out;
}
