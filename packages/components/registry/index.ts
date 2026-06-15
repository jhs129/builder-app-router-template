import type { RegisteredComponent } from "@builder.io/sdk-react";
import { navigationComponents } from "./navigation";
import { uiComponents } from "./ui";
import { ctaComponents } from "./cta";
import { layoutComponents } from "./layout";
import { seoComponents } from "./seo";

// Combined list of all custom components for use with the Gen2 SDK
// (e.g. <Content customComponents={customComponents} ... />)
export const customComponents: RegisteredComponent[] = [
  ...navigationComponents,
  ...uiComponents,
  ...ctaComponents,
  ...layoutComponents,
  ...seoComponents,
];

// Re-export individual category arrays
export {
  navigationComponents,
  uiComponents,
  ctaComponents,
  layoutComponents,
  seoComponents,
};
