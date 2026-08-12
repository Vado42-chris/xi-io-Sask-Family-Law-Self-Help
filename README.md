# xi-io: Saskatchewan Family Law Self-Help

Status: `ACTIVE EXISTING-PROJECT RECOVERY; RUNTIME LEGAL WORK BLOCKED`  
Project ID: `sask_family_law_self_help`  
Repository: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`  
Default branch: `main`  
Current recovery PR: `#6`  
Current recovery branch: `chore/framework-recovery-2026-08-12`

## Current status

This repository is being recovered and re-onboarded from an older single-workflow bootstrap into the Saskatchewan jurisdiction package for the planned `xi-io: sam_law` product. The project is not a one-kit JCC application.

Current cold-start/custody surfaces are:

1. `docs/ops/ACTIVE_WORK_CHECKPOINT.md`
2. `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`
3. `docs/ops/CURRENT_LANE_STATUS.md`
4. `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md` for kickoff/process-freshness state.

A fresh worker must resolve those before selecting or creating Git work. Do not infer current work from newest branch, PR, issue comment or commit.

| Area | Current state |
|---|---|
| Accepted repository truth | `main` |
| Active proposed recovery | PR `#6` |
| Current ChangeUnit | `SFL-RECOVERY-CLOSEOUT-001` |
| PR #5 | `FROZEN_DONOR / SALVAGE_SOURCE`, no wholesale merge |
| Strategic/waterfall projection | product vision/architecture exist; one typed accepted PlanRevision projection still missing |
| Agile/current-work projection | recovery dependency queue exists; separate canonical planning object pending |
| Active execution projection | checkpoint + lane + detailed execution plan in PR #6 |
| Legal source model | multi-kit recovery active |
| Runtime legal/procedural rules | blocked |
| Private matter runtime | blocked / not accepted |
| AI runtime | blocked / not accepted |
| Claude discovery contract | present as public-safe pilot projection |
| Claude conformance | not yet executed; first final run is post-recovery fresh clone |
| Court/email transmission | forbidden / not implemented |
| Legacy framework namespace | tracked under `xi/`, preserve as legacy input |
| New `xiio/` writes | blocked pending framework namespace/read-order prerequisite |
| Rights/license posture | repository public; project license not selected; reuse/distribution claims remain unresolved |
| Inbox-derived primitive names | source-mapped promotion intake only, not canonical framework registry truth |

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

## Human-only path

The intended product must remain usable without AI. A user must be able to select or confirm an applicable workflow, answer plain-language questions, edit facts, understand why information is requested, identify supporting records, review every generated field/paragraph and produce an approved package through deterministic rules.

## AI-assisted path

AI is optional and subordinate to deterministic/legal source gates. It may explain, ask bounded follow-ups, organize user-provided facts, draft proposed wording, compare information and identify missing support.

It may not invent facts or procedure, silently choose legal relief, override deterministic rules, approve revisions, sign, swear, commission, file, serve or send.

`XiSelectedContext`/Ibal proposal state is context and recommendation, not execution authority.

External development agents such as Claude consume `docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md`; provider-specific adapters may change discovery/representation only, not policy or authority.

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
git diff --check
```

No dependency installation is required for the current checks.

Detailed applicability is in `docs/ops/verification-runbook.md`.

## Blocked commands

Unless a separately admitted and approved lane says otherwise:

```text
destructive Git / force push / history rewrite
merge or release without owner gate
branch deletion / broad cleanup
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
Claude settings/hooks/subagent enforcement work inside PR #6
```

## Documentation map

Start here for current work:

1. `docs/ops/ACTIVE_WORK_CHECKPOINT.md`, fail-closed active-work checkpoint.
2. `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`, detailed current GitHub execution/custody authority.
3. `docs/ops/CURRENT_LANE_STATUS.md`, concise active-lane projection.
4. `AGENTS.md`, worker rules.
5. `docs/INDEX.md`, navigation.
6. `docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md`, recovery provenance.
7. `docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md`, current kickoff/process delta.
8. `docs/ops/execution-sequence-v1.md`, product gate dependency graph.
9. `project-tracking/open-work-ledger.md`, work inventory.
10. `docs/product/product-vision-locked-v1.md`, product vision.
11. `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md`, architecture approval.

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

Current owner/provenance pointers materially affecting future sam_law adoption include framework work for:

- Git cadence / mutation admission,
- namespace/registry/read-order reconciliation,
- Task Context,
- strategy-to-execution lifecycle,
- versioned capability distribution/adopter locks,
- rights/licensing/contribution/distribution qualification,
- managed-project onboarding/re-onboarding,
- Work Continuation,
- planning-promotion graduation.

Open framework planning work is not automatically an accepted product contract. Required public-worker obligations must be exported locally, and product adoption must remain explicit.

## Known gaps

- PR #6 still requires the read-only PR #5 salvage map before closeout.
- Current kickoff/re-onboarding bytes require fresh exact-head validation and hostile review.
- A single typed accepted strategic PlanRevision/current phase/gate projection is not yet on accepted `main`.
- The recovery queue is not yet a canonical agile-plan object.
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
- Claude conformance has not yet been run from an accepted fresh clone.
- Claude enforcement hooks/settings/subagents and provider-neutral executable preflight are not yet built.
- Project rights/license/contribution/distribution posture requires a future explicit qualification pass.
- Saskatchewan's broader self-help kit catalogue still requires authoritative reconciliation before completeness can be claimed.

## Next action

Do **not** start another development branch.

Finish `SFL-RECOVERY-CLOSEOUT-001` in PR #6 according to `docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md`:

1. finish the read-only PR #5 salvage map,
2. run `npm run check` and `git diff --check` on the exact current head,
3. require exact-head hosted CI success,
4. perform exact-head hostile review,
5. obtain explicit owner merge approval,
6. merge PR #6,
7. verify merged `main`,
8. record recovery closeout/retirement evidence,
9. then run `CLAUDE-CONFORMANCE-001` from a fresh clone with no chat history/private framework access,
10. only after that evidence admit the next bounded development/worker-preflight ChangeUnit.

## Maintenance rule

This README is orientation, not the full execution ledger. When current work custody changes, update the active-work checkpoint and execution plan first, then keep README/AGENTS/INDEX/Claude pointers consistent.

Do not describe captured source, planning item, framework candidate, product implementation or release state as current/verified without linked evidence.

## License

No project license has been selected. Repository visibility does not itself grant reuse rights beyond applicable law.
