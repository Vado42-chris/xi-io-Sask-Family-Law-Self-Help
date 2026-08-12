# xi-io Inbox Mail Workbench Donor Census — 2026-08-12

Status: `RECOVERY DONOR CENSUS; READ_ONLY SOURCE CLASSIFICATION; NO RUNTIME ADOPTION AUTHORITY`  
Target: `xi-io: sam_law` / current Saskatchewan Family Law recovery  
Accepted Inbox baseline inspected: `Vado42-chris/xi-io-Inbox@83826afa0ed18601300302ef1112202d11c7742c`  
Historical SFL donor map: `docs/source-materials/inbox-pattern-source-map-v1.md`  
Framework owners: `xi-io.net#236`, `#315`, `#301`, `#302`, `#300`

## Point-of-order finding

The July 22 source map correctly identified Inbox as a strong interaction donor, but it materially understates the maturity and breadth of the Mail surface as of August 12.

Mail is currently the most mature interaction surface in the Inbox product and should be treated as the primary UI donor for `sam_law`, not merely as an email feature donor.

The donor relationship must remain:

```text
Inbox accepted implementation / qualified donor evidence
  -> framework collision + promotion review
  -> reusable white-label capability contract
  -> sam_law adopter lock / target-owned adapter
  -> target-owned verification
```

Not:

```text
Inbox screen/code
  -> copy into sam_law
```

Draft Inbox PRs and historical branches are donor/review evidence only. Accepted `main` is the default source authority unless a bounded adoption receipt explicitly qualifies another exact source ref.

## Two different reuse lanes

### Lane A — generic workbench/UI primitives

These are not fundamentally email concepts. They are reusable interaction primitives that Mail has exercised more deeply than other current xi-io product surfaces.

Candidate framework capabilities:

1. `WorkbenchShell`
   - persistent product shell
   - primary scope rail
   - list/work queue
   - primary reader/workspace
   - optional context/action lane
   - responsive collapse behavior

2. `ScopeRail`
   - compact scoped navigation
   - active identity/context
   - health/attention badges
   - collapse/resize behavior
   - product-owned noun adapter

3. `CollectionListHeader`
   - search
   - sort
   - filter
   - layout mode
   - selected-state title
   - current scope summary

4. `SelectableWorkList`
   - focus distinct from checked/selected state
   - section-aware selection
   - bulk-selection controls
   - empty/degraded/loading states
   - stable keyboard interaction

5. `ActionRegistry`
   - stable action IDs
   - scope resolution
   - enabled / disabled / blocked / proposed / unavailable state
   - visible blocked reason
   - proposal and receipt bindings
   - handler class separate from product-specific execution

6. `ContextControlCluster`
   - selected-object controls
   - local state versus external mutation state
   - consistent More/action menus
   - no one-off menu proliferation

7. `ResizableWorkspaceSplit`
   - list/reader split
   - reader/composer or editor split
   - keyboard/pointer-safe resize
   - geometry checks
   - persisted local preference where appropriate

8. `TrustedContentReader`
   - safe/default representation
   - plain representation
   - isolated original representation where available
   - active/remote content blocking
   - explicit source-retention state
   - product adapter supplies domain-specific trust policy

9. `ContextInspector`
   - selected item evidence/source refs
   - claims / extracted facts
   - blockers
   - closure criteria
   - receipts
   - provenance
   - product/domain translation only, no direct provider logic

10. `ProgressiveActionLane`
    - collapsed by default
    - one useful activity/status peek
    - one assistant entry point
    - progressive disclosure of secondary/future actions
    - no repeated inactive-card sludge

11. `DraftWorkspace`
    - context-preserving bottom drawer/workspace
    - draft lifecycle
    - autosave/local receipt
    - resize/collapse
    - separate provider-write gate
    - product-specific editor adapter

12. `ActivityReceiptTimeline`
    - append-only user-visible activity projection
    - action/source/review receipts
    - compact latest-state projection plus full evidence view

13. `TrustStatusSurface`
    - provider/source/runtime state
    - no silent green
    - unavailable/degraded/blocked distinction
    - human-readable reason

14. `ProgressiveEmptyState`
    - purpose first
    - one safe next action
    - Learn more / advanced disclosure
    - avoid exposing implementation scaffolding to ordinary users

15. `SelectedContextAssistant`
    - assistant receives exact selected-object context
    - assistant proposals remain proposals
    - product data adapter and authority ceiling remain target-owned

16. `GeometryAccessibilityProof`
    - deterministic geometry checks where useful
    - keyboard/focus checks
    - reduced cognitive-load checks
    - owner visual proof remains separate from structural proof

These candidates require collision review against current xi-io.net component and UI standards before promotion. Their existence in Inbox does not itself make them framework-standard.

## Lane B — provider-neutral communications and evidence ingress

`sam_law` also needs email/correspondence capability, but this should be a reusable framework capability projected by Inbox rather than a Gmail subsystem embedded directly in the legal domain.

Candidate reusable contracts:

### `CommunicationAccountRef`

Provider-neutral account identity and capability state:

```text
account_id
provider_id
display_alias
read_capability
write_capability
sync_state
privacy_profile
credential_ref
```

Credentials/tokens remain in the responsible connector boundary, never in legal matter records.

### `CommunicationEvent`

One normalized incoming or outgoing communication event:

```text
event_id
provider_ref
account_ref
direction
sent_received_at
participants
subject_or_title
conversation_ref
body_snapshot_refs
attachment_refs
source_hash_or_source_record_ref
privacy_class
processing_state
```

The canonical legal chronology remains event-based. Provider threads are navigation aids, not legal truth.

### `SourceRecord`

Provider-neutral preserved source metadata linking original communication bytes to a durable matter/workspace record.

Must support:

- raw/original preservation where legally appropriate
- immutable source hash
- provider/source identifiers
- normalized metadata
- exact attachment lineage
- receipt linkage
- human correction/reclassification

### `AttachmentManifest`

The Inbox direction is directly relevant to legal evidence:

```text
original_filename
normalized_filename
source_record_id
media_type
size
content_hash
inline/user-visible classification
preservation/storage reference
processing/safety state
receipt refs
```

For `sam_law`, add legal-domain classification only in the target adapter, for example `potential_evidence`, `court_form`, `correspondence`, `receipt`, `unknown_needs_review`. Inbox/framework should not own Saskatchewan legal meaning.

### `EvidenceIngressPipeline`

Target generic flow:

```text
provider read/import
-> preserve original
-> hash
-> deterministic metadata extraction
-> attachment manifest
-> safety/type inspection
-> proposed collection/matter match
-> human confirm
-> optional text extraction
-> proposed classification
-> source record + receipts
```

Unknown matches remain `needs_human_decision`; no silent legal-matter attachment.

### `CommunicationDraft`

Provider-neutral draft object with:

- exact selected context
- recipients
- subject/title
- body/document blocks
- linked artifacts
- draft revisions
- local-save receipts
- approval state
- provider capability state

Draft existence does not grant send authority.

### `CommunicationEgressProposal`

Separates drafting from sending:

```text
draft_ref
recipient_refs
attachment_refs
provider_target
required_approval
write_gate_state
validation_state
```

A legal product may use this for ordinary correspondence. It must not treat email delivery as proof of court filing or valid service unless the governing legal workflow explicitly permits and verifies that method.

### `CommunicationReceipt`

Records observed provider outcome without inflating it into legal acceptance:

```text
attempted_at
provider
operation
provider_response_ref
observed_delivery_state
receipt_hash/evidence_ref
```

Legal interpretation is target/workflow-owned.

## Inbox donor evidence already supporting these candidates

Accepted Inbox `main` contains or documents substantial evidence for:

- provider-neutral Books/Library and Source Records;
- evidence email ingress metadata;
- evidence-grade offline `.eml` preservation/export direction;
- account/provider scope separation;
- action registry and blocked/proposed action states;
- Mail list IA with search/sort/filter/layout and selected-state hierarchy;
- reader controls and trustworthy safe/plain/original body rendering;
- focused/checked separation;
- context-preserving composer/draft workspace direction;
- activity/receipt semantics;
- progressive Actions lane and Ask Ibal entry point;
- attachment-manifest direction;
- no-provider-write / fail-closed patterns;
- extensive model/geometry/visual proof tooling.

The Mail surface therefore supplies both reusable product patterns and a valuable validation corpus.

## `sam_law` translation

Do not translate every Mail noun one-to-one. Use the reusable behavior while preserving legal concepts.

```text
Inbox / Mail                sam_law
-------------------------------------------------------------
Account                     communication account integration
Book                        matter/workspace collection adapter
Mailbox/view                correspondence/evidence view
Message                     correspondence event/source record
Thread                      conversation navigation/reference
Attachment                  evidence/source artifact candidate
Reader                      correspondence/source viewer
Compose drawer              correspondence drafting workspace
Selection                   selected legal/source objects
Action registry             legal-safe action registry adapter
Activity receipt            matter activity/receipt
Ask Ibal                    selected-context legal assistant entry
Provider write gate         communication egress authority gate
```

The primary `sam_law` shell still centers the legal matter/workflow/form/task graph, not the mailbox. Email is one ingress/egress lane inside that product.

## Recommended legal UI composition

A matter workspace can reuse the Mail grammar without pretending the app is an email client:

```text
MATTER RAIL
  -> WORK / CORRESPONDENCE / EVIDENCE LIST
      -> SELECTED FORM / DOCUMENT / MESSAGE / SOURCE
          -> CONTEXT INSPECTOR
          -> PROGRESSIVE ACTIONS / ASK IBAL
```

When the user opens Correspondence specifically, the center/list and reader behavior may become more Mail-like because the source object is actually communication.

When the user opens Forms or Tasks, the same shell primitives remain but the domain adapter changes.

## Framework promotion path

Use existing framework owners instead of creating another component library or Inbox SDK.

```text
Inbox donor evidence
  -> xi-io.net#236 component/adoption/freshness review
  -> xi-io.net#315 versioned capability availability/adopter lock
  -> xi-io.net#301 provider/event/ingress semantics where applicable
  -> xi-io.net#302 security/privacy/authority constraints
  -> sam_law adoption receipt
```

Promotion status for every candidate in this document is currently:

`CANDIDATE_REQUIRES_FRAMEWORK_COLLISION_AND_PROMOTION_REVIEW`

No candidate is declared framework-standard merely by this census.

## `sam_law` implementation ordering impact

This finding does not unblock broad UI implementation before legal source/domain gates.

It changes the donor-preparation order:

1. keep source/legal graph recovery active;
2. complete Inbox Mail donor census and framework collision map in parallel read-only work;
3. identify which reusable primitives already have accepted xi-io.net owners;
4. promote/backfeed only genuine framework gaps;
5. define `sam_law` adoption lock/source receipts;
6. build synthetic `sam_law` shell using target-owned adapters;
7. add correspondence/email ingress only after private workspace, storage/custody, and connector security boundaries are accepted;
8. add provider write/send only through an explicit human-gated egress slice.

## Stop lines

```text
NO Inbox fork.
NO runtime dependency on Inbox main.
NO Gmail data model as legal-domain model.
NO email account credentials in matter data.
NO private user mail in public repository fixtures.
NO automatic attachment-to-matter classification.
NO provider thread ID as canonical legal chronology identity.
NO sent-email receipt treated automatically as filing/service acceptance.
NO draft Inbox PR treated as accepted component authority.
NO new framework component family before xi-io.net collision review.
NO UI refactor ahead of governing legal/source model.
```

## Current conclusion

The Mail surface is not merely a donor for an email component. It is currently one of the strongest end-to-end UX laboratories in the xi-io ecosystem.

For `sam_law`, the highest-value strategy is:

```text
REUSE THE MAIL WORKBENCH GRAMMAR
+ PROMOTE GENERIC PRIMITIVES THROUGH XI-IO.NET
+ CONSUME THEM THROUGH VERSIONED ADOPTION
+ KEEP LEGAL DOMAIN TRUTH TARGET-OWNED
+ ADD EMAIL AS A PROVIDER-NEUTRAL CORRESPONDENCE/EVIDENCE LANE
```
