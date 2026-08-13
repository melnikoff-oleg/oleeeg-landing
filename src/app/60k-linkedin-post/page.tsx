"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { ResourceFooter } from "@/components/resource-footer";
import { FreeCallCta } from "@/components/free-call-cta";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          copied
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-4"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          copy prompt
        </>
      )}
    </button>
  );
}

/* Collapsed by default with a bottom fade + expand toggle: a max-h
   overflow-auto pre is a scroll trap on a phone and hides most of the
   prompt with no affordance. */
function PromptBox({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-5">
      <div className="relative">
        <pre
          className={`rounded-lg surface-raised border border-hairline p-4 text-sm leading-relaxed text-silver ${
            expanded ? "" : "max-h-80 overflow-hidden"
          }`}
        >
          <code className="whitespace-pre-wrap break-words">{text}</code>
        </pre>
        {!expanded && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-px bottom-px h-24 rounded-b-lg bg-gradient-to-t from-navy-raised to-transparent"
          />
        )}
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 px-1 font-body text-sm font-medium text-silver-muted transition-colors hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
        {expanded ? "show less" : "show full prompt"}
      </button>
    </div>
  );
}

const PROMPT_1 = `You are helping me build a content foundation for LinkedIn. Interview me with the questions below, ONE at a time. Keep it fast and casual. If my answer is vague, ask one short follow-up for specifics, then move on.

1. Who are you and what do you do? (role, company, what you actually sell)
2. Who is your ideal client? Be specific: role, industry, situation.
3. What is their biggest pain or frustration right now?
4. What result do you deliver? Give a real example with numbers if you can.
5. Why you and not a competitor? What do you do differently?
6. What should you be known for? When people hear your name, what should they think?
7. What is one strong or unpopular opinion you hold about your industry?
8. What are 3-4 topics you could talk about for hours? (these become your content categories)

When we finish, output everything as a clean document titled "MY CONTENT FOUNDATION" with my answers organized under each question. I will reuse this document, so make it complete and use my own wording, not corporate language.`;

const PROMPT_2 = `You are a sharp, direct interviewer extracting LinkedIn content from me. My content foundation is below. Stick to my 3-4 content categories and always filter through one question: would my target audience care about this?

Rules:
- Ask ONE short question at a time. No recaps, no praise, no summaries. Ask, listen, push, move on.
- Pick a category and dive straight in with a specific question.
- When I give a generic answer, push harder: "Numbers. What exactly happened?" / "Give me a real example, not theory." / "Everyone says that. What do YOU think?"
- Hunt for: real stories with messy details, exact numbers, step-by-step processes, and strong opinions. Ask things like "What common advice in your field is wrong?" and "What mistake does your audience make that nobody talks about?"
- After 3-4 good answers on one topic, switch to a different category.
- Never end the conversation. I end it when I say "done". Until then, keep asking.

Start now: greet me in one line, then ask if I have a topic in mind or if you should pick one.

MY CONTENT FOUNDATION:
[paste it here]`;

const PROMPT_3 = `Write 3-5 LinkedIn posts from my interview below. The #1 rule: use MY actual words and phrases from the interview. You are a documentary editor, not a writer. Select my best quotes, cut filler, arrange them into posts. Do not rewrite my language, do not upgrade my vocabulary, do not add lessons or conclusions I never said.

For each post:
- Hook: open with the most surprising or specific thing I said, in my own phrasing. First 2 lines decide everything.
- Keep my hedging and casual wording ("kind of", "about 30%", "stuff"). Imperfection signals human.
- Keep exact numbers, names, and details.
- Format for mobile: short paragraphs of 1-3 sentences, varied rhythm. Not every sentence on its own line.
- Under 1,500 characters each.

Banned (these scream AI): em dashes, "Not X. It's Y." contrasts, fragment questions like "The result? ..." or "And honestly? ...", and words like unlock, delve, game changer, elevate, journey, dive in, "here's the thing".

Final test for each post: would I read it and say "yeah, that's basically what I said"? If not, rewrite it closer to my words.

MY CONTENT FOUNDATION:
[paste it here]

THE INTERVIEW:
[paste the full conversation here]`;

const prompts = [
  {
    number: "1",
    title: "build your content foundation",
    time: "~5 min",
    description:
      "paste this into a new Claude or ChatGPT chat. answer the questions one by one. save the output, you’ll reuse it.",
    prompt: PROMPT_1,
  },
  {
    number: "2",
    title: "the content interview",
    time: "~15-20 min",
    description:
      "open a NEW chat. paste this prompt, then paste your Content Foundation below it. talk for 15-20 minutes. the more specific stories and numbers you give, the better. when done, copy the ENTIRE conversation.",
    prompt: PROMPT_2,
  },
  {
    number: "3",
    title: "write the posts",
    time: "~5 min",
    description:
      "open a NEW chat. paste this prompt, then your Content Foundation and the full interview conversation. pick your favorites, do a light edit, and post.",
    prompt: PROMPT_3,
  },
];

export default function LinkedInPostPage() {
  return (
    <>
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
            href="https://youtube.com/@Oleg-Melnikov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
              <path fill="black" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            youtube
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
              3 prompts &middot; ~30 min &middot; works with Claude or ChatGPT
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-metallic mt-8 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
            >
              the $60K LinkedIn post
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 font-body text-lg text-silver-muted md:text-xl"
            >
              the exact system that generated $60,000 in sales from a single
              LinkedIn post. 3 prompts, 3 separate chats, your real voice, not
              AI slop.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-3 font-body text-base text-silver-muted"
            >
              this is a simplified, do-it-yourself version of the Boldane
              system. copy the prompts below and start writing posts built
              from what you actually say.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <Button asChild size="lg">
                <a href="#prompts">
                  jump to the prompts
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v14m0 0l-6-6m6 6l6-6"
                    />
                  </svg>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Free-call window. Remove after 2026-08-23, see src/lib/free-call.ts. */}
        <FreeCallCta />

        {/* How it works */}
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
              how it works
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="mt-6 grid gap-4 sm:grid-cols-3"
            >
              {[
                {
                  step: "1",
                  label: "context",
                  desc: "answer a short questionnaire about yourself and your audience. save the output.",
                },
                {
                  step: "2",
                  label: "interview",
                  desc: "paste your context doc. AI interviews you and pulls out your real stories and opinions.",
                },
                {
                  step: "3",
                  label: "writing",
                  desc: "paste context + interview. get 3-5 LinkedIn posts built from what you said.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="surface-raised rounded-xl border border-hairline p-5"
                >
                  <span className="font-body text-xs font-medium text-silver-muted">
                    chat {s.step}
                  </span>
                  <p className="mt-1 text-base font-medium text-silver">
                    {s.label}
                  </p>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-silver-muted">
                    {s.desc}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-5 font-body text-base text-silver-muted"
            >
              the magic is in step 2: the posts are built from what{" "}
              <span className="text-silver">you</span> actually said, not from
              what AI invents. that is what makes them sound human.
            </motion.p>
          </div>
        </motion.section>

        {/* Prompts */}
        <motion.section
          id="prompts"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="pb-24 md:pb-32"
        >
          <div className="mx-auto max-w-3xl space-y-10 px-6">
            {prompts.map((p) => (
              <motion.div
                key={p.number}
                variants={fadeUp}
                className="surface-card rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="font-body text-xs font-medium text-silver-muted">
                      prompt {p.number} &middot; {p.time}
                    </span>
                    <h3 className="mt-1 text-lg font-medium text-silver">
                      {p.title}
                    </h3>
                  </div>
                  <CopyButton text={p.prompt} />
                </div>

                <p className="mt-3 font-body text-base leading-relaxed text-silver-muted">
                  {p.description}
                </p>

                <PromptBox text={p.prompt} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pro tips */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="pb-16 md:pb-24"
        >
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="eyebrow font-body text-[13px] text-vivid-blue">
              tips for better results
            </h2>
            <ul className="mt-5 space-y-3 font-body text-base leading-relaxed text-silver-muted">
              <li className="flex gap-3">
                <span className="mt-0.5 text-silver-muted">01</span>
                <span>
                  in the interview (prompt 2), give{" "}
                  <span className="text-silver">specific numbers</span> and{" "}
                  <span className="text-silver">real names</span>. &quot;we
                  grew 40% in 3 months&quot; beats &quot;we grew a lot.&quot;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-silver-muted">02</span>
                <span>
                  talk for at least{" "}
                  <span className="text-silver">15 minutes</span> in prompt 2.
                  short interviews = generic posts.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-silver-muted">03</span>
                <span>
                  repeat weekly: same foundation (prompt 1 is one-time), new
                  interview, fresh posts every week.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-silver-muted">04</span>
                <span>
                  always do a light edit before posting. fix anything that
                  doesn&apos;t sound like you.
                </span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Proof / client result */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="pb-16 md:pb-24"
        >
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="eyebrow font-body text-[13px] text-vivid-blue">
              the post that started it
            </h2>
            <div className="surface-card mt-6 rounded-2xl p-6 sm:p-8">
              <p className="font-body text-base leading-relaxed text-silver-muted">
                this system was built for{" "}
                <a
                  href="https://www.linkedin.com/in/chintanaroad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                >
                  Jon Chintanaroad
                </a>
                , founder of{" "}
                <a
                  href="https://www.recruitinglaunch.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                >
                  Recruiting Launch
                </a>
                . one post written with this method generated{" "}
                <span className="text-silver">$60,000 in sales</span>.
              </p>

              <a
                href="https://www.linkedin.com/posts/chintanaroad_i-feel-like-theres-no-safe-haven-for-recruiters-activity-7462169996266328064-3gqd"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 py-2.5 font-body text-sm font-medium text-silver transition-colors hover:border-vivid-blue/50 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                see the original post
              </a>
            </div>
          </div>
        </motion.section>

        {/* Boldane soft CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="pb-16 md:pb-24"
        >
          <div className="mx-auto max-w-3xl px-6">
            <div className="surface-card rounded-2xl p-6 text-center sm:p-8">
              <p className="font-body text-base leading-relaxed text-silver-muted">
                this is the simple, do-it-yourself version of what{" "}
                <a
                  href="https://www.boldane.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                >
                  Boldane
                </a>{" "}
                does for founders who would rather just talk for an hour a week
                and let real expertise become a presence their market trusts.
                even this version beats 99% of AI content, because it starts
                from a real conversation with you.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <ResourceFooter currentSlug="60k-linkedin-post" />
    </>
  );
}
