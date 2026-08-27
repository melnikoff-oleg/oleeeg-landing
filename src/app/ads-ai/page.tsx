"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Accordion } from "@/components/accordion";
import { CopyButton } from "@/components/copy-button";
import { ResourceFooter } from "@/components/resource-footer";
import { Troubleshooting } from "@/components/troubleshooting";
import { RepoCta } from "@/components/repo-cta";
import { ArticleJsonLd } from "@/components/json-ld";


const START_PROMPT = "install the app dependencies and start the dev server";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const steps = [
  {
    title: "step 1: install VS Code (your code editor)",
    content: (
      <div className="space-y-3">
        <p>
          VS Code is a free app from Microsoft. it&apos;s where you&apos;ll open
          and run the tool. think of it like Word, but for code.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            go to{" "}
            <a
              href="https://code.visualstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              code.visualstudio.com
            </a>
          </li>
          <li>
            click the big <span className="text-silver">Download</span> button
          </li>
          <li>open the downloaded file and install it like any other app</li>
          <li>
            on Mac: drag it into your Applications folder. on Windows: just
            click &quot;Next&quot; through the installer
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "step 2: install Node.js (makes the tool run)",
    content: (
      <div className="space-y-3">
        <p>
          Node.js is a small program that runs in the background. you install it
          once and forget about it. the tool needs it to work.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            go to{" "}
            <a
              href="https://nodejs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              nodejs.org
            </a>
          </li>
          <li>
            click the big green button that says{" "}
            <span className="text-silver">Download Node.js (LTS)</span>
          </li>
          <li>
            open the downloaded file and install it, clicking &quot;Next&quot; /
            &quot;Continue&quot; through everything, don&apos;t change any
            settings
          </li>
        </ol>
        <p>that&apos;s it. you won&apos;t need to open Node.js ever again.</p>
      </div>
    ),
  },
  {
    title: "step 3: install Claude Code inside VS Code",
    content: (
      <div className="space-y-3">
        <p>
          Claude Code is the AI assistant that helps you use this tool. it lives
          inside VS Code.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>open VS Code</li>
          <li>
            on the left sidebar, click the{" "}
            <span className="text-silver">Extensions</span> icon (it looks like
            four small squares)
          </li>
          <li>
            in the search bar at the top, type{" "}
            <span className="text-silver">Claude Code</span>
          </li>
          <li>
            find the one by <span className="text-silver">Anthropic</span> and
            click the blue <span className="text-silver">Install</span> button
          </li>
          <li>
            once installed, it will ask you to sign in. follow the prompts to
            create an account. it costs{" "}
            <span className="text-silver">$20/mo</span> on the pro plan (you
            can cancel anytime)
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "step 4: download the tool",
    content: (
      <div className="space-y-3">
        <p>the tool is free and lives on GitHub (a site where people share code).</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            go to{" "}
            <a
              href="https://github.com/melnikoff-oleg/ads-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              github.com/melnikoff-oleg/ads-ai
            </a>
          </li>
          <li>
            click the green{" "}
            <span className="text-silver">&lt;&gt; Code</span> button
          </li>
          <li>
            click <span className="text-silver">Download ZIP</span>
          </li>
          <li>
            find the downloaded ZIP file (usually in your Downloads folder) and
            double-click it to unzip
          </li>
          <li>
            you should now have a folder called{" "}
            <span className="text-silver">ads-ai-main</span>. move it
            somewhere easy to find, like your Desktop
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "step 5: open the project in VS Code",
    content: (
      <div className="space-y-3">
        <ol className="list-decimal space-y-2 pl-5">
          <li>open VS Code</li>
          <li>
            click <span className="text-silver">File</span> in the top menu,
            then <span className="text-silver">Open Folder...</span>
          </li>
          <li>
            find the <span className="text-silver">ads-ai-main</span> folder you
            just downloaded and select it
          </li>
          <li>
            if VS Code asks &quot;Do you trust the authors?&quot;, click{" "}
            <span className="text-silver">Yes, I trust the authors</span>
          </li>
        </ol>
        <p>
          you should now see all the project files in the left sidebar.
        </p>
      </div>
    ),
  },
  {
    title: "step 6: get your API keys",
    content: (
      <div className="space-y-4">
        <p>
          API keys are like passwords that let the tool use different AI
          services. you need to sign up for each service (most have free trials)
          and copy the key they give you.
        </p>
        <p>
          you need <span className="text-silver">5 keys</span>. here&apos;s
          where to get each one:
        </p>
        <div className="space-y-4">
          <div className="rounded-lg surface-raised border border-hairline p-4">
            <p className="font-medium text-silver">
              1. Anthropic (Claude AI){" "}
              <span className="font-normal text-silver-muted">
                (writes your ad copy)
              </span>
            </p>
            <p className="mt-1">
              go to{" "}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                console.anthropic.com
              </a>
              , create an account, go to{" "}
              <span className="text-silver">API Keys</span>, click{" "}
              <span className="text-silver">Create Key</span>, and copy it
            </p>
          </div>

          <div className="rounded-lg surface-raised border border-hairline p-4">
            <p className="font-medium text-silver">
              2. Google Gemini{" "}
              <span className="font-normal text-silver-muted">
                (analyzes your brand images)
              </span>
            </p>
            <p className="mt-1">
              go to{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                aistudio.google.com/apikey
              </a>
              , sign in with your Google account, click{" "}
              <span className="text-silver">Create API Key</span>, and copy it
            </p>
          </div>

          <div className="rounded-lg surface-raised border border-hairline p-4">
            <p className="font-medium text-silver">
              3. FireCrawl{" "}
              <span className="font-normal text-silver-muted">
                (reads your website)
              </span>
            </p>
            <p className="mt-1">
              go to{" "}
              <a
                href="https://firecrawl.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                firecrawl.dev
              </a>
              , create an account, and copy your API key from the dashboard
            </p>
          </div>

          <div className="rounded-lg surface-raised border border-hairline p-4">
            <p className="font-medium text-silver">
              4. Apify{" "}
              <span className="font-normal text-silver-muted">
                (finds competitor ads on Meta)
              </span>
            </p>
            <p className="mt-1">
              go to{" "}
              <a
                href="https://console.apify.com/account/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                console.apify.com
              </a>
              , create an account, go to{" "}
              <span className="text-silver">Settings, then Integrations</span>, and
              copy your API token
            </p>
          </div>

          <div className="rounded-lg surface-raised border border-hairline p-4">
            <p className="font-medium text-silver">
              5. Kie.ai{" "}
              <span className="font-normal text-silver-muted">
                (generates ad images)
              </span>
            </p>
            <p className="mt-1">
              go to{" "}
              <a
                href="https://kie.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                kie.ai
              </a>
              , create an account, and copy your API key
            </p>
          </div>
        </div>
        <p>
          save all 5 keys somewhere safe (like a notes app). you&apos;ll paste
          them in the next step.
        </p>
      </div>
    ),
  },
  {
    title: "step 7: paste your API keys into the project",
    content: (
      <div className="space-y-3">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            in VS Code, look at the left sidebar and find a file called{" "}
            <span className="text-silver">.env.example</span>
          </li>
          <li>
            right-click on it and choose{" "}
            <span className="text-silver">Rename</span>
          </li>
          <li>
            change the name from {""}
            <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
              .env.example
            </code>{" "}
            to just{" "}
            <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
              .env
            </code>{" "}
            (remove the word &quot;example&quot;) and press Enter
          </li>
          <li>click on the file to open it. you&apos;ll see something like this:</li>
        </ol>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          <code>{`ANTHROPIC_API_KEY=
GEMINI_API_KEY=
FIRECRAWL_API_KEY=
APIFY_API_TOKEN=
KIE_AI_API_KEY=`}</code>
        </pre>
        <ol className="list-decimal space-y-2 pl-5" start={5}>
          <li>
            paste each key right after the{" "}
            <span className="text-silver">=</span> sign, with no spaces. for
            example:
          </li>
        </ol>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          <code>{`ANTHROPIC_API_KEY=sk-ant-abc123...
GEMINI_API_KEY=AIzaSy...
FIRECRAWL_API_KEY=fc-...
APIFY_API_TOKEN=apify_api...
KIE_AI_API_KEY=kie-...`}</code>
        </pre>
        <ol className="list-decimal space-y-2 pl-5" start={6}>
          <li>
            press{" "}
            <span className="text-silver">Cmd+S</span> (Mac) or{" "}
            <span className="text-silver">Ctrl+S</span> (Windows) to save the
            file
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "step 8: start the tool",
    content: (
      <div className="space-y-3">
        <p>
          now you&apos;ll use Claude Code to start the tool. this is the easiest
          part.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            in VS Code, click the{" "}
            <span className="text-silver">Claude Code</span> icon in the left
            sidebar (it looks like a sparkle ✦)
          </li>
          <li>
            a chat panel will open. type this message and press Enter:
          </li>
        </ol>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          <code>{START_PROMPT}</code>
        </pre>
        <CopyButton text={START_PROMPT} label="copy the message" />
        <ol className="list-decimal space-y-2 pl-5" start={3}>
          <li>
            Claude Code will run the commands for you. when it&apos;s done,
            it&apos;ll say the server is running.
          </li>
          <li>
            open your web browser (Chrome, Safari, etc.) and go to{" "}
            <span className="text-silver">localhost:3000</span>. you should see
            the tool
          </li>
        </ol>
        <p>
          if anything goes wrong, just ask Claude Code in the chat. it can
          read the error and fix it for you.
        </p>
      </div>
    ),
  },
  {
    title: "step 9: add your brand",
    content: (
      <div className="space-y-3">
        <p>
          now the tool is running in your browser. the first thing to do is tell
          it about your brand.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            you should see the{" "}
            <span className="text-silver">Brand</span> page. if not, click{" "}
            <span className="text-silver">Brand</span> in the left sidebar
          </li>
          <li>
            enter your <span className="text-silver">website URL</span> (like
            https://yourbrand.com)
          </li>
          <li>
            optionally add your{" "}
            <span className="text-silver">Instagram handle</span> (like
            @yourbrand)
          </li>
          <li>
            click{" "}
            <span className="text-silver">&quot;Scrape Brand&quot;</span> and
            wait about 30 seconds
          </li>
        </ol>
        <p>
          the tool will crawl your website, pull out your products, download
          your images, and build a complete brand profile. you&apos;ll see
          everything it found on the page.
        </p>
      </div>
    ),
  },
  {
    title: "step 10: find your competitors' ads",
    content: (
      <div className="space-y-3">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            click <span className="text-silver">Competitors</span> in the left
            sidebar
          </li>
          <li>
            you&apos;ll see suggested keywords based on your brand. you can
            edit them or add your own
          </li>
          <li>
            click <span className="text-silver">Search</span>, and the tool will
            search the Meta Ad Library and find companies running ads in your
            space
          </li>
          <li>
            it ranks them by how long their ads have been running (longer =
            they&apos;re making money from those ads)
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "step 11: analyze what's working",
    content: (
      <div className="space-y-3">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            click <span className="text-silver">What&apos;s Working</span> in
            the left sidebar
          </li>
          <li>
            click the <span className="text-silver">Analyze</span> button, and the
            AI will study the top 25 competitor ads
          </li>
          <li>
            wait about a minute. when it&apos;s done, you&apos;ll see:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                the exact opening lines (hooks) that grab attention, and why
                they work
              </li>
              <li>
                patterns across all the ads: what copy style, emotional angle,
                and visual approach keeps showing up
              </li>
            </ul>
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "step 12: generate your ads",
    content: (
      <div className="space-y-3">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            click <span className="text-silver">Create</span> in the left
            sidebar
          </li>
          <li>
            choose how many ad concepts you want (start with{" "}
            <span className="text-silver">3</span> to test it out)
          </li>
          <li>
            pick which of your products to feature
          </li>
          <li>
            click <span className="text-silver">Generate</span> and wait a
            couple of minutes
          </li>
          <li>
            each concept comes with:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>AI-written ad copy (headline, text, and call-to-action)</li>
              <li>
                an AI-generated image matching the competitor&apos;s visual
                style
              </li>
              <li>
                a side-by-side comparison so you can see the original ad next to
                yours
              </li>
            </ul>
          </li>
        </ol>
        <p>
          the tool automatically checks the quality of each concept. only the
          good ones are shown.
        </p>
      </div>
    ),
  },
];

export default function AdsAiPage() {
  return (
    <>
      <ArticleJsonLd
        title="AI Ads Creator: Free Open Source Tool"
        description="Study the Meta ads your competitors are actually running, understand why they convert, and generate new ad concepts for your brand: copy, visuals, and video scripts."
        url="https://oleg.ae/ads-ai"
        datePublished="2026-05-31"
        dateModified="2026-08-27"
      />

      {/* Minimal header */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="brand-wordmark font-display text-lg tracking-tight"
          >
            oleg melnikov
          </Link>
          <a
            href="https://github.com/melnikoff-oleg/ads-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-hairline min-h-[44px] px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            github
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-16 pb-8 md:pt-24 md:pb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="mx-auto max-w-3xl px-6 text-center"
          >
            <motion.span
              variants={fadeUp}
              className="eyebrow inline-block rounded-full border border-hairline bg-vivid-blue/10 px-4 py-1.5 font-body text-xs text-vivid-blue/90"
            >
              free tool, no coding required
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-metallic mt-8 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
            >
              AI ads creator
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 font-body text-lg text-silver-muted md:text-xl"
            >
              study the ads your competitors are actually running, understand
              why they convert, and generate new ads for your brand: copy,
              images, and video scripts. all done by AI.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-3 font-body text-base text-silver-muted"
            >
              follow the steps below to set everything up. takes about 15
              minutes.
            </motion.p>

            <motion.div variants={fadeUp}>
              <RepoCta
                href="https://github.com/melnikoff-oleg/ads-ai"
                className="mt-8"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Setup guide */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="pb-16 md:pb-20"
        >
          <div className="mx-auto max-w-3xl px-6">
            <motion.h2
              variants={fadeUp}
              className="eyebrow font-body text-[13px] text-vivid-blue"
            >
              setup guide
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-3 font-body text-sm text-silver-muted"
            >
              steps 1-8 are one-time setup. steps 9-12 are how you use the tool
              every time.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <Accordion items={steps} defaultOpen={0} />
            </motion.div>
          </div>
        </motion.section>

        {/* The recurring failures, answered where people are standing when
            they hit them: right after the steps. */}
        <Troubleshooting
          items={[
            "claudeNotFound",
            "noEnvFile",
            "geminiQuota",
            "creditBalance",
            "costs",
            "costsScraping",
          ]}
        />

        {/* YouTube video */}
      </main>

      <ResourceFooter currentSlug="ads-ai" boldaneCredit />
    </>
  );
}
