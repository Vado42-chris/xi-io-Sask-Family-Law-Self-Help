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
  'docs/ops/SFL-OWNER-MAILBOX-SOURCE-DISCOVERY-001.md',
  'docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md',
  'docs/architecture/multi-kit-source-registry-v1.md',
  'sources/intake/index.json',
  'sources/intake/kit-2a/2023-04-10/source-intake.json',
  'sources/intake/kit-4a/2023-04-10/source-intake.json',
  'sources/intake/kit-4a/2023-04-10/form-15-47-schedule-matrix.json',
  'sources/intake/form-15-52/undated/source-intake.json'
];

for (const path of requiredPaths) {
  if (!fs.existsSync(path)) fail(`missing recovery artifact ${path}`);
}

const intakeIndex = readJson('sources/intake/index.json');
const kit2a = readJson('sources/intake/kit-2a/2023-04-10/source-intake.json');
const kit4a = readJson('sources/intake/kit-4a/2023-04-10/source-intake.json');
const matrix = readJson('sources/intake/kit-4a/2023-04-10/form-15-47-schedule-matrix.json');
const form1552 = readJson('sources/intake/form-15-52/undated/source-intake.json');
const canonicalRegistry = readJson('sources/source-registry.json');

if (intakeIndex.runtime_truth !== false) fail('intake registry must explicitly be non-runtime truth');

const requiredIndexRecords = [
  'kit-2a-2023-04-10',
  'kit-4a-2023-04-10',
  'form-15-52-undated-owner-mailbox'
];
for (const intakeId of requiredIndexRecords) {
  const record = intakeIndex.records?.find((item) => item.snapshot_intake_id === intakeId);
  if (!record) fail(`${intakeId} is missing from sources/intake/index.json`);
  if (record.runtime_admissible !== false) fail(`${intakeId} must not be runtime-admissible`);
  if (record.canonical_snapshot_id !== null) fail(`${intakeId} must not claim canonical promotion`);
}

const requireUnreviewedIdentity = (record, expected) => {
  if (record.record_status !== 'intake_unreviewed_not_runtime_truth') fail(`${expected.label} must remain unreviewed intake`);
  const source = record.source_identity;
  if (!source) fail(`${expected.label} source_identity is missing`);
  if (source.sha256 !== expected.sha256) fail(`${expected.label} SHA-256 drifted from recovery evidence`);
  if (source.size_bytes !== expected.size) fail(`${expected.label} byte size drifted from recovery evidence`);
  if (source.page_count_reported !== expected.pages) fail(`${expected.label} page count drifted from recovery evidence`);
  if (source.official_currentness_verified !== false) fail(`${expected.label} must remain currentness-unverified`);
  if (!String(source.original_artifact_state).includes('not_archived')) fail(`${expected.label} must expose that the exact binary is not archived in Git`);
};

requireUnreviewedIdentity(kit2a, {
  label: 'Kit #2a',
  sha256: '7f7bb360d65cd0361e97f3943c53cdf83ec87dab4805ae266721c96662d250ac',
  size: 255694,
  pages: 66
});
if (kit2a.source_identity.source_date !== '2023-04-10') fail('unexpected Kit #2a source date');
const kit2aExpectedForms = new Set([
  'form-15-19b',
  'form-15-19a',
  'form-15-20',
  'form-15-51',
  'form-15-47',
  'form-15-49',
  'form-15-8b',
  'form-15-8a',
  'form-12-3'
]);
const kit2aForms = kit2a.forms_physically_included ?? [];
if (kit2aForms.length !== kit2aExpectedForms.size) fail(`Kit #2a expected 9 included forms, found ${kit2aForms.length}`);
for (const formId of kit2aExpectedForms) {
  if (!kit2aForms.some((form) => form.form_id === formId)) fail(`Kit #2a missing included form ${formId}`);
}
for (const discrepancyId of ['kit-2a-disc-001', 'kit-2a-disc-002', 'kit-2a-disc-003']) {
  if (!kit2a.source_discrepancies?.some((item) => item.discrepancy_id === discrepancyId)) fail(`Kit #2a missing discrepancy ${discrepancyId}`);
}
const proofRule = kit2a.source_derived_workflow_rules?.find((rule) => rule.rule_id === 'kit-2a.proof-service-001');
if (!proofRule || proofRule.state !== 'blocked_by_source_discrepancy') fail('Kit #2a proof-of-service normalization must remain blocked');

requireUnreviewedIdentity(kit4a, {
  label: 'Kit #4a',
  sha256: 'c73537d34d1c9b00b518e7b15645cab2a6cf8ee3431a27b822a3c324ef255ade',
  size: 160117,
  pages: 44
});
if (kit4a.source_identity.source_date !== '2023-04-10') fail('unexpected Kit #4a source date');
const kit4aExpectedForms = new Set(['form-13-31', 'form-15-47', 'form-15-8b', 'form-12-3']);
const kit4aForms = kit4a.forms_physically_included ?? [];
if (kit4aForms.length !== kit4aExpectedForms.size) fail(`Kit #4a expected 4 included forms, found ${kit4aForms.length}`);
for (const formId of kit4aExpectedForms) {
  if (!kit4aForms.some((form) => form.form_id === formId)) fail(`Kit #4a missing included form ${formId}`);
}

const sourceSchedules = kit4a.financial_statement_schedules ?? [];
if (sourceSchedules.length !== 7) fail(`Kit #4a expected 7 Form 15-47 schedules, found ${sourceSchedules.length}`);
if (matrix.record_status !== 'machine_extracted_unreviewed') fail('Kit #4a matrix must remain explicitly unreviewed');
if (matrix.legal_currentness_verified !== false) fail('Kit #4a matrix must not claim legal currentness');
if (matrix.review_required !== true) fail('Kit #4a matrix must require review');
if (matrix.schedules?.length !== 7) fail(`Kit #4a matrix expected 7 schedules, found ${matrix.schedules?.length ?? 0}`);
if (matrix.rows?.length !== 42) fail(`Kit #4a matrix expected 42 situation rows, found ${matrix.rows?.length ?? 0}`);

const scheduleIds = new Set(matrix.schedules.map((schedule) => schedule.schedule_id));
const rowNumbers = new Set();
const stableIds = new Set();
for (const row of matrix.rows) {
  if (!Number.isInteger(row.row_number) || row.row_number < 1 || row.row_number > 42) fail(`invalid Kit #4a matrix row number ${row.row_number}`);
  if (rowNumbers.has(row.row_number)) fail(`duplicate Kit #4a matrix row number ${row.row_number}`);
  rowNumbers.add(row.row_number);
  if (!row.stable_id) fail(`Kit #4a row ${row.row_number} missing stable_id`);
  if (stableIds.has(row.stable_id)) fail(`duplicate Kit #4a stable_id ${row.stable_id}`);
  stableIds.add(row.stable_id);
  if (!row.source_text) fail(`Kit #4a row ${row.row_number} missing source_text`);
  if (row.review_state !== 'pending') fail(`Kit #4a row ${row.row_number} must remain pending until independent review`);
  if (!Array.isArray(row.required_schedules) || row.required_schedules.length === 0) fail(`Kit #4a row ${row.row_number} has no captured schedule selection`);
  for (const scheduleId of row.required_schedules) {
    if (!scheduleIds.has(scheduleId)) fail(`Kit #4a row ${row.row_number} references unknown ${scheduleId}`);
  }
}
for (let rowNumber = 1; rowNumber <= 42; rowNumber += 1) {
  if (!rowNumbers.has(rowNumber)) fail(`Kit #4a matrix missing row ${rowNumber}`);
}
for (const discrepancyId of ['kit-4a-disc-001','kit-4a-disc-002','kit-4a-disc-003','kit-4a-disc-004','kit-4a-disc-005','kit-4a-disc-006']) {
  if (!kit4a.source_discrepancies?.some((item) => item.discrepancy_id === discrepancyId)) fail(`Kit #4a missing discrepancy ${discrepancyId}`);
}
const filingStage = kit4a.source_derived_workflow_stages?.find((stage) => stage.stage_id === 'kit-4a.filing');
if (!filingStage || filingStage.state !== 'blocked_by_source_discrepancy') fail('Kit #4a filing stage must remain blocked by source discrepancy');

requireUnreviewedIdentity(form1552, {
  label: 'Form 15-52',
  sha256: '9ec454f420f15845f99968b0d0ab43c78ff54a74cbe514fd2f4db434bbc0c389',
  size: 24668,
  pages: 4
});
if (form1552.source_identity.source_date !== null) fail('Form 15-52 must not invent a source revision date');
if (form1552.request_choices?.length !== 16) fail(`Form 15-52 expected 16 captured request choices, found ${form1552.request_choices?.length ?? 0}`);
if (!form1552.source_derived_rule_inventory?.some((rule) => rule.rule_id === 'form-15-52.rule-003' && rule.source_meaning.includes('30-day'))) {
  fail('Form 15-52 supplied 30-day response rule must remain captured and currentness-blocked');
}

const kit4aCrossSnapshot = kit4a.cross_snapshot_relationships ?? [];
for (const formId of ['form-15-8b', 'form-12-3']) {
  const relationship = kit4aCrossSnapshot.find((item) => item.local_form_id === formId && item.other_snapshot_id === 'jcc-kit-3j-2026-03-30');
  if (!relationship || relationship.relationship !== 'candidate_equivalent_unverified') fail(`${formId} must remain candidate_equivalent_unverified across Kit #4a and Kit #3J`);
}

if (canonicalRegistry.current_snapshot_id !== 'jcc-kit-3j-2026-03-30') fail('recovery branch must not silently promote intake sources through the legacy global current_snapshot_id');
for (const forbiddenSnapshotId of ['kit-2a-2023-04-10', 'kit-4a-2023-04-10', 'form-15-52-undated-owner-mailbox']) {
  if (canonicalRegistry.snapshots?.some((snapshot) => snapshot.snapshot_id === forbiddenSnapshotId)) fail(`${forbiddenSnapshotId} must remain intake until canonical source admission is reviewed`);
}

console.log('Recovery source check passed.');
console.log(`Kit #2a: ${kit2aForms.length} included forms identified, workflow rules captured as unreviewed intake.`);
console.log(`Kit #4a: ${kit4aForms.length} included forms identified, ${matrix.schedules.length} Form 15-47 schedules, ${matrix.rows.length} situation rows.`);
console.log(`Form 15-52: ${form1552.request_choices.length} request choices captured with supplied rule text, source date still unknown.`);
console.log('All recovery intakes remain unreviewed, currentness-unverified, and not runtime-admissible by design.');
