# New Component

Scaffold a new component in `@repo/components` following the self-contained-folder pattern
documented in **`packages/components/COMPONENT_PATTERN.md`**. Read that file first — it is the
source of truth for structure, contracts, and shared inputs. This command walks the developer
through the decisions and wires up every file so the component builds, lints, and appears in
Storybook (and, if chosen, in the Builder.io editor).

---

## Step 1: Gather requirements

Ask the developer these questions (one message, let them answer all at once). If any answer is
obvious from the request that invoked the command, pre-fill it and just confirm.

1. **Component name** (PascalCase, e.g. `FeatureCard`).
2. **Category** — one of `ui`, `cta`, `layout`, `navigation`, `seo`, `common`.
3. **Register with Builder.io?** — _"Should this component be available in the Builder.io
   visual editor?"_ (yes / no)
   - **yes** → it gets a `{Name}.builder.registration.tsx`, a barrel entry, and an insert-menu
     entry.
   - **no** → it's a helper/library component (like `ThemeProvider` or `buildPageMetadata`); skip
     all registration wiring. Still gets `index.tsx` + a story.
4. **If registered**, also ask:
   - Which **insert menu** group it belongs to (defaults to the category: Navigation / UI / CTA /
     Layout / SEO).
   - Whether it should be **theme-aware** (spread `themeableInputs`), **heroic**
     (`heroicInputs`), and/or **alignable** (`alignableInputs`).
   - Whether it should **accept child components** (`canHaveChildren` + optional
     `childRequirements`).
   - Whether it needs **Builder context/block props** (`shouldReceiveBuilderProps`).

Confirm the plan back to the developer before creating files.

---

## Step 2: Create the component folder

Create `packages/components/components/{category}/{Name}/index.tsx`:

- Define a simple `Props` interface (no `Omit` / `NonNullable`).
- Implement a minimal but valid component using theme-aware Tailwind classes
  (`bg-theme-bg`, `text-theme-text`, etc.) where appropriate.
- Any default image uses a `placehold.co` URL with a **`.png`** extension.
- Export both named and default: `export { Name };` and `export default Name;`.
- If the component will exceed ~100 lines or needs sub-components/helpers, split them into
  sibling files in the same folder, keeping the primary component + `Props` in `index.tsx`.

---

## Step 3 (registered only): Builder.io registration

Create `{Name}.builder.registration.tsx` beside `index.tsx`:

```tsx
import type { RegisteredComponent } from "@builder.io/sdk-react";
import { themeableInputs, withImage, type Inputs } from "../../../registry/shared";
import {Name} from "./index";

export const registration: RegisteredComponent[] = [
  {
    component: {Name},
    name: "{Name}",
    ...withImage(),
    // shouldReceiveBuilderProps / canHaveChildren / childRequirements — add if chosen
    inputs: [
      // ...themeableInputs / ...heroicInputs / ...alignableInputs as chosen
      // component-specific inputs with helperText and sensible defaults
    ],
  },
];
```

Rules (see COMPONENT_PATTERN.md §2):
- It **must** export `registration: RegisteredComponent[]` (always an array).
- Import shared input bundles and `withImage()` from `../../../registry/shared` — never re-cast
  inputs in the component file.
- Use `withImage()` for the editor thumbnail.

Then wire it up:
1. Add `import { registration as {camelName} } from "../components/{category}/{Name}/{Name}.builder.registration";`
   and spread `...{camelName}` into the array in `packages/components/registry/{category}.ts`.
2. Add `{ name: "{Name}" }` to the matching group in
   `packages/components/registration/insert-menus.ts`.

---

## Step 4: Storybook story

Create `{Name}.stories.tsx` co-located in the folder:

- `import type { Meta, StoryObj } from "@storybook/nextjs-vite";`
- Import the component from `./index`.
- Import any sibling components by relative path (`../../{category}/{Other}`) — **never** from
  `@repo/components`.
- Provide a `Default` story plus a couple of meaningful variants.

---

## Step 5: Export from the package barrel

Add `export * from './components/{category}/{Name}';` to `packages/components/index.ts` (folder
resolves to `index.tsx`).

---

## Step 6: Verify

Run and fix until all are green:

```bash
pnpm build
pnpm lint
pnpm build:storybook
```

Then summarize for the developer:
- The files created (with paths).
- Whether it was registered with Builder.io and which insert menu it landed in (or that it was
  intentionally left unregistered).
- Confirmation that build, lint, and Storybook all pass.

---

## Notes

- The authoritative reference is `packages/components/COMPONENT_PATTERN.md` — keep this command and
  that doc in sync if the pattern changes.
- Non-registered components skip Steps 3's wiring entirely but still follow every other step.
- Adding a component to an existing category never requires editing `registry/index.ts` — only the
  category barrel changes.
