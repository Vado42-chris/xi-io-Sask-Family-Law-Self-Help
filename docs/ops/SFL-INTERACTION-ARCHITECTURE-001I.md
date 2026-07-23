# SFL-INTERACTION-ARCHITECTURE-001I

Status: `implemented scaffolding + FAM-PD #7-5 proof seed`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
ADR: `docs/architecture/adr-002-interaction-architecture-layers-v1.md`

## Delivered

- ADR separating source, catalog, definitions, assertions, bindings, workflow, interview, presentation, projections, and roles
- Snapshot-bound registries outside `sources/` for bindings, interview, presentation, and workflow
- Matter-definition schema and #7-5 seed definitions
- Capability routes: `/app`, `/source-review`, `/dev`, `/matter-review` (stub)
- Explicit private unlock gate (no auto-load from file presence alone)
- Continue-first User shell for Appearance Memo proof
- Integrity + geometry/accessibility contract checks

## Commands

```bash
npm run check
npm run check:interaction-architecture
npm run check:user-geometry
npm run preview
```

Open:

- User: `http://127.0.0.1:4173/app`
- Source review: `http://127.0.0.1:4173/source-review`
- Developer: `http://127.0.0.1:4173/dev`

## Safety

- Canonical catalogs unchanged
- AI is not a wording authority
- Private matter requires explicit unlock
- Court readiness remains blocked
- `xi-io: Inbox` untouched
