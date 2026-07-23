# SFL-SOURCE-REVIEW-WORKBOOK-001E

Status: `implemented, independent review still pending`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent gate: `SFL-SOURCE-REVIEW-002`

## Purpose

Turn the six current Kit #3J catalogs and all 267 normalized line items into a deterministic reviewer workbook without editing the canonical catalogs.

The workbook is intended for page-by-page source verification. It separates review evidence from source data and provides explicit dispositions for every line item.

## Implementation

Added:

- `scripts/source-review-workbook.mjs`
- `npm run source-review:init`
- `npm run check:source-review-workbook`
- source-review workbook validation in the standard `npm run check` chain

The generator reads:

- `sources/jcc-kit-3j/2026-03-30/forms-index.json`
- all six catalogs under `sources/jcc-kit-3j/2026-03-30/forms/`

It creates one review entry for every stable line-item ID, including:

- form identity and source pages
- stable review key
- source label
- field kind
- applicability rule
- options, when present
- rendered-source verification state
- transcription verification state
- rule verification state
- reviewer and review date
- correction proposal
- dispute or blocker
- evidence reference
- notes

## Allowed dispositions

```text
pending
verified
corrected
disputed
blocked
not_applicable
```

`corrected` does not mutate the captured catalog. A correction must be carried into a new catalog version with a receipt and source comparison.

## Usage

Create a public source-review workbook:

```bash
npm run source-review:init -- \
  --output data/source-review/jcc-kit-3j-2026-03-30-review.json \
  --reviewer "Reviewer name" \
  --review-date 2026-07-23
```

Run the non-writing structural audit:

```bash
npm run check:source-review-workbook
```

## Deterministic acceptance

The check fails unless:

1. The snapshot ID is `jcc-kit-3j-2026-03-30`.
2. Exactly six form catalogs are represented.
3. Exactly 267 review entries are generated.
4. Each form's generated entry count matches its declared catalog count.
5. Every review key is unique.
6. Every entry retains its stable line-item ID, source label, kind and rule.
7. Every disposition belongs to the controlled review vocabulary.

## Safety boundaries

- Canonical source catalogs remain read-only.
- No real matter answers are read or written.
- No private evidence is included.
- No legal meaning is inferred from unresolved rules.
- No source item is marked verified automatically.
- No court-readiness claim is created.
- No database, AI provider, email, filing, service, deployment or merge was introduced.
- `xi-io: Inbox` remained read-only and untouched.

## Remaining review gate

The workbook creates the review surface, not the review result. An independent reviewer must still compare each entry to the rendered official source page and record a disposition. Companion forms outside the current 267-item snapshot remain a separate capture obligation.
