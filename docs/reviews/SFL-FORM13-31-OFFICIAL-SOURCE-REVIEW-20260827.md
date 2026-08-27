# SFL-FORM13-31-OFFICIAL-SOURCE-REVIEW-20260827

Status: `PASS_BOUNDED / NOT CANONICAL / NOT RUNTIME-ADMISSIBLE`  
Gate: `SFL-SOURCE-REVIEW-002`  
Source family candidate: `form-13-31-affidavit`  
Private matter data: `0`

## Why this slice exists

A registered downstream affidavit workflow requires Form 13-31, while the active source-review denominator did not contain a current official Form 13-31 source record. Kit #4a contains a historical Form 13-31 instance, but that kit remains unreviewed intake and cannot be silently promoted by form number alone.

This slice adds current official-source evidence without importing any private matter facts or granting filing/transmission authority.

## Official source readback

### Form surface

Official Court source: `Guide to Affidavits in Court of King's Bench 2025`  
URL: https://sasklawcourts.ca/wp-content/uploads/2025/05/KB_Affidavit-Guide.pdf  
Verified: `2026-08-27`

The guide identifies Form 13-31 as the general-use affidavit form and reproduces the form on page 5. A first rendered-page review was completed against that official page. The stable form catalog contains 23 line items covering the heading/style-of-cause fields, deponent identity/residence/capacity, oath-or-affirmation clause, repeatable consecutively numbered fact paragraphs, jurat, deponent signature and oath-taker signature/capacity.

### Rule surface

Official rules source: `Part 13: Technical Rules`  
URL: https://pubsaskdev.blob.core.windows.net/pubsask-prod/77671/14Part13.pdf  
Verified: `2026-08-27`

Rule 13-31 was read from the official rules source and normalized into 12 stable requirements: rule 13-20 dependency; Form 13-31 identity; style-of-cause/deponent name; residence; first person; consecutive paragraphs; swearing/affirming and signature requirements; jurat; oath-taker signature; Saskatchewan oath-taker authority; pre-commencement validity; and the costs consequence for substantial departure.

## Cross-snapshot disposition

The existing `kit-4a-2023-04-10` intake states that Form 13-31 is physically included on printed pages 15-18, but its form catalog is still pending. Relationship to the current official source is therefore:

`candidate_equivalent_unverified`

No cross-snapshot deduplication or runtime reuse is authorized by this receipt.

## Qualification matrix

| Dimension | State |
| --- | --- |
| Official source identity | PASS_BOUNDED |
| Current official URL/provider readback | PASS_BOUNDED @ 2026-08-27 |
| Form text capture | PASS_BOUNDED |
| Rule 13-31 binding | PASS_BOUNDED |
| Stable form line-item denominator | 23/23 captured |
| Stable rule requirement denominator | 12/12 captured |
| First rendered-page review | PASS_BOUNDED |
| Exact official PDF bytes archived in Git | BLOCKED_PROVIDER_SURFACE |
| Exact official PDF SHA-256/byte size | UNKNOWN until byte custody |
| Independent second reviewer | OPEN |
| Human/delegated source approval | OPEN |
| Canonical source promotion | BLOCKED |
| Runtime admissibility | BLOCKED |
| Filing/service/transmission authority | NONE |

## Fail-closed boundary

The worker surface used for this slice can inspect the official PDFs and rendered Form 13-31 page, but cannot retrieve the exact PDF bytes into repository custody. A screenshot or normalized transcript must not be hashed and misrepresented as the official source binary.

Therefore:

`SOURCE REVIEW PROGRESS != CANONICAL ADMISSION`

`OFFICIAL WEB READBACK != EXACT BINARY ARCHIVE`

`FORM NUMBER MATCH != CROSS-SNAPSHOT EQUIVALENCE`

`FORM CAPTURE != AUTHORITY TO SIGN / SWEAR / SERVE / FILE / SEND`

## Required next return

1. archive the exact official Form 13-31/Affidavit Guide and Part 13 source bytes through a custody-capable surface;
2. record exact SHA-256, byte size, media type and capture timestamp;
3. independently review the rendered official form and the 23-item/12-requirement catalogs;
4. compare the Kit #4a Form 13-31 instance to the current official source and disposition equivalence;
5. obtain owner or delegated qualified source-review approval;
6. only then consider canonical multi-kit source-family promotion.
