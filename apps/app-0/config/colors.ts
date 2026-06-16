import type { DesignToken } from "@repo/components";

// App-owned color palette surfaced in the Builder.io editor's design-token
// picker. Edit this list to change the colors this app exposes — the package
// only provides the non-color metric tokens (spacing, radius, etc.) as a
// default. Values reference CSS custom properties with literal fallbacks so
// the swatches stay meaningful even before a theme loads.
export const appColors: DesignToken[] = [
  // Primary Colors — Chameleon Collective palette
  { name: "Black", value: "var(--primary-dark, #121212)" },
  { name: "White", value: "var(--primary-light, #ffffff)" },
  { name: "Parchment", value: "var(--primary-parchment, #eae4c8)" },
  { name: "Off-White", value: "var(--secondary-light, #f3f3f3)" },
  { name: "Mid-Gray", value: "var(--secondary-dark, #5b5b5b)" },
  { name: "Burnt Sienna", value: "var(--primary-accent, #ea633f)" },

  // Accent Colors
  { name: "Straw", value: "var(--accent-green, #e8eb74)" },
  { name: "Electric Blue", value: "var(--accent-cyan, #88e8f0)" },
  { name: "Teal", value: "var(--accent-teal, #0097a7)" },
  { name: "Orange", value: "var(--accent-magenta, #f78d1e)" },
  { name: "Straw Dark", value: "var(--accent-light-purple, #ced167)" },
];
