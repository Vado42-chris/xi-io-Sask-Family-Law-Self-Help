# Project Startup sask_family_law_self_help 2026-07-22

Status: `startup hydration completed, implementation not started`  
Date: 2026-07-22  
Owner: xi-io managed projects  
Risk: `legal_medical_sensitive`

```yaml
generated_not_truth: true
validation_state: static_repo_and_source_review_only
runtime_changes_allowed: false
court_transmission_allowed: false
private_case_data_allowed: false
```

## Project identity

| Field | Value |
|---|---|
| Project name | xi-io: Saskatchewan Family Law Self-Help |
| Project ID | `sask_family_law_self_help` |
| Repo | `Vado42-chris/xi-io-Sask-Family-Law-Self-Help` |
| Default branch | `main` |
| Visibility | public |
| Project kind | active product, legal self-help workflow assistant |
| Primary user value | Turn official self-help kits into understandable, auditable tasks and form drafts |
| First reference slice | Kit #3J eligibility triage and task-plan generation |

## Identity and duplication check

Repository metadata was inspected. The target repo was empty before initialization.

Potentially related repos:

| Repo | Classification | Decision |
|---|---|---|
| `Vado42-chris/xi-io_docuforge` | donor for blank-form identity, public/private separation, and future rendering | adopt contracts and handoff boundaries, do not merge products |
| `Vado42-chris/divorce_bins` | private legal evidence workspace candidate | preserve strict separation, do not copy private evidence or strategy |
| `Vado42-chris/xi-io_AuDHD-field-guide` | donor candidate for progressive disclosure and cognitive accessibility | inspect later before component adoption |
| `Vado42-chris/xi-io.net` | canonical framework and control plane | adopt startup and governance standards |

Decision: create and govern the new repo as a distinct product. It orchestrates legal workflows. DocuForge remains the blank-form/template system, and Divorce Bins remains a private evidence workspace.

## Searchability and registry state

- GitHub repo exists and is directly accessible.
- Code-search indexing state is `unknown` because the repo began empty.
- Framework registry update is required in `xi-io.net`.
- Missing registry state must not be treated as project absence.

## README and manifest state

- README: standardized in this bootstrap.
- Managed project manifest: created at `xi/managed-project.manifest.yaml`.
- Human-only path: declared.
- AI optionality: declared.
- Safe and blocked actions: declared.
- Runtime, API, MCP, schema, security, and evidence states: explicit.

## Launch prompt inputs

| Input | Value |
|---|---|
| Human-only core path | guided manual interview, task list, form review, export |
| AI optional value | intent interpretation, follow-up questions, drafting, consistency checks |
| Local-first posture | public definitions, private user-controlled matter workspace later |
| Expected sources | official court kits, forms, practice directives, user-uploaded records |
| Sensitive data class | legal, identity, financial, family, child, health-adjacent |
| Public output | blank definitions and synthetic fixtures only |
| Private output | completed matter package, only after private workspace exists |
| Initial UI | triage, matter overview, task plan, guided interview, review, package status |
| Initial APIs | none implemented |
| Initial MCP | none implemented |
| Initial automation | none implemented |

## Evidence inspected

- Target GitHub repository metadata and empty state.
- Current xi-io.net startup, README, manifest, ledger, naming, registry, gap, and review standards.
- Kit #3J source document dated 2026-03-30, 45 pages, supplied by the user.
- Static donor README and agent rules from `xi-io_docuforge`.
- Repository metadata for `divorce_bins`.

## Evidence missing

- Official source download verification and checksum.
- Court review of the workflow interpretation.
- Lawyer review of legal-information boundaries.
- Runtime, browser, accessibility, security, and privacy test evidence.
- Current official filing and email acceptance rules.
- Dependency and runtime version decision.

## Framework gaps

1. No executable managed-project manifest schema in the framework.
2. No runtime source-version monitor for court kits.
3. No governed legal-content update and approval service.
4. No reusable private legal-workspace adapter contract.
5. No verified court filing or service adapter.
6. No reusable human-review receipt for generated legal forms.
7. No standardized consent record for AI processing of legal data.

## Approved next action

After owner review, implement a synthetic-data-only reference slice that determines whether Kit #3J appears applicable and produces a transparent task plan. It must not generate final legal advice or transmit documents.

## Blocked actions

- Real case data ingestion
- AI provider calls with user data
- Court, lawyer, or opposing-party transmission
- Signature, oath, affirmation, commissioning, or service claims
- Public deployment
- Authentication or storage implementation
- Cross-repo code promotion without source mapping and review

## Startup decision

`CREATE_DISTINCT_MANAGED_PRODUCT_WITH_DOCUFORGE_AND_DIVORCE_BINS_BOUNDARIES`
