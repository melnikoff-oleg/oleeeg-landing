import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { ResourcePageShell } from "@/components/resource-page-shell";

const VIDEO_TITLE =
  "how i actually use my claude code second brain (boring, useful)";

/**
 * The one prompt from the video. It is the whole build: Claude Code creates
 * the folders, the CLAUDE.md contract and the slash commands itself, so the
 * page stays six steps of clicking plus one paste. Verbatim except the video's
 * em dash, swapped for a colon per the site-wide no-dash rule (identical
 * instruction to Claude, so do not "fix" it back).
 */
const SETUP_PROMPT = `Set this folder up as my second brain: an Obsidian vault that you operate. I'm new to this and don't know yet how I'll use it, so keep it minimal. Run git init. Create inbox/ (where I dump anything, unsorted), projects/ (things with a finish line), areas/ (ongoing parts of my life), wiki/ (notes you write and maintain), archive/ (done or dead), and tmp/ (scratch). Write CLAUDE.md that says: I dump raw thoughts, you do the filing, linking and summarizing; what each folder is for and what you may write where; always link notes with [[wikilinks]]; never rename a file without updating every link to it; no spaces in filenames; scratch goes in tmp/. Every note you create gets frontmatter with type, description, created, tags. Create Home.md as a dashboard listing my active projects and recent notes, and keep it current. Add two slash commands in .claude/commands: /inbox to file everything in inbox/ into the right place, and /today to make a daily note. Then commit.`;

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
function Why({ label = "what is this?", children }: { label?: string; children: ReactNode }) {
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
    title: "install visual studio code",
    content: (
      <div>
        <Do>
          <Step>
            open <A href="https://code.visualstudio.com">code.visualstudio.com</A>
          </Step>
          <Step>press the big blue download button</Step>
          <Step>open the file it downloads and install it</Step>
          <Step>open VS Code and leave it open</Step>
        </Do>
        <Why>
          <p>
            a free editor from Microsoft. you will not write code in it. it is
            the window Claude works inside, and the place you talk to it.
          </p>
          <p>
            on a Mac, drag <UI>Visual Studio Code</UI> into <UI>Applications</UI>{" "}
            first, then open it from there.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "install obsidian",
    content: (
      <div>
        <Do>
          <Step>
            open <A href="https://obsidian.md">obsidian.md</A>
          </Step>
          <Step>download it and open it</Step>
        </Do>
        <Why>
          <p>
            a free note-taking app. your second brain is just a folder of text
            files; Obsidian is where you read them as pretty, linked notes.
            Claude does the writing, you do the reading.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "get a claude plan",
    content: (
      <div>
        <Do>
          <Step>
            open <A href="https://claude.ai">claude.ai</A> and make an account
          </Step>
          <Step>
            pick <UI>Pro</UI>, $20 a month. already have a free account? upgrade
            at <A href="https://claude.ai/settings/billing">claude.ai/settings/billing</A>
          </Step>
        </Do>
        <Why label="do i really have to pay?">
          <p>
            yes, this is the one part that costs money. the free plan does not
            include Claude Code at all.
          </p>
          <p>
            and it is the only cost: the second brain itself adds nothing on
            top. running it is the same usage bucket as everything else you do
            with Claude Code.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "put claude inside vs code",
    content: (
      <div>
        <Do>
          <Step>
            in VS Code, click the <UI>Extensions</UI> icon in the left bar
          </Step>
          <Step>
            search for <K>Claude Code</K>, by <UI>Anthropic</UI>, press{" "}
            <UI>Install</UI>
          </Step>
          <Step>
            click the Claude icon that appears, press <UI>Sign in</UI>, log in
            with the account from step 3 in the browser window that opens
          </Step>
        </Do>
        <Why label="something went wrong">
          <p>
            no browser opened? quit VS Code and open it again, then press the
            Claude icon and try the sign-in once more.
          </p>
          <p>
            shown a code instead of being sent back? copy it into the panel
            where it asks.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "one folder, both apps",
    content: (
      <div>
        <Do>
          <Step>
            make an empty folder somewhere on your computer, name it whatever
            you want
          </Step>
          <Step>
            in VS Code: <UI>File</UI>, <UI>Open Folder</UI>, pick it, and trust
            the folder when it asks
          </Step>
          <Step>
            in Obsidian: <UI>Open folder as vault</UI>, pick the same folder
          </Step>
        </Do>
        <Why>
          <p>
            now both apps are looking at the same place. VS Code is where Claude
            writes; Obsidian is where you read. one folder, two windows onto it.
          </p>
          <p>
            can&rsquo;t find the vault button? in Obsidian the menu is{" "}
            <UI>File</UI>, then <UI>Open vault</UI>, then{" "}
            <UI>Open folder as vault</UI>.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "paste the one prompt",
    content: (
      <div>
        <p className="mb-4 text-silver">
          this is the whole build. in the Claude panel in VS Code, paste this
          and let it work.
        </p>
        <Cmd text={SETUP_PROMPT} />
        <Do>
          <Step>it will ask permission a few times. say yes</Step>
          <Step>
            about two minutes later it says done, and the folders appear on the
            left
          </Step>
        </Do>
        <Why label="what is it actually building?">
          <p>
            six folders and a contract. <K>inbox/</K> is where you dump anything
            unsorted, <K>projects/</K> holds things with a finish line,{" "}
            <K>areas/</K> the ongoing parts of your life, <K>wiki/</K> the notes
            Claude writes and maintains about you, <K>archive/</K> what is done,{" "}
            <K>tmp/</K> scratch.
          </p>
          <p>
            the contract is <K>CLAUDE.md</K>: you dump raw thoughts, Claude does
            the filing, linking and summarizing. it reads that file at the start
            of every session, which is why the system keeps working next week
            without you re-explaining it.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "start using it",
    content: (
      <div>
        <Do>
          <Step>
            solve your next real task here instead of in the chat app: analyzing
            a document, planning something, any research
          </Step>
          <Step>
            when a task teaches it something about you, say:{" "}
            <UI>&ldquo;save what you learned about me to the wiki&rdquo;</UI>
          </Step>
          <Step>
            when a task repeats, say:{" "}
            <UI>&ldquo;save this as a skill&rdquo;</UI>, and it becomes a slash
            command you run with one line
          </Step>
        </Do>
        <Why label="tips from daily use">
          <p>
            talk to it with your voice. a dictation tool makes dumping five
            minutes of context painless, and context is what makes the answers
            good.
          </p>
          <p>
            the win is compounding memory: every task leaves facts behind, and
            the next task starts from them. after a few weeks it knows your
            company, your documents and your plans, and you stop repeating
            yourself.
          </p>
          <p>
            keep big, long-running projects in their own folders outside the
            vault; tell the second brain where they live so it can read them
            when needed. everything else, from experiments to 30-minute jobs,
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
      title="your ai second brain on claude code"
      subhead="an Obsidian vault that Claude Code operates: you dump thoughts and documents in plain English, it does the filing, linking and remembering. about 10 minutes to set up, no technical experience."
      steps={steps}
      troubleshooting={["claudeNotFound", "costs", "skipPermissions"]}
      jsonLd={{
        title: "AI Second Brain with Claude Code and Obsidian: Free Setup Guide",
        description:
          "Set up an AI second brain in about 10 minutes: VS Code, Obsidian, Claude Code, one folder both apps share, and the one prompt that builds the vault itself.",
        url: "https://oleg.ae/claude-code-second-brain",
        datePublished: "2026-08-07",
        dateModified: "2026-08-07",
      }}
      boldaneCredit
    />
  );
}
