// Anthropic's published prices, in one place.
//
// Every pricing page, every "what does it cost" answer and every FAQ reads from
// here. Before this existed the site quoted $19 on nine pages and $20 on the
// rest, because each page had its own copy of the number. A price is a fact
// with an expiry date: keeping one copy means updating it is a one-line change
// rather than a hunt.
//
// Source: https://claude.com/pricing, read 2026-08-27. Re-check before
// re-promoting any page that quotes these.

export const PRICING_CHECKED = "2026-08-27";

/** Consumer and team plans. Monthly is the headline number people search for. */
export const PLANS = {
  free: { name: "Free", monthly: 0, annualMonthly: 0 },
  /** Pro is the entry point for Claude Code AND Claude Cowork. */
  pro: { name: "Pro", monthly: 20, annualMonthly: 17, annualUpfront: 200 },
  /**
   * Max is a range, and Anthropic publishes only the floor. Their pricing page
   * says "From $100 / per month" and "choose 5x or 20x more usage than Pro",
   * and does not name the price of the higher tier anywhere public. So the site
   * says "from $100" and does not invent the rest: a $200 figure was on 16
   * pages via the troubleshooting copy and is not something Anthropic states.
   */
  max: { name: "Max", monthlyFrom: 100, tiers: ["5x", "20x"] },
  teamStandard: { name: "Team standard seat", monthly: 25, annualMonthly: 20 },
  teamPremium: { name: "Team premium seat", monthly: 125, annualMonthly: 100 },
  /** Enterprise bills a seat plus usage at API rates. */
  enterprise: { name: "Enterprise", seatMonthly: 20 },
} as const;

/** API rates, dollars per million tokens. What you pay if you skip the plans. */
export const API_RATES = [
  { model: "Fable 5", input: 10, output: 50, cacheWrite: 12.5, cacheRead: 1 },
  { model: "Opus 5", input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 },
  { model: "Sonnet 5", input: 2, output: 10, cacheWrite: 2.5, cacheRead: 0.2 },
  { model: "Haiku 4.5", input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
] as const;

/** Discounts and surcharges that change the effective rate. */
export const API_MODIFIERS = {
  batchDiscount: 0.5,
  usOnlyMultiplier: 1.1,
  fastModeMultiplier: 2,
} as const;

/** Apify, where the outreach and research pipelines get their leads. */
export const APIFY = {
  freeMonthlyCredit: 5,
  /** A typical Apollo-style B2B scraper, dollars per 1,000 results. */
  leadsPerThousand: 1.5,
} as const;

/** How many leads the free Apify credit buys, rounded to something sayable. */
export function freeLeadsPerMonth(): number {
  return Math.round(APIFY.freeMonthlyCredit / APIFY.leadsPerThousand) * 1000;
}

/** "$20" / "$17" / "$1.50", never "$20.00" and never a bare number. */
export function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}
