# xi-io: Saskatchewan Family Law Self-Help

Status: `active managed project, governance bootstrap`  
Project ID: `sask_family_law_self_help`  
Repo: `Vado42-chris/xi-io-Sask-Family-Law-Self-Help`  
Default branch: `main`

## Current status

This repository contains the framework-aligned startup spine for a public-facing Saskatchewan family-law workflow assistant. The governance, product, privacy, workflow, lexicon, capability, and evidence records are present. Runtime application code has not started and has not been verified.

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

## What this repo is

This project is intended to turn versioned Saskatchewan court self-help kits into deterministic, progressive-disclosure workflows. A user describes the result they need, the system identifies a candidate workflow and required forms, gathers reusable facts, drafts user-reviewable text, identifies missing records, prepares form packages, and tracks service, filing, and follow-up tasks.

The first reference workflow is Saskatchewan Court of King's Bench Kit #3J, Request for a Judicial Case Conference Order, version dated 2026-03-30.

## What this repo is not

- It is not a law firm, lawyer, court, filing service, or source of legal advice.
- It is not authorized to decide legal entitlement or predict outcomes.
- It does not yet transmit documents to a court, opposing party, lawyer, or service provider.
- It does not store real case files in this public repository.
- It does not make AI mandatory for core use.
- It does not treat a generated draft as a verified legal document.

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
```

No dependency installation is required for the current documentation foundation check.

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
- [`xi/managed-project.manifest.yaml`](xi/managed-project.manifest.yaml)
- [`xi/feature-index.yaml`](xi/feature-index.yaml)
- [`docs/ops/execution-sequence-v1.md`](docs/ops/execution-sequence-v1.md)
- [`docs/workflows/jcc-kit-3j-workflow-v1.md`](docs/workflows/jcc-kit-3j-workflow-v1.md)
- [`project-tracking/open-work-ledger.md`](project-tracking/open-work-ledger.md)

## Related framework records

Canonical framework reference: `Vado42-chris/xi-io.net`.

This bootstrap follows the xi-io repository governance quickstart, project startup hydration standard, README standard, managed-project manifest standard, agent-run ledger standard, and managed-project white-label launch prompt current at framework commit `c29afb513d6e44511ecb00bec7514df3229f7d0c`.

## Known gaps

- No runtime stack or dependency versions have been selected.
- No executable workflow engine exists.
- No form rendering or PDF insertion engine exists.
- No private matter workspace exists.
- No authentication, encryption, retention, deletion, backup, or recovery implementation exists.
- No official court filing integration has been verified.
- No lawyer or court administrator has reviewed the product rules.
- Kit version monitoring and legal-content update governance are not implemented.
- Accessibility requirements are documented but not runtime tested.

## Next action

Review and approve the governance bootstrap, then implement one thin, local-only reference slice: eligibility triage and task-plan generation for Kit #3J using synthetic data only.

## Maintenance rule

Update this README whenever the project status, runtime state, API or MCP state, schema state, privacy boundary, source kit version, manifest, major blocker, or next action changes. Do not describe the product as complete or production-ready without linked evidence.

## License

No project license has been selected. Public visibility does not grant permission to reuse code or content beyond rights provided by applicable law.
