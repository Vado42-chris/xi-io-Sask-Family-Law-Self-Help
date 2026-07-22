# JCC Kit 3J Source Capture Receipt 001

Status: `captured and line-item transcribed, human source review pending`  
Snapshot ID: `jcc-kit-3j-2026-03-30`  
Source date printed in kit: `2026-03-30`  
Captured at: `2026-07-22T20:52:59Z`

## Source artifact identity

| Field | Value |
|---|---|
| Supplied filename | `K03j - JCC Kit - VI - 2026.03.30.docx` |
| Media type | Microsoft Word Open XML document |
| Reported length | 45 pages |
| Size | 141,225 bytes |
| SHA-256 | `5ff0d5379115aa0a75837f10fc40ae945cdcff83d6a53a83580f18db535e94ab` |
| Supplied by | project owner |
| Private case data detected | no |
| Official independent download match | not yet verified |

The hash identifies the exact supplied file. The current GitHub connector could not archive the local binary directly, so the original bytes remain an explicit repository gap. A later local-git pass must add the exact file and verify that its SHA-256 matches this receipt. The source catalogs committed in this pass are immutable derived records, not replacements for the original artifact.

## Forms physically present and captured

| Form | Printed pages | Captured line items | Catalog state |
|---|---:|---:|---|
| FAM-PD #7-2, Request for a Judicial Case Conference | 18–24 | 71 | transcription complete, review pending |
| Form 10-3, Draft Order | 25–26 | 24 | transcription complete, review pending |
| Form 10-3, Draft Child Support Order | 28–32 | 51 | transcription complete, review pending |
| Form 15-8B, Affidavit of Service by Alternate Mode | 33–39 | 54 | transcription complete, review pending |
| Form 12-3, Acknowledgment of Service | 40–42 | 27 | transcription complete, review pending |
| FAM-PD #7-5, Judicial Case Conference Appearance Memo | 42–45 | 40 | transcription complete, review pending |

Total captured line items: **267**.

The line-item count includes user inputs, choices, repeatable groups, attachment confirmations, signatures, commissioner fields, material static clauses, and court-only fields. It is not a count of only questions shown to the user.

## Explicitly absent companion forms

The supplied kit names or depends on forms that are not physically included:

- FAM-PD #7-1, Certificate of Compliance with Practice Directive #7
- FAM-PD #7-3, Joint Request for Judicial Case Conference
- FAM-PD #7-4, Notice of Judicial Case Conference, supplied by the court
- Form 15-8A, Affidavit of Personal Service
- Form 15-47, Financial Statement
- Form 15-49, Property Statement

These remain gaps. The project does not claim a complete JCC ecosystem until each required companion source is independently captured and indexed.

## Official-source check performed

On 2026-07-22, the Saskatchewan Courts Rules, Forms & Practice Directives page and the linked Family Practice Directive #7 PDF were inspected. The official page currently links the King’s Bench Rules, prescribed forms, editable forms, and FAM-PD #7. The linked FAM-PD #7 PDF identifies Forms #7-1 through #7-5 and confirms that the request, joint request, court notice, appearance memo, Financial Statement Form 15-47, and Property Statement Form 15-49 participate in the broader procedure.

This check verifies the official companion URL and broad form family. It does **not** prove that the supplied Kit #3J DOCX is byte-identical to a current official download. Freshness therefore remains `captured_unverified_current`.

## Recorded source discrepancies

1. The checklist calls the Acknowledgment of Service `Form 12-13` in two places. The detailed instructions and embedded form heading identify it as `Form 12-3`. Both the typo and working canonical value are recorded.
2. The email-service instructions refer to printing the sent email, while the Form 15-8B email page asks for a hard copy of the electronically transmitted acknowledgment of receipt. Both source statements are preserved. A procedural review is required before the application implements this as a final rule.

## User-facing freshness requirement

Every screen derived from this snapshot must show:

- source date: `March 30, 2026`,
- capture date: `July 22, 2026`,
- freshness state: `Not independently verified as current`,
- last official verification: `Not yet completed`.

Final-ready filing, service, or email output must remain blocked when source freshness or a material discrepancy is unresolved.

## Evidence paths

- `sources/source-registry.json`
- `sources/jcc-kit-3j/2026-03-30/forms-index.json`
- `sources/jcc-kit-3j/2026-03-30/forms/`
- `docs/source-materials/source-capture-and-freshness-standard-v1.md`

## Next gate

`SFL-SOURCE-REVIEW-002`: independently compare all 267 line items against rendered pages, archive the exact source binary, acquire the six absent companion forms from official sources, and issue an approved or changes-requested review receipt.
