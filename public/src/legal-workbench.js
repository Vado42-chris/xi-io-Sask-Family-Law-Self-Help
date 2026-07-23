import {
  aggregateMatterWizardProgress,
  buildWizardState,
  reconcileWizardSelection
} from "./wizard-state.js";
import {
  QUESTION_SOURCE_HINTS,
  buildMatterReadiness,
  identifiedRequiredDocuments,
  progressStateFromAnswers,
  workBlockersForDocument
} from "./document-diagnosis.js";

const FORM_CATALOG_ROOT = "/sources/jcc-kit-3j/2026-03-30";
const DIAGNOSIS_PATH = "/workflows/jcc-kit-3j/2026-03-30/required-document-diagnosis.json";
const FORM_FILES = {
  "fam-pd-7-2": "fam-pd-7-2.json",
  "form-10-3-draft-order": "form-10-3-draft-order.json",
  "form-10-3-child-support-order": "form-10-3-child-support-order.json",
  "form-15-8b": "form-15-8b.json",
  "form-12-3": "form-12-3.json",
  "fam-pd-7-5": "fam-pd-7-5.json"
};

const PANE_STORAGE_KEY = "xiio-sfl-pane-widths-practice";
const DEFAULT_QUEUE_W = 360;
const DEFAULT_INSPECTOR_W = 330;

const state = {
  manifest: null,
  fixture: null,
  diagnosis: null,
  matterReadiness: null,
  forms: new Map(),
  wizardStates: new Map(),
  matterWizardState: null,
  workItems: [],
  selectedWorkId: null,
  selectedFormId: null,
  selectedQuestionId: null,
  queueView: "today",
  workspaceMode: "guided",
  currentQuestionIndex: 0,
  searchTerm: "",
  answers: {},
  unknownAnswers: {},
  revision: {},
  validation: {},
  route: "matter",
  lastSelectionReason: "initial",
  privateMode: false,
  privateMatterPresent: false,
  matterMode: "practice",
  privateLockAt: null,
  inspectorExpanded: false,
  inspectorCollapsed: false,
  readinessExpanded: true,
  disclosureLevel: "today"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const asArray = (value) => Array.isArray(value) ? value : [];

const elements = {
  appShell: $("#app-shell"),
  queueList: $("#queue-list"),
  globalSearch: $("#global-search"),
  progressPercent: $("#matter-progress-percent"),
  progressBar: $("#matter-progress-bar"),
  progressCopy: $("#matter-progress-copy"),
  workspaceEmpty: $("#workspace-empty"),
  formWorkspace: $("#form-workspace"),
  genericWorkspace: $("#generic-workspace"),
  formNumber: $("#form-number"),
  formTitle: $("#form-title"),
  formSourceSummary: $("#form-source-summary"),
  formQuestionCount: $("#form-question-count"),
  formAnsweredCount: $("#form-answered-count"),
  formReviewCount: $("#form-review-count"),
  formRevision: $("#form-revision"),
  currentSectionTitle: $("#current-section-title"),
  questionPosition: $("#question-position"),
  guidedCard: $("#guided-question-card"),
  guidedView: $("#guided-view"),
  sectionView: $("#section-view"),
  pageView: $("#page-view"),
  packageView: $("#package-view"),
  inspectorTitle: $("#inspector-title"),
  inspectorContent: $("#inspector-content"),
  genericEyebrow: $("#generic-eyebrow"),
  genericTitle: $("#generic-title"),
  genericSummary: $("#generic-summary"),
  genericContent: $("#generic-content"),
  genericAction: $("#generic-action"),
  ibalDrawer: $("#ibal-drawer"),
  drawerScrim: $("#drawer-scrim"),
  ibalContext: $("#ibal-context"),
  ibalConversation: $("#ibal-conversation"),
  ibalPrompt: $("#ibal-prompt"),
  todayCard: $("#today-card"),
  casePlanCard: $("#case-plan-card"),
  matterModeBanner: $("#matter-mode-banner"),
  privateLockBanner: $("#private-lock-banner"),
  lockNow: $("#lock-now"),
  formReadinessLine: $("#form-readiness-line"),
  queueResizer: $("#queue-resizer"),
  inspectorResizer: $("#inspector-resizer"),
  toggleInspector: $("#toggle-inspector"),
  inspectorShell: $(".context-inspector")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sourceSection(lineItemId) {
  const raw = String(lineItemId || "general").split(".")[0];
  const labels = {
    header: "Court heading",
    execution: "Signature and execution",
    service: "Service details",
    commissioner: "Commissioning",
    court: "Court-completed fields",
    notice: "Notice",
    schedule: "Schedule",
    children: "Children",
    support: "Support",
    property: "Property"
  };
  if (labels[raw]) return labels[raw];
  if (/^p\d+/i.test(raw)) return `Paragraph ${raw.replace(/^p/i, "")}`;
  return raw.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

function humanize(value) {
  return String(value || "unknown").replaceAll("_", " ");
}

function answerFor(formId, lineItemId) {
  return state.answers?.[formId]?.[lineItemId];
}

function isUnknown(formId, lineItemId) {
  return asArray(state.unknownAnswers?.[formId]).includes(lineItemId);
}

function hasValue(value) {
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function currentForm() {
  return state.selectedFormId ? state.forms.get(state.selectedFormId) : null;
}

function currentWizardState() {
  return state.selectedFormId ? state.wizardStates.get(state.selectedFormId) : null;
}

function currentNavigationItem() {
  return currentWizardState()?.navigation?.[state.currentQuestionIndex] || null;
}

function currentQuestion() {
  const form = currentForm();
  const navigationItem = currentNavigationItem();
  return form?.line_items?.find((item) => item.line_item_id === navigationItem?.line_item_id) || null;
}

function evaluateWizardStates(preferredSelection = state.selectedQuestionId) {
  const forms = [...state.forms.values()];
  state.matterWizardState = aggregateMatterWizardProgress(forms, {
    answers: state.answers,
    unknownAnswers: state.unknownAnswers
  });
  state.wizardStates = new Map(state.matterWizardState.forms.map((formState) => [formState.form_id, formState]));

  const wizardState = currentWizardState();
  if (!wizardState) return;
  const selection = reconcileWizardSelection(wizardState, preferredSelection);
  state.currentQuestionIndex = selection.index < 0 ? 0 : selection.index;
  state.selectedQuestionId = selection.line_item_id;
  state.lastSelectionReason = selection.reason;
}

function getFormProgress(form) {
  const wizard = state.wizardStates.get(form.form_id);
  if (!wizard) return { total: 0, answered: 0, unknown: 0, blockers: 0, unresolved: 0, percent: 0 };
  return {
    total: wizard.applicable_answerable_items,
    answered: wizard.completed_items,
    unknown: wizard.needs_help_items,
    blockers: wizard.blocking_items,
    unresolved: wizard.unresolved_obligation_items,
    percent: wizard.percent_complete
  };
}

function diagnosisDocForForm(formId) {
  return (state.diagnosis?.documents || []).find((doc) => doc.form_id === formId) || null;
}

function formWhyNeeded(formId) {
  return diagnosisDocForForm(formId)?.reason_required || "Included in the Kit #3J diagnosis snapshot for this matter.";
}

function formPlanGroup(formId) {
  return diagnosisDocForForm(formId)?.requirement_class || "conditional";
}

function progressLabel(progressState) {
  return ({
    not_started: "Not started",
    in_progress: "In progress",
    needs_review: "Needs review",
    complete: "Complete"
  })[progressState] || humanize(progressState);
}

function readinessLabel(readiness) {
  return progressLabel(readiness);
}

function refreshMatterReadiness() {
  if (!state.diagnosis) return;
  const formProgressById = {};
  for (const [formId, form] of state.forms.entries()) {
    formProgressById[formId] = getFormProgress(form);
  }
  state.matterReadiness = buildMatterReadiness({
    diagnosis: state.diagnosis,
    fixture: state.fixture,
    formProgressById
  });
}

function buildWorkItems() {
  refreshMatterReadiness();
  const forms = state.manifest.forms_included.map((entry) => {
    const form = state.forms.get(entry.form_id);
    const progress = getFormProgress(form);
    const doc = diagnosisDocForForm(entry.form_id);
    const readinessRow = state.matterReadiness?.document_states?.find((row) => row.form_id === entry.form_id);
    const progress_state = readinessRow?.progress_state || progressStateFromAnswers(progress);
    const work_blockers = readinessRow?.work_blockers || workBlockersForDocument(doc || { requirement_class: "conditional" }, progress);
    const package_blockers = readinessRow?.package_blockers || [];
    const missingParts = [];
    if (progress.blockers) missingParts.push(`${progress.blockers} required unanswered`);
    if (progress.unknown) missingParts.push(`${progress.unknown} marked unknown`);
    if (progress.unresolved) missingParts.push(`${progress.unresolved} need source review`);
    if (!missingParts.length && progress.percent < 100) missingParts.push("Remaining applicable questions");
    if (!missingParts.length) missingParts.push("Ready for human review");
    return {
      work_id: `form:${entry.form_id}`,
      type: "form",
      form_id: entry.form_id,
      document_id: doc?.document_id || entry.form_id,
      official_number: entry.official_number,
      title: entry.title,
      plan_group: doc?.requirement_class || "conditional",
      kind: doc?.kind || "form_you_complete",
      who_for: doc?.who_for || "Party using this kit snapshot",
      when_needed: doc?.when_needed || "Confirm from Notice and workflow stage",
      why_needed: formWhyNeeded(entry.form_id),
      governing_source: doc?.governing_source || null,
      verification_state: doc?.verification_state || "provisional",
      no_longer_required_when: doc?.no_longer_required_when || "",
      procedural_stage: doc?.procedural_stage || "",
      summary: `${progress.answered} of ${progress.total} applicable questions completed`,
      missing: missingParts.join(" · "),
      missing_parts: missingParts,
      next_action: progress_state === "complete" ? "Review answers" : `Continue ${entry.official_number}`,
      source_freshness: form?.status || "captured_unverified_current",
      progress_state,
      work_blockers,
      package_blockers,
      state: progress_state,
      readiness: progress_state,
      due_label: entry.form_id === "fam-pd-7-5"
        ? (state.fixture?.matter?.next_deadline_label || "Before conference (confirm Notice)")
        : doc?.when_needed || "Later stage",
      progress: progress.percent,
      answered: progress.answered,
      total: progress.total,
      blockers: progress.blockers + progress.unknown + progress.unresolved
    };
  });

  const extraDocs = (state.diagnosis?.documents || [])
    .filter((doc) => !doc.form_id)
    .map((doc) => {
      const readinessRow = state.matterReadiness?.document_states?.find((row) => row.document_id === doc.document_id);
      return {
        work_id: `doc:${doc.document_id}`,
        type: "document",
        document_id: doc.document_id,
        form_id: null,
        official_number: doc.official_number || "",
        title: doc.title,
        plan_group: doc.requirement_class,
        kind: doc.kind,
        who_for: doc.who_for,
        when_needed: doc.when_needed,
        why_needed: doc.reason_required,
        governing_source: doc.governing_source,
        verification_state: doc.verification_state,
        no_longer_required_when: doc.no_longer_required_when,
        procedural_stage: doc.procedural_stage,
        summary: humanize(doc.requirement_class),
        missing: readinessRow?.package_blockers?.join(" · ") || "Awaiting capture or confirmation",
        next_action: doc.requirement_class === "source_missing"
          ? "Capture official source before treating as complete"
          : "Archive and confirm when received",
        progress_state: "not_started",
        work_blockers: readinessRow?.work_blockers || ["external_document_pending"],
        package_blockers: readinessRow?.package_blockers || [],
        state: doc.requirement_class,
        readiness: "not_started",
        due_label: doc.when_needed,
        progress: 0,
        answered: 0,
        total: 0,
        blockers: 1
      };
    });

  state.workItems = [...forms, ...extraDocs, ...asArray(state.fixture.tasks), ...asArray(state.fixture.correspondence)];
}

function isCurrentStageForm(formId) {
  return formPlanGroup(formId) === "required_now";
}

function formItems() {
  return state.workItems.filter((item) => item.type === "form");
}

function computeMatterPlan() {
  const readiness = state.matterReadiness;
  const forms = formItems();
  const identified = identifiedRequiredDocuments(state.diagnosis || { documents: [] });
  const requiredFormIds = new Set(identified.map((doc) => doc.form_id).filter(Boolean));
  const tracked = forms.filter((item) => requiredFormIds.has(item.form_id));
  const completed = tracked.filter((item) => item.progress_state === "complete");
  const inProgress = tracked.filter((item) => item.progress_state === "in_progress" || item.progress_state === "needs_review");
  const notStarted = tracked.filter((item) => item.progress_state === "not_started");
  const next = forms.find((item) => item.plan_group === "required_now" && item.progress_state !== "complete") ||
    forms.find((item) => requiredFormIds.has(item.form_id) && item.progress_state !== "complete") ||
    forms.find((item) => item.progress_state !== "complete");
  return {
    stage: readiness?.procedural_stage_label || state.fixture?.matter?.stage || "Preparing Appearance Memo",
    stage_id: readiness?.procedural_stage || "preparing_appearance_memo",
    identified_required_count: readiness?.identified_required_count || identified.length,
    requirement_review_complete: Boolean(readiness?.requirement_review_complete),
    completed: completed.length,
    in_progress: inProgress.length,
    not_started: notStarted.length,
    next,
    deadline: state.fixture?.matter?.next_deadline_label || next?.due_label || "Confirm deadline from Notice",
    package_ready: false,
    package_blockers: readiness?.package_blockers || ["Requirement review is not complete"],
    checklist: readiness?.checklist || [],
    forms
  };
}

function filteredWorkItems() {
  return state.workItems.filter((item) => {
    let viewMatches = false;
    if (state.queueView === "today") {
      viewMatches =
        (item.type === "form" && isCurrentStageForm(item.form_id) && item.progress_state !== "complete") ||
        (item.type === "task" && item.state !== "done" && item.state !== "completed") ||
        (item.type === "correspondence" && item.state !== "archived") ||
        (item.type === "document" && ["court_issued", "source_missing"].includes(item.plan_group));
    } else if (state.queueView === "all" || state.queueView === "matter") {
      viewMatches = true;
    } else if (state.queueView === "required" || state.queueView === "forms") {
      viewMatches = (item.type === "form" || item.type === "document") &&
        ["required_now", "required_later", "needs_human_confirmation", "court_issued", "source_missing"].includes(item.plan_group);
    } else if (state.queueView === "later") {
      viewMatches = (item.type === "form" || item.type === "document") &&
        ["required_later", "conditional"].includes(item.plan_group);
    } else if (state.queueView === "evidence" || state.queueView === "tasks") {
      viewMatches = item.type === "task";
    } else if (state.queueView === "correspondence") {
      viewMatches = item.type === "correspondence";
    }
    if (!viewMatches) return false;
    if (!state.searchTerm) return true;
    return [item.title, item.summary, item.official_number, item.state, item.source_ref, item.why_needed, item.missing]
      .filter(Boolean).join(" ").toLowerCase().includes(state.searchTerm);
  });
}

function rowIcon(item) {
  if (item.type === "form" || item.type === "document") return "▤";
  if (item.type === "task") return "✓";
  if (item.type === "correspondence") return "✉";
  return "•";
}

function rowGroup(item) {
  if (state.queueView === "today") {
    if (item.type === "form") return "Continue today";
    return "Also waiting on";
  }
  if (item.type === "task") return "Evidence and supporting material";
  if (item.type === "correspondence") return "Messages";
  if (item.type === "form" || item.type === "document") {
    if (item.kind === "court_issued") return "Court-issued documents";
    if (item.kind === "proof_and_service") return "Proof and service documents";
    if (item.kind === "evidence_and_supporting") return "Evidence and supporting material";
    if (item.kind === "procedural_action") return "Procedural actions";
    if (item.plan_group === "source_missing") return "Source missing";
    if (item.plan_group === "needs_human_confirmation") return "Needs human confirmation";
    if (item.plan_group === "required_now") return "Forms you complete · Required now";
    if (item.plan_group === "required_later") return "Forms you complete · Required later";
    if (item.plan_group === "conditional") return "Forms you complete · Conditional";
    if (item.kind === "form_you_complete") return "Forms you complete";
    return "Forms you complete";
  }
  return "Other work";
}

function estimateMinutes(unanswered) {
  return Math.max(3, Math.min(25, unanswered * 2));
}

function setQueueView(view) {
  state.queueView = view;
  $$(".queue-tab").forEach((button) => {
    const active = button.dataset.queueView === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function renderMatterModeBanner() {
  if (!elements.matterModeBanner) return;
  if (elements.privateLockBanner) elements.privateLockBanner.classList.add("is-hidden");
  elements.matterModeBanner.classList.remove(
    "matter-mode-banner--practice",
    "matter-mode-banner--locked",
    "matter-mode-banner--private"
  );
  if (state.matterMode === "private_loaded") {
    elements.matterModeBanner.classList.add("matter-mode-banner--private");
    elements.matterModeBanner.innerHTML = `
      <strong>Your private case is loaded on this computer.</strong>
      <p>It will lock after 30 minutes without activity.</p>`;
    return;
  }
  if (state.matterMode === "private_locked" || state.privateMatterPresent) {
    elements.matterModeBanner.classList.add("matter-mode-banner--locked");
    elements.matterModeBanner.innerHTML = `
      <strong>Your private case is locked.</strong>
      <p>This screen is showing practice information. Unlock your case to continue working with your real materials.</p>
      <div class="matter-mode-banner__actions">
        <button type="button" class="primary-button" id="mode-unlock-private">Unlock private case</button>
      </div>
      <p class="private-lock-banner__error is-hidden" id="unlock-private-error" role="alert"></p>`;
    $("#mode-unlock-private", elements.matterModeBanner)?.addEventListener("click", unlockPrivateMatter);
    return;
  }
  elements.matterModeBanner.classList.add("matter-mode-banner--practice");
  elements.matterModeBanner.innerHTML = `
    <strong>You are viewing practice data, not your real case.</strong>
    <p>Your private matter is not loaded. No changes here affect your real legal materials.</p>`;
}

function renderCasePlanCard() {
  if (!elements.casePlanCard) return;
  const plan = computeMatterPlan();
  const show = state.route === "matter" || state.queueView === "today" || state.queueView === "required";
  elements.casePlanCard.classList.toggle("is-hidden", !show);
  if (!show) return;
  const nextActionLabel = plan.next
    ? (plan.next.official_number?.includes("7-5")
      ? "Continue Appearance Memo"
      : `Continue ${plan.next.official_number || plan.next.title}`)
    : "View required documents";
  const nextTitle = plan.next
    ? `${plan.next.official_number}: ${plan.next.title}`
    : "Open your required documents list";
  const why = plan.next?.why_needed || "Complete the documents identified for this stage.";
  const countLine = plan.requirement_review_complete
    ? `You need to complete <strong>${plan.identified_required_count}</strong> required documents for this stage.`
    : `<strong>${plan.identified_required_count}</strong> documents currently identified for this stage. Requirement review is not complete.`;
  const checklist = plan.checklist || [];
  const checklistHtml = checklist.map((item) => `
    <label class="readiness-check">
      <input type="checkbox" disabled ${item.state === "ready" ? "checked" : ""}>
      <span><strong>${item.state === "ready" ? "Ready" : item.state === "blocked" ? "Blocked" : "Not ready"}</strong> — ${escapeHtml(item.label)} <em>${escapeHtml(item.reason || "")}</em></span>
    </label>`).join("");
  elements.casePlanCard.innerHTML = `
    <p class="eyebrow">Case plan</p>
    <h3 id="case-plan-title">${escapeHtml(plan.stage)}</h3>
    <p class="case-plan-card__lead">${countLine}</p>
    <ul class="case-plan-card__status">
      <li><strong>${plan.completed}</strong> complete</li>
      <li><strong>${plan.in_progress}</strong> in progress</li>
      <li><strong>${plan.not_started}</strong> not started</li>
    </ul>
    <dl class="case-plan-card__meta">
      <div><dt>Next exact action</dt><dd>${escapeHtml(nextTitle)}</dd></div>
      <div><dt>Nearest deadline</dt><dd>${escapeHtml(plan.deadline)}</dd></div>
      <div><dt>Why this action matters</dt><dd>${escapeHtml(why)}</dd></div>
      <div><dt>Package status</dt><dd>Not ready · ${escapeHtml(plan.package_blockers[0] || "work incomplete")}</dd></div>
    </dl>
    <details class="readiness-details" ${state.readinessExpanded ? "open" : ""}>
      <summary>Before this stage is ready</summary>
      <div class="readiness-checklist">${checklistHtml || "<p>No checklist rows recorded.</p>"}</div>
    </details>
    <div class="case-plan-card__actions">
      <button class="primary-button" type="button" id="case-plan-continue">${escapeHtml(nextActionLabel)}</button>
      <button class="secondary-button" type="button" id="case-plan-required">Required documents</button>
    </div>`;
  $(".readiness-details", elements.casePlanCard)?.addEventListener("toggle", (event) => {
    state.readinessExpanded = event.target.open;
  });
  $("#case-plan-continue", elements.casePlanCard)?.addEventListener("click", () => {
    if (plan.next) selectWorkItem(plan.next.work_id);
    else {
      setQueueView("required");
      renderQueue();
      selectDefaultForCurrentRoute();
    }
  });
  $("#case-plan-required", elements.casePlanCard)?.addEventListener("click", () => {
    renderRoute("forms");
  });
}

function renderTodayCard() {
  if (!elements.todayCard) return;
  // Case plan card replaces the fragmented today card on My case / Today.
  elements.todayCard.classList.add("is-hidden");
  elements.todayCard.innerHTML = "";
}

function renderQueue() {
  renderMatterModeBanner();
  renderCasePlanCard();
  renderTodayCard();
  const items = filteredWorkItems();
  elements.queueList.innerHTML = "";
  const queueTitle = $("#queue-title");
  if (queueTitle) {
    queueTitle.textContent = state.route === "forms" || state.queueView === "required"
      ? "Required documents"
      : state.route === "evidence"
        ? "Evidence and homework"
        : state.route === "correspondence"
          ? "Messages"
          : "Your next steps";
  }
  if (!items.length) {
    elements.queueList.innerHTML = '<div class="generic-card"><strong>No matching work.</strong><p>Change the queue filter or search terms.</p></div>';
    return;
  }
  let lastGroup = null;
  for (const item of items) {
    const group = rowGroup(item);
    if (group !== lastGroup) {
      const label = document.createElement("p");
      label.className = "queue-group-label";
      label.textContent = group;
      elements.queueList.append(label);
      lastGroup = group;
    }
    const row = document.createElement("button");
    row.type = "button";
    row.className = `queue-row queue-row--${item.type}${state.selectedWorkId === item.work_id ? " is-selected" : ""}`;
    if (item.type === "form") {
      const packageNote = (item.package_blockers || []).slice(0, 1).join(" · ") || item.missing || "—";
      row.innerHTML = `
        <span class="queue-row__body">
          <span class="queue-row__top">
            <span class="queue-row__title">${escapeHtml(`${item.official_number} · ${item.title}`)}</span>
            <span class="queue-chip queue-chip--${escapeHtml(item.progress_state)}">${escapeHtml(progressLabel(item.progress_state))}</span>
          </span>
          <span class="queue-row__summary">${escapeHtml(item.why_needed || "")}</span>
          <div class="queue-row__progress-bar" aria-hidden="true"><progress max="100" value="${Number(item.progress) || 0}"></progress></div>
          <span class="queue-row__summary"><strong>${item.progress}%</strong> · ${escapeHtml(item.summary)}</span>
          <span class="queue-row__summary">Package blocked: ${escapeHtml(packageNote)}</span>
          <span class="queue-row__next">Next: ${escapeHtml(item.next_action || "")}</span>
        </span>`;
    } else if (item.type === "document") {
      row.innerHTML = `
        <span class="queue-row__body">
          <span class="queue-row__top">
            <span class="queue-row__title">${escapeHtml(`${item.official_number ? `${item.official_number} · ` : ""}${item.title}`)}</span>
            <span class="queue-chip queue-chip--blocked">${escapeHtml(humanize(item.plan_group))}</span>
          </span>
          <span class="queue-row__summary">${escapeHtml(item.why_needed || "")}</span>
          <span class="queue-row__summary">Work blockers: ${escapeHtml((item.work_blockers || []).join(", "))}</span>
          <span class="queue-row__next">Next: ${escapeHtml(item.next_action || "")}</span>
        </span>`;
    } else {
      row.innerHTML = `
        <span class="queue-row__body">
          <span class="queue-row__top">
            <span class="queue-row__title">${escapeHtml(item.title)}</span>
            <span class="queue-chip">${escapeHtml(humanize(item.state))}</span>
          </span>
          <span class="queue-row__summary">${escapeHtml(item.summary || "")}</span>
          <span class="queue-row__next">Next: ${escapeHtml(item.next_action || "Review this item")}</span>
        </span>`;
    }
    row.addEventListener("click", () => selectWorkItem(item.work_id));
    elements.queueList.append(row);
  }
}

function calculateMatterProgress() {
  const plan = computeMatterPlan();
  if (elements.progressPercent) {
    elements.progressPercent.textContent = `${plan.completed}/${plan.identified_required_count}`;
  }
  if (elements.progressBar) {
    const pct = plan.identified_required_count ? Math.round((plan.completed / plan.identified_required_count) * 100) : 0;
    elements.progressBar.style.width = `${pct}%`;
  }
  if (elements.progressCopy) {
    elements.progressCopy.textContent = plan.next
      ? `Next: ${plan.next.official_number}. ${plan.completed} of ${plan.identified_required_count} identified documents complete. Requirement review is not complete.`
      : `${plan.completed} of ${plan.identified_required_count} identified documents complete.`;
  }
}

function defaultWorkItemForRoute(route = state.route) {
  if (route === "forms" || route === "matter") {
    return formItems().find((item) => item.plan_group === "required_now" && item.progress < 100) ||
      formItems().find((item) => item.progress < 100) ||
      formItems()[0];
  }
  if (route === "evidence" || route === "tasks") {
    return state.workItems.find((item) => item.type === "task" && item.state !== "done" && item.state !== "completed") ||
      state.workItems.find((item) => item.type === "task");
  }
  if (route === "correspondence") {
    return state.workItems.find((item) => item.type === "correspondence");
  }
  return null;
}

function selectDefaultForCurrentRoute() {
  if (state.route === "ingress" || state.route === "activity" || state.route === "packages" || state.route === "review") {
    return;
  }
  const item = defaultWorkItemForRoute(state.route);
  if (item) selectWorkItem(item.work_id);
}

function selectWorkItem(workId) {
  const item = state.workItems.find((candidate) => candidate.work_id === workId);
  if (!item) return;
  state.selectedWorkId = workId;
  elements.appShell.classList.add("mobile-detail-open");
  if (item.type === "form") {
    state.selectedFormId = item.form_id;
    evaluateWizardStates(null);
    showFormWorkspace();
  } else {
    state.selectedFormId = null;
    state.selectedQuestionId = null;
    showGenericWorkspace(item);
  }
  renderQueue();
  renderInspector();
  updateIbalContext();
}

function showFormWorkspace() {
  elements.workspaceEmpty.classList.add("is-hidden");
  elements.genericWorkspace.classList.add("is-hidden");
  elements.formWorkspace.classList.remove("is-hidden");
  renderFormHeader();
  renderWorkspaceMode();
}

function showGenericWorkspace(item) {
  elements.workspaceEmpty.classList.add("is-hidden");
  elements.formWorkspace.classList.add("is-hidden");
  elements.genericWorkspace.classList.remove("is-hidden");
  elements.genericEyebrow.textContent = item.type === "task"
    ? "Matter task"
    : item.type === "document"
      ? humanize(item.kind || "document")
      : "Correspondence ingress";
  elements.genericTitle.textContent = item.official_number ? `${item.official_number} · ${item.title}` : item.title;
  elements.genericSummary.textContent = item.why_needed || item.summary || "";
  elements.genericAction.textContent = item.type === "task" ? "Mark reviewed" : "Preview only";
  elements.genericAction.disabled = item.type !== "task";
  const source = item.governing_source;
  elements.genericContent.innerHTML = `
    <article class="generic-card"><h3>Why this is in your plan</h3><p>${escapeHtml(item.why_needed || item.summary || "")}</p></article>
    <article class="generic-card"><h3>Progress / blockers</h3><p>Progress: ${escapeHtml(progressLabel(item.progress_state || "not_started"))}. Work blockers: ${escapeHtml((item.work_blockers || ["none"]).join(", "))}</p><p>Package blockers: ${escapeHtml((item.package_blockers || []).join("; ") || "none listed")}</p></article>
    ${source ? `<article class="generic-card"><h3>Governing source</h3><p>${escapeHtml(source.citation)}</p><p>Source date ${escapeHtml(source.source_date)} · verification ${escapeHtml(item.verification_state || "provisional")}</p><p>No longer required when: ${escapeHtml(item.no_longer_required_when || "Not recorded")}</p></article>` : ""}
    <article class="generic-card"><h3>Next safe action</h3><p>${escapeHtml(item.next_action || "Review this item")}</p></article>
    <article class="generic-card"><h3>Boundary</h3><p>Nothing is filed, served, emailed, or transmitted from this preview.</p></article>`;
}

function renderFormHeader() {
  const form = currentForm();
  if (!form) return;
  const progress = getFormProgress(form);
  const work = formItems().find((item) => item.form_id === form.form_id);
  const plan = computeMatterPlan();
  elements.formNumber.textContent = form.official_number;
  elements.formTitle.textContent = form.title;
  elements.formSourceSummary.textContent = `Source pages ${form.source_pages?.join("–") || "not recorded"} · source ${form.source_date} · captured ${new Date(form.captured_at).toLocaleDateString()}`;
  elements.formQuestionCount.textContent = progress.total;
  elements.formAnsweredCount.textContent = progress.answered;
  elements.formReviewCount.textContent = progress.unknown + progress.unresolved;
  elements.formRevision.textContent = `r${state.revision[form.form_id] || 1}`;
  if (elements.formReadinessLine) {
    const progressState = work?.progress_state || "not_started";
    elements.formReadinessLine.innerHTML = `
      <span class="queue-chip queue-chip--${escapeHtml(progressState)}">${escapeHtml(progressLabel(progressState))}</span>
      <span class="status-token status-token--warning">Package blocked: ${(work?.package_blockers || plan.package_blockers).slice(0, 1).map(escapeHtml).join(" · ") || "incomplete"}</span>`;
  }
}

function renderWorkspaceMode() {
  const form = currentForm();
  if (!form) return;
  const views = { guided: elements.guidedView, sections: elements.sectionView, pages: elements.pageView, package: elements.packageView };
  Object.values(views).forEach((view) => view.classList.add("is-hidden"));
  views[state.workspaceMode].classList.remove("is-hidden");
  $$(".mode-button").forEach((button) => button.classList.toggle("is-active", button.dataset.mode === state.workspaceMode));
  if (state.workspaceMode === "guided") renderGuidedQuestion();
  if (state.workspaceMode === "sections") renderSectionReview();
  if (state.workspaceMode === "pages") renderPagePreview();
  if (state.workspaceMode === "package") renderPackagePreview();
}

function inputControl(form, item) {
  const current = answerFor(form.form_id, item.line_item_id);
  const control = document.createElement("div");
  control.className = "field-control";
  if (item.kind === "single_choice" && Array.isArray(item.options)) {
    const list = document.createElement("div");
    list.className = "choice-list";
    item.options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "choice-option";
      label.innerHTML = `<input type="radio" name="${escapeHtml(item.line_item_id)}" value="${escapeHtml(option)}" ${current === option ? "checked" : ""}><span>${escapeHtml(option)}</span>`;
      list.append(label);
    });
    control.append(list);
    return control;
  }
  if (item.kind === "boolean") {
    const list = document.createElement("div");
    list.className = "boolean-control";
    [["true", "Yes"], ["false", "No"]].forEach(([value, text]) => {
      const label = document.createElement("label");
      label.className = "choice-option";
      label.innerHTML = `<input type="radio" name="${escapeHtml(item.line_item_id)}" value="${value}" ${String(current) === value ? "checked" : ""}><span>${text}</span>`;
      list.append(label);
    });
    control.append(list);
    return control;
  }
  if (["long_text", "address"].includes(item.kind)) {
    const textarea = document.createElement("textarea");
    textarea.value = current ?? "";
    textarea.placeholder = "Synthetic preview answer";
    textarea.dataset.answerInput = "true";
    control.append(textarea);
    return control;
  }
  const input = document.createElement("input");
  input.type = item.kind === "date" ? "date" : item.kind === "email" ? "email" : item.kind === "integer" ? "number" : "text";
  input.value = current ?? "";
  input.placeholder = ["attachment", "attachment_confirmation", "signature"].includes(item.kind) ? "Governed workflow not implemented" : "Synthetic preview answer";
  input.disabled = ["attachment", "attachment_confirmation", "signature"].includes(item.kind);
  input.dataset.answerInput = "true";
  control.append(input);
  if (input.disabled) {
    const note = document.createElement("p");
    note.className = "question-note";
    note.textContent = "This capability remains blocked until evidence, signature, or finalization controls are implemented.";
    control.append(note);
  }
  return control;
}

function readQuestionControl(card, item) {
  const selected = $("input[type=radio]:checked", card);
  if (selected) return { hasValue: true, value: item.kind === "boolean" ? selected.value === "true" : selected.value };
  const field = $("[data-answer-input=true]", card);
  if (!field || field.disabled) return { hasValue: false, value: undefined };
  return { hasValue: String(field.value).trim() !== "", value: field.value };
}

function humanQuestionPrompt(item) {
  const label = String(item.source_label || "").trim();
  if (/requested$/i.test(label)) {
    return `Are you asking the court for this: ${label.replace(/\s+requested$/i, "")}?`;
  }
  if (/^COURT FILE NUMBER$/i.test(label)) return "What is the court file number on your documents?";
  if (/^JUDICIAL CENTRE$/i.test(label)) return "Which judicial centre is this matter in?";
  if (/^PETITIONER/i.test(label)) return "Who is named as the petitioner?";
  if (/^RESPONDENT/i.test(label)) return "Who is named as the respondent?";
  if (/scheduled on/i.test(label)) return "When is the Judicial Case Conference scheduled?";
  if (/filed on behalf of/i.test(label)) return "Who is this Appearance Memo filed for?";
  if (/I do not know|unknown/i.test(label)) return label;
  return label.endsWith("?") ? label : `${label}`;
}

function renderGuidedQuestion() {
  const form = currentForm();
  const wizard = currentWizardState();
  const navigationItem = currentNavigationItem();
  const item = currentQuestion();
  elements.guidedCard.innerHTML = "";
  if (!form || !wizard || !item || !navigationItem) {
    elements.guidedCard.innerHTML = '<article class="generic-card"><h3>No applicable user questions</h3><p>This form currently has no user-answerable questions under the evaluated facts.</p></article>';
    elements.questionPosition.textContent = "0 of 0";
    return;
  }
  state.selectedQuestionId = item.line_item_id;
  elements.currentSectionTitle.textContent = sourceSection(item.line_item_id);
  elements.questionPosition.textContent = `${state.currentQuestionIndex + 1} of ${wizard.navigation.length}`;
  const fragment = $("#question-template").content.cloneNode(true);
  const card = $(".question-card", fragment);
  $(".question-kind", fragment).textContent = humanize(item.kind);
  $(".question-label", fragment).textContent = humanQuestionPrompt(item);
  $(".question-rule", fragment).textContent = "Optional: open Source and audit details in the right panel for official wording and rules.";
  $(".question-input", fragment).append(inputControl(form, item));
  const unknownButton = $(".question-unknown", fragment);
  unknownButton.textContent = isUnknown(form.form_id, item.line_item_id) ? "Marked: needs help" : "I do not know yet";
  unknownButton.addEventListener("click", () => {
    const list = new Set(asArray(state.unknownAnswers[form.form_id]));
    if (list.has(item.line_item_id)) list.delete(item.line_item_id); else list.add(item.line_item_id);
    state.unknownAnswers[form.form_id] = [...list];
    state.revision[form.form_id] = (state.revision[form.form_id] || 1) + 1;
    persistDemoState();
    refreshAfterAnswerChange("Needs-help state updated in the local preview.", item.line_item_id);
  });
  $(".question-save", fragment).addEventListener("click", () => {
    const result = readQuestionControl(card, item);
    if (!result.hasValue) {
      showToast("No editable answer was entered. Blocked fields cannot be saved in this preview.", "warning");
      return;
    }
    state.answers[form.form_id] ||= {};
    state.answers[form.form_id][item.line_item_id] = result.value;
    state.unknownAnswers[form.form_id] = asArray(state.unknownAnswers[form.form_id]).filter((id) => id !== item.line_item_id);
    state.revision[form.form_id] = (state.revision[form.form_id] || 1) + 1;
    persistDemoState();
    refreshAfterAnswerChange("Answer saved. Applicability and progress were recalculated.", item.line_item_id);
    moveQuestion(1, true);
  });
  $(".question-help", fragment).addEventListener("click", openIbal);
  elements.guidedCard.append(fragment);
  updateIbalContext();
}

function applicableQuestionsBySection(form) {
  const wizard = state.wizardStates.get(form.form_id);
  const byId = new Map(form.line_items.map((item) => [item.line_item_id, item]));
  return wizard.navigation.reduce((groups, navigationItem) => {
    const item = byId.get(navigationItem.line_item_id);
    const section = sourceSection(item.line_item_id);
    groups[section] ||= [];
    groups[section].push({ item, navigationItem });
    return groups;
  }, {});
}

function renderSectionReview() {
  const form = currentForm();
  elements.sectionView.innerHTML = "";
  for (const [section, entries] of Object.entries(applicableQuestionsBySection(form))) {
    const answered = entries.filter(({ navigationItem }) => navigationItem.answered).length;
    const card = document.createElement("article");
    card.className = "section-card";
    card.innerHTML = `<header><div><h3>${escapeHtml(section)}</h3><p>${answered} of ${entries.length} applicable questions answered</p></div><span class="status-token">${entries.length} applicable</span></header><div class="section-card__body"></div>`;
    const body = $(".section-card__body", card);
    entries.forEach(({ item, navigationItem }) => {
      const row = document.createElement("div");
      row.className = "section-question-row";
      row.tabIndex = 0;
      const answerState = navigationItem.needs_help ? ["Needs help", "is-unknown"] : navigationItem.answered ? ["Answered", "is-answered"] : navigationItem.unresolved_obligation ? ["Rule review", "is-unknown"] : ["Not answered", ""];
      row.innerHTML = `<div><strong>${escapeHtml(item.source_label)}</strong></div><span class="answer-state ${answerState[1]}">${answerState[0]}</span>`;
      row.addEventListener("click", () => {
        state.workspaceMode = "guided";
        setSelectedQuestion(item.line_item_id);
      });
      row.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") row.click(); });
      body.append(row);
    });
    elements.sectionView.append(card);
  }
}

function renderPagePreview() {
  const form = currentForm();
  const entries = Object.entries(applicableQuestionsBySection(form));
  elements.pageView.innerHTML = "";
  const banner = document.createElement("div");
  banner.className = "answer-review-banner";
  banner.setAttribute("role", "status");
  banner.innerHTML = "<strong>ANSWER REVIEW</strong><span>THIS IS NOT THE DOCUMENT YOU WILL FILE</span>";
  elements.pageView.append(banner);
  const targetPageCount = Math.max(1, Math.min(5, Math.ceil(entries.length / 4)));
  const sectionsPerPage = Math.ceil(entries.length / targetPageCount);
  for (let pageIndex = 0; pageIndex < targetPageCount; pageIndex += 1) {
    const pageSections = entries.slice(pageIndex * sectionsPerPage, (pageIndex + 1) * sectionsPerPage);
    if (!pageSections.length) continue;
    const page = document.createElement("article");
    page.className = "form-page";
    page.innerHTML = `<div class="form-page__court"><p>COURT OF KING'S BENCH FOR SASKATCHEWAN</p><h3>${escapeHtml(form.official_number)} · ${escapeHtml(form.title)}</h3></div><div class="form-page__meta"><strong>COURT FILE NUMBER</strong><span>${escapeHtml(answerFor(form.form_id, "header.court_file_number") || "________________")}</span><strong>JUDICIAL CENTRE</strong><span>${escapeHtml(answerFor(form.form_id, "header.judicial_centre") || "________________")}</span><strong>SOURCE DATE</strong><span>${escapeHtml(form.source_date)}</span><strong>PREVIEW REVISION</strong><span>r${state.revision[form.form_id] || 1}</span></div><div class="form-page__body"></div><div class="form-page__footer">Structural answer preview only · not an official court blank · page ${pageIndex + 1} of ${targetPageCount} · filing PDF uses official-template fill</div>`;
    const body = $(".form-page__body", page);
    pageSections.forEach(([section, questions]) => {
      const sectionElement = document.createElement("section");
      sectionElement.className = "form-page__section";
      sectionElement.innerHTML = `<h4>${escapeHtml(section)}</h4>`;
      questions.forEach(({ item }) => {
        const value = answerFor(form.form_id, item.line_item_id);
        const field = document.createElement("div");
        field.className = "form-page__field";
        field.innerHTML = `<strong>${escapeHtml(item.source_label)}</strong><p>${escapeHtml(isUnknown(form.form_id, item.line_item_id) ? "[Needs help]" : value === true ? "Yes" : value === false ? "No" : value || "________________")}</p>`;
        sectionElement.append(field);
      });
      body.append(sectionElement);
    });
    elements.pageView.append(page);
  }
}

function renderPackagePreview() {
  const form = currentForm();
  const progress = getFormProgress(form);
  const blockers = [];
  if (progress.blockers) blockers.push(`${progress.blockers} applicable required questions remain unanswered.`);
  if (progress.unknown) blockers.push(`${progress.unknown} applicable questions are marked needs help.`);
  if (progress.unresolved) blockers.push(`${progress.unresolved} source rules require human interpretation before completion can be claimed.`);
  if (form.status !== "independently_reviewed") blockers.push("The source transcription has not received independent page-level approval.");
  blockers.push("Attachment vault, signatures, commissioning, recipients, and transmission are not implemented.");
  elements.packageView.innerHTML = `<div class="package-summary"><article class="package-card"><header><div><p class="eyebrow">Package candidate</p><h3>${escapeHtml(form.official_number)} review package</h3></div><span class="status-token status-token--warning">Blocked</span></header><p>This manifest uses the evaluated applicable-question state, but remains synthetic and non-final.</p></article><article class="package-card"><h3>Bound artifacts</h3><div class="package-item"><span>▤</span><div><strong>${escapeHtml(form.title)}</strong><p>Document revision r${state.revision[form.form_id] || 1}</p></div><span>${progress.percent}%</span></div><div class="package-item"><span>⌁</span><div><strong>Source snapshot</strong><p>${escapeHtml(form.snapshot_id)} · ${escapeHtml(form.source_sha256)}</p></div><span>captured</span></div></article><article class="package-card"><h3>Blocking conditions</h3><ul>${blockers.map((blocker) => `<li class="package-blocker">${escapeHtml(blocker)}</li>`).join("")}</ul></article><article class="package-card"><h3>Future egress choices</h3><p>Print, private download, filing, service, and email remain separate governed adapters.</p><button class="secondary-button" type="button" disabled>Finalize package</button></article></div>`;
}

function evaluationForSelectedQuestion() {
  return currentWizardState()?.navigation?.find((item) => item.line_item_id === state.selectedQuestionId) || null;
}

function renderInspector() {
  const selectedWork = state.workItems.find((item) => item.work_id === state.selectedWorkId);
  const form = currentForm();
  const question = currentQuestion();
  const evaluation = evaluationForSelectedQuestion();
  const expanded = state.inspectorExpanded;

  if (form && question && evaluation) {
    const hint = QUESTION_SOURCE_HINTS[question.line_item_id];
    const currentValue = answerFor(form.form_id, question.line_item_id);
    const valueText = isUnknown(form.form_id, question.line_item_id)
      ? "Marked unknown"
      : hasValue(currentValue)
        ? String(currentValue)
        : "Not recorded";
    elements.inspectorTitle.textContent = "Help for this question";
    elements.inspectorContent.innerHTML = `
      <section class="inspector-panel">
        <h3>1. Plain explanation</h3>
        <p>${escapeHtml(humanQuestionPrompt(question))}</p>
        <p>Answer only what you can confirm. Use “I do not know yet” if you need help.</p>
      </section>
      <section class="inspector-panel">
        <h3>2. Official wording</h3>
        <div class="inspector-source-label">${escapeHtml(question.source_label)}</div>
        <p>Form: ${escapeHtml(form.official_number)} · ${escapeHtml(form.title)}</p>
      </section>
      <section class="inspector-panel">
        <h3>3. Where to find this</h3>
        ${hint?.where_to_find?.length
          ? `<ul class="ingress-list">${hint.where_to_find.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}</ul>`
          : "<p>No question-specific source hint is recorded yet. Use the official wording and your Notice or prior filings.</p>"}
        <p><strong>Already found:</strong> ${state.matterMode === "private_loaded" && hasValue(currentValue) ? "Value present in unlocked matter answers" : "Nothing mapped for this question yet"}</p>
      </section>
      <section class="inspector-panel">
        <h3>4. Current answer state</h3>
        <p>Current value: ${escapeHtml(valueText)}</p>
        <p>${evaluation.needs_help ? "Marked as needing help." : evaluation.answered ? "An answer is recorded." : "No answer is recorded."}</p>
        <p>If you skip this, package readiness stays incomplete.</p>
      </section>
      <section class="inspector-panel">
        <h3>5. Ask Ibal</h3>
        <button class="secondary-button" id="inspector-ask-ibal" type="button">Ask Ibal about this question</button>
        <button class="text-button" id="toggle-source-audit" type="button">${expanded ? "Hide source and audit details" : "Source and audit details"}</button>
      </section>
      ${expanded ? `<section class="inspector-panel inspector-panel--audit"><h3>Source and audit details</h3><dl><dt>Stable ID</dt><dd>${escapeHtml(question.line_item_id)}</dd><dt>Kind</dt><dd>${escapeHtml(humanize(question.kind))}</dd><dt>Rule</dt><dd>${escapeHtml(question.required_rule)}</dd><dt>Snapshot</dt><dd>${escapeHtml(form.snapshot_id)}</dd><dt>Status</dt><dd>${escapeHtml(form.status)}</dd></dl></section>` : ""}`;
    $("#inspector-ask-ibal")?.addEventListener("click", openIbal);
    $("#toggle-source-audit")?.addEventListener("click", () => {
      state.inspectorExpanded = !state.inspectorExpanded;
      renderInspector();
    });
    elements.inspectorShell?.classList.toggle("is-expanded", expanded);
    return;
  }

  if (selectedWork?.type === "form" || selectedWork?.type === "document") {
    const source = selectedWork.governing_source;
    elements.inspectorTitle.textContent = "Why this is in your case";
    elements.inspectorContent.innerHTML = `
      <section class="inspector-panel">
        <h3>Why this item is here</h3>
        <p>${escapeHtml(selectedWork.why_needed || "")}</p>
        <p><strong>Who it is for:</strong> ${escapeHtml(selectedWork.who_for || "—")}</p>
        <p><strong>When it is needed:</strong> ${escapeHtml(selectedWork.when_needed || "—")}</p>
        <p><strong>Procedural stage:</strong> ${escapeHtml(humanize(selectedWork.procedural_stage || state.matterReadiness?.procedural_stage || ""))}</p>
      </section>
      <section class="inspector-panel">
        <h3>Progress and blockers</h3>
        <p>Progress: ${escapeHtml(progressLabel(selectedWork.progress_state || "not_started"))}${selectedWork.total ? ` · ${selectedWork.answered || 0} of ${selectedWork.total} steps` : ""}</p>
        <p>Work blockers: ${escapeHtml((selectedWork.work_blockers || ["none"]).join(", "))}</p>
        <p>Package blockers: ${escapeHtml((selectedWork.package_blockers || []).join("; ") || "none listed")}</p>
      </section>
      <section class="inspector-panel">
        <h3>Governing source</h3>
        <p>${escapeHtml(source?.citation || "Not recorded")}</p>
        <p>Source date ${escapeHtml(source?.source_date || "—")} · verification ${escapeHtml(selectedWork.verification_state || "provisional")}</p>
        <p>No longer required when: ${escapeHtml(selectedWork.no_longer_required_when || "Not recorded")}</p>
      </section>
      <section class="inspector-panel">
        <h3>Ask Ibal</h3>
        <button class="secondary-button" id="inspector-ask-ibal" type="button">Ask Ibal</button>
      </section>`;
    $("#inspector-ask-ibal")?.addEventListener("click", openIbal);
    return;
  }

  if (selectedWork?.type === "task") {
    elements.inspectorTitle.textContent = "Why this task exists";
    elements.inspectorContent.innerHTML = `
      <section class="inspector-panel"><h3>Why this task exists</h3><p>${escapeHtml(selectedWork.summary || "")}</p></section>
      <section class="inspector-panel"><h3>What it unblocks</h3><p>${escapeHtml(selectedWork.next_action || "Continue required document work after this item is resolved.")}</p></section>
      <section class="inspector-panel"><h3>Related form / evidence</h3><p>${escapeHtml(selectedWork.source_ref || "Not linked yet")}</p></section>
      <section class="inspector-panel"><button class="secondary-button" id="inspector-ask-ibal" type="button">Ask Ibal</button></section>`;
    $("#inspector-ask-ibal")?.addEventListener("click", openIbal);
    return;
  }

  if (selectedWork?.type === "correspondence") {
    elements.inspectorTitle.textContent = "Why this message matters";
    elements.inspectorContent.innerHTML = `
      <section class="inspector-panel"><h3>Why this message matters</h3><p>${escapeHtml(selectedWork.summary || "")}</p></section>
      <section class="inspector-panel"><h3>Affected forms</h3><p>${escapeHtml(selectedWork.source_ref || "Confirm after ingress mapping")}</p></section>
      <section class="inspector-panel"><h3>Deadlines / follow-up</h3><p>${escapeHtml(selectedWork.due_label || "Timing not set")} · ${escapeHtml(selectedWork.next_action || "")}</p></section>
      <section class="inspector-panel"><button class="secondary-button" id="inspector-ask-ibal" type="button">Ask Ibal</button></section>`;
    $("#inspector-ask-ibal")?.addEventListener("click", openIbal);
    return;
  }

  elements.inspectorTitle.textContent = "Case help";
  elements.inspectorContent.innerHTML = '<section class="inspector-panel"><h3>Select work on the left</h3><p>This panel explains the selected document, task, or message: why it is here, what is missing, and what to do next.</p></section>';
}

function setSelectedQuestion(lineItemId) {
  const wizard = currentWizardState();
  const index = wizard?.navigation?.findIndex((item) => item.line_item_id === lineItemId) ?? -1;
  if (index < 0) return;
  state.currentQuestionIndex = index;
  state.selectedQuestionId = lineItemId;
  state.lastSelectionReason = "explicit_selection";
  renderWorkspaceMode();
  renderInspector();
  updateIbalContext();
}

function moveQuestion(delta, preferUnanswered = false) {
  const wizard = currentWizardState();
  if (!wizard?.navigation?.length) return;
  let nextIndex = state.currentQuestionIndex + delta;
  if (preferUnanswered && delta > 0) {
    const found = wizard.navigation.findIndex((item, index) => index > state.currentQuestionIndex && item.blocking);
    if (found >= 0) nextIndex = found;
  }
  nextIndex = Math.max(0, Math.min(wizard.navigation.length - 1, nextIndex));
  state.currentQuestionIndex = nextIndex;
  state.selectedQuestionId = wizard.navigation[nextIndex].line_item_id;
  state.lastSelectionReason = "navigation";
  renderGuidedQuestion();
  renderInspector();
}

function validateCurrentForm() {
  const form = currentForm();
  const wizard = currentWizardState();
  if (!form || !wizard) return;
  state.validation[form.form_id] = {
    checked_at: new Date().toISOString(),
    missing: wizard.blockers,
    unknown: wizard.navigation.filter((item) => item.needs_help).map((item) => item.line_item_id),
    unresolved_obligations: wizard.unresolved_obligations,
    status: wizard.blocking_items || wizard.needs_help_items || wizard.unresolved_obligation_items ? "blocked" : "structurally_complete_source_review_pending"
  };
  showToast(wizard.blocking_items || wizard.needs_help_items || wizard.unresolved_obligation_items
    ? `Validation found ${wizard.blocking_items} unanswered blockers, ${wizard.needs_help_items} needs-help items, and ${wizard.unresolved_obligation_items} unresolved rules.`
    : "Applicable synthetic questions are structurally complete. Source and legal review remain pending.", "warning");
  renderPackagePreview();
}

function renderIngressReconciliation() {
  const recon = state.fixture?.ingress_reconciliation;
  const mapped = asArray(recon?.mapped_assertions);
  const incomplete = asArray(recon?.incomplete);
  const disputed = asArray(recon?.disputed);
  const unmapped = asArray(recon?.unmapped);
  const activity = asArray(state.fixture?.activity);
  elements.workspaceEmpty.classList.add("is-hidden");
  elements.formWorkspace.classList.add("is-hidden");
  elements.genericWorkspace.classList.remove("is-hidden");
  elements.genericEyebrow.textContent = "Ingress reconciliation";
  elements.genericTitle.textContent = "What was imported into this matter";
  elements.genericSummary.textContent = recon
    ? `Imported from ${recon.imported_from || "unknown"}. ${recon.note || ""}`
    : "No ingress reconciliation is available until a private matter is unlocked, or a synthetic fixture supplies one.";
  elements.genericAction.textContent = "Preview only";
  elements.genericAction.disabled = true;
  elements.genericContent.innerHTML = `
    <article class="generic-card">
      <h3>Mapped form answers</h3>
      ${mapped.length ? `<ul class="ingress-list">${mapped.map((row) => `<li><strong>${escapeHtml(row.form_id)}</strong> — ${row.filled_field_count} fields filled · ${row.unknown_field_count} unknown · supports ${escapeHtml(row.supports || "assertions")}</li>`).join("")}</ul>` : "<p>Nothing mapped yet.</p>"}
    </article>
    <article class="generic-card">
      <h3>Incomplete</h3>
      ${incomplete.length ? `<ul class="ingress-list">${incomplete.map((row) => `<li><strong>${escapeHtml(row.form_id)}</strong> — ${escapeHtml(row.reason)} · ${escapeHtml((row.fields || []).join(", ") || "fields not listed")}</li>`).join("")}</ul>` : "<p>No incomplete mapping records.</p>"}
    </article>
    <article class="generic-card">
      <h3>Disputed</h3>
      ${disputed.length ? `<ul class="ingress-list">${disputed.map((row) => `<li>${escapeHtml(JSON.stringify(row))}</li>`).join("")}</ul>` : "<p>Nothing marked disputed.</p>"}
    </article>
    <article class="generic-card">
      <h3>Not mapped</h3>
      ${unmapped.length ? `<ul class="ingress-list">${unmapped.map((row) => `<li>${escapeHtml(typeof row === "string" ? row : JSON.stringify(row))}</li>`).join("")}</ul>` : "<p>No unmapped ingress items recorded.</p>"}
    </article>
    <article class="generic-card">
      <h3>Activity trail</h3>
      ${activity.length ? `<ul class="ingress-list">${activity.map((event) => `<li><strong>${escapeHtml(event.title || event.event_type)}</strong> · ${escapeHtml(event.at || "time unknown")} · ${escapeHtml(event.receipt_state || "no receipt")}</li>`).join("")}</ul>` : "<p>No activity events.</p>"}
    </article>`;
}

function renderActivityWorkspace() {
  const activity = asArray(state.fixture?.activity);
  elements.workspaceEmpty.classList.add("is-hidden");
  elements.formWorkspace.classList.add("is-hidden");
  elements.genericWorkspace.classList.remove("is-hidden");
  elements.genericEyebrow.textContent = "Activity";
  elements.genericTitle.textContent = "Activity and receipts";
  elements.genericSummary.textContent = "Meaningful state changes require append-only events and receipts. Nothing is transmitted from this preview.";
  elements.genericAction.textContent = "Preview only";
  elements.genericAction.disabled = true;
  elements.genericContent.innerHTML = activity.length
    ? activity.map((event) => `<article class="generic-card"><h3>${escapeHtml(event.title || event.event_type)}</h3><p>${escapeHtml(event.at || "time unknown")} · ${escapeHtml(event.receipt_state || "no receipt")}</p></article>`).join("")
    : '<article class="generic-card"><h3>No events yet</h3><p>Activity appears after unlock or synthetic fixture load.</p></article>';
}

function renderPackagesWorkspace() {
  const plan = computeMatterPlan();
  const checklist = plan.checklist?.length
    ? plan.checklist.map((item) => ({
      label: item.label,
      ok: item.state === "ready",
      detail: item.reason
    }))
    : [];
  elements.workspaceEmpty.classList.add("is-hidden");
  elements.formWorkspace.classList.add("is-hidden");
  elements.genericWorkspace.classList.remove("is-hidden");
  elements.genericEyebrow.textContent = "Packages";
  elements.genericTitle.textContent = "Matter package readiness";
  elements.genericSummary.textContent = plan.requirement_review_complete
    ? "Package status: Not ready until checklist items below are complete."
    : "Package status: Not ready. Requirement review is not complete.";
  elements.genericAction.textContent = "Blocked";
  elements.genericAction.disabled = true;
  elements.genericContent.innerHTML = `
    <article class="generic-card">
      <h3>Package status: Not ready</h3>
      <p>${escapeHtml(plan.package_blockers.slice(0, 4).join("; "))}</p>
    </article>
    <article class="generic-card">
      <h3>Before this stage is ready</h3>
      <ul class="ingress-list">${checklist.map((row) => `<li><strong>${row.ok ? "Ready" : "Not ready"}</strong> — ${escapeHtml(row.label)}${row.detail ? ` · ${escapeHtml(row.detail)}` : ""}</li>`).join("")}</ul>
    </article>
    ${plan.forms.map((form) => `
      <article class="generic-card">
        <h3>${escapeHtml(form.official_number)} · ${escapeHtml(form.title)}</h3>
        <p><span class="queue-chip queue-chip--${escapeHtml(form.progress_state)}">${escapeHtml(progressLabel(form.progress_state))}</span> ${form.progress}% · Package blocked: ${escapeHtml((form.package_blockers || []).slice(0, 1).join(" · ") || form.missing)}</p>
      </article>`).join("")}`;
}

function renderRoute(route) {
  state.route = route;
  $$(".scope-item").forEach((button) => {
    const active = button.dataset.route === route;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });

  if (route === "matter") {
    setQueueView("today");
    renderQueue();
    calculateMatterProgress();
    selectDefaultForCurrentRoute();
    return;
  }
  if (route === "forms") {
    setQueueView("required");
    renderQueue();
    selectDefaultForCurrentRoute();
    return;
  }
  if (route === "evidence" || route === "tasks") {
    setQueueView(route === "evidence" ? "evidence" : "tasks");
    renderQueue();
    selectDefaultForCurrentRoute();
    return;
  }
  if (route === "correspondence") {
    setQueueView("correspondence");
    renderQueue();
    selectDefaultForCurrentRoute();
    return;
  }

  state.selectedFormId = null;
  state.selectedQuestionId = null;
  state.selectedWorkId = null;
  if (route === "ingress") {
    renderIngressReconciliation();
    renderInspector();
    return;
  }
  if (route === "activity") {
    renderActivityWorkspace();
    renderInspector();
    return;
  }
  if (route === "packages" || route === "review") {
    renderPackagesWorkspace();
    if (route === "review") {
      elements.genericEyebrow.textContent = "Review";
      elements.genericTitle.textContent = "Human review before any package leaves this computer";
      elements.genericSummary.textContent = "Review the same required documents and readiness checklist. Nothing can be filed or served from this preview.";
    }
    renderInspector();
    return;
  }

  elements.workspaceEmpty.classList.add("is-hidden");
  elements.formWorkspace.classList.add("is-hidden");
  elements.genericWorkspace.classList.remove("is-hidden");
  elements.genericEyebrow.textContent = route;
  elements.genericTitle.textContent = "Destination preview";
  elements.genericSummary.textContent = "This route remains structural preview only.";
  elements.genericAction.textContent = "Preview only";
  elements.genericAction.disabled = true;
  elements.genericContent.innerHTML = '<article class="generic-card"><h3>Boundary</h3><p>This route is structural preview only.</p></article>';
  renderInspector();
}

function openIbal() {
  updateIbalContext();
  elements.drawerScrim.classList.remove("is-hidden");
  elements.ibalDrawer.classList.add("is-open");
  elements.ibalDrawer.setAttribute("aria-hidden", "false");
  setTimeout(() => elements.ibalPrompt.focus(), 50);
}

function closeIbal() {
  elements.drawerScrim.classList.add("is-hidden");
  elements.ibalDrawer.classList.remove("is-open");
  elements.ibalDrawer.setAttribute("aria-hidden", "true");
  $("#ibal-trigger").focus();
}

function updateIbalContext() {
  const form = currentForm();
  const question = currentQuestion();
  const evaluation = evaluationForSelectedQuestion();
  const work = state.workItems.find((item) => item.work_id === state.selectedWorkId);
  if (form && question) {
    elements.ibalContext.innerHTML = `<span class="status-token">${escapeHtml(form.official_number)}</span><p><strong>${escapeHtml(sourceSection(question.line_item_id))}</strong><br>${escapeHtml(question.source_label)}<br>${escapeHtml(humanize(evaluation?.evaluation_reason))}</p>`;
  } else if (work) {
    elements.ibalContext.innerHTML = `<span class="status-token">${escapeHtml(work.type)}</span><p><strong>${escapeHtml(work.title)}</strong><br>${escapeHtml(work.summary || "")}</p>`;
  } else {
    elements.ibalContext.innerHTML = '<span class="status-token">Synthetic preview</span><p>Select a bounded item before asking Ibal.</p>';
  }
}

function submitIbal(event) {
  event.preventDefault();
  const prompt = elements.ibalPrompt.value.trim();
  if (!prompt) return;
  const form = currentForm();
  const question = currentQuestion();
  const evaluation = evaluationForSelectedQuestion();
  const user = document.createElement("article");
  user.className = "ibal-message ibal-message--user";
  user.innerHTML = `<strong>You</strong><p>${escapeHtml(prompt)}</p>`;
  elements.ibalConversation.append(user);
  const assistant = document.createElement("article");
  assistant.className = "ibal-message ibal-message--assistant";
  assistant.innerHTML = `<strong>Ibal demonstration proposal</strong><p>${question ? `This question is currently ${humanize(evaluation?.evaluation_reason)} and remains bound to ${question.line_item_id}.` : "Select a bounded form question or work item."}</p><div class="ibal-proposal"><dl><dt>Affected ID</dt><dd>${escapeHtml(question?.line_item_id || "none")}</dd><dt>Evidence</dt><dd>${escapeHtml(form ? `Source snapshot ${form.snapshot_id}` : "none")}</dd><dt>Blocker</dt><dd>No private evidence, provider, approval, or external write path is available.</dd><dt>Safe next</dt><dd>Review the official wording and enter only synthetic facts you can confirm.</dd></dl></div><p><button class="secondary-button" type="button" disabled>Accept patch</button> <span class="status-token">No mutation in preview</span></p>`;
  elements.ibalConversation.append(assistant);
  elements.ibalPrompt.value = "";
  elements.ibalConversation.scrollTop = elements.ibalConversation.scrollHeight;
}

function showToast(message, tone = "default") {
  let stack = $(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.append(stack);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${tone === "warning" ? "toast--warning" : ""}`;
  toast.textContent = message;
  stack.append(toast);
  setTimeout(() => toast.remove(), 4200);
}

function persistDemoState() {
  if (state.fixture?.privacy?.classification) {
    return;
  }
  try {
    localStorage.setItem("xiio-sfl-synthetic-preview", JSON.stringify({ answers: state.answers, unknownAnswers: state.unknownAnswers, revision: state.revision }));
  } catch {
    showToast("Browser persistence is blocked. Changes remain in memory for this session.", "warning");
  }
}

function restoreDemoState() {
  try {
    const saved = JSON.parse(localStorage.getItem("xiio-sfl-synthetic-preview") || "null");
    if (!saved) return;
    state.answers = saved.answers || state.answers;
    state.unknownAnswers = saved.unknownAnswers || state.unknownAnswers;
    state.revision = saved.revision || state.revision;
  } catch {
    localStorage.removeItem("xiio-sfl-synthetic-preview");
  }
}

function resetDemoState() {
  state.answers = structuredClone(state.fixture.answers || {});
  state.unknownAnswers = structuredClone(state.fixture.unknown_answers || {});
  state.revision = {};
  localStorage.removeItem("xiio-sfl-synthetic-preview");
  evaluateWizardStates(null);
  buildWorkItems();
  renderQueue();
  calculateMatterProgress();
  renderFormHeader();
  renderWorkspaceMode();
  renderInspector();
  showToast("Synthetic answers reset to the repository fixture.");
}

function refreshAfterAnswerChange(message, preferredSelection = state.selectedQuestionId) {
  evaluateWizardStates(preferredSelection);
  buildWorkItems();
  renderQueue();
  calculateMatterProgress();
  renderFormHeader();
  renderWorkspaceMode();
  renderInspector();
  showToast(message);
}

function bindEvents() {
  $$(".queue-tab").forEach((button) => button.addEventListener("click", () => {
    state.queueView = button.dataset.queueView;
    $$(".queue-tab").forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-selected", String(active));
    });
    renderQueue();
    if (["required", "later", "evidence", "correspondence", "today", "all"].includes(state.queueView)) {
      const first = filteredWorkItems()[0];
      if (first) selectWorkItem(first.work_id);
    }
  }));
  $$(".mode-button").forEach((button) => button.addEventListener("click", () => { state.workspaceMode = button.dataset.mode; renderWorkspaceMode(); }));
  $$(".scope-item").forEach((button) => button.addEventListener("click", () => renderRoute(button.dataset.route)));
  elements.globalSearch.addEventListener("input", (event) => { state.searchTerm = event.target.value.trim().toLowerCase(); renderQueue(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== elements.globalSearch && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) { event.preventDefault(); elements.globalSearch.focus(); }
    if (event.key === "Escape" && elements.ibalDrawer.classList.contains("is-open")) closeIbal();
  });
  $("#previous-question").addEventListener("click", () => moveQuestion(-1));
  $("#next-question").addEventListener("click", () => moveQuestion(1));
  $("#continue-wizard").addEventListener("click", () => { state.workspaceMode = "guided"; renderWorkspaceMode(); });
  $("#preview-pages").addEventListener("click", () => { state.workspaceMode = "pages"; renderWorkspaceMode(); });
  $("#validate-form").addEventListener("click", validateCurrentForm);
  $("#clear-demo").addEventListener("click", resetDemoState);
  $("#show-source-details").addEventListener("click", () => showToast(`Source ${currentForm()?.snapshot_id || "unknown"}; independent review pending.`, "warning"));
  $("#compare-revisions").addEventListener("click", () => showToast("Revision comparison is not implemented in this preview."));
  $("#generic-action").addEventListener("click", () => showToast("A review receipt would be created. No external action is performed."));
  $("#ibal-trigger").addEventListener("click", openIbal);
  $("#close-ibal").addEventListener("click", closeIbal);
  elements.drawerScrim.addEventListener("click", closeIbal);
  $("#ibal-form").addEventListener("submit", submitIbal);
  elements.lockNow?.addEventListener("click", () => lockPrivateMatter("Private matter locked. Practice data remains available."));
  elements.toggleInspector?.addEventListener("click", () => {
    state.inspectorCollapsed = !state.inspectorCollapsed;
    elements.appShell.classList.toggle("inspector-collapsed", state.inspectorCollapsed);
    elements.toggleInspector.setAttribute("aria-label", state.inspectorCollapsed ? "Expand help panel" : "Collapse help panel");
    elements.toggleInspector.textContent = state.inspectorCollapsed ? "⟨" : "⟩";
  });
  bindPaneResizers();
}

function bindPaneResizers() {
  const root = document.documentElement;
  const persist = () => {
    try {
      const queue = Number.parseFloat(getComputedStyle(root).getPropertyValue("--queue-w")) || DEFAULT_QUEUE_W;
      const inspector = Number.parseFloat(getComputedStyle(root).getPropertyValue("--inspector-w")) || DEFAULT_INSPECTOR_W;
      sessionStorage.setItem(PANE_STORAGE_KEY, JSON.stringify({ queue, inspector }));
    } catch {
      // Practice pane widths only.
    }
  };
  try {
    const saved = JSON.parse(sessionStorage.getItem(PANE_STORAGE_KEY) || "{}");
    if (saved.queue) root.style.setProperty("--queue-w", `${saved.queue}px`);
    if (saved.inspector) root.style.setProperty("--inspector-w", `${saved.inspector}px`);
  } catch {
    // Ignore invalid local pane prefs.
  }

  function attach(resizer, cssVar, min, max, defaultValue) {
    if (!resizer) return;
    const start = (event) => {
      event.preventDefault();
      const startX = event.clientX;
      const startValue = Number.parseFloat(getComputedStyle(root).getPropertyValue(cssVar)) || defaultValue;
      const onMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        const next = Math.max(min, Math.min(max, startValue + (cssVar === "--inspector-w" ? -delta : delta)));
        root.style.setProperty(cssVar, `${next}px`);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        persist();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
    resizer.addEventListener("pointerdown", start);
    resizer.addEventListener("dblclick", () => {
      root.style.setProperty(cssVar, `${defaultValue}px`);
      persist();
    });
    resizer.addEventListener("keydown", (event) => {
      const current = Number.parseFloat(getComputedStyle(root).getPropertyValue(cssVar)) || defaultValue;
      const step = event.shiftKey ? 24 : 12;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const signed = cssVar === "--inspector-w" ? -direction : direction;
        const next = Math.max(min, Math.min(max, current + signed * step));
        root.style.setProperty(cssVar, `${next}px`);
        persist();
      }
      if (event.key === "Home") {
        event.preventDefault();
        root.style.setProperty(cssVar, `${defaultValue}px`);
        persist();
      }
    });
  }

  attach(elements.queueResizer, "--queue-w", 280, 520, DEFAULT_QUEUE_W);
  attach(elements.inspectorResizer, "--inspector-w", 260, 480, DEFAULT_INSPECTOR_W);
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  return response.json();
}

async function loadMatterFixture() {
  // Presence of a private matter file must never auto-load answers.
  // Explicit unlock (cookie / x-private-unlock) is required on loopback.
  try {
    const session = await fetch("/api/local/session", { cache: "no-store" });
    if (session.ok) {
      const status = await session.json();
      state.privateMatterPresent = Boolean(status.private_matter_present);
      if (status.private_matter_present && !status.unlocked) {
        state.matterMode = "private_locked";
        showPrivateUnlockPrompt();
        showToast("Private matter is present but locked. Using practice data until you unlock.", "warning");
        return fetchJson("/data/synthetic-matter.json");
      }
      if (status.unlocked) {
        const response = await fetch("/api/local/matter", { cache: "no-store" });
        if (response.ok) {
          const privateMatter = await response.json();
          if (privateMatter?.privacy?.classification) {
            activatePrivateLock(privateMatter);
            return privateMatter;
          }
        }
      }
    }
  } catch {
    // Session / private API is optional for synthetic preview.
  }
  state.matterMode = "practice";
  return fetchJson("/data/synthetic-matter.json");
}

function showPrivateUnlockPrompt() {
  state.matterMode = "private_locked";
  renderMatterModeBanner();
}

async function unlockPrivateMatter() {
  const errorEl = $("#unlock-private-error");
  if (errorEl) {
    errorEl.classList.add("is-hidden");
    errorEl.textContent = "";
  }
  try {
    const unlockResponse = await fetch("/api/local/unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        acknowledge_privacy_boundary: true,
        route: "/app"
      })
    });
    if (!unlockResponse.ok) {
      const payload = await unlockResponse.json().catch(() => ({}));
      throw new Error(payload.message || payload.error || `Unlock failed (${unlockResponse.status})`);
    }
    const matterResponse = await fetch("/api/local/matter", { cache: "no-store" });
    if (!matterResponse.ok) {
      throw new Error(`Unable to load private matter (${matterResponse.status})`);
    }
    const privateMatter = await matterResponse.json();
    if (!privateMatter?.privacy?.classification) {
      throw new Error("Private matter projection missing privacy classification.");
    }
    await applyMatterFixture(privateMatter);
    activatePrivateLock(privateMatter);
    setQueueView("required");
    renderQueue();
    selectDefaultForCurrentRoute();
  } catch (error) {
    const bannerError = $("#unlock-private-error");
    if (bannerError) {
      bannerError.classList.remove("is-hidden");
      bannerError.textContent = error.message || "Unable to unlock private matter.";
    }
    showToast(error.message || "Unable to unlock private matter.", "warning");
  }
}

async function lockPrivateMatter(message = "Private matter locked.") {
  try {
    await fetch("/api/local/unlock", { method: "DELETE", cache: "no-store" });
  } catch {
    // Cookie clear best-effort.
  }
  state.privateMode = false;
  state.privateLockAt = null;
  state.matterMode = state.privateMatterPresent ? "private_locked" : "practice";
  if (elements.lockNow) elements.lockNow.classList.add("is-hidden");
  const practice = await fetchJson("/data/synthetic-matter.json");
  await applyMatterFixture(practice);
  const switcher = $("#matter-switcher");
  if (switcher) {
    switcher.querySelector(".matter-switcher__label").textContent = "Practice matter";
    switcher.querySelector("strong").textContent = practice.matter?.safe_title || "Preparing for a JCC";
    switcher.querySelector(".matter-switcher__meta").textContent = "Practice information only";
    switcher.setAttribute("aria-label", "Current practice matter");
  }
  showPrivateUnlockPrompt();
  showToast(message, "warning");
  setQueueView("today");
  renderQueue();
  selectDefaultForCurrentRoute();
}

async function applyMatterFixture(fixture) {
  state.fixture = fixture;
  state.answers = structuredClone(fixture.answers || {});
  state.unknownAnswers = structuredClone(fixture.unknown_answers || {});
  state.revision = {};
  state.validation = {};
  evaluateWizardStates(null);
  buildWorkItems();
  calculateMatterProgress();
  renderInspector();
}

function activatePrivateLock(privateMatter) {
  state.privateMode = true;
  state.privateMatterPresent = true;
  state.matterMode = "private_loaded";
  state.privateLockAt = Date.now();
  if (elements.lockNow) elements.lockNow.classList.remove("is-hidden");
  const switcher = $("#matter-switcher");
  if (switcher) {
    switcher.querySelector(".matter-switcher__label").textContent = "Private matter";
    switcher.querySelector("strong").textContent = privateMatter.matter?.caption || privateMatter.matter?.safe_title || "Local private matter";
    switcher.querySelector(".matter-switcher__meta").textContent = "Memory only · Lock now clears this session";
    switcher.setAttribute("aria-label", "Current private matter");
  }
  if (elements.privateLockBanner) {
    elements.privateLockBanner.classList.add("is-hidden");
  }
  renderMatterModeBanner();
  showToast("PRIVATE local matter loaded into the workbench. Do not commit or publish these answers.", "warning");
  armPrivateIdleTimeout();
}

let privateIdleTimer = null;
function armPrivateIdleTimeout() {
  if (!state.privateMode) return;
  const reset = () => {
    clearTimeout(privateIdleTimer);
    privateIdleTimer = setTimeout(() => {
      lockPrivateMatter("Private session timed out. Unlock again on loopback to continue.");
    }, 30 * 60 * 1000);
  };
  ["click", "keydown", "mousemove", "scroll"].forEach((eventName) => {
    window.addEventListener(eventName, reset, { passive: true });
  });
  reset();
}

async function initialize() {
  bindEvents();
  try {
    const [manifest, fixture, diagnosis] = await Promise.all([
      fetchJson(`${FORM_CATALOG_ROOT}/forms-index.json`),
      loadMatterFixture(),
      fetchJson(DIAGNOSIS_PATH)
    ]);
    state.manifest = manifest;
    state.fixture = fixture;
    state.diagnosis = diagnosis;
    const formEntries = await Promise.all(manifest.forms_included.map(async (entry) => {
      const file = FORM_FILES[entry.form_id];
      if (!file) throw new Error(`No catalog mapping for ${entry.form_id}`);
      return [entry.form_id, await fetchJson(`${FORM_CATALOG_ROOT}/forms/${file}`)];
    }));
    formEntries.forEach(([id, form]) => state.forms.set(id, form));
    state.answers = structuredClone(fixture.answers || {});
    state.unknownAnswers = structuredClone(fixture.unknown_answers || {});
    // Do not restore browser-local synthetic answers over a private real matter.
    if (!fixture?.privacy?.classification) {
      restoreDemoState();
    }
    evaluateWizardStates(null);
    buildWorkItems();
    setQueueView("today");
    renderQueue();
    calculateMatterProgress();
    renderMatterModeBanner();
    renderInspector();
    // Default to the next required document so the centre pane is never blank.
    selectDefaultForCurrentRoute();
  } catch (error) {
    console.error(error);
    elements.queueList.innerHTML = `<div class="generic-card"><strong>Preview failed to load.</strong><p>${escapeHtml(error.message)}</p></div>`;
    elements.workspaceEmpty.innerHTML = `<div class="empty-icon">!</div><p class="eyebrow">Preview error</p><h2>The source catalog could not be loaded.</h2><p>${escapeHtml(error.message)}</p>`;
  }
}

initialize();
