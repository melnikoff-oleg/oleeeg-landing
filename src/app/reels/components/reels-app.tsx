"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Filters, type FilterState } from "./filters";
import { ReelSheet } from "./reel-sheet";
import { ReelTile } from "./reel-tile";
import { Sticker } from "./sticker";
import {
  BROWSE_PAGE_SIZE,
  FOLLOWER_MAX_INDEX,
  normalizeQuery,
  type ReelRow,
  type WindowDays,
} from "@/lib/reels/types";
import type { Topic } from "@/lib/reels/topics";

/** The four things a visitor can type to see what the page does. */
const EXAMPLES = [
  "a before and after transformation",
  "cleaning something disgusting",
  "a trick that looks impossible",
  "one person playing every character",
];

/**
 * Resting tilt per tile, in degrees.
 *
 * Deterministic, indexed by position, never random: a random tilt would be a
 * different number on the server than in the browser and React would log a
 * hydration mismatch on the very first paint. Seven values, so the pattern does
 * not line up with any of the grid's column counts (2, 3, 4, 5) and no column
 * ends up leaning the same way all the way down.
 */
const TILTS = [-1.1, 0.8, -0.5, 1.2, -0.9, 0.4, 1.0];

type Mode = "wall" | "search";

export function ReelsApp({
  topics,
  initialRows,
  initialTotal,
  initialFailed,
  configured,
  initialQuery,
  initialTopics,
  initialDays,
  initialMinIndex,
  initialMaxIndex,
}: {
  topics: Topic[];
  initialRows: ReelRow[];
  initialTotal: number;
  initialFailed: boolean;
  configured: boolean;
  /** The five values the server already normalized out of the query string, so
   *  a shared /reels?q=...&t=...&d=... link opens on exactly what it describes.
   *  The wall for those filters is already rendered; only a query still has
   *  work to do, which the mount effect below picks up. */
  initialQuery: string;
  initialTopics: string[];
  initialDays: WindowDays;
  initialMinIndex: number;
  initialMaxIndex: number;
}) {
  const [filters, setFilters] = useState<FilterState>({
    topics: initialTopics,
    days: initialDays,
    minIndex: initialMinIndex,
    maxIndex: initialMaxIndex,
  });
  const [draft, setDraft] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<Mode>(initialQuery ? "search" : "wall");

  const [rows, setRows] = useState<ReelRow[]>(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [more, setMore] = useState(false);
  const [failed, setFailed] = useState(initialFailed);
  const [open, setOpen] = useState<ReelRow | null>(null);

  // The server already rendered page one for the default filters, so the first
  // run of the filter effect would refetch exactly what is already on screen.
  const primed = useRef(false);
  // Every response carries the id of the request that asked for it. A slow
  // answer that lands after a newer one has already painted is dropped, which
  // is what stops a fast chip click from being overwritten by the search it
  // interrupted.
  const seq = useRef(0);
  const inflight = useRef<AbortController | null>(null);

  /** The filters, as the query string both routes read. */
  const filterParams = useCallback(
    (f: FilterState) => {
      const p = new URLSearchParams();
      if (f.days !== null) p.set("d", String(f.days));
      if (f.minIndex > 0) p.set("fmin", String(f.minIndex));
      if (f.maxIndex < FOLLOWER_MAX_INDEX) p.set("fmax", String(f.maxIndex));
      if (f.topics.length) p.set("t", f.topics.join(","));
      return p;
    },
    [],
  );

  const load = useCallback(
    async (f: FilterState, q: string, nextPage: number, append: boolean) => {
      if (!configured) return;
      const id = ++seq.current;
      inflight.current?.abort();
      const ctl = new AbortController();
      inflight.current = ctl;
      if (append) setMore(true);
      else setBusy(true);

      try {
        let results: ReelRow[] = [];
        let count = 0;
        if (q) {
          const res = await fetch("/api/reels/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: q, days: f.days, topics: f.topics }),
            signal: ctl.signal,
          });
          if (!res.ok) throw new Error(String(res.status));
          const json = await res.json();
          results = json.results ?? [];
          count = results.length;
        } else {
          const p = filterParams(f);
          p.set("page", String(nextPage));
          const res = await fetch(`/api/reels/browse?${p}`, { signal: ctl.signal });
          if (!res.ok) throw new Error(String(res.status));
          const json = await res.json();
          results = json.results ?? [];
          count = json.total ?? results.length;
        }
        if (id !== seq.current) return;
        setRows((prev) => (append ? [...prev, ...results] : results));
        setTotal(count);
        setPage(nextPage);
        setFailed(false);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        if (id !== seq.current) return;
        setFailed(true);
        if (!append) setRows([]);
      } finally {
        if (id === seq.current) {
          setBusy(false);
          setMore(false);
        }
      }
    },
    [configured, filterParams],
  );

  // A shared link carrying ?q= arrives with the wall rendered and the search
  // not yet run, because running it on the server would put an OpenAI embedding
  // call in front of the first paint. This is the one fetch that fires on
  // mount, and only when there is a query in the address bar.
  useEffect(() => {
    if (!initialQuery) return;
    void load(
      {
        topics: initialTopics,
        days: initialDays,
        minIndex: initialMinIndex,
        maxIndex: initialMaxIndex,
      },
      initialQuery,
      1,
      false,
    );
    // Mount only. Every later search goes through submit().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filters changing reloads whichever mode is showing, always from the top:
  // page three of the old filter is not page three of the new one.
  useEffect(() => {
    if (!primed.current) {
      primed.current = true;
      return;
    }
    void load(filters, query, 1, false);
    // `load` is stable and `query` is deliberately not a dependency: a query is
    // applied when it is submitted, not while it is being typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // The address bar mirrors the state, so a filtered wall or a search can be
  // sent to someone. replaceState rather than push, or every chip click would
  // become a back-button step.
  useEffect(() => {
    const p = filterParams(filters);
    if (query) p.set("q", query);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `/reels?${qs}` : "/reels");
  }, [filters, query, filterParams]);

  function submit(raw: string) {
    const q = normalizeQuery(raw);
    if (!q) return;
    setQuery(q);
    setDraft(q);
    setMode("search");
    void load(filters, q, 1, false);
  }

  function clearSearch() {
    setQuery("");
    setDraft("");
    setMode("wall");
    void load(filters, "", 1, false);
  }

  const canPage = mode === "wall" && rows.length < total;

  return (
    <>
      {/* ------------------------------------------------------------ search */}
      <section className="paper-card relative mt-8 p-4 sm:p-5">
        <span className="tape right-10 top-[-13px] rotate-2" aria-hidden />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(draft);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label className="flex min-w-0 flex-1 items-center gap-3">
            <Sticker name="magnifier" size={34} tilt={-12} />
            <span className="sr-only">describe the reel you want to make and find the closest ones that went viral</span>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="describe your reel idea"
              maxLength={200}
              autoComplete="off"
              className="min-w-0 flex-1 text-[17px] sm:text-[19px]"
            />
          </label>
          <div className="flex w-full gap-2 sm:w-auto">
            {query ? (
              <button
                type="button"
                onClick={clearSearch}
                className="btn btn-paper !px-4"
                aria-label="clear the search"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
            {/* Not disabled on an empty box. A greyed-out primary button is the
                first thing a visitor sees on this page, and submit() already
                no-ops on empty input, so there is nothing for the disabled
                state to protect. */}
            <button type="submit" className="btn btn-coral flex-1 sm:flex-none" disabled={busy}>
              {busy && mode === "search" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Search className="size-4" aria-hidden />
              )}
              find reels
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="caption mr-1">try</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => submit(example)}
              className="chip !min-h-[32px] !px-3 !text-[12.5px] !font-light"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- filters */}
      <div className="mt-4">
        <Filters
          topics={topics}
          state={filters}
          onChange={setFilters}
          onClear={() =>
            setFilters({ topics: [], days: null, minIndex: 0, maxIndex: FOLLOWER_MAX_INDEX })
          }
        />
      </div>

      {/* -------------------------------------------------------------- wall */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[22px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[28px]">
          <Sticker name={mode === "search" ? "arrow" : "flame"} size={30} tilt={-8} />
          {mode === "search" ? (
            <>closest to &ldquo;{query}&rdquo;</>
          ) : (
            <>the wall</>
          )}
        </h2>
        <p className="caption pb-1">
          {busy
            ? "looking"
            : mode === "search"
              ? `${rows.length} reel${rows.length === 1 ? "" : "s"}`
              : `${rows.length} of ${total.toLocaleString("en-GB")}`}
        </p>
      </div>

      {!configured ? (
        <p className="prose mt-6 text-[#5d6478]">
          the library is not connected right now. try again in a bit.
        </p>
      ) : failed ? (
        <p className="prose mt-6 text-[#5d6478]">
          that did not come back. move a filter to try again.
        </p>
      ) : rows.length === 0 && !busy ? (
        <div className="paper-card mt-6 flex flex-col items-center gap-3 p-8 text-center">
          <Sticker name="blob" size={64} tilt={-6} drift={0} />
          <p className="ui text-[17px]">nothing in the library is close to that</p>
          <p className="prose max-w-[420px] text-[14px] text-[#5d6478]">
            {mode === "search"
              ? "the search says nothing rather than filling ten slots with reels that only look related. widen the window, drop a topic, or describe it differently."
              : "no reel matches all of those filters. drop one."}
          </p>
        </div>
      ) : (
        <div
          className={`mt-6 grid gap-4 sm:gap-5 ${
            busy ? "pointer-events-none opacity-45 transition-opacity duration-200" : ""
          } grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
        >
          {rows.map((reel, i) => (
            <ReelTile
              key={reel.shortcode}
              reel={reel}
              rank={i + 1}
              tilt={TILTS[i % TILTS.length]}
              // Only the newest page deals itself in. Re-staggering rows that
              // are already on screen would replay the whole wall on every
              // "more", and the delay is capped so page five is not a wait.
              delay={Math.min(i % BROWSE_PAGE_SIZE, 12) * 0.025}
              onOpen={() => setOpen(reel)}
            />
          ))}
        </div>
      )}

      {canPage ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="btn btn-paper"
            disabled={more}
            onClick={() => void load(filters, "", page + 1, true)}
          >
            {more ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {more ? "getting them" : "more reels"}
          </button>
        </div>
      ) : null}

      <ReelSheet reel={open} onClose={() => setOpen(null)} />
    </>
  );
}
