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

## Rule

Entries are never deleted. Add a dated correction or superseding entry when state changes.
