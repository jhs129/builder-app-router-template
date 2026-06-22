# Document Component in Confluence

Create or update a Confluence requirements page for a component in `gacoreweb`. Each page
follows the standard template used in the GC Web Redesign space: Page Properties, Component
Visuals, Data Model, Business Requirements, and Action Items.

The component(s) to document: $ARGUMENTS

---

## Step 1: Read Config and Resolve Arguments

Parse $ARGUMENTS. Supported forms:
- **Single component + category:** `ComponentName Category` — e.g., `Quote UI`
- **Single component + Jira story:** `ComponentName Category GCW-123` — includes story requirements
- **Multiple components:** comma-separated — e.g., `Quote UI, Divider UI, Hero Layout`
- **No arguments:** ask the user which component(s) to document and which category each belongs to

**Category → Confluence parent page ID mapping (space GCDISC):**

| Category   | Parent Page ID |
|------------|---------------|
| Layout     | 223707147     |
| CTA        | 224198670     |
| UI         | 223870977     |
| Navigation | 72712352      |

**If multiple components:** invoke `superpowers:dispatching-parallel-agents`. Dispatch one
subagent per component with that component's name, category, parent ID, Jira story (if any),
and the full instructions from Steps 2–6 verbatim. Wait for all to complete, then display the
Step 7 summary.

---

## Step 2: Check for Existing Page

Search for an existing page to decide whether to create or update:

```
searchConfluenceUsingCql(
  cql="space = \"GCDISC\" AND title = \"{ComponentName}\" AND ancestor = {parentPageId}",
  limit=1
)
```

- **No match → create** (proceed to Step 3)
- **Match found → update** the existing page after rebuilding the body in Step 4. Note the
  existing page URL in the Step 7 summary and mark it as `UPDATED`.

---

## Step 3: Extract the Data Model from Local Code

Locate the component in the monorepo:

```bash
find packages/components/components -type d -name "{ComponentName}"
```

Read these files if they exist:
1. `packages/components/components/{category}/{ComponentName}/index.tsx` — extract the `Props`
   interface (field names and TypeScript types)
2. `packages/components/components/{category}/{ComponentName}/{ComponentName}.builder.registration.tsx`
   — extract the `inputs` array from the `RegisteredComponent` definition

From the `inputs` array, each entry has some combination of:
- `name` — Field Name
- `type` — Type (text, file, boolean, list, number, color, object, reference, etc.)
- `required` — boolean (default false if absent)
- `defaultValue` — Default Value (may be absent)
- `helperText` — Notes/description (may be absent)
- `enum` — allowed values (list comma-separated in Notes)

If neither file exists, build the page with an empty Data Model table and note that the
component has not been implemented yet.

**If a Jira story ID was provided (e.g., `GCW-123`):**

```
getJiraIssue(issueIdOrKey="GCW-123")
```

Extract the description/acceptance criteria to populate the Business Requirements section.

---

## Step 4: Build the Confluence Page Body

Construct the body in Confluence storage format. Replace `{ComponentName}` and `{Category}`
with actual values. Build one Data Model table row per input (or Props field if no Builder.io
registration exists).

```html
<ac:structured-macro ac:name="details">
<ac:rich-text-body>
<table>
<tbody>
<tr>
  <th>Status</th>
  <td><ac:structured-macro ac:name="status"><ac:parameter ac:name="colour">Yellow</ac:parameter><ac:parameter ac:name="title">TODO</ac:parameter></ac:structured-macro></td>
</tr>
<tr>
  <th>Category</th>
  <td>{Category}</td>
</tr>
</tbody>
</table>
</ac:rich-text-body>
</ac:structured-macro>

<h2>Component Visuals / Figma Design Reference</h2>
<p><em>Add Figma design reference link or annotated screenshot here.</em></p>

<h2>Data Model</h2>
<table>
<thead>
<tr>
  <th>Field Name</th>
  <th>Type</th>
  <th>Required</th>
  <th>Default Value</th>
  <th>Notes</th>
</tr>
</thead>
<tbody>
{ONE ROW PER INPUT:}
<tr>
  <td>{input.name}</td>
  <td>{input.type}</td>
  <td>{input.required === true ? 'Yes' : 'No'}</td>
  <td>{input.defaultValue ?? ''}</td>
  <td>{input.helperText ?? ''}{input.enum ? ' Allowed: ' + input.enum.join(', ') : ''}</td>
</tr>
</tbody>
</table>

<h2>Business Requirements</h2>
<ul>
<li>Component shall implement the <a href="https://radicaldesign.atlassian.net/wiki/spaces/GCW/pages/224526337/Themeable+Interface">Themeable Interface</a></li>
<li>Component should have Storybook stories that test all permutations of the input parameters</li>
<li>Component should implement SEO and Accessibility best practices (semantic HTML, alt text, aria labels)</li>
<li>Component should be registered in Builder.io as a custom component under the {Category} insertMenu</li>
{IF JIRA STORY: add one <li> per acceptance criterion extracted from the story description}
</ul>

<h2>Action Items</h2>
<ol>
{IF NOT YET IMPLEMENTED:}
<li>Implement component following COMPONENT_PATTERN.md</li>
<li>Add Builder.io registration with inputs matching the Data Model above</li>
<li>Add Storybook stories covering all input permutations</li>
<li>Verify theme compatibility (light / dark / accent) and accessibility</li>
{IF ALREADY IMPLEMENTED — use these instead:}
<li>Review Data Model for completeness and accuracy</li>
<li>Add Figma design reference link above</li>
<li>Verify Storybook stories cover all input permutations</li>
<li>Verify theme compatibility (light / dark / accent) and accessibility</li>
</ol>
```

---

## Step 5: Create or Update the Confluence Page

**Create (no existing page):**
```
createConfluencePage(
  cloudId="radicaldesign.atlassian.net",
  spaceId="66846725",
  title="{ComponentName}",
  parentId="{category parent page ID from Step 1}",
  body="{HTML body from Step 4}",
  contentFormat="html"
)
```

**Update (existing page found in Step 2):**
```
updateConfluencePage(
  cloudId="radicaldesign.atlassian.net",
  pageId="{existing page ID}",
  title="{ComponentName}",
  body="{HTML body from Step 4}",
  contentFormat="html"
)
```

Capture the resulting page URL from the API response.

---

## Step 6: (Optional) Link Page to a Jira Story

If a Jira story ID was provided, add the Confluence page link as a comment on that story:

```
addCommentToJiraIssue(
  issueIdOrKey="{storyId}",
  body="Confluence documentation: {page URL}"
)
```

Skip if no story ID was given.

---

## Step 7: Summary

After all pages are processed, display:

```
✅ Confluence documentation complete

[For each component:]
**{ComponentName}** ({Category})
- Action: CREATED | UPDATED
- Page: {confluence page URL}
- Data Model rows: {count}
- Jira linked: {storyId or —}

[Any skipped/errored components:]
**{ComponentName}** — SKIPPED: {reason}
```

---

## Notes

- Never destructively overwrite a page without rebuilding from current code — always re-read
  the component files in Step 3 before updating
- If a component's folder uses a different casing than the argument (e.g., `sectionHeader` vs
  `SectionHeader`), do a case-insensitive search
- For `list`-type inputs, note in the Notes column if it has `subFields` defined
- The Themeable Interface link target is page ID 224526337 in space GCDISC
