# Product Brief v1

Status: `planning checkpoint, runtime not checked`  
Date: 2026-07-22

## Problem

Family-law self-help kits often combine eligibility rules, procedural instructions, legal terminology, multiple forms, service requirements, deadlines, later court-generated documents, and follow-up filings in one large package. A self-represented person must translate that package into a personal plan while also organizing facts and evidence under stress.

## Product proposition

Create a guided workflow assistant that converts approved, versioned self-help kits into small, understandable decisions and tasks. The user describes the outcome they need, confirms the candidate workflow, answers plain-language questions, reviews every drafted statement, receives a homework list for missing records, and exports a package with a clear submission checklist.

## Product layers

1. Source layer, versioned official kits, forms, directives, and court instructions.
2. Workflow layer, deterministic eligibility, dependencies, deadlines, and required artifacts.
3. Matter layer, reusable user-approved facts, people, events, evidence, tasks, and disputes.
4. Drafting layer, editable narrative blocks with provenance and approval state.
5. Forms layer, stable semantic field mappings and generated documents.
6. Egress layer, package manifest, service and filing instructions, and receipts.
7. Optional assistant layer, provider-independent conversational support.

## Primary users

- Self-represented Saskatchewan family-law litigants
- Support workers assisting with form organization, where authorized
- Legal information centres and clinics evaluating guided self-help tooling
- Lawyers reviewing a client-prepared factual package

## Core user outcomes

- Know whether a workflow appears applicable and why.
- Know which forms and supporting records are required.
- Understand the order in which tasks must occur.
- Reuse confirmed facts across documents without repeated entry.
- Convert a difficult story into concise, editable factual statements.
- See contradictions, missing facts, and unsupported claims before finalization.
- Export a reviewable package without surrendering control to AI.

## Non-goals for the first release

- Legal advice or outcome prediction
- All Saskatchewan family-law procedures
- Automatic court filing or service
- Digital commissioning or sworn evidence
- Public storage of completed forms
- Autonomous AI decision-making
- Replacement of court staff, legal information services, or lawyers

## Success criteria for the first reference slice

Using synthetic data, a user can answer the minimum eligibility questions for Kit #3J and receive one of three transparent outcomes:

- candidate workflow applicable,
- candidate workflow not applicable with a reason and referral path,
- insufficient information with a precise homework list.

The same facts must produce the same deterministic task plan regardless of whether AI is enabled.
