import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";


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
        <p>this is where you&apos;ll run claude code and build your outreach app.</p>
      </div>
    ),
  },
  {
    title: "install claude code",
    content: (
      <div className="space-y-3">
        <p>open terminal in VS Code (Terminal → New Terminal) and run:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          npm install -g @anthropic-ai/claude-code
        </div>
        <p>
          requires Node.js 18+. if you don&apos;t have it, download from{" "}
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
        <p>once installed, type <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">claude</code> in the terminal to start.</p>
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
              <span className="font-normal text-silver-muted">(scraping leads)</span>
            </p>
            <p className="mt-1">
              scrapes social media platforms (LinkedIn, Instagram, Facebook) to
              find leads and pull information about them. sign up at{" "}
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
              Kie.ai{" "}
              <span className="font-normal text-silver-muted">
                (generating visuals)
              </span>
            </p>
            <p className="mt-1">
              generates visuals with value to send to prospects. sign up at{" "}
              <a
                href="https://kie.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                kie.ai
              </a>{" "}
              → generate your API key.
            </p>
          </div>
        </div>
        <p>
          you&apos;ll paste these keys when claude code asks for them, or put
          them in a .env file:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          APIFY_API_KEY=your_apify_key_here
          <br />
          KIE_API_KEY=your_kie_ai_key_here
        </div>
      </div>
    ),
  },
  {
    title: "start building with claude code",
    content: (
      <div className="space-y-4">
        <p>
          this is the key step. no project files to download: claude code
          builds the entire app from a prompt.
        </p>
        <p>
          open terminal, type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>
          , then give it a prompt like:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-5 text-[15px] leading-relaxed text-silver italic">
          &quot;Create a web application where I can plug in a URL of a person.
          It can be LinkedIn, Instagram, or Facebook. On the backend, scrape
          information about this person using Apify, then generate a
          personalized outreach message with a visual using Kie.ai. The message
          should provide value based on what I&apos;m selling. I&apos;m selling
          [your service] through [LinkedIn/Instagram/Facebook].&quot;
        </div>
        <p>
          adapt the prompt to your use case. in oleg&apos;s case, he sells
          content creation services to founders and generates example content as
          the value piece.
        </p>
        <p>
          claude code will build the full web app for you: frontend, backend,
          API integrations, everything.
        </p>
      </div>
    ),
  },
];

export default function ClaudeOutreachPage() {
  return (
    <ResourcePageShell
      slug="claude-outreach"
      title="claude code for cold outreach"
      subhead="build a thoughtful cold outreach system with claude code. it researches each prospect, then writes a personal, value-first message. follow the steps below to set it up."
      steps={steps}
      troubleshooting={["linkedinBan", "noEnvFile", "claudeNotFound", "costs"]}
      jsonLd={{
        title: "Claude Code for Cold Outreach: Free AI Outreach Setup Guide",
        description: "Build an AI cold outreach system with Claude Code. Scrape leads, generate personalized messages with visuals, and close deals on LinkedIn, Instagram, or Facebook.",
        url: "https://oleg.ae/claude-outreach",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCta={
        <>
          outreach gets easier when people already trust you. every prospect
          checks your LinkedIn before replying. <BoldaneLink /> makes sure
          what they find is a real authority, from one hour of talking a week,
          with the rest done for you.
        </>
      }
    />
  );
}
