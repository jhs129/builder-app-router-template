import type { RegisteredComponent } from "@builder.io/sdk-react";
import { withImage } from "../../../registry/shared";
import Footer from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Footer,
    name: "Footer",
    ...withImage(),
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
];
