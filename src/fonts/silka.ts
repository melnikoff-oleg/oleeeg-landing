// Silka, the typeface /reels is set in.
//
// Kept out of src/app/layout.tsx deliberately. The root layout stamps Inter,
// DM Sans and Space Grotesk onto <html>, and every other page on the site is
// built against those three. Loading a fourth face there would push another
// preload into every document for the sake of one route. So Silka is exported
// as a plain module and /reels puts `silka.variable` on its own wrapper
// element, which scopes both the CSS variable and the font loading to that
// subtree. Nothing else on the site changes.
//
// The three woff2 files next to this one were taken from metacci.com and
// verified byte-identical to what that site serves. They are the whole family
// we have: there is no italic cut, and no weight outside 300/500/600, so a
// `font-bold` (700) or an `<em>` under this font will be synthesized by the
// browser rather than drawn. Design /reels in the three weights that exist.

import localFont from "next/font/local";

/**
 * The Silka family, as a scoped CSS variable.
 *
 * `variable` rather than `className` because /reels needs Silka to sit
 * alongside the site's own tokens, not replace the element's font outright.
 * Read it as `var(--font-silka)` or via an inline `fontFamily` on the wrapper.
 *
 * `display: "swap"` matches the three next/font/google calls in the root
 * layout: the text paints immediately in the fallback and reflows when Silka
 * arrives, which is the right trade for a page whose first job is to show a
 * wall of reels.
 */
export const silka = localFont({
  src: [
    {
      path: "./silka-regular.woff2",
      // 300, because that is the weight metacci declares this exact file at and
      // reels.css is written against metacci's numbers. Worth knowing before
      // anyone changes it: the file's own OS/2 usWeightClass says 400, so the
      // label here and the label inside the font disagree. Only the @font-face
      // number matters to CSS matching, and the consequence of this one is that
      // the family has no 400 face at all: `font-weight: normal` on /reels
      // resolves upward to the 500 medium cut, not to this file. Reach it with
      // `font-weight: 300`, which is what reels.css's .prose does.
      weight: "300",
      style: "normal",
    },
    {
      path: "./silka-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./silka-semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-silka",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
