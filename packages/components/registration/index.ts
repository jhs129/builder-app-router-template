// Re-export all registration utilities
export * from "./insert-menus";
export * from "./design-tokens";
export * from "./components";

import { registerAllInsertMenus } from "./insert-menus";
import { registerDesignTokens } from "./design-tokens";

// Configuration interface for Builder.io app setup
export interface BuilderAppConfig {
  // Which insert menus to include
  insertMenus: import("./insert-menus").InsertMenuKey[];

  // Which component categories to register
  components: {
    navigation?: boolean;
    ui?: boolean;
    cta?: boolean;
    layout?: boolean;
    seo?: boolean;
  };

  // Custom design tokens (will merge with defaults)
  designTokens?: Partial<import("./design-tokens").DesignTokens>;

  // Design token options
  designTokensOptional?: boolean;
}

// Convenience function to register editor-only settings (insert menus +
// design tokens). MUST only be called in a browser/client context, never
// during server rendering, because register(...) touches browser globals.
export function registerAllBuilderContent() {
  registerAllInsertMenus();
  registerDesignTokens();
}
