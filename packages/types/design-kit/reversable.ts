// Utility function to get layout reversal classes
export const getLayoutReversalClasses = (
    layoutReversal: LayoutReversal = "none"
  ): string => {
    switch (layoutReversal) {
      case "none":
        return "flex-col md:flex-row";
      case "mobile-only":
        return "flex-col-reverse md:flex-row";
      case "all-viewports":
        return "flex-col-reverse md:flex-row-reverse";
      case "mobile-and-tablet":
        return "flex-col-reverse lg:flex-row";
      case "tablet-and-desktop":
        return "flex-col md:flex-row-reverse";
      default:
        return "flex-col md:flex-row";
    }
  };

  export const layoutReversalOptions = [
    "none",
    "mobile-only",
    "all-viewports",
    "mobile-and-tablet",
    "tablet-and-desktop",
  ] as const;
  export type LayoutReversal = (typeof layoutReversalOptions)[number];
  
  export interface Reversible {
    layoutReversal?: LayoutReversal;
  }

  export const reversibleInputs = [
    {
      name: "layoutReversal",
      type: "string",
      defaultValue: "none",
      enum: layoutReversalOptions,
      helperText: "When to reverse the layout order of columns or elements",
    },
  ] as const;