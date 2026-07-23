# xi-io: Saskatchewan Family Law Self-Help

Status: `active managed project, governance and source-capture bootstrap`  
Project ID: `sask_family_law_self_help`  
Repo: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`  
Default branch: `main`

## Current status

This repository contains the framework-aligned startup spine and the first dated legal-source snapshot for a public-facing Saskatchewan family-law workflow assistant. Runtime application code has not started and has not been verified.

| Area | State |
|---|---|
| Completion class | `C2 scaffold_only` |
| Evidence tier | `E2 static_review` |
| Runtime | `not_started` |
| API | `docs_only` |
| MCP | `docs_only` |
| Schemas | `conceptual_docs_only` |
| AI integration | `not_configured` |
| Court or email transmission | `forbidden_not_implemented` |
| Security review | `required_not_started` |
| Current source snapshot | `jcc-kit-3j-2026-03-30` |
| Source freshness | `captured_unverified_current` |
| Included forms indexed | `6` |
| Captured line items | `267` |

## What this repo is

This project is intended to turn versioned Saskatchewan court self-help kits into deterministic, progressive-disclosure workflows. A user describes the result they need, the system identifies a candidate workflow and required forms, gathers reusable facts, drafts user-reviewable text, identifies missing records, prepares form packages, and tracks service, filing, and follow-up tasks.

The first reference workflow is Saskatchewan Court of King's Bench Kit #3J, Request for a Judicial Case Conference Order, source version dated March 30, 2026 and captured by this project on July 22, 2026.

## Canonical source snapshot

The source registry lives at [`sources/source-registry.json`](sources/source-registry.json). The first snapshot contains complete line-item catalogs for the six forms physically included in the supplied 45-page kit:

- FAM-PD #7-2, Request for a Judicial Case Conference
- Form 10-3, Draft Order
- Form 10-3, Draft Child Support Order
- Form 15-8B, Affidavit of Service by Alternate Mode
- Form 12-3, Acknowledgment of Service
- FAM-PD #7-5, Judicial Case Conference Appearance Memo

The catalogs contain 267 stable line items, including inputs, choices, conditional follow-ups, repeatable groups, attachment requirements, signatures, commissioner fields, material static clauses, and court-only fields.

This does not yet establish complete JCC coverage. FAM-PD #7-1, FAM-PD #7-3, court-generated FAM-PD #7-4, Form 15-8A, Form 15-47, and Form 15-49 remain explicit source gaps.

## Required freshness disclosure

Every workflow start screen, form workspace, preview, and final package screen must visibly show:

- form source date,
- date captured by this application,
- freshness state,
- last official verification date or `Not yet verified`,
- a warning whenever the snapshot is not independently verified as current.

Current required wording is based on this state:

> This workflow was captured from Kit #3J dated March 30, 2026, on July 22, 2026. It has not yet been independently verified against the current official court download. Review current court requirements before filing or serving documents.

## What this repo is not

- It is not a law firm, lawyer, court, filing service, or source of legal advice.
- It is not authorized to decide legal entitlement or predict outcomes.
- It does not yet transmit documents to a court, opposing party, lawyer, or service provider.
- It does not store real case files in this public repository.
- It does not make AI mandatory for core use.
- It does not treat a generated draft or a structurally valid catalog as verified legal content.

## Human-only path

Supported by design. A user must be able to:

1. select or confirm the applicable workflow,
2. answer plain-language questions,
3. enter and edit facts manually,
4. see why each question is being asked,
5. upload or identify required records,
6. review every generated field and paragraph,
7. export a package without AI access.

## AI-assisted path

AI is optional and interchangeable. It may help interpret user intent, ask bounded follow-up questions, reorganize the user's own facts, suggest plain-language drafts, flag inconsistencies, and explain form terminology. It may not silently select relief, invent facts, provide unqualified legal conclusions, sign, swear, serve, file, or send documents.

## Local-first and data posture

The public repo contains only code, blank workflow definitions, public source records, test fixtures that contain no personal information, and governance artifacts. Real legal matters must use a separate private workspace. Sensitive data must not be committed, included in public logs, used as analytics payload, or sent to an AI provider without explicit informed approval.

## Safe commands

```bash
npm run check
npm run check:source-catalog
```

No dependency installation is required for the current documentation and source-catalog checks.

## Blocked commands

The following action classes are blocked unless separately approved and receipted:

```text
destructive git or force push
merge or release
public deploy or tunnel changes
secret or .env display
schema migration
court filing or email transmission
service on another party
AI-provider data egress involving a real matter
cross-repo mutation
production storage or authentication changes
```

## Documentation map

Start with [`docs/INDEX.md`](docs/INDEX.md). Primary control files are:

- [`AGENTS.md`](AGENTS.md)
- [`sources/source-registry.json`](sources/source-registry.json)
- [`sources/jcc-kit-3j/2026-03-30/forms-index.json`](sources/jcc-kit-3j/2026-03-30/forms-index.json)
- [`docs/source-materials/source-capture-and-freshness-standard-v1.md`](docs/source-materials/source-capture-and-freshness-standard-v1.md)
- [`docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md`](docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md)
- [`xi/managed-project.manifest.yaml`](xi/managed-project.manifest.yaml)
- [`xi/feature-index.yaml`](xi/feature-index.yaml)
- [`docs/ops/execution-sequence-v1.md`](docs/ops/execution-sequence-v1.md)
- [`docs/workflows/jcc-kit-3j-workflow-v1.md`](docs/workflows/jcc-kit-3j-workflow-v1.md)
- [`project-tracking/open-work-ledger.md`](project-tracking/open-work-ledger.md)

## Related framework records

Canonical framework reference: `Vado42-chris/xi-io.net`.

This bootstrap follows the xi-io repository governance quickstart, project startup hydration standard, README standard, managed-project manifest standard, agent-run ledger standard, and managed-project white-label launch prompt current at framework commit `c29afb513d6e44511ecb00bec7514df3229f7d0c`.

## Known gaps

- The exact original Kit #3J binary is hash-identified but not yet archived in the repository.
- The 267 line items require independent rendered-page review before approval.
- Six named companion forms remain uncaptured.
- No runtime stack or dependency versions have been selected.
- No executable workflow engine exists.
- No form rendering or PDF insertion engine exists.
- No private matter workspace exists.
- No authentication, encryption, retention, deletion, backup, or recovery implementation exists.
- No official court filing integration has been verified.
- No lawyer or court administrator has reviewed the product rules.
- Automated kit freshness monitoring is not implemented.
- Accessibility requirements are documented but not runtime tested.

## Local preview (architecture proof)

```bash
npm run check
npm run preview
```

Open:

- User Continue-first shell: `http://127.0.0.1:4173/app`
- Source review: `http://127.0.0.1:4173/source-review`
- Developer diagnostics: `http://127.0.0.1:4173/dev`
- Legacy workbench: `http://127.0.0.1:4173/legacy`

Private matter never auto-loads. Court readiness remains blocked. See `docs/ops/SFL-INTERACTION-ARCHITECTURE-001I.md`.

## Next action

Keep `SFL-SOURCE-REVIEW-002` open for the 267-item page review. Peer-review the interaction-architecture proof on FAM-PD #7-5, complete Track A human PDF compare for the private litmus, and do not expand presentation generation to all forms yet.

## Maintenance rule

Update this README whenever the project status, runtime state, API or MCP state, schema state, privacy boundary, source kit version, manifest, major blocker, or next action changes. Do not describe the product as complete or production-ready without linked evidence.

## License

No project license has been selected. Public visibility does not grant permission to reuse code or content beyond rights provided by applicable law.
