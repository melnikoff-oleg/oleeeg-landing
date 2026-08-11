import "./page.css";
import { PAGE_HTML } from "./content";

// Companion page to the YouTube video on Claude and the Riemann hypothesis.
//
// GENERATED from the vault: areas/youtube_videos/2026-08-11_claude_riemann/
// web/index.html, by that folder's scripts/port_to_site.py. That copy is the
// source of truth — edit this file by hand and the next port overwrites you.
//
// Like the elon-musk-ai and claude-code-sessions pages, this one gets FILMED:
// Oleg screen-records it in landscape and reads the right-hand column out loud,
// then crops that column away in the edit. On the web both columns stay, which
// is what turns it into a readable illustrated article.
//
// It ships with NO client JavaScript and no scroll reveal. A fast programmatic
// scroll outruns an IntersectionObserver and leaves a band blank for a beat:
// invisible to a reader, fatal on camera.

export default function ClaudeRiemannPage() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />;
}
