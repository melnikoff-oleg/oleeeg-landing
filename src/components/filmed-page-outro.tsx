// End card for the filmed evidence-wall pages (/elon-musk-ai,
// /boris-cherny-ai, /claude-code-sessions, /claude-riemann-hypothesis,
// /andrej-karpathy-ai, /sam-altman-ai).
//
// Those pages are ported in from the vault and render none of the shared shell:
// no header, no ResourceFooter, no internal link of any kind. So a visitor who
// arrives from search or a shared link hits the end of the argument and has no
// way to the video it was made for, and no way back to the site. This is that
// way out.
//
// Two constraints it has to respect, both from the pages themselves:
//
//  1. ZERO client JavaScript. Those pages get screen-recorded, and a fast
//     programmatic scroll outruns any IntersectionObserver, leaving a band blank
//     for a beat: invisible to a reader, fatal on camera. So the video is a
//     thumbnail inside a plain <a> to YouTube, not a click-to-load facade.
//  2. Total style isolation. Each page owns its own ground, reset and type scale
//     under a scoped class, one of which sets Comic Neue as a label face. Every
//     value here is therefore inline, including the font stack, so the page
//     cannot restyle this card and this card cannot restyle the page.
//
// It lives in each route's layout.tsx, which is the hand-written half of those
// routes, so the next port from the vault cannot overwrite it.

const FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const LINK: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  minHeight: "44px",
  padding: "0.6rem 1.1rem",
  borderRadius: "999px",
  border: "1px solid rgba(208,214,224,0.16)",
  color: "#d0d6e0",
  font: `500 15px/1.2 ${FONT}`,
  textDecoration: "none",
};

export function FilmedPageOutro({
  videoId,
  videoTitle,
}: {
  /** Omit both while the companion video is unpublished: the card then renders
      only the way-out links, and gains the video block when the id is added. */
  videoId?: string;
  videoTitle?: string;
}) {
  return (
    <aside
      style={{
        background: "#020b18",
        borderTop: "1px solid rgba(208,214,224,0.1)",
        padding: "3rem 1.5rem 3.5rem",
        font: `400 16px/1.6 ${FONT}`,
        color: "#8a93a3",
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: "42rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#2863f0",
          }}
        >
          {videoId ? "the video" : "more from oleg"}
        </p>

        {videoId ? (
          <>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                position: "relative",
                marginTop: "1.25rem",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(208,214,224,0.14)",
                background: "#07142a",
                textDecoration: "none",
                lineHeight: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt={videoTitle}
                width={480}
                height={360}
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "64px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(2,11,24,0.72)",
                    border: "1px solid rgba(40,99,240,0.45)",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="#ffffff" width="18" height="18">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </a>

            <p
              style={{
                margin: "1.1rem 0 0",
                color: "#d0d6e0",
                font: `500 17px/1.45 ${FONT}`,
              }}
            >
              {videoTitle}
            </p>
            <p style={{ margin: "0.4rem 0 0", fontSize: "15px" }}>
              this page is the research the video was made from. watch it on
              YouTube.
            </p>
          </>
        ) : (
          <p style={{ margin: "1.1rem 0 0", fontSize: "15px" }}>
            this page is the research behind an upcoming video. the guides and
            tools below are free in the meantime.
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginTop: "1.75rem",
          }}
        >
          {videoId ? (
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...LINK,
                background: "#2863f0",
                borderColor: "#2863f0",
                color: "#ffffff",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                <path fill="#2863f0" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              watch on youtube
            </a>
          ) : (
            <a
              href="https://www.youtube.com/@Oleg-Melnikov"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...LINK,
                background: "#2863f0",
                borderColor: "#2863f0",
                color: "#ffffff",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                <path fill="#2863f0" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              youtube channel
            </a>
          )}
          <a href="/" style={LINK}>
            free guides and tools
          </a>
        </div>
      </div>
    </aside>
  );
}
