/**
 * Anchor ids for guide sections. Shared by the rendered heading and by the
 * table of contents, so a link can never point at an id that is not there.
 *
 * NFKD splits an accented letter into base + combining mark, and the
 * non-alphanumeric filter below then drops the mark, so "café" folds to "cafe"
 * rather than losing the whole word.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    // Drop the combining marks NFKD just split off. Without this they act as
    // separators and "resume" comes out as "re-sume".
    .replace(/\p{M}+/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
