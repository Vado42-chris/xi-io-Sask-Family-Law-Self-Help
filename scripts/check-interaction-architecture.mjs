#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SNAPSHOT = "jcc-kit-3j/2026-03-30";
const failures = [];

function readJson(rel) {
  const full = path.join(ROOT, rel);
  if (!existsSync(full)) {
    failures.push(`Missing file: ${rel}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(full, "utf8"));
  } catch (error) {
    failures.push(`Invalid JSON ${rel}: ${error.message}`);
    return null;
  }
}

function requireKeys(obj, keys, label) {
  for (const key of keys) {
    if (obj == null || !(key in obj)) failures.push(`${label} missing key: ${key}`);
  }
}

const catalog = readJson(`sources/${SNAPSHOT}/forms/fam-pd-7-5.json`);
const definitions = readJson("matter-definitions/jcc-kit-3j-2026-03-30.json");
const assertionSchema = readJson("matter-definitions/assertion-schema-v1.json");
const bindings = readJson(`bindings/${SNAPSHOT}/fam-pd-7-5.bindings.json`);
const interview = readJson(`interview/${SNAPSHOT}/fam-pd-7-5.interview.json`);
const presentation = readJson(`presentation/${SNAPSHOT}/fam-pd-7-5.presentation.json`);
const workflow = readJson(`workflows/${SNAPSHOT}/jcc-appearance-memo-live-track.json`);

for (const schema of [
  "docs/schemas/fact-definition-schema-v1.json",
  "docs/schemas/matter-assertion-schema-v1.json",
  "docs/schemas/form-field-binding-schema-v1.json",
  "docs/schemas/workflow-graph-schema-v1.json",
  "docs/schemas/interview-step-schema-v1.json",
  "docs/schemas/presentation-registry-schema-v1.json",
  "docs/schemas/capability-projection-schema-v1.json"
]) {
  readJson(schema);
}

if (catalog && interview) {
  const catalogIds = new Set(catalog.line_items.map((item) => item.line_item_id));
  const dispositionIds = new Set(interview.line_item_dispositions.map((item) => item.line_item_id));
  for (const id of catalogIds) {
    if (!dispositionIds.has(id)) failures.push(`Missing disposition for line item: ${id}`);
  }
  if (catalogIds.size !== dispositionIds.size) {
    failures.push(`Disposition count ${dispositionIds.size} != catalog count ${catalogIds.size}`);
  }
}

if (definitions) {
  requireKeys(definitions, ["schema_version", "snapshot_id", "definitions"], "matter definitions");
  if (!Array.isArray(definitions.definitions) || definitions.definitions.length < 1) {
    failures.push("matter definitions must include at least one definition");
  }
}

if (assertionSchema) {
  requireKeys(assertionSchema, ["required_fields", "status_values", "source_type_values"], "assertion schema");
}

if (bindings) {
  requireKeys(bindings, ["form_id", "snapshot_id", "bindings"], "bindings");
  for (const binding of bindings.bindings || []) {
    requireKeys(binding, ["binding_id", "fact_definition_id", "targets", "override_policy", "conflict_policy"], binding.binding_id || "binding");
    if (!Array.isArray(binding.targets) || binding.targets.length < 1) {
      failures.push(`${binding.binding_id} needs targets`);
    }
  }
}

if (interview) {
  requireKeys(interview, ["form_id", "snapshot_id", "steps", "line_item_dispositions"], "interview");
  for (const step of interview.steps || []) {
    requireKeys(step, ["interaction_step_id", "fact_definition_ids", "line_item_ids", "presentation_id"], step.interaction_step_id || "step");
    if (!Array.isArray(step.fact_definition_ids) || !Array.isArray(step.line_item_ids)) {
      failures.push(`${step.interaction_step_id} must bind arrays of fact/line-item ids`);
    }
  }
}

if (presentation) {
  requireKeys(presentation, ["form_id", "snapshot_id", "presentations"], "presentation");
  for (const item of presentation.presentations || []) {
    requireKeys(item, [
      "presentation_id",
      "interaction_step_id",
      "fact_definition_ids",
      "line_item_ids",
      "plain_language_prompt",
      "answer_guidance",
      "approvals",
      "source_line_item_hashes",
      "binding_semantic_hash"
    ], item.presentation_id || "presentation");
    if ("example_answer" in item) {
      failures.push(`${item.presentation_id} must not model example_answer`);
    }
    const approvals = item.approvals || {};
    for (const axis of ["legal", "ux", "accessibility", "source_binding"]) {
      if (!approvals[axis]) failures.push(`${item.presentation_id} missing approval axis ${axis}`);
    }
    const eligible =
      approvals.legal?.state === "approved" &&
      approvals.ux?.state === "approved" &&
      approvals.accessibility?.state === "approved" &&
      approvals.source_binding?.state === "current" &&
      Boolean(approvals.legal?.receipt_id) &&
      Boolean(approvals.ux?.receipt_id) &&
      Boolean(approvals.accessibility?.receipt_id);
    if (!eligible) {
      failures.push(`${item.presentation_id} is not user_mode_eligible under receipt-backed rules`);
    }
  }

  const presentationIds = new Set((presentation.presentations || []).map((item) => item.presentation_id));
  for (const step of interview?.steps || []) {
    if (!presentationIds.has(step.presentation_id)) {
      failures.push(`Interview step ${step.interaction_step_id} points at missing presentation ${step.presentation_id}`);
    }
  }
}

if (workflow) {
  requireKeys(workflow, ["workflow_id", "stages", "snapshot_id"], "workflow");
  if (!Array.isArray(workflow.stages) || workflow.stages.length < 5) {
    failures.push("workflow must include multi-stage procedural graph");
  }
}

const serve = readFileSync(path.join(ROOT, "scripts/serve-preview.mjs"), "utf8");
for (const fragment of [
  "private_unlock_required",
  "/api/local/unlock",
  "acknowledge_privacy_boundary",
  "CAPABILITY_PROJECTIONS",
  "/api/app/interview/fam-pd-7-5",
  "unlock_required: true"
]) {
  if (!serve.includes(fragment)) failures.push(`serve-preview.mjs missing contract: ${fragment}`);
}

const appHtml = readFileSync(path.join(ROOT, "public/app/index.html"), "utf8");
for (const fragment of [
  "Continue where you left off",
  "Your next step",
  "View full work plan",
  "ANSWER REVIEW",
  "This is not the document you will file.",
  "Unlock private case",
  "Use practice matter",
  "Help me answer this"
]) {
  if (!appHtml.toLowerCase().includes(fragment.toLowerCase())) {
    failures.push(`public/app/index.html missing UX contract: ${fragment}`);
  }
}

if (serve.includes("?mode=developer")) {
  failures.push("developer mode querystring is forbidden");
}

if (failures.length) {
  failures.forEach((failure) => console.error(`ERROR (interaction-architecture): ${failure}`));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "passed",
    snapshot_id: "jcc-kit-3j-2026-03-30",
    proof_form: "fam-pd-7-5",
    definitions: definitions?.definitions?.length || 0,
    bindings: bindings?.bindings?.length || 0,
    interview_steps: interview?.steps?.length || 0,
    presentations: presentation?.presentations?.length || 0,
    workflow_stages: workflow?.stages?.length || 0,
    dispositions: interview?.line_item_dispositions?.length || 0
  }, null, 2));
}
