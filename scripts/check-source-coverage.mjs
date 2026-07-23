import { readdirSync, readFileSync } from "node:fs";
import process from "node:process";

const formsDir = "sources/jcc-kit-3j/2026-03-30/forms";
const expectedFormCount = 6;
const expectedLineItemCount = 267;
const supportedRulePrefixes = [
  "always",
  "optional",
  "display_only",
  "court_only",
  "conditional:",
  "conditional_or_optional:"
];

const failures = [];
const files = readdirSync(formsDir)
  .filter((name) => name.endsWith(".json"))
  .sort();

if (files.length !== expectedFormCount) {
  failures.push(`Expected ${expectedFormCount} form catalogs, found ${files.length}.`);
}

const summary = {
  forms: [],
  totals: {
    line_items: 0,
    kinds: {},
    rules: {},
    unresolved_rules: 0,
    user_answerable: 0,
    display_only: 0,
    court_only: 0
  }
};

function increment(bucket, key) {
  bucket[key] = (bucket[key] || 0) + 1;
}

function classifyRule(rule) {
  if (rule === "always") return "always";
  if (rule === "optional") return "optional";
  if (rule === "display_only") return "display_only";
  if (rule === "court_only") return "court_only";
  if (rule.startsWith("conditional:")) return "conditional";
  if (rule.startsWith("conditional_or_optional:")) return "conditional_or_optional";
  return "unsupported";
}

for (const file of files) {
  const catalog = JSON.parse(readFileSync(`${formsDir}/${file}`, "utf8"));
  const items = Array.isArray(catalog.line_items) ? catalog.line_items : [];
  const formSummary = {
    form_id: catalog.form_id,
    official_number: catalog.official_number,
    line_items: items.length,
    kinds: {},
    rules: {},
    unresolved_rules: []
  };

  if (!catalog.form_id) failures.push(`${file} is missing form_id.`);
  if (!catalog.official_number) failures.push(`${file} is missing official_number.`);
  if (!catalog.title) failures.push(`${file} is missing title.`);
  if (catalog.line_item_count !== items.length) {
    failures.push(`${file} line_item_count ${catalog.line_item_count} does not match ${items.length} actual items.`);
  }

  const seenIds = new Set();
  for (const [index, item] of items.entries()) {
    const ref = `${catalog.form_id || file} item ${index + 1}`;
    if (!item.line_item_id) failures.push(`${ref} is missing line_item_id.`);
    if (seenIds.has(item.line_item_id)) failures.push(`${ref} duplicates ${item.line_item_id}.`);
    seenIds.add(item.line_item_id);
    if (!item.source_label || !String(item.source_label).trim()) failures.push(`${ref} is missing source_label.`);
    if (!item.kind || !String(item.kind).trim()) failures.push(`${ref} is missing kind.`);
    if (!item.required_rule || !String(item.required_rule).trim()) failures.push(`${ref} is missing required_rule.`);

    const rule = String(item.required_rule || "");
    const ruleClass = classifyRule(rule);
    if (!supportedRulePrefixes.some((prefix) => rule === prefix || rule.startsWith(prefix))) {
      failures.push(`${ref} uses unsupported required_rule: ${rule}`);
    }

    increment(formSummary.kinds, item.kind || "missing");
    increment(formSummary.rules, ruleClass);
    increment(summary.totals.kinds, item.kind || "missing");
    increment(summary.totals.rules, ruleClass);

    if (ruleClass === "display_only") summary.totals.display_only += 1;
    else if (ruleClass === "court_only") summary.totals.court_only += 1;
    else summary.totals.user_answerable += 1;

    if (ruleClass === "conditional_or_optional") {
      summary.totals.unresolved_rules += 1;
      formSummary.unresolved_rules.push({
        line_item_id: item.line_item_id,
        required_rule: rule
      });
    }
  }

  summary.totals.line_items += items.length;
  summary.forms.push(formSummary);
}

if (summary.totals.line_items !== expectedLineItemCount) {
  failures.push(`Expected ${expectedLineItemCount} total line items, found ${summary.totals.line_items}.`);
}

if (summary.totals.unresolved_rules < 1) {
  failures.push("Expected at least one preserved unresolved conditional_or_optional rule.");
}

if (failures.length) {
  console.error("Source coverage audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Source coverage audit passed.");
console.log(JSON.stringify(summary, null, 2));
console.log("This confirms catalog coverage and vocabulary consistency only, not legal accuracy, source freshness, or independent page-level review.");