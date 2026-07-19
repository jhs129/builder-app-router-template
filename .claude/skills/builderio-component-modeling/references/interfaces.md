# Interfaces: keeping Props and inputs in sync

The TypeScript `Props` interface and the registration `inputs` describe the same contract from
two sides. The renderer trusts the interface; the editor trusts the inputs. When they agree,
the component is reliable. Aventiv's `wmsmonorepo` models this the most cleanly — every shared
input bundle has a matching interface, and components compose both.

## Table of contents
- [The mirror principle](#the-mirror-principle)
- [Compose Props from design-kit interfaces](#compose-props-from-design-kit-interfaces)
- [Pair each interface with an input bundle](#pair-each-interface-with-an-input-bundle)
- [Naming: prop name == input name](#naming-prop-name--input-name)
- [Typed children](#typed-children)
- [Enums: union type == input enum](#enums-union-type--input-enum)
- [Keep interfaces simple](#keep-interfaces-simple)

## The mirror principle

For every component, three things must line up:

```
Props interface field   ⇄   input { name, type, enum }   ⇄   children/blocks model
   (renderer)                    (editor)                      (nesting)
```

Drift is the enemy. A `headline` input mapping to a `title` prop, or a `theme` enum that no
longer matches the `Theme` union, produces silent failures editors can't diagnose. Treat the
interface and the inputs as one change: edit them together.

## Compose Props from design-kit interfaces

Don't redeclare `theme`, `alignment`, `isHero` on every component. Define them once as small
interfaces in a shared design-kit and `extend` the ones a component needs:

```ts
import { Themeable, Alignable, Heroic, Opaque, Stylable } from "@repo/types";

interface TileContentProps extends Themeable, Alignable, Heroic, Opaque, Stylable {
  eyebrow?: string;
  eyebrowLevel?: "h5" | "h6";
  headlineLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  subheadline?: string;
  subheadlineLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
  content: string;
  children?: ReactElement<typeof Button> | ReactElement<typeof Button>[];
}
```

Each design-kit interface is intentionally tiny and single-purpose:

```ts
export interface Themeable { theme?: Theme; maskOpacity?: number; inheritTheme?: boolean; }
export interface Heroic    { isHero?: boolean; headline?: string; }
```

A component's identity becomes "which capabilities it has" (`extends Themeable, Heroic, ...`)
plus its own specific fields. This is the type-level twin of spreading input bundles.

## Pair each interface with an input bundle

The discipline that keeps the mirror intact: **every shared interface ships with a matching
exported input array, in the same file.**

```ts
// design-kit/themeable.ts — interface AND its inputs live together
export interface Themeable { theme?: Theme; maskOpacity?: number; inheritTheme?: boolean; }
export const themeableInputs = [
  { name: "theme", type: "string", required: true, defaultValue: "transparent-light",
    enum: standardThemes, helperText: "Visual theme for the section" },
  { name: "inheritTheme", type: "boolean", defaultValue: false,
    helperText: "Inherit theme from parent component instead of using explicit theme" },
] as const;
```

So a component that `extends Themeable` also spreads `...themeableInputs`. When you add a field
to the capability, you add it to both the interface and the bundle in one place, and every
consumer stays in sync automatically. **When adding a new shared capability, always create the
interface and the input bundle as a pair.**

## Naming: prop name == input name

The single hard rule. `input.name` is the key Builder stores the value under and passes to the
component, so it must equal the prop name exactly.

```ts
// input
{ name: "subheadlineLevel", type: "string", enum: ["h2","h3","h4","h5","h6"], defaultValue: "h3" }
// prop — same name
subheadlineLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
```

If you rename one, rename the other. No mapping layer, no aliases.

## Typed children

When a component restricts its children (via `childRequirements`, see
`children-and-blocks.md`), type `children` to match so the renderer documents the same
contract the editor enforces:

```ts
children?: ReactElement<typeof Button> | ReactElement<typeof Button>[];
```

Widen the type and the query together if you later allow more child types.

## Enums: union type == input enum

A constrained field should be a string-literal union in the interface and the same list as the
input `enum`:

```ts
headlineLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";   // interface
{ name: "headlineLevel", type: "string", enum: ["h1","h2","h3","h4","h5","h6"] }  // input
```

For app-varying sets (themes), derive both from one source of truth — a `standardThemes`
`as const` array that yields the `Theme` union *and* the input `enum`:

```ts
export const standardThemes = ["light","dark","accent","transparent-light", /*...*/] as const;
export type Theme = (typeof standardThemes)[number];   // union from the array
// inputs reference the same array for enum
```

One array, one union, one enum — they cannot drift.

## Keep interfaces simple

Per the GA Core house style (and good practice generally): **declare interface fields in plain
terms.** Avoid `Omit`, `Pick`, `NonNullable`, and other type gymnastics — they make the
prop↔input mirror hard to verify at a glance. Spell out the fields a component accepts so a
reader can line them up against the `inputs` array directly. Composition via `extends` of small
interfaces is encouraged; transformation utilities over those types are not.
