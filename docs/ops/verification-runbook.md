# Verification Runbook — sam_law

Status: `ACTIVE RECOVERY RUNBOOK`  
Scope: repository recovery/control-plane checks. This file does not claim runtime, browser, legal-currentness, security, privacy, provider or transmission qualification.

## Current recovery checks

Run from the repository root on the exact candidate head:

```bash
npm run check
git diff --check
```

`npm run check` currently composes the repository's structural gates, including foundation/cold-start checks, Kit #3J structural catalog checks, recovery-source fail-closed checks, framework-component promotion-lock checks, and the public managed-worker contract check.

## Applicability by validation class

| Validation class | Current PR #6 applicability | Evidence expectation |
|---|---|---|
| repository structure/contracts | `REQUIRED` | `npm run check` exact-head pass |
| diff/whitespace integrity | `REQUIRED` | `git diff --check` exact-head pass |
| hosted CI | `REQUIRED BEFORE OWNER MERGE GATE` | exact PR head workflow success |
| hostile/independent review | `REQUIRED` | exact-head review after final material bytes |
| runtime application behavior | `NOT_APPLICABLE TO PR #6` | no runtime implementation in lane |
| browser/visual UX | `NOT_APPLICABLE TO PR #6` | no runtime UI implementation in lane |
| legal source currentness/correctness | `NOT SATISFIED BY STRUCTURAL CHECKS` | separate source-family evidence/human review |
| private workspace security | `NOT_APPLICABLE / NOT QUALIFIED` | future `SFL-PRIVATE-001` |
| AI/provider trust | `NOT_APPLICABLE / NOT QUALIFIED` | future provider/AI qualification |
| court filing/service/transmission | `FORBIDDEN / NOT QUALIFIED` | future independent process verification |

## Exact-head rule

```text
REVIEW_PASS @ SHA_A != REVIEW_PASS @ SHA_B
```

Any material byte change after validation/review requires rerunning the affected exact-head checks/review.

## Recovery hostile-review checklist

Review the exact PR #6 head for:

```text
scope leakage beyond recovery/control-plane work
private/case-specific data
secrets or personal machine paths
stale single-kit product claims
source intake accidentally promoted to runtime truth
unresolved source conflicts silently normalized
legacy xi/ deleted/overwritten
new xiio/ writes before framework prerequisite
PR #5 implementation silently harvested
Inbox implementation copied into SFL
framework candidate mislabeled canonical/verified
Claude adapter treated as policy/authority
planning item treated as execution authority
structural green overstated as legal/runtime/security proof
README / AGENTS / checkpoint / lane / execution-plan disagreement
```

## Known limitations

- Structural checks do not prove legal correctness or current law/procedure.
- A source catalog can be structurally complete and still be stale or incorrectly interpreted.
- Hosted CI success does not equal owner acceptance.
- Claude/provider conformance is a separate post-recovery qualification run.
- No execution surface may weaken a required gate because that surface cannot perform it.

## Current next verification

After the kickoff/re-onboarding control-plane corrections in PR #6 are complete:

1. resolve exact current PR head,
2. run `npm run check`,
3. run `git diff --check`,
4. require exact-head hosted CI success,
5. run hostile exact-head review,
6. obtain explicit owner gate,
7. merge only the reviewed head,
8. verify the merged `main` state and rerun/confirm required checks.
