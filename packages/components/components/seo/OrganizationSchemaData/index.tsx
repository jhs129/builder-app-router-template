import React from "react";
import type { OrganizationSchema } from "@repo/types";

export interface OrganizationLogoInput {
  url: string;
  width?: number;
  height?: number;
}

export interface OrganizationAddressInput {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface OrganizationContactPointInput {
  contactType: string;
  telephone?: string;
  email?: string;
  areaServed?: string;
  availableLanguage?: string[];
}

export interface OrganizationFounderInput {
  name: string;
  url?: string;
}

export interface OrganizationSchemaDataProps {
  name: string;
  url?: string;
  description?: string;
  sameAs?: string[];
  logo?: OrganizationLogoInput;
  address?: OrganizationAddressInput;
  contactPoint?: OrganizationContactPointInput[];
  foundingDate?: string;
  founders?: OrganizationFounderInput[];
  "@id"?: string;
}

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
  // Generate organization ID from the site URL if not provided.
  const organizationId =
    id || `${process.env.NEXT_PUBLIC_SITE_URL}#organization`;

  // Don't render if no name is available
  if (!name) {
    return null;
  }

  const schemaData: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    ...(organizationId && { "@id": organizationId }),
    ...(url && { url }),
    ...(description && { description }),
    ...(logo && {
      logo: {
        "@type": "ImageObject",
        url: logo.url,
        ...(logo.width && { width: logo.width }),
        ...(logo.height && { height: logo.height }),
      },
    }),
    ...(sameAs && { sameAs }),
    ...(address && {
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
    ...(contactPoint && {
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
        // Escape `<` to < so CMS-sourced strings can't break out of the
        // script tag (e.g. a value containing "</script>").
        __html: JSON.stringify(schemaData).replace(/</g, "\\u003c"),
      }}
    />
  );
};
