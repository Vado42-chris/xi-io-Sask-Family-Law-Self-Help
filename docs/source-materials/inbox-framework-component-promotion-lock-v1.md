# Inbox -> xi-io Framework Primitive Promotion Lock v1

Status: `OWNER-DIRECTED NAMING + LINEAGE LOCK; FRAMEWORK REGISTRY WRITE BLOCKED BY xi-io.net#306 R1`  
Date: `2026-08-12`  
Target adopter: `xi-io: sam_law`  
Donor: `Vado42-chris/xi-io-Inbox@83826afa0ed18601300302ef1112202d11c7742c`  
Framework inspected: `Vado42-chris/xi-io.net@b27738d8e31937fb996ba8cf2abd4b8bb125d8f9`  
Machine-readable companion: `docs/source-materials/inbox-framework-component-promotion-lock-v1.json`

## Decision

The mature Inbox Mail surface is now a first-class framework donor, not merely an email donor.

The reusable implementation chain is:

```text
Inbox accepted implementation / donor evidence
  -> source map + collision review
  -> existing xi-io framework component registry
  -> versioned framework component/capability
  -> product adoption lock
  -> product-owned adapter
  -> product-owned verification
```

No new component registry, Inbox SDK, legal UI framework or runtime dependency is created.

## Naming convention

Use two stable names for every reusable primitive:

```text
component_id = snake_case durable registry/capability identity
symbol       = XiPascalCase reusable UI/API symbol
```

Examples:

```text
context_inspector -> XiContextInspector
receipt_row       -> XiReceiptRow
scope_lens        -> XiScopeLens
```

Product nouns remain adapter vocabulary:

```text
framework: XiScopeLens
Inbox:     Account / Mailbox
sam_law:   Matter / Workflow
```

Historical `Xi*` names already recorded in framework backfeed are preserved where the semantics still match. New names do not silently replace prior lineage.

## Framework ownership and current blocker

Existing owners are reused:

- `xi-io.net#236` component/adoption/freshness convergence,
- `xi-io.net#315` versioned capability distribution and adopter locks,
- `xi-io.net#301` ingress/event/provider semantics,
- `xi-io.net#302` security/privacy/authority,
- `xi-io.net#300` Git cadence,
- `xi-io.net#306` registry/namespace recovery.

Current framework `main` still has the `xi/` versus `xiio/` documentation precedence defect. The active `#306 R1` execution packet explicitly forbids registry mutation and GitHub-Contents-API framework commits until the qualified worktree check passes.

Therefore this file **freezes the promotion IDs and exact donor lineage but does not claim canonical registry admission**.

## UI/workbench primitive set

| Registry ID | Reusable symbol | Kind | Existing lineage | `sam_law` use |
|---|---|---|---|---|
| `app_shell` | `XiAppShell` | template | historical `#239` XiAppShell | application shell |
| `lane_nav` | `XiLaneNav` | component | historical `#239` XiLaneNav | top-level product navigation |
| `trust_cluster` | `XiTrustCluster` | component | historical `#239` XiTrustCluster | source/privacy/runtime trust state |
| `workbench_shell` | `XiWorkbenchShell` | template | Workbench 3-zone contract + `XiMailWorkbench` donor | matter/work surface composition |
| `scope_lens` | `XiScopeLens` | component | historical `#239` XiScopeLens | matter/workflow scope |
| `work_list_controls` | `XiWorkListControls` | component | Mail list IA | search/sort/filter/layout |
| `selectable_work_list` | `XiSelectableWorkList` | component | Mail focus-vs-checked + Workbench cards | forms/evidence/tasks/correspondence list |
| `ui_action_registry` | `XiActionRegistry` | workflow contract | Mail Action Control Standard | visible action state, reason, proposal/receipt routing |
| `context_control_cluster` | `XiContextControls` | component | Mail context controls | selected-object controls |
| `workspace_split` | `XiWorkspaceSplit` | component | Mail list/reader + reader/composer resize | resizable work/document/editor regions |
| `trusted_content_reader` | `XiTrustedContentReader` | component | Mail Body Renderer 001D | safe/plain/original source viewing |
| `context_inspector` | `XiContextInspector` | component | historical XiContextInspector + Workbench context panel | evidence, facts, blockers, receipts |
| `safe_action_bar` | `XiSafeActionBar` | component | historical `#239` + Mail action system | next safe actions and gated mutations |
| `progressive_action_lane` | `XiProgressiveActionLane` | component | Mail Progressive Actions Lane | compact activity + Ask Ibal + secondary actions |
| `draft_workspace` | `XiDraftWorkspace` | component | Mail composer drawer + XiDraftObject lineage | contextual drafting |
| `source_evidence_block` | `XiSourceEvidenceBlock` | component | historical `#239` + Workbench evidence | source/evidence card |
| `receipt_row` | `XiReceiptRow` | component | historical `#239` + Inbox Activity | single visible receipt |
| `receipt_ledger` | `XiReceiptLedger` | component/data projection | historical `#239` + Inbox Activity | matter-filtered receipt history |
| `object_timeline` | `XiObjectTimeline` | component/data projection | historical `#239` + Workbench event chains | matter/artifact chronology |
| `status_token` | `XiStatusToken` | component | historical `#239` + Workbench pills | restrained plain-language state |
| `gate_panel` | `XiGatePanel` | component | historical `#239` XiGatePanel/XiProviderGate | source/privacy/approval/egress gates |
| `progressive_empty_state` | `XiEmptyState` | component | `#236` EmptyState + Inbox Day UX | purpose-first empty state |
| `selected_context_packet` | `XiSelectedContext` | schema | Workbench selected context + Inbox Ibal context | exact selected-object context packet |
| `ibal_recommendation` | `XiIbalRecommendation` | component | historical `#239` | inspectable Ibal explanation/proposal |
| `ui_geometry_accessibility_verifier` | `XiUiGeometryAccessibilityVerifier` | validator | Inbox geometry/model proof corpus | structural geometry/a11y proof |

### Naming corrections from the initial donor census

The following early labels are now aliases only, not target registry names:

```text
WorkbenchShell             -> workbench_shell / XiWorkbenchShell
ScopeRail                  -> scope_lens / XiScopeLens
CollectionListHeader       -> work_list_controls / XiWorkListControls
ActionRegistry             -> ui_action_registry / XiActionRegistry
ContextControlCluster      -> context_control_cluster / XiContextControls
ResizableWorkspaceSplit    -> workspace_split / XiWorkspaceSplit
TrustedContentReader       -> trusted_content_reader / XiTrustedContentReader
ProgressiveActionLane      -> progressive_action_lane / XiProgressiveActionLane
SelectedContextAssistant   -> selected_context_packet + ibal_recommendation
GeometryAccessibilityProof -> ui_geometry_accessibility_verifier
```

The split of `SelectedContextAssistant` is deliberate:

```text
CONTEXT != MODEL
MODEL PROPOSAL != AUTHORITY
```

`XiSelectedContext` is the exact context contract. `XiIbalRecommendation` is one consumer/projection of it.

## Communications/evidence primitive set

Email/correspondence is a separate reusable capability family. It must not be smuggled into the generic UI primitives.

| Registry ID | Reusable symbol | Kind | Boundary |
|---|---|---|---|
| `communication_account_ref` | `XiCommunicationAccountRef` | schema | provider-neutral account identity/capability refs, no credential values |
| `communication_event` | `XiCommunicationEvent` | schema | normalized inbound/outbound communication event |
| `communication_source_record` | `XiCommunicationSourceRecord` | schema | preserved source metadata + immutable source lineage |
| `communication_attachment_manifest` | `XiCommunicationAttachmentManifest` | schema | original attachment identity/hash/storage lineage |
| `communication_ingress_pipeline` | `XiCommunicationIngressPipeline` | workflow contract | preserve -> hash -> normalize -> propose match/classification -> confirm |
| `communication_draft` | `XiCommunicationDraft` | schema | provider-neutral draft/revision state |
| `communication_egress_proposal` | `XiCommunicationEgressProposal` | workflow contract | draft + recipients + artifacts + approval/write-gate state |
| `communication_receipt` | `XiCommunicationReceipt` | schema | observed provider outcome only |

The `communication_` prefix is intentional. It avoids overloading broader framework/Bins resource identity with a generic `SourceRecord` name before the registry compatibility pass has reconciled those domains.

## Hard semantic boundaries

### UI action state is not authority

```text
XiActionRegistry availability
!= CapabilityLease
!= approval
!= provider credential
!= execution
```

The UI can say an action is available, blocked or proposed. Execution authority remains owned by framework capability/approval/provider contracts.

### Communication is evidence, not authority

```text
email/message received
!= trusted instruction
!= legal truth
!= permission to mutate another provider
```

Provider notifications must be verified against authoritative provider state before consequential automation, per `xi-io.net#301/#302`.

### Provider outcome is not legal acceptance

```text
XiCommunicationReceipt(delivered)
!= court filing accepted
!= service valid
```

Legal interpretation remains workflow/jurisdiction-owned.

## Promotion lifecycle to use

The existing component registry lifecycle is retained:

```text
candidate
-> documented
-> source_mapped
-> standardized
-> reference_implemented
-> adopted
-> verified
```

These Inbox-derived primitives have enough evidence to enter the future canonical registry primarily as `source_mapped`, not `verified`.

A donor implementation is not automatically a framework reference implementation.

## First implementation tranches after framework admission

Do not build twenty-five components in one mega-branch.

### UI-P1: workbench foundation

```text
app_shell
lane_nav
trust_cluster
workbench_shell
scope_lens
status_token
gate_panel
progressive_empty_state
```

Goal: a domain-neutral static workbench shell with no provider/runtime writes.

### UI-P2: work selection and controls

```text
work_list_controls
selectable_work_list
ui_action_registry
context_control_cluster
safe_action_bar
workspace_split
```

Goal: focus, selection, action-state and geometry behavior reused without Mail nouns.

### UI-P3: evidence and context

```text
trusted_content_reader
context_inspector
source_evidence_block
receipt_row
receipt_ledger
object_timeline
```

Goal: source/evidence/trust surfaces with no private fixture leakage.

### UI-P4: assistance and drafting

```text
selected_context_packet
ibal_recommendation
progressive_action_lane
draft_workspace
```

Goal: selected-context proposals and draft UX with explicit authority separation.

### UI-P5: shared verifier

```text
ui_geometry_accessibility_verifier
```

Goal: one reusable structural/geometry/a11y proof contract. Owner visual proof remains separate when applicable.

### COM-P1: read-only communication ingress

```text
communication_account_ref
communication_event
communication_source_record
communication_attachment_manifest
communication_ingress_pipeline
```

No provider writes.

### COM-P2: controlled egress

```text
communication_draft
communication_egress_proposal
communication_receipt
```

Requires separate provider-write, approval and security qualification.

## Registry admission packet after `#306 R1`

The first framework registry mutation should be deliberately boring:

1. reconcile component registry v1 consumers and field semantics under `#306 R2`,
2. admit only the stable IDs and exact source refs above,
3. record field-scoped evidence and lifecycle state,
4. add Inbox and `sam_law` as candidate adopters where supported,
5. do not add implementation packages in the same registry slice,
6. verify the new registry on merged `main`,
7. only then open `UI-P1` from refreshed framework `main`.

This preserves the distinction:

```text
REGISTRY ENTRY
!= IMPLEMENTATION
!= ADOPTION
!= VERIFICATION
```

## `sam_law` adoption posture

`sam_law` should eventually declare a versioned adoption lock for the subset it uses. It should not import Inbox runtime code.

Likely initial adoption:

```text
UI-P1 + UI-P2
-> synthetic matter/workbench shell
-> UI-P3 source/evidence surfaces
-> deterministic legal domain integration
-> UI-P4 selected-context Ibal/drafting
-> COM-P1 correspondence/evidence ingress
-> COM-P2 only after local/private/provider security gates
```

The legal source/workflow gates still govern what legal content may become executable. This promotion program does not bypass them.

## Stop lines

```text
NO second component registry.
NO framework registry write before xi-io.net#306 R1 is accepted.
NO claiming these IDs are canonical framework entries before that write lands on main.
NO copying Inbox provider code into xi-io.net.
NO product-specific Mail nouns in generic framework contracts.
NO Saskatchewan legal nouns in generic framework contracts.
NO mega-branch implementing the entire primitive set.
NO UI action state used as execution authority.
NO private user mail or legal data in framework fixtures.
NO provider send/write in the read-only communication ingress tranche.
NO sam_law runtime dependency on Inbox.
```

## Locked next state

```text
NAMING/LINEAGE LOCK             COMPLETE IN SFL RECOVERY LANE
FRAMEWORK COLLISION OWNER       xi-io.net#236
REGISTRY COMPATIBILITY OWNER    xi-io.net#306 R2/R3
DISTRIBUTION/ADOPTER LOCK OWNER xi-io.net#315
CANONICAL REGISTRY WRITE        BLOCKED BY #306 R1
FIRST IMPLEMENTATION TRANCHE    UI-P1 AFTER REGISTRY ADMISSION
CURRENT LEGAL RUNTIME GATE      UNCHANGED
```
