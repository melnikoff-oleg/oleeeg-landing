import { test, expect } from "@playwright/test";

/**
 * Tests 40-44: hero call-to-action.
 *
 * Plausible (3-month window) showed pages that surface their primary action in
 * the hero convert far better than pages that bury it. The mobile-optimization
 * pass added a hero `RepoCta` to the repo-backed pages; this spec guards that,
 * and locks in the two non-repo pages the same analysis flagged as leaks
 * (/claude-cowork-outreach, 79% bounce & #2 by volume; /claude-social-growth,
 * which converted 232 visitors at 0.4% with no hero action at all) now carrying
 * an above-the-fold download CTA that sits before the video.
 */

type Spec = {
  route: string;
  href: RegExp;
  label?: RegExp;
  /** Pages whose source video is private ship no facade; the CTA must instead
      sit above the setup guide. */
  hasVideo?: boolean;
};

const SPECS: Spec[] = [
  { route: "/claude-reels", href: /github\.com\/melnikoff-oleg\/social-media/, label: /github/i },
  { route: "/claude-tiktok", href: /github\.com\/melnikoff-oleg\/tiktok-ai/, label: /github/i },
  // The Ads Studio video went private before 2026-08-27, so the page ships no
  // facade any more and the CTA is checked against the setup guide instead.
  { route: "/ads-ai", href: /github\.com\/melnikoff-oleg\/ads-ai/, label: /github/i, hasVideo: false },
  { route: "/claude-cowork-outreach", href: /claude\.com\/download/, label: /download claude cowork/i },
  { route: "/claude-social-growth", href: /claude\.com\/claude-code/, label: /get claude code/i },
  { route: "/claude-code-instagram", href: /github\.com\/melnikoff-oleg\/reel-studio/, label: /github/i },
  { route: "/claude-twitter", href: /github\.com\/melnikoff-oleg\/x-ai/, label: /github/i },
  // Mobile-optimize pass: the fold hands over the promised asset everywhere.
  { route: "/claude-content", href: /drive\.google\.com/, label: /get the project files/i },
  { route: "/claude-b2b-outreach", href: /skool\.com\/ai-automation-7100/, label: /get the source code/i },
  // /claude-trend-scanner and /claude-website were consolidated into
  // /claude-social-growth and /high-converting-website on 2026-08-27 (see
  // seo/2026-08-27-strategy.md); they are redirects now, not pages.
];

for (const spec of SPECS) {
  test(`hero CTA sits above the ${spec.hasVideo === false ? "setup guide" : "video"} on ${spec.route}`, async ({ page }) => {
    await page.goto(spec.route, { waitUntil: "domcontentloaded" });

    // The hero CTA is the first external button-link inside <main>.
    const cta = page.locator("main a[target='_blank']").first();
    await expect(cta, `${spec.route} hero CTA visible`).toBeVisible();
    expect(await cta.getAttribute("href"), `${spec.route} href`).toMatch(spec.href);
    if (spec.label) await expect(cta).toContainText(spec.label);

    // It must appear above the video facade (or, on the video-less pages, above
    // the setup guide) so a skimmer meets the action first.
    const below =
      spec.hasVideo === false
        ? page.getByText("setup guide", { exact: false }).first()
        : page.getByTestId("youtube-facade").first();
    const ctaBox = await cta.boundingBox();
    const belowBox = await below.boundingBox();
    expect(ctaBox, `${spec.route} cta box`).not.toBeNull();
    expect(belowBox, `${spec.route} below-section box`).not.toBeNull();
    expect(
      ctaBox!.y,
      `${spec.route} hero CTA should sit above it`
    ).toBeLessThan(belowBox!.y);
  });
}
