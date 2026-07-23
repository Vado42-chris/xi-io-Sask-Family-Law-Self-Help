# Peer review request — court-faithful litmus + workbench fill path

Status: ready for independent peer review  
Branch: `feat/synthetic-legal-workbench-001`  
Date: 2026-07-23  
Author agent: Cursor Auto  
Reviewer target: ChatGPT / human source peer

## Scope of this review

Review the **public** artifacts on this branch that implement official-blank archival and coordinate-overlay filling for case-relevant Kit / PD #7 forms. Private filled PDFs and real matter answers are **not** in this repository (`data/private/` is gitignored) and cannot be reviewed via GitHub.

## What changed (public)

### Official blank archive
- `sources/official-blanks/fam-pd-7/2024-01-10/` — full KB FAM-PD #7 PDF + sliced blanks `#7-1` … `#7-5` + `source-manifest.json`
- `sources/official-blanks/form-10-3/2025-05-16/` — Form 10-3 page extracted from official Application Without Notice guide + manifest

### Fill pipeline
- `scripts/form-fill/fill_official_blank.py` — overlay answers onto archived blanks (ReportLab + pypdf)
- `forms/fill-maps/schema.json` — placement schema notes
- `forms/fill-maps/fam-pd-7-5.fill-map.json`
- `forms/fill-maps/form-10-3-draft-order.fill-map.json`
- `forms/fill-maps/fam-pd-7-2.fill-map.json`

### Product / UX honesty
- `docs/ops/SFL-COURT-FAITHFUL-LITMUS-001.md` — case-relevant form priority and fill rules
- `public/src/legal-workbench.js` — page preview footer clarifies structural-only (not official blank)
- `scripts/serve-preview.mjs` — can serve local private matter path when present (path only; no committed private data)
- Wizard / applicability / fixture completeness hardening under `public/src/` and `scripts/check-*.mjs`
- `public/data/fixtures/synthetic-matter-complete.json` — fictional complete fixture for checks

### Ledgers / index
- `docs/INDEX.md`
- `project-tracking/open-work-ledger.md` (`SFL-WORK-025`)
- `project-tracking/agent-run-ledger.md`

## Explicit non-goals / must not approve as ready

1. Structural completeness ≠ legal correctness or court readiness.
2. Overlay drafts are not filing-ready.
3. FAM-PD `#7-4` must never be generated as a party filing (court-issued).
4. FAM-PD `#7-2` litmus fill is reconstruction only when a prior request was withdrawn and a conference is already scheduled — do not treat as ready to file.
5. Form 10-3 blank still carries guide footer “Page 8 of 8”; prefer Publications Saskatchewan standalone blank when available.
6. Real answers, filled private PDFs, and QA screenshots are local-only.

## Peer review checklist

### Provenance
- [ ] Confirm FAM-PD #7 PDF URL, SHA-256 in `source-manifest.json`, and page slices for `#7-2` / `#7-5` match the official PDF.
- [ ] Confirm Form 10-3 extraction source and whether a better official editable blank should replace the guide page.
- [ ] Confirm AcroForm absence → coordinate overlay is the correct approach for these PDFs.

### Fill-map correctness
- [ ] Spot-check `#7-5` placements against blank geometry (caption, schedule, checkboxes, execution, contact).
- [ ] Spot-check `#7-2` caption + request-type checkboxes; note incomplete line-item coverage vs 71-item catalog.
- [ ] Spot-check Form 10-3 Applicant/Respondent vs Kit catalog Petitioner/Respondent labeling discrepancy.
- [ ] Confirm unknown / court-only / signature fields stay blank by design.
- [ ] Confirm overflow handling (`filled_with_overflow`) is visible and blocking for filing.

### Safety / privacy
- [ ] No real party names, file numbers, emails, addresses, or completed forms in the public diff.
- [ ] `data/private/` remains ignored.
- [ ] Preview server private-path support cannot leak secrets into the public tree.

### Product rules
- [ ] Litmus order ( `#7-5` → `10-3` → `#7-2` → service forms ) matches live case needs without expanding to irrelevant forms first.
- [ ] UI still distinguishes structural preview from court-faithful PDF output.
- [ ] Source gate `SFL-SOURCE-REVIEW-002` remains open; this track does not close it.

## Suggested review commands

```bash
npm run check
python3 scripts/form-fill/fill_official_blank.py --help
# Optional local-only (requires private matter file; do not commit output):
# python3 scripts/form-fill/fill_official_blank.py \
#   --fill-map forms/fill-maps/fam-pd-7-5.fill-map.json \
#   --matter data/private/matter.json \
#   --out /tmp/fam-pd-7-5-overlay-test.pdf
```

## Author known gaps for reviewer focus

1. `#7-5` long-text fields overflow printed lines; needs shorter answers or continuation schedule before filing.
2. `#7-5` still depends on Notice fields (time/location, request/draft-order dates) that must not be invented.
3. `#7-2` fill map covers a subset of catalog line items.
4. Service forms `15-8B` / `12-3` official blanks not yet archived in this track.
5. No automated visual regression of overlay coordinates yet (manual `pdftoppm` QA only, private).

## Requested reviewer output

Please return:
1. Approve / approve-with-nits / reject for each checklist section.
2. Any incorrect coordinates, wrong blank pages, or provenance defects.
3. Any privacy or court-readiness overclaim.
4. Next public commit recommended before service-form litmus.
