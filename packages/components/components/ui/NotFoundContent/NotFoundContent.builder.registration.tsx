import type { RegisteredComponent } from "@builder.io/sdk-react";
import { withImage } from "../../../registry/shared";
import NotFoundContent from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: NotFoundContent,
    name: "NotFoundContent",
    ...withImage(),
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
];
