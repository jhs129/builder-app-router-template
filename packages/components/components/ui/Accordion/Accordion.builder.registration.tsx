import type { RegisteredComponent } from "@builder.io/sdk-react";
import { themeableInputs, withImage } from "../../../registry/shared";
import Accordion from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Accordion,
    name: "Accordion",
    friendlyName: "Accordion",
    ...withImage(),
    shouldReceiveBuilderProps: {
      builderBlock: true,
      builderContext: true,
    },
    inputs: [
      ...themeableInputs,
      {
        name: "groups",
        type: "list",
        subFields: [
          {
            name: "headline",
            type: "string",
            required: true,
            defaultValue: "Accordion Item",
            helperText: "The headline text for this accordion item",
          },
          {
            name: "content",
            type: "blocks",
            hideFromUI: true,
            helperText: "The content blocks for this accordion item",
          },
        ],
        defaultValue: [
          {
            headline: "Question One?",
            content: { blocks: [] },
          },
          {
            headline: "Question Two?",
            content: { blocks: [] },
          },
          {
            headline: "Question Three?",
            content: { blocks: [] },
          },
        ],
        helperText: "List of accordion items with headlines and content",
      },
      {
        name: "headline",
        type: "string",
        defaultValue: "Frequently Asked Questions",
        helperText: "Main headline for the accordion section",
      },
      {
        name: "headlineLevel",
        type: "string",
        enum: ["h2", "h3", "h4", "h5", "h6"],
        defaultValue: "h2",
        helperText: "HTML heading level for the main headline",
      },
      {
        name: "subheadline",
        type: "string",
        defaultValue: "",
        helperText: "Optional subheadline text",
      },
      {
        name: "subheadlineLevel",
        type: "string",
        enum: ["h2", "h3", "h4", "h5", "h6"],
        defaultValue: "h6",
        helperText: "HTML heading level for the subheadline",
      },
      {
        name: "body",
        type: "html",
        defaultValue: "",
        helperText: "Optional body text displayed before accordion items",
      },
      {
        name: "groupHeadlineLevel",
        type: "string",
        enum: ["h2", "h3", "h4", "h5", "h6"],
        defaultValue: "h3",
        helperText: "HTML heading level for the group headline",
      },
      {
        name: "alignment",
        type: "string",
        enum: ["left", "center", "right"],
        defaultValue: "left",
        helperText: "Text alignment for headlines and body text",
      },
      {
        name: "alwaysExpanded",
        type: "boolean",
        defaultValue: false,
        helperText:
          "Keep all accordion items always expanded (no collapse functionality)",
      },
    ],
    defaultStyles: {
      marginTop: "20px",
      marginBottom: "20px",
    },
  },
];
