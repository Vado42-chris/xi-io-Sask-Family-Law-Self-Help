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

function validationState(run) {
  if (!run) return STATES.UNKNOWN;
  if (run.conclusion === 'success') return STATES.PASS;
  if (['failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure'].includes(run.conclusion)) {
    return STATES.FAIL;
  }
  return STATES.UNKNOWN;
}

function currentPullRequest(pullRequests = [], headSha) {
  const matching = pullRequests.filter((pr) => pr && pr.head_sha === headSha && pr.state === 'open');
  if (matching.length === 1) return matching[0];
  return null;
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
  const validation = validationState(run);

  const onAcceptedMain = Boolean(headSha && defaultBranchHeadSha && headSha === defaultBranchHeadSha);
  const liveEvidenceAvailable = Boolean(live.available);

  let workState = STATES.UNKNOWN;
  let mutationAdmission = STATES.BLOCKED;
  let nextSafeAction = 'Resolve current repository identity, live attestations, and work custody.';

  if (!headSha) {
    workState = STATES.BLOCKED;
    nextSafeAction = 'Resolve exact Git HEAD before consequential work.';
  } else if (!liveEvidenceAvailable) {
    workState = STATES.UNKNOWN;
    nextSafeAction = 'Resolve live GitHub attestations for the exact HEAD; do not infer them from tracked status text.';
  } else if (pr) {
    workState = STATES.PASS;
    if (validation === STATES.FAIL) {
      nextSafeAction = `Repair the failing exact-head validation on PR #${pr.number} without broadening scope.`;
    } else if (validation === STATES.UNKNOWN) {
      const workflowClause = requiredWorkflowName ? ` for required workflow ${requiredWorkflowName}` : '';
      nextSafeAction = `Wait for or obtain exact-head validation evidence${workflowClause} for PR #${pr.number}.`;
    } else {
      nextSafeAction = `Resolve remaining review/owner gates for PR #${pr.number}; required validation is current for this exact head.`;
    }
  } else if (onAcceptedMain) {
    workState = STATES.PASS;
    nextSafeAction = 'Select and admit one bounded ChangeUnit from accepted main before creating a managed mutation lane.';
  } else {
    workState = STATES.UNKNOWN;
    nextSafeAction = 'No unique open PR owns this non-main exact head; resolve custody before consequential mutation.';
  }

  if (policy.mutation_admission === STATES.PASS) {
    mutationAdmission = STATES.PASS;
  } else if (policy.mutation_admission === STATES.UNKNOWN) {
    mutationAdmission = STATES.UNKNOWN;
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
      evidence_source: run ? 'LIVE_GITHUB_ACTIONS' : (liveEvidenceAvailable ? 'LIVE_GITHUB_ACTIONS_NO_MATCHING_COMPLETED_REQUIRED_RUN' : 'UNAVAILABLE'),
      run: run ? {
        id: run.id || null,
        number: run.run_number || null,
        name: run.name || null,
        conclusion: run.conclusion || null,
        head_sha: run.head_sha,
        html_url: run.html_url || null
      } : null,
      tracked_projection: {
        claim_present: trackedClaimsLiveValidation,
        validation_head_sha: tracked.validation_head_sha || null,
        matches_current_head: trackedValidationMatchesHead
      }
    },
    authority: {
      mutation_admission: mutationAdmission,
      note: 'Capability, branch existence, CI success, or accepted planning does not grant mutation authority.'
    },
    freshness: {
      live_attestations_available: liveEvidenceAvailable,
      tracked_projection_is_live_attestation: false,
      rule: 'Tracked repository projections declare required evidence and custody pointers; same-head CI/review outcomes are joined from live attestations.'
    },
    next_safe_action: nextSafeAction
  };
}
