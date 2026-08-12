import {
  Send,
  Target,
  MousePointerClick,
  MessageSquare,
  PenTool,
  Film,
  Clapperboard,
  TrendingUp,
  Search,
  Megaphone,
  Globe,
  Code,
  Mic,
  Sparkles,
  DollarSign,
  Brain,
  LayoutTemplate,
  ListOrdered,
  Gauge,
  Scissors,
  FolderTree,
  type LucideIcon,
} from "lucide-react";

export type Resource = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/**
 * The full pool of free resources. Single source of truth shared by the
 * ResourceFooter grid and the NextUp recommendation surface. When adding a new
 * resource page, add it here (and regenerate recommendations, see
 * scripts/build-recommendations.mjs).
 */
export const RESOURCES: Resource[] = [
  {
    slug: "marketing-brain",
    title: "The Marketing Brain",
    description:
      "Ask the greatest marketing minds with an AI chat grounded in 8 books & 75 talks, every answer cited to the page or timecode",
    icon: Brain,
  },
  {
    slug: "high-converting-website",
    title: "High-Converting Landing Page",
    description:
      "Build a landing page that actually sells with Claude Code, powered by a conversion playbook from Hormozi and top marketers",
    icon: LayoutTemplate,
  },
  {
    slug: "claude-outreach",
    title: "Cold Outreach",
    description:
      "Build an AI outreach system that scrapes leads and sends personalized messages",
    icon: Send,
  },
  {
    slug: "claude-b2b-outreach",
    title: "B2B Outreach (35% Reply Rate)",
    description:
      "AI-powered B2B lead gen with personalized visuals and value-first messaging",
    icon: Target,
  },
  {
    slug: "claude-cowork-outreach",
    title: "Cowork for Outreach",
    description:
      "Automate LinkedIn lead gen and cold outreach with Claude Cowork",
    icon: MousePointerClick,
  },
  {
    slug: "claude-twitter",
    title: "X/Twitter Content System",
    description:
      "Turn your expertise into a steady stream of X/Twitter content with Claude Code",
    icon: MessageSquare,
  },
  {
    slug: "claude-content",
    title: "Content Creation System",
    description:
      "Generate weeks of social media content with custom visuals from one prompt",
    icon: PenTool,
  },
  {
    slug: "claude-reels",
    title: "Viral Instagram Reels",
    description:
      "Create scroll-stopping Reels with AI-generated scripts and visuals",
    icon: Film,
  },
  {
    slug: "claude-tiktok",
    title: "Viral TikTok Videos",
    description: "Build a TikTok content engine with Claude Code and AI",
    icon: Clapperboard,
  },
  {
    slug: "claude-social-growth",
    title: "Viral Social Media Growth",
    description:
      "Scale your social presence with AI-powered content and growth tactics",
    icon: TrendingUp,
  },
  {
    slug: "claude-trend-scanner",
    title: "Trend Scanner",
    description:
      "Scan trending topics in your niche to create content worth watching",
    icon: Search,
  },
  {
    slug: "claude-marketing",
    title: "Marketing (SMM, Ads, Outreach)",
    description:
      "Set up AI-powered marketing workflows for social media, ads, and outreach",
    icon: Megaphone,
  },
  {
    slug: "claude-seo",
    title: "SEO Optimization",
    description: "SEO-optimize your website using Claude Code and AI tools",
    icon: Globe,
  },
  {
    slug: "claude-website",
    title: "Build Personal Website",
    description:
      "Build a personal website from scratch with Claude Code in minutes",
    icon: Code,
  },
  {
    slug: "claude-interviewer",
    title: "AI Interviewer for Content",
    description:
      "Build a voice AI agent that interviews you and turns conversations into LinkedIn posts",
    icon: Mic,
  },
  {
    slug: "ads-ai",
    title: "AI Ads Creator",
    description:
      "Study competitors' Meta ads with AI and generate ad concepts: copy, visuals, and video scripts",
    icon: Sparkles,
  },
  {
    slug: "60k-linkedin-post",
    title: "$60K LinkedIn Post",
    description:
      "3 AI prompts that generated $60,000 from a single LinkedIn post, copy and use them",
    icon: DollarSign,
  },
  {
    slug: "5-levels-ai",
    title: "The 5 Levels of AI Adoption",
    description:
      "A map from copy-pasting out of a chat window to a thousand agents that launch themselves, with the move to each next rung",
    icon: ListOrdered,
  },
  {
    slug: "opus-5",
    title: "Opus 5, No Hype",
    description:
      "5 rules for Claude Opus 5 straight from Anthropic's own charts: why max effort is worse, what to delete from your prompt, and which model to run per task",
    icon: Gauge,
  },
  {
    slug: "claude-code-instagram",
    title: "Claude Code as a Video Editor",
    description:
      "Reel Studio: drop your photos and a voice take in, say what you want in one sentence, get a finished Instagram Reel. Local, free, no cost per video",
    icon: Scissors,
  },
  {
    slug: "claude-code-second-brain",
    title: "AI Second Brain on Claude Code",
    description:
      "An Obsidian vault Claude Code operates: dump thoughts in plain English, it files, links and remembers. Six steps, one prompt, about 10 minutes",
    icon: FolderTree,
  },
  {
    slug: "claude-code-ads",
    title: "Video Ads With Claude Code",
    description:
      "Ads Studio: paste a company's website, get a finished video ad in their own colours, fonts and logo. Local, free per ad, no editing skills",
    icon: Clapperboard,
  },
];

/** slug -> resource, for O(1) lookup by the recommendation surface. */
export const RESOURCE_BY_SLUG: Record<string, Resource> = Object.fromEntries(
  RESOURCES.map((r) => [r.slug, r]),
);
