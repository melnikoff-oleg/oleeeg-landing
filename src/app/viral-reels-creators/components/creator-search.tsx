"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  CREATOR_QUERY_MAX,
  FILTER_KEYS,
  normalizeCreatorQuery,
  readCreatorFilters,
  CREATOR_RESULT_COUNT,
  filtersAreEmpty,
  filtersToBody,
  NO_FILTERS,
  ROSTER_PAGE_SIZE,
  writeCreatorFilters,
  type CreatorFact,
  type CreatorFilters,
  type CreatorHit,
  type CreatorRow,
} from "@/lib/creators/types";
import { normalizePage } from "@/lib/reels/types";
import { CreatorCard } from "@/components/creator-card";
import { CreatorFilterBar } from "./creator-filters";

/** One string standing for a whole filter set, for comparing two of them. */
function filtersKey(f: CreatorFilters): string {
  return FILTER_KEYS.map((k) => f[k].join("-")).join("|");
}

/** The roster's own URL, carrying every set filter with it. */
function pageHref(page: number, filters: CreatorFilters): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  writeCreatorFilters(params, filters);
  const query = params.toString();
  return query ? `/viral-reels-creators?${query}` : "/viral-reels-creators";
}

function PageLink({
  href,
  disabled,
  onClick,
  children,
}: {
  href: string;
  disabled: boolean;
  onClick: () => void;
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
    <a
      href={href}
      // A real href, intercepted. The anchor is what a crawler follows and what
      // a middle click opens; the handler is what makes a page turn feel like
      // one, since the roster is already a client fetch away.
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick();
      }}
      className={`${base} text-silver hover:border-vivid-blue/50 hover:text-white`}
    >
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
 * The creator search, the five range filters, and the roster underneath them.
 *
 * Unlike /viral-reels, this page shows something before a visitor types: the
 * creators the database has read the most of, server-rendered. A search box over
 * an empty page asks the visitor to guess what is in here; a roster answers that
 * before they ask, and a search then replaces it.
 *
 * The filters drive both halves. With words in the box they narrow the search;
 * with an empty box they narrow the roster, which is re-fetched rather than
 * reloaded: four sliders that each cost a full page load would be unusable, and
 * the histograms have to keep redrawing while a thumb is moving.
 */
export function CreatorSearch({
  initialQuery,
  initialFilters,
  facts,
  roster,
  rosterTotal,
  rosterPage,
}: {
  initialQuery: string;
  initialFilters: CreatorFilters;
  /** Every creator as five numbers, for the histograms. Empty when the index
   *  is unreachable, which leaves the sliders working over empty charts. */
  facts: CreatorFact[];
  roster: CreatorRow[];
  rosterTotal: number;
  rosterPage: number;
}) {
  const [input, setInput] = useState(initialQuery);
  const [filters, setFilters] = useState<CreatorFilters>(initialFilters);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [rows, setRows] = useState(roster);
  const [total, setTotal] = useState(rosterTotal);
  const [page, setPage] = useState(rosterPage);
  const [rosterBusy, setRosterBusy] = useState(false);
  const [rosterError, setRosterError] = useState("");

  const inflight = useRef<AbortController | null>(null);
  const rosterInflight = useRef<AbortController | null>(null);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // What is actually on screen. A commit that matches it changes nothing, and
  // three things fire commits that often will: a pointerup on a thumb that
  // never moved, a blur from tabbing past a slider, and a keyboard step that
  // lands back where it started.
  const applied = useRef({ query: initialQuery.trim(), filters: initialFilters });
  // What the visible roster was fetched with. A commit that matches it is a
  // click on a thumb that never moved, and re-fetching for that would put a
  // spinner on the page every time someone touched a slider without dragging.
  const rosterKey = useRef(pageHref(rosterPage, initialFilters));
  // The live filters, readable from an event handler without waiting for a
  // render. A pointerup and the last change of a drag are separate DOM events,
  // and a commit must never apply the range from before the drag.
  const live = useRef(initialFilters);

  const pages = Math.max(1, Math.ceil(total / ROSTER_PAGE_SIZE));

  // Cancel a pending commit when the page goes away, so a fetch cannot land
  // against an unmounted component.
  useEffect(() => () => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
  }, []);

  const loadRoster = useCallback(
    async (nextPage: number, active: CreatorFilters) => {
      const key = pageHref(nextPage, active);
      if (key === rosterKey.current) return;
      rosterKey.current = key;

      rosterInflight.current?.abort();
      const controller = new AbortController();
      rosterInflight.current = controller;
      setRosterBusy(true);
      setRosterError("");

      const params = new URLSearchParams();
      if (nextPage > 1) params.set("page", String(nextPage));
      writeCreatorFilters(params, active);

      try {
        const res = await fetch(`/api/viral-reels/creators/roster?${params}`, {
          signal: controller.signal,
        });
        const json = (await res.json().catch(() => ({}))) as {
          results?: CreatorRow[];
          total?: number;
          error?: string;
        };
        if (controller.signal.aborted) return;
        if (!res.ok) {
          setRosterError("the roster did not come back. try again in a moment.");
          return;
        }
        setRows(json.results ?? []);
        setTotal(json.total ?? 0);
        setPage(nextPage);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setRosterError("the roster did not come back. try again in a moment.");
      } finally {
        if (!controller.signal.aborted) setRosterBusy(false);
      }
    },
    [],
  );

  const run = useCallback(async (raw: string, active: CreatorFilters) => {
    const query = raw.trim();
    if (!query) return;

    // A new search abandons the one before it, so a fast typist never sees an
    // older answer overwrite a newer one.
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;

    setState({ kind: "loading" });

    try {
      const res = await fetch("/api/viral-reels/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, ...filtersToBody(active) }),
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

  /**
   * Take the URL as the truth about what should be on screen.
   *
   * This exists because the filters are written with `replaceState`, which
   * changes the address bar and tells Next's router nothing. So the router's
   * cached entry for this route is still the render the server did for the
   * UNFILTERED url, and opening a creator and pressing Back serves exactly
   * that: the right address, every thumb reset, the whole index listed. The
   * page that arrives is stale, but the URL beside it never is, so the URL is
   * what gets believed.
   *
   * It runs on mount, which is when a back lands here, and on popstate, which
   * is when a back or a forward lands here without a remount. On an ordinary
   * first load it finds the URL and the render already agreeing and does
   * nothing beyond the one thing it has always done: run the search a shared
   * ?q= link arrived with.
   */
  const syncFromUrl = useCallback(
    (firstRun: boolean) => {
      const params = new URLSearchParams(globalThis.location.search);
      const urlFilters = readCreatorFilters(Object.fromEntries(params.entries()));
      const urlQuery = normalizeCreatorQuery(params.get("q") ?? "");
      const urlPage = normalizePage(params.get("page"));

      const changed =
        urlQuery !== applied.current.query ||
        filtersKey(urlFilters) !== filtersKey(applied.current.filters);

      if (changed) {
        applied.current = { query: urlQuery, filters: urlFilters };
        live.current = urlFilters;
        setFilters(urlFilters);
        setInput(urlQuery);
        if (!urlQuery) setState({ kind: "idle" });
      }
      if (urlQuery && (changed || firstRun)) void run(urlQuery, urlFilters);
      // Self-guarding: it returns without a request when what it is asked for
      // is already what is on screen, which is the ordinary first load.
      void loadRoster(urlPage, urlFilters);
    },
    [run, loadRoster],
  );

  useEffect(() => {
    syncFromUrl(true);
    const onPop = () => syncFromUrl(false);
    globalThis.addEventListener("popstate", onPop);
    return () => globalThis.removeEventListener("popstate", onPop);
  }, [syncFromUrl]);

  /** Shareable, and a reload reproduces exactly what is on screen. */
  const syncUrl = (next: CreatorFilters, nextPage: number, query: string) => {
    const url = new URL(globalThis.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    if (nextPage > 1) url.searchParams.set("page", String(nextPage));
    else url.searchParams.delete("page");
    writeCreatorFilters(url.searchParams, next);
    // replaceState rather than a router push, so the back button still leaves
    // the page rather than walking back through every slider position.
    globalThis.history.replaceState(null, "", url);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    applied.current = { query, filters: live.current };
    syncUrl(live.current, page, query);
    void run(query, live.current);
  };

  /** Live, on every step of a drag. Redraws the charts and the count, asks the
   *  server nothing at all. */
  const onFilterInput = (next: CreatorFilters) => {
    live.current = next;
    setFilters(next);
  };

  /**
   * On release. This is the one that costs a round trip.
   *
   * Page 1, because page 7 of an unfiltered roster is rarely a page of the
   * filtered one. The search is re-run only when there are words in the box;
   * the roster is re-fetched either way, so clearing the box lands on a roster
   * that already agrees with the filters rather than one from before them.
   */
  const commit = (next: CreatorFilters) => {
    live.current = next;
    setFilters(next);

    const query = input.trim();
    if (
      query === applied.current.query &&
      filtersKey(next) === filtersKey(applied.current.filters)
    ) {
      return;
    }
    applied.current = { query, filters: next };

    // The URL and the page number move now; only the two network calls wait.
    // Holding the URL back would make a link copied mid-interaction wrong, and
    // leaving the page number behind would print "page 3 of 1" for as long as
    // the fetch takes.
    syncUrl(next, 1, query);
    setPage(1);

    // A held arrow key steps the thumb once per repeat and fires a commit on
    // every keyup. Without this, crossing five notches is five round trips,
    // four of them aborted a moment after they were sent.
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => {
      if (query) void run(query, next);
      void loadRoster(1, next);
    }, 250);
  };

  const goToPage = (nextPage: number) => {
    syncUrl(live.current, nextPage, input.trim());
    void loadRoster(nextPage, live.current);
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
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
          onChange={(e) => {
            setInput(e.target.value);
            // Emptying the box puts the roster back rather than leaving the
            // last answer stranded on screen with nothing that produced it.
            if (!e.target.value.trim() && state.kind !== "idle") {
              setState({ kind: "idle" });
              applied.current = { query: "", filters: live.current };
              syncUrl(live.current, page, "");
            }
          }}
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

      <CreatorFilterBar
        facts={facts}
        filters={filters}
        onInput={onFilterInput}
        // Read from the ref, not from a prop: the ref is written by the very
        // change event that moved the thumb, so it is right even if React has
        // not re-rendered between that event and this one.
        onCommit={() => commit(live.current)}
        onReset={() => commit(NO_FILTERS)}
      />

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
              ? "nobody matching those filters is close to that. try widening one."
              : "nobody in the database is close to that. try describing what they make rather than naming them."}
          </p>
        )}

        {state.kind === "done" && results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.slice(0, CREATOR_RESULT_COUNT).map((creator) => (
              <CreatorCard key={creator.account} creator={creator} />
            ))}
          </div>
        )}

        {showRoster && (
          <div className={`mt-8 ${rosterBusy ? "opacity-60" : ""}`}>
            <p className="mb-4 text-xs text-silver-muted">
              {rosterError
                ? rosterError
                : total === 0
                  ? "nobody matches those filters. try widening one."
                  : "the ones most worth studying first"}
            </p>
            <div className="space-y-4">
              {rows.map((creator) => (
                <CreatorCard key={creator.account} creator={creator} />
              ))}
            </div>

            {pages > 1 && (
              <nav
                aria-label="roster pages"
                className="mt-6 flex items-center justify-between gap-3"
              >
                <PageLink
                  href={pageHref(page - 1, filters)}
                  disabled={page <= 1 || rosterBusy}
                  onClick={() => goToPage(page - 1)}
                >
                  newer
                </PageLink>
                <span className="font-body text-xs tabular-nums text-silver-muted">
                  page {page} of {pages}
                </span>
                <PageLink
                  href={pageHref(page + 1, filters)}
                  disabled={page >= pages || rosterBusy}
                  onClick={() => goToPage(page + 1)}
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
