"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  BadgeCheck,
  Calculator,
  ShieldCheck,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { Accordion } from "@/components/accordion";
import { CopyButton } from "@/components/copy-button";
import { ResourceFooter } from "@/components/resource-footer";
import { Troubleshooting } from "@/components/troubleshooting";
import { ArticleJsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";

const REPO_URL = "https://github.com/melnikoff-oleg/high-converting-website";

const INSTALL_CMD = "npm install -g @anthropic-ai/claude-code";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const principles = [
  {
    icon: Target,
    title: "The headline sells the benefit",
    body: "It leads with the result your buyer wants, not a list of what you do. The first screen carries the whole pitch.",
  },
  {
    icon: BadgeCheck,
    title: "Proof comes early, and often",
    body: "Real testimonials, numbers, and names sit above the ask. People believe proof, not promises.",
  },
  {
    icon: Calculator,
    title: "The value equation",
    body: "Every section is engineered to raise the dream outcome and belief, and lower the time and effort it takes to get there.",
  },
  {
    icon: ShieldCheck,
    title: "Doubt removed at the CTA",
    body: "A reassurance or risk reversal sits right next to the button, so the last hesitation disappears.",
  },
  {
    icon: Sparkles,
    title: "Premium means restraint",
    body: "No AI-slop look, no flashy tricks. A deliberate type pairing, one accent color, and room to breathe read as expensive.",
  },
  {
    icon: Smartphone,
    title: "Built for the phone",
    body: "Most visitors arrive on mobile, so the page is designed for that screen on purpose, not as an afterthought.",
  },
];

const linkClass =
  "text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white";

const code =
  "rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver";

const steps = [
  {
    title: "Step 1: install VS Code (your work window)",
    content: (
      <div className="space-y-3">
        <p>
          VS Code is a free app from Microsoft. It&apos;s the window where
          you&apos;ll run everything. Think of it like Word, but for projects.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Go to{" "}
            <a
              href="https://code.visualstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              code.visualstudio.com
            </a>{" "}
            and click <span className="text-silver">Download</span>
          </li>
          <li>Open the downloaded file and install it like any other app</li>
        </ol>
      </div>
    ),
  },
  {
    title: "Step 2: install Node.js (lets the website run)",
    content: (
      <div className="space-y-3">
        <p>
          Node.js is a small program that runs in the background. You install it
          once and forget about it.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Go to{" "}
            <a
              href="https://nodejs.org"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              nodejs.org
            </a>{" "}
            and click the big green{" "}
            <span className="text-silver">LTS</span> button
          </li>
          <li>
            Open the downloaded file and install it, clicking
            &quot;Next&quot; / &quot;Continue&quot; through everything
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "Step 3: install Claude Code (your AI builder)",
    content: (
      <div className="space-y-3">
        <p>
          Claude Code is the AI that actually builds your page. You&apos;ll
          install it once from inside VS Code.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            In VS Code, open the terminal:{" "}
            <span className="text-silver">Terminal, then New Terminal</span>
          </li>
          <li>Type this and press Enter:</li>
        </ol>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          <code>{INSTALL_CMD}</code>
        </pre>
        <CopyButton text={INSTALL_CMD} label="Copy the command" />
        <p>
          On Mac, if it mentions permissions, put{" "}
          <code className={code}>sudo</code> in front and run it again. Claude Code needs a Claude subscription (from about $20/mo, cancel anytime).
        </p>
      </div>
    ),
  },
  {
    title: "Step 4: create free GitHub and Vercel accounts",
    content: (
      <div className="space-y-3">
        <p>
          These two free accounts are what put your site on the internet later.
          Just sign up for now.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              github.com
            </a>{" "}
            (stores your code online)
          </li>
          <li>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              vercel.com
            </a>{" "}
            (puts your site live). Sign up{" "}
            <span className="text-silver">With your GitHub account</span> to make
            the next steps easier
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "Step 5: download the kit",
    content: (
      <div className="space-y-3">
        <p>The kit is free and lives on GitHub.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Go to{" "}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              github.com/melnikoff-oleg/high-converting-website
            </a>
          </li>
          <li>
            Click the green <span className="text-silver">&lt;&gt; Code</span>{" "}
            button, then <span className="text-silver">Download ZIP</span>
          </li>
          <li>
            Find the ZIP (usually in Downloads) and double-click it to unzip. You
            should get a folder called{" "}
            <span className="text-silver">High-converting-website-main</span>.
            Move it somewhere easy to find, like your Desktop
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "Step 6: open the kit and launch Claude",
    content: (
      <div className="space-y-3">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            In VS Code, click <span className="text-silver">File</span>, then{" "}
            <span className="text-silver">Open Folder...</span>, and choose the{" "}
            <span className="text-silver">High-converting-website-main</span>{" "}
            folder
          </li>
          <li>
            Open the terminal again (
            <span className="text-silver">Terminal, then New Terminal</span>),
            type this, and press Enter:
          </li>
        </ol>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          <code>claude</code>
        </pre>
        <p>
          The first time, it&apos;ll ask you to sign in. Follow the link it
          shows. Once you see the Claude prompt, you&apos;re in.
        </p>
      </div>
    ),
  },
  {
    title: "Step 7: run /start and let it build",
    content: (
      <div className="space-y-3">
        <p>This is the part that does all the work. Type:</p>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg surface-raised border border-hairline p-4 font-mono text-sm text-silver">
          <code>/start</code>
        </pre>
        <p>Claude takes over from here and walks you through everything:</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            It learns your business (paste a file, give it a link to your current
            site or LinkedIn, or just answer its questions)
          </li>
          <li>
            It builds your page section by section, following the conversion
            playbook bundled in the kit, not just making it pretty
          </li>
          <li>
            It shows you a live preview at{" "}
            <span className="text-silver">localhost:3000</span>
          </li>
        </ol>
        <p>
          The most important part is the first one: a great-looking page that
          says the wrong thing won&apos;t sell, so take your time telling Claude
          about your business.
        </p>
      </div>
    ),
  },
  {
    title: "Step 8: preview and polish in plain English",
    content: (
      <div className="space-y-3">
        <p>
          Open your browser at{" "}
          <span className="text-silver">localhost:3000</span> to see your page.
          Only you can see it for now. Tell Claude what to change in your own
          words:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-5 text-[15px] leading-relaxed text-silver italic">
          &quot;the headline doesn&apos;t sound like me. Make it feel more
          premium. This testimonial is wrong, use this one instead.&quot;
        </div>
        <p>Claude edits it live. Repeat until you love it.</p>
      </div>
    ),
  },
  {
    title: "Step 9: go live on your domain",
    content: (
      <div className="space-y-3">
        <p>
          When you&apos;re happy, tell Claude you&apos;re ready to deploy. It runs
          the <code className={code}>/deploy</code> steps and walks you through
          each click:
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Saving your code to GitHub</li>
          <li>
            Putting it live on Vercel (you get a free address in about a minute)
          </li>
          <li>
            Connecting your own domain, like{" "}
            <span className="text-silver">yourbusiness.com</span>. The secure
            padlock (HTTPS) is set up automatically
          </li>
        </ol>
        <p>
          Want to change the site later? Open the folder, run{" "}
          <code className={code}>claude</code>, ask for the change, and Vercel
          updates your live site in under a minute.
        </p>
      </div>
    ),
  },
];

export default function HighConvertingWebsitePage() {
  return (
    <>
      <ArticleJsonLd
        title="Build a High-Converting Landing Page with Claude Code"
        description="A free, open-source kit that builds a landing page engineered to convert. Claude Code reads a distilled conversion playbook from Alex Hormozi and the world's best marketers, then builds and deploys your page on your own domain."
        url="https://oleg.ae/high-converting-website"
        datePublished="2026-06-28"
        dateModified="2026-06-28"
      />

      {/* Minimal header */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="brand-wordmark font-display text-lg tracking-tight"
          >
            Oleg Melnikov
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
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
              free and open source, no coding required
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-metallic mt-8 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
            >
              Build a high-converting landing page with Claude Code
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 font-body text-lg text-silver-muted md:text-xl"
            >
              Most &quot;build a site with AI&quot; guides give you a page that
              looks fine but doesn&apos;t sell. This free kit is different: Claude Code builds your page on real conversion knowledge, then deploys it
              live on your own domain.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                  Download the kit on GitHub
                </a>
              </Button>
              <p className="font-body text-sm text-silver-muted">
                Free, takes about an hour
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Proof line */}
        <section className="pb-16 md:pb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mx-auto max-w-3xl px-6"
          >
            <div className="surface-card glow-blue px-6 py-7 text-center sm:px-10">
              <p className="font-body text-base leading-relaxed text-silver sm:text-lg">
                I built my own agency site,{" "}
                <a
                  href="https://boldane.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  boldane.com
                </a>
                , with this exact kit. It already closed a real B2B deal for me.
                This is the same process, in your hands.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Under the hood */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="pb-20 md:pb-24"
        >
          <div className="mx-auto max-w-3xl px-6">
            <motion.h2
              variants={fadeUp}
              className="eyebrow font-body text-[13px] text-vivid-blue"
            >
              What makes it convert
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-3 font-body text-lg text-silver md:text-xl"
            >
              Under the hood, the kit carries a distilled playbook from Alex
              Hormozi and the world&apos;s best marketers. Claude reads it before
              it builds, so your page follows what actually sells.
            </motion.p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {principles.map((p) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  className="surface-card flex flex-col gap-3 px-5 py-5"
                >
                  <p.icon className="size-5 text-vivid-blue" />
                  <div>
                    <p className="font-body text-base font-medium text-silver">
                      {p.title}
                    </p>
                    <p className="mt-1.5 font-body text-base leading-relaxed text-silver-muted">
                      {p.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              variants={fadeUp}
              className="mt-6 font-body text-sm text-silver-muted"
            >
              The full playbook and its source material live in the{" "}
              <a
                href={`${REPO_URL}/tree/main/knowledge-base`}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                knowledge base
              </a>{" "}
              inside the kit, so you can see exactly what shapes your page.
            </motion.p>
          </div>
        </motion.section>

        {/* Setup guide */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="pb-20 md:pb-24"
        >
          <div className="mx-auto max-w-3xl px-6">
            <motion.h2
              variants={fadeUp}
              className="eyebrow font-body text-[13px] text-vivid-blue"
            >
              Setup guide
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-3 font-body text-sm text-silver-muted"
            >
              Steps 1 to 6 are one-time setup. Steps 7 to 9 are how Claude builds
              and ships your page.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <Accordion items={steps} defaultOpen={0} />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 text-center">
              <Button asChild size="lg">
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                  Get the kit on GitHub
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* The recurring failures, answered where people are standing when
            they hit them: right after the steps. */}
        <Troubleshooting items={["claudeNotFound", "costs", "skipPermissions"]} />

        {/*
          YouTube video walkthrough. Add the video ID when the video is live:
          1. set a VIDEO_ID const, 2. pass videoId / videoTitle to ArticleJsonLd,
          3. drop in the iframe section used on the other resource pages.
        */}
      </main>

      <ResourceFooter currentSlug="high-converting-website" />
    </>
  );
}
