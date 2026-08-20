"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, Loader2, Square } from "lucide-react";
import { useIdeasChat, type UiStep } from "../use-ideas-chat";
import { Answer } from "./answer";

/**
 * What to say if you do not know what to say.
 *
 * All three are a brand, not a question, because that is the input the page is
 * built for and the one people do not think to give. "give me reel ideas"
 * produces generic reel ideas from any chatbot; the library only earns its keep
 * once it knows who is filming.
 */
const EXAMPLES = [
  "i'm a personal trainer in london, i coach women over 40 who have never lifted before. i film on my phone at the gym.",
  "we sell a b2b saas that reconciles invoices for accounting firms. nobody on the team wants to be on camera.",
  "i'm a wedding photographer. i want more couples in my area to find me, and i have hundreds of hours of old footage.",
];

// Short enough to fit the closed one-row box. The longer version wrapped onto a
// second line the composer had no height for, so it read as a truncated word.
const PLACEHOLDER = "describe your brand, and who it's for";

function Steps({ steps, running }: { steps: UiStep[]; running: boolean }) {
  if (!steps.length) return null;
  return (
    <ol className="space-y-1.5">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const spinning = running && last;
        return (
          <li
            key={s.id}
            className="flex items-start gap-2 font-body text-xs text-silver-muted"
          >
            {spinning ? (
              <Loader2 className="mt-0.5 size-3 shrink-0 animate-spin text-vivid-blue" aria-hidden />
            ) : (
              <Check className="mt-0.5 size-3 shrink-0 text-silver-muted/60" aria-hidden />
            )}
            <span className="min-w-0">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function IdeasChat() {
  const { turns, reels, isStreaming, send, retry, stop } = useIdeasChat();
  const [draft, setDraft] = useState("");
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);

  // Follow the answer down, but only while it is the newest thing on the page.
  // Scrolling on every delta would fight a visitor reading back up the answer.
  const pinned = useRef(true);
  useEffect(() => {
    const onScroll = () => {
      const gap =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      pinned.current = gap < 160;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (pinned.current) tailRef.current?.scrollIntoView({ block: "end" });
  }, [turns]);

  const submit = (text: string) => {
    if (!text.trim() || isStreaming) return;
    // Sending is an explicit "show me this", so it always re-pins the view. Ask
    // a follow-up while scrolled up without this and the question and its whole
    // answer land off-screen, which reads as the page having frozen.
    pinned.current = true;
    setDraft("");
    // Reset the grown textarea, or an empty box keeps the height of the brand
    // description that was just sent.
    if (boxRef.current) boxRef.current.style.height = "auto";
    void send(text);
  };

  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  };

  return (
    <div className="space-y-6">
      {turns.length === 0 && (
        <div className="space-y-4">
          <p className="font-body text-sm leading-relaxed text-silver-muted">
            tell it about your brand. it reads a library of instagram reels that
            each beat their own creator&apos;s audience by 5x or more, then comes
            back with ideas you could actually film: five angles from your own
            niche, five formats stolen from niches that have nothing to do with
            you.
          </p>
          <div className="space-y-2">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => submit(e)}
                className="block w-full rounded-xl border border-hairline bg-navy-raised/40 p-3 text-left font-body text-sm text-silver-muted transition-colors hover:border-vivid-blue/50 hover:text-white"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {turns.map((turn, i) =>
        turn.role === "user" ? (
          <div key={i} className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-vivid-blue/15 px-4 py-2.5 font-body text-base leading-relaxed text-silver">
              {turn.content}
            </p>
          </div>
        ) : (
          <div key={i} className="space-y-4">
            <Steps steps={turn.steps ?? []} running={!!turn.streaming} />

            {turn.streaming && !turn.content && !turn.steps?.length && (
              <p className="font-body text-xs text-silver-muted">thinking</p>
            )}

            {turn.content && (
              <Answer
                text={turn.content}
                reels={reels}
                streaming={turn.streaming}
                tone={turn.error ? "error" : undefined}
              />
            )}

            {/* Not finished, for whatever reason. The notice says which, when
                the route knew; otherwise the stream simply died. */}
            {!turn.streaming && turn.interrupted && !turn.stopped && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-body text-sm text-amber-300">
                <span>
                  {turn.notice ??
                    "that answer was cut off before it finished. it wasn't you."}
                </span>
                <button
                  type="button"
                  onClick={() => void retry()}
                  className="rounded-full bg-amber-500/20 px-3 py-1.5 font-medium text-amber-100 transition-colors hover:bg-amber-500/30"
                >
                  try again
                </button>
              </div>
            )}

            {!turn.streaming && turn.stopped && (
              <p className="font-body text-xs text-silver-muted">you stopped this one.</p>
            )}
          </div>
        ),
      )}

      {/* The composer sits 16px off the bottom, so the last card needs somewhere
          to end that is not underneath it. */}
      <div ref={tailRef} className="h-2" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
        // Sticky rather than fixed: fixed would take the popup-breaking route of
        // reporting a viewport-sized element, and sticky keeps the box in the
        // document flow so the answer above it scrolls normally.
        className="sticky bottom-4 flex items-end gap-2 rounded-2xl border border-hairline bg-navy/95 p-2 backdrop-blur"
      >
        <label className="sr-only" htmlFor="brand">
          describe your brand
        </label>
        <textarea
          id="brand"
          ref={boxRef}
          rows={1}
          value={draft}
          placeholder={PLACEHOLDER}
          onChange={(e) => {
            setDraft(e.target.value);
            grow(e.target);
          }}
          onKeyDown={(e) => {
            // Enter sends, shift-enter breaks the line. The input is often a
            // paragraph, so the break has to stay reachable.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(draft);
            }
          }}
          className="max-h-[220px] min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 font-body text-base text-silver outline-none placeholder:text-silver-muted/70"
        />
        {/* While an answer is running the same slot becomes a stop button, so
            a visitor who asked the wrong thing is never stuck watching an
            answer they do not want being generated and billed. */}
        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            aria-label="stop"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-silver/10 text-silver transition-colors hover:bg-silver/20"
          >
            <Square className="size-3.5 fill-current" aria-hidden />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="send"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-vivid-blue text-white transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        )}
      </form>
    </div>
  );
}
