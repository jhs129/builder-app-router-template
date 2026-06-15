export const commonInputs = [
    {
      name: "className",
      type: "string",
      defaultValue: "",
      helperText: "Additional CSS classes for custom styling",
    },
  ] as const;

  export interface Stylable {
    className?: string;
  }