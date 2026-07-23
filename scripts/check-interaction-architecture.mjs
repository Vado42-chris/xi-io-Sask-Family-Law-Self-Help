#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";
import {
  applyTransform,
  createEmptyRuntimeState,
  submitStepAnswers,
  userModeEligible
} from "./lib/assertion-runtime.mjs";

const ROOT = process.cwd();
const SNAPSHOT = "jcc-kit-3j/2026-03-30";
const failures = [];
const ajv = new Ajv2020({ allErrors: true, strict: false });

function readJson(rel) {
  const full = path.join(ROOT, rel);
  if (!existsSync(full)) {
    failures.push(`Missing file: ${rel}`);
    return null;
  }
  return JSON.parse(readFileSync(full, "utf8"));
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function lineHash(item) {
  return createHash("sha256")
    .update(
      stableStringify({
        line_item_id: item.line_item_id,
        source_label: item.source_label,
        kind: item.kind,
        required_rule: item.required_rule,
        options: item.options ?? null
      })
    )
    .digest("hex");
}

function bindingHash(binding) {
  return createHash("sha256")
    .update(
      stableStringify({
        fact_definition_id: binding.fact_definition_id,
        targets: binding.targets,
        override_policy: binding.override_policy,
        conflict_policy: binding.conflict_policy,
        source_line_item_hashes: binding.source_line_item_hashes
      })
    )
    .digest("hex");
}

const schemas = {
  definitions: readJson("docs/schemas/fact-definition-schema-v1.json"),
  assertions: readJson("docs/schemas/matter-assertion-schema-v1.json"),
  bindings: readJson("docs/schemas/form-field-binding-schema-v1.json"),
  workflow: readJson("docs/schemas/workflow-graph-schema-v1.json"),
  interview: readJson("docs/schemas/interview-step-schema-v1.json"),
  presentation: readJson("docs/schemas/presentation-registry-schema-v1.json")
};

const catalog = readJson(`sources/${SNAPSHOT}/forms/fam-pd-7-5.json`);
const definitions = readJson("matter-definitions/jcc-kit-3j-2026-03-30.json");
const bindings = readJson(`bindings/${SNAPSHOT}/fam-pd-7-5.bindings.json`);
const transforms = readJson(`bindings/${SNAPSHOT}/transform-registry.json`);
const interview = readJson(`interview/${SNAPSHOT}/fam-pd-7-5.interview.json`);
const presentation = readJson(`presentation/${SNAPSHOT}/fam-pd-7-5.presentation.json`);
const workflow = readJson(`workflows/${SNAPSHOT}/jcc-appearance-memo-live-track.json`);
const receiptLedger = readJson("project-tracking/approval-receipts/ledger.json");

function validate(schema, data, label) {
  if (!schema || !data) return;
  const check = ajv.compile(schema);
  if (!check(data)) {
    for (const error of check.errors || []) {
      failures.push(`${label} schema: ${error.instancePath || "/"} ${error.message}`);
    }
  }
}

validate(schemas.definitions, definitions, "definitions");
validate(schemas.bindings, bindings, "bindings");
validate(schemas.workflow, workflow, "workflow");
validate(schemas.interview, interview, "interview");
validate(schemas.presentation, presentation, "presentation");

const defIds = new Set((definitions?.definitions || []).map((item) => item.fact_definition_id));
const bindingIds = new Set((bindings?.bindings || []).map((item) => item.binding_id));
const transformIds = new Set((transforms?.transforms || []).map((item) => item.transform_id));
const catalogById = new Map((catalog?.line_items || []).map((item) => [item.line_item_id, item]));

for (const binding of bindings?.bindings || []) {
  if (!defIds.has(binding.fact_definition_id)) {
    failures.push(`Binding ${binding.binding_id} references missing fact ${binding.fact_definition_id}`);
  }
  const expected = bindingHash(binding);
  if (binding.binding_semantic_hash !== expected) {
    failures.push(`Binding hash mismatch for ${binding.binding_id}`);
  }
  for (const target of binding.targets || []) {
    if (!transformIds.has(target.transform)) {
      failures.push(`Unknown transform ${target.transform} on ${binding.binding_id}`);
    }
    const item = catalogById.get(target.line_item_id);
    if (!item) {
      failures.push(`Binding target missing line item ${target.line_item_id}`);
      continue;
    }
    const expectedLine = lineHash(item);
    if (!(binding.source_line_item_hashes || []).includes(expectedLine)) {
      failures.push(`Binding ${binding.binding_id} source hash stale for ${target.line_item_id}`);
    }
  }
}

const dispositionSeen = new Set();
const executableCoverage = new Map();
for (const step of interview?.steps || []) {
  if (!Array.isArray(step.fields) || step.fields.length < 1) {
    failures.push(`Step ${step.interaction_step_id} missing typed fields`);
  }
  for (const field of step.fields || []) {
    if (!defIds.has(field.fact_definition_id)) {
      failures.push(`Step field missing fact ${field.fact_definition_id}`);
    }
    if (!bindingIds.has(field.binding_id)) {
      failures.push(`Step field missing binding ${field.binding_id}`);
    }
    executableCoverage.set(field.line_item_id, step.interaction_step_id);
  }
  if (!Array.isArray(step.output_bindings) || step.output_bindings.length !== (step.fields || []).length) {
    failures.push(`Step ${step.interaction_step_id} output_bindings must match fields`);
  }
}

for (const disposition of interview?.line_item_dispositions || []) {
  if (dispositionSeen.has(disposition.line_item_id)) {
    failures.push(`Duplicate disposition for ${disposition.line_item_id}`);
  }
  dispositionSeen.add(disposition.line_item_id);
  const item = catalogById.get(disposition.line_item_id);
  if (!item) {
    failures.push(`Disposition for unknown line item ${disposition.line_item_id}`);
    continue;
  }
  if (disposition.source_line_item_hash !== lineHash(item)) {
    failures.push(`Disposition hash stale for ${disposition.line_item_id}`);
  }
  if (["asked_directly", "grouped_into_step"].includes(disposition.disposition)) {
    if (!executableCoverage.has(disposition.line_item_id)) {
      failures.push(`Orphan disposition ${disposition.line_item_id} (${disposition.disposition}) has no executable step`);
    }
  }
}

for (const id of catalogById.keys()) {
  if (!dispositionSeen.has(id)) failures.push(`Missing disposition for ${id}`);
}

let pendingCount = 0;
let eligibleCount = 0;
for (const item of presentation?.presentations || []) {
  if ("example_answer" in item) failures.push(`${item.presentation_id} must not model example_answer`);
  if (item.authorship?.method === "human_authored" && item.authorship?.agent_pass) {
    failures.push(`${item.presentation_id} cannot claim human_authored with agent_pass`);
  }
  for (const axis of ["legal", "ux", "accessibility"]) {
    const record = item.approvals?.[axis];
    if (!record) {
      failures.push(`${item.presentation_id} missing ${axis}`);
      continue;
    }
    if (record.state === "approved") {
      if (!record.receipt_id) failures.push(`${item.presentation_id} approved ${axis} lacks receipt_id`);
      if (typeof record.reviewer === "string" && record.reviewer.startsWith("owner-pending")) {
        failures.push(`${item.presentation_id} uses forbidden reviewer identity ${record.reviewer}`);
      }
      const found = (receiptLedger?.receipts || []).find(
        (receipt) =>
          receipt.receipt_id === record.receipt_id &&
          receipt.presentation_id === item.presentation_id &&
          receipt.axis === axis &&
          receipt.state === "approved"
      );
      if (!found) failures.push(`${item.presentation_id} ${axis} receipt not in ledger`);
    } else if (record.state === "pending") {
      pendingCount += 1;
      if (record.receipt_id) failures.push(`${item.presentation_id} pending ${axis} must not invent receipt_id`);
    }
  }
  if (userModeEligible(item, receiptLedger)) eligibleCount += 1;
  else pendingCount += 0;
}

if (eligibleCount !== 0 && (receiptLedger?.receipts || []).length === 0) {
  failures.push("No presentation may be user-mode eligible without ledger receipts");
}

for (const stage of workflow?.stages || []) {
  if (!Array.isArray(stage.depends_on)) failures.push(`Stage ${stage.stage_id} missing depends_on`);
  if (!Array.isArray(stage.completion_conditions)) {
    failures.push(`Stage ${stage.stage_id} missing completion_conditions`);
  }
  for (const dep of stage.depends_on || []) {
    if (!(workflow.stages || []).some((candidate) => candidate.stage_id === dep)) {
      failures.push(`Stage ${stage.stage_id} depends on missing ${dep}`);
    }
  }
}

// Runtime proof: typed submit creates assertions and projections.
const step = interview.steps.find((item) => item.interaction_step_id === "jcc.appearance.conference_when_where");
const bindingsById = new Map(bindings.bindings.map((item) => [item.binding_id, item]));
const runtime = submitStepAnswers({
  step,
  bindingsById,
  values: {
    "field.schedule_date": "2026-08-07",
    "field.schedule_time_and_location": "Court location from Notice"
  },
  runtimeState: createEmptyRuntimeState()
});
if (!runtime.ok) failures.push(`Runtime submit failed: ${JSON.stringify(runtime.errors)}`);
if (runtime.assertions?.length !== 2) failures.push("Runtime must create one assertion per field");
if (runtime.projections?.length !== 2) failures.push("Runtime must project bound line items");
const projectedDate = runtime.projections.find((item) => item.line_item_id === "schedule.date")?.value;
const expectedDate = applyTransform("date_iso_to_long_en_ca", "2026-08-07");
if (projectedDate !== expectedDate) {
  failures.push(`Date transform failed: got ${projectedDate}, expected ${expectedDate}`);
}

const serve = readFileSync(path.join(ROOT, "scripts/serve-preview.mjs"), "utf8");
for (const fragment of [
  "opaqueStepToken",
  "officialWordingForStep",
  "browser_persistence_forbidden",
  "includeDraftWording: false",
  "presentation_not_user_mode_eligible"
]) {
  if (!serve.includes(fragment)) failures.push(`serve-preview missing contract: ${fragment}`);
}

const appJs = readFileSync(path.join(ROOT, "public/src/user-app.js"), "utf8");
if (appJs.includes('localStorage.setItem') && !appJs.includes("PRACTICE_STORAGE_PREFIX")) {
  failures.push("user-app localStorage must be practice-namespaced only");
}
if (/localStorage[\s\S]*private|mode !== \"practice\"[\s\S]*localStorage/.test(appJs) === false) {
  // Ensure private mode never writes localStorage via savePracticeProgress guard.
  if (!appJs.includes("if (state.mode !== \"practice\") return")) {
    failures.push("Private mode must not persist to localStorage");
  }
}
if (!appJs.includes("Lock now") && !readFileSync(path.join(ROOT, "public/app/index.html"), "utf8").includes("Lock now")) {
  failures.push("Lock now control required");
}

const appHtml = readFileSync(path.join(ROOT, "public/app/index.html"), "utf8");
if (!appHtml.includes("ANSWER REVIEW") || !appHtml.includes("THIS IS NOT THE DOCUMENT YOU WILL FILE")) {
  failures.push("Non-filing banner must be impossible to miss");
}

if (failures.length) {
  failures.forEach((failure) => console.error(`ERROR (interaction-architecture): ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        status: "passed",
        pending_approval_axes: pendingCount,
        user_mode_eligible_presentations: eligibleCount,
        bindings: bindings.bindings.length,
        executable_fields: executableCoverage.size,
        workflow_stages: workflow.stages.length,
        runtime_proof: {
          assertions: runtime.assertions.length,
          projections: runtime.projections.length,
          transformed_date: projectedDate
        }
      },
      null,
      2
    )
  );
}
