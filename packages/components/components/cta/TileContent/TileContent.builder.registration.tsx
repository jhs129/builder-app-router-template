import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  themeableInputs,
  opacityInputs,
  alignableInputs,
  heroicInputs,
  commonInputs,
  withImage,
} from "../../../registry/shared";
import TileContent from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: TileContent,
    name: "TileContent",
    friendlyName: "Tile Content",
    ...withImage(),
    canHaveChildren: true,
    shouldReceiveBuilderProps: {
      builderBlock: true,
      builderContext: true,
    },
    childRequirements: {
      message: "You can only add Button components as children",
      query: {
        "component.name": { $in: ["Button"] },
      },
    },
    inputs: [
      ...themeableInputs,
      ...opacityInputs,
      ...alignableInputs,
      ...heroicInputs,
      {
        name: "content",
        type: "richText",
        required: true,
        defaultValue:
          "Add your content description here. This supports rich text formatting.",
        helperText: "Main description content (supports HTML formatting)",
      },
      ...commonInputs,
    ],
    defaultStyles: {
      marginBottom: "20px",
    },
  },
];
