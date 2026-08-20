"use client";

import { useCallback, useRef, useState } from "react";
import type { IdeasFrame, IdeasMessage } from "@/lib/reels/ideas-types";
import type { ReelRow } from "@/lib/reels/types";

export type UiTurn = {
  role: "user" | "assistant";
  content: string;
  /** The steps the model took, in order, newest last. */
  steps?: string[];
  streaming?: boolean;
  error?: boolean;
  /** The stream ended without a `done` frame: cut off, not finished. */
  interrupted?: boolean;
};

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
    tool: (label: string) => void;
    reels: (reels: ReelRow[]) => void;
    delta: (text: string) => void;
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
      if (frame.type === "tool") on.tool(frame.activity.label);
      else if (frame.type === "reels") on.reels(frame.reels);
      else if (frame.type === "delta") on.delta(frame.text);
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

  const run = useCallback(async (history: UiTurn[]) => {
    busy.current = true;
    setIsStreaming(true);

    const idx = history.length;
    setTurns([...history, { role: "assistant", content: "", steps: [], streaming: true }]);
    const patch = (fn: (t: UiTurn) => UiTurn) =>
      setTurns((prev) => prev.map((t, i) => (i === idx ? fn(t) : t)));

    let doneReason: string | null = null;
    let sawError = false;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        tool: (label) =>
          patch((t) => {
            // The route sends a step twice, once when the call starts (before
            // the arguments have streamed in) and once when they are known. The
            // second is strictly better, so it replaces the first.
            const steps = t.steps ?? [];
            const last = steps[steps.length - 1];
            if (last && label.startsWith(last)) {
              return { ...t, steps: [...steps.slice(0, -1), label] };
            }
            if (last === label) return t;
            return { ...t, steps: [...steps, label] };
          }),
        reels: (rows) =>
          setReels((prev) => {
            const next = { ...prev };
            for (const r of rows) if (r.shortcode) next[r.shortcode] = r;
            return next;
          }),
        delta: (text) => patch((t) => ({ ...t, content: t.content + text })),
        error: (message) => {
          sawError = true;
          patch((t) => ({ ...t, error: !t.content, content: t.content || message }));
        },
      });
    } catch {
      // Dropped mid-flight. Whatever streamed stays; `finally` marks it cut off.
    } finally {
      patch((t) => {
        const base = { ...t, streaming: false };
        if (sawError || t.error) return base;
        if (doneReason === null) return { ...base, interrupted: true };
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

  return { turns, reels, isStreaming, send, retry };
}
