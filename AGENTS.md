# AGENTS.md

## Read order

Before changing this repository, read:

1. `README.md`
2. `docs/INDEX.md`
3. `sources/source-registry.json`
4. `sources/jcc-kit-3j/2026-03-30/forms-index.json`
5. `docs/source-materials/source-capture-and-freshness-standard-v1.md`
6. `xi/managed-project.manifest.yaml`
7. `docs/ops/execution-sequence-v1.md`
8. `docs/architecture/privacy-and-data-boundary-v1.md`
9. `docs/legal/legal-information-boundary-v1.md`
10. `project-tracking/open-work-ledger.md`

The canonical framework reference is `Vado42-chris/xi-io.net`. Chat history is context, not project truth.

## Project role

This project converts official, versioned Saskatchewan family-law self-help material into guided, auditable workflows. The first reference slice is Kit #3J for requesting a Judicial Case Conference.

## Product invariant

The immutable source snapshot, approved normalized line-item catalog, deterministic workflow definition, and verified user facts are the source of truth. AI-generated prose, UI prompts, previews, and exported court forms are derived artifacts.

## Source-of-truth rules

1. Never implement a question, checkbox, deadline, attachment rule, recipient, filing route, or form output from chat memory or AI recollection.
2. Every runtime form field must resolve to a stable line-item ID in an approved dated source snapshot.
3. Every workflow must identify the exact `snapshot_id` that governs it.
4. Preserve the source date, capture timestamp, artifact hash, authority state, freshness state, discrepancies, and supersession history.
5. A later source creates a new snapshot. It must not overwrite an older snapshot or silently migrate an existing matter.
6. Forms referenced but absent from the current snapshot remain explicit blockers. Do not reconstruct them from memory.
7. A structurally passing catalog is not proof of legal correctness or currentness. Human source review remains required.
8. The exact source binary must be archived and hash-verified before the source gate can be approved.
9. User-facing workflow, form, preview, and package screens must display source date, capture date, freshness state, last official verification date, and an unverified or stale warning where applicable.
10. Unknown, stale, changed, unavailable, or materially disputed source state blocks final-ready filing, service, or transmission output.

## Non-negotiable rules

1. Preserve a complete human-only path. AI must remain optional.
2. Never commit real case records, names, addresses, court file numbers, tax information, medical records, financial records, child information, correspondence, or completed forms.
3. Never invent a fact, date, legal provision, service event, consent position, deadline, recipient, or court instruction.
4. Separate official source text, user-provided facts, deterministic rules, AI suggestions, and human approvals.
5. Every generated field and paragraph must remain editable and traceable to its inputs.
6. The rules engine selects applicable workflow branches. AI may propose interpretation but cannot override deterministic eligibility and safety gates.
7. Court, party, lawyer, filing, service, email, signature, oath, commissioning, payment, and public-publishing actions require explicit human approval and receipts.
8. No live transmission capability may be implemented until the receiving process and authorization are verified.
9. Source kits must be versioned. A stale or unknown source version must not render as current.
10. Family violence, immediate child safety, criminal proceedings, Child and Family Services involvement, unsafe service, imminent deadlines, and protection orders require specialized escalation states.
11. Keep legal information distinct from legal advice. Do not represent generated content as lawyer-reviewed unless evidence says so.
12. Unknown, blocked, reported-only, and stale states must remain visible. No silent green.

## Public and private boundary

This public repository may contain blank workflow definitions, public source records, schemas, synthetic fixtures, and non-sensitive documentation. Real user matters belong in a separate private, encrypted workspace that is not implemented in this bootstrap.

## Development posture

Use small, reviewable slices. Prefer contracts, schemas, source review, and threat analysis before implementing sensitive capabilities. Do not add AI, OCR, storage, analytics, email, authentication, document-signing, or court integrations without documenting data sent, purpose, retention, training or reuse, fallback, disable plan, and approval class.

## Safe commands

```bash
npm run check
npm run check:source-catalog
```

## Required report shape

Every agent session must record branch, base commit, head commit, files changed, commands run, validation results, evidence inspected, blockers, risk level, merge state, deploy state, and next action in `project-tracking/agent-run-ledger.md`.

## Current implementation gate

`SFL-SOURCE-REVIEW-002` is the next required source gate after bootstrap review. Runtime implementation remains blocked until all 267 captured line items are independently compared against rendered source pages, the exact source binary is archived and hash-verified, companion-form gaps are resolved or explicitly excluded, and the source review receives human approval.
