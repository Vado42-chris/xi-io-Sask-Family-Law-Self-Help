# SFL-OWNER-CORRECTION-WORKBENCH-RECOVERY-001M

Status: in progress  
Date: 2026-07-23  
Branch: `feat/synthetic-legal-workbench-001`  
Related: [PR #5 owner correction](https://github.com/Vado42-chris/xi-io-Sask-Family-Law-Self-Help/pull/5#issuecomment-5055048193)

## Correction accepted

The standalone Continue-first `/app` wizard was the wrong interpretation of progressive disclosure. The owner-approved architecture remains an Inbox-derived legal workbench:

```text
Matter rail
  → Progressive work queue
  → Selected form/document workspace
  → Contextual Ibal assistance
```

Progressive disclosure changes what is visible first. It does not remove Forms, Evidence, Messages, Tasks, Activity, Review, Packages, or Ingress.

## Recovery actions in this slice

1. `/` and `/app` serve `public/index.html` (Inbox workbench) again.
2. FAM-PD #7-5 interview architecture proof moved to `/interview-proof` (secondary only).
3. Scope rail restored: My case, Forms, Evidence, Messages, Tasks, Activity, Ingress, Review, Packages.
4. Today card continues in-place into the selected form; no “Continue in guided app” replacement CTA.
5. Form queue rows expose why needed, progress, missing items, source freshness, due label, and next action.
6. Private unlock happens inside the workbench and hydrates answers, tasks, correspondence, activity, and `ingress_reconciliation`.
7. Ingress route shows mapped / incomplete / disputed / unmapped reconciliation.
8. Assertion, binding, presentation, unlock, and loopback privacy controls remain backend under the workbench.
9. Checks and README updated so `/app` means workbench, not wizard.

## What remains blocked

- `SFL-SOURCE-REVIEW-002` (267-item source review)
- Owner presentation approvals (ledger remains empty; no fabricated approvals)
- Court readiness / any transmission
- Merge of PR #5 until the owner sees private matter context and form inventory in the restored shell

## Verification commands

```bash
npm run check:preview
npm run check
npm run preview
# then unlock private matter on loopback /app and open Forms + Ingress
```

## Risk

Medium. Recovery restores the correct shell, but private litmus and source review remain open. Do not claim product completeness.
