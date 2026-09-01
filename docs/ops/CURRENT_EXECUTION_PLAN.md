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
parallel_mutation_policy: GLOBAL_SINGLE_MUTATION_LANE
serialized_wait_prs: 10
framework_observed_main: 0c9db9b1395b626d7fd0b8b4bea3bc9d1586cc53
framework_observed_at: 2026-09-01
```

## Goal

Prove one reusable managed-project primitive from real adopter pressure:

```text
durable repo custody/policy
+ exact local Git HEAD
+ live GitHub PR state
+ live exact-head GitHub Actions evidence
+ exact-head review evidence
+ project-wide open-PR/custody reconciliation
=
CurrentSituation
```

A tracked file must not claim to be the same-commit hosted CI/review attestation for itself.

## Cold-start smoke repair admitted on 2026-09-01

A cold ChatGPT worker resolved live PR #9 custody correctly, but the accepted top-level onboarding surfaces still named merged PR #6 as active. This is part of the CurrentSituation failure class because a worker following those entry points receives contradictory current custody before it reaches the live reducer.

The same cold start also consumed newer framework invariants that post-date the product-local public contract export basis:

```text
WORKER_BIND = tip_sha · branch · PR · managed_first_hop · worker_label
PASS = NEXT_FROZEN_INPUT
BRANCH_PASS != RUNTIME
MERGED_TO_MAIN != MAIN_READBACK_CURRENT
MAIN_READBACK_CURRENT != AFFECTED_RETURN_CURRENT
COMMENT != WORK
CANDIDATE != ACCEPTED
HISTORY != EXECUTABLE
```

The framework-local worker binder is not executable from this connector-only surface. That gap remains `SFL-COLD-BIND-001`, not PASS. The product-local public contract also remains a dated export until its framework delta is deliberately reconciled, so `framework_observed_main` above is observation/provenance, not an adoption claim.

## Allowed

- `scripts/current-situation-core.mjs`
- `scripts/current-situation.mjs`
- `scripts/check-current-situation.mjs`
- `scripts/check-foundation.mjs`
- `package.json`
- `CLAUDE.md`
- `README.md`
- `AGENTS.md`
- `docs/INDEX.md`
- current managed-worker/checkpoint/lane/validator records required for this proof
- PR/issue evidence and receipts

The three onboarding files above are admitted only to remove contradictory current-custody claims and point workers at this stable plan and the live resolver. This does not admit capability distribution, legal-source promotion, UI/runtime work, or a new framework ABI.

## Blocked

- legal-source promotion/currentness decisions
- runtime UI/provider/database/private workspace
- new registry/manifest family
- `xiio/` migration
- `.claude/` enforcement/hooks/subagents
- PR #5 donor harvest
- court/email/filing/service transmission
- unrelated framework implementation
- claiming the dated public-worker export is synchronized to framework main without a bounded delta review

## Required proof

```text
npm run check = PASS
PR-level git diff --check = PASS
npm run current:situation resolves PR #9 + exact local HEAD
live validation evidence never transfers across SHAs
live review evidence never transfers across SHAs
review observed != review qualified != owner approved != merge authority
missing live GitHub evidence remains UNKNOWN/BLOCKED
unqualified sibling mutation lanes fail closed under GLOBAL_SINGLE_MUTATION_LANE
serialized WAIT siblings remain visible without receiving mutation authority
stale WAIT declarations fail currentness closed
README + AGENTS + docs/INDEX must resolve this stable current plan and PR #9 custody
blind external holdout review does not receive expected conclusions
```

## Return condition

Return to issue #8 when PR #9 has exact-head hosted validation, hostile review and independent external-worker conformance evidence after the final onboarding bytes. No second sam_law mutation branch may actively mutate while PR #9 owns this lane. PR #10 is serialized as `WAIT` and retains its branch/evidence without active mutation authority. If a later accepted project policy permits qualified disjoint affected children, this file and CurrentSituation must encode the relationship/admission basis before parallel lanes can be treated as current.
