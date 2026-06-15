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
  },
};

export default nextConfig;
