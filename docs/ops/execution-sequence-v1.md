# Execution Sequence v1

Status: `active gate sequence`  
Project: `sask_family_law_self_help`

## Current gate

### SFL-BOOTSTRAP-001, framework-aligned startup spine

Acceptance:

- README, AGENTS, manifest, docs index, ledgers, lexicon, feature index, UI profile, capability profile, source record, risk register, and review packet exist.
- `npm run check` passes.
- No private case data is present.
- Runtime is accurately marked `not_started`.
- Owner or delegated reviewer approves the architecture and privacy boundaries.

Current state: `ready_for_review`, runtime not checked.

## Ordered gates

| Order | Gate | Purpose | Entry requirement | Exit evidence |
|---|---|---|---|---|
| 1 | `SFL-BOOTSTRAP-001` | Governance spine | Repo exists | Foundation check and review approval |
| 2 | `SFL-SOURCE-001` | Verify Kit #3J source, version, checksum, and update rule | Bootstrap approved | Source receipt and stale-source behavior |
| 3 | `SFL-SCHEMA-001` | Make workflow and matter schemas executable | Source verified | Schema validators and synthetic fixtures |
| 4 | `SFL-TRIAGE-001` | Human-only eligibility triage | Schemas accepted | Tested decision tree and explanation output |
| 5 | `SFL-TASKPLAN-001` | Generate deterministic form and homework plan | Triage accepted | Synthetic task-plan fixtures and tests |
| 6 | `SFL-UX-001` | Progressive-disclosure shell | Human-only logic accepted | Keyboard, screen-reader, responsive, and cognitive-load QA |
| 7 | `SFL-DRAFT-001` | User-controlled narrative drafting | Private data boundary approved | Draft provenance and approval receipts |
| 8 | `SFL-FORMS-001` | Map approved facts into form templates | DocuForge boundary reviewed | Field-map and export tests |
| 9 | `SFL-PRIVATE-001` | Private matter workspace | Threat model and retention policy approved | Encryption, deletion, recovery, and isolation evidence |
| 10 | `SFL-AI-001` | Optional AI adapter | Consent and provider contract approved | Redaction, fallback, disable, cost, and provider tests |
| 11 | `SFL-EGRESS-001` | Package generation only | Form review accepted | Manifested export package and receipt |
| 12 | `SFL-TRANSMIT-001` | Any filing, service, or email proposal | Receiving process independently verified | Human approval, delivery, acceptance, and rollback receipts |

## Sequencing rules

- Human-only logic precedes AI enhancement.
- Deterministic workflow selection precedes narrative generation.
- Synthetic fixtures precede real private data.
- Package generation precedes transmission.
- A passing build is evidence, not product approval.
- Unknown or stale source state blocks finalization.
- Legal, privacy, security, accessibility, and source-version reviews are explicit gates.

## Current next action

Run `npm run check`, review the bootstrap PR, then close or revise `SFL-BOOTSTRAP-001`.
