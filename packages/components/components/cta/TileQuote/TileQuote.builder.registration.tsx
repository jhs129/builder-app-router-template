import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  heroicInputs,
  themeableInputs,
  opacityInputs,
  alignableInputs,
  commonInputs,
  withImage,
} from "../../../registry/shared";
import TileQuote from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: TileQuote,
    name: "TileQuote",
    friendlyName: "Tile Quote",
    ...withImage(),
    inputs: [
      ...heroicInputs,
      ...themeableInputs,
      ...opacityInputs,
      ...alignableInputs,
      {
        name: "quote",
        type: "longText",
        required: true,
        defaultValue:
          "This is an inspiring quote that will be displayed prominently.",
        helperText: "The quote text to display in the blockquote",
      },
      ...commonInputs,
    ],
    defaultStyles: {
      marginBottom: "20px",
    },
  },
];
