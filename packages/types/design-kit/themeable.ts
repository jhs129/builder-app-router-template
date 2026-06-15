export const standardThemes = [
    "light",
    "dark",
    "accent",
    "gradient",
    "transparent-light",
    "transparent-dark",
  ] as const;
  export type Theme = (typeof standardThemes)[number];

export interface Themeable {
  theme?: Theme;
  maskOpacity?: number;
  inheritTheme?: boolean;
}

// Common theme class mappings
export const getThemeClasses = (theme: Theme = "light"): string => {
  return `theme theme-${theme}`;
};

export const themeableInputs = [
    {
      name: "theme",
      type: "string",
      required: true,
      defaultValue: "light",
      enum: standardThemes,
      helperText: "Visual theme for the section",
    },
    {
      name: "inheritTheme",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Inherit theme from parent component instead of using explicit theme",
    },
  ] as const;