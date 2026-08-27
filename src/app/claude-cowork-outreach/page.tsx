import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import { APIFY, PLANS, freeLeadsPerMonth, usd } from "@/lib/pricing";
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

const VIDEO_ID = "QoiFASDh8J8";
const VIDEO_TITLE = "How I Use Claude For Cold Outreach (B2B Sales)";

// The quick checklist. Everything that needs explaining lives in the written
// guide below, not here: this is the "I watched the video, just give me the
// steps" surface.
const steps = [
  {
    title: "get a paid claude plan",
    content: (
      <div className="space-y-3">
        <p>
          cowork is not on the free plan. you need Pro ({usd(PLANS.pro.monthly)}/mo) or Max. one
          closed B2B deal pays for a year of it, so this is the cheapest part of
          the system.
        </p>
      </div>
    ),
  },
  {
    title: "download claude cowork",
    content: (
      <div className="space-y-3">
        <p>
          get the desktop app at{" "}
          <a
            href="https://claude.com/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            claude.com/download
          </a>
          , pick your operating system, install it, and sign in with the same
          claude account.
        </p>
      </div>
    ),
  },
  {
    title: "check the browser (this changed since the video)",
    content: (
      <div className="space-y-3">
        <p>
          cowork now opens a browser inside its own side panel. nothing to
          install, and it does not touch your tabs. sign in to linkedin once at
          the start of a session, or import your cookies so it stays signed in.
        </p>
        <p>
          in the video i use the older path, the &quot;claude for chrome&quot;
          extension driving my own chrome window. that still works. the built-in
          browser is simpler and is what i would set up today.
        </p>
      </div>
    ),
  },
  {
    title: "make an apify account and copy your api token",
    content: (
      <div className="space-y-3">
        <p>
          sign up at{" "}
          <a
            href="https://apify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            apify.com
          </a>
          , open settings, integrations, and copy the api token. apify is where
          the leads come from.
        </p>
      </div>
    ),
  },
  {
    title: "connect apify to cowork",
    content: (
      <div className="space-y-3">
        <p>
          in cowork: settings, connectors, browse connectors, search apify, open
          the apify mcp server, install, enable, configure, paste the token,
          save.
        </p>
        <p>
          that is the whole setup. from here cowork can pull leads itself
          instead of you exporting spreadsheets.
        </p>
      </div>
    ),
  },
  {
    title: "run your first batch",
    content: (
      <div className="space-y-3">
        <p>
          open a new task and tell it your offer, who you sell to, and where to
          get the leads. start with ten profiles, read every message it writes,
          then let it send.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "what claude cowork actually does on linkedin",
  "what it costs to run",
  "where the leads come from",
  "the full walkthrough",
  "the prompt i use",
  "why the messages get replies",
  "what it does badly",
];

// Each step carries the one-sentence version that goes into HowTo schema, so
// the markup and the prose live in the same place and cannot drift apart.
const guideSteps = [
  {
    title: "install cowork and give it a browser",
    schema:
      "Download Claude Cowork from claude.com/download and sign in with a paid Claude plan. It opens a browser in its own side panel, so there is nothing else to install.",
    body: (
      <>
        <p>
          claude cowork is anthropic&apos;s desktop app. it is not a chat window
          that gives you advice, it is claude with hands on your own computer. it
          takes a screenshot of what is on screen, decides where to click, and
          clicks.
        </p>
        <p>
          download it from <Out href="https://claude.com/download">claude.com/download</Out>{" "}
          and sign in. you need a paid claude plan for this, Pro at {usd(PLANS.pro.monthly)} a month
          or Max. the free claude.ai plan does not include cowork, so it will
          install perfectly and then refuse to let you in.
        </p>
        <p>
          it also needs a browser to reach linkedin, and this is the one thing
          that has changed since i filmed the video. cowork now ships with{" "}
          <strong>a browser built into its own side panel</strong>: nothing to
          install, separate from your tabs and your logins. you sign in to
          linkedin once per session, or import your cookies so it stays signed
          in.
        </p>
        <p>
          the older path, the <strong>claude for chrome</strong> extension
          driving your own chrome window, is what you will see me use in the
          video and it still works. if you are setting this up now, use the
          built-in browser: it is fewer moving parts and it does not take over
          the window you are working in.
        </p>
      </>
    ),
  },
  {
    title: "connect apify so it can find its own leads",
    schema:
      "Create an Apify account, copy the API token, then add the Apify MCP server in Cowork under settings, connectors, browse connectors.",
    body: (
      <>
        <p>
          apify is a marketplace of scrapers. you point one at a source and it
          gives you back structured rows. for B2B the one worth using is an{" "}
          <Out href="https://apify.com/store?search=apollo">apollo scraper</Out>,
          which pulls founders, CEOs and job titles out of linkedin along with
          emails where they exist.
        </p>
        <p>
          make an account, open settings, integrations, and copy your api token.
          then connect it inside cowork:
        </p>
        <Block>{`settings -> connectors -> browse connectors
search "apify" -> apify mcp server
install -> enable -> configure
paste your api token -> save`}</Block>
        <p>
          this is the step that changes the shape of the whole thing. without
          it, you export a spreadsheet and feed it in by hand. with it, you can
          say &quot;find me 100 marketing agency founders in europe&quot; and
          cowork runs the scraper itself, gets the rows back, and starts working
          through them.
        </p>
      </>
    ),
  },
  {
    title: "tell it your offer before you tell it anything else",
    schema:
      "Give Cowork your offer, your ideal customer and the value your first message leads with, before pointing it at any profile.",
    body: (
      <>
        <p>
          the quality of every message it writes is decided here, not in the
          send step. it needs to know what you sell, who it is for, and what a
          good first message looks like coming from you.
        </p>
        <p>
          be specific about the value you lead with. not &quot;let&apos;s
          connect&quot;, which is what everyone else sends. something the person
          would want even if they never reply: a note on a post they wrote, a
          gap you noticed, a version of their banner that is better than the one
          they have.
        </p>
      </>
    ),
  },
  {
    title: "watch it do one profile end to end",
    schema:
      "Give it a single LinkedIn URL and watch it read the profile, read the last ten posts, draft the message and send the connection request.",
    body: (
      <>
        <p>
          before you point it at a list, give it one linkedin url and watch. ask
          it to study the profile and the last ten posts, write a personalized
          message, and send a connection request with that message attached.
        </p>
        <p>
          what you will see: it opens the profile, reads the top of the page,
          scrolls to the activity feed, reads each post and writes down what it
          learned, then drafts. then it presses add a note, pastes the message,
          and sends.
        </p>
        <p>
          it is not fast. it is doing screenshot, decide, click, screenshot
          again. that is the point. you are not sitting there watching it, you
          are doing other work while it runs.
        </p>
      </>
    ),
  },
  {
    title: "put a human checkpoint in before you scale it",
    schema:
      "Have it write every message into a table first, read them yourself, delete the bad ones, and only then tell it to send.",
    body: (
      <>
        <p>
          the version that works is not &quot;send 100 connections&quot;. it is:
          research all 100, write all 100 messages into a table, and stop. you
          read the table. you kill the bad ones. then you tell it to send.
        </p>
        <p>
          this costs you ten minutes and it is the difference between a system
          you can leave running and a system that quietly damages your name in
          your own market.
        </p>
      </>
    ),
  },
  {
    title: "run more than one at a time",
    schema:
      "Ask Cowork to run sub agents so several prospects are researched in parallel instead of one after another.",
    body: (
      <>
        <p>
          when a single run is working, ask cowork to spin up sub agents so
          several profiles are being researched at once instead of one after
          another. this is where the hour of work you saved turns into a day of
          it.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "is claude cowork free",
    a: "No. Cowork needs a paid Claude plan, either Pro at $20 a month or Max. The free claude.ai account does not include it, so the app will install and then refuse to sign you in. Apify, where the leads come from, does have a free allowance of $5 of credit a month, which is about 3,000 leads on a $1.50 per 1,000 scraper.",
  },
  {
    q: "how much does this cost to run",
    a: "Claude Pro at $20 a month covers Cowork. Leads run about $1.50 per 1,000 on an Apollo scraper on Apify, and Apify gives you $5 of credit free every month, so roughly 3,000 leads a month cost nothing. That is already more connection requests than LinkedIn will let you send, so in practice the whole system costs the $20 plan.",
  },
  {
    q: "does claude cowork need chrome",
    a: "Not any more. Cowork now opens a browser inside its own side panel, with nothing to install and no access to your own tabs or logins: you sign in once per session, or import cookies from Chrome, Edge or Firefox. The older route, the Claude for Chrome extension driving your own Chrome window, is what the video shows and still works, but the built-in browser is fewer moving parts.",
  },
  {
    q: "will linkedin ban me for automating outreach",
    a: "Automating LinkedIn is against LinkedIn's user agreement, and using Claude to work around another platform's terms is against Anthropic's usage policy too. There is no published safe number of daily requests, and anyone quoting you one is guessing. The lower risk version is to automate the research and the drafting, which is where almost all the time goes, and send by hand.",
  },
  {
    q: "how many leads can i get for free",
    a: "About 3,000 a month. Apify gives every account $5 of platform credit a month and a good Apollo scraper charges around $1.50 per 1,000 results. I said 5,000 in the video and corrected it on camera: the real number is 3,000, and it is still more than you can send connection requests to without breaking LinkedIn's limits.",
  },
  {
    q: "what makes the messages different from normal ai outreach",
    a: "Two things. It reads the person's last ten posts before writing, so the message refers to something they actually said this month. And I ask it for a slightly awkward compliment rather than a polished one, because polished is exactly what a mass-generated message looks like now. Awkward reads as human.",
  },
];

export default function ClaudeCoworkOutreachPage() {
  return (
    <ResourcePageShell
      slug="claude-cowork-outreach"
      repoCta={{
        href: "https://claude.com/download",
        label: "download claude cowork",
        icon: DOWNLOAD_ICON,
      }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="claude cowork for cold outreach (b2b sales)"
      subhead="cowork opens linkedin itself, reads a prospect's last ten posts, writes a message about what they actually said, and sends the connection. here is the whole system, including what it costs and where it goes wrong."
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
          <GuideSection title="what claude cowork actually does on linkedin">
            <p>
              claude cowork is anthropic&apos;s desktop app, and the difference
              between it and a normal chat is that it has your computer. it
              takes a screenshot of the screen, works out where to click, and
              clicks. so &quot;do my linkedin outreach&quot; is not a metaphor.
              it opens the profile.
            </p>
            <p>
              the loop it runs for one prospect is the same loop you would run
              by hand, and it looks like this:
            </p>
            <ul>
              <li>open the profile and read the headline and about section</li>
              <li>
                scroll to their activity and read the last ten posts, noting
                what each one is about
              </li>
              <li>
                write a message that refers to something specific they said
              </li>
              <li>
                press add a note on the connection request, paste the message,
                send
              </li>
            </ul>
            <p>
              it is slow, maybe a minute or two a profile, because every step is
              look then act. that stops mattering the moment you stop watching
              it. the whole reason to build this is that the research is the
              expensive part and the research is what you hand over.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="what it costs to run">
            <KeyFacts
              rows={[
                { label: "claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month. Max also works. the free plan does not.` },
                { label: "leads", value: `about ${usd(APIFY.leadsPerThousand)} per 1,000 on an apollo scraper on apify` },
                { label: "apify free tier", value: `${usd(APIFY.freeMonthlyCredit)} of credit a month, so roughly ${freeLeadsPerMonth().toLocaleString()} leads free` },
                { label: "browser", value: "none to install. cowork opens one in its own side panel, separate from your tabs" },
                { label: "setup time", value: "about 15 minutes, no code" },
                { label: "realistic monthly bill", value: `${usd(PLANS.pro.monthly)}, because the free apify credit covers more leads than linkedin will let you contact` },
              ]}
              caption="checked against apify's pricing and anthropic's plans on 2026-08-27."
            />
            <Callout title="one correction from the video">
              <p>
                i said 5,000 free leads a month on camera and corrected it in
                the same video. the real number is about 3,000. it makes no
                practical difference, because either figure is far more people
                than linkedin will let you send connection requests to.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="where the leads come from">
            <p>
              <Out href="https://apify.com">apify</Out> is a marketplace of
              scrapers. you pick one, give it parameters, and it hands back
              rows. for B2B the useful one is an apollo scraper, which pulls
              people out of linkedin by role, industry and location.
            </p>
            <p>a run returns, for each person:</p>
            <ul>
              <li>name and job title</li>
              <li>the linkedin profile url, which is the field that matters</li>
              <li>an email, on some of them</li>
              <li>company, location, and a description of the organization</li>
            </ul>
            <p>
              it is not only for linkedin. the same marketplace has scrapers for
              instagram followers of a given account, and for local businesses
              off google maps. if your buyers are not on linkedin, the rest of
              the system still works, you just change the source.
            </p>
            <p>
              once the apify connector is installed in cowork, you do not export
              anything. you ask for the leads in the chat and it runs the
              scraper, reads the rows, and can build a spreadsheet out of them
              before it starts writing.
            </p>
          </GuideSection>

          <GuideSection title="the full walkthrough">
            <p>
              fifteen minutes, and none of it is code. if you only read one part
              of this page, read step five.
            </p>
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="the prompt i use">
            <p>
              this is the shape, not a magic string. the parts in capitals are
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
              the last two lines are the ones people delete and then regret. see
              below.
            </p>
          </GuideSection>

          <GuideSection title="why the messages get replies">
            <p>
              the reason is not that an AI wrote them. it is that almost nobody
              reads ten posts before sending a connection request, and the
              message shows it.
            </p>
            <p>
              the deliberate part is the <strong>slightly awkward
              compliment</strong>. everyone&apos;s inbox is now full of
              perfectly balanced, perfectly polite, perfectly generic messages,
              and that polish has become the tell. asking for something a little
              uneven produces something that reads like a person typed it,
              because a person would have.
            </p>
            <p>
              the other half is the checkpoint. a message that goes out without
              you reading it is a message you cannot stand behind, and in a
              small market you only get to do that once.
            </p>
          </GuideSection>

          <GuideSection title="what it does badly">
            <ul>
              <li>
                <strong>it is slow per profile.</strong> a minute or two each,
                because it is screenshotting and deciding. fine in the
                background, painful if you sit and watch.
              </li>
              <li>
                <strong>it works one page at a time.</strong> the built-in
                browser is a single surface, so a run is a queue, not a swarm,
                unless you explicitly split it across sub agents.
              </li>
              <li>
                <strong>it will happily send something bad.</strong> if you skip
                the table step it has no way of knowing the message missed.
              </li>
              <li>
                <strong>automating linkedin is against linkedin&apos;s
                terms</strong>, and using claude to get around another
                platform&apos;s terms is against anthropic&apos;s usage policy
                too. there is no published safe daily number and every figure
                you find online is somebody guessing. the version i would
                actually recommend is to automate the research and the drafting,
                which is where the hours go, and press send yourself.
              </li>
            </ul>
            <p>
              if you want the same research-then-draft loop without the browser
              automation, the <Code>claude code</Code> version of this is on the{" "}
              <a href="/claude-b2b-outreach">b2b outreach page</a>, and the
              broader picture of what cowork is for is on{" "}
              <a href="/claude-cowork">the cowork guide</a>.
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
          one thing makes every outreach system convert better: before anyone
          replies, they check your LinkedIn profile. if it shows a real
          expert, reply rates climb. <BoldaneLink /> builds that presence for
          founders, from one hour of talking a week.
        </>
      }
    />
  );
}
