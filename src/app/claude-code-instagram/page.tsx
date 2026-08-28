import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ResourcePageShell } from "@/components/resource-page-shell";
import {
  Answer,
  Block,
  Callout,
  Code,
  CompareTable,
  Figure,
  Guide,
  GuideSection,
  GuideSteps,
  GuideToc,
  KeyFacts,
  Out,
  Stats,
} from "@/components/guide";
import { PLANS, usd } from "@/lib/pricing";

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
            just the window everything else happens inside.
          </p>
          <p>
            The one part you will use is the terminal: the menu is{" "}
            <UI>Terminal</UI>, then <UI>New Terminal</UI>, and a black panel
            opens at the bottom. That is where the two commands on this page get
            typed.
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
            at <A href="https://claude.ai/settings/billing">claude.ai/settings/billing</A>
          </Step>
        </Do>
        <Why label="Do I really have to pay?">
          <p>
            Yes, this is the one part that costs money. The free plan does not
            include Claude Code at all.
          </p>
          <p>
            Pro runs everything on this page. It is the smallest bucket of usage,
            so a very long editing day can ask you to wait a few hours. For a few
            reels a week that will not happen. Max ($100 a month) is for people
            editing every day, and it is worth moving up only when Pro actually
            stops you.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Install Claude Code",
    content: (
      <div>
        <Do>
          <Step>
            In VS Code, open <UI>Terminal</UI>, then <UI>New Terminal</UI>
          </Step>
          <Step>Paste this line and press Enter</Step>
        </Do>
        <div className="mt-3 space-y-3">
          <Cmd>curl -fsSL https://claude.ai/install.sh | bash</Cmd>
          <p className="text-sm text-silver-muted">
            On Windows: switch the terminal to <UI>PowerShell</UI> first, then
            paste <K>irm https://claude.ai/install.ps1 | iex</K> instead.
          </p>
        </div>
        <Do>
          <Step>Quit VS Code and open it again</Step>
          <Step>
            In a new terminal, type <K>Claude</K> and press Enter
          </Step>
          <Step>
            Pick <UI>Claude account with subscription</UI>, sign in in the
            browser, approve it
          </Step>
        </Do>
        <Why label="Something went wrong">
          <p>
            <K>command not found: Claude</K> after the install means you did not
            quit and reopen VS Code. A terminal that was already open cannot see
            something installed after it started. This is the single most common
            snag on this page.
          </p>
          <p>
            No browser opened? Press <K>c</K> in the terminal to copy the sign-in
            link and paste it into your browser yourself. Shown a code instead of
            being sent back? Copy it into the terminal where it asks.
          </p>
          <p>
            There is also a <UI>Claude Code</UI> extension for VS Code, by{" "}
            <UI>Anthropic</UI>, and it is lovely. Install it if you like, but it
            is not a substitute for the line above: it deliberately does not give
            you the <K>Claude</K> command, and the command is what the studio
            runs.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Let Claude Code install the studio",
    content: (
      <div>
        <p className="mb-4 text-silver">
          This is the whole setup. Paste this into Claude Code and let it work.
        </p>
        <Cmd>{SETUP_PROMPT}</Cmd>
        <Do>
          <Step>
            It will ask permission a few times. Say yes
          </Step>
          <Step>
            When it hands you a link, open it. That is the studio
          </Step>
        </Do>
        <Why label="What is it actually doing?">
          <p>
            Downloading Reel Studio from{" "}
            <A href={REPO}>{REPO.replace("https://", "")}</A>, installing the
            three free tools it needs (Node, ffmpeg, Python), and starting it on
            your machine at <K>http://localhost:4321</K>. it takes a few minutes
            the first time.
          </p>
          <p>
            Leave that terminal alone once it is running. It looks stuck; it is
            not, that is what running looks like. It is the engine, and closing
            it stops the studio.
          </p>
          <p>
            If anything at all goes wrong here, say so in the same box. It can
            read its own error and fix it, which is the reason this page is five
            steps instead of nine.
          </p>
          <p>
            Pasting the address of this page at Claude Code works just as well.
            It will read it and do the same thing.
          </p>
          <p>
            Next time you want the studio, you do not repeat any of this. On a
            Mac, double-click <K>start.command</K> inside the folder.
          </p>
        </Why>
      </div>
    ),
  },
  {
    title: "Make your first video",
    content: (
      <div>
        <Do>
          <Step>Drag ten or fifteen photos onto the left panel</Step>
          <Step>
            Record twenty seconds of yourself talking in voice memos and drop
            that in too
          </Step>
          <Step>Type one sentence in the middle box and press Build</Step>
        </Do>
        <div className="mt-3">
          <Cmd>
            Make a 30-second vertical reel from these photos, cut to my voice,
            with captions.
          </Cmd>
        </div>
        <p className="mt-4 text-silver">
          It plays on the right when it is done. Then just say what to change:{" "}
          <UI>&ldquo;make the first shot longer&rdquo;</UI>,{" "}
          <UI>&ldquo;captions bigger and yellow&rdquo;</UI>,{" "}
          <UI>&ldquo;something calmer under it&rdquo;</UI>.
        </p>
        <Why label="Tips, and what to do if it misbehaves">
          <p>
            The first video takes longer than every one after it, because it
            downloads its renderer once. A short reel is a few minutes; a long
            one with captions and music can be fifteen. The clock beside the
            editor is counting real work.
          </p>
          <p>
            Every cut is kept. The little row of versions under the picture is
            your history, and clicking one plays it.
          </p>
          <p>
            When a video finally looks right, press <UI>Save this style</UI> and
            name the look. After that you can ask for it by name on completely
            different photos.
          </p>
          <p>
            You can also paste a link on the left, a product page or an article,
            and it will read it and build from it.
          </p>
          <p>
            No music? The <K>music</K> folder ships empty, because licensed
            tracks are not mine to hand out. Drop your own <K>.mp3</K> files in
            there. The studio can also go and find music, stock shots and voices
            for you, which needs one extra sign-in; ask Claude Code to set up the{" "}
            <K>heygen</K> command when you want it.
          </p>
          <p>
            Anything else: paste the error at Claude Code. It wrote the setup, it
            can read the error.
          </p>
        </Why>
      </div>
    ),
  },
];


const SECTIONS = [
  "What it actually is",
  "Two videos it made, and how",
  "What a video costs, and how many you get",
  "Using it",
  "The four things that make the output good",
  "What it is not",
];

const guideSteps = [
  {
    title: "Start a new reel and drop the materials in",
    schema:
      "Create a new reel and put every clip, photo, voiceover and music file you want in it into the materials panel.",
    body: (
      <>
        <p>
          Press new reel and put everything you have on the left: clips, photos,
          a voiceover, music. No order, no labels, no naming convention.
        </p>
        <p>
          You do not describe what any of it is. It watches each file, works out
          what is in it, transcribes what is said, and decides where it belongs.
          That is the part that makes this different from a template tool.
        </p>
      </>
    ),
  },
  {
    title: "Say what the video should be, in a sentence",
    schema:
      "Describe the video you want in plain language in the middle panel, rather than specifying an edit.",
    body: (
      <>
        <p>
          The middle panel takes plain english. &quot;make a video about my trip
          to paris from these visuals, use the voiceover as the storyline, find
          some music, stitch it so it makes sense.&quot;
        </p>
        <p>
          You are briefing an editor, not operating an editor. What to make, not
          which cut goes where.
        </p>
      </>
    ),
  },
  {
    title: "Press build and go and do something else",
    schema:
      "Build the video and leave it. A one-minute reel takes roughly thirty minutes, and you can watch the steps as it works.",
    body: (
      <>
        <p>
          A one-minute reel takes about <strong>thirty minutes</strong>. You can
          watch every step in the middle panel, and you should not.
        </p>
        <p>
          This is the whole deal: it is slower than a human editor at the
          keyboard and it costs about fifty cents, and neither of those matters
          because you are not in the room.
        </p>
      </>
    ),
  },
  {
    title: "Review v1 and give feedback in words",
    schema:
      "Watch the first version, type what to change, and it produces a new version. Versions are kept side by side.",
    body: (
      <>
        <p>
          You get v1. Watch it, type what is wrong (&quot;the cut at eight
          seconds is too early&quot;, &quot;captions are too big&quot;), and it
          produces v2. Then v3. Every version is kept.
        </p>
        <p>
          This is the correct mental model for the whole thing: it is a first
          draft from an editor you are giving notes to, not a render you either
          accept or throw away.
        </p>
      </>
    ),
  },
  {
    title: "Nail the style on five seconds before you build the whole thing",
    schema:
      "Ask it to style only the first five seconds and produce several variations, then pick one before building the full video.",
    body: (
      <>
        <p>
          The highest-value habit here. Ask it to edit{" "}
          <strong>only the first five seconds</strong> and give you four
          variations of the caption style, the font, the music.
        </p>
        <p>
          Pick one, then build the rest. Iterating on five seconds costs almost
          nothing. Discovering you hate the captions after a thirty-minute
          render costs thirty minutes.
        </p>
      </>
    ),
  },
  {
    title: "Save the style so you never re-explain it",
    schema:
      "Once a video looks right, press save this style so the fonts, motion and feel become a skill you can reuse.",
    body: (
      <>
        <p>
          When a video finally looks right, press <strong>save this
          style</strong>. It reads back the fonts, the motion graphics and the
          general feel and stores them as a skill.
        </p>
        <p>
          Every video after that starts from your look instead of from nothing.
          This is what turns a good afternoon into a system: you pay the styling
          cost once.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "How much does one video cost",
    a: "About 50 cents in Claude usage for a one-minute reel, and no API keys at all. The editing framework underneath is HyperFrames from HeyGen, which is open source and free, so everything happens inside Claude Code and comes out of your existing plan rather than a separate bill.",
  },
  {
    q: "How many videos can I make per month",
    a: "It depends on your plan, because you are spending plan usage rather than credits. On Pro at $20 a month, roughly 20 to 32 videos, which works out at three to five a day against the daily limits. On the $100 tier, roughly 50 to 160. On the largest plan, roughly 200 to 320. Complex videos cost more than simple ones, so these are ranges rather than quotas.",
  },
  {
    q: "How long does it take to make a video",
    a: "About thirty minutes for a one-minute reel, scaling roughly with length. That is slower than a human editor at a keyboard, and it does not matter, because you are not sitting there. You brief it, leave, and come back to a first version.",
  },
  {
    q: "Do I need to label or organise my footage",
    a: "No, and this is the part that surprises people. Drop everything in unsorted. It watches each clip, works out what is in it, transcribes anything spoken, and decides where each piece belongs and what to cut. You never describe the material, only the video you want out of it.",
  },
  {
    q: "Is the output as good as a professional editor",
    a: "No, and I would not claim otherwise. A top-tier editor will beat it. The honest comparison is not against a great editor, it is against the video you were not going to make, because you could not afford one or did not have the two hours. Measured that way it wins easily.",
  },
  {
    q: "Can it make a video with no footage at all",
    a: "Yes. One of the examples I show started from nothing but a link to a landing page: it read the site, took the screenshots, the styling and the real reviews, and built a motion-graphics ad out of them. You can also just describe a motion-graphics video and get one with no materials at all.",
  },
  {
    q: "What kinds of video can it make",
    a: "The app has a what-it-can-do list covering the main shapes: a reel built from photos, footage cut to music, captions over a talking head, and motion graphics from scratch. There are templates for each underneath, which is why asking for style variations works so well.",
  },
  {
    q: "What do I do when something breaks",
    a: "Ask it. The app is running inside Claude Code, so typing \"explain how I use the saved styles\" or \"this failed, what happened\" gets an answer in a few seconds. Most problems people would post as a comment under the video are faster to solve by asking the thing that built the app.",
  },
];

export default function ClaudeCodeInstagramPage() {
  return (
    <ResourcePageShell
      slug="claude-code-instagram"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      repoCta={{ href: REPO }}
      title="Claude Code as your Instagram video editor"
      subhead="Drop your photos and a voice take on the left, say what you want, watch the reel appear on the right. Runs on your own laptop, free per video."
      steps={steps}
      troubleshooting={["claudeNotFound", "costs", "skipPermissions"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Instagram video editing", path: "/claude-code-instagram" },
      ]}
      howTo={{
        name: "Edit Instagram videos with Claude Code and Reel Studio",
        description:
          "Drop unsorted footage into Reel Studio, describe the video you want, and get an edited reel back with captions and motion graphics, then refine it version by version.",
        totalTime: "PT30M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="What it actually is">
            <Answer>
              A local app that hands your clips to Claude Code and lets you direct the edit in sentences, the way you would brief a human editor.
            </Answer>
            <Stats
              items={[
                { value: "~50c", label: "Claude usage per one-minute video" },
                { value: "~30 min", label: "Of work for that video" },
                { value: "0", label: "API keys to set up" },
              ]}
            />
            <Figure
              src="/guide/instagram-studio.webp"
              alt="Reel Studio: a materials panel, a Claude Code panel and the finished video"
              videoId={VIDEO_ID}
              at={40}
              caption="Three panels. Your clips on the left, the conversation in the middle, the cut on the right."
            />
            <p>
              Three panels.{" "}
              <strong>Left: everything you have.</strong> Clips, photos, a
              voiceover, music, dropped in unsorted.{" "}
              <strong>Middle: a sentence saying what you want.</strong>{" "}
              <strong>right: the edited video.</strong>
            </p>
            <p>
              The thing that makes it work is the part you do not do. You never
              describe your footage. It watches every clip, works out what is in
              it, transcribes anything spoken, and decides which two seconds of
              a thirty-second take are the ones worth keeping.
            </p>
            <p>
              So the instruction can be as short as &quot;make a good video out
              of these&quot;, and that is a genuinely different interaction from
              every template-based editor, where you are still the one deciding
              what goes in slot three.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="Two videos it made, and how">
            <p>
              <strong>A storytelling reel about moving to paris.</strong> I gave
              it a pile of photos, a few music files and a voiceover, and said:
              use the voiceover as the storyline, stitch the visuals so they
              make sense against it. It matched the b-roll to what was being
              said, beat by beat. Photos in that example, but video works the
              same way and it cuts the parts that are not relevant.
            </p>
            <p>
              <strong>A product ad from a single link.</strong> The materials
              panel contained one thing: a URL to a landing page for a travel-day
              tracking app. It read the site, pulled the screenshots, the visual
              style and the real reviews, and built a motion-graphics ad out of
              them. One prompt, no assets.
            </p>
            <Callout title="The honest quality line">
              <p>
                This is not the standard of a top-tier editor and I would not
                pretend it is. The comparison that matters is not against a
                great editor, it is against <strong>the video you were not
                going to make</strong> because you could not afford one or did
                not have two hours. Against that, it is not close.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="What a video costs, and how many you get">
            <p>
              The surprising part: <strong>No API keys.</strong> The editing
              framework underneath is{" "}
              <Out href="https://github.com/heygen-com/hyperframes">
                hyperframes from heygen
              </Out>
              , which is open source and free. Everything runs inside Claude Code, so you are spending plan usage rather than paying a separate
              bill.
            </p>
            <KeyFacts
              rows={[
                { label: "Cost per one-minute video", value: "About 50 cents of Claude usage" },
                { label: "Time per one-minute video", value: "About 30 minutes, scaling with length" },
                { label: "Extra APIs", value: "none" },
                { label: "The framework", value: "Hyperframes, open source, free" },
              ]}
            />
            <p>
              Because you are spending plan usage, the real question is how many
              videos a plan buys. Roughly:
            </p>
            <CompareTable
              columns={["plan", "Videos per month", "in practice"]}
              rows={[
                {
                  label: `Pro, ${usd(PLANS.pro.monthly)}`,
                  cells: ["20 to 32", "Three to five a day against the daily limits"],
                },
                {
                  label: `${usd(PLANS.max.monthlyFrom)} tier`,
                  cells: ["50 to 160", "Comfortable for a serious posting schedule"],
                },
                {
                  label: "Largest plan",
                  cells: ["200 to 320", "agency volume"],
                },
              ]}
              caption="Ranges, not quotas: a complex video with lots of motion graphics costs several times a simple photo reel."
            />
          </GuideSection>

          <GuideSection title="Using it">
            <Figure
              src="/guide/instagram-materials.webp"
              alt="The materials panel, holding the clips the edit can draw on"
              videoId={VIDEO_ID}
              at={280}
              caption="The materials panel is the whole input. Whatever is in here is what it can cut with."
            />
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="The four things that make the output good">
            <Figure
              src="/guide/instagram-terminal.webp"
              alt="Claude Code running in a terminal, driving the studio"
              videoId={VIDEO_ID}
              at={480}
              caption="Underneath the panels it is still Claude Code in a terminal, which is why you can tell it what to change in a sentence."
            />
            <p>
              The difference between people who get something postable and
              people who give up is these four, and none of them are technical.
            </p>
            <ol className="guide-list">
              <li>
                <strong>Style five seconds before you build sixty.</strong> Ask
                for four variations of the opening: font, caption style, music.
                Pick one. Then build. This saves more time than everything else
                here combined.
              </li>
              <li>
                <strong>Save the style when you like it.</strong> One button. It
                becomes a skill and every future video starts from your look
                rather than from default. You pay the styling cost once.
              </li>
              <li>
                <strong>Expect versions, like with a person.</strong> V1 is a
                first draft. Give notes, get v2. Anyone expecting the first
                render to be finished is going to be disappointed by a human
                editor too.
              </li>
              <li>
                <strong>Ask it when you are stuck.</strong> The app is running
                inside Claude Code. &quot;how do I use a saved style&quot; gets
                an answer in fifteen seconds, which is faster than asking me in
                the comments.
              </li>
            </ol>
          </GuideSection>

          <GuideSection title="What it is not">
            <ul>
              <li>
                <strong>Not fast.</strong> Thirty minutes a minute of video.
                Design your day around that, do not fight it.
              </li>
              <li>
                <strong>Not a replacement for a great editor.</strong> It is a
                replacement for not making the video.
              </li>
              <li>
                <strong>Not a script writer.</strong> It cuts the video. What to
                say is a different job, and{" "}
                <a href="/claude-reels">The reels research system</a> is the one
                that does it.
              </li>
              <li>
                <strong>Not free of a plan.</strong> Pro or higher. The free
                Claude account cannot run Claude Code at all.
              </li>
              <li>
                <strong>Not unlimited on Pro.</strong> Three to five videos a day
                is the honest ceiling there, which is plenty for one person and
                not enough for an agency.
              </li>
            </ul>
            <p>
              If you want the other half, deciding what the video should be
              about, that is{" "}
              <a href="/claude-reels">The reels system</a>, and the
              account-level strategy is on{" "}
              <a href="/claude-social-growth">The growth guide</a>. Never used{" "}
              <Code>claude code</Code>?{" "}
              <a href="/claude-code-tutorial">Start here</a>, and{" "}
              <a href="/claude-code-pricing">This is what the plans cost</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Code Instagram Video Editor: Free Setup Guide",
        description:
          "Set up Reel Studio, a local video editor driven by Claude Code, in five steps: VS Code, a Claude plan, Claude Code, one prompt that installs the rest, then your first Instagram Reel.",
        url: "https://www.oleg.ae/claude-code-instagram",
        datePublished: "2026-08-01",
        dateModified: "2026-08-27",
      }}
      boldaneCredit
    />
  );
}
