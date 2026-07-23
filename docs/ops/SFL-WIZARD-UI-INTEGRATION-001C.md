# SFL-WIZARD-UI-INTEGRATION-001C: Visible Deterministic Wizard Integration

Status: `implemented on feature branch, CI pending, owner visual review pending`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent receipts: `SFL-WIZARD-RULES-001A`, `SFL-WIZARD-STATE-001B`

## Purpose

Connect the browser workbench to the deterministic applicability and wizard-state modules so the visible experience no longer navigates or measures the raw source catalog as though every line item applied to every user.

## Implemented

`public/src/legal-workbench.js` now imports and consumes:

- `aggregateMatterWizardProgress`,
- `buildWizardState`,
- `reconcileWizardSelection`.

The visible workbench now:

1. evaluates all six current catalogs whenever synthetic answers change,
2. creates one wizard-state projection per form,
3. navigates only applicable, user-answerable questions,
4. excludes display-only and court-only items from guided progress,
5. calculates form and matter progress from the applicable set,
6. distinguishes unanswered blockers, needs-help items and unresolved source obligations,
7. preserves the selected question when it remains applicable,
8. moves to the next deterministic blocker when a controlling answer removes the selected question,
9. uses applicable questions in section review and structural page preview,
10. uses evaluated blockers in validation and package preview,
11. shows the evaluation reason, condition path, expected value and current value in the inspector,
12. passes the evaluated reason into Ibal's selected-context display.

The source catalogs remain unchanged and continue to be loaded from the dated Kit #3J snapshot.

## Validation additions

`scripts/check-preview.mjs` now checks that:

- the browser imports all three wizard-state integration functions,
- the visible UI contains applicability-aware progress and blocker language,
- the inspector exposes evaluation reason and condition values,
- raw catalog index navigation is absent,
- visible question position does not use the raw line-item count,
- all browser modules pass `node --check`,
- no remote URL is introduced,
- no arbitrary `contenteditable` canonical state is introduced.

## Boundaries

This pass does not:

- approve the legal correctness of any branching rule,
- change or independently review the 267 source line items,
- capture the six companion forms,
- implement a database or private evidence vault,
- call an AI provider,
- generate a court-ready document,
- finalize, print, download, email, file or serve anything,
- modify `xi-io: Inbox`,
- merge or deploy.

## Known limitations

- The browser check is structural and syntax-based, not a real browser interaction or accessibility proof.
- Conditional rule coverage remains limited to the currently supported equality and inequality grammar.
- `conditional_or_optional` rules remain visible but unresolved until source review supplies a deterministic interpretation.
- Static and court-only source material is not yet shown in the guided wizard, although it remains available in the canonical catalogs.
- The structural page preview is not a pixel-accurate official-form renderer.

## Next safe pass

Run a browser-level synthetic interaction proof for controlling-answer changes, keyboard navigation, focus continuity, live-region messaging and responsive geometry. Record screenshots or an owner review receipt before promoting the draft PR beyond preview status.
