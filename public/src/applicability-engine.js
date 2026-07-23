const APPLICABLE_RULES = new Set(["always", "optional", "display_only", "court_only"]);
const NON_ANSWERABLE_RULES = new Set(["display_only", "court_only"]);

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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Compare catalog condition tokens to stored answers.
 * Source catalogs often encode short codes (served, fixed_monthly) while
 * choice options store the full official label. Exact match remains preferred.
 */
export function valuesEqual(actual, expected) {
  const left = normalizeScalar(actual);
  const right = normalizeScalar(expected);
  if (left === right) return true;
  if (typeof left !== "string" || typeof right !== "string") return false;

  const actualText = left.trim().toLowerCase();
  const expectedRaw = right.trim().toLowerCase();
  const expectedSpaced = expectedRaw.replaceAll("_", " ");

  if (actualText === expectedSpaced) return true;

  if (expectedRaw === "not_served" || expectedSpaced === "not served") {
    return /\bnot\b.{0,40}\bserved\b/i.test(actualText);
  }
  if (expectedRaw === "served") {
    return /\bserved\b/i.test(actualText) && !/\bnot\b.{0,40}\bserved\b/i.test(actualText);
  }
  if (expectedRaw === "scheduled") {
    return /\bscheduled\b/i.test(actualText)
      && !/\bscheduled yet\b/i.test(actualText)
      && !/^no\b/i.test(actualText)
      && !/^not\b/i.test(actualText);
  }
  if (expectedRaw === "changes") {
    return /^changes\b/i.test(actualText);
  }
  if (expectedRaw === "adult_person") {
    return /^adult\b/i.test(actualText);
  }
  if (expectedRaw === "law_office") {
    return /\b(lawyer|law)\s+office\b/i.test(actualText);
  }
  if (expectedRaw === "other_party") {
    return /^other party\b/i.test(actualText);
  }
  if (expectedRaw === "lawyer") {
    return /\blawyer\b/i.test(actualText) && !/^other party\b/i.test(actualText);
  }

  if (expectedRaw.includes("_")) {
    const tokens = expectedRaw.split("_").filter(Boolean);
    if (tokens.every((token) => new RegExp(`\\b${escapeRegExp(token)}\\b`, "i").test(actualText) || actualText.includes(token))) {
      return true;
    }
  }

  if (!expectedRaw.includes(" ") && !expectedRaw.includes("_") && expectedRaw.length >= 4) {
    if (!new RegExp(`\\b${escapeRegExp(expectedRaw)}\\b`, "i").test(actualText)) return false;
    // Avoid "Scheduled" matching "Not scheduled".
    if (/^not\b/i.test(actualText) && !/^not\b/i.test(expectedRaw)) return false;
    return true;
  }

  if (expectedSpaced.includes(" ")) {
    let cursor = 0;
    for (const word of expectedSpaced.split(/\s+/)) {
      const found = actualText.indexOf(word, cursor);
      if (found < 0) return false;
      cursor = found + word.length;
    }
    return true;
  }

  return false;
}

export function createRuleContext({ answers = {}, derivedFacts = {} } = {}) {
  const context = { ...derivedFacts };

  for (const [formId, formAnswers] of Object.entries(answers)) {
    if (!formAnswers || typeof formAnswers !== "object") continue;
    context[formId] = formAnswers;
    for (const [lineItemId, value] of Object.entries(formAnswers)) {
      context[lineItemId] = value;
      // Catalogs often encode conditions with the trailing segment only
      // (request_type=response) while answers are stored under full IDs
      // (p1.request_type). Index both forms.
      const shortId = lineItemId.includes(".") ? lineItemId.slice(lineItemId.lastIndexOf(".") + 1) : lineItemId;
      if (!Object.prototype.hasOwnProperty.call(context, shortId)) {
        context[shortId] = value;
      }
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
  const equal = valuesEqual(actual, expected);

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

  if (APPLICABLE_RULES.has(rule)) {
    return {
      applicable: true,
      supported: true,
      obligation_resolved: true,
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
      obligation_resolved: result.supported,
      rule,
      reason: result.supported ? (result.matched ? "condition_matched" : "condition_not_matched") : result.reason,
      condition: result
    };
  }

  if (rule.startsWith("conditional_or_optional:")) {
    return {
      applicable: true,
      supported: true,
      obligation_resolved: false,
      rule,
      reason: "conditional_or_optional_requires_review",
      review_note: rule.slice("conditional_or_optional:".length).trim()
    };
  }

  return {
    applicable: false,
    supported: false,
    obligation_resolved: false,
    rule,
    reason: "unsupported_required_rule"
  };
}

export function evaluateLineItem(lineItem, context = {}) {
  const requiredRule = lineItem?.required_rule || "always";
  const evaluation = evaluateRequiredRule(requiredRule, context);
  return {
    line_item_id: lineItem?.line_item_id,
    kind: lineItem?.kind,
    required_rule: requiredRule,
    answerable: !NON_ANSWERABLE_RULES.has(requiredRule),
    authority: requiredRule === "court_only" ? "court" : "user_or_static",
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
    court_only_items: applicable.filter((item) => item.authority === "court").length,
    unresolved_obligation_items: applicable.filter((item) => !item.obligation_resolved).length,
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
