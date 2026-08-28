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
  Stats,
} from "@/components/guide";
import { PLANS, usd } from "@/lib/pricing";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";

const VIDEO_ID = "Jjz4YxtlwHQ";
const VIDEO_TITLE = "Claude Code for B2B Outreach";

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
          This is where you&apos;ll run Claude Code and build your outreach
          system.
        </p>
      </div>
    ),
  },
  {
    title: "Install Claude Code extension",
    content: (
      <div className="space-y-3">
        <p>
          Open VS Code, go to the Extensions tab on the left sidebar, and search
          for &quot;Claude Code&quot;. Install the extension by Anthropic.
        </p>
        <p>
          Claude Code comes with a paid Claude plan, pro is $20/mo. It gives
          you access to Claude directly inside your editor to build and modify
          code with natural language.
        </p>
      </div>
    ),
  },
  {
    title: "Download the source code",
    content: (
      <div className="space-y-3">
        <p>
          The full source code for this outreach system is available for free
          inside the Skool community.
        </p>
        <p>
          Join here:{" "}
          <a
            href="https://www.skool.com/ai-automation-7100/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            skool.com/ai-automation-7100
          </a>
          . It&apos;s free. Once you&apos;ve joined, open the Classroom
          section and download the source code, then open it in VS Code.
        </p>
      </div>
    ),
  },
  {
    title: "Get your API keys",
    content: (
      <div className="space-y-4">
        <p>You need three services:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                For scraping LinkedIn leads
              </span>
            </p>
            <p className="mt-1">
              Scrapes LinkedIn profiles to find and pull information about
              prospects. Sign up at{" "}
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
                For generating custom visuals/banners
              </span>
            </p>
            <p className="mt-1">
              Generates personalized visuals to send as value pieces to
              prospects. Sign up at{" "}
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
          <div>
            <p className="text-silver font-medium">
              Anthropic API{" "}
              <span className="font-normal text-silver-muted">
                For crafting messages
              </span>
            </p>
            <p className="mt-1">
              Powers the personalized message generation. Sign up at{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                console.anthropic.com
              </a>{" "}
              ($5 minimum to get started).
            </p>
          </div>
        </div>
        <p>Add all three keys to your .env file:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          APIFY_API_KEY=your_apify_key_here
          <br />
          KIE_API_KEY=your_kie_ai_key_here
          <br />
          ANTHROPIC_API_KEY=your_anthropic_key_here
        </div>
      </div>
    ),
  },
  {
    title: "Run the app",
    content: (
      <div className="space-y-3">
        <p>Open the terminal in VS Code and run:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          Npm run dev
        </div>
        <p>
          The app will start at{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            localhost:3000
          </code>
          . Open it in your browser to access the dashboard.
        </p>
      </div>
    ),
  },
  {
    title: "Find and import leads",
    content: (
      <div className="space-y-3">
        <p>
          Use Apify to scrape LinkedIn profiles matching your ideal customer
          profile. Filter by industry, role, and company size to find the right
          prospects.
        </p>
        <p>
          Import the scraped leads into the dashboard. The system will organize
          them and prepare them for scoring.
        </p>
      </div>
    ),
  },
  {
    title: "Score your leads",
    content: (
      <div className="space-y-3">
        <p>
          The system scores each lead from 1 to 10 based on custom criteria you
          define: engagement level, relevance to your offer, company size, and
          more.
        </p>
        <p>
          Focus your outreach on the highest-scored prospects first. This is how
          you avoid wasting time on leads that won&apos;t convert.
        </p>
      </div>
    ),
  },
  {
    title: "Generate personalized messages",
    content: (
      <div className="space-y-3">
        <p>
          For each prospect, the system analyzes their LinkedIn profile, creates
          a value piece (like an improved LinkedIn banner or content audit), and
          crafts a personalized message.
        </p>
        <p>
          Not generic templates. Each message references specific details about
          the prospect. That&apos;s why reply rates hit 35%.
        </p>
      </div>
    ),
  },
  {
    title: "Level up: extra tips",
    content: (
      <div className="space-y-3">
        <p>Four tips to maximize your results:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="text-silver">Always lead with value</span>: send an
            improved banner or content sample, not just text
          </li>
          <li>
            <span className="text-silver">Personalize the visual</span>: use
            their branding, colors, and style so it feels made for them
          </li>
          <li>
            <span className="text-silver">Follow up with a second value piece</span>
            : if no reply, don&apos;t just bump the thread. Send something new
          </li>
          <li>
            <span className="text-silver">Track reply rates and iterate</span>:
            measure what&apos;s working and refine your messaging over time
          </li>
        </ul>
      </div>
    ),
  },
];


const SECTIONS = [
  "Why this gets replies when normal outreach does not",
  "The four stages",
  "Finding the leads",
  "Scoring them, which is where the leverage is",
  "The free value, and how it gets made",
  "What it costs",
  "The honest part about automating LinkedIn",
];

const guideSteps = [
  {
    title: "Build the search in sales navigator",
    schema:
      "Use LinkedIn Sales Navigator to filter for your ideal customer by location, title and any other criteria, and save the search.",
    body: (
      <>
        <p>
          Filter by location, job title, company size, whatever defines your
          buyer. Save the list. This is the only part of the system that is
          entirely judgement, and getting it wrong makes everything downstream
          irrelevant no matter how good the automation is.
        </p>
      </>
    ),
  },
  {
    title: "Send connection requests with no message attached",
    schema:
      "Send plain connection requests with no note. A bare request is accepted more often than one carrying a pitch.",
    body: (
      <>
        <p>
          This is counterintuitive and it matters. <strong>Send the connection
          request empty.</strong> No note, no pitch.
        </p>
        <p>
          A request carrying a message reads as a sales approach before anyone
          has decided whether they like you, and it gets accepted less often. A
          bare request costs the other person nothing to accept. You are buying
          the right to send a real message later, and that is worth more than
          getting a pitch in early.
        </p>
      </>
    ),
  },
  {
    title: "Export your accepted connections",
    schema:
      "Filter Sales Navigator to first-degree connections, copy the search URL, and run it through an Apify Sales Navigator scraper with your LinkedIn cookies.",
    body: (
      <>
        <p>
          Once people have accepted, filter the same search down to{" "}
          <strong>first degree connections</strong>. These are the people you
          can now actually message.
        </p>
        <p>
          Copy that search URL and give it to a sales navigator scraper on{" "}
          <Out href="https://apify.com">Apify</Out>, along with your linkedin
          cookies (a chrome extension exports them; the scraper&apos;s own page
          links the one it wants). it needs the cookies because it is reading
          your sales navigator, not a public page.
        </p>
        <p>
          Out comes a CSV. Mine was 600 rows: founders, CEOs and business
          owners, each with a headline, an about section, a company and a URL.
          That file goes into the Claude Code project.
        </p>
      </>
    ),
  },
  {
    title: "Define what a good lead looks like, in your own words",
    schema:
      "Write down the factors that make a lead valuable to you, then have Claude Code score every lead one to ten against them.",
    body: (
      <>
        <p>
          Write down what makes a lead worth your attention. Mine is company
          size, whether they are visibly active on LinkedIn, location, and
          apparent buying power. Yours will be different and that is the point.
        </p>
        <p>
          Then have Claude score all of them one to ten against those factors,
          using an Apify LinkedIn profile scraper to read each person&apos;s
          posts, about section and work history rather than guessing from the
          CSV.
        </p>
        <Callout title="Expect to iterate here">
          <p>
            My first scoring pass did not reflect what I actually valued. It
            took a few rounds of reading the scores, disagreeing, and saying why
            I disagreed, before the numbers matched my judgement. That is not a
            failure of the system, it is the system working: you are extracting
            a rule you already had but had never written down.
          </p>
        </Callout>
      </>
    ),
  },
  {
    title: "Get a dashboard instead of a spreadsheet",
    schema:
      "Ask Claude Code to build a local HTML dashboard of the scored leads, searchable and filterable, so the list is usable.",
    body: (
      <>
        <p>
          Ask for an HTML page: every lead, searchable, filterable by score. It
          builds it and runs it locally.
        </p>
        <p>
          This sounds cosmetic. It is not. Filtering to score eight and above,
          and seeing that 143 of 600 were disqualified outright, is what makes
          the next stage affordable. You are about to spend real effort per
          person, so the list has to be short and it has to be right.
        </p>
      </>
    ),
  },
  {
    title: "Generate the free value, one per lead",
    schema:
      "Show Claude examples of good work, then have it generate a personalised free asset for each qualified lead using an image model.",
    body: (
      <>
        <p>
          In my case the gift is an improved LinkedIn profile: a new banner, a
          better profile picture, sharper headline text.
        </p>
        <p>
          The trick is teaching it what good looks like before asking. I give it
          several well-packaged profiles, including my own, and ask it to{" "}
          <strong>read the images and work out what makes them
          work</strong>: what the banner communicates, the visual hierarchy,
          where the social proof sits. Then it applies that to each lead.
        </p>
        <p>
          The images come from an image model (I use kie.ai for this). The
          output lands in the same dashboard, so you see the original profile
          and the improved one side by side before anything is sent.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "Why does this get a 35% reply rate",
    a: "Because the message is not a pitch, it is a gift. Instead of asking for a call, it says your LinkedIn packaging could convert better, here is an improved version, take it for free, and attaches a genuinely good banner and profile picture made for that person. That is very hard to ignore and costs the recipient nothing, so the reply is easy.",
  },
  {
    q: "Should I send a note with the connection request",
    a: "No. Send the request empty. A request carrying a message reads as a sales approach before the person has decided anything about you, and gets accepted less often. A bare request costs them nothing. You are buying the right to send a real message once they have accepted, which is worth more than getting a pitch in first.",
  },
  {
    q: "How do I scrape LinkedIn sales navigator leads",
    a: "Build and save the search in Sales Navigator, filter it to first-degree connections, then copy the search URL into an Apify Sales Navigator scraper along with your LinkedIn cookies, which a Chrome extension exports for you. It returns a CSV with headline, about section, company and profile URL for every result, and that file goes into your Claude Code project.",
  },
  {
    q: "Is this the same as clay",
    a: "It does the same job: enrich a lead list and score it. The difference is that this is a folder you own, so you can change the scoring rules by saying what you want rather than fitting your thinking into someone else's interface, and you pay for the scraping rather than for a platform. The trade is that nobody supports it but you.",
  },
  {
    q: "How automated is this really",
    a: "About 95%, and the last 5% is deliberate. Finding, scoring and drafting are handed over. Deciding who is worth the effort and reading the message before it goes are not. This system does more work per prospect than a human would, not less, which is the whole reason it gets replies.",
  },
  {
    q: "How many leads do I actually end up messaging",
    a: "Far fewer than you scrape, and that is the point. From 600 connections, 143 were disqualified outright and only the ones scoring eight or above were worth a personalised asset. The value of the scoring stage is not the leads it finds, it is the ones it stops you spending an hour on.",
  },
  {
    q: "Will LinkedIn ban me for this",
    a: "Automating LinkedIn is against LinkedIn's user agreement, and using Claude to work around another platform's terms is against Anthropic's usage policy too. There is no published safe daily number and anyone quoting you one is guessing. The lower risk shape, and the one I would recommend, is to automate the research, the scoring and the drafting, which is where all the time goes, and send the messages by hand.",
  },
];

export default function ClaudeB2bOutreachPage() {
  return (
    <ResourcePageShell
      slug="claude-b2b-outreach"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="Claude Code for B2B outreach (35% reply rate)"
      subhead="Build a personalized B2B outreach system with Claude Code. It finds the right leads on LinkedIn, scores them, and writes value-first messages with custom visuals. No generic pitches, just outreach worth replying to."
      repoCta={{
        href: "https://www.skool.com/ai-automation-7100/about",
        label: "Get the source code",
        icon: DOWNLOAD_ICON,
      }}
      steps={steps}
      troubleshooting={["cantFindCode", "linkedinBan", "noEnvFile", "claudeNotFound", "costs", "costsScraping", "creditBalance"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "B2B outreach", path: "/claude-b2b-outreach" },
      ]}
      howTo={{
        name: "Build a value-first B2B outreach system with Claude Code",
        description:
          "Find leads in Sales Navigator, connect without a pitch, score the accepted connections against your own criteria, and generate a personalised free asset for the best ones.",
        totalTime: "PT10M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="Why this gets replies when normal outreach does not">
            <Answer>
              Because every message carries something made specifically for that person before any ask, which costs the recipient nothing to accept.
            </Answer>
            <Stats
              items={[
                { value: "35%", label: "Reply rate on the run in the video" },
                { value: "4", label: "Stages, from finding to sending" },
                { value: "1", label: "Thing made for each prospect before any ask" },
              ]}
            />
            <Figure
              src="/guide/b2b-linkedin.webp"
              alt="Oleg's own LinkedIn profile with its analytics panel"
              videoId={VIDEO_ID}
              at={580}
              caption="The other half of the reply rate, and the half nobody automates: the profile the prospect checks before answering."
            />
            <p>
              Here is the message that started the conversation with a prospect
              I will call bob, and the reason the whole system exists:
            </p>
            <Callout title="What the message actually said">
              <p>
                Your LinkedIn profile packaging is not converting as well as it
                could. Here is an improved version. Take it for free.
              </p>
              <p>
                Attached: a professional banner, a better profile picture and
                sharper headline text, all made for him specifically.
              </p>
            </Callout>
            <p>
              He replied &quot;sure, sounds good, here is my email, send it
              over&quot;. That is a conversation started, from cold, with no
              pitch in it.
            </p>
            <p>
              The reason it works is not that AI wrote it. It is that{" "}
              <strong>it costs the recipient nothing to say yes.</strong> A
              normal cold message asks for fifteen minutes before you have given
              anything. This one hands over something good and asks for nothing.
              At that point replying is the path of least resistance.
            </p>
            <p>
              And the thing that makes it possible at any scale is that the
              asset is generated, so doing it for eighty people costs about what
              doing it for one used to.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="The four stages">
            <Figure
              src="/guide/b2b-run.webp"
              alt="An Apify run listing, showing each actor and how many results it returned"
              videoId={VIDEO_ID}
              at={320}
              caption="A run, stage by stage, with the row count each one returned. This is where you find out a source went quiet."
            />
            <ol className="guide-list">
              <li>
                <strong>Find.</strong> Sales navigator search, then connection
                requests with no message attached.
              </li>
              <li>
                <strong>Extract.</strong> Once they accept, scrape your own
                first-degree connections into a CSV.
              </li>
              <li>
                <strong>Score.</strong> Claude reads each profile and scores it
                one to ten against criteria you wrote, then builds you a
                dashboard.
              </li>
              <li>
                <strong>Give.</strong> For the ones worth it, generate a real
                piece of free value and send it.
              </li>
            </ol>
            <p>
              Stage three is the one that makes the maths work. Everything else
              is mechanics.
            </p>
          </GuideSection>

          <GuideSection title="Finding the leads">
            <Figure
              src="/guide/b2b-actors.webp"
              alt="The Apify store filtered to LinkedIn scrapers"
              videoId={VIDEO_ID}
              at={240}
              caption="The scrapers this stage runs on. Which one you pick decides what fields you get back."
            />
            <GuideSteps steps={guideSteps.slice(0, 3)} />
          </GuideSection>

          <GuideSection title="Scoring them, which is where the leverage is">
            <p>
              Scraping 600 people is easy. The expensive resource is your
              attention, and scoring is what protects it.
            </p>
            <GuideSteps steps={guideSteps.slice(3, 5)} start={4} />
            <p>
              The number that made this click for me: <strong>143 of 600 were
              disqualified outright</strong>, on wrong country, wrong company
              size, or no sign of ever having bought anything like what I sell.
              That is 143 personalised assets not made and 143 conversations not
              started, which is hours back.
            </p>
          </GuideSection>

          <GuideSection title="The free value, and how it gets made">
            <GuideSteps steps={guideSteps.slice(5)} start={6} />
            <p>
              What makes a good gift, generally: it should be{" "}
              <strong>specific to them, obviously effortful, and useful even
              if they never reply</strong>. A profile redesign fits because it
              is visibly custom and they can just use it.
            </p>
            <p>
              A landing page teardown, a rewritten headline, a competitor
              analysis of their market: same shape, same system, different
              output. What does not work is anything that is really a demo of
              your service with their logo on it. People can tell.
            </p>
          </GuideSection>

          <GuideSection title="What it costs">
            <KeyFacts
              rows={[
                { label: "Claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month` },
                { label: "LinkedIn sales navigator", value: "A paid LinkedIn product, and the one real cost here. Billed by LinkedIn, not by this system." },
                { label: "Apify scraping", value: "$5 of free credit a month covers a few hundred profiles" },
                { label: "Image generation", value: "Cents per banner" },
                { label: "The actual constraint", value: "Your attention, which is why the scoring stage exists" },
              ]}
            />
          </GuideSection>

          <GuideSection title="The honest part about automating LinkedIn">
            <p>
              The most upvoted question under my outreach videos is whether this
              gets you banned, so here is a straight answer rather than a
              comfortable one.
            </p>
            <p>
              <strong>Automating LinkedIn is against LinkedIn&apos;s user
              agreement.</strong> And using Claude to work around another
              platform&apos;s terms is against Anthropic&apos;s usage policy
              too. Those are both true regardless of how careful you are.
            </p>
            <p>
              I am not going to give you a safe daily number, because LinkedIn
              does not publish one and every figure you find online is somebody
              guessing. I am also not going to hand out ways to avoid detection.
            </p>
            <p>What I would actually do, and what I recommend:</p>
            <ul>
              <li>
                <strong>Automate the research, the scoring and the
                drafting.</strong> That is where the hours are, and none of it
                touches LinkedIn&apos;s automation rules.
              </li>
              <li>
                <strong>Send by hand.</strong> It is a few minutes a day for a
                list this short, and the list is short precisely because the
                scoring worked.
              </li>
              <li>
                <strong>Keep the volume human.</strong> The entire premise here
                is depth per prospect. If you are sending hundreds a day you
                have rebuilt the thing this was meant to replace.
              </li>
            </ul>
            <p>
              The browser-driving version of this, using{" "}
              <a href="/claude-cowork">Claude Cowork</a>, is on{" "}
              <a href="/claude-cowork-outreach">The cowork outreach page</a>, and
              it carries the same caveat. If you have not set Claude Code up,{" "}
              <a href="/claude-code-tutorial">Start here</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "AI B2B Outreach with Claude Code (35% Reply Rate)",
        description:
          "Build a hyper-personalized AI B2B outreach system with Claude Code. Find leads on LinkedIn, score them, and generate value-driven messages with custom visuals.",
        url: "https://oleg.ae/claude-b2b-outreach",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
      boldaneCta={
        <>
          Cold messages work harder when your profile backs them up. Prospects
          look you up on LinkedIn before they reply. <BoldaneLink /> builds
          that authority for founders: one hour of talking a week, turned into
          a presence your market trusts.
        </>
      }
    />
  );
}
