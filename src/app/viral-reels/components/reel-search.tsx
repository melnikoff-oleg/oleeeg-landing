"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { QUERY_MAX, TOP_COUNT, type ReelHit } from "@/lib/reels/types";
import { ReelCard } from "./reel-card";

/** Seeds, not suggestions: each one lands somewhere different in the corpus. */
const EXAMPLES = [
  "before and after transformation",
  "day in my life",
  "a trick that looks impossible",
  "teaching one thing fast",
  "street interview",
  "satisfying process",
];

type State =
  | { kind: "idle" }
  | { kind: "loading"; query: string }
  | { kind: "done"; query: string; results: ReelHit[] }
  | { kind: "error"; query: string; message: string };

function Skeletons() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: TOP_COUNT }, (_, i) => (
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

export function ReelSearch({ initialQuery }: { initialQuery: string }) {
  const [input, setInput] = useState(initialQuery);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [showAll, setShowAll] = useState(false);
  const inflight = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const run = useCallback(async (raw: string) => {
    const query = raw.trim();
    if (!query) return;

    // A new search abandons the one before it, so a fast typist never sees an
    // older answer overwrite a newer one.
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;

    setShowAll(false);
    setState({ kind: "loading", query });

    // Shareable, and a reload keeps the search. replaceState rather than a
    // router push so the back button still leaves the page.
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.replaceState(null, "", url);

    try {
      const res = await fetch("/api/viral-reels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
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
          query,
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
        query,
        message: "the search did not come back. try again in a moment.",
      });
    }
  }, []);

  // A shared link arrives with ?q= already filled in and searches on its own.
  useEffect(() => {
    if (initialQuery.trim()) void run(initialQuery);
  }, [initialQuery, run]);

  // Only scroll for a search the visitor started, never for the first paint of
  // a shared link, where the results are already the top of the page they asked
  // for.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run(input);
    resultsRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const results = state.kind === "done" ? state.results : [];
  const visible = showAll ? results : results.slice(0, TOP_COUNT);
  const hidden = results.length - visible.length;
  const announcement = results.length
    ? `showing ${visible.length} reels${hidden ? `, ${hidden} more available` : ""}`
    : "no reels matched";

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

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setInput(example);
              void run(example);
              resultsRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-hairline px-4 font-body text-xs text-silver-muted transition-colors hover:border-vivid-blue/50 hover:text-white"
          >
            {example}
          </button>
        ))}
      </div>

      <div ref={resultsRef} className="scroll-mt-6">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {state.kind === "loading" && "searching"}
          {state.kind === "done" && announcement}
          {state.kind === "error" && state.message}
        </div>

        {state.kind === "loading" && (
          <div className="mt-10">
            <Skeletons />
          </div>
        )}

        {state.kind === "error" && (
          <p className="mt-10 rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
            {state.message}
          </p>
        )}

        {state.kind === "done" && results.length === 0 && (
          <p className="mt-10 rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
            nothing in the database is close to that yet. try describing what
            happens on screen instead of naming a topic.
          </p>
        )}

        {state.kind === "done" && results.length > 0 && (
          <>
            <h2 className="mt-10 mb-4 font-body text-sm font-normal text-silver-muted">
              closest reels to{" "}
              <span className="text-silver">&ldquo;{state.query}&rdquo;</span>
            </h2>
            <div className="space-y-4">
              {visible.map((reel, i) => (
                <ReelCard key={reel.shortcode} reel={reel} rank={i + 1} />
              ))}
            </div>
            {hidden > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-6 flex min-h-11 w-full items-center justify-center rounded-full border border-hairline font-body text-sm text-silver-muted transition-colors hover:border-vivid-blue/50 hover:text-white"
              >
                show {hidden} more
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
