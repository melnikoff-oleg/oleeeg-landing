import { ResourcePageShell } from "@/components/resource-page-shell";
import {
  Block,
  Callout,
  Code,
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
        <p>go to the GitHub repository:</p>
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
          click the green <span className="text-silver">&lt;&gt; Code</span>{" "}
          button, then <span className="text-silver">Download ZIP</span>. unzip
          the file and open the folder in VS Code via File → Open Folder.
        </p>
        <p>alternatively, clone it from the terminal:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          git clone https://github.com/melnikoff-oleg/tiktok-ai.git
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
                (scraping TikTok)
              </span>
            </p>
            <p className="mt-1">
              scrapes videos from competitor TikTok creators. create an account
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
              analyzes video thumbnails and visual patterns from competitor
              TikToks. get your key at{" "}
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
              powers the video concept and script generation engine. sign up at{" "}
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
          APIFY_API_TOKEN=your_apify_token
          <br />
          GEMINI_API_KEY=your_gemini_key
          <br />
          ANTHROPIC_API_KEY=your_anthropic_key
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
          through the workflow: adding TikTok creators, configuring your brand,
          and running the content pipeline.
        </p>
      </div>
    ),
  },
];


const SECTIONS = [
  "the idea, and why tiktok rewards it more than any other platform",
  "the four tabs",
  "the pipeline settings that matter",
  "writing the two configs",
  "why three scripts per idea",
  "what it costs",
  "where it goes wrong",
];

const guideSteps = [
  {
    title: "build a creator list in one niche",
    schema:
      "Add TikTok creators in your niche by username. The app scrapes each profile and records followers and popular video counts.",
    body: (
      <>
        <p>
          paste a tiktok username, tag it with a category, press add. it scrapes
          the profile and records the follower count and how many popular videos
          they have, so you can see at a glance whether the account is worth
          studying.
        </p>
        <p>
          the categories matter more than they look. if you run content for
          several brands or clients, each gets its own category and its own
          config, and one project serves all of them.
        </p>
      </>
    ),
  },
  {
    title: "write the analysis config",
    schema:
      "Write the instruction that says what to extract from each video: the hook, the retention mechanism and the call to action.",
    body: (
      <>
        <p>
          three things to extract from every video, and on tiktok specifically i
          would not cut any of them:
        </p>
        <ul>
          <li>
            <strong>the hook.</strong> the first two seconds. on tiktok this is
            not most of the battle, it is the whole battle.
          </li>
          <li>
            <strong>the retention mechanism.</strong> what stops the thumb at
            second five.
          </li>
          <li>
            <strong>the call to action</strong>, if there is one, and where it
            sits. this is the one people leave out, and it is the difference
            between views and sales.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "write the generation config",
    schema:
      "Write the second instruction describing your brand, your content pillars and what you want the output to look like.",
    body: (
      <>
        <p>
          who you are, what your content is about, and what you want back. be
          specific about the output format: a script alone, or a script plus
          b-roll direction, or shot notes.
        </p>
        <p>
          i ask for <strong>three different scripts per idea</strong>, for
          reasons in their own section below.
        </p>
      </>
    ),
  },
  {
    title: "set the window before you set the count",
    schema:
      "Run the pipeline over the last 30 days, taking the top three of each creator's last twenty videos.",
    body: (
      <>
        <p>
          my settings: <strong>last 20 videos per creator, take the top 3, only
          from the past 30 days.</strong>
        </p>
        <p>
          the 30 days is the setting that matters. tiktok trends have a shelf
          life measured in weeks. a video that went viral six months ago is a
          history lesson, and copying a depleted trend is worse than having no
          idea at all, because it looks late.
        </p>
      </>
    ),
  },
  {
    title: "run it and wait about fifteen minutes",
    schema:
      "Run the pipeline and wait roughly fifteen minutes for the analysis and concepts to come back.",
    body: (
      <>
        <p>
          about fifteen minutes for a full run. you get every video with its
          analysis, a link back to the original, and your own concepts beside
          it.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "how is this different from just watching tiktok for an hour",
    a: "Scale and honesty. You can watch twenty videos and remember three things, and those three will be the ones that confirmed what you already believed. This reads every video, extracts the hook, the retention mechanism and the call to action for each, and shows you the pattern across creators, including the ones you would not have noticed.",
  },
  {
    q: "what time window should i analyse on tiktok",
    a: "Thirty days, and shorter if your niche moves fast. TikTok trends have a shelf life of weeks. A video that went viral six months ago tells you about a trend that is already depleted, and copying it lands worse than having no idea at all, because it reads as late.",
  },
  {
    q: "can i run this for multiple brands or clients",
    a: "Yes, and it is what the categories are for. Each client gets a creator category and a config, and one project serves all of them. Running an agency, that is the difference between a personal tool and something you can actually bill against.",
  },
  {
    q: "why three scripts per concept instead of one",
    a: "Because you cannot tell which framing works from reading it, and the marginal cost of two more is nothing. Three gives you a choice, and choosing is much easier than judging one option in isolation. It also stops you filming something you are lukewarm about because it was the only thing on offer.",
  },
  {
    q: "is this the same system as the instagram reels one",
    a: "Same architecture, different scraper. Scrape, analyse, generate, and only the scraping step knows which platform it is on. The Instagram version came first and the TikTok one exists because I asked Claude Code to point it somewhere else. That portability is the real lesson of both projects.",
  },
  {
    q: "how much does it cost to run",
    a: "A Claude plan at $20 a month, plus scraping and video analysis. Apify gives $5 of credit free every month and Google AI Studio has a free Gemini tier. In normal use the marginal cost of a run is close to nothing, and the thing that runs out first is the Gemini free tier, because watching video is the expensive call.",
  },
  {
    q: "will copying competitor formats make my content derivative",
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
      title="claude code for tiktok videos that hold attention"
      subhead="study the tiktoks earning real reach in your niche, understand what makes them work, and turn it into thumb-stopping video concepts and scripts with ai."
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
          <GuideSection title="the idea, and why tiktok rewards it more than any other platform">
            <p>
              the system tracks creators in your niche, pulls their
              best-performing recent videos, works out{" "}
              <strong>why each one worked</strong>, and writes new concepts that
              use the same mechanism for your own subject. in the run i show,
              the videos it found ranged from over 20 million views down to
              niche ones in the low hundreds of thousands.
            </p>
            <p>
              this matters more on tiktok than anywhere else, because tiktok is
              the platform where a format spreads fastest and dies soonest. the
              same hook shape carries a dozen creators in a fortnight and then
              stops working. being three weeks late is the difference between
              riding it and looking like you copied.
            </p>
            <Callout title="what is being copied, exactly">
              <p>
                not the topic. the <strong>mechanism</strong>: the hook shape,
                the way tension is held, where the payoff sits. that is the
                transferable part and it is not anyone&apos;s property. if the
                output reads like a rewrite of somebody&apos;s video, your
                generation config is too thin.
              </p>
            </Callout>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="the four tabs">
            <KeyFacts
              rows={[
                { label: "creators", value: "the competitors you track. add by username, tagged into a category." },
                { label: "configs", value: "who you are and how to analyse. this is the actual product." },
                { label: "run pipeline", value: "how many videos, over what window, for which config." },
                { label: "results", value: "every video, its analysis, and your concepts beside it." },
              ]}
            />
            <p>
              the creators tab records followers and popular-video counts as it
              scrapes, which is how you tell a creator worth learning from
              (strong views relative to their size) from one coasting on an old
              audience.
            </p>
          </GuideSection>

          <GuideSection title="the pipeline settings that matter">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="writing the two configs">
            <p>
              everything else is plumbing. these decide the output. here is
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
              the phrase &quot;take the mechanism, not the topic&quot; is doing
              a lot of work there, and it is the line i would not cut.
            </p>
          </GuideSection>

          <GuideSection title="why three scripts per idea">
            <p>
              i ask for three concepts per source video rather than one, and the
              reason is not that more is better.
            </p>
            <p>
              <strong>you cannot judge one script in isolation.</strong> read a
              single option and you either film it or you do not, and either way
              you are guessing. read three framings of the same idea and the
              best one is usually obvious in seconds, because you are comparing
              rather than evaluating.
            </p>
            <p>
              the marginal cost of the extra two is a few cents. the marginal
              value is that you stop filming things you were lukewarm about
              because they were the only thing on the table.
            </p>
          </GuideSection>

          <GuideSection title="what it costs">
            <KeyFacts
              rows={[
                { label: "claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month, required` },
                { label: "apify, for scraping tiktok", value: "$5 of free credit a month" },
                { label: "gemini, for watching the videos", value: "free tier in google ai studio, with a daily cap" },
                { label: "time per run", value: "about 15 minutes" },
                { label: "what runs out first", value: "the gemini free tier, because video analysis is the expensive call" },
              ]}
            />
          </GuideSection>

          <GuideSection title="where it goes wrong">
            <ul>
              <li>
                <strong>a stale window.</strong> the most damaging setting.
                widen it past 30 days and you get depleted trends presented
                confidently.
              </li>
              <li>
                <strong>a thin generation config.</strong> then it summarises
                instead of translating, and the output is somebody else&apos;s
                video with your words on it.
              </li>
              <li>
                <strong>creators who are too big.</strong> a 20 million view
                video from an account with 30 million followers may have worked
                because of the account. mix in mid-size creators where the idea
                had to carry it.
              </li>
              <li>
                <strong>the gemini cap.</strong> a large run hits it. fewer
                creators per run, not a bigger plan.
              </li>
              <li>
                <strong>reading it as a to-do list.</strong> it is a shortlist.
                three or four usable ideas out of a run is a good run.
              </li>
            </ul>
            <p>
              the same pipeline for instagram is on{" "}
              <a href="/claude-reels">the reels guide</a>, the version that
              writes and packages posts is on{" "}
              <a href="/claude-content">the content guide</a>, and the
              account-level strategy layer is on{" "}
              <a href="/claude-social-growth">the growth guide</a>. never used{" "}
              <Code>claude code</Code>?{" "}
              <a href="/claude-code-tutorial">start here</a>.
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
