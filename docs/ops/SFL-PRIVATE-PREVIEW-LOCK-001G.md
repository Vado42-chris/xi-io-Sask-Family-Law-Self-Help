# SFL-PRIVATE-PREVIEW-LOCK-001G

Status: `implemented for local preview only`  
Date: `2026-07-23`  
Branch: `feat/synthetic-legal-workbench-001`  
Parent review: PR #5 peer review required corrections

## Purpose

Close the unsafe private-runtime exposure identified in review: the preview server must not serve arbitrary files under `data/private/` as static resources, and private mode must remain loopback-only.

## Controls now enforced

1. Static routes for `/data/private` and `/data/private/*` return 404.
2. Private matter is available only through `GET /api/local/matter`.
3. That endpoint returns a schema-validated, allowlisted projection.
4. If `data/private/matter.json` exists and `HOST` is not loopback (`127.0.0.1`, `localhost`, `::1`), startup hard-fails.
5. The browser loads private matter only from `/api/local/matter`.
6. Private answers are not written to synthetic `localStorage`.
7. A visible local-lock banner is shown in private mode.
8. A 30-minute idle timeout clears in-memory private answers.

## Still not production-ready

- No authentication beyond local process ownership
- No encrypted vault
- No multi-user isolation
- No formal session store
- Court readiness remains blocked

## Related UX pass

The same correction pass also starts progressive disclosure:

- default queue tab is `Today`
- Today card answers where / next / time / blockers without leading with raw blocker counts
- inspector audit metadata is collapsed behind `Source and audit details`
