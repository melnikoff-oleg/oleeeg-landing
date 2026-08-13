import "./page.css";
import { PAGE_HTML } from "./content";
import { ArticleJsonLd } from "@/components/json-ld";

// Companion page to the YouTube video on how Andrej Karpathy uses AI.
//
// GENERATED from the vault: areas/youtube_videos/2026-08-12_andrej_karpathy/
// web/slides.html, by that folder's scripts/12_port_deck_to_site.py. That copy
// is the source of truth — change this file by hand and the next port
// overwrites you.
//
// It is a DECK, not an article. Oleg screen-records it full screen at 16:9 and
// steps through it one rule at a time, so each of the twenty slides holds four
// things and nothing else: the number, the rule in one line, the visual, and an
// empty bottom-right rectangle where his face goes. The last four are marked
// BONUS. The verbatim quotes behind every rule — 47 of them, each verified as a
// substring of the transcript or post it came from — stay in the vault.
//
// No client JavaScript and no scroll reveal, same reason as /elon-musk-ai and
// /boris-cherny-ai: the site\'s Reveal starts elements hidden, and a fast
// programmatic scroll outruns the observer and leaves a band blank for a beat.
// Invisible to a reader, fatal on camera.

const PUBLISHED = "2026-08-12T00:00:00Z";
const MODIFIED = "2026-08-12T00:00:00Z";

export default function AndrejKarpathyAiPage() {
  return (
    <>
      <ArticleJsonLd
        title="14 Things Andrej Karpathy Actually Does With AI"
        description="Fourteen rules from Andrej Karpathy, one to a slide, read out of 37 interviews and 3,035 of his posts."
        url="https://oleg.ae/andrej-karpathy-ai"
        datePublished={PUBLISHED}
        dateModified={MODIFIED}
      />
      <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
    </>
  );
}
