import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
  Answer,
  Callout,
  CompareTable,
  Guide,
  GuideSection,
  GuideToc,
  KeyFacts,
  Out,
} from "@/components/guide";
import { API_RATES, APIFY, PLANS, PRICING_CHECKED, freeLeadsPerMonth, usd } from "@/lib/pricing";

// Ubersuggest, US, 2026-08-27: "Claude Cowork pricing" 1,600/SD 19,
// "Is Claude Cowork free" 880/SD 15, "Claude Cowork cost" 720/SD 23,
// "Claude Cowork price" 480/SD 16, "How much is Claude Cowork" 480/SD 27.
// The lowest-difficulty cluster on the whole site.

const steps = [
  {
    title: "The short answer",
    content: (
      <div className="space-y-3">
        <p>
          Claude Cowork is not free. It needs Pro ({usd(PLANS.pro.monthly)} a
          month), Max (from {usd(PLANS.max.monthlyFrom)}) or a Team seat. The
          free Claude account does not include it.
        </p>
      </div>
    ),
  },
  {
    title: "What you get for the same money",
    content: (
      <div className="space-y-3">
        <p>
          One Pro plan includes cowork, Claude Code, Claude design and Claude
          science. You are not buying cowork on its own, which is why{" "}
          {usd(PLANS.pro.monthly)} is better value than it looks.
        </p>
      </div>
    ),
  },
  {
    title: "When to move to max",
    content: (
      <div className="space-y-3">
        <p>
          Only when you hit usage limits mid-task. Max buys 5x or 20x Pro&apos;s
          usage, not extra features. Do not pre-buy it.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "Is Claude Cowork free",
  "Every plan and what it costs",
  "What you are actually paying for",
  "What a real month costs me",
  "When pro is not enough",
  "The API is not a cheaper cowork",
];

const faq = [
  {
    q: "Is Claude Cowork free",
    a: "No. Claude Cowork requires a paid plan. The free Claude account gives you chat, web search, projects and file uploads, but Cowork is not included, so the app will install and then refuse to open it. The cheapest way in is Pro at $20 a month.",
  },
  {
    q: "How much does Claude Cowork cost",
    a: "$20 a month on Pro billed monthly, or $17 a month if you pay $200 for the year. Max starts at $100 a month for five or twenty times the usage. Team seats are $25 a month billed monthly, or $20 billed annually, with premium seats from $100. Enterprise is $20 per seat plus usage charged at API rates.",
  },
  {
    q: "What is the cheapest way to use Claude Cowork",
    a: "Pro billed annually, at $17 a month, or $200 up front. That is the floor: there is no cheaper tier and no free tier. If you are unsure, pay monthly at $20 for the first month, because the reason to upgrade or leave shows up in week one.",
  },
  {
    q: "Does Claude Cowork cost extra on top of Claude pro",
    a: "No. Cowork is included in Pro at no additional charge, along with Claude Code, Claude Design and Claude Science. There is no separate Cowork subscription and no per-task fee. What you can spend extra on is the services you connect it to, like a scraper or an API, and those bill you directly, not through Anthropic.",
  },
  {
    q: "Is Claude Cowork worth it",
    a: "It is worth it if you have a recurring task where the inputs are files and the output is a document, and you do it at least weekly. One scheduled Monday report replaces more than $20 of your time in the first month. It is not worth it for one-off questions, which is what the free chat is for.",
  },
  {
    q: "What is the difference between max 5x and max 20x",
    a: "Usage, and nothing else. Both give you the same features as Pro, with higher output limits, early access to new features and priority at busy times. The 20x tier is for people running long unattended tasks all day, and it costs more: Anthropic publishes Max as starting from $100 a month and does not name the higher tier's price on its pricing page, so check it at the point of purchase. If you do not know which you need, you need Pro.",
  },
  {
    q: "Do I need to pay for anything besides the Claude plan",
    a: "Only for outside services your tasks use. In my own setup that is Apify for lead data, which gives every account $5 of credit a month free, enough for roughly 3,000 leads on a $1.50 per 1,000 scraper. Most weeks that credit covers everything and the real bill is the $20 plan.",
  },
];

export default function ClaudeCoworkPricingPage() {
  return (
    <ResourcePageShell
      slug="claude-cowork-pricing"
      repoCta={{
        href: "https://claude.com/download",
        label: "Download Claude Cowork",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="Claude Cowork pricing"
      title="What Claude Cowork actually costs"
      subhead={`The short version: it is not free, Pro at ${usd(PLANS.pro.monthly)} a month is the way in, and that same plan includes Claude Code. Here is every tier, what changes between them, and what a real month costs me.`}
      steps={steps}
      troubleshooting={["costs", "creditBalance"]}
      breadcrumb={[
        { name: "Claude Cowork", path: "/claude-cowork" },
        { name: "Pricing", path: "/claude-cowork-pricing" },
      ]}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="Is Claude Cowork free">
            <Answer>
              <strong>No.</strong> Cowork needs a paid Claude plan. The free
              account gives you chat, web search, projects and file uploads, and
              it does not give you cowork. The app installs fine and then will
              not open it, which is the single most common confusion about this
              product.
            </Answer>
            <p>
              The cheapest way in is Pro at {usd(PLANS.pro.monthly)} a month, or{" "}
              {usd(PLANS.pro.annualMonthly)} a month if you pay{" "}
              {usd(PLANS.pro.annualUpfront)} for the year.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="Every plan and what it costs">
            <CompareTable
              columns={["", "Free", "Pro", "Max", "Team"]}
              rows={[
                {
                  label: "Monthly",
                  cells: [
                    "$0",
                    usd(PLANS.pro.monthly),
                    `from ${usd(PLANS.max.monthlyFrom)}`,
                    `${usd(PLANS.teamStandard.monthly)} per seat`,
                  ],
                },
                {
                  label: "Annual, per month",
                  cells: [
                    "$0",
                    usd(PLANS.pro.annualMonthly),
                    "same",
                    `${usd(PLANS.teamStandard.annualMonthly)} per seat`,
                  ],
                },
                {
                  label: "Claude Cowork",
                  cells: ["no", "yes", "yes", "yes"],
                },
                {
                  label: "Claude Code",
                  cells: ["no", "yes", "yes", "yes"],
                },
                {
                  label: "Built-in browser",
                  cells: ["no", "yes", "yes", "yes"],
                },
                {
                  label: "Usage",
                  cells: [
                    "chat only",
                    "the baseline",
                    "5x or 20x pro",
                    "More than pro, premium seats 5x standard",
                  ],
                },
                {
                  label: "Context window",
                  cells: ["200k", "200k", "200k", "500k on the default model"],
                },
                {
                  label: "Who it is for",
                  cells: [
                    "Trying Claude out",
                    "One person, real work",
                    "One person, all day",
                    "2 to 150 people",
                  ],
                },
              ]}
              caption={`Read off Anthropic's own pricing page on ${PRICING_CHECKED}. Prices and limits change at their discretion, so check before you commit to a year.`}
            />
            <p>
              Enterprise is priced differently again:{" "}
              {usd(PLANS.enterprise.seatMonthly)} per seat plus usage billed at
              API rates, with the admin controls, sso and compliance features
              that implies.
            </p>
          </GuideSection>

          <GuideSection title="What you are actually paying for">
            <p>
              The number that matters is not {usd(PLANS.pro.monthly)} for
              cowork. It is {usd(PLANS.pro.monthly)} for cowork{" "}
              <strong>and</strong> Claude Code <strong>and</strong> Claude design{" "}
              <strong>and</strong> Claude science, on one plan.
            </p>
            <p>
              That changes the comparison. People price cowork against a single
              assistant subscription and it looks expensive. Priced against
              &quot;a terminal agent that ships code, plus an app agent that
              produces documents, plus the design and science surfaces&quot;, it
              is one bill instead of four.
            </p>
            <KeyFacts
              rows={[
                { label: "Claude Cowork", value: "Hands over whole office tasks: files, decks, spreadsheets, browsers" },
                { label: "Claude Code", value: "The terminal agent, built around a codebase" },
                { label: "Claude design", value: "Included on the same plan" },
                { label: "Claude science", value: "Included on the same plan" },
                { label: "Total", value: `${usd(PLANS.pro.monthly)} a month` },
              ]}
            />
          </GuideSection>

          <GuideSection title="What a real month costs me">
            <p>
              I run outreach research, a scheduled weekly readout, competitor
              sweeps and document review through cowork. Here is the actual
              bill, not a hypothetical one:
            </p>
            <KeyFacts
              rows={[
                { label: "Claude Pro", value: `${usd(PLANS.pro.monthly)} a month` },
                {
                  label: "Apify, for lead data",
                  value: `${usd(APIFY.freeMonthlyCredit)} of credit free every month, which is about ${freeLeadsPerMonth().toLocaleString()} leads at ${usd(APIFY.leadsPerThousand)} per 1,000`,
                },
                { label: "Everything else", value: "Nothing. Connectors to drive and slack cost nothing." },
                { label: "Monthly total", value: `${usd(PLANS.pro.monthly)}` },
              ]}
            />
            <Callout title="The free lead credit is bigger than it needs to be">
              <p>
                {freeLeadsPerMonth().toLocaleString()} leads a month is already
                more people than LinkedIn will let you send connection requests
                to. So for outreach specifically, the scraping is genuinely free
                and the whole system costs the plan. The full setup is on{" "}
                <a href="/claude-cowork-outreach">The outreach page</a>.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="When pro is not enough">
            <p>
              The honest signal to upgrade is not a feature you want. It is a
              task stopping halfway. Max buys usage, not capability: the same
              cowork, the same connectors, the same browser, with five or twenty
              times the headroom, higher output limits, priority at busy times
              and early access to new features.
            </p>
            <p>You are ready for Max when:</p>
            <ul>
              <li>A scheduled task regularly fails to finish inside your limit</li>
              <li>
                You run several sub agents in parallel most days, which multiplies
                usage rather than adding to it
              </li>
              <li>
                You are working through folders of documents rather than single
                files
              </li>
            </ul>
            <p>
              You are not ready for Max because you would like it to be faster.
              That is not what the tier does.
            </p>
          </GuideSection>

          <GuideSection title="The API is not a cheaper cowork">
            <p>
              A question I get often: can I skip the subscription and pay per
              token instead? For cowork, no. The API sells you model access, not
              the app, the connectors, the scheduler or the browser. There is no
              pay-as-you-go cowork.
            </p>
            <p>
              The rates are still worth knowing, because they are what
              enterprise usage is billed at and what you would pay if you built
              your own version of any of this:
            </p>
            <CompareTable
              columns={["model", "input", "output", "cache write", "cache read"]}
              rows={API_RATES.map((r) => ({
                label: r.model,
                cells: [
                  `${usd(r.input)} / MTok`,
                  `${usd(r.output)} / MTok`,
                  `${usd(r.cacheWrite)} / MTok`,
                  `${usd(r.cacheRead)} / MTok`,
                ],
              }))}
              caption={`Per million tokens, ${PRICING_CHECKED}. Batch processing halves it. Prompt caching is the lever that matters: reading from cache costs a fraction of writing to it, which is why a long-running agent is cheaper than the raw input rate suggests.`}
            />
            <p>
              For the same question about Claude Code, where the API genuinely
              is an alternative to the subscription, see{" "}
              <a href="/claude-code-pricing">Claude Code pricing</a>. And for
              what cowork actually does with the money, see{" "}
              <a href="/claude-cowork">The main cowork guide</a>.
            </p>
            <p className="text-silver-muted">
              Prices above were read off{" "}
              <Out href="https://claude.com/pricing">anthropic&apos;s pricing page</Out>{" "}
              on {PRICING_CHECKED}. They change, and this page will be behind at
              some point. Check the source before you commit to an annual plan.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Cowork pricing: every plan, and what a real month costs",
        description:
          "Claude Cowork is not free. Pro is $20 a month and includes Claude Code too. Every tier compared, what changes between them, and the real monthly bill for running outreach and reporting through it.",
        url: "https://oleg.ae/claude-cowork-pricing",
        datePublished: "2026-08-27",
        dateModified: "2026-08-27",
      }}
      boldaneCredit
    />
  );
}
