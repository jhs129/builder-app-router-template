import type { RegisteredComponent } from "@builder.io/sdk-react";
import { registration as banner100 } from "../components/layout/Banner100/Banner100.builder.registration";
import { registration as carousel } from "../components/layout/Carousel/Carousel.builder.registration";
import { registration as tabs } from "../components/layout/Tabs/Tabs.builder.registration";

// Each layout component owns its own Builder registration alongside its
// implementation. This barrel just concatenates them in display order.
export const layoutComponents: RegisteredComponent[] = [
  ...banner100,
  ...carousel,
  ...tabs,
];
