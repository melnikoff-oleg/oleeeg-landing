"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import { ResourceFooter } from "@/components/resource-footer";
import { YouTubeEmbed } from "@/components/youtube-embed";

const VIDEO_ID = "mFYKAsGcnso";
const VIDEO_TITLE = "Anthropic Just Revealed How the Top 1% Use AI";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

type Level = {
  level: string;
  role: string;
  agents: string;
  looks: ReactNode;
  stuck: ReactNode;
  icon: ReactNode;
};

// Small line icons, one per rung of the ladder.
const icons: Record<string, ReactNode> = {
  chatter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="3" />
      <path d="M8 17l-3 4v-4" />
      <circle cx="8" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  micromanager: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  ),
  orchestrator: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2.4" />
      <path d="M10.8 7.2L5.5 15" />
      <path d="M12 7.6V15" />
      <path d="M13.2 7.2l5.3 7.8" />
      <circle cx="5" cy="17.5" r="1.9" />
      <circle cx="12" cy="17.5" r="1.9" />
      <circle cx="19" cy="17.5" r="1.9" />
    </svg>
  ),
  manager: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2.2" />
      <path d="M12 6.2V9M12 9H6.5v2.3M12 9h5.5v2.3" />
      <circle cx="6.5" cy="13" r="1.8" />
      <circle cx="17.5" cy="13" r="1.8" />
      <path d="M6.5 14.8v1.7M6.5 16.5H4v1.7M6.5 16.5H9v1.7" />
      <path d="M17.5 14.8v1.7M17.5 16.5H15v1.7M17.5 16.5H20v1.7" />
      <circle cx="4" cy="19.8" r="1.4" />
      <circle cx="9" cy="19.8" r="1.4" />
      <circle cx="15" cy="19.8" r="1.4" />
      <circle cx="20" cy="19.8" r="1.4" />
    </svg>
  ),
  ceo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 21V3" />
      <path d="M6 4h11l-2.6 3.5L17 11H6" />
    </svg>
  ),
};

const levels: Level[] = [
  {
    level: "Level 0",
    role: "The Chatter",
    agents: "0",
    looks:
      "You ask, AI answers, you copy-paste into your real work. The AI never touches your files or projects.",
    stuck: (
      <>
        You think chatting <strong>is</strong> using AI. By this map, it barely
        counts.
      </>
    ),
    icon: icons.chatter,
  },
  {
    level: "Level 1",
    role: "The Micromanager",
    agents: "1",
    looks:
      "One agent works inside your projects, but you watch every move and approve everything it does.",
    stuck: (
      <>
        <strong>Trust.</strong> You read everything, so you can never look away.
      </>
    ),
    icon: icons.micromanager,
  },
  {
    level: "Level 2",
    role: "The Orchestrator",
    agents: "~10",
    looks:
      "5 to 10 agents on separate tasks at once, each checking its own work. You review results, not keystrokes.",
    stuck: "You're the reviewer of six streams of output, and steering eats your day.",
    icon: icons.orchestrator,
  },
  {
    level: "Level 3",
    role: "The Manager",
    agents: "~100",
    looks:
      'Agents launch agents; work runs while you sleep. "Did you check it?" becomes "what context was it missing?"',
    stuck: (
      <>
        Not the AI. <strong>Your clarity.</strong> A vague vision wastes an army.
      </>
    ),
    icon: icons.manager,
  },
  {
    level: "Level 4",
    role: "The CEO",
    agents: "1,000+",
    looks:
      "Events launch agents, not you. A client interview ends, and an agent turns it into content. An order comes in, and an agent handles it. You set the direction and review exceptions.",
    stuck:
      "Finding enough work worth automating, and the right guardrails for each kind.",
    icon: icons.ceo,
  },
];

// The move between two rungs, shown as a dark band under each level.
const moves: { to: string; text: ReactNode; cmds: string[] }[] = [
  {
    to: "level 1",
    text: "Install an agent (Claude Code), give it one real folder of your work, and let it work where the work lives.",
    cmds: ["npm install -g @anthropic-ai/claude-code", "claude"],
  },
  {
    to: "level 2",
    text: "Let the agent check its own work, turn on auto-accept, and start a second task while the first one runs.",
    cmds: ["claude --dangerously-skip-permissions", "/code-review"],
  },
  {
    to: "level 3",
    text: "Write the vision down. Turn repeating work into loops and routines. Let agents kick off other agents.",
    cmds: ["/goal", "/loop", "ultracode", "/schedule"],
  },
  {
    to: "level 4",
    text: "Wire agents into your systems with the Agent SDK, the same Claude Code, but launched from your own code. An event fires, an agent runs, and the work is done before you even look.",
    cmds: ["Claude Agent SDK", "CLAUDE.md + skills"],
  },
];

// Command chips shared by the desktop move-row and the mobile move-card.
// [overflow-wrap:anywhere] guarantees even the longest command (the npm install
// line) can never push past the viewport edge on a narrow phone.
function CmdChips({ cmds }: { cmds: string[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      {cmds.map((c) => (
        <span
          key={c}
          className="rounded border border-vivid-blue/40 px-2.5 py-1 font-mono text-xs font-medium text-vivid-blue/90 [overflow-wrap:anywhere]"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

// Desktop (lg+): the move between two rungs, a dark band spanning the table.
function MoveRow({ to, text, cmds }: { to: string; text: ReactNode; cmds: string[] }) {
  return (
    <tr>
      <td colSpan={4} className="surface-raised border-b border-hairline px-5 py-4 sm:px-6">
        <span className="eyebrow mr-2 whitespace-nowrap text-[0.68rem] font-semibold text-vivid-blue/90">
          how to get to {to}
        </span>
        <span className="font-body text-sm text-silver-muted">{text}</span>
        <CmdChips cmds={cmds} />
      </td>
    </tr>
  );
}

// Small up-chevron marking each "step up" on the mobile ladder rail.
const chevronUp = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 15l6-6 6 6" />
  </svg>
);

// Mobile (below lg): one level rendered as a rung. The line icon is pulled out
// of the card into a circular node that sits ON the vertical ladder rail; the
// card to its right holds level + role, the agent count, and the two prose
// fields, all always visible (no clipping, no disclosure).
function LevelRung({ lvl }: { lvl: Level }) {
  return (
    <div className="relative flex items-start gap-4">
      <span
        data-testid="rung-node"
        className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-silver/40 bg-navy text-silver [&_svg]:size-6"
      >
        {lvl.icon}
      </span>
      <div className="min-w-0 flex-1 surface-card rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="eyebrow block text-[0.7rem] font-semibold text-silver-muted">
              {lvl.level}
            </span>
            <span className="mt-0.5 block font-display text-lg font-semibold leading-tight text-silver">
              {lvl.role}
            </span>
          </div>
          <div className="shrink-0 text-right">
            <span className="block font-display text-2xl font-light leading-none tabular-nums whitespace-nowrap text-silver">
              {lvl.agents}
            </span>
            <span className="eyebrow mt-1 block text-[0.62rem] font-semibold text-silver-muted">
              agents
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-4 border-t border-hairline pt-4">
          <div>
            <span className="eyebrow block text-[0.7rem] font-semibold text-silver-muted">
              what it looks like
            </span>
            <p className="mt-1.5 font-body text-base leading-relaxed text-silver-muted">
              {lvl.looks}
            </p>
          </div>
          <div className="border-l-2 border-vivid-blue pl-3.5 [&_strong]:font-semibold [&_strong]:text-silver">
            <span className="eyebrow block text-[0.7rem] font-semibold text-vivid-blue">
              what keeps you stuck
            </span>
            <p className="mt-1.5 font-body text-base leading-relaxed text-silver-muted">
              {lvl.stuck}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile (below lg): the "step up" between two rungs. A full-width band (so the
// longest command chip never clips) pinned to the rail by an up-chevron badge
// straddling its top edge, so the spine reads rung, step up, rung.
function MoveStep({ to, text, cmds }: { to: string; text: ReactNode; cmds: string[] }) {
  return (
    <div className="relative surface-raised rounded-xl border border-hairline px-5 pb-4 pt-5">
      <span
        aria-hidden
        className="absolute -top-3 left-6 z-10 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-vivid-blue/40 bg-navy text-vivid-blue [&_svg]:size-3.5"
      >
        {chevronUp}
      </span>
      <span className="eyebrow block text-[0.7rem] font-semibold text-vivid-blue">
        how to get to {to}
      </span>
      <p className="mt-1.5 font-body text-base leading-relaxed text-silver-muted">{text}</p>
      <CmdChips cmds={cmds} />
    </div>
  );
}

export default function FiveLevelsPage() {
  return (
    <>
      {/* Minimal header */}
      <header className="px-2">
        <div className="mx-auto mt-2 flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="brand-wordmark font-display text-lg tracking-tight">
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
              5 levels &middot; find your rung &middot; take the next step
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-metallic mt-8 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
            >
              the builder&apos;s ladder
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 font-body text-lg text-silver-muted md:text-xl"
            >
              the 5 levels of AI adoption, from copy-pasting out of a chat window
              to a thousand agents that launch themselves.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-3 font-body text-base text-silver-muted"
            >
              find where you are today, then take the one move that gets you to
              the next rung. every step runs on Claude Code.
            </motion.p>
          </motion.div>
        </section>

        {/* The ladder */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="pb-24 md:pb-28"
        >
          <div className="mx-auto max-w-5xl px-6">
            {/* Desktop (lg+): the full comparison table. */}
            <div className="hidden overflow-x-auto rounded-2xl surface-card lg:block">
              <table className="w-full min-w-[52rem] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="eyebrow border-b border-hairline px-5 py-4 text-[0.72rem] font-semibold text-silver sm:px-6">
                      Level &amp; your role
                    </th>
                    <th className="eyebrow border-b border-hairline px-5 py-4 text-[0.72rem] font-semibold text-silver sm:px-6">
                      Agents
                    </th>
                    <th className="eyebrow border-b border-hairline px-5 py-4 text-[0.72rem] font-semibold text-silver sm:px-6">
                      What it looks like
                    </th>
                    <th className="eyebrow border-b border-hairline px-5 py-4 text-[0.72rem] font-semibold text-silver sm:px-6">
                      What keeps you stuck
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((lvl, i) => (
                    <Fragment key={lvl.level}>
                      <tr>
                        {/* Level & role */}
                        <td className="border-b border-hairline px-5 py-6 align-top sm:px-6">
                          <div className="flex items-center gap-4">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-silver/40 text-silver [&_svg]:size-6">
                              {lvl.icon}
                            </span>
                            <span>
                              <span className="eyebrow block text-[0.68rem] font-semibold text-silver-muted">
                                {lvl.level}
                              </span>
                              <span className="mt-0.5 block font-display text-lg font-semibold text-silver">
                                {lvl.role}
                              </span>
                            </span>
                          </div>
                        </td>
                        {/* Agents */}
                        <td className="border-b border-hairline px-5 py-6 align-top font-display text-2xl font-light tabular-nums whitespace-nowrap text-silver sm:px-6">
                          {lvl.agents}
                        </td>
                        {/* What it looks like */}
                        <td className="border-b border-hairline px-5 py-6 align-top font-body text-sm leading-relaxed text-silver-muted sm:px-6">
                          {lvl.looks}
                        </td>
                        {/* What keeps you stuck */}
                        <td className="border-b border-hairline px-5 py-6 align-top font-body text-sm leading-relaxed text-silver-muted shadow-[inset_3px_0_0_var(--color-vivid-blue)] sm:px-6 [&_strong]:font-semibold [&_strong]:text-silver">
                          {lvl.stuck}
                        </td>
                      </tr>
                      {i < moves.length && (
                        <MoveRow to={moves[i].to} text={moves[i].text} cmds={moves[i].cmds} />
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet (below lg): the same data rendered as a climbable
                ladder. A vertical rail threads every rung node, so no field is
                ever clipped by horizontal scroll and the page reads top to
                bottom as the climb its title promises. */}
            <div
              data-testid="ladder-cards"
              className="relative mx-auto max-w-xl lg:hidden"
            >
              {/* the rail: one continuous hairline behind the rung nodes,
                  fading out below the last rung so it never dangles. */}
              <span
                aria-hidden
                data-testid="ladder-rail"
                className="pointer-events-none absolute left-6 top-6 bottom-0 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,var(--color-hairline),var(--color-hairline)_80%,transparent)]"
              />
              <div className="relative flex flex-col gap-4">
                {levels.map((lvl, i) => (
                  <Fragment key={lvl.level}>
                    <LevelRung lvl={lvl} />
                    {i < moves.length && (
                      <MoveStep to={moves[i].to} text={moves[i].text} cmds={moves[i].cmds} />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center font-body text-sm text-silver-muted">
              most people stall between level 1 and level 2. the jump is not a
              smarter model, it is learning to review results instead of
              keystrokes.
            </p>
          </div>
        </motion.section>

        {/* The video this page came from. Click-to-load facade, kept low on the
            page: almost everyone here arrived from that video already. */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="pb-24 md:pb-32"
        >
          <div className="mx-auto max-w-3xl px-6">
            <YouTubeEmbed videoId={VIDEO_ID} title={VIDEO_TITLE} />
          </div>
        </motion.section>
      </main>

      <ResourceFooter currentSlug="5-levels-ai" boldaneCredit />
    </>
  );
}
