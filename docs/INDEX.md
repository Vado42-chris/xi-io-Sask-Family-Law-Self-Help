# Documentation Index v1

Status: `ACTIVE RECOVERY INDEX; GITHUB COLD-START AUTHORITY RESOLVED`  
Project: `sask_family_law_self_help`

## Start here

Read these in order for current GitHub work:

| Order | Purpose | Path | State |
|---|---|---|---|
| 1 | Current GitHub execution/custody authority | `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md` | current, self-contained |
| 2 | Human/project orientation | `README.md` | recovery-refreshed |
| 3 | Agent/operator rules | `AGENTS.md` | recovery-refreshed |
| 4 | Recovery provenance | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | recovery checkpoint |
| 5 | Product gate dependency graph | `docs/ops/execution-sequence-v1.md` | recovery-adjusted dependency map, Git mutation cadence is owned by the execution plan |
| 6 | Durable work inventory | `project-tracking/open-work-ledger.md` | append-only |
| 7 | Canonical product vision | `docs/product/product-vision-locked-v1.md` | owner-approved |
| 8 | Product architecture approval | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | owner-approved |

Current repository custody:

```text
main = accepted repository truth
PR #6 = active recovery/control-plane proposal
PR #5 = frozen donor/salvage source, no wholesale merge
next new branch = none until PR #6 merges and merged main is verified
```

## Current recovery/control-plane records

| Artifact | Path | State |
|---|---|---|
| GitHub execution plan | `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md` | current mutation/cadence authority |
| August recovery startup | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | provenance/history |
| Mailbox source discovery | `docs/ops/SFL-OWNER-MAILBOX-SOURCE-DISCOVERY-001.md` | Kit #2a, #3J, #4a, Form 15-52 discovered |
| Kit #4a scope correction | `docs/ops/SFL-KIT-4A-SCOPE-RECOVERY-001.md` | recovery evidence |
| Namespace migration dry run | `docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md` | plan only, no `xiio/` write yet |
| Execution/gate sequence | `docs/ops/execution-sequence-v1.md` | product dependency graph |
| Open work | `project-tracking/open-work-ledger.md` | append-only work inventory |

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

Repeated form numbers across kits are candidate relationships only until explicit byte/text/rendered comparison proves equivalence or divergence.

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

Canonical framework ownership remains:

```text
xi-io.net#236 = UI/component adoption and two-way freshness
xi-io.net#306 = namespace/registry compatibility recovery
xi-io.net#315 = versioned distribution/adopter locks
xi-io.net#300 = Git cadence
```

The 33 locked primitives are not canonical framework registry entries until accepted through xi-io.net. No SFL-local component registry may be created.

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

New `xiio/` writes remain blocked until the controlling xi-io.net namespace/read-order prerequisite is accepted and current guidance is unambiguous.

## Validation

| Command | Purpose |
|---|---|
| `npm run check` | complete current repository structural checks |
| `npm run check:foundation` | required files, cold-start authority, secret-like content and basic contracts |
| `npm run check:source-catalog` | existing Kit #3J structural catalog |
| `npm run check:recovery-sources` | Kit #2a/#4a/Form 15-52 intake fail-closed invariants |
| `npm run check:framework-component-promotion-lock` | stable IDs/symbols, source-map coverage and authority separation |
| `git diff --check` | whitespace/diff integrity before review |

These checks do not prove legal currentness/correctness. Source approval remains a separate human/evidence gate.

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
| July startup | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md` | historical empty/bootstrap checkpoint |
| Original bootstrap review | `docs/reviews/local-review-packet-sask_family_law_self_help-001.md` | historical review evidence |
| Product brief | `docs/product/product-brief-v1.md` | earlier planning |
| First reference slice | `docs/product/first-reference-slice-v1.md` | historical first-slice planning, not full product boundary |

Historical documents are evidence, not current work custody.

## Current next Git action

Follow `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`.

The current mutation priority is to close PR #6 cleanly as recovery/control-plane work. Do not start another development branch until PR #6 is approved, merged and merged `main` is verified.
