import type { ReactNode } from "react";
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


const SECTIONS = [
  "what the output looks like",
  "why x is the platform where this pays",
  "the transfer, which is the whole trick",
  "building it",
  "the image mix, and why some posts have none",
  "what it costs",
  "what it gets wrong",
];

const guideSteps = [
  {
    title: "pick creators by niche, not by size",
    schema:
      "Add X accounts in your niche by username. The app records followers and post counts so you can judge each one.",
    body: (
      <>
        <p>
          i track nine, all in and around one niche. paste a username, tag the
          category, and it scrapes the profile and records followers and post
          count.
        </p>
        <p>
          pick people selling something like what you sell to people like your
          buyers. a huge general account teaches you what works for huge general
          accounts, which is not a lesson you can use.
        </p>
      </>
    ),
  },
  {
    title: "write the analysis config",
    schema:
      "Write the instruction that extracts the hook, the post structure and the engagement driver from each post.",
    body: (
      <>
        <p>three things from every post:</p>
        <ul>
          <li>
            <strong>the hook.</strong> on X this is the first line, because the
            first line is all anyone sees before deciding.
          </li>
          <li>
            <strong>the structure.</strong> one-liner, list, story, contrarian
            claim then proof.
          </li>
          <li>
            <strong>the engagement driver.</strong> what specifically made this
            post beat that account&apos;s own average.
          </li>
        </ul>
        <p>
          that last one is the important one, and it needs the account&apos;s
          baseline to mean anything.
        </p>
      </>
    ),
  },
  {
    title: "write the generation config, which is the actual work",
    schema:
      "Write the instruction that converts a competitor's post into one for your own audience, keeping the structure and changing the subject.",
    body: (
      <>
        <p>
          this is the config that decides whether the system produces content or
          plagiarism. it has to describe your brand, your buyer, your content
          pillars, and specifically <strong>that the structure transfers and
          the subject does not</strong>.
        </p>
        <p>
          a worked example, from a real run. the original post said:
          &quot;entrepreneurship is about self-belief first and business skills
          second.&quot; the generated one said: &quot;conversion rate
          optimization is about user psychology first and design tweaks
          second.&quot;
        </p>
        <p>
          same skeleton, entirely different claim, and the second one is a claim
          its author can actually defend. that is the target.
        </p>
      </>
    ),
  },
  {
    title: "run the pipeline on a tight window",
    schema:
      "Take the top three of each creator's last twenty posts, from the past thirty days, and run it.",
    body: (
      <>
        <p>
          top 3 of each creator&apos;s last 20 posts, past 30 days. about
          fifteen minutes to run.
        </p>
        <p>
          the recency filter matters on X because the platform is
          conversational. a post that worked during a news cycle worked because
          of the news cycle.
        </p>
      </>
    ),
  },
  {
    title: "run it weekly",
    schema:
      "Re-run the pipeline every week so the content pipeline refills without a blank page.",
    body: (
      <>
        <p>
          this is the setting people skip. once a week, on a schedule. the value
          is not the first run, it is never facing a blank page again, and never
          publishing filler because it was tuesday.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "is this just copying other people's tweets",
    a: "No, and the difference is the part worth understanding. What transfers is the structure: the hook shape, the rhythm, the way a claim is set up and paid off. What does not transfer is the subject. In one real run, a post about entrepreneurship and self-belief became a post about conversion rate optimization and user psychology. Same skeleton, entirely different claim, and one its author can defend.",
  },
  {
    q: "how many competitors should i track on x",
    a: "Around nine works well. Enough that you see a structure repeat across accounts, which is what tells you it is a pattern rather than one person's habit, and few enough that a weekly run stays cheap. All of them should be in or next to your niche and selling to people like your buyers.",
  },
  {
    q: "does every post need an image",
    a: "No, and that is one of the useful things about X. It is the one major platform where a text-only post competes fine, so a mixed feed of infographics, personal photos and plain text reads more human than one where every post is packaged. I aim for a mix rather than a rule.",
  },
  {
    q: "what api keys do i need for the x system",
    a: "Three: Apify to scrape the posts, an image generation key for the infographics, and your Claude plan for the writing. The image one is easy to overlook and most of what the system produces is visual, so without it you get text and empty slots where the graphics should be.",
  },
  {
    q: "can it post to x automatically",
    a: "It can be connected to a publishing tool through an API, and I would not do it on day one. Run it for a few weeks reading everything before it goes out. Automated publishing turns a small config mistake into thirty bad posts under your name, and on X that is the account, not just a bad week.",
  },
  {
    q: "why is x good for b2b specifically",
    a: "Because in some niches the buyers are there and reachable, and a personal account can generate inbound without any ad spend. The example I built this around is an agency owner getting clients from a personal profile. That is why the generation config carries the offer and the buyer: the goal is a feed that sells, not a feed that performs.",
  },
  {
    q: "how often should i run the pipeline",
    a: "Weekly. Trends on X move fast enough that a monthly run is stale, and daily is more content than one person can post well. Weekly refills the pipeline just faster than you can empty it, which is the point at which you stop publishing filler.",
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
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "X and Twitter", path: "/claude-twitter" },
      ]}
      howTo={{
        name: "Build an X content machine with Claude Code",
        description:
          "Track competitors on X, analyse what made their best posts work, and generate posts that reuse the structure for your own niche, with infographics and personal images.",
        totalTime: "PT10M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="what the output looks like">
            <p>
              the dashboard is two columns.{" "}
              <strong>left: a competitor post that went viral. right: your
              post, using the same structure on your own subject.</strong> side
              by side, so you can see exactly what was borrowed and what was
              written.
            </p>
            <p>
              some of yours come with a generated infographic, some with a
              personal photo, some with nothing, because on X a plain text post
              is competitive and a feed where everything is packaged looks like
              a brand account.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="why x is the platform where this pays">
            <p>
              i built this around a specific person: an agency owner selling
              conversion rate optimisation to e-commerce brands, who gets most of
              his clients from his personal profile.
            </p>
            <p>
              that is the case where X is unreasonably good. in certain B2B
              niches the buyers are on the platform, they are reachable without
              ad spend, and a personal account outperforms a company one. so the
              system is not built to make a feed that performs. it is built to
              make a feed that sells, which is why the generation config carries
              your offer and your buyer, not just your topics.
            </p>
          </GuideSection>

          <GuideSection title="the transfer, which is the whole trick">
            <p>
              the honest question about any system like this is whether it is
              just copying. here is the distinction, with a real example from a
              run.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "the original",
                  value: "“entrepreneurship is about self-belief first and business skills second”",
                },
                {
                  label: "what transferred",
                  value: "the structure: X is about A first and B second, where A is the unexpected half",
                },
                {
                  label: "what did not",
                  value: "the subject, the claim, the evidence, the author's credibility",
                },
                {
                  label: "the result",
                  value: "“conversion rate optimization is about user psychology first and design tweaks second”",
                },
              ]}
            />
            <p>
              the second post is a real claim about a real field, made by
              someone who can defend it. it borrowed a sentence shape. that is
              the same thing every songwriter does with a chorus, and it is not
              the same thing as copying a song.
            </p>
            <Callout tone="warn" title="the line, and how to tell you crossed it">
              <p>
                if you read your generated post and it is really about the same
                subject as the original, the generation config is too thin. it
                should be impossible to guess which competitor post yours came
                from without the left-hand column.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="building it">
            <GuideSteps steps={guideSteps} />
            <p>
              three keys go in <Code>.env</Code>: apify to scrape,{" "}
              <Out href="https://kie.ai">an image model</Out> for the
              infographics, and your claude plan for the writing.
            </p>
            <Block>{`APIFY_API_TOKEN=...
KIE_AI_API_KEY=...
ANTHROPIC_API_KEY=...`}</Block>
            <p>
              the image key is the one people skip, and most of what this system
              produces is visual. without it you get text and empty slots.
            </p>
          </GuideSection>

          <GuideSection title="the image mix, and why some posts have none">
            <p>
              three kinds of post come out, and the ratio is deliberate:
            </p>
            <ul>
              <li>
                <strong>infographics</strong>, generated in your style, carrying
                the same idea as the text rather than decorating it.
              </li>
              <li>
                <strong>personal photos</strong>, from your own library, so the
                feed has a face in it.
              </li>
              <li>
                <strong>plain text</strong>, no image at all.
              </li>
            </ul>
            <p>
              X is the one big platform where a text-only post competes fine. a
              feed where every single post is packaged reads as a brand account,
              and brand accounts are exactly what people scroll past. the mix is
              the point.
            </p>
          </GuideSection>

          <GuideSection title="what it costs">
            <KeyFacts
              rows={[
                { label: "claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month` },
                { label: "apify", value: "$5 of free credit a month, which covers a weekly run" },
                { label: "infographics", value: "cents per image" },
                { label: "time per run", value: "about 15 minutes" },
                { label: "cadence i would use", value: "weekly" },
              ]}
            />
          </GuideSection>

          <GuideSection title="what it gets wrong">
            <ul>
              <li>
                <strong>a thin generation config makes it a copier.</strong> the
                single biggest failure, and the one with a cost beyond bad
                content.
              </li>
              <li>
                <strong>it cannot see the thread.</strong> a post that worked
                because of what it was replying to looks like a standalone
                banger and is not.
              </li>
              <li>
                <strong>contrarian claims need backing.</strong> the structure
                that performs on X is often a strong statement, and the
                generated version will make one you may not actually be able to
                defend. read them.
              </li>
              <li>
                <strong>automated publishing too early.</strong> one config
                mistake becomes thirty bad posts under your name. read
                everything for the first few weeks.
              </li>
              <li>
                <strong>tracking accounts that are too big.</strong> a post that
                worked because 400,000 people follow that person is not a
                pattern you can borrow.
              </li>
            </ul>
            <p>
              the same architecture for short video is on{" "}
              <a href="/claude-reels">reels</a> and{" "}
              <a href="/claude-tiktok">tiktok</a>; the multi-format version is on{" "}
              <a href="/claude-content">the content guide</a>. new to claude
              code? <a href="/claude-code-tutorial">start here</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "X/Twitter Content System with Claude Code",
        description:
          "Build an X/Twitter content system with Claude Code. Study what works in your competitors' tweets and generate ready-to-publish posts in your own voice.",
        url: "https://oleg.ae/claude-twitter",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
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
