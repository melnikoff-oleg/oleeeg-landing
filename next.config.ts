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
        destination: "/viral-reels-browse",
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
