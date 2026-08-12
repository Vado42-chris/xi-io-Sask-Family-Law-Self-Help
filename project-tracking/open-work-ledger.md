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
| SFL-WORK-024 | SFL-UX-SHELL-001 | Prepare target-owned synthetic workbench shell plan without implementing legal runtime | queued_after_source_gate | ui_component, cross_repo_adoption | source-map receipts, route model, synthetic fixtures, geometry/a11y checks | Begin only when source recovery closes |
| SFL-WORK-025 | SFL-FRAMEWORK-RECOVERY-001 | Rehydrate the existing repository against current xi-io.net framework direction | active | metadata_config, cross_repo_adoption | recovery startup record, framework baseline, migration map, validation receipt | Complete bounded framework recovery before PR #5 salvage |
| SFL-WORK-026 | SFL-KIT-4A-SOURCE-RECOVERY-001 | Preserve and verify the supplied Kit #4a source artifact identity | active | provenance, legal_sensitive | exact binary archive, SHA-256, source metadata, current official comparison | Archive exact bytes through binary-capable Git path and compare current official source |
| SFL-WORK-027 | SFL-KIT-4A-SOURCE-RECOVERY-001 | Capture every Kit #4a included form, all Form 15-47 schedules, and the 42-row situation matrix | active_partial | legal_sensitive, data_model | four complete line-item catalogs, schedule catalogs, matrix review receipt | Independently review the captured matrix, then catalog all remaining form/schedule fields |
| SFL-WORK-028 | SFL-KIT-4A-SOURCE-RECOVERY-001 | Capture Kit #4a applicability, prerequisites, service, filing, hearing and post-hearing process as source-bound rules | active | legal_sensitive, engine_runtime | reviewed workflow graph, deadline rules, alternative-path rules, discrepancy dispositions | Build workflow catalog without inferring unresolved rules |
| SFL-WORK-029 | SFL-MULTI-KIT-SOURCE-001 | Replace the single-global-snapshot assumption with independently versioned source-family semantics | planned | data_model, provenance | registry design, migration plan, validators, no-silent-current test | Design before promoting recovery intakes to canonical snapshots |
| SFL-WORK-030 | SFL-KIT-4A-SOURCE-RECOVERY-001 | Compare Kit #4a Form 15-8B and Form 12-3 with the Kit #3J instances before reuse | blocked_on_comparison | legal_sensitive, provenance | text/hash/rendered diff and explicit equivalence or divergence record | Do not deduplicate by form number alone |
| SFL-WORK-031 | SFL-KIT-4A-SOURCE-RECOVERY-001 | Resolve Kit #4a source conflicts, including Form 12-3/12-13 and 7-day/3-day filing guidance | blocked | legal_sensitive | current authoritative source comparison and human disposition receipt | Keep affected runtime branches blocked |
| SFL-WORK-032 | SFL-MAILBOX-SOURCE-DISCOVERY-001 | Inventory direct government-sender legal source attachments in owner-connected mailbox without copying private case correspondence | completed_reported_only | provenance, privacy | mailbox discovery receipt and artifact-level source list | Re-run only when new source attachments arrive or provenance needs refresh |
| SFL-WORK-033 | SFL-KIT-2A-SOURCE-RECOVERY-001 | Preserve Kit #2a source identity and direct-mailbox provenance | active | provenance, legal_sensitive | exact binary archive, hash, current official comparison | Archive exact bytes and compare with current official source |
| SFL-WORK-034 | SFL-KIT-2A-SOURCE-RECOVERY-001 | Capture all nine Kit #2a included forms and the Answer/Counter-Petition form-selection and procedure graph | active_partial | legal_sensitive, data_model, engine_runtime | complete form catalogs, deterministic workflow rules, rendered-source review | Continue form-by-form capture and process mapping without inferring stale rules |
| SFL-WORK-035 | SFL-KIT-2A-SOURCE-RECOVERY-001 | Compare repeated Form 15-47, Form 15-8B, Form 12-3 and related forms across Kit #2a, Kit #4a and Kit #3J | blocked_on_comparison | provenance, legal_sensitive | byte/text/rendered comparisons and reviewed relationship records | No cross-kit deduplication until equivalence is proven |
| SFL-WORK-036 | SFL-FORM-15-52-SOURCE-RECOVERY-001 | Capture and verify standalone Form 15-52 Notice to Disclose plus supplied Rule 15-52 | active_partial | legal_sensitive, provenance | current official rule/form comparison, complete line-item catalog, source approval | Keep supplied 30-day and disclosure rules blocked until current comparison |
| SFL-WORK-037 | SFL-PROCEDURAL-REFERENCE-001 | Decide governance/freshness model for dated Judicial Family Centre schedule posters | queued | legal_sensitive, source_freshness | source-class policy and freshness tests | Do not ingest dated poster as current schedule truth yet |

## Supersession notes, 2026-07-22

- `SFL-WORK-002` is superseded in scope by `SFL-WORK-009` through `SFL-WORK-014`.
- `SFL-WORK-015` and `SFL-WORK-016` are completed through `SFL-WORK-022` and `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`.
- Architecture approval does not unblock runtime. `SFL-WORK-023` became the source implementation gate at that checkpoint.

## Recovery correction, 2026-08-12

- `SFL-WORK-023` remains necessary for Kit #3J, but is no longer sufficient to represent complete product source readiness.
- Kit #4a revealed a second independently versioned workflow source with four included forms, seven Financial Statement schedules, a 42-row schedule-selection matrix, and procedural instructions that were not represented in the repository.
- A direct-sender mailbox inventory then recovered Kit #2a as a third full self-help kit source family, plus standalone Form 15-52 with supplied Rule 15-52 and a dated procedural schedule poster.
- Kit #2a physically includes nine form instances and contains deterministic Answer versus Counter-Petition selection logic, financial/property disclosure branches, service/proof alternatives, timing, dispute-resolution and post-filing process.
- `SFL-WORK-025` through `SFL-WORK-037` now make framework recovery, multi-kit modeling, mailbox provenance, Kit #2a, Kit #4a, standalone Form 15-52, cross-snapshot comparisons and dated reference governance explicit.
- All artifacts under `sources/intake/` remain unreviewed intake evidence, not approved runtime truth.
- Runtime schema, triage, task-plan, form-generation and transmission work remain blocked until applicable source gates are explicit, currentness-reviewed and approved.

The original rows remain preserved because this ledger is append-only.

## Rule

Entries are never deleted. Add a dated correction or superseding entry when state changes.
