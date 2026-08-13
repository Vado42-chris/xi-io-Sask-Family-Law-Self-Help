import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { deriveCurrentSituation, STATES } from './current-situation-core.mjs';

const REQUIRED_VALIDATION_WORKFLOW = 'Foundation check';
const CURRENT_PLAN_PATH = 'docs/ops/CURRENT_EXECUTION_PLAN.md';

function sh(command, args = []) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function parseRepo(remote) {
  const cleaned = remote.trim().replace(/\.git$/, '');
  const match = cleaned.match(/github\.com[:/]([^/]+)\/([^/]+)$/);
  if (!match) throw new Error(`Unsupported origin remote: ${remote}`);
  return { owner: match[1], repo: match[2], full_name: `${match[1]}/${match[2]}` };
}

function field(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  return match ? match[1].trim() : null;
}

function trackedValidationHint() {
  const paths = [
    'docs/ops/ACTIVE_WORK_CHECKPOINT.md',
    'docs/ops/CURRENT_LANE_STATUS.md'
  ];
  let combined = '';
  for (const path of paths) {
    try { combined += `\n${readFileSync(path, 'utf8')}`; } catch {}
  }
  const sha = combined.match(/\b[0-9a-f]{40}\b/i)?.[0] || null;
  const claim = /Foundation Check|validation\s*=|validation\s*:/i.test(combined);
  return { validation_claim: claim, validation_head_sha: sha };
}

function trackedCustody() {
  try {
    const content = readFileSync(CURRENT_PLAN_PATH, 'utf8');
    return {
      active_branch: field(content, 'active_branch'),
      active_pr: Number(field(content, 'active_pr')) || null,
      mutation_admission: field(content, 'mutation_admission')
    };
  } catch {
    return { active_branch: null, active_pr: null, mutation_admission: null };
  }
}

async function githubJson(url) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'xi-io-sam-law-current-situation'
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${url}`);
  return response.json();
}

async function main() {
  const headSha = sh('git', ['rev-parse', 'HEAD']);
  const branch = sh('git', ['branch', '--show-current']) || null;
  const remote = sh('git', ['remote', 'get-url', 'origin']);
  const identity = parseRepo(remote);
  const api = `https://api.github.com/repos/${identity.owner}/${identity.repo}`;

  let live = { available: false, pull_requests: [], workflow_runs: [], default_branch_head_sha: null };
  let defaultBranch = 'main';
  let liveError = null;

  try {
    const repo = await githubJson(api);
    defaultBranch = repo.default_branch || 'main';
    const [mainCommit, pulls, runs] = await Promise.all([
      githubJson(`${api}/commits/${encodeURIComponent(defaultBranch)}`),
      githubJson(`${api}/pulls?state=open&per_page=100`),
      githubJson(`${api}/actions/runs?head_sha=${encodeURIComponent(headSha)}&per_page=20`)
    ]);
    live = {
      available: true,
      default_branch_head_sha: mainCommit.sha,
      pull_requests: pulls.map((pr) => ({
        number: pr.number,
        state: pr.state,
        draft: Boolean(pr.draft),
        base: pr.base?.ref || defaultBranch,
        head_sha: pr.head?.sha || null
      })),
      workflow_runs: (runs.workflow_runs || []).map((run) => ({
        id: run.id,
        run_number: run.run_number,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        head_sha: run.head_sha,
        updated_at: run.updated_at,
        html_url: run.html_url
      }))
    };
  } catch (error) {
    liveError = error instanceof Error ? error.message : String(error);
  }

  const custody = trackedCustody();
  const matchingPulls = live.pull_requests.filter((pr) => pr.head_sha === headSha && pr.state === 'open');
  const uniquePull = matchingPulls.length === 1 ? matchingPulls[0] : null;
  const branchMatches = !branch || custody.active_branch === branch;
  const laneAdmission = Boolean(
    uniquePull &&
    custody.active_pr === uniquePull.number &&
    custody.mutation_admission === 'LIMITED_TO_THIS_CHANGEUNIT' &&
    branchMatches
  ) ? STATES.PASS : STATES.UNKNOWN;

  const situation = deriveCurrentSituation({
    repo: { full_name: identity.full_name, default_branch: defaultBranch },
    git: { head_sha: headSha, branch },
    tracked: trackedValidationHint(),
    live,
    policy: {
      lane_admission: laneAdmission,
      worker_mutation_authority: STATES.BLOCKED,
      required_validation_workflow_name: REQUIRED_VALIDATION_WORKFLOW
    }
  });

  situation.authority.source = {
    lane_admission: `${CURRENT_PLAN_PATH} + exact open PR/HEAD join`,
    worker_mutation_authority: 'No worker-specific Task Context/admission grant was supplied to this read-only resolver.'
  };

  if (liveError) situation.live_attestation_error = liveError;
  console.log(JSON.stringify(situation, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    schema: 'sfl.current-situation.error.v1',
    state: 'BLOCKED',
    error: error instanceof Error ? error.message : String(error),
    next_safe_action: 'Resolve local Git identity/current HEAD before consequential work.'
  }, null, 2));
  process.exitCode = 1;
});
