#!/usr/bin/env node
import fs from 'node:fs';

const LOCK_PATH = 'docs/source-materials/inbox-framework-component-promotion-lock-v1.json';
const MAP_PATH = 'docs/source-materials/inbox-framework-component-source-map-v1.json';

const fail = (message) => {
  console.error(`Framework component promotion lock check failed: ${message}`);
  process.exit(1);
};

const readJson = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`cannot parse ${path}: ${error.message}`);
  }
};

for (const path of [LOCK_PATH, MAP_PATH]) {
  if (!fs.existsSync(path)) fail(`missing required promotion artifact ${path}`);
}

const lock = readJson(LOCK_PATH);
const sourceMap = readJson(MAP_PATH);

if (lock.schema !== 'xiio.framework-component-promotion-lock.v1') fail(`unexpected lock schema ${lock.schema}`);
if (sourceMap.schema !== 'xiio.framework-component-source-map.v1') fail(`unexpected source-map schema ${sourceMap.schema}`);
if (lock.framework_ref_inspected !== sourceMap.framework?.ref) fail('framework refs differ between promotion lock and source map');
if (lock.donor_ref !== sourceMap.donor?.ref) fail('Inbox donor refs differ between promotion lock and source map');
if (lock.donor_repo !== sourceMap.donor?.repo) fail('Inbox donor repository differs between promotion lock and source map');

if (lock.canonical_claim_allowed !== false) fail('promotion lock must not claim canonical framework registry admission');
if (lock.runtime_adoption_allowed !== false) fail('promotion lock must not authorize runtime adoption');
if (lock.registry_write_state !== 'BLOCKED_BY_XIIO_306_R1_NAMESPACE_PRECEDENCE_GATE') fail('registry write blocker must remain explicit until framework R1 is accepted');
if (lock.promotion_state !== 'NAMES_AND_LINEAGE_LOCKED_FOR_FRAMEWORK_INTAKE_NOT_YET_CANONICAL_REGISTRY') fail('unexpected promotion state');

const expectedUiIds = [
  'app_shell',
  'lane_nav',
  'trust_cluster',
  'workbench_shell',
  'scope_lens',
  'work_list_controls',
  'selectable_work_list',
  'ui_action_registry',
  'context_control_cluster',
  'workspace_split',
  'trusted_content_reader',
  'context_inspector',
  'safe_action_bar',
  'progressive_action_lane',
  'draft_workspace',
  'source_evidence_block',
  'receipt_row',
  'receipt_ledger',
  'object_timeline',
  'status_token',
  'gate_panel',
  'progressive_empty_state',
  'selected_context_packet',
  'ibal_recommendation',
  'ui_geometry_accessibility_verifier'
];

const expectedCommunicationIds = [
  'communication_account_ref',
  'communication_event',
  'communication_source_record',
  'communication_attachment_manifest',
  'communication_ingress_pipeline',
  'communication_draft',
  'communication_egress_proposal',
  'communication_receipt'
];

const expectedSymbols = new Map([
  ['app_shell', 'XiAppShell'],
  ['lane_nav', 'XiLaneNav'],
  ['trust_cluster', 'XiTrustCluster'],
  ['workbench_shell', 'XiWorkbenchShell'],
  ['scope_lens', 'XiScopeLens'],
  ['work_list_controls', 'XiWorkListControls'],
  ['selectable_work_list', 'XiSelectableWorkList'],
  ['ui_action_registry', 'XiActionRegistry'],
  ['context_control_cluster', 'XiContextControls'],
  ['workspace_split', 'XiWorkspaceSplit'],
  ['trusted_content_reader', 'XiTrustedContentReader'],
  ['context_inspector', 'XiContextInspector'],
  ['safe_action_bar', 'XiSafeActionBar'],
  ['progressive_action_lane', 'XiProgressiveActionLane'],
  ['draft_workspace', 'XiDraftWorkspace'],
  ['source_evidence_block', 'XiSourceEvidenceBlock'],
  ['receipt_row', 'XiReceiptRow'],
  ['receipt_ledger', 'XiReceiptLedger'],
  ['object_timeline', 'XiObjectTimeline'],
  ['status_token', 'XiStatusToken'],
  ['gate_panel', 'XiGatePanel'],
  ['progressive_empty_state', 'XiEmptyState'],
  ['selected_context_packet', 'XiSelectedContext'],
  ['ibal_recommendation', 'XiIbalRecommendation'],
  ['ui_geometry_accessibility_verifier', 'XiUiGeometryAccessibilityVerifier'],
  ['communication_account_ref', 'XiCommunicationAccountRef'],
  ['communication_event', 'XiCommunicationEvent'],
  ['communication_source_record', 'XiCommunicationSourceRecord'],
  ['communication_attachment_manifest', 'XiCommunicationAttachmentManifest'],
  ['communication_ingress_pipeline', 'XiCommunicationIngressPipeline'],
  ['communication_draft', 'XiCommunicationDraft'],
  ['communication_egress_proposal', 'XiCommunicationEgressProposal'],
  ['communication_receipt', 'XiCommunicationReceipt']
]);

const uiRecords = lock.components ?? [];
const communicationRecords = lock.communication_contracts ?? [];
const records = [...uiRecords, ...communicationRecords];

if (uiRecords.length !== expectedUiIds.length) fail(`expected ${expectedUiIds.length} UI/workbench primitives, found ${uiRecords.length}`);
if (communicationRecords.length !== expectedCommunicationIds.length) fail(`expected ${expectedCommunicationIds.length} communication primitives, found ${communicationRecords.length}`);

const idPattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const symbolPattern = /^Xi[A-Z][A-Za-z0-9]*$/;
const ids = new Set();
const symbols = new Set();

for (const record of records) {
  if (!idPattern.test(record.component_id ?? '')) fail(`invalid stable component_id ${record.component_id}`);
  if (!symbolPattern.test(record.symbol ?? '')) fail(`invalid reusable Xi symbol ${record.symbol} for ${record.component_id}`);
  if (ids.has(record.component_id)) fail(`duplicate component_id ${record.component_id}`);
  if (symbols.has(record.symbol)) fail(`duplicate Xi symbol ${record.symbol}`);
  ids.add(record.component_id);
  symbols.add(record.symbol);

  if (record.candidate_lifecycle_state !== 'source_mapped') fail(`${record.component_id} must remain source_mapped until canonical promotion evidence changes deliberately`);
  if (!record.kind) fail(`${record.component_id} missing kind`);
  if (!record.risk_level) fail(`${record.component_id} missing risk_level`);
  if (!Array.isArray(record.lineage) || record.lineage.length === 0) fail(`${record.component_id} missing donor/framework lineage`);

  const expectedSymbol = expectedSymbols.get(record.component_id);
  if (!expectedSymbol) fail(`unrecognized component_id ${record.component_id}`);
  if (record.symbol !== expectedSymbol) fail(`${record.component_id} symbol drifted: expected ${expectedSymbol}, found ${record.symbol}`);
}

for (const expectedId of [...expectedUiIds, ...expectedCommunicationIds]) {
  if (!ids.has(expectedId)) fail(`missing locked component_id ${expectedId}`);
}

for (const record of communicationRecords) {
  if (!record.component_id.startsWith('communication_')) fail(`${record.component_id} must keep communication_ namespace until registry/resource collision review says otherwise`);
}

const actionRegistry = records.find((record) => record.component_id === 'ui_action_registry');
const requiredActionStates = ['enabled', 'disabled', 'blocked', 'proposed', 'unavailable'];
for (const state of requiredActionStates) {
  if (!actionRegistry?.required_states?.includes(state)) fail(`XiActionRegistry missing locked availability state ${state}`);
}
if (!String(actionRegistry?.authority_rule).includes('does not grant')) fail('XiActionRegistry must explicitly deny execution-authority inference');

const selectedContext = records.find((record) => record.component_id === 'selected_context_packet');
if (!String(selectedContext?.authority_rule).includes('grants no authority')) fail('XiSelectedContext must explicitly grant no authority');

const communicationReceipt = records.find((record) => record.component_id === 'communication_receipt');
if (!String(communicationReceipt?.authority_rule).includes('not automatically legal')) fail('XiCommunicationReceipt must deny automatic legal acceptance inference');

const mappings = sourceMap.mappings ?? {};
const mappingIds = new Set(Object.keys(mappings));
if (mappingIds.size !== records.length) fail(`source map contains ${mappingIds.size} mappings for ${records.length} locked primitives`);

for (const id of ids) {
  const mapping = mappings[id];
  if (!mapping) fail(`missing exact source mapping for ${id}`);
  if (!Array.isArray(mapping.framework_sources) || mapping.framework_sources.length === 0) fail(`${id} missing framework source refs`);
  if (!Array.isArray(mapping.donor_sources) || mapping.donor_sources.length === 0) fail(`${id} missing Inbox donor source refs`);
  if (!mapping.implementation_disposition) fail(`${id} missing implementation disposition`);
}
for (const id of mappingIds) {
  if (!ids.has(id)) fail(`source map contains unlocked component ${id}`);
}

const forbiddenGenericCommunicationIds = ['source_record', 'attachment_manifest', 'evidence_ingress_pipeline'];
for (const id of forbiddenGenericCommunicationIds) {
  if (ids.has(id)) fail(`generic communication identity ${id} is forbidden until framework/Bins vocabulary collision review resolves ownership`);
}

console.log('Framework component promotion lock check passed.');
console.log(`Locked UI/workbench primitives: ${uiRecords.length}`);
console.log(`Locked communication/evidence primitives: ${communicationRecords.length}`);
console.log(`Exact source mappings: ${mappingIds.size}`);
console.log(`Framework baseline: ${lock.framework_ref_inspected}`);
console.log(`Inbox donor baseline: ${lock.donor_ref}`);
console.log('Canonical xi-io.net registry admission remains blocked by #306 R1 by design.');
