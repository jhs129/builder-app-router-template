import type { RegisteredComponent } from "@builder.io/sdk-react";
import { registration as button } from "../components/ui/Button/Button.builder.registration";
import { registration as notFoundContent } from "../components/ui/NotFoundContent/NotFoundContent.builder.registration";
import { registration as accordion } from "../components/ui/Accordion/Accordion.builder.registration";
import { registration as alert } from "../components/ui/Alert/Alert.builder.registration";
import { registration as designKitOverview } from "../components/ui/DesignKitOverview/DesignKitOverview.builder.registration";
import { registration as headline } from "../components/ui/Headline/Headline.builder.registration";
import { registration as dynamicLink } from "../components/ui/DynamicLink/DynamicLink.builder.registration";

// Each UI component owns its own Builder registration alongside its
// implementation. This barrel just concatenates them in display order.
export const uiComponents: RegisteredComponent[] = [
  ...button,
  ...notFoundContent,
  ...accordion,
  ...alert,
  ...designKitOverview,
  ...headline,
  ...dynamicLink,
];
