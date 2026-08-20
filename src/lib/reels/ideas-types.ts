// The wire protocol between /api/viral-reels/ideas and the page that reads it.
//
// Kept out of tools.ts and ideas-prompt.ts because the client imports these and
// those two read secrets at import time. Same split, and the same reason, as
// types.ts against search.ts.

import type { ReelRow } from "./types";

export type IdeasRole = "user" | "assistant";

export type IdeasMessage = {
  role: IdeasRole;
  content: string;
};

/** What the model is doing right now, shown as a line above the answer. */
export type ToolActivity = {
  /**
   * The tool_use block's own id.
   *
   * Every call is announced twice, once when the block opens and again once its
   * arguments have finished streaming, and the client replaces the first with
   * the second. Matching them on the label prefix looked fine until a turn
   * called two different tools, at which point the second call's provisional
   * line no longer sat at the tail and both survived, so one turn drew four
   * steps for two calls. An id cannot get that wrong.
   */
  id: string;
  /** The tool it called, already turned into something a person can read. */
  label: string;
};

export type IdeasFrame =
  // A tool call started. Purely cosmetic: it turns a 30-second silence into a
  // visible sequence of steps, which is the difference between "it is thinking"
  // and "it is broken".
  | { type: "tool"; activity: ToolActivity }
  // Reels a tool surfaced, sent as they arrive so a [[reel:CODE]] citation
  // always has its card data by the time the text mentioning it streams in.
  | { type: "reels"; reels: ReelRow[] }
  | { type: "delta"; text: string }
  // The answer stopped early but what arrived is real and worth keeping: the
  // length cap, the research budget, the wall clock. Distinct from `error`,
  // which means there is nothing usable, because folding the two together is
  // how a half-finished answer gets presented as a finished one.
  | { type: "notice"; message: string }
  | { type: "error"; message: string }
  // Last frame of a clean run. No `done` frame means the stream was cut off.
  | { type: "done"; reason: string };

/** The citation the model writes inline, e.g. `[[reel:DXmqMtujoIf]]`.
 *  Shortcodes are Instagram's own base64-ish alphabet, so the character class is
 *  tight enough that no ordinary prose can be mistaken for one. */
export const REEL_CITATION = /\[\[reel:([A-Za-z0-9_-]{5,20})\]\]/g;
