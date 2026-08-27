import { test } from "node:test";
import assert from "node:assert/strict";
import { PLANS, API_RATES, freeLeadsPerMonth, usd } from "@/lib/pricing";

test("pro is the plan that unlocks both claude code and cowork", () => {
  // Nine pages used to say $19 and the rest said $20. One number, one place.
  assert.equal(PLANS.pro.monthly, 20);
  assert.equal(PLANS.pro.annualMonthly, 17);
  assert.equal(PLANS.pro.annualUpfront, 200);
});

test("annual is cheaper than monthly on every plan that offers both", () => {
  for (const plan of [PLANS.pro, PLANS.teamStandard, PLANS.teamPremium]) {
    assert.ok(
      plan.annualMonthly < plan.monthly,
      `${plan.name}: annual ${plan.annualMonthly} is not below monthly ${plan.monthly}`,
    );
  }
});

test("api rates cost more to write to cache than to read from it", () => {
  // If this ever inverts it is a transcription error, not a price change.
  for (const r of API_RATES) {
    assert.ok(r.cacheWrite > r.cacheRead, `${r.model} cache rates inverted`);
    assert.ok(r.output > r.input, `${r.model} output should cost more than input`);
  }
});

test("the free apify credit is quoted as 3,000 leads, not 5,000", () => {
  // The live page repeated a figure Oleg corrects on camera in the same video.
  assert.equal(freeLeadsPerMonth(), 3000);
});

test("money reads the way a person writes it", () => {
  assert.equal(usd(20), "$20");
  assert.equal(usd(1.5), "$1.50");
  assert.equal(usd(0.5), "$0.50");
});
