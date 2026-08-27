import { ResourcePageShell } from "@/components/resource-page-shell";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
  Callout,
  Code,
  CompareTable,
  Guide,
  GuideSection,
  GuideToc,
  KeyFacts,
  Out,
} from "@/components/guide";
import { PLANS, usd } from "@/lib/pricing";

// Ubersuggest, US, 2026-08-27: "claude code vs cursor" 8,100/SD 30,
// "cursor vs claude code" 6,600/SD 28, "codex vs claude code" 6,600/SD 23,
// "claude code vs codex" 3,600/SD 14, "opencode vs claude code" 2,900/SD 22,
// "gemini cli vs claude code" 1,900/SD 16, "claude vs claude code" 1,600/SD 27.
// About 25,000 searches a month across the cluster, most of it low difficulty.
//
// The page states its bias in the first paragraph on purpose. A comparison
// written by someone who obviously uses one of the options and pretends not to
// is worth nothing, and readers can tell.

const steps = [
  {
    title: "if you write code by hand and want help",
    content: (
      <div className="space-y-3">
        <p>
          pick an editor: cursor. you stay in the file, it helps at the cursor,
          you accept or reject line by line.
        </p>
      </div>
    ),
  },
  {
    title: "if you want to hand over the whole job",
    content: (
      <div className="space-y-3">
        <p>
          pick an agent: claude code. you describe an outcome, walk away, and
          review what changed.
        </p>
      </div>
    ),
  },
  {
    title: "if the work is not code at all",
    content: (
      <div className="space-y-3">
        <p>
          claude code, or claude cowork. an editor built around a codebase has
          nothing to offer a folder of transcripts.
        </p>
      </div>
    ),
  },
  {
    title: "if you cannot decide",
    content: (
      <div className="space-y-3">
        <p>
          run both for a week. they are {usd(PLANS.pro.monthly)} each and the
          answer is obvious by friday. this is a cheap question to settle by
          doing.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "the honest disclosure first",
  "editor or agent, which is the real question",
  "claude code vs cursor",
  "claude code vs codex, gemini cli and opencode",
  "claude vs claude code, which is a different question",
  "what claude code is genuinely worse at",
  "how i would choose",
];

const faq = [
  {
    q: "is claude code better than cursor",
    a: "They are different shapes, not different quality. Cursor is an editor: you are in the file and it helps where your cursor is, which suits writing code by hand. Claude Code is an agent: you describe an outcome and review what changed, which suits handing over a whole task. If your work is not a codebase at all, Claude Code fits better because it is folders and commands rather than an editor.",
  },
  {
    q: "what is the difference between claude code and cursor",
    a: "Where you sit. In Cursor you sit in the editor and the AI comes to you; you accept or reject its suggestions as you write. In Claude Code you sit outside and delegate; it reads the files, makes the changes, runs the commands and reports back. Cursor keeps you in the loop by default, Claude Code takes you out of it by default, and that single difference explains almost every other one.",
  },
  {
    q: "how much do claude code and cursor cost",
    a: "Both are $20 a month for the individual plan. Cursor also has a free Hobby tier with limited agent requests, and higher Pro+ and Ultra tiers. Claude has no free tier for Claude Code, but the $20 Pro plan also includes Claude Cowork, Claude Design and Claude Science, so you are paying once for several products rather than one.",
  },
  {
    q: "claude code vs codex, which is better",
    a: "Both are terminal agents with the same basic shape, so the honest answer is that the difference is the model behind them and the ecosystem around them rather than the interface. Pick based on which model you already trust for your kind of work, and which subscription you already pay for. Anyone telling you one is decisively better is usually selling something or benchmarking on a task that is not yours.",
  },
  {
    q: "is claude code worth it if i am not a developer",
    a: "Yes, and it is the case people miss. The name says code, but the thing it actually does is read and write files and run commands, and most non-coding work is also files and commands: transcripts, spreadsheets, image folders, scripts that call an API. Every system on this site was built with it by someone doing marketing. An editor like Cursor has much less to offer that work, because there is no codebase to sit inside.",
  },
  {
    q: "what is the difference between claude and claude code",
    a: "Claude is the chat: you ask, it answers, you go and do something with the answer. Claude Code is an agent with your files: it does the thing and the output is a changed folder rather than text to copy. Claude Cowork sits between them, handling whole office tasks like documents and spreadsheets. All three are included in the same $20 Pro plan.",
  },
  {
    q: "can i use claude code and cursor together",
    a: "Yes, and plenty of people do, because they solve different halves. Cursor for the hour where you are writing something delicate by hand, Claude Code for the job you would rather hand over and review. There is a Claude Code extension for VS Code and JetBrains if you want the agent inside an editor rather than in a terminal.",
  },
];

export default function ClaudeCodeVsCursorPage() {
  return (
    <ResourcePageShell
      slug="claude-code-vs-cursor"
      repoCta={{
        href: "https://claude.com/claude-code",
        label: "get claude code",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="comparison"
      title="claude code vs cursor, codex and the rest"
      subhead="i use claude code every day, so read this as a practitioner's view rather than a neutral benchmark. the useful question is not which is better, it is whether you want an editor or an agent."
      steps={steps}
      troubleshooting={["costs"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Comparisons", path: "/claude-code-vs-cursor" },
      ]}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="the honest disclosure first">
            <p>
              i use claude code all day and i built everything on this site with
              it. that is a bias, so here it is at the top rather than buried.
            </p>
            <p>what this page does not do:</p>
            <ul>
              <li>
                <strong>no benchmark numbers.</strong> the public ones move
                every few weeks and none of them are measured on your work.
              </li>
              <li>
                <strong>no claim that one wins.</strong> the two most popular
                options here are not the same kind of thing, so &quot;which is
                better&quot; is the wrong question.
              </li>
              <li>
                <strong>no competitor prices i have not checked.</strong> the two
                below were read off the vendors&apos; own pages on 2026-08-27.
              </li>
            </ul>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="editor or agent, which is the real question">
            <p>
              almost every comparison in this space is really one distinction
              wearing different logos. some of these products put the AI inside
              the place you work. others put the work inside the AI.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "an editor with AI",
                  value:
                    "you are in the file. it suggests, completes and edits around your cursor. you accept or reject as you go. cursor, and every ide with a copilot in it.",
                },
                {
                  label: "an agent",
                  value:
                    "you are outside. you describe an outcome, it reads and changes files, runs commands, checks results, reports back. claude code, codex, gemini cli, opencode.",
                },
                {
                  label: "how to tell which you want",
                  value:
                    "do you want to watch every line change, or do you want to review the finished thing? that is the whole decision.",
                },
              ]}
            />
            <p>
              this matters because it predicts who is happy. people who like
              being in control of every line find agents unnerving. people who
              want their afternoon back find editors exhausting. neither is
              wrong, and it is much easier to answer about yourself than to
              answer from a feature table.
            </p>
          </GuideSection>

          <GuideSection title="claude code vs cursor">
            <CompareTable
              columns={["", "Claude Code", "Cursor"]}
              rows={[
                {
                  label: "shape",
                  cells: ["an agent in a terminal", "an editor you work inside"],
                },
                {
                  label: "where you sit",
                  cells: [
                    "outside the work, reviewing results",
                    "inside the file, accepting suggestions",
                  ],
                },
                {
                  label: "individual price",
                  cells: [
                    `${usd(PLANS.pro.monthly)} a month on Pro`,
                    // Cursor's own number, read off cursor.com/pricing on
                    // 2026-08-27. Deliberately not routed through PLANS, which
                    // is Anthropic's price list: the two happening to match
                    // today is a coincidence, not a shared fact.
                    "$20 a month on Pro",
                  ],
                },
                {
                  label: "free tier",
                  cells: ["none", "Hobby, with limited agent requests"],
                },
                {
                  label: "what else the plan includes",
                  cells: [
                    "claude cowork, claude design, claude science",
                    "the editor, cloud agents, MCPs and hooks",
                  ],
                },
                {
                  label: "also runs in",
                  cells: [
                    "vs code, jetbrains, the web, a desktop app, slack, CI",
                    "its own editor, plus a CLI",
                  ],
                },
                {
                  label: "good for non-code work",
                  cells: [
                    "yes. folders, transcripts, spreadsheets, scripts.",
                    "not really. it is built around a codebase.",
                  ],
                },
                {
                  label: "the honest summary",
                  cells: [
                    "delegate a job, review the result",
                    "write it yourself, faster",
                  ],
                },
              ]}
              caption="prices read off claude.com/pricing and cursor.com/pricing on 2026-08-27. both move."
            />
            <Callout title="the part that decided it for me">
              <p>
                my work is not a codebase. it is folders of transcripts, lead
                spreadsheets, image pipelines and small scripts that call an api.
                an editor has almost nothing to offer that, because there is no
                file i want to sit inside. an agent has everything to offer it.
                if your work looks like mine, this is not a close call, and if
                your work is writing an application by hand, it might go the
                other way.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="claude code vs codex, gemini cli and opencode">
            <p>
              these three are the same shape as claude code: an agent you talk to
              in a terminal that reads and writes files and runs commands. so
              the interface comparison people expect is mostly a non-comparison.
              what actually differs:
            </p>
            <ul>
              <li>
                <strong>the model behind it.</strong> the biggest real
                difference, and the one that moves most often. whichever
                benchmark is winning this month will not be winning in three.
              </li>
              <li>
                <strong>the subscription you already have.</strong> if you pay
                for one of these ecosystems already, the marginal cost of its
                agent is usually zero, and that is a stronger argument than any
                feature.
              </li>
              <li>
                <strong>the ecosystem around it.</strong> skills, sub agents,
                mcp servers, hooks, plugin marketplaces. this is where claude
                code is furthest along today, and it is the thing that compounds
                once you have written a few.
              </li>
              <li>
                <strong>open source or not.</strong> opencode is open, which
                matters if you need to self-host, audit it, or point it at your
                own model.
              </li>
            </ul>
            <p>
              my honest recommendation: <strong>do not choose on
              benchmarks.</strong> choose on which model you already trust for
              your kind of work, and which subscription you already pay for. then
              try the other one for a week in six months, because the ranking
              will have changed.
            </p>
          </GuideSection>

          <GuideSection title="claude vs claude code, which is a different question">
            <p>
              a lot of the search traffic here is not a comparison at all, it is
              someone working out what the products are. three names, one plan:
            </p>
            <CompareTable
              columns={["", "Claude (chat)", "Claude Cowork", "Claude Code"]}
              rows={[
                {
                  label: "you get back",
                  cells: ["an answer", "a finished document", "a changed folder"],
                },
                {
                  label: "where it works",
                  cells: [
                    "a chat window",
                    "your files, apps and a built-in browser",
                    "a terminal, inside a folder",
                  ],
                },
                {
                  label: "best for",
                  cells: [
                    "thinking, drafting, questions",
                    "decks, spreadsheets, reviews, web tasks",
                    "code, scripts, pipelines, bulk file work",
                  ],
                },
                {
                  label: "included in Pro",
                  cells: ["yes", "yes", "yes"],
                },
              ]}
            />
            <p>
              all three come with the same {usd(PLANS.pro.monthly)} plan, so
              this is not a purchase decision, it is a habit decision. there is
              a fuller version of the cowork half on{" "}
              <a href="/claude-cowork">the cowork guide</a>.
            </p>
          </GuideSection>

          <GuideSection title="what claude code is genuinely worse at">
            <p>
              a comparison page with no downsides is an advert. the ones i run
              into:
            </p>
            <ul>
              <li>
                <strong>line-by-line control.</strong> if you want to see and
                approve every character, an editor is simply the right tool and
                claude code will feel like it is running away from you.
              </li>
              <li>
                <strong>the terminal is a real barrier.</strong> not a technical
                one, a psychological one, and pretending otherwise does not help
                anyone. the desktop app and the vs code extension exist partly
                for this.
              </li>
              <li>
                <strong>no free tier.</strong> cursor lets you try the shape for
                nothing. claude code does not, so the first{" "}
                {usd(PLANS.pro.monthly)} is a bet.
              </li>
              <li>
                <strong>long sessions drift.</strong> usage and quality both
                degrade as a conversation grows. you have to build the habit of
                clearing between tasks, and nothing warns you.
              </li>
              <li>
                <strong>it will confidently do the wrong thing.</strong> so will
                all of them. the difference with an agent is that it does more of
                it before you look, which is why plan mode exists and why you
                read the diff.
              </li>
            </ul>
          </GuideSection>

          <GuideSection title="how i would choose">
            <p>in the order i would actually ask the questions:</p>
            <ol className="guide-list">
              <li>
                <strong>is your work a codebase?</strong> if no, you want an
                agent, and most of this comparison collapses.
              </li>
              <li>
                <strong>do you want to review lines or results?</strong> lines
                means an editor. results means an agent.
              </li>
              <li>
                <strong>what do you already pay for?</strong> the marginal cost
                of the agent in an ecosystem you are already in is usually
                nothing.
              </li>
              <li>
                <strong>then stop reading and run both for a week.</strong>{" "}
                {usd(PLANS.pro.monthly)} each, and by friday you will know
                something no comparison page can tell you.
              </li>
            </ol>
            <p>
              if you land on claude code, the setup and the first twenty minutes
              are on{" "}
              <a href="/claude-code-tutorial">the claude code guide</a>, the full
              cost picture is on{" "}
              <a href="/claude-code-pricing">the pricing page</a>, and the{" "}
              <Code>CLAUDE.md</Code> habit is the one thing i would not skip.
            </p>
            <p className="text-silver-muted">
              prices checked at{" "}
              <Out href="https://claude.com/pricing">claude.com/pricing</Out> and{" "}
              <Out href="https://cursor.com/pricing">cursor.com/pricing</Out> on
              2026-08-27. no prices are quoted for codex, gemini cli or opencode
              because i did not verify them on the day, and a wrong price is
              worse than no price.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Code vs Cursor, Codex and the rest",
        description:
          "A practitioner's comparison. The real question is whether you want an editor or an agent, not which product wins. Prices, shapes, what Claude Code is genuinely worse at, and how to decide in a week.",
        url: "https://oleg.ae/claude-code-vs-cursor",
        datePublished: "2026-08-27",
        dateModified: "2026-08-27",
      }}
      boldaneCredit
    />
  );
}
