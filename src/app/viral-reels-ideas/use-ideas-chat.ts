"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IdeasFrame, IdeasMessage } from "@/lib/reels/ideas-types";
import type { ReelRow } from "@/lib/reels/types";

/** One step line, keyed by the tool_use block it describes. */
export type UiStep = { id: string; label: string };

export type UiTurn = {
  role: "user" | "assistant";
  content: string;
  /** The steps the model took, in order, newest last. */
  steps?: UiStep[];
  streaming?: boolean;
  /** Hard failure: there is nothing usable and `content` holds the reason. */
  error?: boolean;
  /**
   * The answer stopped before it was finished. Held apart from `content` so a
   * half answer keeps everything that streamed AND says it is a half answer.
   * Folding the two together meant the message was dropped whenever any text
   * had already arrived, which is exactly when the warning matters.
   */
  notice?: string;
  /** Not finished, for any reason. Gates the retry button. */
  interrupted?: boolean;
  /** The visitor pressed stop. Not a failure, so no banner. */
  stopped?: boolean;
};

/** The only stop reasons that mean the model said everything it meant to. */
const CLEAN_STOPS = new Set(["end_turn", "stop_sequence"]);

const ENDPOINT = "/api/viral-reels/ideas";

/**
 * Reads the NDJSON stream.
 *
 * Split on newlines and keep the tail: a frame can arrive in two chunks, and
 * parsing half of one and throwing it away is the classic way to lose the
 * middle of an answer.
 */
async function consume(
  body: ReadableStream<Uint8Array>,
  on: {
    tool: (step: UiStep) => void;
    reels: (reels: ReelRow[]) => void;
    delta: (text: string) => void;
    notice: (message: string) => void;
    error: (message: string) => void;
  },
): Promise<string | null> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let doneReason: string | null = null;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      let frame: IdeasFrame;
      try {
        frame = JSON.parse(line);
      } catch {
        continue;
      }
      if (frame.type === "tool") on.tool(frame.activity);
      else if (frame.type === "reels") on.reels(frame.reels);
      else if (frame.type === "delta") on.delta(frame.text);
      else if (frame.type === "notice") on.notice(frame.message);
      else if (frame.type === "error") on.error(frame.message);
      else if (frame.type === "done") doneReason = frame.reason;
    }
  }
  return doneReason;
}

export function useIdeasChat() {
  const [turns, setTurns] = useState<UiTurn[]>([]);
  /**
   * Every reel any tool has surfaced this session, by shortcode.
   *
   * Kept for the whole conversation rather than per answer, because the model
   * refers back: "the second one" in turn four cites a reel a tool returned in
   * turn one, and the card has to still be there.
   */
  const [reels, setReels] = useState<Record<string, ReelRow>>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const busy = useRef(false);
  const turnsRef = useRef(turns);
  turnsRef.current = turns;
  // Lets the visitor stop a run, and lets an unmount stop it for them. Without
  // this, leaving the page mid-answer leaves the agent loop running to
  // completion against a connection nobody is reading, which is billed.
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);

  const run = useCallback(async (history: UiTurn[]) => {
    busy.current = true;
    setIsStreaming(true);

    const idx = history.length;
    setTurns([...history, { role: "assistant", content: "", steps: [], streaming: true }]);
    const patch = (fn: (t: UiTurn) => UiTurn) =>
      setTurns((prev) => prev.map((t, i) => (i === idx ? fn(t) : t)));

    let doneReason: string | null = null;
    let sawError = false;

    const controller = new AbortController();
    abort.current = controller;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history.map(
            (t): IdeasMessage => ({ role: t.role, content: t.content }),
          ),
        }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        sawError = true;
        patch((t) => ({
          ...t,
          error: true,
          content:
            data?.message ??
            "you've used today's questions. reach out on linkedin (linkedin.com/in/olegane).",
        }));
        return;
      }
      if (res.status === 503) {
        sawError = true;
        patch((t) => ({
          ...t,
          error: true,
          content: "the ideas chat isn't switched on right now. the search and the library still work.",
        }));
        return;
      }
      if (!res.ok || !res.body) {
        patch((t) => ({ ...t, interrupted: true }));
        return;
      }

      doneReason = await consume(res.body, {
        tool: (step) =>
          patch((t) => {
            // Each call is announced twice: once when its block opens, before
            // the arguments have streamed, and again once they are known. The
            // second is strictly better, so it replaces the first, matched on
            // the block id rather than on how the label happens to read.
            const steps = t.steps ?? [];
            const at = steps.findIndex((s) => s.id === step.id);
            if (at === -1) return { ...t, steps: [...steps, step] };
            const next = [...steps];
            next[at] = step;
            return { ...t, steps: next };
          }),
        reels: (rows) =>
          setReels((prev) => {
            const next = { ...prev };
            for (const r of rows) if (r.shortcode) next[r.shortcode] = r;
            return next;
          }),
        delta: (text) => patch((t) => ({ ...t, content: t.content + text })),
        notice: (message) => patch((t) => ({ ...t, notice: message })),
        error: (message) => {
          sawError = true;
          // A hard failure with text already on screen keeps the text and puts
          // the reason in the banner. Only an empty answer becomes the reason.
          patch((t) =>
            t.content
              ? { ...t, notice: message }
              : { ...t, error: true, content: message },
          );
        },
      });
    } catch (err) {
      // The visitor pressed stop, or left. Not a failure.
      if ((err as { name?: string } | null)?.name === "AbortError") {
        patch((t) => ({ ...t, stopped: true }));
      }
      // Anything else dropped mid-flight; `finally` marks it cut off.
    } finally {
      abort.current = null;
      patch((t) => {
        const base = { ...t, streaming: false };
        if (t.stopped || t.error) return base;
        // Not finished is not the same as failed, and every way of not
        // finishing has to reach the retry button: no `done` frame at all, or a
        // `done` whose reason says the model stopped for a reason of its own.
        if (doneReason === null || !CLEAN_STOPS.has(doneReason)) {
          return { ...base, interrupted: true };
        }
        if (sawError) return { ...base, interrupted: true };
        return base;
      });
      setIsStreaming(false);
      busy.current = false;
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy.current) return;
      await run([...turnsRef.current, { role: "user", content: question }]);
    },
    [run],
  );

  const retry = useCallback(async () => {
    if (busy.current) return;
    const msgs = [...turnsRef.current];
    while (msgs.length && msgs[msgs.length - 1].role === "assistant") msgs.pop();
    if (!msgs.length) return;
    await run(msgs);
  }, [run]);

  /** Cut the current answer short. The route sees the disconnect and stops
   *  generating, so this stops the spend as well as the spinner. */
  const stop = useCallback(() => abort.current?.abort(), []);

  return { turns, reels, isStreaming, send, retry, stop };
}
