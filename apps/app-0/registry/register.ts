"use client";

import { register } from "@builder.io/sdk-react";
import { registerDesignTokens } from "@repo/components";
import { insertMenus } from "./insert-menus";
import { designTokens } from "./design-tokens";

// Single client-only entry point for this app's Builder.io editor settings.
// MUST only run in the browser — register(...) touches browser globals and
// will throw during server rendering.
//
// This is the only place that calls register("insertMenu", ...): the app's
// chosen menus and design tokens live here so editor configuration is owned
// by the app, not the shared package.
export function registerEditor(): void {
  insertMenus.forEach((menu) => {
    register("insertMenu", menu);
  });
  registerDesignTokens(designTokens);
}
