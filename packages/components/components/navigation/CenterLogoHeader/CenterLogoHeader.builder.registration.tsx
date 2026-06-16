import type { RegisteredComponent } from "@builder.io/sdk-react";
import { withImage } from "../../../registry/shared";
import CenterLogoHeader from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: CenterLogoHeader,
    name: "CenterLogoHeader",
    friendlyName: "Center Logo Header",
    ...withImage(),
    inputs: [
      { name: "navigation1", type: "object", friendlyName: "Primary Navigation" },
      { name: "navigation2", type: "object", friendlyName: "Secondary Navigation" },
      {
        name: "logo",
        type: "string",
        friendlyName: "Logo URL",
        defaultValue: "https://placehold.co/400x100.png?text=Logo",
      },
    ],
  },
];
