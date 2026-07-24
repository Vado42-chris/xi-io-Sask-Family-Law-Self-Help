# Progressive Disclosure Workbench Standard v1

Status: `implementation contract, owner acceptance pending`  
Date: `2026-07-24`  
Depends on: `docs/ux/workbench-design-doctrine-v1.md`

## 1. Purpose

Define deterministic disclosure, navigation, focus, persistence, and responsive behaviour for the existing Inbox-derived family-law workbench.

This standard changes what the shell reveals for the current intention. It does not create a new shell, route family, or standalone wizard.

## 2. Orthogonal state model

Navigation, disclosure, selection, review scope, and inspector state are separate concepts.

```js
state.destination =
  "matter" |
  "forms" |
  "evidence" |
  "messages" |
  "tasks" |
  "activity" |
  "ingress" |
  "review" |
  "packages";

state.disclosureMode = "focus" | "plan" | "review";

state.selection = {
  workItemId: null,
  formId: null,
  questionId: null,
  sectionId: null
};

state.reviewScope =
  "answers" |
  "form" |
  "evidence" |
  "package" |
  "matter" |
  null;

state.inspector = {
  open: false,
  disclosure: "summary" // summary | wording | evidence | history | provenance
};
```

The disclosure controller must not impersonate the router. Selecting Forms does not erase destination identity by merely setting a generic `case_plan` view.

## 3. Transition contract

State changes occur through named transitions, not scattered property assignments.

Required transitions:

```text
APP_START
CHOOSE_PRACTICE_MATTER
UNLOCK_PRIVATE_MATTER
LOCK_PRIVATE_MATTER
FOCUS_CONTINUE
OPEN_CASE_PLAN
OPEN_DESTINATION_PLAN
OPEN_REVIEW
OPEN_FORM_REVIEW
OPEN_FORM_PREVIEW
OPEN_PACKAGE_REVIEW
RETURN_TO_FOCUS
OPEN_HELP
CLOSE_HELP
SELECT_WORK_ITEM
SAVE_AND_CONTINUE
SAVE_FOR_LATER
MARK_UNKNOWN
```

Each transition must define:

- allowed source states
- destination
- disclosure mode
- selection preservation
- review scope
- inspector result
- focus target
- scroll restoration
- history-state behaviour
- draft-answer handling
- privacy consequences

Invalid transitions fail closed and preserve the current entered information.

## 4. First-load decision

### No private matter available

Open the explicitly labelled practice matter in Focus.

### Private matter available and unlocked

Restore the private matter selection, return to Focus, and calculate the next safe action.

### Private matter available but locked

Do not render practice work as the active case underneath the lock warning.

Render a matter-choice gate:

```text
Your private case is locked

Unlock your case to continue your real legal work.

[Unlock private case]
[Open practice matter instead]
```

Practice mode starts only after explicit selection.

## 5. Focus projection

Focus is the default disclosure state after startup, refresh, answer save, question continuation, or return from Plan/Review.

### Focus queue

Maximum visible work:

- one current resumable item
- no more than two waiting items

The queue is derived by deterministic ranking, never `.slice()` over storage order.

Priority order:

1. current resumable work
2. verified critical or imminent deadline
3. newly received court-issued item requiring action
4. blocker preventing current-stage completion
5. user-pinned item
6. next dependency-ready item

Each projected item records:

```json
{
  "work_item_id": "form.fam-pd-7-5",
  "rank": 1,
  "reason": "current_resumable_work",
  "safe_to_start": true
}
```

### Focus centre

Show:

- procedural stage
- document title
- current human topic section
- section progress first
- quiet document progress second
- one current question or task
- one dominant primary action
- safe secondary actions

Do not show by default:

- readiness checklist
- complete document inventory
- answer review
- form preview
- package preparation
- source-review metadata
- full inspector

### Focus actions

Primary:

```text
Save and continue
or
Continue current task
```

Secondary:

```text
I do not know yet
Save for later
Get help
View case plan
See where this appears on the form
```

The global Ibal action must not visually compete with the primary legal action.

## 6. Plan projection

Plan shows the complete diagnosed work for the active destination or matter.

### Matter plan categories

- Forms you complete
- Court-issued documents
- Proof and service documents
- Supporting evidence
- Procedural actions
- Completed items
- Waiting on someone else

### Required information per plan item

- plain-language title
- why it is present
- procedural stage
- requirement confidence
- governing source or correspondence
- source date and freshness state
- progress state
- blocker list
- next exact action
- condition that may make it unnecessary

### Readiness checklist

The full readiness checklist exists only in Plan or matter/package Review.

It must distinguish:

- incomplete forms
- missing evidence
- court-issued documents not received
- signatures or commissioning
- service
- filing/acceptance
- source freshness
- final human review

Plan actions that resume a document return to Focus with selection preserved.

## 7. Review projection

Review always has an explicit scope.

### Answers

- human topic sections
- current values
- unknown/needs-help state
- evidence links
- edit action
- official form references secondarily

### Form

- structural or court-faithful preview
- clear draft/non-filing banner
- selected answer location
- Fit width / Fit page
- compact document navigator
- inspector closed unless deliberately opened

### Evidence

- selected assertion or form field
- linked records
- provenance
- missing or conflicting support

### Package

- documents included
- documents missing
- readiness checklist
- signature/service/filing blockers
- no finalization while required work remains

### Matter

- stage-wide readiness
- all identified obligations
- unresolved diagnosis questions
- source freshness
- owner review status

Review must not leave question-level help visible when the centre has changed to form or package scope.

## 8. Inspector contract

The inspector is closed by default in Focus.

When opened, it follows current scope.

### Question

```text
Where to find this
Exact court wording
Already found in your materials
Current answer state
Help me answer this
```

### Task

```text
Why this task exists
What it unblocks
What is needed
Related form or evidence
```

### Message

```text
Why this message matters
Affected forms and tasks
Deadline or follow-up
Preservation status
```

### Form preview

```text
About this draft
Source capture date
What remains incomplete
Where the selected answer appears
```

### Ingress

```text
Where this information came from
What it was matched to
What needs confirmation
What could not be matched
```

Escape closes the inspector and restores focus to the control that opened it.

## 9. Interrupt policy

Progressive disclosure may be interrupted only by defined conditions.

Severity:

```text
info
attention
blocking
critical
```

Only `blocking` and `critical` may displace the current primary action.

Allowed interrupts:

- privacy lock or session expiry
- verified deadline within warning threshold
- new court-issued document requiring action
- source change invalidating current work
- court rejection or filing failure
- selected form becomes inapplicable
- data conflict requiring human resolution

Informational notices remain quiet and do not create permanent banners.

## 10. Status de-duplication

Display one status at each level:

```text
Matter: current procedural stage
Document: progress
Package: readiness
```

Blocker detail is expandable from the relevant status. The same blocker must not be repeated across six surfaces.

## 11. Conditional rendering and privacy

CSS hiding is not a security or accessibility boundary.

For non-active private, developer, source-review, package, or answer-history content:

- do not supply the payload until needed
- conditionally render content
- use `hidden` and `inert` for retained shell structure
- remove hidden controls from the tab order
- clear private content from DOM and memory on lock

## 12. Persistence

Persist:

- current matter identity
- current form/question selection
- practice answers
- pane widths
- user-pinned work

Do not persist:

- private answers in browser storage
- inspector-open state
- expanded readiness checklist
- temporary disclosure panels
- developer/source-review state
- last dense review state as startup mode

On restart:

```text
restore selection
return to Focus
show next safe action
```

## 13. Resize behaviour

- wide pointer target
- grip visible only on hover, focus, or active drag
- keyboard arrows adjust width
- Home or double-click resets selected divider
- Settings offers Reset layout
- ARIA value attributes expose current/min/max width
- centre pane minimum width is enforced
- layout preference is stored independently of matter content

## 14. Responsive contract

### Desktop

- queue, centre, and optional inspector
- inspector closed by default in Focus

### Tablet

- centre remains dominant
- queue collapses or overlays
- inspector overlays

### Mobile

One pane at a time:

```text
Focus -> current question
Plan -> full-screen plan list
Help -> full-screen drawer
Review -> one selected review scope
```

No split resizing on mobile.

## 15. Browser history and restoration

Back/Forward must restore:

- destination
- disclosure mode
- selection
- review scope

It must not restore private content after lock or timeout.

Changing disclosure state must not discard an unsaved answer without an explicit decision.

## 16. Acceptance criteria

1. First load returns to Focus unless a private-case choice gate is required.
2. Focus shows no more than three work items.
3. Focus has exactly one visually dominant action.
4. Inspector is closed by default.
5. Readiness checklist is collapsed outside Plan/Review.
6. Complete case plan is reachable in one interaction.
7. Focus ranking is deterministic and reason-coded.
8. Locked private matter does not silently substitute practice work.
9. No hidden interactive control remains in the tab order.
10. Switching views preserves answer, selection, and scroll context.
11. Verified legal interrupts follow the documented severity policy.
12. Review always has an explicit scope.
13. Mobile presents one primary pane at a time.
14. Empty and completed states provide a next safe action.
15. Static tests do not require obsolete hidden controls.
16. Stale inspector content never survives a scope change.
17. Ingress user mode contains no raw schema IDs.
18. Form preview expands the document area automatically.
19. Lock removes private content from DOM and memory.
20. Owner private-matter proof is required before acceptance.

## 17. Browser proof matrix

Required behavioural proof:

- hard refresh
- browser Back/Forward
- keyboard-only completion
- inspector focus movement and restoration
- 200 percent zoom
- no horizontal scrolling
- 1366x768
- 1024x768
- 390x844
- private lock/unlock/lock
- Focus -> Plan -> Focus
- Focus -> Review answers -> Focus
- Focus -> Form preview -> Focus
- unanswered package finalization blocked
