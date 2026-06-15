export interface Heroic {
  isHero?: boolean;
  headline?: string;
}

export const heroicInputs = [
    {
      name: "headline",
      type: "string",
      helperText: "Main heading text for this component",
    },
    {
      name: "isHero",
      type: "boolean",
      defaultValue: true,
      helperText:
        "Use h1 tag for main heading (true) or h2 tag (false) for SEO hierarchy",
    },
  ] as const;