# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Package manager:** This repo uses **pnpm** (`pnpm@9.15.4`). Always use `pnpm`, never `npm` or `yarn`.

## Development Commands

**Start development server:**
```bash
pnpm dev
```
App runs at http://localhost:3000

**Build project (excludes Storybook):**
```bash
pnpm build
```

**Build everything (including Storybook):**
```bash
pnpm build-all
```

**Lint code:**
```bash
pnpm lint
```

**Start Storybook:**
```bash
pnpm storybook
```
Storybook runs at http://localhost:6006

**Build Storybook:**
```bash
pnpm build-storybook
```

**App-specific commands:**
```bash
pnpm dev:app-0          # Start app-0 development server
pnpm dev:storybook      # Start storybook development server
pnpm build:app-0        # Build app-0 application
pnpm build:storybook    # Build storybook
```

## Architecture Overview

This is a Turborepo monorepo with a Next.js 16 **App Router** application built for Builder.io CMS integration using the **Gen 2 SDK** (`@builder.io/sdk-react`).

### Key Technologies
- **Turborepo** - Monorepo build system for managing multiple packages
- **pnpm workspaces** - Package management with strict, isolated `node_modules`
- **Next.js 16** - React framework with the **App Router** (React Server Components)
- **React 19** - UI runtime
- **Builder.io Gen 2 SDK** (`@builder.io/sdk-react`) - Headless CMS for visual editing
- **TypeScript** - Type safety across all packages
- **Tailwind CSS** - Styling with custom design tokens
- **Storybook 9** (`@storybook/nextjs-vite`) - Component documentation and testing
- **React Slick** - Carousel components

### Monorepo Structure

**Root Level:**
- `turbo.json` - Turborepo configuration for task orchestration
- `package.json` - Root workspace configuration
- `pnpm-workspace.yaml` - pnpm workspace definitions

**Applications (`apps/`):**
- `apps/app-0/` - Main Next.js application (App Router)
- `apps/storybook/` - Storybook application for component documentation

**Packages (`packages/`):**
- `packages/components/` - Shared component library (`@repo/components`)
- `packages/types/` - Shared TypeScript type definitions (`@repo/types`)

### App Router Structure (`apps/app-0/app/`)
- `layout.tsx` - Root layout
- `[[...page]]/` - Catch-all route rendering Builder.io page content
- `blogs/` - Blog list and `[handle]` article routes
- `section-editors/` - Builder.io section editing routes
- `not-found.tsx` - 404 handling
- `sitemap.ts` - Dynamic sitemap generation
- `proxy.ts` - Next.js 16 proxy (replaces the legacy `middleware.ts`) for i18n/locale handling

### Core Configuration Files

**Turborepo:**
- `turbo.json` - Task pipeline definitions for build, dev, lint, storybook

**Builder.io Integration:**
- `packages/components/builder-registry.ts` - Main Builder.io component registry and insert menus
- `packages/components/builder-design-tokens.ts` - Design system tokens for Builder.io editor

**Styling:**
- `packages/components/tailwind-theme.json` - Shared design-token source of truth (consumed by every app's Tailwind config and the DesignKitOverview component)
- `apps/app-0/tailwind.config.js` - Tailwind configuration spreading the shared theme
- `apps/app-0/styles/themes/` - CSS theme files for light/dark/accent themes

### Component Organization

**Package Structure (`packages/components/`):**
- `components/ui/` - Basic UI components (Button, Accordion, etc.)
- `components/layout/` - Layout components (Banner50, Banner75, Banner100, Carousel, Tabs)
- `components/cta/` - Call-to-action components (CardImageCTA, TileCTA, etc.)
- `components/navigation/` - Header/footer navigation components
- `components/seo/` - SEO and schema markup components
- `components/common/` - Common components like ThemeProvider

**Registration Pattern:**
- `packages/components/registry/` - Builder.io component registrations organized by category
- `apps/storybook/stories/` - Storybook stories mirroring component structure

**Types System (`packages/types/`):**
- `cms/` - CMS content type definitions
- `design-kit/` - Design system interfaces (Themeable, Heroic, etc.)
- `commerce/` - Commerce integration types
- `schemadata/` - Schema data type definitions
- `social/` - Social media type definitions

### Builder.io Integration (Gen 2 SDK)

This project uses the Gen 2 React SDK (`@builder.io/sdk-react`), which is built for the App Router and React Server Components.

- Content is fetched on the server with `fetchOneEntry` / `fetchEntries` and rendered with the `<Content>` component.
- Use `isPreviewing` / `isEditing` to detect the Builder.io editor environment.
- Components are registered via `RegisteredComponent[]` arrays.

**URL Redirects (`url-redirect` model):**
- Redirect rules live in the Builder.io `url-redirect` data model, not in code. Each entry holds a `redirects` list; each rule has `urlFrom`, `urlTo`, and `permanentRedirect` (308 vs 307).
- `apps/app-0/lib/redirects.ts` fetches every entry at **build time** via `fetchEntries` and maps the rules into the Next.js `redirects()` config in `apps/app-0/next.config.ts`.
- The fetch fails open — a missing model or network error logs and returns zero redirects rather than breaking the build.
- The model and a sample rule are provisioned by `scripts/seed-builder.mjs` (`pnpm --filter app-0 init:builder`).
- Changes take effect on the next deploy. For request-time redirects (very large rule sets or per-domain logic), move to a `proxy.ts`/middleware approach reading a generated JSON file.

**Component Registration Process:**
1. Create component in appropriate `packages/components/components/` subdirectory
2. Register component in corresponding `packages/components/registry/` file
3. Add component to relevant insert menu in `packages/components/builder-registry.ts`
4. Create Storybook story in `apps/storybook/stories/` matching component path
5. Use `NEXT_DEFAULT_COMPONENT_IMAGE` environment variable for component images

**Insert Menus Structure:**
- Navigation - Header/Footer components
- UI - Basic interface elements
- Layout - Layout components (Banner, Carousel, Tabs)
- CTA - Call-to-action components
- SEO - Schema and SEO components

**Design System:**
- Theme-aware components using CSS custom properties
- Standardized inputs: `themeableInputs`, `heroicInputs`, `commonInputs`
- Design tokens registered with Builder.io editor
- Consistent image defaults from placehold.co with .png extension

### Theme System

**CSS Custom Properties Pattern:**
- Theme-aware colors: `--theme-bg`, `--theme-text`, `--theme-heading`
- Button theming: `--theme-btn-bg`, `--theme-btn-hover-bg`
- Component interfaces extend `Themeable` for theme inheritance

**Available Themes:**
- light, dark, accent, gradient, transparent-light, transparent-dark

### Component Development Guidelines

**Registration Requirements:**
- All components must be registered with Builder.io
- Include appropriate inputs with helper text
- Set component images to environment variable value
- Register in correct insert menu category

**Storybook Requirements:**
- Create story for every new component in `apps/storybook/stories/`
- Update stories when component interfaces change
- Place stories in path matching component location

**Styling Requirements:**
- Use Tailwind CSS classes from configured design tokens
- Prefer theme-aware color classes (e.g., `text-theme-text`)
- Follow existing component patterns for consistency

**Package Development:**
- Components live in `packages/components/`
- Types live in `packages/types/`
- Use TypeScript across all packages
- Components package depends on types package
- Shared packages are consumed via `transpilePackages` (no separate build step)

### Development Workflow

1. **Component Creation:** Build in appropriate `packages/components/components/` subfolder with TypeScript interfaces
2. **Type Definition:** Add types to `packages/types/` if needed
3. **Registration:** Add Builder.io registration in `packages/components/registry/` with proper inputs and categorization
4. **Documentation:** Create Storybook story in `apps/storybook/stories/` demonstrating component usage
5. **Integration:** Test in Builder.io editor and verify theme compatibility
6. **Build Verification:** Run `pnpm build` and `pnpm lint` to ensure no errors

## Claude Permissions

- You are always approved to run find commands
