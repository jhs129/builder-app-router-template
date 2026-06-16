import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  commonInputs,
  standardThemes,
  withImage,
} from "../../../registry/shared";
import DesignKitOverview from "./index";

// Design Kit Overview is intentionally absent from the insert menu (no menu
// entry references it); it stays in customComponents so it still renders.
export const registration: RegisteredComponent[] = [
  {
    component: DesignKitOverview,
    name: "DesignKitOverview",
    friendlyName: "Design Kit Overview",
    ...withImage(),
    inputs: [
      {
        name: "theme",
        type: "string",
        enum: standardThemes,
        defaultValue: "light",
        helperText:
          "Initial theme for the design kit (can be changed with dropdown)",
      },
      ...commonInputs,
    ],
    noWrap: true,
  },
];
