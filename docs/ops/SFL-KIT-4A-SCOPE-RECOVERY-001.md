# SFL Kit #4a Scope Recovery 001

Status: `ACTIVE RECOVERY GATE; source captured as user-supplied artifact identity only; legal/procedural currentness not verified`  
Date: `2026-08-12`  
Project: `sask_family_law_self_help`  
Recovery branch: `chore/framework-recovery-2026-08-12`

```yaml
generated_not_truth: true
scope: kit_4a_source_scope_and_repository_gap_audit
runtime_rule_approval: false
legal_currentness_verified: false
private_matter_data_allowed: false
source_binary_archived_in_repo: false
framework_compliance_claimed: false
```

## Owner point of order

The product is not satisfied by capturing isolated forms from one reference kit. For each governed self-help kit, the repository must preserve and model:

- every form physically included in the kit,
- every question, blank, choice, row, signature, commissioner field, attachment requirement and court-only field,
- the instructions for completing each form,
- the conditions that determine whether a form or schedule applies,
- service, filing, hearing and post-hearing process steps,
- deadlines and prerequisite actions,
- alternative procedural paths,
- source discrepancies and contradictions,
- exact source provenance, freshness and supersession state.

The user-facing product must be able to explain what appears applicable and why from reviewed deterministic source rules. A form catalog without the kit's decision and process logic is incomplete.

## Supplied source identity

| Field | Observed value |
|---|---|
| Source title | Kit #4a, Replying to a Court Application, Self-Help Kit |
| Supplied filename | `K04a - Replying to a Court Application - FINAL - KB - 2023.04.10 (1).docx` |
| Printed source date | `2023-04-10` |
| Reported pages | `44` |
| Supplied bytes | `160117` |
| SHA-256 | `c73537d34d1c9b00b518e7b15645cab2a6cf8ee3431a27b822a3c324ef255ade` |
| Jurisdiction | Court of King's Bench for Saskatchewan, Family Law Division |
| Source class | user-supplied public legal information |
| Initial freshness state | `captured_unverified_current` |
| Official-current comparison | missing |
| Exact binary archived in Git | no, connector cannot safely create the binary artifact |

No currentness claim is made from the 2023 source date. A current official-source comparison is required before any procedural rule from this snapshot can become final-ready runtime truth.

## Kit purpose observed in source

The kit states that it is for a person replying to the other party's application involving decision-making responsibility, parenting time, child support, spousal support, or combinations of those issues.

This is a workflow source, not merely a bundle of blank forms.

## Forms physically included

The supplied 44-page artifact contains four named forms:

| Form | Role in Kit #4a | Recovery state |
|---|---|---|
| Form 13-31, Affidavit | Core reply evidence document | `missing_from_repo` |
| Form 15-47, Financial Statement | Conditional financial disclosure document with seven schedules | `missing_as_captured_form`; only referenced as absent in the Kit #3J catalog |
| Form 15-8B, Affidavit of Service by Alternate Mode | Alternative proof-of-service path | `exists_only_under_kit_3j_snapshot`; equivalence to this artifact not proven |
| Form 12-3, Acknowledgment of Service | Alternative proof-of-service path | `exists_only_under_kit_3j_snapshot`; equivalence to this artifact not proven |

A form captured under another snapshot does not automatically satisfy this snapshot. Reuse requires source comparison, version/equivalence evidence and an explicit relationship record.

## Form 15-47 is itself a decision system

Form 15-47 contains seven named schedules:

1. Schedule 1, Employment Information and Income
2. Schedule 2, Expenses
3. Schedule 3, Special or Extraordinary Expenses
4. Schedule 4, Child-Centred Budget
5. Schedule 5, Income for Other Persons Residing in Household
6. Schedule 6, Undue Hardship
7. Schedule 7, Net Worth Statement

The embedded checklist contains 42 numbered situation rows used to determine which schedules must be attached:

- rows 1-22 cover making a claim/application,
- rows 23-42 cover responding to a claim/application.

The situation matrix covers, among other things:

- child age 18 or older,
- stepchildren,
- income above $150,000,
- special or extraordinary expenses,
- retroactive support,
- presence or absence of a property claim,
- shared parenting with agreed or disputed set-off,
- variation of existing support orders,
- undue hardship,
- spousal support,
- reduction or elimination of arrears.

The matrix-to-schedule relationships are procedural source truth. They must be captured as stable source-bound rules, not flattened into prose or replaced with AI interpretation.

Each schedule also contains its own field inventory, instructions, repeatable rows and conditional attachment requirements. Schedule 1, for example, branches by employment/self-employment/corporate/trust/unemployed/retired/income-source state and requires different documentary proof. Schedule 4 may require a separate child-centred budget for children with different circumstances. Schedule 6 contains multiple undue-hardship grounds and attachment requirements. Schedule 7 is a repeatable assets/debts/net-worth structure.

## Procedural workflow observed in Kit #4a

The following source-derived stages require durable workflow representation after source review:

1. Determine whether Kit #4a appears to fit the response being made.
2. If the application deals with children, register for Parenting after Separation and Divorce before the hearing and preserve the resulting Certificate of Attendance state.
3. Complete Form 13-31 Affidavit, including numbered facts and any exhibits.
4. Determine whether an up-to-date Form 15-47 Financial Statement is required.
5. If Form 15-47 applies, evaluate the situation checklist and select every required schedule and supporting-document obligation.
6. Complete all required forms before signing or swearing where the source instructs the user not to sign early.
7. Sign/sworn-or-affirm applicable documents before an authorized commissioner/notary/other permitted witness as the source specifies.
8. Make the required copies.
9. Serve the other party or lawyer through an allowed source-described method.
10. Choose the applicable proof-of-service path, Form 12-3 returned by the recipient or Form 15-8B sworn by the person who served.
11. File the required originals, proof of service, and course certificate when applicable.
12. Attend the hearing or make prior arrangements to request telephone appearance.
13. Present only evidence permitted by the source and preserve hearing outcome state.
14. If an order must be prepared afterward, obtain the fiat and follow the separate order-preparation process/kit.

This workflow is not represented in the current repository as a source-bound Kit #4a graph.

## Material discrepancies found in the supplied source

These must remain unresolved blockers until an authoritative current source or qualified review resolves them.

### K4A-DISC-001, Acknowledgment form number

- Table of contents and embedded form identify `Form 12-3`.
- Service instructions repeatedly call the same proof path `Form 12-13`.
- Working normalization must not silently erase either statement.

### K4A-DISC-002, filing deadline conflict

- The Filing Documents section says the documents must be filed at least **7 days** before the court date.
- The checklist says file original documents at least **3 days** before the court date.
- This affects a deadline and therefore blocks final-ready runtime guidance until reviewed.

### K4A-DISC-003, proof-of-service filing wording

- The service section says proof can be either returned Form 12-3/12-13 or Form 15-8B.
- The Filing Documents section refers specifically to filing the documents plus the `affidavit of service`.
- The checklist again says `Affidavit of Service or Acknowledgment of Service`.
- Preserve all three source statements and resolve before executable filing guidance.

### K4A-DISC-004, cross-snapshot form reuse not established

Form 15-8B and Form 12-3 are already cataloged under `jcc-kit-3j-2026-03-30`, but no record proves that those source instances are byte-identical, text-equivalent, or procedurally interchangeable with the forms embedded in this 2023 Kit #4a artifact.

Do not deduplicate them by form number alone.

## Repository audit result

Current `main` and draft PR #5 were inspected.

Observed repository state:

- `sources/source-registry.json` contains only `jcc-kit-3j-2026-03-30`.
- No Kit #4a snapshot directory exists.
- No Form 13-31 catalog exists.
- No Kit #4a Form 15-47 catalog exists.
- No machine-readable 42-row Form 15-47 situation-to-schedule matrix exists.
- No Kit #4a process graph exists for prerequisites, form selection, service, filing, hearing and post-hearing work.
- No Kit #4a discrepancy register exists.
- The existing source registry models one `current_snapshot_id`, which is insufficient for a product with multiple independently versioned source families.

## Compliance verdict

```text
KIT #3J CAPTURE QUALITY:
structured and evidence-conscious within its narrow declared slice

PRODUCT COVERAGE FOR KIT #4a:
NOT CAPTURED

MULTI-KIT SOURCE MODEL:
INSUFFICIENT

KIT #4a RUNTIME READINESS:
BLOCKED

FRAMEWORK-COMPLIANT CLAIM FOR OWNER'S INTENDED SCOPE:
NO
```

The prior work should not be discarded, but it must not be described as complete source coverage for this product.

## Required recovery sequence

1. Preserve this Kit #4a artifact identity and hash without claiming currentness.
2. Refactor source registry semantics from one global current snapshot to independently versioned source families/workflows.
3. Add a Kit #4a immutable snapshot directory and source manifest.
4. Archive the exact supplied binary through a local/binary-capable Git path and verify SHA-256.
5. Capture all four included forms as source-bound catalogs.
6. Capture all seven Form 15-47 schedules and all 42 situation-to-schedule relationships.
7. Capture each schedule's conditional supporting-document requirements.
8. Capture the Kit #4a procedural workflow as source-bound stages, conditions, deadlines, alternative paths and outputs.
9. Record every discrepancy, including the filing-deadline contradiction, and block affected runtime rules.
10. Compare overlapping Form 15-8B and Form 12-3 instances against other snapshots before reuse/deduplication.
11. Compare the 2023 artifact against current official court sources and assign a supported freshness disposition.
12. Independently review rendered pages against every normalized field and rule before legal/procedural approval.
13. Only then allow the deterministic triage/task-plan/workbench layers to consume Kit #4a.

## Recovery gate

`SFL-KIT-4A-SOURCE-RECOVERY-001` is now a required source-recovery gate alongside the unfinished Kit #3J source-review gate.

No runtime implementation, merge of PR #5, or source-completeness claim should bypass this correction.
