# SFL-WIZARD-RULES-001A: Deterministic Applicability Foundation

Status: `implemented on feature branch, CI pending, not yet wired into visible wizard progress`  
Date: `2026-07-22`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent preview: `SFL-UX-SHELL-001A`

## Purpose

Create the first executable deterministic rule layer for deciding whether a captured form line item is applicable. This removes the need for the future wizard to infer branching from display text or ask an AI model to decide which questions apply.

## Implemented

`public/src/applicability-engine.js` now provides pure functions for:

- normalizing scalar rule values,
- flattening form answers and derived matter facts into a bounded rule context,
- evaluating equality and inequality conditions,
- evaluating `always`, `optional`, `display_only`, and `conditional:` required rules,
- evaluating every line item in one form catalog,
- reporting unsupported rule syntax rather than silently treating it as valid,
- deriving the first matter facts used by Kit #3J conditions.

The engine does not mutate answers, UI state, source catalogs, external systems, or private data.

## Catalog-wide audit

`scripts/check-applicability-engine.mjs` loads all six captured form catalogs and checks all 267 line items.

The check verifies:

1. every current `required_rule` uses supported deterministic syntax,
2. conditional child-detail questions deactivate when their controlling choice is false,
3. parenting-time details activate when parenting time is selected,
4. expedited explanation activates only when expedited treatment is selected,
5. support disclosure questions activate from derived support-claim state,
6. a changed answer deterministically changes the applicable branch,
7. the audit total remains exactly 267 line items across six catalogs.

Any unsupported rule now fails `npm run check` with the affected stable line-item ID and source rule.

## Current supported grammar

```text
always
optional
display_only
conditional:<stable_id>=<scalar>
conditional:<stable_id>!=<scalar>
conditional:<derived_fact>=<scalar>
```

Scalar normalization currently supports booleans, YES/NO, numbers, and exact text values.

## Boundary

This pass proves deterministic parsing and branch evaluation only.

It does not prove:

- that the source transcription is legally correct,
- that each branching rule has been independently approved,
- that all future forms will fit the current grammar,
- that visible wizard progress is already applicability-aware,
- that a derived matter fact is legally sufficient,
- that any form is complete or court-ready.

Unsupported future syntax must fail closed and receive a reviewed grammar extension. It must never be guessed by Ibal or silently treated as applicable.

## Next integration step

Wire the engine into the visible preview so that:

- guided navigation skips inapplicable questions,
- progress counts only applicable answerable questions,
- changing a controlling answer visibly adds or removes dependent questions,
- newly applicable questions cannot remain hidden,
- the inspector shows the evaluated condition, actual value, and reason,
- validation distinguishes missing applicable answers from intentionally inapplicable fields.

That integration remains synthetic-only and must preserve the active source-review warning.
