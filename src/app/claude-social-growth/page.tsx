import { ResourcePageShell } from "@/components/resource-page-shell";
import {
  Answer,
  Block,
  Callout,
  Code,
  Figure,
  Guide,
  GuideSection,
  GuideSteps,
  GuideToc,
  KeyFacts,
  Out,
  Stats,
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
    title: "Install Visual Studio Code",
    content: (
      <div className="space-y-3">
        <p>
          Download and install VS Code from{" "}
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
          This is where you&apos;ll run Claude Code and manage your analysis
          projects.
        </p>
      </div>
    ),
  },
  {
    title: "Install Claude Code extension",
    content: (
      <div className="space-y-3">
        <p>
          Open VS Code, go to the Extensions tab (left sidebar), and search for{" "}
          <span className="text-silver">Claude Code</span>.
        </p>
        <p>Install it and log in with your Anthropic account.</p>
        <p>
          Claude Code needs a paid Claude plan: pro is ${usd(PLANS.pro.monthly)}/mo and is enough to
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
    title: "Pick your competitors",
    content: (
      <div className="space-y-3">
        <p>
          Identify 10-15 creators in your niche on YouTube (or
          Instagram/TikTok).
        </p>
        <p>
          Collect their channel URLs or usernames. The more competitors you
          analyze, the better the patterns Claude Code will find.
        </p>
      </div>
    ),
  },
  {
    title: "Get your Apify API key",
    content: (
      <div className="space-y-3">
        <p>
          Sign up at{" "}
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
          Claude Code uses Apify to scrape all competitor videos, thumbnails, and
          metadata automatically.
        </p>
      </div>
    ),
  },
  {
    title: "Run the analysis",
    content: (
      <div className="space-y-4">
        <p>
          Open terminal in VS Code, start Claude Code, and give it a prompt
          like:
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-5 text-base leading-relaxed text-silver [overflow-wrap:anywhere]">
          &quot;{ANALYSIS_PROMPT}&quot;
        </div>
        <CopyButton text={ANALYSIS_PROMPT} />
        <p>
          This takes 15-30 minutes depending on the volume of videos. In the
          video, we analyzed 1,906 videos from 14 competitors.
        </p>
      </div>
    ),
  },
  {
    title: "Review the report",
    content: (
      <div className="space-y-3">
        <p>
          Claude Code generates a detailed report with everything you need to
          understand what&apos;s working in your niche:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-silver-muted">
          <li>Outlier videos ranked by performance</li>
          <li>Common hooks and title patterns</li>
          <li>Thumbnail analysis</li>
          <li>Content gaps</li>
          <li>Topic clusters that perform best</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Get your personalized strategy",
    content: (
      <div className="space-y-3">
        <p>
          Tell Claude Code about your channel and ask it to create a content
          strategy based on what it found.
        </p>
        <p>
          It&apos;ll suggest video concepts, titles, thumbnail ideas, and a
          posting schedule tailored to your niche.
        </p>
      </div>
    ),
  },
  {
    title: "Level up: extra tips",
    content: (
      <div className="space-y-3">
        <ul className="list-disc space-y-2 pl-5 text-silver-muted">
          <li>
            <span className="text-silver">Re-run monthly</span> to catch new
            trends and shifts in what&apos;s working
          </li>
          <li>
            <span className="text-silver">Analyze transcript patterns</span>:{" "}
            what story structures do top videos use?
          </li>
          <li>
            <span className="text-silver">Study comment sections</span> for
            video ideas your competitors haven&apos;t covered
          </li>
          <li>
            <span className="text-silver">
              Track your own analytics
            </span>{" "}
            and feed them back to Claude Code for optimization
          </li>
        </ul>
      </div>
    ),
  },
];


const SECTIONS = [
  "What the report contains",
  "The ICE score, which is why it is usable",
  "The underserved-topic chart",
  "What your audience actually wants",
  "Building it",
  "The secret that made it five times better",
  "What to avoid, including one that cost me",
];

const guideSteps = [
  {
    title: "List your competitors from your own subscriptions",
    schema:
      "Pick the accounts in your niche you already follow and respect, and give the whole list to Claude Code.",
    body: (
      <>
        <p>
          I went through my own YouTube subscriptions and picked everyone
          serious in my niche. No clever sourcing. The accounts you already
          follow are the accounts you already judged worth following.
        </p>
        <p>
          Give Claude Code the list and ask it to analyse every video they
          published in the last year. Mine came to nearly 2,000.
        </p>
      </>
    ),
  },
  {
    title: "Connect Apify and scrape everything, not just the numbers",
    schema:
      "Add an Apify key and scrape titles, view counts, thumbnails and full transcripts, not just the metrics.",
    body: (
      <>
        <p>
          <Out href="https://apify.com">Apify</Out> is what makes the depth
          possible. one API key in the project and claude code can pull youtube,
          tiktok, instagram, facebook and google trends.
        </p>
        <p>
          <strong>Ask for the thumbnails and the transcripts, not just the
          view counts.</strong> This is the difference between a report about
          numbers and a report about why things worked. The transcripts are
          where the hook patterns are.
        </p>
        <p>
          And do not ask Claude Code to scrape those sites directly. Platforms
          block it, so it half works and then breaks.
        </p>
      </>
    ),
  },
  {
    title: "Give it your own account too",
    schema:
      "Point it at your own channel or profile so the advice is tailored to your audience rather than generic.",
    body: (
      <>
        <p>
          This is the step that turns generic advice into advice. Give it your
          own channel, Instagram or LinkedIn and ask it to read every post you
          have made and how each one did.
        </p>
        <p>
          It matters because <strong>the algorithm punishes going off
          topic.</strong> If I post the best fitness video ever made, it tanks,
          because my audience did not come for that. Advice that ignores who
          already follows you is advice for somebody else&apos;s account.
        </p>
      </>
    ),
  },
  {
    title: "Ask for outliers, not averages",
    schema:
      "Ask it to find videos that beat their own channel's average, so the report studies breakouts rather than baseline performance.",
    body: (
      <>
        <p>
          The specific thing worth asking for: videos that performed{" "}
          <strong>far above average for their own channel</strong>. Mine found
          over 400 of them across nearly 2,000 videos.
        </p>
        <p>
          A big channel&apos;s normal video tells you what a big channel gets. A
          video that beat its own channel by five times tells you something
          about the idea, and the idea is the transferable part.
        </p>
      </>
    ),
  },
  {
    title: "Ask for it as a report you can navigate",
    schema:
      "Ask for the output as an HTML report with charts and sections rather than as terminal text.",
    body: (
      <>
        <p>
          Ask for HTML with sections and charts. This is a document you will
          come back to for months, and a wall of terminal output is not that.
        </p>
      </>
    ),
  },
  {
    title: "Then iterate, out loud, about ten times",
    schema:
      "Read the first report, dictate detailed feedback about what it got wrong, and regenerate. Expect around ten rounds.",
    body: (
      <>
        <p>
          This is the whole ballgame and it has its own section below. The first
          report will be mediocre. Read it, tell it exactly what is wrong, run
          it again.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    q: "How many competitor videos should I analyse",
    a: "As many as your niche has. I analysed nearly 2,000 videos across a year, totalling about 90 million views, and it found over 400 outliers. The cost of analysing more is small and the value of a pattern that holds across many channels is high, because a pattern you see once is a coincidence.",
  },
  {
    q: "What is an outlier video and why does it matter",
    a: "A video that performed far above the average for its own channel. That control is what makes it useful: a big channel's normal video tells you what a big channel gets, but a video that beat its own baseline five times over tells you something about the idea itself, and the idea is the part you can borrow.",
  },
  {
    q: "What is the ICE score",
    a: "Impact times confidence times ease, each rated one to ten. It turns twenty pieces of advice into a ranked list, so the thing you do first is the one that is high impact, likely to work and easy. Without it a report is twenty good suggestions you will never start, which is the same as none.",
  },
  {
    q: "Can I do this for TikTok or Instagram instead of YouTube",
    a: "Yes. The only platform-specific part is the scraper, and Apify covers TikTok, Instagram and Facebook. For short video the thumbnail equivalent is the first three to five seconds, which is the moment someone decides to keep watching, so you send the video itself to a model that can watch it rather than reading the caption.",
  },
  {
    q: "Why was the first report not good enough",
    a: "Because Claude Code knew the data and not the business. The first version drew conclusions that were wrong about my niche or so obvious I already knew them. It took about ten rounds of me reading it and dictating detailed feedback, roughly thirty minutes of talking in total, before it was genuinely useful. The model supplies the analysis, you supply the judgement.",
  },
  {
    q: "How do I give feedback faster",
    a: "Dictate it. A useful round of feedback on a long report is five minutes of talking and nobody types that. I read the report out loud, said which conclusions were wrong and why, and asked for deeper analysis in specific places. Voice is the reason ten iterations was thirty minutes and not an afternoon.",
  },
  {
    q: "What should I avoid putting in titles",
    a: "In my case, the word free. I had a video reach 95,000 views with free in the title and thumbnail, and it brought in an audience that was never going to buy anything. The report caught it and it was right. Views are not the goal on their own, so tell the report what business outcome you want and let it judge against that.",
  },
];

export default function ClaudeSocialGrowthPage() {
  return (
    <ResourcePageShell
      slug="claude-social-growth"
      repoCta={{ href: "https://claude.com/claude-code", label: "Get Claude Code", icon: DOWNLOAD_ICON }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="Claude Code for social media growth"
      subhead="Analyze thousands of competitor videos, find the ones that truly outperform, and build a data-driven content strategy for your channel, all with Claude Code."
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
          <GuideSection title="What the report contains">
            <Answer>
              A ranked list of what your niche actually rewards, built from roughly 2,000 competitor videos and 400 outliers, with the evidence attached to each finding.
            </Answer>
            <Stats
              items={[
                { value: "1,906", label: "Competitor videos analysed" },
                { value: "89.8M", label: "Total views studied" },
                { value: "458", label: "Viral outliers identified" },
                { value: "14", label: "Channels taken apart" },
              ]}
            />
            <Figure
              src="/guide/growth-analytics.webp"
              alt="A YouTube Studio analytics panel showing a large jump in views"
              videoId={VIDEO_ID}
              at={80}
              caption="The number this exists to move. Everything below is the report that pointed at it."
            />
            <p>
              I asked Claude Code to analyse{" "}
              <strong>nearly 2,000 videos from my competitors</strong>, about 90
              million views between them, and tell me what my niche actually
              rewards. It found over 400 outlier videos, and the result is a
              report I still open months later.
            </p>
            <p>What is in it:</p>
            <ul>
              <li>
                <strong>Thumbnail analysis.</strong> Every thumbnail broken into
                its parts, with frequencies: what percentage have a face, which
                anchor elements repeat, which text overlays keep showing up in
                the winners.
              </li>
              <li>
                <strong>Title and hook patterns</strong>, pulled from the actual
                transcripts rather than from the titles alone.
              </li>
              <li>
                <strong>Niche trend lines.</strong> Which topics are rising,
                which have peaked, which are quietly stable.
              </li>
              <li>
                <strong>An underserved-topic chart.</strong> The most useful
                page in the whole thing, described below.
              </li>
              <li>
                <strong>Audience desires, ranked.</strong> What people in this
                niche actually want, in order.
              </li>
              <li>
                <strong>About twenty actions, ICE scored</strong> so you know
                what to do on monday.
              </li>
              <li>
                <strong>A what-to-avoid section</strong>, which caught a real
                mistake I had been making.
              </li>
            </ul>
            <p>
              This is a month of work for a person. It is not a month of work
              for a machine that can read every transcript.
            </p>
            <GuideToc sections={SECTIONS} />
          </GuideSection>

          <GuideSection title="The ICE score, which is why it is usable">
            <Figure
              src="/guide/growth-ice.webp"
              alt="One scored tip from the report, with its evidence underneath"
              videoId={VIDEO_ID}
              at={160}
              caption="Every tip carries its score and the evidence behind it, so you can disagree with one without throwing out the report."
            />
            <p>
              A report with twenty recommendations in it is a report you will not
              act on. So every action gets scored on three axes, one to ten,
              multiplied together:
            </p>
            <KeyFacts
              rows={[
                { label: "Impact", value: "Impact on views, subscribers and conversions" },
                { label: "Confidence", value: "How confident we are that the pattern generalises, rather than being one creator's quirk" },
                { label: "Ease", value: "How easy it is to ship in your next video" },
                { label: "Score", value: "The three multiplied, each rated 1 to 10, so 1,000 is a perfect ten on all three" },
              ]}
              caption="The report's own wording. Tips are sorted by score, so the list picks itself: start at the top and ship one per video."
            />
            <p>
              Multiplying rather than adding is the right call, because it
              punishes a zero. A brilliant idea you are not confident in, or
              that would take three months, drops down the list where it belongs.
            </p>
            <p>
              The top item on my report scored 1,000, a perfect ten on all
              three. Here it is, because it is more useful than any description
              of the method:
            </p>
            <Callout title="Tip 01, scored 1,000">
              <p>
                <strong>Lead with a specific revenue or proof number in the
                first 15 seconds. Every single mega-outlier does this.</strong>
              </p>
              <p>
                The evidence it gave: &quot;generated over $5 million in
                revenue&quot; on a 2 million view video, &quot;94% profit
                margins&quot; on a million, &quot;$72,000 a month&quot;, &quot;$4
                million a year in profit&quot;. Not vague adjectives. Specific
                dollars.
              </p>
              <p>
                And then it turned that on me: I have real numbers I was
                underusing, and I was burying them. <strong>The credential line
                is the hook.</strong>
              </p>
            </Callout>
            <p>
              That is the shape of a good output. Not &quot;improve your
              hooks&quot;, which is advice. A pattern, the evidence for it
              across several channels, and the specific thing I personally was
              getting wrong.
            </p>
          </GuideSection>

          <GuideSection title="The underserved-topic chart">
            <Figure
              src="/guide/growth-gaps.webp"
              alt="Two report cards, one marked falling and one marked severely underserved"
              videoId={VIDEO_ID}
              at={380}
              caption="The two labels worth acting on: what is dying, and what nobody has covered yet."
            />
            <p>
              One chart plots <strong>average views against how many videos
              exist</strong> for each topic. The top-left corner, high demand
              and low supply, is where you want to be.
            </p>
            <p>
              In my niche that surfaced whatsapp automation: people clearly want
              it and almost nobody was making it. That is a very different piece
              of information from &quot;this topic is popular&quot;, because
              popular usually means crowded.
            </p>
            <Callout title="The reason this is hard to do by hand">
              <p>
                You can feel which topics are popular. You cannot feel supply,
                because you only see what the algorithm shows you, and the
                algorithm shows you the crowded ones. Counting requires actually
                counting.
              </p>
            </Callout>
          </GuideSection>

          <GuideSection title="What your audience actually wants">
            <Figure
              src="/guide/growth-desires.webp"
              alt="A ranked bar chart of what the audience wants from the niche"
              videoId={VIDEO_ID}
              at={440}
              caption="What the audience is actually asking for, ranked. Not what you would guess."
            />
            <p>
              The report ranked the desires behind the searches in my niche. In
              order:
            </p>
            <ol className="guide-list">
              <li>
                <strong>Fear of being replaced.</strong> By a distance. This is
                the biggest driver in the AI niche and it is not close.
              </li>
              <li>
                <strong>Making money.</strong>
              </li>
              <li>
                <strong>Staying current.</strong>
              </li>
              <li>
                <strong>Saving time.</strong>
              </li>
              <li>
                <strong>Building something.</strong>
              </li>
              <li>
                <strong>Going viral.</strong> Last, which surprised me, since
                that is what half the content in this space is about.
              </li>
            </ol>
            <p>
              It also split my audience into segments and weighted them, which
              is the part that changed what I film:
            </p>
            <ul>
              <li>
                <strong>45% automation beginners looking for templates.</strong>{" "}
                The top videos there are template databases, and they have
                &quot;free&quot; in the title. Which is exactly the trap in the
                last section.
              </li>
              <li>
                <strong>30% content creators wanting viral systems.</strong>
              </li>
              <li>
                <strong>15% B2B marketers needing automation.</strong>
              </li>
              <li>
                <strong>10% AI SaaS builders.</strong> And it noted that build
                vlogs consistently underperform for them.
              </li>
            </ul>
            <p>
              Those are four different videos. Knowing which one you are making,
              and that the largest group is not the group you most want, is the
              difference between a video that works and one aimed at nobody in
              particular.
            </p>
          </GuideSection>

          <GuideSection title="Building it">
            <GuideSteps steps={guideSteps} />
          </GuideSection>

          <GuideSection title="The secret that made it five times better">
            <p>
              I have to be honest about this, because it is the part that gets
              left out of videos like mine.{" "}
              <strong>The first report was not good.</strong>
            </p>
            <p>
              Some conclusions were wrong about my niche. More of them were
              things I already knew, said confidently, which is worse than
              useless because it feels like insight. I read it and thought: this
              is not it.
            </p>
            <p>
              What got it to the version I still use was{" "}
              <strong>about ten rounds of feedback</strong>, dictated rather
              than typed. I read the report and talked back at it for a few
              minutes each round: this conclusion is wrong and here is why, go
              deeper on this channel, you have not understood my audience, that
              part is obvious, give me something better. Maybe thirty minutes of
              talking in total.
            </p>
            <Callout title="Why it needs you, put another way">
              <p>
                If you asked the best operator you know for business advice, five
                minutes would get you nothing useful, because they do not know
                your situation. A day with them would change your business. The
                model is the same. It has the data and none of your context, and
                the only way to transfer context is to spend the time.
              </p>
            </Callout>
            <p>
              Dictate the feedback. A real round is five minutes of talking, and
              nobody types five minutes of nuance. That is the entire reason ten
              iterations took half an hour instead of an afternoon.
            </p>
          </GuideSection>

          <GuideSection title="What to avoid, including one that cost me">
            <Figure
              src="/guide/growth-avoid.webp"
              alt="The report's what-to-avoid section, a list of red-flagged patterns"
              videoId={VIDEO_ID}
              at={660}
              caption="The half of the report nobody else writes: the moves the data says do not work."
            />
            <p>
              The report has a what-to-avoid section, and it caught something I
              had been doing wrong for months.
            </p>
            <p>
              I had a video reach 95,000 views with <strong>the word
              &quot;free&quot;</strong> in the title and the thumbnail. Great
              number. It brought in an audience that was never going to buy
              anything, and it taught the algorithm to send me more of them.
              Claude&apos;s note was blunt: stop putting free in your titles, it
              builds the wrong association.
            </p>
            <p>It was right, and I would not have worked it out on my own.</p>
            <p>The general lesson, and the reason it found it:</p>
            <ul>
              <li>
                <strong>Tell the report what business outcome you
                want</strong>, not just that you want views. Views and revenue
                are different targets and sometimes they point in opposite
                directions.
              </li>
              <li>
                <strong>Give it your own numbers</strong>, so it can see which
                of your videos brought the right people rather than the most
                people.
              </li>
              <li>
                <strong>Ask what to stop doing.</strong> Reports default to
                suggestions. The subtractions are usually worth more.
              </li>
            </ul>
            <p>
              Once you know what to make, the making half is on{" "}
              <a href="/claude-content">The content guide</a>, and the
              short-video versions are on{" "}
              <a href="/claude-reels">Reels</a> and{" "}
              <a href="/claude-tiktok">TikTok</a>. Never used Claude Code?{" "}
              <a href="/claude-code-tutorial">Start here</a>, and{" "}
              <a href="/claude-code-pricing">This is what it costs</a>.
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
          Want this outcome without running the system yourself? That is what{" "}
          <BoldaneLink /> does: founders talk for one hour a week, and a real
          team turns what they said into a LinkedIn presence their market
          trusts and buys from.
        </>
      }
    />
  );
}
