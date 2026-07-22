# Inbox Pattern Adoption and Legal Workbench Architecture v1

Status: `OWNER-APPROVED LOCKED DIRECTION; no Inbox mutation; runtime implementation gated`  
Decision token: `SFL_PRODUCT_ARCHITECTURE_LOCK_001_ACCEPTED`  
Date: `2026-07-22`  
Target project: `sask_family_law_self_help`  
Read-only donor: `Vado42-chris/xi-io-Inbox@500f1ae5b6dade15bf113b696cea9dfd93ab1cc6`

## Decision summary

The xi-io Inbox product is a strong interaction and control-plane donor for this application, but it must not be forked wholesale or coupled at runtime.

Adopt its proven patterns and selected source slices into this repository through a source-mapped, reviewable process. Do not modify the Inbox repository. Do not import its Gmail-specific domain model as the legal domain model.

The legal product uses the interaction grammar:

```text
matter scope -> work queue -> selected artifact -> contextual inspector / Ibal
```

The domain translation is:

```text
email account        -> legal matter / workspace
mailbox or folder    -> workflow stage / work view
message or thread    -> form, task, evidence item, correspondence, or submission event
reader               -> paginated document workspace
compose draft        -> editable form/document revision
approval             -> user sign-off bound to exact revision and attachments
outbox                -> submission package queue
send receipt          -> filing/service/export receipt
Ibal selected context -> selected matter + form + section + field + evidence + source snapshot
```

## Product invariant

The interface may look and behave like the mature Inbox workbench, but the normalized form catalog and verified matter facts remain the source of truth.

The rich editor, page preview, generated PDF and outgoing email are projections or egress artifacts. They are not the canonical record.

## Why this is viable

Inbox already establishes the patterns needed for:

- persistent product shell and trust state,
- scope selection,
- dense selectable work lists,
- a primary reading/work surface,
- contextual inspection,
- search and command entry,
- Ibal as a persistent concierge rather than a separate lane,
- local-first provider routing,
- attachment and private-data boundaries,
- draft, approval, outbox and receipt concepts,
- calendar, tasks, activity and integration destinations,
- fail-closed capability gates,
- account or workspace isolation.

These are transferable product patterns. The Gmail adapter, MIME model, mail provider authorization, thread semantics and provider-specific send implementation are not transferable legal-domain truth.

## Reuse strategy

### Reuse by source-mapped adaptation

Candidates:

- shell geometry and responsive behaviour,
- global header and trust cluster,
- scope rail,
- selectable list and row anatomy,
- list/reader resizing,
- reader header control cluster,
- contextual right inspector,
- search/command band,
- Ibal drawer and selected-context request model,
- loading, blocked, error and empty states,
- receipt rows and activity views,
- task and calendar destination patterns,
- human-gated approval and outbox state machines,
- local runtime/private-store separation,
- provider locality and cloud-consent rules,
- accessibility and geometry regression checks.

Each adopted pattern requires:

1. donor commit and source path,
2. domain translation,
3. privacy and license review,
4. target-owned implementation,
5. target-owned tests,
6. adoption receipt.

### Adapt, do not copy literally

- `accountId` becomes `matterId` or `workspaceId` for matter scope.
- mail rows become typed work items.
- thread timeline becomes matter chronology and correspondence.
- mail draft becomes document revision.
- send approval becomes finalization approval.
- outbox becomes submission package queue.
- mail receipt becomes export, filing, service or delivery receipt.
- Inbox search becomes matter-scoped universal search.

### Do not reuse

- Gmail or Microsoft OAuth and provider code,
- Gmail token stores,
- provider thread and message identifiers as legal object identifiers,
- MIME parsing as the form data model,
- raw HTML email rendering as the form editor,
- the Inbox monolithic preview renderer as a new foundation,
- provider send routes as a generic court-filing route,
- any assumption that a sent email proves filing or service.

## Workspace information architecture

### Persistent top bar

Use for:

- product identity,
- active matter and court file number,
- jurisdiction and Judicial Centre,
- source freshness state,
- private/local/cloud AI posture,
- global search and command entry,
- Ibal trigger,
- current save/sync state.

The top bar must make stale legal sources and unsafe egress states visible without turning the interface into a permanent warning page.

### Narrow scope rail

Translate the Inbox account rail into the matter rail.

Primary entries:

- Home,
- My matters,
- Calendar,
- Tasks,
- Activity and receipts,
- Contacts,
- Integrations,
- Settings.

Matter entries show:

- matter title,
- court file number,
- party initials or safe display label,
- current procedural stage,
- next deadline,
- blocked/attention count.

### Work queue column

This is the Inbox-list equivalent. It is not limited to forms.

Views:

- Required forms,
- Evidence homework,
- Needs review,
- Ready to finalize,
- Awaiting signature or commissioning,
- Ready to serve or file,
- Submitted,
- Court correspondence,
- Follow-up tasks,
- Archived or superseded.

Rows may represent:

- a form,
- a form section,
- an evidence request,
- an uploaded evidence object,
- a task,
- an incoming court document,
- a submission package,
- a receipt.

Every row needs stable type, state, source, due date, completion state, blocker count and selected-object behaviour.

### Main document workspace

The Inbox reader becomes a legal document workspace with four synchronized modes:

1. `Guided questions`
2. `Section review`
3. `Paginated form preview`
4. `Final package preview`

The document workspace must support:

- standard page dimensions and page breaks,
- official headers, footers and court styling,
- structured field bindings,
- repeatable rows and schedules,
- inline text editing where legally appropriate,
- source-text and plain-language prompt views,
- comments and unresolved questions,
- evidence links,
- revision compare,
- user/AI authorship markers,
- stale-source warnings,
- print and export preview.

A rich text editor may render narrative sections, but arbitrary editor HTML must never be the only stored representation. Each edit must resolve to structured fields, structured paragraphs or a controlled document block.

### Form control header

The visual email-header pattern is suitable as a form control header, not as the form itself.

Show:

- official form number and title,
- source version and source date,
- capture and verification dates,
- applicable workflow stage,
- completion percentage,
- question count and unresolved count,
- signature/commissioning state,
- attachment count,
- due date,
- validation state,
- current revision,
- finalization status.

Primary controls:

- Continue wizard,
- Review section,
- Ask Ibal,
- Validate,
- Compare revisions,
- Preview pages,
- Finalize draft.

### Contextual inspector

The right inspector answers questions about the selected item rather than repeating the document.

Panels:

- Why this question is required,
- Official source wording,
- Plain-language explanation,
- Applicability rule,
- Validation and blockers,
- Linked facts,
- Linked evidence,
- Revision history,
- AI proposals,
- user approvals,
- receipts.

### Ibal concierge

Ibal remains a persistent drawer or panel available from every route.

Selected context packet:

```text
matter -> workflow -> form -> section -> question/block -> linked facts -> linked evidence -> source snapshot -> current revision -> capability gates
```

Ibal may:

- explain a form question,
- ask bounded follow-up questions,
- draft an answer from user-approved facts,
- summarize or classify an uploaded record,
- identify missing support,
- compare an answer with linked evidence,
- identify inconsistencies across forms,
- propose edits to one field, section or document block,
- suggest the next safe task,
- prepare cover correspondence,
- prepare a local submission package draft.

Ibal must not:

- change a stored answer silently,
- invent facts or procedural requirements,
- mark a form complete,
- approve a revision,
- sign or commission a document,
- decide that evidence is court-ready,
- send, serve or file without a separate human gate.

Every proposed edit is a typed patch with before/after text, affected stable IDs, supporting facts/evidence, limitations and a proposed receipt. The user accepts or rejects it.

## Wizard model

The wizard is deterministic and driven by the reviewed question graph.

Flow:

```text
not started -> eligibility -> applicable forms -> question graph -> evidence homework -> section review -> validation -> finalization
```

Requirements:

- resume at the exact unanswered or unresolved question,
- save after every answer,
- preserve answer history,
- show why the question is being asked,
- branch only from explicit deterministic rules,
- permit `I do not know` and `needs help` states,
- generate tasks for missing information,
- calculate progress from currently applicable questions,
- never hide newly applicable questions after an earlier answer changes.

## Progress and motivation

Progress is a hard product requirement, not a decorative percentage.

Every matter shows:

- current stage,
- applicable forms,
- completed and remaining questions,
- missing evidence,
- blockers,
- due dates,
- next three safe actions,
- last progress event,
- estimated work blocks rather than false completion times.

Motivation patterns:

- small resumable work sessions,
- milestone receipts,
- calm reminders,
- visible completed work,
- no loss of progress,
- clear dependency explanations,
- one recommended next action,
- optional calendar blocks,
- overdue language that informs rather than shames.

## Task and calendar model

Tasks are generated from deterministic dependencies and explicit user choices.

Examples:

- answer a missing question,
- obtain a bank statement,
- upload a tax document,
- confirm an address for service,
- review AI-proposed wording,
- sign before a witness,
- arrange commissioning,
- serve a package,
- file a package,
- record court acceptance,
- complete a later Appearance Memo.

Task states:

```text
planned -> ready -> in_progress -> needs_review -> completed
              \-> blocked
              \-> superseded
```

Calendar events link to source rules and matter tasks. A calculated date must expose its source rule, inputs, time zone, confidence and user confirmation state.

## Correspondence and ongoing ingress

One matter may have many inbound and outbound events. The interface should preserve an Inbox-like correspondence view, but correspondence must not be conflated with form state.

Ingress sources may include:

- user upload,
- email account import,
- forwarded `.eml`,
- downloaded court notice,
- scanned paper correspondence,
- service acknowledgment,
- lawyer or mediator correspondence,
- portal receipt.

Ingress pipeline:

```text
preserve original -> hash -> malware/type check -> deterministic metadata -> proposed matter match -> human confirm -> text extraction -> proposed classification -> review queue
```

Uncertain matter matches go to quarantine or `needs-human-decision`; they are never silently attached to a legal matter.

## Submission model

The product supports one finalized package per egress event, not one irreversible submission for the entire matter.

A JCC matter can require separate events for:

- initial service,
- initial court filing,
- service of the court-issued Notice and endorsement,
- filing proof of service,
- Appearance Memo filing/service,
- later chambers materials.

Each package binds:

- matter,
- source snapshots,
- exact document revisions,
- exact attachment versions and hashes,
- inclusion order,
- recipient and role,
- delivery method,
- validation result,
- user approval event,
- delivery attempt and acceptance result.

Any change after approval invalidates the approval and returns the package to review.

## Storage boundary

Use PostgreSQL for structured runtime state and encrypted object storage or an encrypted private filesystem for source files, evidence, generated documents and correspondence bytes.

Do not store large evidence objects as ordinary database rows unless a reviewed deployment profile requires it.

PostgreSQL owns:

- identity and access records,
- matters and parties,
- source and form metadata,
- question definitions and rules,
- answer revisions,
- document revisions,
- evidence metadata and links,
- tasks and calendar records,
- correspondence metadata,
- package manifests,
- approvals,
- receipts and ledger events,
- AI proposals and consent events.

Object storage owns immutable bytes. Each object record stores content hash, size, media type, encryption key reference, preservation state and object URI.

## Security model

Required controls:

- strict separation between public form catalogs and private matter data,
- encryption in transit and at rest,
- per-user and per-matter authorization,
- row-level tenant/matter isolation plus application authorization,
- private object storage with short-lived access URLs,
- content-addressed immutable originals,
- malware and file-type inspection,
- active-content handling and preview sandboxing,
- metadata and redaction warnings,
- local-first AI routing,
- per-request consent before sensitive context reaches a remote model,
- append-only ledger events,
- receipt hashes without raw private bodies,
- backup, recovery, retention and deletion receipts,
- break-glass and support-access auditing.

## Reuse cost assessment

### High-value, lower-cost

- shell layout,
- interaction grammar,
- search and selection patterns,
- reader/inspector split,
- Ibal drawer model,
- task, calendar and activity destinations,
- status and trust components,
- draft/approval/outbox/receipt state concepts,
- local-first AI and provider privacy rules,
- regression test patterns.

### Medium-cost adaptation

- list rows and filters,
- rich editor controls,
- attachment manager,
- activity timeline,
- correspondence ingestion,
- shared scope lens,
- responsive mobile transformations.

### High-cost, domain-specific

- normalized question graph,
- form rendering and pagination,
- conditional schedules and repeatable financial tables,
- evidence-to-question linkage,
- legal validation,
- signature/commissioning workflow,
- package generation,
- court/service recipient directory,
- filing/service adapters.

The correct CBA is to reuse the shell and control-plane patterns while building the legal document engine as a new bounded context.

## Implementation sequence

1. Complete and independently review all source and question catalogs.
2. Create the Inbox pattern source map and adoption receipts.
3. Approve the legal domain and PostgreSQL logical schema.
4. Build a synthetic-data shell using the target repo only.
5. Implement matter rail, work queue, reader/editor and inspector geometry.
6. Implement deterministic wizard and progress engine.
7. Implement structured document blocks and paginated preview.
8. Implement private evidence vault and evidence links.
9. Implement tasks, calendar and next-safe-action engine.
10. Implement Ibal selected-context proposals and patch approval.
11. Implement immutable finalization and package generation.
12. Implement ongoing correspondence ingress.
13. Implement print/download egress.
14. Add electronic filing, service or email adapters only after official receiving rules and delivery receipts are independently verified.

## Approval and implementation gate

The architecture direction is owner-approved through `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`.

Runtime implementation remains blocked by `SFL-SOURCE-REVIEW-002`. The source gate must archive the official artifacts, capture the companion forms and independently verify every line item before executable legal schemas or form rendering begin.
