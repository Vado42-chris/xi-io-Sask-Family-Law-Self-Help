# SFL-SOURCE-COVERAGE-AUDIT-001D

Status: `implemented, deterministic structural audit, legal review still pending`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent gate: `SFL-SOURCE-REVIEW-002`

## Purpose

Add a repeatable audit that inspects every normalized line item across the six currently captured Kit #3J form catalogs before later runtime and database work relies on those catalogs.

This pass does not approve the transcription. It makes omissions, unsupported vocabulary, duplicate IDs and unresolved rule classes easier to detect automatically.

## Implementation

Added:

- `scripts/check-source-coverage.mjs`
- `npm run check:source-coverage`
- source coverage audit in the standard `npm run check` chain

The audit reads every JSON form catalog under:

```text
sources/jcc-kit-3j/2026-03-30/forms/
```

It verifies:

1. Exactly six current form catalogs are present.
2. The combined line-item count remains exactly 267.
3. Every form has an ID, official number and title.
4. Each declared `line_item_count` matches the actual array length.
5. Every line item has a stable ID, source label, kind and required rule.
6. Line-item IDs are unique within each form.
7. Every required rule belongs to the currently supported review vocabulary.
8. `conditional_or_optional` rules remain explicitly visible as unresolved obligations.
9. Counts by form, kind and rule class are emitted into CI logs for review.

## Supported review vocabulary

```text
always
optional
display_only
court_only
conditional:<expression>
conditional_or_optional:<review obligation>
```

A future catalog introducing a different rule shape will fail the check rather than silently entering the wizard.

## Safety boundaries

- No source catalog content was changed.
- No legal meaning was inferred for unresolved rules.
- No companion form was reconstructed.
- No real matter data was read or written.
- No network, AI provider, database, email, filing or service path was added.
- `xi-io: Inbox` remained read-only and untouched.

## Evidence meaning

A passing audit proves that the current normalized catalogs are structurally enumerable and use an explicit vocabulary. It does not prove:

- that the 267 line items are accurately transcribed,
- that every source question was captured,
- that the source remains current,
- that conditional rules are legally interpreted correctly,
- that the forms are court-ready,
- or that an independent human reviewer has approved them.

## Next safe step

Use the emitted inventory as the input to the independent rendered-page review. Each reviewed source item should receive a disposition tied to its stable line-item ID, with corrections recorded through a new catalog version and review receipt rather than silent replacement.
