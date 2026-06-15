import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  alignableInputs as alignableInputsRaw,
  commonInputs as commonInputsRaw,
  heroicInputs as heroicInputsRaw,
  themeableInputs as themeableInputsRaw,
  opacityInputs as opacityInputsRaw,
  buttonInputs as buttonInputsRaw,
} from "@repo/types";
import TileQuote from "../components/cta/TileQuote";
import TileCTA from "../components/cta/TileCTA";
import CardImageCTA from "../components/cta/CardImageCTA";
import TileContent from "../components/cta/TileContent";
import TileImage from "../components/cta/TileImage";

// Helper function to conditionally set image property
const getImageConfig = () => {
  const envImage = process.env.NEXT_DEFAULT_COMPONENT_IMAGE;
  return envImage ? { image: envImage } : {};
};

// The shared input helpers in @repo/types are declared `as const` (readonly
// tuples), which the Gen2 SDK's mutable Input[] type rejects. Widen them here.
type Inputs = NonNullable<RegisteredComponent["inputs"]>;
const alignableInputs = alignableInputsRaw as unknown as Inputs;
const commonInputs = commonInputsRaw as unknown as Inputs;
const heroicInputs = heroicInputsRaw as unknown as Inputs;
const themeableInputs = themeableInputsRaw as unknown as Inputs;
const opacityInputs = opacityInputsRaw as unknown as Inputs;
const buttonInputs = buttonInputsRaw as unknown as Inputs;

export const ctaComponents: RegisteredComponent[] = [
  // Tile Quote
  {
    component: TileQuote,
    name: "TileQuote",
    friendlyName: "Tile Quote",
    ...getImageConfig(),
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
  // Tile CTA
  {
    component: TileCTA,
    name: "TileCTA",
    friendlyName: "Tile CTA",
    ...getImageConfig(),
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
  // Card Image CTA
  {
    component: CardImageCTA,
    name: "CardImageCTA",
    ...getImageConfig(),
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
  // Tile Content
  {
    component: TileContent,
    name: "TileContent",
    friendlyName: "Tile Content",
    ...getImageConfig(),
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
  // Tile Image
  {
    component: TileImage,
    name: "TileImage",
    friendlyName: "Tile Image",
    ...getImageConfig(),
    inputs: [
      ...themeableInputs,
      ...opacityInputs,
      ...alignableInputs,
      {
        name: "image",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
        required: true,
        defaultValue: "https://placehold.co/400x300/EEE/5ce1e6.png",
        helperText: "Background image for the tile",
      },
      {
        name: "title",
        type: "string",
        required: true,
        defaultValue: "Your Title",
        helperText: "Title displayed over the image (renders as h6)",
      },
      {
        name: "content",
        type: "html",
        required: true,
        defaultValue: "Add your content description here.",
        helperText:
          "Description content displayed over the image (supports HTML formatting)",
      },
      {
        name: "buttonLabel",
        type: "string",
        defaultValue: "Learn More",
        helperText: "Text for the CTA button. Leave empty to hide button.",
      },
      {
        name: "buttonHref",
        type: "string",
        defaultValue: "#",
        helperText: "URL where the button should link to",
        showIf: "options.get('buttonLabel')",
      },
      ...commonInputs,
    ],
    defaultStyles: {
      marginBottom: "20px",
    },
  },
];
