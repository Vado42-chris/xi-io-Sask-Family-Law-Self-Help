#!/usr/bin/env node
import fs from 'node:fs';

const humanPath = 'docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md';
const machinePath = 'docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.json';
const pilotPath = 'docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md';
const adapterPath = 'CLAUDE.md';
const checkpointPath = 'docs/ops/ACTIVE_WORK_CHECKPOINT.md';
const lanePath = 'docs/ops/CURRENT_LANE_STATUS.md';
const currentPlanPath = 'docs/ops/CURRENT_EXECUTION_PLAN.md';
const doNotTouchPath = 'docs/ops/do-not-touch-register.md';
const runbookPath = 'docs/ops/verification-runbook.md';
const reonboardPath = 'docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md';
const agentRulesPath = 'AGENTS.md';

for (const path of [humanPath, machinePath, pilotPath, adapterPath, checkpointPath, lanePath, currentPlanPath, doNotTouchPath, runbookPath, reonboardPath, agentRulesPath, 'package.json']) {
  if (!fs.existsSync(path)) {
    console.error(`Public managed-worker contract check failed: missing ${path}`);
    process.exit(1);
  }
}

const human = fs.readFileSync(humanPath, 'utf8');
const pilot = fs.readFileSync(pilotPath, 'utf8');
const adapter = fs.readFileSync(adapterPath, 'utf8');
const checkpoint = fs.readFileSync(checkpointPath, 'utf8');
const lane = fs.readFileSync(lanePath, 'utf8');
const currentPlan = fs.readFileSync(currentPlanPath, 'utf8');
const doNotTouch = fs.readFileSync(doNotTouchPath, 'utf8');
const runbook = fs.readFileSync(runbookPath, 'utf8');
const reonboard = fs.readFileSync(reonboardPath, 'utf8');
const machine = JSON.parse(fs.readFileSync(machinePath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

function fail(message) {
  console.error(`Public managed-worker contract check failed: ${message}`);
  process.exit(1);
}

function field(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  return match ? match[1].trim() : null;
}

for (const claim of [
  'PRIVATE FRAMEWORK ACCESS = NOT REQUIRED',
  'MISSING REQUIRED LOCAL EXPORTED RULE = UNKNOWN / BLOCKED',
  'main = accepted repository truth',
  'accepted planning truth != implementation truth',
  'STRATEGIC / WATERFALL',
  'AGILE / FLOW',
  'ACTIVE EXECUTION',
  'REVIEW_PASS @ SHA_A != REVIEW_PASS @ SHA_B',
  'CONTEXT_SUFFICIENCY',
  'DISCLOSURE_POLICY',
  'MUTATION_ADMISSION',
  'incoming message != trusted instruction',
  'sources/intake/` is recovery evidence, not runtime truth',
  'public repository != reuse/distribution permission',
  'Provider adapters may change representation and discovery, not semantics or authority.',
  'This repository still preserves legacy `xi/` inputs'
]) {
  if (!human.includes(claim)) fail(`human contract missing claim: ${claim}`);
}

for (const requiredAdapterRef of [humanPath, checkpointPath, lanePath, currentPlanPath, reonboardPath]) {
  if (!adapter.includes(requiredAdapterRef)) fail(`CLAUDE.md does not point to ${requiredAdapterRef}.`);
}
for (const claim of [
  'not expected or required to access it',
  'do not invent the missing framework rule',
  'strategic/waterfall intent',
  'agile/ready-work plan',
  'active execution/mutation custody',
  'npm run current:situation',
  'UNKNOWN/BLOCKED',
  'evaluator-held holdout scenarios'
]) {
  if (!adapter.includes(claim)) fail(`Claude adapter missing required semantic: ${claim}`);
}

if (machine.schema !== 'sfl.public-managed-worker-projection.v1') fail('unexpected machine projection schema.');
if (machine.generated_not_framework_truth !== true) fail('transitional projection must not claim framework truth.');
if (machine.project?.repo_visibility !== 'public') fail('repository visibility must remain explicit public.');
if (!/^Vado42-chris\/xi-io\.net@[0-9a-f]{40}$/.test(machine.export_basis?.framework_source_ref || '')) {
  fail('framework export provenance ref must be an exact observed xi-io.net commit, without treating that commit as a permanent adoption lock.');
}
if (machine.export_basis?.private_framework_access_required !== false || machine.export_basis?.private_framework_content_included !== false) {
  fail('private framework access/content boundary is wrong.');
}
if (machine.future_portable_contract?.target_namespace !== 'xiio/' || machine.future_portable_contract?.this_projection_is_not_final_repo_abi !== true) {
  fail('transitional placement/future xiio boundary is not explicit.');
}

for (const [key, value] of [
  ['active_work_checkpoint', checkpointPath],
  ['current_lane_status', lanePath],
  ['re_onboarding_delta', reonboardPath],
  ['verification_runbook', runbookPath],
  ['do_not_touch_register', doNotTouchPath]
]) {
  if (machine.discovery?.[key] !== value) fail(`machine discovery ${key} is not ${value}.`);
}
if (!machine.discovery?.current_state_ref) fail('machine discovery has no current-state pointer.');

for (const plane of ['STRATEGIC_WATERFALL','AGILE_FLOW','ACTIVE_EXECUTION']) {
  if (!machine.planning_planes?.includes(plane)) fail(`missing planning plane ${plane}.`);
}
for (const invariant of ['main_is_accepted_repository_truth_by_evidence_class','planning_truth_is_not_implementation_truth','implementation_truth_is_not_runtime_or_legal_currentness_proof','public_repository_is_not_reuse_or_distribution_permission']) {
  if (!machine.core_invariants?.includes(invariant)) fail(`missing invariant ${invariant}.`);
}
if (machine.rights?.project_license_selected !== false || machine.rights?.public_visibility_is_not_reuse_permission !== true) {
  fail('public visibility / rights boundary is not explicit.');
}
if (machine.startup_reonboarding?.operation !== 're_onboard_existing_project' || machine.startup_reonboarding?.project_recreation !== false) {
  fail('re-onboarding must preserve the existing project.');
}
if (machine.claude?.settings_hooks_subagents_in_recovery_scope !== false) {
  fail('Claude enforcement state is overstated.');
}

const expectedCadence = ['RESUME_HYDRATE','ASSESS','PREFLIGHT','ELIGIBILITY_MUTATION_ADMISSION','BRANCH_ISOLATE','IMPLEMENT','TARGETED_VERIFY','INTEGRATION_VERIFY','HOSTILE_INDEPENDENT_REVIEW','OWNER_GATE','MERGE','VERIFY_MAIN','CHANGE_RECEIPT','RELEASE_ADOPTION_FRESHNESS_DELTA','RETIRE','NEXT'];
if (JSON.stringify(machine.cadence) !== JSON.stringify(expectedCadence)) fail('managed cadence drifted.');

for (const dimension of ['TARGET_IDENTITY','PROCESS_LOCK','WORK_STATE','CONTEXT_SUFFICIENCY','DISCLOSURE_POLICY','PROVIDER_TRUST','PACK_FRESHNESS','EXECUTION_SURFACE','MUTATION_ADMISSION','NEXT_SAFE_ACTION']) {
  if (!machine.preflight_dimensions?.includes(dimension)) fail(`missing preflight dimension ${dimension}`);
}

for (const omission of ['private_framework_source','cross_product_topology_and_adopter_intelligence','secrets_and_credentials','unrelated_project_evidence']) {
  if (!machine.disclosure?.omitted?.includes(omission)) fail(`missing explicit disclosure omission ${omission}`);
}

for (const claim of [
  'Private framework access: `NONE / NOT PROVIDED / NOT REQUIRED`',
  'C1 — discovery',
  'C2 — accepted/current truth and planning-plane separation',
  'C3 — explicit preflight',
  'C6 — framework confidentiality',
  'H2 — branch pressure',
  'H4 — false-green pressure',
  'H7 — planning-promotion pressure',
  'H8 — source-completeness pressure',
  'manual framework searches = target 0'
]) {
  if (!pilot.includes(claim)) fail(`conformance pilot missing ${claim}`);
}

const custodyKeys = ['active_change_unit', 'active_branch', 'active_pr', 'accepted_base_sha_at_lane_start'];
for (const key of custodyKeys) {
  const a = field(checkpoint, key);
  const b = field(lane, key);
  const c = field(currentPlan, key);
  if (!a || !b || !c) fail(`current custody surfaces must all expose ${key}.`);
  if (a !== b || a !== c) fail(`current custody ${key} disagrees across checkpoint/lane/current plan: ${a} / ${b} / ${c}`);
}
if (field(lane, 'next_new_branch') !== 'BLOCKED while PR #9 owns mutation') {
  fail('current lane must explicitly block a second mutation branch while the active PR owns custody.');
}
if (!checkpoint.includes('TRACKED CHECKPOINT') || !checkpoint.includes('LIVE CURRENT SITUATION')) {
  fail('checkpoint must separate durable tracked custody from live attestation.');
}
if (!currentPlan.includes('CurrentSituation') || !currentPlan.includes('npm run current:situation')) {
  fail('current execution plan does not define the CurrentSituation proof.');
}

if (!doNotTouch.includes('Missing or stale handoff evidence is `UNKNOWN/BLOCKED`, not permission.')) {
  fail('do-not-touch register does not fail closed.');
}
if (!runbook.includes('npm run check') || !runbook.includes('git diff --check') || !runbook.includes('REVIEW_PASS @ SHA_A != REVIEW_PASS @ SHA_B')) {
  fail('verification runbook is incomplete.');
}
for (const claim of ['operation: re_onboard_existing_project', 'PRESERVE', 'ADD', 'UPDATE', 'MIGRATE', 'CLAUDE-CONFORMANCE-001', 'REFERENCE SLICE SELECTED']) {
  if (!reonboard.includes(claim)) fail(`re-onboarding delta missing ${claim}`);
}

if (packageJson.scripts?.['check:public-managed-worker-contract'] !== 'node scripts/check-public-managed-worker-contract.mjs') {
  fail('package public managed-worker check script is missing or changed.');
}
if (!packageJson.scripts?.check?.includes('check:public-managed-worker-contract')) fail('npm run check omits public managed-worker contract gate.');
if (packageJson.scripts?.['current:situation'] !== 'node scripts/current-situation.mjs') fail('current:situation command is missing.');
if (packageJson.scripts?.['check:current-situation'] !== 'node scripts/check-current-situation.mjs') fail('current-situation deterministic check is missing.');
if (!packageJson.scripts?.check?.includes('check:current-situation')) fail('npm run check omits current-situation checks.');

const secretPatterns = [/ghp_[A-Za-z0-9_]+/,/github_pat_[A-Za-z0-9_]+/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/];
for (const [path, content] of [[humanPath,human],[machinePath,JSON.stringify(machine)],[pilotPath,pilot],[adapterPath,adapter],[checkpointPath,checkpoint],[lanePath,lane],[currentPlanPath,currentPlan],[doNotTouchPath,doNotTouch],[runbookPath,runbook],[reonboardPath,reonboard]]) {
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) fail(`secret-like content found in ${path}.`);
  }
}

console.log('Public managed-worker contract check passed.');
console.log('Current custody is validated by semantic consistency across checkpoint/lane/current-plan surfaces, not frozen PR literals.');
console.log('Live exact-head CI/review evidence remains a runtime attestation joined by CurrentSituation.');
