import type { ReactNode } from "react";
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
          .
        </p>
        <p>This is where you&apos;ll run Claude Code and the Twitter content app.</p>
      </div>
    ),
  },
  {
    title: "Install Claude Code extension",
    content: (
      <div className="space-y-3">
        <p>
          Open VS Code, go to the extensions panel on the left side, and search
          for &quot;Claude Code&quot;. Install the extension and log in.
        </p>
        <p>
          You need a paid Claude plan (pro at $20/mo is enough to start). Once
          installed, you can interact with Claude Code through the chat
          interface in plain english.
        </p>
      </div>
    ),
  },
  {
    title: "Download the source code",
    content: (
      <div className="space-y-3">
        <p>
          The whole thing is public on GitHub, no signup:{" "}
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
          Click the green <K>Code</K> button, then <K>Download ZIP</K>, then
          unzip it. Or if you have git, run this in a terminal:
        </p>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border border-hairline bg-navy-raised p-4 font-mono text-xs text-silver">
          git clone https://github.com/melnikoff-oleg/x-ai.git
        </pre>
        <p>
          Open the folder in VS Code. You&apos;ll see the full project structure
          on the left side with everything ready to configure.
        </p>
      </div>
    ),
  },
  {
    title: "Get your API keys",
    content: (
      <div className="space-y-4">
        <p>You need four services:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                For scraping X/Twitter
              </span>
            </p>
            <p className="mt-1">
              Scrapes tweets from your competitors. Sign up at{" "}
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
                For analyzing competitor visuals
              </span>
            </p>
            <p className="mt-1">
              Analyzes infographics and images from competitor posts. Sign up at{" "}
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
                For generating content
              </span>
            </p>
            <p className="mt-1">
              Powers the content generation engine. Sign up at{" "}
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
                For the infographic images
              </span>
            </p>
            <p className="mt-1">
              Draws the branded infographic that goes out with the post, which is
              most of what this system posts. Get a key at{" "}
              <a
                href="https://kie.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                kie.ai
              </a>
              . Miss this one and the text posts still work, but every image
              fails.
            </p>
          </div>
        </div>
        <p>
          Create a file called <K>.env</K> in the project root (the folder with{" "}
          <K>CLAUDE.md</K> in it, not inside <K>app</K>) and paste all four keys.
          The repo ships a <K>.env.example</K> you can copy. No quotes, no spaces
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
          The name has to be exactly <K>APIFY_API_TOKEN</K>. It is the one people
          get wrong, and the scrape just fails with nothing useful on screen.
        </p>
      </div>
    ),
  },
  {
    title: "Run the app",
    content: (
      <div className="space-y-3">
        <p>Open terminal in VS Code and run:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          Npm run dev
        </div>
        <p>
          Open{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            localhost:3000
          </code>{" "}
          in your browser. You&apos;ll see the full dashboard where you can add
          competitors, configure your brand, and run the content pipeline.
        </p>
      </div>
    ),
  },
  {
    title: "Add your competitors",
    content: (
      <div className="space-y-3">
        <p>
          Go to the creators tab in the dashboard. Find Twitter accounts in your
          niche, people who are posting content related to your offer.
        </p>
        <p>
          Paste their username, select a category, and the system will scrape
          and analyze their profile automatically. Add at least 5-9 creators
          for best results.
        </p>
      </div>
    ),
  },
  {
    title: "Configure your brand",
    content: (
      <div className="space-y-4">
        <p>Go to the configs tab and create a new configuration. Define:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your brand context and ICP (ideal customer profile)</li>
          <li>Content pillars and topics</li>
          <li>
            Analysis instructions: how to break down competitor posts (hooks,
            structure, engagement drivers)
          </li>
          <li>
            Generation instructions: how to turn their ideas into your own
            voice and niche
          </li>
        </ul>
        <p>
          The more specific you are here, the better your generated content will
          be.
        </p>
      </div>
    ),
  },
  {
    title: "Run the pipeline",
    content: (
      <div className="space-y-3">
        <p>
          Go to &quot;run pipeline&quot;, select your config, and hit run. In
          advanced settings, you can control:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>How many posts to scrape per creator (default: 20)</li>
          <li>How many top posts to select (default: top 3)</li>
          <li>Time window (default: past 30 days)</li>
        </ul>
        <p>
          Takes about 15 minutes. You&apos;ll get ready-to-publish posts with a
          mix of infographics (60%), personal image posts (30%), and text-only
          (10%).
        </p>
      </div>
    ),
  },
  {
    title: "Level up: extra tips",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-silver font-medium">Provide more brand context</p>
          <p className="mt-1">
            Tell Claude Code to scrape your website, LinkedIn, and Instagram to
            build a richer brand DNA for the generator.
          </p>
        </div>
        <div>
          <p className="text-silver font-medium">Add calls to action</p>
          <p className="mt-1">
            Configure CTAs for some posts (e.g. &quot;book a 30-min
            consultation&quot;) to turn content into lead generation.
          </p>
        </div>
        <div>
          <p className="text-silver font-medium">Analyze competitor comments</p>
          <p className="mt-1">
            Find gaps in what competitors cover by analyzing their comment
            sections, then fill those gaps in your content.
          </p>
        </div>
        <div>
          <p className="text-silver font-medium">
            Feed your own performance data
          </p>
          <p className="mt-1">
            Once you have 30+ posts, tell Claude Code to analyze your
            performance and optimize future content toward what&apos;s working.
          </p>
        </div>
      </div>
    ),
  },
];


const SECTIONS = [
  "What the output looks like",
  "Why X is the platform where this pays",
  "The transfer, which is the whole trick",
  "Building it",
  "The image mix, and why some posts have none",
  "What it costs",
  "What it gets wrong",
];

const guideSteps = [
  {
    title: "Pick creators by niche, not by size",
    schema:
      "Add X accounts in your niche by username. The app records followers and post counts so you can judge each one.",
    body: (
      <>
        <p>
          I track nine, all in and around one niche. Paste a username, tag the
          category, and it scrapes the profile and records followers and post
          count.
        </p>
        <p>
          Pick people selling something like what you sell to people like your
          buyers. A huge general account teaches you what works for huge general
          accounts, which is not a lesson you can use.
        </p>
      </>
    ),
  },
  {
    title: "Write the analysis config",
    schema:
      "Write the instruction that extracts the hook, the post structure and the engagement driver from each post.",
    body: (
      <>
        <p>Three things from every post:</p>
        <ul>
          <li>
            <strong>The hook.</strong> On X this is the first line, because the
            first line is all anyone sees before deciding.
          </li>
          <li>
            <strong>The structure.</strong> One-liner, list, story, contrarian
            claim then proof.
          </li>
          <li>
            <strong>The engagement driver.</strong> What specifically made this
            post beat that account&apos;s own average.
          </li>
        </ul>
        <p>
          That last one is the important one, and it needs the account&apos;s
          baseline to mean anything.
        </p>
      </>
    ),
  },
  {
    title: "Write the generation config, which is the actual work",
    schema:
      "Write the instruction that converts a competitor's post into one for your own audience, keeping the structure and changing the subject.",
    body: (
      <>
        <p>
          This is the config that decides whether the system produces content or
          plagiarism. It has to describe your brand, your buyer, your content
          pillars, and specifically <strong>that the structure transfers and
          the subject does not</strong>.
        </p>
        <p>
          A worked example, from a real run. The original post said:
          &quot;entrepreneurship is about self-belief first and business skills
          second.&quot; the generated one said: &quot;conversion rate
          optimization is about user psychology first and design tweaks
          second.&quot;
        </p>
        <p>
          Same skeleton, entirely different claim, and the second one is a claim
          its author can actually defend. That is the target.
        </p>
      </>
    ),
  },
  {
    title: "Run the pipeline on a tight window",
    schema:
      "Take the top three of each creator's last twenty posts, from the past thirty days, and run it.",
    body: (
      <>
        <p>
          Top 3 of each creator&apos;s last 20 posts, past 30 days. About
          fifteen minutes to run.
        </p>
        <p>
          The recency filter matters on X because the platform is
          conversational. A post that worked during a news cycle worked because
          of the news cycle.
        </p>
      </>
    ),
  },
  {
    title: "Run it weekly",
    schema:
      "Re-run the pipeline every week so the content pipeline refills without a blank page.",
    body: (
      <>
        <p>
          This is the setting people skip. Once a week, on a schedule. The value
          is not the first run, it is never facing a blank page again, and never
          publishing filler because it was tuesday.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "Is this just copying other people's tweets",
    a: "No, and the difference is the part worth understanding. What transfers is the structure: the hook shape, the rhythm, the way a claim is set up and paid off. What does not transfer is the subject. In one real run, a post about entrepreneurship and self-belief became a post about conversion rate optimization and user psychology. Same skeleton, entirely different claim, and one its author can defend.",
  },
  {
    q: "How many competitors should I track on x",
    a: "Around nine works well. Enough that you see a structure repeat across accounts, which is what tells you it is a pattern rather than one person's habit, and few enough that a weekly run stays cheap. All of them should be in or next to your niche and selling to people like your buyers.",
  },
  {
    q: "Does every post need an image",
    a: "No, and that is one of the useful things about X. It is the one major platform where a text-only post competes fine, so a mixed feed of infographics, personal photos and plain text reads more human than one where every post is packaged. I aim for a mix rather than a rule.",
  },
  {
    q: "What API keys do I need for the x system",
    a: "Three: Apify to scrape the posts, an image generation key for the infographics, and your Claude plan for the writing. The image one is easy to overlook and most of what the system produces is visual, so without it you get text and empty slots where the graphics should be.",
  },
  {
    q: "Can it post to x automatically",
    a: "It can be connected to a publishing tool through an API, and I would not do it on day one. Run it for a few weeks reading everything before it goes out. Automated publishing turns a small config mistake into thirty bad posts under your name, and on X that is the account, not just a bad week.",
  },
  {
    q: "Why is x good for B2B specifically",
    a: "Because in some niches the buyers are there and reachable, and a personal account can generate inbound without any ad spend. The example I built this around is an agency owner getting clients from a personal profile. That is why the generation config carries the offer and the buyer: the goal is a feed that sells, not a feed that performs.",
  },
  {
    q: "How often should I run the pipeline",
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
      title="Claude Code X/Twitter content system"
      subhead="Study what actually works in your competitors' tweets, then generate ready-to-publish content written in your own voice and for your own niche."
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
          <GuideSection title="What the output looks like">
            <Answer>
              Two columns: the competitor post that worked on the left, your post using the same structure on your own subject on the right, with the infographic already drawn.
            </Answer>
            <Figure
              src="/guide/twitter-creators.webp"
              alt="A source post beside the generated post and its infographic"
              videoId={VIDEO_ID}
              at={200}
              caption="The original on the left, what the system wrote on the right. The subject changed, the mechanism did not."
            />
            <p>
              The dashboard is two columns.{" "}
              <strong>Left: a competitor post that went viral. Right: your
              post, using the same structure on your own subject.</strong> Side
              by side, so you can see exactly what was borrowed and what was
              written.
            </p>
            <p>
              Some of yours come with a generated infographic, some with a
              personal photo, some with nothing, because on X a plain text post
              is competitive and a feed where everything is packaged looks like
              a brand account.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="Why X is the platform where this pays">
            <Figure
              src="/guide/twitter-ab.webp"
              alt="The tracked accounts, with follower counts and engagement"
              videoId={VIDEO_ID}
              at={60}
              caption="The accounts it studies. On X the numbers are public, which is exactly why this works better here."
            />
            <p>
              I built this around a specific person: an agency owner selling
              conversion rate optimisation to e-commerce brands, who gets most of
              his clients from his personal profile.
            </p>
            <p>
              That is the case where X is unreasonably good. In certain B2B
              niches the buyers are on the platform, they are reachable without
              ad spend, and a personal account outperforms a company one. So the
              system is not built to make a feed that performs. It is built to
              make a feed that sells, which is why the generation config carries
              your offer and your buyer, not just your topics.
            </p>
          </GuideSection>

          <GuideSection title="The transfer, which is the whole trick">
            <Figure
              src="/guide/twitter-prompt.webp"
              alt="The analysis prompt, listing content pattern, engagement drivers and copywriting techniques"
              videoId={VIDEO_ID}
              at={300}
              caption="The prompt is the product. It asks for the mechanism behind a post, never the post itself."
            />
            <p>
              The honest question about any system like this is whether it is
              just copying. Here is the distinction, with a real example from a
              run.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "The original",
                  value: "“entrepreneurship is about self-belief first and business skills second”",
                },
                {
                  label: "What transferred",
                  value: "The structure: X is about A first and B second, where A is the unexpected half",
                },
                {
                  label: "What did not",
                  value: "The subject, the claim, the evidence, the author's credibility",
                },
                {
                  label: "The result",
                  value: "“conversion rate optimization is about user psychology first and design tweaks second”",
                },
              ]}
            />
            <p>
              The second post is a real claim about a real field, made by
              someone who can defend it. It borrowed a sentence shape. That is
              the same thing every songwriter does with a chorus, and it is not
              the same thing as copying a song.
            </p>
            <Callout tone="warn" title="The line, and how to tell you crossed it">
              <p>
                If you read your generated post and it is really about the same
                subject as the original, the generation config is too thin. It
                should be impossible to guess which competitor post yours came
                from without the left-hand column.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="Building it">
            <GuideSteps steps={guideSteps} />
            <p>
              Three keys go in <Code>.env</Code>: Apify to scrape,{" "}
              <Out href="https://kie.ai">an image model</Out> for the
              infographics, and your claude plan for the writing.
            </p>
            <Block>{`APIFY_API_TOKEN=...
KIE_AI_API_KEY=...
ANTHROPIC_API_KEY=...`}</Block>
            <p>
              The image key is the one people skip, and most of what this system
              produces is visual. Without it you get text and empty slots.
            </p>
          </GuideSection>

          <GuideSection title="The image mix, and why some posts have none">
            <p>
              Three kinds of post come out, and the ratio is deliberate:
            </p>
            <ul>
              <li>
                <strong>Infographics</strong>, generated in your style, carrying
                the same idea as the text rather than decorating it.
              </li>
              <li>
                <strong>Personal photos</strong>, from your own library, so the
                feed has a face in it.
              </li>
              <li>
                <strong>Plain text</strong>, no image at all.
              </li>
            </ul>
            <p>
              X is the one big platform where a text-only post competes fine. A
              feed where every single post is packaged reads as a brand account,
              and brand accounts are exactly what people scroll past. The mix is
              the point.
            </p>
          </GuideSection>

          <GuideSection title="What it costs">
            <KeyFacts
              rows={[
                { label: "Claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month` },
                { label: "Apify", value: "$5 of free credit a month, which covers a weekly run" },
                { label: "Infographics", value: "Cents per image" },
                { label: "Time per run", value: "About 15 minutes" },
                { label: "Cadence i would use", value: "weekly" },
              ]}
            />
          </GuideSection>

          <GuideSection title="What it gets wrong">
            <ul>
              <li>
                <strong>A thin generation config makes it a copier.</strong> The
                single biggest failure, and the one with a cost beyond bad
                content.
              </li>
              <li>
                <strong>It cannot see the thread.</strong> A post that worked
                because of what it was replying to looks like a standalone
                banger and is not.
              </li>
              <li>
                <strong>Contrarian claims need backing.</strong> The structure
                that performs on X is often a strong statement, and the
                generated version will make one you may not actually be able to
                defend. Read them.
              </li>
              <li>
                <strong>Automated publishing too early.</strong> One config
                mistake becomes thirty bad posts under your name. Read
                everything for the first few weeks.
              </li>
              <li>
                <strong>Tracking accounts that are too big.</strong> A post that
                worked because 400,000 people follow that person is not a
                pattern you can borrow.
              </li>
            </ul>
            <p>
              The same architecture for short video is on{" "}
              <a href="/claude-reels">Reels</a> and{" "}
              <a href="/claude-tiktok">TikTok</a>; the multi-format version is on{" "}
              <a href="/claude-content">The content guide</a>. New to Claude Code? <a href="/claude-code-tutorial">Start here</a>.
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
          Building this for X? <BoldaneLink /> does the same job on LinkedIn,
          done for you: you talk for one hour a week, and a real team turns
          what you said into five posts your market trusts.
        </>
      }
    />
  );
}
