import "./page.css";
import { PAGE_HTML } from "./content";

// Companion page to the YouTube video on Claude Code cross-session messaging.
//
// GENERATED from the vault: areas/youtube_videos/2026-08-09_cc_session_messaging/
// web/index.html, by that folder's scripts/port_to_site.py. That copy is the
// source of truth — edit this file by hand and the next port overwrites you.
//
// Like the elon-musk-ai page, this one gets FILMED: Oleg screen-records it in
// landscape for the long video and in portrait for the Short, and narrates over
// it. So it carries titles only — every sentence he would say out loud is off
// the screen — and it ships with NO client JavaScript and no scroll reveal. A
// fast programmatic scroll outruns an IntersectionObserver and leaves a band
// blank for a beat: invisible to a reader, fatal on camera.

export default function ClaudeCodeSessionsPage() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />;
}
