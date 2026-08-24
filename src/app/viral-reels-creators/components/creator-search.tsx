"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  CREATOR_QUERY_MAX,
  CREATOR_RESULT_COUNT,
  DEPTH_STOPS,
  filtersAreEmpty,
  type CreatorFilters,
  type CreatorHit,
  type CreatorRow,
  type DepthReels,
} from "@/lib/creators/types";
import { CreatorCard } from "@/components/creator-card";
import { CreatorFilterBar } from "./creator-filters";

/**
 * Put the filters on a URLSearchParams, omitting every one that is unset.
 *
 * Omitting rather than writing an empty value keeps a shared link honest: a URL
 * with no `edu=` in it filters on nothing, which is exactly what it looks like.
 * Shared by the roster's page links and by the search's replaceState.
 */
function writeFilters(params: URLSearchParams, f: CreatorFilters) {
  if (f.band > 0) params.set("band", String(f.band));
  else params.delete("band");
  for (const [key, value] of [
    ["ent", f.minEntertaining],
    ["edu", f.minEducational],
    ["insp", f.minInspirational],
  ] as const) {
    if (value === null) params.delete(key);
    else params.set(key, String(value));
  }
}

/** The roster's own URL, carrying the depth and every set filter with it. */
function pageHref(page: number, depth: DepthReels, filters: CreatorFilters): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (depth > 1) params.set("r", String(depth));
  writeFilters(params, filters);
  const query = params.toString();
  return query ? `/viral-reels-creators?${query}` : "/viral-reels-creators";
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex min-h-11 items-center rounded-full border border-hairline px-5 font-body text-xs transition-colors";
  if (disabled) {
    return (
      <span className={`${base} text-silver-muted/40`} aria-disabled>
        {children}
      </span>
    );
  }
  return (
    <a href={href} className={`${base} text-silver hover:border-vivid-blue/50 hover:text-white`}>
      {children}
    </a>
  );
}

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; query: string; results: CreatorHit[] }
  | { kind: "error"; message: string };

function Skeletons() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="surface-card flex gap-4 p-4 sm:gap-5 sm:p-5">
          <div className="size-14 shrink-0 animate-pulse rounded-full bg-silver/5 sm:size-16" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 w-40 animate-pulse rounded bg-silver/5" />
            <div className="h-3 w-28 animate-pulse rounded bg-silver/5" />
            <div className="h-3 w-full animate-pulse rounded bg-silver/5" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-silver/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The creator search, and the roster underneath it.
 *
 * Unlike /viral-reels, this page shows something before a visitor types: the
 * creators the database has read the most of, server-rendered. A search box over
 * an empty page asks the visitor to guess what is in here; a roster answers that
 * before they ask, and a search then replaces it.
 */
export function CreatorSearch({
  initialQuery,
  initialDepth,
  initialFilters,
  roster,
  rosterTotal,
  rosterPage,
  rosterPages,
}: {
  initialQuery: string;
  initialDepth: DepthReels;
  initialFilters: CreatorFilters;
  roster: CreatorRow[];
  rosterTotal: number;
  rosterPage: number;
  rosterPages: number;
}) {
  const [input, setInput] = useState(initialQuery);
  const [depth, setDepth] = useState<DepthReels>(initialDepth);
  const [filters, setFilters] = useState<CreatorFilters>(initialFilters);
  const [state, setState] = useState<State>({ kind: "idle" });
  const inflight = useRef<AbortController | null>(null);

  const run = useCallback(async (
    raw: string,
    minReels: DepthReels,
    active: CreatorFilters,
  ) => {
    const query = raw.trim();
    if (!query) return;

    // A new search abandons the one before it, so a fast typist never sees an
    // older answer overwrite a newer one.
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;

    setState({ kind: "loading" });

    // Shareable, and a reload keeps both the words and the depth. replaceState
    // rather than a router push so the back button still leaves the page.
    const url = new URL(globalThis.location.href);
    url.searchParams.set("q", query);
    if (minReels <= 1) url.searchParams.delete("r");
    else url.searchParams.set("r", String(minReels));
    writeFilters(url.searchParams, active);
    globalThis.history.replaceState(null, "", url);

    try {
      const res = await fetch("/api/viral-reels/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, minReels, ...active }),
        signal: controller.signal,
      });
      const json = (await res.json().catch(() => ({}))) as {
        results?: CreatorHit[];
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
  // Deliberately keyed on the INITIAL values, not the live ones: keying it on
  // `filters` would re-fire this effect on every filter change and race the
  // explicit search that the change already triggers.
  useEffect(() => {
    if (initialQuery.trim()) void run(initialQuery, initialDepth, initialFilters);
  }, [initialQuery, initialDepth, initialFilters, run]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run(input, depth, filters);
  };

  // Changing the depth re-runs the current words straight away: a filter that
  // needs a second click on "search" reads as broken. With nothing typed it
  // still has to reload, because the roster underneath is server-rendered.
  const pickDepth = (next: DepthReels) => {
    setDepth(next);
    if (input.trim()) {
      void run(input, next, filters);
      return;
    }
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("page");
    if (next <= 1) url.searchParams.delete("r");
    else url.searchParams.set("r", String(next));
    globalThis.location.assign(url.toString());
  };

  /**
   * Same contract as the depth chips: a filter applies the moment it is set.
   *
   * With words in the box that is a new search. With an empty box the roster
   * underneath is server-rendered, so the only way to re-filter it is a reload,
   * and page is dropped because page 7 of an unfiltered roster is rarely a page
   * of the filtered one.
   */
  const pickFilters = (next: CreatorFilters) => {
    setFilters(next);
    if (input.trim()) {
      void run(input, depth, next);
      return;
    }
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("page");
    writeFilters(url.searchParams, next);
    globalThis.location.assign(url.toString());
  };

  const results = state.kind === "done" ? state.results : [];
  const showRoster = state.kind === "idle";

  return (
    <div>
      <form onSubmit={submit} className="relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-silver-muted"
          aria-hidden
        />
        <label htmlFor="creator-query" className="sr-only">
          what kind of creator are you looking for?
        </label>
        <input
          id="creator-query"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={CREATOR_QUERY_MAX}
          autoComplete="off"
          enterKeyHint="search"
          autoFocus
          placeholder="what kind of creator are you looking for?"
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

      {/* The one control besides the box: how much of a creator the database has
          to have read before they count. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div
          role="group"
          aria-label="how many of their reels the database has read"
          className="flex flex-wrap gap-2"
        >
          {DEPTH_STOPS.map((d) => {
            const active = d.reels === depth;
            return (
              <button
                key={d.label}
                type="button"
                aria-pressed={active}
                onClick={() => pickDepth(d.reels)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 font-body text-xs transition-colors ${
                  active
                    ? "border-vivid-blue bg-vivid-blue/10 text-white"
                    : "border-hairline text-silver-muted hover:border-vivid-blue/50 hover:text-white"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <CreatorFilterBar filters={filters} onChange={pickFilters} />

      <div className="scroll-mt-6">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {state.kind === "loading" && "searching"}
          {state.kind === "done" &&
            (results.length
              ? `showing ${results.length} creators`
              : "no creators matched")}
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
            {!filtersAreEmpty(filters)
              ? "nobody matching those filters is close to that. try loosening one."
              : depth > 1
                ? "nobody the database knows that well is close to that. try the shallower filter."
                : "nobody in the database is close to that. try describing what they make rather than naming them."}
          </p>
        )}

        {state.kind === "done" && results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.slice(0, CREATOR_RESULT_COUNT).map((creator, i) => (
              <CreatorCard key={creator.account} creator={creator} />
            ))}
          </div>
        )}

        {showRoster && (
          <div className="mt-8">
            <p className="mb-4 text-xs text-silver-muted">
              {filtersAreEmpty(filters)
                ? `${rosterTotal} creators in the database, the ones it has read the most of first`
                : `${rosterTotal} ${rosterTotal === 1 ? "creator matches" : "creators match"} those filters`}
            </p>
            <div className="space-y-4">
              {roster.map((creator) => (
                <CreatorCard key={creator.account} creator={creator} />
              ))}
            </div>

            {/* Plain links, not buttons. Paging the roster is a new server
                render either way, so a router push would only add JavaScript to
                do what an anchor already does, and each page stays shareable. */}
            {rosterPages > 1 && (
              <nav
                aria-label="roster pages"
                className="mt-6 flex items-center justify-between gap-3"
              >
                <PageLink
                  href={pageHref(rosterPage - 1, depth, filters)}
                  disabled={rosterPage <= 1}
                >
                  newer
                </PageLink>
                <span className="font-body text-xs tabular-nums text-silver-muted">
                  page {rosterPage} of {rosterPages}
                </span>
                <PageLink
                  href={pageHref(rosterPage + 1, depth, filters)}
                  disabled={rosterPage >= rosterPages}
                >
                  more
                </PageLink>
              </nav>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
