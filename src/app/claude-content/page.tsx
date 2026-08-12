import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";

const VIDEO_ID = "QOuH88WW7bQ";
const VIDEO_TITLE = "Claude Code Content Creation System";

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
        <p>run the installer and verify VS Code launches properly.</p>
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
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
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
    title: "get your api keys",
    content: (
      <div className="space-y-4">
        <p>you need two API keys:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                (scraping trending content from social media)
              </span>
            </p>
            <p className="mt-1">
              create an account at{" "}
              <a
                href="https://apify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                apify.com
              </a>
              , then go to Settings → Integrations and copy your Personal API
              Token.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Kie.ai{" "}
              <span className="font-normal text-silver-muted">
                (generating visuals: infographics, carousels)
              </span>
            </p>
            <p className="mt-1">
              sign up at{" "}
              <a
                href="https://kie.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                kie.ai
              </a>{" "}
              and generate your API key from account settings.
            </p>
          </div>
        </div>
        <p>store both keys somewhere safe. you&apos;ll need them in step 5.</p>
      </div>
    ),
  },
  {
    title: "get the project files",
    content: (
      <div className="space-y-3">
        <p>
          download or copy the project folder from Google Drive:
        </p>
        <p>
          <a
            href="https://drive.google.com/drive/folders/15E8VAaO7ULLYOINJOxYedvXeokegjP0D?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            open Google Drive folder
          </a>
        </p>
        <p>
          once downloaded, open the folder in VS Code via File → Open Folder.
        </p>
      </div>
    ),
  },
  {
    title: "add your api keys and run the project",
    content: (
      <div className="space-y-3">
        <p>
          open the terminal in VS Code and type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          to start Claude Code.
        </p>
        <p>
          insert both API keys into the project configuration, following the
          README instructions in the project folder. claude code can help you
          set everything up if you ask it.
        </p>
      </div>
    ),
  },
];

export default function ClaudeContentPage() {
  return (
    <ResourcePageShell
      slug="claude-content"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="claude code content creation system"
      subhead="produce weeks of social media content with custom visuals: infographics, carousels, personal images, all from a single prompt. works for linkedin, instagram, x, and more."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "noEnvFile", "costs", "creditBalance"]}
      jsonLd={{
        title: "Content Creation System with Claude Code",
        description:
          "Produce weeks of social media content with custom visuals (infographics, carousels, personal images) from a single prompt using Claude Code.",
        url: "https://oleg.ae/claude-content",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCta={
        <>
          prefer the done-for-you version? <BoldaneLink /> turns one hour of
          talking a week into five LinkedIn posts, all from what you said. a
          real team does the crafting. you just approve.
        </>
      }
    />
  );
}
