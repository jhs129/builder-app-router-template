# Create Pull Request (with Jira Integration)

Create a pull request for the current branch. If the branch name follows the Jira ticket naming convention used by `/fix-issue` or `/start-dev` (e.g. `sma-10-banner-component`), fetch the Jira ticket and include a link and summary in the PR description.

---

## Step 1: Read the Current Branch and Git State

Run these in parallel:
```bash
git branch --show-current
git status
git log --oneline HEAD
```

**Determine the base branch** from the current branch name:
- If current branch is `develop` → base = `main` (this is a develop → main release PR)
- If current branch is `main` → stop and warn: "You are on main. PRs should be from a feature branch or develop."
- Any other branch → base = `develop` (this is a feature → develop PR)

Once the base is known, run:
```bash
git log --oneline <base-branch>..HEAD
git diff <base-branch>...HEAD --stat
```

From the branch name, check whether it matches the Jira ticket pattern: `^([a-zA-Z]+-\d+)(-.*)?$`

Examples that match:
- `sma-10-banner-component` → ticket key `SMA-10`
- `sma-3` → ticket key `SMA-3`
- `feature/sma-5-auth` → ticket key `SMA-5`

If current branch is `develop`, skip Jira steps entirely (develop → main is a release merge, not a ticket PR).

If any other branch and no Jira match, skip Jira steps entirely.

---

## Step 2: Fetch the Jira Ticket (if applicable)

If a ticket key was found:

```
getAccessibleAtlassianResources()
```

Then:
```
getJiraIssue(
  cloudId="...",
  issueIdOrKey="<ticket-key>",
  fields=["summary", "description", "issuetype", "status", "priority"]
)
```

Extract the summary and acceptance criteria from the description to use in the PR body.

---

## Step 3: Verify Everything is Committed and the Build is Clean

First, confirm there are no uncommitted changes (from Step 1's `git status`). If there are, warn the user and ask whether they want to commit them first before proceeding. Do not silently stash or discard anything.

Then verify the full build, lint, and Storybook build all pass:
```bash
pnpm build && pnpm lint && pnpm build:storybook
```

If any of these fail, stop and tell the user to fix the errors before creating the PR. Do not proceed.

---

## Step 4: Code Review

Run the workflow-backed code review at high effort:

```
Workflow({ name: "code-review", args: "high" })
```

This fans out 30+ agents across multiple review dimensions and an adversarial verify pass. Wait for the task notification; findings arrive ranked by severity.

**If no blockers found:** Proceed to Step 5.

**If blockers found:**
1. Fix every issue that can be resolved without human judgment: naming, style, missing error handling, CLAUDE.md convention violations, type issues.
2. Run: `pnpm build && pnpm lint` — fix any errors before continuing.
3. Re-run `Workflow({ name: "code-review", args: "high" })` on the updated diff.
4. If clean → proceed to Step 5.
5. If questions remain that require human judgment:
   - If a Jira ticket was found in Step 2:
     ```
     getTransitionsForJiraIssue(cloudId="<cloud-id>", issueIdOrKey="<ticket-key>")
     transitionJiraIssue(cloudId="<cloud-id>", issueIdOrKey="<ticket-key>", transitionId="<blocked-id>")
     addCommentToJiraIssue(
       cloudId="<cloud-id>",
       issueIdOrKey="<ticket-key>",
       contentFormat="markdown",
       commentBody="**Code review blocked PR creation.**\n\n**Issues fixed automatically:**\n- <list each fix>\n\n**Unresolved — human input needed:**\n- <list each remaining issue with a specific question>\n\nPlease address these and re-run `/pr`."
     )
     ```

   **Stop.** Do not push or create a PR.

---

## Step 5: Push the Branch

```bash
git push -u origin <branch-name>
```

---

## Step 6: Detect the Vercel Preview Deployment

After pushing, Vercel automatically triggers a preview deployment. Poll for it using the Vercel MCP:

```
list_deployments(
  projectId="<vercel-project-name>",
  target="preview",
  gitBranch="<branch-name>",
  limit=1
)
```

If the deployment is not yet in "READY" state, wait up to 3 minutes and retry every 30 seconds:
```
get_deployment(deploymentId="<id>")
```

Once ready, record the primary deployment URL.

If detection times out or fails, note the failure in the PR and Jira comment but do not block PR creation.

---

## Step 7: Build the PR Title and Body

**Title:** Use the Jira ticket summary if available, otherwise derive a concise title (under 70 chars) from the branch slug and git log.

**Body:** Write in first person as if John Schneider wrote it — friendly, direct, like a real developer explaining their work to a teammate. Do not make it sound like it was generated.

Structure:
```
## Summary
<1-3 bullet points describing what changed and why>

<If Jira ticket found:>
**Jira:** [<TICKET-KEY>: <ticket summary>](<base-url><TICKET-KEY>)

<If Vercel deployment detected:>
**Preview:** <deployment-url>

## Changes
<bullet list of files or areas changed with brief descriptions>

## Test Plan
- [ ] Build passes (`pnpm build && pnpm lint`)
- [ ] <specific functional check based on the changes>
- [ ] <additional verification steps derived from the AC in the Jira ticket>

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
```

---

## Step 8: Create the PR

```bash
gh pr create --base <base-branch> --title "<title>" --body "$(cat <<'EOF'
<body>
EOF
)"
```

`<base-branch>` is `develop` for feature branches and `main` for the `develop` branch (always pass it explicitly — never rely on the repo default).

---

## Step 9: Update the Jira Ticket (if applicable)

If a Jira ticket was found:

**a) Transition to "In Review"** using the **"Create Pull Request"** transition:
```
getTransitionsForJiraIssue(cloudId="...", issueIdOrKey="<ticket-key>")
// Find the transition named "Create Pull Request" and use its ID
transitionJiraIssue(cloudId="...", issueIdOrKey="<ticket-key>", transitionId="<create-pull-request-transition-id>")
```

**b) Assign the ticket to the reporter** (use the reporter's accountId from the ticket fetched in Step 2):
```
editJiraIssue(
  cloudId="...",
  issueIdOrKey="<ticket-key>",
  fields={ "assignee": { "accountId": "<reporter-account-id>" } }
)
```

**c) Add a comment with the PR link and Vercel preview URL** using ADF with real hyperlinks:
```
addCommentToJiraIssue(
  cloudId="...",
  issueIdOrKey="<ticket-key>",
  contentFormat="adf",
  commentBody={
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "PR ready for review: " },
          {
            "type": "text",
            "text": "<pr-url>",
            "marks": [{ "type": "link", "attrs": { "href": "<pr-url>" } }]
          }
        ]
      },
      // If Vercel deployment detected:
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Preview deployment: " },
          {
            "type": "text",
            "text": "<deployment-url>",
            "marks": [{ "type": "link", "attrs": { "href": "https://<deployment-url>" } }]
          }
        ]
      }
    ]
  }
)
```

---

## Step 10: Show the Result

```
✅ Pull request created

**PR:** <title> — <pr-url>
**Branch:** <branch-name>
**Preview:** <deployment-url>
<If Jira:>
**Jira:** <base-url><ticket-key> (In Review, PR + deployment links added)
```

---

## Notes

- If the branch is already pushed and has an open PR, show the existing PR URL and stop.
- Always look at ALL commits on the branch (not just the latest) when writing the PR description.
- Project config: read `.claude/project-config.md` for the Jira project key, cloud ID, base URL, and Vercel project name. If **Configured: no**, skip all Jira steps and proceed without them.
