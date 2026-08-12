import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ResourcePageShell } from "@/components/resource-page-shell";

const REPO = "https://github.com/melnikoff-oleg/reel-studio";

const VIDEO_ID = "SUZYKyIujQY";
const VIDEO_TITLE = "My Claude Code System For Banger Instagram Reels";

/**
 * The one sentence that does steps 2 through 7 of the old version of this page.
 * Claude Code can install its own dependencies, clone a repo and start a dev
 * server, so a beginner should be told to ask for that rather than walked
 * through six installers by hand. Keep it as one paste-able block.
 */
const SETUP_PROMPT = `Set up Reel Studio for me from ${REPO}. Read its README, install anything I am missing (Node 22 or newer, ffmpeg, Python 3), put the folder in my Documents, install it, start it, and tell me which link to open.`;

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
  return (
    <ol className="list-none space-y-2.5 text-silver">{children}</ol>
  );
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
 * Collapsed-by-default aside. The old version of this page put a paragraph of
 * reassurance beside every instruction, which turned a five-minute setup into a
 * wall a non-technical reader bounces off. The instruction is the step; the
 * reason it exists and what to do when it misbehaves live in here, shut.
 */
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
            just the window everything else happens inside.
          </p>
          <p>
            the one part you will use is the terminal: the menu is{" "}
            <UI>Terminal</UI>, then <UI>New Terminal</UI>, and a black panel
            opens at the bottom. that is where the two commands on this page get
            typed.
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
            at <A href="https://claude.ai/settings/billing">claude.ai/settings/billing</A>
          </Step>
        </Do>
        <Why label="do i really have to pay?">
          <p>
            yes, this is the one part that costs money. the free plan does not
            include Claude Code at all.
          </p>
          <p>
            Pro runs everything on this page. it is the smallest bucket of usage,
            so a very long editing day can ask you to wait a few hours. for a few
            reels a week that will not happen. Max ($100 a month) is for people
            editing every day, and it is worth moving up only when Pro actually
            stops you.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "install claude code",
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
            in a new terminal, type <K>claude</K> and press Enter
          </Step>
          <Step>
            pick <UI>Claude account with subscription</UI>, sign in in the
            browser, approve it
          </Step>
        </Do>
        <Why label="something went wrong">
          <p>
            <K>command not found: claude</K> after the install means you did not
            quit and reopen VS Code. a terminal that was already open cannot see
            something installed after it started. this is the single most common
            snag on this page.
          </p>
          <p>
            no browser opened? press <K>c</K> in the terminal to copy the sign-in
            link and paste it into your browser yourself. shown a code instead of
            being sent back? copy it into the terminal where it asks.
          </p>
          <p>
            there is also a <UI>Claude Code</UI> extension for VS Code, by{" "}
            <UI>Anthropic</UI>, and it is lovely. install it if you like, but it
            is not a substitute for the line above: it deliberately does not give
            you the <K>claude</K> command, and the command is what the studio
            runs.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "let claude code install the studio",
    content: (
      <div>
        <p className="mb-4 text-silver">
          this is the whole setup. paste this into Claude Code and let it work.
        </p>
        <Cmd>{SETUP_PROMPT}</Cmd>
        <Do>
          <Step>
            it will ask permission a few times. say yes
          </Step>
          <Step>
            when it hands you a link, open it. that is the studio
          </Step>
        </Do>
        <Why label="what is it actually doing?">
          <p>
            downloading Reel Studio from{" "}
            <A href={REPO}>{REPO.replace("https://", "")}</A>, installing the
            three free tools it needs (Node, ffmpeg, Python), and starting it on
            your machine at <K>http://localhost:4321</K>. it takes a few minutes
            the first time.
          </p>
          <p>
            leave that terminal alone once it is running. it looks stuck; it is
            not, that is what running looks like. it is the engine, and closing
            it stops the studio.
          </p>
          <p>
            if anything at all goes wrong here, say so in the same box. it can
            read its own error and fix it, which is the reason this page is five
            steps instead of nine.
          </p>
          <p>
            pasting the address of this page at Claude Code works just as well.
            it will read it and do the same thing.
          </p>
          <p>
            next time you want the studio, you do not repeat any of this. on a
            Mac, double-click <K>start.command</K> inside the folder.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "make your first video",
    content: (
      <div>
        <Do>
          <Step>drag ten or fifteen photos onto the left panel</Step>
          <Step>
            record twenty seconds of yourself talking in voice memos and drop
            that in too
          </Step>
          <Step>type one sentence in the middle box and press Build</Step>
        </Do>
        <div className="mt-3">
          <Cmd>
            Make a 30-second vertical reel from these photos, cut to my voice,
            with captions.
          </Cmd>
        </div>
        <p className="mt-4 text-silver">
          it plays on the right when it is done. then just say what to change:{" "}
          <UI>&ldquo;make the first shot longer&rdquo;</UI>,{" "}
          <UI>&ldquo;captions bigger and yellow&rdquo;</UI>,{" "}
          <UI>&ldquo;something calmer under it&rdquo;</UI>.
        </p>
        <Why label="tips, and what to do if it misbehaves">
          <p>
            the first video takes longer than every one after it, because it
            downloads its renderer once. a short reel is a few minutes; a long
            one with captions and music can be fifteen. the clock beside the
            editor is counting real work.
          </p>
          <p>
            every cut is kept. the little row of versions under the picture is
            your history, and clicking one plays it.
          </p>
          <p>
            when a video finally looks right, press <UI>Save this style</UI> and
            name the look. after that you can ask for it by name on completely
            different photos.
          </p>
          <p>
            you can also paste a link on the left, a product page or an article,
            and it will read it and build from it.
          </p>
          <p>
            no music? the <K>music</K> folder ships empty, because licensed
            tracks are not mine to hand out. drop your own <K>.mp3</K> files in
            there. the studio can also go and find music, stock shots and voices
            for you, which needs one extra sign-in; ask Claude Code to set up the{" "}
            <K>heygen</K> command when you want it.
          </p>
          <p>
            anything else: paste the error at Claude Code. it wrote the setup, it
            can read the error.
          </p>
        </Why>
      </div>
    ),
  },
];

export default function ClaudeCodeInstagramPage() {
  return (
    <ResourcePageShell
      slug="claude-code-instagram"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      repoCta={{ href: REPO }}
      title="claude code as your instagram video editor"
      subhead="drop your photos and a voice take on the left, say what you want, watch the reel appear on the right. runs on your own laptop, free per video."
      steps={steps}
      troubleshooting={["claudeNotFound", "costs", "skipPermissions"]}
      jsonLd={{
        title: "Claude Code Instagram Video Editor: Free Setup Guide",
        description:
          "Set up Reel Studio, a local video editor driven by Claude Code, in five steps: VS Code, a Claude plan, Claude Code, one prompt that installs the rest, then your first Instagram Reel.",
        url: "https://oleg.ae/claude-code-instagram",
        datePublished: "2026-08-01",
        dateModified: "2026-08-01",
      }}
      boldaneCredit
    />
  );
}
