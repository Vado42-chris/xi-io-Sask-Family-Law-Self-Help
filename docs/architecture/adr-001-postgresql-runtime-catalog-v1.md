# ADR-001: PostgreSQL Runtime Catalog with External Object Storage

Status: `OWNER-ACCEPTED ARCHITECTURE DIRECTION; no database configured; implementation remains gated`  
Decision token: `SFL_PRODUCT_ARCHITECTURE_LOCK_001_ACCEPTED`  
Date: `2026-07-22`

## Context

This product must manage:

- versioned legal-source snapshots,
- hundreds or thousands of normalized questions,
- deterministic applicability rules,
- matters and parties,
- answer and document revisions,
- evidence links,
- tasks and deadlines,
- correspondence,
- finalization approvals,
- submission packages,
- append-only ledger events and receipts,
- user and AI contributions with provenance.

The system also needs reliable search, transactions, concurrency control and strong matter-level isolation.

## Decision

Use PostgreSQL as the planned canonical runtime database for structured application state.

Store original forms, uploaded evidence, correspondence bytes, rendered documents and package files in encrypted private object storage or an encrypted private filesystem. Store only their metadata, hashes, preservation state and object references in PostgreSQL.

The immutable source artifacts plus reviewed form catalogs remain legal source truth. PostgreSQL is the application runtime projection and index, not a replacement for preserved source artifacts.

## Why PostgreSQL

PostgreSQL fits the product because it supports:

- relational constraints for stable identities and dependencies,
- transactions for multi-record revision and approval operations,
- JSONB for controlled variable rule payloads and provider-specific metadata,
- full-text search for forms, questions, correspondence and extracted text,
- row-level security for defence-in-depth matter isolation,
- mature backup, replication and migration tooling,
- append-only event and receipt tables,
- hosted and self-managed deployment profiles.

## Data modelling rule

Use relational columns and foreign keys for durable concepts. Use JSONB only where the shape is genuinely variable or versioned.

Prefer relational modelling for:

- source snapshots,
- forms and form versions,
- questions and options,
- matter forms,
- answer revisions,
- evidence objects and evidence links,
- tasks,
- submissions,
- approvals,
- receipts,
- ledger events.

Appropriate JSONB uses include:

- deterministic rule expressions,
- rendering hints,
- validation parameters,
- AI proposal payloads,
- provider response metadata after redaction,
- version-specific form layout mappings.

Do not put an entire matter into one mutable JSON document.

## Proposed bounded schemas

```text
catalog     public legal sources, forms, versions, questions, rules
matter      private matters, parties, contacts, form instances, answers
vault       evidence metadata, object references, preservation and redaction state
workflow    tasks, deadlines, gates, progression and next-safe-action state
document    document blocks, revisions, render manifests and finalizations
ingress     correspondence and imported-object metadata
egress      package manifests, approvals, delivery attempts and acceptance state
audit       append-only events, receipts, decisions, consent and access records
ai          sessions, bounded context receipts, proposals and accepted patches
```

These may be PostgreSQL schemas or logical namespaces in the first implementation.

## Core tables

Initial logical inventory:

```text
users
workspaces
workspace_members
matters
matter_parties
contacts

source_snapshots
source_artifacts
form_definitions
form_versions
form_sections
questions
question_options
question_rules
form_layout_bindings

matter_forms
answer_revisions
document_revisions
document_blocks
validation_results
finalization_events

stored_objects
evidence_objects
evidence_links
redaction_derivatives

work_items
tasks
task_dependencies
calendar_events
deadline_calculations

correspondence_items
correspondence_participants
correspondence_attachments
matter_match_proposals

submission_packages
package_items
recipient_directory_entries
approval_events
egress_attempts
acceptance_events

ledger_events
receipts
access_events
consent_events
ai_sessions
ai_proposals
ai_patch_events
```

## Revision policy

The following are append-only or versioned:

- source snapshots,
- form versions,
- answer revisions,
- document revisions,
- evidence originals,
- finalization events,
- approval events,
- delivery attempts,
- receipts,
- ledger events,
- AI proposals and accepted patches.

A current-state projection may point to the latest revision, but earlier revisions are never overwritten.

## Approval binding

A finalization approval binds to:

- matter ID,
- source snapshot IDs,
- form version IDs,
- exact document revision IDs,
- exact answer revision set or snapshot hash,
- attachment object versions and hashes,
- package order,
- recipients,
- delivery method,
- validation result.

Any bound value changing makes the approval stale.

## Search

Search requires two classes:

1. Public catalog search over form numbers, titles, sections, official wording and plain-language prompts.
2. Private matter search over user-entered answers, extracted correspondence text, tasks and evidence metadata.

Private search indexes must inherit matter authorization and must never expose snippets from another matter or user.

## Object storage boundary

Database rows reference immutable objects by stable object ID.

Required object metadata:

```text
object_id
workspace_id
matter_id
content_hash
size_bytes
media_type
original_filename
storage_uri
encryption_key_ref
preservation_state
malware_scan_state
extraction_state
created_at
supersedes_object_id
```

Raw object bytes do not belong in logs, receipts, analytics or public source catalogs.

## Security posture

- Application authorization is primary.
- PostgreSQL row-level security is defence in depth, not the only authorization layer.
- The runtime role used by ordinary requests must not own protected tables.
- Consider forced row-level security for sensitive tables after threat-model review.
- Use separate roles for migrations, application runtime, background processing and read-only support.
- All access to private objects uses short-lived, scoped authorization.
- Encryption key references are stored separately from encrypted object data.
- Support access requires explicit, auditable elevation.

## Local and hosted profiles

### Hosted profile

- managed or self-hosted PostgreSQL,
- encrypted object storage,
- server-side application API,
- tenant and matter isolation,
- encrypted backups and tested recovery.

### Local/private profile

- local PostgreSQL service or container,
- encrypted local object vault,
- loopback-only application runtime by default,
- optional encrypted export and migration path.

The project should avoid a separate SQLite-first data model unless an offline product requirement justifies and funds a tested synchronization layer. Two divergent database models would increase legal-data migration risk.

## Alternatives considered

### Store everything as JSON files

Rejected as the primary runtime model. Useful for immutable source snapshots and fixtures, but weak for concurrent revisions, authorization, search, joins, migrations and package integrity.

### SQLite first, PostgreSQL later

Deferred. Attractive for a single-user prototype, but creates a likely second schema and migration problem. It may be reconsidered for a true offline desktop profile with a shared repository abstraction and parity tests.

### Document database

Rejected as the primary store. The product has strongly relational identities, dependencies, approvals and evidence links. A document database would not remove the need for explicit versioning and constraints.

### Put attachments in PostgreSQL

Rejected as the default. Large private files are better handled by an encrypted object vault while PostgreSQL stores searchable metadata and integrity records.

## Consequences

Positive:

- one coherent structured backend,
- strong referential integrity,
- efficient matter and workflow queries,
- reliable revision and approval transactions,
- built-in full-text and JSONB capabilities,
- realistic path to multi-user hosting.

Costs:

- database migrations require discipline,
- local installation is heavier than a flat-file or SQLite prototype,
- row-level security and key management require expert review,
- object storage and backup must be designed as part of the system,
- PostgreSQL does not itself make the system secure.

## Approval and implementation gate

This architecture direction is owner-approved through `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`.

This ADR does not authorize database provisioning, credentials, migrations or private data ingestion.

Before implementation:

1. complete source catalog review,
2. approve threat model and retention policy,
3. make schemas executable,
4. create synthetic fixtures,
5. review row-level security design,
6. prove backup, restore and deletion behaviour,
7. write migration and rollback receipts.
