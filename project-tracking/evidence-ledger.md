# Evidence Ledger

Status: append-only

| Evidence ID | Type | Source | Summary | State | Sensitive |
|---|---|---|---|---|---|
| SFL-EVID-001 | repository metadata | GitHub | Target repo existed, public, empty before initialization, default branch main | verified | no |
| SFL-EVID-002 | framework docs | `Vado42-chris/xi-io.net@c29afb513d6e44511ecb00bec7514df3229f7d0c` | Startup, README, manifest, ledger, naming, registry, gap, component, and review standards inspected | verified | no |
| SFL-EVID-003 | public legal source | user-supplied `K03j - JCC Kit - VI - 2026.03.30.docx` | 45-page Kit #3J source and included forms statically reviewed | verified copy, official retrieval missing | no |
| SFL-EVID-004 | donor docs | `Vado42-chris/xi-io_docuforge` | Public/private separation and canonical semantic field identity principles inspected | verified | no |
| SFL-EVID-005 | repo metadata | `Vado42-chris/divorce_bins` | Existing private legal evidence workspace candidate identified | verified metadata only | yes, repo private but no content copied |
| SFL-EVID-006 | runtime evidence | none | No runtime, build, browser, security, accessibility, or deployment evidence exists | missing | no |
| SFL-EVID-007 | source identity | local supplied Kit #3J artifact | Filename, 141,225-byte size, 45-page length, source date 2026-03-30, and SHA-256 `5ff0d5379115aa0a75837f10fc40ae945cdcff83d6a53a83580f18db535e94ab` recorded at capture | verified locally, binary archive missing | no |
| SFL-EVID-008 | source registry | `sources/source-registry.json` | Snapshot `jcc-kit-3j-2026-03-30` records capture timestamp, authority state, freshness state, source URLs, hash, and archive blocker | verified repository artifact | no |
| SFL-EVID-009 | form index | `sources/jcc-kit-3j/2026-03-30/forms-index.json` | Six physically included forms, page ranges, six absent companion forms, and two source discrepancies are indexed | verified repository artifact, human review pending | no |
| SFL-EVID-010 | normalized form catalogs | `sources/jcc-kit-3j/2026-03-30/forms/` | 267 stable line items captured across FAM-PD #7-2, two Form 10-3 variants, Form 15-8B, Form 12-3, and FAM-PD #7-5 | completed reported only, independent transcription review pending | no |
| SFL-EVID-011 | official source page | Saskatchewan Courts Rules, Forms & Practice Directives page, checked 2026-07-22 | Official page exposes King's Bench rules, prescribed forms, editable forms, and Family Practice Directive #7 | verified URL and page content at capture | no |
| SFL-EVID-012 | official companion directive | Saskatchewan Courts Family Practice Directive #7 PDF, checked 2026-07-22 | Directive identifies FAM-PD #7-1 through #7-5 and broader JCC requirements, including references to Forms 15-47 and 15-49 | static reviewed, not archived in repo | no |
| SFL-EVID-013 | source standard | `docs/source-materials/source-capture-and-freshness-standard-v1.md` | Defines immutable capture, user-facing dates, freshness states, discrepancies, supersession, validation, and future monitoring gates | verified repository artifact, owner review pending | no |
| SFL-EVID-014 | capture receipt | `docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md` | Records source identity, six forms, 267 line items, missing forms, official-source check, discrepancies, and next review gate | verified repository artifact, source approval pending | no |
| SFL-EVID-015 | structural validator | `scripts/check-source-catalog.mjs` | Checks snapshot identity, six forms, source/hash consistency, unique IDs, expected per-form counts, total 267, explicit gaps, discrepancies, and freshness disclosure language | implementation present, CI result pending | no |
| SFL-EVID-016 | donor repository | `Vado42-chris/xi-io-Inbox@500f1ae5b6dade15bf113b696cea9dfd93ab1cc6` | README, AGENTS, UI north star, component inventory, Ibal concierge/runtime/local-first contracts, runtime-store boundary, private-data boundary and mail egress contracts inspected read-only | verified source inspection, no donor mutation | yes, donor repo private but no private mail bodies copied |
| SFL-EVID-017 | donor source map | `docs/source-materials/inbox-pattern-source-map-v1.md` | Pins reusable shell, list/reader, inspector, Ibal, task/calendar, security, draft/approval/outbox and receipt patterns and rejects wholesale copy | repository artifact, owner review pending | no |
| SFL-EVID-018 | framework standards | `Vado42-chris/xi-io.net` project kernel, legal-private ingress boundary and egress adapter standards | Confirms queues, ledgers, source preservation, human review, controlled output and receipts are framework-supported patterns | verified docs, target adoption review pending | no |
| SFL-EVID-019 | database primary documentation | PostgreSQL current documentation | JSON/JSONB, full-text search, transactions and row-security capabilities reviewed for ADR-001; no database was provisioned | external primary docs reviewed, architecture proposal only | no |
| SFL-EVID-020 | architecture proposal | `docs/architecture/inbox-pattern-adoption-and-legal-workbench-v1.md` | Maps the Inbox interaction grammar to a target-owned legal workbench and defines wizard, editor, Ibal, task, ingress and egress boundaries | repository artifact, owner review pending | no |
| SFL-EVID-021 | database ADR | `docs/architecture/adr-001-postgresql-runtime-catalog-v1.md` | Proposes PostgreSQL for structured state and encrypted object storage for immutable bytes | repository artifact, security and operations review pending | no |
| SFL-EVID-022 | CI validation | GitHub Actions Foundation check run #5 on `33cbdd64ed2cc47ede28fd701caad185593a7a9e` | Existing foundation and source-catalog checks passed for the initial architecture PR head | verified CI pass; later lock commits require their own run | no |
| SFL-EVID-023 | owner approval | `docs/ops/SFL-PRODUCT-ARCHITECTURE-LOCK-001.md` | Owner accepted the product vision, Inbox-derived workbench, Ibal boundary, PostgreSQL/object-vault direction, progress requirements and lifecycle model | owner-approved architecture direction | no |
| SFL-EVID-024 | canonical product artifact | `docs/product/product-vision-locked-v1.md` | Consolidates the hard product invariants, UI areas, wizard, evidence, ingress, egress, backend, security and ordered gates into repository truth | owner-approved locked direction; runtime not implemented | no |

## Evidence limits

- No current evidence proves the supplied Kit #3J DOCX is byte-identical to the latest official court download.
- No repository evidence yet contains the exact original binary bytes.
- No independent reviewer has compared all 267 line items against rendered pages.
- No captured source snapshot exists yet for the six listed companion forms.
- A structural validator cannot prove legal correctness or currentness.
- No Inbox code has been adopted or tested in the target repository.
- No PostgreSQL instance, migration, row-security policy, object vault, backup or recovery path has been implemented or tested.
- Architecture approval does not constitute security approval, legal review or runtime proof.
