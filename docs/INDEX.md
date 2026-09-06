# Documentation Index v1

Status: `ACTIVE CURRENT-SITUATION SELF-HOST INDEX`  
Project: `sask_family_law_self_help`  
Current ChangeUnit: `SFL-CURRENT-SITUATION-001`  
Current PR: `#9`  
Current branch: `feat/current-situation-selfhost-001`

## Start here

Read these in order for current repository work:

| Order | Purpose | Path | State |
|---|---|---|---|
| 1 | Stable present-tense execution/custody authority | `docs/ops/CURRENT_EXECUTION_PLAN.md` | current tracked plan; live exact-head evidence still required |
| 2 | Fail-closed active-work checkpoint | `docs/ops/ACTIVE_WORK_CHECKPOINT.md` | current durable projection |
| 3 | Concise current-lane projection | `docs/ops/CURRENT_LANE_STATUS.md` | current durable projection |
| 4 | Provider-neutral managed-worker obligations | `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md` | product-local public-safe export, dated and not silently synchronized to latest private framework |
| 5 | Human/project orientation | `README.md` | current-custody pointer |
| 6 | Agent/operator rules | `AGENTS.md` | current-custody pointer |
| 7 | Recovery provenance | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | history/provenance |
| 8 | Re-onboarding delta | `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md` | historical/process evidence, no current mutation authority |
| 9 | Completed PR #5 donor classification | `docs/ops/SFL-PR5-SALVAGE-MAP-001.md` | read-only donor classification |
| 10 | Product gate dependency graph | `docs/ops/execution-sequence-v1.md` | product dependency map, not current custody selection |
| 11 | Durable work inventory | `project-tracking/open-work-ledger.md` | append-only history, not current selection authority |
| 12 | Canonical product vision | `docs/product/product-vision-locked-v1.md` | owner-approved |
| 13 | Product architecture approval | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | owner-approved |

Current repository custody:

```text
main@5f9d2a46898d97b87503cff2a2554c2eec665d47 = accepted repository truth
PR #9 = ACTIVE / SFL-CURRENT-SITUATION-001
branch = feat/current-situation-selfhost-001
PR #10 = WAIT_SERIALIZED / retained evidence / no active mutation authority
PR #5 = FROZEN_DONOR / SALVAGE_SOURCE / no wholesale merge
next gate = exact-head hosted validation -> hostile review -> independent external review -> owner disposition
next new branch = BLOCKED while PR #9 owns mutation
```

Do not infer current work from newest PR/branch/issue/commit, a dated plan, or chat history. When the execution surface permits it, run `npm run current:situation` to join exact local HEAD with live GitHub attestations.

## Planning/work-state split

```text
STRATEGIC / WATERFALL
  product intent, requirements, major gates/dependencies

AGILE / FLOW
  derived ready/blocked/ordered work items

ACTIVE EXECUTION
  exact current ChangeUnit + mutation custody
```

Current limitation: product vision/architecture exist, but one typed accepted strategic PlanRevision/current-gate projection and one canonical agile-plan object are not yet present on accepted `main`. Do not fabricate them from issue/branch recency.

## Current control records

| Artifact | Path | State |
|---|---|---|
| Stable execution plan | `docs/ops/CURRENT_EXECUTION_PLAN.md` | PR #9 / `SFL-CURRENT-SITUATION-001`; first current-custody entry point |
| Active-work checkpoint | `docs/ops/ACTIVE_WORK_CHECKPOINT.md` | fail-closed durable custody projection |
| Current lane | `docs/ops/CURRENT_LANE_STATUS.md` | PR #9 active, PR #10 serialized WAIT |
| CurrentSituation reducer | `scripts/current-situation-core.mjs` | deterministic product-local reducer |
| CurrentSituation resolver | `scripts/current-situation.mjs` | joins local Git/GitHub evidence when available |
| CurrentSituation regression checks | `scripts/check-current-situation.mjs` | fail-closed hostile cases |
| Foundation validator | `scripts/check-foundation.mjs` | now fails if README/AGENTS/INDEX drift from active PR/branch/ChangeUnit again |
| Do-not-touch register | `docs/ops/do-not-touch-register.md` | overlapping/concurrent work guardrail |
| Verification runbook | `docs/ops/verification-runbook.md` | validation applicability |
| August recovery startup | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | provenance/history |
| Re-onboarding delta | `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md` | historical/process classification |
| PR #5 salvage map | `docs/ops/SFL-PR5-SALVAGE-MAP-001.md` | completed donor classification; no code-harvest authority |
| Namespace migration dry run | `docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md` | plan only, no current `xiio/` write authority |

## Framework rebase state

Private framework main was observed on 2026-09-01 at `0c9db9b1395b626d7fd0b8b4bea3bc9d1586cc53`.

Current framework invariants consumed by this cold-start repair include:

```text
WORKER_BIND = tip_sha · branch · PR · managed_first_hop · worker_label
PASS = NEXT_FROZEN_INPUT
BRANCH_PASS != RUNTIME
MERGED_TO_MAIN != MAIN_READBACK_CURRENT
MAIN_READBACK_CURRENT != AFFECTED_RETURN_CURRENT
COMMENT != WORK
CANDIDATE != ACCEPTED
HISTORY != EXECUTABLE
```

The product-local public managed-worker contract still declares an older export basis. That is explicit drift, not an excuse to rewrite the version string. A bounded framework-delta/adoption pass is still required before calling the public export synchronized.

`SFL-COLD-BIND-001` remains open: the current framework has a local worker-bind script, but connector-hosted workers do not yet have an equivalent provider-neutral binder/receipt action.

## External worker / Claude handoff

| Artifact | Path | State |
|---|---|---|
| Claude adapter | `CLAUDE.md` | thin provider-specific discovery only |
| Public managed-worker contract | `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md` | provider-neutral public-safe pilot contract |
| Machine projection | `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.json` | machine-readable companion; not final framework ABI |
| External-worker conformance pilot | `docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md` | test spec |
| Public-worker validator | `scripts/check-public-managed-worker-contract.mjs` | structure/discovery/fail-closed validator |

The August 17 external Claude holdout produced useful `PASS_WITH_FINDINGS` evidence. It proved CurrentSituation/custody/fail-closed discovery was substantially usable while capability/Bug-work/SDK/MCP/adoption surfaces remained non-authoritative. That finding belongs to later S4-S6 work, not PR #9 scope. Any material PR #9 byte change invalidates earlier exact-head qualification for the new head.

## Product and architecture

| Artifact | Path | State |
|---|---|---|
| Product vision | `docs/product/product-vision-locked-v1.md` | owner-approved |
| Product architecture lock | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | owner-approved |
| Inbox-pattern legal workbench architecture | `docs/architecture/inbox-pattern-adoption-and-legal-workbench-v1.md` | approved direction, no Inbox runtime coupling |
| PostgreSQL/object-vault ADR | `docs/architecture/adr-001-postgresql-runtime-catalog-v1.md` | accepted direction, not implemented |
| Multi-kit source registry design | `docs/architecture/multi-kit-source-registry-v1.md` | recovery design, implementation/admission pending |
| System architecture | `docs/architecture/system-architecture-v1.md` | earlier bootstrap draft |
| Privacy/data boundary | `docs/architecture/privacy-and-data-boundary-v1.md` | active boundary |
| Legal-information boundary | `docs/legal/legal-information-boundary-v1.md` | active boundary |

## Legal source state

### Existing canonical first-slice snapshot

| Artifact | Path | State |
|---|---|---|
| Legacy source registry | `sources/source-registry.json` | Kit #3J only, single-global-snapshot model under recovery |
| Kit #3J source record | `docs/source-materials/jcc-kit-3j-source-record-v1.md` | captured, independent current-source review incomplete |
| Kit #3J forms index | `sources/jcc-kit-3j/2026-03-30/forms-index.json` | six included forms, 267 line items |
| Source freshness standard | `docs/source-materials/source-capture-and-freshness-standard-v1.md` | active project source standard |
| Kit #3J capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | structural capture complete, source approval pending |
| Independent review packet | `docs/reviews/local-review-packet-jcc-source-capture-001.md` | review pending |

### Recovery intake, not runtime truth

| Artifact | Path | State |
|---|---|---|
| Intake registry | `sources/intake/index.json` | non-runtime recovery evidence |
| Kit #2a | `sources/intake/kit-2a/2023-04-10/source-intake.json` | nine included forms identified, currentness/review incomplete |
| Kit #4a | `sources/intake/kit-4a/2023-04-10/source-intake.json` | four included forms identified, currentness/review incomplete |
| Kit #4a Form 15-47 matrix | `sources/intake/kit-4a/2023-04-10/form-15-47-schedule-matrix.json` | seven schedules, 42 rows, independent review pending |
| Form 15-52 | `sources/intake/form-15-52/undated/source-intake.json` | supplied rule/form captured, revision/currentness unresolved |
| Form 13-31 | PR #10 / `sources/form-13-31-official-capture-2026-08-27` | serialized WAIT; source slice not canonical/runtime-admissible |

No recovery intake becomes canonical or runtime-admissible without reviewed source promotion.

A first/reference kit is not proof of full Saskatchewan product-source coverage. Repeated form numbers across kits are candidate relationships only until explicit byte/text/rendered comparison proves equivalence or divergence.

## Inbox / reusable framework donor program

The Inbox Mail surface is a qualified donor source, not a runtime dependency.

| Artifact | Path | State |
|---|---|---|
| Historical Inbox source map | `docs/source-materials/inbox-pattern-source-map-v1.md` | historical donor map |
| Current Mail donor census | `docs/source-materials/inbox-mail-workbench-donor-census-2026-08-12.md` | accepted Inbox main treated as primary UI donor |
| Human-readable primitive promotion lock | `docs/source-materials/inbox-framework-component-promotion-lock-v1.md` | stable candidate identities/lineage locked |
| Machine-readable primitive lock | `docs/source-materials/inbox-framework-component-promotion-lock-v1.json` | validator-enforced intake only |
| Exact primitive source map | `docs/source-materials/inbox-framework-component-source-map-v1.json` | framework + accepted Inbox source refs as recorded |
| Lock validator | `scripts/check-framework-component-promotion-lock.mjs` | fail-closed naming/source/authority checks |

Canonical framework ownership remains external to this repository. Product-local candidate identities are not canonical framework registry entries until accepted through xi-io.net.

## Project Kernel namespace

Current documented direction remains:

```text
.xiio/ = local/private/runtime machine state
xiio/  = repo-safe portable managed-project/framework contracts
xi/    = legacy compatibility input only
```

This repository still has five legacy portable contracts under `xi/`:

- `xi/managed-project.manifest.yaml`
- `xi/project-lexicon.yaml`
- `xi/feature-index.yaml`
- `xi/ui-profile.yaml`
- `xi/capability-profile.yaml`

Preserve them until a current controlling framework migration/adoption gate explicitly authorizes replacement. Do not copy stale semantics byte-for-byte into `xiio/`.

## Rights/distribution state

The repository is public, but no project license is selected. Public visibility does not itself grant reuse, redistribution, bundling or commercial distribution rights. A future explicit rights/license/contribution/distribution qualification pass remains required for stronger external-use claims.

## Validation

| Command | Purpose |
|---|---|
| `npm run check` | complete current repository structural checks |
| `npm run check:foundation` | required files, current-custody entry points, secret-like content and core contracts |
| `npm run check:current-situation` | deterministic CurrentSituation hostile/regression cases |
| `npm run current:situation` | resolve local Git + live GitHub current state when provider access exists |
| `npm run check:source-catalog` | existing Kit #3J structural catalog |
| `npm run check:recovery-sources` | Kit #2a/#4a/Form 15-52 intake invariants |
| `npm run check:framework-component-promotion-lock` | stable IDs/symbols, source-map coverage and authority separation |
| `npm run check:public-managed-worker-contract` | public-worker discovery/planning/active-work/fail-closed contract structure |
| `git diff --check` | whitespace/diff integrity before review |

Earlier hosted checks and reviews are historical exact-head evidence only. The 2026-09-01 onboarding repair changes bytes, so current PR #9 requires fresh exact-head validation and review before any owner disposition.

These checks do not prove legal currentness/correctness, runtime behavior, private-workspace security, provider qualification, or owner approval.

## Ledgers

| Ledger | Path |
|---|---|
| Open work | `project-tracking/open-work-ledger.md` |
| Agent runs | `project-tracking/agent-run-ledger.md` |
| Decisions | `project-tracking/decision-ledger.md` |
| Risks | `project-tracking/risk-register.md` |
| Evidence | `project-tracking/evidence-ledger.md` |

Ledgers are historical/append-only evidence unless an accepted migration explicitly supersedes the storage contract. Ledger recency is not current execution authority.

## Historical records

| Artifact | Path | Meaning |
|---|---|---|
| July startup | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md` | historical bootstrap checkpoint |
| August recovery execution plan | `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md` | recovery-lane authority retained as history after PR #6 merge |
| Original bootstrap review | `docs/reviews/local-review-packet-sask_family_law_self_help-001.md` | historical review evidence |
| Product brief | `docs/product/product-brief-v1.md` | earlier planning |
| First reference slice | `docs/product/first-reference-slice-v1.md` | historical proving-slice planning, not full product boundary |

Historical documents are evidence, not current work custody.

## Current next Git action

Follow `docs/ops/CURRENT_EXECUTION_PLAN.md`, `docs/ops/ACTIVE_WORK_CHECKPOINT.md`, and `docs/ops/CURRENT_LANE_STATUS.md`.

The current mutation priority is PR #9 `SFL-CURRENT-SITUATION-001`: validate the final exact head, inspect `npm run current:situation`, obtain hostile and independent exact-head review, then stop for owner disposition. Keep PR #10 serialized `WAIT`. Do not start another development branch while PR #9 owns the single mutation lane.

If PR #9 is later merged with applicable authority, runtime credit still requires accepted-main readback plus affected-return currentness. `PASS = NEXT_FROZEN_INPUT`.
