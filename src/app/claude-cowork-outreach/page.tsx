import { ResourcePageShell } from "@/components/resource-page-shell";
import { BoldaneLink } from "@/components/boldane-cta";
import { DOWNLOAD_ICON } from "@/components/repo-cta";

const VIDEO_ID = "QoiFASDh8J8";
const VIDEO_TITLE = "Claude Cowork for Cold Outreach";

const steps = [
  {
    title: "install claude cowork",
    content: (
      <div className="space-y-3">
        <p>
          claude cowork is a desktop tool from Anthropic that controls your
          computer. download it from{" "}
          <a
            href="https://claude.ai/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            claude.ai/download
          </a>
          .
        </p>
        <p>
          it connects to your desktop and can perform tasks on your behalf.
        </p>
      </div>
    ),
  },
  {
    title: "set up your linkedin profile",
    content: (
      <div className="space-y-3">
        <p>
          make sure your LinkedIn profile is optimized before outreach.
          professional photo, clear headline, and a compelling about section.
        </p>
        <p>
          claude cowork will be sending connections from your profile, so first
          impressions matter.
        </p>
      </div>
    ),
  },
  {
    title: "get leads with apify (free)",
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
          </a>
          . the free tier gives you 5,000 leads/month.
        </p>
        <p>
          use LinkedIn scraper actors to find prospects matching your ICP:
          filter by industry, role, location, and company size.
        </p>
      </div>
    ),
  },
  {
    title: "define your outreach strategy",
    content: (
      <div className="space-y-3">
        <p>
          decide what value you&apos;ll provide in each message. not generic
          &quot;let&apos;s connect&quot;, but something useful: a content
          audit, improved banner, industry insight.
        </p>
        <p>
          tell claude cowork your service and ideal message structure so it knows
          how to craft personalized outreach.
        </p>
      </div>
    ),
  },
  {
    title: "run live outreach",
    content: (
      <div className="space-y-3">
        <p>
          open claude cowork, give it a LinkedIn profile URL, and tell it to
          research the prospect and craft a personalized message.
        </p>
        <p>
          it browses LinkedIn, reads their posts, understands their business, and
          writes a tailored message with a value piece.
        </p>
      </div>
    ),
  },
  {
    title: "send at scale",
    content: (
      <div className="space-y-3">
        <p>
          feed claude cowork a list of prospect URLs. it processes each one:
          visits their profile, analyzes their content, generates a personalized
          message, and sends the connection request with the message attached.
        </p>
      </div>
    ),
  },
  {
    title: "manage conversations",
    content: (
      <div className="space-y-3">
        <p>
          when prospects reply, claude cowork can help you continue the
          conversation and funnel toward booking a call.
        </p>
        <p>
          keep it personal: use AI for research and drafting, but review before
          sending.
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-3">
        <ul className="list-disc space-y-2 pl-5">
          <li>always lead with value, never generic pitches</li>
          <li>
            personalize visuals with prospect&apos;s branding using{" "}
            <a
              href="https://kie.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              Kie.ai
            </a>
          </li>
          <li>follow up after 3-5 days if no reply</li>
          <li>track reply rates and refine your messaging weekly</li>
        </ul>
      </div>
    ),
  },
];

export default function ClaudeCoworkOutreachPage() {
  return (
    <ResourcePageShell
      slug="claude-cowork-outreach"
      repoCta={{ href: "https://claude.ai/download", label: "download claude cowork", icon: DOWNLOAD_ICON }}
      videoId={VIDEO_ID}
      videoTitle={VIDEO_TITLE}
      title="claude cowork for cold outreach (b2b sales)"
      subhead="claude cowork browses linkedin, researches each prospect, writes a personalized message, and sends the connection. you handle the relationships that matter while it does the groundwork."
      steps={steps}
      troubleshooting={["linkedinBan", "claudeNotFound", "costs"]}
      jsonLd={{
        title: "Claude Cowork for Cold Outreach: AI LinkedIn Automation",
        description:
          "Use Claude Cowork to automate LinkedIn cold outreach. Research prospects, write personalized messages, and send connection requests on autopilot.",
        url: "https://oleg.ae/claude-cowork-outreach",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCta={
        <>
          one thing makes every outreach system convert better: before anyone
          replies, they check your LinkedIn profile. if it shows a real
          expert, reply rates climb. <BoldaneLink /> builds that presence for
          founders, from one hour of talking a week.
        </>
      }
    />
  );
}
