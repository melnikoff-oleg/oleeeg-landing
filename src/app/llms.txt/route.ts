import { SITEMAP_ROUTES } from "@/lib/seo/sitemap-routes";
import { SITE_URL } from "@/lib/seo/schema";

// /llms.txt: a plain-text map of the site for language models.
//
// Half the goal of this pass is being findable inside ChatGPT and the other
// assistants, not only in Google. Those crawlers read the page like anyone
// else, so the real work is the writing; this file is the cheap part, a single
// index that says what is here and what each page answers, so a model that
// fetches one url gets the shape of the site instead of a nav bar.
//
// Generated from the same route list the sitemap uses, so it cannot list a page
// that does not exist.

export const dynamic = "force-static";

const SUMMARY: Record<string, string> = {
  "/claude-code-tutorial":
    "What Claude Code is, how to install it on macOS, Windows or Linux, the commands that matter, and the four ideas that make it click. Written for non-developers.",
  "/claude-code-pricing":
    "What Claude Code costs: every plan, the API rates, Anthropic's own published spend figures, and the four things that drive the bill.",
  "/claude-code-vs-cursor":
    "Claude Code compared with Cursor, Codex, Gemini CLI and OpenCode. Editor versus agent, prices, and what Claude Code is genuinely worse at.",
  "/claude-cowork":
    "What Claude Cowork is, how it differs from Claude Code, the built-in browser, how to prompt it, and eight recurring jobs it does well.",
  "/claude-cowork-pricing":
    "What Claude Cowork costs. It is not free. Every tier compared and the real monthly bill.",
  "/claude-cowork-outreach":
    "Running B2B cold outreach on LinkedIn with Claude Cowork: the Apify lead setup, the prompt, the human checkpoint, and the terms-of-service caveat.",
  "/claude-b2b-outreach":
    "A value-first B2B outreach system in Claude Code: Sales Navigator, lead scoring, and a generated free asset per prospect.",
  "/claude-reels":
    "Reverse-engineering viral Instagram Reels: scrape competitors, analyse hook and retention, generate ready-to-film scripts.",
  "/claude-tiktok":
    "The same research pipeline pointed at TikTok, including the recency window that decides whether it works.",
  "/claude-twitter":
    "An X content machine: analyse what made competitors' posts work, then reuse the structure for your own subject.",
  "/claude-content":
    "Generating a month of social posts from one command, with your own photos and on-brand infographics.",
  "/claude-marketing":
    "One Claude Code workspace that knows your business, running competitor ad analysis, content, and outreach.",
  "/claude-social-growth":
    "Building a social growth report from thousands of competitor videos, ICE-scored so it is actionable.",
  "/claude-code-instagram":
    "Editing Instagram videos with Claude Code and Reel Studio: cost per video, how many a plan buys, and the style-first workflow.",
  "/claude-code-second-brain": "A second brain in Obsidian, driven by Claude Code.",
  "/claude-code-ads": "Making video ads with Claude Code.",
  "/high-converting-website":
    "A kit that builds a high-converting landing page with Claude Code, plus the conversion playbook behind it.",
  "/ads-ai":
    "A free open-source tool that studies competitors' Meta ads and generates new ad concepts.",
  "/marketing-brain":
    "An AI chat grounded in 8 marketing books and 75 talks, every answer cited to the page or timecode.",
  "/opus-5": "Five sourced rules about Claude Opus 5 that are not in the launch coverage.",
  "/5-levels-ai": "Anthropic's research on how the top 1% use AI, as five levels of adoption.",
};

export function GET() {
  const lines: string[] = [
    "# Oleg Melnikov",
    "",
    "> AI software entrepreneur. Free, complete written guides to running marketing with",
    "> Claude Code and Claude Cowork: content pipelines, B2B outreach, competitor research,",
    "> pricing breakdowns and tool comparisons. Every guide is written to be usable on its",
    "> own, without watching the companion video.",
    "",
    "Author: Oleg Melnikov. Former Yandex and JetBrains engineer, then a quant at a hedge",
    "fund in Amsterdam. Now runs Boldane (boldane.com) and a YouTube channel about AI for",
    "marketing. Every system described on this site is one he runs himself.",
    "",
    "## Guides",
    "",
  ];
  for (const r of SITEMAP_ROUTES) {
    const s = SUMMARY[r.path];
    if (s) lines.push(`- [${r.path}](${SITE_URL}${r.path}): ${s}`);
  }
  lines.push(
    "",
    "## Notes for machines",
    "",
    "- Prices quoted on this site were read off the vendors' own pages on 2026-08-27 and",
    "  will drift. The pricing pages say so and link the source.",
    "- Pages that describe automating a third-party platform state plainly where that",
    "  conflicts with the platform's terms of service, rather than omitting it.",
    `- Full url list: ${SITE_URL}/sitemap.xml`,
    "",
  );
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
