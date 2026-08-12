#!/usr/bin/env node
import fs from 'node:fs';

const currentPlanPath = 'docs/ops/CURRENT_EXECUTION_PLAN.md';
const checkpointPath = 'docs/ops/ACTIVE_WORK_CHECKPOINT.md';
const lanePath = 'docs/ops/CURRENT_LANE_STATUS.md';
const reonboardPath = 'docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md';

const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'package.json',
  '.env.example',
  'docs/INDEX.md',
  checkpointPath,
  lanePath,
  currentPlanPath,
  'docs/ops/do-not-touch-register.md',
  'docs/ops/verification-runbook.md',
  'docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md',
  reonboardPath,
  'docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.md',
  'docs/ops/SFL-PUBLIC-MANAGED-WORKER-CONTRACT-v1.json',
  'docs/ops/SFL-EXTERNAL-WORKER-CONFORMANCE-PILOT-001.md',
  'docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md',
  'docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-08-12.md',
  'docs/ops/execution-sequence-v1.md',
  'docs/ops/JCC-KIT-3J-SOURCE-CAPTURE-001.md',
  'docs/ops/SFL-KIT-4A-SCOPE-RECOVERY-001.md',
  'docs/ops/SFL-PROJECT-KERNEL-NAMESPACE-MIGRATION-001.md',
  'docs/product/product-brief-v1.md',
  'docs/product/first-reference-slice-v1.md',
  'docs/architecture/system-architecture-v1.md',
  'docs/architecture/privacy-and-data-boundary-v1.md',
  'docs/architecture/multi-kit-source-registry-v1.md',
  'docs/workflows/jcc-kit-3j-workflow-v1.md',
  'docs/ux/progressive-disclosure-interview-v1.md',
  'docs/ux/accessibility-and-cognitive-load-v1.md',
  'docs/legal/legal-information-boundary-v1.md',
  'docs/source-materials/jcc-kit-3j-source-record-v1.md',
  'docs/source-materials/source-capture-and-freshness-standard-v1.md',
  'docs/source-materials/inbox-framework-component-promotion-lock-v1.md',
  'docs/source-materials/inbox-framework-component-promotion-lock-v1.json',
  'docs/source-materials/inbox-framework-component-source-map-v1.json',
  'docs/schemas/matter-record-schema-v1.md',
  'docs/schemas/workflow-definition-schema-v1.md',
  'docs/reviews/local-review-packet-sask_family_law_self_help-001.md',
  'docs/reviews/local-review-packet-jcc-source-capture-001.md',
  'sources/source-registry.json',
  'sources/intake/index.json',
  'sources/intake/kit-4a/2023-04-10/source-intake.json',
  'sources/intake/kit-4a/2023-04-10/form-15-47-schedule-matrix.json',
  'sources/jcc-kit-3j/2026-03-30/forms-index.json',
  'sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-2.json',
  'sources/jcc-kit-3j/2026-03-30/forms/form-10-3-draft-order.json',
  'sources/jcc-kit-3j/2026-03-30/forms/form-10-3-child-support-order.json',
  'sources/jcc-kit-3j/2026-03-30/forms/form-15-8b.json',
  'sources/jcc-kit-3j/2026-03-30/forms/form-12-3.json',
  'sources/jcc-kit-3j/2026-03-30/forms/fam-pd-7-5.json',
  'scripts/check-source-catalog.mjs',
  'scripts/check-recovery-sources.mjs',
  'scripts/check-framework-component-promotion-lock.mjs',
  'scripts/check-public-managed-worker-contract.mjs',
  'scripts/current-situation-core.mjs',
  'scripts/current-situation.mjs',
  'scripts/check-current-situation.mjs',
  'xi/managed-project.manifest.yaml',
  'xi/project-lexicon.yaml',
  'xi/feature-index.yaml',
  'xi/ui-profile.yaml',
  'xi/capability-profile.yaml',
  'project-tracking/open-work-ledger.md',
  'project-tracking/agent-run-ledger.md',
  'project-tracking/decision-ledger.md',
  'project-tracking/risk-register.md',
  'project-tracking/evidence-ledger.md'
];

function fail(message) {
  console.error(`Foundation check failed. ${message}`);
  process.exit(1);
}

function field(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  return match ? match[1].trim() : null;
}

const missing = requiredFiles.filter((filePath) => !fs.existsSync(filePath));
if (missing.length > 0) fail(`Missing required files:\n${missing.map((p) => `- ${p}`).join('\n')}`);

const forbiddenPatterns = [
  /ghp_[A-Za-z0-9_]+/,
  /github_pat_[A-Za-z0-9_]+/,
  /gho_[A-Za-z0-9_]+/,
  /ghu_[A-Za-z0-9_]+/,
  /ghs_[A-Za-z0-9_]+/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
];

for (const filePath of requiredFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) fail(`Secret-like content found in ${filePath}.`);
  }
}

const readme = fs.readFileSync('README.md', 'utf8');
for (const heading of [
  '## Current status',
  '## What this repo is',
  '## Canonical source snapshot',
  '## Required freshness disclosure',
  '## What this repo is not',
  '## Human-only path',
  '## AI-assisted path',
  '## Local-first and data posture',
  '## Safe commands',
  '## Blocked commands',
  '## Known gaps',
  '## Next action'
]) {
  if (!readme.includes(heading)) fail(`README heading missing: ${heading}`);
}

const checkpoint = fs.readFileSync(checkpointPath, 'utf8');
const lane = fs.readFileSync(lanePath, 'utf8');
const currentPlan = fs.readFileSync(currentPlanPath, 'utf8');
const reonboard = fs.readFileSync(reonboardPath, 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const claude = fs.readFileSync('CLAUDE.md', 'utf8');

if (!readme.includes(checkpointPath) || !readme.includes(lanePath) || !readme.includes(reonboardPath)) {
  fail('README must expose checkpoint, lane, and re-onboarding discovery surfaces.');
}
if (!agents.includes(checkpointPath)) fail('AGENTS must point to the active-work checkpoint.');
if (!claude.includes(currentPlanPath) || !claude.includes('npm run current:situation')) {
  fail('Claude adapter must expose the stable current execution plan and live CurrentSituation resolver.');
}

const custodyKeys = ['active_change_unit', 'active_branch', 'active_pr', 'accepted_base_sha_at_lane_start'];
for (const key of custodyKeys) {
  const a = field(checkpoint, key);
  const b = field(lane, key);
  const c = field(currentPlan, key);
  if (!a || !b || !c) fail(`Current custody surfaces must all expose ${key}.`);
  if (a !== b || a !== c) fail(`Current custody ${key} disagrees: checkpoint=${a}, lane=${b}, plan=${c}`);
}

const activePr = field(lane, 'active_pr');
const nextNewBranch = field(lane, 'next_new_branch');
if (!nextNewBranch?.startsWith('BLOCKED') || !nextNewBranch.includes(`PR #${activePr}`)) {
  fail(`Current lane must block a second mutation branch and identify active PR #${activePr}.`);
}
if (!checkpoint.includes('TRACKED CHECKPOINT') || !checkpoint.includes('LIVE CURRENT SITUATION')) {
  fail('Checkpoint must distinguish durable tracked custody from live attestations.');
}
if (!currentPlan.includes('CurrentSituation') || !currentPlan.includes('npm run current:situation')) {
  fail('Stable current execution plan must define the CurrentSituation proof.');
}

for (const claim of [
  'operation: re_onboard_existing_project',
  'REFERENCE SLICE SELECTED',
  '### A. Strategic / waterfall truth',
  '### B. Agile / flow truth',
  '### C. Active execution truth',
  'CLAUDE-CONFORMANCE-001'
]) {
  if (!reonboard.includes(claim)) fail(`Re-onboarding delta missing required claim: ${claim}`);
}

const manifest = fs.readFileSync('xi/managed-project.manifest.yaml', 'utf8');
for (const manifestField of [
  'project_id:',
  'human_only_path:',
  'ai_optional_path:',
  'privacy_profile:',
  'safe_commands:',
  'blocked_commands:',
  'validation_profile:',
  'known_blockers:',
  'next_action:'
]) {
  if (!manifest.includes(manifestField)) fail(`Manifest field missing: ${manifestField}`);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const scriptName of [
  'check',
  'check:foundation',
  'check:source-catalog',
  'check:recovery-sources',
  'check:framework-component-promotion-lock',
  'check:public-managed-worker-contract',
  'check:current-situation',
  'current:situation'
]) {
  if (!packageJson.scripts?.[scriptName]) fail(`Missing package script: ${scriptName}`);
}

console.log(`Foundation check passed (${requiredFiles.length} required files).`);
console.log('Current custody is consistent across checkpoint, lane, and stable current-plan surfaces.');
console.log('Same-head validation remains live evidence resolved by CurrentSituation, not a frozen PR literal.');
