import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { ResourcePageShell } from "@/components/resource-page-shell";

const REPO = "https://github.com/melnikoff-oleg/ads-studio";

/**
 * Step 6 in one paste-able block. Ads Studio needs Node 22, ffmpeg and Python
 * before it can render anything, and preflight.sh already knows how to name
 * what is missing, so a beginner is told to hand that job to Claude Code
 * rather than walked through three installers by hand.
 */
const SETUP_PROMPT = `Read CLAUDE.md in this folder. Then run bash scripts/preflight.sh, install anything it says is missing, and run it again until everything passes. Tell me when it is ready.`;

/** Step 7. One sentence, one brand, one ad. */
const FIRST_AD_PROMPT = `Make me a 15 second ad for ouraring.com. Calm and premium, music only, no voiceover.`;

/** Step 3. The one-line installer for macOS and Linux; Windows stays inline. */
const INSTALL_CMD = "curl -fsSL https://claude.ai/install.sh | bash";

/** Step 5. The shape of the finished .env line, with a stand-in key. */
const ENV_EXAMPLE = "FIRECRAWL_API_KEY=fc-abc123yourrealkey";

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

/**
 * Collapsed-by-default aside. The instruction is the step; the reason it exists
 * and what to do when it misbehaves live in here, shut, so the page stays a
 * list of clicks instead of a wall of reassurance.
 */
function Why({
  label = "What is this?",
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
            A free app from Microsoft. You will not write any code in it. It is
            just the window everything else happens inside.
          </p>
          <p>
            The one part you will use is the terminal: the menu is{" "}
            <UI>Terminal</UI>, then <UI>New Terminal</UI>, and a black box opens
            at the bottom. That is where you type things.
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
    title: "Get a Claude plan",
    content: (
      <div>
        <Do>
          <Step>
            Open <A href="https://claude.ai">claude.ai</A> and make an account
          </Step>
          <Step>
            Pick <UI>Pro</UI>, $20 a month. Already have a free account? Upgrade
            at{" "}
            <A href="https://claude.ai/settings/billing">
              claude.ai/settings/billing
            </A>
          </Step>
        </Do>
        <Why label="Do I really have to pay?">
          <p>
            Yes. This is the one thing on this page that costs money. The free
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
    title: "Install Claude Code and sign in",
    content: (
      <div>
        <Do>
          <Step>
            In VS Code, open <UI>Terminal</UI>, then <UI>New Terminal</UI>
          </Step>
          <Step>Paste this line and press Enter</Step>
        </Do>
        <div className="mt-3 space-y-3">
          <Cmd text={INSTALL_CMD} label="Copy command" />
          <p className="text-sm text-silver-muted">
            On Windows: switch the terminal to <UI>PowerShell</UI> first, then
            paste <K>irm https://claude.ai/install.ps1 | iex</K> instead.
          </p>
        </div>
        <Do>
          <Step>Quit VS Code and open it again</Step>
          <Step>
            Open a new terminal, type <K>Claude</K>, press Enter
          </Step>
          <Step>
            Pick <UI>Claude account with subscription</UI>
          </Step>
          <Step>Your browser opens. Sign in and press approve</Step>
          <Step>Go back to VS Code. You are connected</Step>
        </Do>
        <Why label="Something went wrong">
          <p>
            <K>command not found: Claude</K> means you did not quit and reopen VS Code. A terminal that was already open cannot see something installed
            after it started. This is the most common snag on this page.
          </p>
          <p>
            No browser opened? Press <K>c</K> in the terminal to copy the sign-in
            link, then paste it into your browser yourself.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Download the ads studio folder",
    content: (
      <div>
        <Do>
          <Step>
            Open <A href={REPO}>{REPO.replace("https://", "")}</A>
          </Step>
          <Step>
            Press the green <UI>Code</UI> button, then <UI>Download ZIP</UI>
          </Step>
          <Step>Open the file you downloaded. It turns into a folder</Step>
          <Step>Drag that folder to your Documents so it is easy to find</Step>
          <Step>
            In VS Code: <UI>File</UI>, then <UI>Open Folder</UI>, and pick it
          </Step>
        </Do>
        <Why label="How do I know I opened the right thing?">
          <p>
            The left side of VS Code should now list <K>CLAUDE.md</K>,{" "}
            <K>README.md</K>, <K>ads</K>, <K>reference</K> and <K>scripts</K>. If
            you only see one folder inside another folder, open the inner one.
          </p>
          <p>
            Know what git is? <K>git clone {REPO}.git</K> does the same thing.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Get your free Firecrawl key",
    content: (
      <div>
        <p className="mb-4 text-silver">
          This is how the tool reads a company&apos;s website. It is free to
          start and takes two minutes.
        </p>
        <Do>
          <Step>
            Open <A href="https://www.firecrawl.dev">firecrawl.dev</A> and make
            an account
          </Step>
          <Step>
            Go to <A href="https://firecrawl.dev/app/api-keys">API Keys</A>
          </Step>
          <Step>
            Copy your key. It starts with <K>fc-</K>
          </Step>
        </Do>
        <p className="mt-5 mb-3 text-silver">Now put the key in the folder:</p>
        <Do>
          <Step>
            In VS Code, click the file called <K>.env.example</K>
          </Step>
          <Step>
            Right-click it, press <UI>Rename</UI>, and name it exactly{" "}
            <K>.env</K>
          </Step>
          <Step>
            Find the line <K>FIRECRAWL_API_KEY=fc-your-key-here</K>
          </Step>
          <Step>
            Delete <K>fc-your-key-here</K> and paste your real key in its place
          </Step>
          <Step>
            Save the file: <K>Cmd+S</K> on Mac, <K>Ctrl+S</K> on Windows
          </Step>
        </Do>
        <div className="mt-4">
          <Cmd text={ENV_EXAMPLE} label="Copy line" />
        </div>
        <Why label="Careful with this bit">
          <p>
            No spaces around the <K>=</K> sign, and no quote marks. Just the
            word, the equals sign, and your key.
          </p>
          <p>
            The file name is <K>.env</K> with a dot at the front and nothing
            after it. Not <K>.env.txt</K>, not <K>env</K>.
          </p>
          <p>
            Never post this key anywhere or put it in a video. It is yours. If
            you ever show it by accident, make a new one on the same page and the
            old one stops working.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Let Claude Code finish the setup",
    content: (
      <div>
        <Do>
          <Step>
            Open a terminal in VS Code, type <K>Claude</K>, press Enter
          </Step>
          <Step>Paste this and press Enter</Step>
        </Do>
        <div className="mt-3">
          <Cmd text={SETUP_PROMPT} />
        </div>
        <Do>
          <Step>It will ask permission a few times. Say yes</Step>
          <Step>Wait until it tells you everything passed</Step>
        </Do>
        <Why label="What is it actually doing?">
          <p>
            Checking that three free tools are on your computer, and installing
            them if they are not: Node, ffmpeg and Python. They are what turn the
            ad into a real video file.
          </p>
          <p>
            The first time takes a few minutes. After today you never do this
            step again.
          </p>
          <p>
            If anything goes wrong, say so in the same box. It can read its own
            error and fix it.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Make your first ad",
    content: (
      <div>
        <p className="mb-4 text-silver">
          Paste one sentence. That is the whole job.
        </p>
        <Cmd text={FIRST_AD_PROMPT} />
        <Do>
          <Step>It reads the website and picks up the colours and logo</Step>
          <Step>It writes the ad, then renders it</Step>
          <Step>
            When it finishes, the video is in the new folder inside <K>ads</K>
          </Step>
        </Do>
        <p className="mt-4 text-silver">
          Then just say what to change:{" "}
          <UI>&ldquo;slower at the start&rdquo;</UI>,{" "}
          <UI>&ldquo;bigger text&rdquo;</UI>,{" "}
          <UI>&ldquo;end on the logo&rdquo;</UI>. Two or three rounds gets it
          good.
        </p>
        <Why label="More ways to ask">
          <p>Swap the website and the mood for anything you like:</p>
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
            The first video takes longer than every one after it. A 15 second ad
            is usually a few minutes.
          </p>
          <p>
            Every ad lives in its own folder inside <K>ads</K>, so nothing you
            make ever overwrites anything else.
          </p>
          <p>
            It costs nothing per video. It all runs on your own computer.
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
      title="Make video ads with Claude Code"
      subhead="Paste a company's website, say what kind of ad you want, get a finished video. It reads the brand itself. Runs on your own laptop, free per ad."
      steps={steps}
      troubleshooting={["claudeNotFound", "costs", "skipPermissions"]}
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
