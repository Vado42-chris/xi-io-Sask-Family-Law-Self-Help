#!/usr/bin/env node
import fs from 'node:fs';

const fail = (message) => {
  console.error(`Recovery source check failed: ${message}`);
  process.exit(1);
};

const readJson = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`cannot parse ${path}: ${error.message}`);
  }
};

const requiredPaths = [
  'docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md',
  'docs/ops/SFL-KIT-4A-SCOPE-RECOVERY-001.md',
  'docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md',
  'docs/architecture/multi-kit-source-registry-v1.md',
  'sources/intake/index.json',
  'sources/intake/kit-4a/2023-04-10/source-intake.json',
  'sources/intake/kit-4a/2023-04-10/form-15-47-schedule-matrix.json'
];

for (const path of requiredPaths) {
  if (!fs.existsSync(path)) fail(`missing recovery artifact ${path}`);
}

const intakeIndex = readJson('sources/intake/index.json');
const sourceIntake = readJson('sources/intake/kit-4a/2023-04-10/source-intake.json');
const matrix = readJson('sources/intake/kit-4a/2023-04-10/form-15-47-schedule-matrix.json');
const canonicalRegistry = readJson('sources/source-registry.json');

if (intakeIndex.runtime_truth !== false) fail('intake registry must explicitly be non-runtime truth');
const indexRecord = intakeIndex.records?.find((record) => record.snapshot_intake_id === 'kit-4a-2023-04-10');
if (!indexRecord) fail('Kit #4a intake record is missing from sources/intake/index.json');
if (indexRecord.runtime_admissible !== false) fail('Kit #4a intake must not be runtime-admissible');
if (indexRecord.canonical_snapshot_id !== null) fail('Kit #4a intake must not claim canonical promotion');

const source = sourceIntake.source_identity;
if (!source) fail('source_identity is missing');
if (source.source_date !== '2023-04-10') fail('unexpected Kit #4a source date');
if (source.sha256 !== 'c73537d34d1c9b00b518e7b15645cab2a6cf8ee3431a27b822a3c324ef255ade') fail('Kit #4a SHA-256 drifted from recovery evidence');
if (source.size_bytes !== 160117) fail('Kit #4a byte size drifted from recovery evidence');
if (source.page_count_reported !== 44) fail('Kit #4a page count must remain 44 for this supplied artifact');
if (source.official_currentness_verified !== false) fail('Kit #4a currentness must remain unverified until independent official comparison');
if (!String(source.original_artifact_state).includes('not_archived')) fail('source intake must expose that the exact binary is not archived in Git');

const forms = sourceIntake.forms_physically_included ?? [];
const expectedForms = new Set(['form-13-31', 'form-15-47', 'form-15-8b', 'form-12-3']);
if (forms.length !== expectedForms.size) fail(`expected 4 physically included forms, found ${forms.length}`);
for (const formId of expectedForms) {
  if (!forms.some((form) => form.form_id === formId)) fail(`missing physically included form ${formId}`);
}

const sourceSchedules = sourceIntake.financial_statement_schedules ?? [];
if (sourceSchedules.length !== 7) fail(`expected 7 Form 15-47 schedules, found ${sourceSchedules.length}`);

if (matrix.record_status !== 'machine_extracted_unreviewed') fail('matrix must remain explicitly unreviewed');
if (matrix.legal_currentness_verified !== false) fail('matrix must not claim legal currentness');
if (matrix.review_required !== true) fail('matrix must require review');
if (matrix.schedules?.length !== 7) fail(`matrix expected 7 schedules, found ${matrix.schedules?.length ?? 0}`);
if (matrix.rows?.length !== 42) fail(`matrix expected 42 situation rows, found ${matrix.rows?.length ?? 0}`);

const scheduleIds = new Set(matrix.schedules.map((schedule) => schedule.schedule_id));
const rowNumbers = new Set();
const stableIds = new Set();
for (const row of matrix.rows) {
  if (!Number.isInteger(row.row_number) || row.row_number < 1 || row.row_number > 42) fail(`invalid row number ${row.row_number}`);
  if (rowNumbers.has(row.row_number)) fail(`duplicate row number ${row.row_number}`);
  rowNumbers.add(row.row_number);
  if (!row.stable_id) fail(`row ${row.row_number} missing stable_id`);
  if (stableIds.has(row.stable_id)) fail(`duplicate stable_id ${row.stable_id}`);
  stableIds.add(row.stable_id);
  if (!row.source_text) fail(`row ${row.row_number} missing source_text`);
  if (row.review_state !== 'pending') fail(`row ${row.row_number} must remain pending until independent review`);
  if (!Array.isArray(row.required_schedules) || row.required_schedules.length === 0) fail(`row ${row.row_number} has no captured schedule selection`);
  for (const scheduleId of row.required_schedules) {
    if (!scheduleIds.has(scheduleId)) fail(`row ${row.row_number} references unknown ${scheduleId}`);
  }
}
for (let rowNumber = 1; rowNumber <= 42; rowNumber += 1) {
  if (!rowNumbers.has(rowNumber)) fail(`missing matrix row ${rowNumber}`);
}

const requiredDiscrepancies = new Set([
  'kit-4a-disc-001',
  'kit-4a-disc-002',
  'kit-4a-disc-003',
  'kit-4a-disc-004',
  'kit-4a-disc-005',
  'kit-4a-disc-006'
]);
for (const discrepancyId of requiredDiscrepancies) {
  if (!sourceIntake.source_discrepancies?.some((item) => item.discrepancy_id === discrepancyId)) {
    fail(`missing required source discrepancy ${discrepancyId}`);
  }
}
const filingStage = sourceIntake.source_derived_workflow_stages?.find((stage) => stage.stage_id === 'kit-4a.filing');
if (!filingStage || filingStage.state !== 'blocked_by_source_discrepancy') fail('filing stage must remain blocked by source discrepancy');

const crossSnapshot = sourceIntake.cross_snapshot_relationships ?? [];
for (const formId of ['form-15-8b', 'form-12-3']) {
  const relationship = crossSnapshot.find((item) => item.local_form_id === formId && item.other_snapshot_id === 'jcc-kit-3j-2026-03-30');
  if (!relationship || relationship.relationship !== 'candidate_equivalent_unverified') {
    fail(`${formId} must remain candidate_equivalent_unverified across Kit #4a and Kit #3J`);
  }
}

if (canonicalRegistry.current_snapshot_id !== 'jcc-kit-3j-2026-03-30') {
  fail('recovery branch must not silently promote Kit #4a through the legacy global current_snapshot_id');
}
if (canonicalRegistry.snapshots?.some((snapshot) => snapshot.snapshot_id === 'kit-4a-2023-04-10')) {
  fail('Kit #4a must remain in intake until canonical source admission is reviewed');
}

console.log('Recovery source check passed.');
console.log(`Kit #4a: ${forms.length} included forms identified, ${matrix.schedules.length} Form 15-47 schedules, ${matrix.rows.length} situation rows.`);
console.log(`Recorded material/review discrepancies: ${sourceIntake.source_discrepancies.length}.`);
console.log('Kit #4a remains unreviewed, currentness-unverified, and not runtime-admissible by design.');
