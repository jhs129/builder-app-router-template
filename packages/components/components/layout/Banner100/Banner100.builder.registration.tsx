import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  themeableInputs,
  alignableInputs,
  backgroundTypes,
  withImage,
} from "../../../registry/shared";
import Banner100 from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Banner100,
    name: "Banner100",
    ...withImage(),
    shouldReceiveBuilderProps: {
      builderBlock: true,
      builderContext: true,
    },
    inputs: [
      ...themeableInputs,
      ...alignableInputs,
      {
        name: "backgroundType",
        type: "string",
        required: true,
        enum: backgroundTypes,
        defaultValue: "none",
      },
      {
        name: "backgroundImage",
        type: "file",
        showIf: (options) => options.get("backgroundType") === "image",
      },
      {
        name: "backgroundVideoFile",
        type: "file",
        allowedFileTypes: ["mp4", "webm"],
        showIf: (options) => options.get("backgroundType") === "video",
      },
      {
        name: "backgroundVideoId",
        type: "string",
        helperText: "Enter the video ID from YouTube",
        showIf: (options) => options.get("backgroundType") === "youtube",
      },
      {
        name: "maskOpacity",
        type: "number",
        required: false,
        defaultValue: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        helperText: "Opacity of the overlay mask (0-1)",
        showIf: (options) => options.get("backgroundType") !== "none",
      },
      {
        name: "content",
        type: "uiBlocks",
        hideFromUI: true,
        defaultValue: {
          blocks: [],
        },
      },
      {
        name: "fullWidth",
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    ],
    defaultStyles: {
      display: "block",
    },
  },
];
