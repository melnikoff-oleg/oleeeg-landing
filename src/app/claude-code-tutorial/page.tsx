import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
  Block,
  Callout,
  Code,
  CompareTable,
  Guide,
  GuideSection,
  GuideSteps,
  GuideToc,
  KeyFacts,
  Out,
} from "@/components/guide";
import { PLANS, usd } from "@/lib/pricing";

// The hub. Seventeen pages used to declare "Claude Code tutorial" in their
// keywords while no page owned it and src/app had no index for the term at all
// (backlog U-01). This is that page, and it is the parent every claude-* guide
// now breadcrumbs to.
//
// Ubersuggest, US, 2026-08-27: "claude code tutorial" 2,400/SD 20,
// "what is claude code" 8,100/SD 37, "how to use claude code" 6,600/SD 49.
//
// The angle that makes it winnable at DA 3 against Anthropic's own docs: this
// is Claude Code for someone who is not a developer, doing marketing work.
// Nobody with authority is writing that.

const steps = [
  {
    title: "get a paid claude plan",
    content: (
      <div className="space-y-3">
        <p>
          Pro at {usd(PLANS.pro.monthly)} a month is the way in. the free plan
          does not include claude code, which is why the install can work and
          the login still refuse you.
        </p>
      </div>
    ),
  },
  {
    title: "install it",
    content: (
      <div className="space-y-3">
        <p>one line. mac, linux or wsl:</p>
        <pre className="whitespace-pre-wrap rounded-lg border border-hairline bg-navy-raised p-3 font-mono text-xs leading-relaxed text-silver [overflow-wrap:anywhere]">
          {`curl -fsSL https://claude.ai/install.sh | bash`}
        </pre>
        <p>windows powershell:</p>
        <pre className="whitespace-pre-wrap rounded-lg border border-hairline bg-navy-raised p-3 font-mono text-xs leading-relaxed text-silver [overflow-wrap:anywhere]">
          {`irm https://claude.ai/install.ps1 | iex`}
        </pre>
      </div>
    ),
  },
  {
    title: "close the terminal and open a new one",
    content: (
      <div className="space-y-3">
        <p>
          skipping this is the second most common reason people think the
          install failed. then check with{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-[0.9em] text-silver">
            claude --version
          </code>
          .
        </p>
      </div>
    ),
  },
  {
    title: "go to a folder and type claude",
    content: (
      <div className="space-y-3">
        <p>
          it works inside whatever folder you start it in. the first run walks
          you through logging in.
        </p>
      </div>
    ),
  },
  {
    title: "ask it to explain the folder before you ask it to change anything",
    content: (
      <div className="space-y-3">
        <p>
          &quot;what is in this folder and what does it do?&quot; is the right
          first prompt. you learn how it thinks, and it costs nothing if it is
          wrong.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "what claude code is, in plain language",
  "installing it, on any machine",
  "your first twenty minutes",
  "the commands that actually matter",
  "the four ideas that make it click",
  "what i build with it",
  "the mistakes everyone makes first",
];

const guideSteps = [
  {
    title: "get a plan",
    schema:
      "Claude Code requires a paid Claude plan or an API account. Pro at $20 a month is the entry point and includes Claude Cowork too.",
    body: (
      <>
        <p>
          claude code is not free. you need a paid claude plan (Pro at{" "}
          {usd(PLANS.pro.monthly)} a month, Max, Team or Enterprise) or a claude
          console account with credit on it.
        </p>
        <p>
          this trips up almost everyone once, because the install itself works
          perfectly and then the login refuses you. nothing is broken. the full
          cost picture is on <a href="/claude-code-pricing">the pricing page</a>.
        </p>
      </>
    ),
  },
  {
    title: "install it with one line",
    schema:
      "Install with curl -fsSL https://claude.ai/install.sh | bash on macOS, Linux or WSL, or irm https://claude.ai/install.ps1 | iex in Windows PowerShell.",
    body: (
      <>
        <p>open a terminal and paste the line for your machine.</p>
        <Block>{`# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Windows CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`}</Block>
        <p>
          not sure which windows shell you are in? your prompt shows{" "}
          <Code>PS C:\</Code> in powershell and <Code>C:\</Code> in cmd.
        </p>
        <p>
          homebrew (<Code>brew install --cask claude-code</Code>) and winget (
          <Code>winget install Anthropic.ClaudeCode</Code>) both work too, with
          one catch worth knowing: the native install updates itself in the
          background, and the homebrew and winget ones do not. if you install
          that way you have to run the upgrade yourself.
        </p>
      </>
    ),
  },
  {
    title: "close the terminal, open a new one",
    schema:
      "Close the terminal window completely and open a fresh one so the new command is on your PATH, then run claude --version.",
    body: (
      <>
        <p>
          this is not optional and it is the reason half the &quot;command not
          found&quot; comments exist. the terminal reads your PATH when it
          starts, so the window that ran the installer does not know about the
          new command yet.
        </p>
        <p>
          in the new window, <Code>claude --version</Code> should print a number
          followed by <Code>(Claude Code)</Code>.
        </p>
      </>
    ),
  },
  {
    title: "start it in a folder that matters",
    schema:
      "Navigate to the folder you want to work in and run claude. It works inside the folder you start it in.",
    body: (
      <>
        <p>
          claude code works inside the folder you launch it from. so go
          somewhere real first, then type <Code>claude</Code>.
        </p>
        <p>
          if you are not a developer and have no code to point it at, make an
          empty folder for the thing you actually want. i started mine as a
          folder with a text file describing my content process, and everything
          since has grown out of that.
        </p>
      </>
    ),
  },
  {
    title: "ask before you tell",
    schema:
      "Make your first prompt a question about the folder, not an instruction, so you can see how it reasons before it changes anything.",
    body: (
      <>
        <p>
          the first prompt should be a question, not a job. &quot;what is in
          this folder and what does it do?&quot;
        </p>
        <p>
          two reasons. you find out how it explains things, which tells you how
          much context it needs from you. and if it is wrong, nothing has
          happened yet.
        </p>
      </>
    ),
  },
  {
    title: "write down how you work, once",
    schema:
      "Create a CLAUDE.md file in the folder describing what the project is and how you want it done, so you stop repeating yourself every session.",
    body: (
      <>
        <p>
          make a file called <Code>CLAUDE.md</Code> in the folder. put in it
          what this project is, how you want things done, and anything you have
          found yourself saying twice.
        </p>
        <p>
          claude code reads it at the start of every session. this is the single
          highest-leverage thing on this page: it is the difference between a
          clever assistant you re-brief daily, and something that already knows
          how you work.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "what is claude code",
    a: "Claude Code is Anthropic's agent that runs in your terminal and works directly on the files in a folder. Instead of answering a question in a chat window, it reads your files, edits them, runs commands and checks whether what it did worked. It is also available as a desktop app, in VS Code and JetBrains, on the web, in Slack, and in CI through GitHub Actions.",
  },
  {
    q: "is claude code only for developers",
    a: "No, and that is the most useful thing to know about it. It edits files and runs commands, and most work that is not coding is also files and commands: spreadsheets, transcripts, folders of images, scripts that call an API. Everything on this site was built with it by someone doing marketing, not engineering. The barrier is being willing to use a terminal, not knowing how to program.",
  },
  {
    q: "how do i install claude code",
    a: "One line. On macOS, Linux or WSL run curl -fsSL https://claude.ai/install.sh | bash. In Windows PowerShell run irm https://claude.ai/install.ps1 | iex. Then close the terminal completely, open a new one, and run claude --version to check. Homebrew and WinGet also work but do not auto-update.",
  },
  {
    q: "why does it say command not found claude",
    a: "Almost always one of two things. Either you did not open a fresh terminal after installing, so the window does not know about the new command yet, or you installed the VS Code extension rather than Claude Code itself: the extension keeps a private copy for its own panel and does not give you the terminal command. On a Mac you may also need to add $HOME/.local/bin to your PATH.",
  },
  {
    q: "what is the difference between claude code and claude chat",
    a: "Chat answers you and you do the work. Claude Code does the work. It has your files, it can run commands, and it checks its own results, so the output is a changed folder rather than text you have to copy somewhere. If the job ends with you pasting an answer into something, chat is enough. If it ends with a file being different, that is Claude Code.",
  },
  {
    q: "what is a CLAUDE.md file",
    a: "A plain markdown file in your project folder that Claude Code reads at the start of every session. You put in it what the project is, how you want things done, and anything you have caught yourself explaining twice. It is the highest-leverage five minutes you can spend, because it turns a general assistant into one that already knows your rules.",
  },
  {
    q: "is claude code better than cursor",
    a: "They are different shapes rather than better and worse. Cursor is an editor you work inside, so it suits writing code by hand with help. Claude Code is an agent you delegate to, so it suits handing over a whole task and reviewing the result. For non-coding work like content pipelines and research, Claude Code fits better because the work is folders and commands rather than a codebase in an editor.",
  },
];

// The hub's whole job: link down to every guide in the cluster so the term has
// a centre and the children have a parent.
const CLUSTER = [
  { href: "/claude-marketing", label: "claude code for marketing", note: "the overview: smm, ads and outreach in one workspace" },
  { href: "/claude-content", label: "content creation in 10 minutes", note: "ten pieces of content, images included, in one run" },
  { href: "/claude-reels", label: "viral instagram reels", note: "study what already worked, then write from it" },
  { href: "/claude-code-instagram", label: "claude code as a video editor", note: "cutting the reel, not writing it" },
  { href: "/claude-tiktok", label: "viral tiktok videos", note: "the tiktok version of the same pipeline" },
  { href: "/claude-twitter", label: "an x/twitter content machine", note: "posts plus generated infographics" },
  { href: "/claude-social-growth", label: "social media growth", note: "the system that decides what to post next" },
  { href: "/claude-b2b-outreach", label: "b2b outreach, 35% reply rate", note: "research, write, review, send" },
  { href: "/claude-cowork-outreach", label: "linkedin outreach with cowork", note: "the browser-driving version" },
  { href: "/claude-code-second-brain", label: "a second brain in obsidian", note: "notes that answer back" },
  { href: "/claude-code-ads", label: "video ads", note: "concept to cut" },
  { href: "/high-converting-website", label: "a high-converting landing page", note: "the kit i built boldane.com with" },
];

export default function ClaudeCodeTutorialPage() {
  return (
    <ResourcePageShell
      slug="claude-code-tutorial"
      repoCta={{
        href: "https://claude.com/claude-code",
        label: "get claude code",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="claude code"
      title="claude code, for people who are not developers"
      subhead="i am not an engineer any more, i run marketing, and claude code is the thing i use all day. here is what it is, how to install it, and the four ideas that make it click. no codebase required."
      steps={steps}
      troubleshooting={["claudeNotFound", "costs", "skipPermissions", "creditBalance"]}
      breadcrumb={[{ name: "Claude Code", path: "/claude-code-tutorial" }]}
      howTo={{
        name: "How to install and start using Claude Code",
        description:
          "Get a paid Claude plan, install Claude Code with one command, start it in a folder, and set up a CLAUDE.md so it knows how you work.",
        totalTime: "PT20M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="what claude code is, in plain language">
            <p>
              claude code is claude with your files open. it runs in a terminal,
              it works inside whatever folder you start it in, and instead of
              telling you what to do it goes and does it, then checks whether
              what it did worked.
            </p>
            <p>
              the name is the problem. it says code, so everyone who is not a
              programmer assumes it is not for them, and that is wrong in a way
              that costs people a lot. <strong>most work that is not coding is
              also files and commands.</strong> a folder of transcripts. a
              spreadsheet of leads. two hundred images that need renaming. a
              script that calls an api and writes the result somewhere. all of
              that is exactly what it is good at.
            </p>
            <p>
              everything on this site was built with it by someone doing
              marketing. the barrier is being willing to open a terminal, not
              knowing how to program.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="installing it, on any machine">
            <KeyFacts
              rows={[
                { label: "what you need", value: `a paid claude plan from ${usd(PLANS.pro.monthly)} a month, or an api account` },
                { label: "operating system", value: "macos 13+, windows 10 1809+, ubuntu 20.04+, debian 10+, alpine 3.19+" },
                { label: "hardware", value: "4 GB of ram, x64 or arm64" },
                { label: "time", value: "about five minutes, most of it waiting" },
                { label: "also available as", value: "a desktop app, in vs code and jetbrains, on the web, in slack, and in ci" },
              ]}
              caption="from anthropic's setup docs, read 2026-08-27."
            />
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="your first twenty minutes">
            <p>
              a sequence that works, in the order that gets you to something
              real fastest.
            </p>
            <ol className="guide-list">
              <li>
                <strong>ask it what is in the folder.</strong> you are testing
                how it explains, not what it knows.
              </li>
              <li>
                <strong>ask it to make one small change</strong> you could check
                by eye in ten seconds. rename something. fix a typo across five
                files.
              </li>
              <li>
                <strong>ask it to do something you would have to look up.</strong>{" "}
                convert a folder of images. pull the numbers out of a csv into a
                summary. this is where it stops being a demo.
              </li>
              <li>
                <strong>write your <Code>CLAUDE.md</Code>.</strong> five
                minutes, and every session after this one is better for it.
              </li>
              <li>
                <strong>give it something real and walk away.</strong> come back
                and read what it did.
              </li>
            </ol>
            <Callout title="the one habit worth forming on day one">
              <p>
                read what it changed before you accept it. not forever, just
                until you have a feel for where it is reliable and where it
                guesses. that calibration is the whole skill, and you cannot get
                it by reading about it.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="the commands that actually matter">
            <p>
              there are a lot. these are the ones i use every day, and the rest
              you can meet when you need them.
            </p>
            <CompareTable
              columns={["command", "what it does", "when i reach for it"]}
              rows={[
                {
                  label: "/clear",
                  cells: [
                    "throws away the conversation so far",
                    "every time i switch to an unrelated task. keeps answers sharp and the bill small.",
                  ],
                },
                {
                  label: "/usage",
                  cells: [
                    "shows what this session and this month have used",
                    "once a week, and any time something feels slow",
                  ],
                },
                {
                  label: "/model",
                  cells: [
                    "switches which model is answering",
                    "down to a cheaper one for routine editing, up for anything that needs judgement",
                  ],
                },
                {
                  label: "plan mode",
                  cells: [
                    "makes it write the plan before touching anything",
                    "anything that will change more than a couple of files",
                  ],
                },
                {
                  label: "/doctor",
                  cells: [
                    "prints a health report on the install",
                    "first thing when something is broken and i do not know why",
                  ],
                },
                {
                  label: "/help",
                  cells: ["lists everything else", "more often than i expected to"],
                },
              ]}
            />
          </GuideSection>

          <GuideSection title="the four ideas that make it click">
            <p>
              people who get value out of claude code and people who bounce off
              it are usually separated by these four, not by technical skill.
            </p>
            <p>
              <strong>1. context is the product.</strong> the quality of what you
              get back is decided almost entirely by what it can see. naming the
              three files that matter beats letting it search the whole folder,
              and it is cheaper. carrying an old conversation into a new problem
              makes the answers worse, not better, which is what{" "}
              <Code>/clear</Code> is for.
            </p>
            <p>
              <strong>2. <Code>CLAUDE.md</Code> is where you stop repeating
              yourself.</strong> a file in the folder that it reads every
              session. what this project is, how you want it done, the rules
              that are not obvious. anything you have explained twice belongs
              there instead.
            </p>
            <p>
              <strong>3. plan first on anything that matters.</strong> ask for
              the plan before the work. you get to correct a paragraph instead of
              a day of edits, and it is the cheapest review you will ever do.
            </p>
            <p>
              <strong>4. it is a delegation habit, not a typing habit.</strong>{" "}
              the failure mode is treating it like autocomplete and staying in
              the loop for every keystroke. the win is handing over a whole job,
              going and doing something else, and reviewing the result. that
              feels wrong for about a week and then it does not.
            </p>
            <p>
              past those four there are skills (reusable instructions it loads
              on demand), sub agents (separate workers for separate parts of a
              job), mcp servers (connections to outside services) and hooks
              (things that run automatically at certain points). none of them
              matter until the four above are habits.
            </p>
          </GuideSection>

          <GuideSection title="what i build with it">
            <p>
              every guide below is a real system i run, written out in full so
              you can rebuild it without watching anything. they are the answer
              to &quot;fine, but what do i actually do with it&quot;.
            </p>
            <ul>
              {CLUSTER.map((c) => (
                <li key={c.href}>
                  <a href={c.href}>{c.label}</a>: {c.note}
                </li>
              ))}
            </ul>
            <p>
              and if the job is a document rather than a repository,{" "}
              <a href="/claude-cowork">claude cowork</a> is the other half of
              the same plan.
            </p>
          </GuideSection>

          <GuideSection title="the mistakes everyone makes first">
            <ul>
              <li>
                <strong>installing the vs code extension and expecting the{" "}
                <Code>claude</Code> command.</strong> the extension keeps a
                private copy for its own panel. install claude code itself.
              </li>
              <li>
                <strong>not opening a fresh terminal after installing.</strong>{" "}
                the old window does not know about the new command.
              </li>
              <li>
                <strong>expecting the free plan to work.</strong> it installs and
                then will not sign you in, which reads as a bug and is not one.
              </li>
              <li>
                <strong>letting one session run all day.</strong> the
                conversation becomes input on every turn, so it gets slower,
                more expensive and less accurate at the same time.
              </li>
              <li>
                <strong>skipping permission prompts to go faster.</strong> the
                prompts are the only thing standing between a misunderstanding
                and a deleted folder. read them until you have a feel for it.
              </li>
              <li>
                <strong>never writing a <Code>CLAUDE.md</Code>.</strong> the
                most common one, and the most expensive.
              </li>
            </ul>
            <p>
              the errors people actually hit, taken from the comments under my
              videos, are answered in the troubleshooting section above. what it
              costs, including anthropic&apos;s own figures for what real usage
              runs to, is on{" "}
              <a href="/claude-code-pricing">the pricing page</a>. and if you are
              still deciding between this and an editor, the{" "}
              <a href="/claude-code-vs-cursor">comparison</a> is next door.
            </p>
            <p className="text-silver-muted">
              install commands and system requirements checked against{" "}
              <Out href="https://code.claude.com/docs/en/quickstart">
                anthropic&apos;s own quickstart
              </Out>{" "}
              on 2026-08-27.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Code tutorial for people who are not developers",
        description:
          "What Claude Code is, how to install it on any machine, your first twenty minutes, the commands that matter, and the four ideas that separate people who get value from it from people who bounce off it.",
        url: "https://oleg.ae/claude-code-tutorial",
        datePublished: "2026-08-27",
        dateModified: "2026-08-27",
      }}
      boldaneCta={
        <>
          claude code will build you the system. it will not tell you what you
          should be known for. <BoldaneLink /> does that half for founders with
          real expertise, from one hour of talking a week.
        </>
      }
    />
  );
}
