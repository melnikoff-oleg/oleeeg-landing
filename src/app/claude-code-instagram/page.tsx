import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ResourcePageShell } from "@/components/resource-page-shell";
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


const SECTIONS = [
  "what it actually is",
  "two videos it made, and how",
  "what a video costs, and how many you get",
  "using it",
  "the four things that make the output good",
  "what it is not",
];

const guideSteps = [
  {
    title: "start a new reel and drop the materials in",
    schema:
      "Create a new reel and put every clip, photo, voiceover and music file you want in it into the materials panel.",
    body: (
      <>
        <p>
          press new reel and put everything you have on the left: clips, photos,
          a voiceover, music. no order, no labels, no naming convention.
        </p>
        <p>
          you do not describe what any of it is. it watches each file, works out
          what is in it, transcribes what is said, and decides where it belongs.
          that is the part that makes this different from a template tool.
        </p>
      </>
    ),
  },
  {
    title: "say what the video should be, in a sentence",
    schema:
      "Describe the video you want in plain language in the middle panel, rather than specifying an edit.",
    body: (
      <>
        <p>
          the middle panel takes plain english. &quot;make a video about my trip
          to paris from these visuals, use the voiceover as the storyline, find
          some music, stitch it so it makes sense.&quot;
        </p>
        <p>
          you are briefing an editor, not operating an editor. what to make, not
          which cut goes where.
        </p>
      </>
    ),
  },
  {
    title: "press build and go and do something else",
    schema:
      "Build the video and leave it. A one-minute reel takes roughly thirty minutes, and you can watch the steps as it works.",
    body: (
      <>
        <p>
          a one-minute reel takes about <strong>thirty minutes</strong>. you can
          watch every step in the middle panel, and you should not.
        </p>
        <p>
          this is the whole deal: it is slower than a human editor at the
          keyboard and it costs about fifty cents, and neither of those matters
          because you are not in the room.
        </p>
      </>
    ),
  },
  {
    title: "review v1 and give feedback in words",
    schema:
      "Watch the first version, type what to change, and it produces a new version. Versions are kept side by side.",
    body: (
      <>
        <p>
          you get v1. watch it, type what is wrong (&quot;the cut at eight
          seconds is too early&quot;, &quot;captions are too big&quot;), and it
          produces v2. then v3. every version is kept.
        </p>
        <p>
          this is the correct mental model for the whole thing: it is a first
          draft from an editor you are giving notes to, not a render you either
          accept or throw away.
        </p>
      </>
    ),
  },
  {
    title: "nail the style on five seconds before you build the whole thing",
    schema:
      "Ask it to style only the first five seconds and produce several variations, then pick one before building the full video.",
    body: (
      <>
        <p>
          the highest-value habit here. ask it to edit{" "}
          <strong>only the first five seconds</strong> and give you four
          variations of the caption style, the font, the music.
        </p>
        <p>
          pick one, then build the rest. iterating on five seconds costs almost
          nothing. discovering you hate the captions after a thirty-minute
          render costs thirty minutes.
        </p>
      </>
    ),
  },
  {
    title: "save the style so you never re-explain it",
    schema:
      "Once a video looks right, press save this style so the fonts, motion and feel become a skill you can reuse.",
    body: (
      <>
        <p>
          when a video finally looks right, press <strong>save this
          style</strong>. it reads back the fonts, the motion graphics and the
          general feel and stores them as a skill.
        </p>
        <p>
          every video after that starts from your look instead of from nothing.
          this is what turns a good afternoon into a system: you pay the styling
          cost once.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "how much does one video cost",
    a: "About 50 cents in Claude usage for a one-minute reel, and no API keys at all. The editing framework underneath is HyperFrames from HeyGen, which is open source and free, so everything happens inside Claude Code and comes out of your existing plan rather than a separate bill.",
  },
  {
    q: "how many videos can i make per month",
    a: "It depends on your plan, because you are spending plan usage rather than credits. On Pro at $20 a month, roughly 20 to 32 videos, which works out at three to five a day against the daily limits. On the $100 tier, roughly 50 to 160. On the largest plan, roughly 200 to 320. Complex videos cost more than simple ones, so these are ranges rather than quotas.",
  },
  {
    q: "how long does it take to make a video",
    a: "About thirty minutes for a one-minute reel, scaling roughly with length. That is slower than a human editor at a keyboard, and it does not matter, because you are not sitting there. You brief it, leave, and come back to a first version.",
  },
  {
    q: "do i need to label or organise my footage",
    a: "No, and this is the part that surprises people. Drop everything in unsorted. It watches each clip, works out what is in it, transcribes anything spoken, and decides where each piece belongs and what to cut. You never describe the material, only the video you want out of it.",
  },
  {
    q: "is the output as good as a professional editor",
    a: "No, and I would not claim otherwise. A top-tier editor will beat it. The honest comparison is not against a great editor, it is against the video you were not going to make, because you could not afford one or did not have the two hours. Measured that way it wins easily.",
  },
  {
    q: "can it make a video with no footage at all",
    a: "Yes. One of the examples I show started from nothing but a link to a landing page: it read the site, took the screenshots, the styling and the real reviews, and built a motion-graphics ad out of them. You can also just describe a motion-graphics video and get one with no materials at all.",
  },
  {
    q: "what kinds of video can it make",
    a: "The app has a what-it-can-do list covering the main shapes: a reel built from photos, footage cut to music, captions over a talking head, and motion graphics from scratch. There are templates for each underneath, which is why asking for style variations works so well.",
  },
  {
    q: "what do i do when something breaks",
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
      title="claude code as your instagram video editor"
      subhead="drop your photos and a voice take on the left, say what you want, watch the reel appear on the right. runs on your own laptop, free per video."
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
          <GuideSection title="what it actually is">
            <p>
              three panels.{" "}
              <strong>left: everything you have.</strong> clips, photos, a
              voiceover, music, dropped in unsorted.{" "}
              <strong>middle: a sentence saying what you want.</strong>{" "}
              <strong>right: the edited video.</strong>
            </p>
            <p>
              the thing that makes it work is the part you do not do. you never
              describe your footage. it watches every clip, works out what is in
              it, transcribes anything spoken, and decides which two seconds of
              a thirty-second take are the ones worth keeping.
            </p>
            <p>
              so the instruction can be as short as &quot;make a good video out
              of these&quot;, and that is a genuinely different interaction from
              every template-based editor, where you are still the one deciding
              what goes in slot three.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="two videos it made, and how">
            <p>
              <strong>a storytelling reel about moving to paris.</strong> i gave
              it a pile of photos, a few music files and a voiceover, and said:
              use the voiceover as the storyline, stitch the visuals so they
              make sense against it. it matched the b-roll to what was being
              said, beat by beat. photos in that example, but video works the
              same way and it cuts the parts that are not relevant.
            </p>
            <p>
              <strong>a product ad from a single link.</strong> the materials
              panel contained one thing: a url to a landing page for a travel-day
              tracking app. it read the site, pulled the screenshots, the visual
              style and the real reviews, and built a motion-graphics ad out of
              them. one prompt, no assets.
            </p>
            <Callout title="the honest quality line">
              <p>
                this is not the standard of a top-tier editor and i would not
                pretend it is. the comparison that matters is not against a
                great editor, it is against <strong>the video you were not
                going to make</strong> because you could not afford one or did
                not have two hours. against that, it is not close.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="what a video costs, and how many you get">
            <p>
              the surprising part: <strong>no api keys.</strong> the editing
              framework underneath is{" "}
              <Out href="https://github.com/heygen-com/hyperframes">
                hyperframes from heygen
              </Out>
              , which is open source and free. everything runs inside claude
              code, so you are spending plan usage rather than paying a separate
              bill.
            </p>
            <KeyFacts
              rows={[
                { label: "cost per one-minute video", value: "about 50 cents of claude usage" },
                { label: "time per one-minute video", value: "about 30 minutes, scaling with length" },
                { label: "extra apis", value: "none" },
                { label: "the framework", value: "hyperframes, open source, free" },
              ]}
            />
            <p>
              because you are spending plan usage, the real question is how many
              videos a plan buys. roughly:
            </p>
            <CompareTable
              columns={["plan", "videos per month", "in practice"]}
              rows={[
                {
                  label: `Pro, ${usd(PLANS.pro.monthly)}`,
                  cells: ["20 to 32", "three to five a day against the daily limits"],
                },
                {
                  label: `${usd(PLANS.max.monthlyFrom)} tier`,
                  cells: ["50 to 160", "comfortable for a serious posting schedule"],
                },
                {
                  label: "largest plan",
                  cells: ["200 to 320", "agency volume"],
                },
              ]}
              caption="ranges, not quotas: a complex video with lots of motion graphics costs several times a simple photo reel."
            />
          </GuideSection>

          <GuideSection title="using it">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="the four things that make the output good">
            <p>
              the difference between people who get something postable and
              people who give up is these four, and none of them are technical.
            </p>
            <ol className="guide-list">
              <li>
                <strong>style five seconds before you build sixty.</strong> ask
                for four variations of the opening: font, caption style, music.
                pick one. then build. this saves more time than everything else
                here combined.
              </li>
              <li>
                <strong>save the style when you like it.</strong> one button. it
                becomes a skill and every future video starts from your look
                rather than from default. you pay the styling cost once.
              </li>
              <li>
                <strong>expect versions, like with a person.</strong> v1 is a
                first draft. give notes, get v2. anyone expecting the first
                render to be finished is going to be disappointed by a human
                editor too.
              </li>
              <li>
                <strong>ask it when you are stuck.</strong> the app is running
                inside claude code. &quot;how do i use a saved style&quot; gets
                an answer in fifteen seconds, which is faster than asking me in
                the comments.
              </li>
            </ol>
          </GuideSection>

          <GuideSection title="what it is not">
            <ul>
              <li>
                <strong>not fast.</strong> thirty minutes a minute of video.
                design your day around that, do not fight it.
              </li>
              <li>
                <strong>not a replacement for a great editor.</strong> it is a
                replacement for not making the video.
              </li>
              <li>
                <strong>not a script writer.</strong> it cuts the video. what to
                say is a different job, and{" "}
                <a href="/claude-reels">the reels research system</a> is the one
                that does it.
              </li>
              <li>
                <strong>not free of a plan.</strong> Pro or higher. the free
                claude account cannot run claude code at all.
              </li>
              <li>
                <strong>not unlimited on Pro.</strong> three to five videos a day
                is the honest ceiling there, which is plenty for one person and
                not enough for an agency.
              </li>
            </ul>
            <p>
              if you want the other half, deciding what the video should be
              about, that is{" "}
              <a href="/claude-reels">the reels system</a>, and the
              account-level strategy is on{" "}
              <a href="/claude-social-growth">the growth guide</a>. never used{" "}
              <Code>claude code</Code>?{" "}
              <a href="/claude-code-tutorial">start here</a>, and{" "}
              <a href="/claude-code-pricing">this is what the plans cost</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Code Instagram Video Editor: Free Setup Guide",
        description:
          "Set up Reel Studio, a local video editor driven by Claude Code, in five steps: VS Code, a Claude plan, Claude Code, one prompt that installs the rest, then your first Instagram Reel.",
        url: "https://oleg.ae/claude-code-instagram",
        datePublished: "2026-08-01",
        dateModified: "2026-08-27",
      }}
      boldaneCredit
    />
  );
}
