import { ResourcePageShell } from "@/components/resource-page-shell";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
  Answer,
  Block,
  Callout,
  Code,
  CompareTable,
  Guide,
  GuideSection,
  GuideToc,
  KeyFacts,
  Out,
} from "@/components/guide";
import { API_MODIFIERS, API_RATES, PLANS, PRICING_CHECKED, usd } from "@/lib/pricing";

// The biggest single term on the site's map. Ubersuggest, US, 2026-08-27:
// "Claude Code price" 27,100/SD 26, "Claude Code prices" 22,200/SD 25,
// "Claude Code subscription" 18,100/SD 35, "Claude Code cost" 4,400,
// "Is Claude Code free" 3,600/SD 29, "Claude Code max" 2,400/SD 20,
// "How much does Claude Code cost" 1,600/SD 12.

const steps = [
  {
    title: "The short answer",
    content: (
      <div className="space-y-3">
        <p>
          Claude Code is included in every paid Claude plan. Pro at{" "}
          {usd(PLANS.pro.monthly)} a month is the cheapest. There is no separate
          Claude Code subscription and no free tier.
        </p>
      </div>
    ),
  },
  {
    title: "Or pay per token instead",
    content: (
      <div className="space-y-3">
        <p>
          You can run it against an API key and pay only for what you use. That
          is the better deal below roughly an hour a day, and much worse above
          it.
        </p>
      </div>
    ),
  },
  {
    title: "Check what you are spending",
    content: (
      <div className="space-y-3">
        <p>
          Type <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-[0.9em] text-silver">/usage</code>{" "}
          inside Claude Code. Subscribers see plan usage bars, API users see the
          session cost.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "Is Claude Code free",
  "The plans, side by side",
  "The API route, and when it is cheaper",
  "What people actually spend",
  "The four things that drive the bill",
  "How to spend less without working slower",
];

const faq = [
  {
    q: "Is Claude Code free",
    a: "No. Claude Code needs a paid Claude plan or an API account with credit on it. The free claude.ai plan does not include it, which is why it can install perfectly and still refuse to sign you in. The cheapest way in is Pro at $20 a month, which also includes Claude Cowork.",
  },
  {
    q: "How much does Claude Code cost",
    a: "$20 a month on Pro, or $17 a month paid annually. Max is from $100 a month for five or twenty times the usage. Team is $25 per seat monthly or $20 annually. On the API instead of a plan you pay per token: Sonnet 5 is $2 per million input tokens and $10 per million output, Opus 5 is $5 and $25.",
  },
  {
    q: "Is Claude Code included in Claude pro",
    a: "Yes. One Pro plan at $20 a month includes Claude Code, Claude Cowork, Claude Design and Claude Science. There is no separate purchase and no add-on fee. Usage is what differs between plans, not which products you get.",
  },
  {
    q: "Do I need Claude max for Claude Code",
    a: "Only if you hit Pro's usage limits, which happens if you run it most of the working day or run several instances at once. Max buys five or twenty times the usage, higher output limits and priority at busy times. It buys no extra features, so upgrading before you have hit a limit is spending money on nothing.",
  },
  {
    q: "Is the API cheaper than a subscription for Claude Code",
    a: "Below about an hour of daily use, usually yes, because you pay only for the tokens you actually spend. Above that it is usually worse: Anthropic's own figures put the average enterprise developer at around $13 per active day, which is more than $20 a month within two days. The subscription is a cap, the API is a meter.",
  },
  {
    q: "How much do developers actually spend on Claude Code",
    a: "Anthropic publishes this: across enterprise deployments the average is about $13 per developer per active day and $150 to $250 per developer per month, with 90% of users staying under $30 per active day. That is API-billed usage. On a Pro or Max subscription the same work is capped at the plan price.",
  },
  {
    q: "What is the cheapest way to run Claude Code",
    a: "Pro billed annually at $17 a month, and then keeping your context small. The biggest lever is not the plan, it is how much you send: a focused session on the three files that matter costs a fraction of one where the model has read the whole repository, and picking Sonnet over Opus for routine work cuts the rate by more than half.",
  },
];

export default function ClaudeCodePricingPage() {
  return (
    <ResourcePageShell
      slug="claude-code-pricing"
      repoCta={{
        href: "https://claude.com/claude-code",
        label: "Get Claude Code",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="Claude Code pricing"
      title="What Claude Code actually costs"
      subhead={`It is not free, it is included in every paid plan from ${usd(PLANS.pro.monthly)} a month, and you can pay per token instead. Here is every route, what real usage costs, and the four things that decide your bill.`}
      steps={steps}
      troubleshooting={["costs", "creditBalance"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Pricing", path: "/claude-code-pricing" },
      ]}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="Is Claude Code free">
            <Answer>
              <strong>No.</strong> Claude Code needs either a paid Claude plan or
              an API account with credit on it. The free claude.ai account does
              not include it.
            </Answer>
            <p>
              This catches almost everyone once, because the install works
              perfectly and then the sign-in refuses you. Nothing is broken. The
              plan is the missing piece.
            </p>
            <p>There are exactly two ways to pay for it:</p>
            <ul>
              <li>
                <strong>A subscription</strong>, from {usd(PLANS.pro.monthly)} a
                month, which is a cap: you cannot get a surprise bill, you can
                only run out.
              </li>
              <li>
                <strong>An API key</strong>, billed per token, which is a meter:
                you pay for exactly what you use and there is no ceiling.
              </li>
            </ul>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="The plans, side by side">
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
                    `${usd(PLANS.pro.annualMonthly)} (${usd(PLANS.pro.annualUpfront)} up front)`,
                    "same",
                    `${usd(PLANS.teamStandard.annualMonthly)} per seat`,
                  ],
                },
                { label: "Claude Code", cells: ["no", "yes", "yes", "yes"] },
                { label: "Claude Cowork", cells: ["no", "yes", "yes", "yes"] },
                {
                  label: "Usage",
                  cells: [
                    "none",
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
                  label: "Surprise bill possible",
                  cells: ["no", "no", "no", "no"],
                },
              ]}
              caption={`Read off Anthropic's pricing page on ${PRICING_CHECKED}.`}
            />
            <p>
              Enterprise is {usd(PLANS.enterprise.seatMonthly)} per seat plus
              usage at API rates, which makes it the one plan where the bill can
              move.
            </p>
            <Callout title="The thing most comparisons miss">
              <p>
                {usd(PLANS.pro.monthly)} does not buy Claude Code. It buys Claude Code, <a href="/claude-cowork">Claude Cowork</a>, Claude design
                and Claude science on one plan. Compared against a single coding
                assistant subscription it looks like a normal price. Compared
                against buying a terminal agent and an office agent separately,
                it is one bill instead of two.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="The API route, and when it is cheaper">
            <p>
              Instead of a plan you can point Claude Code at an API key from the
              Claude console and pay per token. Same product, different meter.
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
              caption={`Dollars per million tokens, ${PRICING_CHECKED}. Batch processing takes ${API_MODIFIERS.batchDiscount * 100}% off. Us-only inference is ${API_MODIFIERS.usOnlyMultiplier}x. Fast mode on Opus 5 is ${API_MODIFIERS.fastModeMultiplier}x for up to 2.5x the speed.`}
            />
            <p>
              The number that decides it for you is the cache read rate.
              {" "}<Code>{usd(API_RATES[2].cacheRead)}</Code> per million tokens
              on Sonnet 5, against {usd(API_RATES[2].input)} for fresh input.
              That is why a long session costs far less than the raw input rate
              suggests: after the first pass, most of what Claude re-reads is
              coming out of cache.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "Api is cheaper when",
                  value: "You use it in bursts, a few times a week, on small focused tasks",
                },
                {
                  label: "Subscription is cheaper when",
                  value: "You use it most working days, or run more than one instance",
                },
                {
                  label: "The crossover",
                  value: `Roughly an hour of real use a day. Anthropic's own average of $13 per active day passes ${usd(PLANS.pro.monthly)} in under two days.`,
                },
                {
                  label: "The other difference",
                  value: "A plan cannot surprise you. An API key can, so set a spend limit in the console on day one.",
                },
              ]}
            />
          </GuideSection>

          <GuideSection title="What people actually spend">
            <p>
              Anthropic publishes real numbers for this in their own cost docs,
              which is unusual and worth quoting exactly:
            </p>
            <KeyFacts
              rows={[
                { label: "Average per developer, per active day", value: "about $13" },
                { label: "Average per developer, per month", value: "$150 to $250" },
                { label: "90% of users stay under", value: "$30 per active day" },
              ]}
              caption="From code.Claude.com/docs/en/costs, read on 2026-08-27. These are API-billed enterprise deployments, not subscription users."
            />
            <p>
              Read that next to {usd(PLANS.pro.monthly)} and the case for a
              subscription makes itself. Those figures are what the same work
              costs when it is metered. On Pro or Max the same usage is capped
              at the plan price, and the only thing you can run out of is
              headroom.
            </p>
            <p>
              My own use, running marketing systems rather than a codebase, sits
              well inside Pro. The sessions are shorter and the context is
              smaller than a developer working in a large repository all day.
            </p>
          </GuideSection>

          <GuideSection title="The four things that drive the bill">
            <p>
              If you are on the API, or hitting limits on a plan, it is almost
              always one of these four. In order of how much they matter:
            </p>
            <ol className="guide-list">
              <li>
                <strong>How much context you send.</strong> The single biggest
                lever, and the one people ignore. A session pointed at three
                files costs a fraction of one where Claude has read the whole
                repository. This is what <Code>/clear</Code> is for.
              </li>
              <li>
                <strong>Which model you pick.</strong> Sonnet 5 is{" "}
                {usd(API_RATES[2].input)} in and {usd(API_RATES[2].output)} out.
                Opus 5 is {usd(API_RATES[1].input)} and {usd(API_RATES[1].output)}
                . That is more than double for work where the cheaper model was
                already right.
              </li>
              <li>
                <strong>How long the session runs.</strong> Usage climbs through
                a long session because the conversation itself becomes input on
                every turn. Starting fresh on a new task is cheaper than
                continuing.
              </li>
              <li>
                <strong>How many instances you run.</strong> Sub agents and
                parallel sessions multiply usage rather than adding to it. This
                is the usual reason a Pro plan suddenly is not enough.
              </li>
            </ol>
          </GuideSection>

          <GuideSection title="How to spend less without working slower">
            <p>
              The ones that made a real difference to me, roughly in order of
              effect:
            </p>
            <ul>
              <li>
                <strong>Run <Code>/usage</Code> once a week.</strong> It shows
                plan usage bars for subscribers and session cost for API users.
                You cannot manage what you have not looked at.
              </li>
              <li>
                <strong>Clear between tasks.</strong> <Code>/clear</Code> when
                you move to something unrelated. Carrying an old conversation
                into a new problem costs money on every turn and makes the
                answers worse.
              </li>
              <li>
                <strong>Name the files.</strong> Telling it which three files to
                look at beats letting it search, twice over: cheaper and more
                accurate.
              </li>
              <li>
                <strong>Use the smaller model for routine work.</strong> Most
                editing, renaming and boilerplate does not need the top model.
              </li>
              <li>
                <strong>Put standing instructions in a skill, not in every
                prompt.</strong> Anything you paste more than twice belongs
                somewhere it is loaded once.
              </li>
              <li>
                <strong>Set a spend limit on day one if you are on the
                API.</strong> The console supports it and it is the difference
                between a bad afternoon and a bad month.
              </li>
            </ul>
            <Block>{`/usage     see what this session and this month cost
/clear     start fresh between unrelated tasks
/model     switch to a cheaper model for routine work`}</Block>
            <p>
              If you have not set it up yet, start with{" "}
              <a href="/claude-code-tutorial">The Claude Code guide</a>. If you
              are deciding between Claude Code and something else, the{" "}
              <a href="/claude-code-vs-cursor">Comparison page</a> covers what
              you actually get for the money in each.
            </p>
            <p className="text-silver-muted">
              Every price on this page was read off{" "}
              <Out href="https://claude.com/pricing">anthropic&apos;s pricing page</Out>{" "}
              and{" "}
              <Out href="https://code.claude.com/docs/en/costs">their cost docs</Out>{" "}
              on {PRICING_CHECKED}. They change, and this page will fall behind
              at some point. Check the source before committing to a year.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "Claude Code pricing: every plan, the API route, and what people really spend",
        description:
          "Claude Code is not free. It is included in every paid Claude plan from $20 a month, or billed per token on the API. Every plan compared, Anthropic's own spend figures, and the four things that drive the bill.",
        url: "https://oleg.ae/claude-code-pricing",
        datePublished: "2026-08-27",
        dateModified: "2026-08-27",
      }}
      boldaneCredit
    />
  );
}
