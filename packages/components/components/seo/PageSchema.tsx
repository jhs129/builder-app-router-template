import React from "react";
import { OrganizationSchemaData } from "./OrganizationSchemaData";
import { WebsiteSchemaData } from "./WebsiteSchemaData";
import { WebPageSchemaData } from "./WebPageSchemaData";

// Server component replacement for the schema (JSON-LD) portion of the old
// SEOHead. It takes all data as props instead of reading useSiteContext /
// useRouter, so it is safe to render from a Server Component.
export interface PageSchemaProps {
  title: string;
  description: string;
  url: string;
  siteName: string;
  siteUrl: string;
  organizationName: string;
  organizationDescription?: string;
  sameAs?: string[];
  image?: string;
  publishedDate?: string;
  modifiedDate?: string;
  keywords?: string | string[];
  inLanguage?: string;
  // When true, the page is the site root and the Organization + Website
  // schema blocks are omitted (matching the original SEOHead behavior).
  isRoot?: boolean;
}

export const PageSchema: React.FC<PageSchemaProps> = ({
  title,
  description,
  url,
  siteName,
  siteUrl,
  organizationName,
  organizationDescription,
  sameAs,
  image,
  publishedDate,
  modifiedDate,
  keywords,
  inLanguage = "en-US",
  isRoot = false,
}) => {
  const fullTitle = `${siteName} | ${title}`;
  const now = new Date().toISOString();
  const keywordList = Array.isArray(keywords)
    ? keywords
    : keywords
      ? [keywords]
      : undefined;

  return (
    <>
      {!isRoot && (
        <>
          <OrganizationSchemaData
            name={organizationName}
            url={siteUrl}
            description={organizationDescription}
            sameAs={sameAs}
          />
          <WebsiteSchemaData
            name={siteName}
            url={siteUrl}
            description={organizationDescription}
            publisher={{
              name: siteName,
              url: siteUrl,
            }}
            inLanguage={inLanguage}
          />
        </>
      )}

      <WebPageSchemaData
        name={fullTitle}
        url={url || siteUrl}
        description={description}
        datePublished={publishedDate || now}
        dateModified={modifiedDate || now}
        inLanguage={inLanguage}
        isPartOf={siteUrl}
        image={image}
        keywords={keywordList}
        lastReviewed={modifiedDate || now}
      />
    </>
  );
};

export default PageSchema;
