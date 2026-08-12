// The questions people actually ask under the videos, answered on the page.
//
// Sourced from every comment on the 17 Claude-era videos (593 comments, 230 of
// them questions), clustered by how often they repeat. The top four clusters are
// all the same shape: someone follows the video exactly, hits a wall that has
// nothing to do with the idea being taught, and has no way to get unstuck. So
// they either give up or write "not working bro". Answering them here is worth
// more than another tutorial.
//
// Every fact was checked against primary docs on 2026-08-12 (Anthropic's own
// docs at code.claude.com, Google AI Studio, Apify, LinkedIn's user agreement).
// The install specifics and free tiers will rot: re-check before re-promoting.
//
// Format follows the house pattern from /claude-code-instagram: a shut <details>
// per problem, because a wall of caveats next to every instruction "looks
// monstrous for people who are non-technical". Shut by default, opened only by
// the person who has that exact problem.

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

/** Inline code, matching the resource pages. */
function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-[0.9em] text-silver [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}

/**
 * A copy-pasteable block. It WRAPS rather than scrolling sideways: these are
 * commands someone has to reproduce exactly, and on a 390px phone an
 * overflow-x box hides the end of the line behind an invisible scrollbar, so
 * people copy half a command and it fails. Wrapping is visual only, so
 * selecting still yields the real text, and nothing is hidden.
 */
function Cmd({ children }: { children: ReactNode }) {
  return (
    <pre className="whitespace-pre-wrap rounded-lg border border-hairline bg-navy-raised p-3 font-mono text-xs leading-relaxed text-silver [overflow-wrap:anywhere]">
      {children}
    </pre>
  );
}

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

export type TroubleshootingItem = { q: string; a: ReactNode };

/**
 * All the answers, keyed so each page can take only the ones that apply to it.
 * A page about competitor research should not carry a LinkedIn ban warning, and
 * a page with no API keys should not carry the .env answer.
 */
export const FIXES: Record<string, TroubleshootingItem> = {
  /* ---- by far the most repeated, across every video ---- */
  claudeNotFound: {
    q: 'the terminal says "command not found: claude"',
    a: (
      <>
        <p>
          installing the Claude Code <strong>extension in VS Code does not give
          you the <C>claude</C> terminal command</strong>. the extension keeps a
          private copy for its own chat panel. that catches almost everyone, and
          it is not a broken setup.
        </p>
        <p>to get the command, install Claude Code itself:</p>
        <Cmd>
          {`# macOS or Linux
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex`}
        </Cmd>
        <p>
          then <strong>close the terminal window completely and open a new
          one</strong>. skipping that is the second most common reason it still
          says not found. check it worked with <C>claude --version</C>.
        </p>
        <p>
          still not found on a Mac? your PATH is missing the folder, so run these
          two lines:
        </p>
        <Cmd>
          {`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc`}
        </Cmd>
        <p>
          <C>claude doctor</C> prints a full health report if you are still
          stuck. and if you would rather never touch a terminal, the{" "}
          <A href="https://claude.ai/download">Claude Code desktop app</A> does
          the same job with buttons.
        </p>
        <p className="text-silver-muted">
          one thing worth knowing before you install anything: Claude Code needs
          a paid Claude plan (Pro or higher) or an API account. the free
          claude.ai plan does not include it, so it can install perfectly and
          still refuse to sign you in.
        </p>
      </>
    ),
  },

  crAlias: {
    q: 'i typed "cr" and nothing happened, or it says command not found',
    a: (
      <>
        <p>
          <C>cr</C> is not a Claude command. it is a shortcut for a longer one,
          and three things go wrong with it.
        </p>
        <p>
          <strong>it is lowercase.</strong> terminals are case sensitive, so{" "}
          <C>CR</C> is a different word and will never be found.
        </p>
        <p>
          <strong>a shortcut typed straight into a terminal dies when you close
          that window.</strong> to keep it, put the two lines in <C>~/.zshrc</C>{" "}
          on a Mac, then run <C>source ~/.zshrc</C>.
        </p>
        <p>
          <strong>on Windows, <C>alias</C> does not define anything.</strong> in
          PowerShell <C>alias</C> means <C>Get-Alias</C>, which is why you get{" "}
          <C>ItemNotFoundException</C>. use functions instead:
        </p>
        <Cmd>
          {`function cs { claude "/prime" }
function cr { claude --dangerously-skip-permissions "/prime" }`}
        </Cmd>
        <p>
          to keep those permanently on Windows, run <C>notepad $PROFILE</C> and
          paste them in.
        </p>
        <p>
          you never need the shortcut at all. just run the thing it stands for:
        </p>
        <Cmd>{`claude --dangerously-skip-permissions "/prime"`}</Cmd>
        <p>
          and read which error you get, because it tells you which piece is
          missing. <C>command not found: cr</C> means the shortcut is not saved.{" "}
          <C>command not found: claude</C> after typing <C>cr</C> means the
          shortcut is fine and Claude Code itself is not installed.
        </p>
      </>
    ),
  },

  noEnvFile: {
    q: "there is no .env file in the folder i downloaded",
    a: (
      <>
        <p>
          correct, and on purpose. <C>.env</C> is where your private keys live,
          so it is deliberately kept out of the repo. a public folder with
          someone else&apos;s API keys in it would be a gift to whoever found it.
        </p>
        <p>
          you create it yourself, once. the projects now ship a{" "}
          <C>.env.example</C> to copy:
        </p>
        <Cmd>
          {`# macOS or Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env`}
        </Cmd>
        <p>
          or just make it by hand in VS Code: click the new file icon in the left
          panel and name it exactly <C>.env</C>, dot and all. then paste your
          keys in, one per line, <strong>no quotes and no spaces around the{" "}
          <C>=</C></strong>.
        </p>
        <p>
          put it in the <strong>project root</strong>, the folder that has{" "}
          <C>CLAUDE.md</C> in it, not inside <C>app</C>.
        </p>
        <p className="text-silver-muted">
          if you cannot see the file after making it, some setups hide files that
          start with a dot. it is there.
        </p>
      </>
    ),
  },

  costs: {
    q: "what does this actually cost to run?",
    a: (
      <>
        <p>
          two separate bills, and mixing them up is what causes most of the
          confusion.
        </p>
        <p>
          <strong>Claude Code</strong> comes with a Claude subscription: Pro at
          $20/month, Max at $100 or $200/month. usage is included, there is no
          per-run charge. the free plan does not include Claude Code at all.
        </p>
        <p>
          <strong>the API keys</strong> the pipelines use are pay per token,
          prepaid, and completely separate. a Claude subscription does not fund
          an API key.
        </p>
        <p>
          for the scraping and analysis side, the free tiers genuinely cover
          trying this out: Apify&apos;s free plan includes $5 of usage a month,
          and a scrape of a few dozen profiles costs cents. Google AI Studio has
          a free tier for the analysis.
        </p>
        <p>
          inside Claude Code, <C>/status</C> tells you whether you are on a
          subscription or an API key, and <C>/usage</C> shows how close you are
          to your plan limit.
        </p>
        <p className="text-silver-muted">
          prices and free tiers move. these were checked in August 2026.
        </p>
      </>
    ),
  },

  creditBalance: {
    q: 'it says "credit balance too low, add funds"',
    a: (
      <>
        <p>
          that message is about the <strong>Anthropic API</strong>, which is
          prepaid pay per token. it is not about your Claude subscription, and a
          Pro or Max subscription never funds an API key. they are two different
          products with two different bills.
        </p>
        <p>
          if you meant to use the API, add credit at{" "}
          <A href="https://platform.claude.com">platform.claude.com</A> under
          Billing, and switch on auto reload so a long run cannot die halfway.
        </p>
        <p>
          if you did <em>not</em> mean to use an API key, you probably have one
          sitting in your environment, and a key set there overrides your
          subscription login. check with <C>echo $ANTHROPIC_API_KEY</C> on a Mac.
          if it prints something, remove it and run <C>/login</C> inside Claude
          Code to sign in with your subscription instead.
        </p>
      </>
    ),
  },

  geminiQuota: {
    q: 'the pipeline fails with "429" or a quota error from Gemini',
    a: (
      <>
        <p>
          a 429 means you hit a quota on your Google AI key: too many requests
          per minute, or the daily cap. it is not a bug in the project, and{" "}
          <strong>no, this does not require a paid Gemini plan</strong>. the
          claim going round that the paid tier has a $200 minimum is wrong: that
          number is a spend limit in Google&apos;s docs, not an entry price.
        </p>
        <p>free ways to get under the limit:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>analyse fewer items per run, lower the top-k and max videos</li>
          <li>
            wait and try again: the daily quota resets at midnight Pacific, not
            24 hours after your run
          </li>
        </ul>
        <p>
          check your own limits at{" "}
          <A href="https://aistudio.google.com/rate-limit">
            aistudio.google.com/rate-limit
          </A>
          . Google stopped publishing the free numbers in its docs, so that
          dashboard is the only accurate source.
        </p>
        <p>
          if you get a <strong>404 saying the model does not exist</strong>, that
          is different: Google retires models. list what your key can reach and
          set <C>GEMINI_MODEL</C> in your <C>.env</C> to one of them:
        </p>
        <Cmd>
          {`curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY"`}
        </Cmd>
        <p className="text-silver-muted">
          one warning: Google&apos;s pricing page says free tier content is used
          to improve their products. do not push client material through a free
          key.
        </p>
      </>
    ),
  },

  skipPermissions: {
    q: 'is "--dangerously-skip-permissions" safe?',
    a: (
      <>
        <p>
          it does exactly what the name says: it turns off the ask-before-acting
          prompt, so Claude can edit files and run commands on your machine
          without checking with you each time. that is why it is fast, and that
          is the whole risk.
        </p>
        <p>
          the honest version: in a project folder like this one, where you know
          what is inside and nothing valuable is nearby, it is a reasonable
          trade. pointed at your whole home folder, or at a repo you have not
          read, it is not.
        </p>
        <p>
          the safer default is to drop the flag. <C>claude &quot;/prime&quot;</C>{" "}
          does the same work and asks first. you approve a few things at the
          start, then it stops asking about the same kinds of actions.
        </p>
      </>
    ),
  },

  /**
   * For the pages whose download still lives in the Skool community. That
   * community is live and free, but it has no obvious files section, and the
   * comments on those videos are the angriest on the channel: "where is the
   * code", "the links are gone", "you are a scammer". Until those projects have
   * a public repo, the least this page can do is say where to look and hand over
   * the public ones that do exist.
   */
  cantFindCode: {
    q: "i cannot find the source code anywhere",
    a: (
      <>
        <p>
          the community is free and still open, and the files sit in the{" "}
          <strong>Classroom</strong> section once you have joined:{" "}
          <A href="https://www.skool.com/ai-automation-7100/about">
            skool.com/ai-automation-7100
          </A>
          . the link in some of the older video descriptions is stale, which is
          what most of this confusion is.
        </p>
        <p>
          if you would rather skip the signup entirely, these are public on
          GitHub right now and need no account:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <A href="https://github.com/melnikoff-oleg/social-media">social-media</A>{" "}
            for Instagram Reels competitor research
          </li>
          <li>
            <A href="https://github.com/melnikoff-oleg/tiktok-ai">tiktok-ai</A>{" "}
            for the same on TikTok
          </li>
          <li>
            <A href="https://github.com/melnikoff-oleg/x-ai">x-ai</A> for
            X/Twitter content
          </li>
          <li>
            <A href="https://github.com/melnikoff-oleg/ads-ai">ads-ai</A> for
            studying competitors&apos; Meta ads
          </li>
          <li>
            <A href="https://github.com/melnikoff-oleg/high-converting-website">
              high-converting-website
            </A>{" "}
            for a landing page that sells
          </li>
        </ul>
        <p>
          they are all the same shape as what this page describes, so the setup
          steps above still apply.
        </p>
      </>
    ),
  },

  /* ---- outreach pages only ---- */
  linkedinBan: {
    q: "will this get my LinkedIn account restricted?",
    a: (
      <>
        <p>
          straight answer: <strong>there is real risk, and you should decide
          knowing that.</strong> automating LinkedIn is not a grey area, it is
          against{" "}
          <A href="https://www.linkedin.com/legal/user-agreement">
            LinkedIn&apos;s user agreement
          </A>{" "}
          in plain words. LinkedIn says automated inauthentic activity can lead
          to temporary or permanent restriction of your account. in practice what
          people usually meet first is a block on sending invitations.
        </p>
        <p>
          worth knowing too: Anthropic&apos;s{" "}
          <A href="https://www.anthropic.com/legal/aup">usage policy</A> forbids
          using Claude to get around another platform&apos;s terms. so driving
          LinkedIn this way is against both sets of rules, not just
          LinkedIn&apos;s.
        </p>
        <p>
          the thing that actually changes your exposure is{" "}
          <strong>whether your own logged-in account is doing the automated
          work</strong>. reading public pages through a third party scraper does
          not put your account in the loop. a tool driving your session with your
          cookies does.
        </p>
        <p>so the lower-risk shape of this, and the one I would run:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>automate the research: finding leads, reading public pages, writing the draft</li>
          <li>send from your own account yourself, at a human volume</li>
          <li>never point it at an account you cannot afford to lose</li>
        </ul>
        <p className="text-silver-muted">
          I will not give you tricks for looking human to LinkedIn&apos;s
          detection. people do post them, and following them is how you end up
          arguing with an appeal form. do not quote a &quot;safe&quot; daily
          number either: LinkedIn does not publish one, and every figure you see
          online came from a vendor blog. what LinkedIn does say is what triggers
          it, which is more useful: a lot of invitations in a short time, and
          invitations that get ignored or marked as spam.
        </p>
      </>
    ),
  },

  scrapingSafety: {
    q: "is scraping competitors going to get my account banned?",
    a: (
      <>
        <p>
          this reads <strong>public</strong> posts through a third party scraper.
          it never logs in as you, never posts, never follows and never messages,
          so your own account is not the thing making the requests. that is a
          different risk profile from automating your own logged-in account, and
          it is the reason it is built this way.
        </p>
        <p>
          worth being straight about the rest: Meta&apos;s and TikTok&apos;s terms
          restrict automated collection of data from their platforms, whoever is
          doing it. the practical exposure here sits with the scraping service,
          not with your profile.
        </p>
      </>
    ),
  },
};

/**
 * Build the section from a list of keys, in the order given. Rendered right
 * after the setup guide, which is where people are standing when they get
 * stuck, rather than at the very bottom where nobody scrolls.
 */
export function Troubleshooting({ items }: { items: (keyof typeof FIXES)[] }) {
  const picked = items.map((k) => FIXES[k]).filter(Boolean);
  if (picked.length === 0) return null;

  return (
    <Reveal as="section" className="pb-16 md:pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="eyebrow font-body text-[13px] text-vivid-blue">
          if you get stuck
        </h2>
        <p className="mt-4 font-body text-base text-silver-muted">
          the things that actually go wrong, taken from the questions people ask
          under the video.
        </p>

        <div className="mt-8 space-y-3">
          {picked.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-hairline surface-card"
            >
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-body text-base font-medium text-silver transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                  className="size-4 shrink-0 text-silver-muted transition-transform duration-200 group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="space-y-3 border-t border-hairline px-5 py-4 font-body text-base leading-relaxed text-silver">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
