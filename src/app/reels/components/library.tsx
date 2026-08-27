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
  LIBRARY_RESULT_MAX,
  NO_REEL_FILTERS,
  REEL_BIN_WIDTH,
  REEL_FILTERS,
  type ReelFilters,
} from "@/lib/reels/filters";
import {
  normalizePage,
  normalizeQuery,
  QUERY_MAX,
  type ReelTileHit,
  type ReelTileRow,
} from "@/lib/reels/types";
import { FilterBar } from "@/components/filter-bar";
import { LibraryReelTile } from "@/components/library-reel-tile";
import { AnswerCache, answerKey } from "@/lib/search/answer-cache";
import { PREFETCH_DELAY_MS, shouldPrefetch } from "@/lib/search/prefetch";
import { Pending } from "@/lib/search/pending";

/** The library's own URL, carrying every set filter with it. */
function pageHref(page: number, ranges: ReelFilters, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  writeRanges(REEL_FILTERS, params, ranges);
  const search = params.toString();
  return search ? `/reels?${search}` : "/reels";
}

/**
 * The URL of the page at rest: no query, no filters, page one.
 *
 * This is the one address that shows the hand-picked screen, so it is also the
 * one loadWall must answer from memory rather than from the network. Derived
 * from pageHref rather than written out, so the two cannot drift.
 */
const RESTING_KEY = pageHref(1, NO_REEL_FILTERS, "");

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
  // `previous` is what was on screen when this search started, already cut to
  // the length it was drawn at. A new answer replaces the old one in place
  // rather than blanking the wall first: eight pulsing grey rectangles where
  // sixty reels were is a page that got WORSE while it worked, and it is the
  // single loudest thing about waiting here.
  | { kind: "loading"; previous: ReelTileHit[] }
  | { kind: "done"; query: string; results: ReelTileHit[] }
  | { kind: "error"; message: string };

/**
 * The answers this browser already has.
 *
 * Module scope on purpose, so it survives the component unmounting and
 * remounting -- which is exactly what opening a reel and pressing Back does.
 * Bounded and short-lived; the reasoning is in src/lib/search/answer-cache.ts.
 */
const answers = new AnswerCache<ReelTileHit[]>(30);

/**
 * The requests currently on their way, so a prefetch and the keypress that
 * follows it are ONE request rather than two. Module scope, beside the cache it
 * feeds, and for the same reason: it has to survive this component being
 * unmounted and remounted.
 */
const pending = new Pending<ReelTileHit[]>();

/**
 * A hairline that fills while a search is in flight.
 *
 * It never reaches the end, because it is not measuring anything -- there is no
 * progress to report from a single upstream call. It exists so that a wall
 * dimmed for a slow answer still says something is happening, which a dimmed
 * wall on its own does not.
 */
function Bar() {
  return (
    <div className="mb-4 h-px w-full overflow-hidden bg-hairline" aria-hidden>
      <div className="h-full w-1/3 animate-[searchbar_1.1s_ease-in-out_infinite] bg-vivid-blue" />
    </div>
  );
}

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

function Wall({ reels }: { reels: readonly ReelTileRow[] }) {
  return (
    // Instagram's own profile grid: four to a row on a desktop, three on a
    // tablet, two on a phone, hairline gaps. The whole point of this page is the
    // wall of stills, so the thumbnails get the width and the numbers ride on
    // top of them.
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4">
      {reels.map((reel, i) => (
        <LibraryReelTile key={reel.shortcode} reel={reel} index={i} />
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
 * each reel is. With an empty box and no filter it is a hand-picked screenful
 * (see src/lib/reels/featured.ts). With a filter it is the whole library ranked
 * by outlier score, paged, and re-fetched rather than reloaded: five sliders
 * that each cost a full page load would be unusable, and the histograms have to
 * keep redrawing while a thumb is moving.
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
  initialFeatured,
  libraryTotal,
}: {
  initialQuery: string;
  initialRanges: ReelFilters;
  /** Every reel as five bin indices, five characters a reel. Empty when the
   *  index is unreachable, which leaves the sliders working over empty charts. */
  facts: string;
  rows: ReelTileRow[];
  total: number;
  page: number;
  configured: boolean;
  initialFailed: boolean;
  /** Whether `rows` is the hand-picked screen rather than a page of the wall. */
  initialFeatured: boolean;
  /** How many reels the library holds, for the "see all" link. 0 when the facts
   *  read failed, in which case the link drops the number and still works. */
  libraryTotal: number;
}) {
  const [input, setInput] = useState(initialQuery);
  const [ranges, setRanges] = useState<ReelFilters>(initialRanges);
  const [state, setState] = useState<SearchState>({ kind: "idle" });
  const [wall, setWall] = useState(rows);
  const [count, setCount] = useState(total);
  const [page, setPage] = useState(initialPage);
  const [wallBusy, setWallBusy] = useState(false);
  // Whether what is on screen is the hand-picked screen. It survives a filter
  // being set and cleared, because clearing every filter is a request to be back
  // where the page started.
  const [featured, setFeatured] = useState(initialFeatured);
  // How much of a search answer is on screen. The whole answer is already in
  // memory; this is the part of it the wall has drawn.
  const [shown, setShown] = useState(LIBRARY_RESULT_COUNT);
  // A mirror of `shown`, readable from `run` without making `run` depend on it.
  // `run` is handed to effects and to the debounced commit; rebuilding it every
  // time another twenty-four reels are revealed would churn both for a value
  // that only decides how much of the OLD answer stays on screen while the new
  // one loads.
  const shownRef = useRef(shown);
  shownRef.current = shown;

  const [wallError, setWallError] = useState(initialFailed ? "the library did not come back. try again in a moment." : "");

  const searchInflight = useRef<AbortController | null>(null);
  // The empty div under the wall whose arrival on screen reveals the next 24.
  const moreRef = useRef<HTMLDivElement | null>(null);
  const wallInflight = useRef<AbortController | null>(null);
  // The hand-picked screen, kept so that clearing a filter restores it without a
  // round trip. Empty when the page did not open on one.
  const featuredRows = useRef<ReelTileRow[]>(initialFeatured ? rows : []);
  // Whether the visitor has explicitly asked for the whole library. Once they
  // have, the resting state of the page is the whole library and not the
  // hand-picked screen, for as long as they stay.
  const wantsAll = useRef(false);
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

  const loadWall = useCallback(
    async (nextPage: number, active: ReelFilters, force = false) => {
      const key = pageHref(nextPage, active, "");
      if (key === wallKey.current && !force) return;

      // Back at rest with the hand-picked screen still in memory. Clearing the
      // last filter is a request to be where the page started, and answering it
      // from a ref rather than from the network is both instant and the only way
      // to be sure the answer is the same one they saw.
      if (
        !force &&
        key === RESTING_KEY &&
        !wantsAll.current &&
        featuredRows.current.length
      ) {
        wallKey.current = key;
        wallInflight.current?.abort();
        setWall(featuredRows.current);
        setCount(libraryTotal);
        setPage(1);
        setFeatured(true);
        setWallBusy(false);
        setWallError("");
        return;
      }
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
        // Full rows arrive; the wall reads the ten fields of a tile. Typed as
        // the tile so the state stays one shape whichever half filled it.
        const json = (await res.json().catch(() => ({}))) as {
          results?: ReelTileRow[];
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
        // Whatever came back is a page of the library, never the picked screen.
        setFeatured(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setWallError("the library did not come back. try again in a moment.");
      } finally {
        if (!controller.signal.aborted) setWallBusy(false);
      }
    },
    [libraryTotal],
  );

  /**
   * One request for one question, whoever asked.
   *
   * `signal` decides whether THIS caller still wants the answer; it does not
   * cancel the request, because the request may belong to somebody else. That
   * is the point: the visitor pauses, a prefetch starts, they press Enter, and
   * the keypress joins the request already in flight instead of starting an
   * identical second one and waiting on that.
   *
   * A prefetch passes no signal at all. Nobody is waiting on it, so there is
   * nobody to change their mind, and an answer it has already paid for is
   * worth keeping even if the visitor has typed on -- they may well backspace
   * to it, and the cache is where it belongs either way.
   */
  const ask = useCallback(
    async (query: string, active: ReelFilters, signal?: AbortSignal): Promise<ReelTileHit[] | null> => {
      const results = await pending.share(answerKey(query, active), async () => {
        const res = await fetch("/api/viral-reels/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, ...rangesToBody(REEL_FILTERS, active) }),
        });
        const json = (await res.json().catch(() => ({}))) as {
          results?: ReelTileHit[];
          error?: string;
        };
        if (!res.ok) {
          const err = new Error(json.error ?? "search_failed");
          (err as Error & { reason?: string }).reason = json.error;
          throw err;
        }
        return json.results ?? [];
      });
      return signal?.aborted ? null : results;
    },
    [],
  );

  // ------------------------------------------------------------- prefetching
  //
  // The visitor types a phrase, stops, and then reaches for Enter. That stop is
  // when we start, so the answer is usually in hand before the keypress lands.
  // See src/lib/search/prefetch.ts for the argument and the two constants.
  //
  // A prefetch NEVER touches the screen. It writes to the answer cache and
  // nothing else, so a wrong guess costs one request nobody sees and cannot
  // flash an answer to a half-typed query or overwrite a real search.
  const prefetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefetch = useCallback((raw: string, active: ReelFilters) => {
    const key = (q: string) => answerKey(q, active);
    if (!shouldPrefetch({
      query: raw,
      applied: applied.current.query,
      known: (q) => Boolean(answers.get(key(q))),
    })) return;
    // At most one per pause: the timer that armed this replaced the one before
    // it, and Pending folds a repeat into the request already on its way.
    const query = raw.trim();
    void ask(query, active)
      .then((results) => {
        if (results) answers.set(key(query), results);
      })
      // Silent on purpose. Nobody asked for this request, so nobody is owed a
      // message about it failing; the real search will fail loudly enough.
      .catch(() => {});
  }, [ask]);

  /** Restart the clock on the visitor's pause. */
  const armPrefetch = useCallback((raw: string, active: ReelFilters) => {
    if (prefetchTimer.current) clearTimeout(prefetchTimer.current);
    prefetchTimer.current = setTimeout(() => prefetch(raw, active), PREFETCH_DELAY_MS);
  }, [prefetch]);

  // Everything with a timer or a request behind it, stopped when the page goes
  // away, so nothing lands against an unmounted component. The aborts do not
  // cancel the requests themselves -- a request may be shared, see `ask` -- they
  // are how this component says it is no longer the one waiting.
  useEffect(() => () => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    if (prefetchTimer.current) clearTimeout(prefetchTimer.current);
    searchInflight.current?.abort();
  }, []);

  const run = useCallback(async (raw: string, active: ReelFilters) => {
    const query = raw.trim();
    if (!query) return;

    // A new search abandons the one before it, so a fast typist never sees an
    // older answer overwrite a newer one.
    searchInflight.current?.abort();

    // Already answered this session. No request at all, and no loading state to
    // flash through: a chip clicked twice, a word retyped after clearing it, or
    // the Back button should cost nothing.
    const remembered = answers.get(answerKey(query, active));
    if (remembered) {
      setShown(LIBRARY_RESULT_COUNT);
      setState({ kind: "done", query, results: remembered });
      return;
    }

    const controller = new AbortController();
    searchInflight.current = controller;

    setState((prev) => ({
      kind: "loading",
      previous: prev.kind === "done" ? prev.results.slice(0, shownRef.current) : [],
    }));
    // Back to one screenful. A new query that kept the old scroll depth would
    // open six rows down its own answer.
    setShown(LIBRARY_RESULT_COUNT);

    try {
      const results = await ask(query, active, controller.signal);
      // Null means this caller stopped caring: the visitor searched again, or
      // clicked into a reel. The request itself may still be running for
      // somebody else, and its answer will land in the cache either way.
      if (results === null) return;
      answers.set(answerKey(query, active), results);
      setState({ kind: "done", query, results });
    } catch (err) {
      if ((err as Error).name === "AbortError" || controller.signal.aborted) return;
      setState({
        kind: "error",
        message:
          (err as Error & { reason?: string }).reason === "rate_limited"
            ? "that is a lot of searching for one day. try again tomorrow."
            : "the search did not come back. try again in a moment.",
      });
    }
  }, [ask]);

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
      // A shared "see all" link, or a back onto one. Read before loadWall, which
      // consults it to decide whether the resting address means the hand-picked
      // screen or the whole library.
      wantsAll.current = params.get("all") === "1";

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
    if (wantsAll.current) url.searchParams.set("all", "1");
    else url.searchParams.delete("all");
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

  /**
   * "Show me everything", the one thing the hand-picked default takes away.
   *
   * Forced past loadWall's own guard, because the address it is asking for is
   * the address already on screen: the resting URL is what shows the picked
   * screen, and this is a request for the other answer to the same question. The
   * `all=1` it writes is what makes a reload, a share and a back button agree
   * with what is on the page.
   */
  const showEverything = () => {
    wantsAll.current = true;
    setFeatured(false);
    syncUrl(live.current, 1, "");
    void loadWall(1, live.current, true);
  };

  const goToPage = (nextPage: number) => {
    syncUrl(live.current, nextPage, input.trim());
    void loadWall(nextPage, live.current);
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  };

  const results = state.kind === "done" ? state.results : [];
  const showWall = state.kind === "idle";
  // What to draw while a new answer is on its way. Sixty reels going slightly
  // quiet reads as "this is being replaced"; sixty reels going away reads as
  // "it broke".
  const holding = state.kind === "loading" ? state.previous : [];

  /**
   * Instagram's behaviour, which is what Oleg asked for: another screenful of
   * reels each time the bottom of the wall comes into view, up to five in all.
   *
   * This REVEALS, it does not fetch. All 120 arrived with the first answer, so
   * reaching the bottom cannot spin, cannot fail and costs no second embedding.
   * 800px of rootMargin means the next row is drawn before the last one has been
   * read, which is the difference between one long wall and five pages.
   *
   * The sentinel is only in the tree while there is more to show, so the
   * observer stops existing at 120 rather than sitting there firing.
   */
  useEffect(() => {
    if (shown >= results.length) return;
    const node = moreRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown((n) => Math.min(n + LIBRARY_RESULT_COUNT, LIBRARY_RESULT_MAX));
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shown, results.length]);

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
            // Start guessing at what they are typing. Costs nothing when the
            // guess is wrong; when it is right, Enter is a memory read.
            armPrefetch(e.target.value, live.current);
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

        {state.kind === "loading" &&
          (holding.length ? (
            <>
              <Bar />
              <div className="opacity-45 transition-opacity duration-200">
                <Wall reels={holding} />
              </div>
            </>
          ) : (
            <Skeletons />
          ))}

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
              the {results.length} closest reels to that, closest first
            </p>
            <Wall reels={results.slice(0, shown)} />
            {shown < results.length && (
              <div ref={moreRef} aria-hidden className="h-px w-full" />
            )}
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
                    : featured
                      ? "hand-picked, from the creators worth studying"
                      : "the biggest outliers first"}
              </p>
              {!featured && pages > 1 && (
                <p className="font-display text-xs tabular-nums text-silver-muted">
                  page {page} of {pages}
                </p>
              )}
            </div>

            <Wall reels={wall} />

            {featured && !wallError && (
              // The way out of the picked screen, and the only one that does not
              // require knowing what to search for or which slider to move.
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={showEverything}
                  className="inline-flex min-h-11 items-center rounded-full border border-hairline px-5 font-body text-xs text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
                >
                  {count > 0
                    ? `see all ${count.toLocaleString("en-GB")} reels`
                    : "see every reel"}
                </button>
              </div>
            )}

            {!featured && pages > 1 && (
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
