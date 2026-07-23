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
| SFL-WORK-015 | SFL-ARCH-001 | Review the Inbox pattern adoption and legal workbench architecture | ready_for_review | ui_component, cross_repo_adoption, legal_sensitive | source map, architecture review, owner decision | Review stacked architecture PR |
| SFL-WORK-016 | SFL-ARCH-001 | Review PostgreSQL plus encrypted object-vault ADR | ready_for_review | data_model, secrets_auth, legal_sensitive | architecture, security and operations review | Approve, revise or reject ADR-001 |
| SFL-WORK-017 | SFL-UI-SOURCE-MAP-001 | Inspect exact Inbox components and create adoption receipts before code reuse | planned | cross_repo_adoption, ui_component | donor commit, paths, license/privacy review, target tests | Start only after architecture approval |
| SFL-WORK-018 | SFL-UX-SHELL-001 | Build target-owned synthetic legal workbench shell | blocked | ui_component | route, geometry, accessibility and owner visual proof | Wait for source and architecture gates |
| SFL-WORK-019 | SFL-WIZARD-001 | Build deterministic resumable question wizard and progress engine | blocked | engine_runtime, legal_sensitive | reviewed question catalogs and synthetic decision tests | Wait for source and schema gates |
| SFL-WORK-020 | SFL-EDITOR-001 | Build structured document block model and paginated editor/preview | blocked | engine_runtime, legal_sensitive | field bindings, revision tests, render comparison | Wait for source/schema and shell gates |
| SFL-WORK-021 | SFL-INGRESS-EGRESS-ARCH-001 | Define ongoing correspondence ingress and one-package-per-egress-event contracts | planned | legal_sensitive, deployment_live | preservation, matching, approval, recipient and receipt schemas | Architecture pass after source review |
| SFL-WORK-022 | SFL-ARCH-001 | Lock canonical product vision, legal workbench architecture and PostgreSQL/object-vault direction | completed_owner_approved | legal_sensitive, cross_repo_adoption, data_model | owner approval receipt, canonical vision, architecture docs, CI | Merge stacked architecture after checks and review fixes |
| SFL-WORK-023 | SFL-SOURCE-REVIEW-002 | Execute the canonical source-completion gate as the next active product work | active | legal_sensitive, provenance, data_model | exact binaries, hashes, line-item catalogs, two-pass review, source approval receipt | Capture companion artifacts and independently verify every question |
| SFL-WORK-024 | SFL-UX-SHELL-001 | Prepare target-owned synthetic workbench shell plan without implementing legal runtime | queued_after_source_gate | ui_component, cross_repo_adoption | source-map receipts, route model, synthetic fixtures, geometry/a11y checks | Begin only when SFL-SOURCE-REVIEW-002 closes |
| SFL-WORK-025 | SFL-COURT-FAITHFUL-LITMUS-001 | Case-relevant official-blank fill litmus (#7-5 → 10-3 → #7-2 → service forms) | active | legal_sensitive, provenance | archived blanks, fill maps, private draft PDFs, overflow/unknown receipts | Close Appearance Memo unknowns from July 16 Notice; then service-form blanks |
| SFL-WORK-026 | SFL-SOURCE-REVIEW-002 | Source-review workbook generator for all 267 line items | completed_reported_only | legal_sensitive, data_model | workbook script, 001E receipt, check wiring | Independent rendered-page review still required |
| SFL-WORK-027 | SFL-SOURCE-REVIEW-002 | Deterministic disposition validator blocking invalid verified claims | active | legal_sensitive, data_model | fixture audit, completed-validator receipt, check wiring | Begin independent page review into workbook entries |
| SFL-WORK-028 | SFL-INTERACTION-ARCHITECTURE-001I | Layered interaction architecture + capability surfaces + #7-5 proof seed | ready_for_review | ui_component, data_model, legal_sensitive | ADR-002, schemas, registries, `/app` unlock, integrity checks | Peer review; keep court readiness blocked |
| SFL-WORK-029 | SFL-TRACK-A-PRIVATE-LITMUS-001J | Private litmus for #7-5 / 10-3 / #7-2 with human PDF compare | active | legal_sensitive, provenance | fill maps, private drafts, owner review checklist | Close Appearance Memo unknowns; human final review |

## Supersession notes, 2026-07-22

- `SFL-WORK-002` is superseded in scope by `SFL-WORK-009` through `SFL-WORK-014`.
- `SFL-WORK-015` and `SFL-WORK-016` are completed through `SFL-WORK-022` and `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`.
- Architecture approval does not unblock runtime. `SFL-WORK-023` is the active implementation gate.

The original rows remain preserved because this ledger is append-only.

## Rule

Entries are never deleted. Add a dated correction or superseding entry when state changes.
