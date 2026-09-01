# xi-io: Saskatchewan Family Law Self-Help

Status: `ACTIVE MANAGED SELF-HOST PROOF; RUNTIME LEGAL WORK BLOCKED`  
Project ID: `sask_family_law_self_help`  
Repository: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`  
Default branch: `main`  
Current PR: `#9`  
Current branch: `feat/current-situation-selfhost-001`  
Current ChangeUnit: `SFL-CURRENT-SITUATION-001`

## Current status

This repository is the Saskatchewan jurisdiction package for the planned `xi-io: sam_law` product. Recovery PR #6 merged on August 12, 2026. The current admitted mutation lane is PR #9, which is proving the product-local `CurrentSituation` self-host primitive. PR #10 remains serialized `WAIT` and has no active mutation authority while PR #9 owns the single-writer lane.

Current cold-start/custody surfaces are:

1. `docs/ops/CURRENT_EXECUTION_PLAN.md`, stable present-tense execution-plan entry point.
2. `docs/ops/ACTIVE_WORK_CHECKPOINT.md`, fail-closed durable custody projection.
3. `docs/ops/CURRENT_LANE_STATUS.md`, concise active-lane projection.
4. `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md`, provider-neutral public worker obligations.
5. `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md`, historical/process-freshness evidence, not current custody authority.

A fresh worker must resolve the stable current plan and, where the execution surface permits it, run `npm run current:situation` before selecting or creating Git work. Do not infer current work from newest branch, PR, issue comment, commit, dated plan, or chat history.

| Area | Current state |
|---|---|
| Accepted repository truth | `main@5f9d2a46898d97b87503cff2a2554c2eec665d47` |
| Active mutation lane | PR `#9` / `feat/current-situation-selfhost-001` |
| Current ChangeUnit | `SFL-CURRENT-SITUATION-001` |
| Serialized sibling | PR `#10` = `WAIT_SERIALIZED`, retained evidence, no active mutation authority |
| PR #5 | `FROZEN_DONOR / SALVAGE_SOURCE`, no wholesale merge |
| Current proof gate | exact-head hosted validation -> hostile review -> independent external-worker review -> owner disposition |
| Strategic/waterfall projection | product vision/architecture exist; one typed accepted PlanRevision projection still missing |
| Agile/current-work projection | historical work evidence exists; separate canonical planning object pending |
| Active execution projection | stable current plan + checkpoint + lane + live CurrentSituation resolver |
| Legal source model | multi-kit recovery/source review active but separately gated |
| Runtime legal/procedural rules | blocked |
| Private matter runtime | blocked / not accepted |
| AI runtime | blocked / not accepted |
| External-worker discovery | public-safe pilot projection present |
| External holdout evidence | Aug 17 holdout produced `PASS_WITH_FINDINGS`; current exact-head independent qualification still required after later bytes |
| Court/email transmission | forbidden / not implemented |
| Legacy framework namespace | tracked under `xi/`, preserve as legacy input |
| New `xiio/` writes | blocked pending explicit current framework adoption/migration authority |
| Rights/license posture | repository public; project license not selected; reuse/distribution claims remain unresolved |
| Framework rebase observation | private framework main observed at `0c9db9b1395b626d7fd0b8b4bea3bc9d1586cc53` on 2026-09-01; observation is not automatic adoption |

## What this repo is

This project converts governed Saskatchewan family-law self-help sources into deterministic, progressive-disclosure workflows. The governed unit is a workflow/procedural source, not merely a blank form.

For every admitted source family the product must capture, review and preserve:

```text
source identity and exact version
-> forms physically included
-> every form line item
-> applicability and selection rules
-> supporting-document obligations
-> prerequisites
-> service/proof alternatives
-> filing steps and deadlines
-> hearing/post-hearing process
-> discrepancies and blocked branches
-> reviewed deterministic projection
```

A reference slice proves a bounded workflow only. It does not prove that all Saskatchewan family-law self-help source families, forms or process handoffs have been inventoried.

The product architecture is owner-approved in `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`. The legal matter/workbench interaction grammar uses reusable xi-io patterns while legal source truth stays target-owned.

## Canonical source snapshot

The historical first canonical snapshot remains `jcc-kit-3j-2026-03-30` in `sources/source-registry.json`. That registry still reflects the first-slice single-global-snapshot assumption and is under recovery.

Additional source families currently exist only as governed recovery intake unless separately approved:

- Kit #2a, Preparing an Answer and Counter-Petition, dated 2023-04-10,
- Kit #4a, Replying to a Court Application, dated 2023-04-10,
- standalone Form 15-52 with supplied Rule 15-52, revision date unresolved,
- dated procedural/scheduling reference candidates.

Kit #3J currently has six physically included forms cataloged with 267 line items, but independent rendered-source/current-official review is incomplete.

No source under `sources/intake/` is runtime-admissible merely because it has been captured structurally.

## Required freshness disclosure

Every future workflow, form workspace, preview and package must expose source provenance and freshness appropriate to the exact governing source family, including:

- source/version date,
- capture date,
- current-official comparison state,
- reviewer/verification state,
- stale/unknown/disputed warning where applicable.

Unknown, stale, changed, unavailable or materially disputed source state must block the affected final-ready filing/service/transmission path. It must not falsely invalidate unrelated source families.

## What this repo is not

- It is not a law firm, lawyer, court, filing service or source of legal advice.
- It is not authorized to decide entitlement or predict outcomes.
- It does not yet have accepted court, service or email transmission capability.
- It does not store real case files in this public repository.
- It does not make AI mandatory for core use.
- It does not treat generated drafts, structural catalogs, Inbox donor behavior or framework candidates as verified legal truth.
- It is not a fork of `xi-io Inbox` and must not depend on Inbox `main` at runtime.
- It is not licensed for reuse/distribution merely because the repository is public.
- It does not treat product-family identity or a framework/synthesis convergence projection as legal-currentness, safety or mutation authority.

## Human-only path

The intended product must remain usable without AI. A user must be able to select or confirm an applicable workflow, answer plain-language questions, edit facts, understand why information is requested, identify supporting records, review every generated field/paragraph and produce an approved package through deterministic rules.

## AI-assisted path

AI is optional and subordinate to deterministic/legal source gates. It may explain, ask bounded follow-ups, organize user-provided facts, draft proposed wording, compare information and identify missing support.

It may not invent facts or procedure, silently choose legal relief, override deterministic rules, approve revisions, sign, swear, commission, file, serve or send.

`XiSelectedContext`/Ibal proposal state is context and recommendation, not execution authority.

External development agents consume the provider-neutral public contract; provider-specific adapters may change discovery/representation only, not policy or authority.

## Local-first and data posture

This repository may contain public source records, schemas, synthetic fixtures, governance artifacts and product code that contains no real matter data. Real legal matters belong in a separate private local workspace with explicit security, deletion, recovery and consent controls.

Private legal data, completed forms, tax/medical/financial records, correspondence and provider credentials must not be committed here.

## Safe commands

```bash
npm run check
npm run check:foundation
npm run check:source-catalog
npm run check:recovery-sources
npm run check:framework-component-promotion-lock
npm run check:public-managed-worker-contract
npm run check:current-situation
npm run current:situation
git diff --check
```

No dependency installation is required for the current checks.

Detailed applicability is in `docs/ops/verification-runbook.md`.

## Blocked commands

Unless a separately admitted and approved lane says otherwise:

```text
destructive Git / force push / history rewrite
merge or release without owner gate
branch deletion / broad cleanup without proof and explicit retirement authority
public deploy or tunnel changes
secret or .env display
schema/database migration
private matter ingestion
court filing or service
email/provider mutation
AI-provider egress involving real matter data
cross-repo mutation
wholesale PR #5 merge
new canonical xi-io.net registry writes from this repo
new xiio/ managed-project writes before the framework namespace prerequisite clears
Claude settings/hooks/subagent enforcement work inside PR #9
capability-distribution / Bug-work / SDK / MCP expansion inside PR #9
legal-source promotion inside PR #9
```

## Documentation map

Start here for current work:

1. `docs/ops/CURRENT_EXECUTION_PLAN.md`, stable present-tense execution/custody authority.
2. `docs/ops/ACTIVE_WORK_CHECKPOINT.md`, fail-closed durable active-work checkpoint.
3. `docs/ops/CURRENT_LANE_STATUS.md`, concise active-lane projection.
4. `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md`, provider-neutral worker contract.
5. `AGENTS.md`, worker rules.
6. `docs/INDEX.md`, navigation.
7. `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md`, recovery provenance.
8. `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md`, historical/process delta.
9. `docs/ops/SFL-PR5-SALVAGE-MAP-001.md`, completed donor classification.
10. `docs/ops/execution-sequence-v1.md`, product gate dependency graph.
11. `project-tracking/open-work-ledger.md`, historical work inventory, not current selection authority.
12. `docs/product/product-vision-locked-v1.md`, product vision.
13. `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`, architecture approval.

External-worker / Claude handoff:

- `CLAUDE.md`
- `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md`
- `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.json`
- `docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md`
- `docs/ops/verification-runbook.md`
- `docs/ops/do-not-touch-register.md`

Reusable primitive intake:

- `docs/source-materials/inbox-mail-workbench-donor-census-2026-08-12.md`
- `docs/source-materials/inbox-framework-component-promotion-lock-v1.md`
- `docs/source-materials/inbox-framework-component-promotion-lock-v1.json`
- `docs/source-materials/inbox-framework-component-source-map-v1.json`

## Related framework records

Canonical framework repository: `Vado42-chris/xi-io.net`.

The 2026-09-01 cold-start rebase observed framework main `0c9db9b1395b626d7fd0b8b4bea3bc9d1586cc53` and consumed these current invariants for this lane:

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

The public managed-worker contract remains a dated product-local export and is not silently relabelled as synchronized to current framework main. That framework-delta work remains separately gated.

Current owner/provenance pointers materially affecting future sam_law adoption include framework work for Git cadence/mutation admission, namespace/read-order reconciliation, Task Context, strategy-to-execution lifecycle, capability distribution/adopter locks, rights qualification, managed-project onboarding, Work Continuation, and runtime-main closure.

Open framework planning work is not automatically an accepted product contract. Required public-worker obligations must be exported locally, and product adoption must remain explicit.

## Known gaps

- `SFL-COLD-BIND-001`: the current framework has a local worker-bind script, but this connector-hosted worker has no provider-neutral binder action/receipt surface.
- `SFL-FRAMEWORK-DRIFT-001`: the public worker contract export basis predates observed framework main and needs a bounded delta/adoption pass, not a version-string edit.
- PR #9 still requires exact-head hosted validation and independent review after the 2026-09-01 onboarding repair bytes.
- A single typed accepted strategic PlanRevision/current phase/gate projection is not yet on accepted `main`.
- The historical recovery queue is not a canonical agile-plan object.
- Kit #3J independent rendered/current-source review is incomplete.
- Kit #2a full form/process review and current official comparison are incomplete.
- Kit #4a full form/process review and current official comparison are incomplete.
- Form 15-52 revision/currentness and complete review are unresolved.
- Multi-kit source-family canonical semantics are not yet accepted.
- Repeated forms across kits are not proven equivalent.
- Legacy `xi/` contracts have not been migrated to `xiio/`.
- Framework primitive rows are not yet canonical registry entries.
- No accepted runtime schema/triage/task/form engine exists on `main` for the recovered product scope.
- No accepted private workspace, AI adapter, egress or transmission system exists.
- Project rights/license/contribution/distribution posture requires a future explicit qualification pass.
- Saskatchewan's broader self-help kit catalogue still requires authoritative reconciliation before completeness can be claimed.

## Next action

Do **not** start another development branch.

Continue `SFL-CURRENT-SITUATION-001` in PR #9 according to `docs/ops/CURRENT_EXECUTION_PLAN.md`:

1. keep PR #10 serialized `WAIT`,
2. run `npm run check` and `git diff --check` on the exact current PR #9 head,
3. run `npm run current:situation` and confirm it resolves PR #9 plus the exact local HEAD,
4. require exact-head hosted Foundation Check success,
5. perform exact-head hostile review of the final bytes,
6. obtain an independent external-worker review on the same exact head,
7. stop for explicit owner disposition,
8. only with applicable merge authority, merge PR #9,
9. read back accepted `main`,
10. verify affected onboarding consumers return current before granting runtime credit.

`PASS = NEXT_FROZEN_INPUT`. A green PR branch is not product-current runtime.

## Maintenance rule

This README is orientation, not the execution SSOT. When current work custody changes, update `docs/ops/CURRENT_EXECUTION_PLAN.md`, checkpoint, and lane first, then keep README/AGENTS/INDEX/provider adapters consistent. `npm run check:foundation` now fails if these three entry points drift from the active branch/PR/ChangeUnit again.

Do not describe captured source, planning item, framework candidate, product implementation or release state as current/verified without linked evidence.

## License

No project license has been selected. Repository visibility does not itself grant reuse rights beyond applicable law.
