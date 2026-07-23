import { readFileSync } from "node:fs";
import { buildWizardState, reconcileWizardSelection, aggregateMatterWizardProgress } from "../public/src/wizard-state.js";

const root = "sources/jcc-kit-3j/2026-03-30/forms";
const files = [
  "fam-pd-7-2.json",
  "form-10-3-draft-order.json",
  "form-10-3-child-support-order.json",
  "form-15-8b.json",
  "form-12-3.json",
  "fam-pd-7-5.json"
];
const forms = files.map((file) => JSON.parse(readFileSync(`${root}/${file}`, "utf8")));
const fixture = JSON.parse(readFileSync("public/data/fixtures/synthetic-matter-complete.json", "utf8"));
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const request = forms.find((form) => form.form_id === "fam-pd-7-2");
const initial = buildWizardState(request, fixture);

expect(initial.unsupported_rule_count === 0, "Wizard state must not accept unsupported rules.");
expect(initial.applicable_answerable_items > 0, "Request form should expose applicable answerable questions.");
expect(!initial.navigation.some((item) => item.line_item_id === "p4.expedited_explanation"), "Expedited explanation must be absent while expedited is NO.");
expect(initial.navigation.some((item) => item.line_item_id === "p3.parenting_time_children_terms"), "Parenting-time detail must be applicable when selected.");
expect(initial.navigation.some((item) => item.line_item_id === "p11.financial_statement_filed"), "Financial Statement question must be applicable for a support claim.");
expect(initial.navigation.some((item) => item.line_item_id === "p18.first_choice"), "Availability choices must activate when the user provides preferred dates.");
expect(initial.percent_complete === 100, "Complete synthetic fixture must reach 100% on the request form.");
expect(initial.blocking_items === 0, "Complete synthetic fixture must have zero blockers on the request form.");

const needsHelpFixture = structuredClone(fixture);
needsHelpFixture.unknown_answers = { "fam-pd-7-2": ["p6.legal_grounds", "p9.consented_relief"] };
delete needsHelpFixture.answers["fam-pd-7-2"]["p6.legal_grounds"];
delete needsHelpFixture.answers["fam-pd-7-2"]["p9.consented_relief"];
const needsHelpState = buildWizardState(request, needsHelpFixture);
expect(needsHelpState.needs_help_items >= 2, "Needs-help states must remain representable.");
expect(needsHelpState.blockers.includes("p6.legal_grounds") === false, "A needs-help item must not be counted as an unanswered blocker.");

const expeditedAnswers = structuredClone(fixture.answers);
expeditedAnswers["fam-pd-7-2"]["p4.expedited"] = "YES";
delete expeditedAnswers["fam-pd-7-2"]["p4.expedited_explanation"];
const expedited = buildWizardState(request, { ...fixture, answers: expeditedAnswers });
expect(expedited.navigation.some((item) => item.line_item_id === "p4.expedited_explanation"), "Changing expedited to YES must add its explanation question.");
expect(expedited.blockers.includes("p4.expedited_explanation"), "Newly applicable required questions must become blockers until answered.");

const noParentingAnswers = structuredClone(fixture.answers);
noParentingAnswers["fam-pd-7-2"]["p3.parenting_time_selected"] = false;
delete noParentingAnswers["fam-pd-7-2"]["p3.parenting_time_children_terms"];
const noParenting = buildWizardState(request, { ...fixture, answers: noParentingAnswers });
expect(!noParenting.navigation.some((item) => item.line_item_id === "p3.parenting_time_children_terms"), "Turning parenting time off must remove its detail question.");

const preserved = reconcileWizardSelection(initial, "p5.factual_basis");
expect(preserved.line_item_id === "p5.factual_basis" && preserved.reason === "selection_preserved", "Applicable selection should be preserved.");
const removed = reconcileWizardSelection(noParenting, "p3.parenting_time_children_terms");
expect(removed.line_item_id !== "p3.parenting_time_children_terms", "A removed conditional question must not remain selected.");
expect(["moved_to_next_blocker", "moved_to_first_applicable"].includes(removed.reason), "Removed selection must reconcile deterministically.");

const aggregate = aggregateMatterWizardProgress(forms, fixture);
expect(aggregate.forms.length === 6, "Matter progress must include all six captured forms.");
expect(aggregate.applicable > 0, "Matter progress must include applicable questions.");
expect(aggregate.completed === aggregate.applicable, "Complete synthetic fixture must answer every applicable question.");
expect(aggregate.percent_complete === 100, "Complete synthetic fixture must report 100% matter progress.");
expect(aggregate.blockers === 0, "Complete synthetic fixture must report zero matter blockers.");
expect(aggregate.unsupported === 0, "Matter progress must fail when unsupported rules are present.");
for (const formState of aggregate.forms) {
  expect(formState.percent_complete === 100, `${formState.form_id} must be structurally complete in the seeded fixture.`);
}

const incomplete = structuredClone(fixture.answers);
delete incomplete["fam-pd-7-2"]["p5.factual_basis"];
const afterDelete = buildWizardState(request, { ...fixture, answers: incomplete });
expect(afterDelete.completed_items === initial.completed_items - 1, "Removing an answered applicable question must reduce completed count by one.");
expect(afterDelete.percent_complete < initial.percent_complete, "Removing an applicable answer must reduce progress.");

if (failures.length) {
  console.error("Wizard state check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Deterministic wizard state check passed.");
console.log(`Request form: ${initial.completed_items}/${initial.applicable_answerable_items} completed, ${initial.blocking_items} blockers, ${initial.needs_help_items} needs-help.`);
console.log(`Matter projection: ${aggregate.completed}/${aggregate.applicable} completed across ${aggregate.forms.length} forms.`);
console.log("This proves deterministic state projection only, not source approval, legal correctness, browser integration, or court readiness.");
