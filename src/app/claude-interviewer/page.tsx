import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";


const steps = [
  {
    title: "install claude code",
    content: (
      <div className="space-y-3">
        <p>
          you can use claude code in the terminal, as a VS Code extension, or in
          the browser at{" "}
          <a
            href="https://claude.ai/code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            claude.ai/code
          </a>
          .
        </p>
        <p>
          you&apos;ll need a Claude Code subscription at $19/mo. this gives you
          access to claude&apos;s coding agent that can build apps, write
          scripts, and automate workflows.
        </p>
      </div>
    ),
  },
  {
    title: "set up your personal context file",
    content: (
      <div className="space-y-3">
        <p>
          create a file called{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            CLAUDE.md
          </code>{" "}
          in your project folder. this is where you tell claude everything about
          you: your expertise, your business, your audience, and your content
          goals.
        </p>
        <p>
          the more context you give, the better the interview questions and the
          final content will be. include your niche, your unique angle, and
          examples of posts you like.
        </p>
      </div>
    ),
  },
  {
    title: "create your voice agent on ElevenLabs",
    content: (
      <div className="space-y-3">
        <p>
          go to{" "}
          <a
            href="https://elevenlabs.io/app/agents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            elevenlabs.io/app/agents
          </a>{" "}
          and create a new agent using the blank template. this is the
          AI interviewer that will talk to you naturally via voice.
        </p>
        <p>configure two things in the Agent tab:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              first message{" "}
              <span className="font-normal text-silver-muted">
                (what the agent says when the conversation starts)
              </span>
            </p>
            <p className="mt-1">
              something like: &quot;hey, let&apos;s talk about what&apos;s been
              going on in your business lately. what&apos;s top of mind for you
              right now?&quot;
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              system prompt{" "}
              <span className="font-normal text-silver-muted">
                (tells the agent how to behave)
              </span>
            </p>
            <p className="mt-1">
              instruct it to interview you about your expertise, ask follow-up
              questions, dig into stories and unique insights, and keep the
              conversation natural, like talking to a friend.
            </p>
          </div>
        </div>
        <p>
          pick a voice you like from the Voice tab, then hit{" "}
          <span className="text-silver">&quot;Test AI agent&quot;</span> to try it
          out.
        </p>
      </div>
    ),
  },
  {
    title: "add your copywriting system",
    content: (
      <div className="space-y-4">
        <p>
          train claude on proven copywriting techniques for your platform.
          provide examples of viral posts in your niche and explain what makes
          them work.
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              viral hooks{" "}
              <span className="font-normal text-silver-muted">
                (opening lines that stop the scroll)
              </span>
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              storytelling frameworks{" "}
              <span className="font-normal text-silver-muted">
                (structures that keep people reading)
              </span>
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              platform-specific formatting{" "}
              <span className="font-normal text-silver-muted">
                (line breaks, emojis, CTAs optimized for LinkedIn)
              </span>
            </p>
          </div>
        </div>
        <p>
          here&apos;s the key: the interview gives you raw authentic material, and the
          copywriting system shapes it into a post that performs.
        </p>
      </div>
    ),
  },
  {
    title: "add your personal image library",
    content: (
      <div className="space-y-3">
        <p>
          upload a library of your personal photos: headshots, behind-the-scenes
          shots, event photos, workspace pics. the system picks the most relevant
          image for each post.
        </p>
        <p>
          posts with real personal images massively outperform generic AI
          visuals. authenticity is the competitive advantage.
        </p>
      </div>
    ),
  },
  {
    title: "run the interview and generate content",
    content: (
      <div className="space-y-3">
        <p>
          start a conversation with your ElevenLabs agent. spend 10-15 minutes
          just talking naturally, while cooking, walking, or during your morning
          routine.
        </p>
        <p>
          when you&apos;re done, go to the{" "}
          <span className="text-silver">Call history</span> tab in the ElevenLabs
          dashboard to grab the full transcript. feed it to claude code along
          with your copywriting system. claude extracts the best content angles,
          applies your techniques, pairs it with a personal image, and produces a
          ready-to-post piece.
        </p>
      </div>
    ),
  },
  {
    title: "the simple alternative: claude voice mode",
    content: (
      <div className="space-y-3">
        <p>
          don&apos;t want to build the full system? use Claude&apos;s built-in
          voice mode as a starting point:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            open Claude and give it context about your business and content goals
          </li>
          <li>
            ask it to interview you with great questions for LinkedIn content
          </li>
          <li>
            answer via voice notes or just type your responses naturally
          </li>
          <li>
            then ask claude to turn the conversation into a LinkedIn post
          </li>
        </ul>
        <p>
          it won&apos;t be as polished as the full automated system, but
          it&apos;s a great way to start producing authentic content with minimal
          effort.
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-3">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            interview yourself about different topics each session: business
            updates, industry insights, personal stories, lessons learned
          </li>
          <li>
            use WhisperFlow for quick voice-to-text if you prefer a chat-based
            workflow
          </li>
          <li>
            build a content calendar: one 12-minute interview can produce
            multiple posts across platforms
          </li>
          <li>
            the key insight: authentic content from real experience beats
            generic AI content every single time
          </li>
        </ul>
      </div>
    ),
  },
];

export default function ClaudeInterviewerPage() {
  return (
    <ResourcePageShell
      slug="claude-interviewer"
      title="an AI interviewer that turns your expertise into content"
      subhead="build a voice AI agent that interviews you about your work, then shapes the conversation into ready-to-post linkedin content. you talk, it writes. the ideas stay yours."
      steps={steps}
      troubleshooting={["claudeNotFound", "costs"]}
      jsonLd={{
        title: "An AI Interviewer That Turns Your Expertise Into Content",
        description:
          "Build an AI voice interviewer that turns a real conversation about your work into ready-to-post LinkedIn content. You talk, it writes, the ideas stay yours.",
        url: "https://oleg.ae/claude-interviewer",
        datePublished: "2026-05-17",
        dateModified: "2026-05-17",
      }}
      boldaneCta={
        <>
          this interviewer is the do-it-yourself version of how <BoldaneLink />{" "}
          works. our clients talk for one hour a week, and a real team shapes
          what they said into a LinkedIn presence their market trusts and buys
          from. if you would rather skip the setup and the upkeep, that is
          exactly what we do.
        </>
      }
    />
  );
}
