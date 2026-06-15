import React from "react";
import type { ArticleSchema } from "@repo/types";

// Input props for the component. The schema.org "@type" discriminators are
// added internally when building the JSON-LD, so callers pass plain data
// objects without them.
export interface ArticleSchemaDataProps {
  "@type"?: "Article" | "BlogPosting" | "NewsArticle";
  id: string;
  headline: string;
  alternativeHeadline?: string;
  description?: string;
  image?: string | string[];
  author?: Array<{
    name: string;
    url?: string;
    image?: string;
    sameAs?: string[];
  }>;
  publisher?: {
    name: string;
    url?: string;
    logo?: {
      url: string;
      width?: number;
      height?: number;
    };
  };
  datePublished: string;
  dateModified?: string;
  url: string;
  mainEntityOfPage?: {
    "@id": string;
  };
  keywords?: string | string[];
  articleSection?: string;
  wordCount?: number;
  inLanguage?: string;
  isPartOf?: {
    "@id": string;
    name?: string;
    url?: string;
  };
  about?: Array<{
    name: string;
    url?: string;
  }>;
}

export const ArticleSchemaData: React.FC<ArticleSchemaDataProps> = ({
  "@type": schemaType = "BlogPosting",
  id,
  headline,
  alternativeHeadline,
  description,
  image,
  author,
  publisher,
  datePublished,
  dateModified,
  url,
  mainEntityOfPage,
  keywords,
  articleSection,
  wordCount,
  inLanguage,
  isPartOf,
  about,
}) => {
  const schemaData: ArticleSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": id,
    headline,
    url,
    datePublished,
    ...(alternativeHeadline && { alternativeHeadline }),
    ...(description && { description }),
    ...(image && { image }),
    ...(dateModified && { dateModified }),
    ...(keywords && { keywords }),
    ...(articleSection && { articleSection }),
    ...(wordCount && { wordCount }),
    ...(inLanguage && { inLanguage }),
    ...(author && {
      author: author.map((auth) => ({
        "@type": "Person",
        name: auth.name,
        ...(auth.url && { url: auth.url }),
        ...(auth.image && { image: auth.image }),
        ...(auth.sameAs && { sameAs: auth.sameAs }),
      })),
    }),
    ...(publisher && {
      publisher: {
        "@type": "Organization",
        name: publisher.name,
        ...(publisher.url && { url: publisher.url }),
        ...(publisher.logo && {
          logo: {
            "@type": "ImageObject",
            url: publisher.logo.url,
            ...(publisher.logo.width && { width: publisher.logo.width }),
            ...(publisher.logo.height && { height: publisher.logo.height }),
          },
        }),
      },
    }),
    ...(mainEntityOfPage && {
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": mainEntityOfPage["@id"],
      },
    }),
    ...(isPartOf && {
      isPartOf: {
        "@type": "WebSite",
        "@id": isPartOf["@id"],
        ...(isPartOf.name && { name: isPartOf.name }),
        ...(isPartOf.url && { url: isPartOf.url }),
      },
    }),
    ...(about && {
      about: about.map((topic) => ({
        "@type": "Thing",
        name: topic.name,
        ...(topic.url && { url: topic.url }),
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
};
