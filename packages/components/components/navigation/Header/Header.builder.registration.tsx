import type { RegisteredComponent } from "@builder.io/sdk-react";
import { withImage } from "../../../registry/shared";
import Header from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Header,
    name: "Header",
    ...withImage(),
    inputs: [
      { name: "navigation", type: "object", friendlyName: "Navigation" },
      {
        name: "logo",
        type: "string",
        friendlyName: "Logo URL",
        defaultValue: "https://placehold.co/400x100.png?text=Logo",
      },
    ],
  },
];
