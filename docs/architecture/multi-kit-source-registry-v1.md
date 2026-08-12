# Multi-Kit Source Registry v1

Status: `RECOVERY DESIGN; not yet executable; no source promoted by this document`  
Date: `2026-08-12`  
Project: `sask_family_law_self_help`

## Problem

The original source registry was created for one reference slice and exposes one global `current_snapshot_id`.

That is the wrong abstraction for the intended product once more than one independently versioned self-help kit exists. Kit #3J and Kit #4a have different purposes, dates, forms, process rules and freshness states. A change to one must not silently redefine the other.

## Required source hierarchy

```text
source family
  -> source snapshot/version
      -> source artifacts
      -> included forms
      -> procedure/process catalog
      -> discrepancies
      -> review/approval state

form identity
  -> form snapshot instance
      -> source family membership
      -> exact source identity
      -> line items
      -> rendered/layout bindings
      -> candidate equivalence relationships to other snapshots
```

## Source family

A `source_family` represents a durable procedural source lane, for example:

```text
kit-3j-jcc-request
kit-4a-reply-to-court-application
form-15-47-standalone-official
fam-pd-7-practice-directive
```

Each source family has its own currentness and supersession chain.

Required fields:

```text
source_family_id
kind
jurisdiction
purpose
current_snapshot_id | null
currentness_state
workflow_ids[]
form_family_ids[]
review_state
known_blockers[]
```

There is no one global snapshot that means "current legal source for the product".

## Snapshot

A snapshot remains immutable and records:

```text
snapshot_id
source_family_id
source date
capture date/time
artifact hashes and sizes
authority state
freshness state
official verification state
included forms
process catalog pointer
discrepancy register pointer
review receipt pointer
supersedes / superseded_by
```

A snapshot may be captured but unapproved. Captured does not mean current, reviewed or runtime-admissible.

## Forms shared by multiple sources

Form number alone is not sufficient identity.

For example, Kit #3J and Kit #4a both contain or reference Form 15-8B and Form 12-3. Until the instances are compared, the safe relationship is:

```text
candidate_equivalent_unverified
```

Allowed relationship states should include:

```text
identical_bytes
text_equivalent_layout_differs
semantically_equivalent_reviewed
materially_different
supersedes
candidate_equivalent_unverified
unknown
```

Reuse in workflow runtime requires an explicit reviewed relationship. No deduplication by title or form number alone.

## Procedure catalog

A kit is a procedural source as well as a form container.

The procedure catalog must be source-bound and able to represent:

```text
applicability questions
prerequisites
required forms
conditionally required forms
conditionally required form schedules
supporting-document obligations
ordered and unordered tasks
deadlines and timing windows
service alternatives
proof alternatives
filing package contents
signature/commissioning requirements
hearing preparation and attendance
post-hearing branches
external information/help references
source discrepancies and blocked branches
```

Every rule identifies the exact source snapshot and source location that supports it.

## Runtime resolution

A matter/workflow may depend on more than one source family.

Conceptual resolution:

```text
workflow start
  -> select exact workflow definition
  -> resolve every required source-family snapshot
  -> confirm freshness/review state
  -> compile applicable source-bound rules
  -> block unresolved material discrepancies
  -> produce deterministic form/task/evidence plan
```

No valid governing source set means no final-ready legal/procedural execution.

## Freshness behavior

Freshness is evaluated per source family and dependency.

Example:

```text
Kit #3J changes
  -> JCC workflow becomes stale/blocked
  -> unrelated Kit #4a workflow does not automatically become stale

Form 15-47 standalone official form changes
  -> every workflow depending on the affected reviewed form relationship is invalidated
  -> dependency diff identifies exactly which workflows need review
```

## Intake versus canonical source

Recovery work may capture supplied artifacts under:

```text
sources/intake/<family>/<date>/
```

Intake records are explicitly unreviewed and cannot be consumed as approved runtime truth.

Promotion requires:

```text
intake
  -> exact artifact archival
  -> official-current comparison
  -> normalized catalogs
  -> rendered-source review
  -> discrepancy disposition
  -> human approval
  -> canonical immutable snapshot
```

## Migration from source-registry v1

Existing:

```text
sources/source-registry.json
  current_snapshot_id: jcc-kit-3j-2026-03-30
```

Recovery target:

```text
source_families[]
  each with independent current_snapshot_id
snapshots[]
  each bound to one source_family_id
form_relationships[]
workflow_source_dependencies[]
```

The existing Kit #3J snapshot remains preserved. Migration must not rewrite its historical identity or approval state.

## First acceptance fixtures

The first executable validator should prove:

1. Kit #3J and Kit #4a can coexist with different freshness states.
2. No global snapshot is required to call the registry valid.
3. A workflow with a missing required source family is blocked.
4. A material unresolved discrepancy blocks only affected workflow branches.
5. Two forms with the same official number are not merged without a reviewed relationship.
6. Superseding one source snapshot invalidates dependent workflow context without rewriting historical matters.
7. Intake-only artifacts cannot render as approved/current runtime source.

## Current recovery application

- `jcc-kit-3j-2026-03-30` remains the existing canonical captured snapshot pending source review.
- `kit-4a-2023-04-10` currently exists only as unreviewed recovery intake.
- Promotion of Kit #4a is blocked until exact artifact archival, official currentness comparison, complete form/process cataloging and independent review are complete.
