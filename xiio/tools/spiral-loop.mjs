#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const templatePath = path.join(root, 'xiio', 'spiral-loop.template.json');
const catalogPath = path.join(root, 'xiio', 'catalog', 'spiral-loop-results.json');
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || true];
}));
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const now = new Date().toISOString();
const input = args.input ? JSON.parse(fs.readFileSync(path.resolve(root, String(args.input)), 'utf8')) : {};
const result = {
  schema: 'xiio.spiral-loop-result.v1',
  result_id: `${template.project_id}-${now.replace(/[-:.TZ]/g, '')}`,
  observed_at: now,
  repo: template.repository,
  project_id: template.project_id,
  role: template.role,
  mode: args.mode || 'stress',
  status: input.status || 'BLOCKED_PENDING_EVIDENCE',
  evidence: input.evidence || [],
  gaps: input.gaps || ['No loop input supplied'],
  repairs: input.repairs || [],
  dependencies: template.dependencies,
  skill_links: template.skill_links,
  next_action: input.next_action || template.default_next_action,
  ok_to_base: false,
  effect_authority: 'DENIED',
  source: input.source || 'local-runtime',
  backbeat: input.backbeat || 'A result without a named gap and next action is incomplete.'
};
fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
catalog.events.push(result);
catalog.last_result_id = result.result_id;
catalog.updated_at = now;
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\\n');
console.log(JSON.stringify(result, null, 2));
