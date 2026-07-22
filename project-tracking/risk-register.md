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
