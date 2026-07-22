# xi-io Inbox Pattern Source Map v1

Status: `read-only donor map, adoption not yet implemented`  
Captured: `2026-07-22`  
Donor repo: `Vado42-chris/xi-io-Inbox`  
Donor checkpoint inspected: `500f1ae5b6dade15bf113b696cea9dfd93ab1cc6`

## Boundary

This record does not authorize changes to the Inbox repository, a repository fork, a git submodule, a runtime dependency on Inbox, or wholesale code copying.

The target product will create its own legal-domain implementation using source-mapped patterns and adoption receipts.

## Donor state

The Inbox repository describes itself as a unified ingress, analysis and controlled-egress workbench. Its canonical product model treats received messages as inputs, drafts as work artifacts, send as an event boundary, receipts as audit artifacts, and Ibal as a concierge rather than a primary lane.

The current Inbox UI still contains substantial monolithic implementation in `public/inbox-preview.js` and `public/inbox-preview.css`. Its own convergence plan requires strangler-style extraction into target modules. This makes whole-repo copying a poor choice and strengthens the case for selective pattern adoption.

## Source map

| Candidate | Donor path | Donor state | Legal-domain translation | Adoption class |
|---|---|---|---|---|
| Product shell and IA | `docs/ui/ui-north-star-and-convergence-plan.md` | ratified plan | matter workbench shell | docs and interaction pattern |
| Component behaviours | `docs/ui/polish/10-component-pattern-inventory.md` | documented inventory | legal work list, reader, inspector, trust and receipts | interaction pattern |
| Current shell implementation | `public/index.html`, `public/inbox-preview.js`, `public/inbox-preview.css` | working but substantially monolithic | source reference only; extract target-owned slices | high-review code candidate |
| Module boundary target | `public/src/README.md` | partial extraction skeleton | mirror modular boundaries in target repo | architecture pattern |
| Route contract | `public/src/shell/route-table.js` | extracted | legal route table | code candidate after review |
| Ibal concierge model | `docs/ui/ui-005-ibal-concierge-model.md` | supersedes lane model | selected matter/form/question concierge | docs and interaction pattern |
| Ibal selected-context runtime | `docs/product/ibal-runtime-001a.md`, `server/ibal-suggest.mjs`, `server/ibal-provider.mjs` | implemented pattern with receipts | bounded legal context and typed proposal endpoint | runtime pattern, security review required |
| Local-first AI routing | `docs/ai/ibal-local-first-routing-001a.md` | accepted safety slice | legal-context local-first and remote consent | security contract candidate |
| Runtime/private store boundary | `docs/architecture/runtime-store-boundary-v1.md` | implemented mail boundary | private legal workspace and object vault | architecture pattern |
| Private data boundary | `docs/PRIVATE-DATA-BOUNDARY.md` | locked direction | no legal data in public assets | framework-aligned policy |
| Draft/approval/outbox/receipts | `docs/product/mail-egress-foundation-001a.md` | contract and implementation lineage | document revision, finalization, submission queue, egress receipt | state-machine pattern |
| Search command band | `public/inbox-preview.js`, related `mail-search-*` checks | implemented mail interaction | matter/form/evidence/correspondence search | component candidate |
| List/reader split and resize | `public/inbox-preview.js`, `public/inbox-preview.css`, `mail-split-*` checks | implemented and regression checked | work queue and document editor split | component candidate |
| Account rail | shell and `mail-account-*` checks | implemented and owner-reviewed lineage | matter rail and scope lens | component candidate |
| Reader trust controls | mail reader code and `mail-reader-trust-*` checks | implemented | form source/freshness and revision trust controls | interaction/test pattern |
| Calendar adapter | `tools/gcal/`, calendar capability shell | rudimentary | deadlines, appointments, work blocks | adapter pattern, not direct reuse |
| Tasks capability | task shell and UI plans | rudimentary | deterministic homework and procedural tasks | domain implementation required |
| Activity/receipt rows | UI inventory and egress docs | documented and implemented in preview lineage | append-only matter activity | component and schema candidate |
| Multi-account isolation | provider-neutral and account-isolation contracts/checks | implemented mail safety work | workspace/matter isolation lessons | security pattern only |

## Pattern adoption rules

1. Pin every adoption to a donor commit.
2. Do not import from an active feature branch without a separate source review.
3. Translate mail nouns into legal-domain nouns before implementation.
4. Remove provider-specific assumptions.
5. Preserve target-repo privacy, source-version and legal-information boundaries.
6. Add target-owned tests rather than relying on Inbox tests.
7. Record source files, copied logic if any, material modifications and license disposition.
8. Do not call an adoption framework-standard until xi-io.net promotion rules are met.
9. Do not couple release schedules between the two products.
10. Upstream Inbox changes do not automatically alter this product.

## High-value adoption order

1. Shell tokens and geometry contract.
2. Matter rail and shared scope lens.
3. Work-list row and selection contract.
4. Reader/editor and inspector geometry.
5. Search/command band.
6. Ibal drawer shell with no provider call.
7. Activity and receipt rows.
8. Task/calendar projections.
9. Selected-context Ibal runtime.
10. Finalization/outbox/egress control plane.

## Explicitly rejected wholesale adoption

- copying the full `public/` directory as the new application,
- sharing Inbox local storage keys,
- importing Gmail provider records into legal tables,
- using MIME or HTML bodies as form truth,
- treating provider send success as court acceptance,
- using the Inbox monolith as the long-term legal editor,
- making the family-law repo dependent on Inbox `main` at runtime.

## Required adoption receipt fields

```yaml
adoption_id:
target_component:
donor_repo:
donor_commit:
donor_paths:
source_evidence_state:
license_state:
privacy_review_state:
domain_translation:
rejected_donor_assumptions:
target_paths:
validation_commands:
visual_review_state:
accessibility_review_state:
security_review_state:
owner_decision:
```

## Current conclusion

The donor is highly valuable for interaction design, state-machine, safety and testing patterns. It is not yet a clean reusable component library. Direct code reuse should therefore be narrow and source-mapped, while most value is captured by recreating the proven components in the target repo with legal-domain contracts.