import { ResourcePageShell } from "@/components/resource-page-shell";

const VIDEO_ID = "JhtbnZUU_8E";
const VIDEO_TITLE = "Claude Code for Viral Instagram Reels";

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
          . it auto-detects your OS.
        </p>
        <p>
          run the installer and verify VS Code launches properly.
        </p>
      </div>
    ),
  },
  {
    title: "install claude code",
    content: (
      <div className="space-y-3">
        <p>
          open the terminal in VS Code (Terminal → New Terminal) and run:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          npm install -g @anthropic-ai/claude-code
        </div>
        <p>
          requires Node.js (LTS). if you don&apos;t have it, download from{" "}
          <a
            href="https://nodejs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            nodejs.org
          </a>
          .
        </p>
        <p>
          once installed, type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          in the terminal and complete Anthropic account authentication.
        </p>
      </div>
    ),
  },
  {
    title: "download the project from github",
    content: (
      <div className="space-y-3">
        <p>
          go to the GitHub repository:
        </p>
        <p>
          <a
            href="https://github.com/melnikoff-oleg/social-media"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            github.com/melnikoff-oleg/social-media
          </a>
        </p>
        <p>
          click the green <span className="text-silver">&lt;&gt; Code</span>{" "}
          button, then <span className="text-silver">Download ZIP</span>. unzip
          the file and open the folder in VS Code via File → Open Folder.
        </p>
        <p>
          alternatively, clone it from the terminal:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          git clone https://github.com/melnikoff-oleg/social-media.git
        </div>
      </div>
    ),
  },
  {
    title: "get your api keys",
    content: (
      <div className="space-y-4">
        <p>you need three API keys:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                (scraping Instagram)
              </span>
            </p>
            <p className="mt-1">
              scrapes Instagram reels, view counts, and engagement data from
              competitor accounts. sign up at{" "}
              <a
                href="https://apify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                apify.com
              </a>{" "}
              → Settings → Personal API Token.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Google Gemini{" "}
              <span className="font-normal text-silver-muted">
                (analyzing video content)
              </span>
            </p>
            <p className="mt-1">
              analyzes the actual video content of reels: hooks, visuals,
              retention mechanisms. get your key at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                aistudio.google.com/apikey
              </a>
              .
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Anthropic{" "}
              <span className="font-normal text-silver-muted">
                (generating scripts)
              </span>
            </p>
            <p className="mt-1">
              generates ready-to-film scripts based on competitor analysis. sign
              up at{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                console.anthropic.com
              </a>{" "}
              → Settings → API Keys.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "configure your .env file",
    content: (
      <div className="space-y-3">
        <p>
          in the project folder, find{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env.example
          </code>{" "}
          (or{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env
          </code>
          ). duplicate it and rename to{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env
          </code>{" "}
          if needed.
        </p>
        <p>paste your API keys:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          APIFY_API_TOKEN=your_apify_token_here
          <br />
          GEMINI_API_KEY=your_gemini_key_here
          <br />
          ANTHROPIC_API_KEY=your_anthropic_key_here
        </div>
        <p>
          save the file. check the project README if variable names differ.
        </p>
      </div>
    ),
  },
  {
    title: "run the project",
    content: (
      <div className="space-y-3">
        <p>
          open the terminal in VS Code, type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          to start Claude Code, and ask it to help you run the project.
        </p>
        <p>
          claude code will install dependencies, start the app, and walk you
          through the workflow: scraping competitor reels, analyzing hooks and
          retention patterns, and generating ready-to-film scripts.
        </p>
      </div>
    ),
  },
];

export default function ClaudeReelsPage() {
  return (
    <ResourcePageShell
      slug="claude-reels"
      repoCta={{ href: "https://github.com/melnikoff-oleg/social-media" }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="claude code for instagram reels that earn attention"
      subhead="study the reels actually winning in your niche, then turn what you learn into ready-to-film scripts with sharp hooks, retention analysis, and clear visual direction. craft over guesswork."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "noEnvFile", "geminiQuota", "creditBalance", "costs", "costsScraping", "skipPermissions", "scrapingSafety"]}
      jsonLd={{
        title: "AI Instagram Reels with Claude Code",
        description:
          "Reverse-engineer viral Instagram Reels from competitors, analyze hooks and retention patterns, and generate ready-to-film AI Reels scripts.",
        url: "https://oleg.ae/claude-reels",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCredit
    />
  );
}
