import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import process from "node:process";

const requiredFiles = [
  "public/index.html",
  "public/styles/legal-workbench.css",
  "public/src/legal-workbench.js",
  "public/src/applicability-engine.js",
  "public/src/wizard-state.js",
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
    "Synthetic preview",
    "data-queue-view=\"today\"",
    "Continue where you left off",
    "private-lock-banner"
  ]);

  const css = expectText("public/styles/legal-workbench.css", [
    ".app-shell",
    ".work-queue",
    ".document-workspace",
    ".context-inspector",
    ".ibal-drawer",
    ".today-card",
    ".private-lock-banner",
    "prefers-reduced-motion"
  ]);

  const js = expectText("public/src/legal-workbench.js", [
    "FORM_CATALOG_ROOT",
    "aggregateMatterWizardProgress",
    "buildWizardState",
    "reconcileWizardSelection",
    "evaluateWizardStates",
    "applicable questions",
    "evaluation_reason",
    "Affected ID",
    "localStorage",
    "No mutation in preview",
    "/api/local/matter",
    "Source and audit details",
    "renderTodayCard",
    "fam-pd-7-2",
    "form-10-3-draft-order",
    "form-10-3-child-support-order",
    "form-15-8b",
    "form-12-3",
    "fam-pd-7-5"
  ]);

  const server = expectText("scripts/serve-preview.mjs", [
    "/api/local/matter",
    "static_private_paths_disabled",
    "private_matter_requires_loopback",
    "Refusing to start",
    "Static /data/private/* routes are disabled"
  ]);
  if (server.includes('paths.push(requested)') && server.includes('/data/private/matter.json')) {
    failures.push("serve-preview must not statically expose private matter.json");
  }
  if (/https?:\/\//i.test(js)) failures.push("Preview JavaScript must not call a remote URL.");
  if (html.includes("contenteditable")) failures.push("First preview must not use arbitrary contenteditable HTML as canonical form state.");
  if (css.length < 5000) failures.push("Preview CSS appears unexpectedly small for the required four-surface workbench.");
  if (js.includes("form.line_items[state.currentQuestionIndex]")) failures.push("Visible wizard must not navigate the raw catalog index.");
  if (js.includes("form.line_items.length}`")) failures.push("Visible question position must use applicable wizard navigation length.");

  const fixture = JSON.parse(readFileSync("public/data/synthetic-matter.json", "utf8"));
  if (!fixture.fixture_notice?.includes("Synthetic")) failures.push("Synthetic fixture notice is missing.");
  if (!fixture.matter?.matter_id?.startsWith("synthetic-")) failures.push("Matter fixture must use an explicitly synthetic ID.");
  if (!fixture.answers?.["fam-pd-7-2"]) failures.push("Synthetic FAM-PD #7-2 answers are missing.");
  if (!Array.isArray(fixture.tasks) || fixture.tasks.length < 3) failures.push("Synthetic task coverage is incomplete.");
  if (!Array.isArray(fixture.correspondence) || fixture.correspondence.length < 1) failures.push("Synthetic correspondence ingress coverage is missing.");
  if (!existsSync("public/data/fixtures/synthetic-matter-complete.json")) {
    failures.push("Missing complete synthetic fixture used by structural completeness checks.");
  }

  const syntaxChecks = [
    "public/src/legal-workbench.js",
    "public/src/applicability-engine.js",
    "public/src/wizard-state.js",
    "scripts/serve-preview.mjs"
  ];
  for (const path of syntaxChecks) {
    const result = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
    if (result.status !== 0) failures.push(`${path} failed node --check: ${result.stderr || result.stdout}`);
  }

  const completeness = spawnSync(process.execPath, ["--input-type=module", "-e", `
    import { readFileSync } from "node:fs";
    import { aggregateMatterWizardProgress } from "./public/src/wizard-state.js";
    const files = [
      "fam-pd-7-2.json",
      "form-10-3-draft-order.json",
      "form-10-3-child-support-order.json",
      "form-15-8b.json",
      "form-12-3.json",
      "fam-pd-7-5.json"
    ];
    const forms = files.map((file) => JSON.parse(readFileSync("sources/jcc-kit-3j/2026-03-30/forms/" + file, "utf8")));
    const fixture = JSON.parse(readFileSync("public/data/fixtures/synthetic-matter-complete.json", "utf8"));
    const progress = aggregateMatterWizardProgress(forms, fixture);
    if (progress.percent_complete !== 100 || progress.blockers !== 0) {
      console.error(JSON.stringify(progress.forms.map((form) => ({
        form_id: form.form_id,
        percent: form.percent_complete,
        blockers: form.blockers
      })), null, 2));
      process.exit(1);
    }
    console.log("Fixture structural completeness: 100% across six forms.");
  `], { encoding: "utf8" });
  if (completeness.status !== 0) {
    failures.push(`Seeded fixture is not structurally complete:\n${completeness.stderr || completeness.stdout}`);
  } else if (completeness.stdout) {
    process.stdout.write(completeness.stdout);
  }
}

if (failures.length) {
  console.error("Synthetic preview check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Synthetic legal workbench preview check passed.");
console.log("Visible guided navigation, progress, validation, package blockers, and inspector reasoning are bound to deterministic wizard state.");
console.log("This proves structural preview integrity only, not browser quality, security, accessibility, legal accuracy, or runtime readiness.");
