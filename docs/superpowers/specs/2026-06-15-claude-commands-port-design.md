# Design: Port SMA Claude Code commands to the Builder App Router template

**Date:** 2026-06-15
**Status:** Approved (pending spec review)

## Goal

Replicate the `.claude/commands/*` slash-command suite from the `sma-builder`
project into this Builder.io App Router template, adapted to this repo's
toolchain (pnpm, Turborepo monorepo, Next.js 16 App Router, Builder.io Gen 2
SDK). Make the per-project Jira/Vercel values configurable rather than
hardcoded, and extend the existing `pnpm setup` process to collect them.

## Context

- Source commands live at `/Users/johnhschneider/dev/sma/sma-builder/.claude/commands`.
- They hardcode SMA-specific values: project key `SMA`, cloud ID
  `c546b8b8-c5e9-4677-8322-7a935c3d3860`, base URL
  `https://jhsdc.atlassian.net/browse/`, Vercel project `sma-builder`.
- They assume a **custom Jira workflow**: `Grooming → Requirements Review →
  Dev Ready → In Progress → In Review → Code Review Feedback → Done`, with
  named transitions (`Finalize Requirements Draft`, `Start Development`,
  `Create Pull Request`, `Code Review Feedback`, `Complete Code Review
  Feedback`, `Complete Requirements Feedback`). The target Jira project for
  this template **shares that workflow**, so transition names are kept verbatim.
- Source commands use `npm` and a `src/`-based Pages Router layout. This repo
  uses `pnpm`, a Turborepo monorepo (`apps/`, `packages/`), and the App Router.
- This repo already has a first-run setup process: `pnpm setup` →
  `scripts/setup.mjs` (prompts for Builder keys, optional app rename, seeds
  Builder models).

## Decisions (from brainstorming)

1. **Workflow:** Target Jira shares SMA's custom workflow → port the full set
   with transition names kept as written.
2. **Config storage:** A single committed `.claude/project-config.md` that all
   commands read.
3. **Jira optional:** Setup asks before prompting for Jira values; commands
   skip Jira steps when config says `Configured: no`.
4. **Vercel preview detection:** Keep the Vercel MCP approach
   (`list_deployments` / `get_deployment`), sourcing the project name from
   config.
5. **Command set:** Full relevant set (12 commands). Exclude the Shopify /
   Confluence-specific commands.
6. **Version bump:** Drop the `package.json` version-bump step from `pr` (per
   the user's global CLAUDE.md: do not bump app versions when creating PRs).
7. **Confluence docs:** Drop `pr`'s "documentation impact assessment" step.

## Components

### A. `.claude/project-config.md` (new, committed)

Single source of truth for per-clone values. Ships with Jira not configured;
`pnpm setup` overwrites it. Shape:

```markdown
# Project Config (read by .claude/commands/*)

## Jira
- Configured: no
- Project key:
- Cloud ID:
- Base URL:

## Vercel
- Project name:
```

Every ported command replaces SMA's hardcoded "Notes" values with a single
instruction:

> Read `.claude/project-config.md` for the Jira project key, cloud ID, base
> URL, and Vercel project name. If **Configured: no**, skip all Jira steps and
> proceed without them.

### B. `scripts/setup.mjs` (modified)

Add an integrations step after the credentials step and before the optional
rename:

1. Ask: `Configure Jira integration for the Claude Code commands? (y/N)`
   - If yes: prompt for Jira **project key**, **cloud ID**, **base URL**
     (default `https://<key-lowercased>.atlassian.net/browse/` is offered but
     editable).
2. Always prompt for the **Vercel project name** (default = current app dir, or
   the new name if the app is being renamed).
3. Write `.claude/project-config.md` with the collected values (Jira
   `Configured: yes` only when the user opted in; otherwise `no`).

The step runs before the rename so the rename loop is unaffected. Reuses the
existing `ask` / `askWithDefault` / `askYesNo` helpers. If the file already
exists, preserve existing values as defaults.

### C. `.claude/commands/*.md` (12 new files)

Ported and adapted: `pr`, `pr-feedback`, `create-pr`, `fix-build`,
`reset-devserver`, `fix-issue`, `groom`, `groom-epic`, `start-dev`,
`start-epic-dev`, `requirements-feedback`, `solution-review`.

Adaptations applied across all:

- **Package manager:** `npm run build`→`pnpm build`, `npm run lint`→`pnpm lint`,
  `npm run build-storybook`→`pnpm build-storybook`.
- **Paths:** `src/components`→`packages/components/components`,
  `src/registry`→`packages/components/registry`,
  `src/builder-registry.ts`→`packages/components/builder-registry.ts`,
  `src/stories`→`apps/storybook/stories`, `src/pages`→`apps/app-0/app`.
- **Config:** SMA's hardcoded Jira/Vercel "Notes" replaced with the
  read-from-config instruction (component B above).

Command-specific changes:

- **`pr`:** remove the version-bump step; remove the Confluence documentation
  impact step; keep Vercel MCP detection using the config project name; update
  the code-reviewer subagent context string to "Next.js 16 App Router,
  Turborepo monorepo, Builder.io Gen 2 SDK (`@builder.io/sdk-react`), pnpm;
  conventions in CLAUDE.md."
- **`start-dev` / `start-epic-dev`:** component-creation guidance points at
  `packages/components/registry`, `packages/components/builder-registry.ts`
  insert menus, and `apps/storybook/stories`.
- **`solution-review`:** rewrite the "Data Fetching Patterns" dimension for the
  App Router (RSC: `fetchOneEntry`/`fetchEntries`, `generateStaticParams`,
  segment `revalidate`, `not-found()`) instead of
  `getStaticProps`/`getServerSideProps`. Update other dimension grep paths to
  the monorepo layout.

### D. README / docs (minor)

Add a short note documenting the command suite and that `pnpm setup` now
collects Jira/Vercel config for it. (Lightweight; not a blocker.)

## Excluded (YAGNI / not applicable)

- `create-product`, `document-process`, `process-doc-author` — Shopify /
  SM-Confluence specific; this template has neither.
- `pr` Step 11 documentation-impact-to-Confluence.
- `package.json` version bump.

## Error handling / edge cases

- **Jira not configured:** commands detect `Configured: no` and skip every Jira
  call, still performing their non-Jira work (e.g. `pr` still creates the PR).
- **Setup re-run:** existing `.claude/project-config.md` values become the
  prompt defaults; pressing enter keeps them.
- **Non-interactive stdin** (piped): existing setup harness resolves prompts to
  empty/default; Jira step defaults to "not configured."
- **Vercel detection failure:** unchanged from source — note the failure in the
  PR/Jira comment but never block PR creation.

## Testing / verification

- `node scripts/setup.mjs` runs interactively and writes a correct
  `.claude/project-config.md` for both "Jira yes" and "Jira no" paths.
- `pnpm setup` non-interactive (piped) does not hang.
- Spot-check 2-3 commands reference config and use pnpm/monorepo paths.
- Repo still builds: `pnpm build` and `pnpm lint` clean (no source code
  changes, but verify setup.mjs has no syntax errors via `node --check`).
