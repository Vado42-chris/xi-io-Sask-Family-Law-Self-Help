# AGENTS.md

## Read order

Before changing this repository, read:

1. `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`
2. `README.md`
3. `docs/INDEX.md`
4. `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md`
5. `docs/ops/execution-sequence-v1.md`
6. `project-tracking/open-work-ledger.md`
7. `docs/product/product-vision-locked-v1.md`
8. `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`
9. `docs/architecture/privacy-and-data-boundary-v1.md`
10. `docs/legal/legal-information-boundary-v1.md`
11. only then the source-family or implementation artifacts applicable to the admitted task.

The canonical framework reference is `Vado42-chris/xi-io.net`. Chat history is context, not project truth.

The current GitHub execution plan is the authority for active branch/PR custody, current mutation scope, blockers, post-merge queue and Point-of-Order return behavior. Do not infer current work from Git recency.

## Current work custody

```text
accepted repository truth = main
active proposed recovery = PR #6
active branch = chore/framework-recovery-2026-08-12
current ChangeUnit = SFL-RECOVERY-CLOSEOUT-001
PR #5 = FROZEN_DONOR / SALVAGE_SOURCE / NO WHOLESALE MERGE
next new branch = NONE until PR #6 merges and merged main is verified
```

PR #6 is now recovery/control-plane closeout only. Do not keep expanding it into deep source implementation, runtime UI, private workspace, AI, provider/email or framework-component implementation work.

## Project role

This project converts governed Saskatchewan family-law self-help sources into guided, auditable workflows. It is intended to become the Saskatchewan jurisdiction package inside `xi-io: sam_law`, not a one-kit JCC application.

A governed source unit includes forms and process. A source capture is incomplete if it captures blank form fields but omits applicability, selection, supporting-document, prerequisite, service, filing, deadline, hearing/follow-up or discrepancy rules that determine what the user must actually do.

## Product invariant

The immutable source snapshot, approved normalized line-item catalog, deterministic workflow definition and verified user facts are source truth. AI-generated prose, UI prompts, previews and exported court forms are derived artifacts.

Framework/UI donor behavior is likewise not legal truth. Reusable components may structure interaction, but jurisdiction-specific legal meaning remains target-owned.

## Source-of-truth rules

1. Never implement a question, checkbox, deadline, attachment rule, recipient, filing route or form output from chat memory or AI recollection.
2. Every runtime form field must resolve to a stable line-item ID in an approved dated source snapshot.
3. Every workflow must identify its exact governing source family/snapshot.
4. Preserve source date, capture timestamp, artifact hash, authority state, freshness state, discrepancies and supersession history.
5. A later source creates a new snapshot. Never overwrite the prior snapshot or silently migrate an existing matter.
6. Forms referenced but absent from an admitted source remain explicit blockers unless a separately reviewed source relationship resolves them.
7. A structurally passing catalog is not proof of legal correctness or currentness.
8. Exact source bytes must be archived and hash-verified before the applicable source gate can be approved.
9. User-facing workflow/form/package surfaces must expose source and freshness state appropriate to the exact governing source.
10. Unknown, stale, changed, unavailable or materially disputed source state blocks affected final-ready filing, service or transmission output.
11. No source under `sources/intake/` becomes runtime truth without explicit reviewed promotion.
12. Repeated form numbers across source families are not assumed equivalent. Equivalence/divergence must be proven.

## Non-negotiable rules

1. Preserve a complete human-only path. AI remains optional.
2. Never commit real case records, names, addresses, court file numbers, tax information, medical records, financial records, child information, correspondence, provider credentials or completed forms.
3. Never invent a fact, date, legal provision, service event, consent position, deadline, recipient or court instruction.
4. Separate official source text, user-provided facts, deterministic rules, AI suggestions and human approvals.
5. Every generated field and paragraph must remain editable and traceable to its inputs.
6. Deterministic rules select applicable workflow branches. AI may propose interpretation but cannot override eligibility/safety gates.
7. Court, party, lawyer, filing, service, email, signature, oath, commissioning, payment and public-publishing actions require explicit human approval and receipts.
8. No live transmission capability may be implemented until the receiving process and authorization are independently verified.
9. Source kits are independently versioned. One global snapshot must not masquerade as truth for the whole jurisdiction package.
10. Family violence, immediate child safety, criminal proceedings, Child and Family Services involvement, unsafe service, imminent deadlines and protection orders require specialized escalation states.
11. Keep legal information distinct from legal advice. Do not represent generated content as lawyer-reviewed unless evidence says so.
12. Unknown, blocked, reported-only and stale states remain visible. No silent green.

## Framework and donor boundaries

`xi-io Inbox` is a read-only donor for this repository. Do not modify Inbox from an SFL task, fork it wholesale or make SFL runtime depend on Inbox `main`.

The Inbox-derived primitive promotion artifacts in this repo lock names, aliases, source lineage and target adoption pressure. They are not a second component registry and do not make those primitives canonical framework truth.

Canonical ownership remains:

```text
xi-io.net#236  reusable UI/component adoption + freshness
xi-io.net#306  namespace/registry compatibility recovery
xi-io.net#315  versioned capability distribution/adopter locks
xi-io.net#300  Git cadence and main-as-accepted-truth
```

Until `xi-io.net#306 R1` is accepted:

```text
preserve legacy xi/
do not create new xiio/ managed-project copies from stale/conflicting guidance
do not claim canonical framework registry admission for the locked primitives
```

## Git mutation rules

Follow `xi-io.net#300` and the local execution plan.

Before mutation, resolve:

```text
repo/default branch/current main
current work custody
one coherent ChangeUnit
allowed + blocked paths
mutation owner
required authority
validation path
rollback/recovery
Point-of-Order return target where applicable
```

Planning, research, archaeology, issue maintenance and a Point of Order do not automatically authorize a branch.

Same-scope review corrections remain in the current admitted branch by default. A material scope/ownership change requires reassessment before another branch.

## PR #6 allowed scope

Allowed:

- cold-start README/AGENTS/INDEX/execution guidance corrections,
- recovery/startup/gate documentation,
- existing intake metadata/blocker preservation,
- recovery validators,
- framework primitive promotion lock/source map/validator maintenance,
- read-only PR #5 salvage classification,
- append-only recovery evidence/ledger updates,
- same-scope review fixes.

Blocked in PR #6:

- runtime application/UI implementation,
- full new source-family catalog implementation merely because the source exists,
- private-matter runtime,
- database/storage runtime,
- AI runtime,
- provider/email runtime,
- court transmission,
- canonical framework registry implementation,
- new `xiio/` migration writes before framework prerequisite,
- wholesale PR #5 harvest,
- branch deletion/cleanup.

## Public and private boundary

This repository may contain blank workflow definitions, public source records, schemas, synthetic fixtures and non-sensitive documentation/code. Real legal matters belong in a separate private local workspace after the applicable security gate.

## Safe commands

```bash
npm run check
npm run check:foundation
npm run check:source-catalog
npm run check:recovery-sources
npm run check:framework-component-promotion-lock
git diff --check
```

## Required report shape

Every agent session that mutates this repository must record branch, base commit, head commit, files changed, commands run, validation results, evidence inspected, blockers, risk level, merge state, deploy state and next action in `project-tracking/agent-run-ledger.md` or the currently approved replacement/receipt owner.

Exact-head review claims are invalidated by material byte changes.

## Current implementation gate

Runtime implementation remains blocked behind applicable source and framework gates.

Current legal-source work is multi-family:

- Kit #3J independent source review remains incomplete,
- Kit #2a is unreviewed recovery intake,
- Kit #4a is unreviewed recovery intake,
- Form 15-52 is unreviewed/currentness-unresolved intake,
- multi-kit source-family canonical semantics remain pending.

The immediate Git task is not broad runtime implementation. It is to complete `SFL-RECOVERY-CLOSEOUT-001` in PR #6, validate the exact head, obtain owner approval, merge, verify `main`, and only then admit the next bounded current-main branch.

## Point of Order

When the owner says `Point of Order` during active work:

1. capture the current parent checkpoint first,
2. preserve branch/PR/head and next step,
3. classify the interrupt,
4. preserve the return target,
5. prefer read-only bounded interrupt work,
6. do not create a branch merely because the interrupt exists,
7. resume the parent when the interrupt is resolved/deferred.

A Point of Order may change future architecture or priorities, but it is not automatic mutation authority.
