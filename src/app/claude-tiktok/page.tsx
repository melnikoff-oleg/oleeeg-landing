import { ResourcePageShell } from "@/components/resource-page-shell";
import {
  Answer,
  Block,
  Callout,
  Code,
  Figure,
  Guide,
  GuideSection,
  GuideSteps,
  GuideToc,
  KeyFacts,
  Out,
} from "@/components/guide";
import { PLANS, usd } from "@/lib/pricing";

const VIDEO_ID = "lw69SOTKRM4";
const VIDEO_TITLE = "Claude Code for Viral TikTok Videos";

const steps = [
  {
    title: "Install Visual Studio Code",
    content: (
      <div className="space-y-3">
        <p>
          Download and install VS Code from{" "}
          <a
            href="https://code.visualstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            code.visualstudio.com
          </a>
          . It auto-detects your OS.
        </p>
        <p>Run the installer and verify VS Code launches properly.</p>
      </div>
    ),
  },
  {
    title: "Install Claude Code",
    content: (
      <div className="space-y-3">
        <p>
          Open the terminal in VS Code (Terminal → New Terminal) and run:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          Npm install -g @anthropic-AI/claude-code
        </div>
        <p>
          Requires Node.js (LTS). If you don&apos;t have it, download from{" "}
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
          Once installed, type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          in the terminal and complete Anthropic account authentication.
        </p>
      </div>
    ),
  },
  {
    title: "Download the project from GitHub",
    content: (
      <div className="space-y-3">
        <p>Go to the GitHub repository:</p>
        <p>
          <a
            href="https://github.com/melnikoff-oleg/tiktok-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            github.com/melnikoff-oleg/tiktok-ai
          </a>
        </p>
        <p>
          Click the green <span className="text-silver">&lt;&gt; Code</span>{" "}
          button, then <span className="text-silver">Download ZIP</span>. Unzip
          the file and open the folder in VS Code via File → Open Folder.
        </p>
        <p>Alternatively, clone it from the terminal:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          git clone https://github.com/melnikoff-oleg/tiktok-ai.git
        </div>
      </div>
    ),
  },
  {
    title: "Get your API keys",
    content: (
      <div className="space-y-4">
        <p>You need three API keys:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                (scraping TikTok)
              </span>
            </p>
            <p className="mt-1">
              Scrapes videos from competitor TikTok creators. Create an account
              at{" "}
              <a
                href="https://apify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                apify.com
              </a>{" "}
              → Settings → Integrations and copy your Personal API Token.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Google Gemini{" "}
              <span className="font-normal text-silver-muted">
                (analyzing competitor visuals)
              </span>
            </p>
            <p className="mt-1">
              Analyzes video thumbnails and visual patterns from competitor
              TikToks. Get your key at{" "}
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
                (generating concepts)
              </span>
            </p>
            <p className="mt-1">
              Powers the video concept and script generation engine. Sign up at{" "}
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
    title: "Configure your .env file",
    content: (
      <div className="space-y-3">
        <p>
          In the project folder, find{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env.example
          </code>{" "}
          (or{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env
          </code>
          ). Duplicate it and rename to{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env
          </code>{" "}
          if needed.
        </p>
        <p>Paste your API keys:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          APIFY_API_TOKEN=your_apify_token
          <br />
          GEMINI_API_KEY=your_gemini_key
          <br />
          ANTHROPIC_API_KEY=your_anthropic_key
        </div>
        <p>
          Save the file. Check the project README if variable names differ.
        </p>
      </div>
    ),
  },
  {
    title: "Run the project",
    content: (
      <div className="space-y-3">
        <p>
          Open the terminal in VS Code, type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          to start Claude Code, and ask it to help you run the project.
        </p>
        <p>
          Claude Code will install dependencies, start the app, and walk you
          through the workflow: adding TikTok creators, configuring your brand,
          and running the content pipeline.
        </p>
      </div>
    ),
  },
];


const SECTIONS = [
  "The idea, and why TikTok rewards it more than any other platform",
  "The four tabs",
  "The pipeline settings that matter",
  "Writing the two configs",
  "Why three scripts per idea",
  "What it costs",
  "Where it goes wrong",
];

const guideSteps = [
  {
    title: "Build a creator list in one niche",
    schema:
      "Add TikTok creators in your niche by username. The app scrapes each profile and records followers and popular video counts.",
    body: (
      <>
        <p>
          Paste a TikTok username, tag it with a category, press add. It scrapes
          the profile and records the follower count and how many popular videos
          they have, so you can see at a glance whether the account is worth
          studying.
        </p>
        <p>
          The categories matter more than they look. If you run content for
          several brands or clients, each gets its own category and its own
          config, and one project serves all of them.
        </p>
      </>
    ),
  },
  {
    title: "Write the analysis config",
    schema:
      "Write the instruction that says what to extract from each video: the hook, the retention mechanism and the call to action.",
    body: (
      <>
        <p>
          Three things to extract from every video, and on TikTok specifically I
          would not cut any of them:
        </p>
        <ul>
          <li>
            <strong>The hook.</strong> The first two seconds. On TikTok this is
            not most of the battle, it is the whole battle.
          </li>
          <li>
            <strong>The retention mechanism.</strong> What stops the thumb at
            second five.
          </li>
          <li>
            <strong>The call to action</strong>, if there is one, and where it
            sits. This is the one people leave out, and it is the difference
            between views and sales.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Write the generation config",
    schema:
      "Write the second instruction describing your brand, your content pillars and what you want the output to look like.",
    body: (
      <>
        <p>
          Who you are, what your content is about, and what you want back. Be
          specific about the output format: a script alone, or a script plus
          b-roll direction, or shot notes.
        </p>
        <p>
          I ask for <strong>three different scripts per idea</strong>, for
          reasons in their own section below.
        </p>
      </>
    ),
  },
  {
    title: "Set the window before you set the count",
    schema:
      "Run the pipeline over the last 30 days, taking the top three of each creator's last twenty videos.",
    body: (
      <>
        <p>
          My settings: <strong>Last 20 videos per creator, take the top 3, only
          from the past 30 days.</strong>
        </p>
        <p>
          The 30 days is the setting that matters. TikTok trends have a shelf
          life measured in weeks. A video that went viral six months ago is a
          history lesson, and copying a depleted trend is worse than having no
          idea at all, because it looks late.
        </p>
      </>
    ),
  },
  {
    title: "Run it and wait about fifteen minutes",
    schema:
      "Run the pipeline and wait roughly fifteen minutes for the analysis and concepts to come back.",
    body: (
      <>
        <p>
          About fifteen minutes for a full run. You get every video with its
          analysis, a link back to the original, and your own concepts beside
          it.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "How is this different from just watching TikTok for an hour",
    a: "Scale and honesty. You can watch twenty videos and remember three things, and those three will be the ones that confirmed what you already believed. This reads every video, extracts the hook, the retention mechanism and the call to action for each, and shows you the pattern across creators, including the ones you would not have noticed.",
  },
  {
    q: "What time window should I analyse on TikTok",
    a: "Thirty days, and shorter if your niche moves fast. TikTok trends have a shelf life of weeks. A video that went viral six months ago tells you about a trend that is already depleted, and copying it lands worse than having no idea at all, because it reads as late.",
  },
  {
    q: "Can I run this for multiple brands or clients",
    a: "Yes, and it is what the categories are for. Each client gets a creator category and a config, and one project serves all of them. Running an agency, that is the difference between a personal tool and something you can actually bill against.",
  },
  {
    q: "Why three scripts per concept instead of one",
    a: "Because you cannot tell which framing works from reading it, and the marginal cost of two more is nothing. Three gives you a choice, and choosing is much easier than judging one option in isolation. It also stops you filming something you are lukewarm about because it was the only thing on offer.",
  },
  {
    q: "Is this the same system as the Instagram reels one",
    a: "Same architecture, different scraper. Scrape, analyse, generate, and only the scraping step knows which platform it is on. The Instagram version came first and the TikTok one exists because I asked Claude Code to point it somewhere else. That portability is the real lesson of both projects.",
  },
  {
    q: "How much does it cost to run",
    a: "A Claude plan at $20 a month, plus scraping and video analysis. Apify gives $5 of credit free every month and Google AI Studio has a free Gemini tier. In normal use the marginal cost of a run is close to nothing, and the thing that runs out first is the Gemini free tier, because watching video is the expensive call.",
  },
  {
    q: "Will copying competitor formats make my content derivative",
    a: "It depends what you copy. Copying the topic makes you derivative. Copying the mechanism, an open loop, a reveal held to the end, a specific hook shape, does not, any more than using a chorus makes a song derivative. The generation config exists to force the translation into your own subject, and if it is producing near-copies, that config is too thin.",
  },
];

export default function ClaudeTiktokPage() {
  return (
    <ResourcePageShell
      slug="claude-tiktok"
      repoCta={{ href: "https://github.com/melnikoff-oleg/tiktok-ai" }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="Claude Code for TikTok videos that hold attention"
      subhead="Study the tiktoks earning real reach in your niche, understand what makes them work, and turn it into thumb-stopping video concepts and scripts with AI."
      steps={steps}
      troubleshooting={["noEnvFile", "claudeNotFound", "crAlias", "geminiQuota", "creditBalance", "costs", "costsScraping", "scrapingSafety"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "TikTok", path: "/claude-tiktok" },
      ]}
      howTo={{
        name: "Build a viral TikTok research system with Claude Code",
        description:
          "Track competitors on TikTok, analyse the hook, retention mechanism and call to action of their best recent videos, and generate three scripts per idea for your own niche.",
        totalTime: "PT10M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="The idea, and why TikTok rewards it more than any other platform">
            <Answer>
              It works out why the videos winning in your niche held attention, then writes new concepts that use the same mechanism on your topic, while the format is still working.
            </Answer>
            <p>
              The system tracks creators in your niche, pulls their
              best-performing recent videos, works out{" "}
              <strong>why each one worked</strong>, and writes new concepts that
              use the same mechanism for your own subject. In the run I show,
              the videos it found ranged from over 20 million views down to
              niche ones in the low hundreds of thousands.
            </p>
            <p>
              This matters more on TikTok than anywhere else, because TikTok is
              the platform where a format spreads fastest and dies soonest. The
              same hook shape carries a dozen creators in a fortnight and then
              stops working. Being three weeks late is the difference between
              riding it and looking like you copied.
            </p>
            <Callout title="What is being copied, exactly">
              <p>
                Not the topic. The <strong>mechanism</strong>: the hook shape,
                the way tension is held, where the payoff sits. That is the
                transferable part and it is not anyone&apos;s property. If the
                output reads like a rewrite of somebody&apos;s video, your
                generation config is too thin.
              </p>
            </Callout>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="The four tabs">
            <Figure
              src="/guide/tiktok-tips.webp"
              alt="Four cards listing ways to get better results out of the system"
              videoId={VIDEO_ID}
              at={560}
              caption="The four things that lift the output most, in the order they are worth doing."
            />
            <KeyFacts
              rows={[
                { label: "Creators", value: "The competitors you track. Add by username, tagged into a category." },
                { label: "Configs", value: "Who you are and how to analyse. This is the actual product." },
                { label: "Run pipeline", value: "How many videos, over what window, for which config." },
                { label: "Results", value: "Every video, its analysis, and your concepts beside it." },
              ]}
            />
            <p>
              The creators tab records followers and popular-video counts as it
              scrapes, which is how you tell a creator worth learning from
              (strong views relative to their size) from one coasting on an old
              audience.
            </p>
          </GuideSection>

          <GuideSection title="The pipeline settings that matter">
            <Figure
              src="/guide/tiktok-pipeline.webp"
              alt="The pipeline configuration, showing how many videos per creator and how far back to look"
              videoId={VIDEO_ID}
              at={260}
              caption="Two numbers decide the cost and the quality of a run: how many videos per creator, and how far back to look."
            />
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="Writing the two configs">
            <Figure
              src="/guide/tiktok-config.webp"
              alt="The new-config dialog, with the analysis prompt and the concepts prompt"
              videoId={VIDEO_ID}
              at={180}
              caption="Both prompts live in one config, so a different client is a different config rather than a different project."
            />
            <p>
              Everything else is plumbing. These decide the output. Here is
              roughly what mine says:
            </p>
            <Block>{`ANALYSIS
for each video, tell me:
- the hook, word for word, and why it stops the scroll
- the retention mechanism: what holds attention past second five
- the call to action, if any, and where it sits
- the structure, beat by beat

GENERATION
we are BRAND. we make content about PILLARS for AUDIENCE.
take the mechanism from the video, not the topic,
and write three different scripts applying it to our subject.
include b-roll direction for each shot.`}</Block>
            <p>
              The phrase &quot;take the mechanism, not the topic&quot; is doing
              a lot of work there, and it is the line I would not cut.
            </p>
          </GuideSection>

          <GuideSection title="Why three scripts per idea">
            <p>
              I ask for three concepts per source video rather than one, and the
              reason is not that more is better.
            </p>
            <p>
              <strong>You cannot judge one script in isolation.</strong> Read a
              single option and you either film it or you do not, and either way
              you are guessing. Read three framings of the same idea and the
              best one is usually obvious in seconds, because you are comparing
              rather than evaluating.
            </p>
            <p>
              The marginal cost of the extra two is a few cents. The marginal
              value is that you stop filming things you were lukewarm about
              because they were the only thing on the table.
            </p>
          </GuideSection>

          <GuideSection title="What it costs">
            <KeyFacts
              rows={[
                { label: "Claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month, required` },
                { label: "Apify, for scraping TikTok", value: "$5 of free credit a month" },
                { label: "Gemini, for watching the videos", value: "Free tier in Google AI studio, with a daily cap" },
                { label: "Time per run", value: "About 15 minutes" },
                { label: "What runs out first", value: "The Gemini free tier, because video analysis is the expensive call" },
              ]}
            />
          </GuideSection>

          <GuideSection title="Where it goes wrong">
            <ul>
              <li>
                <strong>A stale window.</strong> The most damaging setting.
                Widen it past 30 days and you get depleted trends presented
                confidently.
              </li>
              <li>
                <strong>A thin generation config.</strong> Then it summarises
                instead of translating, and the output is somebody else&apos;s
                video with your words on it.
              </li>
              <li>
                <strong>Creators who are too big.</strong> A 20 million view
                video from an account with 30 million followers may have worked
                because of the account. Mix in mid-size creators where the idea
                had to carry it.
              </li>
              <li>
                <strong>The Gemini cap.</strong> A large run hits it. Fewer
                creators per run, not a bigger plan.
              </li>
              <li>
                <strong>Reading it as a to-do list.</strong> It is a shortlist.
                Three or four usable ideas out of a run is a good run.
              </li>
            </ul>
            <p>
              The same pipeline for Instagram is on{" "}
              <a href="/claude-reels">The reels guide</a>, the version that
              writes and packages posts is on{" "}
              <a href="/claude-content">The content guide</a>, and the
              account-level strategy layer is on{" "}
              <a href="/claude-social-growth">The growth guide</a>. Never used{" "}
              <Code>claude code</Code>?{" "}
              <a href="/claude-code-tutorial">Start here</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "AI TikTok Content with Claude Code",
        description:
          "Build an AI system that reverse-engineers viral TikToks in your niche and generates scroll-stopping video concepts and scripts automatically.",
        url: "https://oleg.ae/claude-tiktok",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
      boldaneCredit
    />
  );
}
