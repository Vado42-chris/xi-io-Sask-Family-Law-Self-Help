# Execution Sequence v1

Status: `active gate sequence, recovery correction appended 2026-08-12`  
Project: `sask_family_law_self_help`

## Current gates

### SFL-BOOTSTRAP-001, framework-aligned startup spine

Acceptance:

- README, AGENTS, manifest, docs index, ledgers, lexicon, feature index, UI profile, capability profile, source record, risk register, and review packet exist.
- `npm run check` passes.
- No private case data is present.
- Owner or delegated reviewer approves the architecture and privacy boundaries.

Historical state at the July 22 checkpoint: `ready_for_review`.

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

### SFL-MAILBOX-SOURCE-DISCOVERY-001, direct government-sender source inventory

Purpose:

Identify public legal-source artifacts directly supplied through the owner's connected mailbox without copying private case correspondence into the public repository.

Current discovery result:

- Kit #2a, Preparing an Answer and Counter-Petition,
- Kit #3J, JCC Kit,
- Kit #4a, Replying to a Court Application,
- standalone Form 15-52 with supplied Rule 15-52,
- a dated Saskatoon Judicial Family Centre schedule poster as a procedural-reference candidate.

No other full self-help kit attachment was found in the direct-sender mailbox lane during the 2026-08-12 recovery search.

Current state: `completed_reported_only`; re-run when new source attachments arrive or provenance needs refresh.

### SFL-SOURCE-REVIEW-002, Kit #3J independent source verification

Acceptance:

- exact source binary is archived in the repository and its SHA-256 matches the receipt,
- all 267 line items are independently compared against rendered source pages,
- transcription differences are corrected through review receipts,
- required companion sources are captured from official sources or explicitly excluded with reasons,
- source discrepancies affecting service or filing are resolved or block the affected branch,
- official-current comparison date and reviewer are recorded,
- owner or delegated source reviewer approves the snapshot for schema implementation.

Current state: `blocked_on_review_and_missing_sources`.

### SFL-KIT-2A-SOURCE-RECOVERY-001, Preparing an Answer and Counter-Petition

Purpose:

Capture Kit #2a as a governed Petition-response workflow source, including form selection, supporting documents, service/proof paths, filing and post-filing process.

Acceptance:

- exact Kit #2a binary is archived and SHA-256 verified,
- current official-source comparison and freshness disposition are recorded,
- all nine physically included form instances are completely cataloged,
- Answer versus Answer-and-Counter-Petition selection is represented as reviewed deterministic rules,
- Form 15-47 Financial Statement conditions/schedules and Form 15-49 Property Statement structures are captured for this source or linked through reviewed equivalence,
- Form 15-51 conditional use is represented deterministically,
- response/extension, prerequisite, service, proof-of-service, filing and next-stage rules are captured and currentness-reviewed,
- Form 12-3/12-13 and Form 15-8A/15-18A source conflicts are resolved or leave affected runtime branches blocked,
- repeated forms are compared with Kit #3J and Kit #4a before reuse,
- rendered-page review and human source approval are complete.

Current state: `active_partial`; source identity, nine-form inventory and major workflow rules are recorded under `sources/intake/kit-2a/2023-04-10/`.

### SFL-KIT-4A-SOURCE-RECOVERY-001, Replying to a Court Application

Purpose:

Capture Kit #4a as a governed application-response workflow source, including both forms and the procedural logic that determines what a user must complete and do.

Acceptance:

- exact Kit #4a binary is archived and SHA-256 verified,
- current official-source comparison and freshness disposition are recorded,
- all four included forms are completely cataloged,
- all seven Form 15-47 schedules are completely cataloged,
- all 42 Form 15-47 situation-to-schedule relationships are independently verified,
- schedule-specific supporting-document obligations are captured,
- applicability, prerequisites, service, filing, hearing and post-hearing process is represented as source-bound deterministic rules,
- repeated forms are compared with other source families before reuse,
- source discrepancies affecting form identity, deadlines, service or filing are resolved or leave affected runtime branches blocked,
- rendered-page review and human source approval are complete.

Current state: `active_partial`; source identity and the unreviewed 42-row matrix are recorded under `sources/intake/kit-4a/2023-04-10/`.

### SFL-FORM-15-52-SOURCE-RECOVERY-001, Notice to Disclose

Purpose:

Govern the directly supplied standalone Form 15-52 together with its supplied Rule 15-52 instead of treating it as an ad hoc case attachment.

Acceptance:

- exact source binary is archived and SHA-256 verified,
- current official Rule 15-52 and Form 15-52 are located and compared,
- source revision date/currentness is established or remains explicitly unknown/blocked,
- every form field, disclosure choice, warning and address-for-service field has a stable source-bound ID,
- service/response, objection, correction and non-response branches are represented as reviewed source rules,
- dependencies on current Form 15-47 and Form 15-49 are explicit,
- rendered-page review and human source approval are complete.

Current state: `active_partial`; the four-page supplied artifact, 16 request choices and supplied rule meanings are captured as undated unreviewed intake.

### SFL-MULTI-KIT-SOURCE-001, independent source-family registry

Purpose:

Remove the first-slice assumption that one global `current_snapshot_id` can represent source truth for the whole product.

Acceptance:

- source families have independent stable identities and current/superseded states,
- forms can be related across snapshots through explicit equivalence/divergence records,
- no form is deduplicated solely by form number,
- each workflow resolves to exact governing source snapshots,
- stale state blocks only affected workflows/forms without falsely invalidating unrelated source families,
- validators reject ambiguous or missing governing source identity,
- intake-only sources cannot become runtime truth without reviewed promotion.

Current state: `planned_design_recorded`; required before any recovery intake is promoted to canonical runtime source truth.

### SFL-PROCEDURAL-REFERENCE-001, dated scheduling/reference artifacts

Purpose:

Define whether and how dated court posters or schedules are captured, refreshed and displayed without allowing stale schedule artifacts to masquerade as current court-calendar truth.

Current state: `queued`; the discovered Saskatoon April-August 2026 poster is not runtime-admissible.

## Recovery-adjusted ordered gates

| Order | Gate | Purpose | Entry requirement | Exit evidence |
|---|---|---|---|---|
| 1 | `SFL-FRAMEWORK-RECOVERY-001` | Recover current repo/framework truth | Existing repository | Recovery startup, migration/salvage maps, validation, approval |
| 2A | `SFL-SOURCE-REVIEW-002` | Finish Kit #3J source verification | Existing Kit #3J capture | Approved Kit #3J source receipt |
| 2B | `SFL-KIT-2A-SOURCE-RECOVERY-001` | Capture/review Kit #2a forms and Petition-response process | Direct mailbox Kit #2a | Approved Kit #2a source/workflow receipt |
| 2C | `SFL-KIT-4A-SOURCE-RECOVERY-001` | Capture/review Kit #4a forms and application-response process | Direct mailbox Kit #4a | Approved Kit #4a source/workflow receipt |
| 2D | `SFL-FORM-15-52-SOURCE-RECOVERY-001` | Capture/review Notice to Disclose form and rule | Direct mailbox Form 15-52 | Approved form/rule source receipt |
| 2E | `SFL-MULTI-KIT-SOURCE-001` | Establish multi-kit source semantics | Multiple source families identified | Registry validators and migration receipt |
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

The July 22 ordered sequence remains historical context. This recovery-adjusted sequence supersedes it for new work because the repository now has at least three independently versioned full-kit source families plus standalone procedural sources and material framework drift.

## Sequencing rules

- The governed unit is the source workflow or procedural source, not merely a blank form.
- Source capture and independent source review precede executable legal/procedural rules.
- Form-selection and schedule-selection rules must resolve to stable source-bound identities.
- A form shared by multiple kits is not automatically one canonical object; equivalence must be proven.
- A source contradiction affecting a deadline, filing package, service method, signature, fee or recipient blocks the affected runtime branch.
- Dated court schedules/posters are not current truth without freshness verification.
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

Continue `chore/framework-recovery-2026-08-12` with complete Kit #2a and Kit #4a source/process capture, current Form 15-52 comparison planning, multi-kit registry validation, Project Kernel namespace migration planning, and PR #5 salvage classification. Runtime implementation and PR #5 merge remain blocked.
