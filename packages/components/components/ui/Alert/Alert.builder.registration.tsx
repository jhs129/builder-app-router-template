import type { RegisteredComponent } from "@builder.io/sdk-react";
import {
  commonInputs,
  themeableInputs,
  withImage,
} from "../../../registry/shared";
import Alert from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: Alert,
    name: "Alert",
    friendlyName: "Alert",
    ...withImage(),
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
        helperText:
          "Delay in milliseconds before auto-hiding (if autoHide is enabled)",
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
];
