# Execution Sequence v1

Status: `active gate sequence`  
Project: `sask_family_law_self_help`

## Current gates

### SFL-BOOTSTRAP-001, framework-aligned startup spine

Acceptance:

- README, AGENTS, manifest, docs index, ledgers, lexicon, feature index, UI profile, capability profile, source record, risk register, and review packet exist.
- `npm run check` passes.
- No private case data is present.
- Runtime is accurately marked `not_started`.
- Owner or delegated reviewer approves the architecture and privacy boundaries.

Current state: `ready_for_review`, foundation check previously passed, runtime not checked.

### SFL-SOURCE-CAPTURE-001, dated Kit #3J source inventory

Acceptance:

- source snapshot ID, printed source date, capture timestamp, file size, and SHA-256 are recorded,
- all forms physically included in the supplied kit are indexed,
- every included form has a stable line-item catalog,
- missing companion forms and source discrepancies remain explicit,
- user-facing freshness disclosure is specified,
- structural validation checks snapshot and catalog consistency.

Current state: `completed_reported_only`, six forms and 267 line items captured, validation pending CI, human source review not complete.

### SFL-SOURCE-REVIEW-002, independent source verification

Acceptance:

- exact source binary is archived in the repository and its SHA-256 matches the receipt,
- all 267 line items are independently compared against rendered source pages,
- transcription differences are corrected through review receipts,
- FAM-PD #7-1, FAM-PD #7-3, FAM-PD #7-4, Form 15-8A, Form 15-47, and Form 15-49 are captured from official sources or explicitly excluded with reasons,
- source discrepancies affecting service or filing are resolved or block the affected branch,
- official-current comparison date and reviewer are recorded,
- owner or delegated source reviewer approves the snapshot for schema implementation.

Current state: `blocked_on_review_and_missing_sources`.

## Ordered gates

| Order | Gate | Purpose | Entry requirement | Exit evidence |
|---|---|---|---|---|
| 1 | `SFL-BOOTSTRAP-001` | Governance spine | Repo exists | Foundation check and review approval |
| 2 | `SFL-SOURCE-CAPTURE-001` | Create dated immutable source identity and complete included-form line-item inventory | Bootstrap branch exists | Snapshot registry, six catalogs, source receipt, structural check |
| 3 | `SFL-SOURCE-REVIEW-002` | Verify transcription, archive original, and capture companion forms | Source capture exists | Human review receipt, official comparison, approved snapshot |
| 4 | `SFL-SCHEMA-001` | Make workflow and matter schemas executable | Source review approved | Schema validators and synthetic fixtures |
| 5 | `SFL-TRIAGE-001` | Human-only eligibility triage | Schemas accepted | Tested decision tree and explanation output |
| 6 | `SFL-TASKPLAN-001` | Generate deterministic form and homework plan | Triage accepted | Synthetic task-plan fixtures and tests |
| 7 | `SFL-UX-001` | Progressive-disclosure shell | Human-only logic accepted | Keyboard, screen-reader, responsive, and cognitive-load QA |
| 8 | `SFL-DRAFT-001` | User-controlled narrative drafting | Private data boundary approved | Draft provenance and approval receipts |
| 9 | `SFL-FORMS-001` | Map approved facts into form templates | DocuForge boundary reviewed | Field-map and export tests |
| 10 | `SFL-PRIVATE-001` | Private matter workspace | Threat model and retention policy approved | Encryption, deletion, recovery, and isolation evidence |
| 11 | `SFL-AI-001` | Optional AI adapter | Consent and provider contract approved | Redaction, fallback, disable, cost, and provider tests |
| 12 | `SFL-EGRESS-001` | Package generation only | Form review accepted | Manifested export package and receipt |
| 13 | `SFL-TRANSMIT-001` | Any filing, service, or email proposal | Receiving process independently verified | Human approval, delivery, acceptance, and rollback receipts |

## Sequencing rules

- Source capture and independent source review precede executable schemas.
- Human-only logic precedes AI enhancement.
- Deterministic workflow selection precedes narrative generation.
- Synthetic fixtures precede real private data.
- Package generation precedes transmission.
- A passing build or catalog check is evidence, not legal-content approval.
- Unknown, stale, changed, unavailable, or disputed source state blocks finalization.
- A new source version creates a new snapshot and diff. It never overwrites the prior snapshot.
- Legal, privacy, security, accessibility, and source-version reviews are explicit gates.

## Current next action

Run the stacked source-capture pull request through `npm run check`, then perform `SFL-SOURCE-REVIEW-002`. Runtime implementation remains blocked.
