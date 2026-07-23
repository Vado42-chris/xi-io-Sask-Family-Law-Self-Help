import {
  aggregateMatterWizardProgress,
  buildWizardState,
  reconcileWizardSelection
} from "./wizard-state.js";

const FORM_CATALOG_ROOT = "/sources/jcc-kit-3j/2026-03-30";
const FORM_FILES = {
  "fam-pd-7-2": "fam-pd-7-2.json",
  "form-10-3-draft-order": "form-10-3-draft-order.json",
  "form-10-3-child-support-order": "form-10-3-child-support-order.json",
  "form-15-8b": "form-15-8b.json",
  "form-12-3": "form-12-3.json",
  "fam-pd-7-5": "fam-pd-7-5.json"
};

const state = {
  manifest: null,
  fixture: null,
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
  privateLockAt: null,
  inspectorExpanded: false,
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
  privateLockBanner: $("#private-lock-banner"),
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

function buildWorkItems() {
  const forms = state.manifest.forms_included.map((entry) => {
    const form = state.forms.get(entry.form_id);
    const progress = getFormProgress(form);
    return {
      work_id: `form:${entry.form_id}`,
      type: "form",
      form_id: entry.form_id,
      official_number: entry.official_number,
      title: entry.title,
      summary: `${progress.answered} of ${progress.total} applicable questions completed`,
      state: progress.percent === 100 && !progress.unresolved ? "ready_for_review" : progress.answered ? "in_progress" : "not_started",
      due_label: entry.form_id === "fam-pd-7-5" ? "Before conference (confirm Notice)" : "Later stage",
      progress: progress.percent,
      blockers: progress.blockers + progress.unknown + progress.unresolved
    };
  });
  state.workItems = [...forms, ...asArray(state.fixture.tasks), ...asArray(state.fixture.correspondence)];
}

function isCurrentStageForm(formId) {
  // Appearance Memo is the live stage for the Aug conference track; other kit forms are later.
  return formId === "fam-pd-7-5";
}

function filteredWorkItems() {
  return state.workItems.filter((item) => {
    let viewMatches = false;
    if (state.queueView === "today") {
      viewMatches =
        (item.type === "form" && isCurrentStageForm(item.form_id) && item.progress < 100) ||
        (item.type === "task" && item.state !== "done" && item.state !== "completed") ||
        (item.type === "correspondence" && item.state !== "archived");
    } else if (state.queueView === "all") {
      viewMatches = true;
    } else if (state.queueView === "forms") {
      viewMatches = item.type === "form";
    } else if (state.queueView === "evidence" || state.queueView === "tasks") {
      viewMatches = item.type === "task";
    } else if (state.queueView === "correspondence") {
      viewMatches = item.type === "correspondence";
    }
    if (!viewMatches) return false;
    if (!state.searchTerm) return true;
    return [item.title, item.summary, item.official_number, item.state, item.source_ref]
      .filter(Boolean).join(" ").toLowerCase().includes(state.searchTerm);
  });
}

function rowIcon(item) {
  if (item.type === "form") return "▤";
  if (item.type === "task") return "✓";
  if (item.type === "correspondence") return "✉";
  return "•";
}

function rowGroup(item) {
  if (state.queueView === "today") {
    if (item.type === "form") return "Continue today";
    if (item.type === "task") return "Also waiting on";
    if (item.type === "correspondence") return "Also waiting on";
  }
  if (item.type === "form") {
    return isCurrentStageForm(item.form_id) ? "Current stage forms" : "Later";
  }
  if (item.type === "task") return "Evidence and homework";
  if (item.type === "correspondence") return "Correspondence";
  return "Other work";
}

function estimateMinutes(unanswered) {
  return Math.max(3, Math.min(25, unanswered * 2));
}

function renderTodayCard() {
  if (!elements.todayCard) return;
  const focusForm = state.workItems.find((item) => item.type === "form" && isCurrentStageForm(item.form_id)) ||
    state.workItems.find((item) => item.type === "form" && item.progress < 100);
  const waitingTasks = state.workItems.filter((item) => item.type === "task" && item.state !== "done" && item.state !== "completed");
  const waitingMail = state.workItems.filter((item) => item.type === "correspondence" && item.state !== "archived");
  const remaining = focusForm ? Math.max(0, Math.round((100 - (focusForm.progress || 0)) / 100 * (getFormProgress(state.forms.get(focusForm.form_id)).total || 0))) : 0;
  const answeredCopy = focusForm && focusForm.progress > 0
    ? `You have already completed part of ${focusForm.official_number || "this form"}.`
    : "Start with identity and scheduling, then move to the relief you are asking for.";

  elements.todayCard.innerHTML = `
    <p class="eyebrow">Continue where you left off</p>
    <h3>Next action</h3>
    <p class="today-card__action">${focusForm
      ? `Answer about ${remaining || "a few"} questions in your ${escapeHtml(focusForm.title)}`
      : "Select a form to continue"}</p>
    <dl class="today-card__meta">
      <div><dt>Estimated time</dt><dd>About ${estimateMinutes(remaining || 4)} minutes</dd></div>
      <div><dt>Due</dt><dd>${escapeHtml(focusForm?.due_label || "Confirm deadline from official notice")}</dd></div>
      <div><dt>Also waiting on</dt><dd>${waitingTasks.length + waitingMail.length} item${waitingTasks.length + waitingMail.length === 1 ? "" : "s"}</dd></div>
    </dl>
    <p class="today-card__progress">${escapeHtml(answeredCopy)}</p>
    <button class="primary-button" type="button" id="today-continue">${focusForm ? "Continue" : "Open work plan"}</button>
  `;
  $("#today-continue", elements.todayCard)?.addEventListener("click", () => {
    if (focusForm) selectWorkItem(focusForm.work_id);
    else {
      state.queueView = "forms";
      $$(".queue-tab").forEach((button) => {
        const active = button.dataset.queueView === "forms";
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      renderQueue();
    }
  });
}

function renderQueue() {
  renderTodayCard();
  const items = filteredWorkItems();
  elements.queueList.innerHTML = "";
  if (state.queueView === "today" && elements.todayCard) {
    elements.todayCard.classList.remove("is-hidden");
  } else if (elements.todayCard) {
    elements.todayCard.classList.add("is-hidden");
  }
  if (!items.length) {
    elements.queueList.innerHTML = '<div class="generic-card"><strong>No matching work.</strong><p>Change the queue view or search terms.</p></div>';
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
    row.className = `queue-row${state.selectedWorkId === item.work_id ? " is-selected" : ""}`;
    row.innerHTML = `
      <span class="queue-row__icon" aria-hidden="true">${rowIcon(item)}</span>
      <span class="queue-row__body">
        <span class="queue-row__top"><span class="queue-row__title">${escapeHtml(item.official_number ? `${item.official_number} · ${item.title}` : item.title)}</span><span class="queue-row__meta">${escapeHtml(item.due_label || "")}</span></span>
        <span class="queue-row__summary">${escapeHtml(item.summary || "")}</span>
        <span class="queue-row__chips"><span class="queue-chip">${escapeHtml(humanize(item.state))}</span></span>
      </span>
      <span class="queue-row__progress">${item.type === "form" ? `${item.progress}%` : ""}</span>`;
    row.addEventListener("click", () => selectWorkItem(item.work_id));
    elements.queueList.append(row);
  }
}

function calculateMatterProgress() {
  const totals = state.matterWizardState || { applicable: 0, completed: 0, needsHelp: 0, blockers: 0, unresolvedObligations: 0, percent_complete: 0 };
  elements.progressPercent.textContent = `${totals.percent_complete}%`;
  elements.progressBar.style.width = `${totals.percent_complete}%`;
  const next = state.workItems.find((item) => item.type === "form" && isCurrentStageForm(item.form_id)) ||
    state.workItems.find((item) => item.type === "form" && item.progress < 100);
  elements.progressCopy.textContent = next
    ? `Next: continue ${next.official_number || next.title}. ${totals.completed} of ${totals.applicable} applicable questions done.`
    : `${totals.completed} of ${totals.applicable} applicable questions completed.`;
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
  elements.genericEyebrow.textContent = item.type === "task" ? "Matter task" : "Correspondence ingress";
  elements.genericTitle.textContent = item.title;
  elements.genericSummary.textContent = item.summary || "";
  elements.genericAction.textContent = item.type === "task" ? "Mark reviewed" : "Create intake proposal";
  elements.genericAction.disabled = false;
  elements.genericContent.innerHTML = `
    <article class="generic-card"><h3>Current state</h3><dl><dt>State</dt><dd>${escapeHtml(humanize(item.state))}</dd><dt>Timing</dt><dd>${escapeHtml(item.due_label || "Not set")}</dd><dt>Source</dt><dd>${escapeHtml(item.source_ref || "Not recorded")}</dd></dl></article>
    <article class="generic-card"><h3>Next safe action</h3><p>${escapeHtml(item.next_action || "Review this item")}</p></article>
    <article class="generic-card"><h3>Audit boundary</h3><p>No external state is changed. A future action would require an append-only event and receipt.</p></article>`;
}

function renderFormHeader() {
  const form = currentForm();
  if (!form) return;
  const progress = getFormProgress(form);
  elements.formNumber.textContent = form.official_number;
  elements.formTitle.textContent = form.title;
  elements.formSourceSummary.textContent = `Source pages ${form.source_pages?.join("–") || "not recorded"} · source ${form.source_date} · captured ${new Date(form.captured_at).toLocaleDateString()}`;
  elements.formQuestionCount.textContent = progress.total;
  elements.formAnsweredCount.textContent = progress.answered;
  elements.formReviewCount.textContent = progress.unknown + progress.unresolved;
  elements.formRevision.textContent = `r${state.revision[form.form_id] || 1}`;
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
      row.innerHTML = `<div><strong>${escapeHtml(item.source_label)}</strong><span>${escapeHtml(item.line_item_id)} · ${escapeHtml(humanize(item.kind))}</span></div><span class="answer-state ${answerState[1]}">${answerState[0]}</span>`;
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
    const condition = evaluation.condition;
    const actual = condition?.actual === undefined ? "not answered" : condition.actual === true ? "Yes" : condition.actual === false ? "No" : condition.actual;
    const expected = condition?.expected === true ? "Yes" : condition?.expected === false ? "No" : condition?.expected;
    elements.inspectorTitle.textContent = "Why am I being asked this?";
    elements.inspectorContent.innerHTML = `
      <section class="inspector-panel">
        <h3>Simple answer</h3>
        <p>This question comes from the official form. Answer only what you can confirm. Use “I do not know yet” if you need help.</p>
        <div class="inspector-actions">
          <button class="secondary-button" id="inspector-ask-ibal" type="button">Ask Ibal</button>
          <button class="text-button" id="toggle-source-audit" type="button">${expanded ? "Hide source and audit details" : "Source and audit details"}</button>
        </div>
      </section>
      <section class="inspector-panel">
        <h3>Official form wording</h3>
        <div class="inspector-source-label">${escapeHtml(question.source_label)}</div>
      </section>
      ${expanded ? `<section class="inspector-panel inspector-panel--audit"><h3>Source and audit details</h3><dl><dt>Stable ID</dt><dd>${escapeHtml(question.line_item_id)}</dd><dt>Kind</dt><dd>${escapeHtml(humanize(question.kind))}</dd><dt>Rule</dt><dd>${escapeHtml(question.required_rule)}</dd><dt>Result</dt><dd>${escapeHtml(humanize(evaluation.evaluation_reason))}</dd><dt>Selection</dt><dd>${escapeHtml(humanize(state.lastSelectionReason))}</dd><dt>Snapshot</dt><dd>${escapeHtml(form.snapshot_id)}</dd><dt>Source date</dt><dd>${escapeHtml(form.source_date)}</dd><dt>Captured</dt><dd>${escapeHtml(form.captured_at)}</dd><dt>Status</dt><dd>${escapeHtml(form.status)}</dd><dt>Hash</dt><dd>${escapeHtml(form.source_sha256 || "see catalog")}</dd></dl>${condition ? `<p>Evaluated <strong>${escapeHtml(condition.path)}</strong> ${escapeHtml(condition.operator)} <strong>${escapeHtml(expected)}</strong>. Current value: <strong>${escapeHtml(actual)}</strong>.</p>` : ""}</section>` : ""}
      <section class="inspector-panel"><h3>Current answer state</h3><p>${evaluation.needs_help ? "Marked as needing help." : evaluation.answered ? "An answer is recorded." : evaluation.unresolved_obligation ? "Visible, but the obligation rule still needs review." : "No answer is recorded."}</p></section>`;
    $("#inspector-ask-ibal")?.addEventListener("click", openIbal);
    $("#toggle-source-audit")?.addEventListener("click", () => {
      state.inspectorExpanded = !state.inspectorExpanded;
      renderInspector();
    });
    elements.inspectorShell?.classList.toggle("is-expanded", expanded);
    return;
  }

  if (selectedWork) {
    elements.inspectorTitle.textContent = "What is this work item?";
    elements.inspectorContent.innerHTML = `<section class="inspector-panel"><h3>${escapeHtml(selectedWork.title)}</h3><p>${escapeHtml(selectedWork.summary || "")}</p><button class="text-button" id="toggle-source-audit" type="button">${expanded ? "Hide source and audit details" : "Source and audit details"}</button></section>${expanded ? `<section class="inspector-panel inspector-panel--audit"><h3>Control state</h3><dl><dt>Type</dt><dd>${escapeHtml(selectedWork.type)}</dd><dt>State</dt><dd>${escapeHtml(humanize(selectedWork.state))}</dd><dt>Source</dt><dd>${escapeHtml(selectedWork.source_ref || "not recorded")}</dd></dl><p>External actions remain blocked.</p></section>` : ""}`;
    $("#toggle-source-audit")?.addEventListener("click", () => {
      state.inspectorExpanded = !state.inspectorExpanded;
      renderInspector();
    });
    return;
  }

  elements.inspectorTitle.textContent = "Why this matters";
  elements.inspectorContent.innerHTML = '<section class="inspector-panel"><h3>Selected work</h3><p>Select a form or question to see a plain-language explanation. Source IDs and hashes stay behind Source and audit details.</p></section>';
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

function renderRoute(route) {
  state.route = route;
  $$(".scope-item").forEach((button) => {
    const active = button.dataset.route === route;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  if (route === "matter") { renderQueue(); return; }
  const routeContent = {
    calendar: ["Calendar and calculated deadlines", "No court date is invented. Future dates remain source-linked and user-confirmed."],
    tasks: ["Matter tasks", "Tasks are generated from deterministic dependencies and explicit user choices."],
    activity: ["Activity and receipts", "Meaningful state changes require append-only events and receipts."],
    contacts: ["Matter contacts", "No real contacts exist in this public synthetic preview."],
    settings: ["Privacy and provider settings", "AI, external transmission, and private storage remain unconfigured or blocked."]
  }[route];
  state.selectedFormId = null;
  state.selectedQuestionId = null;
  state.selectedWorkId = null;
  elements.workspaceEmpty.classList.add("is-hidden");
  elements.formWorkspace.classList.add("is-hidden");
  elements.genericWorkspace.classList.remove("is-hidden");
  elements.genericEyebrow.textContent = route;
  elements.genericTitle.textContent = routeContent[0];
  elements.genericSummary.textContent = routeContent[1];
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
      if (status.private_matter_present && !status.unlocked) {
        if (elements.privateLockBanner) {
          elements.privateLockBanner.classList.remove("is-hidden");
          elements.privateLockBanner.innerHTML = `<strong>Private matter available</strong><span>Not loaded. Open <a href="/app">/app</a> and unlock explicitly, or continue with practice data here.</span>`;
        }
        showToast("Private matter is present but locked. Using practice data until you unlock.", "warning");
        return fetchJson("./data/synthetic-matter.json");
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
  return fetchJson("./data/synthetic-matter.json");
}

function activatePrivateLock(privateMatter) {
  state.privateMode = true;
  state.privateLockAt = Date.now();
  const switcher = $("#matter-switcher");
  if (switcher) {
    switcher.querySelector(".matter-switcher__label").textContent = "Private matter";
    switcher.querySelector("strong").textContent = privateMatter.matter?.caption || "Local private matter";
    switcher.querySelector(".matter-switcher__meta").textContent = "Loopback only · not committed";
    switcher.setAttribute("aria-label", "Current private matter");
  }
  if (elements.privateLockBanner) {
    elements.privateLockBanner.classList.remove("is-hidden");
    elements.privateLockBanner.innerHTML = `<strong>Local private lock</strong><span>Matter loaded through <code>/api/local/matter</code> on loopback only. Static <code>/data/private/*</code> is disabled. Session clears after 30 minutes of inactivity.</span>`;
  }
  showToast("PRIVATE local matter loaded. Do not commit or publish these answers.", "warning");
  armPrivateIdleTimeout();
}

let privateIdleTimer = null;
function armPrivateIdleTimeout() {
  if (!state.privateMode) return;
  const reset = () => {
    clearTimeout(privateIdleTimer);
    privateIdleTimer = setTimeout(() => {
      state.answers = {};
      state.unknownAnswers = {};
      state.fixture = null;
      showToast("Private session timed out. Reload on loopback to continue.", "warning");
      elements.queueList.innerHTML = '<div class="generic-card"><strong>Private session locked.</strong><p>Reload this local preview to continue.</p></div>';
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
    const [manifest, fixture] = await Promise.all([
      fetchJson(`${FORM_CATALOG_ROOT}/forms-index.json`),
      loadMatterFixture()
    ]);
    state.manifest = manifest;
    state.fixture = fixture;
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
    renderQueue();
    calculateMatterProgress();
    renderInspector();
    const firstForm = state.workItems.find((item) => item.type === "form");
    if (firstForm) selectWorkItem(firstForm.work_id);
  } catch (error) {
    console.error(error);
    elements.queueList.innerHTML = `<div class="generic-card"><strong>Preview failed to load.</strong><p>${escapeHtml(error.message)}</p></div>`;
    elements.workspaceEmpty.innerHTML = `<div class="empty-icon">!</div><p class="eyebrow">Preview error</p><h2>The source catalog could not be loaded.</h2><p>${escapeHtml(error.message)}</p>`;
  }
}

initialize();
