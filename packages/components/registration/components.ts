// Component registry modules
// These export arrays of RegisteredComponent for use with the Gen2 SDK
// (e.g. <Content customComponents={...} />). They no longer have side effects.

import type { RegisteredComponent } from "@builder.io/sdk-react";
import { navigationComponents } from "../registry/navigation";
import { uiComponents } from "../registry/ui";
import { ctaComponents } from "../registry/cta";
import { layoutComponents } from "../registry/layout";
import { seoComponents } from "../registry/seo";

// Re-export individual category arrays
export {
  navigationComponents,
  uiComponents,
  ctaComponents,
  layoutComponents,
  seoComponents,
};

// Combined list of all custom components
export const allComponents: RegisteredComponent[] = [
  ...navigationComponents,
  ...uiComponents,
  ...ctaComponents,
  ...layoutComponents,
  ...seoComponents,
];

// Returns all components as an array for the Gen2 SDK
export function registerAllComponents(): RegisteredComponent[] {
  return allComponents;
}

// Individual category accessors
export function registerNavigationComponents(): RegisteredComponent[] {
  return navigationComponents;
}

export function registerUiComponents(): RegisteredComponent[] {
  return uiComponents;
}

export function registerCtaComponents(): RegisteredComponent[] {
  return ctaComponents;
}

export function registerLayoutComponents(): RegisteredComponent[] {
  return layoutComponents;
}

export function registerSeoComponents(): RegisteredComponent[] {
  return seoComponents;
}
