import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

/** A download / tray-arrow icon, for hero CTAs that hand over an app rather than a repo. */
export const DOWNLOAD_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden="true"
  >
    <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);

/**
 * Primary above-the-fold CTA for resource pages. Most visitors land here straight
 * from the YouTube video they just watched (85% of traffic is YouTube, and these
 * are near-100% entry pages), so the job of the fold is not to re-show the video:
 * it is to hand them the thing they clicked through for. Repo-backed pages get the
 * GitHub icon by default; pages that hand over an app (Claude Cowork, Claude Code)
 * pass `icon={DOWNLOAD_ICON}` and their own label.
 */
export function RepoCta({
  href,
  label = "Get it on GitHub",
  icon = GITHUB_ICON,
  className,
  align = "center",
}: {
  href: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
  /**
   * The centered hero still centers it. The two-column video hero puts it in a
   * left-aligned column, where a centered button floats away from the copy it
   * belongs to.
   */
  align?: "center" | "start";
}) {
  return (
    <div
      data-testid="hero-cta"
      className={`flex flex-col gap-3 sm:flex-row ${
        align === "start" ? "items-start justify-start" : "items-center justify-center"
      } ${className ?? ""}`}
    >
      <Button asChild size="lg" variant="primary">
        <a href={href} target="_blank" rel="noopener noreferrer">
          {icon}
          {label}
        </a>
      </Button>
    </div>
  );
}
