import type { NextConfig } from "next";

// Storybook's @storybook/nextjs framework resolves the nearest Next.js config.
// We provide a local one so the workspace component packages are transpiled and
// remote image hosts are allowed, without pulling in the app's Builder dev tools.
const nextConfig: NextConfig = {
  transpilePackages: ["@repo/components", "@repo/types"],
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
