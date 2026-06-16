import React from "react";
import type { EventSchema } from "@repo/types";

export interface EventSchemaDataProps {
  // Required fields
  eventId: string;
  name: string;
  startDate: string;

  // Optional event details
  endDate?: string;
  eventType?: "EducationEvent" | "Event";
  description?: string;
  eventAttendanceMode?:
    | "OnlineEventAttendanceMode"
    | "OfflineEventAttendanceMode"
    | "MixedEventAttendanceMode";
  eventStatus?:
    | "EventScheduled"
    | "EventCancelled"
    | "EventMovedOnline"
    | "EventPostponed"
    | "EventRescheduled";
  image?: string | string[];
  url?: string;
  inLanguage?: string;
  maximumAttendeeCapacity?: number;
  remainingAttendeeCapacity?: number;

  // Location (can be physical or virtual)
  location?: {
    type?: "Place" | "VirtualLocation";
    name?: string;
    url?: string;
    address?: {
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode?: string;
      country?: string;
    };
  };

  // Organizer
  organizer?: {
    name: string;
    url?: string;
    logo?: {
      url: string;
      width?: number;
      height?: number;
    };
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    contactPoint?: Array<{
      contactType: string;
      telephone?: string;
      email?: string;
      areaServed?: string;
      availableLanguage?: string[];
    }>;
  };

  // Sponsors
  sponsor?: Array<{
    type?: "Organization" | "Person";
    name: string;
    url?: string;
    logo?: {
      url: string;
      width?: number;
      height?: number;
    };
  }>;

  // Performers
  performer?: Array<{
    type?: "Person" | "Organization";
    name: string;
    url?: string;
    image?: string;
  }>;

  // Offers/Tickets
  offers?: Array<{
    name?: string;
    url?: string;
    price?: string;
    priceCurrency?: string;
    availability?: "InStock" | "SoldOut" | "PreOrder";
    validFrom?: string;
    validThrough?: string;
  }>;

  // Audience
  audience?: {
    audienceType?: string;
    name?: string;
  };

  // Teaches (for EducationEvent)
  teaches?: string | string[];
}

const EventSchemaData: React.FC<EventSchemaDataProps> = ({
  eventType = "EducationEvent",
  eventId,
  name,
  description,
  startDate,
  endDate,
  eventAttendanceMode,
  eventStatus = "EventScheduled",
  location,
  organizer,
  sponsor,
  performer,
  offers,
  image,
  url,
  inLanguage,
  audience,
  maximumAttendeeCapacity,
  remainingAttendeeCapacity,
  teaches,
}) => {
  const schemaData: EventSchema = {
    "@context": "https://schema.org",
    "@type": eventType,
    name,
    startDate,
    ...(eventId && { "@id": eventId }),
    ...(description && { description }),
    ...(endDate && { endDate }),
    ...(eventAttendanceMode && { eventAttendanceMode }),
    ...(eventStatus && { eventStatus }),
    ...(location && {
      location:
        location.type === "VirtualLocation"
          ? {
              "@type": "VirtualLocation" as const,
              url: location.url!,
              ...(location.name && { name: location.name }),
            }
          : {
              "@type": "Place" as const,
              ...(location.name && { name: location.name }),
              ...(location.url && { url: location.url }),
              ...(location.address && {
                address: {
                  "@type": "PostalAddress",
                  ...(location.address.address1 && {
                    streetAddress: location.address.address1,
                  }),
                  ...(location.address.city && {
                    addressLocality: location.address.city,
                  }),
                  ...(location.address.state && {
                    addressRegion: location.address.state,
                  }),
                  ...(location.address.postalCode && {
                    postalCode: location.address.postalCode,
                  }),
                  ...(location.address.country && {
                    addressCountry: location.address.country,
                  }),
                },
              }),
            },
    }),
    ...(organizer ? {
      organizer: {
        "@type": "Organization",
        name: organizer.name,
        ...(organizer.url && { url: organizer.url }),
        ...(organizer.logo && {
          logo: {
            "@type": "ImageObject",
            url: organizer.logo.url,
            ...(organizer.logo.width && { width: organizer.logo.width }),
            ...(organizer.logo.height && { height: organizer.logo.height }),
          },
        }),
        ...(organizer.address && {
          address: {
            "@type": "PostalAddress",
            ...(organizer.address.streetAddress && {
              streetAddress: organizer.address.streetAddress,
            }),
            ...(organizer.address.addressLocality && {
              addressLocality: organizer.address.addressLocality,
            }),
            ...(organizer.address.addressRegion && {
              addressRegion: organizer.address.addressRegion,
            }),
            ...(organizer.address.postalCode && {
              postalCode: organizer.address.postalCode,
            }),
            ...(organizer.address.addressCountry && {
              addressCountry: organizer.address.addressCountry,
            }),
          },
        }),
        ...(organizer.contactPoint && {
          contactPoint: organizer.contactPoint.map((contact) => ({
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
      }
    } : {
      organizer: {
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL}#organization`
      }
    }),
    ...(sponsor && {
      sponsor: sponsor.map((sponsorItem) => ({
        "@type": sponsorItem.type || "Organization",
        name: sponsorItem.name,
        ...(sponsorItem.url && { url: sponsorItem.url }),
        ...(sponsorItem.logo && {
          logo: {
            "@type": "ImageObject",
            url: sponsorItem.logo.url,
            ...(sponsorItem.logo.width && { width: sponsorItem.logo.width }),
            ...(sponsorItem.logo.height && { height: sponsorItem.logo.height }),
          },
        }),
      })),
    }),
    ...(performer && {
      performer: performer.map((performerItem) => ({
        "@type": performerItem.type || "Person",
        name: performerItem.name,
        ...(performerItem.url && { url: performerItem.url }),
        ...(performerItem.image && { image: performerItem.image }),
      })),
    }),
    ...(offers && {
      offers: offers.map((offer) => ({
        "@type": "Offer",
        ...(offer.name && { name: offer.name }),
        ...(offer.url && { url: offer.url }),
        ...(offer.price && { price: offer.price }),
        ...(offer.priceCurrency && { priceCurrency: offer.priceCurrency }),
        ...(offer.availability && { availability: offer.availability }),
        ...(offer.validFrom && { validFrom: offer.validFrom }),
        ...(offer.validThrough && { validThrough: offer.validThrough }),
      })),
    }),
    ...(image && { image }),
    ...(url && { url }),
    ...(inLanguage && { inLanguage }),
    ...(audience && {
      audience: {
        "@type": "Audience",
        ...(audience.audienceType && { audienceType: audience.audienceType }),
        ...(audience.name && { name: audience.name }),
      },
    }),
    ...(maximumAttendeeCapacity && { maximumAttendeeCapacity }),
    ...(remainingAttendeeCapacity && { remainingAttendeeCapacity }),
    ...(teaches && { teaches }),
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

export { EventSchemaData };
export default EventSchemaData;
