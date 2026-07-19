---
name: builderio-component-modeling
description: >-
  Use when modeling, registering, or reviewing Builder.io components — deciding how to
  structure a component's editor inputs, interfaces, children, links, and nested content
  for the visual editor. Trigger whenever the work touches a Builder.io component config /
  registration (registerComponent, RegisteredComponent, insertMenu, registerEditor),
  shaping the inputs/props a content editor sees, choosing between hardcoded vs.
  editor-removable nested components (uiBlocks / blocks / withChildren / childRequirements),
  building a CMS link / reference / DynamicLink input, or extending Themeable/Heroic-style
  shared input bundles. Use it even when the user only says "add an input", "let editors
  swap the image", "make this a child slot", "link to a page", or "register this in
  Builder" — this skill is about the DATA + BEHAVIOR model an editor interacts with, not
  how the React component is coded.
---

# Builder.io Component Modeling

This skill captures the data-and-behavior patterns for designing Builder.io components so
they are pleasant to use in the **visual editor** and consistent across a codebase. It is
distilled from two production monorepos (Orlando Health `ohdotcom`, Aventiv `wmsmonorepo`)
plus the GA Core conventions. It is about **how a component is modeled** — its inputs,
interfaces, children, links, and nestable content — not how the component is implemented
in React.

The audience is the person registering the component. Your job is to make the editor
experience predictable: an editor should be able to look at a component, understand what
they can change, and only be offered choices that make sense in their current context.

## The core mental model

A registered Builder component is a **contract between three things that must stay in sync**:

1. **The TypeScript `Props` interface** — what the React component consumes.
2. **The registration `inputs`** — what the editor can set, with the same names and shapes.
3. **The children / blocks model** — what the editor can nest inside, and whether they can
   remove it.

When these three agree, the editor is trustworthy. When they drift (an input named `headline`
mapping to a prop named `title`, or a `theme` input whose `enum` no longer matches the
`Theme` union), editors get silent failures and confusing defaults. **Keep them mirrored.**

Both reference repos enforce this mirror through **shared bundles**: a TypeScript interface
(`Themeable`, `Heroic`, `Alignable`) is paired with an exported input array
(`themeableInputs`, `heroicInputs`, `alignableInputs`). A component `extends` the interfaces
and spreads the matching input bundles. Reach for these bundles first; only hand-write an
input when the field is genuinely component-specific.

## Decision flow

Use this to route to the right reference file. Read the file before writing config.

```
Modeling a component input?
├─ Is it a theme / alignment / spacing / hero field that other components also have?
│     → use a SHARED BUNDLE (themeableInputs, heroicInputs, ...) — references/inputs.md
├─ Is it a link to a page / CMS entry / external URL?
│     → custom link input type (CMSLink / DynamicLink) — references/link-inputs.md
├─ Should some inputs only appear based on another field?
│     → showIf + grouping — references/inputs.md
└─ Otherwise → plain typed input with helperText + defaultValue — references/inputs.md

Modeling what goes INSIDE the component?
├─ A free-form region the editor fills/empties (and can delete)?
│     → uiBlocks / blocks input or canHaveChildren — references/children-and-blocks.md
├─ Restricted to specific child component types (e.g. only Buttons)?
│     → childRequirements query — references/children-and-blocks.md
├─ Should it ship pre-populated but stay removable?
│     → defaultValue.blocks (default Builder elements) — references/children-and-blocks.md
└─ Is the nested content essential and never editor-managed?
│     → hardcode it in the React component, do NOT expose it — references/children-and-blocks.md

Wiring it into the editor (menus, tokens, per-app config)?
      → references/registration-and-menus.md

Making Props and inputs agree (interfaces)?
      → references/interfaces.md
```

## The five principles

These are the throughlines behind every pattern in the reference files.

**1. Model for the editor's mental model, not the renderer's.**
The editor doesn't see your JSX; they see a panel of inputs and some nested blocks. Name
inputs after editorial concepts (`eyebrow`, `headline`, `subheadline`), give every input
`helperText` that says what it does and when to use it, and order inputs the way an editor
thinks about the component (content first, then style, then advanced).

**2. Only show choices that currently apply.**
A field that's irrelevant in the current state is noise that invites mistakes. Use `showIf`
to reveal `backgroundColor` only when `backgroundType === "color"`, `eyebrowLevel` only when
`eyebrow` has text, and push rarely-touched fields behind `advanced: true`. The goal is that
at any moment the panel shows exactly the decisions that matter.

**3. Decide deliberately: hardcoded vs. editor-removable.**
The single most consequential modeling choice is whether a piece of nested content is
**structural** (the developer owns it, hardcode it in React) or **compositional** (the editor
owns it, expose it as `blocks`/children). A hero's gradient overlay is structural. The cards
inside a hero are compositional. Getting this wrong either handcuffs editors or lets them
break the design. See references/children-and-blocks.md — this is the heart of the skill.

**4. Links are a typed value, never a bare string.**
A link can point to an external URL or to a CMS entry whose real URL is resolved at render
time. Model it as a structured value (`{ type, href, model, referenceId }`) via a custom
editor input, so editors pick a page from a list instead of pasting fragile URLs, and so
links survive slug changes. See references/link-inputs.md.

**5. Configuration is shared data, applied per app.**
In a monorepo, a component's input model is written **once** as a plain config object and
reused across apps; each app supplies its own theme enum, default theme, and which components
and menus it enables. Keep configs free of app-specific values; inject those at the app's
registry layer. See references/registration-and-menus.md.

## Reference files

Read the one that matches your task — each is self-contained with real examples from the
reference repos.

| File | Covers |
|------|--------|
| `references/inputs.md` | Input types catalog, shared input bundles, `showIf`, `subFields`/object inputs, `localized`, `advanced`, `enum` (label/value), defaults & helperText conventions |
| `references/interfaces.md` | Composing `Props` from design-kit interfaces, keeping interfaces ↔ inputs in sync, typed children, simple-interface rules |
| `references/children-and-blocks.md` | `canHaveChildren`, `childRequirements`, `withChildren`, `uiBlocks`/`blocks`, `defaultValue.blocks` (pre-nested removable content), `defaultStyles`, the hardcode-vs-expose decision |
| `references/link-inputs.md` | Custom editor input types (`CMSLink`, `DynamicLink`), `registerEditor`, the link value shape, url-vs-reference modeling, content selectors |
| `references/registration-and-menus.md` | Gen 1 vs Gen 2 SDK registration, config-as-data, insert menus, `customInsertMenu`, design tokens, per-app wiring |

## SDK note (read this before writing registration code)

The two reference repos both use the **Gen 1 SDK** (`@builder.io/react`): `Builder.registerComponent(Comp, config)`, `Builder.register("insertMenu", ...)`, `Builder.registerEditor(...)`, `withChildren(Comp)`. The GA Core project uses the **Gen 2 SDK** (`@builder.io/sdk-react`): components are plain `RegisteredComponent[]` arrays passed to `<Content customComponents={...} />`.

**The modeling patterns in this skill are identical across both SDKs** — input shapes, `showIf`, `childRequirements`, `defaultValue.blocks`, shared bundles, and link value shapes all transfer. Only the registration *call* differs. Match whatever SDK the target project already uses (check its imports), and apply these patterns inside it.
