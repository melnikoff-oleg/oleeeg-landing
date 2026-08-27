import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer modern formats for the optimized <Image> outputs.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // The library page lived here for a day, was linked from the search
        // page, and is in the sitemap Google already fetched. Permanent, so the
        // ranking follows it to the flat slug rather than being split.
        source: "/viral-reels/browse",
        destination: "/reels",
        permanent: true,
      },
      {
        // The search page was folded into the library on 2026-08-25: it was a
        // search box over an empty screen, and the library it searched is now
        // under the same box. Permanent, so whatever ranking /viral-reels had
        // follows it rather than being split between a live page and a dead one.
        source: "/viral-reels",
        destination: "/reels",
        permanent: true,
      },
      {
        // The library's own slug until 2026-08-27, when it took /reels: the
        // page a visitor calls "reels" should live at /reels. Everything Google
        // has indexed under the old one points here.
        source: "/viral-reels-browse",
        destination: "/reels",
        permanent: true,
      },
      {
        // Same move, the other end of the corpus.
        source: "/viral-reels-creators",
        destination: "/creators",
        permanent: true,
      },
      {
        // ~245 creator pages hung under the old slug and every one of them is
        // in a sitemap Google has already fetched.
        source: "/viral-reels-creators/:account",
        destination: "/creators/:account",
        permanent: true,
      },
      {
        // The ideas chat, deleted on 2026-08-27. It read the same corpus, so
        // the library is where someone arriving on its slug wants to be.
        source: "/viral-reels-ideas",
        destination: "/reels",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Long-lived caching for the static media served straight from public/
        // (hero still frame, looping preview + poster) so repeat visits paint
        // from cache instead of re-fetching the heavy assets.
        source: "/:file(hero.jpg|preview.mp4|preview-poster.jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Book covers / expert portraits are stable content assets.
        source: "/marketing-brain/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  // Ensure the server-only retrieval corpus ships with the chat function on Vercel.
  outputFileTracingIncludes: {
    "/api/marketing-brain/chat": ["./src/app/marketing-brain/_data/chunks.json"],
  },
};

export default nextConfig;
