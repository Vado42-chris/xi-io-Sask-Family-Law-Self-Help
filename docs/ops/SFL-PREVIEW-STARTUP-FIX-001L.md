# SFL-PREVIEW-STARTUP-FIX-001L

Status: `implemented; PR remains draft`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`

## Verified failure mode

1. CI run #53 failed because `npm run check` required AJV/Playwright packages without `npm ci`.
2. Committed `test-results/screenshots/app-proof.json` recorded `git_head: 5ad527d` while branch head was `30a54c9`.
3. Preview server previously read ambient `HOST`. With private `data/private/matter.json` present, environments that set `HOST=0.0.0.0` refused to start even for local owner review.
4. `postinstall` ran `npx playwright install chromium` on every `npm install`, which is unnecessary for ordinary app launch and can stall CI/local setup.
5. `package.json` was `0.1.0-preview.8` while `package-lock.json` still said `0.1.0-preview.7`.

## Resolution

| Issue | Fix |
|---|---|
| Ambient `HOST` | Preview binds via `SFL_HOST` only; default `127.0.0.1`; ambient `HOST` ignored |
| Port conflicts | Explicit `EADDRINUSE` message with `PORT=4174` retry guidance |
| Dependencies | `npm ci` in CI; lockfile regenerated for preview.8 |
| Playwright | Removed from `postinstall`; use `npm run playwright:install` |
| CI shape | Job 1: `npm ci` + `npm run check`; Job 2: Playwright install + `check:browser-proof` |
| Stale screenshots | `check:app-proof-head` fails unless `app-proof.json.git_head === HEAD` |

## Local acceptance command

```bash
pkill -f 'scripts/serve-preview.mjs' || true
HOST=0.0.0.0 SFL_HOST=127.0.0.1 PORT=4173 npm run preview
# open http://127.0.0.1:4173/app
```

Expected: unlock/practice gate or fail-closed blocked question. Not blank, not connection refused, not crash.

## Still blocked

- Owner presentation approvals
- Court readiness
- Merge / owner acceptance
