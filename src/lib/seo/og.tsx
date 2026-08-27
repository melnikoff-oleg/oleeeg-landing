import { ImageResponse } from "next/og";

// One generator for every route's Open Graph card.
//
// Before this the site declared `summary_large_image` on every page and shipped
// no image at all: it asked for a big card and handed over nothing, so every
// link posted anywhere rendered as a bare grey box. Traffic here is social and
// YouTube-fed, which is exactly where the preview image decides the click.
//
// Rendered at BUILD time, not per request, because each route's card is a fixed
// string. The crawler gets a static png and no function ever runs.
//
// Deliberately no external fonts: ImageResponse would have to fetch them at
// build, which turns a network hiccup into a failed build. The system stack
// renders the wordmark and title well enough at this size, and a card that
// always builds beats a slightly nicer one that sometimes does not.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const NAVY = "#020b18";
const NAVY_RAISED = "#07142a";
const VIVID_BLUE = "#2863f0";
const SILVER = "#d0d6e0";
const SILVER_MUTED = "#8a93a3";

export function ogImage({
  title,
  eyebrow = "oleg.ae",
}: {
  title: string;
  eyebrow?: string;
}) {
  // Long titles need to shrink or they overflow the card. Three steps is
  // enough: the alternative is measuring text, which ImageResponse cannot do.
  const size = title.length > 68 ? 54 : title.length > 44 ? 66 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(140deg, ${NAVY} 0%, ${NAVY_RAISED} 100%)`,
          padding: "72px 80px",
        }}
      >
        {/* A single accent bar rather than a logo file: no asset to load, and
            it reads as the brand at thumbnail size. */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 14,
              height: 56,
              borderRadius: 7,
              background: VIVID_BLUE,
            }}
          />
          <div
            style={{
              fontSize: 30,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: VIVID_BLUE,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: size,
            lineHeight: 1.08,
            color: SILVER,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 30,
            color: SILVER_MUTED,
          }}
        >
          <div style={{ display: "flex" }}>oleg melnikov</div>
          <div style={{ display: "flex", color: SILVER_MUTED }}>
            free guides at oleg.ae
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
