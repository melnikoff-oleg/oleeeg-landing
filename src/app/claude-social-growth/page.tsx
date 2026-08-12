import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { CopyButton } from "@/components/copy-button";
import { DOWNLOAD_ICON } from "@/components/repo-cta";

const VIDEO_ID = "GK3JFG7x7LA";
const VIDEO_TITLE = "Claude Code for Social Media Growth";

// held in a const so the copy button and the displayed prompt never drift
const ANALYSIS_PROMPT =
  "Analyze all videos from these YouTube channels: [paste URLs]. Scrape every video, identify outliers that performed way above average, and analyze their titles, thumbnails, and transcripts.";

const steps = [
  {
    title: "install visual studio code",
    content: (
      <div className="space-y-3">
        <p>
          download and install VS Code from{" "}
          <a
            href="https://code.visualstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            code.visualstudio.com
          </a>
          .
        </p>
        <p>
          this is where you&apos;ll run claude code and manage your analysis
          projects.
        </p>
      </div>
    ),
  },
  {
    title: "install claude code extension",
    content: (
      <div className="space-y-3">
        <p>
          open VS Code, go to the Extensions tab (left sidebar), and search for{" "}
          <span className="text-silver">Claude Code</span>.
        </p>
        <p>install it and log in with your Anthropic account.</p>
        <p>
          claude code needs a paid claude plan: pro is $20/mo and is enough to
          start. the &quot;get claude code&quot; button at the top of this page
          takes you to the same place,{" "}
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            claude.com/claude-code
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    title: "pick your competitors",
    content: (
      <div className="space-y-3">
        <p>
          identify 10-15 creators in your niche on YouTube (or
          Instagram/TikTok).
        </p>
        <p>
          collect their channel URLs or usernames. the more competitors you
          analyze, the better the patterns claude code will find.
        </p>
      </div>
    ),
  },
  {
    title: "get your apify api key",
    content: (
      <div className="space-y-3">
        <p>
          sign up at{" "}
          <a
            href="https://apify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            apify.com
          </a>{" "}
          (free tier available) and get your API token from Settings.
        </p>
        <p>
          claude code uses Apify to scrape all competitor videos, thumbnails, and
          metadata automatically.
        </p>
      </div>
    ),
  },
  {
    title: "run the analysis",
    content: (
      <div className="space-y-4">
        <p>
          open terminal in VS Code, start claude code, and give it a prompt
          like:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-5 text-base leading-relaxed text-silver [overflow-wrap:anywhere]">
          &quot;{ANALYSIS_PROMPT}&quot;
        </div>
        <CopyButton text={ANALYSIS_PROMPT} />
        <p>
          this takes 15-30 minutes depending on the volume of videos. in the
          video, we analyzed 1,906 videos from 14 competitors.
        </p>
      </div>
    ),
  },
  {
    title: "review the report",
    content: (
      <div className="space-y-3">
        <p>
          claude code generates a detailed report with everything you need to
          understand what&apos;s working in your niche:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-silver-muted">
          <li>outlier videos ranked by performance</li>
          <li>common hooks and title patterns</li>
          <li>thumbnail analysis</li>
          <li>content gaps</li>
          <li>topic clusters that perform best</li>
        </ul>
      </div>
    ),
  },
  {
    title: "get your personalized strategy",
    content: (
      <div className="space-y-3">
        <p>
          tell claude code about your channel and ask it to create a content
          strategy based on what it found.
        </p>
        <p>
          it&apos;ll suggest video concepts, titles, thumbnail ideas, and a
          posting schedule tailored to your niche.
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-3">
        <ul className="list-disc space-y-2 pl-5 text-silver-muted">
          <li>
            <span className="text-silver">re-run monthly</span> to catch new
            trends and shifts in what&apos;s working
          </li>
          <li>
            <span className="text-silver">analyze transcript patterns</span>:{" "}
            what story structures do top videos use?
          </li>
          <li>
            <span className="text-silver">study comment sections</span> for
            video ideas your competitors haven&apos;t covered
          </li>
          <li>
            <span className="text-silver">
              track your own analytics
            </span>{" "}
            and feed them back to claude code for optimization
          </li>
        </ul>
      </div>
    ),
  },
];

export default function ClaudeSocialGrowthPage() {
  return (
    <ResourcePageShell
      slug="claude-social-growth"
      repoCta={{ href: "https://claude.com/claude-code", label: "get claude code", icon: DOWNLOAD_ICON }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="claude code for social media growth"
      subhead="analyze thousands of competitor videos, find the ones that truly outperform, and build a data-driven content strategy for your channel, all with claude code."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "costs", "costsScraping", "scrapingSafety"]}
      jsonLd={{
        title: "AI Social Media Growth with Claude Code",
        description: "Analyze thousands of competitor videos, find the standout performers, and build a data-driven content strategy for YouTube, Instagram, and TikTok growth.",
        url: "https://oleg.ae/claude-social-growth",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCta={
        <>
          want this outcome without running the system yourself? that is what{" "}
          <BoldaneLink /> does: founders talk for one hour a week, and a real
          team turns what they said into a LinkedIn presence their market
          trusts and buys from.
        </>
      }
    />
  );
}
