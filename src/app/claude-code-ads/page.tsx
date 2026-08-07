import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ResourcePageShell } from "@/components/resource-page-shell";

const REPO = "https://github.com/melnikoff-oleg/ads-studio";

/**
 * Step 6 in one paste-able block. Ads Studio needs Node 22, ffmpeg and Python
 * before it can render anything, and preflight.sh already knows how to name
 * what is missing — so a beginner is told to hand that job to Claude Code
 * rather than walked through three installers by hand.
 */
const SETUP_PROMPT = `Read CLAUDE.md in this folder. Then run bash scripts/preflight.sh, install anything it says is missing, and run it again until everything passes. Tell me when it is ready.`;

/** Step 7. One sentence, one brand, one ad. */
const FIRST_AD_PROMPT = `Make me a 15 second ad for ouraring.com. Calm and premium, music only, no voiceover.`;

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

/** A command or a prompt you paste, exactly as written. */
function Cmd({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg surface-raised border border-hairline p-4 font-mono text-sm leading-relaxed text-silver">
      {children}
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

/**
 * Collapsed-by-default aside. The instruction is the step; the reason it exists
 * and what to do when it misbehaves live in here, shut, so the page stays a
 * list of clicks instead of a wall of reassurance.
 */
function Why({
  label = "what is this?",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
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
            a free app from Microsoft. you will not write any code in it. it is
            just the window everything else happens inside.
          </p>
          <p>
            the one part you will use is the terminal: the menu is{" "}
            <UI>Terminal</UI>, then <UI>New Terminal</UI>, and a black box opens
            at the bottom. that is where you type things.
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
    title: "get a claude plan",
    content: (
      <div>
        <Do>
          <Step>
            open <A href="https://claude.ai">claude.ai</A> and make an account
          </Step>
          <Step>
            pick <UI>Pro</UI>, $20 a month. already have a free account? upgrade
            at{" "}
            <A href="https://claude.ai/settings/billing">
              claude.ai/settings/billing
            </A>
          </Step>
        </Do>
        <Why label="do i really have to pay?">
          <p>
            yes. this is the one thing on this page that costs money. the free
            plan does not include Claude Code at all.
          </p>
          <p>
            Pro makes ads all day. Max ($100 a month) is only worth it once Pro
            actually starts telling you to wait.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "install claude code and sign in",
    content: (
      <div>
        <Do>
          <Step>
            in VS Code, open <UI>Terminal</UI>, then <UI>New Terminal</UI>
          </Step>
          <Step>paste this line and press Enter</Step>
        </Do>
        <div className="mt-3 space-y-3">
          <Cmd>curl -fsSL https://claude.ai/install.sh | bash</Cmd>
          <p className="text-sm text-silver-muted">
            on Windows: switch the terminal to <UI>PowerShell</UI> first, then
            paste <K>irm https://claude.ai/install.ps1 | iex</K> instead.
          </p>
        </div>
        <Do>
          <Step>quit VS Code and open it again</Step>
          <Step>
            open a new terminal, type <K>claude</K>, press Enter
          </Step>
          <Step>
            pick <UI>Claude account with subscription</UI>
          </Step>
          <Step>your browser opens. sign in and press approve</Step>
          <Step>go back to VS Code. you are connected</Step>
        </Do>
        <Why label="something went wrong">
          <p>
            <K>command not found: claude</K> means you did not quit and reopen VS
            Code. a terminal that was already open cannot see something installed
            after it started. this is the most common snag on this page.
          </p>
          <p>
            no browser opened? press <K>c</K> in the terminal to copy the sign-in
            link, then paste it into your browser yourself.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "download the ads studio folder",
    content: (
      <div>
        <Do>
          <Step>
            open <A href={REPO}>{REPO.replace("https://", "")}</A>
          </Step>
          <Step>
            press the green <UI>Code</UI> button, then <UI>Download ZIP</UI>
          </Step>
          <Step>open the file you downloaded. it turns into a folder</Step>
          <Step>drag that folder to your Documents so it is easy to find</Step>
          <Step>
            in VS Code: <UI>File</UI>, then <UI>Open Folder</UI>, and pick it
          </Step>
        </Do>
        <Why label="how do i know i opened the right thing?">
          <p>
            the left side of VS Code should now list <K>CLAUDE.md</K>,{" "}
            <K>README.md</K>, <K>ads</K>, <K>reference</K> and <K>scripts</K>. if
            you only see one folder inside another folder, open the inner one.
          </p>
          <p>
            know what git is? <K>git clone {REPO}.git</K> does the same thing.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "get your free firecrawl key",
    content: (
      <div>
        <p className="mb-4 text-silver">
          this is how the tool reads a company&apos;s website. it is free to
          start and takes two minutes.
        </p>
        <Do>
          <Step>
            open <A href="https://www.firecrawl.dev">firecrawl.dev</A> and make
            an account
          </Step>
          <Step>
            go to <A href="https://firecrawl.dev/app/api-keys">API Keys</A>
          </Step>
          <Step>
            copy your key. it starts with <K>fc-</K>
          </Step>
        </Do>
        <p className="mt-5 mb-3 text-silver">now put the key in the folder:</p>
        <Do>
          <Step>
            in VS Code, click the file called <K>.env.example</K>
          </Step>
          <Step>
            right-click it, press <UI>Rename</UI>, and name it exactly{" "}
            <K>.env</K>
          </Step>
          <Step>
            find the line <K>FIRECRAWL_API_KEY=fc-your-key-here</K>
          </Step>
          <Step>
            delete <K>fc-your-key-here</K> and paste your real key in its place
          </Step>
          <Step>
            save the file: <K>Cmd+S</K> on Mac, <K>Ctrl+S</K> on Windows
          </Step>
        </Do>
        <div className="mt-4">
          <Cmd>FIRECRAWL_API_KEY=fc-abc123yourrealkey</Cmd>
        </div>
        <Why label="careful with this bit">
          <p>
            no spaces around the <K>=</K> sign, and no quote marks. just the
            word, the equals sign, and your key.
          </p>
          <p>
            the file name is <K>.env</K> with a dot at the front and nothing
            after it. not <K>.env.txt</K>, not <K>env</K>.
          </p>
          <p>
            never post this key anywhere or put it in a video. it is yours. if
            you ever show it by accident, make a new one on the same page and the
            old one stops working.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "let claude code finish the setup",
    content: (
      <div>
        <Do>
          <Step>
            open a terminal in VS Code, type <K>claude</K>, press Enter
          </Step>
          <Step>paste this and press Enter</Step>
        </Do>
        <div className="mt-3">
          <Cmd>{SETUP_PROMPT}</Cmd>
        </div>
        <Do>
          <Step>it will ask permission a few times. say yes</Step>
          <Step>wait until it tells you everything passed</Step>
        </Do>
        <Why label="what is it actually doing?">
          <p>
            checking that three free tools are on your computer, and installing
            them if they are not: Node, ffmpeg and Python. they are what turn the
            ad into a real video file.
          </p>
          <p>
            the first time takes a few minutes. after today you never do this
            step again.
          </p>
          <p>
            if anything goes wrong, say so in the same box. it can read its own
            error and fix it.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "make your first ad",
    content: (
      <div>
        <p className="mb-4 text-silver">
          paste one sentence. that is the whole job.
        </p>
        <Cmd>{FIRST_AD_PROMPT}</Cmd>
        <Do>
          <Step>it reads the website and picks up the colours and logo</Step>
          <Step>it writes the ad, then renders it</Step>
          <Step>
            when it finishes, the video is in the new folder inside <K>ads</K>
          </Step>
        </Do>
        <p className="mt-4 text-silver">
          then just say what to change:{" "}
          <UI>&ldquo;slower at the start&rdquo;</UI>,{" "}
          <UI>&ldquo;bigger text&rdquo;</UI>,{" "}
          <UI>&ldquo;end on the logo&rdquo;</UI>. two or three rounds gets it
          good.
        </p>
        <Why label="more ways to ask">
          <p>swap the website and the mood for anything you like:</p>
          <p>
            <K>make a 30 second ad for stripe.com, lead with the speed</K>
          </p>
          <p>
            <K>15 second vertical ad for linear.app for instagram</K>
          </p>
          <p>
            <K>6 second bumper for notion.so, just the logo and one line</K>
          </p>
          <p>
            the first video takes longer than every one after it. a 15 second ad
            is usually a few minutes.
          </p>
          <p>
            every ad lives in its own folder inside <K>ads</K>, so nothing you
            make ever overwrites anything else.
          </p>
          <p>
            it costs nothing per video. it all runs on your own computer.
          </p>
        </Why>
      </div>
    ),
  },
];

export default function ClaudeCodeAdsPage() {
  return (
    <ResourcePageShell
      slug="claude-code-ads"
      repoCta={{ href: REPO }}
      title="make video ads with claude code"
      subhead="paste a company's website, say what kind of ad you want, get a finished video. it reads the brand itself. runs on your own laptop, free per ad."
      steps={steps}
      jsonLd={{
        title: "Make Video Ads With Claude Code: Free Setup Guide",
        description:
          "Set up Ads Studio, a local video ad maker driven by Claude Code, in seven steps: VS Code, a Claude plan, Claude Code, the folder from GitHub, a free Firecrawl key, one setup prompt, then your first ad.",
        url: "https://oleg.ae/claude-code-ads",
        datePublished: "2026-08-07",
        dateModified: "2026-08-07",
      }}
      boldaneCredit
    />
  );
}
