/**
 * Videos in the corpus whose owner has disabled embedding.
 *
 * These are live and public on YouTube, but they refuse to play inside an
 * iframe, so the SourceCard's inline player renders YouTube's grey "Video
 * unavailable" panel instead of the clip. Every one of them is an Alex Hormozi
 * video, and Hormozi is the highest-ranked expert in the corpus, so these are
 * exactly the cards most likely to be shown and tapped.
 *
 * An iframe that refuses to load cannot be detected from the page (no error
 * event crosses the origin boundary), so this has to be a precomputed list.
 *
 * To regenerate, ask YouTube's oembed endpoint about every video id in
 * src/app/marketing-brain-knowledge/data.ts. 200 means embeddable, 401 means
 * embedding is disabled, 403 means private or removed:
 *
 *   grep -oE 'id: "[A-Za-z0-9_-]{11}"' src/app/marketing-brain-knowledge/data.ts \
 *     | grep -oE '[A-Za-z0-9_-]{11}"$' | tr -d '"' | sort -u \
 *     | while read -r id; do
 *         printf '%s %s\n' \
 *           "$(curl -s -o /dev/null -w '%{http_code}' \
 *              "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=$id&format=json")" \
 *           "$id"
 *       done | sort
 *
 * Last checked 2026-08-12: 65 of 75 embeddable, these 10 not.
 */
export const NO_EMBED_VIDEO_IDS = new Set([
  "7ITff1fIbSc",
  "HxEQCHpZzHk",
  "JE2_7elAcxM",
  "Mst4hreQYl0",
  "RVbvhPGFi6E",
  "StVqS0jD7Ls",
  "cy2k1GdA-9o",
  "dMZ-n2KSlxE",
  "uWdIgftpvBI",
  "w7g08dVTwaE",
]);

/** True when this video must be opened on YouTube instead of embedded. */
export function mustOpenOnYouTube(videoId: string | undefined): boolean {
  return videoId ? NO_EMBED_VIDEO_IDS.has(videoId) : false;
}
