// Shared helpers for Builder.io component registrations.
//
// This module is the single place that bridges two type systems:
//   1. The shared input helpers in @repo/types are declared `as const`
//      (readonly tuples), which the Gen2 SDK's mutable Input[] type rejects.
//   2. The `NEXT_DEFAULT_COMPONENT_IMAGE` env lookup used by every component
//      to set its insert-menu thumbnail.
//
// Every per-component `<Name>.builder.registration.tsx` should import its inputs and
// `withImage()` from here so the `as unknown as Inputs` cast lives in exactly
// one file.

import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  commonInputs as commonInputsRaw,
  standardThemes as standardThemesRaw,
  themeableInputs as themeableInputsRaw,
  heroicInputs as heroicInputsRaw,
  alignableInputs as alignableInputsRaw,
  opacityInputs as opacityInputsRaw,
  buttonInputs as buttonInputsRaw,
  ctaInputs as ctaInputsRaw,
  backgroundInputs as backgroundInputsRaw,
  backgroundTypes as backgroundTypesRaw,
  reversibleInputs as reversibleInputsRaw,
} from "@repo/types";

// The mutable input list type the Gen2 SDK expects.
export type Inputs = NonNullable<RegisteredComponent["inputs"]>;

// Widen each `as const` helper tuple to the SDK's mutable Input[] type.
export const commonInputs = commonInputsRaw as unknown as Inputs;
export const themeableInputs = themeableInputsRaw as unknown as Inputs;
export const heroicInputs = heroicInputsRaw as unknown as Inputs;
export const alignableInputs = alignableInputsRaw as unknown as Inputs;
export const opacityInputs = opacityInputsRaw as unknown as Inputs;
export const buttonInputs = buttonInputsRaw as unknown as Inputs;
export const ctaInputs = ctaInputsRaw as unknown as Inputs;
export const backgroundInputs = backgroundInputsRaw as unknown as Inputs;
export const reversibleInputs = reversibleInputsRaw as unknown as Inputs;

// Enum helpers widened to plain string[] for the SDK's enum option type.
export const standardThemes = standardThemesRaw as unknown as string[];
export const backgroundTypes = backgroundTypesRaw as unknown as string[];

// Conditionally sets the `image` property from the shared env var so a
// component registration omits `image` entirely when the var is unset.
export const withImage = (): { image: string } | Record<string, never> => {
  const envImage = process.env.NEXT_DEFAULT_COMPONENT_IMAGE;
  return envImage ? { image: envImage } : {};
};
