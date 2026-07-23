#!/usr/bin/env node

/**
 * Local preview server with capability-limited projections.
 *
 * Private matter never auto-loads. Unlock + privacy acknowledgement required.
 * /api/app returns opaque user-safe payloads only (no catalog IDs).
 */

import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { extname, resolve, sep } from "node:path";
import process from "node:process";
import {
  createEmptyRuntimeState,
  opaqueStepToken,
  submitStepAnswers,
  userModeEligible
} from "./lib/assertion-runtime.mjs";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const requestedHost = process.env.HOST || "127.0.0.1";
const PRIVATE_MATTER_PATH = resolve(root, "data/private/matter.json");
const SNAPSHOT = "jcc-kit-3j/2026-03-30";
const SNAPSHOT_ID = "jcc-kit-3j-2026-03-30";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);
const unlockSessions = new Map();
const UNLOCK_TTL_MS = 30 * 60 * 1000;

/** In-memory practice/private runtime stores — never written to disk by this server. */
const practiceRuntimes = new Map();
const privateRuntimes = new Map();

const CAPABILITY_PROJECTIONS = {
  "/app": {
    route: "/app",
    may_receive: [
      "user_safe_questions",
      "answers_after_unlock_choice",
      "progress",
      "help",
      "approved_presentation_only",
      "opaque_step_tokens"
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
    may_receive: ["synthetic_diagnostics", "runtime_proof"],
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
    if (now - session.unlockedAt > UNLOCK_TTL_MS) {
      unlockSessions.delete(token);
      privateRuntimes.delete(token);
    }
  }
}

function parseCookies(header) {
  const out = {};
  for (const part of String(header || "").split(";")) {
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function unlockTokenFromRequest(request) {
  const header = request.headers["x-private-unlock"];
  if (typeof header === "string" && header.trim()) return header.trim();
  return parseCookies(request.headers.cookie).sfl_private_unlock || null;
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

function readJsonFile(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf8"));
}

function loadArchitecture() {
  const interview = readJsonFile(`interview/${SNAPSHOT}/fam-pd-7-5.interview.json`);
  const presentationDoc = readJsonFile(`presentation/${SNAPSHOT}/fam-pd-7-5.presentation.json`);
  const bindingsDoc = readJsonFile(`bindings/${SNAPSHOT}/fam-pd-7-5.bindings.json`);
  const workflow = readJsonFile(`workflows/${SNAPSHOT}/jcc-appearance-memo-live-track.json`);
  const catalog = readJsonFile(`sources/${SNAPSHOT}/forms/fam-pd-7-5.json`);
  const receiptLedger = existsSync(resolve(root, "project-tracking/approval-receipts/ledger.json"))
    ? readJsonFile("project-tracking/approval-receipts/ledger.json")
    : { receipts: [] };
  return { interview, presentationDoc, bindingsDoc, workflow, catalog, receiptLedger };
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

  if (requested === "/data/private" || requested.startsWith("/data/private/")) return [];

  const paths = [requested];
  if (
    requested.startsWith("/styles/") ||
    requested.startsWith("/src/") ||
    requested.startsWith("/data/")
  ) {
    paths.push(`/public${requested}`);
  }
  if (requested.startsWith("/sources/")) paths.push(requested);
  for (const prefix of [
    "/bindings/",
    "/interview/",
    "/presentation/",
    "/workflows/",
    "/matter-definitions/",
    "/docs/schemas/",
    "/test-results/"
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
      if (!raw) return resolveBody({});
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
  if (!raw?.privacy?.classification || !raw.answers || typeof raw.answers !== "object") {
    throw new Error("Private matter requires privacy.classification and answers.");
  }
  return {
    fixture_version: raw.fixture_version ?? null,
    fixture_notice: raw.fixture_notice ?? "Private local matter projection.",
    privacy: {
      classification: raw.privacy.classification,
      storage: "memory_after_unlock_only",
      commit_forbidden: true,
      local_lock: true,
      served_via: "/api/local/matter",
      unlock_required: true,
      browser_persistence_forbidden: true,
      static_private_paths_disabled: true
    },
    matter: raw.matter && typeof raw.matter === "object" ? { caption: raw.matter.caption || null } : {},
    answers: raw.answers,
    unknown_answers: raw.unknown_answers && typeof raw.unknown_answers === "object" ? raw.unknown_answers : {},
    tasks: Array.isArray(raw.tasks) ? raw.tasks : [],
    correspondence: [],
    activity: []
  };
}

function controlForField(field) {
  if (field.control) return field.control;
  if (field.value_type === "enum" || field.value_type === "single_choice") return "select";
  if (field.value_type === "long_text" || field.value_type === "repeatable_long_text") return "textarea";
  if (field.value_type === "date") return "date";
  if (field.value_type === "integer") return "number";
  if (field.value_type === "email") return "email";
  if (field.value_type === "telephone") return "tel";
  return "text";
}

function projectAppInterview({ includeDraftWording = false } = {}) {
  const { interview, presentationDoc, workflow, catalog, receiptLedger } = loadArchitecture();
  const byId = new Map(presentationDoc.presentations.map((item) => [item.presentation_id, item]));
  const catalogById = new Map(catalog.line_items.map((item) => [item.line_item_id, item]));

  const steps = interview.steps
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((step) => {
      const presentation = byId.get(step.presentation_id) || null;
      const eligible = presentation ? userModeEligible(presentation, receiptLedger) : false;
      const stepToken = opaqueStepToken(step.interaction_step_id);
      const fields = (step.fields || []).map((field) => {
        const source = catalogById.get(field.line_item_id);
        return {
          field_token: field.field_token,
          label: field.label,
          control: controlForField(field),
          required: field.required_rule === "always",
          options: field.options || null,
          official_wording_available: Boolean(source?.source_label)
        };
      });

      const base = {
        step_token: stepToken,
        title: step.title,
        order: step.order,
        estimated_minutes: step.estimated_minutes || 3,
        section_goal: step.section_goal || null,
        field_count: fields.length,
        blocked: !eligible && !includeDraftWording,
        blocked_message:
          !eligible && !includeDraftWording
            ? "This question is not yet available in the guided interview."
            : null,
        official_wording_available: fields.some((field) => field.official_wording_available)
      };

      if (!eligible && !includeDraftWording) {
        return base;
      }

      return {
        ...base,
        prompt: presentation?.plain_language_prompt || step.title,
        explanation: presentation?.short_explanation || "",
        answer_guidance: presentation?.answer_guidance || "",
        draft_wording: includeDraftWording && !eligible,
        input_schema: { fields },
        progress: {
          state: "not_started"
        }
      };
    });

  return {
    capability: CAPABILITY_PROJECTIONS["/app"],
    progress: {
      form_label: "Appearance Memo",
      total_steps: steps.length,
      next_step_token: steps.find((step) => !step.blocked)?.step_token || null
    },
    workflow_summary: {
      stage_count: workflow.stages.length,
      next_human_stage: workflow.stages[0]?.title || null
    },
    steps
  };
}

function resolveStepByToken(token) {
  const { interview } = loadArchitecture();
  return interview.steps.find((step) => opaqueStepToken(step.interaction_step_id) === token) || null;
}

function officialWordingForStep(step) {
  const { catalog } = loadArchitecture();
  const catalogById = new Map(catalog.line_items.map((item) => [item.line_item_id, item]));
  return (step.fields || []).map((field) => ({
    label: field.label,
    source_label: catalogById.get(field.line_item_id)?.source_label || null
  }));
}

async function handleUnlockApi(request, response) {
  if (request.method === "DELETE") {
    const token = unlockTokenFromRequest(request);
    if (token) {
      unlockSessions.delete(token);
      privateRuntimes.delete(token);
    }
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
  privateRuntimes.set(token, createEmptyRuntimeState());

  sendJson(
    response,
    200,
    {
      unlocked: true,
      ttl_ms: UNLOCK_TTL_MS,
      browser_persistence_forbidden: true,
      privacy_boundary:
        "Private matter stays in memory on this computer only. Do not commit, publish, email, or transmit these answers."
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
    sendJson(response, 200, projectPrivateMatter(raw));
  } catch (error) {
    sendJson(response, 500, {
      error: "private_matter_projection_failed",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

async function handleSubmitStep(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "method_not_allowed" });
    return;
  }

  let body = {};
  try {
    body = await readBody(request);
  } catch {
    sendJson(response, 400, { error: "invalid_json" });
    return;
  }

  const mode = body.mode === "private" ? "private" : "practice";
  if (mode === "private" && !isUnlocked(request)) {
    sendJson(response, 401, { error: "private_unlock_required" });
    return;
  }

  const step = resolveStepByToken(body.step_token);
  if (!step) {
    sendJson(response, 404, { error: "unknown_step_token" });
    return;
  }

  const { presentationDoc, bindingsDoc, receiptLedger } = loadArchitecture();
  const presentation = presentationDoc.presentations.find(
    (item) => item.presentation_id === step.presentation_id
  );
  const eligible = presentation ? userModeEligible(presentation, receiptLedger) : false;
  const allowDraftProof = mode === "practice" && body.allow_draft_architecture_proof === true;
  if (!eligible && !allowDraftProof) {
    sendJson(response, 403, {
      error: "presentation_not_user_mode_eligible",
      message: "Approved presentation is required before User-mode answers are accepted."
    });
    return;
  }

  const bindingsById = new Map(bindingsDoc.bindings.map((item) => [item.binding_id, item]));
  const runtimeKey = mode === "private" ? unlockTokenFromRequest(request) : body.practice_session_id || "practice";
  const store = mode === "private" ? privateRuntimes : practiceRuntimes;
  const current = store.get(runtimeKey) || createEmptyRuntimeState();
  const result = submitStepAnswers({
    step,
    bindingsById,
    values: body.values || {},
    unknowns: body.unknowns || {},
    assertedBy: mode === "private" ? "private_user" : "practice_user",
    runtimeState: current
  });

  if (!result.ok) {
    sendJson(response, 400, { error: "validation_failed", details: result.errors });
    return;
  }

  store.set(runtimeKey, result.runtimeState);
  sendJson(response, 200, {
    ok: true,
    step_state: result.step_state,
    assertion_count: result.assertions.length,
    projection_count: result.projections.length,
    // User mode sees counts only; full IDs stay off this surface.
    projected_fields: result.projections.map((item) => ({
      label: step.fields.find((field) => field.line_item_id === item.line_item_id)?.label || "Field",
      unknown: item.unknown,
      has_value: item.value !== null && item.value !== undefined && item.value !== ""
    }))
  });
}

assertPrivateHostPolicy();

const server = createServer((request, response) => {
  const urlPath = (request.url || "/").split("?")[0];

  if (urlPath === "/api/local/session") {
    sendJson(response, 200, {
      private_matter_present: privateMatterPresent(),
      unlocked: isUnlocked(request),
      loopback: isLoopbackHost(requestedHost),
      commit: process.env.SFL_COMMIT || null,
      capabilities: CAPABILITY_PROJECTIONS
    });
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
      sendJson(response, 200, projectAppInterview({ includeDraftWording: false }));
    } catch (error) {
      sendJson(response, 500, {
        error: "app_projection_failed",
        message: error instanceof Error ? error.message : String(error)
      });
    }
    return;
  }

  if (urlPath === "/api/dev/interview/fam-pd-7-5") {
    try {
      sendJson(response, 200, projectAppInterview({ includeDraftWording: true }));
    } catch (error) {
      sendJson(response, 500, {
        error: "dev_projection_failed",
        message: error instanceof Error ? error.message : String(error)
      });
    }
    return;
  }

  if (urlPath === "/api/app/step/submit") {
    handleSubmitStep(request, response).catch((error) => {
      sendJson(response, 500, {
        error: "submit_failed",
        message: error instanceof Error ? error.message : String(error)
      });
    });
    return;
  }

  if (urlPath === "/api/app/step/official-wording" && request.method === "POST") {
    readBody(request)
      .then((body) => {
        const step = resolveStepByToken(body.step_token);
        if (!step) {
          sendJson(response, 404, { error: "unknown_step_token" });
          return;
        }
        sendJson(response, 200, {
          title: step.title,
          entries: officialWordingForStep(step)
        });
      })
      .catch(() => sendJson(response, 400, { error: "invalid_json" }));
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
  console.log(`Family law workbench preview: http://${requestedHost}:${port}/app`);
  console.log(`Source review: http://${requestedHost}:${port}/source-review`);
  console.log(`Developer diagnostics: http://${requestedHost}:${port}/dev`);
  if (privateMatterPresent()) {
    console.log("PRIVATE MODE: loopback-only. Explicit unlock required. Browser persistence forbidden for private answers.");
    console.log("Static /data/private/* routes are disabled. Do not expose this process off-machine.");
  } else {
    console.log("Synthetic data mode. Do not enter real legal information into this preview.");
  }
});
