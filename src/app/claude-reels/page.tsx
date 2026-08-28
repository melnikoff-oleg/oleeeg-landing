import { ResourcePageShell } from "@/components/resource-page-shell";
import { CopyButton } from "@/components/copy-button";
import {
  Answer,
  Block,
  Callout,
  Code,
  Figure,
  Guide,
  GuideSection,
  GuideSteps,
  GuideToc,
  KeyFacts,
  Stats,
} from "@/components/guide";
import { APIFY, PLANS, usd } from "@/lib/pricing";

const VIDEO_ID = "JhtbnZUU_8E";
const VIDEO_TITLE = "Claude Code for Viral Instagram Reels";

const steps = [
  {
    title: "Install Visual Studio Code",
    content: (
      <div className="space-y-3">
        <p>
          Download and install VS Code from{" "}
          <a
            href="https://code.visualstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            code.visualstudio.com
          </a>
          . It auto-detects your OS.
        </p>
        <p>
          Run the installer and verify VS Code launches properly.
        </p>
      </div>
    ),
  },
  {
    title: "Install Claude Code",
    content: (
      <div className="space-y-3">
        <p>
          Open the terminal in VS Code (Terminal → New Terminal) and run the
          line for your machine:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere] whitespace-pre-wrap">
          {`# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex`}
        </div>
        <p>
          Then <strong>close the terminal and open a new one</strong>, or the
          command will still look missing. Check with{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude --version
          </code>
          .
        </p>
        <p>
          Now type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          and sign in. You need a paid plan (Pro or Max); the free one will not
          let you in.
        </p>
      </div>
    ),
  },
  {
    title: "Download the project from GitHub",
    content: (
      <div className="space-y-3">
        <p>
          Go to the GitHub repository:
        </p>
        <p>
          <a
            href="https://github.com/melnikoff-oleg/social-media"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            github.com/melnikoff-oleg/social-media
          </a>
        </p>
        <p>
          Click the green <span className="text-silver">&lt;&gt; Code</span>{" "}
          button, then <span className="text-silver">Download ZIP</span>. Unzip
          the file and open the folder in VS Code via File → Open Folder.
        </p>
        <p>
          Alternatively, clone it from the terminal:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          git clone https://github.com/melnikoff-oleg/social-media.git
        </div>
      </div>
    ),
  },
  {
    title: "Get your API keys",
    content: (
      <div className="space-y-4">
        <p>You need three API keys:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                (scraping Instagram)
              </span>
            </p>
            <p className="mt-1">
              Scrapes Instagram reels, view counts, and engagement data from
              competitor accounts. Sign up at{" "}
              <a
                href="https://apify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                apify.com
              </a>{" "}
              → Settings → Personal API Token.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Google Gemini{" "}
              <span className="font-normal text-silver-muted">
                (analyzing video content)
              </span>
            </p>
            <p className="mt-1">
              Analyzes the actual video content of reels: hooks, visuals,
              retention mechanisms. Get your key at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                aistudio.google.com/apikey
              </a>
              .
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Anthropic{" "}
              <span className="font-normal text-silver-muted">
                (generating scripts)
              </span>
            </p>
            <p className="mt-1">
              Generates ready-to-film scripts based on competitor analysis. Sign
              up at{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                console.anthropic.com
              </a>{" "}
              → Settings → API Keys.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Configure your .env file",
    content: (
      <div className="space-y-3">
        <p>
          In the project folder, find{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env.example
          </code>{" "}
          (or{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env
          </code>
          ). Duplicate it and rename to{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            .env
          </code>{" "}
          if needed.
        </p>
        <p>Paste your API keys:</p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver [overflow-wrap:anywhere]">
          APIFY_API_TOKEN=your_apify_token_here
          <br />
          GEMINI_API_KEY=your_gemini_key_here
          <br />
          ANTHROPIC_API_KEY=your_anthropic_key_here
        </div>
        <p>
          Save the file. Check the project README if variable names differ.
        </p>
      </div>
    ),
  },
  {
    title: "Run the project",
    content: (
      <div className="space-y-3">
        <p>
          Open the terminal in VS Code, type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          to start Claude Code, and ask it to help you run the project.
        </p>
        <p>
          Claude Code will install dependencies, start the app, and walk you
          through the workflow: scraping competitor reels, analyzing hooks and
          retention patterns, and generating ready-to-film scripts.
        </p>
      </div>
    ),
  },
];


// Oleg's two real configs, transcribed from the video (JhtbnZUU_8E, around
// 4:00). They are the actual product of this system, so the page hands them
// over verbatim rather than paraphrasing them. Kept as consts so the copy
// button and the displayed text can never drift.
//
// One character changed: an en dash in "THE SHORTER THE ANALYSIS - THE BETTER"
// became a comma, per the site-wide no-dash rule. Nothing else is edited.
const ANALYSIS_PROMPT = `# CONCEPT
Overall description of the concept of this video, and what makes it valuable and interesting (1-3 sentences).
-> Clarify the core tension: what belief is challenged, what mistake is exposed, or what outcome is promised.
-> One clear idea only. No subtopics.

# HOOK
Detailed description of the first 5 seconds of the video, what makes it scroll-stopping and attention-grabbing, why a viewer needs to stop to watch it (1-3 sentences).
-> Break it down into:
- VISUAL (what is seen in the first 1-2 seconds: movement, facial expression, contrast, pattern break)
- TEXT (short on-screen statement: danger, promise, or contradiction, max 6-8 words)
- AUDIO (first spoken words: confident, direct, no intro, no context)
-> The hook must create either fear of loss, strong curiosity, or identity relevance.

# RETENTION MECHANISMS
Detailed description of how the creator manages to retain viewers throughout the video (1-7 sentences).
-> Open loops ("In a second I'll show you why...", "Most people miss this part...")
-> Delayed payoff (main insight is intentionally held back)
-> Micro-escalations every 3-5 seconds (new angle, sharper wording, visual or tonal shift)
-> Pattern interrupts (pauses, emphasis, cut, zoom, gesture)
-> Clear forward momentum: the viewer feels the video is going somewhere.

# REWARD
Describe the ultimate value that the viewer gets by watching this video (1-3 sentences).
-> Be explicit: what does the viewer now understand, feel, or see differently?
-> Define whether the reward is Education (clarity), Entertainment (emotional release), or Inspiration (self-belief / action).
-> The reward should feel proportional to the time invested.

# SCRIPT
Describe the full script of the video (1-20 sentences, as many as needed).
-> Structure:
1. Immediate hook (no greeting)
2. Problem framing / tension escalation
3. Why this matters (stakes)
4. Main insight or shift in perspective (this comes AFTER retention is established)
5. Clean close (no rambling; optional CTA only if natural)
-> Include: scenes, actions, voiceover, exact wording if possible.
-> Keep sentences short. Spoken language only.

OVERALL RULE:
THE SHORTER THE ANALYSIS, THE BETTER.
If it can be said in fewer words, it should be.
Clarity > cleverness.
Retention > information.`;

// The concepts config, with the client-specific lines replaced by capitalised
// placeholders. The shape is exactly what is on screen in the video.
const CONCEPTS_PROMPT = `Adapt this video for WHO YOU ARE: WHAT YOU DO, WHO YOU SERVE, WHAT MAKES YOU DIFFERENT IN ONE OR TWO SENTENCES.

Task:
Give us 3 NEW video concepts inspired by the ORIGINAL reference.
Do not copy the original.
Translate the core idea into the CONTEXT OF YOUR NICHE AND YOUR AUDIENCE.
MAINLY iterate and sharpen the HOOKS.

Focus:
- First 3 seconds must stop YOUR BUYER from scrolling
- Hooks should challenge a belief, fear, or misconception they have
- Calm authority > hype
- Emotional credibility > performance
- No shouting, no buzzwords, no exaggeration

The output should have this format:

# CONCEPT 1
Text description (1-3 sentences)

## HOOK
Detailed hook description (1-3 sentences)
Describe:
- What is seen in the first 2 seconds
- What is said in the first line
- Why this hook works specifically for YOUR AUDIENCE

## SCRIPT
Detailed script description (1-20 sentences, as many as needed)
Include:
- Scene flow
- Spoken text / voiceover
- Clear but understated payoff
- Subtle authority, not selling

# CONCEPT 2
...

# CONCEPT 3
...`;

const SECTIONS = [
  "The idea: stop guessing what to post",
  "What the system does, in order",
  "What it costs to run",
  "How to pick the creators to study",
  "The two prompts that decide everything",
  "The exact configs I use",
  "Reading the output without fooling yourself",
  "What it gets wrong",
];

const guideSteps = [
  {
    title: "Add the creators you want to learn from",
    schema:
      "Add 5 to 10 Instagram accounts in your niche that are already winning, and the app records follower count, reels per month and average views for each.",
    body: (
      <>
        <p>
          Paste an Instagram username, tag it with a category, press add. The
          app records the follower count, how many reels they post a month, and
          their average views.
        </p>
        <p>
          Those three numbers are the point. They tell you whether an account is
          worth studying <strong>before</strong> you spend anything analysing
          it. An account averaging 40,000 views on daily posting is a teacher.
          An account with 400,000 followers and 3,000 views a reel is a
          cautionary tale.
        </p>
      </>
    ),
  },
  {
    title: "Write the analysis instruction",
    schema:
      "Write the instruction that says what to extract from each video: concept, hook, retention mechanism, reward and script structure.",
    body: (
      <>
        <p>
          This is a config, written once per niche, and it decides the quality of
          everything downstream. Mine asks for five things from every video:
        </p>
        <ul>
          <li>
            <strong>The concept.</strong> What is this video actually about, in
            one line.
          </li>
          <li>
            <strong>The hook.</strong> The first three seconds, verbatim, and
            why they work.
          </li>
          <li>
            <strong>The retention mechanism.</strong> What stops you scrolling
            at second eight. An open loop, a visual change, a promise not yet
            paid.
          </li>
          <li>
            <strong>The reward.</strong> What the viewer leaves with. An
            insight, a laugh, a number they did not know.
          </li>
          <li>
            <strong>The script structure.</strong> How the thing is built, beat
            by beat.
          </li>
        </ul>
        <p>
          Start smaller than that if you want. &quot;analyse the hook and the
          script&quot; is a legitimate first version, and you can ask Claude to
          expand it once you have seen what comes back.
        </p>
      </>
    ),
  },
  {
    title: "Write the concepts instruction",
    schema:
      "Write the second instruction, giving your own context so the system can translate each viral pattern into a video you could actually film.",
    body: (
      <>
        <p>
          The second config is where your own context goes: who you are, what
          you sell, who you are talking to, what your videos should feel like.
        </p>
        <p>
          Without it you get a summary of somebody else&apos;s video. With it
          you get a video you could film tomorrow. This is the difference
          between the system being interesting and the system being useful, and
          it is the step people skimp on.
        </p>
      </>
    ),
  },
  {
    title: "Run the pipeline",
    schema:
      "Run the pipeline for a config, choosing how many top videos per creator and over what window, then wait.",
    body: (
      <>
        <p>
          Pick the config, then how many videos per creator and over what
          window. My default is the <strong>top 3 videos from the last 30
          days</strong> per creator, so eight creators gives about 24 videos.
        </p>
        <p>
          The recency window matters more than the count. A reel from eighteen
          months ago won a different feed than the one you are posting into
          tomorrow.
        </p>
      </>
    ),
  },
  {
    title: "Read the results, sorted by views",
    schema:
      "Results come back sorted by view count, each with the analysis and three concepts written for your own niche.",
    body: (
      <>
        <p>
          You get a table sorted from most-viewed down. Each row has the
          analysis and about three concepts written for you, so 24 videos is
          somewhere near 70 candidate ideas.
        </p>
        <p>
          Most of them will not be good. That is fine and expected. The job the
          system does is not producing 70 good ideas, it is removing the blank
          page so your judgement has something to work on.
        </p>
      </>
    ),
  },
  {
    title: "Change the system by asking",
    schema:
      "Because the app is a Claude Code project, changing it is a sentence in the terminal rather than an edit to the code.",
    body: (
      <>
        <p>
          This part surprises people. The app is a Claude Code project, so
          changing it is a sentence, not a code change. &quot;change the theme
          from dark to light&quot; works. So does &quot;switch the scraping from
          Instagram to TikTok&quot;, which is how{" "}
          <a href="/claude-tiktok">The TikTok version</a> exists.
        </p>
        <p>
          You do not need to read the code. You need to be able to say what you
          want.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "Do I need to know how to code to use this",
    a: "No. You download a folder, paste three API keys into a text file, and type one command. Everything after that is plain English in a terminal: to change how the app looks or what it scrapes, you say so and Claude Code makes the change. The only genuinely new skill is being willing to use a terminal.",
  },
  {
    q: "How much does this cost to run",
    a: "A paid Claude plan at $20 a month, plus scraping and analysis. Apify gives $5 of credit free every month, Google AI Studio has a free Gemini tier, and the script writing runs through your Claude plan. In a normal month of a few pipeline runs the marginal cost is close to zero. Heavy use pushes you past the free Apify credit first.",
  },
  {
    q: "How many creators should I track",
    a: "Between five and ten to start, all in one niche. Fewer than five and you are copying one person's style rather than learning what the niche rewards. More than ten mostly costs you scraping credit for patterns you already saw. Add more once you know which ones are actually teaching you something.",
  },
  {
    q: "Is scraping Instagram allowed",
    a: "You are reading public posts, which is the same thing you do by opening the app, and Apify is a mainstream service built for it. Two limits worth knowing anyway: do not scrape private accounts, and do not republish someone else's video. What this system takes is the pattern, the hook shape, the retention mechanism, and those are not anyone's property.",
  },
  {
    q: "Will the scripts sound like me",
    a: "Only if you tell it who you are. That is what the concepts instruction is for: your niche, your offer, your audience, the way your videos should feel. Skip it and you get a competent summary of someone else's video. The system produces the structure. The voice is still your job, and the point is that you now have your judgement pointed at the right thing.",
  },
  {
    q: "Why analyse the video instead of just the caption",
    a: "Because the caption is not why the reel worked. The hook is the first three seconds of footage, and the retention mechanism is a visual or structural choice you cannot see in the text. That is why the pipeline sends the actual video to Gemini rather than reading the post: the analysis is of what was on screen.",
  },
  {
    q: "Can I use this for TikTok or YouTube instead",
    a: "Yes, and that is the real lesson of the project. The pipeline is scrape, analyse, generate, and only the first step is platform-specific. Ask Claude Code to point the scraper at TikTok and it will. There is a TikTok version of this guide on the site that was built exactly that way.",
  },
];

export default function ClaudeReelsPage() {
  return (
    <ResourcePageShell
      slug="claude-reels"
      repoCta={{ href: "https://github.com/melnikoff-oleg/social-media" }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="Claude Code for Instagram reels that earn attention"
      subhead="Study the reels actually winning in your niche, then turn what you learn into ready-to-film scripts with sharp hooks, retention analysis, and clear visual direction. Craft over guesswork."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "noEnvFile", "geminiQuota", "creditBalance", "costs", "costsScraping", "skipPermissions", "scrapingSafety"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Instagram Reels", path: "/claude-reels" },
      ]}
      howTo={{
        name: "Build a viral Instagram Reels research system with Claude Code",
        description:
          "Scrape the reels already winning in your niche, analyse hooks and retention mechanisms, and generate ready-to-film scripts written for your own audience.",
        totalTime: "PT5M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="The idea: stop guessing what to post">
            <Answer>
              It reads the reels already winning in your niche, works out why
              each one held attention, and writes you new scripts that use the
              same mechanism on your own topic.
            </Answer>
            <Stats
              items={[
                { value: "8", label: "Creators tracked in a normal run" },
                { value: "~70", label: "Scripts out of a single run" },
                { value: "Minutes", label: "Time that run takes" },
                { value: "$0", label: "Marginal cost on the free tiers" },
              ]}
            />
            <p>
              Most advice about going viral is somebody describing what worked
              for them once. This replaces that with the actual data: it reads
              the reels that are winning in your niche <em>right now</em>, works
              out why, and writes scripts that use the same mechanism for your
              own topic.
            </p>
            <p>
              I built the first version in under thirty minutes with Claude Code, and the point of the video was never the app. It is that
              this shape of thing, scrape, analyse, generate, is now something
              you can build in an afternoon for whatever you happen to need.
            </p>
            <Callout title="The honest framing">
              <p>
                This does not make you go viral. It removes the blank page and
                replaces guesswork with evidence, so the judgement you already
                have is pointed at something real. That is a big edge and it is
                not the same as a guarantee.
              </p>
            </Callout>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="What the system does, in order">
            <ol className="guide-list">
              <li>
                <strong>Tracks creators.</strong> You add Instagram accounts in
                your niche. It records followers, posting frequency and average
                views, so you can see who is worth studying.
              </li>
              <li>
                <strong>Scrapes their best recent reels.</strong> Top three from
                the last thirty days per creator, by default, through Apify.
              </li>
              <li>
                <strong>Watches each video.</strong> The actual video goes to
                Gemini, not the caption. It comes back with the hook, the
                retention mechanism, the reward and the script structure.
              </li>
              <li>
                <strong>Writes concepts for you.</strong> Claude takes each
                pattern and your own context and writes about three new
                concepts, with full scripts, in your niche.
              </li>
            </ol>
            <p>
              Eight creators, three videos each, three concepts each: roughly 70
              scripts from one run that takes minutes and costs close to
              nothing.
            </p>
            <Figure
              src="/guide/reels-pipeline.webp"
              alt="The Run Pipeline screen, with the config selected and the run in progress"
              videoId={VIDEO_ID}
              at={280}
              caption="One run, start to finish. You pick a config, press go, and come back to scripts."
            />
          </GuideSection>

          <GuideSection title="What it costs to run">
            <KeyFacts
              rows={[
                { label: "Claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month. Required, the free plan will not sign you in.` },
                { label: "Apify, for scraping", value: `${usd(APIFY.freeMonthlyCredit)} of credit free every month, which covers normal use` },
                { label: "Google Gemini, for watching the videos", value: "Free tier in Google AI studio, with a daily request cap" },
                { label: "Anthropic API, for the scripts", value: "Optional. The project can use your Claude plan instead." },
                { label: "Realistic monthly bill", value: `${usd(PLANS.pro.monthly)}, unless you run pipelines daily` },
              ]}
              caption="The thing that runs out first is the Gemini free tier, because watching video is the expensive step."
            />
          </GuideSection>

          <GuideSection title="How to pick the creators to study">
            <Answer>
              Pick accounts in your exact niche whose average views are far
              above their follower count, not the biggest accounts you can find.
            </Answer>
            <Figure
              src="/guide/reels-creators.webp"
              alt="The creators screen, listing tracked accounts with followers, reels a month and average views"
              videoId={VIDEO_ID}
              at={168}
              caption="Every account you track shows three numbers: followers, reels a month, average views. The third divided by the first is the only one that matters."
            />
            <p>
              This decides more than the prompts do, and it is the step people
              rush. What I look for, in order:
            </p>
            <ul>
              <li>
                <strong>Same niche, not same size.</strong> A real estate broker
                should study real estate accounts, not general marketing
                accounts with better numbers.
              </li>
              <li>
                <strong>High average views relative to followers.</strong> This
                is the tell for a creator whose <em>content</em> works, rather
                than one coasting on an audience they built years ago.
              </li>
              <li>
                <strong>Posting often.</strong> More than a few reels a month
                means the recent-window filter has something to find.
              </li>
              <li>
                <strong>Five to ten of them.</strong> Fewer and you are copying
                one person. More and you are paying to rediscover the same
                patterns.
              </li>
            </ul>
          </GuideSection>

          <GuideSection title="The two prompts that decide everything">
            <Answer>
              One prompt tells Gemini how to watch a reel, the other tells
              Claude how to turn what it saw into your scripts. Everything else
              in the project is plumbing.
            </Answer>
            <Figure
              src="/guide/reels-config.webp"
              alt="The config screen, with the analysis instruction and the new concepts instruction side by side"
              videoId={VIDEO_ID}
              at={200}
              caption="A config is a name, a creator category, and the two prompts. You can keep several and run a different one per client."
            />
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="The exact configs I use">
            <p>
              These are the two configs from the video, not a cleaned-up
              version. The first one goes in the analysis field, the second in
              the concepts field. The second has the client-specific lines
              swapped for capitals, and those capitals are the only part you
              have to write.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <p className="font-display text-lg font-medium text-silver">
                Analysis instruction
              </p>
              <CopyButton text={ANALYSIS_PROMPT} label="copy" />
            </div>
            <Block>{ANALYSIS_PROMPT}</Block>
            <p>
              The last four lines do more work than the rest. Without them the
              analysis comes back as an essay per video, and twenty-four essays
              is a thing you will not read.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <p className="font-display text-lg font-medium text-silver">
                New concepts instruction
              </p>
              <CopyButton text={CONCEPTS_PROMPT} label="copy" />
            </div>
            <Block>{CONCEPTS_PROMPT}</Block>
            <p>
              <strong>&quot;do not copy the original&quot;</strong> and{" "}
              <strong>&quot;translate the core idea&quot;</strong> are the two
              lines that keep this from being plagiarism with extra steps. The
              mechanism transfers, the subject does not.
            </p>
          </GuideSection>

          <GuideSection title="Reading the output without fooling yourself">
            <Answer>
              Read the hooks column first and the view counts last. The top row
              is the most viewed idea, which is not the same as the best one.
            </Answer>
            <Figure
              src="/guide/reels-concept.webp"
              alt="A generated concept, showing the reward the viewer gets and the full script"
              videoId={VIDEO_ID}
              at={320}
              caption="One row of the output: what the original did, why it held attention, and a script that does the same thing for your topic."
            />
            <p>
              You get a table sorted by views, each row carrying the analysis and
              the concepts. The trap is treating the top row as the best idea. It
              is the <em>most viewed</em> idea, which is a different thing: a
              3.5 million view reel may have worked because of who posted it.
            </p>
            <p>What I actually do with a run:</p>
            <ol className="guide-list">
              <li>
                Read the <strong>hooks</strong> column top to bottom first,
                ignoring everything else. Patterns show up fast, and they are
                the transferable part.
              </li>
              <li>
                Mark the three or four concepts I could film this week without
                needing anything I do not have.
              </li>
              <li>
                Throw away anything that only works because of the original
                creator&apos;s audience or face.
              </li>
              <li>
                Rewrite the hook in my own words before filming. Always. The
                generated one is a starting shape, not a line to read.
              </li>
            </ol>

            <Figure
              src="/guide/reels-hooks.webp"
              alt="The hook patterns view, splitting winning hooks from weaker hooks"
              videoId={VIDEO_ID}
              at={820}
              caption="The view worth having open: the hooks that worked next to the hooks that did not, taken from the transcripts rather than the captions."
            />
          </GuideSection>

          <GuideSection title="What it gets wrong">
            <ul>
              <li>
                <strong>Most concepts are mediocre.</strong> Expect three or
                four usable ideas from seventy, and be pleased with that.
              </li>
              <li>
                <strong>It cannot see why something worked off-platform.</strong>{" "}
                A reel that went viral because of a news cycle looks like a
                mechanism, and is not.
              </li>
              <li>
                <strong>Hooks come back generic if your context is
                generic.</strong> The concepts instruction is the fix, and it is
                the config people write in one line.
              </li>
              <li>
                <strong>The Gemini free tier runs out.</strong> Video analysis is
                the expensive call, and a big run hits the daily cap. The fix is
                fewer creators per run, not a bigger plan.
              </li>
              <li>
                <strong>It will happily analyse a dead niche.</strong> If the
                accounts you picked are not winning, the system faithfully
                teaches you how to not win.
              </li>
            </ul>
            <p>
              The same pipeline pointed at other platforms is on{" "}
              <a href="/claude-tiktok">The TikTok guide</a>; the version that
              writes and packages the posts rather than researching them is on{" "}
              <a href="/claude-content">The content guide</a>; and if you want to
              edit the video too, <Code>reel studio</Code> is on{" "}
              <a href="/claude-code-instagram">The Instagram editor guide</a>.
              New to Claude Code entirely? Start with{" "}
              <a href="/claude-code-tutorial">The setup guide</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "AI Instagram Reels with Claude Code",
        description:
          "Reverse-engineer viral Instagram Reels from competitors, analyze hooks and retention patterns, and generate ready-to-film AI Reels scripts.",
        url: "https://www.oleg.ae/claude-reels",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
      boldaneCredit
    />
  );
}
