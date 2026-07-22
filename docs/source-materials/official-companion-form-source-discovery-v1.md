# Official Companion Form Source Discovery v1

Status: `official sources located, artifacts not yet archived or line-item reviewed`  
Project: `sask_family_law_self_help`  
Discovery date: `2026-07-22`

## Purpose

Record the official online locations found for the six companion forms named by the Kit #3J source capture. This is a discovery record only. A URL is not yet an immutable source snapshot.

Each artifact must still be downloaded, hashed, archived without alteration, indexed by form and page, independently reviewed line by line, and assigned a freshness state before it can become canonical runtime truth.

## Official Saskatchewan Courts source family

Official Court of King's Bench Rules, Forms & Practice Directives page:

- https://sasklawcourts.ca/kings-bench/rules-practice-directives/

This page is the current Court entry point for the King's Bench Rules, King's Bench Forms, editable King's Bench Forms, and Family Practice Directives.

## FAM-PD #7 companion forms

Official Family Practice Directive #7 PDF:

- https://sasklawcourts.ca/wp-content/uploads/2024/01/KB_FAMILY_PD7-_Revised2024.pdf

The PDF identifies itself as Family Practice Directive #7, effective `2022-11-01` and revised `2023-11-01`. It contains the following official blank forms as appendices:

| Form | Official title | Appendix | PDF pages, one-based | Discovery state |
|---|---|---|---:|---|
| FAM-PD #7-1 | Certificate of Compliance with Practice Directive #7 | Appendix B | 13-14 | official PDF located, not archived |
| FAM-PD #7-3 | Joint Request for a Judicial Case Conference | Appendix D | 20-25 | official PDF located, not archived |
| FAM-PD #7-4 | Notice of Judicial Case Conference | Appendix E | 26-29 | official PDF located, not archived, court-generated workflow artifact |

### FAM-PD #7-4 handling rule

The blank official template may be captured as source material, but the product must not generate or impersonate a court-issued Notice. Runtime use is limited to:

- explaining what the user should expect from the Court,
- accepting an issued Notice as an external document,
- extracting court-provided date, time, location, service deadline and directions,
- creating follow-up tasks,
- preserving the issued document unchanged.

## King's Bench prescribed forms

Official Publications Saskatchewan catalogue entry for the King's Bench Forms:

- https://publications.saskatchewan.ca/#/products/86045

The Saskatchewan Courts Rules, Forms & Practice Directives page links to Publications Saskatchewan for both the King's Bench Forms and editable King's Bench Forms.

The following forms must be captured from that official publication family:

| Form | Official title | Discovery state |
|---|---|---|
| Form 15-8A | Affidavit of Personal Service | official catalogue located, direct downloadable asset not yet archived |
| Form 15-47 | Financial Statement | official catalogue located, direct downloadable asset not yet archived |
| Form 15-49 | Property Statement | official catalogue located, direct downloadable asset not yet archived |

The Publications Saskatchewan site is a client-rendered catalogue. The current web research pass confirmed the official catalogue location but did not produce stable individual asset URLs for these three forms. The next source-ingress pass must open the catalogue interactively, download each exact official file, and record the final resolved download URL and content hash.

## Required immutable capture record

Each form must receive a new source record containing:

```yaml
form_id:
official_title:
official_source_page_url:
official_download_url:
source_effective_or_revision_date:
captured_at:
sha256:
size_bytes:
file_type:
page_count:
authority_state:
freshness_state:
last_official_verification_at:
supersedes_snapshot_id:
superseded_by_snapshot_id:
line_item_catalog_path:
independent_review_state:
```

## Freshness and user disclosure

Until the exact files are archived and compared, these forms remain `official_source_located_capture_pending`.

The application must not describe them as current, verified, complete, or ready for filing. When eventually exposed in the product, the source date, capture date, last verification date, and freshness state must be visible beside the form and in the final package review.

## Next action

1. Download and archive the official FAM-PD #7 PDF.
2. Extract FAM-PD #7-1, #7-3 and #7-4 as immutable source ranges while retaining the full parent PDF.
3. Download Forms 15-8A, 15-47 and 15-49 from Publications Saskatchewan.
4. Hash and register all source artifacts.
5. Build complete line-item catalogs.
6. Independently compare every line item against rendered source pages.
7. Update Issue #3 and the source registry with evidence-backed freshness states.
