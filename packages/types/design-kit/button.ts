export const buttonInputs = [
    {
      name: "buttonLabel",
      type: "string",
      defaultValue: "LEARN MORE",
      helperText: "Call-to-action button text",
    },
    {
      name: "buttonHref",
      type: "string",
      defaultValue: "#",
      helperText: "Call-to-action button URL",
    },
  ] as const;

  export interface Button {
    buttonLabel: string;
    buttonHref: string;
  }