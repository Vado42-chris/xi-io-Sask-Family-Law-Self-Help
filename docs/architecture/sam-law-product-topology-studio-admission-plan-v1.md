# xi-io: sam_law Product Topology and Studio Admission Plan v1

Status: `RECOVERY PLANNING / NO RUNTIME AUTHORITY`  
Date: `2026-08-12`  
Current repository: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`  
Target product identity: `xi-io: sam_law`

## Purpose

Define how the current Saskatchewan family-law recovery work can become the first jurisdiction package of a broader local-first legal product without treating stale legal prototypes, historical installers, or the current repository name as accepted product architecture.

This record does not authorize a repository rename, a new repository, a Studio catalog entry, an installer, legal runtime rules, AI execution, or release promotion.

## Core product decision under recovery

The target product is one first-class Studio product:

```text
xi-io: Studio
  -> xi-io: sam_law
```

Saskatchewan is the first jurisdiction package inside `sam_law`, not eighteen separate Studio applications.

Recommended internal topology:

```text
xi-io: sam_law
  -> Canada
     -> Saskatchewan
        -> Family Law
           -> workflow / self-help-kit modules
           -> shared form components
           -> procedural-reference sources
           -> jurisdiction rules and freshness state
     -> future province or territory
        -> domain package(s)
        -> workflow modules
```

The Saskatchewan government/FLIC catalogue currently gives this recovery a reconciliation target of eighteen self-help kits. That target is a catalogue-completeness goal, not permission to invent eighteen product identities or to assume that the three exact kits currently held are representative of all eighteen.

## Product versus component boundary

Studio product identity, jurisdiction packages, source packages, and workflow modules must remain different concepts.

Candidate stable identities:

```text
product_id: sam_law
component_id: sam_law_core
jurisdiction_package_id: ca_sk_family_law
workflow_module_id: ca_sk_family_law_<stable-workflow-id>
source_snapshot_id: independently versioned legal-source snapshot
form_component_id: source-bound form identity or reviewed cross-source equivalence identity
```

Do not use a court kit number as a global product ID.
Do not deduplicate a form by form number alone.
Do not make one province's stale source state invalidate unrelated provinces or unrelated workflows.

A future jurisdiction package should be able to declare, at minimum:

```text
jurisdiction identity
legal domain
source catalogue identity
source freshness and verification state
workflow modules
shared form relationships
schema compatibility
minimum sam_law core compatibility
qualification state
known blockers
last accepted evidence
```

This package model is a candidate contract until reconciled with current xi-io registry, release, security and Studio projection owners.

## Saskatchewan UX implication

The current workbench shell should be refactored toward the product hierarchy instead of hard-coding one kit or one province as the application.

Target navigation grammar:

```text
Studio product rail
  -> sam_law

sam_law product shell
  -> jurisdiction selector
  -> legal domain
  -> workflow catalogue
  -> matter/workspace
  -> work queue
  -> selected form/task/evidence/package
  -> contextual inspector / Ibal
```

For Saskatchewan Family Law, the workflow catalogue should expose the self-help workflow modules by user goal and procedural stage, while retaining source kit number/title as provenance. A user should not need to know a kit number before the product can help route them.

The eighteen-kit reconciliation target should therefore appear as internal catalogue coverage and qualification state, not as eighteen peer applications in Studio's global product rail.

## Studio UI donor relationship

Current Studio installer/shell work is a relevant donor for:

- one product identity in the Studio rail,
- product selection and context navigation,
- product details and qualification state,
- Marketplace/provisioning projection,
- explicit Launch behavior,
- immutable release-channel semantics,
- responsive shell behavior,
- distinction between installed, available, qualified and launchable.

Studio source is not copied wholesale into `sam_law`. The reusable product-shell/addressing grammar must be source-mapped, reviewed and either consumed through current framework components or implemented target-owned with adoption receipts.

The mature Inbox workbench grammar remains a separate donor for legal matter/work-queue/document/inspector interactions.

## Legacy legal UI donor rule

Multiple older private legal/SAM repositories exist and contain potentially useful UI, workflow, timeline, document, communications, emergency-state and case-navigation ideas.

None of those older legal UIs is current framework authority.

They are classified for this recovery as:

```text
RESEARCH / DONOR CANDIDATE ONLY
NO DESIGN ACCEPTANCE IMPLIED
NO RUNTIME ACCEPTANCE IMPLIED
NO SECURITY ACCEPTANCE IMPLIED
NO SOURCE-CURRENTNESS ACCEPTANCE IMPLIED
```

Before any old legal concept influences `sam_law`:

1. create or locate its ecosystem census record;
2. inspect high-signal evidence under the donor-repo audit standard;
3. identify reusable interaction or data contracts;
4. identify stale, private, case-specific, insecure or contradictory material;
5. compare the candidate with current framework and current accepted product donors;
6. record `promote`, `product-local`, `quarantine`, or `ignore`;
7. implement target-owned and test independently.

Private repository names, private case facts, credentials, logs and user-specific fixtures must not be copied into this public repository merely to prove donor archaeology.

## Installer and local-runtime decision

`sam_law` is a local-first product because its intended Ibal assistance and legal-private workspace require a bounded local runtime.

The product should not create an unrelated bespoke installer unless Studio's installer/provisioner contract proves insufficient.

Current preferred ownership:

```text
xi-io.net
  -> reusable installer/distribution/release/security/runtime contracts

xi-io: Studio
  -> installer / launcher / Marketplace / installed-product control surface

xi-io: sam_law
  -> independently versioned product artifact
  -> product-local runtime declaration
  -> legal workspace mechanics
  -> jurisdiction packages
  -> local Ibal capability consumption
```

A Studio install must not silently mutate `sam_law`, Ibal, Ollama or user data. A future `sam_law` install/provision action must resolve to an immutable qualified artifact and explicit compatibility state.

Historical installer work across Xibalba repositories remains research material. It may contribute setup, discovery, packaging, first-run or host-probe ideas only after current donor audit. Old installers do not outrank the current Studio installer and framework release/runtime contracts.

## Local legal AI boundary

For legal-private material:

```text
local model route = default
remote/cloud route = blocked unless explicitly authorized
model output = proposal, never legal source truth
human-only operation = valid fallback
```

Ibal should consume bounded product context and capabilities. It may explain, interview, organize, compare and propose. It may not invent procedural truth, grant itself authority, finalize legal decisions, sign, commission, file, serve, send, or silently alter approved records.

A local runtime candidate must preserve:

- loopback-first service exposure,
- explicit product/workspace identity,
- user-selected workspace and storage profile,
- source/evidence hashes,
- legal-private storage boundary,
- provider gate and privacy class,
- typed Ibal capability contracts,
- no ambient credentials,
- no silent cloud fallback,
- structured receipts and failure states,
- restart/resume and backup/recovery behavior,
- human-visible disable/stop path.

## Registry recovery dependency

The current xi-io repository registries are seed/incomplete records and are not fresh enough to accept `sam_law` by assumption.

The frozen ecosystem-registry PR is donor/review evidence only. Framework issue `xi-io.net#306` owns its semantic-preservation and bounded harvest recovery.

Therefore:

```text
SFL repo discovery
  -> durable recovery evidence
  -> xi-io.net #306 factual registry harvest
  -> accepted registry/main evidence
  -> sam_law topology/admission candidate
```

The first registry backfeed should record, without overstating authority:

- `sam_law` as an owner-defined target product identity;
- this repository as the active Saskatchewan source/product recovery candidate;
- legacy legal repositories as private donor/recovery candidates where appropriate;
- installer donor candidates as support-infra/research where appropriate;
- field-scoped evidence, separating verified repository metadata, target role, implemented capability, framework freshness, runtime proof and release state.

No registry entry may infer that a repo is current merely because it exists or contains an old working UI.

## Studio lifecycle and graduation axes

Studio currently separates:

```text
DEVELOPMENT STAGE
concept -> planned -> implementation -> validation -> released -> maintenance -> retired

RELEASE MATURITY
none -> pre-alpha -> alpha -> beta -> release-candidate -> stable -> deprecated

AVAILABILITY
internal -> public-info -> source-preview -> testable -> downloadable -> installable -> marketplace
```

These are independent dimensions. `sam_law` must not self-award a maturity badge because implementation exists.

The exact Studio public thresholds are still being formalized upstream, so this repository records evidence needed for graduation but does not invent a competing Studio qualification standard.

## sam_law gated recovery and graduation plan

### SAM-G0, Existing-project recovery

Exit only when:

- current repository/framework state is verified;
- legacy namespace migration is planned safely;
- PR #5 is classified as donor/salvage slices rather than merge authority;
- stale product claims are corrected;
- branch cleanup is re-verified.

Current state: `ACTIVE`.

### SAM-G1, Registry and donor census

Exit only when:

- `sam_law` target product identity is durably recorded in the accepted registry recovery path;
- the current Saskatchewan repository has a field-provenanced classification;
- relevant legacy legal and installer repos have census records or explicit deferred/quarantine records;
- donor candidates have authority, freshness, reuse and contamination classifications;
- no private donor detail is leaked into public product artifacts.

Current state: `ACTIVE_DISCOVERY / UPSTREAM_REGISTRY_BLOCKED`.

### SAM-G2, Saskatchewan catalogue reconciliation

Exit only when:

- the authoritative self-help-kit catalogue target is reconciled;
- all eighteen current kit identities/titles are known from authoritative sources or unresolved entries remain visibly blocked;
- each acquired kit is recursively mined for included forms, selection rules, prerequisites, wrong-kit routes, next-stage routes and other-kit references;
- source freshness and provenance are independent per workflow/source family;
- cross-kit form equivalence is proven rather than assumed.

Current state: `ACTIVE_PARTIAL`, three exact full kits plus standalone sources are currently governed.

### SAM-G3, Deterministic Saskatchewan domain core

Exit only when:

- executable schemas are source-bound and validated;
- applicability/form/schedule routing is deterministic;
- unknown/stale/disputed source state fails closed;
- synthetic fixtures cover branching and source changes;
- AI is not required for legal/procedural correctness.

Current state: `BLOCKED_BY_G2`.

### SAM-G4, Product shell and synthetic UX

Exit only when:

- Studio product-addressing patterns and current UI framework donors are audited;
- legacy legal UIs are donor-audited, not accepted wholesale;
- one target-owned `sam_law` shell supports jurisdiction -> workflow catalogue -> matter/workspace;
- Saskatchewan workflow modules are represented without hard-coding one kit as the application;
- keyboard, screen-reader, responsive and cognitive-load proof exists;
- owner visual review is recorded.

Current state: `BLOCKED_BY_G1_G3`.

### SAM-G5, Private local workspace

Exit only when:

- workspace/storage profile is selected through current framework lifecycle;
- legal-private source/evidence isolation is proven;
- encryption, deletion, export, backup, restore and restart/resume are proven;
- no real user data is required for the first runtime proof;
- threat model and privacy boundaries are independently reviewed.

Current state: `BLOCKED_BY_G3`.

### SAM-G6, Ibal local assistance

Exit only when:

- human-only operation remains complete;
- provider/privacy gates are implemented;
- legal-private defaults to local qualified provider;
- Ibal receives bounded context/capabilities only;
- proposed changes are typed, reviewable and reversible;
- no model output is accepted as procedural truth;
- remote provider use is explicit, consented and receipted when ever allowed.

Current state: `BLOCKED_BY_G5_AND_CURRENT_IBAL_QUALIFICATION`.

### SAM-G7, Installable product artifact

Exit only when:

- installer ownership is reconciled with Studio rather than duplicated;
- product artifact is immutable and independently identifiable;
- install/uninstall/update/rollback boundaries are explicit;
- no package scripts silently alter unrelated products, Ollama, Ibal, user editors or user workspaces;
- host discovery and compatibility checks are qualified;
- local product launch and restart/resume are proven.

Current state: `PLANNED / STUDIO_INSTALLER_DEPENDENCY`.

### SAM-G8, PRE-ALPHA / ALPHA evidence

No label is granted here automatically.

Candidate evidence to present to Studio:

- installable/testable artifact;
- bounded local runtime;
- at least one complete Saskatchewan reference workflow with source-bound deterministic truth;
- known-failure visibility;
- no private-data/public-artifact leakage;
- accessibility and owner visual evidence;
- exact release/source/framework compatibility refs.

Studio owns the final maturity projection.

### SAM-G9, BETA evidence

Candidate evidence:

- materially complete intended Saskatchewan workflow catalogue for the declared beta scope;
- compatibility/freshness behavior across multiple workflow source families;
- update/migration handling for changed sources;
- private workspace recovery proof;
- Ibal degradation/fallback proof;
- user-journey and failure-path validation.

Studio owns the final maturity projection.

### SAM-G10, RELEASE CANDIDATE product qualification

Requires the framework release preflight and product-specific security qualification against the exact source, artifact, configuration and authority footprint.

Missing or unknown security evidence blocks promotion.

### SAM-G11, Studio admission security sweep

After product RC qualification, Studio admission requires a separate ecosystem/composition security sweep for cross-product authority, credentials, privacy, storage, Ibal/worker capability and launch boundaries.

A product can pass its own RC security qualification and still fail Studio admission.

### SAM-G12, STABLE / observed

Only after Studio admission, owner acceptance, release verification and required observation evidence. Material security, source, authority or compatibility changes can invalidate prior qualification and require re-review.

## Cadence rule

All implementation proceeds as bounded sequential slices:

```text
ASSESS
-> branch from current accepted main
-> IMPLEMENT one gate-sized slice
-> VERIFY
-> hostile / independent review
-> owner gate where required
-> MERGE
-> VERIFY MAIN
-> freshness / registry backfeed
-> retire branch
-> next dependent slice
```

No portfolio-wide branch wave.
No province-wide implementation wave before the Saskatchewan reference package proves the reusable model.
No UI donor wave before donor classification.
No installer fork before Studio ownership review.
No Studio maturity claim from this repository alone.

## Immediate recovery actions

1. Finish `SFL-FRAMEWORK-RECOVERY-001` while preserving this target product topology as planning evidence.
2. Backfeed `sam_law`, the current Saskatchewan repo role, and newly discovered donor classes into the existing private xi-io registry recovery path under `xi-io.net#306`.
3. Complete the authoritative eighteen-kit catalogue discovery/reconciliation and keep recursively mining cross-kit references.
4. Audit current Studio product-shell/installer patterns and mature Inbox patterns as named donors.
5. Census legacy legal UIs and historical installers as research candidates, with private/sensitive contamination controls.
6. Refactor the old UI only after G1/G2/G3 establish what the product actually has to represent.
7. Delay custom installer implementation until Studio's provisioner boundary is proven insufficient.
