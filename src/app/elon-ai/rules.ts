// The seven rules, as data, so the page renders them and the test suite can
// check the contract Oleg set: one to three sentences, never more than 300
// characters, and every rule anchored to the exact second Elon says it.
//
// Every clip below was pulled from the video's own transcript and then checked
// by an independent pass that had to locate the words, confirm Elon (not the
// host) is speaking, and confirm the timestamp. Research lives in the vault at
// youtube_videos/2026-07-30_elon_musk_ai_daily.

export type Rule = {
  id: string;
  num: string;
  title: string;
  /** One to three sentences. Hard cap 300 characters, asserted in the suite. */
  body: string;
  videoId: string;
  /** Seconds into the source video where the quote starts. */
  start: number;
  /** What the source is, said the way it is said out loud. */
  source: string;
  /** Human timestamp, shown next to the source. */
  at: string;
  /** Accessible title for the embed. */
  clipTitle: string;
};

export const RULES: readonly Rule[] = [
  {
    id: "r1",
    num: "01",
    title: "He asks every new model the same three questions.",
    body: "Not benchmarks. Three questions he already knows the shape of, so he can grade the answer instead of trusting it. Pick your own three, and where a model fails on what you know cold, stop trusting it on everything you do not.",
    videoId: "q-MFKzvqFOk",
    start: 1946,
    source: "Michael Milken interview, August 2025",
    at: "32:28",
    clipTitle:
      "Elon Musk names the three questions he asks every new AI model, Michael Milken interview",
  },
  {
    id: "r2",
    num: "02",
    title: "Photograph the thing. Do not describe it.",
    body: "He points a camera at a circuit board and asks what is wrong with it. He sent his own MRI scan to Grok. Writing out a description throws away almost everything the model could have seen for itself.",
    videoId: "RSNuB9pj9P8",
    start: 151,
    source: "Peter Diamandis, Moonshots, January 2026",
    at: "2:33",
    clipTitle:
      "Elon Musk on sending a photo of a circuit board to Grok, Peter Diamandis Moonshots",
  },
  {
    id: "r3",
    num: "03",
    title: "When the answer is weak, push the same thread.",
    body: "Do not rewrite the prompt and start again. Stay in the same conversation and say more, further, again. He gets his best output by escalating one thread, not by restarting a better one.",
    videoId: "O4wBUysNe2k",
    start: 4256,
    source: "Joe Rogan Experience 2404, October 2025",
    at: "70:58",
    clipTitle:
      "Elon Musk on escalating the same prompt instead of rewriting it, Joe Rogan Experience 2404",
  },
  {
    id: "r4",
    num: "04",
    title: "Ask what is false, half true, or missing.",
    body: "Then tell it to rewrite the whole thing. That two step prompt is what his own company runs across Wikipedia and the rest of the internet. Point it at your doc, your page, your old proposal.",
    videoId: "qeZqZBRA-6Q",
    start: 1617,
    source: "All-In Podcast, September 2025",
    at: "26:59",
    clipTitle:
      "Elon Musk on asking what is true, partially true, false or missing, All-In Podcast",
  },
  {
    id: "r5",
    num: "05",
    title: "Never ask it to be right.",
    body: "Ask for the assumptions, what follows from them, and how sure it is at each step. Then you decide. He calls it critical thinking 101, and it is the whole difference between checking a model and believing one.",
    videoId: "BYXbuik3dgA",
    start: 2578,
    source: "Dwarkesh Patel, February 2026",
    at: "43:00",
    clipTitle:
      "Elon Musk on axioms, conclusions and probability, Dwarkesh Patel interview",
  },
  {
    id: "r6",
    num: "06",
    title: "It is most confident exactly where it is most wrong.",
    body: "The harder and more important your question, the more likely the answer comes back polished, sourced and false. Confidence is not evidence. Check hardest where it sounds surest.",
    videoId: "JN3KPFbWCy8",
    start: 2181,
    source: "Lex Fridman, November 2023",
    at: "36:23",
    clipTitle:
      "Elon Musk on AI being confidently wrong on the hardest questions, Lex Fridman",
  },
  {
    id: "r7",
    num: "07",
    title: "The smartest model is not his.",
    body: "In July 2026 he said Anthropic's Fable is still clearly the smartest model. He owns a competitor. He also says no lab stays ahead by more than about six months, so never build your work around one of them.",
    videoId: "XuoqKYxDHVc",
    start: 930,
    source: "The Economist, July 2026",
    at: "15:32",
    clipTitle:
      "Elon Musk says Anthropic's Fable is still clearly the smartest model, The Economist",
  },
];

/** Rule one names three questions most people have never heard of. */
export const THREE_QUESTIONS: readonly { q: string; plain: string }[] = [
  {
    q: "The Fermi paradox",
    plain: "the universe is huge and old, so why have we never met anyone?",
  },
  {
    q: "Rocket engine design",
    plain: "how to build an engine that does not blow up",
  },
  {
    q: "Electrochemistry",
    plain: "what is actually happening inside a battery",
  },
];
