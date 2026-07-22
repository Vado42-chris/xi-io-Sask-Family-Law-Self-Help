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
  workItems: [],
  selectedWorkId: null,
  selectedFormId: null,
  selectedQuestionId: null,
  queueView: "all",
  workspaceMode: "guided",
  currentQuestionIndex: 0,
  searchTerm: "",
  answers: {},
  unknownAnswers: {},
  revision: {},
  validation: {},
  route: "matter"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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
  ibalPrompt: $("#ibal-prompt")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
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

function humanizeKind(kind) {
  return String(kind || "field").replaceAll("_", " ");
}

function answerFor(formId, lineItemId) {
  return state.answers?.[formId]?.[lineItemId];
}

function isUnknown(formId, lineItemId) {
  return asArray(state.unknownAnswers?.[formId]).includes(lineItemId);
}

function hasAnswer(formId, item) {
  if (item.required_rule === "display_only") return true;
  const answer = answerFor(formId, item.line_item_id);
  if (typeof answer === "boolean") return true;
  if (Array.isArray(answer)) return answer.length > 0;
  return answer !== undefined && answer !== null && String(answer).trim() !== "";
}

function getFormProgress(form) {
  const actionable = form.line_items.filter((item) => item.required_rule !== "display_only");
  const answered = actionable.filter((item) => hasAnswer(form.form_id, item)).length;
  const unknown = actionable.filter((item) => isUnknown(form.form_id, item.line_item_id)).length;
  return {
    total: actionable.length,
    answered,
    unknown,
    percent: actionable.length ? Math.round((answered / actionable.length) * 100) : 0
  };
}

function currentForm() {
  return state.selectedFormId ? state.forms.get(state.selectedFormId) : null;
}

function currentQuestion() {
  const form = currentForm();
  if (!form?.line_items?.length) return null;
  return form.line_items[state.currentQuestionIndex] || form.line_items[0];
}

function setSelectedQuestion(lineItemId) {
  const form = currentForm();
  const index = form?.line_items?.findIndex((item) => item.line_item_id === lineItemId) ?? -1;
  if (index >= 0) state.currentQuestionIndex = index;
  state.selectedQuestionId = lineItemId;
  renderWorkspaceMode();
  renderInspector();
  updateIbalContext();
}

function buildWorkItems() {
  const formItems = state.manifest.forms_included.map((entry) => {
    const form = state.forms.get(entry.form_id);
    const progress = form ? getFormProgress(form) : { total: 0, answered: 0, unknown: 0, percent: 0 };
    return {
      work_id: `form:${entry.form_id}`,
      type: "form",
      form_id: entry.form_id,
      official_number: entry.official_number,
      title: entry.title,
      summary: `${progress.answered} of ${progress.total} answerable items completed`,
      state: progress.percent === 100 ? "ready_for_review" : progress.answered ? "in_progress" : "not_started",
      due_label: entry.form_id === "fam-pd-7-5" ? "Later workflow stage" : "Current workflow",
      progress: progress.percent,
      blockers: progress.unknown
    };
  });

  state.workItems = [
    ...formItems,
    ...asArray(state.fixture.tasks),
    ...asArray(state.fixture.correspondence)
  ];
}

function rowIcon(item) {
  if (item.type === "form") return "▤";
  if (item.type === "task") return "✓";
  if (item.type === "correspondence") return "✉";
  return "•";
}

function rowGroup(item) {
  if (item.type === "form") return "Forms and court documents";
  if (item.type === "task") return "Homework and next actions";
  if (item.type === "correspondence") return "Correspondence and external inputs";
  return "Other work";
}

function stateLabel(value) {
  return String(value || "unknown").replaceAll("_", " ");
}

function filteredWorkItems() {
  return state.workItems.filter((item) => {
    const viewMatches = state.queueView === "all" ||
      (state.queueView === "forms" && item.type === "form") ||
      (state.queueView === "tasks" && item.type === "task") ||
      (state.queueView === "correspondence" && item.type === "correspondence");
    if (!viewMatches) return false;
    if (!state.searchTerm) return true;
    const haystack = [item.title, item.summary, item.official_number, item.state, item.source_ref]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(state.searchTerm);
  });
}

function renderQueue() {
  const items = filteredWorkItems();
  elements.queueList.innerHTML = "";

  if (!items.length) {
    elements.queueList.innerHTML = `<div class="generic-card"><strong>No matching work.</strong><p>Change the queue view or search terms.</p></div>`;
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
    row.dataset.workId = item.work_id;
    row.innerHTML = `
      <span class="queue-row__icon" aria-hidden="true">${rowIcon(item)}</span>
      <span class="queue-row__body">
        <span class="queue-row__top">
          <span class="queue-row__title">${escapeHtml(item.official_number ? `${item.official_number} · ${item.title}` : item.title)}</span>
          <span class="queue-row__meta">${escapeHtml(item.due_label || "")}</span>
        </span>
        <span class="queue-row__summary">${escapeHtml(item.summary || "")}</span>
        <span class="queue-row__chips">
          <span class="queue-chip">${escapeHtml(stateLabel(item.state))}</span>
          ${item.blockers ? `<span class="queue-chip">${item.blockers} unresolved</span>` : ""}
        </span>
      </span>
      <span class="queue-row__progress">${item.type === "form" ? `${item.progress}%` : ""}</span>
    `;
    row.addEventListener("click", () => selectWorkItem(item.work_id));
    elements.queueList.append(row);
  }
}

function calculateMatterProgress() {
  const formProgress = [...state.forms.values()].map(getFormProgress);
  const totals = formProgress.reduce((acc, value) => ({
    total: acc.total + value.total,
    answered: acc.answered + value.answered,
    unknown: acc.unknown + value.unknown
  }), { total: 0, answered: 0, unknown: 0 });
  const percent = totals.total ? Math.round((totals.answered / totals.total) * 100) : 0;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressBar.style.width = `${percent}%`;
  elements.progressCopy.textContent = `${totals.answered} of ${totals.total} answerable line items completed · ${totals.unknown} marked needs help`;
}

function selectWorkItem(workId) {
  const item = state.workItems.find((candidate) => candidate.work_id === workId);
  if (!item) return;

  state.selectedWorkId = workId;
  renderQueue();
  elements.appShell.classList.add("mobile-detail-open");

  if (item.type === "form") {
    state.selectedFormId = item.form_id;
    const form = currentForm();
    const firstUnanswered = form.line_items.findIndex((lineItem) =>
      lineItem.required_rule !== "display_only" &&
      !hasAnswer(form.form_id, lineItem) &&
      !isUnknown(form.form_id, lineItem.line_item_id)
    );
    state.currentQuestionIndex = firstUnanswered >= 0 ? firstUnanswered : 0;
    state.selectedQuestionId = form.line_items[state.currentQuestionIndex]?.line_item_id || null;
    showFormWorkspace();
  } else {
    state.selectedFormId = null;
    state.selectedQuestionId = null;
    showGenericWorkspace(item);
  }

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

  const fields = [
    ["State", stateLabel(item.state)],
    ["Timing", item.due_label || "Not set"],
    ["Source", item.source_ref || "Not recorded"],
    ["Next safe action", item.next_action || "Review this item"]
  ];

  elements.genericContent.innerHTML = `
    <article class="generic-card">
      <h3>Current state</h3>
      <dl>${fields.map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>
    </article>
    <article class="generic-card">
      <h3>${item.type === "correspondence" ? "Ingress boundary" : "Task boundary"}</h3>
      <p>${item.type === "correspondence"
        ? "An incoming document must be preserved, hashed, inspected, matched to the matter, and human-confirmed before it can affect forms or tasks."
        : "Tasks are generated from deterministic workflow dependencies. Completing a task does not silently approve a form or legal conclusion."}</p>
    </article>
    <article class="generic-card">
      <h3>Receipt expectation</h3>
      <p>This preview would create an append-only local receipt for review, completion, blocking, supersession, or intake. No external state is changed.</p>
    </article>
  `;
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
  elements.formReviewCount.textContent = progress.unknown;
  elements.formRevision.textContent = `r${state.revision[form.form_id] || 1}`;
}

function renderWorkspaceMode() {
  const form = currentForm();
  if (!form) return;

  const views = {
    guided: elements.guidedView,
    sections: elements.sectionView,
    pages: elements.pageView,
    package: elements.packageView
  };
  Object.values(views).forEach((view) => view.classList.add("is-hidden"));
  views[state.workspaceMode].classList.remove("is-hidden");
  $$(".mode-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.workspaceMode);
  });

  if (state.workspaceMode === "guided") renderGuidedQuestion();
  if (state.workspaceMode === "sections") renderSectionReview();
  if (state.workspaceMode === "pages") renderPagePreview();
  if (state.workspaceMode === "package") renderPackagePreview();
}

function inputControl(form, item) {
  const current = answerFor(form.form_id, item.line_item_id);
  const control = document.createElement("div");
  control.className = "field-control";

  if (item.required_rule === "display_only" || item.kind === "static_attestation") {
    control.innerHTML = `<div class="inspector-source-label">${escapeHtml(item.source_label)}</div><p class="question-note">This is source text or an attestation. The final product will distinguish display-only wording from user-entered answers.</p>`;
    return control;
  }

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
    [["true", "Yes"], ["false", "No"]].forEach(([value, labelText]) => {
      const label = document.createElement("label");
      label.className = "choice-option";
      label.innerHTML = `<input type="radio" name="${escapeHtml(item.line_item_id)}" value="${value}" ${String(current) === value ? "checked" : ""}><span>${labelText}</span>`;
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
  input.placeholder = item.kind === "attachment" || item.kind === "attachment_confirmation" ? "Attachment workflow not implemented" : "Synthetic preview answer";
  input.disabled = ["attachment", "attachment_confirmation", "signature"].includes(item.kind);
  input.dataset.answerInput = "true";
  control.append(input);
  if (input.disabled) {
    const note = document.createElement("p");
    note.className = "question-note";
    note.textContent = "This capability is intentionally blocked in the first preview. It will require a governed evidence, signature, or finalization workflow.";
    control.append(note);
  }
  return control;
}

function readQuestionControl(card, item) {
  if (item.required_rule === "display_only" || item.kind === "static_attestation") return { hasValue: false, value: undefined };
  const selected = $("input[type=radio]:checked", card);
  if (selected) {
    if (item.kind === "boolean") return { hasValue: true, value: selected.value === "true" };
    return { hasValue: true, value: selected.value };
  }
  const field = $("[data-answer-input=true]", card);
  if (!field || field.disabled) return { hasValue: false, value: undefined };
  return { hasValue: String(field.value).trim() !== "", value: field.value };
}

function renderGuidedQuestion() {
  const form = currentForm();
  const item = currentQuestion();
  if (!form || !item) return;
  state.selectedQuestionId = item.line_item_id;
  elements.currentSectionTitle.textContent = sourceSection(item.line_item_id);
  elements.questionPosition.textContent = `${state.currentQuestionIndex + 1} of ${form.line_items.length}`;
  elements.guidedCard.innerHTML = "";

  const fragment = $("#question-template").content.cloneNode(true);
  const card = $(".question-card", fragment);
  $(".question-kind", fragment).textContent = humanizeKind(item.kind);
  $(".question-label", fragment).textContent = item.source_label;
  $(".question-rule", fragment).textContent = `Applicability: ${item.required_rule || "not recorded"}`;
  $(".question-input", fragment).append(inputControl(form, item));

  const unknownButton = $(".question-unknown", fragment);
  unknownButton.textContent = isUnknown(form.form_id, item.line_item_id) ? "Marked: needs help" : "I do not know yet";
  unknownButton.addEventListener("click", () => {
    const list = new Set(asArray(state.unknownAnswers[form.form_id]));
    if (list.has(item.line_item_id)) list.delete(item.line_item_id); else list.add(item.line_item_id);
    state.unknownAnswers[form.form_id] = [...list];
    state.revision[form.form_id] = (state.revision[form.form_id] || 1) + 1;
    persistDemoState();
    refreshAfterAnswerChange("Needs-help state updated in the local synthetic preview.");
  });

  $(".question-save", fragment).addEventListener("click", () => {
    const result = readQuestionControl(card, item);
    if (!result.hasValue) {
      showToast("No editable answer was entered. Display-only and blocked fields cannot be saved in this preview.", "warning");
      return;
    }
    state.answers[form.form_id] ||= {};
    state.answers[form.form_id][item.line_item_id] = result.value;
    state.unknownAnswers[form.form_id] = asArray(state.unknownAnswers[form.form_id]).filter((id) => id !== item.line_item_id);
    state.revision[form.form_id] = (state.revision[form.form_id] || 1) + 1;
    persistDemoState();
    refreshAfterAnswerChange("Synthetic answer saved locally in this browser preview.");
    moveQuestion(1, true);
  });

  $(".question-help", fragment).addEventListener("click", openIbal);
  elements.guidedCard.append(fragment);
  updateIbalContext();
}

function groupedQuestions(form) {
  return form.line_items.reduce((groups, item) => {
    const section = sourceSection(item.line_item_id);
    groups[section] ||= [];
    groups[section].push(item);
    return groups;
  }, {});
}

function renderSectionReview() {
  const form = currentForm();
  elements.sectionView.innerHTML = "";
  Object.entries(groupedQuestions(form)).forEach(([section, items]) => {
    const answered = items.filter((item) => hasAnswer(form.form_id, item)).length;
    const card = document.createElement("article");
    card.className = "section-card";
    card.innerHTML = `
      <header><div><h3>${escapeHtml(section)}</h3><p>${answered} of ${items.length} represented</p></div><span class="status-token">${items.length} line items</span></header>
      <div class="section-card__body"></div>
    `;
    const body = $(".section-card__body", card);
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "section-question-row";
      row.tabIndex = 0;
      const answerState = isUnknown(form.form_id, item.line_item_id)
        ? ["Needs help", "is-unknown"]
        : hasAnswer(form.form_id, item)
          ? [item.required_rule === "display_only" ? "Source text" : "Answered", "is-answered"]
          : ["Not answered", ""];
      row.innerHTML = `
        <div><strong>${escapeHtml(item.source_label)}</strong><span>${escapeHtml(item.line_item_id)} · ${escapeHtml(humanizeKind(item.kind))}</span></div>
        <span class="answer-state ${answerState[1]}">${answerState[0]}</span>
      `;
      row.addEventListener("click", () => {
        state.workspaceMode = "guided";
        setSelectedQuestion(item.line_item_id);
      });
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") row.click();
      });
      body.append(row);
    });
    elements.sectionView.append(card);
  });
}

function renderPagePreview() {
  const form = currentForm();
  elements.pageView.innerHTML = "";
  const groups = groupedQuestions(form);
  const sectionEntries = Object.entries(groups);
  const targetPageCount = Math.max(1, Math.min(5, Math.ceil(sectionEntries.length / 4)));
  const sectionsPerPage = Math.ceil(sectionEntries.length / targetPageCount);

  for (let pageIndex = 0; pageIndex < targetPageCount; pageIndex += 1) {
    const pageSections = sectionEntries.slice(pageIndex * sectionsPerPage, (pageIndex + 1) * sectionsPerPage);
    if (!pageSections.length) continue;
    const page = document.createElement("article");
    page.className = "form-page";
    page.innerHTML = `
      <div class="form-page__court">
        <p>COURT OF KING'S BENCH FOR SASKATCHEWAN</p>
        <h3>${escapeHtml(form.official_number)} · ${escapeHtml(form.title)}</h3>
      </div>
      <div class="form-page__meta">
        <strong>COURT FILE NUMBER</strong><span>${escapeHtml(answerFor(form.form_id, "header.court_file_number") || "________________")}</span>
        <strong>JUDICIAL CENTRE</strong><span>${escapeHtml(answerFor(form.form_id, "header.judicial_centre") || "________________")}</span>
        <strong>SOURCE DATE</strong><span>${escapeHtml(form.source_date)}</span>
        <strong>PREVIEW REVISION</strong><span>r${state.revision[form.form_id] || 1}</span>
      </div>
      <div class="form-page__body"></div>
      <div class="form-page__footer">Synthetic structural preview · page ${pageIndex + 1} of ${targetPageCount} · not court-ready</div>
    `;
    const body = $(".form-page__body", page);
    pageSections.forEach(([section, items]) => {
      const sectionElement = document.createElement("section");
      sectionElement.className = "form-page__section";
      sectionElement.innerHTML = `<h4>${escapeHtml(section)}</h4>`;
      items.forEach((item) => {
        const value = answerFor(form.form_id, item.line_item_id);
        const field = document.createElement("div");
        field.className = "form-page__field";
        field.innerHTML = `<strong>${escapeHtml(item.source_label)}</strong><p>${escapeHtml(
          item.required_rule === "display_only" ? "[Official source text displayed here]" :
          isUnknown(form.form_id, item.line_item_id) ? "[Needs help]" :
          value === true ? "Yes" : value === false ? "No" : value || "________________"
        )}</p>`;
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
  if (progress.percent < 100) blockers.push(`${progress.total - progress.answered} answerable items remain incomplete.`);
  if (progress.unknown) blockers.push(`${progress.unknown} items are marked needs help.`);
  if (form.status !== "independently_reviewed") blockers.push("The source transcription has not received independent page-level approval.");
  blockers.push("Attachment vault, signatures, commissioning, recipients, and transmission are not implemented.");

  elements.packageView.innerHTML = `
    <div class="package-summary">
      <article class="package-card">
        <header><div><p class="eyebrow">Package candidate</p><h3>${escapeHtml(form.official_number)} review package</h3></div><span class="status-token status-token--warning">Blocked</span></header>
        <p>This view demonstrates the immutable package manifest that will eventually bind exact source, answer, document, and attachment revisions.</p>
      </article>
      <article class="package-card">
        <h3>Bound artifacts</h3>
        <div class="package-item"><span>▤</span><div><strong>${escapeHtml(form.title)}</strong><p>Document revision r${state.revision[form.form_id] || 1}</p></div><span>${progress.percent}%</span></div>
        <div class="package-item"><span>⌁</span><div><strong>Source snapshot</strong><p>${escapeHtml(form.snapshot_id)} · ${escapeHtml(form.source_sha256)}</p></div><span>captured</span></div>
        <div class="package-item"><span>□</span><div><strong>Attachments</strong><p>No governed evidence objects are available in the synthetic preview.</p></div><span>0</span></div>
      </article>
      <article class="package-card">
        <h3>Blocking conditions</h3>
        <ul>${blockers.map((blocker) => `<li class="package-blocker">${escapeHtml(blocker)}</li>`).join("")}</ul>
      </article>
      <article class="package-card">
        <h3>Future egress choices</h3>
        <p>Print, private download, filing, service, and email will be separate governed adapters. No action will imply that a document was filed or served merely because it was generated or sent.</p>
        <button class="secondary-button" type="button" disabled>Finalize package</button>
      </article>
    </div>
  `;
}

function renderInspector() {
  const selectedWork = state.workItems.find((item) => item.work_id === state.selectedWorkId);
  const form = currentForm();
  const question = form?.line_items?.find((item) => item.line_item_id === state.selectedQuestionId);

  if (form && question) {
    elements.inspectorTitle.textContent = "Question context";
    const answer = answerFor(form.form_id, question.line_item_id);
    elements.inspectorContent.innerHTML = `
      <section class="inspector-panel">
        <h3>Official source wording</h3>
        <div class="inspector-source-label">${escapeHtml(question.source_label)}</div>
      </section>
      <section class="inspector-panel">
        <h3>Applicability and identity</h3>
        <dl>
          <dt>Stable ID</dt><dd>${escapeHtml(question.line_item_id)}</dd>
          <dt>Kind</dt><dd>${escapeHtml(humanizeKind(question.kind))}</dd>
          <dt>Rule</dt><dd>${escapeHtml(question.required_rule)}</dd>
          <dt>Section</dt><dd>${escapeHtml(sourceSection(question.line_item_id))}</dd>
        </dl>
      </section>
      <section class="inspector-panel">
        <h3>Current answer state</h3>
        <p>${isUnknown(form.form_id, question.line_item_id)
          ? "The user marked this item as not known or needing help."
          : hasAnswer(form.form_id, question)
            ? `A synthetic answer is recorded: ${escapeHtml(answer === true ? "Yes" : answer === false ? "No" : answer || "source text")}`
            : "No answer is recorded in this synthetic matter."}</p>
      </section>
      <section class="inspector-panel">
        <h3>Source and freshness</h3>
        <dl>
          <dt>Snapshot</dt><dd>${escapeHtml(form.snapshot_id)}</dd>
          <dt>Source date</dt><dd>${escapeHtml(form.source_date)}</dd>
          <dt>Captured</dt><dd>${escapeHtml(form.captured_at)}</dd>
          <dt>Status</dt><dd>${escapeHtml(form.status)}</dd>
        </dl>
      </section>
      <section class="inspector-panel">
        <h3>Evidence and AI boundary</h3>
        <p>No evidence is linked in this public synthetic preview. Ibal may propose wording or next questions, but it cannot silently change this answer or approve the form.</p>
        <button class="secondary-button" id="inspector-ask-ibal" type="button">Ask Ibal about this</button>
      </section>
    `;
    $("#inspector-ask-ibal")?.addEventListener("click", openIbal);
    return;
  }

  if (selectedWork) {
    elements.inspectorTitle.textContent = selectedWork.type === "task" ? "Task context" : "Ingress context";
    elements.inspectorContent.innerHTML = `
      <section class="inspector-panel"><h3>${escapeHtml(selectedWork.title)}</h3><p>${escapeHtml(selectedWork.summary || "")}</p></section>
      <section class="inspector-panel"><h3>Control state</h3><dl><dt>Type</dt><dd>${escapeHtml(selectedWork.type)}</dd><dt>State</dt><dd>${escapeHtml(stateLabel(selectedWork.state))}</dd><dt>Source</dt><dd>${escapeHtml(selectedWork.source_ref || "not recorded")}</dd></dl></section>
      <section class="inspector-panel"><h3>Next safe action</h3><p>${escapeHtml(selectedWork.next_action || "Review the selected item.")}</p></section>
      <section class="inspector-panel"><h3>Audit boundary</h3><p>Changes would create an append-only event and receipt. External actions remain blocked.</p></section>
    `;
    return;
  }

  elements.inspectorTitle.textContent = "Why this matters";
  elements.inspectorContent.innerHTML = `<section class="inspector-panel"><h3>Selected work</h3><p>Select a form, task, correspondence item, or individual question to see its source, applicability, evidence links, blockers, and revision history.</p></section>`;
}

function moveQuestion(delta, preferUnanswered = false) {
  const form = currentForm();
  if (!form) return;
  let nextIndex = state.currentQuestionIndex + delta;
  if (preferUnanswered && delta > 0) {
    const found = form.line_items.findIndex((item, index) => index > state.currentQuestionIndex && item.required_rule !== "display_only" && !hasAnswer(form.form_id, item) && !isUnknown(form.form_id, item.line_item_id));
    if (found >= 0) nextIndex = found;
  }
  nextIndex = Math.max(0, Math.min(form.line_items.length - 1, nextIndex));
  state.currentQuestionIndex = nextIndex;
  state.selectedQuestionId = form.line_items[nextIndex]?.line_item_id || null;
  renderGuidedQuestion();
  renderInspector();
}

function validateCurrentForm() {
  const form = currentForm();
  if (!form) return;
  const required = form.line_items.filter((item) => item.required_rule === "always");
  const missing = required.filter((item) => !hasAnswer(form.form_id, item) && !isUnknown(form.form_id, item.line_item_id));
  const unknown = required.filter((item) => isUnknown(form.form_id, item.line_item_id));
  state.validation[form.form_id] = {
    checked_at: new Date().toISOString(),
    missing: missing.map((item) => item.line_item_id),
    unknown: unknown.map((item) => item.line_item_id),
    status: missing.length || unknown.length ? "blocked" : "structurally_complete_source_review_pending"
  };
  showToast(
    missing.length || unknown.length
      ? `Validation found ${missing.length} missing always-required items and ${unknown.length} items needing help.`
      : "The synthetic answer set is structurally complete for always-required items. Source and legal review are still pending.",
    missing.length || unknown.length ? "warning" : "default"
  );
  renderPackagePreview();
}

function renderRoute(route) {
  state.route = route;
  $$(".scope-item").forEach((button) => {
    const active = button.dataset.route === route;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });

  if (route === "matter") {
    renderQueue();
    return;
  }

  const routeContent = {
    calendar: {
      title: "Calendar and calculated deadlines",
      summary: "Dates remain linked to their source rules, inputs, time zone, confidence, and user confirmation state.",
      cards: [
        ["No confirmed filing deadline", "This synthetic matter has no court-issued date. The system will not invent one."],
        ["Suggested work block", "Complete a 20-minute source-review or form-answer session. Optional reminders should inform rather than shame."],
        ["Future court notice", "A received FAM-PD #7-4 would create a separate immutable ingress event and deadline tasks."]
      ]
    },
    tasks: {
      title: "Matter tasks",
      summary: "Tasks are generated from deterministic form dependencies and explicit user choices.",
      cards: state.fixture.tasks.map((task) => [task.title, `${task.summary} Next: ${task.next_action}`])
    },
    activity: {
      title: "Activity and receipts",
      summary: "Every meaningful state change is represented as an append-only event with a receipt expectation.",
      cards: state.fixture.activity.map((event) => [event.title, `${event.event_type} · ${new Date(event.at).toLocaleString()} · ${event.receipt_state}`])
    },
    contacts: {
      title: "Matter contacts",
      summary: "Contacts will be role-aware and matter-scoped. Court, party, counsel, mediator, commissioner, and support contacts cannot be conflated.",
      cards: [["No real contacts in public preview", "The target system will use synthetic or private encrypted records only."]]
    },
    settings: {
      title: "Privacy and provider settings",
      summary: "Local-first AI, explicit remote-provider consent, retention, export, and support-access controls belong here.",
      cards: [["AI provider", "Not configured. The preview uses deterministic local demonstration responses."], ["External transmission", "Blocked."], ["Private object vault", "Not implemented."]]
    }
  }[route];

  state.selectedFormId = null;
  state.selectedQuestionId = null;
  state.selectedWorkId = null;
  elements.workspaceEmpty.classList.add("is-hidden");
  elements.formWorkspace.classList.add("is-hidden");
  elements.genericWorkspace.classList.remove("is-hidden");
  elements.genericEyebrow.textContent = route;
  elements.genericTitle.textContent = routeContent.title;
  elements.genericSummary.textContent = routeContent.summary;
  elements.genericAction.textContent = "Preview only";
  elements.genericAction.disabled = true;
  elements.genericContent.innerHTML = routeContent.cards.map(([title, body]) => `<article class="generic-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("");
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
  const question = form?.line_items?.find((item) => item.line_item_id === state.selectedQuestionId);
  const work = state.workItems.find((item) => item.work_id === state.selectedWorkId);

  if (form && question) {
    elements.ibalContext.innerHTML = `<span class="status-token">${escapeHtml(form.official_number)}</span><p><strong>${escapeHtml(sourceSection(question.line_item_id))}</strong><br>${escapeHtml(question.source_label)}</p>`;
  } else if (work) {
    elements.ibalContext.innerHTML = `<span class="status-token">${escapeHtml(work.type)}</span><p><strong>${escapeHtml(work.title)}</strong><br>${escapeHtml(work.summary || "")}</p>`;
  } else {
    elements.ibalContext.innerHTML = `<span class="status-token">Synthetic preview</span><p>Select a form question, task, or correspondence item before asking Ibal.</p>`;
  }
}

function ibalProposal(prompt) {
  const form = currentForm();
  const question = form?.line_items?.find((item) => item.line_item_id === state.selectedQuestionId);
  const work = state.workItems.find((item) => item.work_id === state.selectedWorkId);

  if (question) {
    return {
      response: `This item is stored as ${question.line_item_id}. Its official label is preserved separately from any plain-language explanation or proposed answer.`,
      affected: question.line_item_id,
      evidence: `Source snapshot ${form.snapshot_id}, ${form.official_number}`,
      blocker: question.required_rule === "display_only" ? "Display-only source text cannot be replaced by a user answer." : "Any edit must be accepted by the user and written as a new answer revision.",
      safeNext: isUnknown(form.form_id, question.line_item_id)
        ? "Break the issue into factual subquestions or seek legal information before drafting."
        : "Review the source wording, enter only facts you can confirm, and save the answer as a new revision."
    };
  }

  if (work) {
    return {
      response: `The selected ${work.type} is in state “${stateLabel(work.state)}.”`,
      affected: work.work_id,
      evidence: work.source_ref || "No source reference recorded",
      blocker: "The preview cannot execute tasks, ingest private files, or contact an external recipient.",
      safeNext: work.next_action || "Review and classify the selected work item."
    };
  }

  return {
    response: "Select a specific form question, task, or correspondence item so the proposal can be bounded to evidence and stable IDs.",
    affected: "none",
    evidence: "none",
    blocker: "No selected context",
    safeNext: "Select an item from the work queue."
  };
}

function submitIbal(event) {
  event.preventDefault();
  const prompt = elements.ibalPrompt.value.trim();
  if (!prompt) return;

  const user = document.createElement("article");
  user.className = "ibal-message ibal-message--user";
  user.innerHTML = `<strong>You</strong><p>${escapeHtml(prompt)}</p>`;
  elements.ibalConversation.append(user);

  const proposal = ibalProposal(prompt);
  const assistant = document.createElement("article");
  assistant.className = "ibal-message ibal-message--assistant";
  assistant.innerHTML = `
    <strong>Ibal demonstration proposal</strong>
    <p>${escapeHtml(proposal.response)}</p>
    <div class="ibal-proposal">
      <dl>
        <dt>Affected ID</dt><dd>${escapeHtml(proposal.affected)}</dd>
        <dt>Evidence</dt><dd>${escapeHtml(proposal.evidence)}</dd>
        <dt>Blocker</dt><dd>${escapeHtml(proposal.blocker)}</dd>
        <dt>Safe next</dt><dd>${escapeHtml(proposal.safeNext)}</dd>
      </dl>
    </div>
    <p><button class="secondary-button" type="button" disabled>Accept patch</button> <span class="status-token">No mutation in preview</span></p>
  `;
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
  toast.className = `toast${tone === "warning" ? " toast--warning" : ""}`;
  toast.textContent = message;
  stack.append(toast);
  setTimeout(() => toast.remove(), 4200);
}

function persistDemoState() {
  try {
    localStorage.setItem("xiio-sfl-synthetic-preview", JSON.stringify({
      answers: state.answers,
      unknownAnswers: state.unknownAnswers,
      revision: state.revision
    }));
  } catch {
    showToast("The browser blocked local demo persistence. Changes remain in memory for this session.", "warning");
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
  buildWorkItems();
  renderQueue();
  calculateMatterProgress();
  renderFormHeader();
  renderWorkspaceMode();
  renderInspector();
  showToast("Synthetic answers reset to the repository fixture.");
}

function refreshAfterAnswerChange(message) {
  buildWorkItems();
  renderQueue();
  calculateMatterProgress();
  renderFormHeader();
  renderWorkspaceMode();
  renderInspector();
  showToast(message);
}

function bindEvents() {
  $$(".queue-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.queueView = button.dataset.queueView;
      $$(".queue-tab").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-selected", String(active));
      });
      renderQueue();
    });
  });

  $$(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.workspaceMode = button.dataset.mode;
      renderWorkspaceMode();
    });
  });

  $$(".scope-item").forEach((button) => {
    button.addEventListener("click", () => renderRoute(button.dataset.route));
  });

  elements.globalSearch.addEventListener("input", (event) => {
    state.searchTerm = event.target.value.trim().toLowerCase();
    renderQueue();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== elements.globalSearch && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      elements.globalSearch.focus();
    }
    if (event.key === "Escape" && elements.ibalDrawer.classList.contains("is-open")) closeIbal();
  });

  $("#previous-question").addEventListener("click", () => moveQuestion(-1));
  $("#next-question").addEventListener("click", () => moveQuestion(1));
  $("#continue-wizard").addEventListener("click", () => {
    state.workspaceMode = "guided";
    renderWorkspaceMode();
  });
  $("#preview-pages").addEventListener("click", () => {
    state.workspaceMode = "pages";
    renderWorkspaceMode();
  });
  $("#validate-form").addEventListener("click", validateCurrentForm);
  $("#clear-demo").addEventListener("click", resetDemoState);
  $("#show-source-details").addEventListener("click", () => {
    const form = currentForm();
    showToast(`Source ${form?.snapshot_id || "unknown"}; captured ${form?.captured_at || "unknown"}; independent review pending.`, "warning");
  });
  $("#compare-revisions").addEventListener("click", () => showToast("Revision comparison is represented in the architecture but not implemented in the first static preview."));
  $("#generic-action").addEventListener("click", () => showToast("A review receipt would be created here. No external action is performed."));
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

async function initialize() {
  bindEvents();
  try {
    const [manifest, fixture] = await Promise.all([
      fetchJson(`${FORM_CATALOG_ROOT}/forms-index.json`),
      fetchJson("./data/synthetic-matter.json")
    ]);
    state.manifest = manifest;
    state.fixture = fixture;

    const formEntries = await Promise.all(manifest.forms_included.map(async (entry) => {
      const file = FORM_FILES[entry.form_id];
      if (!file) throw new Error(`No catalog mapping for ${entry.form_id}`);
      const form = await fetchJson(`${FORM_CATALOG_ROOT}/forms/${file}`);
      return [entry.form_id, form];
    }));
    formEntries.forEach(([id, form]) => state.forms.set(id, form));

    state.answers = structuredClone(fixture.answers || {});
    state.unknownAnswers = structuredClone(fixture.unknown_answers || {});
    restoreDemoState();
    buildWorkItems();
    renderQueue();
    calculateMatterProgress();
    renderInspector();

    const firstForm = state.workItems.find((item) => item.type === "form");
    if (firstForm) selectWorkItem(firstForm.work_id);
  } catch (error) {
    console.error(error);
    elements.queueList.innerHTML = `<div class="generic-card"><strong>Preview failed to load.</strong><p>${escapeHtml(error.message)}</p><p>Run this preview through the repository server rather than opening the HTML file directly.</p></div>`;
    elements.workspaceEmpty.innerHTML = `<div class="empty-icon">!</div><p class="eyebrow">Preview error</p><h2>The source catalog could not be loaded.</h2><p>${escapeHtml(error.message)}</p>`;
  }
}

initialize();
