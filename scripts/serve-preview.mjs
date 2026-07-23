#!/usr/bin/env node

/**
 * Local preview server.
 *
 * Public assets are served from /public.
 * Private matter is never exposed as a static directory.
 * When a gitignored private matter file exists, the server:
 *   - binds only to loopback
 *   - refuses HOST values that are externally reachable
 *   - serves a narrow schema-validated projection at GET /api/local/matter
 */

import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import process from "node:process";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const requestedHost = process.env.HOST || "127.0.0.1";
const PRIVATE_MATTER_PATH = resolve(root, "data/private/matter.json");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

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

function candidatePaths(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const requested = decoded === "/" ? "/public/index.html" : decoded;

  // Never serve anything under the private directory as a static file.
  if (requested === "/data/private" || requested.startsWith("/data/private/")) {
    return [];
  }

  const paths = [requested];

  // Root-relative asset links from public/index.html resolve under /public/.
  if (
    requested.startsWith("/styles/") ||
    requested.startsWith("/src/") ||
    requested.startsWith("/data/")
  ) {
    paths.push(`/public${requested}`);
  }

  // Source catalogs for the preview UI.
  if (requested.startsWith("/sources/")) {
    paths.push(requested);
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

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer"
  });
  response.end(`${JSON.stringify(payload)}\n`);
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

  // Narrow allowlisted projection only — never return arbitrary nested blobs by path.
  return {
    fixture_version: raw.fixture_version ?? null,
    fixture_notice: raw.fixture_notice ?? "Private local matter projection.",
    privacy: {
      classification: raw.privacy.classification,
      storage: raw.privacy.storage ?? "local_gitignored_sidecar",
      commit_forbidden: raw.privacy.commit_forbidden !== false,
      local_lock: true,
      served_via: "/api/local/matter",
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

assertPrivateHostPolicy();

const server = createServer((request, response) => {
  const urlPath = (request.url || "/").split("?")[0];

  if (urlPath === "/api/local/matter") {
    handleLocalMatterApi(request, response);
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
  console.log(`Family law workbench preview: http://${requestedHost}:${port}/`);
  if (privateActive) {
    console.log("PRIVATE MODE: loopback-only. Matter projection via GET /api/local/matter only.");
    console.log("Static /data/private/* routes are disabled. Do not expose this process off-machine.");
  } else {
    console.log("Synthetic data mode. Do not enter real legal information into this preview.");
  }
});
