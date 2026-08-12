# Project Startup Recovery, sask_family_law_self_help, 2026-08-12

Status: `ACTIVE EXISTING-PROJECT RECOVERY; implementation remains gated`  
Date: `2026-08-12`  
Project: `sask_family_law_self_help`  
Branch: `chore/framework-recovery-2026-08-12`

```yaml
generated_not_truth: true
recovery_mode: adopt_existing_project
project_recreation: false
framework_compliance_claimed: false
runtime_verified: false
legal_currentness_verified: false
private_case_data_allowed: false
merge_authorized: false
```

## Recovery decision

```text
ADOPT_EXISTING_PROJECT
+
RECOVER_CURRENT_TRUTH
+
MIGRATE_LEGACY_XI_NAMESPACE
+
REBASE_AGAINST_CURRENT_FRAMEWORK
+
CORRECT_SINGLE-KIT FIRST-SLICE ASSUMPTIONS
```

The original 2026-07-22 startup record remains historical evidence. It was accurate for the empty repository at that time and must not be rewritten as though later framework and product discoveries were known then.

## Owner scope correction

The product is intended to turn governed Saskatchewan family-law self-help kits into guided workflows, not to hard-code one Judicial Case Conference kit.

For every admitted kit, the source unit includes both forms and process:

```text
source artifact
  -> form inventory
  -> all line items
  -> applicability/decision rules
  -> supporting-document obligations
  -> procedural stages
  -> prerequisites
  -> service/filing alternatives
  -> deadlines
  -> hearing/follow-up states
  -> discrepancies
  -> reviewed runtime projection
```

A source capture that inventories blank fields but fails to capture the rules that determine what the user must complete is incomplete for this product.

## Current repository branch truth

At recovery start there are seven branches.

- `main`, accepted repository baseline for recovery.
- `feat/synthetic-legal-workbench-001`, the only branch with unique unmerged work, 64 commits ahead of `main` at audit time.
- five historical branches contain no commits unique from `main` and are branch-cleanup candidates after recovery evidence is accepted.

PR #5 remains a salvage source, not an automatic merge target. Its implementation must be re-evaluated against current source, workspace, namespace, Task Context, security and Git governance before bounded slices are promoted.

## Framework drift found

The July 22 bootstrap references framework commit `c29afb513d6e44511ecb00bec7514df3229f7d0c`. At the August 12 audit, xi-io.net `main` had advanced 195 commits beyond that point.

Material later framework direction includes:

- Project Kernel adoption for existing repositories,
- `.xiio/` for local runtime state,
- `xiio/` for repo-safe portable framework contracts,
- legacy `xi/` as compatibility input only,
- user/workspace lifecycle planning,
- storage profiles,
- Ibal profile/runtime direction,
- MCP/A2A lifecycle contracts,
- deterministic Task Context compilation and freshness/admission gates.

The current project still stores its portable contracts under legacy `xi/`. Recovery must inspect and migrate those contracts deliberately. Legacy files must not be silently deleted or overwritten.

## Source-model drift found

The repository currently models `jcc-kit-3j-2026-03-30` as the single `current_snapshot_id` in `sources/source-registry.json`.

That was sufficient for the first reference slice but is not sufficient for the intended product. Different self-help kits and form families can have independent source dates, revisions and freshness states. A later source-model pass must support multiple independently versioned source families without implying that one global snapshot governs the entire product.

## Kit #4a recovery finding

The supplied Kit #4a, `Replying to a Court Application`, dated 2023-04-10, was not represented in `main` or PR #5 at recovery start.

It physically contains:

- Form 13-31, Affidavit,
- Form 15-47, Financial Statement,
- Form 15-8B, Affidavit of Service by Alternate Mode,
- Form 12-3, Acknowledgment of Service.

It also contains procedural instructions and decision logic, including a 42-row Form 15-47 situation matrix selecting among seven schedules.

Recovery intake records now live under:

```text
sources/intake/kit-4a/2023-04-10/
```

These are explicitly unreviewed intake evidence, not approved runtime truth.

## Known Kit #4a blockers

- exact source binary is hash-verified in the recovery session but not archived in Git,
- 2023 artifact has not been verified against a current official source,
- Form 13-31 full line-item catalog is pending,
- Form 15-47 full line-item/schedule/supporting-document catalogs are pending,
- Form 15-8B and Form 12-3 cross-snapshot equivalence is unproven,
- 42-row schedule matrix is captured but independently unreviewed,
- procedural workflow graph is pending,
- filing deadline conflict, 7 days versus 3 days, is unresolved,
- Form 12-3 versus Form 12-13 naming conflict is unresolved,
- proof-of-service filing wording conflicts are unresolved,
- Form 15-8B courier-mode detail requires rendered/current-source review,
- Form 15-47 row 36 source text requires rendered/current-source review.

## Recovery work order

1. Record recovery scope and source gaps without claiming compliance.
2. Preserve Kit #4a source identity and machine-extracted decision matrix as unreviewed intake.
3. Refresh project ledgers and execution gates so Kit #4a cannot be forgotten.
4. Design multi-kit source registry semantics before promoting Kit #4a to an approved snapshot.
5. Perform current official-source comparison.
6. Capture and independently review all Kit #4a forms, schedules, supporting-document rules and procedural stages.
7. Migrate repo-safe Project Kernel contracts from legacy `xi/` to `xiio/` through a reviewed migration map.
8. Refresh README, AGENTS, manifest, capability, feature, lexicon and UI profiles against current framework truth.
9. Audit PR #5 against the recovered source and framework state.
10. Salvage PR #5 only in bounded sequential slices after prerequisite gates pass.
11. Merge the recovery branch only after validation and human review.
12. Prune historical branches only after their absence of unique truth is re-confirmed at cleanup time.

## Current implementation gate

Product runtime remains blocked by source correctness.

The former statement that `SFL-SOURCE-REVIEW-002` alone represented complete source readiness is superseded in scope. The project now requires both:

- completion/reconciliation of the existing Kit #3J review work, and
- `SFL-KIT-4A-SOURCE-RECOVERY-001` for the owner-supplied Kit #4a source family.

Neither gate may silently infer current law or procedure from the supplied documents.

## Immediate next action

Continue this recovery branch with append-only work-ledger and execution-sequence corrections, multi-kit source-registry planning, and Project Kernel namespace migration planning. Do not merge PR #5 or resume broad runtime work while these source and framework gates remain unresolved.
