# Do-Not-Touch Register — sam_law recovery

Status: `ACTIVE WHILE PR #6 IS OPEN`  
Detailed mutation scope remains owned by `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`.

This register exists to prevent another chat/agent/local session from treating an active recovery branch as free work merely because a useful downstream task is known.

| Path / surface | Reason | Owner / active lane | Expires when | Safe alternative |
|---|---|---|---|---|
| Runtime app/UI implementation | Outside recovery closeout scope | future admitted ChangeUnit | PR #6 merged + verified main + applicable product gate | read-only design/review only |
| `feat/synthetic-legal-workbench-001` / PR #5 | Frozen donor; wholesale merge prohibited | donor custody only | never by recency; harvest only through later admitted slices | classify in PR #5 salvage map |
| `xi/` legacy contracts | Historical portable inputs; migration not yet admitted | framework-recovery lane preserves only | accepted namespace prerequisite + reviewed migration lane | inspect/hash/plan only |
| new `xiio/` managed-project files | Framework namespace/read-order prerequisite unresolved | framework owner / future adoption lane | prerequisite accepted + SFL migration admitted | maintain migration plan only |
| `sources/intake/**` promotion | Intake/currentness review incomplete | future source-family review lanes | exact family review + approval | preserve metadata/blockers only |
| `sources/source-registry.json` broad replacement | Multi-kit semantics not yet accepted | future `SFL-MULTI-KIT-SOURCE-001` | Q1 admitted and validated | read-only analyze/design |
| private matter data/workspace | Public repository; private gate not qualified | future `SFL-PRIVATE-001` | separate security/privacy qualification | synthetic/public-safe fixtures only |
| AI/provider/email runtime | Outside recovery and trust/admission not qualified | future AI/provider lanes | applicable source/private/provider gates | public-safe contract/conformance planning only |
| court filing/service/transmission | High-consequence capability not implemented/qualified | future `SFL-TRANSMIT-001` | independent process/authority verification | package/export planning only |
| canonical xi-io framework primitive registry | Framework-owned, not SFL-owned | `xi-io.net` owners | canonical framework promotion/adoption | preserve SFL donor/source evidence only |
| branch deletion / broad branch cleanup | Recovery evidence must close first | future cleanup lane | PR #6 merge + main verification + branch disposition recheck | read-only branch inventory |

## Concurrent-work rule

If another worker believes it owns overlapping files or a local checkout contains uncommitted changes, stop before write/rebase/merge/cleanup and reconcile custody through `docs/ops/ACTIVE_WORK_CHECKPOINT.md` plus the current execution plan.

Missing or stale handoff evidence is `UNKNOWN/BLOCKED`, not permission.
