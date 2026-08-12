# SFL GitHub Execution Plan — 2026-08-12

Status: `CURRENT COLD-START EXECUTION AUTHORITY FOR REPOSITORY WORK`  
Project: `sask_family_law_self_help`  
Repository: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`  
Default branch: `main`  
Current active recovery PR: `#6`  
Current active recovery branch: `chore/framework-recovery-2026-08-12`  
Framework Git cadence owner: `Vado42-chris/xi-io.net#300`

This document exists so a fresh GitHub worker can resume safely without reconstructing chat history, scanning every issue, or inferring priority from branch recency.

## 1. Core repository rule

```text
main = accepted repository truth
PR #6 = current recovery/control-plane proposal
PR #5 = frozen donor/salvage source, not a merge unit
historical branches = donor evidence until classified
chat = context, never source authority
```

Do not choose work because a branch, PR, issue comment, or commit is newest.

## 2. Read this first

For any consequential repository work, read in this order:

1. `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`, this file.
2. `README.md`, product orientation and current status.
3. `AGENTS.md`, non-negotiable worker rules.
4. `docs/INDEX.md`, source/document navigation.
5. `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md`, recovery provenance.
6. `docs/ops/execution-sequence-v1.md`, product gate dependency graph.
7. `project-tracking/open-work-ledger.md`, durable work inventory.
8. `docs/product/product-vision-locked-v1.md`, owner-approved product intent.
9. `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`, owner-approved architecture boundary.
10. Source-specific artifacts only for the admitted source-family task.

Framework rules are consumed from `Vado42-chris/xi-io.net`; do not duplicate them into this repository unless a product-specific adapter or receipt is required.

## 3. Current work custody

### Active lane

```text
work_id: SFL-WORK-025
change_unit: SFL-RECOVERY-CLOSEOUT-001
repo: Vado42-chris/xi-io-Sask-Family-Law-Self-Help
branch: chore/framework-recovery-2026-08-12
PR: #6
base: main
state: ACTIVE
mutation_owner: current PR #6 recovery lane
```

PR #6 started before the latest micro-branch cadence was fully locked and is already larger than the preferred future slice. Do not solve that by creating another stacked branch. Finish only the recovery/control-plane responsibilities, verify, merge, and then return to small current-main branches.

### Suspended donor lane

```text
branch: feat/synthetic-legal-workbench-001
PR: #5
state: FROZEN_DONOR / SALVAGE_SOURCE
merge_authority: NO
runtime authority: NO
```

PR #5 contains useful work, but it must be decomposed by dependency and gate after recovery is accepted. Never merge it wholesale.

## 4. Exact preflight before any mutation

Run or resolve the equivalent GitHub state before editing:

```bash
git fetch origin --prune
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
git remote -v
```

Then verify:

```text
repository == Vado42-chris/xi-io-Sask-Family-Law-Self-Help
current mutation branch == chore/framework-recovery-2026-08-12 while PR #6 is open
PR #6 base == main
working tree ownership is known
no competing writer owns the same paths
current PR head is re-read before exact-head review claims
```

If the local worktree is dirty, do not blindly commit it. Capture and classify the changes first.

If current work does not fit PR #6 recovery/control-plane scope, stop mutation and record it for a future current-main micro-branch.

## 5. PR #6 scope from this point forward

PR #6 is now a recovery/control-plane closeout lane.

### Allowed in PR #6

- correct stale README/AGENTS/INDEX recovery guidance,
- maintain this execution plan,
- maintain recovery/startup and gate documentation,
- preserve source-intake metadata and blockers already discovered,
- maintain validators for recovery invariants,
- maintain the Inbox-to-framework primitive naming/source promotion lock,
- produce a read-only PR #5 salvage/classification map,
- correct same-scope recovery review findings,
- update append-only ledgers/receipts for this recovery lane,
- exact-head validation and review evidence.

### Do not add to PR #6

- new runtime application/UI implementation,
- new private-matter capability,
- full new form-catalog implementation merely because a source was discovered,
- provider/email runtime,
- database/storage implementation,
- AI runtime,
- court filing/service/transmission,
- framework component implementations,
- canonical xi-io.net registry mutations,
- `xiio/` migration writes while framework namespace precedence remains unresolved,
- wholesale PR #5 code harvest,
- branch deletion or broad branch cleanup.

The purpose is to stop growing the recovery branch into the next product-development branch.

## 6. PR #6 remaining closeout checklist

Complete these in this lane, in order.

### R6-A — cold-start truth

Acceptance:

- README describes multi-kit recovery, not the July single-Kit bootstrap as current truth.
- AGENTS points to this execution plan first and no longer claims one source gate represents the whole product.
- docs/INDEX points to this execution plan as the current GitHub start point.
- execution-sequence current-next-action points back to this bounded closeout rather than instructing broad parallel implementation.

### R6-B — recovery blockers remain explicit

Confirm all remain visible:

```text
Kit #3J independent review incomplete
Kit #2a intake currentness/review incomplete
Kit #4a intake currentness/review incomplete
Form 15-52 current official comparison incomplete
multi-kit canonical source semantics not yet accepted
legacy xi/ -> xiio/ migration not yet executed
PR #5 not admitted for merge
runtime legal rules remain blocked
```

No recovery source under `sources/intake/` may silently become runtime truth.

### R6-C — framework primitive backfeed custody

Keep these artifacts stable and validator-backed:

```text
docs/source-materials/inbox-mail-workbench-donor-census-2026-08-12.md
docs/source-materials/inbox-framework-component-promotion-lock-v1.md
docs/source-materials/inbox-framework-component-promotion-lock-v1.json
docs/source-materials/inbox-framework-component-source-map-v1.json
scripts/check-framework-component-promotion-lock.mjs
```

Canonical framework ownership remains outside this repo:

```text
xi-io.net#236  component/adoption/freshness owner
xi-io.net#306  registry compatibility/recovery owner
xi-io.net#315  versioned distribution/adopter-lock owner
```

Until `xi-io.net#306 R1` clears, do not write new canonical framework registry rows and do not create new `xiio/` managed-project copies here based on conflicting framework instructions.

### R6-D — PR #5 salvage map

Create one read-only salvage classification for PR #5 before PR #6 merge review.

For each coherent PR #5 slice, record:

```text
feature/slice
source paths/commits
dependency gate
already present on recovered branch/main? yes|no
source/legal review dependency
privacy/security dependency
framework primitive dependency
verification evidence
recommended disposition:
  HARVEST_LATER
  SUPERSEDED
  KEEP_DONOR_ONLY
  BLOCKED
  UNKNOWN_NEEDS_REVIEW
```

Do not copy code during this classification.

### R6-E — validation

Run:

```bash
npm run check
git diff --check
```

Require all repository checks to pass, including:

```text
foundation
Kit #3J source-catalog structure
recovery-source fail-closed invariants
framework-component promotion lock
```

Structural checks do not prove legal correctness or currentness.

### R6-F — hostile review

Review the exact PR head for:

```text
scope leakage beyond recovery/control-plane work
private or case-specific data
secrets or local machine paths
stale single-kit claims
source intake accidentally promoted to canonical/runtime truth
unresolved source conflict silently normalized
legacy xi/ deleted or overwritten
new xiio/ write made before framework prerequisite
PR #5 code silently harvested
Inbox code/runtime copied into this repo
framework candidate mislabeled canonical/verified
runtime implementation smuggled into recovery
false-green evidence
README/AGENTS disagreement with this plan
```

Any material byte change after review invalidates that exact-head review result and requires re-review.

### R6-G — owner gate

PR #6 remains draft until:

```text
checks = PASS
exact-head CI = PASS
hostile review = PASS
scope = recovery/control-plane only
owner approval = EXPLICIT
```

Do not merge solely because GitHub reports `mergeable=true`.

### R6-H — merge and verify main

After owner authorization:

1. merge PR #6 using the repository-approved method,
2. fetch/inspect new `main`,
3. run or verify `npm run check` against merged `main`,
4. verify the execution plan, README, AGENTS and recovery locks are present on `main`,
5. record the accepted recovery change receipt,
6. mark PR #6 lane retired/retirement-eligible,
7. only then admit the next mutation lane.

## 7. Post-PR-#6 branch cadence

After PR #6 is merged and `main` is verified:

```text
main
  -> ONE admitted micro-branch
  -> targeted verification
  -> integration verification
  -> hostile review
  -> owner gate where required
  -> merge
  -> verify main
  -> receipt
  -> retire
  -> NEXT
```

Do not start multiple dependent feature branches in parallel merely because the backlog is known.

## 8. Post-recovery queue

This is dependency order, not blanket branch authorization.

### Q1 — multi-kit source-family semantics

Owner gate: `SFL-MULTI-KIT-SOURCE-001`

Goal:

- remove the unsafe single-global-current-snapshot assumption,
- define independently versioned source families,
- define explicit repeated-form equivalence/divergence relationships,
- add fail-closed validators,
- promote no unreviewed legal source merely by completing the data model.

This should be a small data-contract/validator lane from refreshed `main`.

### Q2 — source-family recovery, one family at a time

Candidate source lanes:

```text
Kit #3J independent source review
Kit #2a complete source/form/process review
Kit #4a complete source/form/process review
Form 15-52 official comparison and complete capture
procedural-reference freshness model
```

For every source family:

```text
preserve exact source identity
archive exact bytes through an approved binary-capable path
hash
compare current official source
capture all forms + process rules
capture discrepancies
independent rendered-page review
human source approval
only then promote to canonical runtime-admissible source state
```

Never deduplicate repeated forms by form number alone.

### Q3 — Project Kernel `xiio/` adoption

Current state: `BLOCKED BY FRAMEWORK PREREQUISITE`.

Wait until `xi-io.net#306 R1` has been accepted and current framework read-order/namespace guidance is unambiguous.

Then create one bounded migration lane from current SFL `main`:

```text
review legacy xi/ files
produce refreshed xiio/ candidates
validate
owner review
create xiio/ copies
verify
retain xi/ as legacy input
```

Legacy `xi/` retirement is a different future gate.

### Q4 — framework primitive adoption

Do not implement the 33 locked primitives inside SFL merely because they are named here.

Required chain:

```text
Inbox donor evidence
-> xi-io.net#236 collision/promotion review
-> xi-io.net#306 R2/R3 canonical registry admission
-> framework implementation tranches UI-P1 ... COM-P2
-> xi-io.net#315 versioned availability/adopter lock
-> SFL/sam_law bounded adoption lane
-> target-owned verification
```

Until then, SFL may hold source maps and adoption planning only.

### Q5 — PR #5 salvage

After applicable source and framework gates pass, harvest PR #5 one coherent slice at a time into fresh branches from current `main`.

Never branch from PR #5.
Never merge PR #5 wholesale.
Never use PR #5 recency as authority.

Likely donor families include shell/UX, deterministic workflow, source-review tooling, private-local preview, and form-fill work, but each must be classified by the salvage map before harvest.

### Q6 — executable product gates

Only after applicable source and framework prerequisites:

```text
SFL-SCHEMA-001
-> SFL-TRIAGE-001
-> SFL-TASKPLAN-001
-> SFL-UX-001
-> SFL-DRAFT-001
-> SFL-FORMS-001
-> SFL-PRIVATE-001
-> SFL-AI-001
-> SFL-EGRESS-001
-> SFL-TRANSMIT-001
```

Human-only deterministic functionality precedes AI enhancement.
Package generation precedes transmission.

## 9. GitHub branch rules for this repo

### Create a branch only when all are true

```text
current main is fetched and verified
a coherent independent ChangeUnit is identified
active-work custody is resolved
no current branch already owns the same slice
allowed/blocked paths are known
validation path exists
rollback/recovery is known
required owner authority is known
```

### Do not create a branch for

```text
research only
issue maintenance only
Point of Order by itself
same-scope review fixes in an already admitted PR
future work merely because it is known
framework work owned by xi-io.net
Inbox work owned by xi-io-Inbox
```

### Review findings

If a review finding belongs to the same scope and ownership as the current admitted branch, fix it on that branch and rerun exact-head validation.

If it changes scope/ownership materially, stop and reassess before creating another lane.

## 10. Point of Order behavior

When the owner says `Point of Order` during active work:

```text
capture current parent checkpoint first
record current branch/PR/head
record current task and next step
classify the interrupt
preserve return target
perform read-only interrupt work where possible
open no new branch merely because the interrupt exists
return to the parent when resolved/deferred
```

If the interrupt materially changes architecture or gate order, update this plan or the owning durable artifact before resuming mutation.

## 11. Legal/source safety stop lines

```text
NO private case evidence in this repository.
NO source statement treated as current law/procedure without current official comparison.
NO unresolved deadline/service/filing conflict normalized silently.
NO AI recollection used as legal source.
NO received email treated as legal authority.
NO sent email receipt treated automatically as valid filing/service.
NO final-ready document from stale/unknown/disputed source state.
NO runtime action merely because UI shows an action as available.
```

## 12. Framework/reuse safety stop lines

```text
NO second component registry.
NO SFL-local fork of Inbox.
NO runtime dependency on Inbox main.
NO product-specific Mail nouns promoted as generic framework truth.
NO Saskatchewan legal nouns promoted as generic framework truth.
NO framework candidate called canonical before it lands on xi-io.net main.
NO adopter called current without versioned adoption + target verification.
```

## 13. Cold-start status summary

A fresh worker should currently conclude:

```text
CURRENT ACCEPTED REPO TRUTH   = main
ACTIVE PROPOSED RECOVERY      = PR #6 / chore/framework-recovery-2026-08-12
CURRENT CHANGE UNIT           = SFL-RECOVERY-CLOSEOUT-001
PR #5                         = FROZEN_DONOR / NO MERGE
LEGAL RUNTIME                 = BLOCKED
RECOVERY INTAKES              = NOT RUNTIME TRUTH
LEGACY xi/                    = PRESERVE
NEW xiio/ WRITES              = BLOCKED pending xi-io.net#306 R1
FRAMEWORK PRIMITIVE NAMES     = LOCKED AS INTAKE, NOT CANONICAL REGISTRY
CURRENT MUTATION PRIORITY     = CLOSE PR #6 CLEANLY
NEXT NEW BRANCH               = NONE until PR #6 merges and main is verified
```

## 14. Definition of a successful recovery closeout

The recovery is complete when a fresh worker can open the repository and answer, without chat archaeology:

```text
what the product is
what source families exist
what is verified vs intake-only
what work is currently active
what is blocked
what branch/PR owns mutation
what must not be changed
what checks to run
what evidence is required
what external framework owners control reusable primitives
what the next Git action is
```

At that point PR #6 can become accepted history and future work returns to small, independently reviewable branches from verified `main`.
