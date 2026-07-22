# SFL-UX-SHELL-001A: Synthetic Legal Workbench

Status: `implementation landed on feature branch, structural CI pending, owner visual review pending`  
Date: `2026-07-22`  
Branch: `feat/synthetic-legal-workbench-001`  
Product decision: `SFL_PRODUCT_ARCHITECTURE_LOCK_001_ACCEPTED`

## Purpose

Create the first locally previewable, target-owned family-law workbench using the locked Inbox-derived interaction grammar without modifying or coupling to `xi-io: Inbox`.

This pass is deliberately synthetic and read-only with respect to external systems. It demonstrates product shape and local interaction while `SFL-SOURCE-REVIEW-002` remains open.

## Implemented surfaces

```text
persistent top bar
  -> matter identity
  -> global search
  -> source/privacy/transmission state
  -> persistent Ibal entry

matter rail
  -> matter
  -> calendar
  -> tasks
  -> activity
  -> contacts
  -> settings

work queue
  -> forms
  -> homework tasks
  -> correspondence placeholders

selected work area
  -> guided questions
  -> section review
  -> paginated structural preview
  -> package manifest preview

context inspector
  -> stable source identity
  -> applicability rule
  -> current answer state
  -> source freshness
  -> AI/evidence boundary

Ibal drawer
  -> selected-context demonstration proposals
  -> affected stable ID
  -> evidence reference
  -> blocker
  -> next safe action
```

## Source use

The preview loads the six existing form catalogs directly from:

`/sources/jcc-kit-3j/2026-03-30/forms/`

It does not duplicate the 267 normalized line items into a separate UI fixture.

The work queue includes:

- FAM-PD #7-2
- Form 10-3 Draft Order
- Form 10-3 Draft Child Support Order
- Form 15-8B
- Form 12-3
- FAM-PD #7-5

The exact catalogs remain author-reviewed transcriptions pending independent page-level approval. The UI displays the source-review warning and does not claim court readiness.

## Synthetic fixture

`public/data/synthetic-matter.json` contains only fictional demonstration names, identifiers, answers, tasks, correspondence and activity.

The fixture is explicitly marked synthetic. No real matter, private evidence, email body, attachment, token, recipient or court submission is included.

## Interaction proof included

- selectable work queue
- form/question selection
- question-by-question navigation
- conditional-type-aware input controls
- local synthetic answer persistence in browser `localStorage`
- needs-help state
- calculated answer progress
- section grouping from stable line-item IDs
- page-style structural projection
- package blocker projection
- matter-scoped search
- route previews for Calendar, Tasks, Activity, Contacts and Settings
- contextual Ibal demonstration responses
- responsive layouts and reduced-motion handling

## Explicit boundaries

This pass does not implement:

- legal advice
- independent source verification
- executable applicability rules
- court-form fidelity rendering
- private matter security
- authentication or authorization
- PostgreSQL
- encrypted object storage
- evidence upload
- malware inspection
- OCR
- real AI provider calls
- typed patch acceptance
- document finalization
- signatures or commissioning
- PDF/DOCX export
- filing, service or email transmission
- court acceptance tracking

The page preview is a structural projection, not a substitute for the official form layout.

## Local preview

From the repository root:

```bash
npm run check
npm run preview
```

Open:

```text
http://127.0.0.1:4173/
```

The static server serves repository-root source catalogs and the public preview with a restrictive content-security policy.

## Files

- `public/index.html`
- `public/styles/legal-workbench.css`
- `public/src/legal-workbench.js`
- `public/data/synthetic-matter.json`
- `scripts/serve-preview.mjs`
- `scripts/check-preview.mjs`
- `package.json`

## Validation

`npm run check` now includes:

```text
check:foundation
check:source-catalog
check:preview
```

`check:preview` verifies:

- required preview files exist,
- all six current form catalogs are mapped,
- required four-surface UI and Ibal contract text exists,
- JavaScript and server modules pass `node --check`,
- preview JavaScript contains no remote URL,
- arbitrary `contenteditable` HTML is not used as form truth,
- the fixture is explicitly synthetic,
- task and correspondence examples exist.

A passing structural check does not prove browser quality, accessibility, security, legal accuracy or production readiness.

## Owner visual review

Owner should review at minimum:

1. overall resemblance to the accepted Inbox interaction grammar,
2. density and readability of the work queue,
3. usefulness of the form control header,
4. transitions among guided, section, page and package views,
5. contextual inspector value,
6. Ibal drawer placement and proposal structure,
7. progress visibility and motivational tone,
8. desktop and narrow-screen behaviour.

## Next passes

After this first visual proof:

1. browser and geometry smoke checks,
2. owner-directed shell correction,
3. source-review tooling and companion-form catalog completion,
4. executable question schema,
5. deterministic applicability and progress engine,
6. target-owned structured document block model,
7. private matter and object-vault threat model.

No merge or deployment is authorized by this receipt.
