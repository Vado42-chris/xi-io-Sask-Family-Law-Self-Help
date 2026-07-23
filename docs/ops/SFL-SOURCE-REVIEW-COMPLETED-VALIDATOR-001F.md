# SFL-SOURCE-REVIEW-COMPLETED-VALIDATOR-001F

Status: `implemented, independent review still pending`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent: `SFL-SOURCE-REVIEW-WORKBOOK-001E` / gate `SFL-SOURCE-REVIEW-002`

## Purpose

Add a deterministic disposition validator for source-review workbooks so a `verified` claim cannot pass without the minimum evidence fields identified in the peer-review next step.

## Rules enforced

For disposition `verified`, every entry must include:

1. Non-empty `reviewer`
2. `reviewed_at` as a real calendar date (`YYYY-MM-DD`, not merely a matching pattern)
3. `rendered_source_verified=true`
4. `transcription_verified=true`
5. `rule_verified=true`
6. Non-empty `evidence_reference`

Additional controlled rules:

- `pending` must not set rendered/transcription/rule verified flags to true
- `corrected` requires `correction_proposed`, `evidence_reference`, rendered-source confirmation, reviewer, and date
- `disputed` requires `dispute_or_blocker`, `evidence_reference`, reviewer, and date
- `blocked` requires `dispute_or_blocker` or `notes`, plus reviewer and date
- `not_applicable` requires `notes` or `source_location_note`, plus reviewer and date
- `verified` must not carry `correction_proposed` (use `corrected` instead)

A `corrected` disposition still does not mutate canonical catalogs.

## Commands

Structural workbook generation audit (unchanged intent):

```bash
npm run check:source-review-workbook
```

Disposition gate audit (new):

```bash
npm run check:source-review-completed
```

Validate a saved workbook file:

```bash
npm run source-review:validate -- --validate-file data/source-review/jcc-kit-3j-2026-03-30-review.json
```

## Check-chain position

`npm run check` now includes:

1. foundation
2. source-catalog
3. source-coverage
4. source-review-workbook (structure)
5. source-review-completed (disposition fixtures + generated all-pending workbook)
6. applicability
7. wizard-state
8. preview

## Safety boundaries

- No line item is auto-marked verified
- Passing the disposition audit on a pending workbook does not close `SFL-SOURCE-REVIEW-002`
- No real matter data is read or written
- No court-readiness claim is created
- Companion-form gaps remain outside this validator

## Remaining gate

Independent reviewers must still complete rendered-page comparison for all 267 entries. This pass only prevents invalid verification claims in workbook JSON.
