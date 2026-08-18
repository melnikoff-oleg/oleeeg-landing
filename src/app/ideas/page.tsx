import Link from "next/link";
import { cookies } from "next/headers";
import { ResourceFooter } from "@/components/resource-footer";
import { listIdeas, votedIdeaIds } from "@/lib/ideas/db";
import { readVoterId, VOTER_COOKIE } from "@/lib/ideas/session";
import { IdeaBoard } from "./components/idea-board";

// The board changes on every vote, so it is never cached.
export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const store = await cookies();
  const voterId = readVoterId(store.get(VOTER_COOKIE)?.value);
  // The vote lookup only matters for a browser that has voted before, so it is
  // skipped entirely (and returns []) for a first-time visitor.
  const [ideas, voted] = await Promise.all([listIdeas(), votedIdeaIds(voterId)]);

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
        <section className="pt-12 pb-10 md:pt-20 md:pb-14">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <span className="eyebrow inline-block rounded-full border border-hairline bg-vivid-blue/10 px-4 py-1.5 font-body text-xs text-vivid-blue">
              you decide
            </span>

            <h1 className="text-metallic mt-8 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              what should i build next?
            </h1>

            <p className="mt-4 font-body text-lg text-silver-muted md:text-xl">
              suggest a video, or vote for one that is already here. the ideas with the
              most votes are the ones i make.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <IdeaBoard initialIdeas={ideas} initialVoted={voted} />

            <p className="mt-8 font-body text-sm text-silver-muted">
              one vote per idea per browser. i log an ip address and a browser id with
              every action, only to keep the board honest.
            </p>
          </div>
        </section>
      </main>

      <ResourceFooter currentSlug="ideas" boldaneCredit />
    </>
  );
}
