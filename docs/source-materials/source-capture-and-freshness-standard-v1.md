# Source Capture and Freshness Standard v1

Status: `active project standard, runtime not implemented`  
Date: 2026-07-22  
Project: `sask_family_law_self_help`

## Purpose

This standard defines how official legal forms, self-help kits, practice directives, filing instructions, and court contact records become governed source snapshots before product implementation.

The application must never treat a live web page, an AI recollection, a chat summary, or an undated form transcription as sufficient procedural truth.

## Source layers

Each governed source has four distinct layers:

1. **Original source artifact**: the exact downloaded or supplied file, preserved without editing where tooling permits.
2. **Source identity record**: title, jurisdiction, source date, capture date, URL, hash, size, authority state, and supersession state.
3. **Normalized catalog**: form inventory, page ranges, line items, conditional choices, court-only fields, signatures, attachments, and recorded discrepancies.
4. **Runtime projection**: the questions, previews, warnings, and exports generated from an approved normalized catalog.

A derived layer never replaces the original source evidence.

## Required snapshot identity

Every snapshot must record:

- stable `snapshot_id`,
- source title and filename,
- source or revision date printed in the artifact,
- exact UTC capture timestamp,
- source URL where known,
- SHA-256 of the supplied or downloaded artifact,
- file size and reported page count,
- authority state,
- freshness state,
- official verification state,
- source discrepancies,
- dependent form and workflow catalogs,
- superseded and superseding snapshot IDs.

Unknown values must be explicit. They must not be omitted or rendered as verified.

## Freshness states

Allowed initial states are:

- `captured_unverified_current`: immutable capture exists, but no official comparison proves it is still current,
- `officially_verified_current`: the snapshot was compared with the current official source and no relevant difference was found,
- `changed_review_required`: a newer or different official artifact was found,
- `stale_blocked`: the source is known to be outdated and final-ready output is blocked,
- `official_source_unavailable`: the official source could not be reached or identified,
- `superseded`: a later approved snapshot replaced it,
- `unknown`: evidence is insufficient.

A capture date does not prove freshness. A source can be immutable and stale at the same time.

## User-facing date disclosure

Every workflow start screen, form workspace, preview, and final package screen must display:

- **Form source date**, for example `March 30, 2026`,
- **Captured by this application**, for example `July 22, 2026`,
- **Freshness state**, in plain language,
- **Last official verification date**, or `Not yet verified`,
- a visible warning when the snapshot is not `officially_verified_current`.

Suggested wording for the first snapshot:

> This workflow was captured from Kit #3J dated March 30, 2026, on July 22, 2026. It has not yet been independently verified against the current official court download. Review current court requirements before filing or serving documents.

The user must not need to open an About page to find this information.

## Form completeness rule

For every form physically present in a snapshot, the catalog must capture:

- all headings needed to identify the proceeding,
- every blank, question, checkbox, choice, date, amount, contact field, and signature field,
- every repeatable row or clause,
- every conditional follow-up,
- every attachment or exhibit requirement,
- fields completed by the user, another party, a commissioner, or the court,
- source page range,
- exact or faithful source label,
- stable line-item identifier,
- required, optional, conditional, display-only, or court-only status.

Forms referenced but absent must remain explicit gaps. They must not be reconstructed from memory or silently treated as captured.

## Discrepancy rule

A typo, conflict, ambiguous instruction, or difference between the kit and an embedded form must be recorded as a source discrepancy. The normalized catalog may choose a working value only when the basis is recorded. The original wording must remain inspectable.

A discrepancy affecting filing, service, signatures, deadlines, recipients, or evidence must block final-ready implementation until reviewed.

## Immutability and supersession

Published snapshots are append-only. A later source creates a new snapshot directory and registry entry. It does not overwrite the prior snapshot.

A supersession record must identify:

- old and new snapshot IDs,
- changed forms and line items,
- procedural or contact changes,
- workflows affected,
- migration or invalidation action,
- reviewer and approval evidence.

Existing user matters must retain the snapshot ID used when they were created and must receive a warning when that snapshot becomes stale.

## Validation gate

Before runtime implementation uses a form catalog:

1. all included forms must be indexed,
2. every indexed form must have a line-item catalog,
3. line-item IDs must be unique within each form,
4. form and catalog hashes must point to the same snapshot,
5. source date and capture date must be present,
6. missing companion forms must be listed,
7. discrepancies must be visible,
8. a human source review must approve the transcription.

A passing structural check proves catalog consistency, not legal correctness or currentness.

## Automation roadmap

Future freshness automation may monitor official source URLs, headers, file hashes, publication metadata, or page changes. Automated detection may create a review event, but it must not silently replace an approved source snapshot or update legal workflow rules.

The required sequence is:

```text
scheduled source check
  -> candidate change detected
  -> immutable candidate capture
  -> form and line-item diff
  -> legal-content review
  -> approval
  -> new current snapshot
  -> dependent workflow migration or stale block
  -> receipt
```

## Current project application

The first governed snapshot is `jcc-kit-3j-2026-03-30`, captured on 2026-07-22. It contains six forms physically present in the supplied 45-page kit. Companion forms named but absent remain explicit gaps.
