# Privacy and Data Boundary v1

Status: `mandatory design contract, implementation not started`  
Risk: `legal_medical_sensitive`

## Public repository boundary

Allowed:

- blank workflow definitions,
- public source metadata,
- schemas,
- synthetic fixtures,
- non-sensitive screenshots,
- validation logs without user data,
- governance and review receipts.

Forbidden:

- completed forms,
- names, addresses, phone numbers, emails, signatures, court file numbers,
- tax and income records,
- bank, debt, property, pension, benefit, or employment documents,
- medical information,
- child names or birthdates,
- correspondence, police, criminal, protection-order, or Child and Family Services records,
- private legal strategy,
- model prompts or logs containing a real matter.

## Private matter workspace requirements

Before real user data is accepted, the product requires approved decisions and evidence for:

- isolation between matters and users,
- encryption in transit and at rest,
- key ownership and recovery,
- least-privilege access,
- session and device security,
- upload scanning and file-type controls,
- retention and user-directed deletion,
- backups and deletion propagation,
- redacted logs and support access,
- export portability,
- incident response,
- provider and jurisdiction disclosure.

## AI boundary

AI processing is off by default for real matters until a provider contract and consent flow exist. Consent must identify the data sent, purpose, provider family, location where known, retention, training or reuse terms, cost, fallback, and how to disable AI. A user must be able to complete the core flow without AI.

## Analytics boundary

Do not send form answers, free text, document names, case metadata, workflow selections, or error payloads containing matter data to analytics. Product analytics, if later approved, must use coarse, privacy-preserving events and remain optional where required.

## Egress boundary

Exporting a package is distinct from sending it. Every future transmission must show the exact recipient, channel, attachments, purpose, legal or procedural basis, unresolved warnings, and approval record. The system must never infer that an email address permits service or filing.

## Data minimization

Ask only what the active workflow needs. Delay high-risk questions until the user understands why the information is required. Permit users to mark an answer unknown and continue to a visible blocker rather than forcing fabrication.
