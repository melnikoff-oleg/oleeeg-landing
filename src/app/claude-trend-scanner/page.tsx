import { ResourcePageShell } from "@/components/resource-page-shell";


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
        <p>this is where you&apos;ll run claude code.</p>
      </div>
    ),
  },
  {
    title: "install claude code extension",
    content: (
      <div className="space-y-3">
        <p>
          open VS Code, go to the Extensions tab, and search for{" "}
          <span className="text-silver font-medium">Claude Code</span>. install
          the extension and log in with your Anthropic account.
        </p>
        <p>
          the Claude Code subscription is $19/mo. it gives you access to the
          agent that builds the entire app for you.
        </p>
      </div>
    ),
  },
  {
    title: "download the source code",
    content: (
      <div className="space-y-3">
        <p>
          grab the source code from the free Skool community:{" "}
          <a
            href="https://www.skool.com/ai-automation-7100/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            skool.com/ai-automation-7100
          </a>
          .
        </p>
        <p>once downloaded, open the project folder in VS Code.</p>
      </div>
    ),
  },
  {
    title: "get your api keys",
    content: (
      <div className="space-y-4">
        <p>you need two services:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                for scraping social platforms
              </span>
            </p>
            <p className="mt-1">
              scrapes Twitter, Reddit, TikTok, and other platforms for trending
              content. sign up at{" "}
              <a
                href="https://apify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                apify.com
              </a>{" "}
              (free tier available).
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Anthropic API{" "}
              <span className="font-normal text-silver-muted">
                for analyzing trends
              </span>
            </p>
            <p className="mt-1">
              powers the AI analysis of scraped content. sign up at{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                console.anthropic.com
              </a>{" "}
              ($5 minimum to start).
            </p>
          </div>
        </div>
        <p>add your keys to a .env file in the project root:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          APIFY_API_KEY=your_apify_key_here
          <br />
          ANTHROPIC_API_KEY=your_anthropic_key_here
        </div>
      </div>
    ),
  },
  {
    title: "run the app",
    content: (
      <div className="space-y-3">
        <p>open the terminal in VS Code and run:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          npm run dev
        </div>
        <p>
          open{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            localhost:3000
          </code>{" "}
          in your browser. you&apos;ll see the dashboard with trending news and
          analysis.
        </p>
      </div>
    ),
  },
  {
    title: "configure your sources",
    content: (
      <div className="space-y-3">
        <p>
          add Twitter accounts, subreddits, YouTube channels, websites, and any
          data sources relevant to your niche. the system monitors all of them.
        </p>
        <p>
          the more specific your sources, the more relevant your trend data
          will be.
        </p>
      </div>
    ),
  },
  {
    title: "set up daily briefings",
    content: (
      <div className="space-y-3">
        <p>
          configure the system to run on schedule. each morning you get a
          structured briefing with trending topics, AI-generated summaries, and
          visual cards explaining what&apos;s happening.
        </p>
        <p>
          no more manually scrolling through feeds. everything is distilled
          and ready to act on.
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              use trends for content creation
            </p>
            <p className="mt-1">
              post about trending topics early for exponential reach. being
              first to cover a trend means the algorithm pushes your content to
              more people.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              great for founders staying ahead of competitors
            </p>
            <p className="mt-1">
              monitor what&apos;s gaining traction in your industry before your
              competitors notice. use it to inform product decisions, marketing
              angles, and positioning.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              investors can monitor portfolio-relevant news
            </p>
            <p className="mt-1">
              track market shifts, competitor moves, and emerging narratives
              across your portfolio companies and their sectors.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              let AI drive conclusions and suggest actions
            </p>
            <p className="mt-1">
              don&apos;t just read the trends. let the AI analyze patterns and
              recommend specific actions based on what it finds.
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function ClaudeTrendScannerPage() {
  return (
    <ResourcePageShell
      slug="claude-trend-scanner"
      title="claude code trend scanner"
      subhead="scan twitter, reddit, instagram, tiktok, youtube, and any website for trending topics in your niche. get a structured briefing every morning, automatically."
      steps={steps}
      troubleshooting={["cantFindCode", "noEnvFile", "claudeNotFound", "costs", "scrapingSafety"]}
      jsonLd={{
        title: "AI Trend Scanner with Claude Code",
        description:
          "Build an AI trend scanner that monitors Twitter, Reddit, YouTube, TikTok, and websites for trending topics in your niche. Get a structured briefing every morning, automatically.",
        url: "https://oleg.ae/claude-trend-scanner",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCredit
    />
  );
}
