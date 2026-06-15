export interface Level3Item {
  text: string;
  href: string;
}

export interface Level2Item {
  text: string;
  href: string;
  level3?: Level3Item[];
}

export interface Level1Item {
  text: string;
  level2?: Level2Item[];
  href?: string;
}

export interface NavigationData {
  level1: Level1Item[];
}

export interface Metadata {
  description?: string;
  keywords?: string[];
}

export interface SocialNetwork {
  name: string;
  href: string;
}

export interface PageData {
  title: string;
  image: string;
  metadata: Metadata;
  blocks: any[];
  headerNavigation1?: ModelReference | Navigation;
  headerNavigation2?: ModelReference | Navigation;
  footerNavigation?: ModelReference | Navigation;
}

export interface Content {
  ownerId: string;
  lastUpdateBy: string | null;
  createdDate: number;
  id: string;
  "@version": number;
  name: string;
  modelId: string;
  published: string;
  priority: number;
  query: any[];
  lastUpdated: number;
  firstPublished: number;
  testRatio: number;
  createdBy: string;
  lastUpdatedBy: string;
}

export interface ModelReference {
  "@type": string;
  id: string;
  model: string;
  value: Content;
}

export interface Navigation extends Content {
  data: NavigationData;
}

export interface Page extends Content {
  data: PageData;
}

export interface ArticleData {
  handle: string;
  title: string;
  subtitle: string;
  image: string;
  excerpt: string;
  metadata: Metadata;
  publishDate: string;
  blocks: any[];
}

export interface Article extends Content {
  data: ArticleData;
}

export interface Collection extends Content {
  data: {
    handle: string;
    metadata: Metadata;
    isEvent: boolean;
    eventInfo: {
      teaches: string[];
      startDate: string;
      endDate: string;
      attendanceMode: "Online Event" | "In-Person Event" | "Hybrid Event";

    };
    blocks: any[];
  };
}

export interface Product extends Content {
  data: {
    handle: string;
    blocks: any[];
  };
}

export interface SiteContext extends Content {
  meta: {
    shopifyDomain: string;
    lastPreviewUrl: string;
    kind: string;
  };
  data: {
    siteName: string;
    logo: string;
    organization: {
      name: string;
      address: {
        city: string;
        address1: string;
        postalCode: string;
        state: string;
        country: string;
      };
      description: string;
    };
    contact: {
      telephone: string;
      availableLanguages: string[];
      email: string;
      areaServed: string;
    };
    headerNavigation1?: ModelReference;
    headerNavigation2?: ModelReference;
    footerNavigation1?: ModelReference;
    socialNetworks?: SocialNetwork[];
    googleAnalyticsId?: string;
  };
  metrics: {
    clicks: number;
    impressions: number;
  };
  variations: Record<string, unknown>;
  folders: any[];
}

export interface Location extends Content {
  data: {
    name: string;
    type: "Place" | "Virtual";
    url: string;
    images: [{ image: string, caption: string }];
    address: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

// Re-export design-kit interfaces for backward compatibility
//export type { Heroic, Themeable, Opaque, CTA, Stylable, Button, Reversible, Alignable, BackgroundType, LayoutReversal, TextAlignments, Theme, standardThemes, opacityInputs, heroicInputs, themeableInputs, buttonInputs, reversibleInputs, alignableInputs, backgroundInputs, ctaInputs, commonInputs } from "../design-kit";
export * from "../design-kit";
export { getThemeClasses } from "../design-kit";
