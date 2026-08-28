import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import { APIFY, PLANS, freeLeadsPerMonth, usd } from "@/lib/pricing";
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

const VIDEO_ID = "QoiFASDh8J8";
const VIDEO_TITLE = "How I Use Claude For Cold Outreach (B2B Sales)";

// The quick checklist. Everything that needs explaining lives in the written
// guide below, not here: this is the "I watched the video, just give me the
// steps" surface.
const steps = [
  {
    title: "Get a paid Claude plan",
    content: (
      <div className="space-y-3">
        <p>
          Cowork is not on the free plan. You need Pro ({usd(PLANS.pro.monthly)}/mo) or Max. One
          closed B2B deal pays for a year of it, so this is the cheapest part of
          the system.
        </p>
      </div>
    ),
  },
  {
    title: "Download Claude Cowork",
    content: (
      <div className="space-y-3">
        <p>
          Get the desktop app at{" "}
          <a
            href="https://claude.com/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            claude.com/download
          </a>
          , pick your operating system, install it, and sign in with the same
          Claude account.
        </p>
      </div>
    ),
  },
  {
    title: "Check the browser (this changed since the video)",
    content: (
      <div className="space-y-3">
        <p>
          Cowork now opens a browser inside its own side panel. Nothing to
          install, and it does not touch your tabs. Sign in to LinkedIn once at
          the start of a session, or import your cookies so it stays signed in.
        </p>
        <p>
          In the video I use the older path, the &quot;Claude for chrome&quot;
          extension driving my own chrome window. That still works. The built-in
          browser is simpler and is what I would set up today.
        </p>
      </div>
    ),
  },
  {
    title: "Make an Apify account and copy your API token",
    content: (
      <div className="space-y-3">
        <p>
          Sign up at{" "}
          <a
            href="https://apify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            apify.com
          </a>
          , open settings, integrations, and copy the API token. Apify is where
          the leads come from.
        </p>
      </div>
    ),
  },
  {
    title: "Connect Apify to cowork",
    content: (
      <div className="space-y-3">
        <p>
          In cowork: settings, connectors, browse connectors, search Apify, open
          the Apify MCP server, install, enable, configure, paste the token,
          save.
        </p>
        <p>
          That is the whole setup. From here cowork can pull leads itself
          instead of you exporting spreadsheets.
        </p>
      </div>
    ),
  },
  {
    title: "Run your first batch",
    content: (
      <div className="space-y-3">
        <p>
          Open a new task and tell it your offer, who you sell to, and where to
          get the leads. Start with ten profiles, read every message it writes,
          then let it send.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "What Claude Cowork actually does on LinkedIn",
  "What it costs to run",
  "Where the leads come from",
  "The full walkthrough",
  "The prompt I use",
  "Why the messages get replies",
  "What it does badly",
];

// Each step carries the one-sentence version that goes into HowTo schema, so
// the markup and the prose live in the same place and cannot drift apart.
const guideSteps = [
  {
    title: "Install cowork and give it a browser",
    schema:
      "Download Claude Cowork from claude.com/download and sign in with a paid Claude plan. It opens a browser in its own side panel, so there is nothing else to install.",
    body: (
      <>
        <p>
          Claude Cowork is Anthropic&apos;s desktop app. It is not a chat window
          that gives you advice, it is Claude with hands on your own computer. It
          takes a screenshot of what is on screen, decides where to click, and
          clicks.
        </p>
        <p>
          Download it from <Out href="https://claude.com/download">claude.com/download</Out>{" "}
          and sign in. You need a paid Claude plan for this, Pro at {usd(PLANS.pro.monthly)} a month
          or Max. The free claude.ai plan does not include cowork, so it will
          install perfectly and then refuse to let you in.
        </p>
        <p>
          It also needs a browser to reach LinkedIn, and this is the one thing
          that has changed since I filmed the video. Cowork now ships with{" "}
          <strong>A browser built into its own side panel</strong>: nothing to
          install, separate from your tabs and your logins. You sign in to
          LinkedIn once per session, or import your cookies so it stays signed
          in.
        </p>
        <p>
          The older path, the <strong>Claude for chrome</strong> extension
          driving your own chrome window, is what you will see me use in the
          video and it still works. If you are setting this up now, use the
          built-in browser: it is fewer moving parts and it does not take over
          the window you are working in.
        </p>
      </>
    ),
  },
  {
    title: "Connect Apify so it can find its own leads",
    schema:
      "Create an Apify account, copy the API token, then add the Apify MCP server in Cowork under settings, connectors, browse connectors.",
    body: (
      <>
        <p>
          Apify is a marketplace of scrapers. You point one at a source and it
          gives you back structured rows. For B2B the one worth using is an{" "}
          <Out href="https://apify.com/store?search=apollo">apollo scraper</Out>,
          which pulls founders, CEOs and job titles out of linkedin along with
          emails where they exist.
        </p>
        <p>
          Make an account, open settings, integrations, and copy your API token.
          Then connect it inside cowork:
        </p>
        <Block>{`settings -> connectors -> browse connectors
search "apify" -> apify mcp server
install -> enable -> configure
paste your api token -> save`}</Block>
        <p>
          This is the step that changes the shape of the whole thing. Without
          it, you export a spreadsheet and feed it in by hand. With it, you can
          say &quot;find me 100 marketing agency founders in europe&quot; and
          cowork runs the scraper itself, gets the rows back, and starts working
          through them.
        </p>
      </>
    ),
  },
  {
    title: "Tell it your offer before you tell it anything else",
    schema:
      "Give Cowork your offer, your ideal customer and the value your first message leads with, before pointing it at any profile.",
    body: (
      <>
        <p>
          The quality of every message it writes is decided here, not in the
          send step. It needs to know what you sell, who it is for, and what a
          good first message looks like coming from you.
        </p>
        <p>
          Be specific about the value you lead with. Not &quot;let&apos;s
          connect&quot;, which is what everyone else sends. Something the person
          would want even if they never reply: a note on a post they wrote, a
          gap you noticed, a version of their banner that is better than the one
          they have.
        </p>
      </>
    ),
  },
  {
    title: "Watch it do one profile end to end",
    schema:
      "Give it a single LinkedIn URL and watch it read the profile, read the last ten posts, draft the message and send the connection request.",
    body: (
      <>
        <p>
          Before you point it at a list, give it one LinkedIn URL and watch. Ask
          it to study the profile and the last ten posts, write a personalized
          message, and send a connection request with that message attached.
        </p>
        <p>
          What you will see: it opens the profile, reads the top of the page,
          scrolls to the activity feed, reads each post and writes down what it
          learned, then drafts. Then it presses add a note, pastes the message,
          and sends.
        </p>
        <p>
          It is not fast. It is doing screenshot, decide, click, screenshot
          again. That is the point. You are not sitting there watching it, you
          are doing other work while it runs.
        </p>
      </>
    ),
  },
  {
    title: "Put a human checkpoint in before you scale it",
    schema:
      "Have it write every message into a table first, read them yourself, delete the bad ones, and only then tell it to send.",
    body: (
      <>
        <p>
          The version that works is not &quot;send 100 connections&quot;. It is:
          research all 100, write all 100 messages into a table, and stop. You
          read the table. You kill the bad ones. Then you tell it to send.
        </p>
        <p>
          This costs you ten minutes and it is the difference between a system
          you can leave running and a system that quietly damages your name in
          your own market.
        </p>
      </>
    ),
  },
  {
    title: "Run more than one at a time",
    schema:
      "Ask Cowork to run sub agents so several prospects are researched in parallel instead of one after another.",
    body: (
      <>
        <p>
          When a single run is working, ask cowork to spin up sub agents so
          several profiles are being researched at once instead of one after
          another. This is where the hour of work you saved turns into a day of
          it.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "Is Claude Cowork free",
    a: "No. Cowork needs a paid Claude plan, either Pro at $20 a month or Max. The free claude.ai account does not include it, so the app will install and then refuse to sign you in. Apify, where the leads come from, does have a free allowance of $5 of credit a month, which is about 3,000 leads on a $1.50 per 1,000 scraper.",
  },
  {
    q: "How much does this cost to run",
    a: "Claude Pro at $20 a month covers Cowork. Leads run about $1.50 per 1,000 on an Apollo scraper on Apify, and Apify gives you $5 of credit free every month, so roughly 3,000 leads a month cost nothing. That is already more connection requests than LinkedIn will let you send, so in practice the whole system costs the $20 plan.",
  },
  {
    q: "Does Claude Cowork need chrome",
    a: "Not any more. Cowork now opens a browser inside its own side panel, with nothing to install and no access to your own tabs or logins: you sign in once per session, or import cookies from Chrome, Edge or Firefox. The older route, the Claude for Chrome extension driving your own Chrome window, is what the video shows and still works, but the built-in browser is fewer moving parts.",
  },
  {
    q: "Will LinkedIn ban me for automating outreach",
    a: "Automating LinkedIn is against LinkedIn's user agreement, and using Claude to work around another platform's terms is against Anthropic's usage policy too. There is no published safe number of daily requests, and anyone quoting you one is guessing. The lower risk version is to automate the research and the drafting, which is where almost all the time goes, and send by hand.",
  },
  {
    q: "How many leads can I get for free",
    a: "About 3,000 a month. Apify gives every account $5 of platform credit a month and a good Apollo scraper charges around $1.50 per 1,000 results. I said 5,000 in the video and corrected it on camera: the real number is 3,000, and it is still more than you can send connection requests to without breaking LinkedIn's limits.",
  },
  {
    q: "What makes the messages different from normal AI outreach",
    a: "Two things. It reads the person's last ten posts before writing, so the message refers to something they actually said this month. And I ask it for a slightly awkward compliment rather than a polished one, because polished is exactly what a mass-generated message looks like now. Awkward reads as human.",
  },
];

export default function ClaudeCoworkOutreachPage() {
  return (
    <ResourcePageShell
      slug="claude-cowork-outreach"
      repoCta={{
        href: "https://claude.com/download",
        label: "Download Claude Cowork",
        icon: DOWNLOAD_ICON,
      }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="Claude Cowork for cold outreach (B2B sales)"
      subhead="Cowork opens LinkedIn itself, reads a prospect's last ten posts, writes a message about what they actually said, and sends the connection. Here is the whole system, including what it costs and where it goes wrong."
      steps={steps}
      troubleshooting={["linkedinBan", "claudeNotFound", "costs", "costsScraping"]}
      breadcrumb={[
        { name: "Claude Cowork", path: "/claude-cowork" },
        { name: "Cold outreach", path: "/claude-cowork-outreach" },
      ]}
      howTo={{
        name: "Run B2B cold outreach on LinkedIn with Claude Cowork",
        description:
          "Set up Claude Cowork and Apify so it researches each prospect, writes a personalized message and sends the connection request.",
        totalTime: "PT15M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="What Claude Cowork actually does on LinkedIn">
            <Answer>
              Cowork opens its own browser, finds the people you described, reads their profiles and writes each message itself. You approve and send.
            </Answer>
            <Figure
              src="/guide/cowork-tasks.webp"
              alt="Claude Cowork's task screen, waiting for an instruction"
              videoId={VIDEO_ID}
              at={580}
              caption="Cowork's whole surface is this box. You describe the job in a sentence and it opens its own browser to do it."
            />
            <p>
              Claude Cowork is Anthropic&apos;s desktop app, and the difference
              between it and a normal chat is that it has your computer. It
              takes a screenshot of the screen, works out where to click, and
              clicks. So &quot;do my LinkedIn outreach&quot; is not a metaphor.
              It opens the profile.
            </p>
            <p>
              The loop it runs for one prospect is the same loop you would run
              by hand, and it looks like this:
            </p>
            <ul>
              <li>Open the profile and read the headline and about section</li>
              <li>
                Scroll to their activity and read the last ten posts, noting
                what each one is about
              </li>
              <li>
                Write a message that refers to something specific they said
              </li>
              <li>
                Press add a note on the connection request, paste the message,
                send
              </li>
            </ul>
            <p>
              It is slow, maybe a minute or two a profile, because every step is
              look then act. That stops mattering the moment you stop watching
              it. The whole reason to build this is that the research is the
              expensive part and the research is what you hand over.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="What it costs to run">
            <Figure
              src="/guide/cowork-pricing.webp"
              alt="An Apify lead scraper's pricing page, showing a price per thousand leads"
              videoId={VIDEO_ID}
              at={300}
              caption="A representative lead scraper on Apify. The unit is dollars per thousand, not per month."
            />
            <KeyFacts
              rows={[
                { label: "Claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month. Max also works. The free plan does not.` },
                { label: "Leads", value: `About ${usd(APIFY.leadsPerThousand)} per 1,000 on an apollo scraper on Apify` },
                { label: "Apify free tier", value: `${usd(APIFY.freeMonthlyCredit)} of credit a month, so roughly ${freeLeadsPerMonth().toLocaleString()} leads free` },
                { label: "Browser", value: "None to install. Cowork opens one in its own side panel, separate from your tabs" },
                { label: "Setup time", value: "About 15 minutes, no code" },
                { label: "Realistic monthly bill", value: `${usd(PLANS.pro.monthly)}, because the free Apify credit covers more leads than LinkedIn will let you contact` },
              ]}
              caption="Checked against Apify's pricing and Anthropic's plans on 2026-08-27."
            />
            <Callout title="One correction from the video">
              <p>
                I said 5,000 free leads a month on camera and corrected it in
                the same video. The real number is about 3,000. It makes no
                practical difference, because either figure is far more people
                than LinkedIn will let you send connection requests to.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="Where the leads come from">
            <Figure
              src="/guide/cowork-actors.webp"
              alt="The Apify store, showing lead scrapers for different sources"
              videoId={VIDEO_ID}
              at={280}
              caption="Apify is a shelf of ready-made scrapers. You pick one, hand it parameters, and it gives you rows back."
            />
            <p>
              <Out href="https://apify.com">Apify</Out> is a marketplace of
              scrapers. you pick one, give it parameters, and it hands back
              rows. for B2B the useful one is an apollo scraper, which pulls
              people out of linkedin by role, industry and location.
            </p>
            <p>A run returns, for each person:</p>
            <ul>
              <li>Name and job title</li>
              <li>The LinkedIn profile URL, which is the field that matters</li>
              <li>An email, on some of them</li>
              <li>Company, location, and a description of the organization</li>
            </ul>
            <p>
              It is not only for LinkedIn. The same marketplace has scrapers for
              Instagram followers of a given account, and for local businesses
              off Google maps. If your buyers are not on LinkedIn, the rest of
              the system still works, you just change the source.
            </p>
            <p>
              Once the Apify connector is installed in cowork, you do not export
              anything. You ask for the leads in the chat and it runs the
              scraper, reads the rows, and can build a spreadsheet out of them
              before it starts writing.
            </p>
          </GuideSection>

          <GuideSection title="The full walkthrough">
            <Figure
              src="/guide/cowork-mcp.webp"
              alt="The Apify connector, enabled in Claude's settings"
              videoId={VIDEO_ID}
              at={560}
              caption="The one piece of setup that is not obvious: the Apify connector has to be switched on before Cowork can reach the scrapers."
            />
            <p>
              Fifteen minutes, and none of it is code. If you only read one part
              of this page, read step five.
            </p>
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="The prompt I use">
            <p>
              This is the shape, not a magic string. The parts in capitals are
              the parts you have to replace, and they are the parts that decide
              whether it works.
            </p>
            <Block>{`i sell WHAT YOU SELL to WHO YOU SELL TO.
the thing that makes us different is ONE SENTENCE.

for each linkedin profile i give you:
1. read the profile and the last 10 posts
2. write down what this person is actually working on right now
3. write a connection note under 300 characters that
   refers to something specific from their posts
4. make the compliment slightly awkward rather than polished,
   the polished version reads as generated
5. put the message in a table, do not send yet

when the table is done, stop and show it to me.`}</Block>
            <p>
              The last two lines are the ones people delete and then regret. See
              below.
            </p>
          </GuideSection>

          <GuideSection title="Why the messages get replies">
            <p>
              The reason is not that an AI wrote them. It is that almost nobody
              reads ten posts before sending a connection request, and the
              message shows it.
            </p>
            <p>
              The deliberate part is the <strong>slightly awkward
              compliment</strong>. Everyone&apos;s inbox is now full of
              perfectly balanced, perfectly polite, perfectly generic messages,
              and that polish has become the tell. Asking for something a little
              uneven produces something that reads like a person typed it,
              because a person would have.
            </p>
            <p>
              The other half is the checkpoint. A message that goes out without
              you reading it is a message you cannot stand behind, and in a
              small market you only get to do that once.
            </p>
          </GuideSection>

          <GuideSection title="What it does badly">
            <ul>
              <li>
                <strong>It is slow per profile.</strong> A minute or two each,
                because it is screenshotting and deciding. Fine in the
                background, painful if you sit and watch.
              </li>
              <li>
                <strong>It works one page at a time.</strong> The built-in
                browser is a single surface, so a run is a queue, not a swarm,
                unless you explicitly split it across sub agents.
              </li>
              <li>
                <strong>It will happily send something bad.</strong> If you skip
                the table step it has no way of knowing the message missed.
              </li>
              <li>
                <strong>Automating LinkedIn is against LinkedIn&apos;s
                terms</strong>, and using Claude to get around another
                platform&apos;s terms is against Anthropic&apos;s usage policy
                too. There is no published safe daily number and every figure
                you find online is somebody guessing. The version I would
                actually recommend is to automate the research and the drafting,
                which is where the hours go, and press send yourself.
              </li>
            </ul>
            <p>
              If you want the same research-then-draft loop without the browser
              automation, the <Code>claude code</Code> version of this is on the{" "}
              <a href="/claude-b2b-outreach">B2b outreach page</a>, and the
              broader picture of what cowork is for is on{" "}
              <a href="/claude-cowork">The cowork guide</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Cowork for Cold Outreach: the full LinkedIn system",
        description:
          "How to run B2B cold outreach with Claude Cowork: the Apify lead setup, what it costs, the prompt, and the human checkpoint that keeps it from damaging your name.",
        url: "https://oleg.ae/claude-cowork-outreach",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
      boldaneCta={
        <>
          One thing makes every outreach system convert better: before anyone
          replies, they check your LinkedIn profile. If it shows a real
          expert, reply rates climb. <BoldaneLink /> builds that presence for
          founders, from one hour of talking a week.
        </>
      }
    />
  );
}
