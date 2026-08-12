import "./page.css";
import { PAGE_HTML } from "./content";
import { ArticleJsonLd } from "@/components/json-ld";

// Companion page to the YouTube video on how the creator of Claude Code uses AI.
//
// GENERATED from the vault: areas/youtube_videos/2026-08-02_boris_cherny/
// web/slides.html, by that folder's scripts/10_port_deck_to_site.py. That copy
// is the source of truth — change this file by hand and the next port
// overwrites you.
//
// It is a DECK, not an article. Oleg screen-records it full screen at 16:9 and
// steps through it one principle at a time, so each of the eleven slides holds
// four things and nothing else: the number, the rule in one line, the visual,
// and an empty bottom-right rectangle where his face goes. The verbatim quotes
// and timecode citations this route used to carry are things he says out loud;
// they are still in the vault's web/index.html and in git history.
//
// No client JavaScript and no scroll reveal, same reason as /elon-musk-ai and
// /claude-riemann-hypothesis: the site's Reveal starts elements hidden, and a
// fast programmatic scroll outruns the observer and leaves a band blank for a
// beat. Invisible to a reader, fatal on camera.

const PUBLISHED = "2026-08-07T00:00:00Z";
const MODIFIED = "2026-08-12T00:00:00Z";

export default function BorisChernyAiPage() {
  return (
    <>
      <ArticleJsonLd
        title="10 Things The Creator Of Claude Code Actually Does With AI"
        description="Ten rules from the creator of Claude Code, one to a slide, read out of 27 interviews and 1,346 of his posts."
        url="https://oleg.ae/boris-cherny-ai"
        datePublished={PUBLISHED}
        dateModified={MODIFIED}
      />
      <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
    </>
  );
}
