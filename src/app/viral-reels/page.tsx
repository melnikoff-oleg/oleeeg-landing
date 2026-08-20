import Link from "next/link";
import { ResourceFooter } from "@/components/resource-footer";
import { reelCount } from "@/lib/reels/search";
import { normalizeQuery } from "@/lib/reels/types";
import { ReelSearch } from "./components/reel-search";

export default async function ViralReelsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuery = normalizeQuery(raw ?? "");
  const count = await reelCount();

  return (
    <>
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="brand-wordmark font-display text-lg tracking-tight">
            oleg melnikov
          </Link>
          <Link
            href="https://www.youtube.com/@Oleg-Melnikov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            youtube
          </Link>
        </div>
      </header>

      <main>
        <section className="pt-12 pb-8 md:pt-20 md:pb-10">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <span className="eyebrow inline-block rounded-full border border-hairline bg-vivid-blue/10 px-4 py-1.5 font-body text-xs text-vivid-blue">
              {count > 0 ? `${count} reels, watched end to end` : "viral reel library"}
            </span>

            <h1 className="text-metallic mt-8 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              find the viral reel you should copy
            </h1>

            {/* Short on purpose: the search box has to clear the fold on a
                phone, and this page's promise is the box, not the copy. */}
            <p className="mx-auto mt-4 max-w-lg font-body text-lg text-silver-muted md:text-xl">
              describe the reel you want to make. get the ones that already went
              viral, and exactly why each of them worked.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <ReelSearch initialQuery={initialQuery} />

            <p className="mt-10 font-body text-sm leading-relaxed text-silver-muted">
              every reel here beat its own creator&rsquo;s audience by at least
              five times, cleared a real-engagement check, and was then watched
              start to finish and written up. search runs on meaning, not
              keywords, so plain english about what happens on screen works
              better than a topic.
            </p>
          </div>
        </section>
      </main>

      <ResourceFooter currentSlug="viral-reels" boldaneCredit />
    </>
  );
}
