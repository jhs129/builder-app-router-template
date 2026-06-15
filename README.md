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

Copy the example environment file and fill in your Builder.io public API key:

```bash
cp env.example .env.local
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. Builder.io content is fetched and rendered through the App Router catch-all route in `apps/app-0/app/[[...page]]/`.

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server (port 3000) |
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
