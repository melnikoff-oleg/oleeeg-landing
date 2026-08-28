// The questions, and a plain-text version of each answer.
//
// Split out of troubleshooting.tsx for two reasons. The rendered answer is JSX
// and cannot go into JSON-LD, so the schema needs a text twin; and keeping that
// twin on the same object as the question is what stops the two drifting into
// saying different things, which is the difference between helpful structured
// data and structured-data spam.
//
// This file holds no JSX on purpose, so a node unit test can import it and
// check every entry (tests/unit/troubleshooting-faq.test.ts).
//
// Sourced from clustering 593 comments across the Claude-era videos. Every fact
// was checked against primary docs on 2026-08-12 and the prices re-checked on
// 2026-08-27.

export type FixMeta = {
  /** Rendered as the <summary> and as the FAQ Question name. */
  q: string;
  /** The same answer as prose, for FAQPage schema. No markup. */
  aText: string;
};

export const FIXES = {
  claudeNotFound: {
    q: "The terminal says “command not found: claude”",
    aText:
      "Installing the Claude Code extension in VS Code does not give you the claude terminal command: the extension keeps a private copy for its own chat panel. Install Claude Code itself with curl -fsSL https://claude.ai/install.sh | bash on macOS or Linux, or irm https://claude.ai/install.ps1 | iex in Windows PowerShell. Then close the terminal window completely and open a new one, which is the second most common reason it still says not found, and check with claude --version. On a Mac you may also need to add $HOME/.local/bin to your PATH. Claude Code also needs a paid Claude plan, so it can install perfectly and still refuse to sign you in.",
  },
  crAlias: {
    q: "I typed “cr” and nothing happened, or it says command not found",
    aText:
      "cr is not a Claude command. It is a shortcut for a longer one that the project sets up in a shell aliases file, so it only exists once you have run those two lines in your terminal. If you have not, use the full claude command instead, or open the shell aliases file in the project and run the lines it contains.",
  },
  noEnvFile: {
    q: "There is no .env file in the folder I downloaded",
    aText:
      "That is correct and deliberate. The .env file is where your private API keys live, so it is kept out of the public repository. You create it once yourself: copy .env.example to .env, or make a new file in VS Code named exactly .env, dot included. Paste your keys one per line with no quotes and no spaces around the equals sign, and put the file in the project root, the folder containing CLAUDE.md, not inside app. If you cannot see it afterwards, some setups hide files whose names start with a dot.",
  },
  costs: {
    q: "What does this actually cost to run?",
    aText:
      "Claude Code comes with a Claude subscription: Pro at $20 a month, or Max from $100 a month for five or twenty times the usage. Usage is included and there is no per-run charge. The free plan does not include Claude Code at all. Inside Claude Code, /status tells you whether you are on a subscription or an API key, and /usage shows how close you are to your plan limit. Prices and free tiers move; these were checked in August 2026.",
  },
  costsScraping: {
    q: "Do I also need to pay for the API keys?",
    aText:
      "Yes, and it is a separate bill from your Claude subscription, which is what causes most of the confusion: a Claude plan does not fund an API key. The API keys these pipelines use are prepaid and billed per token. The free tiers genuinely cover trying this out, though: Apify includes $5 of usage a month and a scrape of a few dozen profiles costs cents, and Google AI Studio has a free tier for the analysis step. Prices and free tiers move; these were checked in August 2026.",
  },
  creditBalance: {
    q: "It says “credit balance too low, add funds”",
    aText:
      "That message is about the Anthropic API, not your Claude subscription. They are separate accounts with separate billing, and a Pro or Max plan does not put credit on an API key. Either add credit to the API account in the Claude Console, or switch the project to use your subscription instead of an API key. Seeing this message while paying for Pro is not a billing error, it means the project is pointed at an API key.",
  },
  geminiQuota: {
    q: "The pipeline fails with “429” or a quota error from Gemini",
    aText:
      "A 429 means you hit a quota on your Google AI key: too many requests in a short window, or the daily free-tier cap. Video analysis is the expensive call, so a large run reaches it fastest. Wait for the window to reset, run fewer creators or fewer videos per creator, or add billing to the Google AI Studio project. Running the same big job again immediately will just hit the same wall.",
  },
  skipPermissions: {
    q: "Is --dangerously-skip-permissions safe?",
    aText:
      "It does exactly what the name says: it turns off the ask-before-acting prompt, so Claude Code stops checking with you before it runs commands or changes files. Those prompts are the only thing standing between a misunderstanding and a deleted folder. Plenty of people run with it on and it is usually fine, but use it in a project folder you could lose without caring, not in your documents, and not before you have a feel for what the thing does.",
  },
  cantFindCode: {
    q: "I cannot find the source code anywhere",
    aText:
      "The community is free and still open, and the files sit in its Classroom section rather than on the About page, which is where most people look and give up. Join, open Classroom, and the project folder is there. Some of the systems also have public GitHub repositories that need no signup at all, linked from the top of their guide pages here.",
  },
  linkedinBan: {
    q: "Will this get my LinkedIn account restricted?",
    aText:
      "There is real risk and you should decide with that in front of you. Automating LinkedIn is against LinkedIn's user agreement, and using Claude to work around another platform's terms is against Anthropic's usage policy too. LinkedIn does not publish a safe daily number, so any figure you find online is somebody guessing, and I will not hand out detection-evasion advice. The lower-risk shape is to automate the research and the drafting, which is where almost all the time goes, and send the messages by hand.",
  },
  scrapingSafety: {
    q: "Is scraping competitors going to get my account banned?",
    aText:
      "This reads public posts through a third-party scraper, which is a mainstream service built for exactly that, and it does not touch your own account or log in as you. Two limits worth keeping: do not point it at private accounts, and do not republish someone else's video or post as your own. What these systems take is the pattern, the hook shape and the structure, and those are not anyone's property.",
  },
} satisfies Record<string, FixMeta>;

/**
 * The literal key union, not `string`. `satisfies` above is what buys that: it
 * checks every entry against FixMeta while keeping the keys narrow, so
 * `troubleshooting={["clauseNotFound"]}` is a compile error instead of a
 * section that silently renders nothing.
 */
export type FixKey = keyof typeof FIXES;

/**
 * The FAQ entries for exactly the fixes a page renders, in the order it renders
 * them. Unknown keys are dropped rather than producing an empty Question node.
 */
export function faqEntriesFor(keys: readonly FixKey[]): { q: string; a: string }[] {
  return keys
    .map((k) => (FIXES as Record<string, FixMeta>)[k])
    .filter(Boolean)
    .map((f) => ({ q: f.q, a: f.aText }));
}
