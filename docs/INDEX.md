# Documentation Index v1

Status: `active bootstrap and source-capture index`  
Project: `sask_family_law_self_help`

## Start here

| Purpose | Path | State |
|---|---|---|
| Human orientation | `README.md` | created |
| Agent and operator rules | `AGENTS.md` | created |
| Managed project contract | `xi/managed-project.manifest.yaml` | created, runtime not checked |
| Current gate sequence | `docs/ops/execution-sequence-v1.md` | created |
| Open work | `project-tracking/open-work-ledger.md` | created |
| Canonical source registry | `sources/source-registry.json` | first snapshot captured |

## Product

| Document | Path |
|---|---|
| Product brief | `docs/product/product-brief-v1.md` |
| First reference slice | `docs/product/first-reference-slice-v1.md` |

## Architecture and data

| Document | Path |
|---|---|
| System architecture | `docs/architecture/system-architecture-v1.md` |
| Privacy and data boundary | `docs/architecture/privacy-and-data-boundary-v1.md` |
| Matter record schema | `docs/schemas/matter-record-schema-v1.md` |
| Workflow definition schema | `docs/schemas/workflow-definition-schema-v1.md` |

## Workflow and UX

| Document | Path |
|---|---|
| Kit #3J workflow | `docs/workflows/jcc-kit-3j-workflow-v1.md` |
| Progressive disclosure interview | `docs/ux/progressive-disclosure-interview-v1.md` |
| Accessibility and cognitive load | `docs/ux/accessibility-and-cognitive-load-v1.md` |
| Legal-information boundary | `docs/legal/legal-information-boundary-v1.md` |

## Canonical source snapshots

| Artifact | Path | Source state |
|---|---|---|
| Source registry | `sources/source-registry.json` | current snapshot pointer created |
| Kit #3J source record | `docs/source-materials/jcc-kit-3j-source-record-v1.md` | captured, unverified current |
| Source capture and freshness standard | `docs/source-materials/source-capture-and-freshness-standard-v1.md` | active project standard |
| Kit #3J form index | `sources/jcc-kit-3j/2026-03-30/forms-index.json` | six included forms indexed |
| FAM-PD #7-2 line items | `sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-2.json` | 71 line items, review pending |
| Form 10-3 Draft Order line items | `sources/jcc-kit-3j/2026-03-30/forms/form-10-3-draft-order.json` | 24 line items, review pending |
| Form 10-3 Child Support line items | `sources/jcc-kit-3j/2026-03-30/forms/form-10-3-child-support-order.json` | 51 line items, review pending |
| Form 15-8B line items | `sources/jcc-kit-3j/2026-03-30/forms/form-15-8b.json` | 54 line items, review pending |
| Form 12-3 line items | `sources/jcc-kit-3j/2026-03-30/forms/form-12-3.json` | 27 line items, review pending |
| FAM-PD #7-5 line items | `sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-5.json` | 40 line items, review pending |
| Capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | author complete, human source review pending |

No completed user forms or private case evidence belong in this repository.

## Companion source gaps

The Kit #3J snapshot names or depends on the following forms that are not physically included and therefore are not yet canonical source snapshots:

- FAM-PD #7-1
- FAM-PD #7-3
- FAM-PD #7-4, court generated
- Form 15-8A
- Form 15-47
- Form 15-49

The application must not claim complete JCC coverage until these sources are captured and reviewed.

## xi project profiles

| Profile | Path |
|---|---|
| Manifest | `xi/managed-project.manifest.yaml` |
| Lexicon | `xi/project-lexicon.yaml` |
| Feature index | `xi/feature-index.yaml` |
| UI profile | `xi/ui-profile.yaml` |
| Capability profile | `xi/capability-profile.yaml` |

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
| Bootstrap review packet | `docs/reviews/local-review-packet-sask_family_law_self_help-001.md` | author complete, peer review pending |
| Startup packet | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md` | created |
| JCC source capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | source transcription complete, review pending |

## Validation

| Command | Purpose |
|---|---|
| `npm run check` | Run foundation and source-catalog checks |
| `npm run check:source-catalog` | Verify snapshot identity, six forms, 267 unique line items, explicit gaps, and freshness disclosure requirements |

A passing source-catalog check proves structural consistency only. It does not prove legal correctness or currentness.

## Framework references

Canonical framework repo: `Vado42-chris/xi-io.net` at inspected commit `c29afb513d6e44511ecb00bec7514df3229f7d0c`.

Framework documents used:

- `docs/framework/repo-governance-quickstart-v1.md`
- `docs/framework/project-startup-hydration-standard-v1.md`
- `docs/framework/readme-standard-v1.md`
- `docs/framework/managed-project-manifest-standard-v1.md`
- `docs/framework/agent-run-ledger-standard-v1.md`
- `docs/framework/templates/managed-project-white-label-launch-prompt-v1.md`
- `docs/framework/templates/local-review-packet-template-v1.md`

## Current gaps

- Exact original Kit #3J binary is hash-identified but not yet archived in the repo.
- The 267 source line items require independent rendered-page review.
- Six named companion forms remain uncaptured.
- Runtime, private workspace, executable schemas, forms engine, AI adapter, document export, service, filing, email, authentication, encryption, and automated source monitoring remain missing.
