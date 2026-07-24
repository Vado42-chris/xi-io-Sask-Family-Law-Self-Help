# Plain-Language Legal Content Standard v1

Status: `required content standard, owner review pending`  
Date: `2026-07-24`  
Applies to: user-facing labels, questions, statuses, explanations, tasks, messages, case-plan items, ingress, review, and Ibal proposals

## 1. Purpose

Help a stressed self-represented person understand what to do without hiding exact court terminology or changing the legal source of truth.

Plain language is not simplification by omission. It is a layered presentation:

```text
Plain user instruction
  -> official legal term or wording
  -> source and audit detail
```

The official court artifact remains the legal source of truth. The reviewed catalog remains the normalized form source. Human-approved presentation content is the user-interface wording. AI output is an untrusted draft proposal only.

## 2. Audience assumptions

Design for people who may be experiencing:

- legal and financial stress
- trauma or conflict
- pain, fatigue, or interrupted attention
- ADHD, autism, dyslexia, or executive-function difficulty
- low legal literacy
- limited time or device access
- fear of making an irreversible mistake

The product must not require users to learn the system’s internal vocabulary before they can act.

## 3. Core writing rules

### Lead with the action or question

Prefer:

```text
Add the court file number
```

Avoid:

```text
Court file number field incomplete
```

### Use one idea per sentence

Prefer:

```text
Copy the number from your Notice of JCC or another court document.
```

Avoid:

```text
Capture the identifier from the governing court-issued artifact and independently verify the source before proceeding.
```

### Name the object

Prefer:

```text
Continue the Appearance Memo
```

Avoid:

```text
Continue next document
```

### Explain consequence without threat

Prefer:

```text
This answer is still missing, so the draft package is not ready yet.
```

Avoid:

```text
Blocking condition: required value unresolved.
```

### Preserve uncertainty

Use:

```text
I do not know yet
Needs confirmation
Not found yet
Waiting for the court
```

Do not force a false yes/no answer.

### Distinguish obligation confidence

Use:

```text
Required
Required if...
Currently identified
Needs human confirmation
Court-issued
Recommended
Optional
Not applicable
```

Do not present a provisional diagnosis as a court-certified requirement.

## 4. Content hierarchy

For each user-facing question or task, present information in this order:

1. plain-language question or action
2. why it matters now
3. where to find the information
4. what happens next
5. official wording or legal term
6. source and audit detail

The user should not encounter stable IDs, schema names, raw conditions, hashes, or storage paths in the first five layers.

## 5. Question pattern

A question record should support:

```text
Plain question
Short explanation
Where to find it
Answer guidance
I do not know yet
Save for later
Official wording
Where this appears on the form
```

Example:

```text
What is the court file number on your documents?

You can usually find it near the top of a Notice from the court,
a previously filed court form, or court correspondence.

[Type your answer]
[I do not know yet]
[Save and continue]

[View official wording]
[See where this appears on the form]
```

## 6. Task pattern

Every task must answer:

- what to do
- why it is in the plan
- what it unblocks
- what source or event created it
- whether the user, another party, or the court must act
- what safe completion looks like

Prefer:

```text
Get the official Form 15-47 Financial Statement

Why: the current support request may require financial disclosure.
Status: the official blank has not yet been captured in this workspace.
Next: verify and archive the current official form before treating this task as complete.
```

Avoid:

```text
Complete Form 15-47
blocked source missing
fam-pd-7-2:p11.financial_statement_filed
```

## 7. Document-plan pattern

Each document entry uses:

```text
Document title
Why it is currently in the plan
Requirement confidence
Progress
Blockers
Next action
Source freshness
```

Example:

```text
FAM-PD #7-5 Judicial Case Conference Appearance Memo

Currently identified because a Judicial Case Conference has been scheduled.
Requirement status: needs confirmation against the court Notice.
Progress: In progress, 24 of 31 steps complete.
Still needed: conference date and filing-party details.
Next: Continue the Appearance Memo.
Source snapshot: captured March 30, 2026; currentness review pending.
```

## 8. Status vocabulary

### Matter

Use procedural language:

```text
Requesting a Judicial Case Conference
Conference scheduled
Preparing the Appearance Memo
Preparing service materials
Ready for conference review
Waiting for court confirmation
```

Avoid generic labels such as `workflow active`.

### Document progress

```text
Not started
In progress
Needs review
Complete
```

### Package readiness

```text
Not ready
Ready for final review
Ready to print or download
```

Do not use `Blocked` as the only document-progress state.

### Source state

```text
Current version confirmed
Version needs checking
Official source not yet captured
Source review pending
```

### Ingress state

```text
Matched
Needs confirmation
Incomplete
Conflicting information
Not yet matched
```

## 9. Prohibited user-mode vocabulary

Do not show these without an explicit reviewer/developer disclosure:

```text
line_item_id
fact_definition_id
assertion_id
binding_id
source_semantic_hash
selection reconciliation
conditional_or_optional
external_document_pending
source_missing
requirement_review_incomplete
supports_form_line_item_answers
unknown_or_incomplete_fields
demo_only
append-only event and receipt
loopback endpoint
/data/private
```

Translate the meaning, not the identifier.

## 10. Before-and-after examples

### Privacy

Avoid:

```text
Private matter loaded through /api/local/matter on loopback only.
Static /data/private is disabled.
```

Use:

```text
Your private case is loaded on this computer.
It will lock after 30 minutes without activity.
```

### Locked private matter

Avoid showing practice work underneath a warning.

Use:

```text
Your private case is locked.

[Unlock private case]
[Open practice matter instead]
```

### Readiness

Avoid:

```text
Package blocked: FAM-PD #7-5 incomplete
```

Use:

```text
Package not ready
The Appearance Memo still has 7 unanswered items.
```

### Review

Avoid:

```text
Paragraph 6a
Other case conferences pending
```

Use:

```text
Other scheduled court steps
Form reference: Paragraph 6a
```

### Ingress

Avoid:

```text
fam-pd-7-2 — 24 fields filled — supports_form_line_item_answers
```

Use:

```text
Request for a Judicial Case Conference
24 answers were matched to this form.
1 answer still needs review.
```

## 11. Button labels

Buttons describe the result of pressing them.

Prefer:

```text
Continue the Appearance Memo
Save and continue
Save for later
View full case plan
Help me answer this
View official wording
Review missing answers
Resolve next blocker
Unlock private case
Open practice matter instead
```

Avoid:

```text
Continue
Proceed
Validate
Preview
Action
Create proposal
Mark reviewed
```

Generic labels are acceptable only when the destination is already unmistakable in the immediate context.

## 12. Warnings and errors

Warnings must be:

- specific
- actionable
- proportionate
- shown at the level where the user can resolve them

Use one warning per problem. Do not repeat the same source or package warning in every pane.

Example:

```text
Form version needs checking

This workspace uses a form captured March 30, 2026.
You may continue answering questions, but final review remains blocked until the current official version is confirmed.

[About this form]
```

## 13. Help content

Help must be specific to the selected work.

A generic panel such as `Simple answer` is not sufficient.

For the court file number:

```text
Where to find it

• Notice from the court
• Previously filed court forms
• Court correspondence

Already found in your materials
Nothing has been linked yet.
```

If no specific help exists, keep the inspector closed rather than fill it with generic text.

## 14. AI-generated content

AI may draft:

- plain-language questions
- explanations
- answer guidance
- task summaries
- proposed narrative text

AI-generated text must record:

```text
generation method
provider/model
generated date
instruction version
source bindings
human review state
```

It remains ineligible for authoritative user mode until the required human approvals exist.

AI examples must not suggest facts, allegations, desired legal outcomes, or language the user may copy without reflection.

Replace `example answer` with non-leading `answer guidance` for contested or sworn material.

## 15. Review dimensions

User-facing content may require separate review for:

```text
source binding
legal meaning
plain-language accuracy
UX clarity
accessibility
trauma sensitivity
```

Approval is receipt-backed. A status string without an actual reviewer and review record is not approval.

## 16. Reading and layout targets

- short paragraphs
- meaningful headings
- one primary instruction per panel
- comfortable line length
- sentence case rather than persistent all caps
- official legal terms preserved where necessary and explained once
- no essential instruction in tiny metadata
- no colour-only meaning

## 17. Content acceptance test

For every user-facing screen, ask:

1. Can the user tell what this is?
2. Can the user tell what to do?
3. Can the user tell why it matters?
4. Can the user tell where the information came from?
5. Can the user tell what will happen after the action?
6. Is exact court wording still reachable?
7. Is any internal system vocabulary leaking into the primary layer?

A screen that fails two or more questions should not be accepted.
