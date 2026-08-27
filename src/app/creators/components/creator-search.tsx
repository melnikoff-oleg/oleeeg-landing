"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  CREATOR_FILTERS,
  CREATOR_QUERY_MAX,
  creatorBins,
  filtersKey,
  normalizeCreatorQuery,
  readCreatorFilters,
  CREATOR_RESULT_COUNT,
  CREATOR_RESULT_MAX,
  filtersAreEmpty,
  filtersToBody,
  NO_FILTERS,
  ROSTER_PAGE_SIZE,
  writeCreatorFilters,
  type CreatorFact,
  type CreatorFilters,
  type CreatorTileHit,
  type CreatorRow,
} from "@/lib/creators/types";
import { normalizePage } from "@/lib/reels/types";
import { CreatorCard } from "@/components/creator-card";
import { AnswerCache, answerKey } from "@/lib/search/answer-cache";
import { PREFETCH_DELAY_MS, shouldPrefetch } from "@/lib/search/prefetch";
import { Pending } from "@/lib/search/pending";
import { FilterBar } from "@/components/filter-bar";

/** The roster's own URL, carrying every set filter with it. */
function pageHref(page: number, filters: CreatorFilters): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  writeCreatorFilters(params, filters);
  const query = params.toString();
  return query ? `/creators?${query}` : "/creators";
}

/**
 * The URL of the page at rest: no query, no filters, page one.
 *
 * This is the one address that shows the hand-picked screen, so it is also the
 * one loadRoster must answer from memory rather than from the network. Derived
 * from pageHref rather than written out, so the two cannot drift.
 */
const RESTING_KEY = pageHref(1, NO_FILTERS);

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
  // `previous` is what was on screen when this search started, already cut to
  // the length it was drawn at. A new answer replaces the old one in place
  // rather than blanking the list first: five pulsing grey rectangles where ten
  // creators were is a page that got WORSE while it worked.
  | { kind: "loading"; previous: CreatorTileHit[] }
  | { kind: "done"; query: string; results: CreatorTileHit[] }
  | { kind: "error"; message: string };

/**
 * The answers this browser already has.
 *
 * Module scope on purpose, so it survives the component unmounting and
 * remounting -- which is exactly what opening a creator and pressing Back does.
 * Bounded and short-lived; the reasoning is in src/lib/search/answer-cache.ts.
 */
const answers = new AnswerCache<CreatorTileHit[]>(30);

/**
 * The requests currently on their way, so a prefetch and the keypress that
 * follows it are ONE request rather than two. Module scope, beside the cache it
 * feeds, and for the same reason: it has to survive this component being
 * unmounted and remounted.
 */
const pending = new Pending<CreatorTileHit[]>();

/**
 * A hairline that fills while a search is in flight.
 *
 * It never reaches the end, because it is not measuring anything -- there is no
 * progress to report from a single upstream call. It exists so that a list
 * dimmed for a slow answer still says something is happening.
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
 * This page shows something before a visitor types: a search box over an empty
 * page asks the visitor to guess what is in here, and a list answers that before
 * they ask. At rest that list is the hand-picked accounts in
 * src/lib/featured/accounts.ts; under a filter it is the roster itself; with
 * words in the box it is the search.
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
  initialFeatured,
  rosterAll,
}: {
  initialQuery: string;
  initialFilters: CreatorFilters;
  /** Every creator as five numbers, for the histograms. Empty when the index
   *  is unreachable, which leaves the sliders working over empty charts. */
  facts: CreatorFact[];
  roster: CreatorRow[];
  rosterTotal: number;
  rosterPage: number;
  /** Whether `roster` is the hand-picked screen rather than a page of the list. */
  initialFeatured: boolean;
  /** How many creators the index holds, for the "see all" link. 0 when the facts
   *  read failed, in which case the link drops the number and still works. */
  rosterAll: number;
}) {
  const [input, setInput] = useState(initialQuery);
  const [filters, setFilters] = useState<CreatorFilters>(initialFilters);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [rows, setRows] = useState(roster);
  const [total, setTotal] = useState(rosterTotal);
  const [page, setPage] = useState(rosterPage);
  const [rosterBusy, setRosterBusy] = useState(false);
  // Whether what is on screen is the hand-picked screen. It survives a filter
  // being set and cleared, because clearing every filter is a request to be back
  // where the page started.
  const [featured, setFeatured] = useState(initialFeatured);
  // How much of a search answer is on screen. The whole answer is already in
  // memory; this is the part of it the list has drawn.
  const [shown, setShown] = useState(CREATOR_RESULT_COUNT);
  // A mirror of `shown`, readable from `run` without making `run` depend on it.
  // `run` is handed to effects and to the debounced commit; rebuilding it every
  // time another twenty-four reels are revealed would churn both for a value
  // that only decides how much of the OLD answer stays on screen while the new
  // one loads.
  const shownRef = useRef(shown);
  shownRef.current = shown;

  const [rosterError, setRosterError] = useState("");

  const inflight = useRef<AbortController | null>(null);
  // The empty div under the list whose arrival on screen reveals the next ten.
  const moreRef = useRef<HTMLDivElement | null>(null);
  const rosterInflight = useRef<AbortController | null>(null);
  // The hand-picked screen, kept so that clearing a filter restores it without a
  // round trip. Empty when the page did not open on one.
  const featuredRows = useRef<CreatorRow[]>(initialFeatured ? roster : []);
  // Whether the visitor has explicitly asked for the whole roster. Once they
  // have, the resting state of the page is the whole roster and not the
  // hand-picked screen, for as long as they stay.
  const wantsAll = useRef(false);
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
  // Values to bins, once. The charts and the count both work on bins, and doing
  // it per render would redo 245 rows on every step of a drag.
  const bins = useMemo(() => creatorBins(facts), [facts]);

  const loadRoster = useCallback(
    async (nextPage: number, active: CreatorFilters, force = false) => {
      const key = pageHref(nextPage, active);
      if (key === rosterKey.current && !force) return;

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
        rosterKey.current = key;
        rosterInflight.current?.abort();
        setRows(featuredRows.current);
        setTotal(rosterAll);
        setPage(1);
        setFeatured(true);
        setRosterBusy(false);
        setRosterError("");
        return;
      }
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
        // Whatever came back is a page of the roster, never the picked screen.
        setFeatured(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setRosterError("the roster did not come back. try again in a moment.");
      } finally {
        if (!controller.signal.aborted) setRosterBusy(false);
      }
    },
    [rosterAll],
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
    async (query: string, active: CreatorFilters, signal?: AbortSignal): Promise<CreatorTileHit[] | null> => {
      const results = await pending.share(answerKey(query, active), async () => {
        const res = await fetch("/api/viral-reels/creators", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, ...filtersToBody(active) }),
        });
        const json = (await res.json().catch(() => ({}))) as {
          results?: CreatorTileHit[];
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

  const prefetch = useCallback((raw: string, active: CreatorFilters) => {
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
  const armPrefetch = useCallback((raw: string, active: CreatorFilters) => {
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
    inflight.current?.abort();
  }, []);

  const run = useCallback(async (raw: string, active: CreatorFilters) => {
    const query = raw.trim();
    if (!query) return;

    // A new search abandons the one before it, so a fast typist never sees an
    // older answer overwrite a newer one.
    inflight.current?.abort();

    // Already answered this session. No request at all, and no loading state to
    // flash through: a chip clicked twice, a word retyped after clearing it, or
    // the Back button should cost nothing.
    const remembered = answers.get(answerKey(query, active));
    if (remembered) {
      setShown(CREATOR_RESULT_COUNT);
      setState({ kind: "done", query, results: remembered });
      return;
    }

    const controller = new AbortController();
    inflight.current = controller;

    setState((prev) => ({
      kind: "loading",
      previous: prev.kind === "done" ? prev.results.slice(0, shownRef.current) : [],
    }));
    // Back to one screenful. A new query that kept the old scroll depth would
    // open five creators down its own answer.
    setShown(CREATOR_RESULT_COUNT);

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
      // A shared "see all" link, or a back onto one. Read before loadRoster,
      // which consults it to decide whether the resting address means the
      // hand-picked screen or the whole roster.
      wantsAll.current = params.get("all") === "1";

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
    if (wantsAll.current) url.searchParams.set("all", "1");
    else url.searchParams.delete("all");
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

  /**
   * "Show me everyone", the one thing the hand-picked default takes away.
   *
   * Forced past loadRoster's own guard, because the address it is asking for is
   * the address already on screen: the resting URL is what shows the picked
   * screen, and this is a request for the other answer to the same question. The
   * `all=1` it writes is what makes a reload, a share and a back button agree
   * with what is on the page.
   */
  const showEveryone = () => {
    wantsAll.current = true;
    setFeatured(false);
    syncUrl(live.current, 1, "");
    void loadRoster(1, live.current, true);
  };

  const goToPage = (nextPage: number) => {
    syncUrl(live.current, nextPage, input.trim());
    void loadRoster(nextPage, live.current);
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  };

  const results = state.kind === "done" ? state.results : [];
  // What to draw while a new answer is on its way. Ten cards going slightly
  // quiet reads as "this is being replaced"; ten cards going away reads as
  // "it broke".
  const holding = state.kind === "loading" ? state.previous : [];
  const showRoster = state.kind === "idle";

  /**
   * The list grows as it is scrolled: another ten creators each time the bottom
   * comes into view, up to five screenfuls. The same behaviour the library wall
   * got, and Oleg asked for both.
   *
   * This REVEALS, it does not fetch. All 50 arrived with the first answer, so
   * reaching the bottom cannot spin, cannot fail and costs no second embedding.
   * 800px of rootMargin means the next card exists before the last one has been
   * read.
   *
   * The sentinel is only in the tree while there is more to show, so the observer
   * stops existing at the cap rather than sitting there firing.
   */
  useEffect(() => {
    if (shown >= results.length) return;
    const node = moreRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown((n) => Math.min(n + CREATOR_RESULT_COUNT, CREATOR_RESULT_MAX));
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
        <label htmlFor="creator-query" className="sr-only">
          what kind of creator are you looking for?
        </label>
        <input
          id="creator-query"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            // Start guessing at what they are typing. Costs nothing when the
            // guess is wrong; when it is right, Enter is a memory read.
            armPrefetch(e.target.value, live.current);
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

      <FilterBar
        set={CREATOR_FILTERS}
        rows={bins}
        ranges={filters}
        noun="creators"
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
            {holding.length ? (
              <>
                <Bar />
                <div className="space-y-4 opacity-45 transition-opacity duration-200">
                  {holding.map((creator) => (
                    <CreatorCard key={creator.account} creator={creator} />
                  ))}
                </div>
              </>
            ) : (
              <Skeletons />
            )}
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
            {results.slice(0, shown).map((creator) => (
              <CreatorCard key={creator.account} creator={creator} />
            ))}
            {shown < results.length && (
              <div ref={moreRef} aria-hidden className="h-px w-full" />
            )}
          </div>
        )}

        {showRoster && (
          <div className={`mt-8 ${rosterBusy ? "opacity-60" : ""}`}>
            <p className="mb-4 text-xs text-silver-muted">
              {rosterError
                ? rosterError
                : total === 0
                  ? "nobody matches those filters. try widening one."
                  : featured
                    ? "hand-picked, the ones to study first"
                    : "the ones most worth studying first"}
            </p>
            <div className="space-y-4">
              {rows.map((creator) => (
                <CreatorCard key={creator.account} creator={creator} />
              ))}
            </div>

            {featured && !rosterError && (
              // The way out of the picked screen, and the only one that does not
              // require knowing what to search for or which slider to move.
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={showEveryone}
                  className="inline-flex min-h-11 items-center rounded-full border border-hairline px-5 font-body text-xs text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
                >
                  {total > 0
                    ? `see all ${total.toLocaleString("en-GB")} creators`
                    : "see every creator"}
                </button>
              </div>
            )}

            {!featured && pages > 1 && (
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
