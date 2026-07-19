# Registration, insert menus & per-app wiring

How the modeled component reaches the editor: the registration call, how components are
grouped into insert menus, design tokens, and the monorepo pattern of writing a config once
and applying it per app. This is the plumbing around the modeling — keep it thin and let the
config objects carry the substance.

## Table of contents
- [Gen 1 vs Gen 2 registration](#gen-1-vs-gen-2-registration)
- [Config-as-data: write once, wire per app](#config-as-data-write-once-wire-per-app)
- [Insert menus](#insert-menus)
- [Design tokens](#design-tokens)
- [Deprecating / hiding components](#deprecating--hiding-components)
- [Context & special registrations](#context--special-registrations)

## Gen 1 vs Gen 2 registration

The modeling (inputs, children, links, bundles) is SDK-agnostic. Only the registration call
differs. **Match the SDK the target project already uses** — check its imports.

**Gen 1 — `@builder.io/react`** (both reference repos): imperative calls, usually grouped in
per-category `registerXComponents()` functions, with components lazy-loaded via `next/dynamic`.

```ts
import { Builder, withChildren } from "@builder.io/react";
import dynamic from "next/dynamic";

Builder.registerComponent(
  dynamic(() => import("@repo/components/components/navigation/Header")),
  HeaderConfig,                       // the config object you modeled
);
Builder.registerComponent(withChildren(Carousel), CarouselConfig);
```

**Gen 2 — `@builder.io/sdk-react`** (GA Core): components are plain data in a
`RegisteredComponent[]` array handed to `<Content customComponents={...} />`. Same config
shape (`name`, `inputs`, `childRequirements`, `defaultStyles`), just collected into an array
instead of imperative calls.

```ts
export const registration: RegisteredComponent[] = [
  { component: Header, ...HeaderConfig },
];
```

## Config-as-data: write once, wire per app

The pattern that makes a monorepo's component library reusable: a component's **input model is
a plain exported object**, decoupled from the registration call. The shared package owns the
configs; each app decides which to register and supplies app-specific values.

```ts
// packages/components/configs/cta/TileContent.config.ts  — pure data, no Builder import
export const TileContentConfig = {
  name: "TileContent", friendlyName: "Tile Content",
  childRequirements: { /* ... */ },
  inputs: [ ...siteThemeableInputs, /* ... */ ],
  defaultStyles: { marginBottom: "20px" },
};
```

```ts
// apps/securus/registry/components.ts  — the app picks configs and wires them
import { Builder } from "@builder.io/react";
import dynamic from "next/dynamic";
import { TileContentConfig, CarouselConfig, HeaderConfig /* ...49 configs */ } from "@repo/components/configs";

Builder.registerComponent(dynamic(() => import(".../TileContent")), TileContentConfig);
```

Why this matters for modeling:
- **One model, many apps.** The same `TileContentConfig` serves every brand; differences
  (themes, default theme) come from injected bundles like `siteThemeableInputs`, not forks.
- **App owns the surface.** An app registers only the components and menus it needs — adding or
  removing a component is one line in that app's registry, no change to the shared config.
- **Configs stay free of app specifics.** Never bake an app's API key, theme list, or brand
  default into a shared config; inject those at the app layer (see `inputs.md` →
  site-specific bundles, and `link-inputs.md` → plugin settings).

Keep config files import-light (ideally no `Builder` import at all) so they're portable data,
not registration side effects.

## Insert menus

Insert menus are how components are grouped in the editor's "add" panel. Opt out of Builder's
auto-categorization and define your own, so the menu reflects your component taxonomy
(Navigation, UI, CTA, Layout, Media, Forms, SEO, Search).

```ts
// turn off auto-grouping, then register each menu
Builder.register("editor.settings", { customInsertMenu: true });

Builder.register("insertMenu", {
  name: "CTA",
  items: [ { name: "TileContent" }, { name: "CardCTA" }, /* ... */ ],
});
```

Modeling guidance:
- **Group by editorial purpose**, not code folder — editors look for "a call to action", not
  "the cta package".
- A component appears in a menu by `name`; the name in the menu item must match the registered
  component `name`.
- Apps enable menus à la carte (the repos comment menus in/out per app), so each brand exposes
  only the categories it uses.

## Design tokens

Register the design system's tokens so the editor's style controls offer brand-correct values
(colors, spacing, fonts) instead of a raw color picker. This keeps editor-made styles on-brand.

```ts
Builder.register("editor.settings", {
  designTokens: {
    colors: [
      { name: "Primary",   value: "var(--color-primary, #cf4b08)" },
      { name: "Secondary", value: "var(--color-secondary, #eee478)" },
    ],
    spacing:    [ { name: "lg", value: "var(--spacing-lg, 16px)" }, /* ... */ ],
    fontSize:   [ { name: "60", value: "var(--size-60, 24px)" }, /* ... */ ],
    fontFamily: [ { name: "Primary", value: "var(--font-primary, 'Lufga', sans-serif)" } ],
  },
});
```

Use CSS-variable values (`var(--token, fallback)`) so a token resolves to the live theme at
render time and the editor still shows a sensible fallback swatch.

## Deprecating / hiding components

Don't delete a registered component that pages may still use — its content would break.
Instead keep it registered but hidden from the insert menu so no new instances are created:

```ts
Builder.registerComponent(CTAButton, {
  name: "CTA Button",
  hideFromInsertMenu: true,        // existing instances still render; can't insert new ones
  inputs: [ /* keep the same inputs so existing content keeps working */ ],
});
```

The repos collect these in a `deprecated-components.ts` file. Keep the input shape intact so
already-placed instances render unchanged; only the discoverability is removed.

## Context & special registrations

Beyond components, the SDK registers a few other things that shape editor behavior — model
them where they belong:

- **`Builder.register("context", { name, default, onChange })`** — shared data (e.g.
  `siteProperties`) available to components in the editor.
- **`Builder.register("component", { name, noWrap, canHaveChildren })`** — bare structural
  models (e.g. an `Article` wrapper) that aren't full components.
- **`Builder.register("editor.toolbarButton", { component })`** — editor-level actions (e.g. a
  translate-page button), not page content.

These are plumbing, not modeling — register them once at the app/editor layer and keep them out
of component configs.
