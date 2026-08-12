#!/usr/bin/env node
import fs from 'node:fs';

const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'package.json',
  '.env.example',
  'docs/INDEX.md',
  'docs/ops/ACTIVE_WORK_CHECKPOINT.md',
  'docs/ops/CURRENT_LANE_STATUS.md',
  'docs/ops/do-not-touch-register.md',
  'docs/ops/verification-runbook.md',
  'docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md',
  'docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md',
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

const missing = requiredFiles.filter((filePath) => !fs.existsSync(filePath));
if (missing.length > 0) {
  console.error('Foundation check failed. Missing required files:');
  for (const filePath of missing) console.error(`- ${filePath}`);
  process.exit(1);
}

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
    if (pattern.test(content)) {
      console.error(`Foundation check failed. Secret-like content found in ${filePath}.`);
      process.exit(1);
    }
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
  if (!readme.includes(heading)) {
    console.error(`Foundation check failed. README heading missing: ${heading}`);
    process.exit(1);
  }
}

const checkpointPath = 'docs/ops/ACTIVE_WORK_CHECKPOINT.md';
const lanePath = 'docs/ops/CURRENT_LANE_STATUS.md';
const planPath = 'docs/ops/SFL-GITHUB-EXECUTION-PLAN-2026-08-12.md';
const reonboardPath = 'docs/ops/SFL-REONBOARDING-DELTA-2026-08-12.md';
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const checkpoint = fs.readFileSync(checkpointPath, 'utf8');
const lane = fs.readFileSync(lanePath, 'utf8');
const plan = fs.readFileSync(planPath, 'utf8');
const reonboard = fs.readFileSync(reonboardPath, 'utf8');

for (const ref of [checkpointPath, lanePath, planPath, reonboardPath]) {
  if (!readme.includes(ref)) {
    console.error(`Foundation check failed. README does not point to ${ref}.`);
    process.exit(1);
  }
}
if (!agents.includes(`1. \`${checkpointPath}\``) || !agents.includes(`2. \`${planPath}\``)) {
  console.error('Foundation check failed. AGENTS must make active checkpoint first and execution plan second in read order.');
  process.exit(1);
}
for (const requiredCheckpointClaim of [
  'latest_known_safe_sha:',
  'verification_state:',
  'next_safe_action:',
  'No new branch is authorized by this checkpoint.'
]) {
  if (!checkpoint.includes(requiredCheckpointClaim)) {
    console.error(`Foundation check failed. Active-work checkpoint missing: ${requiredCheckpointClaim}`);
    process.exit(1);
  }
}
for (const requiredLaneClaim of [
  'active_pr: 6',
  'active_change_unit: SFL-RECOVERY-CLOSEOUT-001',
  'next_new_branch: BLOCKED'
]) {
  if (!lane.includes(requiredLaneClaim)) {
    console.error(`Foundation check failed. Current-lane projection missing: ${requiredLaneClaim}`);
    process.exit(1);
  }
}
for (const requiredPlanClaim of [
  'CURRENT COLD-START EXECUTION AUTHORITY FOR REPOSITORY WORK',
  'PR #5 = frozen donor/salvage source, not a merge unit',
  'Current active recovery PR: `#6`'
]) {
  if (!plan.includes(requiredPlanClaim)) {
    console.error(`Foundation check failed. GitHub execution plan missing required custody claim: ${requiredPlanClaim}`);
    process.exit(1);
  }
}
if (!/NEXT NEW BRANCH\s*=\s*NONE until PR #6 merges and main is verified/.test(plan)) {
  console.error('Foundation check failed. GitHub execution plan must explicitly block a new branch until PR #6 merges and main is verified.');
  process.exit(1);
}
for (const claim of [
  'operation: re_onboard_existing_project',
  'REFERENCE SLICE SELECTED',
  '### A. Strategic / waterfall truth',
  '### B. Agile / flow truth',
  '### C. Active execution truth',
  'CLAUDE-CONFORMANCE-001'
]) {
  if (!reonboard.includes(claim)) {
    console.error(`Foundation check failed. Re-onboarding delta missing required claim: ${claim}`);
    process.exit(1);
  }
}

const manifest = fs.readFileSync('xi/managed-project.manifest.yaml', 'utf8');
for (const field of [
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
  if (!manifest.includes(field)) {
    console.error(`Foundation check failed. Manifest field missing: ${field}`);
    process.exit(1);
  }
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const scriptName of [
  'check',
  'check:foundation',
  'check:source-catalog',
  'check:recovery-sources',
  'check:framework-component-promotion-lock',
  'check:public-managed-worker-contract'
]) {
  if (!packageJson.scripts?.[scriptName]) {
    console.error(`Foundation check failed. Missing package script: ${scriptName}`);
    process.exit(1);
  }
}

console.log(`Foundation check passed (${requiredFiles.length} required files).`);
console.log('Cold-start checkpoint, lane, execution authority, re-onboarding delta, and public external-worker surfaces are present.');
