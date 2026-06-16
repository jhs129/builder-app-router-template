import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  themeableInputs,
  heroicInputs,
  alignableInputs,
  commonInputs,
  withImage,
} from "../../../registry/shared";
import VerticalNavigation from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: VerticalNavigation,
    name: "VerticalNavigation",
    friendlyName: "Vertical Navigation",
    ...withImage(),
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
