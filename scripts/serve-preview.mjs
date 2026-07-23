import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import process from "node:process";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

function candidatePaths(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const requested = decoded === "/" ? "/public/index.html" : decoded;
  const paths = [requested];

  // Root-relative asset links from public/index.html resolve under /public/.
  if (
    requested.startsWith("/styles/") ||
    requested.startsWith("/src/") ||
    requested.startsWith("/data/")
  ) {
    paths.push(`/public${requested}`);
  }

  // Private matter sidecar is intentionally outside public/ and gitignored.
  if (requested === "/data/private/matter.json" || requested.startsWith("/data/private/")) {
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

const server = createServer((request, response) => {
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
    "content-security-policy": "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    "referrer-policy": "no-referrer"
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Synthetic legal workbench preview: http://${host}:${port}/`);
  console.log("Synthetic data only. Do not enter real legal information into this preview.");
});
