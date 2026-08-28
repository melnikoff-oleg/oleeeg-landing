import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
  Answer,
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
// Ubersuggest, US, 2026-08-27: "Claude Code tutorial" 2,400/SD 20,
// "What is Claude Code" 8,100/SD 37, "How to use Claude Code" 6,600/SD 49.
//
// The angle that makes it winnable at DA 3 against Anthropic's own docs: this
// is Claude Code for someone who is not a developer, doing marketing work.
// Nobody with authority is writing that.

const steps = [
  {
    title: "Get a paid Claude plan",
    content: (
      <div className="space-y-3">
        <p>
          Pro at {usd(PLANS.pro.monthly)} a month is the way in. The free plan
          does not include Claude Code, which is why the install can work and
          the login still refuse you.
        </p>
      </div>
    ),
  },
  {
    title: "Install it",
    content: (
      <div className="space-y-3">
        <p>One line. Mac, Linux or WSL:</p>
        <pre className="whitespace-pre-wrap rounded-lg border border-hairline bg-navy-raised p-3 font-mono text-xs leading-relaxed text-silver [overflow-wrap:anywhere]">
          {`curl -fsSL https://claude.ai/install.sh | bash`}
        </pre>
        <p>Windows PowerShell:</p>
        <pre className="whitespace-pre-wrap rounded-lg border border-hairline bg-navy-raised p-3 font-mono text-xs leading-relaxed text-silver [overflow-wrap:anywhere]">
          {`irm https://claude.ai/install.ps1 | iex`}
        </pre>
      </div>
    ),
  },
  {
    title: "Close the terminal and open a new one",
    content: (
      <div className="space-y-3">
        <p>
          Skipping this is the second most common reason people think the
          install failed. Then check with{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-[0.9em] text-silver">
            claude --version
          </code>
          .
        </p>
      </div>
    ),
  },
  {
    title: "Go to a folder and type Claude",
    content: (
      <div className="space-y-3">
        <p>
          It works inside whatever folder you start it in. The first run walks
          you through logging in.
        </p>
      </div>
    ),
  },
  {
    title: "Ask it to explain the folder before you ask it to change anything",
    content: (
      <div className="space-y-3">
        <p>
          &quot;what is in this folder and what does it do?&quot; is the right
          first prompt. You learn how it thinks, and it costs nothing if it is
          wrong.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "What Claude Code is, in plain language",
  "Installing it, on any machine",
  "Your first twenty minutes",
  "The commands that actually matter",
  "The four ideas that make it click",
  "What I build with it",
  "The mistakes everyone makes first",
];

const guideSteps = [
  {
    title: "Get a plan",
    schema:
      "Claude Code requires a paid Claude plan or an API account. Pro at $20 a month is the entry point and includes Claude Cowork too.",
    body: (
      <>
        <p>
          Claude Code is not free. You need a paid Claude plan (Pro at{" "}
          {usd(PLANS.pro.monthly)} a month, Max, Team or Enterprise) or a Claude
          console account with credit on it.
        </p>
        <p>
          This trips up almost everyone once, because the install itself works
          perfectly and then the login refuses you. Nothing is broken. The full
          cost picture is on <a href="/claude-code-pricing">The pricing page</a>.
        </p>
      </>
    ),
  },
  {
    title: "Install it with one line",
    schema:
      "Install with curl -fsSL https://claude.ai/install.sh | bash on macOS, Linux or WSL, or irm https://claude.ai/install.ps1 | iex in Windows PowerShell.",
    body: (
      <>
        <p>Open a terminal and paste the line for your machine.</p>
        <Block>{`# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Windows CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`}</Block>
        <p>
          Not sure which windows shell you are in? Your prompt shows{" "}
          <Code>PS C:\</Code> in PowerShell and <Code>C:\</Code> in cmd.
        </p>
        <p>
          Homebrew (<Code>brew install --cask claude-code</Code>) and winget (
          <Code>winget install Anthropic.ClaudeCode</Code>) both work too, with
          one catch worth knowing: the native install updates itself in the
          background, and the homebrew and winget ones do not. If you install
          that way you have to run the upgrade yourself.
        </p>
      </>
    ),
  },
  {
    title: "Close the terminal, open a new one",
    schema:
      "Close the terminal window completely and open a fresh one so the new command is on your PATH, then run claude --version.",
    body: (
      <>
        <p>
          This is not optional and it is the reason half the &quot;command not
          found&quot; comments exist. The terminal reads your PATH when it
          starts, so the window that ran the installer does not know about the
          new command yet.
        </p>
        <p>
          In the new window, <Code>claude --version</Code> should print a number
          followed by <Code>(Claude Code)</Code>.
        </p>
      </>
    ),
  },
  {
    title: "Start it in a folder that matters",
    schema:
      "Navigate to the folder you want to work in and run claude. It works inside the folder you start it in.",
    body: (
      <>
        <p>
          Claude Code works inside the folder you launch it from. So go
          somewhere real first, then type <Code>claude</Code>.
        </p>
        <p>
          If you are not a developer and have no code to point it at, make an
          empty folder for the thing you actually want. I started mine as a
          folder with a text file describing my content process, and everything
          since has grown out of that.
        </p>
      </>
    ),
  },
  {
    title: "Ask before you tell",
    schema:
      "Make your first prompt a question about the folder, not an instruction, so you can see how it reasons before it changes anything.",
    body: (
      <>
        <p>
          The first prompt should be a question, not a job. &quot;what is in
          this folder and what does it do?&quot;
        </p>
        <p>
          Two reasons. You find out how it explains things, which tells you how
          much context it needs from you. And if it is wrong, nothing has
          happened yet.
        </p>
      </>
    ),
  },
  {
    title: "Write down how you work, once",
    schema:
      "Create a CLAUDE.md file in the folder describing what the project is and how you want it done, so you stop repeating yourself every session.",
    body: (
      <>
        <p>
          Make a file called <Code>CLAUDE.md</Code> in the folder. Put in it
          what this project is, how you want things done, and anything you have
          found yourself saying twice.
        </p>
        <p>
          Claude Code reads it at the start of every session. This is the single
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
    q: "What is Claude Code",
    a: "Claude Code is Anthropic's agent that runs in your terminal and works directly on the files in a folder. Instead of answering a question in a chat window, it reads your files, edits them, runs commands and checks whether what it did worked. It is also available as a desktop app, in VS Code and JetBrains, on the web, in Slack, and in CI through GitHub Actions.",
  },
  {
    q: "Is Claude Code only for developers",
    a: "No, and that is the most useful thing to know about it. It edits files and runs commands, and most work that is not coding is also files and commands: spreadsheets, transcripts, folders of images, scripts that call an API. Everything on this site was built with it by someone doing marketing, not engineering. The barrier is being willing to use a terminal, not knowing how to program.",
  },
  {
    q: "How do I install Claude Code",
    a: "One line. On macOS, Linux or WSL run curl -fsSL https://claude.ai/install.sh | bash. In Windows PowerShell run irm https://claude.ai/install.ps1 | iex. Then close the terminal completely, open a new one, and run claude --version to check. Homebrew and WinGet also work but do not auto-update.",
  },
  {
    q: "Why does it say command not found Claude",
    a: "Almost always one of two things. Either you did not open a fresh terminal after installing, so the window does not know about the new command yet, or you installed the VS Code extension rather than Claude Code itself: the extension keeps a private copy for its own panel and does not give you the terminal command. On a Mac you may also need to add $HOME/.local/bin to your PATH.",
  },
  {
    q: "What is the difference between Claude Code and Claude chat",
    a: "Chat answers you and you do the work. Claude Code does the work. It has your files, it can run commands, and it checks its own results, so the output is a changed folder rather than text you have to copy somewhere. If the job ends with you pasting an answer into something, chat is enough. If it ends with a file being different, that is Claude Code.",
  },
  {
    q: "What is a CLAUDE.md file",
    a: "A plain markdown file in your project folder that Claude Code reads at the start of every session. You put in it what the project is, how you want things done, and anything you have caught yourself explaining twice. It is the highest-leverage five minutes you can spend, because it turns a general assistant into one that already knows your rules.",
  },
  {
    q: "Is Claude Code better than cursor",
    a: "They are different shapes rather than better and worse. Cursor is an editor you work inside, so it suits writing code by hand with help. Claude Code is an agent you delegate to, so it suits handing over a whole task and reviewing the result. For non-coding work like content pipelines and research, Claude Code fits better because the work is folders and commands rather than a codebase in an editor.",
  },
];

// The hub's whole job: link down to every guide in the cluster so the term has
// a centre and the children have a parent.
const CLUSTER = [
  { href: "/claude-marketing", label: "Claude Code for marketing", note: "The overview: SMM, ads and outreach in one workspace" },
  { href: "/claude-content", label: "Content creation in 10 minutes", note: "Ten pieces of content, images included, in one run" },
  { href: "/claude-reels", label: "Viral Instagram reels", note: "Study what already worked, then write from it" },
  { href: "/claude-code-instagram", label: "Claude Code as a video editor", note: "Cutting the reel, not writing it" },
  { href: "/claude-tiktok", label: "Viral TikTok videos", note: "The TikTok version of the same pipeline" },
  { href: "/claude-twitter", label: "An X/Twitter content machine", note: "Posts plus generated infographics" },
  { href: "/claude-social-growth", label: "Social media growth", note: "The system that decides what to post next" },
  { href: "/claude-b2b-outreach", label: "B2b outreach, 35% reply rate", note: "Research, write, review, send" },
  { href: "/claude-cowork-outreach", label: "LinkedIn outreach with cowork", note: "The browser-driving version" },
  { href: "/claude-code-second-brain", label: "A second brain in Obsidian", note: "Notes that answer back" },
  { href: "/claude-code-ads", label: "Video ads", note: "Concept to cut" },
  { href: "/high-converting-website", label: "A high-converting landing page", note: "The kit I built boldane.com with" },
];

export default function ClaudeCodeTutorialPage() {
  return (
    <ResourcePageShell
      slug="claude-code-tutorial"
      repoCta={{
        href: "https://claude.com/claude-code",
        label: "Get Claude Code",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="Claude Code"
      title="Claude Code, for people who are not developers"
      subhead="I am not an engineer any more, i run marketing, and Claude Code is the thing i use all day. Here is what it is, how to install it, and the four ideas that make it click. No codebase required."
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
          <GuideSection title="What Claude Code is, in plain language">
            <Answer>
              Claude Code is Claude with your files open. It runs in a terminal,
              it works inside whatever folder you start it in, and instead of
              telling you what to do it goes and does it, then checks whether
              what it did worked.
            </Answer>
            <p>
              The name is the problem. It says code, so everyone who is not a
              programmer assumes it is not for them, and that is wrong in a way
              that costs people a lot. <strong>Most work that is not coding is
              also files and commands.</strong> A folder of transcripts. A
              spreadsheet of leads. Two hundred images that need renaming. A
              script that calls an API and writes the result somewhere. All of
              that is exactly what it is good at.
            </p>
            <p>
              Everything on this site was built with it by someone doing
              marketing. The barrier is being willing to open a terminal, not
              knowing how to program.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="Installing it, on any machine">
            <KeyFacts
              rows={[
                { label: "What you need", value: `A paid Claude plan from ${usd(PLANS.pro.monthly)} a month, or an API account` },
                { label: "Operating system", value: "Macos 13+, windows 10 1809+, ubuntu 20.04+, debian 10+, alpine 3.19+" },
                { label: "Hardware", value: "4 GB of ram, x64 or arm64" },
                { label: "Time", value: "About five minutes, most of it waiting" },
                { label: "Also available as", value: "A desktop app, in vs code and jetbrains, on the web, in slack, and in ci" },
              ]}
              caption="From Anthropic's setup docs, read 2026-08-27."
            />
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="Your first twenty minutes">
            <p>
              A sequence that works, in the order that gets you to something
              real fastest.
            </p>
            <ol className="guide-list">
              <li>
                <strong>Ask it what is in the folder.</strong> You are testing
                how it explains, not what it knows.
              </li>
              <li>
                <strong>Ask it to make one small change</strong> you could check
                by eye in ten seconds. Rename something. Fix a typo across five
                files.
              </li>
              <li>
                <strong>Ask it to do something you would have to look up.</strong>{" "}
                Convert a folder of images. Pull the numbers out of a CSV into a
                summary. This is where it stops being a demo.
              </li>
              <li>
                <strong>Write your <Code>CLAUDE.md</Code>.</strong> Five
                minutes, and every session after this one is better for it.
              </li>
              <li>
                <strong>Give it something real and walk away.</strong> Come back
                and read what it did.
              </li>
            </ol>
            <Callout title="The one habit worth forming on day one">
              <p>
                Read what it changed before you accept it. Not forever, just
                until you have a feel for where it is reliable and where it
                guesses. That calibration is the whole skill, and you cannot get
                it by reading about it.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="The commands that actually matter">
            <p>
              There are a lot. These are the ones I use every day, and the rest
              you can meet when you need them.
            </p>
            <CompareTable
              columns={["command", "What it does", "When I reach for it"]}
              rows={[
                {
                  label: "/clear",
                  cells: [
                    "Throws away the conversation so far",
                    "Every time I switch to an unrelated task. Keeps answers sharp and the bill small.",
                  ],
                },
                {
                  label: "/usage",
                  cells: [
                    "Shows what this session and this month have used",
                    "Once a week, and any time something feels slow",
                  ],
                },
                {
                  label: "/model",
                  cells: [
                    "Switches which model is answering",
                    "Down to a cheaper one for routine editing, up for anything that needs judgement",
                  ],
                },
                {
                  label: "Plan mode",
                  cells: [
                    "Makes it write the plan before touching anything",
                    "Anything that will change more than a couple of files",
                  ],
                },
                {
                  label: "/doctor",
                  cells: [
                    "Prints a health report on the install",
                    "First thing when something is broken and I do not know why",
                  ],
                },
                {
                  label: "/help",
                  cells: ["Lists everything else", "More often than I expected to"],
                },
              ]}
            />
          </GuideSection>

          <GuideSection title="The four ideas that make it click">
            <p>
              People who get value out of Claude Code and people who bounce off
              it are usually separated by these four, not by technical skill.
            </p>
            <p>
              <strong>1. Context is the product.</strong> The quality of what you
              get back is decided almost entirely by what it can see. Naming the
              three files that matter beats letting it search the whole folder,
              and it is cheaper. Carrying an old conversation into a new problem
              makes the answers worse, not better, which is what{" "}
              <Code>/clear</Code> is for.
            </p>
            <p>
              <strong>2. <Code>CLAUDE.md</Code> is where you stop repeating
              yourself.</strong> A file in the folder that it reads every
              session. What this project is, how you want it done, the rules
              that are not obvious. Anything you have explained twice belongs
              there instead.
            </p>
            <p>
              <strong>3. Plan first on anything that matters.</strong> Ask for
              the plan before the work. You get to correct a paragraph instead of
              a day of edits, and it is the cheapest review you will ever do.
            </p>
            <p>
              <strong>4. It is a delegation habit, not a typing habit.</strong>{" "}
              The failure mode is treating it like autocomplete and staying in
              the loop for every keystroke. The win is handing over a whole job,
              going and doing something else, and reviewing the result. That
              feels wrong for about a week and then it does not.
            </p>
            <p>
              Past those four there are skills (reusable instructions it loads
              on demand), sub agents (separate workers for separate parts of a
              job), MCP servers (connections to outside services) and hooks
              (things that run automatically at certain points). None of them
              matter until the four above are habits.
            </p>
          </GuideSection>

          <GuideSection title="What I build with it">
            <p>
              Every guide below is a real system I run, written out in full so
              you can rebuild it without watching anything. They are the answer
              to &quot;fine, but what do I actually do with it&quot;.
            </p>
            <ul>
              {CLUSTER.map((c) => (
                <li key={c.href}>
                  <a href={c.href}>{c.label}</a>: {c.note}
                </li>
              ))}
            </ul>
            <p>
              And if the job is a document rather than a repository,{" "}
              <a href="/claude-cowork">Claude Cowork</a> is the other half of
              the same plan.
            </p>
          </GuideSection>

          <GuideSection title="The mistakes everyone makes first">
            <ul>
              <li>
                <strong>installing the VS Code extension and expecting the{" "}
                <Code>claude</Code> command.</strong> The extension keeps a
                private copy for its own panel. Install Claude Code itself.
              </li>
              <li>
                <strong>Not opening a fresh terminal after installing.</strong>{" "}
                The old window does not know about the new command.
              </li>
              <li>
                <strong>Expecting the free plan to work.</strong> It installs and
                then will not sign you in, which reads as a bug and is not one.
              </li>
              <li>
                <strong>Letting one session run all day.</strong> The
                conversation becomes input on every turn, so it gets slower,
                more expensive and less accurate at the same time.
              </li>
              <li>
                <strong>Skipping permission prompts to go faster.</strong> The
                prompts are the only thing standing between a misunderstanding
                and a deleted folder. Read them until you have a feel for it.
              </li>
              <li>
                <strong>Never writing a <Code>CLAUDE.md</Code>.</strong> The
                most common one, and the most expensive.
              </li>
            </ul>
            <p>
              The errors people actually hit, taken from the comments under my
              videos, are answered in the troubleshooting section above. What it
              costs, including Anthropic&apos;s own figures for what real usage
              runs to, is on{" "}
              <a href="/claude-code-pricing">The pricing page</a>. And if you are
              still deciding between this and an editor, the{" "}
              <a href="/claude-code-vs-cursor">Comparison</a> is next door.
            </p>
            <p className="text-silver-muted">
              Install commands and system requirements checked against{" "}
              <Out href="https://code.claude.com/docs/en/quickstart">
                Anthropic&apos;s own quickstart
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
          Claude Code will build you the system. It will not tell you what you
          should be known for. <BoldaneLink /> does that half for founders with
          real expertise, from one hour of talking a week.
        </>
      }
    />
  );
}
