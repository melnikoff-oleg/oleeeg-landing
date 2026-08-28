import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { ResourcePageShell } from "@/components/resource-page-shell";

const VIDEO_TITLE =
  "How I actually use my Claude Code second brain (boring, useful)";

/**
 * The one prompt from the video. It is the whole build: Claude Code creates
 * the folders, the CLAUDE.md contract and the slash commands itself, so the
 * page stays six steps of clicking plus one paste. Verbatim except the video's
 * em dash, swapped for a colon per the site-wide no-dash rule (identical
 * instruction to Claude, so do not "fix" it back).
 */
const SETUP_PROMPT = `Set this folder up as my second brain: an Obsidian vault that you operate. I'm new to this and don't know yet how I'll use it, so keep it minimal. Run git init. Create inbox/ (where I dump anything, unsorted), projects/ (things with a finish line), areas/ (ongoing parts of my life), wiki/ (notes you write and maintain), archive/ (done or dead), and tmp/ (scratch). Write CLAUDE.md that says: I dump raw thoughts, you do the filing, linking and summarizing; what each folder is for and what you may write where; always link notes with [[wikilinks]]; never rename a file without updating every link to it; no spaces in filenames; scratch goes in tmp/. Every note you create gets frontmatter with type, description, created, tags. Create Home.md as a dashboard listing my active projects and recent notes, and keep it current. Add two slash commands in .Claude/commands: /inbox to file everything in inbox/ into the right place, and /today to make a daily note. Then commit.`;

/** An outbound link in the house style. */
function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
    >
      {children}
    </a>
  );
}

/** A command or a prompt you paste, exactly as written, with one-tap copy. */
function Cmd({ text, label }: { text: string; label?: string }) {
  return (
    <div>
      <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm leading-relaxed text-silver [overflow-wrap:anywhere]">
        {text}
      </div>
      <div className="mt-3 flex justify-end">
        <CopyButton text={text} label={label} />
      </div>
    </div>
  );
}

/** Something you type literally, or a line the machine prints back. */
function K({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
      {children}
    </code>
  );
}

/** The name of a button or a menu item, as it appears on screen. */
function UI({ children }: { children: ReactNode }) {
  return <span className="text-silver">{children}</span>;
}

/** The numbered actions of a step. Short lines, one thing each. */
function Do({ children }: { children: ReactNode }) {
  return <ol className="list-none space-y-2.5 text-silver">{children}</ol>;
}

function Step({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-2 size-1.5 shrink-0 rounded-full bg-vivid-blue/70"
      />
      <span className="flex-1">{children}</span>
    </li>
  );
}

/** Collapsed-by-default aside: the reason a step exists and its failure modes. */
function Why({ label = "What is this?", children }: { label?: string; children: ReactNode }) {
  return (
    <details className="group mt-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-medium text-silver-muted transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-3 space-y-3 border-l border-hairline pl-4 text-sm leading-relaxed text-silver-muted">
        {children}
      </div>
    </details>
  );
}

const steps = [
  {
    title: "Install Visual Studio Code",
    content: (
      <div>
        <Do>
          <Step>
            Open <A href="https://code.visualstudio.com">code.visualstudio.com</A>
          </Step>
          <Step>Press the big blue download button</Step>
          <Step>Open the file it downloads and install it</Step>
          <Step>Open VS Code and leave it open</Step>
        </Do>
        <Why>
          <p>
            A free editor from Microsoft. You will not write code in it. It is
            the window Claude works inside, and the place you talk to it.
          </p>
          <p>
            On a Mac, drag <UI>Visual Studio Code</UI> into <UI>Applications</UI>{" "}
            first, then open it from there.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Install Obsidian",
    content: (
      <div>
        <Do>
          <Step>
            Open <A href="https://obsidian.md">obsidian.md</A>
          </Step>
          <Step>Download it and open it</Step>
        </Do>
        <Why>
          <p>
            A free note-taking app. Your second brain is just a folder of text
            files; Obsidian is where you read them as pretty, linked notes.
            Claude does the writing, you do the reading.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Get a Claude plan",
    content: (
      <div>
        <Do>
          <Step>
            Open <A href="https://claude.ai">claude.ai</A> and make an account
          </Step>
          <Step>
            Pick <UI>Pro</UI>, $20 a month. Already have a free account? Upgrade
            at <A href="https://claude.ai/settings/billing">claude.ai/settings/billing</A>
          </Step>
        </Do>
        <Why label="Do I really have to pay?">
          <p>
            Yes, this is the one part that costs money. The free plan does not
            include Claude Code at all.
          </p>
          <p>
            And it is the only cost: the second brain itself adds nothing on
            top. Running it is the same usage bucket as everything else you do
            with Claude Code.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Put Claude inside vs code",
    content: (
      <div>
        <Do>
          <Step>
            In VS Code, click the <UI>Extensions</UI> icon in the left bar
          </Step>
          <Step>
            Search for <K>Claude Code</K>, by <UI>Anthropic</UI>, press{" "}
            <UI>Install</UI>
          </Step>
          <Step>
            Click the Claude icon that appears, press <UI>Sign in</UI>, log in
            with the account from step 3 in the browser window that opens
          </Step>
        </Do>
        <Why label="Something went wrong">
          <p>
            No browser opened? Quit VS Code and open it again, then press the
            Claude icon and try the sign-in once more.
          </p>
          <p>
            Shown a code instead of being sent back? Copy it into the panel
            where it asks.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "One folder, both apps",
    content: (
      <div>
        <Do>
          <Step>
            Make an empty folder somewhere on your computer, name it whatever
            you want
          </Step>
          <Step>
            In VS Code: <UI>File</UI>, <UI>Open Folder</UI>, pick it, and trust
            the folder when it asks
          </Step>
          <Step>
            In Obsidian: <UI>Open folder as vault</UI>, pick the same folder
          </Step>
        </Do>
        <Why>
          <p>
            Now both apps are looking at the same place. VS Code is where Claude
            writes; Obsidian is where you read. One folder, two windows onto it.
          </p>
          <p>
            Can&rsquo;t find the vault button? In Obsidian the menu is{" "}
            <UI>File</UI>, then <UI>Open vault</UI>, then{" "}
            <UI>Open folder as vault</UI>.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Paste the one prompt",
    content: (
      <div>
        <p className="mb-4 text-silver">
          This is the whole build. In the Claude panel in VS Code, paste this
          and let it work.
        </p>
        <Cmd text={SETUP_PROMPT} />
        <Do>
          <Step>It will ask permission a few times. Say yes</Step>
          <Step>
            About two minutes later it says done, and the folders appear on the
            left
          </Step>
        </Do>
        <Why label="What is it actually building?">
          <p>
            Six folders and a contract. <K>inbox/</K> is where you dump anything
            unsorted, <K>projects/</K> holds things with a finish line,{" "}
            <K>areas/</K> the ongoing parts of your life, <K>wiki/</K> the notes
            Claude writes and maintains about you, <K>archive/</K> what is done,{" "}
            <K>tmp/</K> scratch.
          </p>
          <p>
            The contract is <K>CLAUDE.md</K>: you dump raw thoughts, Claude does
            the filing, linking and summarizing. It reads that file at the start
            of every session, which is why the system keeps working next week
            without you re-explaining it.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Start using it",
    content: (
      <div>
        <Do>
          <Step>
            Solve your next real task here instead of in the chat app: analyzing
            a document, planning something, any research
          </Step>
          <Step>
            When a task teaches it something about you, say:{" "}
            <UI>&ldquo;save what you learned about me to the wiki&rdquo;</UI>
          </Step>
          <Step>
            When a task repeats, say:{" "}
            <UI>&ldquo;save this as a skill&rdquo;</UI>, and it becomes a slash
            command you run with one line
          </Step>
        </Do>
        <Why label="Tips from daily use">
          <p>
            Talk to it with your voice. A dictation tool makes dumping five
            minutes of context painless, and context is what makes the answers
            good.
          </p>
          <p>
            The win is compounding memory: every task leaves facts behind, and
            the next task starts from them. After a few weeks it knows your
            company, your documents and your plans, and you stop repeating
            yourself.
          </p>
          <p>
            Keep big, long-running projects in their own folders outside the
            vault; tell the second brain where they live so it can read them
            when needed. Everything else, from experiments to 30-minute jobs,
            belongs inside.
          </p>
        </Why>
      </div>
    ),
  },
];

export default function ClaudeCodeSecondBrainPage() {
  return (
    <ResourcePageShell
      slug="claude-code-second-brain"
      title="Your AI second brain on Claude Code"
      subhead="An Obsidian vault that Claude Code operates: you dump thoughts and documents in plain English, it does the filing, linking and remembering. About 10 minutes to set up, no technical experience."
      steps={steps}
      troubleshooting={["claudeNotFound", "costs", "skipPermissions"]}
      jsonLd={{
        title: "AI Second Brain with Claude Code and Obsidian: Free Setup Guide",
        description:
          "Set up an AI second brain in about 10 minutes: VS Code, Obsidian, Claude Code, one folder both apps share, and the one prompt that builds the vault itself.",
        url: "https://www.oleg.ae/claude-code-second-brain",
        datePublished: "2026-08-07",
        dateModified: "2026-08-07",
      }}
      boldaneCredit
    />
  );
}
