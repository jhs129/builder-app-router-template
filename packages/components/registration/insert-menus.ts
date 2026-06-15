import { register } from "@builder.io/sdk-react";

export interface InsertMenuItem {
  name: string;
}

export interface InsertMenuConfig {
  name: string;
  items: InsertMenuItem[];
}

// Define available insert menus
export const INSERT_MENUS = {
  navigation: {
    name: "Navigation",
    items: [
      { name: "Header" },
      { name: "Footer" },
      { name: "VerticalNavigation" },
    ],
  } as InsertMenuConfig,

  ui: {
    name: "UI",
    items: [
      { name: "Accordion" },
      { name: "Alert" },
      { name: "Button" },
      { name: "Headline" },
      { name: "Text" },
      { name: "Image" },
      { name: "Box" },
      { name: "Columns" },
      { name: "ImageTestimonial" },
    ],
  } as InsertMenuConfig,

  cta: {
    name: "CTA",
    items: [
      { name: "ImageCTACard" },
      { name: "TileContent" },
      { name: "TileImage" },
      { name: "TileQuote" },
      { name: "TileCTA" },
      { name: "CardImageCTA" },
    ],
  } as InsertMenuConfig,

  layout: {
    name: "Layout",
    items: [
      { name: "Core:Section" },
      { name: "Banner100" },
      { name: "Carousel" },
      { name: "Tabs" },
    ],
  } as InsertMenuConfig,

  seo: {
    name: "SEO",
    items: [
      { name: "SchemaArticle" },
      { name: "SchemaOrganization" },
      { name: "SchemaWebsite" },
    ],
  } as InsertMenuConfig,
} as const;

export type InsertMenuKey = keyof typeof INSERT_MENUS;

// Function to register specific insert menus
export function registerInsertMenus(menuKeys: InsertMenuKey[]) {
  menuKeys.forEach(key => {
    const menu = INSERT_MENUS[key];
    register("insertMenu", menu);
  });
}

// Function to register all insert menus
export function registerAllInsertMenus() {
  Object.values(INSERT_MENUS).forEach(menu => {
    register("insertMenu", menu);
  });
}