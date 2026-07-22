const ALWAYS_RULES = new Set(["always", "optional", "display_only"]);

export function normalizeScalar(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value;
  if (value === null || value === undefined) return value;

  const text = String(value).trim();
  if (/^(true|yes)$/i.test(text)) return true;
  if (/^(false|no)$/i.test(text)) return false;
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text);
  return text;
}

export function createRuleContext({ answers = {}, derivedFacts = {} } = {}) {
  const context = { ...derivedFacts };

  for (const [formId, formAnswers] of Object.entries(answers)) {
    if (!formAnswers || typeof formAnswers !== "object") continue;
    context[formId] = formAnswers;
    for (const [lineItemId, value] of Object.entries(formAnswers)) {
      context[lineItemId] = value;
    }
  }

  return context;
}

function readContextValue(context, path) {
  if (Object.prototype.hasOwnProperty.call(context, path)) return context[path];

  const segments = path.split(".");
  let value = context;
  for (const segment of segments) {
    if (value === null || value === undefined || typeof value !== "object") return undefined;
    value = value[segment];
  }
  return value;
}

export function evaluateCondition(expression, context = {}) {
  const match = String(expression || "").trim().match(/^([^!=]+?)\s*(=|!=)\s*(.+)$/);
  if (!match) {
    return {
      matched: false,
      supported: false,
      reason: "unsupported_condition_syntax",
      expression
    };
  }

  const [, rawPath, operator, rawExpected] = match;
  const path = rawPath.trim();
  const actual = normalizeScalar(readContextValue(context, path));
  const expected = normalizeScalar(rawExpected);
  const equal = actual === expected;

  return {
    matched: operator === "=" ? equal : !equal,
    supported: true,
    path,
    operator,
    actual,
    expected,
    expression
  };
}

export function evaluateRequiredRule(requiredRule, context = {}) {
  const rule = String(requiredRule || "always").trim();

  if (ALWAYS_RULES.has(rule)) {
    return {
      applicable: true,
      supported: true,
      rule,
      reason: rule
    };
  }

  if (rule.startsWith("conditional:")) {
    const expression = rule.slice("conditional:".length).trim();
    const result = evaluateCondition(expression, context);
    return {
      applicable: result.supported && result.matched,
      supported: result.supported,
      rule,
      reason: result.supported ? (result.matched ? "condition_matched" : "condition_not_matched") : result.reason,
      condition: result
    };
  }

  return {
    applicable: false,
    supported: false,
    rule,
    reason: "unsupported_required_rule"
  };
}

export function evaluateLineItem(lineItem, context = {}) {
  const evaluation = evaluateRequiredRule(lineItem?.required_rule, context);
  return {
    line_item_id: lineItem?.line_item_id,
    kind: lineItem?.kind,
    required_rule: lineItem?.required_rule,
    answerable: lineItem?.required_rule !== "display_only",
    ...evaluation
  };
}

export function evaluateFormCatalog(form, { answers = {}, derivedFacts = {} } = {}) {
  const context = createRuleContext({ answers, derivedFacts });
  const items = (form?.line_items || []).map((lineItem) => evaluateLineItem(lineItem, context));
  const unsupported = items.filter((item) => !item.supported);
  const applicable = items.filter((item) => item.applicable);
  const answerable = applicable.filter((item) => item.answerable);

  return {
    form_id: form?.form_id,
    total_line_items: items.length,
    applicable_line_items: applicable.length,
    applicable_answerable_items: answerable.length,
    unsupported_rule_count: unsupported.length,
    unsupported_rules: unsupported.map((item) => ({
      line_item_id: item.line_item_id,
      required_rule: item.required_rule,
      reason: item.reason
    })),
    items
  };
}

export function deriveMatterFacts(answers = {}) {
  const request = answers["fam-pd-7-2"] || {};
  return {
    support_claim: Boolean(request["p3.child_support_selected"] || request["p3.spousal_support_selected"]),
    parenting_or_child_support_claim: Boolean(request["p3.decision_making_selected"] || request["p3.parenting_time_selected"] || request["p3.child_support_selected"]),
    property_claim: Boolean(request["p3.property_selected"]),
    exemption_requested: Boolean(request["p14.exemption_requested"])
  };
}
