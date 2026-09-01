export const STATES = Object.freeze({
  PASS: 'PASS',
  FAIL: 'FAIL',
  BLOCKED: 'BLOCKED',
  UNKNOWN: 'UNKNOWN',
  NOT_APPLICABLE: 'NOT_APPLICABLE'
});

function latestCompletedRun(runs = [], headSha, requiredWorkflowName) {
  return runs
    .filter((run) => {
      if (!run || run.head_sha !== headSha || run.status !== 'completed') return false;
      if (!requiredWorkflowName) return true;
      return run.name === requiredWorkflowName;
    })
    .sort((a, b) => {
      const an = Number(a.run_number || 0);
      const bn = Number(b.run_number || 0);
      if (an !== bn) return bn - an;
      return String(b.updated_at || '').localeCompare(String(a.updated_at || ''));
    })[0] || null;
}

function normalizeRunnerIdentity(value) {
  if (value == null) return null;
  const normalized = String(value).trim();
  if (!normalized || /^0+$/.test(normalized)) return null;
  return normalized;
}

function runnerEvidence(run, jobs = []) {
  if (!run) {
    return {
      complete: false,
      classification: 'NO_MATCHING_COMPLETED_REQUIRED_RUN',
      jobs_observed: 0,
      executed_jobs: 0,
      evidence: []
    };
  }

  const matching = jobs.filter((job) => job && String(job.run_id) === String(run.id));
  const evidence = matching.map((job) => {
    const runnerId = normalizeRunnerIdentity(job.runner_id ?? job.runnerId);
    const runnerName = String(job.runner_name || '').trim() || null;
    const steps = Array.isArray(job.steps) ? job.steps : [];
    const stepsExecuted = steps.filter((step) => {
      if (!step || step.status !== 'completed') return false;
      return !['skipped', 'cancelled'].includes(String(step.conclusion || '').toLowerCase());
    }).length;
    return {
      id: job.id || null,
      status: job.status || null,
      conclusion: job.conclusion || null,
      runner_id: runnerId,
      runner_name: runnerName,
      steps_count: steps.length,
      steps_executed: stepsExecuted,
      positive_execution: Boolean(runnerId && stepsExecuted >= 1)
    };
  });
  const executedJobs = evidence.filter((job) => job.positive_execution);

  return {
    complete: executedJobs.length > 0,
    classification: executedJobs.length > 0 ? 'RUNNER_EXECUTED' : 'PRE_RUNNER_OR_INCOMPLETE_RUNNER_EVIDENCE',
    jobs_observed: matching.length,
    executed_jobs: executedJobs.length,
    evidence
  };
}

function validationState(run, jobs = []) {
  if (!run) return { state: STATES.UNKNOWN, runner: runnerEvidence(run, jobs) };
  const runner = runnerEvidence(run, jobs);
  if (!runner.complete) return { state: STATES.UNKNOWN, runner };
  if (run.conclusion === 'success') return { state: STATES.PASS, runner };
  if (['failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure'].includes(run.conclusion)) {
    return { state: STATES.FAIL, runner };
  }
  return { state: STATES.UNKNOWN, runner };
}

function currentPullRequest(pullRequests = [], headSha) {
  const matching = pullRequests.filter((pr) => pr && pr.head_sha === headSha && pr.state === 'open');
  if (matching.length === 1) return matching[0];
  return null;
}

function exactHeadReviews(reviews = [], headSha) {
  return reviews
    .filter((review) => review && review.commit_id === headSha)
    .sort((a, b) => String(a.submitted_at || '').localeCompare(String(b.submitted_at || '')));
}

function policyState(value, fallback) {
  return Object.values(STATES).includes(value) ? value : fallback;
}

export function deriveCurrentSituation(input) {
  const {
    repo = {},
    git = {},
    tracked = {},
    live = {},
    policy = {}
  } = input || {};

  const headSha = git.head_sha || null;
  const defaultBranch = repo.default_branch || 'main';
  const defaultBranchHeadSha = live.default_branch_head_sha || null;
  const requiredWorkflowName = policy.required_validation_workflow_name || null;
  const pr = currentPullRequest(live.pull_requests || [], headSha);
  const run = latestCompletedRun(live.workflow_runs || [], headSha, requiredWorkflowName);
  const validationResult = validationState(run, live.workflow_jobs || []);
  const validation = validationResult.state;
  const reviews = exactHeadReviews(live.reviews || [], headSha);

  const onAcceptedMain = Boolean(headSha && defaultBranchHeadSha && headSha === defaultBranchHeadSha);
  const liveEvidenceAvailable = Boolean(live.available);
  const laneAdmission = policyState(policy.lane_admission, STATES.UNKNOWN);
  const workerMutationAuthority = policyState(policy.worker_mutation_authority, STATES.BLOCKED);
  const reviewGate = policyState(policy.review_gate, STATES.UNKNOWN);
  const ownerGate = policyState(policy.owner_gate, STATES.UNKNOWN);
  const parallelMutationPolicy = policy.project_parallel_mutation_policy || null;
  const serializedWaitPrs = [...new Set((policy.serialized_wait_prs || []).map(Number).filter(Number.isInteger))].sort((a, b) => a - b);
  const siblingPulls = (live.pull_requests || []).filter((candidate) =>
    candidate && candidate.state === 'open' && candidate.head_sha !== headSha && candidate.base === defaultBranch
  );
  const siblingNumbers = new Set(siblingPulls.map((candidate) => Number(candidate.number)));
  const waitingSiblingPulls = siblingPulls.filter((candidate) => serializedWaitPrs.includes(Number(candidate.number)));
  const conflictingSiblingPulls = siblingPulls.filter((candidate) => !serializedWaitPrs.includes(Number(candidate.number)));
  const staleSerializedWaitPrs = serializedWaitPrs.filter((number) => !siblingNumbers.has(number));

  let projectCustody = STATES.PASS;
  if (pr && staleSerializedWaitPrs.length > 0) {
    projectCustody = STATES.UNKNOWN;
  } else if (pr && conflictingSiblingPulls.length > 0) {
    projectCustody = parallelMutationPolicy === 'GLOBAL_SINGLE_MUTATION_LANE' ? STATES.BLOCKED : STATES.UNKNOWN;
  }

  let workState = STATES.UNKNOWN;
  let nextSafeAction = 'Resolve current repository identity, live attestations, and work custody.';

  if (!headSha) {
    workState = STATES.BLOCKED;
    nextSafeAction = 'Resolve exact Git HEAD before consequential work.';
  } else if (!liveEvidenceAvailable) {
    workState = STATES.UNKNOWN;
    nextSafeAction = 'Resolve live GitHub attestations for the exact HEAD; do not infer them from tracked status text.';
  } else if (pr) {
    workState = STATES.PASS;
    if (projectCustody === STATES.BLOCKED) {
      workState = STATES.BLOCKED;
      nextSafeAction = `Resolve sibling open mutation lane(s) ${conflictingSiblingPulls.map((candidate) => `#${candidate.number}`).join(', ')} against project custody policy before consequential work on PR #${pr.number}.`;
    } else if (projectCustody === STATES.UNKNOWN) {
      workState = STATES.UNKNOWN;
      if (staleSerializedWaitPrs.length > 0) {
        nextSafeAction = `Reconcile stale serialized WAIT declaration(s) ${staleSerializedWaitPrs.map((number) => `#${number}`).join(', ')} before treating PR #${pr.number} as project-current.`;
      } else {
        nextSafeAction = `Resolve project-wide concurrency/custody for sibling open PR(s) ${conflictingSiblingPulls.map((candidate) => `#${candidate.number}`).join(', ')} before treating PR #${pr.number} as project-current.`;
      }
    } else if (validation === STATES.FAIL) {
      nextSafeAction = `Repair the failing exact-head validation on PR #${pr.number} without broadening scope.`;
    } else if (validation === STATES.UNKNOWN) {
      const workflowClause = requiredWorkflowName ? ` for required workflow ${requiredWorkflowName}` : '';
      const runnerClause = run && !validationResult.runner.complete ? ` Runner evidence is ${validationResult.runner.classification}; do not convert provider prose or a zero/empty runner record into PASS or repository FAIL.` : '';
      nextSafeAction = `Wait for or obtain exact-head validation evidence${workflowClause} for PR #${pr.number}.${runnerClause}`;
    } else if (reviewGate === STATES.PASS && ownerGate === STATES.PASS) {
      nextSafeAction = `Review and owner gates are recorded PASS for PR #${pr.number}; verify merge-specific authority before any merge or acceptance effect.`;
    } else if (reviewGate === STATES.PASS) {
      nextSafeAction = `Wait for or obtain owner disposition for PR #${pr.number}; exact-head validation and review gates are current.`;
    } else if (reviews.length > 0) {
      nextSafeAction = `Classify the existing exact-head review attestations and owner gate for PR #${pr.number}; do not redispatch review merely because qualification is unresolved.`;
    } else {
      nextSafeAction = `Obtain exact-head review evidence for PR #${pr.number}, then resolve the owner gate; required validation is current.`;
    }
  } else if (onAcceptedMain) {
    workState = STATES.PASS;
    nextSafeAction = 'Select and admit one bounded ChangeUnit from accepted main before creating a managed mutation lane.';
  } else {
    workState = STATES.UNKNOWN;
    nextSafeAction = 'No unique open PR owns this non-main exact head; resolve custody before consequential mutation.';
  }

  const trackedClaimsLiveValidation = Boolean(tracked.validation_claim);
  const trackedValidationMatchesHead = Boolean(
    tracked.validation_head_sha && headSha && tracked.validation_head_sha === headSha
  );

  return {
    schema: 'sfl.current-situation.v1',
    generated_from: {
      repo: repo.full_name || null,
      default_branch: defaultBranch,
      head_sha: headSha,
      branch: git.branch || null
    },
    accepted_source: {
      state: onAcceptedMain ? 'ACCEPTED_MAIN' : 'PROPOSED_OR_NON_MAIN_HEAD',
      main_sha: defaultBranchHeadSha,
      head_sha: headSha
    },
    active_work: {
      state: workState,
      pull_request: pr ? {
        number: pr.number,
        state: pr.state,
        draft: Boolean(pr.draft),
        base: pr.base || defaultBranch,
        head_sha: pr.head_sha
      } : null
    },
    validation: {
      state: validation,
      required_workflow_name: requiredWorkflowName,
      evidence_source: run ? (validationResult.runner.complete ? 'LIVE_GITHUB_ACTIONS_WITH_RUNNER_EVIDENCE' : 'LIVE_GITHUB_ACTIONS_INCOMPLETE_RUNNER_EVIDENCE') : (liveEvidenceAvailable ? 'LIVE_GITHUB_ACTIONS_NO_MATCHING_COMPLETED_REQUIRED_RUN' : 'UNAVAILABLE'),
      run: run ? {
        id: run.id || null,
        number: run.run_number || null,
        name: run.name || null,
        conclusion: run.conclusion || null,
        head_sha: run.head_sha,
        html_url: run.html_url || null
      } : null,
      runner_evidence: validationResult.runner,
      tracked_projection: {
        claim_present: trackedClaimsLiveValidation,
        validation_head_sha: tracked.validation_head_sha || null,
        matches_current_head: trackedValidationMatchesHead
      }
    },
    review_attestations: {
      state: reviews.length > 0 ? 'OBSERVED_EXACT_HEAD' : (liveEvidenceAvailable ? 'NONE_OBSERVED_EXACT_HEAD' : 'UNAVAILABLE'),
      exact_head_review_count: reviews.length,
      principals: [...new Set(reviews.map((review) => review.user_login).filter(Boolean))].sort(),
      reviews: reviews.map((review) => ({
        id: review.id || null,
        state: review.state || null,
        user_login: review.user_login || null,
        commit_id: review.commit_id,
        submitted_at: review.submitted_at || null,
        html_url: review.html_url || null
      })),
      qualification_rule: 'Observed review records are evidence only. They do not prove independence, approval, owner disposition, or merge authority without an explicit qualified gate.'
    },
    gates: {
      review: reviewGate,
      owner: ownerGate
    },
    project_custody: {
      state: projectCustody,
      parallel_mutation_policy: parallelMutationPolicy,
      serialized_wait_prs: serializedWaitPrs,
      sibling_open_prs: siblingPulls.map((candidate) => ({
        number: candidate.number,
        base: candidate.base || defaultBranch,
        head_sha: candidate.head_sha || null,
        draft: Boolean(candidate.draft)
      })),
      waiting_sibling_prs: waitingSiblingPulls.map((candidate) => candidate.number),
      conflicting_sibling_prs: conflictingSiblingPulls.map((candidate) => candidate.number),
      stale_serialized_wait_prs: staleSerializedWaitPrs,
      rule: 'Local unique-PR and exact-head CI evidence do not establish project-wide custody. An open sibling is not an active writer when it is explicitly serialized as WAIT; every other concurrent mutation lane requires an explicit relationship/admission basis.'
    },
    authority: {
      lane_admission: laneAdmission,
      worker_mutation_authority: workerMutationAuthority,
      lane_admission_is_not_worker_authority: true,
      note: 'An admitted work lane does not authorize every worker. Capability, branch existence, CI success, review presence, or accepted planning also does not grant worker mutation authority.'
    },
    freshness: {
      live_attestations_available: liveEvidenceAvailable,
      tracked_projection_is_live_attestation: false,
      rule: 'Tracked repository projections declare required evidence and custody pointers; same-head CI/review outcomes are joined from live attestations.'
    },
    next_safe_action: nextSafeAction
  };
}
