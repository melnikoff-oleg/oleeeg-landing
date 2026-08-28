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

const VIDEO_ID = "AKtT6NLZGoM";
const VIDEO_TITLE = "Claude Code for Marketing";

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
        <p>
          This is where you&apos;ll run Claude Code and build your marketing
          workflows.
        </p>
      </div>
    ),
  },
  {
    title: "Install Claude Code extension",
    content: (
      <div className="space-y-3">
        <p>
          Open VS Code, go to the Extensions tab, and search for{" "}
          <span className="text-silver font-medium">Claude Code</span>. Install
          the extension and sign in.
        </p>
        <p>
          Claude Code costs $20/mo on the pro plan and gives you access to the
          full agent. It writes code, runs commands, and builds entire projects
          from a prompt.
        </p>
      </div>
    ),
  },
  {
    title: "Get your API keys",
    content: (
      <div className="space-y-4">
        <p>You need two services:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                For scraping social media
              </span>
            </p>
            <p className="mt-1">
              Scrapes social media platforms to find trending content and pull
              competitor data. Sign up at{" "}
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
                For generating visuals
              </span>
            </p>
            <p className="mt-1">
              Generates visual content for ads, reels, and outreach pieces. Sign
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
        <p>Now put both keys where Claude Code can read them:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make an empty folder for your marketing workspace</li>
          <li>Open it in VS Code (File → Open Folder)</li>
          <li>
            Inside it, create a new file named{" "}
            <span className="text-silver font-medium">.env</span>
          </li>
          <li>Paste these two lines into it:</li>
        </ul>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          APIFY_API_KEY=your_apify_key_here
          <br />
          KIE_API_KEY=your_kie_ai_key_here
        </div>
      </div>
    ),
  },
  {
    title: "Generate Instagram reels",
    content: (
      <div className="space-y-3">
        <p>
          Tell Claude Code your brand and style guide. It generates video
          scripts, visual directions, and even rendered video content matching
          your brand identity.
        </p>
        <p>Use the output for ads or organic posts.</p>
      </div>
    ),
  },
  {
    title: "Scrape competitor content",
    content: (
      <div className="space-y-3">
        <p>
          Claude Code uses Apify to find trending reels and posts from your
          competitors. It analyzes engagement patterns, identifies what&apos;s
          working, and generates new concepts based on proven formats.
        </p>
      </div>
    ),
  },
  {
    title: "Create ad campaigns",
    content: (
      <div className="space-y-3">
        <p>
          Describe your product and target audience. Claude Code generates ad
          copy, visual assets, and targeting suggestions. Works for Meta, Google,
          or any platform.
        </p>
      </div>
    ),
  },
  {
    title: "Automate cold outreach",
    content: (
      <div className="space-y-3">
        <p>
          Scrape leads matching your ICP, generate personalized messages with
          value pieces (improved banners, content audits), and manage outreach
          sequences.
        </p>
      </div>
    ),
  },
  {
    title: "Level up: extra tips",
    content: (
      <div className="space-y-3">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="text-silver font-medium">
              Combine use cases
            </span>
            : scrape trends then generate content in one session
          </li>
          <li>
            <span className="text-silver font-medium">
              Use your brand style guide
            </span>{" "}
            for consistent visuals across all outputs
          </li>
          <li>
            <span className="text-silver font-medium">
              Let Claude Code analyze your analytics
            </span>{" "}
            to optimize what&apos;s working
          </li>
          <li>
            <span className="text-silver font-medium">
              Start with one use case
            </span>
            , master it, then add more
          </li>
        </ul>
      </div>
    ),
  },
];


const SECTIONS = [
  "The idea: one workspace that knows your business",
  "The five things I actually ran",
  "The two APIs that do the heavy lifting",
  "Setting the project up so it knows who you are",
  "The prompts, in full",
  "What it costs",
  "Where it falls over",
];

const guideSteps = [
  {
    title: "Make a folder and start Claude Code in it",
    schema:
      "Create an empty folder for the business and run claude inside it. Everything else is built from there.",
    body: (
      <>
        <p>
          Make an empty folder named after the business, open it, and run{" "}
          <Code>claude</Code>. That is the whole project. There is no
          scaffolding to download and nothing to configure yet.
        </p>
      </>
    ),
  },
  {
    title: "Give it the website and let it learn the business",
    schema:
      "Point Claude Code at the company website and ask it to work out what the business does and write that down as project context.",
    body: (
      <>
        <p>
          The first prompt is not a task, it is an induction. Give it the URL
          and ask it to work out what the company sells, to whom, and what the
          marketing is trying to achieve, then write that down.
        </p>
        <Block>{`here is our website: ellingtonproperties.ae

read it and work out what this business is, who it sells to,
and how it talks. write what you learn into CLAUDE.md.

the point of this project is to get more leads through marketing.`}</Block>
        <p>
          Everything after this is better because of it. Without it you re-brief
          the model on every single task, and it shows in the output.
        </p>
      </>
    ),
  },
  {
    title: "Show it what the brand looks like",
    schema:
      "Put four or five screenshots of your existing posts in a reference folder so generated visuals match the brand.",
    body: (
      <>
        <p>
          This is the step that separates output you can post from output you
          delete. Make a <Code>reference/</Code> folder and drop in four or five
          screenshots of your own Instagram grid.
        </p>
        <p>
          Not a brand guideline document. Screenshots. The model is looking at
          the images, and &quot;this is the vibe&quot; communicates faster
          through four pictures than through a page of adjectives about your
          brand.
        </p>
      </>
    ),
  },
  {
    title: "Connect Apify for anything that involves other people's data",
    schema:
      "Add an Apify API key so Claude Code can scrape social posts, Facebook ads and search data through purpose-built scrapers.",
    body: (
      <>
        <p>
          <Out href="https://apify.com">Apify</Out> is a marketplace of scrapers:
          instagram posts, facebook ads, google trends, youtube, linkedin. get an
          API token from settings and put it in <Code>.env</Code>.
        </p>
        <Callout tone="warn" title="The mistake that wastes an afternoon">
          <p>
            <strong>Never ask Claude Code to scrape a site directly.</strong> It
            will try, it will half work, and you will spend an hour debugging
            something that was never going to hold. These platforms fight
            scraping. Apify maintains scrapers that keep working. Use them.
          </p>
        </Callout>
      </>
    ),
  },
  {
    title: "Connect an image and video model",
    schema:
      "Add a generation API key so Claude Code can produce on-brand images and video without leaving the workspace.",
    body: (
      <>
        <p>
          Claude writes the concept and the script. It does not draw. For the
          visuals I use <Out href="https://kie.ai">kie.ai</Out>, which is one key
          for several image and video models, so the workspace can produce the
          finished asset rather than a description of one.
        </p>
        <Block>{`APIFY_API_KEY=...
KIE_AI_API_KEY=...`}</Block>
      </>
    ),
  },
  {
    title: "Ask for the output as a web page, not a chat reply",
    schema:
      "Ask for results as a styled HTML page in the brand's design so a run produces something you can look at and share.",
    body: (
      <>
        <p>
          The last line of every prompt I write is some version of{" "}
          <em>&quot;output all of it as a single HTML page in our
          style&quot;</em>.
        </p>
        <p>
          A wall of terminal text is technically the same information and
          practically useless. A page you can scroll, with the videos embedded
          and the numbers laid out, is something you will actually read and can
          send to someone else.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "Do I need to know how to code to use Claude Code for marketing",
    a: "No. You make a folder, paste two API keys into a text file, and type instructions in plain English. I dictate most of mine by voice. The one genuinely new thing is being willing to open a terminal, and that is a smaller barrier than it feels like from the outside.",
  },
  {
    q: "Why not just use ChatGPT for this",
    a: "Because a chat window cannot scrape your competitors' ads, generate the images, and hand you a finished page. The difference is not the writing quality, it is that Claude Code has your files and can call other services, so a task ends with an artifact on disk rather than text you then have to go and act on.",
  },
  {
    q: "How much does this cost to run",
    a: "A Claude plan at $20 a month, plus what you spend on scraping and image generation. All five use cases in the video cost about $3 of API credit between them. I spend a few hundred a month on Apify, but that is running client work daily, not trying this out.",
  },
  {
    q: "Can Claude Code scrape Instagram or facebook ads directly",
    a: "No, and trying is the most common way to waste an afternoon. Those platforms actively block scraping, so a direct attempt half works and then breaks. Use Apify, which maintains purpose-built scrapers for Instagram, Facebook Ads Library, Google Trends and YouTube, and let Claude Code call them.",
  },
  {
    q: "How do I make the output look like my brand",
    a: "Screenshots, not a brand document. Put four or five screenshots of your existing posts in a reference folder in the project. The model looks at them and matches the palette, the type and the general feel far more reliably than it follows a written description of your brand.",
  },
  {
    q: "What is the highest value marketing use case to start with",
    a: "Competitor ad analysis. Facebook's Ad Library is public and shows how long each ad has been running, which is the closest thing to free conversion data anyone will ever give you. An ad running for four years is working, and knowing that costs you one prompt.",
  },
  {
    q: "Can I give Claude Code instructions by voice",
    a: "Yes, and for long prompts it is much faster. I use a dictation app to talk the whole instruction out, then paste it in. A marketing brief with all the context in it is a paragraph or two, and nobody types those well.",
  },
];

export default function ClaudeMarketingPage() {
  return (
    <ResourcePageShell
      slug="claude-marketing"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="Claude Code for marketing (SMM, ads, outreach)"
      subhead="Five real marketing use cases with Claude Code: Instagram reels, competitor analysis, ad campaigns, cold outreach, and content creation. One walkthrough, all the systems Oleg actually uses."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "noEnvFile", "costs", "costsScraping", "creditBalance"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Marketing", path: "/claude-marketing" },
      ]}
      howTo={{
        name: "Set up Claude Code as a marketing workspace",
        description:
          "Build one Claude Code project that knows your business, connect it to a scraper and an image model, and run competitor research, ad analysis, content and outreach out of it.",
        totalTime: "PT10M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="The idea: one workspace that knows your business">
            <Answer>
              One folder that holds who you are, who you sell to and what you look like, so every marketing task starts from your business instead of from nothing.
            </Answer>
            <p>
              The mistake I see people make with AI and marketing is treating
              every task as a fresh conversation. You explain your company
              again, paste your brand colours again, describe your audience
              again, and you get a competent generic answer again.
            </p>
            <p>
              This is the opposite. You build <strong>one folder</strong> that
              knows what your business is, what it looks like and who it sells
              to, and every task after that starts from there. The setup is ten
              minutes and it is the whole difference.
            </p>
            <p>
              The example I used is a real estate company in dubai, but nothing
              here is specific to property. Swap the website and the reference
              screenshots and the same five things run.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="The five things I actually ran">
            <p>
              One prompt each. The whole set cost about three dollars of API
              credit.
            </p>
            <ol className="guide-list">
              <li>
                <strong>An on-brand Instagram reel, generated end to
                end.</strong> Not a script, the finished video, in the
                company&apos;s visual style. Which means you can produce as many
                as you want, for the feed or for ads.
              </li>
              <li>
                <strong>Competitor reels, scraped and turned into
                concepts.</strong> Ten trending reels in the niche, about seven
                million views between them, analysed for what they were doing,
                then new scripts written for us. The deeper version of this is{" "}
                <a href="/claude-reels">The reels system</a>.
              </li>
              <li>
                <strong>A trending podcast, turned into five posts.</strong> It
                found a two-hour real estate podcast with over 100,000 views,
                pulled the ideas out, and wrote five posts with visuals, ready
                for LinkedIn or Instagram. The prompt was three sentences.
              </li>
              <li>
                <strong>100 outreach leads with personalised
                openers.</strong> Name, niche, LinkedIn URL and a first message
                written for that specific person. The serious version of this is{" "}
                <a href="/claude-b2b-outreach">The b2b outreach system</a>.
              </li>
              <li>
                <strong>Competitor ads, analysed.</strong> The one I would start
                with. More on that below.
              </li>
            </ol>
            <Callout title="Why the ads one is the best first task">
              <p>
                Facebook&apos;s ad library is public, and it shows{" "}
                <strong>how long each ad has been running</strong>. An ad that
                has been live for four years is an ad that is making money.
                Nobody publishes their conversion rates, but everybody publishes
                this, and it is the same information wearing a disguise. One
                prompt gets you every competitor&apos;s longest-running ads,
                what they have in common, and new concepts built on the pattern.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="The two APIs that do the heavy lifting">
            <Figure
              src="/guide/marketing-apify.webp"
              alt="The Apify landing page, describing ready-made scrapers for the web"
              videoId={VIDEO_ID}
              at={260}
              caption="One key here unlocks Instagram, Facebook ads, Google Trends, YouTube and LinkedIn in the same workspace."
            />
            <KeyFacts
              rows={[
                {
                  label: "Apify",
                  value:
                    "Everything that involves reading other people's data: Instagram, facebook ads, Google trends, YouTube, LinkedIn. Never try to scrape these yourself.",
                },
                {
                  label: "An image and video model",
                  value:
                    "I use kie.ai, one key for several generation models, so the workspace can output the finished asset rather than a description of it.",
                },
                {
                  label: "Claude itself",
                  value: `Your ${usd(PLANS.pro.monthly)} plan. The thinking, the writing and the code are all included.`,
                },
              ]}
            />
            <p>
              That is the entire stack. Two keys in a <Code>.env</Code> file. The
              reason it is so small is that Claude Code writes whatever glue is
              needed between them, per task, rather than you assembling a
              pipeline in advance.
            </p>
          </GuideSection>

          <GuideSection title="Setting the project up so it knows who you are">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="The prompts, in full">
            <p>
              These are close to what I actually said, dictated rather than
              typed. They are long, and that is the point: the context is the
              work.
            </p>
            <p>
              <strong>Competitor ad analysis:</strong>
            </p>
            <Block>{`do a competitor analysis on facebook ads.

scrape the top ads from real estate brokers in dubai.
focus on legitimate companies, and on ads that have been
running for a long time, because that is the signal.

look at what the hooks have in common.
then generate five new creatives for us.

output all of it as one html page, in our style.`}</Block>
            <p>
              <strong>Podcast to posts:</strong>
            </p>
            <Block>{`find a recent, well performing podcast episode about
the dubai real estate market.

pull out the five most interesting ideas in it,
and write a social post for each one, with a visual.

output as an html page in our style.`}</Block>
            <p>
              The shape is always the same: <strong>A source, a judgement, an
              output format.</strong> Where to look, what counts as good, and
              what you want back.
            </p>
          </GuideSection>

          <GuideSection title="What it costs">
            <KeyFacts
              rows={[
                { label: "Claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month` },
                { label: "All five tasks above", value: "About $3 of API credit, in total" },
                { label: "Apify", value: "$5 of free credit a month, then pay as you go" },
                { label: "Image and video generation", value: "Pay per generation, cents per image" },
                { label: "What i spend", value: "A few hundred a month on Apify, but that is daily client work, not trying this out" },
              ]}
              caption="The cheap part is the thinking. The cost is scraping and generating pixels."
            />
          </GuideSection>

          <GuideSection title="Where it falls over">
            <ul>
              <li>
                <strong>Direct scraping.</strong> Covered above and worth
                repeating, because it is the single most common way to lose an
                afternoon.
              </li>
              <li>
                <strong>A project with no context.</strong> Skip the website and
                the screenshots and everything it makes is generic. It will
                still be fluent, which makes it worse, because fluent generic is
                harder to notice.
              </li>
              <li>
                <strong>Asking for five things in one prompt.</strong> One task
                per run. The results are better and you can see which part went
                wrong.
              </li>
              <li>
                <strong>Trusting the first ad analysis.</strong> Ad longevity is
                a strong signal, not proof. A big company can run a bad ad for
                years out of inertia.
              </li>
              <li>
                <strong>Publishing without reading.</strong> Everything here is a
                first draft with good bones. Your name goes on it.
              </li>
            </ul>
            <p>
              If you have not set Claude Code up yet, do that first on{" "}
              <a href="/claude-code-tutorial">The setup guide</a>. What it all
              costs in total is on{" "}
              <a href="/claude-code-pricing">The pricing page</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Code for Marketing: AI Marketing Automation Guide",
        description: "Five real marketing use cases with Claude Code: Instagram Reels, competitor analysis, ad campaigns, cold outreach, and content automation.",
        url: "https://www.oleg.ae/claude-marketing",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
    />
  );
}
