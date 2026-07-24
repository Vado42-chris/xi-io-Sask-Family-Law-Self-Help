# Family Law Workbench Design Doctrine v1

Status: `required design direction, owner review pending`  
Date: `2026-07-24`  
Project: `sask_family_law_self_help`  
Applies to: Inbox-derived user workbench on `/` and `/app`

## 1. Product purpose

This product is a Saskatchewan family-law help kit presented through the familiar interaction grammar of `xi-io: Inbox`.

It is not a generic form wizard, a court portal clone, a developer console, or a legal chatbot with forms attached.

The workbench exists to help a person understand and complete an entire legal stage safely:

1. identify which forms, court-issued documents, supporting records, and procedural actions apply
2. explain why each item is in the plan and how confident that diagnosis is
3. reuse information already known about the matter
4. guide the user through the next manageable action
5. preserve access to the complete case plan
6. review every answer and generated document before anything can leave the workspace
7. maintain receipts, provenance, source freshness, and explicit user approval

## 2. Locked shell

The canonical user interface remains the Inbox-derived workbench:

```text
Primary rail
  -> Work queue
  -> Selected work/document workspace
  -> Contextual help / Ibal
```

Do not replace this shell with a separate wizard application.

Progressive disclosure changes the current projection of the workbench. It does not delete or orphan Forms, Evidence, Messages, Tasks, Activity, Ingress, Review, Packages, source records, or the complete legal plan.

## 3. Primary user questions

Every major surface must help answer at least one of these questions:

1. Which case am I working in?
2. What exact action should I take now?
3. Which documents and actions are required, and why?
4. What information has already been found or imported?
5. What is complete, incomplete, uncertain, blocked, or waiting on someone else?
6. What will be produced from my answers?
7. What prevents this stage from being ready?

A surface that does not answer one of these questions should not occupy permanent user-mode space.

## 4. Interaction principle

The workbench should feel like opening one important email and dealing with it, while knowing the complete mailbox and case plan remain available one interaction away.

The normal sequence is:

```text
Orient
  -> Continue the next safe action
  -> Get contextual help only when needed
  -> Review the result
  -> Return to the next safe action
```

The user should not need to understand the internal form catalog, workflow engine, source ledger, hashes, stable IDs, or package graph before answering a question.

## 5. Attention budget

The default Focus projection has a strict attention budget:

- one case identity state
- one procedural-stage statement
- one current document or work item
- one current section
- one primary question or action
- one visually dominant button
- no more than two secondary waiting items
- contextual help closed by default
- full case plan reachable in one interaction

Adding a new visible element to Focus requires removing or demoting another element. Focus is not permitted to grow without an explicit owner-approved revision to this doctrine.

## 6. Progressive disclosure is exclusive, not additive

Focus, Case plan, and Review are distinct user intentions. They must suppress unrelated detail rather than stack on top of one another.

### Focus

Purpose: complete the next safe piece of work.

Show:

- compact matter identity and stage
- current document and section progress
- one question or task
- one primary action
- `I do not know yet`, `Save for later`, `Get help`, and `View case plan` as secondary actions where safe

Hide or collapse:

- complete document inventory
- full readiness checklist
- package controls
- source-review detail
- full answer-review structure
- permanent inspector
- developer terminology

### Case plan

Purpose: prove that the correct work has been identified and explain what remains.

Show:

- forms the user completes
- court-issued documents
- service and proof documents
- supporting evidence
- procedural actions
- requirement reason, source, date, verification state, progress, blockers, and next action
- matter-readiness checklist

Do not surround the plan with an unrelated active-question inspector.

### Review

Purpose: inspect answers, draft documents, evidence relationships, and package readiness.

Show only the selected review scope:

- answers
- form
- evidence
- package
- matter readiness

Review must not automatically keep the full case dashboard, question inspector, and every queue category expanded.

## 7. Pane responsibilities

### Primary rail

Owns product destination only:

- My case
- Forms
- Evidence
- Messages
- Tasks
- Activity
- Ingress
- Review
- Packages

The rail does not decide disclosure density.

### Work queue

Owns the ranked items relevant to the active destination and disclosure state.

In Focus, the queue is a next-safe-action projection, not the first items in an array.

In Case plan, it restores the complete categorized inventory.

In Review, it becomes a compact review navigator.

### Centre workspace

Owns the selected work object:

- question
- task
- message
- evidence item
- answer review
- draft form
- package readiness
- ingress reconciliation

It must never remain blank when a safe default selection exists.

### Contextual inspector

Owns selected-context help only. It is not permanent system furniture.

Its content must follow the active scope:

- question help for a question
- review summary for answer review
- draft status for form preview
- blocker explanation for package review
- provenance for ingress

Stale inspector content is a product defect.

### Ibal

Ibal is an optional collaborator, not the main task.

Use contextual labels such as `Help me answer this` or `Ask about this document`. Ibal may explain, find linked information, identify missing details, or propose edits. It may never silently alter, approve, transmit, file, serve, or email anything.

## 8. Privacy and matter identity

Private, practice, and locked states are mutually exclusive user contexts.

If a private matter exists but is locked, ordinary private work is not displayed underneath a warning banner.

The user must explicitly choose:

```text
Unlock private case
or
Open practice matter
```

Practice and private values must never appear mixed in one rendered session.

After lock or timeout, private content must be removed from the DOM and in-memory state, not merely obscured by CSS.

## 9. Status hierarchy

Use one status at each level:

```text
Matter: procedural stage
Document: progress state
Package: readiness state
```

Progress and blockers are separate dimensions.

Progress states:

```text
not_started
in_progress
needs_review
complete
```

Blockers may include:

```text
information_missing
evidence_missing
source_missing
external_document_pending
signature_required
commissioning_required
service_required
filing_confirmation_required
```

Do not repeat the same blocker in the banner, case card, queue row, document header, inspector, and package panel.

## 10. Visual hierarchy

User mode should rely on typography, spacing, and progressive disclosure before borders and warning colours.

Required hierarchy:

1. current task or question
2. immediate reason and consequence
3. primary action
4. section progress
5. document progress
6. matter and package status
7. source and audit detail on demand

Avoid:

- nested boxes around every object
- permanent warning strips
- tiny all-caps metadata as the main navigation aid
- low-contrast grey for important instructions
- multiple equally prominent primary buttons
- court-form paragraph numbers as the only review headings

## 11. Review language

Human topic labels lead. Official form structure follows secondarily.

Prefer:

```text
Court and case information
Conference date and location
Who is filing this memo
What you plan to ask for
Your legal position
Other scheduled court steps
Contact and signing information
```

Then show official references where useful:

```text
Form sections: Court heading, Schedule, Paragraph 1a
```

## 12. Non-negotiable anti-patterns

Do not:

- replace the Inbox-derived shell
- hide the complete case plan permanently
- silently substitute practice information for a locked private matter
- use raw schema IDs or engine vocabulary in user mode
- preserve obsolete hidden controls only to satisfy static tests
- treat every form line item as one user question
- make AI-generated wording authoritative
- expose all warnings and all readiness details in Focus
- leave stale inspector content visible after the centre scope changes
- claim that identified documents are court-certified requirements before source review

## 13. Success condition

A stressed user should be able to open the product and, within five seconds, understand:

- which matter is active
- what to do next
- why that action matters
- how to get help
- where to verify the complete document plan

The complete system remains available, but it does not demand simultaneous attention.
