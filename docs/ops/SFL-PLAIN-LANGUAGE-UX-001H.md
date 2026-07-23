# SFL-PLAIN-LANGUAGE-UX-001H

Status: `implemented, owner visual review pending`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent: `SFL-PRIVATE-PREVIEW-LOCK-001G`

## Purpose

Make plain language and progressive disclosure the default experience for a stressed self-represented user without changing the canonical court-form catalogs, applicability engine, private matter data, or audit records.

## User-facing changes

The default surface now uses familiar language:

- `Family Law Assistant` rather than an engineering-oriented workbench title
- `Your next steps` and `Preparing for your JCC`
- `Today / Forms / Evidence / Messages / All work`
- `Continue / Check my work / View form`
- `Questions / Review answers / View form / Prepare package`
- `Save and continue`
- `Official form details` rather than `Source and audit details`
- `Private on this computer` without endpoint or filesystem language

The question surface hides field types and raw applicability rules. Selected common legal questions receive deterministic plain-language presentation copy while the exact official wording remains available in the right-side help panel.

## Progressive disclosure

Hidden by default in user mode:

- developer trust tokens
- raw source page and capture metadata in the form header
- field-kind labels such as `boolean`
- raw applicability expressions
- revision/reset controls
- detailed Ibal proposal metadata

These changes affect presentation only. Canonical source wording, stable IDs, rules, source snapshots, page previews, and reviewer data remain unchanged and available through explicit form-detail surfaces.

## Files

- `public/index.html`
- `public/styles/user-mode.css`
- `public/src/user-language-layer.js`
- `scripts/check-user-language.mjs`
- `package.json`

## Validation contract

`npm run check:user-language` verifies:

1. user mode is enabled in the public shell
2. the plain-language stylesheet and module are loaded
3. key user-facing actions use non-developer language
4. known developer phrases are absent from the static default shell
5. technical elements are hidden by default
6. the presentation layer has no fetch, storage, private API, or private path access
7. canonical source data is not mutated

The standard `npm run check` chain now includes this gate.

## Safety boundaries

- no canonical catalog changes
- no applicability or question-state changes
- no private matter data read or written
- no authentication, database, AI provider, export, email, filing, or service work
- no change to `xi-io: Inbox`
- no merge or deployment

## Remaining work

- owner visual review at desktop and narrow widths
- replace more form-specific labels with reviewed plain-language prompts
- conduct keyboard and screen-reader proof
- design a deliberate reviewer/developer mode rather than relying only on hidden controls
- continue the independent 267-line-item source review
