# Matter Record Schema v1

Status: `conceptual schema, not executable`

## Purpose

Define the private record required to reuse facts across a legal workflow while preserving provenance, uncertainty, dispute state, and user approval.

## Top-level shape

```yaml
matter_id:
workflow_instances: []
people: []
relationships: []
children: []
proceedings: []
orders: []
events: []
facts: []
evidence_references: []
requested_relief: []
draft_blocks: []
forms: []
tasks: []
deadlines: []
service_events: []
package_exports: []
approvals: []
audit_events: []
```

## Fact record

```yaml
fact_id:
original_user_wording:
normalized_statement:
asserted_by:
event_date_or_range:
source_refs: []
confidence: confirmed | uncertain | disputed | contradicted | unknown
approval_state: unreviewed | approved | edited | rejected
privacy_class:
workflow_uses: []
created_at:
updated_at:
```

## Draft block record

```yaml
draft_block_id:
purpose:
source_fact_ids: []
source_rule_ids: []
original_user_text:
suggested_text:
editor_text:
generator_class: deterministic | ai_assisted | human
approval_state:
professional_review_state:
used_in_forms: []
```

## Evidence reference

The application should store metadata and a private object reference, not duplicate files unnecessarily.

```yaml
evidence_id:
label:
document_type:
private_object_ref:
source_party:
date:
relevance_notes:
verification_state:
redaction_state:
used_for_fact_ids: []
```

## Rules

- A person, event, or fact may be unknown.
- Disputed facts remain disputed.
- Editing a fact creates an audit event and revalidates dependent drafts.
- AI cannot promote a fact to confirmed.
- Court-issued records have a separate source class.
- No public repo fixture may contain realistic personal identifiers.
