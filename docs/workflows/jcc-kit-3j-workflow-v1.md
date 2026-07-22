# JCC Kit 3J Workflow v1

Status: `source-derived workflow draft, not court reviewed`  
Source version: `2026-03-30`  
Jurisdiction: Saskatchewan Court of King's Bench, Family Law Division

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

## Stage D, file the initial package

The source checklist identifies:

- Form FAM-PD #7-2,
- draft order or orders,
- one proof-of-service form.

The source says there is no filing fee for these documents. Current filing channel and acceptance requirements must be independently verified before the app offers transmission.

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

## Completion blockers

- Source version stale or unknown
- Eligibility unresolved
- Relief and draft order inconsistent
- Required financial or property filing state unresolved
- Service method unauthorized or uncertain
- Proof of service missing
- Required oath, affirmation, signature, or commissioner step incomplete
- Court-issued notice or endorsement awaited
- Deadline uncertain
- Appearance Memo incomplete
