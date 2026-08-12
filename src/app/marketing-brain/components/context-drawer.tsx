"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { useMemory } from "../use-memory";

type Memory = ReturnType<typeof useMemory>;

export function ContextDrawer({
  open,
  onClose,
  memory,
  autoCapture,
  setAutoCapture,
}: {
  open: boolean;
  onClose: () => void;
  memory: Memory;
  autoCapture: boolean;
  setAutoCapture: (v: boolean) => void;
}) {
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // At 390px the drawer covers the backdrop, so Escape must work as an exit too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onScrape = async () => {
    if (!url.trim() || memory.working) return;
    const ok = await memory.scrape(url.trim());
    if (ok) setUrl("");
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || memory.working) return;
    for (const f of Array.from(files)) {
      await memory.upload(f);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-hairline bg-navy"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <h2 className="font-display text-lg tracking-tight text-silver">
                your business context
              </h2>
              <button
                type="button"
                onClick={onClose}
                // 44px tap target; negative margins keep the header height unchanged
                className="-my-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-silver-muted transition-colors hover:bg-vivid-blue/10 hover:text-white"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <p className="font-body text-sm leading-relaxed text-silver-muted">
                tell the brain about your business so its advice is personalized to
                you: your offers, audience, and goals. add a website, upload files,
                or just write it below.
              </p>

              {/* Website */}
              <div className="space-y-2">
                <label className="eyebrow text-xs font-medium text-vivid-blue/80">
                  scrape a website
                </label>
                <div className="flex gap-2">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onScrape()}
                    placeholder="yourbusiness.com"
                    // text-base: inputs under 16px make iOS Safari zoom on focus
                    className="min-w-0 flex-1 rounded-lg border border-hairline surface-raised px-3 py-2 font-body text-base text-silver placeholder:text-silver-muted focus:border-vivid-blue/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={onScrape}
                    disabled={!url.trim() || !!memory.working}
                    className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-vivid-blue px-4 py-2 font-body text-sm font-medium text-white shadow-[0_10px_40px_-12px_rgba(40,99,240,0.7)] transition-colors hover:bg-[#1b50d8] disabled:opacity-40"
                  >
                    {memory.working === "scrape" ? "reading…" : "scrape"}
                  </button>
                </div>
              </div>

              {/* Files */}
              <div className="space-y-2">
                <label className="eyebrow text-xs font-medium text-vivid-blue/80">
                  upload files (pdf, txt, md)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                  onChange={(e) => onFiles(e.target.files)}
                  disabled={!!memory.working}
                  className="block w-full font-body text-sm text-silver-muted file:mr-3 file:rounded-full file:border-0 file:bg-vivid-blue/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-silver hover:file:bg-vivid-blue/25"
                />
                {memory.working === "upload" && (
                  <p className="font-body text-xs text-silver-muted">reading file…</p>
                )}
              </div>

              {memory.error && (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-body text-xs text-amber-300">
                  {memory.error}
                </p>
              )}

              {/* Editor */}
              <div className="space-y-2">
                <label className="eyebrow text-xs font-medium text-vivid-blue/80">
                  what the brain knows
                </label>
                <textarea
                  value={memory.text}
                  onChange={(e) => memory.setText(e.target.value)}
                  placeholder="e.g. I run Boldane, premium personal branding for founders with real expertise…"
                  rows={12}
                  // text-base: inputs under 16px make iOS Safari zoom on focus
                  className="w-full resize-y rounded-lg border border-hairline surface-raised px-3 py-2 font-body text-base leading-relaxed text-silver placeholder:text-silver-muted focus:border-vivid-blue/50 focus:outline-none"
                />
              </div>

              {/* Auto-capture toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-hairline surface-raised px-3 py-2.5">
                <span className="font-body text-sm text-silver">
                  auto-capture facts from chat
                  <span className="mt-0.5 block text-xs text-silver-muted">
                    save new business details you mention while chatting
                  </span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoCapture}
                  onClick={() => setAutoCapture(!autoCapture)}
                  className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
                    autoCapture ? "bg-vivid-blue" : "bg-vivid-blue/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-5 rounded-full transition-all ${
                      autoCapture ? "left-[1.125rem] bg-white" : "left-0.5 bg-silver-muted"
                    }`}
                  />
                </button>
              </label>
            </div>

            <div className="border-t border-hairline px-6 py-4">
              <button
                type="button"
                onClick={() => memory.save(memory.text)}
                disabled={!!memory.working}
                className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-vivid-blue px-4 py-2.5 font-body text-sm font-medium text-white shadow-[0_10px_40px_-12px_rgba(40,99,240,0.7)] transition-colors hover:bg-[#1b50d8] disabled:opacity-40"
              >
                {memory.working === "save" ? "saving…" : "save context"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
