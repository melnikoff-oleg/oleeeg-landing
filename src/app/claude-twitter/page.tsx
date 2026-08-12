import type { ReactNode } from "react";
import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";

const VIDEO_ID = "JQQhT0edXXw";
const VIDEO_TITLE = "Claude Code X/Twitter Content System";

// The code is public on GitHub and always was. This page used to send people to
// the Skool community for it, which is where the video description sends them
// too, and the video's comments are full of "I can't find the links", "the
// application says it's archived" and "I can't access the skool". A public repo
// needs no signup, so it is the download now, in the fold and in step 3.
const REPO = "https://github.com/melnikoff-oleg/x-ai";

/** Inline code, matching the newer resource pages. */
function K({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
      {children}
    </code>
  );
}

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
        <p>this is where you&apos;ll run claude code and the twitter content app.</p>
      </div>
    ),
  },
  {
    title: "install claude code extension",
    content: (
      <div className="space-y-3">
        <p>
          open VS Code, go to the extensions panel on the left side, and search
          for &quot;Claude Code&quot;. install the extension and log in.
        </p>
        <p>
          you need a paid claude plan (pro at $20/mo is enough to start). once
          installed, you can interact with claude code through the chat
          interface in plain english.
        </p>
      </div>
    ),
  },
  {
    title: "download the source code",
    content: (
      <div className="space-y-3">
        <p>
          the whole thing is public on GitHub, no signup:{" "}
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            github.com/melnikoff-oleg/x-ai
          </a>
          .
        </p>
        <p>
          click the green <K>Code</K> button, then <K>Download ZIP</K>, then
          unzip it. or if you have git, run this in a terminal:
        </p>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border border-hairline bg-navy-raised p-4 font-mono text-xs text-silver">
          git clone https://github.com/melnikoff-oleg/x-ai.git
        </pre>
        <p>
          open the folder in VS Code. you&apos;ll see the full project structure
          on the left side with everything ready to configure.
        </p>
      </div>
    ),
  },
  {
    title: "get your api keys",
    content: (
      <div className="space-y-4">
        <p>you need four services:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                for scraping X/Twitter
              </span>
            </p>
            <p className="mt-1">
              scrapes tweets from your competitors. sign up at{" "}
              <a
                href="https://apify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                apify.com
              </a>{" "}
              (free tier available) → Settings → Personal API Token.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Gemini API{" "}
              <span className="font-normal text-silver-muted">
                for analyzing competitor visuals
              </span>
            </p>
            <p className="mt-1">
              analyzes infographics and images from competitor posts. sign up at{" "}
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                aistudio.google.com
              </a>{" "}
              (free) → Get API Key.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Anthropic API{" "}
              <span className="font-normal text-silver-muted">
                for generating content
              </span>
            </p>
            <p className="mt-1">
              powers the content generation engine. sign up at{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                console.anthropic.com
              </a>{" "}
              → add at least $5 credit → copy your API key.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Kie AI{" "}
              <span className="font-normal text-silver-muted">
                for the infographic images
              </span>
            </p>
            <p className="mt-1">
              draws the branded infographic that goes out with the post, which is
              most of what this system posts. get a key at{" "}
              <a
                href="https://kie.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                kie.ai
              </a>
              . miss this one and the text posts still work, but every image
              fails.
            </p>
          </div>
        </div>
        <p>
          create a file called <K>.env</K> in the project root (the folder with{" "}
          <K>CLAUDE.md</K> in it, not inside <K>app</K>) and paste all four keys.
          the repo ships a <K>.env.example</K> you can copy. no quotes, no spaces
          around the <K>=</K>:
        </p>
        <div className="[overflow-wrap:anywhere] rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          APIFY_API_TOKEN=your_apify_token
          <br />
          GEMINI_API_KEY=your_gemini_key
          <br />
          ANTHROPIC_API_KEY=your_anthropic_key
          <br />
          KIE_AI_API_KEY=your_kie_key
        </div>
        <p>
          the name has to be exactly <K>APIFY_API_TOKEN</K>. it is the one people
          get wrong, and the scrape just fails with nothing useful on screen.
        </p>
      </div>
    ),
  },
  {
    title: "run the app",
    content: (
      <div className="space-y-3">
        <p>open terminal in VS Code and run:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          npm run dev
        </div>
        <p>
          open{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            localhost:3000
          </code>{" "}
          in your browser. you&apos;ll see the full dashboard where you can add
          competitors, configure your brand, and run the content pipeline.
        </p>
      </div>
    ),
  },
  {
    title: "add your competitors",
    content: (
      <div className="space-y-3">
        <p>
          go to the creators tab in the dashboard. find twitter accounts in your
          niche, people who are posting content related to your offer.
        </p>
        <p>
          paste their username, select a category, and the system will scrape
          and analyze their profile automatically. add at least 5-9 creators
          for best results.
        </p>
      </div>
    ),
  },
  {
    title: "configure your brand",
    content: (
      <div className="space-y-4">
        <p>go to the configs tab and create a new configuration. define:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>your brand context and ICP (ideal customer profile)</li>
          <li>content pillars and topics</li>
          <li>
            analysis instructions: how to break down competitor posts (hooks,
            structure, engagement drivers)
          </li>
          <li>
            generation instructions: how to turn their ideas into your own
            voice and niche
          </li>
        </ul>
        <p>
          the more specific you are here, the better your generated content will
          be.
        </p>
      </div>
    ),
  },
  {
    title: "run the pipeline",
    content: (
      <div className="space-y-3">
        <p>
          go to &quot;run pipeline&quot;, select your config, and hit run. in
          advanced settings, you can control:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>how many posts to scrape per creator (default: 20)</li>
          <li>how many top posts to select (default: top 3)</li>
          <li>time window (default: past 30 days)</li>
        </ul>
        <p>
          takes about 15 minutes. you&apos;ll get ready-to-publish posts with a
          mix of infographics (60%), personal image posts (30%), and text-only
          (10%).
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-silver font-medium">provide more brand context</p>
          <p className="mt-1">
            tell claude code to scrape your website, LinkedIn, and Instagram to
            build a richer brand DNA for the generator.
          </p>
        </div>
        <div>
          <p className="text-silver font-medium">add calls to action</p>
          <p className="mt-1">
            configure CTAs for some posts (e.g. &quot;book a 30-min
            consultation&quot;) to turn content into lead generation.
          </p>
        </div>
        <div>
          <p className="text-silver font-medium">analyze competitor comments</p>
          <p className="mt-1">
            find gaps in what competitors cover by analyzing their comment
            sections, then fill those gaps in your content.
          </p>
        </div>
        <div>
          <p className="text-silver font-medium">
            feed your own performance data
          </p>
          <p className="mt-1">
            once you have 30+ posts, tell claude code to analyze your
            performance and optimize future content toward what&apos;s working.
          </p>
        </div>
      </div>
    ),
  },
];

export default function ClaudeTwitterPage() {
  return (
    <ResourcePageShell
      slug="claude-twitter"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      repoCta={{ href: REPO }}
      title="claude code x/twitter content system"
      subhead="study what actually works in your competitors' tweets, then generate ready-to-publish content written in your own voice and for your own niche."
      steps={steps}
      troubleshooting={["noEnvFile", "claudeNotFound", "crAlias", "geminiQuota", "creditBalance", "costs", "costsScraping", "scrapingSafety"]}
      jsonLd={{
        title: "X/Twitter Content System with Claude Code",
        description:
          "Build an X/Twitter content system with Claude Code. Study what works in your competitors' tweets and generate ready-to-publish posts in your own voice.",
        url: "https://oleg.ae/claude-twitter",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCta={
        <>
          building this for X? <BoldaneLink /> does the same job on LinkedIn,
          done for you: you talk for one hour a week, and a real team turns
          what you said into five posts your market trusts.
        </>
      }
    />
  );
}
