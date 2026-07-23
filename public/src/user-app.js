const PRACTICE_STORAGE_PREFIX = "sfl.practice.v2";
const PRACTICE_FIXTURE = "synthetic-practice";
const SNAPSHOT = "jcc-kit-3j-2026-03-30";
const FORM = "fam-pd-7-5";

const els = {
  unlockGate: document.getElementById("unlock-gate"),
  appShell: document.getElementById("app-shell"),
  usePractice: document.getElementById("use-practice"),
  unlockPrivate: document.getElementById("unlock-private"),
  unlockError: document.getElementById("unlock-error"),
  matterLabel: document.getElementById("matter-label"),
  privacyChip: document.getElementById("privacy-chip"),
  lockNow: document.getElementById("lock-now"),
  nextStepCard: document.getElementById("next-step-card"),
  waitingList: document.getElementById("waiting-list"),
  toggleFullPlan: document.getElementById("toggle-full-plan"),
  fullPlan: document.getElementById("full-plan"),
  stepProgress: document.getElementById("step-progress"),
  stepHeading: document.getElementById("step-heading"),
  stepExplanation: document.getElementById("step-explanation"),
  stepGuidance: document.getElementById("step-guidance"),
  sectionGoal: document.getElementById("section-goal"),
  blockedPanel: document.getElementById("blocked-panel"),
  blockedMessage: document.getElementById("blocked-message"),
  answerPanel: document.getElementById("answer-panel"),
  fields: document.getElementById("fields"),
  formError: document.getElementById("form-error"),
  markUnknown: document.getElementById("mark-unknown"),
  backStep: document.getElementById("back-step"),
  helpAnswer: document.getElementById("help-answer"),
  helpDrawer: document.getElementById("help-drawer"),
  helpBody: document.getElementById("help-body"),
  closeHelp: document.getElementById("close-help"),
  openCourtWording: document.getElementById("open-court-wording"),
  openCourtWordingBlocked: document.getElementById("open-court-wording-blocked"),
  courtDialog: document.getElementById("court-wording-dialog"),
  courtBody: document.getElementById("court-wording-body"),
  showCurrentWork: document.getElementById("show-current-work"),
  backToPlan: document.getElementById("back-to-plan"),
  layout: document.querySelector(".layout")
};

const state = {
  mode: "practice",
  practiceSessionId: crypto.randomUUID(),
  interview: null,
  stepIndex: 0,
  /** @type {Record<string, {state: string, values?: object, unknowns?: object}>} */
  stepStates: {},
  memoryValues: {},
  lastFocusedBeforeHelp: null,
  privateIdleTimer: null
};

function practiceStorageKey() {
  return `${PRACTICE_STORAGE_PREFIX}:${PRACTICE_FIXTURE}:${SNAPSHOT}:${FORM}`;
}

function loadPracticeProgress() {
  try {
    return JSON.parse(localStorage.getItem(practiceStorageKey()) || "{}");
  } catch {
    return {};
  }
}

function savePracticeProgress() {
  if (state.mode !== "practice") return;
  localStorage.setItem(
    practiceStorageKey(),
    JSON.stringify({
      stepIndex: state.stepIndex,
      stepStates: state.stepStates,
      practiceSessionId: state.practiceSessionId
    })
  );
}

function clearPrivateMemory() {
  state.stepStates = {};
  state.memoryValues = {};
  state.stepIndex = 0;
  state.interview = null;
  els.fields.innerHTML = "";
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

function explicitStepState(stepToken) {
  return state.stepStates[stepToken]?.state || "not_started";
}

function announce(text) {
  els.stepHeading.setAttribute("aria-live", "polite");
  els.stepHeading.textContent = text;
}

function renderFields(step) {
  els.fields.innerHTML = "";
  const saved = state.stepStates[step.step_token]?.values || state.memoryValues[step.step_token] || {};
  for (const field of step.input_schema?.fields || []) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const label = document.createElement("label");
    label.setAttribute("for", field.field_token);
    label.textContent = field.label + (field.required ? "" : " (optional)");
    wrap.appendChild(label);

    let input;
    if (field.control === "textarea") {
      input = document.createElement("textarea");
      input.rows = 5;
    } else if (field.control === "select") {
      input = document.createElement("select");
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "Select…";
      input.appendChild(blank);
      for (const option of field.options || []) {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        input.appendChild(opt);
      }
    } else {
      input = document.createElement("input");
      input.type = field.control || "text";
    }
    input.id = field.field_token;
    input.name = field.field_token;
    input.value = saved[field.field_token] ?? "";
    input.addEventListener("input", () => {
      if (!state.memoryValues[step.step_token]) state.memoryValues[step.step_token] = {};
      state.memoryValues[step.step_token][field.field_token] = input.value;
      if (state.mode === "practice") {
        // Draft autosave only for practice, namespaced.
        const draft = state.stepStates[step.step_token] || { state: "draft", values: {} };
        draft.state = "draft";
        draft.values = { ...(draft.values || {}), [field.field_token]: input.value };
        state.stepStates[step.step_token] = draft;
        savePracticeProgress();
      }
    });
    wrap.appendChild(input);
    els.fields.appendChild(wrap);
  }
}

function renderPlan() {
  const steps = state.interview.steps;
  const next =
    steps.find((step) => {
      const st = explicitStepState(step.step_token);
      return st === "not_started" || st === "draft" || st === "needs_help";
    }) || steps[state.stepIndex];

  els.nextStepCard.innerHTML = `
    <span class="eyebrow">About ${next?.estimated_minutes || 3} minutes</span>
    <strong>${next?.prompt || next?.title || "Continue"}</strong>
    <p>${next?.section_goal || next?.explanation || next?.blocked_message || ""}</p>
    <button type="button" class="button button-primary" id="continue-next">Continue</button>
  `;
  document.getElementById("continue-next")?.addEventListener("click", () => {
    const index = steps.findIndex((step) => step.step_token === next.step_token);
    if (index >= 0) {
      state.stepIndex = index;
      renderStep();
      if (state.mode === "practice") savePracticeProgress();
      els.layout?.setAttribute("data-mobile-pane", "work");
    }
  });

  const waiting = steps
    .filter((step) => {
      const st = explicitStepState(step.step_token);
      return step.step_token !== currentStep()?.step_token && (st === "not_started" || st === "draft");
    })
    .slice(0, 3);
  els.waitingList.innerHTML = waiting.length
    ? `<p class="eyebrow">Also waiting on</p><ul>${waiting.map((step) => `<li>${step.title}</li>`).join("")}</ul>`
    : "";

  els.fullPlan.innerHTML = steps
    .map((step, index) => {
      const st = explicitStepState(step.step_token);
      const label =
        st === "answered"
          ? "Answered"
          : st === "unknown"
            ? "Unknown"
            : st === "draft"
              ? "Draft"
              : st === "blocked"
                ? "Blocked"
                : "Not started";
      return `<li><button type="button" class="plan-link" data-index="${index}">${label} · ${step.title}${index === state.stepIndex ? " (current)" : ""}</button></li>`;
    })
    .join("");
  els.fullPlan.querySelectorAll(".plan-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.stepIndex = Number(button.dataset.index);
      renderStep();
      if (state.mode === "practice") savePracticeProgress();
    });
  });
}

function renderStep() {
  const step = currentStep();
  if (!step) return;
  const total = state.interview.steps.length;
  els.stepProgress.textContent = `Step ${state.stepIndex + 1} of ${total}`;
  announce(step.prompt || step.title || "Step unavailable");
  els.stepExplanation.textContent = step.explanation || "";
  els.stepGuidance.textContent = step.answer_guidance || "";
  els.sectionGoal.textContent = step.section_goal
    ? `This section has ${step.field_count || step.input_schema?.fields?.length || 0} short questions.`
    : "";
  els.formError.hidden = true;

  if (step.blocked) {
    els.blockedPanel.hidden = false;
    els.answerPanel.hidden = true;
    els.blockedMessage.textContent =
      step.blocked_message || "This question is not yet available in the guided interview.";
    state.stepStates[step.step_token] = { state: "blocked" };
  } else {
    els.blockedPanel.hidden = true;
    els.answerPanel.hidden = false;
    renderFields(step);
  }
  renderPlan();
}

async function loadInterview() {
  state.interview = await fetchJson("/api/app/interview/fam-pd-7-5");
  if (state.mode === "practice") {
    const saved = loadPracticeProgress();
    if (saved.stepStates) state.stepStates = saved.stepStates;
    if (Number.isInteger(saved.stepIndex)) state.stepIndex = saved.stepIndex;
    if (saved.practiceSessionId) state.practiceSessionId = saved.practiceSessionId;
  }
  if (state.stepIndex >= state.interview.steps.length) state.stepIndex = 0;
  renderStep();
}

function armPrivateIdleTimeout() {
  clearTimeout(state.privateIdleTimer);
  if (state.mode !== "private") return;
  const reset = () => {
    clearTimeout(state.privateIdleTimer);
    state.privateIdleTimer = setTimeout(() => {
      lockPrivate("Private session timed out.");
    }, 30 * 60 * 1000);
  };
  ["click", "keydown", "mousemove", "scroll"].forEach((eventName) => {
    window.addEventListener(eventName, reset, { passive: true });
  });
  reset();
}

async function lockPrivate(message = "Private matter locked.") {
  try {
    await fetchJson("/api/local/unlock", { method: "DELETE" });
  } catch {
    // Cookie clear best-effort.
  }
  clearPrivateMemory();
  state.mode = "practice";
  els.lockNow.hidden = true;
  showUnlockGate(true);
  els.unlockError.hidden = false;
  els.unlockError.textContent = message;
}

async function startPractice() {
  state.mode = "practice";
  els.lockNow.hidden = true;
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
    // Load allowlisted projection once into memory, then rely on opaque interview API.
    const matter = await fetchJson("/api/local/matter");
    state.mode = "private";
    state.stepStates = {};
    state.memoryValues = {};
    els.lockNow.hidden = false;
    els.matterLabel.textContent = matter?.matter?.caption
      ? `Private · ${matter.matter.caption}`
      : "Private matter";
    els.privacyChip.textContent = "Memory only · Lock now clears this session";
    showUnlockGate(false);
    await loadInterview();
    armPrivateIdleTimeout();
  } catch (error) {
    els.unlockError.hidden = false;
    els.unlockError.textContent = error.message || "Unable to unlock private matter.";
  }
}

function collectValues() {
  const values = {};
  for (const input of els.fields.querySelectorAll("input, textarea, select")) {
    values[input.name] = input.value;
  }
  return values;
}

async function submitStep({ markUnknown = false } = {}) {
  const step = currentStep();
  if (!step || step.blocked) return;
  els.formError.hidden = true;
  const values = collectValues();
  const unknowns = {};
  if (markUnknown) {
    for (const field of step.input_schema?.fields || []) unknowns[field.field_token] = true;
  } else {
    const hasAny = Object.values(values).some((value) => String(value || "").trim() !== "");
    if (!hasAny) {
      els.formError.hidden = false;
      els.formError.textContent = "Enter an answer, or mark this step unknown.";
      return;
    }
  }

  try {
    const result = await fetchJson("/api/app/step/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: state.mode,
        practice_session_id: state.practiceSessionId,
        step_token: step.step_token,
        values,
        unknowns
      })
    });
    state.stepStates[step.step_token] = {
      state: result.step_state || (markUnknown ? "unknown" : "answered"),
      values: markUnknown ? {} : values
    };
    if (state.mode === "practice") savePracticeProgress();
    state.stepIndex = Math.min(state.stepIndex + 1, state.interview.steps.length - 1);
    renderStep();
  } catch (error) {
    els.formError.hidden = false;
    els.formError.textContent = error.payload?.details?.[0]?.error || error.message;
  }
}

async function showOfficialWording() {
  const step = currentStep();
  if (!step) return;
  const payload = await fetchJson("/api/app/step/official-wording", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ step_token: step.step_token })
  });
  els.courtBody.innerHTML = (payload.entries || [])
    .map(
      (entry) =>
        `<p><strong>${entry.label}</strong><br><span>${entry.source_label || "Court wording unavailable."}</span></p>`
    )
    .join("");
  els.courtDialog.showModal();
}

async function bootstrap() {
  const session = await fetchJson("/api/local/session");

  els.usePractice.addEventListener("click", startPractice);
  els.unlockPrivate.addEventListener("click", unlockPrivate);
  els.lockNow.addEventListener("click", () => lockPrivate("Private matter locked."));
  els.toggleFullPlan.addEventListener("click", () => {
    const open = els.fullPlan.hidden;
    els.fullPlan.hidden = !open;
    els.toggleFullPlan.textContent = open ? "Hide full work plan" : "View full work plan";
  });
  els.answerPanel.addEventListener("submit", (event) => {
    event.preventDefault();
    submitStep({ markUnknown: false });
  });
  els.markUnknown.addEventListener("click", () => submitStep({ markUnknown: true }));
  els.backStep.addEventListener("click", () => {
    state.stepIndex = Math.max(0, state.stepIndex - 1);
    renderStep();
    if (state.mode === "practice") savePracticeProgress();
  });
  els.helpAnswer.addEventListener("click", () => {
    const step = currentStep();
    if (!step?.answer_guidance) {
      els.helpBody.textContent =
        "Help is unavailable for this step. View the exact court wording or ask an authorized reviewer.";
    } else {
      els.helpBody.textContent = step.answer_guidance;
    }
    state.lastFocusedBeforeHelp = document.activeElement;
    els.helpDrawer.hidden = false;
    els.closeHelp.focus();
  });
  els.closeHelp.addEventListener("click", () => {
    els.helpDrawer.hidden = true;
    (state.lastFocusedBeforeHelp || els.helpAnswer).focus?.();
  });
  els.openCourtWording.addEventListener("click", () => showOfficialWording());
  els.openCourtWordingBlocked.addEventListener("click", () => showOfficialWording());
  els.showCurrentWork?.addEventListener("click", () => els.layout?.setAttribute("data-mobile-pane", "work"));
  els.backToPlan?.addEventListener("click", () => els.layout?.setAttribute("data-mobile-pane", "plan"));

  if (!session.private_matter_present) {
    await startPractice();
    return;
  }

  // Never auto-restore private mode from a leftover cookie alone without an explicit unlock this session.
  // If cookie exists from prior unlock, still require gate unless user already acknowledged this page load via unlock button.
  showUnlockGate(true);
}

bootstrap().catch((error) => {
  showUnlockGate(true);
  els.unlockError.hidden = false;
  els.unlockError.textContent = error.message || "Unable to start the guided interview.";
});
