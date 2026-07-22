# Documentation Index v1

Status: `active bootstrap, source-capture and owner-locked architecture index`  
Project: `sask_family_law_self_help`

## Start here

| Purpose | Path | State |
|---|---|---|
| Canonical product vision | `docs/product/product-vision-locked-v1.md` | owner-approved locked direction |
| Owner architecture approval | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | accepted |
| Human orientation | `README.md` | created |
| Agent and operator rules | `AGENTS.md` | created |
| Managed project contract | `xi/managed-project.manifest.yaml` | created, runtime not checked |
| Current gate sequence | `docs/ops/execution-sequence-v1.md` | created |
| Open work | `project-tracking/open-work-ledger.md` | created |
| Canonical source registry | `sources/source-registry.json` | first snapshot captured |

## Product

| Document | Path | State |
|---|---|---|
| Canonical product vision | `docs/product/product-vision-locked-v1.md` | owner-approved locked direction |
| Product brief | `docs/product/product-brief-v1.md` | earlier planning checkpoint |
| First reference slice | `docs/product/first-reference-slice-v1.md` | planned after source gate |

## Architecture and data

| Document | Path | State |
|---|---|---|
| System architecture | `docs/architecture/system-architecture-v1.md` | bootstrap draft |
| Privacy and data boundary | `docs/architecture/privacy-and-data-boundary-v1.md` | bootstrap draft |
| Inbox pattern adoption and legal workbench | `docs/architecture/inbox-pattern-adoption-and-legal-workbench-v1.md` | owner-approved locked direction, no Inbox mutation |
| ADR-001 PostgreSQL runtime catalog | `docs/architecture/adr-001-postgresql-runtime-catalog-v1.md` | owner-accepted direction, no database configured |
| Matter record schema | `docs/schemas/matter-record-schema-v1.md` | conceptual |
| Workflow definition schema | `docs/schemas/workflow-definition-schema-v1.md` | conceptual |

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
| Official companion form source discovery | `docs/source-materials/official-companion-form-source-discovery-v1.md` | official URLs located, artifacts not yet archived |
| Kit #3J form index | `sources/jcc-kit-3j/2026-03-30/forms-index.json` | six included forms indexed |
| FAM-PD #7-2 line items | `sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-2.json` | 71 line items, review pending |
| Form 10-3 Draft Order line items | `sources/jcc-kit-3j/2026-03-30/forms/form-10-3-draft-order.json` | 24 line items, review pending |
| Form 10-3 Child Support line items | `sources/jcc-kit-3j/2026-03-30/forms/form-10-3-child-support-order.json` | 51 line items, review pending |
| Form 15-8B line items | `sources/jcc-kit-3j/2026-03-30/forms/form-15-8b.json` | 54 line items, review pending |
| Form 12-3 line items | `sources/jcc-kit-3j/2026-03-30/forms/form-12-3.json` | 27 line items, review pending |
| FAM-PD #7-5 line items | `sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-5.json` | 40 line items, review pending |
| Capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | author complete, human source review pending |

No completed user forms or private case evidence belong in this repository.

## Donor pattern sources

| Donor | Record | State |
|---|---|---|
| xi-io Inbox | `docs/source-materials/inbox-pattern-source-map-v1.md` | read-only source map, adoption not implemented |

The Inbox repository is a read-only donor. This project must not depend on its active `main` branch at runtime or change Inbox while implementing the family-law product.

## Companion source status

Official source locations are recorded for all six companion forms, but no companion form has yet been promoted to an immutable canonical snapshot:

- FAM-PD #7-1, located in the official FAM-PD #7 PDF
- FAM-PD #7-3, located in the official FAM-PD #7 PDF
- FAM-PD #7-4, located in the official FAM-PD #7 PDF and classified as court generated
- Form 15-8A, located through the official King's Bench Forms catalogue
- Form 15-47, located through the official King's Bench Forms catalogue
- Form 15-49, located through the official King's Bench Forms catalogue

See `docs/source-materials/official-companion-form-source-discovery-v1.md` for URLs, page ranges, authority states and capture requirements.

The application must not claim complete JCC coverage until the exact artifacts are downloaded, hashed, archived, line-item indexed and independently reviewed.

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
| Product architecture lock | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | owner-approved |
| Bootstrap review packet | `docs/reviews/local-review-packet-sask_family_law_self_help-001.md` | author complete, owner direction accepted through architecture lock |
| Startup packet | `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md` | created |
| JCC source capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | source transcription complete, review pending |
| JCC source capture review packet | `docs/reviews/local-review-packet-jcc-source-capture-001.md` | author complete, independent source review pending |

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
- `docs/framework/project-kernel-standard-v1.md`
- `docs/framework/legal-private-ingress-boundary-standard-v1.md`
- `docs/framework/egress-adapter-standard-v1.md`
- `docs/framework/framework-component-registry-proposal-v1.md`
- `docs/framework/templates/managed-project-white-label-launch-prompt-v1.md`
- `docs/framework/templates/local-review-packet-template-v1.md`

## Current gate and gaps

Architecture is owner-approved. `SFL-SOURCE-REVIEW-002` remains the implementation gate.

- Exact original Kit #3J binary is hash-identified but not yet archived in the repo.
- The 267 source line items require independent rendered-page review.
- Six official companion source locations are recorded, but their exact artifacts, hashes and line-item catalogs remain uncaptured.
- Inbox adoption is documentation-only; no target shell or reusable target components exist yet.
- PostgreSQL is accepted as the direction but is not provisioned, threat-modelled or migration-tested.
- Runtime, private workspace, executable schemas, forms engine, AI adapter, document export, service, filing, email, authentication, encryption, and automated source monitoring remain missing.
