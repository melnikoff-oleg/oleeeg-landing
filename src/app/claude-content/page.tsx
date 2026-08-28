import { ResourcePageShell } from "@/components/resource-page-shell";
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
  Out,
  Stats,
} from "@/components/guide";
import { PLANS, usd } from "@/lib/pricing";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";

const VIDEO_ID = "QOuH88WW7bQ";
const VIDEO_TITLE = "Claude Code Content Creation System";
const DRIVE_URL =
  "https://drive.google.com/drive/folders/15E8VAaO7ULLYOINJOxYedvXeokegjP0D?usp=drive_link";

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
        <p>Run the installer and verify VS Code launches properly.</p>
      </div>
    ),
  },
  {
    title: "Install Claude Code",
    content: (
      <div className="space-y-3">
        <p>
          Open the terminal in VS Code (Terminal → New Terminal) and run:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          Npm install -g @anthropic-AI/claude-code
        </div>
        <p>
          Requires Node.js (LTS). If you don&apos;t have it, download from{" "}
          <a
            href="https://nodejs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            nodejs.org
          </a>
          .
        </p>
        <p>
          Once installed, type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          in the terminal and complete Anthropic account authentication.
        </p>
      </div>
    ),
  },
  {
    title: "Get your API keys",
    content: (
      <div className="space-y-4">
        <p>You need two API keys:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              Apify{" "}
              <span className="font-normal text-silver-muted">
                (scraping trending content from social media)
              </span>
            </p>
            <p className="mt-1">
              Create an account at{" "}
              <a
                href="https://apify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                apify.com
              </a>
              , then go to Settings → Integrations and copy your Personal API
              Token.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              Kie.ai{" "}
              <span className="font-normal text-silver-muted">
                (generating visuals: infographics, carousels)
              </span>
            </p>
            <p className="mt-1">
              Sign up at{" "}
              <a
                href="https://kie.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                kie.ai
              </a>{" "}
              and generate your API key from account settings.
            </p>
          </div>
        </div>
        <p>Store both keys somewhere safe. You&apos;ll need them in step 5.</p>
      </div>
    ),
  },
  {
    title: "Get the project files",
    content: (
      <div className="space-y-3">
        <p>
          Download or copy the project folder from Google Drive:
        </p>
        <p>
          <a
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            open Google Drive folder
          </a>
        </p>
        <p>
          Once downloaded, open the folder in VS Code via File → Open Folder.
        </p>
      </div>
    ),
  },
  {
    title: "Add your API keys and run the project",
    content: (
      <div className="space-y-3">
        <p>
          Open the terminal in VS Code and type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>{" "}
          to start Claude Code.
        </p>
        <p>
          Insert both API keys into the project configuration, following the
          README instructions in the project folder. Claude Code can help you
          set everything up if you ask it.
        </p>
      </div>
    ),
  },
];


const SECTIONS = [
  "What one command actually produces",
  "Why this is not ChatGPT with extra steps",
  "The folder is your employee's brain",
  "Setting it up",
  "The photo trick that makes it look like you",
  "The command, and how to change it",
  "What it costs and how long it takes",
  "What it does badly",
];

const guideSteps = [
  {
    title: "Open the template and start Claude Code",
    schema:
      "Download the template folder, open it in VS Code, and start Claude Code in the terminal.",
    body: (
      <>
        <p>
          Download the template, open the folder in VS Code (file, then open
          folder), open a terminal, and run <Code>claude</Code>. That is the
          whole install.
        </p>
      </>
    ),
  },
  {
    title: "Add two API keys",
    schema:
      "Put an Apify key and an image generation key into the .env file so Claude Code can scrape trends and produce visuals.",
    body: (
      <>
        <p>
          Open <Code>.env</Code> and paste two keys:{" "}
          <Out href="https://apify.com">Apify</Out> for scraping what is
          trending, and an image model key (i use{" "}
          <Out href="https://kie.ai">kie.ai</Out>) for the visuals.
        </p>
        <Block>{`APIFY_API_KEY=...
KIE_AI_API_KEY=...`}</Block>
        <p>
          Both take about a minute to get. These two keys are the difference
          between a chat that describes a post and a project that produces one.
        </p>
      </>
    ),
  },
  {
    title: "Let it learn who you are",
    schema:
      "Point the project at your own social profile so it scrapes your existing posts and learns your topics and voice.",
    body: (
      <>
        <p>
          Point it at your own profile and let it read your existing posts. On
          the account I set up in the video it pulled 600 posts and took about
          six minutes.
        </p>
        <p>
          This is what stops the output being generic. It is not learning to
          write, it is learning what <em>you</em> write about and how your
          audience responds.
        </p>
      </>
    ),
  },
  {
    title: "Add your photos and one reference face",
    schema:
      "Put your photos in the context images folder, including one clear face shot named me.jpeg, and have Claude rename them descriptively.",
    body: (
      <>
        <p>
          Drop your photos into <Code>context/images/</Code>. Include one clear
          shot of your face named <Code>me.jpeg</Code>.
        </p>
        <p>Then ask it to catalogue them:</p>
        <Block>{`i added images to context/images.
rename them to something descriptive.
use me.jpeg to identify which person is me.`}</Block>
        <p>
          Fifty-four seconds later the filenames read{" "}
          <Code>orange-sofa.jpg</Code>, <Code>black-dress.jpg</Code> and so on.
          Now, when it writes a post, it can pick a photo that fits it rather
          than reaching for whatever is first.
        </p>
      </>
    ),
  },
  {
    title: "Give it one style reference",
    schema:
      "Put one example image of the visual style you want into the reference folder so generated infographics match your brand.",
    body: (
      <>
        <p>
          Put one image of the look you want into <Code>reference/</Code>. An
          infographic in your colours is enough: it takes the palette, the type
          and the general feel from that single picture.
        </p>
        <p>
          One good reference beats a page of description. The model is looking
          at the image.
        </p>
      </>
    ),
  },
  {
    title: "Run the command",
    schema:
      "Ask for ten posts. It scrapes what is trending in your niche, writes the copy and produces the visuals, then opens a dashboard.",
    body: (
      <>
        <p>
          <Code>create 10 posts</Code>. It scrapes what is trending in your
          niche, writes each post, generates the visuals, and opens a dashboard
          when it is finished.
        </p>
        <p>
          My default mix is four posts with a personal photo, four infographics
          and two carousels. All of that is just words in the prompt: change the
          numbers, ask for videos instead, whatever you need.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "How long does it take to generate 10 posts",
    a: "About 17 minutes end to end, and most of that is generating images. The writing is fast. You start it, go and do something else, and come back to a dashboard with ten finished posts in it. Setup before your first run is another five to ten minutes.",
  },
  {
    q: "Can it use my own photos in the posts",
    a: "Yes, and this is the part that makes the output look like you rather than like stock. Put your photos in the context images folder with one clear face shot named me.jpeg, and ask Claude to rename them descriptively using that shot to identify you. It then picks a photo that fits each post instead of reaching for the first one.",
  },
  {
    q: "Why not just use ChatGPT to write posts",
    a: "Because a chat window cannot see what is trending in your niche this week, cannot generate the infographic, and cannot hand you a dashboard of finished posts. Claude Code calls a scraper for the trends and an image model for the visuals, and writes the output to files. The gap is not writing quality, it is that one produces text and the other produces posts.",
  },
  {
    q: "How does it know what is trending in my niche",
    a: "Through Apify, which has purpose-built scrapers for TikTok, Instagram, YouTube and Facebook. Claude Code calls them, reads what is performing right now, and writes from that. Asking Claude Code to scrape those sites directly does not work: the platforms block it, which is exactly why a service like Apify exists.",
  },
  {
    q: "Will the posts sound like me",
    a: "They start closer than you would expect, because the project reads your existing posts first, and they still need your pass. Treat the output as ten strong drafts with your topics and your evidence in them, not as ten things to publish. The time saved is in the blank page and the visuals, not in the final judgement.",
  },
  {
    q: "What are the folders in the project for",
    a: "They are the brain of the thing: context about you and your audience, reference images for the visual style, example copy worth imitating, and skills for specific jobs like writing hooks or building carousels. You never have to open them. They are what makes the chat interface produce something specific instead of something generic.",
  },
  {
    q: "How much does it cost per batch of posts",
    a: "A Claude plan at $20 a month covers the thinking and the writing. The variable cost is scraping and image generation, and it is small: Apify gives $5 of free credit a month and images are cents each. A batch of ten posts is well under a dollar of generation once you are set up.",
  },
];

export default function ClaudeContentPage() {
  return (
    <ResourcePageShell
      slug="claude-content"
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="Claude Code content creation system"
      subhead="Produce weeks of social media content with custom visuals: infographics, carousels, personal images, all from a single prompt. Works for LinkedIn, Instagram, X, and more."
      steps={steps}
      repoCta={{ href: DRIVE_URL, label: "Get the project files", icon: DOWNLOAD_ICON }}
      troubleshooting={["claudeNotFound", "crAlias", "noEnvFile", "costs", "costsScraping", "creditBalance"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Content creation", path: "/claude-content" },
      ]}
      howTo={{
        name: "Generate a month of social content with Claude Code",
        description:
          "Set up a Claude Code content project that knows your voice and your face, connect it to a scraper and an image model, and produce ten finished posts from one command.",
        totalTime: "PT10M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="What one command actually produces">
            <Answer>
              One command turns your context folder into ten finished LinkedIn posts, each with its own generated image, in about seventeen minutes.
            </Answer>
            <Stats
              items={[
                { value: "10+", label: "Finished posts per command" },
                { value: "~17 min", label: "End to end, mostly image generation" },
                { value: "1", label: "Command to start it" },
              ]}
            />
            <Figure
              src="/guide/content-infographic.webp"
              alt="One of the generated infographics, laid out and ready to post"
              videoId={VIDEO_ID}
              at={200}
              caption="Not a text post with a stock photo. The infographic is generated with the post, in the brand's own colours and type."
            />
            <p>
              One line, <Code>create 10 posts</Code>, and about seventeen
              minutes later there is a dashboard with more than ten finished
              pieces of content in it. Not outlines. Finished: copy plus the
              visual, ready to publish.
            </p>
            <p>The mix I use, which is just a sentence in the prompt:</p>
            <ul>
              <li>
                <strong>Four posts with a personal photo</strong>, chosen from
                your own library to fit what the post says
              </li>
              <li>
                <strong>Four AI infographics</strong> in your brand colours and
                type
              </li>
              <li>
                <strong>Two carousels</strong>, for Instagram or LinkedIn
              </li>
            </ul>
            <p>
              That is roughly two to three weeks of posting, and every one of
              them is built on what is actually working in your niche this week
              rather than on what the model assumes.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="Why this is not ChatGPT with extra steps">
            <p>
              This is the honest question and it has a specific answer. A chat
              window can write you ten posts right now. It cannot:
            </p>
            <ul>
              <li>
                <strong>See what is trending in your niche this week.</strong>{" "}
                That needs a scraper, and platforms block direct scraping, which
                is why Apify exists.
              </li>
              <li>
                <strong>Put your face in the image.</strong> That needs a photo
                library it can look through and an image model it can call.
              </li>
              <li>
                <strong>Hand you a dashboard.</strong> That needs somewhere to
                write files and the ability to build the page.
              </li>
            </ul>
            <p>
              Claude Code does all three because it has a folder and can call
              other services. The difference is not writing quality. It is that
              one ends with text you then have to act on, and the other ends
              with the posts.
            </p>
          </GuideSection>

          <GuideSection title="The folder is your employee's brain">
            <Figure
              src="/guide/content-imagenotes.webp"
              alt="The image notes file, pairing every photo filename with a description of what is in it"
              videoId={VIDEO_ID}
              at={500}
              caption="Every photo you own, described. This is the file that decides whether the right picture ends up on the right post."
            />
            <p>
              The project has folders you will mostly never open, and it is
              worth knowing what they are, because they are the reason the
              output is specific rather than generic. Think of it as the brain
              of a content person you just hired:
            </p>
            <KeyFacts
              rows={[
                { label: "Context/", value: "Who you are, who you sell to, what your existing posts did" },
                { label: "Context/images/", value: "Your own photos, named descriptively so the right one gets picked" },
                { label: "Reference/", value: "One or two images showing the visual style you want" },
                { label: "Examples/", value: "Copy worth imitating, as a tone reference" },
                { label: "Skills/", value: "Instructions for specific jobs: writing hooks, building carousels, replicating what went viral" },
              ]}
              caption="You interact with none of this. You type in the chat. The folders are what makes the chat worth typing in."
            />
          </GuideSection>

          <GuideSection title="Setting it up">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="The photo trick that makes it look like you">
            <p>
              This is the detail people miss and it is worth its own section,
              because it is the difference between content that is obviously
              generated and content that looks like you made it.
            </p>
            <p>
              Put one clear photo of your face in the images folder, named{" "}
              <Code>me.jpeg</Code>. Then ask Claude to rename everything else
              using it as the reference.
            </p>
            <p>
              Two things happen. The model learns which person in a group photo
              is you, so it never picks an image where you are not the subject.
              And the filenames become descriptive, so when it writes a post
              about a move to a new city it can reach for the photo that fits
              instead of the first file in the folder.
            </p>
            <Callout title="The same idea, generally">
              <p>
                Anything you want the system to use well needs a name it can
                reason about. <Code>IMG_4471.jpg</Code> is invisible.{" "}
                <Code>orange-sofa-laptop.jpg</Code> is a decision it can make.
              </p>
            </Callout>
            <p>
              You can see this working in the output. Every post comes with an{" "}
              <strong>image notes</strong> block underneath it, naming the exact
              file it chose and why:
            </p>
            <Block>{`## Image Notes
Personal photo: \`oleg-selfie-at-desk-imac-night-city-lights-dubai-highrise.jpeg\`
Vibe: casual, unpolished, matches the "imperfection" message.
Real desk, real setting, not a photoshoot.`}</Block>
            <p>
              And for a generated one it names the reference, the content and the
              style instead:
            </p>
            <Block>{`## Image Notes
AI infographic using \`reference/infographic-ref-3.jpeg\` (vertical flowing path).
Content: "From Voice to Published Post", vertical flow showing
Speak -> AI Processes -> Draft in Your Voice -> Quick Review -> Published.
Side-by-side time comparison: Old Way (90+ min) vs New Way (16 min).
Style: cream background, lime green accents, brand banner.`}</Block>
            <p>
              This is the part worth stealing even if you never use the project.
              A post and its image are one decision, so the system that writes
              the post should be the one that picks the picture, and it should
              have to say why.
            </p>
          </GuideSection>

          <GuideSection title="The command, and how to change it">
            <p>
              The whole interface is one sentence, and every part of it is
              yours to change:
            </p>
            <Block>{`create 10 posts:
4 with my personal images,
4 as infographics in the reference style,
2 as carousels.

base them on what is actually trending in my niche this week,
and make each one useful to my audience rather than about me.`}</Block>
            <p>
              Want video instead of stills? Say so. Want twenty? Say so. Want
              them written for LinkedIn rather than Instagram? Say so. There is
              no settings screen to learn, which is the point.
            </p>
          </GuideSection>

          <GuideSection title="What it costs and how long it takes">
            <Figure
              src="/guide/content-output.webp"
              alt="The finished posts in the editor, each with its image attached"
              videoId={VIDEO_ID}
              at={580}
              caption="The end of one run: ten posts, each with its image, ready to schedule."
            />
            <KeyFacts
              rows={[
                { label: "Claude plan", value: `Pro, ${usd(PLANS.pro.monthly)} a month` },
                { label: "Apify", value: "$5 of free credit a month, which covers normal use" },
                { label: "Image generation", value: "Cents per image, so a batch of ten is well under a dollar" },
                { label: "First-time setup", value: "Five to ten minutes" },
                { label: "Learning your account", value: "About six minutes, once" },
                { label: "Each batch of ten posts", value: "About 17 minutes, mostly image generation" },
              ]}
            />
          </GuideSection>

          <GuideSection title="What it does badly">
            <ul>
              <li>
                <strong>It is not fast per post.</strong> Seventeen minutes for
                ten. Fine when you walk away, annoying if you sit and watch.
              </li>
              <li>
                <strong>Skip the context step and it is generic.</strong> The
                whole value is in it having read your posts and your audience
                first.
              </li>
              <li>
                <strong>One weak reference image poisons every visual.</strong>{" "}
                The infographics inherit whatever you put in that folder.
              </li>
              <li>
                <strong>Ten drafts, not ten posts.</strong> Two or three will be
                genuinely good, most will need an edit, and one will be wrong
                about something. Read them.
              </li>
              <li>
                <strong>It repeats itself across batches.</strong> Run it weekly
                and you will see the same angles. Tell it what you already
                published.
              </li>
            </ul>
            <p>
              The research half of this, working out what to make rather than
              making it, is on{" "}
              <a href="/claude-social-growth">The growth guide</a>. The
              short-video versions are on{" "}
              <a href="/claude-reels">Reels</a> and{" "}
              <a href="/claude-tiktok">TikTok</a>. New to Claude Code?{" "}
              <a href="/claude-code-tutorial">Start here</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Content Creation System with Claude Code",
        description:
          "Produce weeks of social media content with custom visuals (infographics, carousels, personal images) from a single prompt using Claude Code.",
        url: "https://www.oleg.ae/claude-content",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
      boldaneCta={
        <>
          Prefer the done-for-you version? <BoldaneLink /> turns one hour of
          talking a week into five LinkedIn posts, all from what you said. A
          real team does the crafting. You just approve.
        </>
      }
    />
  );
}
