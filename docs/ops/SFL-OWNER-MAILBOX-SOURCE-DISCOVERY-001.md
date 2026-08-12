# SFL Owner Mailbox Source Discovery 001

Status: `RECOVERY DISCOVERY; mailbox provenance recorded without private case content`  
Date: `2026-08-12`  
Project: `sask_family_law_self_help`

```yaml
generated_not_truth: true
source_channel: owner_connected_gmail
private_case_content_copied_to_repo: false
mailbox_mutated: false
currentness_verified: false
runtime_admission: false
```

## Purpose

During framework/source recovery, the owner asked whether other Saskatchewan family-law self-help kits had been received directly from the Government of Saskatchewan contact who supplied Kit #4a and should therefore be included in the project source inventory.

The mailbox was searched for direct messages from that sender containing attachments. Private case subjects, recipient details and correspondence content are intentionally not reproduced here.

## Direct attachment source inventory found

| Artifact | Mailbox received | Classification | Repository recovery disposition |
|---|---:|---|---|
| `K02a - Preparing an Answer and Counter-Petition - FINAL - KB - 2023.04.10.docx` | 2026-05-04 | full self-help kit | `REQUIRED SOURCE FAMILY`, intake created |
| `K03j - JCC Kit - VI - 2026.03.30.docx` | 2026-05-12 | full self-help kit | already represented by existing Kit #3J capture, mailbox provenance strengthens source record |
| `Form 15-52 - Notice to Disclose - with KB Rule - KB.docx` | 2026-07-17 | standalone court form plus governing rule excerpt | `REQUIRED STANDALONE SOURCE`, intake created |
| `K04a - Replying to a Court Application - FINAL - KB - 2023.04.10.docx` | 2026-08-07 | full self-help kit | already under active recovery intake |
| `Poster - Saskatoon - Apr-Aug 2026.pdf` | 2026-05-04 and again 2026-05-12 | dated procedural/schedule reference | record as lower-priority reference candidate, do not use as current scheduling truth |

No other full self-help kit attachment was found in the direct-sender attachment search. The full kit set discovered from this mailbox lane is therefore:

```text
Kit #2a
Kit #3J
Kit #4a
```

This is a mailbox-discovery statement only. It does not claim that those are all Saskatchewan family-law kits that exist publicly or all source families the product will eventually need.

## Kit #2a impact

Kit #2a is not a minor companion source. It is a separate procedural workflow family for responding to a Petition and deciding between an Answer and an Answer and Counter-Petition.

Its table of contents physically includes nine form instances:

1. Form 15-19B, Notice of Intent to Answer
2. Form 15-19A, Answer
3. Form 15-20, Answer and Counter-Petition
4. Form 15-51, Notice to File Financial Statement
5. Form 15-47, Financial Statement
6. Form 15-49, Property Statement
7. Form 15-8B, Affidavit of Service by Alternate Mode
8. Form 15-8A, Affidavit of Personal Service
9. Form 12-3, Acknowledgment of Service, although the kit repeatedly labels this Form 12-13 outside the embedded form

The kit also contains form-selection logic, response timing, extension paths, dispute-resolution prerequisites, child-related course guidance, marriage-certificate requirements, financial/property disclosure branches, different service rules for Answer versus Counter-Petition, proof-of-service alternatives, filing/fee information and post-filing pathways.

It must be mined as a workflow source, not reduced to a form list.

## Standalone Form 15-52 impact

The direct mailbox attachment contains both Rule 15-52 text and Form 15-52, Notice to Disclose.

The supplied artifact describes:

- when the notice may be served,
- a source-stated 30-day response period,
- written objection handling,
- multiple selectable disclosure requests,
- continuing correction of incomplete/changed information,
- source-described consequences/remedies for non-response.

Because no revision/publication date was observed in the artifact, it remains undated intake and every timing/procedure-sensitive rule is blocked pending current official comparison.

## Cross-source implications

The mailbox discovery reinforces why the product cannot use one global source snapshot or deduplicate forms by official number alone.

Repeated form families now include at least:

- Form 15-47 across Kit #2a, Kit #4a and Kit #3J references,
- Form 15-8B across Kit #2a, Kit #4a and Kit #3J,
- Form 12-3 across Kit #2a, Kit #4a and Kit #3J,
- Form 15-49 in Kit #2a and Kit #3J references,
- Form 15-8A in Kit #2a and Kit #3J references.

Each instance must retain exact source identity until byte/text/layout/current-version equivalence is independently established.

## Material Kit #2a discrepancies discovered during first mining pass

### K2A-DISC-001, Acknowledgment of Service number

The kit table of contents, service instructions and checklist use `Form 12-13`, while the embedded form heading is `Form 12-3 (Subrule 12-3(1))`.

### K2A-DISC-002, personal-service affidavit number

The included form, table of contents and most service instructions use `Form 15-8A`, while one Counter-Petition service instruction calls it `Form 15-18A`.

Both discrepancies are preserved and must not be silently normalized into final-ready procedure.

## Recovery disposition

Created:

```text
sources/intake/kit-2a/2023-04-10/source-intake.json
sources/intake/form-15-52/undated/source-intake.json
```

Still required:

- exact binary archival for both sources,
- current official comparison,
- complete stable line-item catalogs,
- complete Kit #2a workflow/decision graph,
- complete Kit #2a Form 15-47 and Form 15-49 structures or reviewed equivalence relationships,
- cross-snapshot comparisons for repeated forms,
- independent rendered-page review,
- source approval receipts,
- separate decision on whether/how to govern dated Judicial Family Centre schedule posters.

## Privacy boundary

This discovery record deliberately omits the private legal case subject, case number, recipient address and substantive correspondence. Only artifact-level provenance needed to govern public legal source materials is retained.
