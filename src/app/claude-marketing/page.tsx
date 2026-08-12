import { ResourcePageShell } from "@/components/resource-page-shell";

const VIDEO_ID = "AKtT6NLZGoM";
const VIDEO_TITLE = "Claude Code for Marketing";

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
          this is where you&apos;ll run claude code and build your marketing
          workflows.
        </p>
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
          the extension and sign in.
        </p>
        <p>
          claude code costs $19/mo and gives you access to the full agent. it
          writes code, runs commands, and builds entire projects from a prompt.
        </p>
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
                for scraping social media
              </span>
            </p>
            <p className="mt-1">
              scrapes social media platforms to find trending content and pull
              competitor data. sign up at{" "}
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
              Kie.ai{" "}
              <span className="font-normal text-silver-muted">
                for generating visuals
              </span>
            </p>
            <p className="mt-1">
              generates visual content for ads, reels, and outreach pieces. sign
              up at{" "}
              <a
                href="https://kie.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                kie.ai
              </a>{" "}
              and generate your API key.
            </p>
          </div>
        </div>
        <p>add both keys to a .env file in your project:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          APIFY_API_KEY=your_apify_key_here
          <br />
          KIE_API_KEY=your_kie_ai_key_here
        </div>
      </div>
    ),
  },
  {
    title: "generate instagram reels",
    content: (
      <div className="space-y-3">
        <p>
          tell claude code your brand and style guide. it generates video
          scripts, visual directions, and even rendered video content matching
          your brand identity.
        </p>
        <p>use the output for ads or organic posts.</p>
      </div>
    ),
  },
  {
    title: "scrape competitor content",
    content: (
      <div className="space-y-3">
        <p>
          claude code uses Apify to find trending reels and posts from your
          competitors. it analyzes engagement patterns, identifies what&apos;s
          working, and generates new concepts based on proven formats.
        </p>
      </div>
    ),
  },
  {
    title: "create ad campaigns",
    content: (
      <div className="space-y-3">
        <p>
          describe your product and target audience. claude code generates ad
          copy, visual assets, and targeting suggestions. works for Meta, Google,
          or any platform.
        </p>
      </div>
    ),
  },
  {
    title: "automate cold outreach",
    content: (
      <div className="space-y-3">
        <p>
          scrape leads matching your ICP, generate personalized messages with
          value pieces (improved banners, content audits), and manage outreach
          sequences.
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-3">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="text-silver font-medium">
              combine use cases
            </span>
            : scrape trends then generate content in one session
          </li>
          <li>
            <span className="text-silver font-medium">
              use your brand style guide
            </span>{" "}
            for consistent visuals across all outputs
          </li>
          <li>
            <span className="text-silver font-medium">
              let claude code analyze your analytics
            </span>{" "}
            to optimize what&apos;s working
          </li>
          <li>
            <span className="text-silver font-medium">
              start with one use case
            </span>
            , master it, then add more
          </li>
        </ul>
      </div>
    ),
  },
];

export default function ClaudeMarketingPage() {
  return (
    <ResourcePageShell
      slug="claude-marketing"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="claude code for marketing (smm, ads, outreach)"
      subhead="five real marketing use cases with claude code: instagram reels, competitor analysis, ad campaigns, cold outreach, and content creation. one walkthrough, all the systems oleg actually uses."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "noEnvFile", "costs", "creditBalance"]}
      jsonLd={{
        title: "Claude Code for Marketing: AI Marketing Automation Guide",
        description: "Five real marketing use cases with Claude Code: Instagram Reels, competitor analysis, ad campaigns, cold outreach, and content automation.",
        url: "https://oleg.ae/claude-marketing",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
    />
  );
}
