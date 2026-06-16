import type { Metadata as NextMetadata } from "next";

// Server-safe replacement for the meta-tag portion of the old SEOHead.
// Returns a Next.js App Router Metadata object (no hooks, no next/head).
// Use from a route's generateMetadata() or the exported `metadata`.
export interface BuildPageMetadataArgs {
  title: string;
  description: string;
  siteName?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "event" | "product" | "profile" | "place";
  publishedDate?: string;
  author?: string;
  keywords?: string | string[];
}

export function buildPageMetadata({
  title,
  description,
  siteName,
  image,
  url,
  type = "website",
  publishedDate,
  author,
  keywords,
}: BuildPageMetadataArgs): NextMetadata {
  const keywordList = Array.isArray(keywords)
    ? keywords
    : keywords
      ? [keywords]
      : undefined;

  // Next's OpenGraph type only accepts a subset of values; map the rest
  // to "website" while preserving the original intent for known types.
  const ogType: "website" | "article" | "profile" =
    type === "article" || type === "profile" ? type : "website";

  const metadata: NextMetadata = {
    title,
    description,
    keywords: keywordList,
    openGraph: {
      title,
      description,
      type: ogType,
      ...(url && { url }),
      ...(siteName && { siteName }),
      ...(image && { images: [{ url: image }] }),
      ...(type === "article" &&
        (publishedDate || author) && {
          publishedTime: publishedDate,
          authors: author ? [author] : undefined,
        }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };

  return metadata;
}
