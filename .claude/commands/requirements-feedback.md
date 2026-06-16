# Requirements Feedback Handler

Read every comment left by reviewers on a groomed Jira ticket and update the story description to address all feedback. Work systematically — don't skip comments or make partial revisions.

The ticket(s) to process: $ARGUMENTS

If $ARGUMENTS is empty, query all tickets with `status = "Requirements Feedback"`. If a number is provided (e.g. `70`), resolve it to `<KEY>-70` and process only that ticket.

---

## Step 1: Resolve the Ticket List

Read `.claude/project-config.md` for the Jira project key, cloud ID, base URL, and Vercel project name. If **Configured: no**, skip all Jira steps and proceed without them.

If $ARGUMENTS is empty, query for all tickets in Requirements Feedback:
```
searchJiraIssuesUsingJql(
  cloudId="<cloud-id>",
  jql="project = <project-key> AND status = \"Requirements Feedback\" ORDER BY updated ASC",
  fields=["summary", "status", "issuetype"]
)
```

If a number is provided, resolve to `<KEY>-{number}` and fetch that ticket:
```
getJiraIssue(
  cloudId="<cloud-id>",
  issueIdOrKey="<KEY>-{number}",
  fields=["summary", "description", "issuetype", "status", "assignee", "reporter", "comment"]
)
```

If no tickets are found, report "No tickets in Requirements Feedback" and stop.

---

## Step 2: Process Tickets

**Single ticket:** Proceed directly to Steps 3–7 in this session.

**Multiple tickets:** Invoke `superpowers:dispatching-parallel-agents`. Dispatch one subagent per ticket simultaneously. Each subagent prompt must include:
- The specific ticket key to process
- The Atlassian cloud ID
- The complete instructions from Steps 3–7 of this document, verbatim
- Project key, cloud ID, and base URL from `.claude/project-config.md`

Wait for all subagents to complete. Collect each result for the Step 8 Summary.

---

## Step 3: Fetch Full Ticket and All Comments

Fetch the full ticket with all comments:
```
getJiraIssue(
  cloudId="<cloud-id>",
  issueIdOrKey="<ticket-key>",
  fields=["summary", "description", "issuetype", "status", "assignee", "reporter", "comment"]
)
```

Display:
- **Summary:** ...
- **Status:** (confirm it is Requirements Feedback or Grooming)
- **Current Description:** (full text — this is what needs to be revised)
- **Comments:** List each comment with author and body

---

## Step 4: Identify Feedback to Address

Categorize each comment:

- **Grooming Agent comment** (contains `🤖 Grooming Agent`) — this is the original grooming output. Use it as a baseline to understand the prior assumptions, clarifying questions, and ACs.
- **Human reviewer feedback** — any comment NOT from the Grooming Agent. This is the feedback to act on.
- **Answered clarifying questions** — if a human replied to a grooming agent question in the comments, treat that answer as authoritative and incorporate it into the description.

For each piece of human feedback, determine:
1. Does it correct an assumption? → Update that assumption in the description.
2. Does it answer a clarifying question? → Replace the assumed value with the confirmed value.
3. Does it request a new or changed requirement? → Add or update it in the Requirements section.
4. Does it remove or narrow scope? → Update the description accordingly.
5. Does it refine or clarify acceptance criteria? → Update the AC list.

**If no human feedback exists** (only the Grooming Agent comment with no human replies): post a comment noting no reviewer feedback was found and stop — do not modify the ticket.

---

## Step 5: Post a Revision Comment

Before updating the description, post a comment documenting what changed and why. Format:

```
🤖 Grooming Agent — Requirements Revision

📋 Addressing Reviewer Feedback

[For each piece of human feedback addressed:]
- **Feedback:** [what the reviewer said]
  **Change:** [what was updated in the description]

[For each clarifying question that was answered:]
- **Q{N} answered:** [the question] → [the answer provided]
  **Change:** [how the description was updated]

[For any feedback acknowledged but not actioned:]
- **No change:** [reason — e.g., already covered, out of scope, contradictory]
```

Post this as a comment:
```
addCommentToJiraIssue(
  cloudId="<cloud-id>",
  issueIdOrKey="<ticket-key>",
  body="<comment text>"
)
```

---

## Step 6: Update the Ticket Description

Rewrite the description using Atlassian Document Format (ADF) with the same structure as the original grooming output:
1. **User Story** — As a [user], I want [feature] so that [benefit] (update if scope changed)
2. **Requirements** — Updated to reflect confirmed answers, new/removed requirements, and any scope changes
3. **Acceptance Criteria** — Updated task list reflecting any AC changes; retain all unchanged ACs

```
editJiraIssue(
  cloudId="<cloud-id>",
  issueIdOrKey="<ticket-key>",
  fields={
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        // User Story heading + paragraph
        // Requirements heading + bullet list
        // Acceptance Criteria heading + task list
      ]
    }
  }
)
```

Do not remove sections — only revise their content based on the feedback.

---

## Step 7: Reassign and Transition

Re-assign the ticket to the reporter:
```
editJiraIssue(
  cloudId="<cloud-id>",
  issueIdOrKey="<ticket-key>",
  fields={
    "assignee": { "accountId": "<reporter-account-id>" }
  }
)
```

Get available transitions:
```
getTransitionsForJiraIssue(cloudId="<cloud-id>", issueIdOrKey="<ticket-key>")
```

- If revised and ready to proceed: use **"Complete Requirements Feedback"** to transition back to Requirements Review
- If still in Grooming (no prior transition): use **"Finalize Requirements Draft"**
- If feedback reveals the ticket is too vague to proceed even after revision: transition to **Blocked** and post a comment explaining what is needed

```
transitionJiraIssue(cloudId="<cloud-id>", issueIdOrKey="<ticket-key>", transitionId="...")
```

---

## Step 8: Summary

After processing all tickets, display:

```
✅ Requirements feedback addressed

Processed X ticket(s):

[For each ticket:]
**<TICKET-KEY>** — <Summary>
- Status: → Requirements Review (or Blocked)
- Feedback items addressed: <count>
- Questions answered: <count>
- Description sections updated: <list>
- Jira: <base-url><TICKET-KEY>
```

---

## Notes

- Never ask the user clarifying questions interactively — resolve all ambiguity from the ticket comments
- The Grooming Agent comment is reference material, not feedback — only human comments drive changes
- Preserve all existing ACs unless a reviewer explicitly removed or changed them
- If multiple tickets are in Requirements Feedback, note progress as you go (e.g. "Processing <KEY>-70 (1 of 2)...")
- Project config: read `.claude/project-config.md` for the Jira project key, cloud ID, base URL, and Vercel project name. If **Configured: no**, skip all Jira steps and proceed without them.
