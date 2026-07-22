# AGENTS.md

## Read order

Before changing this repository, read:

1. `README.md`
2. `docs/INDEX.md`
3. `xi/managed-project.manifest.yaml`
4. `docs/ops/execution-sequence-v1.md`
5. `docs/architecture/privacy-and-data-boundary-v1.md`
6. `docs/legal/legal-information-boundary-v1.md`
7. `project-tracking/open-work-ledger.md`

The canonical framework reference is `Vado42-chris/xi-io.net`. Chat history is context, not project truth.

## Project role

This project converts official, versioned Saskatchewan family-law self-help material into guided, auditable workflows. The first reference slice is Kit #3J for requesting a Judicial Case Conference.

## Product invariant

The workflow definition and verified user facts are the source of truth. AI-generated prose and exported court forms are derived artifacts.

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

Use small, reviewable slices. Prefer contracts, schemas, and threat analysis before implementing sensitive capabilities. Do not add AI, OCR, storage, analytics, email, authentication, document-signing, or court integrations without documenting data sent, purpose, retention, training or reuse, fallback, disable plan, and approval class.

## Safe command

```bash
npm run check
```

## Required report shape

Every agent session must record branch, base commit, head commit, files changed, commands run, validation results, evidence inspected, blockers, risk level, merge state, deploy state, and next action in `project-tracking/agent-run-ledger.md`.

## Current implementation gate

`SFL-BOOTSTRAP-001` is open for review. Runtime implementation is blocked until the bootstrap is approved and the first reference slice has an explicit data contract, privacy review, acceptance criteria, and synthetic test plan.
