import { normalizeDays, normalizeQuery } from "@/lib/reels/types";
import { ReelNav } from "@/components/reel-nav";
import { ReelSearch } from "./components/reel-search";

// Deliberately bare. No header, no wordmark, no hero, no footer, no copy: the
// page is the search box, the recency filter and the results, and nothing that
// would sit between a visitor and a reference. The h1 is present but visually
// hidden, because a page still needs one heading for a screen reader and for
// search engines, and this page has nothing on it to use as one.
export default async function ViralReelsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; d?: string | string[] }>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const initialQuery = normalizeQuery(first(params.q) ?? "");
  const initialDays = normalizeDays(first(params.d));

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <h1 className="sr-only">viral reels database</h1>
      <ReelNav current="/viral-reels" />
      <ReelSearch initialQuery={initialQuery} initialDays={initialDays} />
    </main>
  );
}
