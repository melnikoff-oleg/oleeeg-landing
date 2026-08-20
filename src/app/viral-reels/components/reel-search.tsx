"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  QUERY_MAX,
  RESULT_COUNT,
  WINDOWS,
  type ReelHit,
  type WindowDays,
} from "@/lib/reels/types";
import { ReelCard } from "@/components/reel-card";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; query: string; results: ReelHit[] }
  | { kind: "error"; message: string };

function Skeletons() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="surface-card flex gap-4 p-4 sm:gap-5 sm:p-5">
          <div className="aspect-[9/16] w-24 shrink-0 animate-pulse rounded-xl bg-silver/5 sm:w-32" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-3 w-32 animate-pulse rounded bg-silver/5" />
            <div className="h-4 w-full animate-pulse rounded bg-silver/5" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-silver/5" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-silver/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReelSearch({
  initialQuery,
  initialDays,
}: {
  initialQuery: string;
  initialDays: WindowDays;
}) {
  const [input, setInput] = useState(initialQuery);
  const [days, setDays] = useState<WindowDays>(initialDays);
  const [state, setState] = useState<State>({ kind: "idle" });
  const inflight = useRef<AbortController | null>(null);

  const run = useCallback(async (raw: string, window: WindowDays) => {
    const query = raw.trim();
    if (!query) return;

    // A new search abandons the one before it, so a fast typist never sees an
    // older answer overwrite a newer one.
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;

    setState({ kind: "loading" });

    // Shareable, and a reload keeps both the words and the window.
    // replaceState rather than a router push so the back button still leaves
    // the page.
    const url = new URL(globalThis.location.href);
    url.searchParams.set("q", query);
    if (window === null) url.searchParams.delete("d");
    else url.searchParams.set("d", String(window));
    globalThis.history.replaceState(null, "", url);

    try {
      const res = await fetch("/api/viral-reels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, days: window }),
        signal: controller.signal,
      });
      const json = (await res.json().catch(() => ({}))) as {
        results?: ReelHit[];
        error?: string;
      };
      if (controller.signal.aborted) return;
      if (!res.ok) {
        setState({
          kind: "error",
          message:
            json.error === "rate_limited"
              ? "that is a lot of searching for one day. try again tomorrow."
              : "the search did not come back. try again in a moment.",
        });
        return;
      }
      setState({ kind: "done", query, results: json.results ?? [] });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState({
        kind: "error",
        message: "the search did not come back. try again in a moment.",
      });
    }
  }, []);

  // A shared link arrives with ?q= already filled in and searches on its own.
  useEffect(() => {
    if (initialQuery.trim()) void run(initialQuery, initialDays);
  }, [initialQuery, initialDays, run]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run(input, days);
  };

  // Changing the window re-runs the current words straight away: a filter that
  // needs a second click on "search" reads as broken.
  const pickWindow = (next: WindowDays) => {
    setDays(next);
    if (input.trim()) void run(input, next);
  };

  const results = state.kind === "done" ? state.results : [];

  return (
    <div>
      <form onSubmit={submit} className="relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-silver-muted"
          aria-hidden
        />
        <label htmlFor="reel-query" className="sr-only">
          what do you want to make a reel about?
        </label>
        <input
          id="reel-query"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={QUERY_MAX}
          autoComplete="off"
          enterKeyHint="search"
          autoFocus
          placeholder="what is your reel about?"
          className="h-14 w-full rounded-full border border-hairline bg-navy-raised pl-13 pr-28 font-body text-base text-silver outline-none transition-colors placeholder:text-silver-muted focus:border-vivid-blue/60 sm:h-16 sm:pr-32 sm:text-lg"
        />
        <button
          type="submit"
          disabled={!input.trim() || state.kind === "loading"}
          className="absolute right-2 top-1/2 inline-flex h-11 -translate-y-1/2 items-center gap-2 rounded-full bg-vivid-blue px-5 font-body text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 sm:h-12 sm:px-6"
        >
          {state.kind === "loading" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          search
        </button>
      </form>

      {/* The one control besides the box: how new the reel has to be. Moving
          between the three pages is ReelNav's job, above this component. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div
          role="group"
          aria-label="how new the reel is"
          className="flex flex-wrap gap-2"
        >
          {WINDOWS.map((w) => {
            const active = w.days === days;
            return (
              <button
                key={w.label}
                type="button"
                aria-pressed={active}
                onClick={() => pickWindow(w.days)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 font-body text-xs transition-colors ${
                  active
                    ? "border-vivid-blue bg-vivid-blue/10 text-white"
                    : "border-hairline text-silver-muted hover:border-vivid-blue/50 hover:text-white"
                }`}
              >
                {w.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="scroll-mt-6">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {state.kind === "loading" && "searching"}
          {state.kind === "done" &&
            (results.length
              ? `showing ${results.length} reels`
              : "no reels matched")}
          {state.kind === "error" && state.message}
        </div>

        {state.kind === "loading" && (
          <div className="mt-8">
            <Skeletons />
          </div>
        )}

        {state.kind === "error" && (
          <p className="mt-8 rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
            {state.message}
          </p>
        )}

        {state.kind === "done" && results.length === 0 && (
          <p className="mt-8 rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
            {days === null
              ? "nothing in the database is close to that yet. try describing what happens on screen instead of naming a topic."
              : "nothing that new is close to that. try a wider window."}
          </p>
        )}

        {state.kind === "done" && results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.slice(0, RESULT_COUNT).map((reel, i) => (
              <ReelCard key={reel.shortcode} reel={reel} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
