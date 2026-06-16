import { DEFAULT_DESIGN_TOKENS, type DesignTokens } from "@repo/components";
import { appColors } from "../config/colors";

// The design tokens this app exposes in the Builder.io editor.
//
// Metric tokens (font sizes, spacing, radius, shadows, font families) come
// from the package default; colors are owned by the app via config/colors.ts.
export const designTokens: DesignTokens = {
  ...DEFAULT_DESIGN_TOKENS,
  colors: appColors,
};
