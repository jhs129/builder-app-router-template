import React from "react";
import type { WebPageSchema, ListItem } from "@repo/types";

export type WebPageProps = Omit<
  WebPageSchema,
  "@context" | "@type" | "@id" | "isPartOf"
> & {
  isPartOf: string;
  publisher?: Omit<NonNullable<WebPageSchema["publisher"]>, "@type"> & {
    logo?: Omit<
      NonNullable<NonNullable<WebPageSchema["publisher"]>["logo"]>,
      "@type"
    >;
  };
  author?: Array<Omit<NonNullable<WebPageSchema["author"]>[number], "@type">>;
  breadcrumb?: Array<Omit<ListItem, "@type">>;
};

export const WebPageSchemaData: React.FC<WebPageProps> = ({
  name,
  url,
  description,
  datePublished,
  dateModified,
  inLanguage,
  isPartOf,
  breadcrumb,
  image,
  publisher,
  author,
  keywords,
  lastReviewed,
}) => {
  const schemaData: WebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name,
    url,
    description,
    datePublished,
    dateModified,
    ...(inLanguage && { inLanguage }),
    isPartOf: {
      "@type": "WebSite",
      "@id": isPartOf,
    },
    ...(breadcrumb && {
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumb.map(
          (item): ListItem => ({
            position: item.position,
            name: item.name,
            item: item.item,
            "@type": "ListItem",
          })
        ),
      },
    }),
    ...(image && { image }),
    ...(publisher && {
      publisher: {
        ...publisher,
        "@type": "Organization",
        ...(publisher.logo && {
          logo: {
            ...publisher.logo,
            "@type": "ImageObject",
          },
        }),
      },
    }),
    ...(author && {
      author: author.map((auth) => ({
        ...auth,
        "@type": "Person",
      })),
    }),
    ...(keywords && { keywords }),
    ...(lastReviewed && { lastReviewed }),
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
