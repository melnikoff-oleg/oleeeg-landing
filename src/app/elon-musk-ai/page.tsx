import "./page.css";
import { ArticleJsonLd } from "@/components/json-ld";

// Companion page to the YouTube video "How Elon Musk Uses AI Daily".
//
// Ported from the standalone build in Oleg's vault by scripts/16, from
// areas/youtube_videos/2026-07-30_elon_musk_ai_daily/web/. That copy is the
// source of truth and the two are kept in step by a script — change this file
// by hand and the next port overwrites you.
//
// It looks nothing like the rest of the site on purpose. It gets filmed: Oleg
// screen-records it and narrates over it, so every sentence he would say out
// loud has been taken off the screen. No kicker, no standfirst, no rule
// descriptions, no header, no footer. What is left is the claim, his own words,
// the link to the exact second, and the proof that the reading happened.
//
// Deliberately NO scroll reveal, unlike every other page here — same reason
// src/app/elon-ai/page.tsx gives: the site's Reveal starts elements hidden, and
// a fast programmatic scroll outruns the observer and leaves a band blank for a
// beat. Invisible to a reader, fatal on camera. Everything renders. No client
// JavaScript at all.

const PUBLISHED = "2026-08-05T00:00:00Z";

export default function ElonMuskAiPage() {
  return (
    <>
      <ArticleJsonLd
        title="Seven things Elon Musk actually does with AI"
        description="Seven things Elon Musk says he actually does with AI, each one linked to the exact second he says it, read out of 31 transcribed interviews and 997 of his posts."
        url="https://oleg.ae/elon-musk-ai"
        datePublished={PUBLISHED}
        dateModified={PUBLISHED}
      />

      {/* ======================================================================
           THE FOLD — headline, portrait, and the evidence, all on one screen.
           No kicker, no standfirst, no explanation: Oleg narrates over this.
           Three interviews and three posts, not six and three — the rest of the
           corpus is a number in the right-hand rail, not a wall of tiles.
           ====================================================================== */}
      <header className="fold">
        <div className="shell">

          <h1>Seven things Elon Musk <em>actually</em> does with AI</h1>

          {/* Its own column, never behind the cards: the photo is the loudest thing
               on the page and it is not allowed to fight anything. */}
          <div className="portrait">
            <img src="/elon-musk-ai/elon-3.jpg" alt="Elon Musk" width="780" height="790" />
          </div>

          {/* ---- the interviews, as YouTube renders them ----
               Each card links to the exact second that made the page. The timecode
               is in the href only; on screen it would just be noise. */}
          <div className="yt-wall">

            <a className="yt" href="https://youtu.be/O4wBUysNe2k?t=4257" target="_blank" rel="noopener">
              <div className="yt-thumb">
                <img src="/elon-musk-ai/thumbs/O4wBUysNe2k.jpg" alt="" loading="lazy" />
                <span className="yt-dur">3:18:26</span>
              </div>
              <div className="yt-meta">
                <img className="yt-av" src="/elon-musk-ai/avatars/yt-O4wBUysNe2k.jpg" alt="" loading="lazy" />
                <div className="yt-txt">
                  <h3>Joe Rogan Experience #2404 - Elon Musk</h3>
                  <p>PowerfulJRE</p>
                  <p>12M views</p>
                </div>
              </div>
            </a>

            <a className="yt" href="https://youtu.be/qeZqZBRA-6Q?t=1762" target="_blank" rel="noopener">
              <div className="yt-thumb">
                <img src="/elon-musk-ai/thumbs/qeZqZBRA-6Q.jpg" alt="" loading="lazy" />
                <span className="yt-dur">44:47</span>
              </div>
              <div className="yt-meta">
                <img className="yt-av" src="/elon-musk-ai/avatars/yt-qeZqZBRA-6Q.jpg" alt="" loading="lazy" />
                <div className="yt-txt">
                  <h3>Elon Musk on DOGE, Optimus, Starlink Smartphones, Evolving with AI, Why the West is Imploding</h3>
                  <p>All-In Podcast</p>
                  <p>2.4M views</p>
                </div>
              </div>
            </a>

            <a className="yt" href="https://youtu.be/BYXbuik3dgA?t=2578" target="_blank" rel="noopener">
              <div className="yt-thumb">
                <img src="/elon-musk-ai/thumbs/BYXbuik3dgA.jpg" alt="" loading="lazy" />
                <span className="yt-dur">2:49:45</span>
              </div>
              <div className="yt-meta">
                <img className="yt-av" src="/elon-musk-ai/avatars/yt-BYXbuik3dgA.jpg" alt="" loading="lazy" />
                <div className="yt-txt">
                  <h3>Elon Musk – “In 36 months, the cheapest place to put AI will be space”</h3>
                  <p>Dwarkesh Patel</p>
                  <p>2M views</p>
                </div>
              </div>
            </a>

            <div className="tally"><b>+28</b><span>interviews</span></div>

          </div>

          {/* ---- the posts, as X renders them ---- */}
          <div className="x-wall">

            <a className="tw" href="https://x.com/elonmusk/status/2075278580955685036" target="_blank" rel="noopener">
              <img className="tw-av" src="/elon-musk-ai/avatars/x-elonmusk.jpg" alt="" loading="lazy" />
              <div className="tw-body">
                <div className="tw-head">
                  <b>Elon Musk</b>
                  <svg className="tw-check" viewBox="0 0 24 24" aria-label="Verified"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                  <span>@elonmusk · Jul 9</span>
                </div>
                <p>I was clearly wrong about Anthropic. They are obviously currently the leader in AI. No company has released a model as good as Mythos/Fable and they will undoubtedly have Mythos 2 ready soon.</p>
                <div className="tw-acts">
                  <span><svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>2,928</span>
                  <span><svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>6,188</span>
                  <span><svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>89.5K</span>
                  <span><svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>4.9M</span>
                </div>
              </div>
            </a>

            <a className="tw" href="https://x.com/elonmusk/status/2074968423394578602" target="_blank" rel="noopener">
              <img className="tw-av" src="/elon-musk-ai/avatars/x-elonmusk.jpg" alt="" loading="lazy" />
              <div className="tw-body">
                <div className="tw-head">
                  <b>Elon Musk</b>
                  <svg className="tw-check" viewBox="0 0 24 24" aria-label="Verified"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                  <span>@elonmusk · Jul 8</span>
                </div>
                <p><span className="tw-at">@DrewPavlou</span> In fairness, Fable is definitely better than Grok 4.5, but most tasks don’t require Fable-level capability</p>
                <div className="tw-acts">
                  <span><svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>794</span>
                  <span><svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>649</span>
                  <span><svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>20.7K</span>
                  <span><svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>961.7K</span>
                </div>
              </div>
            </a>

            <a className="tw" href="https://x.com/elonmusk/status/2075608188376772644" target="_blank" rel="noopener">
              <img className="tw-av" src="/elon-musk-ai/avatars/x-elonmusk.jpg" alt="" loading="lazy" />
              <div className="tw-body">
                <div className="tw-head">
                  <b>Elon Musk</b>
                  <svg className="tw-check" viewBox="0 0 24 24" aria-label="Verified"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                  <span>@elonmusk · Jul 10</span>
                </div>
                <p>True</p>
                <div className="tw-quote">
                  <div className="tw-quote-head">
                    <img src="/elon-musk-ai/avatars/x-mia.jpg" alt="" width="20" height="20" loading="lazy" />
                    <b>Mia</b><span>@MiaAI_lab</span>
                  </div>
                  Here’s one way to get the most from Grok 4.5 ✨ Switching effort to “low” gives strong results on most tasks, near-zero quality loss, big usage savings — plus it’s the fastest.
                </div>
                <div className="tw-acts">
                  <span><svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>894</span>
                  <span><svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>1,309</span>
                  <span><svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>5,280</span>
                  <span><svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>2.1M</span>
                </div>
              </div>
            </a>

            <div className="tally"><b>+994</b><span>posts</span></div>

          </div>

        </div>
      </header>

      {/* ======================================================================
           THE SEVEN — title, his own words, the timecode, the visual. Nothing else.
           ====================================================================== */}
      <main className="moves">
        <div className="shell">

          <article className="rule">
            <div className="rank">1</div>
            <div className="rule-body">
              <h2>When a new AI comes out, ignore the scores and ask it 3 questions you already know the answer to</h2>
              <div className="said">
                <q>With any given variant of or improvement in AI — I’ll ask it questions about the Fermi paradox, about rocket engine design, about electrochemistry, and so far the AI has been terrible at all those questions.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/q-MFKzvqFOk?t=1939" target="_blank" rel="noopener">Michael Milken <b>32:19</b></a>
              </div>
            </div>
            <div className="shelf">
              <img src="/elon-musk-ai/visuals/rule-1.jpg" alt="Three keys, the middle one glowing" loading="lazy" />
            </div>
          </article>

          <article className="rule">
            <div className="rank">2</div>
            <div className="rule-body">
              <h2>Ask it to show its steps — you can’t spot a wrong answer, but a wrong step is obvious</h2>
              <div className="said">
                <q>You want to make sure that the axioms are as close to true as possible. You don’t have contradictory axioms. The conclusions necessarily follow from those axioms with the right probability. It’s critical thinking 101.</q>
                <q>It made a mistake here. Why did it do something that it shouldn’t have done? Developing really good debuggers for seeing where the thinking went wrong — and being able to trace the origin of where it made the incorrect thought — is actually very important.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/BYXbuik3dgA?t=2578" target="_blank" rel="noopener">Dwarkesh Patel <b>43:00</b></a>
                <a className="cite" href="https://youtu.be/BYXbuik3dgA?t=3199" target="_blank" rel="noopener">Dwarkesh Patel <b>53:19</b></a>
              </div>
            </div>
            <div className="shelf">
              <img src="/elon-musk-ai/visuals/rule-2.jpg" alt="A staircase of floating slabs with one cracked step" loading="lazy" />
            </div>
          </article>

          <article className="rule">
            <div className="rank">3</div>
            <div className="rule-body">
              <h2>Elon says Fable 5 is smarter than his own AI — and that most of your work doesn’t need it</h2>
              <div className="said">
                <q>Realistically, Fable is still clearly the smartest model. I think anyone realistically would say that that’s still the case.</q>
                <q>In fairness, Fable is definitely better than Grok 4.5, but most tasks don’t require Fable-level capability.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/XuoqKYxDHVc?t=927" target="_blank" rel="noopener">The Economist <b>15:27</b></a>
                <a className="cite" href="https://x.com/elonmusk/status/2074968423394578602" target="_blank" rel="noopener">On X <b>8 Jul</b></a>
                <a className="cite" href="https://x.com/elonmusk/status/2075278580955685036" target="_blank" rel="noopener">On X <b>9 Jul</b></a>
                <a className="cite" href="https://x.com/elonmusk/status/2075608188376772644" target="_blank" rel="noopener">On X <b>10 Jul</b></a>
              </div>
            </div>
            <div className="shelf">
              <img src="/elon-musk-ai/visuals/rule-3.jpg" alt="A balance scale tipped by one glowing sphere" loading="lazy" />
            </div>
          </article>

          <article className="rule">
            <div className="rank">4</div>
            <div className="rule-body">
              <h2>Ten times the computing power makes an AI only twice as smart, so pay for it only when you’re stuck</h2>
              <div className="said">
                <q>There’s a natural logarithmic function associated with the amount of compute. So, say for argument’s sake, 10x more compute will double the intelligence. That might be a rough rule of thumb. But that still means that you go from 100 IQ to 200 IQ.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/qeZqZBRA-6Q?t=1762" target="_blank" rel="noopener">All-In Podcast <b>29:22</b></a>
              </div>
            </div>
            <div className="shelf">
              <img src="/elon-musk-ai/visuals/rule-4.jpg" alt="A tall stack of ten dull cubes beside a short stack of two glowing ones" loading="lazy" />
            </div>
          </article>

          <article className="rule">
            <div className="rank">5</div>
            <div className="rule-body">
              <h2>Automate everything but one step, and the whole thing still runs at the speed of that one step</h2>
              <div className="said">
                <q>Would you want even one cell in your spreadsheet to be manually calculated? That would be the most annoying cell — and it gets it wrong a bunch of the time.</q>
                <q>Companies that are entirely AI will demolish companies that are not. It won’t be a contest.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/RSNuB9pj9P8?t=3911" target="_blank" rel="noopener">Diamandis, Moonshots <b>65:11</b></a>
              </div>
            </div>
            <div className="shelf">
              <img src="/elon-musk-ai/visuals/rule-5.jpg" alt="A polished chain with one crude, glowing hand-forged link" loading="lazy" />
            </div>
          </article>

          <article className="rule">
            <div className="rank">6</div>
            <div className="rule-body">
              <h2>Don’t type the problem out — take a photo and send it, the way he sent Grok his own MRI scan</h2>
              <div className="said">
                <q>I did an MRI recently and submitted it to Grok. None of the doctors nor Grok found anything wrong.</q>
                <q>If you took a photo and submitted it to Grok, it could probably tell you if there’s something wrong with it.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/RSNuB9pj9P8?t=3630" target="_blank" rel="noopener">Diamandis, Moonshots <b>60:30</b></a>
                <a className="cite" href="https://youtu.be/RSNuB9pj9P8?t=123" target="_blank" rel="noopener">Diamandis, Moonshots <b>2:03</b></a>
              </div>
            </div>
            <div className="shelf">
              <img src="/elon-musk-ai/visuals/rule-6.jpg" alt="A glowing slab tilted over a circuit board" loading="lazy" />
            </div>
          </article>

          <article className="rule bonus">
            <div className="rank">+</div>
            <div className="rule-body">
              <span className="badge">Bonus</span>
              <h2>The one thing he says is really fun: point your camera at a friend and ask for a roast</h2>
              <div className="said">
                <q>If you want to have a good time or make people really laugh at a party, you can use Grok and you can say: do a vulgar roast of someone. Just literally point the camera at them… and then keep saying no, no, make it even more vulgar. Eventually it’s like, holy shit.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/O4wBUysNe2k?t=4257" target="_blank" rel="noopener">Joe Rogan #2404 <b>70:57</b></a>
              </div>
            </div>
            <div className="shelf">
              <img src="/elon-musk-ai/visuals/rule-7.jpg" alt="A silver speech bubble with a small flame burning inside it" loading="lazy" />
            </div>
          </article>

        </div>
      </main>
    </>
  );
}
