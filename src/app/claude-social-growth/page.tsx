import { ResourcePageShell } from "@/components/resource-page-shell";
import {
  Block,
  Callout,
  Code,
  Guide,
  GuideSection,
  GuideSteps,
  GuideToc,
  KeyFacts,
  Out,
} from "@/components/guide";
import { PLANS, usd } from "@/lib/pricing";
import { BoldaneLink } from "@/components/boldane-cta";
import { CopyButton } from "@/components/copy-button";
import { DOWNLOAD_ICON } from "@/components/repo-cta";

const VIDEO_ID = "GK3JFG7x7LA";
const VIDEO_TITLE = "Claude Code for Social Media Growth";

// held in a const so the copy button and the displayed prompt never drift
const ANALYSIS_PROMPT =
  "Analyze all videos from these YouTube channels: [paste URLs]. Scrape every video, identify outliers that performed way above average, and analyze their titles, thumbnails, and transcripts.";

const steps = [
  {
    title: "install visual studio code",
    content: (
      <div className="space-y-3">
        <p>
          download and install VS Code from{" "}
          <a
            href="https://code.visualstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            code.visualstudio.com
          </a>
          .
        </p>
        <p>
          this is where you&apos;ll run claude code and manage your analysis
          projects.
        </p>
      </div>
    ),
  },
  {
    title: "install claude code extension",
    content: (
      <div className="space-y-3">
        <p>
          open VS Code, go to the Extensions tab (left sidebar), and search for{" "}
          <span className="text-silver">Claude Code</span>.
        </p>
        <p>install it and log in with your Anthropic account.</p>
        <p>
          claude code needs a paid claude plan: pro is ${usd(PLANS.pro.monthly)}/mo and is enough to
          start. the &quot;get claude code&quot; button at the top of this page
          takes you to the same place,{" "}
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            claude.com/claude-code
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    title: "pick your competitors",
    content: (
      <div className="space-y-3">
        <p>
          identify 10-15 creators in your niche on YouTube (or
          Instagram/TikTok).
        </p>
        <p>
          collect their channel URLs or usernames. the more competitors you
          analyze, the better the patterns claude code will find.
        </p>
      </div>
    ),
  },
  {
    title: "get your apify api key",
    content: (
      <div className="space-y-3">
        <p>
          sign up at{" "}
          <a
            href="https://apify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            apify.com
          </a>{" "}
          (free tier available) and get your API token from Settings.
        </p>
        <p>
          claude code uses Apify to scrape all competitor videos, thumbnails, and
          metadata automatically.
        </p>
      </div>
    ),
  },
  {
    title: "run the analysis",
    content: (
      <div className="space-y-4">
        <p>
          open terminal in VS Code, start claude code, and give it a prompt
          like:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-5 text-base leading-relaxed text-silver [overflow-wrap:anywhere]">
          &quot;{ANALYSIS_PROMPT}&quot;
        </div>
        <CopyButton text={ANALYSIS_PROMPT} />
        <p>
          this takes 15-30 minutes depending on the volume of videos. in the
          video, we analyzed 1,906 videos from 14 competitors.
        </p>
      </div>
    ),
  },
  {
    title: "review the report",
    content: (
      <div className="space-y-3">
        <p>
          claude code generates a detailed report with everything you need to
          understand what&apos;s working in your niche:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-silver-muted">
          <li>outlier videos ranked by performance</li>
          <li>common hooks and title patterns</li>
          <li>thumbnail analysis</li>
          <li>content gaps</li>
          <li>topic clusters that perform best</li>
        </ul>
      </div>
    ),
  },
  {
    title: "get your personalized strategy",
    content: (
      <div className="space-y-3">
        <p>
          tell claude code about your channel and ask it to create a content
          strategy based on what it found.
        </p>
        <p>
          it&apos;ll suggest video concepts, titles, thumbnail ideas, and a
          posting schedule tailored to your niche.
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-3">
        <ul className="list-disc space-y-2 pl-5 text-silver-muted">
          <li>
            <span className="text-silver">re-run monthly</span> to catch new
            trends and shifts in what&apos;s working
          </li>
          <li>
            <span className="text-silver">analyze transcript patterns</span>:{" "}
            what story structures do top videos use?
          </li>
          <li>
            <span className="text-silver">study comment sections</span> for
            video ideas your competitors haven&apos;t covered
          </li>
          <li>
            <span className="text-silver">
              track your own analytics
            </span>{" "}
            and feed them back to claude code for optimization
          </li>
        </ul>
      </div>
    ),
  },
];


const SECTIONS = [
  "what the report contains",
  "the ICE score, which is why it is usable",
  "the underserved-topic chart",
  "what your audience actually wants",
  "building it",
  "the secret that made it five times better",
  "what to avoid, including one that cost me",
];

const guideSteps = [
  {
    title: "list your competitors from your own subscriptions",
    schema:
      "Pick the accounts in your niche you already follow and respect, and give the whole list to Claude Code.",
    body: (
      <>
        <p>
          i went through my own youtube subscriptions and picked everyone
          serious in my niche. no clever sourcing. the accounts you already
          follow are the accounts you already judged worth following.
        </p>
        <p>
          give claude code the list and ask it to analyse every video they
          published in the last year. mine came to nearly 2,000.
        </p>
      </>
    ),
  },
  {
    title: "connect apify and scrape everything, not just the numbers",
    schema:
      "Add an Apify key and scrape titles, view counts, thumbnails and full transcripts, not just the metrics.",
    body: (
      <>
        <p>
          <Out href="https://apify.com">apify</Out> is what makes the depth
          possible. one api key in the project and claude code can pull youtube,
          tiktok, instagram, facebook and google trends.
        </p>
        <p>
          <strong>ask for the thumbnails and the transcripts, not just the
          view counts.</strong> this is the difference between a report about
          numbers and a report about why things worked. the transcripts are
          where the hook patterns are.
        </p>
        <p>
          and do not ask claude code to scrape those sites directly. platforms
          block it, so it half works and then breaks.
        </p>
      </>
    ),
  },
  {
    title: "give it your own account too",
    schema:
      "Point it at your own channel or profile so the advice is tailored to your audience rather than generic.",
    body: (
      <>
        <p>
          this is the step that turns generic advice into advice. give it your
          own channel, instagram or linkedin and ask it to read every post you
          have made and how each one did.
        </p>
        <p>
          it matters because <strong>the algorithm punishes going off
          topic.</strong> if i post the best fitness video ever made, it tanks,
          because my audience did not come for that. advice that ignores who
          already follows you is advice for somebody else&apos;s account.
        </p>
      </>
    ),
  },
  {
    title: "ask for outliers, not averages",
    schema:
      "Ask it to find videos that beat their own channel's average, so the report studies breakouts rather than baseline performance.",
    body: (
      <>
        <p>
          the specific thing worth asking for: videos that performed{" "}
          <strong>far above average for their own channel</strong>. mine found
          over 400 of them across nearly 2,000 videos.
        </p>
        <p>
          a big channel&apos;s normal video tells you what a big channel gets. a
          video that beat its own channel by five times tells you something
          about the idea, and the idea is the transferable part.
        </p>
      </>
    ),
  },
  {
    title: "ask for it as a report you can navigate",
    schema:
      "Ask for the output as an HTML report with charts and sections rather than as terminal text.",
    body: (
      <>
        <p>
          ask for html with sections and charts. this is a document you will
          come back to for months, and a wall of terminal output is not that.
        </p>
      </>
    ),
  },
  {
    title: "then iterate, out loud, about ten times",
    schema:
      "Read the first report, dictate detailed feedback about what it got wrong, and regenerate. Expect around ten rounds.",
    body: (
      <>
        <p>
          this is the whole ballgame and it has its own section below. the first
          report will be mediocre. read it, tell it exactly what is wrong, run
          it again.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "how many competitor videos should i analyse",
    a: "As many as your niche has. I analysed nearly 2,000 videos across a year, totalling about 90 million views, and it found over 400 outliers. The cost of analysing more is small and the value of a pattern that holds across many channels is high, because a pattern you see once is a coincidence.",
  },
  {
    q: "what is an outlier video and why does it matter",
    a: "A video that performed far above the average for its own channel. That control is what makes it useful: a big channel's normal video tells you what a big channel gets, but a video that beat its own baseline five times over tells you something about the idea itself, and the idea is the part you can borrow.",
  },
  {
    q: "what is the ICE score",
    a: "Impact times confidence times ease, each rated one to ten. It turns twenty pieces of advice into a ranked list, so the thing you do first is the one that is high impact, likely to work and easy. Without it a report is twenty good suggestions you will never start, which is the same as none.",
  },
  {
    q: "can i do this for tiktok or instagram instead of youtube",
    a: "Yes. The only platform-specific part is the scraper, and Apify covers TikTok, Instagram and Facebook. For short video the thumbnail equivalent is the first three to five seconds, which is the moment someone decides to keep watching, so you send the video itself to a model that can watch it rather than reading the caption.",
  },
  {
    q: "why was the first report not good enough",
    a: "Because Claude Code knew the data and not the business. The first version drew conclusions that were wrong about my niche or so obvious I already knew them. It took about ten rounds of me reading it and dictating detailed feedback, roughly thirty minutes of talking in total, before it was genuinely useful. The model supplies the analysis, you supply the judgement.",
  },
  {
    q: "how do i give feedback faster",
    a: "Dictate it. A useful round of feedback on a long report is five minutes of talking and nobody types that. I read the report out loud, said which conclusions were wrong and why, and asked for deeper analysis in specific places. Voice is the reason ten iterations was thirty minutes and not an afternoon.",
  },
  {
    q: "what should i avoid putting in titles",
    a: "In my case, the word free. I had a video reach 95,000 views with free in the title and thumbnail, and it brought in an audience that was never going to buy anything. The report caught it and it was right. Views are not the goal on their own, so tell the report what business outcome you want and let it judge against that.",
  },
];

export default function ClaudeSocialGrowthPage() {
  return (
    <ResourcePageShell
      slug="claude-social-growth"
      repoCta={{ href: "https://claude.com/claude-code", label: "get claude code", icon: DOWNLOAD_ICON }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="claude code for social media growth"
      subhead="analyze thousands of competitor videos, find the ones that truly outperform, and build a data-driven content strategy for your channel, all with claude code."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "costs", "costsScraping", "scrapingSafety"]}
      breadcrumb={[
        { name: "Claude Code", path: "/claude-code-tutorial" },
        { name: "Social media growth", path: "/claude-social-growth" },
      ]}
      howTo={{
        name: "Build a social media growth report with Claude Code",
        description:
          "Analyse every video your competitors published in a year, find the outliers, rank the actions by ICE score, and iterate the report until the advice is genuinely tailored to your account.",
        totalTime: "PT10M",
        steps: guideSteps.map((s) => ({ name: s.title, text: s.schema })),
      }}
      faq={faq}
      guide={
        <Guide>
          <GuideSection title="what the report contains">
            <p>
              i asked claude code to analyse{" "}
              <strong>nearly 2,000 videos from my competitors</strong>, about 90
              million views between them, and tell me what my niche actually
              rewards. it found over 400 outlier videos, and the result is a
              report i still open months later.
            </p>
            <p>what is in it:</p>
            <ul>
              <li>
                <strong>thumbnail analysis.</strong> every thumbnail broken into
                its parts, with frequencies: what percentage have a face, which
                anchor elements repeat, which text overlays keep showing up in
                the winners.
              </li>
              <li>
                <strong>title and hook patterns</strong>, pulled from the actual
                transcripts rather than from the titles alone.
              </li>
              <li>
                <strong>niche trend lines.</strong> which topics are rising,
                which have peaked, which are quietly stable.
              </li>
              <li>
                <strong>an underserved-topic chart.</strong> the most useful
                page in the whole thing, described below.
              </li>
              <li>
                <strong>audience desires, ranked.</strong> what people in this
                niche actually want, in order.
              </li>
              <li>
                <strong>about twenty actions, ICE scored</strong> so you know
                what to do on monday.
              </li>
              <li>
                <strong>a what-to-avoid section</strong>, which caught a real
                mistake i had been making.
              </li>
            </ul>
            <p>
              this is a month of work for a person. it is not a month of work
              for a machine that can read every transcript.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="the ICE score, which is why it is usable">
            <p>
              a report with twenty recommendations in it is a report you will not
              act on. so every action gets scored on three axes, one to ten,
              multiplied together:
            </p>
            <KeyFacts
              rows={[
                { label: "impact", value: "impact on views, subscribers and conversions" },
                { label: "confidence", value: "how confident we are that the pattern generalises, rather than being one creator's quirk" },
                { label: "ease", value: "how easy it is to ship in your next video" },
                { label: "score", value: "the three multiplied, each rated 1 to 10, so 1,000 is a perfect ten on all three" },
              ]}
              caption="the report's own wording. tips are sorted by score, so the list picks itself: start at the top and ship one per video."
            />
            <p>
              multiplying rather than adding is the right call, because it
              punishes a zero. a brilliant idea you are not confident in, or
              that would take three months, drops down the list where it belongs.
            </p>
            <p>
              the top item on my report scored 1,000, a perfect ten on all
              three. here it is, because it is more useful than any description
              of the method:
            </p>
            <Callout title="tip 01, scored 1,000">
              <p>
                <strong>lead with a specific revenue or proof number in the
                first 15 seconds. every single mega-outlier does this.</strong>
              </p>
              <p>
                the evidence it gave: &quot;generated over $5 million in
                revenue&quot; on a 2 million view video, &quot;94% profit
                margins&quot; on a million, &quot;$72,000 a month&quot;, &quot;$4
                million a year in profit&quot;. not vague adjectives. specific
                dollars.
              </p>
              <p>
                and then it turned that on me: i have real numbers i was
                underusing, and i was burying them. <strong>the credential line
                is the hook.</strong>
              </p>
            </Callout>
            <p>
              that is the shape of a good output. not &quot;improve your
              hooks&quot;, which is advice. a pattern, the evidence for it
              across several channels, and the specific thing i personally was
              getting wrong.
            </p>
          </GuideSection>

          <GuideSection title="the underserved-topic chart">
            <p>
              one chart plots <strong>average views against how many videos
              exist</strong> for each topic. the top-left corner, high demand
              and low supply, is where you want to be.
            </p>
            <p>
              in my niche that surfaced whatsapp automation: people clearly want
              it and almost nobody was making it. that is a very different piece
              of information from &quot;this topic is popular&quot;, because
              popular usually means crowded.
            </p>
            <Callout title="the reason this is hard to do by hand">
              <p>
                you can feel which topics are popular. you cannot feel supply,
                because you only see what the algorithm shows you, and the
                algorithm shows you the crowded ones. counting requires actually
                counting.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="what your audience actually wants">
            <p>
              the report ranked the desires behind the searches in my niche. in
              order:
            </p>
            <ol className="guide-list">
              <li>
                <strong>fear of being replaced.</strong> by a distance. this is
                the biggest driver in the AI niche and it is not close.
              </li>
              <li>
                <strong>making money.</strong>
              </li>
              <li>
                <strong>staying current.</strong>
              </li>
              <li>
                <strong>saving time.</strong>
              </li>
              <li>
                <strong>building something.</strong>
              </li>
              <li>
                <strong>going viral.</strong> last, which surprised me, since
                that is what half the content in this space is about.
              </li>
            </ol>
            <p>
              it also split my audience into segments and weighted them, which
              is the part that changed what i film:
            </p>
            <ul>
              <li>
                <strong>45% automation beginners looking for templates.</strong>{" "}
                the top videos there are template databases, and they have
                &quot;free&quot; in the title. which is exactly the trap in the
                last section.
              </li>
              <li>
                <strong>30% content creators wanting viral systems.</strong>
              </li>
              <li>
                <strong>15% B2B marketers needing automation.</strong>
              </li>
              <li>
                <strong>10% AI SaaS builders.</strong> and it noted that build
                vlogs consistently underperform for them.
              </li>
            </ul>
            <p>
              those are four different videos. knowing which one you are making,
              and that the largest group is not the group you most want, is the
              difference between a video that works and one aimed at nobody in
              particular.
            </p>
          </GuideSection>

          <GuideSection title="building it">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="the secret that made it five times better">
            <p>
              i have to be honest about this, because it is the part that gets
              left out of videos like mine.{" "}
              <strong>the first report was not good.</strong>
            </p>
            <p>
              some conclusions were wrong about my niche. more of them were
              things i already knew, said confidently, which is worse than
              useless because it feels like insight. i read it and thought: this
              is not it.
            </p>
            <p>
              what got it to the version i still use was{" "}
              <strong>about ten rounds of feedback</strong>, dictated rather
              than typed. i read the report and talked back at it for a few
              minutes each round: this conclusion is wrong and here is why, go
              deeper on this channel, you have not understood my audience, that
              part is obvious, give me something better. maybe thirty minutes of
              talking in total.
            </p>
            <Callout title="why it needs you, put another way">
              <p>
                if you asked the best operator you know for business advice, five
                minutes would get you nothing useful, because they do not know
                your situation. a day with them would change your business. the
                model is the same. it has the data and none of your context, and
                the only way to transfer context is to spend the time.
              </p>
            </Callout>
            <p>
              dictate the feedback. a real round is five minutes of talking, and
              nobody types five minutes of nuance. that is the entire reason ten
              iterations took half an hour instead of an afternoon.
            </p>
          </GuideSection>

          <GuideSection title="what to avoid, including one that cost me">
            <p>
              the report has a what-to-avoid section, and it caught something i
              had been doing wrong for months.
            </p>
            <p>
              i had a video reach 95,000 views with <strong>the word
              &quot;free&quot;</strong> in the title and the thumbnail. great
              number. it brought in an audience that was never going to buy
              anything, and it taught the algorithm to send me more of them.
              claude&apos;s note was blunt: stop putting free in your titles, it
              builds the wrong association.
            </p>
            <p>it was right, and i would not have worked it out on my own.</p>
            <p>the general lesson, and the reason it found it:</p>
            <ul>
              <li>
                <strong>tell the report what business outcome you
                want</strong>, not just that you want views. views and revenue
                are different targets and sometimes they point in opposite
                directions.
              </li>
              <li>
                <strong>give it your own numbers</strong>, so it can see which
                of your videos brought the right people rather than the most
                people.
              </li>
              <li>
                <strong>ask what to stop doing.</strong> reports default to
                suggestions. the subtractions are usually worth more.
              </li>
            </ul>
            <p>
              once you know what to make, the making half is on{" "}
              <a href="/claude-content">the content guide</a>, and the
              short-video versions are on{" "}
              <a href="/claude-reels">reels</a> and{" "}
              <a href="/claude-tiktok">tiktok</a>. never used claude code?{" "}
              <a href="/claude-code-tutorial">start here</a>, and{" "}
              <a href="/claude-code-pricing">this is what it costs</a>.
            </p>
          </GuideSection>
        </Guide>
      }
      jsonLd={{
        title: "AI Social Media Growth with Claude Code",
        description: "Analyze thousands of competitor videos, find the standout performers, and build a data-driven content strategy for YouTube, Instagram, and TikTok growth.",
        url: "https://oleg.ae/claude-social-growth",
        datePublished: "2026-05-12",
        dateModified: "2026-08-27",
      }}
      boldaneCta={
        <>
          want this outcome without running the system yourself? that is what{" "}
          <BoldaneLink /> does: founders talk for one hour a week, and a real
          team turns what they said into a LinkedIn presence their market
          trusts and buys from.
        </>
      }
    />
  );
}
