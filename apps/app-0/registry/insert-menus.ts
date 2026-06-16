import { INSERT_MENUS, type InsertMenuConfig } from "@repo/components";

// The app chooses which insert menus appear in the Builder.io editor.
//
// Defaults to every menu the package defines. To customize, replace this with
// a hand-picked subset (e.g. `[INSERT_MENUS.ui, INSERT_MENUS.layout]`) or add
// an app-specific menu inline.
export const insertMenus: InsertMenuConfig[] = Object.values(INSERT_MENUS);
