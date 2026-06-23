# Children, blocks, and nested content

The most consequential modeling decision: **what lives inside a component, and who owns it —
the developer (hardcoded in React) or the editor (exposed as nestable Builder content).**
Get this right and editors compose freely without breaking the design; get it wrong and you
either handcuff them or hand them a footgun.

## Table of contents
- [The hardcode-vs-expose decision](#the-hardcode-vs-expose-decision)
- [Open child slots: canHaveChildren + withChildren](#open-child-slots-canhavechildren--withchildren)
- [Restricting child types: childRequirements](#restricting-child-types-childrequirements)
- [Typed children in the interface](#typed-children-in-the-interface)
- [Region inputs: uiBlocks / blocks](#region-inputs-uiblocks--blocks)
- [Pre-nested but removable: defaultValue.blocks](#pre-nested-but-removable-defaultvalueblocks)
- [defaultStyles](#defaultstyles)
- [Choosing between the mechanisms](#choosing-between-the-mechanisms)

## The hardcode-vs-expose decision

Ask one question about every piece of nested content: **is this the editor's decision or the
developer's?**

| Hardcode in React (do NOT expose) | Expose as editor content |
|-----------------------------------|--------------------------|
| Structural chrome: gradient overlays, decorative frames, layout scaffolding | The actual content cards, buttons, copy an editor curates |
| Anything that must always be present for the design to work | Anything that legitimately varies page to page |
| Logic-bound markup (ARIA wiring, focus order, schema markup) | Free-form regions ("put whatever here") |
| Things an editor deleting would *break the component* | Things an editor deleting is a *valid choice* |

Heuristic: if removing it would be a bug, hardcode it. If removing it is an editorial choice,
expose it. Don't expose structural chrome just because it's "more flexible" — flexibility the
editor shouldn't use is just surface area for mistakes.

The exposing mechanisms, from most constrained to most open, are below.

## Open child slots: canHaveChildren + withChildren

The simplest "editor can nest things here" model. The component declares it accepts children;
in the Gen 1 SDK you also wrap the component in `withChildren()` so dropped blocks render in
place.

```ts
import { Builder, withChildren } from "@builder.io/react";

Builder.registerComponent(withChildren(Carousel), {
  name: "Carousel",
  canHaveChildren: true,
  inputs: [ /* title, theme, etc. */ ],
});
```

Use this when the component is a **container** (carousel, grid, section) and the children can
be anything. In the Gen 2 SDK the equivalent is `canHaveChildren: true` on the
`RegisteredComponent` (no `withChildren` wrapper).

## Restricting child types: childRequirements

When a component only makes sense with specific children — a content tile that should contain
only buttons, a footer column that should contain only links — constrain it. The editor gets a
clear message and Builder blocks invalid drops.

```ts
export const TileContentConfig = {
  name: "TileContent",
  childRequirements: {
    message: "You can only add Button components as children",
    query: { "component.name": { $in: ["Button"] } },
  },
  inputs: [ /* ... */ ],
};
```

- `message` shows in the editor when a disallowed drop is attempted — write it as guidance.
- `query` uses Builder's Mongo-style matcher; `$in` with a list of component names is the
  common case.

This is the sweet spot for most "container with a contract" components: open enough that
editors compose, constrained enough that they can't break the layout.

## Typed children in the interface

Mirror the `childRequirements` constraint in TypeScript so the renderer and the editor agree:

```ts
interface TileContentProps extends Themeable, Alignable, Heroic, Opaque, Stylable {
  // ...content fields...
  children?: ReactElement<typeof Button> | ReactElement<typeof Button>[];
}
```

The `children` type documents the same contract the `childRequirements.query` enforces in the
editor. Keep them in sync: if you widen the query to allow another child type, widen the type.

## Region inputs: uiBlocks / blocks

`canHaveChildren` gives a component **one** child slot. When a component has **named regions**
(a banner with a "content" area distinct from its background, a card with separate header and
body slots), model each region as a `uiBlocks` input holding an array of Builder elements.

```ts
// _shared-banner-inputs.ts
export const bannerLayoutInputs = [
  { name: "content", type: "uiBlocks", hideFromUI: true,
    defaultValue: { blocks: [] } },     // an empty, editor-fillable region
  { name: "fullWidth", type: "boolean", defaultValue: true },
];
```

- `type: "uiBlocks"` (Gen 1) / a `blocks`-typed input — the value is `{ blocks: [...] }`.
- `hideFromUI: true` hides the *raw blocks field* from the inputs panel; editors interact with
  the region directly on the canvas, not via a form field. Use it so the region doesn't show
  up as a confusing JSON input.
- The React component renders the region with Builder's `Blocks`/`BuilderBlocks` at the right
  spot, so editors drop content exactly where it belongs in the layout.

This is how you give a component **multiple, positioned, editor-owned regions** rather than one
undifferentiated child pile.

## Pre-nested but removable: defaultValue.blocks

The pattern that resolves "I want it to ship with content, but editors must be able to change
or delete it." Seed the region's `defaultValue.blocks` with real Builder element JSON. On
insert the editor sees the pre-built structure; they can rearrange or remove any of it because
it's ordinary editor content, not hardcoded markup.

```ts
// Banner75: ships with a 2/3 + 1/3 Columns layout the editor can edit or delete
{ ...bannerLayoutInputs[0], // the "content" uiBlocks input
  defaultValue: {
    blocks: [
      { "@type": "@builder.io/sdk:Element",
        component: {
          name: "Columns",
          options: {
            columns: [ { blocks: [], width: 66.666666 },
                       { blocks: [], width: 33.333333 } ],
            space: 20, stackColumnsAt: "tablet",
          },
        },
      },
    ],
  },
}
```

Anatomy of a default block:
- `"@type": "@builder.io/sdk:Element"` — marks it as a Builder element.
- `component.name` — any registered component (`Columns`, `TileContent`, `Button`, ...).
- `component.options` — that component's input values.
- Nested `blocks: []` inside (e.g. each column) — empty slots the editor fills.

**This is the key alternative to hardcoding.** Instead of baking the Columns layout into the
banner's JSX (where editors can never touch it), you ship it as default content. Same initial
appearance, but now it's the editor's to own. Reach for this whenever you catch yourself about
to hardcode a layout "to give them a starting point" — make it a default block instead.

## defaultStyles

`defaultStyles` sets the component's initial CSS in the editor (the styles an editor sees and
can override). It models **layout intent**, not visual design — how the component sits in the
flow by default.

```ts
defaultStyles: { display: "block", width: "100%", minWidth: "100%", maxWidth: "100%" } // full-bleed banner
defaultStyles: { display: "inline" }        // an inline link component
defaultStyles: { marginBottom: "20px" }     // default spacing below a tile
```

Set it so a freshly inserted component sits correctly without the editor reaching for the
style tab. Keep it minimal — it's a starting point the editor can override, not a stylesheet.

## Choosing between the mechanisms

```
Need editor-owned content inside the component?
├─ One open slot, any component → canHaveChildren (+ withChildren in Gen 1)
├─ One slot, only certain components → canHaveChildren + childRequirements + typed children
├─ Multiple named/positioned regions → uiBlocks/blocks input per region (hideFromUI)
└─ Should ship pre-built but stay editable → any of the above + defaultValue.blocks

Content must always be present and is not the editor's to change?
└─ Hardcode it in React. Do not register an input or a slot for it.
```

When in doubt, prefer the **most constrained** option that still meets the editorial need.
It's easy to loosen a constraint later; it's painful to discover editors have built pages on
freedom you didn't mean to give them.
