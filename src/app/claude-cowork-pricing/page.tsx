import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
  Callout,
  CompareTable,
  Guide,
  GuideSection,
  GuideToc,
  KeyFacts,
  Out,
} from "@/components/guide";
import { API_RATES, APIFY, PLANS, PRICING_CHECKED, freeLeadsPerMonth, usd } from "@/lib/pricing";

// Ubersuggest, US, 2026-08-27: "claude cowork pricing" 1,600/SD 19,
// "is claude cowork free" 880/SD 15, "claude cowork cost" 720/SD 23,
// "claude cowork price" 480/SD 16, "how much is claude cowork" 480/SD 27.
// The lowest-difficulty cluster on the whole site.

const steps = [
  {
    title: "the short answer",
    content: (
      <div className="space-y-3">
        <p>
          claude cowork is not free. it needs Pro ({usd(PLANS.pro.monthly)} a
          month), Max (from {usd(PLANS.max.monthlyFrom)}) or a Team seat. the
          free claude account does not include it.
        </p>
      </div>
    ),
  },
  {
    title: "what you get for the same money",
    content: (
      <div className="space-y-3">
        <p>
          one Pro plan includes cowork, claude code, claude design and claude
          science. you are not buying cowork on its own, which is why{" "}
          {usd(PLANS.pro.monthly)} is better value than it looks.
        </p>
      </div>
    ),
  },
  {
    title: "when to move to max",
    content: (
      <div className="space-y-3">
        <p>
          only when you hit usage limits mid-task. Max buys 5x or 20x Pro&apos;s
          usage, not extra features. do not pre-buy it.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "is claude cowork free",
  "every plan and what it costs",
  "what you are actually paying for",
  "what a real month costs me",
  "when pro is not enough",
  "the api is not a cheaper cowork",
];

const faq = [
  {
    q: "is claude cowork free",
    a: "No. Claude Cowork requires a paid plan. The free Claude account gives you chat, web search, projects and file uploads, but Cowork is not included, so the app will install and then refuse to open it. The cheapest way in is Pro at $20 a month.",
  },
  {
    q: "how much does claude cowork cost",
    a: "$20 a month on Pro billed monthly, or $17 a month if you pay $200 for the year. Max starts at $100 a month for five or twenty times the usage. Team seats are $25 a month billed monthly, or $20 billed annually, with premium seats from $100. Enterprise is $20 per seat plus usage charged at API rates.",
  },
  {
    q: "what is the cheapest way to use claude cowork",
    a: "Pro billed annually, at $17 a month, or $200 up front. That is the floor: there is no cheaper tier and no free tier. If you are unsure, pay monthly at $20 for the first month, because the reason to upgrade or leave shows up in week one.",
  },
  {
    q: "does claude cowork cost extra on top of claude pro",
    a: "No. Cowork is included in Pro at no additional charge, along with Claude Code, Claude Design and Claude Science. There is no separate Cowork subscription and no per-task fee. What you can spend extra on is the services you connect it to, like a scraper or an API, and those bill you directly, not through Anthropic.",
  },
  {
    q: "is claude cowork worth it",
    a: "It is worth it if you have a recurring task where the inputs are files and the output is a document, and you do it at least weekly. One scheduled Monday report replaces more than $20 of your time in the first month. It is not worth it for one-off questions, which is what the free chat is for.",
  },
  {
    q: "what is the difference between max 5x and max 20x",
    a: "Usage, and nothing else. Both give you the same features as Pro, with higher output limits, early access to new features and priority at busy times. The 20x tier is for people running long unattended tasks all day, and it costs more: Anthropic publishes Max as starting from $100 a month and does not name the higher tier's price on its pricing page, so check it at the point of purchase. If you do not know which you need, you need Pro.",
  },
  {
    q: "do i need to pay for anything besides the claude plan",
    a: "Only for outside services your tasks use. In my own setup that is Apify for lead data, which gives every account $5 of credit a month free, enough for roughly 3,000 leads on a $1.50 per 1,000 scraper. Most weeks that credit covers everything and the real bill is the $20 plan.",
  },
];

export default function ClaudeCoworkPricingPage() {
  return (
    <ResourcePageShell
      slug="claude-cowork-pricing"
      repoCta={{
        href: "https://claude.com/download",
        label: "download claude cowork",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="claude cowork pricing"
      title="what claude cowork actually costs"
      subhead={`the short version: it is not free, Pro at ${usd(PLANS.pro.monthly)} a month is the way in, and that same plan includes claude code. here is every tier, what changes between them, and what a real month costs me.`}
      steps={steps}
      troubleshooting={["costs", "creditBalance"]}
      breadcrumb={[
        { name: "Claude Cowork", path: "/claude-cowork" },
        { name: "Pricing", path: "/claude-cowork-pricing" },
      ]}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="is claude cowork free">
            <p>
              <strong>no.</strong> cowork needs a paid claude plan. the free
              account gives you chat, web search, projects and file uploads, and
              it does not give you cowork. the app installs fine and then will
              not open it, which is the single most common confusion about this
              product.
            </p>
            <p>
              the cheapest way in is Pro at {usd(PLANS.pro.monthly)} a month, or{" "}
              {usd(PLANS.pro.annualMonthly)} a month if you pay{" "}
              {usd(PLANS.pro.annualUpfront)} for the year.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="every plan and what it costs">
            <CompareTable
              columns={["", "Free", "Pro", "Max", "Team"]}
              rows={[
                {
                  label: "monthly",
                  cells: [
                    "$0",
                    usd(PLANS.pro.monthly),
                    `from ${usd(PLANS.max.monthlyFrom)}`,
                    `${usd(PLANS.teamStandard.monthly)} per seat`,
                  ],
                },
                {
                  label: "annual, per month",
                  cells: [
                    "$0",
                    usd(PLANS.pro.annualMonthly),
                    "same",
                    `${usd(PLANS.teamStandard.annualMonthly)} per seat`,
                  ],
                },
                {
                  label: "claude cowork",
                  cells: ["no", "yes", "yes", "yes"],
                },
                {
                  label: "claude code",
                  cells: ["no", "yes", "yes", "yes"],
                },
                {
                  label: "built-in browser",
                  cells: ["no", "yes", "yes", "yes"],
                },
                {
                  label: "usage",
                  cells: [
                    "chat only",
                    "the baseline",
                    "5x or 20x pro",
                    "more than pro, premium seats 5x standard",
                  ],
                },
                {
                  label: "context window",
                  cells: ["200k", "200k", "200k", "500k on the default model"],
                },
                {
                  label: "who it is for",
                  cells: [
                    "trying claude out",
                    "one person, real work",
                    "one person, all day",
                    "2 to 150 people",
                  ],
                },
              ]}
              caption={`read off anthropic's own pricing page on ${PRICING_CHECKED}. prices and limits change at their discretion, so check before you commit to a year.`}
            />
            <p>
              enterprise is priced differently again:{" "}
              {usd(PLANS.enterprise.seatMonthly)} per seat plus usage billed at
              api rates, with the admin controls, sso and compliance features
              that implies.
            </p>
          </GuideSection>

          <GuideSection title="what you are actually paying for">
            <p>
              the number that matters is not {usd(PLANS.pro.monthly)} for
              cowork. it is {usd(PLANS.pro.monthly)} for cowork{" "}
              <strong>and</strong> claude code <strong>and</strong> claude design{" "}
              <strong>and</strong> claude science, on one plan.
            </p>
            <p>
              that changes the comparison. people price cowork against a single
              assistant subscription and it looks expensive. priced against
              &quot;a terminal agent that ships code, plus an app agent that
              produces documents, plus the design and science surfaces&quot;, it
              is one bill instead of four.
            </p>
            <KeyFacts
              rows={[
                { label: "claude cowork", value: "hands over whole office tasks: files, decks, spreadsheets, browsers" },
                { label: "claude code", value: "the terminal agent, built around a codebase" },
                { label: "claude design", value: "included on the same plan" },
                { label: "claude science", value: "included on the same plan" },
                { label: "total", value: `${usd(PLANS.pro.monthly)} a month` },
              ]}
            />
          </GuideSection>

          <GuideSection title="what a real month costs me">
            <p>
              i run outreach research, a scheduled weekly readout, competitor
              sweeps and document review through cowork. here is the actual
              bill, not a hypothetical one:
            </p>
            <KeyFacts
              rows={[
                { label: "claude pro", value: `${usd(PLANS.pro.monthly)} a month` },
                {
                  label: "apify, for lead data",
                  value: `${usd(APIFY.freeMonthlyCredit)} of credit free every month, which is about ${freeLeadsPerMonth().toLocaleString()} leads at ${usd(APIFY.leadsPerThousand)} per 1,000`,
                },
                { label: "everything else", value: "nothing. connectors to drive and slack cost nothing." },
                { label: "monthly total", value: `${usd(PLANS.pro.monthly)}` },
              ]}
            />
            <Callout title="the free lead credit is bigger than it needs to be">
              <p>
                {freeLeadsPerMonth().toLocaleString()} leads a month is already
                more people than linkedin will let you send connection requests
                to. so for outreach specifically, the scraping is genuinely free
                and the whole system costs the plan. the full setup is on{" "}
                <a href="/claude-cowork-outreach">the outreach page</a>.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="when pro is not enough">
            <p>
              the honest signal to upgrade is not a feature you want. it is a
              task stopping halfway. Max buys usage, not capability: the same
              cowork, the same connectors, the same browser, with five or twenty
              times the headroom, higher output limits, priority at busy times
              and early access to new features.
            </p>
            <p>you are ready for Max when:</p>
            <ul>
              <li>a scheduled task regularly fails to finish inside your limit</li>
              <li>
                you run several sub agents in parallel most days, which multiplies
                usage rather than adding to it
              </li>
              <li>
                you are working through folders of documents rather than single
                files
              </li>
            </ul>
            <p>
              you are not ready for Max because you would like it to be faster.
              that is not what the tier does.
            </p>
          </GuideSection>

          <GuideSection title="the api is not a cheaper cowork">
            <p>
              a question i get often: can i skip the subscription and pay per
              token instead? for cowork, no. the api sells you model access, not
              the app, the connectors, the scheduler or the browser. there is no
              pay-as-you-go cowork.
            </p>
            <p>
              the rates are still worth knowing, because they are what
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
              caption={`per million tokens, ${PRICING_CHECKED}. batch processing halves it. prompt caching is the lever that matters: reading from cache costs a fraction of writing to it, which is why a long-running agent is cheaper than the raw input rate suggests.`}
            />
            <p>
              for the same question about claude code, where the api genuinely
              is an alternative to the subscription, see{" "}
              <a href="/claude-code-pricing">claude code pricing</a>. and for
              what cowork actually does with the money, see{" "}
              <a href="/claude-cowork">the main cowork guide</a>.
            </p>
            <p className="text-silver-muted">
              prices above were read off{" "}
              <Out href="https://claude.com/pricing">anthropic&apos;s pricing page</Out>{" "}
              on {PRICING_CHECKED}. they change, and this page will be behind at
              some point. check the source before you commit to an annual plan.
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
