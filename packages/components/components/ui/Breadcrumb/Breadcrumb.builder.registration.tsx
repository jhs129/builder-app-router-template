import type { RegisteredComponent } from "@builder.io/sdk-react";
import { themeableInputs, withImage } from "../../../registry/shared";
import Breadcrumb from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Breadcrumb,
    name: "Breadcrumb",
    ...withImage(),
    inputs: [
      ...themeableInputs,
      {
        name: "items",
        type: "list",
        helperText: "Breadcrumb trail. The last item is the current page.",
        subFields: [
          {
            name: "label",
            type: "text",
            helperText: "Text shown for this crumb.",
          },
          {
            name: "href",
            type: "url",
            helperText: "Link target. Leave blank for the current page.",
          },
        ],
        defaultValue: [
          { label: "About us", href: "/about-us" },
          { label: "Current page" },
        ],
      },
    ],
  },
];
