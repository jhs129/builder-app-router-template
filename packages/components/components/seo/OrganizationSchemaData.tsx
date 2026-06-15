"use client";

import React from "react";
import type { OrganizationSchema } from "@repo/types";
import { useSiteContext } from "../../contexts/SiteContextProvider";

export type OrganizationSchemaDataProps = Omit<
  OrganizationSchema,
  "@context" | "@type"
> & {
  logo?: Omit<NonNullable<OrganizationSchema["logo"]>, "@type">;
  address?: Omit<NonNullable<OrganizationSchema["address"]>, "@type">;
  contactPoint?: Array<
    Omit<NonNullable<OrganizationSchema["contactPoint"]>[number], "@type">
  >;
  founders?: Array<
    Omit<NonNullable<OrganizationSchema["founders"]>[number], "@type">
  >;
};

export const OrganizationSchemaData: React.FC<OrganizationSchemaDataProps> = ({
  name,
  url,
  logo,
  description,
  sameAs,
  address,
  contactPoint,
  foundingDate,
  founders,
  "@id": id,
}) => {
  // Try to get site context, but handle case where provider is not available
  let siteContext = null;
  try {
    const context = useSiteContext();
    siteContext = context.siteContext;
  } catch {
    // SiteContextProvider not available, continue without it
  }
  
  // Generate organization ID from site context if not provided
  const organizationId = id || `${process.env.NEXT_PUBLIC_SITE_URL}#organization`;
  
  const orgName = name || siteContext?.data.organization?.name;
  const orgDescription = description || siteContext?.data.organization?.description;
  const orgAddress = address || (siteContext?.data.organization?.address ? {
    streetAddress: siteContext.data.organization.address.address1,
    addressLocality: siteContext.data.organization.address.city,
    addressRegion: siteContext.data.organization.address.state,
    postalCode: siteContext.data.organization.address.postalCode,
    addressCountry: siteContext.data.organization.address.country,
  } : undefined);
  const orgContactPoint = contactPoint || (siteContext?.data.contact ? [{
    contactType: "customer service",
    telephone: siteContext.data.contact.telephone,
    email: siteContext.data.contact.email,
    areaServed: siteContext.data.contact.areaServed,
    availableLanguage: siteContext.data.contact.availableLanguages,
  }] : undefined);
  const orgSameAs = sameAs || siteContext?.data.socialNetworks?.map(network => network.href);
  
  // Don't render if no name is available
  if (!orgName) {
    return null;
  }

  const schemaData: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgName,
    ...(organizationId && { "@id": organizationId }),
    ...(url && { url }),
    ...(orgDescription && { description: orgDescription }),
    ...(logo && {
      logo: {
        "@type": "ImageObject",
        url: logo.url,
        ...(logo.width && { width: logo.width }),
        ...(logo.height && { height: logo.height }),
      },
    }),
    ...(orgSameAs && { sameAs: orgSameAs }),
    ...(orgAddress && {
      address: {
        "@type": "PostalAddress",
        ...(orgAddress.streetAddress && { streetAddress: orgAddress.streetAddress }),
        ...(orgAddress.addressLocality && {
          addressLocality: orgAddress.addressLocality,
        }),
        ...(orgAddress.addressRegion && { addressRegion: orgAddress.addressRegion }),
        ...(orgAddress.postalCode && { postalCode: orgAddress.postalCode }),
        ...(orgAddress.addressCountry && {
          addressCountry: orgAddress.addressCountry,
        }),
      },
    }),
    ...(orgContactPoint && {
      contactPoint: orgContactPoint.map((contact) => ({
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
    ...(foundingDate && { foundingDate }),
    ...(founders && {
      founders: founders.map((founder) => ({
        "@type": "Person",
        name: founder.name,
        ...(founder.url && { url: founder.url }),
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
