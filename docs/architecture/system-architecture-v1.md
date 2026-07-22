# System Architecture v1

Status: `docs only, runtime not checked`

## Architectural rule

Deterministic workflow rules govern applicability, form dependencies, required tasks, deadlines, and safety gates. AI is an optional adapter that can help interpret language and draft text, but it does not own procedural truth.

## Proposed bounded contexts

| Context | Responsibility | Source of truth |
|---|---|---|
| Source Registry | Official kit identity, version, URLs, checksum, status | Verified source records |
| Workflow Engine | Eligibility, branches, forms, dependencies, deadlines | Versioned workflow definitions |
| Matter Workspace | People, events, facts, evidence references, tasks | User-approved private records |
| Narrative Workspace | Original wording, normalized facts, draft blocks | User approvals plus provenance |
| Form Mapper | Semantic fields to template fields | Approved field map and DocuForge template contract |
| Package Builder | Export manifest, document order, unresolved blockers | Reviewed workflow state |
| Egress Controller | Proposed recipients and transmission gates | Verified channel contract plus explicit approval |
| Assistant Adapter | Questions, explanations, drafting suggestions | Provider-independent capability contract |
| Audit Ledger | State changes, approvals, validation, receipts | Append-only event records |

## Core flow

```text
user intent
  -> deterministic eligibility questions
  -> user confirms candidate workflow
  -> workflow graph creates forms and tasks
  -> matter facts are collected and approved
  -> drafting suggestions remain editable
  -> consistency and completeness checks run
  -> form fields are mapped
  -> package review gate
  -> export only
  -> optional transmission proposal after a separate future gate
```

## Source of truth hierarchy

1. Verified official source and version record
2. Approved deterministic workflow definition
3. User-confirmed facts and uploaded evidence references
4. Human-approved draft text
5. Generated form and package artifacts
6. AI suggestions, which are never truth by themselves

## Event and ledger posture

Meaningful changes should be append-only events, including answer changed, fact approved, evidence linked, draft proposed, draft edited, source became stale, form generated, blocker opened, package approved, transmission proposed, and delivery receipt recorded.

## Failure behavior

The system must fail visibly. It must not generate a final-ready state when the source is stale, required facts are missing, a signature or oath remains outstanding, service has not occurred, a deadline calculation is uncertain, or a recipient channel is unverified.

## Integration boundaries

- DocuForge may supply blank template and semantic field-map contracts.
- A private legal workspace may store matter data later.
- xi-io.net may track repo-safe status, gates, and receipts.
- Email, court, AI, OCR, storage, identity, and payment providers remain adapters, not hidden product dependencies.
