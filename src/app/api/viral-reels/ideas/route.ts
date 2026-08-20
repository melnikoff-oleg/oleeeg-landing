// POST /api/viral-reels/ideas -> a streamed, tool-using answer about what to film.
//
// Unlike /api/marketing-brain/chat, which retrieves once and then writes, this
// one runs an agent loop: the model decides what to look up, this route runs
// the lookup against the reel library, and the two go back and forth until the
// model has enough to answer. Web search and web fetch are Anthropic's own
// server tools and never come back here at all; only the three reel tools do.
//
// Everything streams as newline-delimited JSON so the page can show the steps
// while they happen. A 40-second silence with a spinner reads as broken; the
// same 40 seconds narrated as "reading the library, searching for X" does not.

import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, getClientIp } from "@/lib/marketing-brain/rate-limit";
import { buildIdeasPrompt } from "@/lib/reels/ideas-prompt";
import type { IdeasFrame, IdeasMessage } from "@/lib/reels/ideas-types";
import { REEL_TOOLS, runReelTool, TOOL_NAMES } from "@/lib/reels/tools";
import type { ReelRow } from "@/lib/reels/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// An answer here is several model turns plus several database reads, not one
// completion. The loop also enforces its own wall clock below, well inside this,
// so the function is never the thing that decides where the answer stops.
export const maxDuration = 300;

const MODEL = "claude-sonnet-5";
/**
 * How many times the model may stop, call tools and be given the results.
 *
 * Six covers the intended shape with room to spare: overview, a same-niche
 * search, a cross-niche search, a couple of corrections, then the answer. It is
 * a backstop against a loop, not a budget the model is meant to spend.
 */
const MAX_ROUNDS = 6;
/**
 * How many times a long server-tool turn may be resumed.
 *
 * Anthropic pauses a turn that spends a while in web search and returns
 * `stop_reason: "pause_turn"` with the work so far, expecting the same content
 * handed straight back. Treating that as the end of the answer was silently
 * dropping the whole turn, and the visitor got a blank reply. Resumes do not
 * count against MAX_ROUNDS, because no tool result came back to this route, but
 * they are capped so a pathological pause loop still terminates.
 */
const MAX_PAUSES = 4;
/** Stop starting new rounds after this. Leaves the platform limit as headroom
 *  for the last round to finish writing rather than being cut mid-sentence. */
const WALL_CLOCK_MS = 210_000;
// Generous, because the intended answer is ten ideas of four lines each plus
// ten citations, and `thinking: adaptive` spends from the same budget. At 8000
// a full answer could be cut mid-sentence, which is the one failure the visitor
// cannot tell apart from a finished answer.
const MAX_TOKENS = 16000;
/** Server tools are billed per use, so they get an explicit ceiling. */
const MAX_WEB_SEARCHES = 5;
const MAX_WEB_FETCHES = 3;

// Tighter than the marketing brain's 30: every question here is a handful of
// Sonnet turns plus web search, which is the most expensive thing on the site.
const DAILY_LIMIT = 20;
const LIMIT_MESSAGE =
  "you've used today's 20 questions. if you want more, reach out on linkedin (linkedin.com/in/olegane).";

const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 6000;

const LOCAL_TOOLS = new Set<string>(TOOL_NAMES);

/**
 * Turn an upstream failure into something the visitor can act on.
 *
 * "something broke" is the right message for a bug and the wrong one for the
 * two failures that actually happen: the account running out of credit, and the
 * model being briefly overloaded. Both look identical from the browser and only
 * one of them is worth retrying, so they are named.
 */
function friendlyError(err: unknown): string {
  const status = (err as { status?: number } | null)?.status;
  const text = err instanceof Error ? err.message : String(err);
  if (/credit balance/i.test(text)) {
    return "the ideas chat is out of credit right now. the search and the library still work.";
  }
  if (status === 401 || status === 403) {
    return "the ideas chat isn't authorised right now. the search and the library still work.";
  }
  if (status === 429 || status === 529 || status === 503) {
    return "the model is busy at the moment. give it a minute and ask again.";
  }
  return "something broke on the way to the library. try again in a moment.";
}

/** The step line the page shows while a tool runs. */
function describe(name: string, input: unknown): string {
  const arg = (key: string): string | undefined => {
    if (!input || typeof input !== "object") return undefined;
    const v = (input as Record<string, unknown>)[key];
    if (typeof v === "string" && v.trim()) return v.trim().slice(0, 80);
    if (Array.isArray(v) && v.length) return v.slice(0, 3).join(", ").slice(0, 80);
    return undefined;
  };
  if (name === "library_overview") return "reading the library";
  if (name === "search_reels") {
    const q = arg("query");
    return q ? `searching the library for ${q}` : "searching the library";
  }
  if (name === "top_reels") {
    const t = arg("tags");
    return t ? `pulling the top reels tagged ${t}` : "pulling the top reels";
  }
  if (name === "web_search") {
    const q = arg("query");
    return q ? `searching the web for ${q}` : "searching the web";
  }
  if (name === "web_fetch") {
    const u = arg("url");
    return u ? `reading ${u}` : "reading a page";
  }
  return name.replace(/_/g, " ");
}

export async function POST(req: Request) {
  let messages: IdeasMessage[];
  try {
    const body = await req.json();
    // The ChatMessage type is compile-time only, so the shape is checked here:
    // drop anything that is not a well-formed user/assistant turn, clamp each
    // one, and keep only the most recent, so a caller cannot drive unbounded
    // input cost or forge a system turn.
    const raw = Array.isArray(body?.messages) ? body.messages : [];
    messages = raw
      .filter(
        (m: unknown): m is IdeasMessage =>
          !!m &&
          typeof (m as IdeasMessage).content === "string" &&
          ((m as IdeasMessage).role === "user" ||
            (m as IdeasMessage).role === "assistant"),
      )
      .slice(-MAX_MESSAGES)
      .map((m: IdeasMessage) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_CHARS),
      }))
      .filter((m: IdeasMessage) => m.content.trim());
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  if (!messages.some((m) => m.role === "user")) {
    return Response.json({ error: "empty" }, { status: 400 });
  }
  // The Messages API rejects a conversation that does not start with a user
  // turn, which the clamp above can produce by cutting one off the front.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const { allowed } = checkRateLimit(getClientIp(req), {
    bucket: "reel-ideas",
    limit: DAILY_LIMIT,
  });
  if (!allowed) {
    return Response.json(
      { error: "rate_limit", message: LIMIT_MESSAGE, limit: DAILY_LIMIT },
      { status: 429 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }
  const client = new Anthropic();

  const encoder = new TextEncoder();
  const send = (
    controller: ReadableStreamDefaultController,
    frame: IdeasFrame,
  ) => {
    try {
      controller.enqueue(encoder.encode(JSON.stringify(frame) + "\n"));
    } catch {
      /* controller already closed: the visitor navigated away */
    }
  };

  const stream = new ReadableStream({
    async start(controller) {
      const started = Date.now();
      // One reel is often cited by two ideas; the browser only needs it once.
      const sent = new Set<string>();
      const history: Anthropic.MessageParam[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const sendReels = (reels: ReelRow[]) => {
        const fresh = reels.filter((r) => r.shortcode && !sent.has(r.shortcode));
        if (!fresh.length) return;
        for (const r of fresh) sent.add(r.shortcode);
        send(controller, { type: "reels", reels: fresh });
      };

      try {
        let stopReason = "end_turn";
        let pauses = 0;

        for (let round = 0; round < MAX_ROUNDS; round += 1) {
          const llm = client.messages.stream(
            {
              model: MODEL,
              max_tokens: MAX_TOKENS,
              thinking: { type: "adaptive" },
              system: buildIdeasPrompt(),
              tools: [
                ...REEL_TOOLS,
                {
                  type: "web_search_20260209",
                  name: "web_search",
                  max_uses: MAX_WEB_SEARCHES,
                },
                {
                  type: "web_fetch_20260309",
                  name: "web_fetch",
                  max_uses: MAX_WEB_FETCHES,
                },
              ],
              messages: history,
            },
            { signal: req.signal },
          );

          for await (const event of llm) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              send(controller, { type: "delta", text: event.delta.text });
            } else if (
              event.type === "content_block_start" &&
              (event.content_block.type === "tool_use" ||
                event.content_block.type === "server_tool_use")
            ) {
              // Input streams in as a partial JSON delta, so at this point the
              // arguments are not known yet. The label is refined below, once
              // the block is complete; this first one just proves it is working.
              send(controller, {
                type: "tool",
                activity: {
                  id: event.content_block.id,
                  label: describe(event.content_block.name, null),
                },
              });
            }
          }

          const final = await llm.finalMessage();
          stopReason = final.stop_reason ?? "end_turn";

          if (final.stop_reason === "refusal") {
            send(controller, {
              type: "error",
              message: "i can't answer that one. try describing the brand differently.",
            });
            break;
          }

          // The whole assistant turn goes back verbatim, thinking blocks and
          // all. Dropping them breaks the signature check on the next request.
          history.push({ role: "assistant", content: final.content });

          // A paused server-tool turn carries no client tool_use block, so the
          // loop below would read it as "the model has finished" and throw the
          // whole turn away. Hand the content straight back instead.
          if (final.stop_reason === "pause_turn" && pauses < MAX_PAUSES) {
            pauses += 1;
            round -= 1;
            continue;
          }

          // Every client-side tool_use block, not just the ones we recognise.
          // A block left without a result would make the next request invalid,
          // so an unknown name gets an error result rather than silence.
          const calls = final.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
          );
          if (final.stop_reason !== "tool_use" || !calls.length) break;

          // Now the arguments are known, so the step line can name them.
          for (const call of calls) {
            send(controller, {
              type: "tool",
              activity: { id: call.id, label: describe(call.name, call.input) },
            });
          }

          // Run them together: two searches are two independent reads, and the
          // model regularly asks for both halves of the answer at once.
          const results = await Promise.all(
            calls.map(async (call) => {
              if (!LOCAL_TOOLS.has(call.name)) {
                return {
                  type: "tool_result" as const,
                  tool_use_id: call.id,
                  is_error: true,
                  content: `There is no tool called ${call.name}. The tools you have are: ${[...LOCAL_TOOLS].join(", ")}, web_search and web_fetch.`,
                };
              }
              try {
                const outcome = await runReelTool(
                  call.name,
                  call.input,
                  req.signal,
                );
                sendReels(outcome.reels);
                return {
                  type: "tool_result" as const,
                  tool_use_id: call.id,
                  content: JSON.stringify(outcome.forModel),
                };
              } catch (err) {
                // Handed back as a result rather than thrown: the model can
                // retry with different arguments, and a dead database should
                // degrade the answer, not delete it.
                console.error("[reel-ideas] tool failed", call.name, err);
                return {
                  type: "tool_result" as const,
                  tool_use_id: call.id,
                  is_error: true,
                  content: `${call.name} failed. Answer from what you already have, and tell the user that part of the library was unreachable.`,
                };
              }
            }),
          );
          history.push({ role: "user", content: results });

          if (Date.now() - started > WALL_CLOCK_MS) {
            stopReason = "timeout";
            break;
          }
        }

        // Every way of stopping that is not a finished answer gets said out
        // loud. Silence here is the worst outcome the feature has: a half
        // answer with no banner reads exactly like a whole one, and the visitor
        // acts on ideas that were cut off mid-list.
        const INCOMPLETE: Record<string, string> = {
          tool_use:
            "i spent all my research steps on that one without landing an answer. try narrowing it down, or ask for one kind of idea at a time.",
          max_tokens:
            "that answer hit its length limit and stops mid-way. ask for fewer ideas, or ask again for just the half you want.",
          pause_turn:
            "that one spent too long on the web and stopped early. try again, or tell me about the brand yourself instead of giving me a link.",
          timeout:
            "this one took too long to research. try asking for fewer ideas, or narrow the brand down.",
        };
        const notice = INCOMPLETE[stopReason];
        if (notice) send(controller, { type: "notice", message: notice });

        send(controller, { type: "done", reason: stopReason });
      } catch (err) {
        // An aborted request is the visitor leaving, which is normal teardown.
        if (!req.signal.aborted) {
          console.error("[reel-ideas] failed", err);
          send(controller, { type: "error", message: friendlyError(err) });
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
