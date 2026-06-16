# Claude Code Commands Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the `sma-builder` `.claude/commands/*` slash-command suite into this Builder.io App Router template, adapted to pnpm + the Turborepo monorepo + App Router, with per-project Jira/Vercel values read from a config file that `pnpm setup` populates.

**Architecture:** A committed `.claude/project-config.md` is the single source of per-clone values (Jira project key, cloud ID, base URL, Vercel project name). `scripts/setup.mjs` gains an integrations step that writes it. Twelve command files are copied from the source repo and transformed by a fixed set of global rules plus per-command edits.

**Tech Stack:** Markdown slash commands, Node ESM (`scripts/setup.mjs`), pnpm, Turborepo, Next.js 16 App Router, Builder.io Gen 2 SDK.

---

## Reference paths

- **Source commands (read-only):** `/Users/johnhschneider/dev/sma/sma-builder/.claude/commands/`
- **Target repo root:** `/Users/johnhschneider/dev/builder.io/builder-app-router-template/`
- Work on branch `commands` (already checked out).

## Global transformation rules (apply to EVERY ported command)

These rules are applied when copying each source file. Per-command tasks list only the *additional* edits beyond these.

**G1 — Package manager / build commands.** Replace every occurrence:
- `npm run build && npm run lint` → `pnpm build && pnpm lint`
- `npm run build-storybook` / `npm build-storybook` → `pnpm build-storybook`
- `npm run lint` → `pnpm lint`
- `npm run build` → `pnpm build`
- standalone `npm run dev` → `pnpm dev`

**G2 — Paths (Pages Router/src → monorepo/App Router).** Replace every occurrence:
- `src/builder-registry.ts` → `packages/components/builder-registry.ts`
- `src/registry/` → `packages/components/registry/`
- `src/registry` → `packages/components/registry`
- `src/components/` → `packages/components/components/`
- `src/components` → `packages/components/components`
- `src/stories/` → `apps/storybook/stories/`
- `src/stories` → `apps/storybook/stories`
- `src/pages/` → `apps/app-0/app/`
- `src/pages` → `apps/app-0/app`
- `src/lib/` → `apps/app-0/lib/`

**G3 — Config block.** SMA command files end with a "## Notes" section whose
final bullets hardcode Jira/Vercel values, e.g.:
```
- The Jira base URL for this project is: `https://jhsdc.atlassian.net/browse/`
- Jira project key: `SMA`
- Cloud ID: `c546b8b8-c5e9-4677-8322-7a935c3d3860`
```
Remove those hardcoded value bullets and replace with a single bullet:
```
- Project config: read `.claude/project-config.md` for the Jira project key, cloud ID, base URL, and Vercel project name. If **Configured: no**, skip all Jira steps and proceed without them.
```
Also remove the literal cloud ID `c546b8b8-c5e9-4677-8322-7a935c3d3860`,
project key `SMA`, and base URL `https://jhsdc.atlassian.net/browse/` wherever
they appear **inline** in tool-call examples — replace with the placeholders
`<cloud-id>`, `<project-key>`, and `<base-url>` respectively, and rely on the
config bullet to tell the reader where those come from.

**G4 — Vercel project name.** Replace literal `sma-builder` (used as
`projectId` in `list_deployments` and as the Vercel project name) with
`<vercel-project-name>` and note it comes from `.claude/project-config.md`.

**Verification helper (used by several tasks):** after writing the command
files, this command must return NOTHING:
```bash
grep -rnE 'npm run |npm build-storybook|src/components|src/registry|src/pages|src/stories|src/builder-registry|sma-builder|c546b8b8-c5e9-4677-8322-7a935c3d3860|jhsdc\.atlassian\.net|project key: `SMA`|projectKey="SMA"' .claude/commands/
```

---

## Task 1: Create the committed config file

**Files:**
- Create: `.claude/project-config.md`

- [ ] **Step 1: Write the file**

```markdown
# Project Config (read by .claude/commands/*)

This file holds the per-project values the Claude Code commands need. It is
populated by `pnpm setup`. You can also edit it by hand.

## Jira
- Configured: no
- Project key:
- Cloud ID:
- Base URL:

## Vercel
- Project name:
```

- [ ] **Step 2: Verify it exists**

Run: `cat .claude/project-config.md`
Expected: the content above.

- [ ] **Step 3: Commit**

```bash
git add .claude/project-config.md
git commit -m "feat: add .claude/project-config.md for command integrations"
```

---

## Task 2: Add the integrations step to setup.mjs

**Files:**
- Modify: `scripts/setup.mjs`

Read `scripts/setup.mjs:150-242` (the `main()` function) before editing. It
already defines `ask`, `askWithDefault`, `askYesNo`, `ROOT`, and writes
`.env.local`. Reuse those.

- [ ] **Step 1: Add a config-writer helper**

Add this function near the other top-level helpers (after `isValidAppName`,
around `scripts/setup.mjs:148`):

```javascript
// --- Write .claude/project-config.md from collected integration values ---
function writeProjectConfig({ jira, vercelProject }) {
  const path = join(ROOT, ".claude", "project-config.md");
  const content = `# Project Config (read by .claude/commands/*)

This file holds the per-project values the Claude Code commands need. It is
populated by \`pnpm setup\`. You can also edit it by hand.

## Jira
- Configured: ${jira ? "yes" : "no"}
- Project key: ${jira ? jira.projectKey : ""}
- Cloud ID: ${jira ? jira.cloudId : ""}
- Base URL: ${jira ? jira.baseUrl : ""}

## Vercel
- Project name: ${vercelProject || ""}
`;
  writeFileSync(path, content);
  return path;
}
```

- [ ] **Step 2: Add a config reader for re-run defaults**

Add directly below `writeProjectConfig`:

```javascript
// --- Read an existing project-config.md value for prompt defaults ---
function readConfigValue(label) {
  const path = join(ROOT, ".claude", "project-config.md");
  if (!existsSync(path)) return "";
  const content = readFileSync(path, "utf8");
  const match = content.match(new RegExp(`^- ${label}:\\s*(.*)$`, "m"));
  return match ? match[1].trim() : "";
}
```

- [ ] **Step 3: Insert the integrations prompt block into main()**

In `main()`, immediately after the credentials block writes `.env.local`
(after the line `console.log(\`\\n✓ Wrote keys to apps/${app.dir}/.env.local\`);`
at `scripts/setup.mjs:183`), insert:

```javascript
  // --- 1b. Claude Code command integrations (Jira + Vercel) ---
  console.log("\nClaude Code command config (.claude/project-config.md):");
  let jira = null;
  if (await askYesNo("\nConfigure Jira integration for the Claude Code commands?")) {
    const projectKey = (await askWithDefault("  Jira project key (e.g. ACME)", readConfigValue("Project key"))).toUpperCase();
    const cloudId = await askWithDefault("  Atlassian cloud ID", readConfigValue("Cloud ID"));
    const defaultBase = readConfigValue("Base URL") ||
      (projectKey ? `https://${projectKey.toLowerCase()}.atlassian.net/browse/` : "");
    const baseUrl = await askWithDefault("  Jira base URL", defaultBase);
    jira = { projectKey, cloudId, baseUrl };
  }
  const vercelProject = await askWithDefault(
    "Vercel project name (for preview-deployment detection)",
    readConfigValue("Project name") || app.dir
  );
  const cfgPath = writeProjectConfig({ jira, vercelProject });
  console.log(`✓ Wrote ${cfgPath.replace(ROOT + "/", "")}`);
```

- [ ] **Step 4: Add `.claude/project-config.md` to the rename file list**

So a later app rename also rewrites the Vercel project name if it matched the
old app dir. In the `filesToUpdate` array (`scripts/setup.mjs:222-231`), add:

```javascript
      join(ROOT, ".claude", "project-config.md"),
```

- [ ] **Step 5: Syntax-check**

Run: `node --check scripts/setup.mjs`
Expected: no output (exit 0).

- [ ] **Step 6: Functional test — Jira "no" path (piped, must not hang)**

Run:
```bash
printf 'pub_key_123\npriv_key_123\nn\nmy-vercel-app\nn\n' | node scripts/setup.mjs >/tmp/setup-test.log 2>&1; echo "exit=$?"
grep -A6 '## Jira' .claude/project-config.md
```
Expected: command exits (does not hang); `Configured: no`; `Project name:
my-vercel-app`.

Note: the credentials step seeds Builder models via `init:builder` which may
fail without valid keys — that is expected in this test. The thing under test
is that the integrations prompts run and write the config before seeding. If
seeding aborts before the config is written, move the integrations block ABOVE
the seed step (it is already placed before seeding in Step 3 — verify order).

- [ ] **Step 7: Restore the committed default config**

The test above overwrote the file. Restore it:
```bash
git checkout .claude/project-config.md
```

- [ ] **Step 8: Commit**

```bash
git add scripts/setup.mjs
git commit -m "feat: collect Jira/Vercel command config in pnpm setup"
```

---

## Task 3: Port the trivial commands (fix-build, reset-devserver, create-pr)

**Files:**
- Create: `.claude/commands/fix-build.md`
- Create: `.claude/commands/reset-devserver.md`
- Create: `.claude/commands/create-pr.md`

- [ ] **Step 1: Write `fix-build.md`**

```markdown
Please run the following scripts and fix all errors and warnings that arise:
 - pnpm lint
 - pnpm build
 - pnpm build-storybook
```

- [ ] **Step 2: Write `reset-devserver.md`**

```markdown
Perform a hard reset of the dev server running on port 3000. You will need to run lsof -ti:3000 and then kill -9 the resulting PIDS.
```

- [ ] **Step 3: Write `create-pr.md`**

```markdown
Create a pull request for the current branch. Before creating the PR make sure that:
- all code in the branch is checked in
- pnpm lint runs with no errors
- pnpm build runs with no errors
- pnpm build-storybook runs with no errors

When creating the PR please review all code in the branch that is being submitted for the PR and create a comprehensive summary of what is included in the PR.
```

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/fix-build.md .claude/commands/reset-devserver.md .claude/commands/create-pr.md
git commit -m "feat: add fix-build, reset-devserver, create-pr commands"
```

---

## Task 4: Port `pr.md`

**Files:**
- Create: `.claude/commands/pr.md`
- Source: `/Users/johnhschneider/dev/sma/sma-builder/.claude/commands/pr.md`

- [ ] **Step 1: Copy the source file**

```bash
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/pr.md .claude/commands/pr.md
```

- [ ] **Step 2: Apply global rules G1–G4**

Apply every replacement in "Global transformation rules" above to the file.

- [ ] **Step 3: Delete the version-bump step (Step 5)**

Remove the entire `## Step 5: Determine the Next PR Number and Update the
Version` section (source lines ~910–931, from the `## Step 5:` heading through
the `git commit -m "chore: bump version for PR #<number>"` block and its
trailing fence). Renumber the subsequent step headings down by one (Step 6→5,
… Step 12→11). In the intro text near the top, remove any clause that says the
workflow will "bump the version."

- [ ] **Step 4: Delete the Confluence documentation step (Step 11)**

Remove the entire `## Step 11: Documentation Impact Assessment` section (the
classification table, the background-agent prompt, everything through the end
of that section). Also remove the `<If documentation agents launched:>` lines
from the final "Show the Result" output block, and remove the `**Docs:**` line.

- [ ] **Step 5: Update the code-reviewer context string (Step 4)**

In the `## Step 4: Code Review` section, replace the context string passed to
the `pr-review-toolkit:code-reviewer` subagent with:

```
This context: "Next.js 16 App Router project on a Turborepo monorepo (apps/, packages/) using the Builder.io Gen 2 SDK (@builder.io/sdk-react) and pnpm. Key conventions in CLAUDE.md: shared components live in packages/components/components/, registered in packages/components/registry/ and added to an insert menu in packages/components/builder-registry.ts; a Storybook story is required in apps/storybook/stories/ for each new component; use Tailwind tokens (never hardcode hex or arbitrary bg-[#xxx]); components over 100 lines are split into a directory <Name>/index.tsx; use pnpm."
```

- [ ] **Step 6: Verify no stray SMA/npm/src tokens remain**

Run: `grep -nE 'npm run |src/|sma-builder|c546b8b8|jhsdc|chore: bump version|Documentation Impact|getStaticProps' .claude/commands/pr.md`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add .claude/commands/pr.md
git commit -m "feat: add pr command (no version bump, no Confluence step)"
```

---

## Task 5: Port `pr-feedback.md`

**Files:**
- Create: `.claude/commands/pr-feedback.md`
- Source: `/Users/johnhschneider/dev/sma/sma-builder/.claude/commands/pr-feedback.md`

- [ ] **Step 1: Copy**

```bash
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/pr-feedback.md .claude/commands/pr-feedback.md
```

- [ ] **Step 2: Apply global rules G1–G4.**

Note the branch-key regex example uses `sma-NNN` / `SMA-NNN`; change these to
`<key>-NNN` / `<KEY>-NNN` and add the G3 config bullet to the bottom of the
file (this command has no "## Notes" section, so append one):

```markdown

## Notes

- Project config: read `.claude/project-config.md` for the Jira project key, cloud ID, base URL, and Vercel project name. If **Configured: no**, skip all Jira steps and proceed without them.
- Use `pnpm`, not npm or yarn.
```

- [ ] **Step 3: Verify**

Run: `grep -nE 'npm run |src/|sma-builder|c546b8b8|jhsdc' .claude/commands/pr-feedback.md`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/pr-feedback.md
git commit -m "feat: add pr-feedback command"
```

---

## Task 6: Port `fix-issue.md`

**Files:**
- Create: `.claude/commands/fix-issue.md`
- Source: `/Users/johnhschneider/dev/sma/sma-builder/.claude/commands/fix-issue.md`

- [ ] **Step 1: Copy**

```bash
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/fix-issue.md .claude/commands/fix-issue.md
```

- [ ] **Step 2: Apply global rules G1–G4.**

The branch-naming examples use `sma-<number>-<slug>` and `SMA-X`. Replace `sma`
with `<key>` and `SMA` with `<KEY>` in prose examples (keep them as illustrative
placeholders). Apply the G3 "## Notes" config bullet, removing the hardcoded
project-key/cloud-id/base-url bullets.

- [ ] **Step 3: Verify**

Run: `grep -nE 'npm run |src/|sma-builder|c546b8b8|jhsdc|project key: `SMA`' .claude/commands/fix-issue.md`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/fix-issue.md
git commit -m "feat: add fix-issue command"
```

---

## Task 7: Port `groom.md` and `groom-epic.md`

**Files:**
- Create: `.claude/commands/groom.md`
- Create: `.claude/commands/groom-epic.md`
- Source: same names under the SMA commands dir.

- [ ] **Step 1: Copy both**

```bash
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/groom.md .claude/commands/groom.md
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/groom-epic.md .claude/commands/groom-epic.md
```

- [ ] **Step 2: Apply global rules G1–G4 to both.**

In `groom.md` the JQL strings contain `project = SMA` — replace `SMA` with
`<project-key>`. Same for `groom-epic.md` (the `"Epic Link" = $ARGUMENTS` and
`parent = $ARGUMENTS` JQL both have `project = SMA`). Apply the G3 config bullet
and remove hardcoded value bullets from each "## Notes" section.

In the parallel-subagent prompt lists (groom Step 2, groom-epic Step 3), the
items "Project key: `SMA`" / "Cloud ID: `c546b8b8-...`" become:
"Project key, cloud ID, and base URL from `.claude/project-config.md`".

- [ ] **Step 3: Verify both**

Run: `grep -nE 'npm run |src/|sma-builder|c546b8b8|jhsdc|= SMA|project = SMA' .claude/commands/groom.md .claude/commands/groom-epic.md`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/groom.md .claude/commands/groom-epic.md
git commit -m "feat: add groom and groom-epic commands"
```

---

## Task 8: Port `start-dev.md` and `start-epic-dev.md`

**Files:**
- Create: `.claude/commands/start-dev.md`
- Create: `.claude/commands/start-epic-dev.md`
- Source: same names under the SMA commands dir.

- [ ] **Step 1: Copy both**

```bash
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/start-dev.md .claude/commands/start-dev.md
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/start-epic-dev.md .claude/commands/start-epic-dev.md
```

- [ ] **Step 2: Apply global rules G1–G4 to both.** JQL `project = SMA` →
`project = <project-key>`. Vercel `sma-builder` → `<vercel-project-name>`.

- [ ] **Step 3: Rewrite the component-creation guidance in start-dev.md (Step 6)**

In `start-dev.md`, the "If this ticket introduces or modifies a UI component"
block currently references `src/components/`, `src/registry/`,
`src/builder-registry.ts`, `src/stories/`. After G2 it will already point at the
monorepo paths, but verify the block reads exactly:

```markdown
**If this ticket introduces or modifies a UI component** (i.e., creates files under `packages/components/components/`):
- Register the component in the appropriate registry file under `packages/components/registry/`
- Add the component to the correct `insertMenu` in `packages/components/builder-registry.ts`
- Create a Storybook story under `apps/storybook/stories/`
```

If `start-epic-dev.md` contains the same guidance, apply the identical edit
there.

- [ ] **Step 4: Apply the G3 config bullet** to each "## Notes" section,
removing hardcoded value bullets. The subagent-prompt lists that say
"The Vercel project name: `sma-builder`" become "The Vercel project name from
`.claude/project-config.md`".

- [ ] **Step 5: Verify both**

Run: `grep -nE 'npm run |src/|sma-builder|c546b8b8|jhsdc|= SMA' .claude/commands/start-dev.md .claude/commands/start-epic-dev.md`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add .claude/commands/start-dev.md .claude/commands/start-epic-dev.md
git commit -m "feat: add start-dev and start-epic-dev commands"
```

---

## Task 9: Port `requirements-feedback.md`

**Files:**
- Create: `.claude/commands/requirements-feedback.md`
- Source: `/Users/johnhschneider/dev/sma/sma-builder/.claude/commands/requirements-feedback.md`

- [ ] **Step 1: Copy**

```bash
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/requirements-feedback.md .claude/commands/requirements-feedback.md
```

- [ ] **Step 2: Apply global rules G1–G4.**

This file hardcodes the cloud ID, base URL, and project key inline at the top
of Step 1 and in every `getJiraIssue`/`addCommentToJiraIssue` call. Replace all
inline `c546b8b8-c5e9-4677-8322-7a935c3d3860` → `<cloud-id>`, `SMA-{number}`
→ `<KEY>-{number}`, `project = SMA` → `project = <project-key>`,
`https://jhsdc.atlassian.net/browse/` → `<base-url>`. Apply the G3 config bullet
to "## Notes".

- [ ] **Step 3: Verify**

Run: `grep -nE 'npm run |src/|c546b8b8|jhsdc|= SMA|SMA-\{' .claude/commands/requirements-feedback.md`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/requirements-feedback.md
git commit -m "feat: add requirements-feedback command"
```

---

## Task 10: Port `solution-review.md` (App Router rewrite)

**Files:**
- Create: `.claude/commands/solution-review.md`
- Source: `/Users/johnhschneider/dev/sma/sma-builder/.claude/commands/solution-review.md`

- [ ] **Step 1: Copy**

```bash
cp /Users/johnhschneider/dev/sma/sma-builder/.claude/commands/solution-review.md .claude/commands/solution-review.md
```

- [ ] **Step 2: Apply global rules G1–G4.**

- [ ] **Step 3: Update the intro line**

Replace the opening line "Audit this Next.js 15 Pages Router / Builder.io /
Shopify application..." with:

```markdown
Audit this Next.js 16 App Router / Builder.io (Gen 2 SDK) Turborepo monorepo against best practices. For every gap found, explain the **why** behind the best practice so the developer understands the pattern, not just the fix. Then interactively decide which gaps to log as Jira bugs.
```

- [ ] **Step 4: Rewrite the Data Fetching dimension (Subagent 5)**

Replace the entire "### Subagent 5 — Data Fetching Patterns" block with:

````markdown
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
````

- [ ] **Step 5: Update Type Safety dimension (Subagent 6)**

The source references an intentional `article: any` at
`src/pages/blogs/[handle].tsx:12`. Change references to the App Router path
`apps/app-0/app/blogs/[handle]/page.tsx` and drop the specific line number
(write "the intentional `article: any` typing in the blogs `[handle]` route").
Apply the same change in the "## Notes" section at the bottom.

- [ ] **Step 6: Apply the G3 config bullet** to "## Notes", removing the
hardcoded Jira value bullet. In Step 4, `createJiraIssue(cloudId="c546b8b8...",
projectKey="SMA", ...)` becomes `createJiraIssue(cloudId="<cloud-id>",
projectKey="<project-key>", ...)`.

- [ ] **Step 7: Verify**

Run: `grep -nE 'npm run |src/|sma-builder|c546b8b8|jhsdc|getStaticProps|getServerSideProps|Pages Router|Shopify|projectKey="SMA"' .claude/commands/solution-review.md`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add .claude/commands/solution-review.md
git commit -m "feat: add solution-review command (App Router rewrite)"
```

---

## Task 11: Whole-suite verification + README note

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Run the suite-wide stray-token check**

Run:
```bash
grep -rnE 'npm run |npm build-storybook|src/components|src/registry|src/pages|src/stories|src/builder-registry|sma-builder|c546b8b8-c5e9-4677-8322-7a935c3d3860|jhsdc\.atlassian\.net|project key: `SMA`|projectKey="SMA"' .claude/commands/
```
Expected: NO output. If anything prints, fix that file and re-run.

- [ ] **Step 2: Confirm all 12 commands exist**

Run: `ls .claude/commands/ | sort`
Expected exactly: `create-pr.md  fix-build.md  fix-issue.md  groom-epic.md  groom.md  pr-feedback.md  pr.md  requirements-feedback.md  reset-devserver.md  solution-review.md  start-dev.md  start-epic-dev.md`

- [ ] **Step 3: Add a README section**

Append to `README.md` a short section documenting the suite. Read the current
end of `README.md` first, then add:

```markdown
## Claude Code commands

This template ships a suite of Claude Code slash commands under
`.claude/commands/` (PR creation, PR feedback, Jira grooming and dev pipeline,
solution review, build fixes). They read per-project values — Jira project key,
cloud ID, base URL, and Vercel project name — from `.claude/project-config.md`,
which `pnpm setup` populates. If you skip Jira during setup, the Jira-aware
commands simply omit their Jira steps.
```

- [ ] **Step 4: Verify the repo still builds clean**

Run: `pnpm lint && pnpm build`
Expected: both succeed (no source code changed; this confirms nothing was
broken). If `pnpm build` requires Builder keys / network and fails for that
reason in this environment, note it and rely on the `node --check` from Task 2
plus the grep checks above.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document Claude Code command suite in README"
```

---

## Self-review notes

- **Spec coverage:** Config file (Task 1), setup.mjs changes incl. optional
  Jira + Vercel default + rename list (Task 2), all 12 commands (Tasks 3–10),
  pnpm/path/config global rules (G1–G3), Vercel name (G4), pr version-bump +
  Confluence removal (Task 4), solution-review App Router rewrite (Task 10),
  README (Task 11). All spec sections map to a task.
- **No placeholders:** command-file content is specified as "copy source +
  apply enumerated exact edits"; non-mechanical rewrites (pr Steps 3–5,
  solution-review Steps 3–5) give full replacement text.
- **Consistency:** `<project-key>`, `<cloud-id>`, `<base-url>`,
  `<vercel-project-name>` placeholders and the G3 config bullet wording are used
  identically across tasks; config-file keys (`Configured`, `Project key`,
  `Cloud ID`, `Base URL`, `Project name`) match between Task 1, the
  `writeProjectConfig` template, and `readConfigValue` regex in Task 2.
