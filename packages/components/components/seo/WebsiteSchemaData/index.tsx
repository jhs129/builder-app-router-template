import React from "react";
import type { WebsiteSchema } from "@repo/types";

export type WebsiteSchemaDataProps = Omit<
  WebsiteSchema,
  "@context" | "@type" | "publisher"
> & {
  publisher?: {
    name: string;
    url?: string;
  };
  potentialAction?: Array<
    Omit<NonNullable<WebsiteSchema["potentialAction"]>[number], "@type">
  >;
};

export const WebsiteSchemaData: React.FC<WebsiteSchemaDataProps> = ({
  name,
  url,
  description,
  publisher,
  inLanguage,
  potentialAction,
}) => {
  const schemaData: WebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    ...(description && { description }),
    ...(inLanguage && { inLanguage }),
    ...(publisher && {
      publisher: {
        "@type": "Organization",
        name: publisher.name,
        ...(publisher.url && { url: publisher.url }),
      },
    }),
    ...(potentialAction && {
      potentialAction: potentialAction.map((action) => ({
        "@type": "SearchAction",
        target: action.target,
        "query-input": action["query-input"],
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
