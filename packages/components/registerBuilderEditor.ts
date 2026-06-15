"use client";

import { registerAllInsertMenus } from "./registration/insert-menus";
import { registerDesignTokens } from "./registration/design-tokens";
import { registerBuilderInsertMenus } from "./builder-registry";
import { registerBuilderDesignTokens } from "./builder-design-tokens";

// Single client-only entry point for all Builder.io editor registration.
// Call this once on the client (e.g. inside a 'use client' effect or a
// dedicated client component) when the Builder editor/preview is active.
// It MUST NOT be invoked during server rendering: every call below touches
// browser globals via the Gen2 register(...) API.
export function registerBuilderEditor(): void {
  registerBuilderInsertMenus();
  registerAllInsertMenus();
  registerDesignTokens();
  registerBuilderDesignTokens();
}
