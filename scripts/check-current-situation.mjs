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
      workflow_runs: [{ id: 1, run_number: 120, name: 'Foundation check', status: 'completed', conclusion: 'success', head_sha: H }],
      workflow_jobs: [{
        run_id: 1,
        id: 101,
        status: 'completed',
        conclusion: 'success',
        runner_id: 42,
        runner_name: 'GitHub Actions 42',
        steps: [{ number: 1, name: 'Run repository checks', status: 'completed', conclusion: 'success' }]
      }],
      reviews: [{ id: 44, state: 'COMMENTED', user_login: 'external-reviewer', commit_id: H, submitted_at: '2026-08-17T00:00:00Z' }]
    },
    policy: {
      lane_admission: STATES.PASS,
      worker_mutation_authority: STATES.BLOCKED,
      review_gate: STATES.UNKNOWN,
      owner_gate: STATES.UNKNOWN,
      project_parallel_mutation_policy: 'GLOBAL_SINGLE_MUTATION_LANE',
      serialized_wait_prs: [],
      required_validation_workflow_name: 'Foundation check'
    },
    ...overrides
  };
}

{
  const result = deriveCurrentSituation(base());
  assert.equal(result.validation.state, STATES.PASS);
  assert.equal(result.validation.required_workflow_name, 'Foundation check');
  assert.equal(result.validation.evidence_source, 'LIVE_GITHUB_ACTIONS_WITH_RUNNER_EVIDENCE');
  assert.equal(result.validation.runner_evidence.complete, true);
  assert.equal(result.validation.runner_evidence.executed_jobs, 1);
  assert.equal(result.validation.tracked_projection.matches_current_head, false);
  assert.equal(result.active_work.pull_request.number, 9);
  assert.equal(result.authority.lane_admission, STATES.PASS);
  assert.equal(result.authority.worker_mutation_authority, STATES.BLOCKED);
  assert.equal(result.authority.lane_admission_is_not_worker_authority, true);
  assert.equal(result.review_attestations.exact_head_review_count, 1);
  assert.deepEqual(result.review_attestations.principals, ['external-reviewer']);
  assert.equal(result.project_custody.state, STATES.PASS);
  assert.match(result.next_safe_action, /Classify the existing exact-head review attestations/);
}

{
  const input = base();
  input.live.workflow_runs[0].conclusion = 'failure';
  input.live.workflow_jobs[0].conclusion = 'failure';
  input.live.workflow_jobs[0].steps[0].conclusion = 'failure';
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.FAIL);
  assert.match(result.next_safe_action, /Repair the failing exact-head validation/);
}

{
  const input = base();
  input.live.workflow_runs = [];
  input.live.workflow_jobs = [];
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.match(result.next_safe_action, /required workflow Foundation check/);
}

{
  const input = base();
  input.live.workflow_runs = [
    { id: 2, run_number: 121, name: 'Unrelated docs check', status: 'completed', conclusion: 'success', head_sha: H }
  ];
  input.live.workflow_jobs = [{ run_id: 2, id: 202, runner_id: 7, steps: [{ status: 'completed', conclusion: 'success' }] }];
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.validation.run, null);
  assert.equal(result.validation.evidence_source, 'LIVE_GITHUB_ACTIONS_NO_MATCHING_COMPLETED_REQUIRED_RUN');
}

{
  const input = base();
  input.live.workflow_jobs = [];
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.validation.runner_evidence.complete, false);
  assert.equal(result.validation.runner_evidence.classification, 'PRE_RUNNER_OR_INCOMPLETE_RUNNER_EVIDENCE');
  assert.equal(result.validation.evidence_source, 'LIVE_GITHUB_ACTIONS_INCOMPLETE_RUNNER_EVIDENCE');
  assert.match(result.next_safe_action, /do not convert provider prose or a zero\/empty runner record/);
}

{
  const input = base();
  input.live.workflow_jobs[0].runner_id = 0;
  input.live.workflow_jobs[0].runner_name = '';
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.validation.runner_evidence.evidence[0].runner_id, null);
}

{
  const input = base();
  input.live.workflow_jobs[0].runner_id = '000';
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.validation.runner_evidence.evidence[0].runner_id, null);
}

{
  const input = base();
  input.live.workflow_jobs[0].steps = [];
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.validation.runner_evidence.evidence[0].positive_execution, false);
}

{
  const input = base();
  input.live.workflow_jobs[0].steps = [
    { number: 1, name: 'Skipped setup', status: 'completed', conclusion: 'skipped' },
    { number: 2, name: 'Cancelled checks', status: 'completed', conclusion: 'cancelled' }
  ];
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.validation.runner_evidence.executed_jobs, 0);
  assert.equal(result.validation.runner_evidence.evidence[0].steps_executed, 0);
  assert.equal(result.validation.runner_evidence.evidence[0].positive_execution, false);
}

{
  const input = base();
  input.live.workflow_runs[0].conclusion = 'failure';
  input.live.workflow_jobs = [];
  const result = deriveCurrentSituation(input);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.validation.runner_evidence.classification, 'PRE_RUNNER_OR_INCOMPLETE_RUNNER_EVIDENCE');
  assert.doesNotMatch(result.next_safe_action, /Repair the failing exact-head validation/);
}

{
  const input = base();
  input.git = { head_sha: M, branch: 'main' };
  input.live.default_branch_head_sha = M;
  input.live.pull_requests = [];
  input.live.workflow_runs = [];
  input.live.workflow_jobs = [];
  input.live.reviews = [];
  input.policy.lane_admission = STATES.UNKNOWN;
  const result = deriveCurrentSituation(input);
  assert.equal(result.accepted_source.state, 'ACCEPTED_MAIN');
  assert.equal(result.active_work.state, STATES.PASS);
  assert.equal(result.authority.lane_admission, STATES.UNKNOWN);
  assert.equal(result.authority.worker_mutation_authority, STATES.BLOCKED);
  assert.match(result.next_safe_action, /Select and admit one bounded ChangeUnit/);
}

{
  const input = base();
  input.live = { available: false, default_branch_head_sha: null, pull_requests: [], workflow_runs: [], workflow_jobs: [], reviews: [] };
  const result = deriveCurrentSituation(input);
  assert.equal(result.active_work.state, STATES.UNKNOWN);
  assert.equal(result.validation.state, STATES.UNKNOWN);
  assert.equal(result.authority.worker_mutation_authority, STATES.BLOCKED);
  assert.match(result.next_safe_action, /Resolve live GitHub attestations/);
}

{
  const input = base();
  delete input.policy.lane_admission;
  delete input.policy.worker_mutation_authority;
  const result = deriveCurrentSituation(input);
  assert.equal(result.authority.lane_admission, STATES.UNKNOWN);
  assert.equal(result.authority.worker_mutation_authority, STATES.BLOCKED);
}

{
  const input = base();
  input.live.reviews = [{ id: 45, state: 'APPROVED', user_login: 'stale-reviewer', commit_id: M, submitted_at: '2026-08-16T00:00:00Z' }];
  const result = deriveCurrentSituation(input);
  assert.equal(result.review_attestations.exact_head_review_count, 0);
  assert.equal(result.review_attestations.state, 'NONE_OBSERVED_EXACT_HEAD');
  assert.match(result.next_safe_action, /Obtain exact-head review evidence/);
}

{
  const input = base();
  input.policy.review_gate = STATES.PASS;
  input.policy.owner_gate = STATES.BLOCKED;
  const result = deriveCurrentSituation(input);
  assert.equal(result.gates.review, STATES.PASS);
  assert.equal(result.gates.owner, STATES.BLOCKED);
  assert.match(result.next_safe_action, /owner disposition/);
}

{
  const input = base();
  input.policy.review_gate = STATES.PASS;
  input.policy.owner_gate = STATES.PASS;
  const result = deriveCurrentSituation(input);
  assert.match(result.next_safe_action, /verify merge-specific authority/);
  assert.equal(result.authority.worker_mutation_authority, STATES.BLOCKED);
}

{
  const input = base();
  input.live.pull_requests.push({ number: 10, state: 'open', draft: true, base: 'main', head_sha: 'cccccccccccccccccccccccccccccccccccccccc' });
  const result = deriveCurrentSituation(input);
  assert.equal(result.project_custody.state, STATES.BLOCKED);
  assert.equal(result.active_work.state, STATES.BLOCKED);
  assert.deepEqual(result.project_custody.conflicting_sibling_prs, [10]);
  assert.match(result.next_safe_action, /Resolve sibling open mutation lane\(s\) #10/);
}

{
  const input = base();
  input.live.pull_requests.push({ number: 10, state: 'open', draft: true, base: 'main', head_sha: 'cccccccccccccccccccccccccccccccccccccccc' });
  input.policy.serialized_wait_prs = [10];
  const result = deriveCurrentSituation(input);
  assert.equal(result.project_custody.state, STATES.PASS);
  assert.deepEqual(result.project_custody.waiting_sibling_prs, [10]);
  assert.deepEqual(result.project_custody.conflicting_sibling_prs, []);
  assert.match(result.next_safe_action, /Classify the existing exact-head review attestations/);
}

{
  const input = base();
  input.live.pull_requests.push({ number: 10, state: 'open', draft: true, base: 'main', head_sha: 'cccccccccccccccccccccccccccccccccccccccc' });
  input.policy.project_parallel_mutation_policy = null;
  const result = deriveCurrentSituation(input);
  assert.equal(result.project_custody.state, STATES.UNKNOWN);
  assert.equal(result.active_work.state, STATES.UNKNOWN);
  assert.match(result.next_safe_action, /Resolve project-wide concurrency\/custody/);
}

{
  const input = base();
  input.policy.serialized_wait_prs = [10];
  const result = deriveCurrentSituation(input);
  assert.equal(result.project_custody.state, STATES.UNKNOWN);
  assert.deepEqual(result.project_custody.stale_serialized_wait_prs, [10]);
  assert.match(result.next_safe_action, /Reconcile stale serialized WAIT declaration/);
}

console.log('current-situation checks: PASS (20 cases)');
