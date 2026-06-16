import type { DesignToken } from "@repo/components";

// App-owned color palette surfaced in the Builder.io editor's design-token
// picker. Edit this list to change the colors this app exposes — the package
// only provides the non-color metric tokens (spacing, radius, etc.) as a
// default. Values reference CSS custom properties with literal fallbacks so
// the swatches stay meaningful even before a theme loads.
export const appColors: DesignToken[] = [
  // Primary Colors
  { name: "Primary Dark", value: "var(--primary-dark, #1d0f34)" },
  { name: "Primary Light", value: "var(--primary-light, #ffffff)" },
  { name: "Secondary Light", value: "var(--secondary-light, #f5f5f5)" },
  { name: "Secondary Dark", value: "var(--secondary-dark, #647589)" },
  { name: "Primary Accent", value: "var(--primary-accent, #6610f2)" },
  { name: "Secondary Accent", value: "var(--accent-purple, #6a0dad)" },

  // Accent Colors
  { name: "Emerald Green", value: "var(--accent-green, #20c997)" },
  { name: "Deep Purple", value: "var(--accent-purple, #6a0dad)" },
  { name: "Bright Magenta", value: "var(--accent-magenta, #b31d9d)" },
  { name: "Bright Cyan", value: "var(--accent-cyan, #5ce1e6)" },
  { name: "Sky Blue", value: "var(--accent-teal, #0dcaf0)" },
  { name: "Light Purple", value: "var(--accent-light-purple, #8c52ff)" },
];
