# SFL-UX-DESIGN-RECOVERY-IMPLEMENTATION-PACKET-001P

Status: `implementation handoff, owner acceptance not claimed`  
Date: `2026-07-24`  
Branch: `feat/synthetic-legal-workbench-001`  
PR: `#5`  
Scope: documentation and implementation plan only; no merge approval

## 1. Executive direction

Preserve the current Inbox-derived family-law workbench. Do not create another shell, standalone wizard, or replacement route.

The UI already contains the correct product domains:

- case identity
- forms
- evidence
- messages
- tasks
- activity and receipts
- ingress reconciliation
- review
- packages
- contextual Ibal assistance

The current failure is not missing capability. It is poor hierarchy, additive disclosure, repeated status, stale context, developer vocabulary, and weak next-action orientation.

The recovery objective is:

> Make the complete legal workspace feel like one manageable next action, while preserving the entire verified case plan one interaction away.

## 2. Required source documents

Agents must read these before changing the UI:

1. `docs/product/product-vision-locked-v1.md`
2. `docs/architecture/inbox-pattern-adoption-and-legal-workbench-v1.md`
3. `docs/ops/SFL-OWNER-CORRECTION-WORKBENCH-RECOVERY-001M.md`
4. `docs/ops/SFL-WORKBENCH-CLARITY-P0-001N.md`
5. `docs/ux/workbench-design-doctrine-v1.md`
6. `docs/ux/progressive-disclosure-workbench-standard-v1.md`
7. `docs/ux/plain-language-legal-content-standard-v1.md`
8. `docs/ux/accessibility-and-cognitive-load-v1.md`
9. `docs/ux/progressive-disclosure-interview-v1.md`
10. `docs/architecture/adr-002-interaction-architecture-layers-v1.md`

When documents conflict, the newest owner correction and the three design standards in this packet govern the user interface. Legal source, privacy, and audit boundaries remain unchanged.

## 3. Why prior passes failed

### Failure 1: progressive disclosure became product deletion

The Inbox-derived workbench was replaced by a standalone Continue-first wizard. This removed the visible case plan, form inventory, evidence, correspondence, and mature product grammar.

Correction: progressive disclosure changes projection, not product scope.

### Failure 2: clarity became permanent dashboard density

The restored shell exposed the entire diagnosis, readiness checklist, queue, question, form controls, warnings, help, and package state simultaneously.

Correction: Focus, Plan, and Review have exclusive visibility budgets.

### Failure 3: plain language became text substitution

A temporary DOM string-rewrite layer replaced selected labels but did not create a coherent content hierarchy or stable reviewable content model.

Correction: plain language is a reviewed presentation layer tied to user intention and official wording, not a find-and-replace system.

### Failure 4: state scopes leaked into one another

Question help remained visible during form preview and answer review. Generic evidence tasks appeared in Ingress. Practice content remained active under a private-case lock banner.

Correction: destination, disclosure mode, selection, review scope, and inspector scope are orthogonal and transition together through explicit contracts.

## 4. Target state model

Implement or preserve these separate values:

```js
state.destination;
state.disclosureMode; // focus | plan | review
state.selection;
state.reviewScope;    // answers | form | evidence | package | matter
state.inspector;
state.matterMode;     // practice | private_locked | private_loaded
```

Do not use CSS classes as the only state model.

Named transitions must own:

- destination
- disclosure mode
- selected object
- inspector scope
- focus target
- scroll restoration
- browser history
- draft-answer handling
- privacy effects

## 5. Implementation passes

### Pass A: state and scope correctness

Goal: eliminate stale and contradictory UI before further visual polish.

Tasks:

1. Separate destination from disclosure mode.
2. Add explicit review scope.
3. Add explicit inspector scope and close it on incompatible centre changes.
4. Add a private matter choice gate.
5. Remove practice content from active view while private matter is locked unless the user explicitly chooses practice.
6. Add named transitions or reducer actions.
7. Preserve current answer and selection across valid transitions.
8. Clear private DOM and memory state on lock.

Acceptance:

- form preview never shows stale question help
- Ingress never shows generic task help
- package review never shows question answer state
- private lock never silently substitutes practice work

### Pass B: Focus projection

Goal: make the next action obvious within five seconds.

Tasks:

1. Derive the Focus queue through deterministic ranking.
2. Show one current item and at most two waiting items.
3. Collapse the case plan to a compact summary.
4. Remove the readiness checklist from Focus.
5. Close the inspector by default.
6. Show section-local progress first.
7. Keep one primary action.
8. Demote global Ibal styling.
9. Provide `View full case plan` and `Get help` as secondary actions.

Required first-paint content:

```text
Active matter identity
Current procedural stage
Current document
Current section
One question or task
One primary action
```

No full inventory, package controls, source metadata, or multi-card help stack.

### Pass C: Case plan projection

Goal: let the user verify that all correct documents and actions are accounted for.

Tasks:

1. Restore complete categorized inventory.
2. Show requirement reason and confidence.
3. Show source and source date.
4. Separate progress from blockers.
5. Show exact next action.
6. Show matter-readiness checklist.
7. Distinguish user forms, court-issued documents, service/proof, evidence, and procedural actions.
8. Preserve selected matter and return to Focus when work resumes.

Required language:

```text
Documents currently identified for this stage
Requirement review is not complete
```

until the source-review gate is actually closed.

### Pass D: Review projection

Goal: give confidence in answers and outputs without surrounding review with unrelated dashboard density.

Tasks:

1. Add explicit answer/form/evidence/package/matter review scopes.
2. Use human topic headings before official paragraph labels.
3. Compact the left queue into a review navigator.
4. Collapse the case dashboard.
5. Close the inspector unless the user opens scope-specific help.
6. Expand the centre for form preview.
7. Add Fit width and Fit page.
8. Keep the non-filing warning unmistakable.
9. Provide a single next blocker action in package review.

### Pass E: Ingress and provenance language

Goal: help the user understand what information was found and where it is used.

Tasks:

1. Replace raw IDs and schema vocabulary in user mode.
2. Group information into Matched, Needs confirmation, Incomplete, Conflicting, and Not matched.
3. Show source document or message.
4. Show affected human-readable form/question/task.
5. Show confirmation action.
6. Keep raw IDs in reviewer/developer surfaces only.

### Pass F: responsive and accessibility proof

Goal: prove the workbench works under realistic stress and device constraints.

Tasks:

1. Desktop, tablet, and mobile projections.
2. One pane at a time on mobile.
3. Inspector as overlay/drawer below desktop.
4. Keyboard-only transitions.
5. Focus restoration.
6. No hidden controls in tab order.
7. 200 percent zoom.
8. No horizontal scrolling.
9. Resize grips visible only during interaction.
10. Reduced-motion and screen-reader status announcements.

## 6. Component responsibilities

### Top bar

Show:

- product identity
- active matter identity
- quiet search where useful
- quiet Ibal access

Do not use the top bar for package, source, and privacy warnings simultaneously.

### Scope rail

Keep all owner-required destinations. Active destination must agree with the queue and centre content.

### Work queue

Focus: ranked next-safe actions.  
Plan: full categorized inventory.  
Review: compact review navigator.  
Ingress: import/reconciliation categories.

A queue must not show unrelated generic items just because they are globally available.

### Centre workspace

Always render the selected destination object or a meaningful next-safe empty state.

Do not leave blank centre space when actionable work exists.

### Inspector

Closed by default in Focus. Scope-specific when opened. Clear or rerender immediately when centre scope changes.

### Ibal

Contextual collaborator. It may explain, retrieve linked information, propose text, or identify missing information. It may not become the dominant navigation or silently mutate state.

## 7. Copy implementation matrix

Agents must apply `docs/ux/plain-language-legal-content-standard-v1.md` to these priority surfaces first:

| Surface | Current failure | Target language |
|---|---|---|
| Private lock | practice shown under warning | explicit Unlock or Open practice choice |
| Case summary | large negative checklist | compact current stage + next action |
| Form card | tiny metadata and engine statuses | why needed + progress + blocker + next action |
| Question | official label used as primary | plain question + official wording on demand |
| Review headings | paragraph numbers only | human topic + official reference secondarily |
| Package | hashes/blockers/system terms | what is missing + next safe action |
| Ingress | raw IDs/schema keys | what was found + where used + confirmation state |
| Inspector | generic or stale cards | selected-context help only |
| Buttons | Continue/Validate/Preview | explicit result-oriented labels |

## 8. Visual design rules

1. Use typography and spacing before adding containers.
2. One dominant action per state.
3. Permanent warning colour is reserved for true blocking/critical conditions.
4. Technical metadata does not establish primary hierarchy.
5. Sentence case is the default.
6. Minimum comfortable body size and line height are required.
7. The centre task gets the largest visual area.
8. Full-form preview automatically receives more width.
9. Resize rails are visually quiet until interaction.
10. Status appears once per level.

## 9. Interrupt policy

Only documented blocking or critical conditions may displace the Focus action:

- private lock/session expiry
- verified deadline warning
- new court-issued document requiring action
- source version invalidates current work
- filing/court rejection
- applicability change
- unresolved data conflict

Everything else remains quiet, contextual, or available in Plan/Review.

## 10. Testing requirements

### Automated

- deterministic Focus ranking
- transition table/reducer tests
- inspector scope tests
- locked private matter gate
- no private/practice mixing
- no hidden interactive controls
- Plan restores complete inventory
- Review preserves selected form
- Ingress excludes raw user-mode IDs
- package finalization blocked when incomplete
- first-paint screenshot at required viewports

### Browser proof

Required captures:

1. locked private matter choice gate
2. explicit practice Focus first paint
3. unlocked private Focus with real caption and imported answer
4. full Case plan
5. answer Review
6. form preview with expanded centre
7. package readiness
8. Ingress reconciliation
9. mobile Focus
10. 200 percent zoom

### Owner test script

The owner should be able to answer yes to:

1. Can I tell whether this is my real case or practice information?
2. Can I identify the next action in five seconds?
3. Can I start without reading the whole case plan?
4. Can I verify every document and action identified for this stage?
5. Can I tell why each document is present?
6. Can I see what information was imported and where it is used?
7. Can I review all answers and the draft form?
8. Can I see exactly why the package is not ready?
9. Can I return to the same work without losing my place?
10. Is the interface using ordinary human language rather than system language?

A single `no` blocks owner acceptance for this UX pass.

## 11. Stop conditions

Agents must stop and request review if a proposed change would:

- replace the Inbox-derived shell
- remove a primary destination
- hide the complete case plan beyond one interaction
- mix private and practice content
- create a new product route to solve density
- expose source IDs or engine terms in user mode
- create more than one visually primary action in Focus
- add a permanent warning without interrupt-policy justification
- require obsolete hidden controls for tests
- treat AI-generated copy as approved

## 12. Work that remains separate

This packet does not close:

- `SFL-SOURCE-REVIEW-002`
- the 267-item transcription review
- companion-form source capture
- court-faithful PDF verification
- production private workspace
- external AI consent and disclosure
- email, service, filing, or court transmission
- owner acceptance or PR merge

## 13. Recommended execution order

```text
A. State and scope correctness
B. Focus projection
C. Case plan projection
D. Review projection
E. Ingress/plain-language cleanup
F. Responsive/accessibility browser proof
G. Private owner litmus
H. Candidate framework backfeed after acceptance
```

Do not parallelize A through D across agents touching the same renderer. Later proof and documentation work can run in parallel only after the state contract is stable.

## 14. Final implementation invariant

The finished UI must preserve this relationship:

```text
Complete legal system underneath
  + one clear user intention at a time
  + exact official detail on demand
  + explicit user control at every consequential step
```
