# SFL-PRODUCT-ARCHITECTURE-LOCK-001

Status: `OWNER APPROVED`  
Decision token: `SFL_PRODUCT_ARCHITECTURE_LOCK_001_ACCEPTED`  
Date: `2026-07-22`  
Repository: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`

## Owner direction

The owner reviewed the proposed Inbox-derived legal workbench, Ibal role, PostgreSQL/object-vault direction, progress model, ongoing correspondence ingress and one-package-per-egress-event model and directed:

> This sounds perfect and much more organized than what we started with. Let's lock it all in so it doesn't just exist in this conversation and proceed.

## Decisions locked

- `xi-io Inbox` is a pinned, read-only interaction and control-plane donor.
- The Inbox repository will not be modified, forked wholesale or used as a runtime dependency.
- The legal workspace adopts `matter scope -> work queue -> selected artifact -> contextual inspector/Ibal`.
- The email-reader region becomes a structured, paginated legal document workspace.
- The email-header anatomy becomes form metadata and controls, not canonical form storage.
- Every applicable official question remains bound to a stable reviewed line-item ID.
- New forms begin as deterministic, resumable wizards with visible progress and next-safe actions.
- Ibal may explain and propose typed patches but may not silently edit, approve, sign, file, serve or send.
- PostgreSQL is the planned structured runtime database.
- An encrypted private object vault stores original and generated file bytes.
- Evidence ingress preserves originals and separates deterministic metadata from AI analysis.
- Each filing, service, export or delivery is a separate finalized package with its own approval and receipt.
- Ongoing correspondence creates immutable ingress events and may generate new tasks or revisions without changing prior submissions.
- User sign-off, revision binding, hashes, ledgers and receipts are required at material boundaries.
- Progress, deadlines, blockers and motivation support are hard product requirements.

## Canonical artifacts

- `docs/product/product-vision-locked-v1.md`
- `docs/architecture/inbox-pattern-adoption-and-legal-workbench-v1.md`
- `docs/architecture/adr-001-postgresql-runtime-catalog-v1.md`
- `docs/source-materials/inbox-pattern-source-map-v1.md`
- `project-tracking/decision-ledger.md`
- `project-tracking/open-work-ledger.md`

## Approval scope

This receipt approves the product and architecture direction. It does not assert:

- that the court sources are current or legally approved,
- that all form questions have completed independent review,
- that PostgreSQL, object storage or encryption have been implemented,
- that any reusable Inbox code has passed target-repository review,
- that a filing, service or email adapter is authorized,
- that runtime, security, accessibility or deployment proof exists.

## Next gate

Proceed with `SFL-SOURCE-REVIEW-002`:

1. archive exact official source artifacts,
2. capture the six companion forms,
3. extract every line item,
4. perform independent page-level comparison,
5. resolve or block source discrepancies,
6. issue a reviewed source approval receipt.

Only after that gate may executable schemas and the synthetic legal workbench shell begin.
