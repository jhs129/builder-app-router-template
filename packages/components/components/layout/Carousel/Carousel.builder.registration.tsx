import type { RegisteredComponent } from "@builder.io/sdk-react";
import { themeableInputs, alignableInputs, withImage } from "../../../registry/shared";
import Carousel from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Carousel,
    name: "Carousel",
    friendlyName: "Carousel",
    ...withImage(),
    canHaveChildren: true,
    shouldReceiveBuilderProps: {
      builderBlock: true,
      builderContext: true,
    },
    inputs: [
      ...themeableInputs,
      {
        name: "headline",
        type: "string",
        defaultValue: "Featured Content",
        helperText: "Main headline for the carousel section",
      },
      {
        name: "headlineLevel",
        type: "string",
        enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
        defaultValue: "h2",
        helperText: "HTML heading level for SEO and accessibility",
      },
      {
        name: "description",
        type: "string",
        defaultValue: "Discover our amazing collection",
        helperText: "Optional description text below the headline",
      },
      {
        name: "maskOpacity",
        type: "number",
        defaultValue: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        helperText: "Opacity of the overlay mask (0-1)",
      },
      ...alignableInputs,
      {
        name: "rowSize",
        type: "number",
        defaultValue: 3,
        min: 1,
        max: 10,
        helperText: "Number of items to show before scrolling appears",
      },
      {
        name: "navStyle",
        type: "string",
        enum: ["arrows", "dots", "both", "none"],
        defaultValue: "arrows",
        helperText: "Navigation style: arrows, dots, both, or none",
      },
    ],
    defaultStyles: {
      display: "block",
    },
  },
];
