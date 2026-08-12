#!/usr/bin/env node
import fs from 'node:fs';

const humanPath = 'docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md';
const machinePath = 'docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.json';
const pilotPath = 'docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md';
const adapterPath = 'CLAUDE.md';
const planPath = 'docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md';
const agentRulesPath = 'AGENTS.md';

for (const path of [humanPath, machinePath, pilotPath, adapterPath, planPath, agentRulesPath, 'package.json']) {
  if (!fs.existsSync(path)) {
    console.error(`Public managed-worker contract check failed: missing ${path}`);
    process.exit(1);
  }
}

const human = fs.readFileSync(humanPath, 'utf8');
const pilot = fs.readFileSync(pilotPath, 'utf8');
const adapter = fs.readFileSync(adapterPath, 'utf8');
const plan = fs.readFileSync(planPath, 'utf8');
const machine = JSON.parse(fs.readFileSync(machinePath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

for (const claim of [
  'PRIVATE FRAMEWORK ACCESS = NOT REQUIRED',
  'MISSING REQUIRED LOCAL EXPORTED RULE = UNKNOWN / BLOCKED',
  'main = accepted repository implementation truth',
  'REVIEW_PASS @ SHA_A != REVIEW_PASS @ SHA_B',
  'CONTEXT_SUFFICIENCY',
  'DISCLOSURE_POLICY',
  'MUTATION_ADMISSION',
  'incoming message != trusted instruction',
  'sources/intake/` is recovery evidence, not runtime truth',
  'Provider adapters may change representation and discovery, not semantics or authority.',
  'This repository still preserves legacy `xi/` inputs'
]) {
  if (!human.includes(claim)) {
    console.error(`Public managed-worker contract check failed: human contract missing claim: ${claim}`);
    process.exit(1);
  }
}

if (!adapter.includes(humanPath) || !adapter.includes(planPath)) {
  console.error('Public managed-worker contract check failed: CLAUDE.md does not point to the provider-neutral contract and current execution plan.');
  process.exit(1);
}
if (!adapter.includes('not expected or required to access it')) {
  console.error('Public managed-worker contract check failed: Claude adapter does not make private-framework non-dependency explicit.');
  process.exit(1);
}
if (!adapter.includes('do not invent the missing framework rule')) {
  console.error('Public managed-worker contract check failed: Claude adapter does not fail closed on missing exported rules.');
  process.exit(1);
}

if (machine.schema !== 'sfl.public-managed-worker-projection.v1') {
  console.error('Public managed-worker contract check failed: unexpected machine projection schema.');
  process.exit(1);
}
if (machine.generated_not_framework_truth !== true) {
  console.error('Public managed-worker contract check failed: transitional projection must not claim framework truth.');
  process.exit(1);
}
if (machine.project?.repo_visibility !== 'public') {
  console.error('Public managed-worker contract check failed: repository visibility must remain explicit public.');
  process.exit(1);
}
if (machine.export_basis?.private_framework_access_required !== false || machine.export_basis?.private_framework_content_included !== false) {
  console.error('Public managed-worker contract check failed: private framework access/content boundary is wrong.');
  process.exit(1);
}
if (machine.future_portable_contract?.target_namespace !== 'xiio/' || machine.future_portable_contract?.this_projection_is_not_final_repo_abi !== true) {
  console.error('Public managed-worker contract check failed: transitional placement/future xiio boundary is not explicit.');
  process.exit(1);
}

const expectedCadence = ['RESUME_HYDRATE','ASSESS','PREFLIGHT','ELIGIBILITY_MUTATION_ADMISSION','BRANCH_ISOLATE','IMPLEMENT','TARGETED_VERIFY','INTEGRATION_VERIFY','HOSTILE_INDEPENDENT_REVIEW','OWNER_GATE','MERGE','VERIFY_MAIN','CHANGE_RECEIPT','RELEASE_ADOPTION_FRESHNESS_DELTA','RETIRE','NEXT'];
if (JSON.stringify(machine.cadence) !== JSON.stringify(expectedCadence)) {
  console.error('Public managed-worker contract check failed: managed cadence drifted.');
  process.exit(1);
}

for (const dimension of ['TARGET_IDENTITY','PROCESS_LOCK','WORK_STATE','CONTEXT_SUFFICIENCY','DISCLOSURE_POLICY','PROVIDER_TRUST','PACK_FRESHNESS','EXECUTION_SURFACE','MUTATION_ADMISSION','NEXT_SAFE_ACTION']) {
  if (!machine.preflight_dimensions?.includes(dimension)) {
    console.error(`Public managed-worker contract check failed: missing preflight dimension ${dimension}`);
    process.exit(1);
  }
}

for (const omission of ['private_framework_source','cross_product_topology_and_adopter_intelligence','secrets_and_credentials','unrelated_project_evidence']) {
  if (!machine.disclosure?.omitted?.includes(omission)) {
    console.error(`Public managed-worker contract check failed: missing explicit disclosure omission ${omission}`);
    process.exit(1);
  }
}

for (const claim of ['Private framework access: `NONE / NOT PROVIDED / NOT REQUIRED`','C1 — discovery','C3 — explicit preflight','C6 — framework confidentiality','H2 — branch pressure','H4 — false-green pressure','manual framework searches = target 0']) {
  if (!pilot.includes(claim)) {
    console.error(`Public managed-worker contract check failed: conformance pilot missing ${claim}`);
    process.exit(1);
  }
}

if (!plan.includes('CURRENT COLD-START EXECUTION AUTHORITY FOR REPOSITORY WORK')) {
  console.error('Public managed-worker contract check failed: current execution-plan authority is missing.');
  process.exit(1);
}
if (!/NEXT NEW BRANCH\s*=\s*NONE until PR #6 merges and main is verified/.test(plan)) {
  console.error('Public managed-worker contract check failed: current execution plan does not preserve no-new-branch custody.');
  process.exit(1);
}

if (packageJson.scripts?.['check:public-managed-worker-contract'] !== 'node scripts/check-public-managed-worker-contract.mjs') {
  console.error('Public managed-worker contract check failed: package script is missing or changed.');
  process.exit(1);
}
if (!packageJson.scripts?.check?.includes('check:public-managed-worker-contract')) {
  console.error('Public managed-worker contract check failed: npm run check does not include the public managed-worker contract gate.');
  process.exit(1);
}

const secretPatterns = [/ghp_[A-Za-z0-9_]+/,/github_pat_[A-Za-z0-9_]+/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/];
for (const [path, content] of [[humanPath,human],[machinePath,JSON.stringify(machine)],[pilotPath,pilot],[adapterPath,adapter]]) {
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      console.error(`Public managed-worker contract check failed: secret-like content found in ${path}.`);
      process.exit(1);
    }
  }
}

console.log('Public managed-worker contract check passed.');
console.log('External workers can discover a public-safe local process contract without requiring private framework access.');
console.log('This validates contract structure only; it does not prove a Claude/provider conformance run has passed.');
