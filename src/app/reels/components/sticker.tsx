// The twelve riso stickers, and the one component that puts them on the page.
//
// They were generated with gpt-image-2 at background=transparent from a single
// shared style prompt (thick cream die-cut border, flat ink fills, halftone in
// the shading only, riso blue / coral / marigold / pink / cream), which is why
// twelve separate images read as one print run rather than as clip art. The
// source prompts and the regenerating script live in the vault at
// tmp/2026-08-22/reels_assets/gen.py; the finals are 400px WebP with a real
// alpha channel, ~35 KB each, in public/reels/stickers/.
//
// Every one of them is decoration. None carries information the page would
// lose without it, so they are all alt="" and aria-hidden, and every meaning a
// visitor needs is written in words next to them.

const NAMES = [
  "arrow",
  "blob",
  "bolt",
  "eye",
  "flame",
  "heart",
  "magnifier",
  "phone",
  "play",
  "rocket",
  "star",
  "tag",
] as const;

export type StickerName = (typeof NAMES)[number];

export function Sticker({
  name,
  size,
  tilt = 0,
  drift,
  className = "",
  priority = false,
}: {
  name: StickerName;
  /** Rendered width in px. The images are 400px on their long edge, so ask for
   *  less than that or they soften. */
  size: number;
  /** Degrees. A wall of identically angled stickers reads as a mistake, so
   *  every call site passes its own. */
  tilt?: number;
  /** Seconds of delay on the idle drift. Omit and the sticker holds still. */
  drift?: number;
  className?: string;
  /** Only the two above the fold. Everything else waits. */
  priority?: boolean;
}) {
  return (
    // A plain <img>, not next/image: these are already 35 KB WebPs at their
    // painted size, so an optimizer pass would spend Vercel transformation
    // quota to hand back the same bytes.
    <img
      src={`/reels/stickers/${name}.webp`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`sticker ${drift === undefined ? "" : "sticker-float"} ${className}`}
      style={
        {
          width: size,
          height: "auto",
          "--tilt": `${tilt}deg`,
          ...(drift === undefined ? {} : { "--drift": `${drift}s` }),
        } as React.CSSProperties
      }
    />
  );
}
