import { ResourcePageShell } from "@/components/resource-page-shell";

// The YouTube video for this page was removed from the channel (the id
// Iew4mx03C3s now 403s), so this page renders no facade and no video schema,
// matching the other four pages whose source video is gone. See CLAUDE.md.

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
          this is where you&apos;ll run claude code and build your website.
        </p>
      </div>
    ),
  },
  {
    title: "install claude code extension",
    content: (
      <div className="space-y-3">
        <p>
          open VS Code, go to the extensions panel on the left sidebar, and
          search for &quot;Claude Code&quot;. install the extension.
        </p>
        <p>
          claude code costs $19/mo. it gives you an AI coding agent right
          inside your editor that can build entire projects from a description.
        </p>
      </div>
    ),
  },
  {
    title: "download the starter template",
    content: (
      <div className="space-y-3">
        <p>
          grab the free starter template from the{" "}
          <a
            href="https://www.skool.com/ai-automation-7100/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            free skool community
          </a>
          .
        </p>
        <p>
          download it, unzip, and open the folder in VS Code (File → Open
          Folder).
        </p>
      </div>
    ),
  },
  {
    title: "describe your website to claude",
    content: (
      <div className="space-y-4">
        <p>
          open the terminal in VS Code (Terminal → New Terminal), type{" "}
          <code className="rounded bg-vivid-blue/15 px-1.5 py-0.5 font-mono text-sm text-silver">
            claude
          </code>
          , and describe what you want.
        </p>
        <p>
          tell it who you are, what you do, and what sections to include: hero,
          about, results, social links. claude code builds the full site from
          your description.
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-5 text-[15px] leading-relaxed text-silver italic">
          &quot;Build me a personal website. I&apos;m [your name], I do [what
          you do]. Include a hero section with my tagline and photo, an about
          section, a results/stats section, and social links at the bottom.&quot;
        </div>
      </div>
    ),
  },
  {
    title: "customize the design",
    content: (
      <div className="space-y-3">
        <p>
          tell claude code to adjust colors, fonts, layout, and add animations.
          iterate in plain english until it looks right.
        </p>
        <div className="rounded-lg surface-raised border border-hairline p-5 text-[15px] leading-relaxed text-silver italic">
          &quot;Make the background darker, use a more modern font, and add
          smooth fade-in animations as sections scroll into view.&quot;
        </div>
        <p>
          no design skills needed. just describe the vibe you want and claude
          code handles the rest.
        </p>
      </div>
    ),
  },
  {
    title: "add your content",
    content: (
      <div className="space-y-3">
        <p>
          provide your photo, bio, social links, testimonials, and stats. claude
          code places everything in the right spots.
        </p>
        <p>
          drop your images into the project folder and tell claude where to use
          them. update text by simply telling it what to change.
        </p>
      </div>
    ),
  },
  {
    title: "deploy to vercel",
    content: (
      <div className="space-y-3">
        <p>
          sign up at{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            vercel.com
          </a>{" "}
          (free tier available). connect your github repo and deploy with one
          click.
        </p>
        <p>your site goes live instantly with a vercel URL.</p>
      </div>
    ),
  },
  {
    title: "connect your domain",
    content: (
      <div className="space-y-3">
        <p>
          buy a domain from namecheap, google domains, or any registrar. then in
          your vercel dashboard, go to Settings → Domains and add your domain.
        </p>
        <p>
          update the DNS records as shown in vercel, usually just an A record
          and CNAME. your site will be live on your custom domain within minutes.
        </p>
      </div>
    ),
  },
  {
    title: "level up: extra tips",
    content: (
      <div className="space-y-4">
        <p>once your site is live, here are 4 ways to take it further:</p>
        <div className="space-y-3">
          <div>
            <p className="text-silver font-medium">
              a) add analytics
            </p>
            <p className="mt-1">
              set up{" "}
              <a
                href="https://plausible.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                plausible
              </a>{" "}
              or google analytics to track visitors and see where your traffic
              comes from.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              b) optimize for SEO
            </p>
            <p className="mt-1">
              add meta tags, a sitemap, and structured data so search engines
              find and rank your site.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              c) add resource pages
            </p>
            <p className="mt-1">
              create companion pages for your youtube videos to drive traffic
              from search to your site.
            </p>
          </div>
          <div>
            <p className="text-silver font-medium">
              d) keep iterating with claude code
            </p>
            <p className="mt-1">
              want to change something? just describe the change in plain
              english. no need to touch code yourself.
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function ClaudeWebsitePage() {
  return (
    <ResourcePageShell
      slug="claude-website"
      title="build your personal website with claude code"
      subhead="build a polished personal website with claude code, the kind that actually looks designed. describe what you want, refine it in plain english, and deploy it live on your own domain."
      steps={steps}
      troubleshooting={["claudeNotFound", "crAlias", "costs"]}
      jsonLd={{
        title: "Build a Website with AI Using Claude Code",
        description: "Build a professional personal website from scratch with Claude Code in under 30 minutes. No design skills needed.",
        url: "https://oleg.ae/claude-website",
        datePublished: "2026-05-12",
        dateModified: "2026-05-13",
      }}
      boldaneCredit
    />
  );
}
