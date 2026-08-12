# Execution Sequence v1

Status: `active gate sequence, recovery correction appended 2026-08-12`  
Project: `sask_family_law_self_help`

## Current gates

### SFL-BOOTSTRAP-001, framework-aligned startup spine

Acceptance:

- README, AGENTS, manifest, docs index, ledgers, lexicon, feature index, UI profile, capability profile, source record, risk register, and review packet exist.
- `npm run check` passes.
- No private case data is present.
- Runtime is accurately marked `not_started`.
- Owner or delegated reviewer approves the architecture and privacy boundaries.

Historical state at the July 22 checkpoint: `ready_for_review`, foundation check previously passed, runtime not checked.

### SFL-SOURCE-CAPTURE-001, dated Kit #3J source inventory

Acceptance:

- source snapshot ID, printed source date, capture timestamp, file size, and SHA-256 are recorded,
- all forms physically included in the supplied kit are indexed,
- every included form has a stable line-item catalog,
- missing companion forms and source discrepancies remain explicit,
- user-facing freshness disclosure is specified,
- structural validation checks snapshot and catalog consistency.

Current state: `completed_reported_only`, six forms and 267 line items captured, human source review not complete.

### SFL-SOURCE-REVIEW-002, Kit #3J independent source verification

Acceptance:

- exact source binary is archived in the repository and its SHA-256 matches the receipt,
- all 267 line items are independently compared against rendered source pages,
- transcription differences are corrected through review receipts,
- FAM-PD #7-1, FAM-PD #7-3, FAM-PD #7-4, Form 15-8A, Form 15-47, and Form 15-49 are captured from official sources or explicitly excluded with reasons,
- source discrepancies affecting service or filing are resolved or block the affected branch,
- official-current comparison date and reviewer are recorded,
- owner or delegated source reviewer approves the snapshot for schema implementation.

Current state: `blocked_on_review_and_missing_sources`.

### SFL-FRAMEWORK-RECOVERY-001, existing-project rehydration

Purpose:

Bring the repository forward from its 2026-07-22 framework checkpoint without pretending it is a blank new project.

Acceptance:

- recovery startup record identifies exact repo/branch/framework state,
- legacy `xi/` contracts are inventoried and a non-destructive `xiio/` migration map exists,
- current framework dependencies and blockers are explicit,
- stale README/AGENTS/manifest/profile claims are corrected through reviewed changes,
- PR #5 has a bounded salvage map rather than being treated as one merge unit,
- branch cleanup candidates are re-verified before deletion,
- validation and human approval precede merge.

Current state: `active`.

### SFL-KIT-4A-SOURCE-RECOVERY-001, Replying to a Court Application

Purpose:

Capture Kit #4a as a governed workflow source, including both its forms and the procedural logic that determines what a user must complete and do.

Acceptance:

- exact supplied Kit #4a binary is archived and SHA-256 verified,
- current official-source comparison and freshness disposition are recorded,
- all four included forms are completely cataloged,
- all seven Form 15-47 schedules are completely cataloged,
- all 42 Form 15-47 situation-to-schedule relationships are independently verified,
- schedule-specific supporting-document obligations are captured,
- Kit #4a applicability, prerequisites, service, filing, hearing and post-hearing process is represented as source-bound deterministic rules,
- Form 15-8B and Form 12-3 are compared with other snapshots before any cross-snapshot reuse,
- source discrepancies affecting form identity, deadlines, service or filing are resolved or leave affected runtime branches blocked,
- rendered-page review and human source approval are complete.

Current state: `active_partial`; source identity and the unreviewed 42-row matrix are recorded under `sources/intake/kit-4a/2023-04-10/`, full review/capture remains open.

### SFL-MULTI-KIT-SOURCE-001, independent source-family registry

Purpose:

Remove the first-slice assumption that one global `current_snapshot_id` can represent current source truth for the whole product.

Acceptance:

- source families have independent stable identities and current/superseded states,
- forms can be related across snapshots through explicit equivalence/divergence records,
- no form is deduplicated solely by form number,
- each workflow resolves to exact governing source snapshots,
- stale state can block only affected workflows/forms without falsely invalidating unrelated source families,
- validators reject ambiguous or missing governing source identity.

Current state: `planned`; required before Kit #4a intake is promoted to canonical runtime source truth.

## Recovery-adjusted ordered gates

| Order | Gate | Purpose | Entry requirement | Exit evidence |
|---|---|---|---|---|
| 1 | `SFL-FRAMEWORK-RECOVERY-001` | Recover current repo/framework truth | Existing repository | Recovery startup, migration/salvage maps, validation, approval |
| 2A | `SFL-SOURCE-REVIEW-002` | Finish Kit #3J source verification | Existing Kit #3J capture | Approved Kit #3J source receipt |
| 2B | `SFL-KIT-4A-SOURCE-RECOVERY-001` | Capture/review Kit #4a forms and process | Owner-supplied Kit #4a | Approved Kit #4a source/workflow receipt |
| 2C | `SFL-MULTI-KIT-SOURCE-001` | Establish multi-kit source semantics | At least two source families identified | Registry validators and migration receipt |
| 3 | `SFL-SCHEMA-001` | Make workflow and matter schemas executable | Applicable source families reviewed and registry semantics accepted | Schema validators and synthetic fixtures |
| 4 | `SFL-TRIAGE-001` | Human-only applicability and form-selection triage | Schemas accepted | Tested source-bound decision tree and explanation output |
| 5 | `SFL-TASKPLAN-001` | Generate deterministic forms, schedules, evidence and homework plan | Triage accepted | Synthetic task-plan fixtures and dependency/deadline tests |
| 6 | `SFL-UX-001` | Progressive-disclosure shell | Human-only logic accepted | Keyboard, screen-reader, responsive and cognitive-load QA |
| 7 | `SFL-DRAFT-001` | User-controlled narrative drafting | Private data boundary approved | Draft provenance and approval receipts |
| 8 | `SFL-FORMS-001` | Map approved facts into exact form templates | Source/form review accepted | Field-map and rendered-form comparison tests |
| 9 | `SFL-PRIVATE-001` | Private matter workspace | Threat model and retention policy approved | Encryption, deletion, recovery and isolation evidence |
| 10 | `SFL-AI-001` | Optional AI adapter | Consent and provider contract approved | Redaction, fallback, disable, cost and provider tests |
| 11 | `SFL-EGRESS-001` | Package generation only | Form review accepted | Manifested export package and receipt |
| 12 | `SFL-TRANSMIT-001` | Any filing, service or email proposal | Receiving process independently verified | Human approval, delivery, acceptance and rollback receipts |

The July 22 ordered sequence remains historical context. This recovery-adjusted sequence supersedes it for new work because the repository now has a second source family and material framework drift.

## Sequencing rules

- The governed unit is the source workflow, not merely a blank form.
- Source capture and independent source review precede executable legal/procedural rules.
- Form-selection and schedule-selection rules must resolve to stable source-bound identities.
- A form shared by multiple kits is not automatically one canonical object; equivalence must be proven.
- A source contradiction affecting a deadline, filing package, service method, signature or recipient blocks the affected runtime branch.
- Human-only logic precedes AI enhancement.
- Deterministic workflow selection precedes narrative generation.
- Synthetic fixtures precede real private data.
- Package generation precedes transmission.
- A passing build or catalog check is evidence, not legal-content approval.
- Unknown, stale, changed, unavailable or disputed source state blocks affected finalization paths.
- A new source version creates a new snapshot and diff. It never overwrites the prior snapshot.
- Legal, privacy, security, accessibility and source-version reviews are explicit gates.
- PR #5 may be salvaged only after its dependencies are mapped to these gates.

## Current next action

Continue `chore/framework-recovery-2026-08-12` with multi-kit registry design, Kit #4a complete form/process capture, Project Kernel namespace migration planning, and PR #5 salvage classification. Runtime implementation and PR #5 merge remain blocked.
