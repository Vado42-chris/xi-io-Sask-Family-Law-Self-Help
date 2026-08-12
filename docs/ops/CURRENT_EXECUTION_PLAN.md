# Current Execution Plan — sam_law

Status: `ACTIVE / SFL-CURRENT-SITUATION-001`

This stable path is the present-tense execution-plan entry point. Dated execution plans are historical/provenance records unless this file explicitly delegates to one.

```yaml
repo_full_name: Vado42-chris/xi-io-Sask-Family-Law-Self-Help
accepted_base_branch: main
accepted_base_sha_at_lane_start: 5f9d2a46898d97b87503cff2a2554c2eec665d47
active_issue: 8
active_change_unit: SFL-CURRENT-SITUATION-001
active_branch: feat/current-situation-selfhost-001
active_pr: 9
mutation_owner: current admitted self-host lane
mutation_admission: LIMITED_TO_THIS_CHANGEUNIT
```

## Goal

Prove one reusable managed-project primitive from real adopter pressure:

```text
durable repo custody/policy
+ exact local Git HEAD
+ live GitHub PR state
+ live exact-head GitHub Actions evidence
=
CurrentSituation
```

A tracked file must not claim to be the same-commit hosted CI/review attestation for itself.

## Allowed

- `scripts/current-situation-core.mjs`
- `scripts/current-situation.mjs`
- `scripts/check-current-situation.mjs`
- `package.json`
- `CLAUDE.md`
- current managed-worker/checkpoint/lane/validator records required for this proof
- PR/issue evidence and receipts

## Blocked

- legal-source promotion/currentness decisions
- runtime UI/provider/database/private workspace
- new registry/manifest family
- `xiio/` migration
- `.claude/` enforcement/hooks/subagents
- PR #5 donor harvest
- court/email/filing/service transmission
- unrelated framework implementation

## Required proof

```text
npm run check = PASS
PR-level git diff --check = PASS
npm run current:situation resolves PR #9 + exact local HEAD
live validation evidence never transfers across SHAs
missing live GitHub evidence remains UNKNOWN/BLOCKED
blind external Claude holdout review does not receive expected conclusions
```

## Return condition

Return to issue #8 when PR #9 has exact-head hosted validation, hostile review and external-worker conformance evidence. No second sam_law mutation branch may start while PR #9 owns this lane.
