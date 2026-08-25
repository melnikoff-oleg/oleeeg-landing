"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  rangesKey,
  rangesToBody,
  readRanges,
  unpackBins,
  writeRanges,
} from "@/lib/filters/range";
import {
  LIBRARY_PAGE_SIZE,
  LIBRARY_RESULT_COUNT,
  NO_REEL_FILTERS,
  REEL_BIN_WIDTH,
  REEL_FILTERS,
  type ReelFilters,
} from "@/lib/reels/filters";
import { normalizePage, normalizeQuery, QUERY_MAX, type ReelHit, type ReelRow } from "@/lib/reels/types";
import { FilterBar } from "@/components/filter-bar";
import { LibraryReelTile } from "@/components/library-reel-tile";

/** The library's own URL, carrying every set filter with it. */
function pageHref(page: number, ranges: ReelFilters, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  writeRanges(REEL_FILTERS, params, ranges);
  const search = params.toString();
  return search ? `/viral-reels-browse?${search}` : "/viral-reels-browse";
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
      // one, since the wall is already a client fetch away.
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

type SearchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; query: string; results: ReelHit[] }
  | { kind: "error"; message: string };

function Skeletons() {
  return (
    <div
      className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="aspect-[9/16] animate-pulse rounded-lg border border-hairline bg-silver/5"
        />
      ))}
    </div>
  );
}

function Wall({ reels }: { reels: readonly ReelRow[] }) {
  return (
    // Instagram's own profile grid: four to a row on a desktop, three on a
    // tablet, two on a phone, hairline gaps. The whole point of this page is the
    // wall of stills, so the thumbnails get the width and the numbers ride on
    // top of them.
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4">
      {reels.map((reel) => (
        <LibraryReelTile key={reel.shortcode} reel={reel} />
      ))}
    </div>
  );
}

/**
 * The library: a search box, five range filters, and the wall underneath them.
 *
 * One page where there were two. /viral-reels was a search box over an empty
 * screen and this was a list with two filters; a visitor deciding what to film
 * moves between "what is close to this idea" and "what is in here at all"
 * constantly, and a page turn between them cost the thread. Searching now
 * narrows the same wall the filters narrow, under the same five controls.
 *
 * With words in the box the wall is the search's answer, ranked by how close
 * each reel is. With an empty box it is the whole library ranked by outlier
 * score, paged, and re-fetched rather than reloaded: five sliders that each cost
 * a full page load would be unusable, and the histograms have to keep redrawing
 * while a thumb is moving.
 */
export function Library({
  initialQuery,
  initialRanges,
  facts,
  rows,
  total,
  page: initialPage,
  configured,
  initialFailed,
}: {
  initialQuery: string;
  initialRanges: ReelFilters;
  /** Every reel as five bin indices, five characters a reel. Empty when the
   *  index is unreachable, which leaves the sliders working over empty charts. */
  facts: string;
  rows: ReelRow[];
  total: number;
  page: number;
  configured: boolean;
  initialFailed: boolean;
}) {
  const [input, setInput] = useState(initialQuery);
  const [ranges, setRanges] = useState<ReelFilters>(initialRanges);
  const [state, setState] = useState<SearchState>({ kind: "idle" });
  const [wall, setWall] = useState(rows);
  const [count, setCount] = useState(total);
  const [page, setPage] = useState(initialPage);
  const [wallBusy, setWallBusy] = useState(false);
  const [wallError, setWallError] = useState(initialFailed ? "the library did not come back. try again in a moment." : "");

  const searchInflight = useRef<AbortController | null>(null);
  const wallInflight = useRef<AbortController | null>(null);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // What is actually on screen. A commit that matches it changes nothing, and
  // three things fire commits that often will: a pointerup on a thumb that never
  // moved, a blur from tabbing past a slider, and a keyboard step that lands
  // back where it started.
  const applied = useRef({ query: initialQuery.trim(), ranges: initialRanges });
  // What the visible wall was fetched with, for the same reason.
  const wallKey = useRef(pageHref(initialPage, initialRanges, ""));
  // The live ranges, readable from an event handler without waiting for a
  // render. A pointerup and the last change of a drag are separate DOM events,
  // and a commit must never apply the range from before the drag.
  const live = useRef(initialRanges);

  // Unpacked once. 4,896 reels is about 25 KB of string and 4,896 small arrays;
  // doing it per render would rebuild them on every step of a drag.
  const bins = useMemo(() => unpackBins(facts, REEL_BIN_WIDTH), [facts]);

  const pages = Math.max(1, Math.ceil(count / LIBRARY_PAGE_SIZE));

  // Cancel a pending commit when the page goes away, so a fetch cannot land
  // against an unmounted component.
  useEffect(() => () => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
  }, []);

  const loadWall = useCallback(
    async (nextPage: number, active: ReelFilters) => {
      const key = pageHref(nextPage, active, "");
      if (key === wallKey.current) return;
      wallKey.current = key;

      wallInflight.current?.abort();
      const controller = new AbortController();
      wallInflight.current = controller;
      setWallBusy(true);
      setWallError("");

      const params = new URLSearchParams();
      if (nextPage > 1) params.set("page", String(nextPage));
      writeRanges(REEL_FILTERS, params, active);

      try {
        const res = await fetch(`/api/viral-reels/browse?${params}`, {
          signal: controller.signal,
        });
        const json = (await res.json().catch(() => ({}))) as {
          results?: ReelRow[];
          total?: number;
        };
        if (controller.signal.aborted) return;
        if (!res.ok) {
          setWallError("the library did not come back. try again in a moment.");
          return;
        }
        setWall(json.results ?? []);
        setCount(json.total ?? 0);
        setPage(nextPage);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setWallError("the library did not come back. try again in a moment.");
      } finally {
        if (!controller.signal.aborted) setWallBusy(false);
      }
    },
    [],
  );

  const run = useCallback(async (raw: string, active: ReelFilters) => {
    const query = raw.trim();
    if (!query) return;

    // A new search abandons the one before it, so a fast typist never sees an
    // older answer overwrite a newer one.
    searchInflight.current?.abort();
    const controller = new AbortController();
    searchInflight.current = controller;

    setState({ kind: "loading" });

    try {
      const res = await fetch("/api/viral-reels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, ...rangesToBody(REEL_FILTERS, active) }),
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

  /**
   * Take the URL as the truth about what should be on screen.
   *
   * The filters are written with `replaceState`, which changes the address bar
   * and tells Next's router nothing. So the router's cached entry for this route
   * is still the render the server did for the UNFILTERED url, and opening a
   * creator and pressing Back serves exactly that: the right address, every
   * thumb reset, the whole library listed. The page that arrives is stale, but
   * the URL beside it never is, so the URL is what gets believed.
   */
  const syncFromUrl = useCallback(
    (firstRun: boolean) => {
      const params = new URLSearchParams(globalThis.location.search);
      const urlRanges = readRanges(REEL_FILTERS, Object.fromEntries(params.entries()));
      const urlQuery = normalizeQuery(params.get("q") ?? "");
      const urlPage = normalizePage(params.get("page"));

      const changed =
        urlQuery !== applied.current.query ||
        rangesKey(REEL_FILTERS, urlRanges) !==
          rangesKey(REEL_FILTERS, applied.current.ranges);

      if (changed) {
        applied.current = { query: urlQuery, ranges: urlRanges };
        live.current = urlRanges;
        setRanges(urlRanges);
        setInput(urlQuery);
        if (!urlQuery) setState({ kind: "idle" });
      }
      if (urlQuery && (changed || firstRun)) void run(urlQuery, urlRanges);
      // Self-guarding: it returns without a request when what it is asked for is
      // already what is on screen, which is the ordinary first load.
      void loadWall(urlPage, urlRanges);
    },
    [run, loadWall],
  );

  useEffect(() => {
    syncFromUrl(true);
    const onPop = () => syncFromUrl(false);
    globalThis.addEventListener("popstate", onPop);
    return () => globalThis.removeEventListener("popstate", onPop);
  }, [syncFromUrl]);

  /** Shareable, and a reload reproduces exactly what is on screen. */
  const syncUrl = (next: ReelFilters, nextPage: number, query: string) => {
    const url = new URL(globalThis.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    if (nextPage > 1) url.searchParams.set("page", String(nextPage));
    else url.searchParams.delete("page");
    writeRanges(REEL_FILTERS, url.searchParams, next);
    // replaceState rather than a router push, so the back button still leaves
    // the page rather than walking back through every slider position.
    globalThis.history.replaceState(null, "", url);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    applied.current = { query, ranges: live.current };
    syncUrl(live.current, page, query);
    void run(query, live.current);
  };

  /** Live, on every step of a drag. Redraws the charts and the count, asks the
   *  server nothing at all. */
  const onFilterInput = (next: ReelFilters) => {
    live.current = next;
    setRanges(next);
  };

  /**
   * On release. This is the one that costs a round trip.
   *
   * Page 1, because page 7 of an unfiltered library is rarely a page of the
   * filtered one. The search is re-run only when there are words in the box; the
   * wall is re-fetched either way, so clearing the box lands on a wall that
   * already agrees with the filters rather than one from before them.
   */
  const commit = (next: ReelFilters) => {
    live.current = next;
    setRanges(next);

    const query = input.trim();
    if (
      query === applied.current.query &&
      rangesKey(REEL_FILTERS, next) === rangesKey(REEL_FILTERS, applied.current.ranges)
    ) {
      return;
    }
    applied.current = { query, ranges: next };

    // The URL and the page number move now; only the two network calls wait.
    // Holding the URL back would make a link copied mid-interaction wrong, and
    // leaving the page number behind would print "page 3 of 1" for as long as
    // the fetch takes.
    syncUrl(next, 1, query);
    setPage(1);

    // A held arrow key steps the thumb once per repeat and fires a commit on
    // every keyup. Without this, crossing five notches is five round trips, four
    // of them aborted a moment after they were sent.
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => {
      if (query) void run(query, next);
      void loadWall(1, next);
    }, 250);
  };

  const goToPage = (nextPage: number) => {
    syncUrl(live.current, nextPage, input.trim());
    void loadWall(nextPage, live.current);
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  };

  const results = state.kind === "done" ? state.results : [];
  const showWall = state.kind === "idle";

  return (
    <div>
      <form onSubmit={submit} className="relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-silver-muted"
          aria-hidden
        />
        <label htmlFor="library-query" className="sr-only">
          what is your reel about?
        </label>
        <input
          id="library-query"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            // Emptying the box puts the library back rather than leaving the
            // last answer stranded on screen with nothing that produced it.
            if (!e.target.value.trim() && state.kind !== "idle") {
              setState({ kind: "idle" });
              applied.current = { query: "", ranges: live.current };
              syncUrl(live.current, page, "");
            }
          }}
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

      <FilterBar
        set={REEL_FILTERS}
        rows={bins}
        ranges={ranges}
        noun="reels"
        onInput={onFilterInput}
        // Read from the ref, not from a prop: the ref is written by the very
        // change event that moved the thumb, so it is right even if React has
        // not re-rendered between that event and this one.
        onCommit={() => commit(live.current)}
        onReset={() => commit(NO_REEL_FILTERS)}
      />

      <div className="mt-8 scroll-mt-6">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {state.kind === "loading" && "searching"}
          {state.kind === "done" &&
            (results.length ? `showing ${results.length} reels` : "no reels matched")}
          {state.kind === "error" && state.message}
        </div>

        {!configured && (
          <p className="rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
            the library is not connected right now. try again shortly.
          </p>
        )}

        {state.kind === "loading" && <Skeletons />}

        {state.kind === "error" && (
          <p className="rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
            {state.message}
          </p>
        )}

        {state.kind === "done" && results.length === 0 && (
          <p className="rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
            nothing in the library is close to that. try describing the FORMAT or
            the FEELING rather than the topic, or widen a filter.
          </p>
        )}

        {state.kind === "done" && results.length > 0 && (
          <>
            <p className="mb-4 font-body text-xs text-silver-muted">
              the {Math.min(results.length, LIBRARY_RESULT_COUNT)} closest reels
              to that, closest first
            </p>
            <Wall reels={results.slice(0, LIBRARY_RESULT_COUNT)} />
          </>
        )}

        {showWall && configured && (
          <div className={wallBusy ? "opacity-60" : ""}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-body text-xs text-silver-muted" aria-live="polite">
                {wallError
                  ? wallError
                  : count === 0
                    ? "no reels match those filters. try widening one."
                    : "the biggest outliers first"}
              </p>
              {pages > 1 && (
                <p className="font-display text-xs tabular-nums text-silver-muted">
                  page {page} of {pages}
                </p>
              )}
            </div>

            <Wall reels={wall} />

            {pages > 1 && (
              <nav
                aria-label="library pages"
                className="mt-6 flex items-center justify-between gap-3"
              >
                <PageLink
                  href={pageHref(page - 1, ranges, "")}
                  disabled={page <= 1 || wallBusy}
                  onClick={() => goToPage(page - 1)}
                >
                  bigger outliers
                </PageLink>
                <span className="font-body text-xs tabular-nums text-silver-muted">
                  page {page} of {pages}
                </span>
                <PageLink
                  href={pageHref(page + 1, ranges, "")}
                  disabled={page >= pages || wallBusy}
                  onClick={() => goToPage(page + 1)}
                >
                  smaller outliers
                </PageLink>
              </nav>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
