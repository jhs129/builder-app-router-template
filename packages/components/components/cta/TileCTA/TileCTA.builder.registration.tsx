import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  themeableInputs,
  opacityInputs,
  alignableInputs,
  heroicInputs,
  buttonInputs,
  commonInputs,
  withImage,
} from "../../../registry/shared";
import TileCTA from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: TileCTA,
    name: "TileCTA",
    friendlyName: "Tile CTA",
    ...withImage(),
    inputs: [
      ...themeableInputs,
      ...opacityInputs,
      ...alignableInputs,
      ...heroicInputs,
      {
        name: "eyebrow",
        type: "string",
        defaultValue: "Hey Genius!",
        helperText: "Optional eyebrow text displayed above the title",
      },
      {
        name: "content",
        type: "longText",
        required: true,
        defaultValue:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        helperText: "Description text for the CTA",
      },
      ...buttonInputs,
      ...commonInputs,
    ],
    defaultStyles: {
      marginBottom: "20px",
    },
  },
];
