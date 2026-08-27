#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const BASE = path.join('sources', 'intake', 'form-13-31', '2025');
const INTAKE_ID = 'form-13-31-official-2025-verified-2026-08-27';

const fail = (message) => {
  console.error(`Form 13-31 source check failed: ${message}`);
  process.exit(1);
};

const readJson = (relativePath) => {
  if (!fs.existsSync(relativePath)) fail(`missing ${relativePath}`);
  try {
    return JSON.parse(fs.readFileSync(relativePath, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
  }
};

const uniqueRequired = (rows, idKey, requiredKeys, label) => {
  if (!Array.isArray(rows)) fail(`${label} must be an array`);
  const ids = new Set();
  for (const row of rows) {
    for (const key of [idKey, ...requiredKeys]) {
      if (!row?.[key]) fail(`${label} row missing ${key}`);
    }
    if (ids.has(row[idKey])) fail(`${label} duplicate ${idKey} ${row[idKey]}`);
    ids.add(row[idKey]);
  }
  return ids;
};

const intake = readJson(path.join(BASE, 'official-source-intake.json'));
const form = readJson(path.join(BASE, 'form-13-31-line-items.json'));
const rules = readJson(path.join(BASE, 'rule-13-31-requirements.json'));
const matrix = readJson(path.join(BASE, 'qualification-matrix.json'));
const intakeIndex = readJson(path.join('sources', 'intake', 'index.json'));

if (intake.snapshot_intake_id !== INTAKE_ID) fail('official intake identity mismatch');
if (form.source_intake_id !== INTAKE_ID) fail('form catalog intake identity mismatch');
if (rules.source_intake_id !== INTAKE_ID) fail('rule catalog intake identity mismatch');
if (matrix.source_intake_id !== INTAKE_ID) fail('qualification matrix intake identity mismatch');

if (intake.private_matter_data !== false || matrix.private_matter_data !== 0) {
  fail('private matter data boundary must remain zero/false');
}
if (intake.runtime_admissible !== false || form.runtime_admissible !== false || rules.runtime_admissible !== false) {
  fail('source-review slice must remain runtime-inadmissible');
}
if (intake.canonical_snapshot_id !== null) fail('intake must not claim canonical promotion');

if (!Array.isArray(intake.sources) || intake.sources.length !== 2) fail('expected exactly two official source records');
const sourceIds = uniqueRequired(intake.sources, 'source_id', ['source_title', 'authority_class', 'url', 'provider_read_state'], 'official source');
for (const expected of ['sask-courts-affidavit-guide-2025', 'sask-kb-rules-part-13']) {
  if (!sourceIds.has(expected)) fail(`missing official source ${expected}`);
}
for (const source of intake.sources) {
  if (!String(source.url).startsWith('https://')) fail(`${source.source_id} must use an https official source URL`);
  if (source.exact_binary_archived_in_repo !== false) fail(`${source.source_id} binary custody must remain false until exact bytes are archived`);
  if (source.exact_binary_sha256 !== null) fail(`${source.source_id} must not claim a binary hash before exact custody`);
  if (!source.binary_archive_blocker) fail(`${source.source_id} must preserve the binary-custody blocker`);
}

if (form.form_id !== 'form-13-31' || form.official_number !== 'Form 13-31') fail('Form 13-31 catalog identity mismatch');
const formIds = uniqueRequired(form.line_items, 'line_item_id', ['source_label', 'kind', 'required_rule'], 'form line item');
if (form.line_item_count !== formIds.size || formIds.size !== 23) fail(`expected 23 unique form line items, found ${formIds.size}`);

if (rules.rule_id !== 'kb-rule-13-31') fail('Rule 13-31 catalog identity mismatch');
const ruleIds = uniqueRequired(rules.requirements, 'requirement_id', ['citation', 'requirement', 'kind'], 'rule requirement');
if (rules.requirement_count !== ruleIds.size || ruleIds.size !== 12) fail(`expected 12 unique rule requirements, found ${ruleIds.size}`);

const q = matrix.quantitative || {};
const expectedQuant = [
  ['official_source_records', 'captured', 2, 2, 'PASS_BOUNDED'],
  ['form_line_items', 'captured', 23, 23, 'PASS_BOUNDED'],
  ['rule_requirements', 'captured', 12, 12, 'PASS_BOUNDED'],
  ['rendered_form_pages_reviewed', 'reviewed', 1, 1, 'PASS_BOUNDED'],
  ['exact_official_binaries_archived', 'archived', 2, 0, 'BLOCKED_PROVIDER_SURFACE'],
  ['independent_second_reviews', 'completed', 1, 0, 'OPEN'],
  ['human_or_delegated_approvals', 'completed', 1, 0, 'OPEN'],
];
for (const [key, valueKey, expected, actual, state] of expectedQuant) {
  const row = q[key];
  if (!row) fail(`qualification matrix missing ${key}`);
  if (row.expected !== expected || row[valueKey] !== actual || row.state !== state) {
    fail(`qualification matrix drift for ${key}`);
  }
}

if (matrix.qualitative?.binary_custody !== 'BLOCKED_PROVIDER_SURFACE') fail('binary custody must fail closed');
if (matrix.qualitative?.canonical_promotion !== 'BLOCKED') fail('canonical promotion must remain blocked');
if (matrix.qualitative?.runtime_admissibility !== 'BLOCKED') fail('runtime admissibility must remain blocked');
if (matrix.qualitative?.transmission_authority !== 'NONE') fail('transmission authority must remain NONE');
if (matrix.terminal_predicate?.state !== 'FALSE') fail('terminal predicate must remain FALSE');

const indexRecord = intakeIndex.records?.find((row) => row.snapshot_intake_id === INTAKE_ID);
if (!indexRecord) fail('sources/intake/index.json does not register Form 13-31 intake');
if (indexRecord.intake_path !== 'sources/intake/form-13-31/2025/official-source-intake.json') fail('intake index path mismatch');
if (indexRecord.runtime_admissible !== false || indexRecord.canonical_snapshot_id !== null) fail('intake index must remain noncanonical/runtime-inadmissible');
if (!Array.isArray(indexRecord.blockers) || indexRecord.blockers.length < 4) fail('intake index must retain explicit blockers');

for (const relativePath of [intake.form_catalog_path, intake.rule_catalog_path, intake.review_receipt_path]) {
  if (!relativePath || !fs.existsSync(relativePath)) fail(`registered source-review path missing: ${relativePath}`);
}

console.log(JSON.stringify({
  check: 'SFL_FORM13_31_SOURCE_REVIEW_001',
  pass: true,
  source_intake_id: INTAKE_ID,
  official_sources: intake.sources.length,
  form_line_items: formIds.size,
  rule_requirements: ruleIds.size,
  rendered_first_review: 1,
  exact_official_binaries_archived: 0,
  independent_second_reviews: 0,
  approvals: 0,
  private_matter_data: 0,
  canonical_promotion: false,
  runtime_admissible: false,
  transmission_authority: 'NONE',
}, null, 2));
