import { ResourcePageShell } from "@/components/resource-page-shell";
import { DOWNLOAD_ICON } from "@/components/repo-cta";
import {
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
// "claude code price" 27,100/SD 26, "claude code prices" 22,200/SD 25,
// "claude code subscription" 18,100/SD 35, "claude code cost" 4,400,
// "is claude code free" 3,600/SD 29, "claude code max" 2,400/SD 20,
// "how much does claude code cost" 1,600/SD 12.

const steps = [
  {
    title: "the short answer",
    content: (
      <div className="space-y-3">
        <p>
          claude code is included in every paid claude plan. Pro at{" "}
          {usd(PLANS.pro.monthly)} a month is the cheapest. there is no separate
          claude code subscription and no free tier.
        </p>
      </div>
    ),
  },
  {
    title: "or pay per token instead",
    content: (
      <div className="space-y-3">
        <p>
          you can run it against an api key and pay only for what you use. that
          is the better deal below roughly an hour a day, and much worse above
          it.
        </p>
      </div>
    ),
  },
  {
    title: "check what you are spending",
    content: (
      <div className="space-y-3">
        <p>
          type <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-[0.9em] text-silver">/usage</code>{" "}
          inside claude code. subscribers see plan usage bars, api users see the
          session cost.
        </p>
      </div>
    ),
  },
];

const SECTIONS = [
  "is claude code free",
  "the plans, side by side",
  "the api route, and when it is cheaper",
  "what people actually spend",
  "the four things that drive the bill",
  "how to spend less without working slower",
];

const faq = [
  {
    q: "is claude code free",
    a: "No. Claude Code needs a paid Claude plan or an API account with credit on it. The free claude.ai plan does not include it, which is why it can install perfectly and still refuse to sign you in. The cheapest way in is Pro at $20 a month, which also includes Claude Cowork.",
  },
  {
    q: "how much does claude code cost",
    a: "$20 a month on Pro, or $17 a month paid annually. Max is from $100 a month for five or twenty times the usage. Team is $25 per seat monthly or $20 annually. On the API instead of a plan you pay per token: Sonnet 5 is $2 per million input tokens and $10 per million output, Opus 5 is $5 and $25.",
  },
  {
    q: "is claude code included in claude pro",
    a: "Yes. One Pro plan at $20 a month includes Claude Code, Claude Cowork, Claude Design and Claude Science. There is no separate purchase and no add-on fee. Usage is what differs between plans, not which products you get.",
  },
  {
    q: "do i need claude max for claude code",
    a: "Only if you hit Pro's usage limits, which happens if you run it most of the working day or run several instances at once. Max buys five or twenty times the usage, higher output limits and priority at busy times. It buys no extra features, so upgrading before you have hit a limit is spending money on nothing.",
  },
  {
    q: "is the api cheaper than a subscription for claude code",
    a: "Below about an hour of daily use, usually yes, because you pay only for the tokens you actually spend. Above that it is usually worse: Anthropic's own figures put the average enterprise developer at around $13 per active day, which is more than $20 a month within two days. The subscription is a cap, the API is a meter.",
  },
  {
    q: "how much do developers actually spend on claude code",
    a: "Anthropic publishes this: across enterprise deployments the average is about $13 per developer per active day and $150 to $250 per developer per month, with 90% of users staying under $30 per active day. That is API-billed usage. On a Pro or Max subscription the same work is capped at the plan price.",
  },
  {
    q: "what is the cheapest way to run claude code",
    a: "Pro billed annually at $17 a month, and then keeping your context small. The biggest lever is not the plan, it is how much you send: a focused session on the three files that matter costs a fraction of one where the model has read the whole repository, and picking Sonnet over Opus for routine work cuts the rate by more than half.",
  },
];

export default function ClaudeCodePricingPage() {
  return (
    <ResourcePageShell
      slug="claude-code-pricing"
      repoCta={{
        href: "https://claude.com/claude-code",
        label: "get claude code",
        icon: DOWNLOAD_ICON,
      }}
      eyebrow="claude code pricing"
      title="what claude code actually costs"
      subhead={`it is not free, it is included in every paid plan from ${usd(PLANS.pro.monthly)} a month, and you can pay per token instead. here is every route, what real usage costs, and the four things that decide your bill.`}
      steps={steps}
      troubleshooting={["costs", "creditBalance"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Pricing", path: "/claude-code-pricing" },
      ]}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="is claude code free">
            <p>
              <strong>no.</strong> claude code needs either a paid claude plan or
              an api account with credit on it. the free claude.ai account does
              not include it.
            </p>
            <p>
              this catches almost everyone once, because the install works
              perfectly and then the sign-in refuses you. nothing is broken. the
              plan is the missing piece.
            </p>
            <p>there are exactly two ways to pay for it:</p>
            <ul>
              <li>
                <strong>a subscription</strong>, from {usd(PLANS.pro.monthly)} a
                month, which is a cap: you cannot get a surprise bill, you can
                only run out.
              </li>
              <li>
                <strong>an api key</strong>, billed per token, which is a meter:
                you pay for exactly what you use and there is no ceiling.
              </li>
            </ul>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="the plans, side by side">
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
                    `${usd(PLANS.pro.annualMonthly)} (${usd(PLANS.pro.annualUpfront)} up front)`,
                    "same",
                    `${usd(PLANS.teamStandard.annualMonthly)} per seat`,
                  ],
                },
                { label: "claude code", cells: ["no", "yes", "yes", "yes"] },
                { label: "claude cowork", cells: ["no", "yes", "yes", "yes"] },
                {
                  label: "usage",
                  cells: [
                    "none",
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
                  label: "surprise bill possible",
                  cells: ["no", "no", "no", "no"],
                },
              ]}
              caption={`read off anthropic's pricing page on ${PRICING_CHECKED}.`}
            />
            <p>
              enterprise is {usd(PLANS.enterprise.seatMonthly)} per seat plus
              usage at api rates, which makes it the one plan where the bill can
              move.
            </p>
            <Callout title="the thing most comparisons miss">
              <p>
                {usd(PLANS.pro.monthly)} does not buy claude code. it buys claude
                code, <a href="/claude-cowork">claude cowork</a>, claude design
                and claude science on one plan. compared against a single coding
                assistant subscription it looks like a normal price. compared
                against buying a terminal agent and an office agent separately,
                it is one bill instead of two.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="the api route, and when it is cheaper">
            <p>
              instead of a plan you can point claude code at an api key from the
              claude console and pay per token. same product, different meter.
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
              caption={`dollars per million tokens, ${PRICING_CHECKED}. batch processing takes ${API_MODIFIERS.batchDiscount * 100}% off. us-only inference is ${API_MODIFIERS.usOnlyMultiplier}x. fast mode on Opus 5 is ${API_MODIFIERS.fastModeMultiplier}x for up to 2.5x the speed.`}
            />
            <p>
              the number that decides it for you is the cache read rate.
              {" "}<Code>{usd(API_RATES[2].cacheRead)}</Code> per million tokens
              on Sonnet 5, against {usd(API_RATES[2].input)} for fresh input.
              that is why a long session costs far less than the raw input rate
              suggests: after the first pass, most of what claude re-reads is
              coming out of cache.
            </p>
            <KeyFacts
              rows={[
                {
                  label: "api is cheaper when",
                  value: "you use it in bursts, a few times a week, on small focused tasks",
                },
                {
                  label: "subscription is cheaper when",
                  value: "you use it most working days, or run more than one instance",
                },
                {
                  label: "the crossover",
                  value: `roughly an hour of real use a day. anthropic's own average of $13 per active day passes ${usd(PLANS.pro.monthly)} in under two days.`,
                },
                {
                  label: "the other difference",
                  value: "a plan cannot surprise you. an api key can, so set a spend limit in the console on day one.",
                },
              ]}
            />
          </GuideSection>

          <GuideSection title="what people actually spend">
            <p>
              anthropic publishes real numbers for this in their own cost docs,
              which is unusual and worth quoting exactly:
            </p>
            <KeyFacts
              rows={[
                { label: "average per developer, per active day", value: "about $13" },
                { label: "average per developer, per month", value: "$150 to $250" },
                { label: "90% of users stay under", value: "$30 per active day" },
              ]}
              caption="from code.claude.com/docs/en/costs, read on 2026-08-27. these are API-billed enterprise deployments, not subscription users."
            />
            <p>
              read that next to {usd(PLANS.pro.monthly)} and the case for a
              subscription makes itself. those figures are what the same work
              costs when it is metered. on Pro or Max the same usage is capped
              at the plan price, and the only thing you can run out of is
              headroom.
            </p>
            <p>
              my own use, running marketing systems rather than a codebase, sits
              well inside Pro. the sessions are shorter and the context is
              smaller than a developer working in a large repository all day.
            </p>
          </GuideSection>

          <GuideSection title="the four things that drive the bill">
            <p>
              if you are on the api, or hitting limits on a plan, it is almost
              always one of these four. in order of how much they matter:
            </p>
            <ol className="guide-list">
              <li>
                <strong>how much context you send.</strong> the single biggest
                lever, and the one people ignore. a session pointed at three
                files costs a fraction of one where claude has read the whole
                repository. this is what <Code>/clear</Code> is for.
              </li>
              <li>
                <strong>which model you pick.</strong> Sonnet 5 is{" "}
                {usd(API_RATES[2].input)} in and {usd(API_RATES[2].output)} out.
                Opus 5 is {usd(API_RATES[1].input)} and {usd(API_RATES[1].output)}
                . that is more than double for work where the cheaper model was
                already right.
              </li>
              <li>
                <strong>how long the session runs.</strong> usage climbs through
                a long session because the conversation itself becomes input on
                every turn. starting fresh on a new task is cheaper than
                continuing.
              </li>
              <li>
                <strong>how many instances you run.</strong> sub agents and
                parallel sessions multiply usage rather than adding to it. this
                is the usual reason a Pro plan suddenly is not enough.
              </li>
            </ol>
          </GuideSection>

          <GuideSection title="how to spend less without working slower">
            <p>
              the ones that made a real difference to me, roughly in order of
              effect:
            </p>
            <ul>
              <li>
                <strong>run <Code>/usage</Code> once a week.</strong> it shows
                plan usage bars for subscribers and session cost for api users.
                you cannot manage what you have not looked at.
              </li>
              <li>
                <strong>clear between tasks.</strong> <Code>/clear</Code> when
                you move to something unrelated. carrying an old conversation
                into a new problem costs money on every turn and makes the
                answers worse.
              </li>
              <li>
                <strong>name the files.</strong> telling it which three files to
                look at beats letting it search, twice over: cheaper and more
                accurate.
              </li>
              <li>
                <strong>use the smaller model for routine work.</strong> most
                editing, renaming and boilerplate does not need the top model.
              </li>
              <li>
                <strong>put standing instructions in a skill, not in every
                prompt.</strong> anything you paste more than twice belongs
                somewhere it is loaded once.
              </li>
              <li>
                <strong>set a spend limit on day one if you are on the
                api.</strong> the console supports it and it is the difference
                between a bad afternoon and a bad month.
              </li>
            </ul>
            <Block>{`/usage     see what this session and this month cost
/clear     start fresh between unrelated tasks
/model     switch to a cheaper model for routine work`}</Block>
            <p>
              if you have not set it up yet, start with{" "}
              <a href="/claude-code-tutorial">the claude code guide</a>. if you
              are deciding between claude code and something else, the{" "}
              <a href="/claude-code-vs-cursor">comparison page</a> covers what
              you actually get for the money in each.
            </p>
            <p className="text-silver-muted">
              every price on this page was read off{" "}
              <Out href="https://claude.com/pricing">anthropic&apos;s pricing page</Out>{" "}
              and{" "}
              <Out href="https://code.claude.com/docs/en/costs">their cost docs</Out>{" "}
              on {PRICING_CHECKED}. they change, and this page will fall behind
              at some point. check the source before committing to a year.
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
