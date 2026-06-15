import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/components", "@repo/types"],
  // Pin the workspace root so Turbopack resolves PostCSS/Tailwind and
  // node_modules from this monorepo, not a stray parent lockfile.
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "cdn.builder.io" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "shopify.com" },
    ],
    // CMS/commerce image URLs are immutable per URL, so cache each optimized
    // variant ~31 days instead of re-optimizing/re-transferring on the short
    // default TTL. Cuts Image Optimization transforms and Fast Data Transfer.
    minimumCacheTTL: 2678400,
    // Drop the 3840px (4K) variant: it produces the largest transform/transfer
    // and 4K displays fall back cleanly to 2048px.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;
