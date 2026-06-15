import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  commonInputs as commonInputsRaw,
  standardThemes as standardThemesRaw,
  themeableInputs as themeableInputsRaw,
  heroicInputs as heroicInputsRaw,
} from "@repo/types";
import Button from "../components/ui/Button";
import NotFoundContent from "../components/ui/NotFoundContent";
import Accordion from "../components/ui/Accordion";
import Alert from "../components/ui/Alert";
import DesignKitOverview from "../components/ui/DesignKitOverview";
import Headline from "../components/ui/Headline";

// Helper function to conditionally set image property
const getImageConfig = () => {
  const envImage = process.env.NEXT_DEFAULT_COMPONENT_IMAGE;
  return envImage ? { image: envImage } : {};
};

// The shared input helpers in @repo/types are declared `as const` (readonly
// tuples), which the Gen2 SDK's mutable Input[] type rejects. Widen them here.
type Inputs = NonNullable<RegisteredComponent["inputs"]>;
const commonInputs = commonInputsRaw as unknown as Inputs;
const themeableInputs = themeableInputsRaw as unknown as Inputs;
const heroicInputs = heroicInputsRaw as unknown as Inputs;
const standardThemes = standardThemesRaw as unknown as string[];

export const uiComponents: RegisteredComponent[] = [
  {
    component: Button,
    name: "Core:Button",
    hideFromInsertMenu: true,
    override: false,
    ...getImageConfig(),
    inputs: [
      ...themeableInputs,
      {
        name: "maskOpacity",
        type: "number",
        defaultValue: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        helperText: "Opacity of the overlay mask (0-1)",
      },
      {
        name: "outlined",
        type: "boolean",
        defaultValue: false,
        helperText: "Use outlined button style instead of filled",
      },
      {
        name: "label",
        type: "string",
        required: true,
        defaultValue: "Learn More",
        helperText: "The text content of the button",
      },
      {
        name: "href",
        type: "string",
        defaultValue: "#",
        helperText: "The URL the button should link to",
      },
      {
        name: "className",
        type: "string",
        advanced: true,
        defaultValue: "",
        helperText: "Additional CSS classes to apply to the button",
      },
    ],
  },
  {
    component: Button,
    name: "Button",
    override: true,
    ...getImageConfig(),
    inputs: [
      ...themeableInputs,
      {
        name: "maskOpacity",
        type: "number",
        defaultValue: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        helperText: "Opacity of the overlay mask (0-1)",
      },
      {
        name: "outlined",
        type: "boolean",
        defaultValue: false,
        helperText: "Use outlined button style instead of filled",
      },
      {
        name: "label",
        type: "string",
        required: true,
        defaultValue: "Learn More",
        helperText: "The text content of the button",
      },
      {
        name: "href",
        type: "string",
        defaultValue: "#",
        helperText: "The URL the button should link to",
      },
      {
        name: "className",
        type: "string",
        advanced: true,
        defaultValue: "",
        helperText: "Additional CSS classes to apply to the button",
      },
    ],
  },
  {
    component: NotFoundContent,
    name: "NotFoundContent",
    ...getImageConfig(),
    friendlyName: "404 Content",
    inputs: [
      {
        name: "className",
        type: "string",
        defaultValue: "",
        helperText: "Additional CSS classes to apply to the component",
      },
      {
        name: "requestedPath",
        type: "string",
        defaultValue: "",
        helperText:
          "The path that was requested but not found. This will be automatically populated in 404 pages.",
        advanced: true,
      },
      {
        name: "errorCode",
        type: "string",
        defaultValue: "404",
        helperText: "The error code to display (e.g., '404', '500')",
      },
      {
        name: "title",
        type: "string",
        defaultValue: "Page Not Found",
        helperText: "The main title of the error page",
      },
      {
        name: "description",
        type: "string",
        defaultValue:
          "The page you're looking for doesn't exist or has been moved.",
        helperText: "A detailed description of the error",
      },
      {
        name: "backButtonText",
        type: "string",
        defaultValue: "Go Back",
        helperText: "Text for the back button",
      },
      {
        name: "homeButtonText",
        type: "string",
        defaultValue: "Return Home",
        helperText: "Text for the home button",
      },
    ],
    defaultStyles: {
      marginTop: "20px",
      marginBottom: "20px",
    },
  },
  // Accordion
  {
    component: Accordion,
    name: "Accordion",
    friendlyName: "Accordion",
    ...getImageConfig(),
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
        helperText: "Keep all accordion items always expanded (no collapse functionality)",
      },
    ],
    defaultStyles: {
      marginTop: "20px",
      marginBottom: "20px",
    },
  },
  // Alert
  {
    component: Alert,
    name: "Alert",
    friendlyName: "Alert",
    ...getImageConfig(),
    inputs: [
      {
        name: "variant",
        type: "string",
        required: true,
        defaultValue: "info",
        enum: ["info", "success", "warning", "error"],
        helperText: "Visual style variant for the alert",
      },
      {
        name: "title",
        type: "string",
        helperText: "Optional title for the alert",
      },
      {
        name: "message",
        type: "string",
        required: true,
        defaultValue: "This is an alert message",
        helperText: "Main message content of the alert",
      },
      {
        name: "dismissible",
        type: "boolean",
        defaultValue: true,
        helperText: "Whether the alert can be dismissed by the user",
      },
      {
        name: "autoHide",
        type: "boolean",
        defaultValue: false,
        helperText: "Whether the alert should automatically hide after a delay",
      },
      {
        name: "autoHideDelay",
        type: "number",
        defaultValue: 5000,
        helperText: "Delay in milliseconds before auto-hiding (if autoHide is enabled)",
      },
      {
        name: "icon",
        type: "string",
        helperText: "Custom icon to display (overrides default variant icon)",
      },
      ...themeableInputs,
      ...commonInputs,
    ],
  },
  // Design Kit Overview - Not in insert menu (for development/design reference)
  {
    component: DesignKitOverview,
    name: "DesignKitOverview",
    friendlyName: "Design Kit Overview",
    ...getImageConfig(),
    inputs: [
      {
        name: "theme",
        type: "string",
        enum: standardThemes,
        defaultValue: "light",
        helperText: "Initial theme for the design kit (can be changed with dropdown)",
      },
      ...commonInputs,
    ],
    noWrap: true,
    // Note: No insertMenu specified, so it won't appear in the insert menu
  },
  // Headline
  {
    component: Headline,
    name: "Headline",
    ...getImageConfig(),
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
