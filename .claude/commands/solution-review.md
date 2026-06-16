# Solution Review

Audit this Next.js 16 App Router / Builder.io (Gen 2 SDK) Turborepo monorepo against best practices. For every gap found, explain the **why** behind the best practice so the developer understands the pattern, not just the fix. Then interactively decide which gaps to log as Jira bugs.

---

## Evaluation Dimensions

| # | Dimension | What's Checked |
|---|-----------|----------------|
| 1 | **Performance & Image Optimization** | `next/image` usage, LCP candidates, image sizing |
| 2 | **Component Architecture** | File size, splitting conventions, co-location of registry/stories |
| 3 | **Builder.io Integration** | Registration completeness, insertMenu entries, default images |
| 4 | **Tailwind & Theming** | Token usage, hardcoded colors, theme-aware classes |
| 5 | **Data Fetching Patterns** | Server-side `fetchOneEntry`/`fetchEntries`, `generateStaticParams`, `revalidate`, `notFound()`, `use client` boundaries |
| 6 | **Type Safety** | `any` usage, interface definitions, missing types |
| 7 | **Code Quality & Polish** | Lint cleanliness, console.log statements, unused imports, a11y |

---

## Step 1: Dispatch Parallel Audit Subagents

Invoke `superpowers:dispatching-parallel-agents` with 7 subagents — one per dimension. Each subagent runs its assigned bash commands, reads relevant files, and returns a structured result object.

**Required result format for every subagent:**
```json
{
  "dimension": "<number> — <name>",
  "rating": "✅ Pass | ⚠️ Gap | ❌ Missing",
  "summary": "one-line description of the finding",
  "issues": [
    {
      "title": "short plain-English title",
      "files": ["path/to/file.tsx"],
      "problem": "one sentence: what is wrong",
      "fix": "one sentence: what the best-practice fix is"
    }
  ],
  "teachingNote": "the 'What to teach' text from the dimension instructions below"
}
```

---

### Subagent 1 — Performance & Image Optimization

Run:
```bash
grep -rn "<img " packages/components/components/ apps/app-0/app/ --include="*.tsx" --include="*.jsx"
grep -rn "next/image\|from 'next/image'" packages/components/components/ apps/app-0/app/ --include="*.tsx"
```

Look for: Are `<img>` tags used instead of `next/image`? Are images missing `width`/`height` props? Are large hero images missing `priority` prop? Are Builder.io image fields using `next/image` wrappers where applicable?

Teaching note: *`next/image` automatically optimizes images: lazy loading, modern formats (WebP/AVIF), and correct sizing prevent LCP regressions and reduce bandwidth. Hero images above the fold need `priority` to avoid lazy-loading the LCP element. Raw `<img>` tags will generate Next.js warnings and hurt Core Web Vitals.*

---

### Subagent 2 — Component Architecture

Run:
```bash
find packages/components/components -name "*.tsx" -not -name "*.stories.tsx" -not -name "*.builder.registration.tsx" | xargs wc -l | sort -rn | head -20
# Component impls should live in folders, not as flat files at the category root
find packages/components/components -maxdepth 2 -name "*.tsx" -not -path "*/*/*"
# Every component folder should carry a co-located story
find packages/components/components -mindepth 2 -name "index.tsx" | sed 's#/index.tsx##' | while read d; do ls "$d"/*.stories.* >/dev/null 2>&1 || echo "MISSING STORY: $d"; done
```

Also read `packages/components/COMPONENT_PATTERN.md` (the authoritative pattern) and the CLAUDE.md rule: "If a component needs sub components and helper methods and is more than 100 lines of code, please split it into multiple files in a directory of the component name."

Look for: Is every component self-contained in its own folder (`components/{category}/{Name}/index.tsx`) rather than a flat file at the category root? Is the primary component + its `Props` interface in `index.tsx`, with sub-components/helpers split into sibling files when over ~100 lines? Are Props interfaces defined simply (no `Omit`, `NonNullable` complexity)? Does every component folder have a **co-located** `{Name}.stories.tsx` (stories should no longer live under `apps/storybook/stories/`)?

Teaching note: *Each component lives in its own folder (`index.tsx` + optional `{Name}.builder.registration.tsx` + co-located `{Name}.stories.tsx`) so it can be added or removed by touching one folder. Keeping the primary component + `Props` in `index.tsx` and splitting helpers into siblings keeps each file focused. Co-locating the story removes the drift that came from mirroring the tree under `apps/storybook/stories/`. Simple interface definitions (no `Omit`/`NonNullable`) are easier to read and less fragile to refactor.*

---

### Subagent 3 — Builder.io Integration

Run:
```bash
# Per-component registrations co-located with their implementation
find packages/components/components -name "*.builder.registration.tsx"
# Category barrels that concatenate each component's registration
ls packages/components/registry/
cat packages/components/registry/index.ts
# Package default insert menus + the app's composition layer (app owns the final choices)
cat packages/components/registration/insert-menus.ts
ls apps/app-0/registry/
grep -rn "withImage" packages/components/components --include="*.builder.registration.tsx" | head
grep -rn "placehold.co" packages/components/components --include="*.tsx"
```

Also read `packages/components/COMPONENT_PATTERN.md` for the canonical registration contract.

Look for: Does every **registered** component own a `{Name}.builder.registration.tsx` beside its `index.tsx`, exporting `registration: RegisteredComponent[]` (always an array)? Is each registration spread into the matching `registry/{category}.ts` barrel (which `registry/index.ts` combines into `customComponents`)? Is each registered component's `name` listed in the correct group in `packages/components/registration/insert-menus.ts`? Do registrations use the shared `withImage()` helper (reading `NEXT_DEFAULT_COMPONENT_IMAGE`) rather than hardcoding a thumbnail URL, and import shared input bundles from `registry/shared.ts` instead of re-casting inputs? Do default image props use `placehold.co` with a `.png` extension? Does the app layer (`apps/app-0/registry/`) own the final component list / insert menus / design tokens?

Teaching note: *Builder.io registration connects components to the visual editor. In this template each registered component owns its `{Name}.builder.registration.tsx` (contract: always export `registration: RegisteredComponent[]`), thin `registry/{category}.ts` barrels concatenate them, and the **app layer** composes the final `customComponents`, insert menus, and design tokens — so the shared package only provides defaults. Missing registrations or insert-menu entries mean content editors can't find/use the component. `withImage()` centralizes the editor thumbnail so it isn't hardcoded per component, and `registry/shared.ts` is the single place the input `as`-cast lives. Default placehold.co images must use `.png` to avoid format issues.*

---

### Subagent 4 — Tailwind & Theming

Run:
```bash
grep -rn "#[0-9a-fA-F]\{3,6\}\|rgb(\|rgba(" packages/components/components/ apps/app-0/app/ --include="*.tsx" --include="*.css" | grep -v "globals.css\|themes/"
grep -rn "bg-\[#\|text-\[#\|border-\[#" packages/components/components/ apps/app-0/app/ --include="*.tsx"
grep -rn "data-theme" packages/components/components/ --include="*.tsx" | head -10
```

Look for: Are hardcoded hex/rgb colors used in components instead of Tailwind tokens? Are arbitrary Tailwind values (`bg-[#xxx]`) used where a configured token exists? Do theme-aware components use `bg-theme-*` / `text-theme-*` classes from the configured tokens? Are all custom colors referenced from `tailwind.config.js`?

Teaching note: *Hardcoded colors break theming — if a brand color changes, every hardcoded instance must be hunted down. Tailwind tokens defined in `tailwind.config.js` give a single source of truth. The `theme-*` CSS variable pattern (e.g. `bg-theme-bg`, `text-theme-text`) allows the same component to adapt to light/dark themes without duplication.*

---

### Subagent 5 — Data Fetching Patterns (App Router)

Run:
```bash
grep -rn "fetchOneEntry\|fetchEntries\|generateStaticParams\|revalidate\|notFound\|not-found" apps/app-0/app/ --include="*.tsx" --include="*.ts"
grep -rn "Promise.all" apps/app-0/ packages/ --include="*.tsx" --include="*.ts"
grep -rn "use client" apps/app-0/app/ --include="*.tsx" | head -20
```

Also read each route's `page.tsx` under `apps/app-0/app/` to check fetch patterns.

Look for: Is Builder content fetched on the server with `fetchOneEntry` /
`fetchEntries` (not in client components)? Do dynamic routes implement
`generateStaticParams` and a segment-level `revalidate` where appropriate? Is
`notFound()` (from `next/navigation`) called when a fetch returns no content
instead of rendering an empty page? Is `Promise.all` used when multiple
independent fetches happen in the same Server Component? Are `"use client"`
directives limited to components that truly need interactivity?

Teaching note: *In the App Router, Server Components fetch data directly on the
server — keep Builder fetches (`fetchOneEntry`/`fetchEntries`) out of client
components to avoid shipping keys and extra round-trips. `generateStaticParams`
plus a `revalidate` window gives ISR-like static performance with background
refresh. `notFound()` returns a real 404 — without it, empty pages return 200,
which hurts SEO. `Promise.all` collapses independent fetches from sum-of-waits
to the slowest one. Every unnecessary `"use client"` boundary ships more JS and
disables server rendering for that subtree.*

---

### Subagent 6 — Type Safety

Run:
```bash
grep -rn "\bany\b" packages/components/components/ apps/app-0/app/ apps/app-0/lib/ --include="*.tsx" --include="*.ts" | grep -v "//.*any\|eslint-disable\|article: any" | head -20
grep -rn "Omit\|NonNullable\|Parameters\|ReturnType" packages/types/ packages/components/components/ --include="*.ts" --include="*.tsx"
```

Look for: Are `any` types used (outside the intentional `article: any` in the blogs `[handle]` route)? Are interfaces defined using complex utility types (`Omit`, `NonNullable`) that could be written more simply? Are function parameters and return types typed? Are Builder.io model types properly typed?

Teaching note: *`any` disables TypeScript's purpose — every `any` is a place where bugs will hide. The CLAUDE.md convention requires simple interface definitions without `Omit` and `NonNullable` to keep types readable and less fragile. Proper typing makes refactoring safe and documents intent for future maintainers.*

---

### Subagent 7 — Code Quality & Polish

Run:
```bash
pnpm lint 2>&1 | head -60
grep -rn "console\.log\|console\.warn" packages/components/components/ apps/app-0/app/ --include="*.tsx" --include="*.ts" | grep -v "console.error.*'Builder"
grep -rn "TODO\|FIXME\|HACK" packages/components/components/ apps/app-0/app/ --include="*.tsx" --include="*.ts"
```

Look for: Does `pnpm lint` pass clean? Are there stale `console.log` statements left from debugging? Are there unresolved TODOs or FIXMEs? Are components missing accessibility attributes (`aria-label`, `alt` on images, button labels)?

Teaching note: *A clean lint pass is the baseline. `console.log` statements left in production code pollute browser consoles and may leak internal data. TODOs and FIXMEs that survive into main represent deferred debt — they should be converted to Jira tickets if they matter, or removed if they don't. Accessibility is non-negotiable: missing alt text and aria labels break screen reader users.*

---

After all 7 subagents complete, collect their result objects and proceed to Step 2.

## Step 2: Compile and Present Results

After completing all seven sections, present:

1. **A summary table** rating each dimension ✅ Pass / ⚠️ Gap / ❌ Missing
2. **A numbered issue list** — every Gap and Missing item, with:
   - The dimension it belongs to
   - A plain-English title
   - One sentence describing what's wrong
   - One sentence explaining the best-practice fix
   - The specific file(s) involved

Format example:
```
## Audit Results

| # | Dimension | Rating | Summary |
|---|-----------|--------|---------|
| 1 | Performance & Image Optimization | ❌ | Raw img tags in 3 components |
| 2 | Component Architecture | ✅ | All components properly split |
...

## Issues Found

**Issue 1 — Performance: Raw img tag instead of next/image**
📁 `packages/components/components/cta/ImageTestimonial.tsx`
Using a raw img element instead of next/image causes slower LCP and higher bandwidth.
Replace with the Image component from next/image with explicit width and height props.

**Issue 2 — ...**
```

---

## Step 3: Sequential Jira Triage

Once the issue list is presented, go through it one at a time. For each issue:

1. **Explain it conversationally** — briefly restate the problem and why it matters
2. **Ask:** `Log this as a Jira bug? (yes / no / skip-rest)`
3. Wait for the user's response before moving to the next issue

Valid responses:
- **yes** → log it, move to next
- **no** → skip it, move to next
- **skip-rest** → stop asking, go straight to the final summary

---

## Step 4: Log Approved Issues as Jira Bugs

For each approved issue:

```
createJiraIssue(
  cloudId="<cloud-id>",
  projectKey="<project-key>",
  issuetype="Bug",
  summary="[Dimension] <Title>",
  description=<ADF doc with Current State, Expected, and Why It Matters sections>,
  priority="Medium"
)
```

Confirm each one: `✅ Logged <KEY>-<key>: <summary>`

---

## Step 5: Final Summary

```
## Review Complete

Dimensions passing: X/7

### Logged as Jira Issues
- <KEY>-XX — <summary>

### Not logged
- Issue #N — <title> (skipped)
```

---

## Notes

- Project config: read `.claude/project-config.md` for the Jira project key, cloud ID, base URL, and Vercel project name. If **Configured: no**, skip all Jira steps and proceed without them.
- The intentional `article: any` typing in the blogs `[handle]` route is acceptable per CLAUDE.md — do not flag it
- Always cite specific file paths so issues are immediately actionable
