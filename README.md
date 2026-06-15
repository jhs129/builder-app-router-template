# Builder.io App Router Template

A [Turborepo](https://turbo.build/repo) monorepo template pairing **Next.js 16 (App Router)** with the **Builder.io Gen 2 SDK** (`@builder.io/sdk-react`) for visual editing. It ships a shared component library, a shared design-token theme, and a Storybook workspace.

This is the App Router port of the Pages Router `builder-app-template`. It is functionally equivalent, rebuilt on React Server Components, the Gen 2 Builder SDK, and Next.js 16's `proxy.ts` (the replacement for `middleware.ts`).

## Tech Stack

- **Turborepo** + **pnpm workspaces** (`pnpm@9.15.4`)
- **Next.js 16** App Router with **React 19**
- **Builder.io Gen 2 SDK** (`@builder.io/sdk-react`)
- **TypeScript**, **Tailwind CSS**, **Storybook 9** (`@storybook/nextjs-vite`)

## Getting Started

Install dependencies (use **pnpm**):

```bash
pnpm install
```

### Guided setup (recommended)

Run the interactive setup from the repo root:

```bash
pnpm run setup
```

> Use `pnpm run setup` — bare `pnpm setup` is a reserved pnpm built-in.

It will:

1. Prompt for your Builder.io **public** and **private** API keys and write them into the app's `.env.local`.
2. Optionally **rename** the placeholder `app-0` app (updates every reference across the monorepo and moves the directory — re-run `pnpm install` afterward).
3. Provision the Builder space by running `init:builder` (see below).

### Provision Builder.io models

`pnpm run setup` does this for you; run it directly when you only need to (re)seed models.

The app reads two models that don't exist in a brand-new Builder space:

- **`site-context`** — global site data (name, logo, organization/contact details, social links) read by every page in the root layout.
- **`article`** — the blog content model behind `/blogs/[handle]` and the sitemap.

Without them the app throws `"Error fetching data."` at runtime and `pnpm build` fails with `"Model not found"`. A one-time seed script creates both models and populates a default `site-context` entry plus a sample article:

```bash
# Requires BUILDER_PRIVATE_KEY in apps/app-0/.env.local (bpk-...)
pnpm --filter app-0 init:builder
```

The script ([`apps/app-0/scripts/seed-builder.mjs`](./apps/app-0/scripts/seed-builder.mjs)) is **idempotent** — re-running it skips anything that already exists, so it's safe to run on every fresh clone. Edit the seeded defaults afterward in the Builder.io editor.

> The model schemas are created through the Builder **Admin GraphQL API** (`addModel`); the default content is written through the **Write REST API** (the Admin GraphQL API has no content-write mutation).

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. Builder.io content is fetched and rendered through the App Router catch-all route in `apps/app-0/app/[[...page]]/`.

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm run setup` | Guided first-run setup: API keys, optional app rename, Builder provisioning |
| `pnpm dev` | Start the development server (port 3000) |
| `pnpm --filter app-0 init:builder` | Provision the `site-context` + `article` models in a fresh Builder space |
| `pnpm build` | Build all apps except Storybook |
| `pnpm build-all` | Build everything, including Storybook |
| `pnpm lint` | Lint the workspace |
| `pnpm storybook` | Start Storybook at http://localhost:6006 |
| `pnpm build-storybook` | Build the static Storybook site |

## Project Structure

```
apps/
  app-0/        Next.js 16 App Router application
  storybook/    Storybook component workspace
packages/
  components/   Shared component library (@repo/components)
  types/        Shared TypeScript types (@repo/types)
```

See [`CLAUDE.md`](./CLAUDE.md) for detailed architecture and component-development guidance.

## Deploy on Vercel

The easiest way to deploy is the [Vercel Platform](https://vercel.com/new). Set the project's root to the monorepo root and provide the Builder.io environment variables from `env.example`.
