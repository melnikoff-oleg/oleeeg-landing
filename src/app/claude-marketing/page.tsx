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
          claude code costs $20/mo on the pro plan and gives you access to the
          full agent. it writes code, runs commands, and builds entire projects
          from a prompt.
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
        <p>now put both keys where claude code can read them:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>make an empty folder for your marketing workspace</li>
          <li>open it in VS Code (File → Open Folder)</li>
          <li>
            inside it, create a new file named{" "}
            <span className="text-silver font-medium">.env</span>
          </li>
          <li>paste these two lines into it:</li>
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


const SECTIONS = [
  "the idea: one workspace that knows your business",
  "the five things i actually ran",
  "the two apis that do the heavy lifting",
  "setting the project up so it knows who you are",
  "the prompts, in full",
  "what it costs",
  "where it falls over",
];

const guideSteps = [
  {
    title: "make a folder and start claude code in it",
    schema:
      "Create an empty folder for the business and run claude inside it. Everything else is built from there.",
    body: (
      <>
        <p>
          make an empty folder named after the business, open it, and run{" "}
          <Code>claude</Code>. that is the whole project. there is no
          scaffolding to download and nothing to configure yet.
        </p>
      </>
    ),
  },
  {
    title: "give it the website and let it learn the business",
    schema:
      "Point Claude Code at the company website and ask it to work out what the business does and write that down as project context.",
    body: (
      <>
        <p>
          the first prompt is not a task, it is an induction. give it the url
          and ask it to work out what the company sells, to whom, and what the
          marketing is trying to achieve, then write that down.
        </p>
        <Block>{`here is our website: ellingtonproperties.ae

read it and work out what this business is, who it sells to,
and how it talks. write what you learn into CLAUDE.md.

the point of this project is to get more leads through marketing.`}</Block>
        <p>
          everything after this is better because of it. without it you re-brief
          the model on every single task, and it shows in the output.
        </p>
      </>
    ),
  },
  {
    title: "show it what the brand looks like",
    schema:
      "Put four or five screenshots of your existing posts in a reference folder so generated visuals match the brand.",
    body: (
      <>
        <p>
          this is the step that separates output you can post from output you
          delete. make a <Code>reference/</Code> folder and drop in four or five
          screenshots of your own instagram grid.
        </p>
        <p>
          not a brand guideline document. screenshots. the model is looking at
          the images, and &quot;this is the vibe&quot; communicates faster
          through four pictures than through a page of adjectives about your
          brand.
        </p>
      </>
    ),
  },
  {
    title: "connect apify for anything that involves other people's data",
    schema:
      "Add an Apify API key so Claude Code can scrape social posts, Facebook ads and search data through purpose-built scrapers.",
    body: (
      <>
        <p>
          <Out href="https://apify.com">apify</Out> is a marketplace of scrapers:
          instagram posts, facebook ads, google trends, youtube, linkedin. get an
          api token from settings and put it in <Code>.env</Code>.
        </p>
        <Callout tone="warn" title="the mistake that wastes an afternoon">
          <p>
            <strong>never ask claude code to scrape a site directly.</strong> it
            will try, it will half work, and you will spend an hour debugging
            something that was never going to hold. these platforms fight
            scraping. apify maintains scrapers that keep working. use them.
          </p>
        </Callout>
      </>
    ),
  },
  {
    title: "connect an image and video model",
    schema:
      "Add a generation API key so Claude Code can produce on-brand images and video without leaving the workspace.",
    body: (
      <>
        <p>
          claude writes the concept and the script. it does not draw. for the
          visuals i use <Out href="https://kie.ai">kie.ai</Out>, which is one key
          for several image and video models, so the workspace can produce the
          finished asset rather than a description of one.
        </p>
        <Block>{`APIFY_API_KEY=...
KIE_AI_API_KEY=...`}</Block>
      </>
    ),
  },
  {
    title: "ask for the output as a web page, not a chat reply",
    schema:
      "Ask for results as a styled HTML page in the brand's design so a run produces something you can look at and share.",
    body: (
      <>
        <p>
          the last line of every prompt i write is some version of{" "}
          <em>&quot;output all of it as a single html page in our
          style&quot;</em>.
        </p>
        <p>
          a wall of terminal text is technically the same information and
          practically useless. a page you can scroll, with the videos embedded
          and the numbers laid out, is something you will actually read and can
          send to someone else.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "do i need to know how to code to use claude code for marketing",
    a: "No. You make a folder, paste two API keys into a text file, and type instructions in plain English. I dictate most of mine by voice. The one genuinely new thing is being willing to open a terminal, and that is a smaller barrier than it feels like from the outside.",
  },
  {
    q: "why not just use chatgpt for this",
    a: "Because a chat window cannot scrape your competitors' ads, generate the images, and hand you a finished page. The difference is not the writing quality, it is that Claude Code has your files and can call other services, so a task ends with an artifact on disk rather than text you then have to go and act on.",
  },
  {
    q: "how much does this cost to run",
    a: "A Claude plan at $20 a month, plus what you spend on scraping and image generation. All five use cases in the video cost about $3 of API credit between them. I spend a few hundred a month on Apify, but that is running client work daily, not trying this out.",
  },
  {
    q: "can claude code scrape instagram or facebook ads directly",
    a: "No, and trying is the most common way to waste an afternoon. Those platforms actively block scraping, so a direct attempt half works and then breaks. Use Apify, which maintains purpose-built scrapers for Instagram, Facebook Ads Library, Google Trends and YouTube, and let Claude Code call them.",
  },
  {
    q: "how do i make the output look like my brand",
    a: "Screenshots, not a brand document. Put four or five screenshots of your existing posts in a reference folder in the project. The model looks at them and matches the palette, the type and the general feel far more reliably than it follows a written description of your brand.",
  },
  {
    q: "what is the highest value marketing use case to start with",
    a: "Competitor ad analysis. Facebook's Ad Library is public and shows how long each ad has been running, which is the closest thing to free conversion data anyone will ever give you. An ad running for four years is working, and knowing that costs you one prompt.",
  },
  {
    q: "can i give claude code instructions by voice",
    a: "Yes, and for long prompts it is much faster. I use a dictation app to talk the whole instruction out, then paste it in. A marketing brief with all the context in it is a paragraph or two, and nobody types those well.",
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
          <GuideSection title="the idea: one workspace that knows your business">
            <p>
              the mistake i see people make with AI and marketing is treating
              every task as a fresh conversation. you explain your company
              again, paste your brand colours again, describe your audience
              again, and you get a competent generic answer again.
            </p>
            <p>
              this is the opposite. you build <strong>one folder</strong> that
              knows what your business is, what it looks like and who it sells
              to, and every task after that starts from there. the setup is ten
              minutes and it is the whole difference.
            </p>
            <p>
              the example i used is a real estate company in dubai, but nothing
              here is specific to property. swap the website and the reference
              screenshots and the same five things run.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="the five things i actually ran">
            <p>
              one prompt each. the whole set cost about three dollars of api
              credit.
            </p>
            <ol className="guide-list">
              <li>
                <strong>an on-brand instagram reel, generated end to
                end.</strong> not a script, the finished video, in the
                company&apos;s visual style. which means you can produce as many
                as you want, for the feed or for ads.
              </li>
              <li>
                <strong>competitor reels, scraped and turned into
                concepts.</strong> ten trending reels in the niche, about seven
                million views between them, analysed for what they were doing,
                then new scripts written for us. the deeper version of this is{" "}
                <a href="/claude-reels">the reels system</a>.
              </li>
              <li>
                <strong>a trending podcast, turned into five posts.</strong> it
                found a two-hour real estate podcast with over 100,000 views,
                pulled the ideas out, and wrote five posts with visuals, ready
                for linkedin or instagram. the prompt was three sentences.
              </li>
              <li>
                <strong>100 outreach leads with personalised
                openers.</strong> name, niche, linkedin url and a first message
                written for that specific person. the serious version of this is{" "}
                <a href="/claude-b2b-outreach">the b2b outreach system</a>.
              </li>
              <li>
                <strong>competitor ads, analysed.</strong> the one i would start
                with. more on that below.
              </li>
            </ol>
            <Callout title="why the ads one is the best first task">
              <p>
                facebook&apos;s ad library is public, and it shows{" "}
                <strong>how long each ad has been running</strong>. an ad that
                has been live for four years is an ad that is making money.
                nobody publishes their conversion rates, but everybody publishes
                this, and it is the same information wearing a disguise. one
                prompt gets you every competitor&apos;s longest-running ads,
                what they have in common, and new concepts built on the pattern.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="the two apis that do the heavy lifting">
            <KeyFacts
              rows={[
                {
                  label: "apify",
                  value:
                    "everything that involves reading other people's data: instagram, facebook ads, google trends, youtube, linkedin. never try to scrape these yourself.",
                },
                {
                  label: "an image and video model",
                  value:
                    "i use kie.ai, one key for several generation models, so the workspace can output the finished asset rather than a description of it.",
                },
                {
                  label: "claude itself",
                  value: `your ${usd(PLANS.pro.monthly)} plan. the thinking, the writing and the code are all included.`,
                },
              ]}
            />
            <p>
              that is the entire stack. two keys in a <Code>.env</Code> file. the
              reason it is so small is that claude code writes whatever glue is
              needed between them, per task, rather than you assembling a
              pipeline in advance.
            </p>
          </GuideSection>

          <GuideSection title="setting the project up so it knows who you are">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="the prompts, in full">
            <p>
              these are close to what i actually said, dictated rather than
              typed. they are long, and that is the point: the context is the
              work.
            </p>
            <p>
              <strong>competitor ad analysis:</strong>
            </p>
            <Block>{`do a competitor analysis on facebook ads.

scrape the top ads from real estate brokers in dubai.
focus on legitimate companies, and on ads that have been
running for a long time, because that is the signal.

look at what the hooks have in common.
then generate five new creatives for us.

output all of it as one html page, in our style.`}</Block>
            <p>
              <strong>podcast to posts:</strong>
            </p>
            <Block>{`find a recent, well performing podcast episode about
the dubai real estate market.

pull out the five most interesting ideas in it,
and write a social post for each one, with a visual.

output as an html page in our style.`}</Block>
            <p>
              the shape is always the same: <strong>a source, a judgement, an
              output format.</strong> where to look, what counts as good, and
              what you want back.
            </p>
          </GuideSection>

          <GuideSection title="what it costs">
            <KeyFacts
              rows={[
                { label: "claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month` },
                { label: "all five tasks above", value: "about $3 of api credit, in total" },
                { label: "apify", value: "$5 of free credit a month, then pay as you go" },
                { label: "image and video generation", value: "pay per generation, cents per image" },
                { label: "what i spend", value: "a few hundred a month on apify, but that is daily client work, not trying this out" },
              ]}
              caption="the cheap part is the thinking. the cost is scraping and generating pixels."
            />
          </GuideSection>

          <GuideSection title="where it falls over">
            <ul>
              <li>
                <strong>direct scraping.</strong> covered above and worth
                repeating, because it is the single most common way to lose an
                afternoon.
              </li>
              <li>
                <strong>a project with no context.</strong> skip the website and
                the screenshots and everything it makes is generic. it will
                still be fluent, which makes it worse, because fluent generic is
                harder to notice.
              </li>
              <li>
                <strong>asking for five things in one prompt.</strong> one task
                per run. the results are better and you can see which part went
                wrong.
              </li>
              <li>
                <strong>trusting the first ad analysis.</strong> ad longevity is
                a strong signal, not proof. a big company can run a bad ad for
                years out of inertia.
              </li>
              <li>
                <strong>publishing without reading.</strong> everything here is a
                first draft with good bones. your name goes on it.
              </li>
            </ul>
            <p>
              if you have not set claude code up yet, do that first on{" "}
              <a href="/claude-code-tutorial">the setup guide</a>. what it all
              costs in total is on{" "}
              <a href="/claude-code-pricing">the pricing page</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Code for Marketing: AI Marketing Automation Guide",
        description: "Five real marketing use cases with Claude Code: Instagram Reels, competitor analysis, ad campaigns, cold outreach, and content automation.",
        url: "https://oleg.ae/claude-marketing",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
    />
  );
}
