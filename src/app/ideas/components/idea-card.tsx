import { cn } from "@/lib/utils";
import type { Idea } from "@/lib/ideas/db";

const STATUS_LABEL: Record<string, string> = {
  planned: "planned",
  filming: "filming now",
  published: "video is out",
};

export function IdeaCard({
  idea,
  voted,
  pending,
  highlighted,
  onVote,
}: {
  idea: Idea;
  voted: boolean;
  pending: boolean;
  highlighted: boolean;
  onVote: (id: string) => void;
}) {
  const status = STATUS_LABEL[idea.status];

  return (
    <li
      id={`idea-${idea.id}`}
      className={cn(
        "surface-card flex gap-4 p-4 transition-shadow duration-500 sm:gap-5 sm:p-5",
        highlighted && "glow-blue",
      )}
    >
      <button
        type="button"
        onClick={() => onVote(idea.id)}
        disabled={pending}
        aria-pressed={voted}
        aria-label={voted ? `remove your vote from ${idea.title}` : `vote for ${idea.title}`}
        className={cn(
          "flex h-[62px] w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors",
          voted
            ? "border-vivid-blue/60 bg-vivid-blue/15 text-white"
            : "border-hairline text-silver hover:border-vivid-blue/50 hover:text-white",
          pending && "opacity-60",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          aria-hidden
          className={cn("size-4", voted && "text-vivid-blue")}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <span className="font-body text-base font-semibold tabular-nums">
          {idea.votes_count}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="font-body text-base leading-snug text-silver [overflow-wrap:anywhere]">
          {idea.title}
        </p>

        {idea.detail ? (
          <p className="mt-1.5 font-body text-base leading-relaxed text-silver-muted [overflow-wrap:anywhere]">
            {idea.detail}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {status ? (
            <span className="rounded-full border border-vivid-blue/30 bg-vivid-blue/10 px-2.5 py-0.5 font-body text-xs text-vivid-blue">
              {status}
            </span>
          ) : null}

          {idea.author_name ? (
            <span className="font-body text-xs text-silver-muted [overflow-wrap:anywhere]">
              from {idea.author_name}
            </span>
          ) : null}

          {idea.status === "published" && idea.video_url ? (
            <a
              href={idea.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white"
            >
              watch it
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
