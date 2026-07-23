/**
 * Deterministic assertion → binding → form projection runtime.
 * Shared by server checks and browser practice/dev proof paths.
 */

export const ANSWER_STATES = Object.freeze([
  "not_started",
  "draft",
  "answered",
  "needs_help",
  "blocked",
  "reviewed",
  "superseded",
  "unknown"
]);

export function createEmptyRuntimeState() {
  return {
    assertions: {},
    form_projections: {},
    field_states: {},
    step_states: {},
    revision_receipts: []
  };
}

export function applyTransform(transformId, value) {
  if (value === null || value === undefined || value === "") return value;
  switch (transformId) {
    case "identity":
      return value;
    case "date_iso_to_long_en_ca": {
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date for transform: ${value}`);
      }
      return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(date);
    }
    case "integer_as_string":
      return String(Number.parseInt(String(value), 10));
    default:
      throw new Error(`Unknown transform: ${transformId}`);
  }
}

export function validateFieldValue(field, rawValue, markUnknown = false) {
  if (markUnknown) {
    return { ok: true, value: null, status: "unknown" };
  }
  const requiredAlways = field.required_rule === "always";
  const empty =
    rawValue === null ||
    rawValue === undefined ||
    (typeof rawValue === "string" && rawValue.trim() === "") ||
    (Array.isArray(rawValue) && rawValue.length === 0);

  if (empty) {
    if (requiredAlways) {
      return { ok: false, error: "Required field is empty." };
    }
    return { ok: true, value: null, status: "not_started" };
  }

  let value = rawValue;
  if (typeof value === "string") value = value.trim();

  switch (field.value_type) {
    case "date":
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
        return { ok: false, error: "Date must use YYYY-MM-DD." };
      }
      break;
    case "integer":
    case "number":
      if (!/^-?\d+$/.test(String(value))) {
        return { ok: false, error: "Value must be a whole number." };
      }
      value = Number.parseInt(String(value), 10);
      break;
    case "enum":
    case "single_choice":
      if (Array.isArray(field.options) && !field.options.includes(value)) {
        return { ok: false, error: "Value is not an allowed option." };
      }
      break;
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        return { ok: false, error: "Email format looks incomplete." };
      }
      break;
    default:
      break;
  }

  return { ok: true, value, status: "answered" };
}

export function submitStepAnswers({
  step,
  bindingsById,
  values,
  unknowns = {},
  assertedBy = "practice_user",
  now = new Date().toISOString(),
  runtimeState = createEmptyRuntimeState()
}) {
  const next = structuredClone(runtimeState);
  const createdAssertions = [];
  const projections = [];
  const errors = [];

  for (const field of step.fields || []) {
    const markUnknown = Boolean(unknowns[field.field_token] || unknowns[field.fact_definition_id]);
    const raw = values[field.field_token] ?? values[field.fact_definition_id] ?? null;
    const validated = validateFieldValue(field, raw, markUnknown);
    if (!validated.ok) {
      errors.push({ field_token: field.field_token, error: validated.error });
      continue;
    }

    const assertionId = `assertion.${field.fact_definition_id}.${now}`;
    const assertion = {
      assertion_id: assertionId,
      fact_definition_id: field.fact_definition_id,
      value: validated.value,
      asserted_by: assertedBy,
      asserted_at: now,
      status: validated.status === "unknown" ? "unknown" : "asserted",
      confidence: validated.status === "unknown" ? "unverified" : "user_confirmed",
      evidence_links: [],
      source_type: "user_statement",
      source_date: null,
      ingress_receipt: null,
      extraction_method: null,
      human_confirmation: validated.status === "answered",
      conflict_state: "none"
    };

    next.assertions[field.fact_definition_id] = assertion;
    next.field_states[field.field_token] = {
      state: validated.status === "unknown" ? "unknown" : validated.status === "answered" ? "answered" : "not_started",
      assertion_id: assertionId
    };
    createdAssertions.push(assertion);

    const binding = bindingsById.get(field.binding_id);
    if (!binding) {
      errors.push({ field_token: field.field_token, error: `Missing binding ${field.binding_id}` });
      continue;
    }
    for (const target of binding.targets) {
      let projectedValue = null;
      if (validated.status !== "unknown" && validated.value !== null) {
        projectedValue = applyTransform(target.transform, validated.value);
      }
      const projection = {
        form_id: target.form_id,
        line_item_id: target.line_item_id,
        value: projectedValue,
        transform: target.transform,
        binding_id: binding.binding_id,
        assertion_id: assertionId,
        unknown: validated.status === "unknown"
      };
      if (!next.form_projections[target.form_id]) next.form_projections[target.form_id] = {};
      next.form_projections[target.form_id][target.line_item_id] = projection;
      projections.push(projection);
    }
  }

  if (errors.length) {
    return { ok: false, errors, runtimeState: next };
  }

  const allUnknown = (step.fields || []).every(
    (field) => next.field_states[field.field_token]?.state === "unknown"
  );
  const allAnswered = (step.fields || []).every((field) => {
    const state = next.field_states[field.field_token]?.state;
    return state === "answered" || state === "unknown";
  });

  const stepState = allUnknown ? "unknown" : allAnswered ? "answered" : "draft";
  next.step_states[step.interaction_step_id] = { state: stepState, updated_at: now };
  next.revision_receipts.push({
    receipt_id: `revision.${step.interaction_step_id}.${now}`,
    interaction_step_id: step.interaction_step_id,
    asserted_at: now,
    assertion_ids: createdAssertions.map((item) => item.assertion_id)
  });

  return {
    ok: true,
    runtimeState: next,
    assertions: createdAssertions,
    projections,
    step_state: stepState
  };
}

export function userModeEligible(presentation, receiptLedger = { receipts: [] }) {
  if (!presentation || presentation.draft_state !== "active") return false;
  const approvals = presentation.approvals || {};
  const axes = ["legal", "ux", "accessibility"];
  for (const axis of axes) {
    const record = approvals[axis];
    if (!record || record.state !== "approved" || !record.receipt_id) return false;
    if (typeof record.reviewer === "string" && record.reviewer.startsWith("owner-pending")) {
      return false;
    }
    const found = (receiptLedger.receipts || []).find(
      (receipt) =>
        receipt.receipt_id === record.receipt_id &&
        receipt.axis === axis &&
        receipt.presentation_id === presentation.presentation_id &&
        receipt.state === "approved"
    );
    if (!found) return false;
  }
  return approvals.source_binding?.state === "current";
}

export function opaqueStepToken(interactionStepId, salt = "sfl-app") {
  let hash = 0;
  const input = `${salt}:${interactionStepId}`;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return `step_${hash.toString(16)}`;
}
