# SFL-WIZARD-STATE-001B: Applicability-Aware Wizard State

Status: `implemented on feature branch, CI pending, visible UI integration still pending`  
Date: `2026-07-22`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent: `SFL-WIZARD-RULES-001A`

## Purpose

Convert deterministic line-item applicability results into a stable wizard navigation, progress, blocker and selection-reconciliation model. This provides the state layer the visible workbench can consume without duplicating legal rules in UI code.

## Implemented

`public/src/wizard-state.js` now:

- builds an ordered navigation list containing only applicable, user-answerable line items,
- excludes display-only and court-only fields from user progress,
- preserves source labels, kinds, required rules and evaluation reasons,
- distinguishes answered, needs-help, blocking and unresolved-obligation states,
- calculates applicability-aware completion percentages,
- selects the next unresolved blocking question deterministically,
- reconciles selection when a controlling answer removes the currently selected conditional question,
- aggregates progress across all six captured forms.

The module is pure. It does not access the DOM, local storage, networks, files, providers or external systems.

## Validation

`scripts/check-wizard-state.mjs` verifies with the synthetic matter fixture that:

1. only applicable answerable questions enter wizard navigation,
2. expedited explanation is absent for `NO` and appears for `YES`,
3. parenting-time detail disappears when its controlling answer changes to false,
4. support-dependent financial disclosure remains active for a support claim,
5. needs-help items remain visible but are not misclassified as unanswered blockers,
6. an applicable selection is preserved,
7. a newly inapplicable selection is moved to the next safe question,
8. answering the next blocker increases completion without reducing progress,
9. aggregate progress covers all six current form catalogs,
10. unsupported rule syntax remains a failing condition.

The check is now part of `npm run check` through `check:wizard-state`.

## Boundaries

This pass does not:

- alter the source catalogs,
- approve any branching rule as legally correct,
- wire the state projection into the visible browser wizard,
- store real matter data,
- connect PostgreSQL or object storage,
- call an AI provider,
- generate, finalize, send, serve or file a document.

## Next safe pass

Replace the preview's broad line-item indexing with this wizard-state projection so guided navigation, progress, validation and the inspector visibly respond when controlling answers change.

That integration must keep a user on a valid question, announce newly applicable or removed questions, and preserve the active source-review warning.
