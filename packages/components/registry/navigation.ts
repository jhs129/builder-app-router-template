import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  alignableInputs as alignableInputsRaw,
  commonInputs as commonInputsRaw,
  heroicInputs as heroicInputsRaw,
  themeableInputs as themeableInputsRaw,
} from "@repo/types";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";
import VerticalNavigation from "../components/navigation/VerticalNavigation";

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

export const navigationComponents: RegisteredComponent[] = [
  {
    component: Header,
    name: "Header",
    ...getImageConfig(),
    inputs: [
      { name: "navigation1", type: "object", friendlyName: "Primary Navigation" },
      { name: "navigation2", type: "object", friendlyName: "Secondary Navigation" },
      { name: "logo", type: "string", friendlyName: "Logo URL" },
    ],
  },
  {
    component: Footer,
    name: "Footer",
    ...getImageConfig(),
    inputs: [
      { name: "navigation", type: "object", friendlyName: "Footer Navigation" },
      {
        name: "socialNetworks",
        type: "list",
        subFields: [
          { name: "name", type: "string" },
          { name: "href", type: "string" },
        ],
      },
    ],
  },
  {
    component: VerticalNavigation,
    name: "VerticalNavigation",
    friendlyName: "Vertical Navigation",
    ...getImageConfig(),
    shouldReceiveBuilderProps: {
      builderBlock: true,
      builderContext: true,
    },
    inputs: [
      ...themeableInputs,
      ...heroicInputs,
      ...alignableInputs,
      {
        name: "navigation",
        type: "object",
        friendlyName: "Navigation Data",
        helperText: "Navigation structure with level1 array of {text, href} objects",
        defaultValue: {
          data: {
            level1: [
              { text: "Home", href: "/" },
              { text: "About", href: "/about" },
              { text: "Services", href: "/services" },
              { text: "Contact", href: "/contact" },
            ],
          },
        },
      },
      ...commonInputs,
    ],
    defaultStyles: {
      marginBottom: "20px",
    },
  },
];
