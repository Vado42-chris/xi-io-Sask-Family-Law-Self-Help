# JCC Kit 3J Workflow v1

Status: `source-derived workflow draft, line-item catalog captured, human source review pending`  
Snapshot ID: `jcc-kit-3j-2026-03-30`  
Source version: `2026-03-30`  
Captured by project: `2026-07-22`  
Freshness state: `captured_unverified_current`  
Jurisdiction: Saskatchewan Court of King's Bench, Family Law Division

## Source binding

This workflow is bound to the immutable source identity recorded in:

- `sources/source-registry.json`
- `sources/jcc-kit-3j/2026-03-30/forms-index.json`
- `sources/jcc-kit-3j/2026-03-30/forms/`

The six forms physically included in the supplied kit have 267 catalogued line items. Those line-item catalogs, not this prose summary, are the canonical normalized inventory for question and field coverage.

The original source file is identified by SHA-256 `5ff0d5379115aa0a75837f10fc40ae945cdcff83d6a53a83580f18db535e94ab`. Its exact binary is not yet archived in the repository, so the source gate remains open.

## Required user-facing freshness disclosure

Every entry point, form workspace, preview, and package view derived from this workflow must visibly state:

- Source date: `March 30, 2026`
- Captured by this application: `July 22, 2026`
- Freshness: `Not independently verified as current`
- Last official verification: `Not yet completed`

Required current warning:

> This workflow was captured from Kit #3J dated March 30, 2026, on July 22, 2026. It has not yet been independently verified against the current official court download. Review current court requirements before filing or serving documents.

A source that is stale, changed, unavailable, or unverified must never render as current. Unknown or materially disputed source state blocks final-ready filing, service, or transmission output.

## Eligibility gate

The source kit applies when all of the following appear true:

- an existing Court of King's Bench family-law file exists,
- the file is in Regina or Saskatoon,
- the person is contemplating an application to be heard in chambers,
- the requested order is interim or varies an interim order.

The kit says it is not used to vary a final order, seek corollary relief after divorce, or proceed in another court location. A failed gate must provide a reason and an official referral path rather than silently continuing.

## Stage A, identify the request

Collect:

- court file number,
- Judicial Centre,
- petitioner and respondent names,
- user role,
- initiating or responding request,
- whether Form FAM-PD #7-4 and a JCC date already exist,
- requested relief categories,
- whether expedited scheduling is requested.

Every applicable line item in `fam-pd-7-2.json` must resolve to answered, not applicable with reason, display-only, court-only, or blocked. A workflow summary is not sufficient evidence of form completeness.

## Stage B, prepare initial documents

Candidate documents:

1. Form FAM-PD #7-2, Request for a Judicial Case Conference.
2. Form 10-3, Draft Interim Order.
3. Separate Form 10-3 Draft Child Support Order when child support is requested with other relief.
4. One applicable proof-of-service path.

The draft order must match the precise relief requested in paragraph 3 of the JCC request. The system must flag mismatches.

## Stage C, service before filing

For an initiating request, the source kit states that the Request for JCC and draft order must be served at least three days before filing. A response may be filed after service, with proof of service still required.

Candidate proof paths:

- Form 12-3, Acknowledgment of Service,
- Form 15-8B, Affidavit of Service by Alternate Mode,
- Form 15-8A, Affidavit of Personal Service, referenced by the kit but not included in the supplied package.

The selected method depends on an authorized address for service or another valid service route. The app must not infer authorization from an email address found elsewhere.

The source contains an unresolved email-service discrepancy. The instructions refer to printing the sent email, while Form 15-8B asks for an electronically transmitted acknowledgment of receipt as Exhibit B. Runtime implementation of this rule remains blocked pending procedural review.

## Stage D, file the initial package

The source checklist identifies:

- Form FAM-PD #7-2,
- draft order or orders,
- one proof-of-service form.

The source says there is no filing fee for these documents. Current filing channel, recipient, attachment limits, signature requirements, and acceptance requirements must be independently verified before the app offers transmission.

## Stage E, await court output

When the JCC is scheduled, the court provides:

- Form FAM-PD #7-4, Notice of Judicial Case Conference,
- a judicial endorsement,
- a deadline for service.

These are external awaited inputs. The app must not generate or impersonate court-issued documents.

## Stage F, serve and prove service of court output

Unless otherwise ordered, the user serves the notice and endorsement by the stated deadline and files new proof of service.

## Stage G, appearance memo

At least two days before the JCC, each party serves and files Form FAM-PD #7-5, Judicial Case Conference Appearance Memo.

## Stage H, attend and record outcome

The user attends as required. The clerk records the judge's decision, and the endorsement is sent to the parties at their addresses for service. The app may record receipt and next tasks, but it must not summarize an order as authoritative until the actual court document is uploaded and confirmed.

## Paragraph-level interview map

| Form area | Plain-language collection goal |
|---|---|
| Paragraph 1 | Role, initiating or responding, existing date |
| Paragraph 3 | Exact interim relief sought |
| Paragraph 4 | Urgency facts and requested expedition |
| Paragraph 5 | Brief factual history |
| Paragraph 6 | Legal grounds, source-controlled and human reviewed |
| Paragraph 7 | Other party identity and service state |
| Paragraph 8 | Settlement efforts |
| Paragraph 9 | Expected consent |
| Paragraph 10 | Pleadings closed decision tree |
| Paragraphs 11 to 14 | Financial, property, parenting course, dispute resolution states |
| Paragraph 15 | Related proceedings |
| Paragraph 18 | Availability constraints |
| Paragraph 19 | Address for service |

This map is a navigation aid. It does not replace the 71 line items in the FAM-PD #7-2 catalog.

## Companion source gaps

The workflow cannot claim full JCC form-family coverage until separate canonical snapshots exist for:

- FAM-PD #7-1,
- FAM-PD #7-3,
- FAM-PD #7-4, while preserving its court-generated status,
- Form 15-8A,
- Form 15-47,
- Form 15-49.

## Completion blockers

- Original source binary not archived and hash re-verified in the repository
- Source transcription not independently reviewed against rendered pages
- Source version stale, changed, unavailable, or unknown
- Eligibility unresolved
- Applicable companion form absent from the canonical source registry
- Relief and draft order inconsistent
- Required financial or property filing state unresolved
- Service method unauthorized or uncertain
- Email-service discrepancy unresolved when relevant
- Proof of service missing
- Required oath, affirmation, signature, or commissioner step incomplete
- Court-issued notice or endorsement awaited
- Deadline uncertain
- Appearance Memo incomplete

## Source update rule

A later official source creates a new snapshot. It must not overwrite this workflow's source snapshot. A source diff must identify changed forms and line items, affected workflow rules, migration requirements, and matters that must be warned or blocked.
