# Design: builder-app-router-template

**Date:** 2026-06-15
**Status:** Approved
**Author:** John Schneider (with Claude)

## Goal & scope

Create a new repository `builder-app-router-template` that is **functionally identical** to
`builder-app-template`, but ported to the **Next.js 16 App Router** using the **Builder.io Gen 2
SDK** (`@builder.io/sdk-react`), with **pnpm** as the package manager and RSC-first rendering.

The Turborepo monorepo shape is preserved: `apps/app-0`, `apps/storybook`,
`packages/components`, `packages/types`.

## Decisions

- **SDK:** Gen 2 (`@builder.io/sdk-react`) — clean, modern, RSC-based App Router port.
- **Package manager:** pnpm (workspaces).
- **i18n:** No translation files exist; localization is purely Builder's `locale` param. Preserve
  current URL behavior (`en` at root, `/es/...` prefixed) via `proxy.ts` + locale resolved in the
  catch-all and passed to `fetchOneEntry`. No `[locale]` segment, no `next-intl`.
- **Next 16 middleware:** rename `middleware.ts` → `proxy.ts`.
- **BuilderDevTools** next-config wrapper: removed (not needed for Gen 2).
- **Sitemap:** `app/sitemap.ts` using `MetadataRoute.Sitemap`.
- **GitHub repo:** private, under `jhs129`, fresh git history.

## SDK migration map (Gen 1 → Gen 2)

| Gen 1 (`@builder.io/react`) | Gen 2 (`@builder.io/sdk-react`) |
|---|---|
| `builder.get("page", …).toPromise()` | `fetchOneEntry({ model, apiKey, userAttributes, options })` |
| `builder.getAll(…)` | `fetchEntries(…)` |
| `<BuilderComponent model content>` | `<Content model content apiKey customComponents>` |
| `<BuilderContent>` render-prop | fetch in server component, pass to `<Content>` |
| `useIsPreviewing()` | `isPreviewing()` / Content preview handling |
| `Builder.registerComponent(dynamic(import), {name, inputs})` | `RegisteredComponent[]` objects → `customComponents` |
| `Builder.register("insertMenu", …)` | unchanged |
| Gen1 design-token registration | `register("editor.settings", { designTokens })` |

A `"use client"` `RenderBuilderContent` wrapper around `<Content>` carries the `customComponents`
registry (canonical Builder App Router pattern).

## App Router file structure (apps/app-0)

| Pages Router (now) | App Router (new) |
|---|---|
| `pages/_app.tsx` + `_document.tsx` | `app/layout.tsx` (html lang, fonts, font-awesome, skip-link, global css) |
| `pages/[[...page]].tsx` (`getStaticProps`/`getStaticPaths`, ISR 5) | `app/[[...page]]/page.tsx` (server fetch, `generateStaticParams`, `export const revalidate = 5`, `generateMetadata`) |
| `pages/blogs/[handle].tsx` | `app/blogs/[handle]/page.tsx` |
| `pages/404.tsx` | `app/not-found.tsx` (fetches Builder `/404` content) |
| `pages/sitemap.xml.tsx` (`getServerSideProps`) | `app/sitemap.ts` (`MetadataRoute.Sitemap`) |
| `pages/section-editors/symbol.tsx` | `app/section-editors/symbol/page.tsx` |
| `middleware.ts` | `proxy.ts` (Next 16; keeps locale/error/deployment-protection logic) |

## packages/components changes

- **Registration rewrite** (`registry/*.ts`, `builder-registry.ts`, `registration/*`): `inputs`
  arrays preserved; convert to `RegisteredComponent[]` + Gen 2 `register("editor.settings", …)`.
  `dynamic()` imports dropped (Gen 2 references components directly).
- **SEO refactor**: `PageSEOHead`/`SEOHead` use `next/head` (unsupported in App Router) → split into
  a `buildMetadata()` helper feeding `generateMetadata`, plus JSON-LD schema rendered as inline
  `<script type="application/ld+json">` server components (`ArticleSchemaData` etc. retained).
- **Routing hooks**: `useRouter` (`next/router`) → `next/navigation` (`usePathname`/`useParams`).
- **Client/server boundaries**: components using hooks marked `"use client"`; presentational leaves
  stay server components. `shouldReceiveBuilderProps` added where components read Builder props.
- Storybook continues importing components directly; refactors stay Storybook-compatible.

## Tooling / config

- **pnpm**: `pnpm-workspace.yaml`, `packageManager: pnpm@…`, drop `package-lock.json`, generate
  `pnpm-lock.yaml`, update CLAUDE.md/README commands.
- **Next 16**: `next@16`, `eslint-config-next@16`, React 19.2+. `next.config.ts`: remove `i18n`
  block, `images.domains` → `images.remotePatterns`, review `webpack` hook (Turbopack default).
  Remove `BuilderDevTools` wrapper.
- Turborepo tasks unchanged.

## Repo creation

Copy source → `../builder-app-router-template`, fresh git history (`git init`, single initial
commit), new private GitHub repo under `jhs129`, push `main`. New `README`/`CLAUDE.md` describing
the App Router + Gen 2 architecture.

## Verification

`pnpm install` → `pnpm build` (app-0 + types clean) → `pnpm lint` → `pnpm build-storybook` →
manual smoke of dev server (home, a Builder page, `/blogs/[handle]`, 404, `/es` redirect,
`sitemap.xml`). Builder editor registration verified against the dev server.

## Known risks

- Gen 2 editor registration parity (insert menus / design tokens / `shouldReceiveBuilderProps`) is
  most likely to need iteration against the live editor.
- App Router preview/editing live-edit behavior differs from Gen 1 `BuilderContent`.
- Next 16 Turbopack may ignore the custom `webpack` devtool hook.
