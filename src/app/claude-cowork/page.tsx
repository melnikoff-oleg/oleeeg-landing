import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
  Answer,
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
// "claude cowork" 74,000/mo, "What is Claude Cowork" 6,600, "how to use claude
// cowork" 1,900, "claude cowork for windows" 2,400, "claude cowork use cases"
// 590. See seo/2026-08-27-strategy.md.
//
// No videoId: the Cowork video (QoiFASDh8J8) is the companion to
// /claude-cowork-outreach, and one video should carry VideoObject schema on one
// page, not two.

const steps = [
  {
    title: "Get a paid Claude plan",
    content: (
      <div className="space-y-3">
        <p>
          Cowork is not on the free plan. Pro at ${PLANS.pro.monthly} a month is
          the cheapest way in, and it includes Claude Code as well.
        </p>
      </div>
    ),
  },
  {
    title: "Download the app for your machine",
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
          has builds for macos, windows (including arm64), ChromeOS and linux.
          Web and mobile are in beta.
        </p>
      </div>
    ),
  },
  {
    title: "Open cowork, not chat",
    content: (
      <div className="space-y-3">
        <p>
          Cowork sits next to chat in the app. Chat answers you. Cowork goes and
          does the thing and comes back with the file.
        </p>
      </div>
    ),
  },
  {
    title: "Point it at a folder",
    content: (
      <div className="space-y-3">
        <p>
          Give it the folder the work lives in. It reads and writes there
          directly, so there is no copying out of a chat window.
        </p>
      </div>
    ),
  },
  {
    title: "Connect the tools you already use",
    content: (
      <div className="space-y-3">
        <p>
          Settings, connectors. Google Drive, Slack, Microsoft 365 and anything
          with an MCP server. This is what turns it from a clever assistant into
          something that can finish a job.
        </p>
      </div>
    ),
  },
  {
    title: "Give it a goal, not instructions",
    content: (
      <div className="space-y-3">
        <p>
          Say what you want back, not which buttons to press. Then read what it
          did before you trust the next one.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "What Claude Cowork is",
  "Cowork or Claude Code",
  "What it costs",
  "Installing it",
  "The built-in browser",
  "How to actually prompt it",
  "Eight things I use it for",
  "Sub agents, schedules and plugins",
  "What it is bad at",
];

const guideSteps = [
  {
    title: "Get a plan that includes it",
    schema:
      "Claude Cowork requires a paid plan. Pro at $20 a month is the entry point and includes Claude Code too.",
    body: (
      <>
        <p>
          Cowork is on Pro ({usd(PLANS.pro.monthly)} a month, or{" "}
          {usd(PLANS.pro.annualMonthly)} if you pay for the year), Max (from{" "}
          {usd(PLANS.max.monthlyFrom)}) and Team. It is not on the free plan.
          The same Pro plan also includes Claude Code, so you are not choosing
          between them.
        </p>
      </>
    ),
  },
  {
    title: "Install the desktop app",
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
          Sign in with the same account as your plan. Then look for cowork next
          to chat inside the app. It is not a separate download.
        </p>
      </>
    ),
  },
  {
    title: "Give it a folder and a connector",
    schema:
      "Point Cowork at the folder the work lives in, and connect the tools it needs under settings, connectors.",
    body: (
      <>
        <p>
          This is the step that decides whether cowork is useful to you or a
          novelty. Chat can only see what you paste. Cowork works inside a
          folder you choose and inside the services you connect, so the output
          is a file in the right place rather than text you have to move.
        </p>
        <p>
          Under settings, connectors, you can add Google Drive, Slack, microsoft
          365, and anything that exposes an MCP server. For my own work the
          useful ones are drive, for where the writing lives, and Apify, for
          where the data comes from.
        </p>
      </>
    ),
  },
  {
    title: "Write the task as an outcome",
    schema:
      "Describe the result you want and the constraints, not the sequence of clicks. Cowork chooses the how.",
    body: (
      <>
        <p>
          The instinct from years of using software is to describe the steps.
          Resist it. Describe the thing you want to be holding at the end, where
          it should end up, and what would make it wrong.
        </p>
        <p>
          The difference in practice is large. &quot;open the sheet, filter
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
    title: "Read the trace before you trust it",
    schema:
      "Cowork shows every file it opened and every choice it made. Read that trace on the first few runs.",
    body: (
      <>
        <p>
          It shows its work: the files it opened, the tools it called, the
          decisions it made. On the first few runs of any new task, read that.
          Not because it is usually wrong, but because that is how you find out
          what it assumed, and the assumption is the part you need to write into
          the prompt for next time.
        </p>
      </>
    ),
  },
  {
    title: "Put it on a schedule once it is boring",
    schema:
      "When a task runs the same way twice, schedule it to run daily, weekly or monthly and come back to the output.",
    body: (
      <>
        <p>
          When a task has run correctly twice, schedule it. Daily, weekly,
          monthly. That is the moment the thing stops being an assistant and
          starts being a member of staff who does the monday readout before you
          are awake.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "What is Claude Cowork",
    a: "Claude Cowork is Anthropic's app for handing Claude a whole task instead of a question. You give it a goal, a folder and the tools it needs, and it works across your files and services and comes back with finished work for you to review. It sits next to Chat in the Claude app on desktop, web and mobile.",
  },
  {
    q: "Is Claude Cowork free",
    a: "No. Cowork needs a paid plan: Pro at $20 a month, Max from $100 a month, or a Team seat. The free Claude account does not include it. The same Pro plan also includes Claude Code, Claude Design and Claude Science, so you are paying once for all of them.",
  },
  {
    q: "Does Claude Cowork work on windows",
    a: "Yes. There are builds for Windows and for Windows on arm64, alongside macOS, ChromeOS and Linux, all at claude.com/download. The web and mobile versions are in beta. The built-in browser can import cookies from Firefox on Windows and Linux, and from Chrome, Edge or Firefox on macOS.",
  },
  {
    q: "What is the difference between Claude Cowork and Claude Code",
    a: "Claude Code lives in your terminal and is built around a codebase: it reads and edits files, runs commands and works in git. Cowork is built around an office job: documents, spreadsheets, decks, browsers and connected services like Drive and Slack. If the output is a commit, use Claude Code. If the output is a deck, a spreadsheet or a filled-in form, use Cowork. Both are included in the same paid plan.",
  },
  {
    q: "Can Claude Cowork use a browser",
    a: "Yes, and since August 2026 it has its own. When a task needs a web page, Cowork opens a browser in its side panel rather than taking over yours, so you keep working. It is separate from your tabs and logins: you sign in once per session, or import cookies. It is available in the desktop app on Pro, Max and Team.",
  },
  {
    q: "What are Claude Cowork use cases",
    a: "The ones that pay for themselves fastest are the recurring ones: a scheduled weekly metrics readout built from your own sources, first-pass review of a folder of documents against a checklist, reconciling exports into one spreadsheet with the variances flagged, and turning a folder of call notes into a memo on where each deal stands. Anything you do the same way every week, where the inputs live in files and the output is a document.",
  },
  {
    q: "Can it run more than one thing at a time",
    a: "Yes. Big tasks are split into chunks that run together, and you can ask it to use sub agents so separate pieces of work happen in parallel rather than in a queue. It also keeps going when you close the laptop, and scheduled tasks run unattended.",
  },
];

export default function ClaudeCoworkPage() {
  return (
    <ResourcePageShell
      slug="claude-cowork"
      repoCta={{
        href: "https://claude.com/download",
        label: "Download Claude Cowork",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="Claude Cowork"
      title="Claude Cowork, from someone who runs it every day"
      subhead="What it is, what it costs, what it is actually good at, and the eight jobs i hand it every week. No marketing copy, and no pretending it does things it does not."
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
          <GuideSection title="What Claude Cowork is">
            <Answer>
              Cowork is the part of the Claude app where you hand over a job
              instead of asking a question. Chat gives you an answer you then
              have to do something with. Cowork goes and does the something,
              inside your own files and your own tools, and comes back with the
              finished thing for you to check.
            </Answer>
            <p>
              The practical difference is that the output is a file in the right
              folder rather than text in a window. No copying out, no pasting
              in. That sounds small and it is the whole thing.
            </p>
            <p>Three properties are worth knowing before you try it:</p>
            <ul>
              <li>
                <strong>It works where the work is.</strong> A folder you point
                it at, and services you connect: Drive, Slack, Microsoft 365,
                anything with an MCP server.
              </li>
              <li>
                <strong>It shows every step.</strong> The files it opened, the
                tools it called, the choices it made. You can follow along from
                anywhere and redirect it.
              </li>
              <li>
                <strong>It keeps going when you stop.</strong> Close the laptop
                and the task continues. Put it on a schedule and it runs
                unattended.
              </li>
            </ul>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="Cowork or Claude Code">
            <p>
              This is the question I get most, and the answer is simpler than
              people expect: <strong>They are the same intelligence pointed at
              different jobs</strong>, and one paid plan gives you both, so it is
              not a purchase decision.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "Claude Code",
                  value:
                    "Lives in a terminal. Built around a codebase: files, commands, git. The output is a commit.",
                },
                {
                  label: "Claude Cowork",
                  value:
                    "Lives in an app. Built around an office job: documents, spreadsheets, decks, browsers, connectors. The output is a deliverable.",
                },
                {
                  label: "How to choose",
                  value:
                    "If you would have opened a terminal to do it, use Claude Code. If you would have opened a browser or a spreadsheet, use cowork.",
                },
                {
                  label: "Cost of choosing wrong",
                  value: "Nothing. Both are in the same plan, switch mid-task.",
                },
              ]}
            />
            <p>
              In my own week it splits cleanly. Anything that produces a repo or
              a running system goes to Claude Code, and there are{" "}
              <a href="/claude-code-tutorial">Guides for most of those here</a>.
              Anything that produces a document, a report or a browser action
              goes to cowork.
            </p>
          </GuideSection>

          <GuideSection title="What it costs">
            <KeyFacts
              rows={[
                {
                  label: "Free plan",
                  value: "Does not include cowork at all",
                },
                {
                  label: "Pro",
                  value: `${usd(PLANS.pro.monthly)} a month, or ${usd(PLANS.pro.annualMonthly)} a month paid annually. Includes Claude Code, Claude design and Claude science too.`,
                },
                {
                  label: "Max",
                  value: `From ${usd(PLANS.max.monthlyFrom)} a month, for five or twenty times pro's usage`,
                },
                {
                  label: "Team",
                  value: `${usd(PLANS.teamStandard.annualMonthly)} per seat per month annually (${usd(PLANS.teamStandard.monthly)} monthly), premium seats from ${usd(PLANS.teamPremium.annualMonthly)}`,
                },
                {
                  label: "Enterprise",
                  value: `${usd(PLANS.enterprise.seatMonthly)} per seat plus usage at API rates`,
                },
              ]}
              caption="Read off Anthropic's pricing page on 2026-08-27. Prices move, so check before you commit."
            />
            <p>
              The honest version: start on Pro. The reason to go to Max is
              usage, not features, and you will know you need it because you
              will hit the limit in the middle of something rather than
              wondering in advance. The full breakdown, including what happens
              when you run out, is on{" "}
              <a href="/claude-cowork-pricing">The pricing page</a>.
            </p>
          </GuideSection>

          <GuideSection title="Installing it">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="The built-in browser">
            <p>
              This shipped on 26 august 2026 and it changes the setup
              instructions in every cowork tutorial written before it, including
              my own video.
            </p>
            <p>
              When a task needs a web page, cowork now opens{" "}
              <strong>A browser inside its own side panel</strong> instead of
              taking over yours. There is nothing to install. It is separate
              from your tabs and your logins, so it cannot wander into your
              email while you are not looking. You sign in once per session, or
              import cookies to stay signed in: chrome, edge and firefox on
              macos, firefox on windows and linux.
            </p>
            <Callout title="If you are following an older tutorial">
              <p>
                The previous route was the <strong>Claude for chrome</strong>{" "}
                extension driving your own chrome window, and it is what you
                will see in most videos, mine included. It still works. The
                built-in browser is fewer moving parts and it does not take over
                the window you are working in, so it is what I would set up
                today.
              </p>
            </Callout>
            <p>
              It is available in the desktop app on Pro, Max and Team. Enterprise
              admins turn it on under organization settings.
            </p>
          </GuideSection>

          <GuideSection title="How to actually prompt it">
            <p>
              Anthropic&apos;s own phrasing for this is &quot;say what, not
              how&quot;, and it is the single thing that separates people who get
              value out of cowork from people who bounce off it.
            </p>
            <p>A task that works has four parts:</p>
            <ol className="guide-list">
              <li>
                <strong>The deliverable.</strong> What you want to be holding at
                the end, in what format.
              </li>
              <li>
                <strong>The sources.</strong> Which folder, which sheet, which
                connector. Name them.
              </li>
              <li>
                <strong>The judgement.</strong> What counts as notable, what to
                flag, what to ignore.
              </li>
              <li>
                <strong>Where it goes.</strong> The folder to save into.
              </li>
            </ol>
            <p>Here is one of mine, unedited:</p>
            <Block>{`every monday, build last week's content readout.

sources: the youtube analytics export in Marketing/YT,
and the posting log in Marketing/Channel-tracker.

compare every number to the week before.
flag anything that moved more than 15% either way,
and say in one line what you think caused it.

one page. save to Marketing/Weekly with the date in the filename.
if a source is missing, say so at the top instead of guessing.`}</Block>
            <p>
              That last line matters more than the rest put together. Without
              it, a missing file becomes a confident number that is wrong, and
              you find out three weeks later.
            </p>
          </GuideSection>

          <GuideSection title="Eight things I use it for">
            <p>
              In rough order of how much time each one gives back. All of them
              are recurring, which is the pattern: cowork earns its keep on the
              job you do every week, not the one you do once.
            </p>
            <ol className="guide-list">
              <li>
                <strong>The monday readout.</strong> Pull the week&apos;s
                numbers from their sources, compare to last week, flag movement,
                save the doc. Scheduled, so it is done before I open the laptop.
              </li>
              <li>
                <strong>Prospect research.</strong> Read a person&apos;s recent
                posts and write down what they are actually working on. The{" "}
                <a href="/claude-cowork-outreach">Full outreach system</a> is
                built on this one.
              </li>
              <li>
                <strong>First-pass review of a folder.</strong> Point it at
                twelve documents and a checklist, get twelve memos back saying
                where each one departs from the checklist and by how much.
              </li>
              <li>
                <strong>Reconciling exports.</strong> Four regional CSV files
                into one summary tab with the variances flagged, plus a note on
                what did not reconcile.
              </li>
              <li>
                <strong>Call notes into a deal memo.</strong> A quarter of
                notes, out comes where each deal stands, what the customer said
                was blocking it, and the objections that came up more than once.
              </li>
              <li>
                <strong>Competitor sweeps.</strong> Open ten sites, note what
                changed on their pricing and landing pages since last month.
                This is the one the built-in browser made easy.
              </li>
              <li>
                <strong>Turning a transcript into the thing it should
                be.</strong> An hour of talking becomes a brief, an outline and
                a first draft, in the folder where the writing lives.
              </li>
              <li>
                <strong>The admin I keep not doing.</strong> Renaming and
                filing, chasing a number across three systems, filling the same
                form for the eleventh time.
              </li>
            </ol>
          </GuideSection>

          <GuideSection title="Sub agents, schedules and plugins">
            <p>
              Three features that turn a single useful run into something that
              runs your week.
            </p>
            <p>
              <strong>Sub agents</strong> are specialised agents that take a
              piece of the task end to end. The practical effect is
              parallelism: while one drafts, another researches and a third
              organises. If a run feels like a queue, this is the thing you are
              missing.
            </p>
            <p>
              <strong>Schedules</strong> run a task on a cadence, unattended.
              Daily, weekly, monthly. This is where the compounding is. A task
              you have to remember to trigger is a task you will stop doing in
              three weeks.
            </p>
            <p>
              <strong>Plugins</strong> bundle skills, connectors and sub agents
              into one install, so cowork shows up already knowing a domain
              rather than being taught it every time. There is a marketplace,
              and organisations can run private ones.
            </p>
          </GuideSection>

          <GuideSection title="What it is bad at">
            <p>
              The parts nobody puts in the launch post, from actually running
              it:
            </p>
            <ul>
              <li>
                <strong>It is not fast.</strong> A browser task is look, decide,
                click, look again. That is fine when you walk away and
                infuriating when you watch.
              </li>
              <li>
                <strong>Vague goals produce confident nonsense.</strong> The
                failure mode is not refusing, it is inventing something
                plausible. Name your sources and tell it to say when one is
                missing.
              </li>
              <li>
                <strong>The first run of anything needs reading.</strong> Budget
                for that. By the third run you can stop.
              </li>
              <li>
                <strong>Usage limits are real.</strong> A long unattended task
                on Pro can hit them mid-run. That is the actual reason to move
                to Max, and it is the only reason.
              </li>
              <li>
                <strong>Anything that automates a platform you do not own is
                your risk, not Anthropic&apos;s.</strong> Automating LinkedIn is
                against LinkedIn&apos;s terms, and using Claude to work around
                another platform&apos;s terms is against Anthropic&apos;s usage
                policy too. Automate the research, send the message yourself.
              </li>
            </ul>
            <p>
              If you want the terminal half of this, start with{" "}
              <a href="/claude-code-tutorial">The Claude Code guide</a>, and{" "}
              <a href="/claude-cowork-pricing">The pricing page</a> has the full
              cost picture including what the API alternative works out at. The{" "}
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
        url: "https://www.oleg.ae/claude-cowork",
        datePublished: "2026-08-27",
        dateModified: "2026-08-27",
      }}
      boldaneCta={
        <>
          Cowork is very good at the work behind the work. It is not good at
          deciding what you should be known for. <BoldaneLink /> does that half
          for founders, from one hour of talking a week.
        </>
      }
    />
  );
}
