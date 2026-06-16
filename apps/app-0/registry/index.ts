import type { RegisteredComponent } from "@builder.io/sdk-react";
import { customComponents as defaultComponents } from "@repo/components";

// The app owns the final list of components it ships to the Builder.io editor.
//
// By default it includes every component the package provides. To customize:
//   - omit a component: filter it out of `defaultComponents`
//   - add an app-only component: append its RegisteredComponent here
//   - override a package component: replace the matching entry
export const customComponents: RegisteredComponent[] = [...defaultComponents];
