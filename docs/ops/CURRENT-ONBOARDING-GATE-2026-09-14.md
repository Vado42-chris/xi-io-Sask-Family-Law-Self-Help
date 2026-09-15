# SAM_LAW current onboarding gate — 2026-09-14

Status: **CURRENT DEADLINE OVERRIDE**

This file overrides stale August recovery work-selection text when workers onboard for current SAM_LAW research/support work. Historical recovery documents remain evidence only.

## Deadline target

Owner deadline: Wednesday morning for draft/tab preparation. Current work is research/support only unless a separate effect-specific authority explicitly says otherwise.

## Mandatory beginning gate

Every worker/sub-agent must do all of the following before selecting work:

1. Re-read repository `main` and record exact current SHA.
2. Read this file before historical recovery plans.
3. Re-read current source-kit/self-help evidence and current owner arguments before research.
4. Resolve current form/source-family mapping for Kit #2a, Kit #3J, Kit #4a, Form 15-52, and any other source actually used.
5. Re-baseline tools/registries instead of trusting prior chat state.
6. Use real durable work/event identity. DataForge event IDs and ACK IDs must be UUIDs; human-readable labels are aliases only.
7. Use BINS custody for durable research/evidence work packets before downstream projections.
8. Treat Bugzilla and dotProject as projections/verification surfaces, not canonical identity owners.
9. Refresh the ACK/currentness check every loop. A previous loop's PASS does not carry forward automatically.

## Current work priorities

Priority order for deadline support:

1. Targeted Saskatchewan/Canadian case-law research, including CanLII authority directly relevant to the current Hallberg v Andersen arguments.
2. Disability/accommodation law research where relevant to the actual requested relief, evidence, court process, or communication/accessibility issues.
3. Map each useful authority/argument/evidence item to the exact court form, tab, affidavit/supporting-evidence need, or procedural step it supports.
4. Identify missing sworn-evidence requirements and low-cost ways to prove them.
5. Build durable research packets that another worker can continue without owner restatement.
6. Dogfood the current CRM/BINS/DataForge/Bugzilla/dotProject structures where they are actually available; do not invent successful provider/runtime readback.

## Research-only / effect ceiling

```text
LIVE EMAIL SEND = FORBIDDEN
COURT / COUNSEL / MEDIATOR TRANSMISSION = FORBIDDEN
PORTAL / FILING / SERVICE EFFECT = FORBIDDEN
PROVIDER MUTATION = FORBIDDEN unless separately and explicitly admitted
USER-DATA DISCLOSURE = FORBIDDEN
RESEARCH / LOCAL DURABLE CUSTODY / READ-ONLY SOURCE RETRIEVAL = ALLOWED when otherwise qualified
```

No worker may send a real email, file a document, contact opposing counsel, contact the court, mutate a provider, or expose private case material merely because the research is time-sensitive.

## Required durable event spine

For each material work item:

```text
root_uuid
work_uuid
event_uuid
attempt_uuid
ack_uuid
correlation_uuid
source_ref/source_hash
project/client/docket refs when applicable
BINS custody ref
currentness generation
blocked_by / dependencies
next action
result / return / apply_return state
```

Canonical UUID identity must not be replaced by a Bugzilla bug number, dotProject task ID, GitHub issue number, email/message ID, Slack timestamp, or human-readable label. Provider/native IDs are provider refs only.

## /babysit and runner behavior

`/babysit` is a conductor/watchdog, not authority. On server-time cadence it may:

- refresh current-main/current-source readback;
- scan admitted hot folders;
- evaluate detonators;
- refresh active runner work packets;
- emit WAKE_ONLY internal AI-mail/CRM events;
- surface starvation/dependency/deadline pressure;
- re-ACK each loop.

It may not silently grant provider/court/email/legal effect authority.

## Required loop report

Every non-terminal loop must report:

```text
CURRENT_MAIN_SHA
ROOT/WORK/EVENT UUIDS
WHAT_CHANGED_SINCE_LAST_LOOP
ARGUMENT / FORM / TAB / EVIDENCE TARGET
SOURCE REFS
BINS CUSTODY STATE
BUGZILLA / DOTPROJECT PROJECTION STATE
BLOCKERS
BACKBEAT_CHECK
FORWARD_CHECK
EFFECTS = email:0 portal:0 provider:0 user_data:0 unless separately admitted
```

A worker that cannot produce these fields is not onboarded for current deadline work.

## Stale recovery text

Any August-era text that says the active work is still PR #6 / `SFL-RECOVERY-CLOSEOUT-001` is historical and must not select current work. PR #6 merged on 2026-08-12. Re-read current `main` and this gate before continuing.
