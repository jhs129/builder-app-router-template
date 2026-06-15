import { register } from "@builder.io/sdk-react";

// Register custom insert menus for the Builder.io editor.
// MUST only be called in a browser/client context (register touches browser
// globals), never during server rendering.
export function registerBuilderInsertMenus(): void {
  register("insertMenu", {
    name: "Navigation",
    items: [
      { name: "Header" },
      { name: "Footer" },
      { name: "VerticalNavigation" },
    ],
  });

  register("insertMenu", {
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
  });

  register("insertMenu", {
    name: "CTA",
    items: [
      { name: "ImageCTACard" },
      { name: "TileContent" },
      { name: "TileImage" },
      { name: "TileQuote" },
      { name: "TileCTA" },
      { name: "CardImageCTA" },
    ],
  });

  register("insertMenu", {
    name: "Layout",
    items: [
      { name: "Core:Section" },
      { name: "Banner100" },
      { name: "Carousel" },
      { name: "Tabs" },
    ],
  });
}
