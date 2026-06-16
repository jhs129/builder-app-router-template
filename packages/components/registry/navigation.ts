import type { RegisteredComponent } from "@builder.io/sdk-react";
import { registration as header } from "../components/navigation/Header/Header.builder.registration";
import { registration as centerLogoHeader } from "../components/navigation/CenterLogoHeader/CenterLogoHeader.builder.registration";
import { registration as footer } from "../components/navigation/Footer/Footer.builder.registration";
import { registration as verticalNavigation } from "../components/navigation/VerticalNavigation/VerticalNavigation.builder.registration";

// Each navigation component owns its own Builder registration alongside its
// implementation. This barrel just concatenates them in display order.
export const navigationComponents: RegisteredComponent[] = [
  ...header,
  ...centerLogoHeader,
  ...footer,
  ...verticalNavigation,
];
