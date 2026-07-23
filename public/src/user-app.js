const STORAGE_KEY = "sfl.user-app.v1";
const PRACTICE_KEY = "sfl.user-app.practice";

const els = {
  unlockGate: document.getElementById("unlock-gate"),
  appShell: document.getElementById("app-shell"),
  usePractice: document.getElementById("use-practice"),
  unlockPrivate: document.getElementById("unlock-private"),
  unlockError: document.getElementById("unlock-error"),
  matterLabel: document.getElementById("matter-label"),
  privacyChip: document.getElementById("privacy-chip"),
  nextStepCard: document.getElementById("next-step-card"),
  waitingList: document.getElementById("waiting-list"),
  toggleFullPlan: document.getElementById("toggle-full-plan"),
  fullPlan: document.getElementById("full-plan"),
  workflowStages: document.getElementById("workflow-stages"),
  stepProgress: document.getElementById("step-progress"),
  stepHeading: document.getElementById("step-heading"),
  stepExplanation: document.getElementById("step-explanation"),
  stepGuidance: document.getElementById("step-guidance"),
  blockedPanel: document.getElementById("blocked-panel"),
  blockedMessage: document.getElementById("blocked-message"),
  answerPanel: document.getElementById("answer-panel"),
  answerInput: document.getElementById("answer-input"),
  markUnknown: document.getElementById("mark-unknown"),
  saveContinue: document.getElementById("save-continue"),
  helpAnswer: document.getElementById("help-answer"),
  helpDrawer: document.getElementById("help-drawer"),
  helpBody: document.getElementById("help-body"),
  closeHelp: document.getElementById("close-help"),
  openCourtWording: document.getElementById("open-court-wording"),
  courtDialog: document.getElementById("court-wording-dialog"),
  courtBody: document.getElementById("court-wording-body")
};

const state = {
  mode: "practice",
  interview: null,
  stepIndex: 0,
  answers: {},
  unknowns: {},
  lastFocusedBeforeHelp: null
};

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLocal() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      mode: state.mode,
      stepIndex: state.stepIndex,
      answers: state.answers,
      unknowns: state.unknowns
    })
  );
}

async function fetchJson(url, options) {
  const response = await fetch(url, { cache: "no-store", ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || `Request failed: ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

function showUnlockGate(show) {
  els.unlockGate.hidden = !show;
  els.appShell.hidden = show;
}

function currentStep() {
  return state.interview?.steps?.[state.stepIndex] || null;
}

function announce(text) {
  els.stepHeading.setAttribute("aria-live", "polite");
  els.stepHeading.textContent = text;
}

function renderPlan() {
  const steps = state.interview.steps;
  const next = steps.find((step, index) => index >= state.stepIndex && !state.answers[step.interaction_step_id] && !state.unknowns[step.interaction_step_id]) || steps[state.stepIndex];
  els.nextStepCard.innerHTML = `
    <span class="eyebrow">About ${next?.estimated_minutes || 3} minutes</span>
    <strong>${next?.presentation?.plain_language_prompt || next?.title || "Continue"}</strong>
    <p>${next?.presentation?.short_explanation || next?.blocked_message || ""}</p>
    <button type="button" class="button button-primary" id="continue-next">Continue</button>
  `;
  document.getElementById("continue-next")?.addEventListener("click", () => {
    const index = steps.findIndex((step) => step.interaction_step_id === next.interaction_step_id);
    if (index >= 0) {
      state.stepIndex = index;
      renderStep();
      saveLocal();
    }
  });

  const waiting = steps.filter((step, index) => index !== state.stepIndex && !state.answers[step.interaction_step_id] && !state.unknowns[step.interaction_step_id]).slice(0, 3);
  els.waitingList.innerHTML = waiting.length
    ? `<p class="eyebrow">Also waiting on</p><ul>${waiting.map((step) => `<li>${step.title}</li>`).join("")}</ul>`
    : "";

  els.fullPlan.innerHTML = steps
    .map((step, index) => {
      const done = state.answers[step.interaction_step_id] || state.unknowns[step.interaction_step_id];
      return `<li>${done ? "Done · " : ""}${step.title}${index === state.stepIndex ? " (current)" : ""}</li>`;
    })
    .join("");

  els.workflowStages.innerHTML = (state.interview.workflow?.stages || [])
    .map((stage) => `<li>${stage.title}${stage.blocks_next_if_incomplete ? " · can block next stage" : ""}</li>`)
    .join("");
}

function renderStep() {
  const step = currentStep();
  if (!step) return;
  const total = state.interview.steps.length;
  els.stepProgress.textContent = `Step ${state.stepIndex + 1} of ${total}`;
  announce(step.presentation?.plain_language_prompt || step.title);
  els.stepExplanation.textContent = step.presentation?.short_explanation || "";
  els.stepGuidance.textContent = step.presentation?.answer_guidance || "";

  if (step.blocked || !step.presentation) {
    els.blockedPanel.hidden = false;
    els.answerPanel.hidden = true;
    els.blockedMessage.textContent = step.blocked_message || "This question is not yet available in the guided interview.";
  } else {
    els.blockedPanel.hidden = true;
    els.answerPanel.hidden = false;
    els.answerInput.value = state.answers[step.interaction_step_id] || "";
    if (state.unknowns[step.interaction_step_id]) {
      els.answerInput.value = "";
      els.answerInput.placeholder = "Marked unknown";
    } else {
      els.answerInput.placeholder = "";
    }
  }
  renderPlan();
}

async function loadInterview() {
  state.interview = await fetchJson("/api/app/interview/fam-pd-7-5");
  const saved = loadLocal();
  if (saved.mode === state.mode) {
    state.stepIndex = Number.isInteger(saved.stepIndex) ? saved.stepIndex : 0;
    state.answers = saved.answers || {};
    state.unknowns = saved.unknowns || {};
  }
  if (state.stepIndex >= state.interview.steps.length) state.stepIndex = 0;
  renderStep();
}

async function startPractice() {
  state.mode = "practice";
  localStorage.setItem(PRACTICE_KEY, "1");
  els.matterLabel.textContent = "Practice matter";
  els.privacyChip.textContent = "Practice information only · nothing can be sent";
  showUnlockGate(false);
  await loadInterview();
}

async function unlockPrivate() {
  els.unlockError.hidden = true;
  try {
    await fetchJson("/api/local/unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        acknowledge_privacy_boundary: true,
        route: "/app"
      })
    });
    const matter = await fetchJson("/api/local/matter");
    state.mode = "private";
    els.matterLabel.textContent = "Private matter";
    els.privacyChip.textContent = "Unlocked locally · do not commit or transmit";
    showUnlockGate(false);
    await loadInterview();
    if (matter?.matter?.caption) {
      els.matterLabel.textContent = `Private · ${matter.matter.caption}`;
    }
  } catch (error) {
    els.unlockError.hidden = false;
    els.unlockError.textContent = error.message || "Unable to unlock private matter.";
  }
}

async function bootstrap() {
  const session = await fetchJson("/api/local/session");
  const preferPractice = localStorage.getItem(PRACTICE_KEY) === "1";

  els.usePractice.addEventListener("click", startPractice);
  els.unlockPrivate.addEventListener("click", unlockPrivate);
  els.toggleFullPlan.addEventListener("click", () => {
    const open = els.fullPlan.hidden;
    els.fullPlan.hidden = !open;
    els.toggleFullPlan.textContent = open ? "Hide full work plan" : "View full work plan";
  });
  els.saveContinue.addEventListener("click", () => {
    const step = currentStep();
    if (!step || step.blocked) return;
    state.answers[step.interaction_step_id] = els.answerInput.value.trim();
    delete state.unknowns[step.interaction_step_id];
    state.stepIndex = Math.min(state.stepIndex + 1, state.interview.steps.length - 1);
    saveLocal();
    renderStep();
  });
  els.markUnknown.addEventListener("click", () => {
    const step = currentStep();
    if (!step || step.blocked) return;
    state.unknowns[step.interaction_step_id] = true;
    delete state.answers[step.interaction_step_id];
    saveLocal();
    renderStep();
  });
  els.helpAnswer.addEventListener("click", () => {
    state.lastFocusedBeforeHelp = document.activeElement;
    const step = currentStep();
    els.helpBody.textContent = step?.presentation?.answer_guidance
      || "Help is unavailable for this step. View the exact court wording or ask an authorized reviewer.";
    els.helpDrawer.hidden = false;
    els.closeHelp.focus();
  });
  els.closeHelp.addEventListener("click", () => {
    els.helpDrawer.hidden = true;
    (state.lastFocusedBeforeHelp || els.helpAnswer).focus?.();
  });
  els.openCourtWording.addEventListener("click", async () => {
    const step = currentStep();
    const lines = (step?.line_item_ids || []).join(", ") || "No line items bound.";
    els.courtBody.textContent = `Court line items for this step:\n${lines}\n\nOpen /source-review for catalog labels. AI wording is never used as a fallback.`;
    els.courtDialog.showModal();
  });

  if (!session.private_matter_present) {
    await startPractice();
    return;
  }

  if (session.unlocked) {
    state.mode = "private";
    showUnlockGate(false);
    els.matterLabel.textContent = "Private matter";
    els.privacyChip.textContent = "Unlocked locally · do not commit or transmit";
    await loadInterview();
    return;
  }

  if (preferPractice) {
    await startPractice();
    return;
  }

  showUnlockGate(true);
}

bootstrap().catch((error) => {
  showUnlockGate(true);
  els.unlockError.hidden = false;
  els.unlockError.textContent = error.message || "Unable to start the guided interview.";
});
