export const ctaInputs = [
    {
      name: "ctaText",
      type: "string",
      defaultValue: "Learn More",
      helperText: "Primary call-to-action button text",
    },
    {
      name: "ctaUrl",
      type: "string",
      defaultValue: "#",
      helperText: "Primary call-to-action URL",
    },
    {
      name: "secondaryCtaText",
      type: "string",
      defaultValue: "",
      helperText: "Secondary call-to-action button text (optional)",
    },
    {
      name: "secondaryCtaUrl",
      type: "string",
      defaultValue: "#",
      helperText: "Secondary call-to-action URL",
    },
  ] as const;

  export interface CTA {
    ctaText: string;
    ctaUrl: string;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;
  }