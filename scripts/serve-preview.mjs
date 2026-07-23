#!/usr/bin/env node

/**
 * Local preview server.
 *
 * Public assets are served from /public.
 * Private matter is never exposed as a static directory.
 * Presence of data/private/matter.json does NOT auto-load case data.
 * Private projection requires explicit unlock on loopback only.
 */

import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { extname, resolve, sep } from "node:path";
import process from "node:process";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const requestedHost = process.env.HOST || "127.0.0.1";
const PRIVATE_MATTER_PATH = resolve(root, "data/private/matter.json");
const SNAPSHOT = "jcc-kit-3j/2026-03-30";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

/** @type {Map<string, { unlockedAt: number, route: string }>} */
const unlockSessions = new Map();
const UNLOCK_TTL_MS = 30 * 60 * 1000;

const CAPABILITY_PROJECTIONS = {
  "/app": {
    route: "/app",
    may_receive: [
      "user_safe_questions",
      "answers_after_unlock_choice",
      "progress",
      "help",
      "approved_presentation",
      "interview_steps",
      "workflow_progress_summary"
    ],
    private_unlock_required: true,
    production_enabled: true
  },
  "/source-review": {
    route: "/source-review",
    may_receive: ["public_blanks", "catalogs", "review_records", "bindings", "presentation_drafts"],
    private_unlock_required: false,
    production_enabled: true
  },
  "/dev": {
    route: "/dev",
    may_receive: ["synthetic_diagnostics"],
    private_unlock_required: false,
    production_enabled: false
  },
  "/matter-review": {
    route: "/matter-review",
    may_receive: ["private_projection_after_authorization"],
    private_unlock_required: true,
    production_enabled: false
  }
};

function isLoopbackHost(host) {
  return LOOPBACK_HOSTS.has(String(host || "").toLowerCase());
}

function privateMatterPresent() {
  return existsSync(PRIVATE_MATTER_PATH) && statSync(PRIVATE_MATTER_PATH).isFile();
}

function assertPrivateHostPolicy() {
  if (!privateMatterPresent()) return;
  if (!isLoopbackHost(requestedHost)) {
    console.error(
      [
        "Refusing to start: private matter.json is present but HOST is not loopback-only.",
        `HOST=${requestedHost}`,
        "Use HOST=127.0.0.1 (default) or remove/relocate the private matter sidecar."
      ].join("\n")
    );
    process.exit(1);
  }
}

function purgeExpiredUnlocks() {
  const now = Date.now();
  for (const [token, session] of unlockSessions.entries()) {
    if (now - session.unlockedAt > UNLOCK_TTL_MS) unlockSessions.delete(token);
  }
}

function parseCookies(header) {
  const out = {};
  for (const part of String(header || "").split(";")) {
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  }
  return out;
}

function unlockTokenFromRequest(request) {
  const header = request.headers["x-private-unlock"];
  if (typeof header === "string" && header.trim()) return header.trim();
  const cookies = parseCookies(request.headers.cookie);
  return cookies.sfl_private_unlock || null;
}

function isUnlocked(request) {
  purgeExpiredUnlocks();
  const token = unlockTokenFromRequest(request);
  if (!token) return false;
  const session = unlockSessions.get(token);
  if (!session) return false;
  session.unlockedAt = Date.now();
  return true;
}

function candidatePaths(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  let requested = decoded === "/" ? "/public/app/index.html" : decoded;

  if (requested === "/app" || requested === "/app/") requested = "/public/app/index.html";
  if (requested === "/source-review" || requested === "/source-review/") {
    requested = "/public/source-review/index.html";
  }
  if (requested === "/dev" || requested === "/dev/") requested = "/public/dev/index.html";
  if (requested === "/matter-review" || requested === "/matter-review/") {
    requested = "/public/matter-review/index.html";
  }
  if (requested === "/legacy" || requested === "/legacy/") requested = "/public/index.html";

  if (requested === "/data/private" || requested.startsWith("/data/private/")) {
    return [];
  }

  const paths = [requested];

  if (
    requested.startsWith("/styles/") ||
    requested.startsWith("/src/") ||
    requested.startsWith("/data/")
  ) {
    paths.push(`/public${requested}`);
  }

  if (requested.startsWith("/sources/")) {
    paths.push(requested);
  }

  for (const prefix of [
    "/bindings/",
    "/interview/",
    "/presentation/",
    "/workflows/",
    "/matter-definitions/",
    "/docs/schemas/"
  ]) {
    if (requested.startsWith(prefix)) paths.push(requested);
  }

  return paths
    .map((path) => resolve(root, `.${path}`))
    .filter((candidate) => candidate === root || candidate.startsWith(`${root}${sep}`));
}

function safePath(urlPath) {
  for (const candidate of candidatePaths(urlPath)) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function sendJson(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    ...extraHeaders
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

function readBody(request) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolveBody({});
        return;
      }
      try {
        resolveBody(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function projectPrivateMatter(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Private matter must be a JSON object.");
  }
  if (!raw.privacy || typeof raw.privacy !== "object") {
    throw new Error("Private matter requires a privacy object.");
  }
  if (!raw.privacy.classification || typeof raw.privacy.classification !== "string") {
    throw new Error("Private matter requires privacy.classification.");
  }
  if (!raw.answers || typeof raw.answers !== "object" || Array.isArray(raw.answers)) {
    throw new Error("Private matter requires an answers object.");
  }

  return {
    fixture_version: raw.fixture_version ?? null,
    fixture_notice: raw.fixture_notice ?? "Private local matter projection.",
    privacy: {
      classification: raw.privacy.classification,
      storage: raw.privacy.storage ?? "local_gitignored_sidecar",
      commit_forbidden: raw.privacy.commit_forbidden !== false,
      local_lock: true,
      served_via: "/api/local/matter",
      unlock_required: true,
      static_private_paths_disabled: true
    },
    matter: raw.matter && typeof raw.matter === "object" ? raw.matter : {},
    answers: raw.answers,
    unknown_answers: raw.unknown_answers && typeof raw.unknown_answers === "object" ? raw.unknown_answers : {},
    tasks: Array.isArray(raw.tasks) ? raw.tasks : [],
    correspondence: Array.isArray(raw.correspondence) ? raw.correspondence : [],
    activity: Array.isArray(raw.activity) ? raw.activity : []
  };
}

function userModeEligible(presentation) {
  const approvals = presentation.approvals || {};
  const axes = ["legal", "ux", "accessibility"];
  const approved = axes.every((axis) => approvals[axis]?.state === "approved" && approvals[axis]?.receipt_id);
  const bindingCurrent = approvals.source_binding?.state === "current";
  return Boolean(approved && bindingCurrent && presentation.draft_state === "active");
}

function projectAppInterview() {
  const interview = JSON.parse(
    readFileSync(resolve(root, `interview/${SNAPSHOT}/fam-pd-7-5.interview.json`), "utf8")
  );
  const presentationDoc = JSON.parse(
    readFileSync(resolve(root, `presentation/${SNAPSHOT}/fam-pd-7-5.presentation.json`), "utf8")
  );
  const byId = new Map(presentationDoc.presentations.map((item) => [item.presentation_id, item]));
  const workflow = JSON.parse(
    readFileSync(resolve(root, `workflows/${SNAPSHOT}/jcc-appearance-memo-live-track.json`), "utf8")
  );

  const steps = interview.steps
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((step) => {
      const presentation = byId.get(step.presentation_id) || null;
      const eligible = presentation ? userModeEligible(presentation) : false;
      return {
        interaction_step_id: step.interaction_step_id,
        title: step.title,
        order: step.order,
        estimated_minutes: step.order === 10 ? 3 : 5,
        fact_definition_ids: step.fact_definition_ids,
        line_item_ids: step.line_item_ids,
        presentation: eligible
          ? {
              presentation_id: presentation.presentation_id,
              plain_language_prompt: presentation.plain_language_prompt,
              short_explanation: presentation.short_explanation,
              answer_guidance: presentation.answer_guidance,
              official_terms_preserved: presentation.official_terms_preserved,
              locale: presentation.locale
            }
          : null,
        blocked: !eligible,
        blocked_message: eligible
          ? null
          : "This question is not yet available in the guided interview."
      };
    });

  return {
    capability: CAPABILITY_PROJECTIONS["/app"],
    snapshot_id: interview.snapshot_id,
    form_id: interview.form_id,
    workflow: {
      workflow_id: workflow.workflow_id,
      stages: workflow.stages.map((stage) => ({
        stage_id: stage.stage_id,
        title: stage.title,
        blocks_next_if_incomplete: stage.blocks_next_if_incomplete
      }))
    },
    steps,
    next_step_id: steps.find((step) => !step.blocked)?.interaction_step_id || null
  };
}

async function handleUnlockApi(request, response) {
  if (request.method === "DELETE") {
    const token = unlockTokenFromRequest(request);
    if (token) unlockSessions.delete(token);
    sendJson(response, 200, { unlocked: false }, {
      "set-cookie": "sfl_private_unlock=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict"
    });
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { error: "method_not_allowed" });
    return;
  }

  if (!privateMatterPresent()) {
    sendJson(response, 404, { error: "private_matter_absent" });
    return;
  }
  if (!isLoopbackHost(requestedHost)) {
    sendJson(response, 403, { error: "private_matter_requires_loopback" });
    return;
  }

  let body = {};
  try {
    body = await readBody(request);
  } catch {
    sendJson(response, 400, { error: "invalid_json" });
    return;
  }

  if (body.acknowledge_privacy_boundary !== true) {
    sendJson(response, 400, { error: "privacy_boundary_acknowledgement_required" });
    return;
  }

  const token = createHash("sha256").update(randomBytes(32)).digest("hex");
  unlockSessions.set(token, { unlockedAt: Date.now(), route: body.route || "/app" });

  sendJson(
    response,
    200,
    {
      unlocked: true,
      ttl_ms: UNLOCK_TTL_MS,
      privacy_boundary:
        "Private matter stays on this computer. Do not commit, publish, email, or transmit these answers."
    },
    {
      "set-cookie": `sfl_private_unlock=${encodeURIComponent(token)}; Path=/; Max-Age=${Math.floor(UNLOCK_TTL_MS / 1000)}; HttpOnly; SameSite=Strict`
    }
  );
}

function handleLocalMatterApi(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "method_not_allowed" });
    return;
  }
  if (!privateMatterPresent()) {
    sendJson(response, 404, { error: "private_matter_absent" });
    return;
  }
  if (!isLoopbackHost(requestedHost)) {
    sendJson(response, 403, { error: "private_matter_requires_loopback" });
    return;
  }
  if (!isUnlocked(request)) {
    sendJson(response, 401, {
      error: "private_unlock_required",
      message: "Choose practice matter or explicitly unlock the private case before loading answers."
    });
    return;
  }

  try {
    const raw = JSON.parse(readFileSync(PRIVATE_MATTER_PATH, "utf8"));
    const projection = projectPrivateMatter(raw);
    sendJson(response, 200, projection);
  } catch (error) {
    sendJson(response, 500, {
      error: "private_matter_projection_failed",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

function handleSessionStatus(request, response) {
  sendJson(response, 200, {
    private_matter_present: privateMatterPresent(),
    unlocked: isUnlocked(request),
    loopback: isLoopbackHost(requestedHost),
    capabilities: CAPABILITY_PROJECTIONS
  });
}

assertPrivateHostPolicy();

const server = createServer((request, response) => {
  const urlPath = (request.url || "/").split("?")[0];

  if (urlPath === "/api/local/session") {
    handleSessionStatus(request, response);
    return;
  }

  if (urlPath === "/api/local/unlock") {
    handleUnlockApi(request, response).catch((error) => {
      sendJson(response, 500, {
        error: "unlock_failed",
        message: error instanceof Error ? error.message : String(error)
      });
    });
    return;
  }

  if (urlPath === "/api/local/matter") {
    handleLocalMatterApi(request, response);
    return;
  }

  if (urlPath === "/api/app/interview/fam-pd-7-5") {
    try {
      sendJson(response, 200, projectAppInterview());
    } catch (error) {
      sendJson(response, 500, {
        error: "app_projection_failed",
        message: error instanceof Error ? error.message : String(error)
      });
    }
    return;
  }

  if (urlPath === "/api/capabilities") {
    sendJson(response, 200, { capabilities: CAPABILITY_PROJECTIONS });
    return;
  }

  if (urlPath === "/data/private" || urlPath.startsWith("/data/private/")) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const filePath = safePath(request.url || "/");
  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "content-security-policy":
      "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    "referrer-policy": "no-referrer"
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, requestedHost, () => {
  const privateActive = privateMatterPresent();
  console.log(`Family law workbench preview: http://${requestedHost}:${port}/app`);
  console.log(`Source review: http://${requestedHost}:${port}/source-review`);
  console.log(`Developer diagnostics: http://${requestedHost}:${port}/dev`);
  if (privateActive) {
    console.log("PRIVATE MODE: loopback-only. Explicit unlock required before matter projection.");
    console.log("Static /data/private/* routes are disabled. Do not expose this process off-machine.");
  } else {
    console.log("Synthetic data mode. Do not enter real legal information into this preview.");
  }
});
