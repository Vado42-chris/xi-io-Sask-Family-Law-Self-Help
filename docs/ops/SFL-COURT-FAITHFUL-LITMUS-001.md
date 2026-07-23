# SFL-COURT-FAITHFUL-LITMUS-001

Status: active local track  
Date: 2026-07-22  
Case context: private matter answers live only under `data/private/` (gitignored; not reviewed via this public PR).

## Purpose

Produce court-faithful filled PDFs by overlaying verified answers onto archived official blank pages. The structural workbench page preview is **not** filing-ready. Case-relevant forms are the litmus before expanding to other Kit forms.

## Case-relevant priority (litmus order)

| Order | Form | Why now | Official blank status |
|---|---|---|---|
| 1 | **FAM-PD #7-5** Appearance Memo | Live Aug 7, 2026 JCC track; due ≥2 days before conference | Archived from KB FAM-PD #7 PDF (2024-01), pages 30–32 |
| 2 | **Form 10-3** Draft Order | Supports JCC / interim relief package; clause bank exists privately | Extracted from KB Application Without Notice Guide (2025-05), page 8 |
| 3 | **FAM-PD #7-2** Request for JCC | Draft inserts exist; prior request withdrawn — fill carefully, do not refile blindly | Archived from same PD #7 PDF, pages 15–19 |
| 4 | **Form 15-8B** / **Form 12-3** | Service proofs when serving a package | Kit catalogs exist; official blanks still to archive |
| later | Forms 15-47 / 15-49 / 15-52 | Disclosure / property / notice tracks | Not in current Kit #3J snapshot — blockers, not inventable |

## Explicitly out of litmus order

- FAM-PD #7-3 Joint Request (not this case posture)
- FAM-PD #7-4 Notice of JCC (**court-issued**; never generate as a party filing)
- Form 10-3 Child Support Order variant unless support wording is confirmed needed
- Kit forms not applicable to the Aug 7 Appearance Memo package

## Fill rules

1. Overlay onto the archived official blank. Do not redesign the form.
2. Bind every filled glyph to a catalog `line_item_id` or an explicit `unknown` / `human_only` placement.
3. Leave signature lines blank for wet-ink / human signing unless a separate signed artifact is approved.
4. Never invent time, location, request/draft-order dates, address, phone, consent, or related-proceeding facts.
5. Mark drafts `DRAFT — VERIFY BEFORE FILING` in long-text fields when the answer itself is draft.
6. Output filled PDFs only under `data/private/filled-packages/` (gitignored) or the private case repo after owner approval.

## Artifact locations

- PD #7 archive: `sources/official-blanks/fam-pd-7/2024-01-10/`
- Form 10-3 archive: `sources/official-blanks/form-10-3/2025-05-16/`
- Field maps: `forms/fill-maps/`
- Fill tool: `scripts/form-fill/fill_official_blank.py`

## Success for litmus #1

A filled `#7-5` PDF exists privately, matches the official blank layout, shows known caption/schedule/position answers, leaves unknowns blank or explicitly marked, and does not claim court readiness.
