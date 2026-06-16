import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  themeableInputs,
  opacityInputs,
  alignableInputs,
  buttonInputs,
  commonInputs,
  withImage,
} from "../../../registry/shared";
import CardImageCTA from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: CardImageCTA,
    name: "CardImageCTA",
    ...withImage(),
    inputs: [
      ...themeableInputs,
      ...opacityInputs,
      ...alignableInputs,
      {
        name: "image",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
        required: true,
        defaultValue: "https://placehold.co/600x400/EEE/5ce1e6.png",
        helperText: "Image to display in the card",
      },
      {
        name: "eyebrow",
        type: "string",
        required: true,
        defaultValue: "Featured",
        helperText: "Eyebrow text displayed above the title (renders as h6)",
      },
      {
        name: "title",
        type: "string",
        required: true,
        defaultValue: "Your Title Here",
        helperText: "Main title of the card",
      },
      ...buttonInputs,
      ...commonInputs,
    ],
    defaultStyles: {
      marginBottom: "20px",
    },
  },
];
