#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`Source catalog check failed: ${message}`);
  process.exit(1);
};

const readJson = (filePath) => {
  if (!fs.existsSync(filePath)) fail(`missing ${filePath}`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${filePath}: ${error.message}`);
  }
};

const registry = readJson('sources/source-registry.json');
const snapshot = registry.snapshots?.find((item) => item.snapshot_id === registry.current_snapshot_id);
if (!snapshot) fail('current_snapshot_id does not resolve to a snapshot');

for (const key of ['snapshot_id', 'source_date', 'captured_at', 'sha256', 'freshness_state', 'authority_state']) {
  if (!snapshot[key]) fail(`current snapshot missing ${key}`);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.source_date)) fail('source_date must use YYYY-MM-DD');
if (!/^\d{4}-\d{2}-\d{2}T/.test(snapshot.captured_at)) fail('captured_at must use an ISO timestamp');
if (!/^[a-f0-9]{64}$/.test(snapshot.sha256)) fail('sha256 must contain 64 lowercase hexadecimal characters');
if (!String(registry.display_rule || '').includes('freshness_state')) fail('registry display_rule must expose freshness_state');

const indexPath = 'sources/jcc-kit-3j/2026-03-30/forms-index.json';
const index = readJson(indexPath);
if (index.snapshot_id !== snapshot.snapshot_id) fail('form index snapshot mismatch');
if (index.source_sha256 !== snapshot.sha256) fail('form index hash mismatch');
if (index.source_date !== snapshot.source_date) fail('form index source date mismatch');
if (index.forms_included?.length !== 6) fail('expected six forms physically included in Kit #3J');
if (!index.referenced_not_included?.length) fail('missing companion forms must remain explicit');
if (!index.source_discrepancies?.length) fail('source discrepancies must remain explicit');

const expectedCounts = new Map([
  ['fam-pd-7-2', 71],
  ['form-10-3-draft-order', 24],
  ['form-10-3-child-support-order', 51],
  ['form-15-8b', 54],
  ['form-12-3', 27],
  ['fam-pd-7-5', 40]
]);

let total = 0;
for (const indexedForm of index.forms_included) {
  if (indexedForm.catalog_status !== 'line_items_captured') fail(`${indexedForm.form_id} is not marked line_items_captured`);
  const formPath = path.join('sources/jcc-kit-3j/2026-03-30/forms', `${indexedForm.form_id}.json`);
  const form = readJson(formPath);
  if (form.form_id !== indexedForm.form_id) fail(`${formPath} form_id mismatch`);
  if (form.snapshot_id !== snapshot.snapshot_id) fail(`${form.form_id} snapshot mismatch`);
  if (form.source_sha256 !== snapshot.sha256) fail(`${form.form_id} hash mismatch`);
  if (form.source_date !== snapshot.source_date) fail(`${form.form_id} source date mismatch`);
  if (!Array.isArray(form.line_items)) fail(`${form.form_id} line_items is not an array`);
  if (form.line_item_count !== form.line_items.length) fail(`${form.form_id} line_item_count mismatch`);
  if (form.line_items.length !== expectedCounts.get(form.form_id)) fail(`${form.form_id} expected ${expectedCounts.get(form.form_id)} line items, found ${form.line_items.length}`);

  const ids = new Set();
  for (const item of form.line_items) {
    for (const key of ['line_item_id', 'source_label', 'kind', 'required_rule']) {
      if (!item[key]) fail(`${form.form_id} has line item missing ${key}`);
    }
    if (ids.has(item.line_item_id)) fail(`${form.form_id} duplicate line_item_id ${item.line_item_id}`);
    ids.add(item.line_item_id);
  }
  total += form.line_items.length;
}

if (total !== 267) fail(`expected 267 captured line items, found ${total}`);

const sourceStandard = fs.readFileSync('docs/source-materials/source-capture-and-freshness-standard-v1.md', 'utf8');
for (const phrase of ['Form source date', 'Captured by this application', 'Freshness state', 'Last official verification date']) {
  if (!sourceStandard.includes(phrase)) fail(`freshness standard missing user-facing requirement: ${phrase}`);
}

console.log(`Source catalog check passed: ${index.forms_included.length} forms, ${total} line items, snapshot ${snapshot.snapshot_id}.`);
