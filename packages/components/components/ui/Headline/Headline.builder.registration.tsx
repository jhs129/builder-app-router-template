import type { RegisteredComponent } from "@builder.io/sdk-react";
import { heroicInputs, withImage } from "../../../registry/shared";
import Headline from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Headline,
    name: "Headline",
    ...withImage(),
    inputs: [
      ...heroicInputs,
      {
        name: "level",
        type: "string",
        enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
        defaultValue: "h3",
        helperText: "HTML heading level for SEO and accessibility",
      },
      {
        name: "children",
        type: "richText",
        defaultValue: "Your headline text here",
        helperText: "The headline text content",
      },
      {
        name: "className",
        type: "string",
        helperText: "Additional CSS classes to apply",
      },
    ],
    defaultStyles: {
      display: "block",
    },
  },
];
