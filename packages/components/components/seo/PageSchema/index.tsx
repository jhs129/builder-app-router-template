import React from "react";

// Server component that emits a single linked JSON-LD `@graph` for a page.
// It takes all data as props (no hooks / useSiteContext), so it is safe to
// render from a Server Component. Entities are connected by stable `@id`s:
//   Organization (#organization)  <-  WebSite.publisher
//   WebSite (#website)            <-  WebPage.isPartOf
//   Organization (#organization)  <-  WebPage.about
// so search engines resolve them as one connected entity graph instead of
// several disconnected blocks.

export interface PageSchemaAddress {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface PageSchemaContactPoint {
  contactType: string;
  telephone?: string;
  email?: string;
  areaServed?: string;
  availableLanguage?: string[];
}

export interface PageSchemaBreadcrumbItem {
  position: number;
  name: string;
  item: string;
}

export interface PageSchemaProps {
  title: string;
  description: string;
  url: string;
  siteName: string;
  siteUrl: string;
  organizationName: string;
  organizationDescription?: string;
  sameAs?: string[];
  logo?: string;
  address?: PageSchemaAddress;
  contactPoint?: PageSchemaContactPoint[];
  image?: string;
  publishedDate?: string;
  modifiedDate?: string;
  keywords?: string | string[];
  inLanguage?: string;
  breadcrumb?: PageSchemaBreadcrumbItem[];
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
  logo,
  address,
  contactPoint,
  image,
  publishedDate,
  modifiedDate,
  keywords,
  inLanguage = "en-US",
  breadcrumb,
}) => {
  const pageUrl = url || siteUrl;
  const orgId = `${siteUrl}#organization`;
  const siteId = `${siteUrl}#website`;
  const pageId = `${pageUrl}#webpage`;
  const imageId = `${pageUrl}#primaryimage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const now = new Date().toISOString();
  const datePublished = publishedDate || now;
  const dateModified = modifiedDate || publishedDate || now;

  const keywordList = Array.isArray(keywords)
    ? keywords
    : keywords
      ? [keywords]
      : undefined;

  const hasAddress =
    address &&
    Object.values(address).some((value) => Boolean(value));

  const organization = {
    "@type": "Organization",
    "@id": orgId,
    name: organizationName,
    url: siteUrl,
    ...(organizationDescription && { description: organizationDescription }),
    ...(logo && {
      logo: {
        "@type": "ImageObject",
        "@id": `${siteUrl}#logo`,
        url: logo,
      },
    }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    ...(hasAddress && {
      address: {
        "@type": "PostalAddress",
        ...(address.streetAddress && { streetAddress: address.streetAddress }),
        ...(address.addressLocality && {
          addressLocality: address.addressLocality,
        }),
        ...(address.addressRegion && { addressRegion: address.addressRegion }),
        ...(address.postalCode && { postalCode: address.postalCode }),
        ...(address.addressCountry && {
          addressCountry: address.addressCountry,
        }),
      },
    }),
    ...(contactPoint &&
      contactPoint.length > 0 && {
        contactPoint: contactPoint.map((contact) => ({
          "@type": "ContactPoint",
          contactType: contact.contactType,
          ...(contact.telephone && { telephone: contact.telephone }),
          ...(contact.email && { email: contact.email }),
          ...(contact.areaServed && { areaServed: contact.areaServed }),
          ...(contact.availableLanguage && {
            availableLanguage: contact.availableLanguage,
          }),
        })),
      }),
  };

  const website = {
    "@type": "WebSite",
    "@id": siteId,
    url: siteUrl,
    name: siteName,
    ...(organizationDescription && { description: organizationDescription }),
    publisher: { "@id": orgId },
    inLanguage,
  };

  const webPage = {
    "@type": "WebPage",
    "@id": pageId,
    url: pageUrl,
    name: title,
    ...(description && { description }),
    datePublished,
    dateModified,
    inLanguage,
    isPartOf: { "@id": siteId },
    about: { "@id": orgId },
    ...(image && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": imageId,
        url: image,
      },
      image: { "@id": imageId },
    }),
    ...(keywordList && { keywords: keywordList }),
    ...(breadcrumb &&
      breadcrumb.length > 0 && { breadcrumb: { "@id": breadcrumbId } }),
  };

  const breadcrumbList =
    breadcrumb && breadcrumb.length > 0
      ? {
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: breadcrumb.map((item) => ({
            "@type": "ListItem",
            position: item.position,
            name: item.name,
            item: item.item,
          })),
        }
      : null;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
      webPage,
      ...(breadcrumbList ? [breadcrumbList] : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape "<" so CMS content can't break out of the script tag (e.g. "</script>").
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export default PageSchema;
