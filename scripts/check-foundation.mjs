#!/usr/bin/env node
import fs from 'node:fs';

const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'package.json',
  '.env.example',
  'docs/INDEX.md',
  'docs/ops/PROJECT-STARTUP-sask_family_law_self_help-2026-07-22.md',
  'docs/ops/execution-sequence-v1.md',
  'docs/product/product-brief-v1.md',
  'docs/product/first-reference-slice-v1.md',
  'docs/architecture/system-architecture-v1.md',
  'docs/architecture/privacy-and-data-boundary-v1.md',
  'docs/workflows/jcc-kit-3j-workflow-v1.md',
  'docs/ux/progressive-disclosure-interview-v1.md',
  'docs/ux/accessibility-and-cognitive-load-v1.md',
  'docs/legal/legal-information-boundary-v1.md',
  'docs/source-materials/jcc-kit-3j-source-record-v1.md',
  'docs/schemas/matter-record-schema-v1.md',
  'docs/schemas/workflow-definition-schema-v1.md',
  'docs/reviews/local-review-packet-sask_family_law_self_help-001.md',
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

console.log(`Foundation check passed (${requiredFiles.length} required files).`);
