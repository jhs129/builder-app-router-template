import type { RegisteredComponent } from "@builder.io/sdk-react";
import { registration as eventSchemaData } from "../components/seo/EventSchemaData/EventSchemaData.builder.registration";

// Each registered SEO component owns its own Builder registration alongside its
// implementation. This barrel just concatenates them in display order.
export const seoComponents: RegisteredComponent[] = [...eventSchemaData];
