import assert from 'node:assert/strict';
import { deriveCurrentSituation, STATES } from './current-situation-core.mjs';

const H = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const M = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

function base(overrides = {}) {
  return {
    repo: { full_name: 'Vado42-chris/xi-io-Sask-Family-Law-Self-Help', default_branch: 'main' },
    git: { head_sha: H, branch: 'feat/test' },
    tracked: { validation_claim: true, validation_head_sha: M },
    live: {
      available: true,
      default_branch_head_sha: M,
      pull_requests: [{ number: 9, state: 'open', draft: true, base: 'main', head_sha: H }],
      workflow_runs: [{ id: 1, run_number: 120, name: 'Foundation check', status: 'completed', conclusion: 'success', head_sha: H }]
    },
    policy: { mutation_admission: STATES.BLOCKED },
    ...overrides
  };
}

{
  const result = deriveCurrentSituation(base());
  assert.equal(result.validation.state, STATES.PASS);
  assert.equal(result.validation.evidence_source, 'LIVE_GITHUB_ACTIONS');
  assert.equal(result.validation.tracked_projection.matches_current_head, false);
  assert.equal(result.active_work.pull_request.number, 9);
  assert.match(result.next_safe_action, /review\/owner gates/);
}

{
  const input = base();
  input.live.workflow_runs[0].conclusion = 'failure';
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.FAIL);
  assert.match(result.next_safe_action, /Repair the failing exact-head validation/);
}

{
  const input = base();
  input.live.workflow_runs = [];
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.match(result.next_safe_action, /obtain exact-head validation evidence/);
}

{
  const input = base();
  input.git = { head_sha: M, branch: 'main' };
  input.live.default_branch_head_sha = M;
  input.live.pull_requests = [];
  input.live.workflow_runs = [];
  const result = deriveCurrentSituation(input);
  assert.equal(result.accepted_source.state, 'ACCEPTED_MAIN');
  assert.equal(result.active_work.state, STATES.PASS);
  assert.match(result.next_safe_action, /Select and admit one bounded ChangeUnit/);
}

{
  const input = base();
  input.live = { available: false, default_branch_head_sha: null, pull_requests: [], workflow_runs: [] };
  const result = deriveCurrentSituation(input);
  assert.equal(result.active_work.state, STATES.UNKNOWN);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.match(result.next_safe_action, /Resolve live GitHub attestations/);
}

console.log('current-situation checks: PASS (5 cases)');
