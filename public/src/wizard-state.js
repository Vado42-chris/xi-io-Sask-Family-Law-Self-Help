import { deriveMatterFacts, evaluateFormCatalog } from "./applicability-engine.js";

function hasValue(value) {
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function unknownSet(unknownAnswers, formId) {
  return new Set(Array.isArray(unknownAnswers?.[formId]) ? unknownAnswers[formId] : []);
}

export function buildWizardState(form, options = {}) {
  const answers = options.answers || {};
  const unknownAnswers = options.unknownAnswers || options.unknown_answers || {};
  const derivedFacts = options.derivedFacts || deriveMatterFacts(answers);
  const evaluation = evaluateFormCatalog(form, { answers, derivedFacts });
  const byId = new Map((form?.line_items || []).map((item) => [item.line_item_id, item]));
  const formAnswers = answers?.[form?.form_id] || {};
  const unknown = unknownSet(unknownAnswers, form?.form_id);

  const navigation = evaluation.items
    .filter((item) => item.applicable && item.answerable)
    .map((item, applicableIndex) => {
      const source = byId.get(item.line_item_id);
      const answered = hasValue(formAnswers[item.line_item_id]);
      const needsHelp = unknown.has(item.line_item_id);
      const required = source?.required_rule !== "optional";
      const unresolvedObligation = !item.obligation_resolved;
      const blocking = required && !answered && !needsHelp;

      return {
        applicable_index: applicableIndex,
        line_item_id: item.line_item_id,
        source_label: source?.source_label || item.line_item_id,
        kind: source?.kind || item.kind,
        required_rule: item.required_rule,
        evaluation_reason: item.reason,
        condition: item.condition || null,
        answered,
        needs_help: needsHelp,
        required,
        unresolved_obligation: unresolvedObligation,
        blocking
      };
    });

  const completed = navigation.filter((item) => item.answered).length;
  const needsHelp = navigation.filter((item) => item.needs_help).length;
  const blockers = navigation.filter((item) => item.blocking);
  const unresolvedObligations = navigation.filter((item) => item.unresolved_obligation);
  const next = navigation.find((item) => item.blocking) || navigation.find((item) => !item.answered && !item.needs_help) || null;

  return {
    form_id: form?.form_id,
    total_source_line_items: evaluation.total_line_items,
    applicable_answerable_items: navigation.length,
    completed_items: completed,
    needs_help_items: needsHelp,
    blocking_items: blockers.length,
    unresolved_obligation_items: unresolvedObligations.length,
    percent_complete: navigation.length ? Math.round((completed / navigation.length) * 100) : 0,
    next_line_item_id: next?.line_item_id || null,
    unsupported_rule_count: evaluation.unsupported_rule_count,
    navigation,
    blockers: blockers.map((item) => item.line_item_id),
    unresolved_obligations: unresolvedObligations.map((item) => item.line_item_id)
  };
}

export function reconcileWizardSelection(wizardState, selectedLineItemId = null) {
  const navigation = wizardState?.navigation || [];
  if (!navigation.length) return { index: -1, line_item_id: null, reason: "no_applicable_questions" };

  const selectedIndex = navigation.findIndex((item) => item.line_item_id === selectedLineItemId);
  if (selectedIndex >= 0) {
    return { index: selectedIndex, line_item_id: selectedLineItemId, reason: "selection_preserved" };
  }

  const nextId = wizardState.next_line_item_id;
  const nextIndex = navigation.findIndex((item) => item.line_item_id === nextId);
  if (nextIndex >= 0) {
    return { index: nextIndex, line_item_id: nextId, reason: "moved_to_next_blocker" };
  }

  return { index: 0, line_item_id: navigation[0].line_item_id, reason: "moved_to_first_applicable" };
}

export function aggregateMatterWizardProgress(forms, state = {}) {
  const formStates = forms.map((form) => buildWizardState(form, state));
  const totals = formStates.reduce((result, formState) => {
    result.applicable += formState.applicable_answerable_items;
    result.completed += formState.completed_items;
    result.needsHelp += formState.needs_help_items;
    result.blockers += formState.blocking_items;
    result.unresolvedObligations += formState.unresolved_obligation_items;
    result.unsupported += formState.unsupported_rule_count;
    return result;
  }, { applicable: 0, completed: 0, needsHelp: 0, blockers: 0, unresolvedObligations: 0, unsupported: 0 });

  return {
    ...totals,
    percent_complete: totals.applicable ? Math.round((totals.completed / totals.applicable) * 100) : 0,
    forms: formStates
  };
}
