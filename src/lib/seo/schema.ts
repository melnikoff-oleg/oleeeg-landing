// Every piece of structured data the site emits, as pure functions.
//
// They are pure and live outside the components on purpose: schema is the one
// part of SEO that is machine-checked (Search Console reports it as errors, not
// as a ranking guess), so it is the part worth unit-testing. The components in
// json-ld.tsx are thin wrappers that stringify what these return.
//
// One rule runs through all of it: never assert something Google can go and
// check. A VideoObject for a private video, an FAQPage with no questions, a
// HowTo for a page that is not a how-to. Each of those is a penalty risk in
// exchange for nothing.

export const SITE_URL = "https://oleg.ae";

// The profiles Oleg actively points people at, checked against his own YouTube
// descriptions on 2026-08-27: linkedin.com/in/olegane appears in all 24 live
// videos, instagram.com/oleg_tech and tiktok.com/@oleg_tech in 20 of them, and
// instagram.com/melnikoff_oleg only in the four oldest. `sameAs` is what tells
// Google these accounts are one person, so a handle that is wrong here actively
// merges his entity with somebody else's. connect-section.tsx links the same
// set: if you change one, change both.
const SAME_AS = [
  "https://www.youtube.com/@Oleg-Melnikov",
  "https://www.linkedin.com/in/olegane",
  "https://www.instagram.com/oleg_tech",
  "https://www.tiktok.com/@oleg_tech",
  "https://t.me/melnikoff_oleg",
  "https://boldane.com",
];

const PERSON_ID = `${SITE_URL}/#person`;

/** The author block, shared by every Article so the entity never forks. */
function author() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Oleg Melnikov",
    url: SITE_URL,
    sameAs: SAME_AS,
  };
}

export type ArticleInput = {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  /** Omit when the source video is private or removed. */
  videoId?: string;
  videoTitle?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function articleSchema(input: ArticleInput): any {
  const { title, description, url, datePublished, dateModified, videoId, videoTitle } = input;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: author(),
    publisher: author(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(videoId
      ? {
          video: {
            "@type": "VideoObject",
            name: videoTitle ?? title,
            description,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            uploadDate: datePublished,
            contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
          },
        }
      : {}),
  };
}

export type FaqEntry = { q: string; a: string };

/**
 * Returns null for an empty list rather than an FAQPage with no questions,
 * which Search Console reports as an error. Callers render nothing on null.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function faqSchema(entries: FaqEntry[]): any | null {
  if (entries.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  };
}

export type HowToStep = { name: string; text: string };

/**
 * Step URLs are `#step-N`, matching the ids the guide renders, so a rich result
 * can deep-link into the step rather than dropping the reader at the top.
 */
export function howToSchema(input: {
  name: string;
  description: string;
  url: string;
  steps: HowToStep[];
  totalTime?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${input.url}#step-${i + 1}`,
    })),
  };
}

/** Home is always position 1, so callers pass only the trail below it. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function breadcrumbSchema(trail: { name: string; path: string }[]): any {
  const items = [{ name: "Home", path: "" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function personSchema(): any {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Oleg Melnikov",
    url: SITE_URL,
    jobTitle: "AI software entrepreneur",
    description:
      "AI software entrepreneur. Former Yandex and JetBrains engineer and quant at a hedge fund, now building AI systems for marketing and teaching them on YouTube.",
    sameAs: SAME_AS,
    knowsAbout: [
      "Claude Code",
      "Claude Cowork",
      "AI systems for marketing",
      "content automation",
      "B2B outreach automation",
    ],
    worksFor: { "@type": "Organization", name: "Boldane", url: "https://boldane.com" },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function websiteSchema(): any {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Oleg Melnikov",
    description: "Free guides for running marketing with Claude Code and Claude Cowork.",
    publisher: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}
