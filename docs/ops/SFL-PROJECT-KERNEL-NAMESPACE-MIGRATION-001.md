# SFL Project Kernel Namespace Migration 001

Status: `DRY-RUN MIGRATION PLAN; no legacy deletion; no portable-contract copy executed`  
Date: `2026-08-12`  
Project: `sask_family_law_self_help`

```yaml
generated_not_truth: true
mutation_plan_only: true
legacy_delete_allowed: false
overwrite_allowed: false
secrets_allowed: false
runtime_state_created: false
```

## Framework rule being adopted

Current xi-io framework ownership is:

```text
.xiio/  -> local runtime and machine-operational state, normally gitignored
xiio/   -> repo-safe portable framework contract and approved projections
xi/     -> legacy compatibility input only
```

The project was bootstrapped before this ownership was locked and currently stores five portable contract files under legacy `xi/`.

## Repository observation

Observed legacy files:

```text
xi/capability-profile.yaml
xi/feature-index.yaml
xi/managed-project.manifest.yaml
xi/project-lexicon.yaml
xi/ui-profile.yaml
```

At the time of this recovery pass, neither `xiio/` nor `.xiio/` exists on the recovery branch. Therefore no destination collision has been observed yet.

## Proposed source-to-destination map

| Legacy input | Proposed repo-safe destination | Action | Overwrite |
|---|---|---|---|
| `xi/capability-profile.yaml` | `xiio/capability-profile.yaml` | review then copy/migrate | forbidden |
| `xi/feature-index.yaml` | `xiio/feature-index.yaml` | review then copy/migrate | forbidden |
| `xi/managed-project.manifest.yaml` | `xiio/managed-project.manifest.yaml` | review, refresh stale state, then migrate | forbidden |
| `xi/project-lexicon.yaml` | `xiio/project-lexicon.yaml` | review then copy/migrate | forbidden |
| `xi/ui-profile.yaml` | `xiio/ui-profile.yaml` | review then copy/migrate | forbidden |

## Required review before copy

The legacy files are not automatically approved current truth merely because they are tracked.

Before any file is promoted to `xiio/`:

- compare it with current xi-io.net contract expectations,
- remove or correct stale bootstrap/runtime claims through review,
- preserve project-specific tightening,
- confirm no secret or private matter content is present,
- record the source blob/commit identity,
- validate the destination path is still absent,
- record rollback as deletion of the newly created `xiio/` copy only,
- preserve legacy `xi/` until a later explicit retirement gate.

## `.xiio/` posture

No local runtime state is required to complete this GitHub recovery pass.

If a future local runtime initializes `.xiio/`, the expected Git posture is exclusion by default, with only a safe explanatory README optionally tracked. Private legal matter data, indexes, database files, caches, queues, local provider state and machine paths must not enter the repo-safe contract.

## Migration stages

```text
P0 inspect legacy roots              COMPLETE for GitHub-visible files
P1 inspect destination collisions    COMPLETE, no xiio/ or .xiio/ observed
P2 review contract freshness         REQUIRED
P3 produce refreshed xiio candidates REQUIRED
P4 validate candidate contracts      REQUIRED
P5 human review/approval              REQUIRED
P6 create xiio copies                BLOCKED until P2-P5
P7 verify repository state           REQUIRED after copy
P8 retire legacy xi/                  SEPARATE FUTURE GATE, not authorized here
```

## Relationship to Kit #4a correction

The manifest and capability profiles must not be migrated unchanged if they still describe the project as a single Kit #3J scaffold. The recovered repo-safe contract must reflect that the product has multiple independently versioned legal source families and that Kit #4a source/process recovery is active.

## Current disposition

`adopt_and_migrate_legacy`, plan ready, execution blocked pending contract freshness review.
