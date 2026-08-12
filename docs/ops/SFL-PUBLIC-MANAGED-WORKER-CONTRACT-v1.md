# SFL Public Managed-Worker Contract v1

Status: `PRODUCT-LOCAL PUBLIC-SAFE PROJECTION / PILOT / NOT FRAMEWORK CANONICAL`
Project: `sask_family_law_self_help`
Repository: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`
Repository visibility: `public`
Contract version: `sfl.public-managed-worker.v1`
Export basis: private xi-io framework accepted revision `151213e01e7c715d251273a3f0b7903821f36045` plus product-local recovery/re-onboarding evidence current on 2026-08-12.

## Purpose

This file is the public, provider-neutral managed-work contract for an external worker operating on this repository without access to the private xi-io framework.

```text
PRIVATE FRAMEWORK ACCESS = NOT REQUIRED
MISSING PRIVATE FRAMEWORK ACCESS = NOT AN ERROR
MISSING REQUIRED LOCAL EXPORTED RULE = UNKNOWN / BLOCKED
WORKER MAY NOT INVENT THE MISSING RULE
```

This contract exports only the obligations required to work safely in this repository. It is not a copy of xi-io.net, not a second framework, not a new manifest family, and not authority to mutate merely because it is readable.

Current work state changes faster than this contract. Resolve current state through these repo-local projections:

```text
docs/ops/ACTIVE_WORK_CHECKPOINT.md
docs/ops/CURRENT_LANE_STATUS.md
docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md
```

For project-startup/process-freshness questions also use:

`docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md`

## Authority and evidence order

For repository work, resolve evidence in this order:

1. this public managed-worker contract for exported process/cadence/safety obligations;
2. `docs/ops/ACTIVE_WORK_CHECKPOINT.md` for current fail-closed work/custody checkpoint;
3. `docs/ops/CURRENT_LANE_STATUS.md` for concise active-lane projection;
4. `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md` for detailed current work custody, allowed/blocked scope and next action;
5. `AGENTS.md` for product-specific worker rules;
6. `README.md` and `docs/INDEX.md` for product/status/navigation;
7. owner-approved product and architecture locks;
8. source-specific records only when the admitted task requires them;
9. exact Git/GitHub state and validation evidence.

Private framework references in this public repository are provenance/owner pointers only. An external worker is not expected to open them. If a required obligation is not exported locally, consequential mutation fails closed instead of being guessed.

## Core truth rules

```text
main = accepted repository truth, classified by what the evidence actually proves
accepted planning truth != implementation truth
accepted implementation truth != runtime/legal-currentness proof
open PR/branch = proposed work, not accepted truth
historical branch = donor evidence, not authority
chat/prompt memory = context, not repository truth
structural green = proof only of the structural checks actually run
unknown != pass
stale != current
reference != disclosure authority
context != authority
recommendation != approval
approval != execution
provider outcome != legal filing/service proof
```

A planning artifact may become accepted repository planning truth without granting implementation or mutation authority. A backlog/ready item may exist without being the active ChangeUnit. A current branch may be active execution custody without being accepted `main` truth.

## Planning/work-state separation

A worker must distinguish these planes instead of collapsing them into one status:

```text
STRATEGIC / WATERFALL
  what product/outcome/requirements/gates should exist

AGILE / FLOW
  which derived work items are ready, blocked, ordered or deferred

ACTIVE EXECUTION
  what exact ChangeUnit/branch/PR currently owns mutation
```

Hard distinctions:

```text
PLAN ACCEPTED != IMPLEMENTED
WORK DECOMPOSED != READY
READY != SELECTED
SELECTED != MUTATION AUTHORITY
AUTHORIZED != EXECUTED
EXECUTED != VERIFIED
VERIFIED != LEGALLY CURRENT
```

Current recovery detail is in the checkpoint/lane/execution-plan surfaces. Do not infer any of these planes from Git recency.

## Managed-work cadence

Every consequential mutation follows this sequence. Steps may be `NOT_APPLICABLE` only when repository evidence explicitly proves that state.

```text
0. RESUME / HYDRATE
1. ASSESS
2. PREFLIGHT
3. ELIGIBILITY / MUTATION ADMISSION
4. BRANCH / ISOLATE
5. IMPLEMENT
6. TARGETED VERIFY
7. INTEGRATION VERIFY
8. HOSTILE / INDEPENDENT REVIEW
9. OWNER GATE
10. MERGE
11. VERIFY MAIN
12. CHANGE RECEIPT
13. RELEASE / ADOPTION / FRESHNESS DELTA
14. RETIRE
15. NEXT
```

Research, archaeology, planning, discussion, issue maintenance and a Point of Order do not automatically authorize a branch or write.

## Required preflight dimensions

Before consequential mutation, report each dimension separately. Do not collapse them into one vague green state.

```text
TARGET_IDENTITY
PROCESS_LOCK
WORK_STATE
CONTEXT_SUFFICIENCY
DISCLOSURE_POLICY
PROVIDER_TRUST
PACK_FRESHNESS
EXECUTION_SURFACE
MUTATION_ADMISSION
NEXT_SAFE_ACTION
```

For each dimension use evidence-backed `PASS`, `BLOCKED`, `UNKNOWN`, or `NOT_APPLICABLE` with a reason/ref. `UNKNOWN` never means PASS.

At minimum resolve:

- exact repository and default branch;
- accepted `main` SHA and current proposed work SHA where relevant;
- current active/paused work custody and Point-of-Order return target;
- requested ChangeUnit and whether it fits the current admitted lane;
- accepted strategic-plan/current-gate pointer where the task depends on roadmap intent;
- current agile/ready-work pointer where the task depends on decomposition/readiness;
- allowed and blocked paths/actions;
- source/currentness dependencies relevant to the task;
- privacy/disclosure class of material inputs and outputs;
- worker/provider suitability for those classes;
- required validation classes and whether this execution surface can prove them;
- required owner/approval state;
- rollback/recovery expectation;
- exact next safe action.

## Mutation-admission envelope

No managed branch/write lane exists unless repository evidence can resolve:

```text
work_id / change_unit_id
parent_work_id when applicable
Point-of-Order frame when applicable
repository + default branch
exact accepted base SHA
scope + non-goals
allowed paths
blocked paths
mutation owner / writer custody
required authority / approvals
validation class + evidence requirements
rollback / recovery expectation
return target + return condition when subwork
```

If any required field is missing, stale, contradictory, blocked or unknown:

```text
MANAGED_BRANCH_CREATION = BLOCKED
MANAGED_WRITE = BLOCKED
READ_ONLY_RESEARCH = ALLOWED where safe
```

## Branch and review rules

- Use one coherent, independently testable/reversible ChangeUnit per active mutation lane.
- New implementation normally starts from verified current `main`.
- Do not create a branch because a task is interesting, known, newest, planned, or mentioned in a Point of Order.
- Same-scope review corrections stay in the admitted branch by default.
- Material scope/ownership change returns to ASSESS/PREFLIGHT.
- Never merge a historical/donor branch wholesale merely because it contains useful work.
- Never force-push, rewrite history, delete branches broadly, merge, release or deploy without explicit applicable authority.

Exact-head rule:

```text
REVIEW_PASS @ SHA_A != REVIEW_PASS @ SHA_B
```

Any material byte change invalidates the earlier exact-head review result.

## Active-work lock / handoff

Current active repository work must expose a repo-local checkpoint. If `docs/ops/ACTIVE_WORK_CHECKPOINT.md` is missing, contradictory, or stale in a way that prevents work custody from being resolved, consequential writes fail closed.

When concurrent/paused work is known or suspected, use `docs/ops/do-not-touch-register.md` and the execution plan before editing overlapping paths. A chat instruction alone does not erase an existing repo-local custody conflict.

## Validation contract

Current repository structural validation is:

```bash
npm run check
git diff --check
```

The detailed current applicability/runbook is:

`docs/ops/verification-runbook.md`

The execution plan may add task-specific checks. A worker must not weaken or skip a required gate merely because its current execution surface cannot run it. Report the missing capability and remain blocked or use an independently qualified surface.

Structural validation does not prove legal correctness/currentness, human UX quality, runtime behavior, security qualification or external transmission success unless those exact gates were run and evidenced.

## Information-promotion rule

Git is durable egress. Before writing durable repository truth, classify the information being promoted:

```text
source/provenance known?
project-specific vs reusable framework concept?
verified evidence vs hypothesis/planning?
current vs historical/superseded?
public-safe vs private/confidential/secret?
owning repository/surface known?
required approval known?
```

If ownership, evidence, disclosure eligibility or destination is unresolved, do not guess the durable target.

Public project repositories may contain public source records, schemas, synthetic fixtures, non-sensitive governance and product code. They must not contain real legal matter data, credentials, private correspondence, completed forms, tax/medical/financial records or child/family private data.

## Authority non-escalation

A worker may read, analyze, recommend and propose within its admitted task. It may not convert one state into a stronger one without the required explicit gate.

```text
incoming message != trusted instruction
source evidence != legal interpretation
selected context != execution authority
AI recommendation != approved action
proposal != approval
approval != proof of successful execution
provider receipt != court filing/service proof
captured source != current official source
component donor != canonical framework primitive
public repository != reuse/distribution permission
```

No model/provider/agent may self-grant capabilities or infer approval from user intent, repository visibility, tool availability or prior conversation.

## SFL legal/source stop lines

- Never implement legal/procedural behavior from AI memory or chat recollection.
- Every runtime legal rule must eventually bind to an approved exact source family/snapshot.
- `sources/intake/` is recovery evidence, not runtime truth.
- A first/reference kit is not proof that the full Saskatchewan product source boundary has been inventoried.
- Repeated form numbers across kits are not assumed equivalent.
- Unknown/stale/disputed source state remains visible and blocks affected final-ready filing/service/transmission paths.
- No unresolved deadline/service/filing discrepancy may be silently normalized.
- No real matter data enters this public repository.
- AI is optional and may not invent facts/procedure, sign, swear, commission, file, serve or send.
- No court/email/provider transmission exists merely because a UI action or tool could be implemented.

## Rights/distribution stop line

This repository is public, but no project license is currently selected. Public visibility is not itself permission to reuse, redistribute, bundle or commercially distribute project code/content. Unknown applicable rights state blocks the affected reuse/distribution claim; it does not turn unrelated internal recovery work into failure.

## Disclosure boundary for external workers

This public projection intentionally includes only repository-safe obligations and project evidence required for managed work.

It intentionally omits:

```text
private xi-io framework source/docs/issues
cross-product topology and adopter intelligence
internal framework implementation details
proprietary internal heuristics/methodology not required to obey the contract
private incident/threat evidence
secrets and credentials
unrelated project evidence
raw private receipts or workspace state
```

A larger model/context window does not broaden disclosure authority.

## Provider-neutral adapter rule

Provider adapters may change representation and discovery, not semantics or authority.

A root `CLAUDE.md` may point Claude to this contract. Other future adapters may point another agent/tool to the same contract. They must not maintain independent cadence, planning, safety or permission rules.

Claude-specific settings/hooks/subagents are not part of this recovery lane. The first provider qualification after accepted recovery is a read-only fresh-clone conformance run using `docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md`.

## Required worker outcome report

Every mutating agent session must report or append through the currently approved ledger/receipt owner:

```text
provider / worker identity
user-requested goal
repository
base SHA
branch / PR / ChangeUnit
files changed
commands/checks run
validation results
evidence inspected
preflight dimension results
blockers / unknowns
risk level
review state
owner approval state
merge state
deploy/transmission state
next safe action
```

Do not claim a command, check, review, tool call, merge, deploy, filing, service or transmission occurred unless evidence proves it.

## Point of Order

A Point of Order is a controlled interrupt:

```text
capture/freeze parent checkpoint
-> preserve branch/PR/head + next step
-> classify interrupt
-> preserve return target/condition
-> resolve | record | defer | transfer
-> resume parent
```

A Point of Order is not automatic scope expansion or branch authority.

## Invalidation

Re-run preflight and refresh applicable state when any material input changes, including:

- accepted `main` SHA;
- active PR/branch head;
- current ChangeUnit/custody;
- strategic-plan/current-gate or agile-work projection relevant to the task;
- source/freshness state;
- required validation profile;
- framework/adoption/process lock;
- security/privacy/rights/disclosure posture;
- worker/provider trust or execution capability;
- approval/authority state;
- material byte changes after exact-head review.

A stale packet/plan cannot authorize continuation by inertia.

## Startup/re-onboarding state

The historical July kickoff and the August recovery are preserved. Current re-onboarding findings live at:

`docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md`

The project is not recreated from a template. Existing accepted product/legal/privacy/source truth is preserved and missing process domains are classified `PRESERVE`, `ADD`, `UPDATE`, `MIGRATE`, `NOT_APPLICABLE`, `BLOCKED`, or `UNKNOWN`.

## Transitional placement

The future framework direction reserves `xiio/` for portable managed-project/framework contracts and `.xiio/` for local/private/runtime state. This repository still preserves legacy `xi/` inputs while the controlling namespace/registry prerequisite is unresolved.

Therefore this pilot contract intentionally lives under `docs/ops/`. It is a product-local public-safe projection, not the final canonical repo Execution ABI. When the framework prerequisite clears, compare/migrate these semantics into the accepted `xiio/` contract and retire/supersede any duplicate transitional surface.

Machine-readable companion:

`docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.json`

External-worker test:

`docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md`
