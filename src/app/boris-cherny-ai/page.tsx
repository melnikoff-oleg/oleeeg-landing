import "./page.css";
import { ArticleJsonLd } from "@/components/json-ld";

// Companion page to the YouTube video about how the creator of Claude Code uses
// AI.
//
// Ported from the standalone build in Oleg's vault by scripts/07, from
// areas/youtube_videos/2026-08-02_boris_cherny/web/. That copy is the source of
// truth and the two are kept in step by a script — change this file by hand and
// the next port overwrites you.
//
// Sibling of /elon-musk-ai and built to the same contract: it gets filmed, so
// every sentence Oleg would say out loud has been taken off the screen. No
// kicker, no standfirst, no rule descriptions, no header, no footer. What is
// left is the claim, his own words, the link to the exact second, and the proof
// that the reading happened.
//
// The one thing this page has that the Elon page does not: each rule carries a
// folded plain-Russian explanation, shut by default. It is the layer the video
// script is written from, and it is a <details> so it costs nothing on screen.
//
// Ten rules and one bonus, cut down from twenty on 2026-08-07. Seven of the old
// rules were merged into the ones they duplicated, so every quote is still
// verbatim and still linked to the second it was said.
//
// Deliberately NO scroll reveal, unlike every other page here — same reason
// src/app/elon-ai/page.tsx gives: the site's Reveal starts elements hidden, and
// a fast programmatic scroll outruns the observer and leaves a band blank for a
// beat. Invisible to a reader, fatal on camera. Everything renders. No client
// JavaScript at all.

const PUBLISHED = "2026-08-07T00:00:00Z";

export default function BorisChernyAiPage() {
  return (
    <>
      <ArticleJsonLd
        title="10 things the creator of Claude Code actually does with AI"
        description="Ten things Boris Cherny, the creator of Claude Code, says he actually does with AI, each one linked to the exact second he says it, read out of 27 transcribed interviews and 1,346 of his posts."
        url="https://oleg.ae/boris-cherny-ai"
        datePublished={PUBLISHED}
        dateModified={PUBLISHED}
      />

      {/* ======================================================================
           THE FOLD — headline, portrait, and the evidence, all on one screen.
           Same contract as the Elon page: no kicker, no standfirst, no
           explanation. Three interviews and three posts; the rest of the corpus
           is a numeral in the rail.
           ====================================================================== */}
      <header className="fold">
        <div className="shell">

          <h1>10 things the creator of Claude Code <em>actually</em> does with AI</h1>

          <div className="portrait">
            <img src="/boris-cherny-ai/boris.jpg" alt="Boris Cherny" width="648" height="710" />
          </div>

          {/* ---- the interviews, as YouTube renders them ---- */}
          <div className="yt-wall">

            <span className="mark mark-yt" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></span>

            <a className="yt" href="https://youtu.be/We7BZVKbCVw?t=3953" target="_blank" rel="noopener">
              <div className="yt-thumb">
                <img src="/boris-cherny-ai/thumbs/We7BZVKbCVw.jpg" alt="" loading="lazy" />
                <span className="yt-dur">1:27:45</span>
              </div>
              <div className="yt-meta">
                <img className="yt-av" src="/boris-cherny-ai/avatars/yt-We7BZVKbCVw.jpg" alt="" loading="lazy" />
                <div className="yt-txt">
                  <h3>Head of Claude Code: What happens after coding is solved | Boris Cherny</h3>
                  <p>Lenny's Podcast</p>
                  <p>552K views</p>
                </div>
              </div>
            </a>

            <a className="yt" href="https://youtu.be/SlGRN8jh2RI?t=495" target="_blank" rel="noopener">
              <div className="yt-thumb">
                <img src="/boris-cherny-ai/thumbs/SlGRN8jh2RI.jpg" alt="" loading="lazy" />
                <span className="yt-dur">24:36</span>
              </div>
              <div className="yt-meta">
                <img className="yt-av" src="/boris-cherny-ai/avatars/yt-SlGRN8jh2RI.jpg" alt="" loading="lazy" />
                <div className="yt-txt">
                  <h3>Anthropic’s Boris Cherny: Why Coding Is Solved, and What Comes Next</h3>
                  <p>Sequoia Capital</p>
                  <p>459K views</p>
                </div>
              </div>
            </a>

            <a className="yt" href="https://youtu.be/qyPCVqFUyDo?t=1213" target="_blank" rel="noopener">
              <div className="yt-thumb">
                <img src="/boris-cherny-ai/thumbs/qyPCVqFUyDo.jpg" alt="" loading="lazy" />
                <span className="yt-dur">35:51</span>
              </div>
              <div className="yt-meta">
                <img className="yt-av" src="/boris-cherny-ai/avatars/yt-qyPCVqFUyDo.jpg" alt="" loading="lazy" />
                <div className="yt-txt">
                  <h3>Boris Cherny: We Cut 80% of Claude Code’s Prompt</h3>
                  <p>Y Combinator</p>
                  <p>192K views</p>
                </div>
              </div>
            </a>

            <div className="tally"><b>+24</b><span>interviews</span></div>

          </div>

          {/* ---- the posts, as X renders them ---- */}
          <div className="x-wall">

            <span className="mark mark-x" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></span>

            <a className="tw" href="https://x.com/bcherny/status/2017742741636321619" target="_blank" rel="noopener">
              <img className="tw-av" src="/boris-cherny-ai/avatars/x-bcherny.jpg" alt="" loading="lazy" />
              <div className="tw-body">
                <div className="tw-head">
                  <b>Boris Cherny</b>
                  <svg className="tw-check" viewBox="0 0 24 24" aria-label="Verified"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                  <span>@bcherny · Jan 31</span>
                </div>
                <p>I'm Boris and I created Claude Code. I wanted to quickly share a few tips for using Claude Code, sourced directly from the Claude Code team. Remember: there is no one right way to use Claude Code -- everyones' setup is different.</p>
                <div className="tw-acts">
                  <span><svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>921</span>
                  <span><svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>5.8K</span>
                  <span><svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>50.6K</span>
                  <span><svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>9.2M</span>
                </div>
              </div>
            </a>

            <a className="tw" href="https://x.com/bcherny/status/2007179832300581177" target="_blank" rel="noopener">
              <img className="tw-av" src="/boris-cherny-ai/avatars/x-bcherny.jpg" alt="" loading="lazy" />
              <div className="tw-body">
                <div className="tw-head">
                  <b>Boris Cherny</b>
                  <svg className="tw-check" viewBox="0 0 24 24" aria-label="Verified"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                  <span>@bcherny · Jan 2</span>
                </div>
                <p>I'm Boris and I created Claude Code. Lots of people have asked how I use Claude Code, so I wanted to show off my setup a bit. My setup might be surprisingly vanilla!</p>
                <div className="tw-acts">
                  <span><svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>1,314</span>
                  <span><svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>6.9K</span>
                  <span><svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>54.4K</span>
                  <span><svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>8.2M</span>
                </div>
              </div>
            </a>

            <a className="tw" href="https://x.com/bcherny/status/2004897269674639461" target="_blank" rel="noopener">
              <img className="tw-av" src="/boris-cherny-ai/avatars/x-bcherny.jpg" alt="" loading="lazy" />
              <div className="tw-body">
                <div className="tw-head">
                  <b>Boris Cherny</b>
                  <svg className="tw-check" viewBox="0 0 24 24" aria-label="Verified"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                  <span>@bcherny · Dec 27</span>
                </div>
                <p><span className="tw-at">@YashGouravKar1</span> Correct. In the last thirty days, 100% of my contributions to Claude Code were written by Claude Code</p>
                <div className="tw-acts">
                  <span><svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>124</span>
                  <span><svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>310</span>
                  <span><svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>3,030</span>
                  <span><svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>1.4M</span>
                </div>
              </div>
            </a>

            <div className="tally"><b>+1,343</b><span>posts</span></div>

          </div>

        </div>
      </header>

      {/* ======================================================================
           THE TEN — title, his own words, the timecode, and a folded
           plain-Russian explanation. Nothing else.

           Cut down from twenty on 2026-08-07. Seven rules were merged into the ones
           they duplicated rather than dropped, so every quote below is still a quote
           he actually said, on the source it came from.
           ====================================================================== */}
      <main className="moves">
        <div className="shell">

          <article className="rule">
            <div className="rank">1</div>
            <div className="rule-body">
              <h2>Give it a way to check its own work — that beats any prompt trick</h2>
              <div className="said">
                <q>The skill nowadays is less about prompt engineering and more about figuring out how do you give Claude a hard task that seems a little bit too hard, and then how do you make it possible for Claude to verify its work along the way. And the verification I think is probably the single most important thing that people do not get right.</q>
                <q>Probably the most important thing to get great results out of Claude Code — give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/qyPCVqFUyDo?t=1213" target="_blank" rel="noopener">Y Combinator <b>20:13</b></a>
                <a className="cite" href="https://x.com/bcherny/status/2007179832300581177" target="_blank" rel="noopener">On X <b>2 Jan</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Самое важное правило: дай роботу способ САМОМУ проверять свою работу. Например: тесты, которые можно запустить, или браузер, где он может открыть сайт и посмотреть, что получилось. Если робот видит результат, он сам замечает ошибки и сам их чинит. Это как решать задачи, когда в конце учебника есть ответы: ты сам себя проверяешь и исправляешься. Борис говорит, что это важнее любых хитрых промптов — качество вырастает в два-три раза.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">2</div>
            <div className="rule-body">
              <h2>Give it a goal, guardrails and exit criteria — never step-by-step</h2>
              <div className="said">
                <q>You want to go a little bit higher level. You want to describe the task, you want to describe the guardrails, you want to describe like the exit criteria, and then just let the model cook. And come back in a little bit.</q>
                <q>Don’t try to over curate it. Don’t try to put it into a box. Don’t try to give it a bunch of context up front. Give it a tool so that it can get the context it needs. You’re just going to get better results.</q>
                <q>Without planning, maybe it succeeds 20, 30% of the time without a lot of intervention. But with planning, that goes up to maybe 70 or 80% of the time.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/qyPCVqFUyDo?t=915" target="_blank" rel="noopener">Y Combinator <b>15:15</b></a>
                <a className="cite" href="https://youtu.be/We7BZVKbCVw?t=3865" target="_blank" rel="noopener">Lenny's Podcast <b>1:04:25</b></a>
                <a className="cite" href="https://youtu.be/h-Hlt05REZk?t=916" target="_blank" rel="noopener">Bessemer <b>15:16</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Не командуй роботу «сделай шаг один, потом шаг два, потом шаг три». Скажи по-другому: вот ЦЕЛЬ (что должно получиться), вот ГРАНИЦЫ (чего делать нельзя), вот ПРИЗНАК ГОТОВО (как понять, что закончил). И отпусти — пусть сам решает, как дойти до цели. Это как с таксистом: ты называешь адрес, а не кричишь «поверни налево, теперь направо». Перед стартом попроси его рассказать план: без плана робот справляется сам в 20-30% случаев, а с планом — в 70-80%. И не запихивай в него горы информации заранее — дай инструмент, чтобы он сам нашёл то, что ему нужно.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">3</div>
            <div className="rule-body">
              <h2>Always use the most expensive model — the smart one is the cheap one</h2>
              <div className="said">
                <q>Number one is just use the most capable model. Currently, that’s Opus 4.6. I have maximum effort enabled always.</q>
                <q>It’s actually not obvious that it’s cheaper if you use a less expensive model. Often, it’s actually cheaper and less token intensive if you use the most capable model, cuz it can just do the same thing much faster with less correction, less hand-holding.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/We7BZVKbCVw?t=4156" target="_blank" rel="noopener">Lenny's Podcast <b>1:09:16</b></a>
                <a className="cite" href="https://youtu.be/We7BZVKbCVw?t=4175" target="_blank" rel="noopener">Lenny's Podcast <b>1:09:35</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Всегда включай самую дорогую и умную модель, не экономь. Вот фокус: умная модель на самом деле часто ДЕШЕВЛЕ. Глупая модель ошибается, ты её поправляешь, она переделывает, снова ошибается — и в итоге сжигает больше денег на переделках. Умная делает правильно с первого раза. Это как нанять мастера вместо дешёвого халтурщика: мастер стоит дороже в час, но дом он построит быстрее и без переделок — и выйдет дешевле.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">4</div>
            <div className="rule-body">
              <h2>Every 6 months, delete your whole setup — and retry everything it failed at</h2>
              <div className="said">
                <q>For people that aren’t building agentic products, but you’re using Claude Code — every 6 months delete your CLAUDE.md. Delete your skills. Delete your hooks. See what the model does and it might surprise you.</q>
                <q>A lot of the stuff in the system prompt was correcting for these behaviors that the model should have known, but it didn’t. Now, Opus 5 just does it. So, yeah, we deleted 80% of the system prompt.</q>
                <q>You have to keep re-trying. You always need this like beginner mindset to retry the technology and use it for a thing it was not good at before, because the next model might just do it perfectly.</q>
                <q>The idea is the more general model will always beat the more specific model, and there’s a lot of corollaries to this, but essentially what it boils down to is: never bet against the model.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/qyPCVqFUyDo?t=415" target="_blank" rel="noopener">Y Combinator <b>6:55</b></a>
                <a className="cite" href="https://youtu.be/qyPCVqFUyDo?t=257" target="_blank" rel="noopener">Y Combinator <b>4:17</b></a>
                <a className="cite" href="https://youtu.be/s1GZeKiZHuI?t=131" target="_blank" rel="noopener">Alex Kantrowitz <b>2:11</b></a>
                <a className="cite" href="https://youtu.be/PQU9o_5rHC4?t=2300" target="_blank" rel="noopener">Y Combinator <b>38:20</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Раз в полгода возьми и СОТРИ все свои правила и настройки для робота. Звучит страшно, но вот почему: старые правила ты писал для старого, глупого робота. Новый уже умный и сам всё это знает, а старые правила ему только мешают — как костыли здоровому человеку. Сама команда Claude Code так удалила 80% своих инструкций. И заведи список того, что робот НЕ СМОГ сделать: с каждой новой версией пробуй весь список заново, потому что вчерашнее «не умеет» сегодня часто получается идеально. Правило одной фразой: никогда не ставь против модели.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">5</div>
            <div className="rule-body">
              <h2>Keep the workspace clean — the model copies whatever it sees</h2>
              <div className="said">
                <q>The better thing to do is just always have, you know, a clean code base. Always make sure that when you start a migration, you finish the migration. And this is great for engineers, and nowadays, it’s great for models, too.</q>
                <q>Claude Code itself, we rewrite all the time. And I think this is just something that coding agents enable. The code itself is no longer precious.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/julbw1JuAz0?t=1172" target="_blank" rel="noopener">Pragmatic Engineer <b>19:32</b></a>
                <a className="cite" href="https://youtu.be/iF9iV4xponk?t=989" target="_blank" rel="noopener">Anthropic <b>16:29</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Робот учится на твоём коде, как ребёнок на примере родителей. Если в проекте бардак — робот будет повторять бардак. Если начал переделку — доведи её до конца, не бросай на половине, иначе робот увидит два разных способа и скопирует старый, неправильный. И не жалей код: для робота переписать всё заново — дёшево и быстро. Код больше не драгоценность, которую надо беречь. Драгоценность — это порядок, по которому робот учится.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">6</div>
            <div className="rule-body">
              <h2>Never run one Claude — five by day, hundreds by night</h2>
              <div className="said">
                <q>I have five terminal tabs. Each one of them has a checkout of the repository. So it’s five parallel checkouts. And usually I’ll kind of round robin and start Claude Code in each one.</q>
                <q>Every night I have like, you know, hundreds or sometimes thousands of agents that are just running 5, 10, 20 hours. And this is just how engineering is done now.</q>
                <q>I have like dozens of loops that are running for stuff. So, I have one that’s babysitting my PRs, like fixing CI, auto-rebasing. I have another one that keeps CI healthy. I have another one that grabs feedback from Twitter and kind of clusters it for me every 30 minutes.</q>
                <q>She set up a container, and she set up a Claude in dangerous mode. And she let it run for the entire weekend. It spawned a couple hundred agents. They made 100 tasks on the Asana board, and then they implemented it. And that’s pretty much the version of plugins that we shipped.</q>
                <q>Jared just rewrote Bun from Zig to Rust using Opus 4.8 using dynamic workflows. This would have taken probably a year of work before — he did it in six days.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/julbw1JuAz0?t=2028" target="_blank" rel="noopener">Pragmatic Engineer <b>33:48</b></a>
                <a className="cite" href="https://youtu.be/PZ9u6DR8qOU?t=2704" target="_blank" rel="noopener">Casey Newton <b>45:04</b></a>
                <a className="cite" href="https://youtu.be/SlGRN8jh2RI?t=495" target="_blank" rel="noopener">Sequoia <b>8:15</b></a>
                <a className="cite" href="https://youtu.be/julbw1JuAz0?t=3895" target="_blank" rel="noopener">Pragmatic Engineer <b>1:04:55</b></a>
                <a className="cite" href="https://youtu.be/KDOGK4Mbxq0?t=1142" target="_blank" rel="noopener">Fortune <b>19:02</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Не жди, пока один робот закончит — запусти сразу пять! Пока первый думает, дай задание второму, потом третьему. У Бориса днём работает пять Клодов, а ночью — сотни, по 5-20 часов подряд. Ещё десятки роботов просыпаются САМИ по расписанию: один чинит сломанные тесты, другой каждые 30 минут собирает отзывы людей из Твиттера. А сотрудница Anthropic просто дала роботу доску задач и ушла на выходные: он сам разбил работу на 100 задач, запустил пару сотен помощников, и в понедельник функция была готова — её выпустили для всех. Другой человек так переписал целую огромную программу за 6 дней вместо года.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">7</div>
            <div className="rule-body">
              <h2>Never explain the same thing twice — make it write the rule down</h2>
              <div className="said">
                <q>The most important idea when working on this stuff is like, every single time Claude makes a mistake, I don’t tell Claude to do it differently, I tell it to write it to the CLAUDE.md, or to like make a skill or something to do it differently. And if you can do this, then Claude can just like run forever.</q>
                <q>Claude is eerily good at writing rules for itself.</q>
                <q>If you do something more than once a day, turn it into a skill or command.</q>
                <q>It’s a mindset shift. It’s not just thinking about how do I solve this problem, it’s how do I solve this entire class of problems and automate it using Claude.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/Hth_tLaC2j8?t=50" target="_blank" rel="noopener">Claude <b>0:50</b></a>
                <a className="cite" href="https://x.com/bcherny/status/2017742741636321619" target="_blank" rel="noopener">On X <b>31 Jan</b></a>
                <a className="cite" href="https://youtu.be/KDOGK4Mbxq0?t=641" target="_blank" rel="noopener">Fortune <b>10:41</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Никогда не объясняй роботу одно и то же дважды. Ошибся — не поправляй его руками, а скажи: «Запиши это правило себе в блокнот». У робота есть такой блокнот-памятка (файл CLAUDE.md), который он читает каждый раз перед началом работы. Одна ошибка = одно правило = эта ошибка больше никогда не повторится. А если ты просишь об одном и том же чаще, чем раз в день — преврати просьбу в «навык»: один раз объясни подробно, сохрани, и дальше запускай одним коротким словом. Перемена в голове простая: думай не «как решить эту задачу», а «как решить ВСЕ такие задачи раз и навсегда».</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">8</div>
            <div className="rule-body">
              <h2>Triage every task: easy runs in the background, medium gets a plan, hard you drive</h2>
              <div className="said">
                <q>In my mind, I have these three categories: easy, medium, and hard. Easy tasks are something that Claude can write in one shot — like one prompt, it’ll get it pretty much right. And nowadays I’ll just go to GitHub and I’ll tag @Claude on an issue and just have Claude write the PR for me.</q>
                <q>And then for really hard tasks, I’m still the one driving, and Claude is more of a tool. And I’m kind of pairing with it. But really I’m the one in the driver’s seat.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/iF9iV4xponk?t=1143" target="_blank" rel="noopener">Anthropic <b>19:03</b></a>
                <a className="cite" href="https://youtu.be/iF9iV4xponk?t=1177" target="_blank" rel="noopener">Anthropic <b>19:37</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Раздели все задачи на три кучки. ЛЁГКИЕ — робот сделает сам с первого раза: отдай ему и вообще не смотри, пусть работает в фоне. СРЕДНИЕ — сначала обсуди с ним план, потом отпусти. СЛОЖНЫЕ — тут главный ты, а робот только помогает, как инструмент в руке. Весь секрет в том, чтобы правильно угадать кучку. Тогда лёгкое делается само, пока ты спишь, а свою голову ты тратишь только на действительно сложное.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">9</div>
            <div className="rule-body">
              <h2>Don’t lower the bar — put a team of AIs on reviewing the AI</h2>
              <div className="said">
                <q>We have the same exact bar regardless of whether the code was written by the model or by a human. And so if the code sucks, we’re not going to merge it. It’s the same exact bar and you just ask the model to improve the code and make it better.</q>
                <q>A lot of people that are new to this kind of tool, they tend to just ask it to do stuff that’s a little bit too big, or they hold a different bar for the model’s code versus their own code.</q>
                <q>We have a team of Claudes, they all have kind of different personas, and they have different perspectives, and they essentially collaborate to review the code. And what we found is with this approach, we catch pretty much every bug.</q>
                <q>Claude Code review finds 99%+ of the bugs, then an engineer sanity checks Claude didn’t miss something obvious.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/AmdLVWMdjOk?t=4422" target="_blank" rel="noopener">Ryan Peterman <b>1:13:42</b></a>
                <a className="cite" href="https://youtu.be/KDOGK4Mbxq0?t=315" target="_blank" rel="noopener">Fortune <b>5:15</b></a>
                <a className="cite" href="https://youtu.be/IDSAMqip6ms?t=1380" target="_blank" rel="noopener">Every <b>23:00</b></a>
                <a className="cite" href="https://x.com/bcherny/status/2036814131312165058" target="_blank" rel="noopener">On X <b>25 Mar</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Не прощай роботу плохую работу. Если получилось плохо — не бери, а скажи: «Переделай лучше». В Anthropic одна планка качества и для людей, и для робота. Робот не устаёт и не обижается, поэтому проси переделывать сколько угодно раз. А проверять зови не себя, а КОМАНДУ других роботов, и каждому дай свою роль: один ищет ошибки, другой смотрит на безопасность, третий проверяет, не выдумал ли первый ошибку там, где её нет. Вместе они ловят почти все баги — 99%. Человек в конце только быстро проглядывает, что ничего очевидного не упущено.</p>
              </details>
            </div>
          </article>

          <article className="rule">
            <div className="rank">10</div>
            <div className="rule-body">
              <h2>Experience is a liability now — a new hire out-Clauded the creator of Claude Code</h2>
              <div className="said">
                <q>There was one time I was debugging something and there was a new person that just joined the team. I was debugging it by hand. They just asked Claude to do the same thing. Within 20 minutes, they came up with a solution and I didn’t.</q>
                <q>Sometimes a new grad joins the team and they will teach me something about how to use Claude Code better, because they think about it natively.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/eQ6tb7j3Z2U?t=1685" target="_blank" rel="noopener">AMD <b>28:05</b></a>
                <a className="cite" href="https://youtu.be/RkQQ7WEor7w?t=1357" target="_blank" rel="noopener">Acquired <b>22:37</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Опыт теперь может мешать! Сам Борис — создатель Claude Code — однажды копался в проблеме руками, по-старинке. А новенький сотрудник просто спросил у Клода — и решил её за 20 минут, пока Борис возился. Почему? У Бориса в голове сидела старая версия робота («такое он не потянет»), а новичок этого «знания» не имел — и просто попробовал. Вывод: думай как новичок. Никогда не решай ЗА робота, что он чего-то не может.</p>
              </details>
            </div>
          </article>

          <article className="rule bonus">
            <div className="rank">+</div>
            <div className="rule-body">
              <span className="badge">Bonus</span>
              <h2>The agent runs his life too — flights, fines, and a clamming license</h2>
              <div className="said">
                <q>I used it to pay a parking ticket the other day. I was up in Seattle. We went clamming and I used it to purchase a clamming license. Like I just did something else and it navigated this actually kind of annoying government website to do it.</q>
                <q>And then I told it to book the flights. And I went and, you know, was coding on something, and I came back an hour later and it booked eight flights and five hotels.</q>
              </div>
              <div className="cites">
                <a className="cite" href="https://youtu.be/IvDnGRFMmgE?t=1317" target="_blank" rel="noopener">The Vergecast <b>21:57</b></a>
                <a className="cite" href="https://youtu.be/s1GZeKiZHuI?t=35" target="_blank" rel="noopener">Alex Kantrowitz <b>0:35</b></a>
              </div>
              <details className="explain">
                <summary>Объясни, как третьекласснику</summary>
                <p>Робот нужен не только для кода. Борис просит его: заплати штраф за парковку; купи лицензию на ловлю моллюсков (робот сам продрался через неудобный государственный сайт); забронируй поездку. Однажды робот за один час, пока Борис спокойно работал, забронировал ему 8 перелётов и 5 отелей. Правило простое: всё, что ты делаешь через сайты, формочки и кнопочки — робот может сделать за тебя, пока ты занимаешься чем-то поинтереснее.</p>
              </details>
            </div>
          </article>

        </div>
      </main>
    </>
  );
}
