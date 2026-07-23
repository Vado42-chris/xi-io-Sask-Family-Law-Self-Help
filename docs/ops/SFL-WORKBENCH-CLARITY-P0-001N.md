# SFL-WORKBENCH-CLARITY-P0-001N

Status: active — owner not accepted yet  
Date: 2026-07-23  
Branch: `feat/synthetic-legal-workbench-001`  
Depends on: `SFL-OWNER-CORRECTION-WORKBENCH-RECOVERY-001M`

## Locked direction

Keep the Inbox-derived workbench shell. Do not replace it with another wizard.

Progressive disclosure changes what is visible first. It does not remove Forms, Evidence, Messages, Tasks, Activity, Ingress, Review, or Packages.

## Product goal (plain language)

When the user opens the app they must immediately understand:

1. which case they are working in (practice vs locked private vs loaded private)
2. which documents are required for this stage, and why
3. what is completed, started, or blocked (as separate dimensions)
4. what exact action to take next
5. what still prevents the matter from being ready

## P0 acceptance criteria (core product)

| ID | Criterion | Evidence |
|---|---|---|
| P0-1 | Exactly one practice/private mode banner. Locked and “private on this computer” never show together. | UI |
| P0-2 | Case plan uses provisional language until requirement review is complete (“documents currently identified… Requirement review is not complete.”) | UI + diagnosis JSON |
| P0-3 | Required-document diagnosis records exist with reason, stage, governing source, source date, verification state, and no-longer-required condition | `workflows/.../required-document-diagnosis.json` |
| P0-4 | Matter-readiness model + expandable checklist for incomplete forms, supporting docs, sources, review, signing | schema + UI |
| P0-5 | Progress (`not_started` / `in_progress` / `needs_review` / `complete`) is separate from blockers | UI chips |
| P0-6 | Next action names the exact document (e.g. Continue Appearance Memo) | UI |
| P0-7 | Procedural stage derived from matter events/stage, not merely selected form | diagnosis helper |
| P0-8 | Inspector “Where to find this” is question-specific | `QUESTION_SOURCE_HINTS` |
| P0-9 | Plan categories distinguish forms you complete, court-issued, proof/service, evidence, procedural actions | queue groups |
| P0-10 | Private unlock path proves real caption, imported answers, ingress, and clean lock (owner acceptance) | local unlock; not claimed until owner verifies |
| P0-11 | Every primary route defaults to a real selected item when one exists | UI |

## P1 acceptance criteria (durability / polish)

| ID | Criterion |
|---|---|
| P1-1 | Visible resize grips, larger hit targets, double-click reset, keyboard resize, persisted device layout, centre pane min width |
| P1-2 | Reset layout control in settings |
| P1-3 | Richer inspector “Already found” with document page/header location when ingress maps it |

## Pane responsibilities

| Pane | Owns |
|---|---|
| Left rail | Primary area: My case, Forms, Evidence, Messages, Tasks, Activity, Ingress, Review, Packages |
| Work queue | Filters only: Today, Required, Later, All, Evidence, Messages — plus Case plan on My case / Today |
| Center | Selected document / task / message / readiness checklist |
| Right inspector | Contextual help for the selection, not generic furniture |
| Ibal | Optional collaborator; never silent mutation or send |

## Non-goals

- No replacement shell
- No hiding the complete form inventory
- No fabricated owner approvals
- No inventing legal requirements beyond the captured Kit #3J snapshot and explicit diagnosis artifacts
- No court transmission
- No claim of P0 acceptance until the unlocked private matter proves the five clarity questions

## Diagnosis artifact

Provisional live-track diagnosis (subject to `SFL-SOURCE-REVIEW-002`):

- Path: `workflows/jcc-kit-3j/2026-03-30/required-document-diagnosis.json`
- Schemas: `docs/schemas/required-document-diagnosis-schema-v1.json`, `docs/schemas/matter-readiness-schema-v1.json`
- Runtime helper: `public/src/document-diagnosis.js`

Counts from this file are **identified** requirements, not court-certified obligations, until human source review closes.
