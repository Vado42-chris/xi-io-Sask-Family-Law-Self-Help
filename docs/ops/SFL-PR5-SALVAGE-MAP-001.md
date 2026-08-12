# SFL PR #5 Salvage Map 001

Status: `READ-ONLY DONOR CLASSIFICATION / NO CODE HARVEST`  
Donor PR: `#5`  
Donor branch: `feat/synthetic-legal-workbench-001`  
Donor head observed: `49789338648a14547812de7b78dd091582982f3a`  
Donor base: `main@b8a1c412eb2601fc8a0665dd1ecec27d0223e15a`  
Changed files observed: `105`  
Purpose: satisfy PR #6 recovery gate R6-D by decomposing PR #5 into coherent future slices without copying implementation.

```yaml
generated_not_truth: true
donor_merge_authority: false
wholesale_merge_allowed: false
code_harvest_in_this_artifact: false
branch_from_donor_allowed: false
current_runtime_authority: false
framework_convergence_score_is_authority: false
```

## 1. Classification vocabulary

Disposition:

```text
HARVEST_LATER
SUPERSEDED
KEEP_DONOR_ONLY
BLOCKED
UNKNOWN_NEEDS_REVIEW
```

Preliminary provenance/convergence uses the framework Repo Rehab vocabulary where evidence supports it:

```text
framework_exact
framework_adapted
project_local_verified
donor_derived
agent_synthesized
human_authored
third_party
mixed
unknown
```

Hard invariants:

```text
FRAMEWORK_REUSE != QUALITY
SYNTHESIS != DEFECT
UNKNOWN != SYNTHESIZED
HIGH FRAMEWORK COVERAGE != SAFE TO HARVEST
HIGH SYNTHESIS != DISCARD
PROVENANCE ESTIMATE != LEGAL CURRENTNESS
PROVENANCE ESTIMATE != MUTATION AUTHORITY
```

The owner has a portfolio-level framework-vs-synthesis infographic/estimate. It is useful as a HumanProjection, but this salvage map does not copy a numeric percentage from the image. File/slice provenance must remain evidence-backed and may include an explicit unknown share.

No classification grants a branch or mutation lane. Any later harvest starts from then-current verified `main`, re-reads the donor exact head/path, resolves current dependencies, and enters normal mutation admission.

## 2. Executive disposition

PR #5 is not one feature. It contains at least eight materially different work families with different source, privacy, framework and verification prerequisites:

```text
A deterministic legal/workflow data contracts
B source-review / coverage tooling
C court-faithful blank/fill-map tooling
D public synthetic workbench UI + interaction runtime
E local private-matter preview sidecar
F preview/test/geometry proof infrastructure
G product-local UX/architecture doctrine and review records
H package/README/ledger integration changes
```

The correct disposition is **sequential selective harvest**, never wholesale merge.

Summary:

| Family | Preliminary provenance | Disposition | Earliest dependency |
|---|---|---|---|
| A deterministic workflow/data contracts | `mixed / unknown at file level` | `HARVEST_LATER` | Q1 multi-kit semantics + applicable source review |
| B source-review/coverage tooling | `mixed / project-local tooling` | `HARVEST_LATER` high priority | Q1; prove with second source family |
| C official blanks/fill maps | `third_party/source + project-local bindings/tooling / mixed` | `BLOCKED` then selective harvest | source currentness + rights + rendered verification |
| D synthetic workbench UI | `donor_derived + agent_synthesized + project_local / mixed` | `HARVEST_LATER` selectively | runtime contracts + framework primitive adoption + UX gates |
| E private preview sidecar | `agent_synthesized/project_local / mixed` | `BLOCKED / KEEP_DONOR_ONLY pending re-evaluation` | `SFL-PRIVATE-001` security/privacy qualification |
| F preview/test/geometry proof | `project_local_verified where checks prove it + mixed` | `HARVEST_LATER` | adopted implementation slice + applicable verification profile |
| G UX/architecture doctrine/reviews | `human_authored + donor_derived + agent_synthesized / mixed` | `KEEP_DONOR_ONLY` with semantic harvest where still current | current product/UX/framework owner reconciliation |
| H package/README/ledger integration | `project_local implementation glue / mixed` | `SUPERSEDED` as a merge unit | redo per admitted future slice |

---

## 3. Family A — deterministic legal/workflow data contracts

### Donor paths

```text
docs/schemas/capability-projection-schema-v1.json
docs/schemas/fact-definition-schema-v1.json
docs/schemas/form-field-binding-schema-v1.json
docs/schemas/interview-step-schema-v1.json
docs/schemas/matter-assertion-schema-v1.json
docs/schemas/matter-readiness-schema-v1.json
docs/schemas/presentation-registry-schema-v1.json
docs/schemas/required-document-diagnosis-schema-v1.json
docs/schemas/workflow-graph-schema-v1.json
matter-definitions/**
workflows/jcc-kit-3j/**
interview/jcc-kit-3j/**
presentation/jcc-kit-3j/**
bindings/jcc-kit-3j/**
scripts/lib/assertion-runtime.mjs
public/src/applicability-engine.js
public/src/document-diagnosis.js
public/src/wizard-state.js
scripts/check-applicability-engine.mjs
scripts/check-wizard-state.mjs
```

### Dependency gates

```text
SFL-MULTI-KIT-SOURCE-001
+ applicable Kit #3J source/currentness review
+ schema/framework-owner collision review
+ deterministic runtime verification
```

### Already present on recovered branch/main?

`NO` for the implementation family. Recovery preserved architecture/source gating, not these donor runtime/data contracts.

### Provenance/convergence finding

Preliminary class: `mixed / unknown at file level`.

The objects are SFL-local implementations built against product source material and an older architecture generation. Some shapes may align with framework primitives; others are legal-domain objects that should remain target-owned. Positive framework lineage must be proven per contract rather than inferred from naming similarity.

### Risks/findings

- Contracts are strongly shaped around Kit #3J and the old single-snapshot product model.
- Neutral shapes may be reusable, but current framework ownership must be checked before canonizing product-local names.
- No legal rule encoded by the donor may be promoted merely because its tests pass.

### Disposition

`HARVEST_LATER`, only after Q1 multi-kit semantics and the applicable source-family gate. Start with the smallest neutral/deterministic contract family from then-current `main`; never move the entire donor tree as one slice.

---

## 4. Family B — source-review / coverage tooling

### Donor paths

```text
docs/ops/SFL-SOURCE-COVERAGE-AUDIT-001D.md
docs/ops/SFL-SOURCE-REVIEW-WORKBOOK-001E.md
docs/ops/SFL-SOURCE-REVIEW-COMPLETED-VALIDATOR-001F.md
scripts/check-source-coverage.mjs
scripts/source-review-workbook.mjs
public/source-review/index.html
```

### Dependency gates

```text
multi-kit source-family identity semantics
+ source-review evidence model compatibility
+ no assumption that Kit #3J workbook structure is universal
```

### Already present on recovered branch/main?

`NO` implementation harvest. Recovery has separate fail-closed intake/source checks and review packets, which become constraints when evaluating this donor.

### Provenance/convergence finding

Preliminary class: `mixed / project-local tooling`.

This is likely high-value reusable product infrastructure, but framework-vs-synthesis percentage is not the key gate. Its real test is whether the tooling generalizes cleanly when Kit #2a or Kit #4a becomes the second independently versioned source family.

### Risks/findings

A tool that assumes one kit/global snapshot can reproduce the original architecture defect at larger scale even if its code is clean.

### Disposition

`HARVEST_LATER` with **high priority after Q1**. Generalize only through a second real source-family proof rather than abstract schema expansion.

---

## 5. Family C — court-faithful official blanks, fill maps and form-fill tooling

### Donor paths

```text
forms/fill-maps/**
scripts/form-fill/fill_official_blank.py
sources/official-blanks/fam-pd-7/**
sources/official-blanks/form-10-3/**
docs/ops/SFL-COURT-FAITHFUL-LITMUS-001.md
docs/reviews/peer-review-request-court-faithful-litmus-001.md
```

### Dependency gates

```text
exact source identity/currentness
+ rights/distribution evidence for bundled official artifacts where applicable
+ approved line-item/binding identity
+ deterministic PDF/fill verification
+ human rendered-output review
```

### Already present on recovered branch/main?

`NO`.

### Provenance/convergence finding

Preliminary class: `mixed`:

```text
third_party / official-source bytes
+ project-local fill maps/bindings
+ project-local/agent-authored tooling
```

A one-dimensional framework percentage would be actively misleading for this family because the most consequential truth is source/version/rights/output fidelity, not framework reuse.

### Risks/findings

- An official-looking blank is not automatically the currently accepted filing form.
- Fill coordinates are version-bound; source revision changes can invalidate geometry without obvious semantic change.
- Structural fill success is not a court-ready claim.
- Public availability of a court form does not by itself settle every bundling/redistribution right required for a product release.

### Disposition

`BLOCKED` until applicable source/currentness and rights/evidence gates clear; then selectively `HARVEST_LATER` one independently reviewed form family at a time.

---

## 6. Family D — public synthetic workbench UI / interaction runtime

### Donor paths

```text
public/index.html
public/dev/index.html
public/interview-proof/index.html
public/matter-review/index.html
public/src/legal-workbench.js
public/src/user-app.js
public/src/user-language-layer.js
public/styles/legal-workbench.css
public/styles/user-app.css
public/styles/user-mode.css
docs/ops/SFL-UX-SHELL-001A.md
docs/ops/SFL-WIZARD-UI-INTEGRATION-001C.md
docs/ops/SFL-PLAIN-LANGUAGE-UX-001H.md
docs/ops/SFL-WORKBENCH-CLARITY-P0-001N.md
```

### Dependency gates

```text
source-family/runtime data contract accepted
+ canonical framework primitive promotion/adopter-lock status
+ SFL target-owned view-model/adapter contract
+ legal safety state semantics
+ accessibility/cognitive-load verification
+ browser/runtime verification
+ product brand/family binding when canonical brand contract is available
```

### Already present on recovered branch/main?

`NO` runtime harvest. PR #6 contains Inbox donor/primitives source mapping and promotion intake only; it does not copy Inbox or PR #5 runtime UI.

### Provenance/convergence finding

Preliminary class: `mixed`:

```text
donor_derived interaction grammar from Inbox/owner direction
+ agent_synthesized/product-local implementation
+ possible future framework_adapted primitives
```

The owner portfolio infographic's convergence concept is useful here, but code provenance must be resolved at component/surface level. Do not label the whole workbench “framework” merely because it resembles or was inspired by Inbox.

### Risks/findings

- The donor predates the current 33-primitive source/promotion lock.
- One-off implementations may now collide with framework candidates that should be adopted rather than copied.
- Product-family accent identity must remain separate from legal semantic status colors. The current framework brand owner classifies sam_law in the Legal / Procedural Guidance family direction, but the final portable brand binding/palette adoption is not yet admitted in this repo.
- UI availability must not imply legal-source readiness or action authority.

### Disposition

`HARVEST_LATER` **selectively**, after accepted runtime contracts and framework primitive availability. Preserve useful interaction behavior/UX evidence; prefer current framework components/adapters over donor code where qualified.

---

## 7. Family E — local private-matter preview sidecar

### Donor paths

PR #5 describes and/or changes the private-preview family through:

```text
docs/ops/SFL-PRIVATE-PREVIEW-LOCK-001G.md
docs/ops/SFL-TRACK-A-PRIVATE-LITMUS-001J.md
scripts/serve-preview.mjs
.gitignore
public runtime paths that consume /api/local/matter
related private-preview validation behavior
```

### Dependency gates

```text
SFL-PRIVATE-001
+ current threat model / data-classification / deletion/recovery contract
+ loopback/network exposure verification
+ private storage/provider boundary
+ provider/AI egress policy where applicable
+ independent security/privacy review
```

### Already present on recovered branch/main?

`NO` accepted private runtime. The recovered public repository explicitly blocks real matter data/private workspace runtime.

### Provenance/convergence finding

Preliminary class: `agent_synthesized / project_local / mixed`.

Even if technically thoughtful, this family's provenance percentage is far less important than whether the private boundary survives current security architecture and threat review.

### Risks/findings

- PR #5 itself correctly says this is not a production private legal workspace.
- The current framework security/compartmentalization direction has advanced since this donor was built.
- A local-only implementation can still leak through logs, browser storage, server binding, diagnostic artifacts or provider calls if re-adopted casually.

### Disposition

`BLOCKED / KEEP_DONOR_ONLY` until `SFL-PRIVATE-001`. At that gate, re-evaluate requirements and threat model first; reuse donor code only if it still satisfies the accepted architecture.

---

## 8. Family F — preview/test/geometry proof infrastructure

### Donor paths

```text
scripts/check-app-proof-head.mjs
scripts/check-interaction-architecture.mjs
scripts/check-preview.mjs
scripts/check-source-coverage.mjs
scripts/check-user-geometry.mjs
scripts/check-user-language.mjs
scripts/check-wizard-state.mjs
test-results/screenshots/**
test-results/screenshots/app-proof.json
public/data/fixtures/synthetic-matter-complete.json
public/data/synthetic-matter.json
```

### Dependency gates

```text
one accepted implementation slice to test
+ current validation applicability profile
+ reproducible fixture/source identity
+ hostile review of false-green conditions
```

### Already present on recovered branch/main?

`NO` as a complete proof harness. Current recovery validators are narrower and control/source oriented.

### Provenance/convergence finding

Preliminary class: `project_local_verified` **only where an exact check/fixture/output receipt actually proves the claimed property**, otherwise `mixed/unknown`.

Screenshots and generated proof JSON are evidence candidates, not authority and not necessarily suitable to copy into future main.

### Risks/findings

- Old screenshots can become stale evidence theater.
- Geometry pass != accessibility/usability/legal correctness.
- Test harnesses can encode obsolete single-kit assumptions.

### Disposition

`HARVEST_LATER` alongside the implementation slice that actually needs each verifier. Prefer verifier logic/fixtures over historical generated screenshots; regenerate evidence from current accepted implementation.

---

## 9. Family G — UX/architecture doctrine and review records

### Donor paths

```text
docs/architecture/adr-002-interaction-architecture-layers-v1.md
docs/ops/SFL-INTERACTION-ARCHITECTURE-001I.md
docs/ops/SFL-OWNER-CORRECTION-WORKBENCH-RECOVERY-001M.md
docs/ops/SFL-PEER-REVIEW-CORRECTIONS-001K.md
docs/ops/SFL-PLAIN-LANGUAGE-UX-001H.md
docs/ops/SFL-WORKBENCH-CLARITY-P0-001N.md
docs/ux/plain-language-legal-content-standard-v1.md
docs/ux/progressive-disclosure-workbench-standard-v1.md
docs/ux/workbench-design-doctrine-v1.md
docs/reviews/SFL-UX-DESIGN-RECOVERY-IMPLEMENTATION-PACKET-001P.md
```

### Dependency gates

```text
current product vision/architecture
+ current framework UI primitive/adoption state
+ accessibility/cognitive-load requirements
+ distinction between owner decision, donor lesson, historical implementation detail and reusable framework candidate
```

### Already present on recovered branch/main?

`PARTIAL SEMANTIC OVERLAP`. Current main/recovery already contains product vision, product architecture lock, privacy/legal boundaries and Inbox-pattern architecture/source maps. Exact donor documents are not accepted main truth.

### Provenance/convergence finding

Preliminary class: `mixed` across:

```text
human_authored owner corrections/direction
donor_derived Inbox interaction lessons
agent_synthesized design/doctrine text
project_local review evidence
```

### Risks/findings

- Copying all historical doctrine would create competing current UX SSOTs.
- Some lessons have already been promoted/reconciled through the 33-primitive framework intake.
- Product-local legal UX rules should not be mistaken for generic framework rules.

### Disposition

`KEEP_DONOR_ONLY` as a document family. Semantically harvest only still-current owner decisions/requirements into the appropriate current product/framework owners when a specific later ChangeUnit needs them.

---

## 10. Family H — package, README, workflow and ledger integration changes

### Donor paths

```text
.github/workflows/foundation-check.yml
.gitignore
README.md
docs/INDEX.md
package.json
package-lock.json
project-tracking/agent-run-ledger.md
project-tracking/approval-receipts/ledger.json
project-tracking/open-work-ledger.md
```

### Dependency gates

These files are integration surfaces and must follow whichever coherent future slice is being admitted. They are not an independently harvestable product feature.

### Already present on recovered branch/main?

`MIXED / MOSTLY SUPERSEDED AS CURRENT INTEGRATION`. PR #6 has substantially refreshed README/INDEX/governance/validators and current dependency expectations.

### Provenance/convergence finding

Preliminary class: `project_local implementation glue / mixed`.

### Risks/findings

- Harvesting package/README/CI wholesale would reintroduce stale scripts, old product assumptions and historical status text.
- `package-lock.json` should only follow an admitted dependency change that actually requires it.
- Historical ledgers remain evidence, but append-only/current ownership rules apply.

### Disposition

`SUPERSEDED` **as a merge/harvest family**. Future slices may reproduce only the exact package/script/workflow/ledger changes required by that slice from current `main`.

---

## 11. Candidate future harvest order

This is dependency planning, not branch authorization.

```text
1. Q1 SFL-MULTI-KIT-SOURCE-001 on refreshed main
2. Source-review tooling proof using a second source family (Family B)
3. Small deterministic schema/runtime contracts proven against multi-kit semantics (Family A)
4. Framework primitive adoption + target-owned SFL UI adapter planning
5. Selective public workbench behavior (Family D)
6. Form-fill/court-faithful slices only after exact source/right/output gates (Family C)
7. Verifier/preview infrastructure alongside each applicable implementation slice (Family F)
8. Private workspace only at SFL-PRIVATE-001, requirements-first re-evaluation (Family E)
```

Family G remains donor semantics/evidence. Family H is redone per slice rather than harvested.

## 12. Per-harvest admission questions

Before a later worker touches any PR #5 code, require answers to:

```text
What exact donor paths/commit are being considered?
What accepted-main requirement does this satisfy?
Which source-family gate governs it?
What is its preliminary provenance class and what remains unknown?
Does an accepted framework primitive now own part of it?
Does product-family/brand identity apply, and is that contract actually adopted?
What private/security/rights obligations apply?
What validation proves this exact slice?
What is deliberately NOT being harvested?
Why is a fresh current-main implementation safer than wholesale donor merge?
```

## 13. R6-D result

```text
PR5 DONOR IDENTITY = RESOLVED
COHERENT SALVAGE FAMILIES = CLASSIFIED
WHOLESALE MERGE = BLOCKED
BRANCH-FROM-DONOR = BLOCKED
PROVENANCE/CONVERGENCE = PRELIMINARY / NON-AUTHORITY / FILE-LEVEL AUDIT STILL REQUIRED PER HARVEST
DEPENDENCY ORDER = RECORDED
CODE COPIED INTO PR #6 = NONE
R6-D = PASS AS READ-ONLY SALVAGE CLASSIFICATION
```

This document does not claim any PR #5 implementation is accepted, current, legally correct, secure, framework-compliant, reusable, or ready to merge.
