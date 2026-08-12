# Documentation Index v1

Status: `active recovery, multi-kit source correction and owner-locked architecture index`  
Project: `sask_family_law_self_help`

## Start here

| Purpose | Path | State |
|---|---|---|
| Canonical product vision | `docs/product/product-vision-locked-v1.md` | owner-approved locked direction |
| August existing-project recovery | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | active recovery checkpoint |
| Kit #4a scope correction | `docs/ops/SFL-KIT-4A-SCOPE-RECOVERY-001.md` | active source-recovery gate |
| Current gate sequence | `docs/ops/execution-sequence-v1.md` | recovery-adjusted |
| Open work | `project-tracking/open-work-ledger.md` | append-only, recovery rows added |
| Owner architecture approval | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | accepted |
| Human orientation | `README.md` | stale against recovery, refresh required |
| Agent and operator rules | `AGENTS.md` | stale against recovery, refresh required |
| Legacy managed project contract | `xi/managed-project.manifest.yaml` | legacy compatibility input, migration review required |
| Existing canonical source registry | `sources/source-registry.json` | Kit #3J only, single-snapshot assumption under recovery |
| Unreviewed source intake registry | `sources/intake/index.json` | recovery evidence only, not runtime truth |

## Product

| Document | Path | State |
|---|---|---|
| Canonical product vision | `docs/product/product-vision-locked-v1.md` | owner-approved locked direction |
| Product brief | `docs/product/product-brief-v1.md` | earlier planning checkpoint |
| First reference slice | `docs/product/first-reference-slice-v1.md` | historical first-slice planning, not full product boundary |

## Architecture and data

| Document | Path | State |
|---|---|---|
| System architecture | `docs/architecture/system-architecture-v1.md` | bootstrap draft |
| Privacy and data boundary | `docs/architecture/privacy-and-data-boundary-v1.md` | bootstrap draft |
| Inbox pattern adoption and legal workbench | `docs/architecture/inbox-pattern-adoption-and-legal-workbench-v1.md` | owner-approved locked direction, no Inbox mutation |
| ADR-001 PostgreSQL runtime catalog | `docs/architecture/adr-001-postgresql-runtime-catalog-v1.md` | owner-accepted direction, no database configured |
| Multi-kit source registry | `docs/architecture/multi-kit-source-registry-v1.md` | recovery design, required before Kit #4a promotion |
| Matter record schema | `docs/schemas/matter-record-schema-v1.md` | conceptual |
| Workflow definition schema | `docs/schemas/workflow-definition-schema-v1.md` | conceptual and incomplete for recovered multi-kit scope |

## Workflow and UX

| Document | Path | State |
|---|---|---|
| Kit #3J workflow | `docs/workflows/jcc-kit-3j-workflow-v1.md` | source review pending |
| Kit #4a workflow | `sources/intake/kit-4a/2023-04-10/source-intake.json` | process stages inventoried, source-bound graph pending |
| Progressive disclosure interview | `docs/ux/progressive-disclosure-interview-v1.md` | existing UX direction |
| Accessibility and cognitive load | `docs/ux/accessibility-and-cognitive-load-v1.md` | existing UX direction |
| Legal-information boundary | `docs/legal/legal-information-boundary-v1.md` | existing boundary |

## Canonical source snapshots

| Artifact | Path | Source state |
|---|---|---|
| Source registry | `sources/source-registry.json` | Kit #3J only, redesign required for independent source families |
| Kit #3J source record | `docs/source-materials/jcc-kit-3j-source-record-v1.md` | captured, unverified current |
| Source capture and freshness standard | `docs/source-materials/source-capture-and-freshness-standard-v1.md` | active project standard |
| Official companion form source discovery | `docs/source-materials/official-companion-form-source-discovery-v1.md` | official URLs located, artifacts not yet archived |
| Kit #3J form index | `sources/jcc-kit-3j/2026-03-30/forms-index.json` | six included forms indexed |
| FAM-PD #7-2 line items | `sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-2.json` | 71 line items, review pending |
| Form 10-3 Draft Order line items | `sources/jcc-kit-3j/2026-03-30/forms/form-10-3-draft-order.json` | 24 line items, review pending |
| Form 10-3 Child Support line items | `sources/jcc-kit-3j/2026-03-30/forms/form-10-3-child-support-order.json` | 51 line items, review pending |
| Form 15-8B line items | `sources/jcc-kit-3j/2026-03-30/forms/form-15-8b.json` | 54 line items, review pending |
| Form 12-3 line items | `sources/jcc-kit-3j/2026-03-30/forms/form-12-3.json` | 27 line items, review pending |
| FAM-PD #7-5 line items | `sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-5.json` | 40 line items, review pending |
| Kit #3J capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | author complete, human source review pending |

## Recovery source intake

These artifacts are deliberately separate from canonical approved source truth.

| Artifact | Path | State |
|---|---|---|
| Intake registry | `sources/intake/index.json` | unreviewed source candidates only |
| Kit #4a source intake | `sources/intake/kit-4a/2023-04-10/source-intake.json` | hash identified, currentness unverified, full capture pending |
| Form 15-47 schedule-selection matrix | `sources/intake/kit-4a/2023-04-10/form-15-47-schedule-matrix.json` | 42 source rows captured, independent review pending |
| Kit #4a recovery audit | `docs/ops/SFL-KIT-4A-SCOPE-RECOVERY-001.md` | records forms, process scope, discrepancies and blockers |

Kit #4a physically contains Form 13-31, Form 15-47, Form 15-8B and Form 12-3. The latter two overlap form numbers already cataloged under Kit #3J, but cross-snapshot equivalence has not been proven and reuse is blocked pending comparison.

No completed user forms or private case evidence belong in this repository.

## Donor pattern sources

| Donor | Record | State |
|---|---|---|
| xi-io Inbox | `docs/source-materials/inbox-pattern-source-map-v1.md` | read-only source map, adoption not implemented on main |

The Inbox repository is a read-only donor. This project must not depend on its active `main` branch at runtime or change Inbox while implementing the family-law product.

## Project Kernel and repo-local namespace

Current framework direction assigns:

```text
.xiio/  local runtime and machine-operational state
xiio/   repo-safe portable framework contract
xi/     legacy compatibility input only
```

Current project contracts remain under legacy `xi/` while recovery review is active.

| Artifact | Path | State |
|---|---|---|
| Namespace migration plan | `docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md` | dry-run, no legacy deletion/copy yet |
| Legacy manifest | `xi/managed-project.manifest.yaml` | review required before promotion |
| Legacy lexicon | `xi/project-lexicon.yaml` | review required before promotion |
| Legacy feature index | `xi/feature-index.yaml` | review required before promotion |
| Legacy UI profile | `xi/ui-profile.yaml` | review required before promotion |
| Legacy capability profile | `xi/capability-profile.yaml` | review required before promotion |

## Ledgers

| Ledger | Path |
|---|---|
| Open work | `project-tracking/open-work-ledger.md` |
| Agent runs | `project-tracking/agent-run-ledger.md` |
| Decisions | `project-tracking/decision-ledger.md` |
| Risks | `project-tracking/risk-register.md` |
| Evidence | `project-tracking/evidence-ledger.md` |

Ledgers are append-only. Corrections require a new entry that identifies the corrected record.

## Reviews and receipts

| Artifact | Path | State |
|---|---|---|
| Product architecture lock | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | owner-approved |
| Original bootstrap review packet | `docs/reviews/local-review-packet-sask_family_law_self_help-001.md` | historical checkpoint |
| Original startup packet | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md` | historical checkpoint |
| Recovery startup packet | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md` | active recovery checkpoint |
| JCC source capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | source transcription complete, review pending |
| JCC source capture review packet | `docs/reviews/local-review-packet-jcc-source-capture-001.md` | independent source review pending |

## Validation

Existing commands:

| Command | Purpose |
|---|---|
| `npm run check` | Run current repository checks |
| `npm run check:source-catalog` | Verify the existing Kit #3J snapshot/catalog structure |

Recovery gap:

The existing validators are first-slice validators. They do not yet validate Kit #4a intake, multi-kit source-family semantics, cross-snapshot form relationships, or complete procedure catalogs. New validation must be added before recovery can claim structural compliance.

A passing structural check proves consistency only. It does not prove legal correctness or currentness.

## Framework references

Canonical framework repo: `Vado42-chris/xi-io.net`.

The original bootstrap used framework commit `c29afb513d6e44511ecb00bec7514df3229f7d0c`. Recovery inspection found the framework 195 commits ahead of that point and requires revalidation against current framework truth before merge.

Material recovery references include:

- project startup hydration,
- managed project manifest,
- Project Kernel adoption,
- repo-local namespace,
- user/workspace lifecycle,
- Task Context compilation,
- GitHub management/governance,
- receipt and no-silent-green rules.

## Current gate and gaps

Architecture remains owner-approved, but source and framework recovery now have multiple explicit gates:

- `SFL-FRAMEWORK-RECOVERY-001`, current framework/Project Kernel recovery,
- `SFL-SOURCE-REVIEW-002`, unfinished Kit #3J review,
- `SFL-KIT-4A-SOURCE-RECOVERY-001`, Kit #4a forms plus process recovery,
- `SFL-MULTI-KIT-SOURCE-001`, independent source-family registry semantics.

Runtime schemas, triage, task planning, form generation, private workspace, AI, egress and transmission remain blocked behind the applicable reviewed source and framework gates.
