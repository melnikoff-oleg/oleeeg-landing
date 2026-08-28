"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBrainChat } from "./use-brain-chat";
import { useMemory } from "./use-memory";
import { ChatMessage } from "./components/chat-message";
import { ContextDrawer } from "./components/context-drawer";
import { ExpertStrip } from "./components/expert-strip";

const STARTERS = [
  "Make an irresistible offer",
  "Outbound or content?",
  "Get my first 5 customers",
  "Thumbnails that get clicks",
];

export default function MarketingBrainPage() {
  const { messages, isStreaming, send, retry, continueLast } = useBrainChat();
  const memory = useMemory();
  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autoCapture, setAutoCapture] = useState(true);
  const [toast, setToast] = useState<{ added: string; previous: string } | null>(null);
  const autoFollow = useRef(true);
  const lastY = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const started = messages.length > 0;

  // Grow the composer to fit its content (up to max-h-40, then it scrolls).
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Persisted auto-capture preference.
  useEffect(() => {
    const v = localStorage.getItem("mb-auto-capture");
    if (v !== null) setAutoCapture(v === "1");
  }, []);
  const toggleAutoCapture = (v: boolean) => {
    setAutoCapture(v);
    localStorage.setItem("mb-auto-capture", v ? "1" : "0");
  };

  // Auto-dismiss the "Added to your context" toast.
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Follow the stream to the bottom, but the moment the user scrolls UP,
  // disengage and leave them be. Re-engage only when they return to the bottom.
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const distance =
        document.documentElement.scrollHeight - y - window.innerHeight;
      if (y < lastY.current - 2) {
        autoFollow.current = false;
      } else if (distance < 80) {
        autoFollow.current = true;
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (autoFollow.current) {
      window.scrollTo({ top: document.documentElement.scrollHeight });
    }
  }, [messages]);

  const submit = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    autoFollow.current = true;
    setInput("");
    // shrink the composer back to one line after sending
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) el.style.height = "auto";
    });
    await send(text, memory.text);
    // After the answer, optionally capture any durable business fact.
    if (autoCapture) {
      const res = await memory.maybeExtract(text);
      if (res) setToast(res);
    }
  };

  const undoCapture = async () => {
    if (!toast) return;
    await memory.save(toast.previous);
    setToast(null);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="brand-wordmark font-display text-lg tracking-tight"
          >
            Oleg Melnikov
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
            >
              your context
              {memory.hasContext && (
                <span className="size-1.5 rounded-full bg-emerald-400" title="Personalized: on" />
              )}
            </button>
            <Link
              href="/marketing-brain-knowledge"
              className="hidden min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white sm:inline-flex"
            >
              browse the sources
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col">
        {/* ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(40,99,240,0.18),transparent)]"
        />

        {!started ? (
          // Empty state / hero
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-12 text-center"
          >
            <h1 className="text-metallic w-full min-w-0 font-display text-[1.9rem] leading-[1.1] tracking-tight sm:text-6xl">
              $1B Marketing Brain
            </h1>

            <ExpertStrip />

            <div className="mt-8 flex w-full flex-wrap justify-center gap-2.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-hairline px-5 py-2.5 font-body text-[15px] text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex min-h-[44px] items-center font-body text-sm text-silver-muted underline decoration-silver-muted/50 underline-offset-4 transition-colors hover:text-silver"
              >
                {memory.hasContext
                  ? "✦ edit your context"
                  : "✦ add your business context"}
              </button>
              {/* Mobile-only: on sm+ the header already shows "Browse the sources". */}
              <Link
                href="/marketing-brain-knowledge"
                className="inline-flex min-h-[44px] items-center font-body text-sm text-silver-muted underline decoration-silver-muted/50 underline-offset-4 transition-colors hover:text-silver sm:hidden"
              >
                browse the sources
              </Link>
            </div>
          </motion.div>
        ) : (
          // Conversation
          <div className="mx-auto w-full max-w-3xl flex-1 px-6 pt-8 pb-40">
            <div className="space-y-8">
              {messages.map((m, i) => {
                // Action buttons only make sense on the most recent answer.
                const isLast = i === messages.length - 1;
                return (
                  <ChatMessage
                    key={i}
                    message={m}
                    onContinue={
                      isLast && !isStreaming
                        ? () => {
                            autoFollow.current = true;
                            continueLast(memory.text);
                          }
                        : undefined
                    }
                    onRetry={
                      isLast && !isStreaming
                        ? () => {
                            autoFollow.current = true;
                            retry(memory.text);
                          }
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="sticky bottom-0 border-t border-hairline bg-navy/70 backdrop-blur-md">
          <div className="mx-auto w-full max-w-3xl px-6 py-4">
            {/* "Added to your context" toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-hairline surface-card px-4 py-2.5 font-body text-sm"
                >
                  <span className="min-w-0 truncate text-silver">
                    ✦ added to your context
                  </span>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={undoCapture}
                      className="text-silver-muted underline decoration-silver-muted/50 underline-offset-2 hover:text-white"
                    >
                      undo
                    </button>
                    <button
                      type="button"
                      onClick={() => setToast(null)}
                      className="text-silver-muted hover:text-silver"
                      aria-label="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-end gap-2 rounded-2xl border border-hairline surface-card p-2 focus-within:border-vivid-blue/50"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resizeTextarea();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                rows={1}
                placeholder="Ask the brain…"
                // text-base below sm: inputs under 16px make iOS Safari zoom on focus
                className="max-h-40 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2 font-body text-base text-silver placeholder:text-silver-muted focus:outline-none sm:text-[15px]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-vivid-blue text-white shadow-[0_10px_40px_-12px_rgba(40,99,240,0.7)] transition-colors hover:bg-[#1b50d8] disabled:opacity-30"
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>

      <ContextDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        memory={memory}
        autoCapture={autoCapture}
        setAutoCapture={toggleAutoCapture}
      />
    </div>
  );
}
