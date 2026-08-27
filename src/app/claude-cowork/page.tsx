import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
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

// The pillar page for the Claude Cowork cluster. Ubersuggest, US, 2026-08-27:
// "claude cowork" 74,000/mo, "what is claude cowork" 6,600, "how to use claude
// cowork" 1,900, "claude cowork for windows" 2,400, "claude cowork use cases"
// 590. See seo/2026-08-27-strategy.md.
//
// No videoId: the Cowork video (QoiFASDh8J8) is the companion to
// /claude-cowork-outreach, and one video should carry VideoObject schema on one
// page, not two.

const steps = [
  {
    title: "get a paid claude plan",
    content: (
      <div className="space-y-3">
        <p>
          cowork is not on the free plan. Pro at ${PLANS.pro.monthly} a month is
          the cheapest way in, and it includes claude code as well.
        </p>
      </div>
    ),
  },
  {
    title: "download the app for your machine",
    content: (
      <div className="space-y-3">
        <p>
          <a
            href="https://claude.com/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            claude.com/download
          </a>{" "}
          has builds for macos, windows (including arm64), chromeos and linux.
          web and mobile are in beta.
        </p>
      </div>
    ),
  },
  {
    title: "open cowork, not chat",
    content: (
      <div className="space-y-3">
        <p>
          cowork sits next to chat in the app. chat answers you. cowork goes and
          does the thing and comes back with the file.
        </p>
      </div>
    ),
  },
  {
    title: "point it at a folder",
    content: (
      <div className="space-y-3">
        <p>
          give it the folder the work lives in. it reads and writes there
          directly, so there is no copying out of a chat window.
        </p>
      </div>
    ),
  },
  {
    title: "connect the tools you already use",
    content: (
      <div className="space-y-3">
        <p>
          settings, connectors. google drive, slack, microsoft 365 and anything
          with an mcp server. this is what turns it from a clever assistant into
          something that can finish a job.
        </p>
      </div>
    ),
  },
  {
    title: "give it a goal, not instructions",
    content: (
      <div className="space-y-3">
        <p>
          say what you want back, not which buttons to press. then read what it
          did before you trust the next one.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "what claude cowork is",
  "cowork or claude code",
  "what it costs",
  "installing it",
  "the built-in browser",
  "how to actually prompt it",
  "eight things i use it for",
  "sub agents, schedules and plugins",
  "what it is bad at",
];

const guideSteps = [
  {
    title: "get a plan that includes it",
    schema:
      "Claude Cowork requires a paid plan. Pro at $20 a month is the entry point and includes Claude Code too.",
    body: (
      <>
        <p>
          cowork is on Pro ({usd(PLANS.pro.monthly)} a month, or{" "}
          {usd(PLANS.pro.annualMonthly)} if you pay for the year), Max (from{" "}
          {usd(PLANS.max.monthlyFrom)}) and Team. it is not on the free plan.
          the same Pro plan also includes claude code, so you are not choosing
          between them.
        </p>
      </>
    ),
  },
  {
    title: "install the desktop app",
    schema:
      "Download Claude Cowork from claude.com/download. Builds exist for macOS, Windows including arm64, ChromeOS and Linux.",
    body: (
      <>
        <p>
          <Out href="https://claude.com/download">claude.com/download</Out> has
          builds for macos, windows, windows on arm64, chromeos and linux. web
          and mobile exist too and are in beta, which matters more than it
          sounds: a task you start at your desk can be checked from your phone
          on the way somewhere.
        </p>
        <p>
          sign in with the same account as your plan. then look for cowork next
          to chat inside the app. it is not a separate download.
        </p>
      </>
    ),
  },
  {
    title: "give it a folder and a connector",
    schema:
      "Point Cowork at the folder the work lives in, and connect the tools it needs under settings, connectors.",
    body: (
      <>
        <p>
          this is the step that decides whether cowork is useful to you or a
          novelty. chat can only see what you paste. cowork works inside a
          folder you choose and inside the services you connect, so the output
          is a file in the right place rather than text you have to move.
        </p>
        <p>
          under settings, connectors, you can add google drive, slack, microsoft
          365, and anything that exposes an mcp server. for my own work the
          useful ones are drive, for where the writing lives, and apify, for
          where the data comes from.
        </p>
      </>
    ),
  },
  {
    title: "write the task as an outcome",
    schema:
      "Describe the result you want and the constraints, not the sequence of clicks. Cowork chooses the how.",
    body: (
      <>
        <p>
          the instinct from years of using software is to describe the steps.
          resist it. describe the thing you want to be holding at the end, where
          it should end up, and what would make it wrong.
        </p>
        <p>
          the difference in practice is large. &quot;open the sheet, filter
          column C, copy the rows&quot; gets you a brittle run that breaks when
          the sheet moves. &quot;pull last week&apos;s signups, compare them to
          the week before, flag anything that moved more than ten percent, save
          it to Marketing/Weekly&quot; gets you the readout, and gets it again
          next week.
        </p>
      </>
    ),
  },
  {
    title: "read the trace before you trust it",
    schema:
      "Cowork shows every file it opened and every choice it made. Read that trace on the first few runs.",
    body: (
      <>
        <p>
          it shows its work: the files it opened, the tools it called, the
          decisions it made. on the first few runs of any new task, read that.
          not because it is usually wrong, but because that is how you find out
          what it assumed, and the assumption is the part you need to write into
          the prompt for next time.
        </p>
      </>
    ),
  },
  {
    title: "put it on a schedule once it is boring",
    schema:
      "When a task runs the same way twice, schedule it to run daily, weekly or monthly and come back to the output.",
    body: (
      <>
        <p>
          when a task has run correctly twice, schedule it. daily, weekly,
          monthly. that is the moment the thing stops being an assistant and
          starts being a member of staff who does the monday readout before you
          are awake.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "what is claude cowork",
    a: "Claude Cowork is Anthropic's app for handing Claude a whole task instead of a question. You give it a goal, a folder and the tools it needs, and it works across your files and services and comes back with finished work for you to review. It sits next to Chat in the Claude app on desktop, web and mobile.",
  },
  {
    q: "is claude cowork free",
    a: "No. Cowork needs a paid plan: Pro at $20 a month, Max from $100 a month, or a Team seat. The free Claude account does not include it. The same Pro plan also includes Claude Code, Claude Design and Claude Science, so you are paying once for all of them.",
  },
  {
    q: "does claude cowork work on windows",
    a: "Yes. There are builds for Windows and for Windows on arm64, alongside macOS, ChromeOS and Linux, all at claude.com/download. The web and mobile versions are in beta. The built-in browser can import cookies from Firefox on Windows and Linux, and from Chrome, Edge or Firefox on macOS.",
  },
  {
    q: "what is the difference between claude cowork and claude code",
    a: "Claude Code lives in your terminal and is built around a codebase: it reads and edits files, runs commands and works in git. Cowork is built around an office job: documents, spreadsheets, decks, browsers and connected services like Drive and Slack. If the output is a commit, use Claude Code. If the output is a deck, a spreadsheet or a filled-in form, use Cowork. Both are included in the same paid plan.",
  },
  {
    q: "can claude cowork use a browser",
    a: "Yes, and since August 2026 it has its own. When a task needs a web page, Cowork opens a browser in its side panel rather than taking over yours, so you keep working. It is separate from your tabs and logins: you sign in once per session, or import cookies. It is available in the desktop app on Pro, Max and Team.",
  },
  {
    q: "what are claude cowork use cases",
    a: "The ones that pay for themselves fastest are the recurring ones: a scheduled weekly metrics readout built from your own sources, first-pass review of a folder of documents against a checklist, reconciling exports into one spreadsheet with the variances flagged, and turning a folder of call notes into a memo on where each deal stands. Anything you do the same way every week, where the inputs live in files and the output is a document.",
  },
  {
    q: "can it run more than one thing at a time",
    a: "Yes. Big tasks are split into chunks that run together, and you can ask it to use sub agents so separate pieces of work happen in parallel rather than in a queue. It also keeps going when you close the laptop, and scheduled tasks run unattended.",
  },
];

export default function ClaudeCoworkPage() {
  return (
    <ResourcePageShell
      slug="claude-cowork"
      repoCta={{
        href: "https://claude.com/download",
        label: "download claude cowork",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="claude cowork"
      title="claude cowork, from someone who runs it every day"
      subhead="what it is, what it costs, what it is actually good at, and the eight jobs i hand it every week. no marketing copy, and no pretending it does things it does not."
      steps={steps}
      troubleshooting={["costs", "creditBalance"]}
      breadcrumb={[{ name: "Claude Cowork", path: "/claude-cowork" }]}
      howTo={{
        name: "How to use Claude Cowork",
        description:
          "Install Claude Cowork, connect it to your files and tools, and write tasks as outcomes so it can finish them unattended.",
        totalTime: "PT10M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="what claude cowork is">
            <p>
              cowork is the part of the claude app where you hand over a job
              instead of asking a question. chat gives you an answer you then
              have to do something with. cowork goes and does the something,
              inside your own files and your own tools, and comes back with the
              finished thing for you to check.
            </p>
            <p>
              the practical difference is that the output is a file in the right
              folder rather than text in a window. no copying out, no pasting
              in. that sounds small and it is the whole thing.
            </p>
            <p>three properties are worth knowing before you try it:</p>
            <ul>
              <li>
                <strong>it works where the work is.</strong> a folder you point
                it at, and services you connect: drive, slack, microsoft 365,
                anything with an mcp server.
              </li>
              <li>
                <strong>it shows every step.</strong> the files it opened, the
                tools it called, the choices it made. you can follow along from
                anywhere and redirect it.
              </li>
              <li>
                <strong>it keeps going when you stop.</strong> close the laptop
                and the task continues. put it on a schedule and it runs
                unattended.
              </li>
            </ul>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="cowork or claude code">
            <p>
              this is the question i get most, and the answer is simpler than
              people expect: <strong>they are the same intelligence pointed at
              different jobs</strong>, and one paid plan gives you both, so it is
              not a purchase decision.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "claude code",
                  value:
                    "lives in a terminal. built around a codebase: files, commands, git. the output is a commit.",
                },
                {
                  label: "claude cowork",
                  value:
                    "lives in an app. built around an office job: documents, spreadsheets, decks, browsers, connectors. the output is a deliverable.",
                },
                {
                  label: "how to choose",
                  value:
                    "if you would have opened a terminal to do it, use claude code. if you would have opened a browser or a spreadsheet, use cowork.",
                },
                {
                  label: "cost of choosing wrong",
                  value: "nothing. both are in the same plan, switch mid-task.",
                },
              ]}
            />
            <p>
              in my own week it splits cleanly. anything that produces a repo or
              a running system goes to claude code, and there are{" "}
              <a href="/claude-code-tutorial">guides for most of those here</a>.
              anything that produces a document, a report or a browser action
              goes to cowork.
            </p>
          </GuideSection>

          <GuideSection title="what it costs">
            <KeyFacts
              rows={[
                {
                  label: "free plan",
                  value: "does not include cowork at all",
                },
                {
                  label: "pro",
                  value: `${usd(PLANS.pro.monthly)} a month, or ${usd(PLANS.pro.annualMonthly)} a month paid annually. includes claude code, claude design and claude science too.`,
                },
                {
                  label: "max",
                  value: `from ${usd(PLANS.max.monthlyFrom)} a month, for five or twenty times pro's usage`,
                },
                {
                  label: "team",
                  value: `${usd(PLANS.teamStandard.annualMonthly)} per seat per month annually (${usd(PLANS.teamStandard.monthly)} monthly), premium seats from ${usd(PLANS.teamPremium.annualMonthly)}`,
                },
                {
                  label: "enterprise",
                  value: `${usd(PLANS.enterprise.seatMonthly)} per seat plus usage at api rates`,
                },
              ]}
              caption="read off anthropic's pricing page on 2026-08-27. prices move, so check before you commit."
            />
            <p>
              the honest version: start on Pro. the reason to go to Max is
              usage, not features, and you will know you need it because you
              will hit the limit in the middle of something rather than
              wondering in advance. the full breakdown, including what happens
              when you run out, is on{" "}
              <a href="/claude-cowork-pricing">the pricing page</a>.
            </p>
          </GuideSection>

          <GuideSection title="installing it">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="the built-in browser">
            <p>
              this shipped on 26 august 2026 and it changes the setup
              instructions in every cowork tutorial written before it, including
              my own video.
            </p>
            <p>
              when a task needs a web page, cowork now opens{" "}
              <strong>a browser inside its own side panel</strong> instead of
              taking over yours. there is nothing to install. it is separate
              from your tabs and your logins, so it cannot wander into your
              email while you are not looking. you sign in once per session, or
              import cookies to stay signed in: chrome, edge and firefox on
              macos, firefox on windows and linux.
            </p>
            <Callout title="if you are following an older tutorial">
              <p>
                the previous route was the <strong>claude for chrome</strong>{" "}
                extension driving your own chrome window, and it is what you
                will see in most videos, mine included. it still works. the
                built-in browser is fewer moving parts and it does not take over
                the window you are working in, so it is what i would set up
                today.
              </p>
            </Callout>
            <p>
              it is available in the desktop app on Pro, Max and Team. enterprise
              admins turn it on under organization settings.
            </p>
          </GuideSection>

          <GuideSection title="how to actually prompt it">
            <p>
              anthropic&apos;s own phrasing for this is &quot;say what, not
              how&quot;, and it is the single thing that separates people who get
              value out of cowork from people who bounce off it.
            </p>
            <p>a task that works has four parts:</p>
            <ol className="guide-list">
              <li>
                <strong>the deliverable.</strong> what you want to be holding at
                the end, in what format.
              </li>
              <li>
                <strong>the sources.</strong> which folder, which sheet, which
                connector. name them.
              </li>
              <li>
                <strong>the judgement.</strong> what counts as notable, what to
                flag, what to ignore.
              </li>
              <li>
                <strong>where it goes.</strong> the folder to save into.
              </li>
            </ol>
            <p>here is one of mine, unedited:</p>
            <Block>{`every monday, build last week's content readout.

sources: the youtube analytics export in Marketing/YT,
and the posting log in Marketing/Channel-tracker.

compare every number to the week before.
flag anything that moved more than 15% either way,
and say in one line what you think caused it.

one page. save to Marketing/Weekly with the date in the filename.
if a source is missing, say so at the top instead of guessing.`}</Block>
            <p>
              that last line matters more than the rest put together. without
              it, a missing file becomes a confident number that is wrong, and
              you find out three weeks later.
            </p>
          </GuideSection>

          <GuideSection title="eight things i use it for">
            <p>
              in rough order of how much time each one gives back. all of them
              are recurring, which is the pattern: cowork earns its keep on the
              job you do every week, not the one you do once.
            </p>
            <ol className="guide-list">
              <li>
                <strong>the monday readout.</strong> pull the week&apos;s
                numbers from their sources, compare to last week, flag movement,
                save the doc. scheduled, so it is done before i open the laptop.
              </li>
              <li>
                <strong>prospect research.</strong> read a person&apos;s recent
                posts and write down what they are actually working on. the{" "}
                <a href="/claude-cowork-outreach">full outreach system</a> is
                built on this one.
              </li>
              <li>
                <strong>first-pass review of a folder.</strong> point it at
                twelve documents and a checklist, get twelve memos back saying
                where each one departs from the checklist and by how much.
              </li>
              <li>
                <strong>reconciling exports.</strong> four regional csv files
                into one summary tab with the variances flagged, plus a note on
                what did not reconcile.
              </li>
              <li>
                <strong>call notes into a deal memo.</strong> a quarter of
                notes, out comes where each deal stands, what the customer said
                was blocking it, and the objections that came up more than once.
              </li>
              <li>
                <strong>competitor sweeps.</strong> open ten sites, note what
                changed on their pricing and landing pages since last month.
                this is the one the built-in browser made easy.
              </li>
              <li>
                <strong>turning a transcript into the thing it should
                be.</strong> an hour of talking becomes a brief, an outline and
                a first draft, in the folder where the writing lives.
              </li>
              <li>
                <strong>the admin i keep not doing.</strong> renaming and
                filing, chasing a number across three systems, filling the same
                form for the eleventh time.
              </li>
            </ol>
          </GuideSection>

          <GuideSection title="sub agents, schedules and plugins">
            <p>
              three features that turn a single useful run into something that
              runs your week.
            </p>
            <p>
              <strong>sub agents</strong> are specialised agents that take a
              piece of the task end to end. the practical effect is
              parallelism: while one drafts, another researches and a third
              organises. if a run feels like a queue, this is the thing you are
              missing.
            </p>
            <p>
              <strong>schedules</strong> run a task on a cadence, unattended.
              daily, weekly, monthly. this is where the compounding is. a task
              you have to remember to trigger is a task you will stop doing in
              three weeks.
            </p>
            <p>
              <strong>plugins</strong> bundle skills, connectors and sub agents
              into one install, so cowork shows up already knowing a domain
              rather than being taught it every time. there is a marketplace,
              and organisations can run private ones.
            </p>
          </GuideSection>

          <GuideSection title="what it is bad at">
            <p>
              the parts nobody puts in the launch post, from actually running
              it:
            </p>
            <ul>
              <li>
                <strong>it is not fast.</strong> a browser task is look, decide,
                click, look again. that is fine when you walk away and
                infuriating when you watch.
              </li>
              <li>
                <strong>vague goals produce confident nonsense.</strong> the
                failure mode is not refusing, it is inventing something
                plausible. name your sources and tell it to say when one is
                missing.
              </li>
              <li>
                <strong>the first run of anything needs reading.</strong> budget
                for that. by the third run you can stop.
              </li>
              <li>
                <strong>usage limits are real.</strong> a long unattended task
                on Pro can hit them mid-run. that is the actual reason to move
                to Max, and it is the only reason.
              </li>
              <li>
                <strong>anything that automates a platform you do not own is
                your risk, not anthropic&apos;s.</strong> automating linkedin is
                against linkedin&apos;s terms, and using claude to work around
                another platform&apos;s terms is against anthropic&apos;s usage
                policy too. automate the research, send the message yourself.
              </li>
            </ul>
            <p>
              if you want the terminal half of this, start with{" "}
              <a href="/claude-code-tutorial">the claude code guide</a>, and{" "}
              <a href="/claude-cowork-pricing">the pricing page</a> has the full
              cost picture including what the API alternative works out at. the{" "}
              <Code>cowork</Code> and <Code>claude code</Code> split is the only
              decision you have to make, and both are in the same{" "}
              {usd(PLANS.pro.monthly)}.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Cowork: what it is, what it costs, and how to use it",
        description:
          "A practitioner's guide to Claude Cowork: the difference from Claude Code, the real pricing, the new built-in browser, how to prompt it, eight recurring jobs it does well, and what it is bad at.",
        url: "https://oleg.ae/claude-cowork",
        datePublished: "2026-08-27",
        dateModified: "2026-08-27",
      }}
      boldaneCta={
        <>
          cowork is very good at the work behind the work. it is not good at
          deciding what you should be known for. <BoldaneLink /> does that half
          for founders, from one hour of talking a week.
        </>
      }
    />
  );
}
