export interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  url: string;
  name: string;
  description?: string;
  inLanguage?: string;
  publisher?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  }[];
}

export interface ListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbList {
  "@type": "BreadcrumbList";
  itemListElement: ListItem[];
}

export interface WebPageSchema {
  "@context": "https://schema.org";
  "@type": "WebPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  datePublished: string;
  dateModified: string;
  inLanguage?: string;
  isPartOf: {
    "@type": "WebSite";
    "@id": string;
    name?: string;
    url?: string;
  };
  breadcrumb?: BreadcrumbList;
  image?: string;
  publisher?: {
    "@type": "Organization";
    name: string;
    url?: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
      width?: number;
      height?: number;
    };
  };
  author?: Array<{
    "@type": "Person";
    name: string;
    url?: string;
  }>;
  keywords?: string[];
  lastReviewed?: string;
}

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id"?: string;
  name: string;
  url?: string;
  logo?: {
    "@type": "ImageObject";
    url: string;
    width?: number;
    height?: number;
  };
  description?: string;
  sameAs?: string[]; // Social media profiles, Wikipedia page, etc.
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: Array<{
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    email?: string;
    areaServed?: string;
    availableLanguage?: string[];
  }>;
  foundingDate?: string;
  founders?: Array<{
    "@type": "Person";
    name: string;
    url?: string;
  }>;
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article" | "BlogPosting" | "NewsArticle";
  "@id": string;
  headline: string;
  alternativeHeadline?: string;
  description?: string;
  image?: string | string[];
  author?: Array<{
    "@type": "Person";
    name: string;
    url?: string;
    image?: string;
    sameAs?: string[];
  }>;
  publisher?: {
    "@type": "Organization";
    name: string;
    url?: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
      width?: number;
      height?: number;
    };
  };
  datePublished: string;
  dateModified?: string;
  url: string;
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
  keywords?: string | string[];
  articleSection?: string;
  wordCount?: number;
  inLanguage?: string;
  isPartOf?: {
    "@type": "WebSite";
    "@id": string;
    name?: string;
    url?: string;
  };
  about?: Array<{
    "@type": "Thing";
    name: string;
    url?: string;
  }>;
}

export interface EventSchema {
  "@context": "https://schema.org";
  "@type": "EducationEvent" | "Event";
  "@id"?: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventAttendanceMode?: "OnlineEventAttendanceMode" | "OfflineEventAttendanceMode" | "MixedEventAttendanceMode";
  eventStatus?: "EventScheduled" | "EventCancelled" | "EventMovedOnline" | "EventPostponed" | "EventRescheduled";
  location?: {
    "@type": "Place";
    name?: string;
    address?: {
      "@type": "PostalAddress";
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    url?: string;
  } | {
    "@type": "VirtualLocation";
    url: string;
    name?: string;
  };
  organizer?: {
    "@type": "Organization";
    "@id"?: string;
    name: string;
    url?: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
      width?: number;
      height?: number;
    };
    address?: {
      "@type": "PostalAddress";
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    contactPoint?: Array<{
      "@type": "ContactPoint";
      telephone?: string;
      contactType: string;
      email?: string;
      areaServed?: string;
      availableLanguage?: string[];
    }>;
  } | {
    "@id": string;
  };
  sponsor?: Array<{
    "@type": "Organization" | "Person";
    name: string;
    url?: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
      width?: number;
      height?: number;
    };
  }>;
  performer?: Array<{
    "@type": "Person" | "Organization";
    name: string;
    url?: string;
    image?: string;
  }>;
  offers?: Array<{
    "@type": "Offer";
    name?: string;
    url?: string;
    price?: string;
    priceCurrency?: string;
    availability?: "InStock" | "SoldOut" | "PreOrder";
    validFrom?: string;
    validThrough?: string;
  }>;
  image?: string | string[];
  url?: string;
  inLanguage?: string;
  audience?: {
    "@type": "Audience";
    audienceType?: string;
    name?: string;
  };
  maximumAttendeeCapacity?: number;
  remainingAttendeeCapacity?: number;
}
