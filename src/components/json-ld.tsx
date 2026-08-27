// Thin render wrappers over the pure builders in src/lib/seo/schema.ts.
// The logic (and the unit tests) live there; these only stringify.

import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  personSchema,
  websiteSchema,
  type ArticleInput,
  type FaqEntry,
  type HowToStep,
} from "@/lib/seo/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Ld({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd(props: ArticleInput) {
  return <Ld data={articleSchema(props)} />;
}

/** Renders nothing for an empty list: an FAQPage with no questions is an error. */
export function FaqJsonLd({ entries }: { entries: FaqEntry[] }) {
  const data = faqSchema(entries);
  return data ? <Ld data={data} /> : null;
}

export function HowToJsonLd(props: {
  name: string;
  description: string;
  url: string;
  steps: HowToStep[];
  totalTime?: string;
}) {
  return <Ld data={howToSchema(props)} />;
}

export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return <Ld data={breadcrumbSchema(trail)} />;
}

/** Homepage only: the entity every Article's author block points back at. */
export function PersonJsonLd() {
  return <Ld data={personSchema()} />;
}

export function WebSiteJsonLd() {
  return <Ld data={websiteSchema()} />;
}
