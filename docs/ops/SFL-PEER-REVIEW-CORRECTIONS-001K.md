# SFL-PEER-REVIEW-CORRECTIONS-001K

Status: `corrections implemented; still not owner-ready; keep PR draft`  
Date: `2026-07-23`  
Base review target: `5ad527d`  
Branch: `feat/synthetic-legal-workbench-001`

## Peer-review verdict accepted

Architecture direction remains approved. Prior implementation was not a valid proof. This pass corrects the P0 falsifications and connects a deterministic runtime path without claiming owner approval or court readiness.

## P0 corrections

1. **Approvals revoked** — all FAM-PD #7-5 presentation records are `agent_draft` / `draft` with `pending` legal/UX/accessibility axes, null reviewers, null receipt IDs, and `source_binding: unchecked`.
2. **Receipt ledger** — `project-tracking/approval-receipts/ledger.json` is empty and append-only. Eligibility requires a matching ledger receipt.
3. **Private persistence** — private answers are memory-only. Practice persistence is namespaced by fixture + snapshot + form. `Lock now` clears private memory and unlock cookie.
4. **Opaque `/api/app`** — user payloads use `step_token`, prompts (only when eligible), explanations, guidance, and input schema labels/controls. No fact IDs, line-item IDs, hashes, or binding IDs.
5. **Exact court wording** — returns catalog `source_label` text for the step’s fields.
6. **Runtime path** — `scripts/lib/assertion-runtime.mjs` creates typed assertions, applies transforms, and projects form values. Proven by integrity check and `/dev` draft proof UI.
7. **Orphans fixed** — every `asked_directly` / `grouped_into_step` disposition resolves into typed step fields with bindings (including dates, reserved justice, updated-memo fields, fax).
8. **Geometry** — Playwright browser tests measure scroll, mobile one-pane, focus restore, 200% zoom, and emit screenshots under `test-results/screenshots/`.

## Still blocked / honest gaps

- No presentation is User-mode eligible until owner records ledger approvals.
- `/app` therefore fail-closes guided wording (by design).
- Track A human PDF compare remains required.
- Court readiness and merge approval remain blocked.
- Keep PR #5 draft.

## Commands

```bash
npm run check
npm run preview
# User: http://127.0.0.1:4173/app
# Dev architecture proof: http://127.0.0.1:4173/dev
```
