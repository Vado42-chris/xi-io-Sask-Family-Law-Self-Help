# Current Lane Status — sam_law

Status: `ACTIVE / CURRENT-SITUATION SELF-HOST PROOF`

Projection only. Live exact-head validation/review state is resolved from GitHub attestations and must not be inferred from this tracked file.

```yaml
repo_full_name: Vado42-chris/xi-io-Sask-Family-Law-Self-Help
product_lane: sam_law / managed-project self-host proof
active_issue_or_work: issue #8 / SFL-MANAGED-SELFHOST-001
active_change_unit: SFL-CURRENT-SITUATION-001
active_pr: 9
active_branch: feat/current-situation-selfhost-001
accepted_base_branch: main
accepted_base_sha_at_lane_start: 5f9d2a46898d97b87503cff2a2554c2eec665d47
state: ACTIVE_PROOF
next_gate: exact-head hosted validation -> live resolver inspection -> blind Claude holdout review -> owner disposition
next_new_branch: BLOCKED while PR #9 owns mutation
```

## Scope

This lane is limited to:

- deterministic CurrentSituation reducer semantics;
- live Git/GitHub exact-head attestation joining;
- fail-closed behavior when live evidence is unavailable/stale/mismatched;
- deterministic checks wired into `npm run check`;
- thin worker discovery guidance.

Explicitly outside this lane:

```text
legal-source promotion
runtime UI/provider/database/private workspace
new registry/manifest family
xiio namespace migration
Claude enforcement/hooks/subagents
PR #5 donor harvest
court/email/file/service transmission
```

## Current-situation rule

```text
DURABLE TRACKED STATE
!=
LIVE ATTESTATION

CURRENT SITUATION
= durable custody/policy
+ exact local HEAD
+ live GitHub PR state
+ live exact-head GitHub Actions evidence
```

A worker must use `npm run current:situation` when the execution surface can access Git/GitHub. Missing live evidence remains `UNKNOWN/BLOCKED`; it never becomes PASS because a Markdown file says an older check succeeded.

## Next safe action

Keep PR #9 narrow. Wait for hosted validation on the current exact head, inspect resolver behavior from a fresh worker clone, and use an evaluator-held blind Claude prompt rather than the public regression examples as final qualification evidence.
