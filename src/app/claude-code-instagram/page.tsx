import type { ReactNode } from "react";
import { ResourcePageShell } from "@/components/resource-page-shell";

const REPO = "https://github.com/melnikoff-oleg/reel-studio";

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

/** A command you paste into a terminal. */
function Cmd({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
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

const steps = [
  {
    title: "install visual studio code",
    content: (
      <div className="space-y-3">
        <p>
          VS Code is a free editor from Microsoft. you are not going to write
          code in it. it is just the window everything else happens inside: your
          files on the left, and a place to type commands at the bottom.
        </p>
        <p>
          go to <A href="https://code.visualstudio.com">code.visualstudio.com</A>{" "}
          and press the big blue download button. the site works out which
          computer you are on, so you get the right file automatically.
        </p>
        <p>
          on a Mac: open the file you downloaded, drag{" "}
          <UI>Visual Studio Code</UI> into your <UI>Applications</UI> folder,
          then open it from there. on Windows: run the installer you downloaded
          and click through it accepting everything.
        </p>
        <p>
          open it once and leave it open. the part you will use most is the
          terminal. the menu item is <UI>Terminal</UI>, then{" "}
          <UI>New Terminal</UI>, and a black panel opens at the bottom of the
          window. every command on this page gets typed there, one line at a
          time, each one followed by Enter.
        </p>
        <p className="text-silver-muted">
          when a command prints a wall of text at you, that is normal and you
          are not meant to read it. the only thing that matters is whether the
          next step works.
        </p>
      </div>
    ),
  },
  {
    title: "install node.js",
    content: (
      <div className="space-y-3">
        <p>
          Node.js is the thing that runs the studio on your own machine. you
          install it once and then never think about it again.
        </p>
        <p>
          go to <A href="https://nodejs.org">nodejs.org</A> and download the{" "}
          <UI>LTS</UI> version, which is the one marked as recommended. do not
          take the &ldquo;Current&rdquo; one next to it. run the installer and
          accept every default it offers.
        </p>
        <p>
          then quit VS Code and open it again. this matters: a terminal that was
          already open cannot see something that was installed after it started,
          which is the single most common reason a step on this page &ldquo;does
          not work&rdquo;.
        </p>
        <p>now open a new terminal and type:</p>
        <Cmd>node -v</Cmd>
        <p>
          it should answer with a version number like <K>v24.18.1</K>. it has to
          be <K>v22</K> or higher, which the LTS download always is. if it says{" "}
          <K>command not found</K>, the install did not finish, or you did not
          reopen the window.
        </p>
      </div>
    ),
  },
  {
    title: "get a claude plan",
    content: (
      <div className="space-y-4">
        <p>
          this is the one part that costs money and there is no way around it.
          the free Claude plan does not include Claude Code. you need at least
          Pro.
        </p>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-silver">
              Pro{" "}
              <span className="font-normal text-silver-muted">
                ($20 a month, or $200 for a year)
              </span>
            </p>
            <p className="mt-1">
              start here. it runs everything on this page. it is also the
              smallest bucket of usage, so a very long editing session can hit a
              limit and ask you to wait a few hours. for a few reels a week that
              will not happen to you.
            </p>
          </div>
          <div>
            <p className="font-medium text-silver">
              Max{" "}
              <span className="font-normal text-silver-muted">
                ($100 a month, or $200 a month for the bigger one)
              </span>
            </p>
            <p className="mt-1">
              only worth it if you are editing every day and Pro keeps stopping
              you. move up when it actually bites, not before.
            </p>
          </div>
        </div>
        <p>
          if you are new: go to <A href="https://claude.ai">claude.ai</A>, make
          an account, and pick a plan. if you already have a free account:{" "}
          <A href="https://claude.ai/settings/billing">
            claude.ai/settings/billing
          </A>
          , then upgrade.
        </p>
        <p className="text-silver-muted">
          there is a second way to pay, a per-use API key from{" "}
          <A href="https://console.anthropic.com">console.anthropic.com</A>. it
          works, but it bills you per render with no ceiling, and for this kind
          of work a subscription is both cheaper and calmer. skip it.
        </p>
      </div>
    ),
  },
  {
    title: "install claude code",
    content: (
      <div className="space-y-4">
        <p>
          Claude Code is the part that does the actual editing. it comes in two
          halves and you want both. the studio only talks to the first one, so
          that half is not optional.
        </p>
        <div>
          <p className="font-medium text-silver">1. the command (required)</p>
          <p className="mt-1">
            open a terminal in VS Code (<UI>Terminal</UI>,{" "}
            <UI>New Terminal</UI>) and paste one line.
          </p>
          <p className="mt-3">on a Mac:</p>
          <Cmd>curl -fsSL https://claude.ai/install.sh | bash</Cmd>
          <p className="mt-3">
            on Windows, first switch the terminal to PowerShell: click the small
            arrow next to the <K>+</K> at the top right of the terminal panel
            and choose <UI>PowerShell</UI>. then paste:
          </p>
          <Cmd>irm https://claude.ai/install.ps1 | iex</Cmd>
          <p className="mt-3">
            somewhere in what it prints you will see{" "}
            <K>Claude Code successfully installed!</K>. quit VS Code, open it
            again, open a new terminal, and check:
          </p>
          <Cmd>claude --version</Cmd>
          <p className="mt-3">
            a version number means you are done. if you would rather install it
            the npm way, <K>npm install -g @anthropic-ai/claude-code</K> gets
            you the same thing. never put <K>sudo</K> in front of that.
          </p>
        </div>
        <div>
          <p className="font-medium text-silver">
            2. the VS Code extension (nice to have)
          </p>
          <p className="mt-1">
            press <K>Cmd+Shift+X</K> on a Mac or <K>Ctrl+Shift+X</K> on Windows
            to open Extensions, search for <UI>Claude Code</UI>, and install the
            one published by <UI>Anthropic</UI>. that gives you a chat panel
            inside the editor, which is lovely for everything else you will ever
            do with it.
          </p>
          <p className="mt-3 text-silver-muted">
            the trap worth knowing about: installing only the extension does{" "}
            <span className="text-silver">not</span> give you the{" "}
            <K>claude</K> command, and the command is what the studio runs. if{" "}
            <K>claude --version</K> does not answer, go back to part 1.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "connect your claude account",
    content: (
      <div className="space-y-3">
        <p>in a terminal, type:</p>
        <Cmd>claude</Cmd>
        <p>
          it asks you to <UI>Select login method</UI>. the one you want is the
          first, <UI>Claude account with subscription</UI>. your browser opens
          on a Claude sign-in page: sign in with the account you just put a plan
          on, and approve it.
        </p>
        <p>
          the terminal says <K>Login successful</K>. press Enter and you are
          sitting inside Claude Code. say hello to it if you like. to leave,
          type <K>/exit</K>.
        </p>
        <p className="text-silver-muted">
          if no browser opened, press <K>c</K> in the terminal to copy the
          sign-in link, then paste it into your browser yourself. if the browser
          shows you a code instead of sending you back, copy that code and paste
          it into the terminal where it asks for it.
        </p>
        <p>
          this happens once. from now on <K>claude</K> is signed in and stays
          signed in.
        </p>
      </div>
    ),
  },
  {
    title: "install ffmpeg and python",
    content: (
      <div className="space-y-4">
        <p>
          two more free tools. ffmpeg is what actually writes the video file.
          python does the audio work behind captions and music. the studio calls
          both of them for you, so you install them and forget them.
        </p>
        <div>
          <p className="font-medium text-silver">on a Mac</p>
          <p className="mt-1">
            python is already on your Mac, so you only need ffmpeg. getting it
            takes one helper called Homebrew. if you have never installed it,
            paste this first:
          </p>
          <Cmd>
            /bin/bash -c &quot;$(curl -fsSL
            https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)&quot;
          </Cmd>
          <p className="mt-3">
            it asks for your Mac password (nothing appears as you type it, that
            is normal) and prints two or three lines of instructions at the very
            end. paste those in too, exactly as printed. then:
          </p>
          <Cmd>brew install ffmpeg</Cmd>
          <p className="mt-2 text-silver-muted">
            that one takes a few minutes and installs a pile of things it needs.
            let it finish.
          </p>
        </div>
        <div>
          <p className="font-medium text-silver">on Windows</p>
          <p className="mt-1">in a PowerShell terminal, one line at a time:</p>
          <Cmd>
            winget install Gyan.FFmpeg.Essentials
            <br />
            winget install Python.Python.3.14
          </Cmd>
        </div>
        <p>quit VS Code, open it again, and check both in a new terminal:</p>
        <Cmd>
          ffmpeg -version
          <br />
          python3 --version
        </Cmd>
        <p className="text-silver-muted">
          on Windows the second one may need to be <K>python --version</K>.
          either is fine as long as it prints a 3 point something.
        </p>
      </div>
    ),
  },
  {
    title: "download reel studio and open it",
    content: (
      <div className="space-y-4">
        <p>
          the studio itself is just a folder. it holds the app, the instructions
          the editor reads, and every video skill it knows how to use. nothing is
          hiding anywhere else.
        </p>
        <p>
          go to <A href={REPO}>{REPO.replace("https://", "")}</A>, press the
          green <UI>Code</UI> button, and choose <UI>Download ZIP</UI>. open the
          file you downloaded to unzip it. you get a folder called{" "}
          <K>reel-studio-main</K>. rename it to <K>reel-studio</K> and put it
          somewhere you will find it again, like Documents.
        </p>
        <p>
          in VS Code: <UI>File</UI>, then <UI>Open Folder</UI>, pick that
          folder. if it asks whether you trust the authors, say yes. you should
          now see <K>app</K>, <K>lib</K>, <K>music</K> and a <K>README.md</K> in
          the sidebar.
        </p>
        <p>
          if you would rather do it with one command than with a browser, this
          is the same thing:
        </p>
        <Cmd>git clone {REPO}.git</Cmd>
        <p className="text-silver-muted">
          the <K>music</K> folder arrives empty on purpose. those are licensed
          tracks and they are not mine to hand out. the studio works fine
          without it. drop your own <K>.mp3</K> files in there and every video
          you make can score from them.
        </p>
        <p className="text-silver-muted">
          the studio can also go and <span className="text-silver">find</span>{" "}
          things for you rather than only cutting what you gave it: stock shots,
          generated music, a spoken script, a film look. that half needs one
          extra sign-in, the <K>heygen</K> command, and the folder&apos;s{" "}
          <K>README.md</K> tells you how. everything else on this page works
          without it, so leave it until you want it.
        </p>
      </div>
    ),
  },
  {
    title: "start the studio",
    content: (
      <div className="space-y-3">
        <p>
          open a terminal in VS Code. because you opened the folder, the
          terminal is already inside it. type these two lines, one at a time:
        </p>
        <Cmd>
          npm install
          <br />
          npm run dev
        </Cmd>
        <p>
          the first takes a minute or two and prints a lot. the second prints a
          few lines and then looks like it is stuck. it is not stuck, that is
          what running looks like. leave that terminal alone, it is the engine.
        </p>
        <p>
          now open{" "}
          <A href="http://localhost:4321">http://localhost:4321</A> in your
          browser. that is the studio: your materials on the left, the editor in
          the middle, your finished video on the right.
        </p>
        <p className="text-silver-muted">
          on a Mac there is a shortcut for every time after this one. in the
          folder, double-click <K>start.command</K> and it starts the studio and
          opens your browser for you. the very first time, right-click it and
          choose <UI>Open</UI> instead, so macOS lets it run. to stop the
          studio, close the terminal window.
        </p>
        <p className="text-silver-muted">
          if it complains that port 4321 is in use, something else is on it. run{" "}
          <K>npm run dev -- -p 4400</K> and open{" "}
          <K>http://localhost:4400</K> instead.
        </p>
      </div>
    ),
  },
  {
    title: "make your first video",
    content: (
      <div className="space-y-4">
        <p>
          drag ten or fifteen photos off your phone onto the left panel. record
          twenty seconds of yourself talking over them in your voice memos app
          and drop that in too. you can also paste a link there, a product page
          or an article, and it will go and read it.
        </p>
        <p>then type one sentence in the middle box and press Build:</p>
        <Cmd>
          Make a 30-second vertical reel from these photos, cut to my voice,
          with captions.
        </Cmd>
        <p>
          the editor talks back in plain sentences while it works and a clock
          counts up beside it. the first video takes longer than all the ones
          after it, because it downloads its renderer once. a short reel is
          usually a few minutes. a long one with captions and music can be
          fifteen. when it is finished, it plays on the right.
        </p>
        <p>
          then you just say what to change, in the same box.{" "}
          <UI>&ldquo;make the first shot longer&rdquo;</UI>.{" "}
          <UI>&ldquo;captions bigger and yellow&rdquo;</UI>.{" "}
          <UI>&ldquo;put something calmer under it&rdquo;</UI>. every cut is
          kept, so the little row of versions under the picture is your history,
          and clicking one plays it.
        </p>
        <p>
          when a video finally looks the way you wanted, press{" "}
          <UI>Save this style</UI> and give the look a name. after that you can
          ask for that exact style on completely different photos and it will
          match.
        </p>
        <div className="space-y-2">
          <p className="font-medium text-silver">if something goes wrong</p>
          <p>
            <K>command not found: claude</K> means the extension is installed but
            the command is not. redo step 4, part 1.
          </p>
          <p>
            <UI>the run stops the moment it starts</UI>: your Claude account has
            no plan on it, or you have hit a usage limit. type <K>claude</K> in a
            terminal and send it one message. whatever it says there is the real
            reason.
          </p>
          <p>
            <UI>the video never appears on the right</UI>: tell the editor to
            put the finished video in this project&apos;s out folder, in those
            words.
          </p>
          <p>
            <UI>npm install fails on Windows</UI>: delete the file{" "}
            <K>package-lock.json</K> and run <K>npm install</K> again.
          </p>
          <p>
            anything else: the folder&apos;s own <K>README.md</K> has a longer
            list, and you can always ask Claude Code itself. paste the error at
            it.
          </p>
        </div>
      </div>
    ),
  },
];

export default function ClaudeCodeInstagramPage() {
  return (
    <ResourcePageShell
      slug="claude-code-instagram"
      repoCta={{ href: REPO }}
      title="claude code as your instagram video editor"
      subhead="reel studio is a window onto claude code that makes videos. drop your photos, clips and voice take on the left, say what you want in one sentence, and watch the reel appear on the right. it runs on your own laptop, nothing gets uploaded, and there is no cost per video."
      steps={steps}
      jsonLd={{
        title: "Claude Code Instagram Video Editor: Free Setup Guide",
        description:
          "Set up Reel Studio, a local video editor driven by Claude Code, from zero: VS Code, Node.js, a Claude plan, Claude Code, ffmpeg and Python, then your first Instagram Reel.",
        url: "https://oleg.ae/claude-code-instagram",
        datePublished: "2026-08-01",
        dateModified: "2026-08-01",
      }}
      boldaneCredit
    />
  );
}
