# Documentation Index v1

Status: `ACTIVE RECOVERY INDEX; R6-D COMPLETE / EXACT-HEAD CLOSEOUT VALIDATION NEXT`  
Project: `sask_family_law_self_help`

## Start here

Read these in order for current repository work:

| Order | Purpose | Path | State |
|---|---|---|---|
| 1 | Fail-closed active-work checkpoint | `docs/ops/ACTIVE_WORK_CHECKPOINT.md` | current projection; live SHA must still be resolved |
| 2 | Detailed GitHub execution/custody authority | `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md` | current, self-contained |
| 3 | Concise current-lane projection | `docs/ops/CURRENT_LANE_STATUS.md` | current projection |
| 4 | Human/project orientation | `README.md` | recovery/re-onboarding refreshed |
| 5 | Agent/operator rules | `AGENTS.md` | recovery/re-onboarding refreshed |
| 6 | Recovery provenance | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | recovery checkpoint |
| 7 | Kickoff/re-onboarding delta | `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md` | current process/product delta; no implementation authority |
| 8 | Completed PR #5 donor classification | `docs/ops/SFL-PR5-SALVAGE-MAP-001.md` | R6-D complete; read-only classification only |
| 9 | Product gate dependency graph | `docs/ops/execution-sequence-v1.md` | recovery-adjusted dependency map; Git mutation cadence is owned by the execution plan |
| 10 | Durable work inventory | `project-tracking/open-work-ledger.md` | append-only |
| 11 | Canonical product vision | `docs/product/product-vision-locked-v1.md` | owner-approved |
| 12 | Product architecture approval | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | owner-approved |

Current repository custody:

```text
main = accepted repository truth
PR #6 = active recovery/control-plane proposal
PR #5 = frozen donor/salvage source, no wholesale merge
R6-D = complete read-only salvage classification
next gate = R6-E exact-head validation, then R6-F hostile exact-head review
next new branch = none until PR #6 merges and merged main is verified
```

Do not infer current work from newest PR/branch/issue/commit.

## Planning/work-state split

The repository now explicitly distinguishes:

```text
STRATEGIC / WATERFALL
  product intent, requirements, major gates/dependencies

AGILE / FLOW
  derived ready/blocked/ordered work items

ACTIVE EXECUTION
  exact current ChangeUnit + mutation custody
```

Current limitation: product vision/architecture and recovery dependency order exist, but one typed accepted strategic PlanRevision/current-gate projection and one canonical agile-plan object are not yet present on accepted `main`. Do not fabricate them from issue/branch recency.

## Current recovery/control-plane records

| Artifact | Path | State |
|---|---|---|
| Active-work checkpoint | `docs/ops/ACTIVE_WORK_CHECKPOINT.md` | fail-closed current custody projection; exact-head validation required after current closeout bytes |
| Current lane | `docs/ops/CURRENT_LANE_STATUS.md` | PR #6 / SFL-RECOVERY-CLOSEOUT-001 / R6-E-next projection |
| GitHub execution plan | `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md` | detailed current mutation/cadence authority |
| Do-not-touch register | `docs/ops/do-not-touch-register.md` | overlapping/concurrent work guardrail |
| Verification runbook | `docs/ops/verification-runbook.md` | exact current recovery validation applicability |
| August recovery startup | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | provenance/history |
| Re-onboarding delta | `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md` | current kickoff/process-domain classification |
| PR #5 salvage map | `docs/ops/SFL-PR5-SALVAGE-MAP-001.md` | R6-D complete; eight donor families classified; no code harvest authority |
| Mailbox source discovery | `docs/ops/SFL-OWNER-MAILBOX-SOURCE-DISCOVERY-001.md` | Kit #2a, #3J, #4a, Form 15-52 discovered |
| Kit #4a scope correction | `docs/ops/SFL-KIT-4A-SCOPE-RECOVERY-001.md` | recovery evidence |
| Namespace migration dry run | `docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md` | plan only, no `xiio/` write yet |
| Execution/gate sequence | `docs/ops/execution-sequence-v1.md` | product dependency graph |
| Open work | `project-tracking/open-work-ledger.md` | append-only work inventory |

## External worker / Claude handoff

| Artifact | Path | State |
|---|---|---|
| Claude adapter | `CLAUDE.md` | thin provider-specific discovery only |
| Public managed-worker contract | `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md` | provider-neutral public-safe pilot contract |
| Machine projection | `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.json` | machine-readable companion; not final framework ABI |
| External-worker conformance pilot | `docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md` | test spec; final run not executed |
| Public-worker validator | `scripts/check-public-managed-worker-contract.mjs` | structure/discovery/fail-closed validator |

The final Claude conformance qualification is intentionally post-recovery: fresh clone of accepted `main`, no chat history, no private framework access, read-only/plan-oriented hostile scenarios first. Passing repo structure does not equal provider conformance.

## Product and architecture

| Artifact | Path | State |
|---|---|---|
| Product vision | `docs/product/product-vision-locked-v1.md` | owner-approved |
| Product architecture lock | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | owner-approved |
| Inbox-pattern legal workbench architecture | `docs/architecture/inbox-pattern-adoption-and-legal-workbench-v1.md` | owner-approved direction, no Inbox runtime coupling |
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

No recovery intake becomes canonical or runtime-admissible without reviewed source promotion.

A first/reference kit is not proof of full Saskatchewan product-source coverage. Repeated form numbers across kits are candidate relationships only until explicit byte/text/rendered comparison proves equivalence or divergence.

## Inbox / reusable framework donor program

The Inbox Mail surface is a qualified donor source, not a runtime dependency.

| Artifact | Path | State |
|---|---|---|
| Historical Inbox source map | `docs/source-materials/inbox-pattern-source-map-v1.md` | historical donor map |
| Current Mail donor census | `docs/source-materials/inbox-mail-workbench-donor-census-2026-08-12.md` | accepted Inbox main treated as primary UI donor |
| Human-readable primitive promotion lock | `docs/source-materials/inbox-framework-component-promotion-lock-v1.md` | 33 stable candidate identities/lineage locked |
| Machine-readable primitive lock | `docs/source-materials/inbox-framework-component-promotion-lock-v1.json` | validator-enforced intake only |
| Exact primitive source map | `docs/source-materials/inbox-framework-component-source-map-v1.json` | current framework + accepted Inbox source refs |
| Lock validator | `scripts/check-framework-component-promotion-lock.mjs` | fail-closed naming/source/authority checks |

Canonical framework ownership remains external to this repository. The 33 locked primitives are not canonical framework registry entries until accepted through xi-io.net. No SFL-local component registry may be created.

## Product-family identity / provenance-convergence adoption boundary

The owner-approved portfolio infographic has been distributed to its correct framework/product owners. This repository does not implement those capabilities in PR #6.

Future sam_law adoption must preserve:

```text
PRODUCT FAMILY / BRAND IDENTITY
!= LEGAL WARNING / BLOCKED / CURRENTNESS STATE
!= PROVENANCE / FRAMEWORK-vs-SYNTHESIS CONVERGENCE
!= SECURITY / RIGHTS / RELEASE QUALIFICATION
!= MUTATION AUTHORITY
```

Framework/product planning handles for later work include brand binding through the framework brand owner, provenance/convergence through Repo Rehab, capability delivery through framework distribution/adopter locks, and read-only Studio projection. These remain future separately admitted work after recovery.

## Project Kernel namespace

Current framework direction is:

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

Preserve them. The migration plan is `docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md`.

New `xiio/` writes remain blocked until the controlling framework namespace/read-order prerequisite is accepted and current guidance is unambiguous.

## Rights/distribution state

The repository is public, but no project license is selected. Public visibility does not itself grant reuse, redistribution, bundling or commercial distribution rights. A future explicit rights/license/contribution/distribution qualification pass remains required for stronger external-use claims.

## Validation

| Command | Purpose |
|---|---|
| `npm run check` | complete current repository structural checks |
| `npm run check:foundation` | required files, cold-start/checkpoint/re-onboarding contracts, secret-like content and basic contracts |
| `npm run check:source-catalog` | existing Kit #3J structural catalog |
| `npm run check:recovery-sources` | Kit #2a/#4a/Form 15-52 intake fail-closed invariants |
| `npm run check:framework-component-promotion-lock` | stable IDs/symbols, source-map coverage and authority separation |
| `npm run check:public-managed-worker-contract` | public-worker/Claude discovery, planning-plane, active-work and fail-closed contract structure |
| `git diff --check` | whitespace/diff integrity before review |

Hosted Foundation Check run #112 passed on `402b9b91889da444e8840507ce10528c315d6c99` after the re-onboarding validator regressions were corrected. Later closeout-status updates intentionally invalidate that exact-head proof. Require fresh hosted validation on the final reviewed PR #6 head.

These checks do not prove legal currentness/correctness, runtime behavior, private-workspace security or Claude conformance. Source approval and provider qualification remain separate evidence gates.

## Ledgers

| Ledger | Path |
|---|---|
| Open work | `project-tracking/open-work-ledger.md` |
| Agent runs | `project-tracking/agent-run-ledger.md` |
| Decisions | `project-tracking/decision-ledger.md` |
| Risks | `project-tracking/risk-register.md` |
| Evidence | `project-tracking/evidence-ledger.md` |

Ledgers are append-only unless an accepted framework migration explicitly supersedes the storage contract.

## Historical records

| Artifact | Path | Meaning |
|---|---|---|
| July startup | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md` | historical empty/bootstrap checkpoint; first reference slice was not full product-source coverage |
| Original bootstrap review | `docs/reviews/local-review-packet-sask_family_law_self_help-001.md` | historical review evidence |
| Product brief | `docs/product/product-brief-v1.md` | earlier planning |
| First reference slice | `docs/product/first-reference-slice-v1.md` | historical proving-slice planning, not full product boundary |

Historical documents are evidence, not current work custody.

## Current next Git action

Follow `docs/ops/ACTIVE_WORK_CHECKPOINT.md` and `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`.

R6-D is complete. The current mutation priority is to finish PR #6 closeout truth, obtain exact-head hosted validation, perform hostile exact-head review, then stop for the explicit owner merge gate. Do not start another development branch until PR #6 is approved, merged and merged `main` is verified. The first final Claude qualification is then the read-only fresh-clone conformance pilot, not a new runtime feature branch.
