import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import process from "node:process";

const requiredFiles = [
  "public/index.html",
  "public/styles/legal-workbench.css",
  "public/src/legal-workbench.js",
  "public/data/synthetic-matter.json",
  "scripts/serve-preview.mjs"
];

const failures = [];

for (const path of requiredFiles) {
  if (!existsSync(path)) failures.push(`Missing required preview file: ${path}`);
}

function expectText(path, fragments) {
  const text = readFileSync(path, "utf8");
  for (const fragment of fragments) {
    if (!text.includes(fragment)) failures.push(`${path} missing required contract text: ${fragment}`);
  }
  return text;
}

if (!failures.length) {
  const html = expectText("public/index.html", [
    "Family Law Workbench",
    "Source review pending",
    "No transmission",
    "Guided questions",
    "Section review",
    "Page preview",
    "Package preview",
    "Ask Ibal",
    "Synthetic preview"
  ]);

  const css = expectText("public/styles/legal-workbench.css", [
    ".app-shell",
    ".work-queue",
    ".document-workspace",
    ".context-inspector",
    ".ibal-drawer",
    "prefers-reduced-motion"
  ]);

  const js = expectText("public/src/legal-workbench.js", [
    "FORM_CATALOG_ROOT",
    "fam-pd-7-2",
    "form-10-3-draft-order",
    "form-10-3-child-support-order",
    "form-15-8b",
    "form-12-3",
    "fam-pd-7-5",
    "Affected ID",
    "localStorage",
    "No mutation in preview"
  ]);

  if (/https?:\/\//i.test(js)) failures.push("Preview JavaScript must not call a remote URL.");
  if (html.includes("contenteditable")) failures.push("First preview must not use arbitrary contenteditable HTML as canonical form state.");
  if (css.length < 5000) failures.push("Preview CSS appears unexpectedly small for the required four-surface workbench.");

  const fixture = JSON.parse(readFileSync("public/data/synthetic-matter.json", "utf8"));
  if (!fixture.fixture_notice?.includes("Synthetic")) failures.push("Synthetic fixture notice is missing.");
  if (!fixture.matter?.matter_id?.startsWith("synthetic-")) failures.push("Matter fixture must use an explicitly synthetic ID.");
  if (!fixture.answers?.["fam-pd-7-2"]) failures.push("Synthetic FAM-PD #7-2 answers are missing.");
  if (!Array.isArray(fixture.tasks) || fixture.tasks.length < 3) failures.push("Synthetic task coverage is incomplete.");
  if (!Array.isArray(fixture.correspondence) || fixture.correspondence.length < 1) failures.push("Synthetic correspondence ingress coverage is missing.");

  const syntaxChecks = ["public/src/legal-workbench.js", "scripts/serve-preview.mjs"];
  for (const path of syntaxChecks) {
    const result = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
    if (result.status !== 0) failures.push(`${path} failed node --check: ${result.stderr || result.stdout}`);
  }
}

if (failures.length) {
  console.error("Synthetic preview check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Synthetic legal workbench preview check passed.");
console.log("This proves structural preview integrity only, not browser quality, security, accessibility, legal accuracy, or runtime readiness.");
