# Self-Help Kit Cross-Reference Discovery v1

Status: `discovery candidates only, not runtime truth`  
Date: `2026-08-12`  
Project: `sask_family_law_self_help`

## Purpose

Record workflow-family and self-help-kit candidates discovered by mining the directions, exclusions, hand-offs and next-stage instructions inside the known Family Law Information Centre self-help kits.

This record exists because a form inventory is not enough to establish product completeness. A kit can explicitly tell a user that:

- this is not the correct kit,
- another workflow is required,
- different self-help kits are available for the next step,
- an additional self-help kit is needed after a hearing,
- another form or resource exists outside the supplied artifact,
- a procedure is excluded from the current kit.

Those statements are graph edges. They must remain visible and must drive source discovery.

## Source-authority rule

The Government of Saskatchewan Family Law Information Centre is the source provider for these self-help kits. Current Government of Saskatchewan public information states that the Family Law Information Centre has `18 kits currently available` and that self-help kits are packages of court forms and instructions for several different types of proceedings.

PLEA's Family Law Saskatchewan site is a valuable current discovery, routing and explanatory surface. It describes current workflow families and points self-represented users to the Family Law Information Centre for self-help kits. PLEA is not treated here as the canonical source archive for the exact FLIC kit binaries.

An internet copy, search result, PLEA workflow page, historical Department of Justice inventory, filename guess, remembered kit number or inferred title is never enough to admit a kit into canonical source truth.

Every candidate must ultimately be resolved to an exact current FLIC-supplied or otherwise authoritative artifact, then captured under the project's source-capture and freshness standard.

## Method

For every known or newly admitted kit, inspect all instructions and tables for at least these relationship classes:

```text
explicit_self_help_kit_reference
additional_self_help_kit
other_or_different_self_help_kit
different_form
not_the_correct_kit
not_used_for_this_procedure
separate_response_or_application_workflow
next_stage
post_hearing_stage
excluded_final_order_or_variation_path
excluded_jurisdiction_or_location
FLIC_referral_for_specific_procedure
companion_form_not_physically_included
procedural_resource_not_physically_included
```

Each relationship becomes a candidate graph edge. The edge remains discovery evidence until an exact source artifact is obtained and reviewed.

## Known-kit cross-reference inventory

### Kit #2a, Preparing an Answer and Counter-Petition, dated 2023-04-10

Source artifact in recovery intake: `sources/intake/kit-2a/2023-04-10/source-intake.json`.

| Source direction | Candidate relationship | Classification | Current state |
|---|---|---|---|
| If a Notice of Application was also served and the user wishes to respond, a separate response workflow is required. | Replying to a Court Application | full-kit workflow | already represented by Kit #4a intake |
| If the respondent agrees with the Petition claims and does not want additional claims, Kit #2a says this is not the correct kit and directs the user to FLIC for agreement or consent-judgment options. | Agreement / consent judgment | workflow candidate | exact FLIC kit status and title unknown |
| If issues cannot be settled, either party may seek an interim court order. The source explicitly says different self-help kits may be available from FLIC to make such an application. | Interim / substantive court application | explicit self-help-kit-family candidate | exact kit title, number and variants unknown |
| A later interim application involving children triggers Parenting after Separation and Divorce requirements in this source snapshot. | Parenting-course prerequisite | external procedural dependency | not a kit candidate by itself |
| Form 15-48A, Form 15-48B and Form 15-50 are referenced as waiver/agreement paths but are not part of the physically included form inventory. | Financial/property exception forms | companion-form gaps | capture separately, not assumed to be kits |

### Kit #3J, Request for a Judicial Case Conference Order, dated 2026-03-30

Canonical snapshot currently exists under `sources/jcc-kit-3j/2026-03-30/`, but source approval is still pending.

| Source direction | Candidate relationship | Classification | Current state |
|---|---|---|---|
| The kit explicitly says it is not used for an application to vary a final order. | Final-order variation | excluded workflow-family candidate | exact kit title/number unresolved; current Government source independently confirms support-change self-help kits exist |
| The kit explicitly says it is not used to apply for corollary relief after a divorce has been granted. | Post-divorce corollary relief | excluded workflow-family candidate | exact FLIC kit status/title unresolved |
| The kit describes an Application for Substituted Service and directs the user to FLIC for more information. | Substituted service | procedural workflow/resource candidate | kit status unresolved |
| FAM-PD #7 companion forms exist outside the physically included Kit #3J form set and have already been separately discovered in the repository. | Joint JCC / Court-issued JCC documents | companion-form/directive family | not treated as a new full kit without evidence |
| The kit is specifically scoped to qualifying Regina/Saskatoon JCC use. | Other court locations | scope boundary | investigate current procedure, do not infer a separate kit |

### Kit #4a, Replying to a Court Application, dated 2023-04-10

Source artifact in recovery intake: `sources/intake/kit-4a/2023-04-10/source-intake.json`.

| Source direction | Candidate relationship | Classification | Current state |
|---|---|---|---|
| If a pre-trial conference or trial is scheduled, the kit says additional resources are available from FLIC. | Pre-trial / trial preparation | procedural-resource candidate | resource type and current source set unresolved |
| If the user is responsible for preparing the order after the hearing, the kit explicitly directs the user to FLIC for an additional self-help kit to help prepare the court order. | Preparing a court order | explicit full-kit candidate | high-priority source acquisition, exact title/number unresolved |
| The source describes possible adjournment, reserved judgment and order-preparation stages after the hearing. | Post-hearing order lifecycle | workflow edge | must connect to the order-preparation source family |

## Current external corroboration and discovery seeds

These findings help locate candidates. They do not replace exact kit artifacts.

### Current Government of Saskatchewan

Current public Government of Saskatchewan material establishes:

- FLIC has `18 kits currently available`.
- FLIC supplies self-help kits as court-form-and-instruction packages for multiple types of proceedings.
- A person seeking to change a support order through court on their own can use a self-help kit, and those kits contain forms and instructions for changing support orders.

This is strong evidence that the current project inventory of three full mailbox kits is not catalogue-complete.

### Current PLEA Family Law Saskatchewan

PLEA currently describes workflow families that align with or extend the mined kit edges, including:

- starting a case with a Petition,
- interim orders through an Application for Substantive Interim Relief, affidavit and draft order,
- responding to a Petition,
- responding to a Notice of Application,
- Judicial Case Conferences in Regina and Saskatoon,
- consent and uncontested orders,
- changes to child support,
- changes to spousal support,
- parenting orders and changes to family-law orders,
- pre-trial and trial preparation.

These pages are discovery and routing evidence. They do not prove the exact name, number, revision date or contents of an FLIC kit.

### Legacy named seed: Kit #1a

A non-authoritative third-party copy indexed on the public web identifies an older artifact as:

`Kit #1a, Starting a Family Law Proceeding Self-Help Kit`, dated `2022-09-09`.

The indexed preview describes a Petition-start workflow and says that, after completing that kit, other FLIC kits can be used to apply for a court order or resolve matters outside court.

This is useful as a discovery seed because it supplies an apparent historical kit number and title. It is not an approved source, is not currentness evidence, and must not be ingressed as canonical legal truth from the third-party copy.

## Candidate acquisition queue

Priority describes source-discovery value, not legal importance.

| Priority | Candidate | Evidence basis | Admission state |
|---|---|---|---|
| P0 | Preparing a court order | explicit `additional self-help kit` direction in Kit #4a | exact current FLIC artifact required |
| P0 | Interim / substantive court application | explicit `different self-help kits` direction in Kit #2a plus current PLEA interim-order workflow | exact current FLIC artifact(s) required |
| P0 | Final-order / support variation | explicit exclusion in Kit #3J plus current Government confirmation that support-change kits exist | exact current FLIC artifact(s) required |
| P0 | Starting a family law proceeding | legacy named Kit #1a seed plus current Petition-start workflow | exact current FLIC artifact required; historical web copy is not source truth |
| P1 | Consent / uncontested judgment or order | Kit #2a `not the correct kit` boundary plus current PLEA consent/uncontested route | determine whether FLIC supplies one or multiple kits |
| P1 | Post-divorce corollary relief | explicit Kit #3J exclusion | determine current FLIC kit/status |
| P1 | Substituted service | explicit Kit #3J FLIC referral | determine whether kit, form package or information-only resource |
| P1 | Pre-trial / trial preparation | explicit Kit #4a FLIC-resource referral plus current PLEA process | determine authoritative source set |
| P2 | Enforcement applications | current PLEA recognizes order-enforcement workflows | establish whether represented among current FLIC 18 |
| P2 | Inter-jurisdictional support variation | current Government support material identifies ISO as a separate route when another jurisdiction is involved | establish FLIC/ISO source ownership and kit status |

## Catalogue-completeness rule

The project must not use `mailbox kits found == kit catalogue complete`.

The correct completeness target is:

```text
known exact FLIC kit snapshots
+ unresolved named/unnamed kit candidates
+ current FLIC catalogue count reconciliation
+ companion-form/directive inventory
+ non-kit procedural-resource inventory
= source-discovery closure state
```

Current Government public information gives a reconciliation target of `18 currently available` FLIC self-help kits. Until the project has an authoritative inventory or has individually resolved those 18 current kit families, catalogue completeness remains `unknown / incomplete`.

The number `18` is a discovery reconciliation target, not permission to infer 18 names from search results.

## Recursive harvest rule

Every newly obtained full kit must be mined before its source-recovery gate can close.

Required sequence:

```text
obtain exact authoritative kit
  -> preserve immutable artifact
  -> hash and identify snapshot
  -> inventory every physically included form
  -> inventory every referenced-but-absent form
  -> mine all directions, exclusions and hand-offs
  -> add candidate graph edges
  -> compare candidate names/workflows with current Government and PLEA discovery surfaces
  -> obtain newly identified authoritative artifacts
  -> repeat until no unresolved kit edge remains
  -> reconcile against current FLIC catalogue inventory/count
  -> source review
  -> runtime admission only after approval
```

A candidate graph may be cyclic. Shared forms and shared procedural stages must not be deduplicated merely because form numbers or labels match. Cross-snapshot equivalence still requires explicit comparison.

## Required next actions

1. Request or otherwise obtain an authoritative current inventory of the 18 FLIC family-law self-help kits, including exact titles and, where applicable, kit numbers.
2. Acquire the current exact artifact for the `Preparing a court order` kit referenced by Kit #4a.
3. Acquire the current exact interim/substantive-application kit or kits referenced by Kit #2a.
4. Acquire the current exact variation kit family, starting with the support-variation route independently confirmed by current Government information.
5. Resolve whether the legacy `Kit #1a, Starting a Family Law Proceeding` still exists under that number/title and capture only the current authoritative version.
6. Determine whether consent/uncontested, post-divorce corollary relief, substituted service, enforcement and pre-trial/trial sources are full kits, subordinate form packages, directives or information-only resources.
7. Add machine-readable relationship records for every resolved candidate to the multi-kit source registry design.
8. Continue recursively mining every newly ingressed kit until candidate-edge closure and the authoritative FLIC catalogue reconcile.

## Runtime boundary

Nothing in this discovery record is legal runtime truth.

No candidate title, inferred relationship, PLEA workflow description, third-party historical copy or public search result may be used to generate filing instructions, deadlines, legal recommendations or final-ready forms until the exact authoritative source has been captured, normalized, reviewed and approved under the project's source governance.