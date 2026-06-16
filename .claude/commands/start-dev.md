# Start Development on Dev Ready Tickets

Pick up tickets in Dev Ready status, implement them in parallel git worktrees, and create pull requests. Each worktree is removed after the PR is created to prevent accumulation.

The ticket(s) to develop: $ARGUMENTS

If $ARGUMENTS is empty, query all tickets with `status = "Dev Ready"`. If a ticket key is provided (e.g. `<KEY>-8`), process only that ticket.

---

## Step 1: Resolve the Ticket List

Get the Atlassian cloud ID:
```
getAccessibleAtlassianResources()
```

If $ARGUMENTS is empty, query the Dev Ready queue:
```
searchJiraIssuesUsingJql(
  cloudId="...",
  jql="project = <project-key> AND status = \"Dev Ready\" ORDER BY created ASC",
  fields=["summary", "description", "issuetype", "status", "assignee", "reporter"]
)
```

If $ARGUMENTS is a ticket key, fetch that single ticket:
```
getJiraIssue(
  cloudId="...",
  issueIdOrKey="<ticket-key>",
  fields=["summary", "description", "issuetype", "status", "assignee", "reporter"]
)
```

If no tickets are found, report "No tickets in Dev Ready" and stop.

Report the list of tickets found before proceeding.

---

## Step 2: Transition All Tickets to In Progress

For each ticket, immediately transition it to **In Progress** so the board reflects active work. Use the transition named **"Start Development"**:

```
getTransitionsForJiraIssue(cloudId="...", issueIdOrKey="<ticket-key>")
// Find the transition named "Start Development" and use its ID
transitionJiraIssue(cloudId="...", issueIdOrKey="<ticket-key>", transitionId="<start-development-transition-id>")
```

Do this for all tickets before creating any worktrees.

---

## Step 3: Process Each Ticket

**Single ticket:** Perform Steps 4–9 directly in this session.

**Multiple tickets:** Invoke `superpowers:dispatching-parallel-agents`. Dispatch one subagent per ticket. Each subagent prompt must include:
- The specific ticket key
- The Atlassian cloud ID (from Step 1)
- The Vercel project name from `.claude/project-config.md`
- The main repo root path (use `git rev-parse --show-toplevel` if needed)
- The complete instructions from Steps 4–9 of this document, verbatim

Wait for all subagents to complete, then display the Step 10 Summary with collated results.

---

## Step 4: Create a Git Worktree

From the main repo directory, create a dedicated worktree for this ticket:

```bash
# Ensure main is up to date
git fetch origin main

# Derive branch name from ticket key and summary slug
# e.g., KEY-8 "Accordion Component" → key-8-accordion-component
BRANCH="<ticket-key-lowercase>-<slug>"

# Create worktree + branch
git worktree add ../<branch-name> -b <branch-name> origin/main
```

All subsequent work for this ticket happens inside `../<branch-name>/`.

---

## Step 5: Fetch Ticket Requirements

Fetch the full ticket to extract the refined requirements and acceptance criteria:

```
getJiraIssue(
  cloudId="...",
  issueIdOrKey="<ticket-key>",
  fields=["summary", "description", "issuetype", "status", "comment"]
)
```

Parse the description to extract:
- The user story
- The requirements list
- The acceptance criteria checklist

---

## Step 6: Implement the Solution

Inside the worktree, explore the codebase and implement the work:

- Read relevant files before editing
- Follow CLAUDE.md conventions (Tailwind tokens from tailwind.config.js, Builder.io patterns)
- Make only the changes needed to satisfy the acceptance criteria — no scope creep
- Use `pnpm` as the package manager

**If this ticket introduces or modifies a UI component** (i.e., creates files under `packages/components/components/`):
- Register the component in the appropriate registry file under `packages/components/registry/`
- Add the component to the correct `insertMenu` in `packages/components/builder-registry.ts`
- Create a Storybook story under `apps/storybook/stories/`

After implementing, run the build:
```bash
pnpm build && pnpm lint
```

Fix any build or lint errors before proceeding. Do not create a PR if the build fails.

---

## Step 7: Create the Pull Request

From inside the worktree, follow all steps in `.claude/commands/pr.md`.

- The branch name already follows the Jira ticket naming convention, so the workflow auto-detects the ticket key
- The workflow will: verify the build, run the code review, push the branch, create the PR, detect the Vercel preview deployment URL, and post the PR + deployment links to the Jira ticket

---

## Step 8: Clean Up the Worktree

After the PR is created successfully, remove the local worktree (the branch and PR remain intact on the remote):

```bash
# From the main repo root
cd <main-repo-root>
git worktree remove ../<branch-name> --force
```

Confirm the worktree was removed:
```bash
git worktree list
```

---

## Step 9: Summary

After all tickets are processed, display:

```
✅ Development complete

Processed X ticket(s):

[For each ticket:]
**<TICKET-KEY>** — <Summary>
- Branch: <branch-name> (pushed to remote)
- PR: <pr-url>
- Preview: <vercel-deployment-url>
- Jira: <base-url><TICKET-KEY> (In Review)
- Worktree: removed ✓
```

---

## Notes

- Always remove the worktree after PR creation — never leave local worktrees around
- If the build fails, stop and report the errors without creating a PR or removing the worktree (leave it for debugging)
- Branch naming: `<ticket-key-lowercase>-<short-slug>` — e.g., `key-8-accordion-component`
- Project config: read `.claude/project-config.md` for the Jira project key, cloud ID, base URL, and Vercel project name. If **Configured: no**, skip all Jira steps and proceed without them.
- Main repo root: use `git rev-parse --show-toplevel` if needed
- Always use `pnpm` as the package manager
