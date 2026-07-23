# ADR-002: Interaction architecture layers and capability surfaces

Status: `accepted for implementation`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
Receipt: `SFL-INTERACTION-ARCHITECTURE-001I`

## Decision

The product separates official source truth, normalized form catalogs, matter-data definitions, matter assertions, form-field bindings, procedural workflow, interview steps, presentation copy, and capability-bound application surfaces.

Court-form line items are foreign keys. They are not the user interaction model.

## Source-of-truth hierarchy

1. Official court artifact — legal source of truth
2. Reviewed canonical catalog — normalized form source of truth
3. Human-approved presentation — UI wording source of truth
4. AI output — untrusted draft proposal only

## Layers

| Layer | Location | Owns |
|---|---|---|
| Official source | `sources/` | Immutable artifacts and transcriptions |
| Form catalog | `sources/.../forms/` | `line_item_id`, source_label, rules |
| Matter definitions | `matter-definitions/` | What kinds of information exist |
| Matter assertions | private matter / runtime | Versioned claims for one case |
| Form-field bindings | `bindings/` | How assertions project onto line items |
| Procedural workflow | `workflows/` | What must happen and what blocks stages |
| Interview steps | `interview/` | What to ask and in what order |
| Presentation | `presentation/` | Approved user wording per step |
| Capability projection | server + apps | What each route may receive |

## Capability surfaces

| Route | Purpose | Default data |
|---|---|---|
| `/` or `/app` | User case work | Practice matter until explicit private unlock |
| `/source-review` | Catalog/presentation/source review | Public catalogs only |
| `/matter-review` | Authorized case review | Stubbed / blocked |
| `/dev` | Diagnostics | Synthetic only; never auto-load private |

Private matter presence must not auto-load on any route. CSS is not a data boundary.

## Fail-closed presentation

If a step lacks approved presentation, User mode shows a blocked-step message with options to save progress, view exact court wording, or ask an authorized reviewer. Never fall back to AI wording.

## Dual tracks

- Track A: case-relevant private litmus (#7-5, #7-2, Form 10-3) with human review
- Track B: durable architecture proved completely on FAM-PD #7-5 before expansion

## Consequences

- Presentation and interview content live outside `sources/`
- One assertion can populate many forms via bindings
- Workflow blockers remain distinct from unanswered questions
- Developer diagnostics cannot become the default user experience
