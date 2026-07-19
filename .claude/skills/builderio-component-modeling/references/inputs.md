# Structuring component inputs

How to shape the editor-facing inputs of a Builder.io component so the panel is predictable
and editors are only offered choices that apply.

## Table of contents
- [Anatomy of an input](#anatomy-of-an-input)
- [Shared input bundles (use these first)](#shared-input-bundles-use-these-first)
- [Input types catalog](#input-types-catalog)
- [Conditional inputs with showIf](#conditional-inputs-with-showif)
- [Nested inputs: object + subFields](#nested-inputs-object--subfields)
- [enum: simple vs label/value](#enum-simple-vs-labelvalue)
- [localized, advanced, required, defaultValue](#cross-cutting-flags)
- [Ordering inputs](#ordering-inputs)

## Anatomy of an input

Every input is a plain object. The fields that matter for modeling:

```ts
{
  name: "headline",          // MUST match the React prop name exactly
  type: "string",            // editor control + value type
  required: true,            // editor flags it; also documents intent
  defaultValue: "[Headline Text]",  // shows immediately on insert
  localized: true,           // per-locale value (i18n sites)
  helperText: "Main heading text for this component", // ALWAYS write this
  enum: ["h1", "h2"],        // constrain to a set
  advanced: true,            // hide behind "Show advanced"
  showIf: "...",             // conditional visibility
}
```

**`helperText` is not optional in practice.** An editor reads it to decide what to put in
the field. Say what the field does and, when non-obvious, when to use it. Good helper text
from the repos: *"Set fetchpriority=high for LCP optimization. Enable only for hero/above-the-fold banners."*

**Default values are previews.** Use bracketed placeholders (`"[Headline Text]"`,
`"[Link Label]"`) so a freshly inserted component renders something visible that an editor
obviously needs to replace, rather than looking broken or empty.

## Shared input bundles (use these first)

The defining pattern of these codebases: recurring input groups are exported once as arrays
and spread into every config that needs them. This keeps dozens of components consistent and
keeps inputs mirrored with their TypeScript interface (see `interfaces.md`).

```ts
// packages/types/design-kit/themeable.ts
export const themeableInputs = [
  { name: "theme", type: "string", required: true, defaultValue: "transparent-light",
    enum: standardThemes, helperText: "Visual theme for the section" },
  { name: "inheritTheme", type: "boolean", defaultValue: false,
    helperText: "Inherit theme from parent component instead of using explicit theme" },
] as const;
```

```ts
// a component config composes bundles, then adds its own fields
export const TileContentConfig = {
  name: "TileContent",
  friendlyName: "Tile Content",
  inputs: [
    ...siteThemeableInputs,   // theme + inheritTheme
    ...opacityInputs,         // maskOpacity
    ...alignableInputs,       // alignment
    ...heroicInputs,          // headline + isHero
    { name: "eyebrow", type: "string", defaultValue: "[Eyebrow Text]", localized: true,
      helperText: "Optional eyebrow text displayed above the headline" },
    // ...component-specific inputs...
    ...commonInputs,          // className, etc. — usually last
  ],
};
```

Common bundles you'll see (names vary slightly per repo): `themeableInputs` /
`siteThemeableInputs`, `heroicInputs`, `alignableInputs`, `opacityInputs`, `commonInputs`,
`backgroundInputs`. **Before hand-writing an input, check whether a bundle already covers it.**

### Site-specific bundles (themes per app)

In a multi-app monorepo the theme list differs per app. The bundle is generated/overridden at
the app layer so `enum` and `defaultValue` reflect that app's themes:

```ts
// resolved from a generated enum, falling back to standardThemes
export const siteThemeableInputs = [
  { name: "theme", type: "string", required: true, defaultValue: defaultTheme,
    enum: themeEnum, helperText: "Visual theme for the section" },
  { name: "inheritTheme", type: "boolean", defaultValue: false,
    helperText: "Inherit theme from parent component instead of using explicit theme" },
];
```

Keep the **shape** shared and inject the **app-specific values** (enum, default) at the edge.

### Making a bundle optional at a call site

Some components want a shared field but not as required. Map over the bundle rather than
duplicating it:

```ts
const makeOptional = (inputs) => inputs.map((i) => ({ ...i, required: false }));
inputs: [ { name: "link", type: "DynamicLink" }, ...makeOptional(themeableInputs) ]
```

## Input types catalog

Common `type` values across the repos and when to use each:

| type | Use for |
|------|---------|
| `string` | Short text. With `enum` → a dropdown. |
| `richText` | Editor-formatted HTML body content. |
| `number` | Numerics; pair with `min`/`max`/`step` for sliders (e.g. `maskOpacity` 0–1 step 0.1). |
| `boolean` | Toggles; great `showIf` drivers. |
| `color` | Color picker (often gated behind a `backgroundType` select). |
| `object` + `subFields` | A grouped set of related inputs (see below). |
| `list` | Repeatable items (each item is a set of subFields). |
| `cloudinaryImageEditor` / `cloudAsset` | Media chosen from the asset pipeline, not a raw URL. |
| `reference` | A direct Builder content reference. |
| **custom** (e.g. `CMSLink`, `DynamicLink`) | Registered via `registerEditor`; see `link-inputs.md`. |
| `uiBlocks` | A nestable region of Builder elements; see `children-and-blocks.md`. |

Prefer asset/reference/link types over `string` whenever the value is really a piece of
content. A `string` URL or a pasted image link is fragile; a typed value gives the editor a
picker and survives content changes.

## Conditional inputs with showIf

`showIf` is how you keep the panel showing only what currently matters. Two forms appear in
the repos — both are fine; match the file you're editing.

**Function form** (gets `options`, call `.get`):
```ts
{ name: "backgroundColor", type: "color",
  showIf: (options) => options?.get("backgroundType") === "color",
  helperText: "Solid color background for the banner" }
```

**String-expression form** (evaluated by Builder):
```ts
{ name: "eyebrowLevel", type: "string", enum: ["h5", "h6"],
  showIf: "options?.get('eyebrow')" }   // only when eyebrow has text
{ name: "headlineLevel", type: "string",
  showIf: "options?.get('isHero') != true" }  // hide when in hero mode
```

Patterns worth copying:
- **Type selector → detail fields.** A `backgroundType` enum (`none|color|media|youtube`)
  reveals a different field per choice (`backgroundColor`, `backgroundMedia`, `backgroundVideoId`).
  The editor picks the mode first, then sees only the relevant controls.
- **Presence-gated level pickers.** Only offer `subheadlineLevel` once `subheadline` has content.
- **Mode-gated SEO.** Hide `headlineLevel` when `isHero` is on (hero forces `h1`).

## Nested inputs: object + subFields

Group related settings into one collapsible object so the panel stays shallow. The repos use
this heavily for media transformations:

```ts
{ name: "transformations", type: "object", advanced: true,
  helperText: "Cloudinary transformation configuration for background media.",
  showIf: (o) => o?.get("backgroundType") === "media",
  subFields: [
    { name: "transformationType", type: "string",
      enum: [
        { label: "Default (Auto-optimized)", value: "none" },
        { label: "Basic", value: "basic" },
        { label: "Custom", value: "custom" },
      ], defaultValue: "none" },
    { name: "basicTransformation", type: "object",
      showIf: (o) => o?.get("transformationType") === "basic",
      subFields: [ /* width, height, focus, grayscale... each with its own showIf */ ] },
  ],
}
```

Note `showIf` works **inside** subFields too, scoped to the sibling fields. This lets one
object input express a small decision tree without flooding the top-level panel.

## enum: simple vs label/value

- **Simple array** when the stored value is what you'd show: `enum: ["h1","h2","h3"]`.
- **`{ label, value }` objects** when the editor-facing wording should differ from the stored
  value: a friendly label, a terse stored token.

```ts
enum: [
  { label: "crop", value: "c_crop" },
  { label: "fill", value: "c_fill" },
]
```

Use label/value whenever the raw value is a code, class name, or CSS token an editor
shouldn't have to recognize.

## Cross-cutting flags

- **`localized: true`** — every editorial text field on an i18n site (headlines, labels, alt
  text, body). Non-content fields (levels, toggles, layout) are usually not localized.
- **`advanced: true`** — fields editors rarely touch (`fetchPriority`, `isHero` internals,
  transformation objects). Keeps the default panel calm.
- **`required: true`** — flags the field in the editor and documents that the renderer expects
  it. Pair with a `defaultValue` so "required" never means "starts broken".
- **`defaultValue`** — always provide one for anything that affects layout/visibility, so an
  inserted component renders sensibly before the editor touches it.

## Ordering inputs

Order by how an editor thinks, not by your prop declaration order:

1. **Content** first (headline, eyebrow, body, image) — what they came to change.
2. **Style/theme** next (theme, alignment, background).
3. **Structure/behavior** after that (layout toggles, levels).
4. **Advanced** last (and behind `advanced: true`).

Spreading bundles in a consistent order (`...themeable, ...alignable, ...heroic, <specific>,
...common`) gives every component a familiar panel.
