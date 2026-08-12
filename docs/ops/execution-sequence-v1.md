# Execution Sequence v1

Status: `ACTIVE PRODUCT GATE DEPENDENCY GRAPH; GIT MUTATION CADENCE OWNED BY SFL-GITHUB-EXECUTION-PLAN-2026-08-12`  
Project: `sask_family_law_self_help`

This file defines product/source gate dependencies. It does **not** choose the active Git branch or authorize parallel mutation lanes.

For current GitHub custody, branch/PR instructions, allowed/blocked paths, closeout order and next-branch rules, read first:

`docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`

## Current Git state

```text
accepted repository truth = main
active proposed recovery = PR #6 / chore/framework-recovery-2026-08-12
current ChangeUnit = SFL-RECOVERY-CLOSEOUT-001
PR #5 = FROZEN_DONOR / SALVAGE_SOURCE
next new branch = NONE until PR #6 merges and merged main is verified
```

## Gate 0 — SFL-FRAMEWORK-RECOVERY-001

Purpose: recover the existing repository against current xi-io framework direction without pretending it is a blank project.

Required recovery outcomes:

- exact repository/branch/framework state is known,
- multi-kit product scope is represented,
- legacy `xi/` contracts are preserved and migration is planned non-destructively,
- README/AGENTS/INDEX/cold-start instructions agree,
- PR #5 is treated as donor/salvage work rather than a merge unit,
- Inbox-derived reusable primitives are source-mapped and routed to framework owners rather than copied locally,
- recovery sources remain fail-closed intake unless explicitly promoted,
- repository checks, exact-head review and owner merge gate pass.

Current state: `ACTIVE / PR #6 CLOSEOUT`.

Git action for this gate is defined exclusively by the current GitHub execution plan.

## Gate 1 — source-family governance foundation

### SFL-MULTI-KIT-SOURCE-001

Purpose: replace the unsafe assumption that one global `current_snapshot_id` represents all source truth.

Acceptance:

- source families have independent stable identities,
- current/superseded state is per source family,
- repeated forms have explicit equivalence/divergence relationships,
- workflows resolve exact governing source snapshots,
- stale/blocked source state affects only dependent workflows,
- intake-only sources cannot become runtime truth without reviewed promotion,
- validators fail closed on ambiguous governing source identity.

Current state: `PLANNED DESIGN RECORDED / IMPLEMENTATION AFTER RECOVERY MAIN`.

This is the first broadly reusable legal-source data-contract prerequisite after PR #6 closeout unless a higher-priority owner decision changes the queue.

## Gate 2 — independent source-family review

Source families may be reviewed in bounded lanes, but Git mutation remains one admitted branch at a time unless truly independent concurrent ownership is explicitly admitted.

### SFL-SOURCE-REVIEW-002 — Kit #3J

Acceptance:

- exact source bytes archived and hash-verified,
- 267 captured line items independently compared against rendered pages,
- transcription differences receipted,
- required companion sources obtained or explicitly excluded,
- discrepancies affecting service/filing resolved or blocking,
- current-official comparison date and reviewer recorded,
- human source approval received.

Current state: `BLOCKED_ON_REVIEW_AND_MISSING_SOURCES`.

### SFL-KIT-2A-SOURCE-RECOVERY-001

Source: Preparing an Answer and Counter-Petition, 2023-04-10 supplied artifact.

Acceptance:

- exact bytes archived/hash-verified,
- current official comparison/freshness disposition,
- all nine included form instances completely cataloged,
- Answer versus Answer-and-Counter-Petition selection represented deterministically,
- Form 15-47/15-49 structures and obligations captured or linked through reviewed equivalence,
- Form 15-51 conditional use represented,
- prerequisites, timing, service, proof, filing and post-filing process captured,
- Form 12-3/12-13 and 15-8A/15-18A conflicts resolved or affected paths remain blocked,
- repeated forms compared across source families before reuse,
- rendered-page review and human approval complete.

Current state: `ACTIVE_PARTIAL IN RECOVERY INTAKE / DEEP COMPLETION DEFERRED TO POST-RECOVERY SOURCE LANE`.

### SFL-KIT-4A-SOURCE-RECOVERY-001

Source: Replying to a Court Application, 2023-04-10 supplied artifact.

Acceptance:

- exact bytes archived/hash-verified,
- current official comparison/freshness disposition,
- all four included forms completely cataloged,
- seven Form 15-47 schedules completely cataloged,
- 42 situation-to-schedule relationships independently verified,
- supporting-document obligations captured,
- applicability, prerequisites, service, filing, hearing and post-hearing process represented as source-bound rules,
- repeated forms compared before reuse,
- deadline/form/service conflicts resolved or blocking,
- rendered-page review and human approval complete.

Current state: `ACTIVE_PARTIAL IN RECOVERY INTAKE / DEEP COMPLETION DEFERRED TO POST-RECOVERY SOURCE LANE`.

### SFL-FORM-15-52-SOURCE-RECOVERY-001

Acceptance:

- exact bytes archived/hash-verified,
- current official Rule 15-52/Form 15-52 located and compared,
- source revision/currentness established or explicitly unknown/blocked,
- every field/request choice/warning/address-for-service field has a stable source ID,
- service/response, objection, correction and non-response branches represented as reviewed rules,
- dependencies on current Form 15-47/15-49 explicit,
- rendered-page review and human approval complete.

Current state: `ACTIVE_PARTIAL IN RECOVERY INTAKE / DEEP COMPLETION DEFERRED TO POST-RECOVERY SOURCE LANE`.

### SFL-PROCEDURAL-REFERENCE-001

Purpose: govern dated schedule/poster/reference artifacts without allowing stale schedule data to become current court-calendar truth.

Current state: `QUEUED`.

## Gate 3 — SFL-SCHEMA-001

Purpose: make reviewed source/workflow and matter contracts executable.

Entry:

- applicable source-family semantics accepted,
- source families required for the implementation slice are reviewed/approved.

Exit:

- executable schemas,
- deterministic validators,
- synthetic fixtures,
- explicit source bindings.

Current state: `BLOCKED`.

## Gate 4 — SFL-TRIAGE-001

Purpose: human-only applicability and form-selection triage.

Entry: executable source-bound schemas.

Exit:

- deterministic decision tree,
- explanation of why each path/form is selected,
- safe `I do not know`/blocked/escalation behavior,
- synthetic tests.

Current state: `BLOCKED`.

## Gate 5 — SFL-TASKPLAN-001

Purpose: generate deterministic form, schedule, evidence and homework plans.

Entry: triage accepted.

Exit: synthetic dependency/deadline/task-plan fixtures and tests.

Current state: `BLOCKED`.

## Gate 6 — SFL-UX-001

Purpose: progressive-disclosure legal workbench shell using qualified reusable xi-io primitives where available.

Entry:

- human-only deterministic logic accepted,
- applicable framework component adoption path resolved,
- no legal source ambiguity is being hidden by UI.

Exit:

- keyboard/a11y/responsive/cognitive-load proof,
- owner visual review,
- no fake affordances,
- clear trust/source state.

Current state: `BLOCKED`.

Important framework chain:

```text
Inbox donor evidence
-> xi-io.net#236 promotion/collision review
-> xi-io.net#306 registry admission prerequisites
-> framework implementation/versioning
-> xi-io.net#315 adopter lock
-> SFL/sam_law target adoption
```

The 33 locked primitive identities in this repo are promotion intake, not implementation authority.

## Gate 7 — SFL-DRAFT-001

Purpose: user-controlled narrative drafting.

Entry: private-data boundary and applicable source/schema gates approved.

Exit: revision/provenance/user-approval receipts.

Current state: `BLOCKED`.

## Gate 8 — SFL-FORMS-001

Purpose: map approved facts into exact governed form templates.

Entry: form/source review and deterministic field bindings accepted.

Exit: field-map tests and rendered-form comparisons.

Current state: `BLOCKED`.

## Gate 9 — SFL-PRIVATE-001

Purpose: real private matter workspace.

Entry: threat model, retention/deletion/recovery policy and storage boundary approved.

Exit: encryption, isolation, deletion and recovery evidence.

Current state: `BLOCKED`.

## Gate 10 — SFL-AI-001

Purpose: optional Ibal/AI assistance.

Entry: private workspace, consent/provider contract and authority ceilings approved.

Exit: grounding, redaction, fallback/disable, cost/privacy and proposal-only tests.

Current state: `BLOCKED`.

AI must never be required for core workflow completion.

## Gate 11 — SFL-EGRESS-001

Purpose: package generation only.

Entry: applicable form/source review accepted.

Exit: exact revision/attachment/source/hash manifest and export receipt.

Current state: `BLOCKED`.

## Gate 12 — SFL-TRANSMIT-001

Purpose: any filing, service, provider-send or external delivery capability.

Entry:

- receiving process independently verified,
- security/authority/provider gates qualified,
- human approval model accepted.

Exit:

- approval,
- attempted-delivery receipt,
- observed provider outcome,
- acceptance/rollback distinction,
- no provider outcome inflated into legal acceptance without authoritative proof.

Current state: `BLOCKED`.

## Cross-cutting sequencing rules

- The governed unit is a source workflow/procedural source, not merely a blank form.
- Source capture and independent review precede executable legal rules.
- Form/schedule selection resolves stable source-bound identities.
- Same form number across kits does not prove equivalence.
- Contradictions affecting deadline, filing, service, signature, fee or recipient block the affected runtime branch.
- Human-only deterministic behavior precedes AI enhancement.
- Synthetic fixtures precede real private data.
- Package generation precedes transmission.
- Passing structural checks are evidence, not legal-content approval.
- New source versions create new snapshots/diffs rather than overwriting old snapshots.
- Legal, privacy, security, accessibility and source-version reviews are explicit gates.
- PR #5 is donor evidence until a salvage map classifies coherent future slices.
- Framework primitive candidates are not canonical merely because SFL needs them.

## Current next Git action

Do not start a new source, UI, schema, private-workspace or PR #5 harvest branch yet.

Current action is:

```text
SFL-RECOVERY-CLOSEOUT-001
-> finish PR #6 recovery/control-plane closeout
-> npm run check + git diff --check
-> exact-head hostile review
-> explicit owner gate
-> merge PR #6
-> verify merged main
-> record receipt / retire lane
-> only then admit one next current-main micro-branch
```

Exact instructions are in `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`.
