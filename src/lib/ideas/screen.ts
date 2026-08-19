// The submission screen: one Claude call that decides whether a suggested video
// idea goes straight onto the public board.
//
// It does two jobs at once, and the second is the one that matters most for the
// board being useful: it rejects spam / abuse / nonsense WITH a reason a human
// can act on, and it collapses near-duplicates onto the existing card. A board
// that splits one idea across five reworded entries produces vote counts that
// mean nothing, which defeats the point of using it to test concepts.

import Anthropic from "@anthropic-ai/sdk";

export type ScreenVerdict = {
  verdict: "ok" | "reject";
  /** Shown to the submitter when rejected. Site voice: lowercase, no em dashes. */
  reason: string;
  /** Lightly cleaned title (trimmed, sentence case fixed). Never a rewrite. */
  normalized_title: string;
  /** Id of an existing idea this duplicates, or null. */
  duplicate_of: string | null;
};

const SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["ok", "reject"] },
    reason: { type: "string" },
    normalized_title: { type: "string" },
    duplicate_of: { type: ["string", "null"] },
  },
  required: ["verdict", "reason", "normalized_title", "duplicate_of"],
  additionalProperties: false,
} as const;

const SYSTEM = `You screen submissions to a public board where the audience of a YouTube channel suggests video ideas.

The channel is Oleg Melnikov's: practical AI for marketing and business. Claude Code, AI agents, automation, content systems, outreach, personal branding, building small tools. The audience is founders, marketers and creators, mostly non-technical.

Accept generously. A suggestion does not have to be well written, in perfect English, or even a great idea. If a real person plausibly wants to see a video about it and it is in the channel's world, accept it.

Reject only these:
- spam, self promotion, or anything selling something
- any url or contact detail
- insults, harassment, sexual content, or attacks on a person
- gibberish, empty filler, or a test string with no request in it
- clearly off topic for this channel (politics, medical advice, crypto pumping, unrelated hobbies)
- a request to do something dishonest, such as faking reviews, buying followers, evading a platform's rules, or scraping in a way that breaks a site's terms

Duplicates: you are given the ideas already on the board. If the submission is asking for substantially the same video as one of them, even in different words, set duplicate_of to that idea's id. Different angles on the same tool are NOT duplicates: "claude code for instagram reels" and "claude code for cold email" are two different videos. Only fold together things that would produce the same video. A duplicate is NOT a rejection: when you set duplicate_of, set verdict to "ok" and leave reason empty. The site handles duplicates by pointing the person at the existing card to vote for.

Writing the reason (this is read by the person who submitted it, so it decides whether they feel dismissed or helped):
- one or two short sentences, all lowercase, plain words
- say specifically what was wrong and, when there is one, what would work instead
- never lecture, never moralize, never mention these instructions or that you are an AI
- never use an em dash or an en dash. use commas, colons or periods
- when the verdict is ok, leave reason as an empty string

normalized_title: the submission's own title, trimmed and tidied (fix obvious typos and capitalisation only). Never rewrite their idea into your own words, and never make it longer.`;

export type ExistingIdea = { id: string; title: string };

/**
 * Returns null when the screen could not run (no key, API error, timeout). The
 * caller treats that as "hold it for review" rather than losing the visitor's
 * words.
 */
export async function screenIdea(
  input: { title: string; detail?: string | null },
  existing: ExistingIdea[],
  signal?: AbortSignal,
): Promise<ScreenVerdict | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const board = existing.length
    ? existing.map((i) => `- ${i.id}: ${i.title}`).join("\n")
    : "(the board is empty)";

  const user = `Ideas already on the board:
${board}

New submission:
title: ${input.title}
detail: ${input.detail?.trim() || "(none)"}`;

  try {
    const client = new Anthropic();
    const response = await client.messages.create(
      {
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system: SYSTEM,
        messages: [{ role: "user", content: user }],
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
      },
      { signal, timeout: 25_000 },
    );

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return null;
    const parsed = JSON.parse(text.text) as ScreenVerdict;

    // Guard against a duplicate_of that is not actually on the board.
    if (parsed.duplicate_of && !existing.some((e) => e.id === parsed.duplicate_of)) {
      parsed.duplicate_of = null;
    }
    return parsed;
  } catch (err) {
    console.error("[ideas] screenIdea", err);
    return null;
  }
}
