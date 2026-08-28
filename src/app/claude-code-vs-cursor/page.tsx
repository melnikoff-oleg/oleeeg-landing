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

// Ubersuggest, US, 2026-08-27: "Claude Code vs cursor" 8,100/SD 30,
// "Cursor vs Claude Code" 6,600/SD 28, "Codex vs Claude Code" 6,600/SD 23,
// "Claude Code vs codex" 3,600/SD 14, "Opencode vs Claude Code" 2,900/SD 22,
// "Gemini CLI vs Claude Code" 1,900/SD 16, "Claude vs Claude Code" 1,600/SD 27.
// About 25,000 searches a month across the cluster, most of it low difficulty.
//
// The page states its bias in the first paragraph on purpose. A comparison
// written by someone who obviously uses one of the options and pretends not to
// is worth nothing, and readers can tell.

const steps = [
  {
    title: "If you write code by hand and want help",
    content: (
      <div className="space-y-3">
        <p>
          Pick an editor: Cursor. You stay in the file, it helps at the cursor,
          you accept or reject line by line.
        </p>
      </div>
    ),
  },
  {
    title: "If you want to hand over the whole job",
    content: (
      <div className="space-y-3">
        <p>
          Pick an agent: Claude Code. You describe an outcome, walk away, and
          review what changed.
        </p>
      </div>
    ),
  },
  {
    title: "If the work is not code at all",
    content: (
      <div className="space-y-3">
        <p>
          Claude Code, or Claude Cowork. An editor built around a codebase has
          nothing to offer a folder of transcripts.
        </p>
      </div>
    ),
  },
  {
    title: "If you cannot decide",
    content: (
      <div className="space-y-3">
        <p>
          Run both for a week. They are {usd(PLANS.pro.monthly)} each and the
          answer is obvious by friday. This is a cheap question to settle by
          doing.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "The honest disclosure first",
  "Editor or agent, which is the real question",
  "Claude Code vs Cursor",
  "Claude Code vs Codex, Gemini CLI and OpenCode",
  "Claude vs Claude Code, which is a different question",
  "What Claude Code is genuinely worse at",
  "How I would choose",
];

const faq = [
  {
    q: "Is Claude Code better than cursor",
    a: "They are different shapes, not different quality. Cursor is an editor: you are in the file and it helps where your cursor is, which suits writing code by hand. Claude Code is an agent: you describe an outcome and review what changed, which suits handing over a whole task. If your work is not a codebase at all, Claude Code fits better because it is folders and commands rather than an editor.",
  },
  {
    q: "What is the difference between Claude Code and cursor",
    a: "Where you sit. In Cursor you sit in the editor and the AI comes to you; you accept or reject its suggestions as you write. In Claude Code you sit outside and delegate; it reads the files, makes the changes, runs the commands and reports back. Cursor keeps you in the loop by default, Claude Code takes you out of it by default, and that single difference explains almost every other one.",
  },
  {
    q: "How much do Claude Code and cursor cost",
    a: "Both are $20 a month for the individual plan. Cursor also has a free Hobby tier with limited agent requests, and higher Pro+ and Ultra tiers. Claude has no free tier for Claude Code, but the $20 Pro plan also includes Claude Cowork, Claude Design and Claude Science, so you are paying once for several products rather than one.",
  },
  {
    q: "Claude Code vs codex, which is better",
    a: "Both are terminal agents with the same basic shape, so the honest answer is that the difference is the model behind them and the ecosystem around them rather than the interface. Pick based on which model you already trust for your kind of work, and which subscription you already pay for. Anyone telling you one is decisively better is usually selling something or benchmarking on a task that is not yours.",
  },
  {
    q: "Is Claude Code worth it if I am not a developer",
    a: "Yes, and it is the case people miss. The name says code, but the thing it actually does is read and write files and run commands, and most non-coding work is also files and commands: transcripts, spreadsheets, image folders, scripts that call an API. Every system on this site was built with it by someone doing marketing. An editor like Cursor has much less to offer that work, because there is no codebase to sit inside.",
  },
  {
    q: "What is the difference between Claude and Claude Code",
    a: "Claude is the chat: you ask, it answers, you go and do something with the answer. Claude Code is an agent with your files: it does the thing and the output is a changed folder rather than text to copy. Claude Cowork sits between them, handling whole office tasks like documents and spreadsheets. All three are included in the same $20 Pro plan.",
  },
  {
    q: "Can I use Claude Code and cursor together",
    a: "Yes, and plenty of people do, because they solve different halves. Cursor for the hour where you are writing something delicate by hand, Claude Code for the job you would rather hand over and review. There is a Claude Code extension for VS Code and JetBrains if you want the agent inside an editor rather than in a terminal.",
  },
];

export default function ClaudeCodeVsCursorPage() {
  return (
    <ResourcePageShell
      slug="claude-code-vs-cursor"
      repoCta={{
        href: "https://claude.com/claude-code",
        label: "Get Claude Code",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="comparison"
      title="Claude Code vs Cursor, Codex and the rest"
      subhead="I use Claude Code every day, so read this as a practitioner's view rather than a neutral benchmark. The useful question is not which is better, it is whether you want an editor or an agent."
      steps={steps}
      troubleshooting={["costs"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Comparisons", path: "/claude-code-vs-cursor" },
      ]}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="The honest disclosure first">
            <p>
              I use Claude Code all day and I built everything on this site with
              it. That is a bias, so here it is at the top rather than buried.
            </p>
            <p>What this page does not do:</p>
            <ul>
              <li>
                <strong>No benchmark numbers.</strong> The public ones move
                every few weeks and none of them are measured on your work.
              </li>
              <li>
                <strong>No claim that one wins.</strong> The two most popular
                options here are not the same kind of thing, so &quot;which is
                better&quot; is the wrong question.
              </li>
              <li>
                <strong>No competitor prices I have not checked.</strong> The two
                below were read off the vendors&apos; own pages on 2026-08-27.
              </li>
            </ul>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="Editor or agent, which is the real question">
            <p>
              Almost every comparison in this space is really one distinction
              wearing different logos. Some of these products put the AI inside
              the place you work. Others put the work inside the AI.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "An editor with AI",
                  value:
                    "You are in the file. It suggests, completes and edits around your cursor. You accept or reject as you go. Cursor, and every ide with a copilot in it.",
                },
                {
                  label: "An agent",
                  value:
                    "You are outside. You describe an outcome, it reads and changes files, runs commands, checks results, reports back. Claude Code, codex, Gemini CLI, opencode.",
                },
                {
                  label: "How to tell which you want",
                  value:
                    "Do you want to watch every line change, or do you want to review the finished thing? That is the whole decision.",
                },
              ]}
            />
            <p>
              This matters because it predicts who is happy. People who like
              being in control of every line find agents unnerving. People who
              want their afternoon back find editors exhausting. Neither is
              wrong, and it is much easier to answer about yourself than to
              answer from a feature table.
            </p>
          </GuideSection>

          <GuideSection title="Claude Code vs Cursor">
            <CompareTable
              columns={["", "Claude Code", "Cursor"]}
              rows={[
                {
                  label: "Shape",
                  cells: ["An agent in a terminal", "An editor you work inside"],
                },
                {
                  label: "Where you sit",
                  cells: [
                    "Outside the work, reviewing results",
                    "Inside the file, accepting suggestions",
                  ],
                },
                {
                  label: "Individual price",
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
                  label: "Free tier",
                  cells: ["none", "Hobby, with limited agent requests"],
                },
                {
                  label: "What else the plan includes",
                  cells: [
                    "Claude Cowork, Claude design, Claude science",
                    "The editor, cloud agents, MCPs and hooks",
                  ],
                },
                {
                  label: "Also runs in",
                  cells: [
                    "Vs code, jetbrains, the web, a desktop app, slack, CI",
                    "Its own editor, plus a CLI",
                  ],
                },
                {
                  label: "Good for non-code work",
                  cells: [
                    "Yes. Folders, transcripts, spreadsheets, scripts.",
                    "Not really. It is built around a codebase.",
                  ],
                },
                {
                  label: "The honest summary",
                  cells: [
                    "Delegate a job, review the result",
                    "Write it yourself, faster",
                  ],
                },
              ]}
              caption="Prices read off Claude.com/pricing and Cursor.com/pricing on 2026-08-27. Both move."
            />
            <Callout title="The part that decided it for me">
              <p>
                My work is not a codebase. It is folders of transcripts, lead
                spreadsheets, image pipelines and small scripts that call an API.
                An editor has almost nothing to offer that, because there is no
                file I want to sit inside. An agent has everything to offer it.
                If your work looks like mine, this is not a close call, and if
                your work is writing an application by hand, it might go the
                other way.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="Claude Code vs Codex, Gemini CLI and opencode">
            <p>
              These three are the same shape as Claude Code: an agent you talk to
              in a terminal that reads and writes files and runs commands. So
              the interface comparison people expect is mostly a non-comparison.
              What actually differs:
            </p>
            <ul>
              <li>
                <strong>The model behind it.</strong> The biggest real
                difference, and the one that moves most often. Whichever
                benchmark is winning this month will not be winning in three.
              </li>
              <li>
                <strong>The subscription you already have.</strong> If you pay
                for one of these ecosystems already, the marginal cost of its
                agent is usually zero, and that is a stronger argument than any
                feature.
              </li>
              <li>
                <strong>The ecosystem around it.</strong> Skills, sub agents,
                MCP servers, hooks, plugin marketplaces. This is where Claude Code is furthest along today, and it is the thing that compounds
                once you have written a few.
              </li>
              <li>
                <strong>Open source or not.</strong> Opencode is open, which
                matters if you need to self-host, audit it, or point it at your
                own model.
              </li>
            </ul>
            <p>
              My honest recommendation: <strong>Do not choose on
              benchmarks.</strong> Choose on which model you already trust for
              your kind of work, and which subscription you already pay for. Then
              try the other one for a week in six months, because the ranking
              will have changed.
            </p>
          </GuideSection>

          <GuideSection title="Claude vs Claude Code, which is a different question">
            <p>
              A lot of the search traffic here is not a comparison at all, it is
              someone working out what the products are. Three names, one plan:
            </p>
            <CompareTable
              columns={["", "Claude (chat)", "Claude Cowork", "Claude Code"]}
              rows={[
                {
                  label: "You get back",
                  cells: ["an answer", "A finished document", "A changed folder"],
                },
                {
                  label: "Where it works",
                  cells: [
                    "A chat window",
                    "Your files, apps and a built-in browser",
                    "A terminal, inside a folder",
                  ],
                },
                {
                  label: "Best for",
                  cells: [
                    "Thinking, drafting, questions",
                    "Decks, spreadsheets, reviews, web tasks",
                    "Code, scripts, pipelines, bulk file work",
                  ],
                },
                {
                  label: "Included in Pro",
                  cells: ["yes", "yes", "yes"],
                },
              ]}
            />
            <p>
              All three come with the same {usd(PLANS.pro.monthly)} plan, so
              this is not a purchase decision, it is a habit decision. There is
              a fuller version of the cowork half on{" "}
              <a href="/claude-cowork">The cowork guide</a>.
            </p>
          </GuideSection>

          <GuideSection title="What Claude Code is genuinely worse at">
            <p>
              A comparison page with no downsides is an advert. The ones I run
              into:
            </p>
            <ul>
              <li>
                <strong>Line-by-line control.</strong> If you want to see and
                approve every character, an editor is simply the right tool and
                Claude Code will feel like it is running away from you.
              </li>
              <li>
                <strong>The terminal is a real barrier.</strong> Not a technical
                one, a psychological one, and pretending otherwise does not help
                anyone. The desktop app and the VS Code extension exist partly
                for this.
              </li>
              <li>
                <strong>No free tier.</strong> Cursor lets you try the shape for
                nothing. Claude Code does not, so the first{" "}
                {usd(PLANS.pro.monthly)} is a bet.
              </li>
              <li>
                <strong>Long sessions drift.</strong> Usage and quality both
                degrade as a conversation grows. You have to build the habit of
                clearing between tasks, and nothing warns you.
              </li>
              <li>
                <strong>It will confidently do the wrong thing.</strong> So will
                all of them. The difference with an agent is that it does more of
                it before you look, which is why plan mode exists and why you
                read the diff.
              </li>
            </ul>
          </GuideSection>

          <GuideSection title="How I would choose">
            <p>In the order I would actually ask the questions:</p>
            <ol className="guide-list">
              <li>
                <strong>Is your work a codebase?</strong> If no, you want an
                agent, and most of this comparison collapses.
              </li>
              <li>
                <strong>Do you want to review lines or results?</strong> Lines
                means an editor. Results means an agent.
              </li>
              <li>
                <strong>What do you already pay for?</strong> The marginal cost
                of the agent in an ecosystem you are already in is usually
                nothing.
              </li>
              <li>
                <strong>Then stop reading and run both for a week.</strong>{" "}
                {usd(PLANS.pro.monthly)} each, and by friday you will know
                something no comparison page can tell you.
              </li>
            </ol>
            <p>
              If you land on Claude Code, the setup and the first twenty minutes
              are on{" "}
              <a href="/claude-code-tutorial">The Claude Code guide</a>, the full
              cost picture is on{" "}
              <a href="/claude-code-pricing">The pricing page</a>, and the{" "}
              <Code>CLAUDE.md</Code> habit is the one thing I would not skip.
            </p>
            <p className="text-silver-muted">
              Prices checked at{" "}
              <Out href="https://claude.com/pricing">claude.com/pricing</Out> and{" "}
              <Out href="https://cursor.com/pricing">cursor.com/pricing</Out> on
              2026-08-27. no prices are quoted for codex, gemini CLI or opencode
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
