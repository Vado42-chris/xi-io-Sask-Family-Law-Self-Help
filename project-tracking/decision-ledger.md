# Decision Ledger

Status: append-only

## SFL-DEC-001, distinct product boundary

Date: 2026-07-22  
Decision: Create a distinct managed product for guided legal workflows. Keep DocuForge responsible for blank template and field-map concerns, and keep Divorce Bins or a future private workspace responsible for private evidence storage.  
Reason: Combining public template publishing, legal workflow orchestration, and private case evidence would create unsafe authority and privacy boundaries.  
State: accepted for bootstrap, owner review pending.

## SFL-DEC-002, deterministic rules before AI

Date: 2026-07-22  
Decision: Workflow applicability, form dependencies, deadlines, and completion gates are deterministic. AI remains proposal-only for interpretation and drafting.  
Reason: Procedural truth must not vary by provider or prompt.  
State: accepted for bootstrap.

## SFL-DEC-003, package generation before transmission

Date: 2026-07-22  
Decision: First egress capability is local package export. Filing, service, and email are separate future adapters with explicit approval and receipts.  
Reason: The source kit does not establish one universal electronic filing or service channel.  
State: accepted for bootstrap.

## SFL-DEC-004, no runtime dependency selection in bootstrap

Date: 2026-07-22  
Decision: Do not select framework, storage, authentication, AI, OCR, email, or PDF dependency versions until the governance spine and first slice are approved.  
Reason: The xi-io startup standard requires explicit gaps and boundaries before implementation.  
State: accepted for bootstrap.

## SFL-DEC-005, immutable dated legal-source snapshots

Date: 2026-07-22  
Decision: Every legal kit, form, directive, filing instruction, and recipient directory used by the product must belong to an immutable dated source snapshot with a stable ID, source date, capture timestamp, hash, authority state, freshness state, and supersession history.  
Reason: A mutable live page or undated transcription cannot explain which procedural source governed a matter or generated package.  
State: accepted for source capture, human review pending.

## SFL-DEC-006, line-item catalogs are the normalized form source

Date: 2026-07-22  
Decision: Every blank, question, choice, repeatable group, attachment requirement, signature, commissioner field, material static clause, and court-only field receives a stable line-item ID. The approved catalog, bound to the original source snapshot, is the normalized source used by the application.  
Reason: Workflow summaries and visual PDF coordinates alone cannot prove that every applicable question was captured.  
State: accepted for source capture, transcription review pending.

## SFL-DEC-007, freshness disclosure is primary interface content

Date: 2026-07-22  
Decision: Workflow entry, form workspace, preview, and package screens must visibly show source date, capture date, freshness state, and last official verification date. Unverified, stale, changed, or unavailable sources require a warning and may block final-ready output.  
Reason: Users need to know which dated law-court source the application is using before relying on it.  
State: accepted for architecture, runtime not implemented.

## SFL-DEC-008, new source versions never overwrite prior snapshots

Date: 2026-07-22  
Decision: A later source creates a new snapshot and line-item diff. Existing matters retain their original snapshot ID and receive migration or stale warnings.  
Reason: Silent replacement would destroy auditability and could change the meaning of already-entered answers.  
State: accepted for architecture.

## SFL-DEC-009, structurally valid does not mean legally verified

Date: 2026-07-22  
Decision: Source catalog validation checks structure, counts, IDs, metadata, and snapshot consistency, but cannot approve legal accuracy or currentness. Independent rendered-page and official-source review remains a separate gate.  
Reason: Automated consistency checks cannot determine whether a transcription or procedural interpretation is legally correct.  
State: accepted for validation design.
