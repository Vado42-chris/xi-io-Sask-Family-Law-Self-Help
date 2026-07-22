# Canonical Product Vision v1

Status: `OWNER-APPROVED LOCKED DIRECTION`  
Decision token: `SFL_PRODUCT_ARCHITECTURE_LOCK_001_ACCEPTED`  
Approved: `2026-07-22`  
Project: `sask_family_law_self_help`

## Product purpose

Build a secure, auditable Saskatchewan family-law self-help workbench that converts reviewed official court forms and procedural sources into a guided, resumable workflow.

The product must identify the forms that appear applicable to the user's stated needs, capture every applicable official question as a stable line item, help the user provide and revise answers, associate evidence intentionally, render the completed forms accurately, and prepare controlled packages for printing, download, service, filing or verified electronic delivery.

The user remains the final authority over facts, wording, evidence inclusion, document finalization, recipients and external transmission.

## Locked product invariants

1. Every official question, choice, blank, repeatable row, signature, commissioning field, attachment requirement, material clause and court-only field receives a stable source-bound line-item ID.
2. Official artifacts are preserved as immutable dated snapshots with source date, capture date, hash, authority state, freshness state and supersession history.
3. Source date, capture date, last official verification date and freshness state are visible in the workflow, editor, preview and final package review.
4. Applicability, branching, required forms, deadlines and completion gates are deterministic. AI cannot invent or decide procedural truth.
5. User answers and document blocks remain structured records with revision history. Rich editor HTML, generated PDF and outgoing email are projections, not canonical truth.
6. AI may explain, interview, compare, organize and propose edits. It may not silently change answers, approve revisions, sign, commission, file, serve or send.
7. Every AI edit is a typed proposal identifying affected stable IDs, before/after content, facts and evidence relied upon, limitations and approval state.
8. Original evidence and correspondence are preserved unchanged, hashed and kept separate from model interpretation.
9. Every finalized package binds exact source snapshots, form revisions, attachment hashes, ordering, recipient, method, validation result and user approval.
10. Any post-approval change invalidates the approval and returns the package to review.
11. Filing, service, courtesy delivery, download and printing are distinct egress events. One submission never represents the entire legal matter.
12. Previously finalized packages never change. Later correspondence creates new ingress events, tasks or revisions.
13. Progress, blockers, due dates and the next safe action are primary interface content.
14. Every material action creates an append-only event and, where appropriate, a receipt.
15. No completed form, evidence, private correspondence, token, credential or private model output belongs in the public repository or public deploy surface.

## Locked interaction model

The mature xi-io Inbox interaction grammar is adopted as a read-only design and control-plane donor. The Inbox repository remains untouched and is not a runtime dependency.

```text
matter scope -> work queue -> selected artifact -> contextual inspector / Ibal
```

Domain translation:

```text
email account        -> legal matter / workspace
mailbox or folder    -> workflow stage / work view
message or thread    -> form, task, evidence, correspondence or package event
reader               -> structured paginated document workspace
compose draft        -> document revision
approval             -> user sign-off on an exact revision and attachment set
outbox                -> package queue
generated/sent item  -> immutable filing, service, export or delivery receipt
Ibal context         -> selected matter, form, section, line item, evidence and source
```

## Locked workspace areas

### Persistent top bar

Shows product identity, active matter, court file number, Judicial Centre, source freshness, save state, AI privacy posture, global search/command entry and the Ibal trigger.

### Matter rail

Provides Home, My Matters, Calendar, Tasks, Activity/Receipts, Contacts, Integrations and Settings. Matter entries show safe identity, procedural stage, next deadline, progress and attention count.

### Work queue

Lists required forms, unanswered questions, evidence homework, items needing review, signature or commissioning work, ready-to-file packages, submitted packages, correspondence and follow-up tasks.

### Form control header

Uses the visual anatomy of an email header for form metadata and controls, not for canonical answers. It shows form identity, source freshness, progress, blockers, revision, evidence, validation and finalization state.

### Main document workspace

Provides synchronized modes:

1. Guided questions
2. Section review
3. Paginated form preview
4. Final package preview

Narrative blocks may use an advanced editor, but each accepted edit remains bound to structured fields, paragraphs or controlled document blocks.

### Contextual inspector

Shows official wording, plain-language explanation, applicability, validation, linked facts, evidence, revisions, AI proposals, approvals and receipts for the selected object.

### Ibal concierge

Remains available from every route. Ibal receives bounded selected context and returns explanations, follow-up questions, consistency findings, evidence analysis, proposed text changes and next-safe actions. Nothing is applied without user review.

## Wizard, progress and motivation

A new form opens as a deterministic resumable wizard driven by the reviewed question graph.

```text
not started -> eligibility -> applicable forms -> questions -> evidence homework -> section review -> validation -> finalization
```

The application saves after each answer, resumes at the exact unresolved item, permits `I do not know` and `needs help`, and recalculates progress from currently applicable questions.

Every matter continuously shows:

- current stage,
- applicable forms,
- completed and remaining questions,
- missing evidence,
- blockers,
- nearest deadlines,
- next three safe actions,
- last progress event,
- manageable work blocks.

Reminders must be calm and useful, never punitive or shaming.

## Evidence and correspondence

Evidence can be linked to one or more facts, answers, issues, forms or packages. Uploading a file does not automatically include it in a court package.

Ingress follows:

```text
preserve original -> hash -> inspect -> deterministic metadata -> proposed matter match -> human confirm -> extract -> propose classification -> review queue
```

Uncertain matter matches go to quarantine or `needs-human-decision`.

## Finalization and egress

The initial reliable destination is local package generation, print and download. Electronic filing, service or email adapters remain separately gated until current official receiving rules, recipient identity, attachment limits, approval binding, delivery receipts and failure handling are proven.

Each egress event has its own package, approval, attempt and result receipt.

## Backend direction

Use PostgreSQL for structured runtime state and an encrypted private object vault for immutable file bytes.

PostgreSQL owns identities, source metadata, forms, question rules, matters, answers, revisions, evidence links, tasks, calendar entries, package manifests, approvals, receipts, ledger events, AI proposals and consent records.

The object vault owns original forms, evidence, correspondence, rendered documents and finalized packages. Each object is content-addressed and records its hash, size, media type, encryption reference, preservation state and storage URI.

Relational constraints are preferred for durable concepts. JSONB is limited to genuinely variable rule, validation, rendering and provider payloads. An entire matter must not be stored as one mutable JSON document.

## Security and audit requirements

Required controls include application authorization, matter isolation, encryption in transit and at rest, short-lived object access, malware and file-type inspection, preview sandboxing, local-first AI routing, explicit remote-model consent, revision hashes, stale-approval invalidation, append-only events, redacted receipts, backup/recovery proof, retention/deletion receipts and audited support access.

## Reuse boundary

Reuse Inbox patterns and carefully selected source slices only through pinned donor paths, privacy/license review, domain translation, target-owned implementation, target-owned tests and an adoption receipt.

Do not copy the Inbox monolith, Gmail provider code, token stores, MIME model, mail identifiers or provider send routes into the legal domain.

## Ordered delivery gates

1. Complete immutable capture and independent review of every source and line item.
2. Capture and review the six companion forms.
3. Approve executable catalog and matter schemas.
4. Create a target-owned synthetic legal workbench shell.
5. Implement matter rail, work queue, document workspace and inspector.
6. Implement deterministic wizard, progress and next-safe-action engine.
7. Implement structured document blocks and paginated rendering.
8. Implement private evidence vault and evidence links.
9. Implement tasks, calendar and ongoing correspondence ingress.
10. Implement Ibal typed proposals and approval flow.
11. Implement immutable finalization and package generation.
12. Prove print and download egress.
13. Add electronic adapters only through verified, human-gated, receipt-backed contracts.

## Current implementation gate

Architecture is approved. Runtime implementation remains blocked by `SFL-SOURCE-REVIEW-002` until official companion artifacts are archived and every captured line item receives independent rendered-source review.
