"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  BROWSE_PAGE_SIZE,
  FOLLOWER_MAX_INDEX,
  WINDOWS,
  type ReelRow,
  type WindowDays,
} from "@/lib/reels/types";
import { ReelCard } from "@/components/reel-card";
import { FollowerRange } from "./follower-range";

// The slider fires an onChange for every step it crosses, and a fast drag from
// one end to the other crosses twelve. Waiting for the drag to settle turns
// that into one request.
const DRAG_SETTLE_MS = 300;

export type BrowseState = {
  days: WindowDays;
  minIndex: number;
  maxIndex: number;
  page: number;
};

export function ReelBrowser({
  initial,
  initialRows,
  initialTotal,
  initialFailed,
  configured,
}: {
  initial: BrowseState;
  initialRows: ReelRow[];
  initialTotal: number;
  initialFailed: boolean;
  configured: boolean;
}) {
  const [filters, setFilters] = useState<BrowseState>(initial);
  const [rows, setRows] = useState<ReelRow[]>(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(initialFailed);

  const inflight = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The first page came rendered from the server, so the effect below must not
  // immediately fetch it again.
  const primed = useRef(false);
  const listTop = useRef<HTMLDivElement>(null);

  const load = useCallback(async (next: BrowseState) => {
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;
    setLoading(true);
    setFailed(false);

    const params = new URLSearchParams();
    if (next.days !== null) params.set("d", String(next.days));
    if (next.minIndex > 0) params.set("fmin", String(next.minIndex));
    if (next.maxIndex < FOLLOWER_MAX_INDEX)
      params.set("fmax", String(next.maxIndex));
    if (next.page > 1) params.set("page", String(next.page));

    // Shareable and reload-safe, without a router push, so the back button
    // still leaves the page rather than walking the filter history.
    const url = new URL(globalThis.location.href);
    url.search = params.toString();
    globalThis.history.replaceState(null, "", url);

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
        setFailed(true);
        return;
      }
      setRows(json.results ?? []);
      setTotal(json.total ?? 0);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setFailed(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  // One place that reacts to the filters, so a page turn and a slider drag
  // cannot race each other into two different answers.
  useEffect(() => {
    if (!primed.current) {
      primed.current = true;
      return;
    }
    if (!configured) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void load(filters), DRAG_SETTLE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [filters, configured, load]);

  // Any change to what is being filtered starts again at page one: staying on
  // page 30 of a list that is now four pages long shows nothing at all.
  const setFilter = (patch: Partial<BrowseState>) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }));

  const pages = Math.max(1, Math.ceil(total / BROWSE_PAGE_SIZE));
  const page = Math.min(filters.page, pages);

  const goto = (next: number) => {
    setFilters((f) => ({ ...f, page: Math.min(Math.max(1, next), pages) }));
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="surface-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div
            role="group"
            aria-label="how new the reel is"
            className="flex flex-wrap gap-2"
          >
            {WINDOWS.map((w) => {
              const active = w.days === filters.days;
              return (
                <button
                  key={w.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter({ days: w.days })}
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

        <div className="mt-3 border-t border-hairline pt-3">
          <FollowerRange
            min={filters.minIndex}
            max={filters.maxIndex}
            onChange={(minIndex, maxIndex) => setFilter({ minIndex, maxIndex })}
          />
        </div>
      </div>

      <div
        ref={listTop}
        className="mt-6 flex scroll-mt-6 items-center justify-between gap-3"
      >
        <p className="font-body text-xs text-silver-muted" aria-live="polite">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              loading
            </span>
          ) : (
            `${total} reels`
          )}
        </p>
        {pages > 1 && (
          <p className="font-display text-xs tabular-nums text-silver-muted">
            page {page} of {pages}
          </p>
        )}
      </div>

      {!configured && (
        <p className="mt-4 rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
          the library is not connected right now. try again shortly.
        </p>
      )}

      {failed && (
        <p className="mt-4 rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
          the library did not come back. try again in a moment.
        </p>
      )}

      {configured && !failed && rows.length === 0 && !loading && (
        <p className="mt-4 rounded-2xl border border-hairline px-5 py-4 text-sm text-silver-muted">
          no reels in that range. try a wider audience or an older window.
        </p>
      )}

      {rows.length > 0 && (
        <div className={`mt-4 space-y-4 ${loading ? "opacity-50" : ""}`}>
          {rows.map((reel, i) => (
            <ReelCard
              key={reel.shortcode}
              reel={reel}
              rank={(page - 1) * BROWSE_PAGE_SIZE + i + 1}
            />
          ))}
        </div>
      )}

      {pages > 1 && (
        <nav
          aria-label="pages"
          className="mt-6 flex items-center justify-between gap-3"
        >
          <button
            type="button"
            onClick={() => goto(page - 1)}
            disabled={page <= 1 || loading}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-hairline px-4 font-body text-xs text-silver transition-colors hover:border-vivid-blue/50 hover:text-white disabled:opacity-30 disabled:hover:border-hairline"
          >
            <ChevronLeft className="size-4" aria-hidden />
            previous
          </button>
          <button
            type="button"
            onClick={() => goto(page + 1)}
            disabled={page >= pages || loading}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-hairline px-4 font-body text-xs text-silver transition-colors hover:border-vivid-blue/50 hover:text-white disabled:opacity-30 disabled:hover:border-hairline"
          >
            next
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </nav>
      )}
    </div>
  );
}
