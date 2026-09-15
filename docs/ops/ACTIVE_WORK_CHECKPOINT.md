# Active Work Checkpoint — sam_law

Status: `CURRENT / DEADLINE RESEARCH BURN / 2026-09-14 22:58 CST`

This file is the first work-selection stop for every SAM_LAW worker. It supersedes the August PR #6 recovery checkpoint for current work selection. Historical recovery plans remain evidence only.

Current mandatory onboarding gate:

`docs/ops/CURRENT-ONBOARDING-GATE-2026-09-14.md`

```yaml
repo_full_name: Vado42-chris/xi-io-Sask-Family-Law-Self-Help
product_lane: sam_law / Saskatchewan family-law self-help
accepted_repository_truth: main
current_program: WEDNESDAY_CANLII_FORM_TAB_RESEARCH_BURN_2026_09_14
current_effect_ceiling: RESEARCH_LOCAL_DURABLE_CUSTODY_ONLY
current_operator: owner-directed multi-agent research lane
current_deadline: Wednesday morning draft/tab preparation
required_beginning_gate:
  - read current main and record exact SHA
  - read CURRENT-ONBOARDING-GATE-2026-09-14.md
  - rebaseline tools/registries; do not trust stale chat state
  - bind real UUID root/work/event/attempt/ack/correlation identities
  - bind exact source-kit/form family before legal research is used
  - refresh ACK/currentness every loop
current_priority_order:
  - targeted CanLII / Saskatchewan / Canadian case-law research tied to actual case arguments
  - disability/accommodation law research where materially relevant
  - map authority -> argument -> form -> tab -> evidence/sworn-proof requirement
  - identify missing evidence and lowest-cost adequate proof
  - store durable work packets in BINS/DataForge-compatible structures
  - project durable work to Bugzilla/dotProject only when those runtimes are actually qualified
mandatory_source_families:
  - Kit #2a Answer and Counter-Petition
  - Kit #3J Judicial Case Conference
  - Kit #4a Replying to a Court Application
  - Form 15-52 Notice to Disclose
  - any additional source actually relied upon
hard_effect_stops:
  - NO live email
  - NO court/counsel/mediator transmission
  - NO filing/service/portal mutation
  - NO provider mutation without separate effect-specific admission
  - NO private case-data disclosure
hard_currentness:
  - PR #6 merged 2026-08-12; it is not current work
  - SFL-RECOVERY-CLOSEOUT-001 is historical, not active
  - previous-loop PASS does not carry forward
  - COMMENT != MAIN
  - RESULT != RETURN != APPLY_RETURN
  - BUG_FOUND != BUGZILLA_PROJECTED
  - BUGZILLA_PROJECTED != DOTPROJECT_VERIFIED
  - canonical DataForge UUID != provider/native ID
required_loop_output:
  - CURRENT_MAIN_SHA
  - ROOT/WORK/EVENT UUIDs
  - WHAT_CHANGED_SINCE_LAST_LOOP
  - ARGUMENT / FORM / TAB / EVIDENCE TARGET
  - SOURCE REFS
  - BINS CUSTODY STATE
  - BUGZILLA / DOTPROJECT PROJECTION STATE
  - BLOCKERS
  - BACKBEAT_CHECK
  - FORWARD_CHECK
  - effects email:0 portal:0 provider:0 user_data:0 unless separately admitted
babysit_contract:
  role: conductor / starvation watchdog / currentness refresher
  cadence: server-time scheduled batches
  may:
    - scan admitted hot folders
    - evaluate detonators
    - refresh runner packets
    - emit WAKE_ONLY internal AI-mail/CRM events
    - re-ACK currentness each loop
  may_not:
    - grant legal/provider/email effect authority
    - fabricate runtime/provider readback
    - skip BINS/DataForge durability for material work
```

## Stale checkpoint disposition

The previous contents of this file described PR #6 / `SFL-RECOVERY-CLOSEOUT-001` as active. That state is obsolete: PR #6 merged on 2026-08-12. Any worker selecting PR #6 closeout as current work is incorrectly onboarded.

## Current next action

Research workers should consume the current owner argument set and authoritative sources, produce directly relevant CanLII/case-law findings, and map each result to the exact form/tab/evidence target it supports. Durable work must be stored with real UUID identity and BINS/DataForge-compatible custody before downstream Bugzilla/dotProject projection.

No worker should wait for owner restatement when the next step is machine-resolvable from current source, current main, the deadline, and this checkpoint.
