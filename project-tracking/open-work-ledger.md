# Open Work Ledger

Status: append-only

| Work ID | Gate | Work | State | Risk | Evidence required | Next action |
|---|---|---|---|---|---|---|
| SFL-WORK-001 | SFL-BOOTSTRAP-001 | Framework-aligned repository bootstrap | ready_for_review | metadata_config, legal_sensitive | PR, foundation check, human review | Review bootstrap PR |
| SFL-WORK-002 | SFL-SOURCE-001 | Verify official Kit #3J source, version, URLs, and checksum | planned | legal_sensitive | official retrieval receipt | Retrieve and compare official source |
| SFL-WORK-003 | SFL-SCHEMA-001 | Convert conceptual workflow and matter schemas into executable schemas | blocked | data_model | validators and synthetic fixtures | Wait for source gate |
| SFL-WORK-004 | SFL-TRIAGE-001 | Implement human-only eligibility triage | blocked | ui_component, legal_sensitive | deterministic tests and UX review | Wait for schema gate |
| SFL-WORK-005 | SFL-TASKPLAN-001 | Implement deterministic forms and homework plan | blocked | engine_runtime, legal_sensitive | dependency and deadline tests | Wait for triage gate |
| SFL-WORK-006 | SFL-PRIVATE-001 | Design private matter workspace | blocked | secrets_auth, legal_sensitive | threat model, retention, deletion, recovery evidence | Separate architecture pass |
| SFL-WORK-007 | SFL-AI-001 | Design optional AI adapter and consent contract | blocked | secrets_auth, legal_sensitive | provider, privacy, fallback, grounding tests | Wait for private workspace |
| SFL-WORK-008 | SFL-TRANSMIT-001 | Verify and design filing, service, and email adapters | blocked | deployment_live, legal_sensitive | receiving-process and delivery receipts | Do not implement yet |
| SFL-WORK-009 | SFL-SOURCE-CAPTURE-001 | Capture dated Kit #3J source identity and all line items from forms physically included in the supplied kit | completed_reported_only | legal_sensitive, data_model | source registry, hash receipt, six catalogs, structural validation | Run CI and obtain human review |
| SFL-WORK-010 | SFL-SOURCE-REVIEW-002 | Independently compare 267 captured line items against rendered pages | blocked | legal_sensitive, data_model | two-pass review findings and disposition receipt | Begin after source-capture PR validation |
| SFL-WORK-011 | SFL-SOURCE-REVIEW-002 | Archive the exact supplied Kit #3J binary and verify SHA-256 | blocked | provenance, legal_sensitive | committed binary and matching hash receipt | Perform local-git binary archive pass |
| SFL-WORK-012 | SFL-SOURCE-REVIEW-002 | Capture official companion forms FAM-PD #7-1, #7-3, #7-4, Form 15-8A, Form 15-47, and Form 15-49 | blocked | legal_sensitive, data_model | official source snapshots and line-item catalogs | Retrieve from official sources and review scope |
| SFL-WORK-013 | SFL-SOURCE-REVIEW-002 | Resolve source discrepancies for Form 12-3 naming and email-service proof requirements | blocked | legal_sensitive | official procedural source or qualified review | Preserve both statements until resolved |
| SFL-WORK-014 | SFL-SOURCE-REVIEW-002 | Approve user-facing source date, capture date, verification date, and stale-warning behavior | ready_for_review | ui_component, legal_sensitive | UX review and source standard approval | Review required disclosure language |

## Supersession note, 2026-07-22

`SFL-WORK-002` is superseded in scope by `SFL-WORK-009` through `SFL-WORK-014`. The original row remains preserved because this ledger is append-only.

## Rule

Entries are never deleted. Add a dated correction or superseding entry when state changes.
