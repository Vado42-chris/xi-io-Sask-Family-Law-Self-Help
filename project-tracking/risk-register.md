# Risk Register

Status: append-only

| Risk ID | Risk | Severity | Current control | Residual state | Next mitigation |
|---|---|---|---|---|---|
| SFL-RISK-001 | Product gives or appears to give legal advice | critical | Legal-information boundary, labels, deterministic rules | open | Legal expert review and UX testing |
| SFL-RISK-002 | Stale court kit produces wrong workflow | critical | Versioned source record and stale gate | open | Official source verification and change monitor |
| SFL-RISK-003 | Private case data enters public repo or logs | critical | AGENTS rules, gitignore, foundation secret scan | open | Private workspace, DLP tests, contributor training |
| SFL-RISK-004 | AI invents facts or legal grounds | critical | AI optional, proposal-only, provenance required | open | Grounding tests and consent contract |
| SFL-RISK-005 | User believes document was filed or served | critical | Transmission forbidden, receipt vocabulary | open | Verified adapter contracts and explicit status UI |
| SFL-RISK-006 | Unsafe service in violence context | critical | Escalation trigger and no inferred authorization | open | Specialist review and protected workflow |
| SFL-RISK-007 | Deadline calculated incorrectly | high | Source anchors and uncertainty blocker | open | Calendar rule engine and legal review |
| SFL-RISK-008 | Accessibility failure excludes stressed or disabled users | high | WCAG and cognitive-load contract | open | Lived-experience and assistive-tech QA |
| SFL-RISK-009 | DocuForge and private workspace responsibilities blur | high | Bounded-context decision | open | Cross-repo handoff contracts |
| SFL-RISK-010 | Public repo visibility mistaken for open-source license | medium | README license notice | open | Owner selects explicit license |
| SFL-RISK-011 | One or more form questions, choices, signatures, or attachment requirements are omitted from the normalized catalog | critical | Six per-form line-item catalogs, stable IDs, count validator | open | Independent rendered-page review of all 267 line items |
| SFL-RISK-012 | Supplied source cannot be reproduced from repository evidence because the exact binary is not archived | high | SHA-256, size, filename, capture receipt, explicit blocker | open | Commit exact binary in local-git pass and re-verify hash |
| SFL-RISK-013 | Structurally passing catalog is mistaken for legal approval | critical | Status language, separate review gate, validator warning | open | Human review receipt and UI distinction between checked and approved |
| SFL-RISK-014 | Companion form required by a user's branch is missing from the canonical snapshot | critical | Explicit missing-form registry and completion blocker | open | Capture FAM-PD #7-1, #7-3, #7-4, Forms 15-8A, 15-47, and 15-49 |
| SFL-RISK-015 | Later source silently replaces prior form meaning or changes an active matter | critical | Immutable snapshot and supersession doctrine | open | Implement source diff, matter snapshot binding, and migration warnings |
| SFL-RISK-016 | User does not notice that the source is old or not officially verified | critical | Required date and freshness disclosure standard | open | UX acceptance tests on every workflow, preview, and package surface |
| SFL-RISK-017 | Source typo or conflict is silently normalized into an incorrect runtime rule | critical | Discrepancy registry preserving original statements | open | Resolve Form 12-3 naming and email-service proof discrepancies before affected runtime branch |
| SFL-RISK-018 | Freshness scraper automatically changes legal workflow without review | critical | Future monitor defined as proposal-only, immutable candidate capture required | open | Approval-gated source-diff and migration workflow before scraper implementation |
| SFL-RISK-019 | Family-law product becomes coupled to active Inbox development and inherits unrelated regressions | high | Read-only donor decision, pinned source map, no runtime dependency | open | Target-owned components, adoption receipts and target regression tests |
| SFL-RISK-020 | Whole Inbox UI is copied before its monolith is decomposed, creating an expensive second monolith | high | Source map rejects wholesale copy and requires selective adoption | open | Implement shell in small target-owned modules |
| SFL-RISK-021 | Rich editor HTML or rendered PDF is treated as canonical form truth | critical | Stable question IDs and structured document-block invariant | open | Field-binding tests, revision snapshots and render-to-source comparisons |
| SFL-RISK-022 | User believes one final email completes every procedural obligation in the matter | critical | One-package-per-egress-event decision | open | Stage-specific package timeline and separate filing/service/acceptance states |
| SFL-RISK-023 | Incoming correspondence silently alters a previously finalized package | critical | Immutable package and ingress-event separation | open | Append-only ingress, revision creation and stale-approval invalidation |
| SFL-RISK-024 | PostgreSQL row-level security is treated as the complete authorization system | critical | ADR identifies application authorization as primary and RLS as defence in depth | open | Threat-model review, non-owner runtime roles, forced-RLS assessment and isolation tests |
| SFL-RISK-025 | Sensitive attachments are stored directly in public assets, logs or receipts | critical | Object-vault boundary and hash-only receipt model | open | Private object storage, short-lived access, DLP and malware/type tests |
| SFL-RISK-026 | Progress UI pressures or shames users under legal stress | medium | Calm motivation and resumable-session requirements | open | Lived-experience testing and non-punitive overdue language |