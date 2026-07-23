import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createRuleContext,
  deriveMatterFacts,
  evaluateCondition,
  evaluateFormCatalog,
  evaluateRequiredRule
} from "../public/src/applicability-engine.js";

const catalogRoot = "sources/jcc-kit-3j/2026-03-30/forms";
const formFiles = [
  "fam-pd-7-2.json",
  "form-10-3-draft-order.json",
  "form-10-3-child-support-order.json",
  "form-15-8b.json",
  "form-12-3.json",
  "fam-pd-7-5.json"
];

const forms = formFiles.map((filename) => JSON.parse(readFileSync(`${catalogRoot}/${filename}`, "utf8")));
const requestForm = forms.find((form) => form.form_id === "fam-pd-7-2");

const answers = {
  "fam-pd-7-2": {
    "p3.decision_making_selected": false,
    "p3.parenting_time_selected": true,
    "p3.child_support_selected": true,
    "p3.spousal_support_selected": false,
    "p4.expedited": "NO",
    "p10.pleadings_closed": "YES"
  }
};

const derivedFacts = deriveMatterFacts(answers);
const context = createRuleContext({ answers, derivedFacts });

assert.equal(evaluateRequiredRule("always", context).applicable, true);
assert.equal(evaluateRequiredRule("optional", context).applicable, true);
assert.equal(evaluateRequiredRule("display_only", context).applicable, true);
assert.equal(evaluateCondition("p4.expedited=YES", context).matched, false);
assert.equal(evaluateCondition("p4.expedited=NO", context).matched, true);
assert.equal(evaluateCondition("support_claim=true", context).matched, true);
assert.equal(evaluateCondition("support_claim!=false", context).matched, true);
assert.equal(derivedFacts.parenting_or_child_support_claim, true);

// Short-code conditions must match official choice labels used in catalogs.
assert.equal(
  evaluateCondition(
    "request_type=response",
    createRuleContext({
      answers: {
        "fam-pd-7-2": {
          "p1.request_type": "A response to a request for a Judicial Case Conference that was served on me"
        }
      }
    })
  ).matched,
  true
);
assert.equal(
  evaluateCondition(
    "p7.service_state=served",
    createRuleContext({
      answers: {
        "fam-pd-7-2": {
          "p7.service_state": "The opposing party was served with a copy of this Request at least three days before it was filed with the court; proof attached"
        }
      }
    })
  ).matched,
  true
);
assert.equal(
  evaluateCondition(
    "p15c.pretrial_state=Scheduled",
    createRuleContext({
      answers: {
        "fam-pd-7-2": {
          "p15c.pretrial_state": "Not scheduled"
        }
      }
    })
  ).matched,
  false
);

const initialEvaluation = evaluateFormCatalog(requestForm, { answers, derivedFacts });
const byId = new Map(initialEvaluation.items.map((item) => [item.line_item_id, item]));

assert.equal(byId.get("p3.decision_making_children_terms").applicable, false);
assert.equal(byId.get("p3.parenting_time_children_terms").applicable, true);
assert.equal(byId.get("p4.expedited_explanation").applicable, false);
assert.equal(byId.get("p11.financial_statement_filed").applicable, true);
assert.equal(initialEvaluation.unsupported_rule_count, 0);

const changedAnswers = structuredClone(answers);
changedAnswers["fam-pd-7-2"]["p4.expedited"] = "YES";
const changedEvaluation = evaluateFormCatalog(requestForm, {
  answers: changedAnswers,
  derivedFacts: deriveMatterFacts(changedAnswers)
});
const changedById = new Map(changedEvaluation.items.map((item) => [item.line_item_id, item]));
assert.equal(changedById.get("p4.expedited_explanation").applicable, true);

let totalLineItems = 0;
let unsupportedRuleCount = 0;
const unsupported = [];
for (const form of forms) {
  const evaluation = evaluateFormCatalog(form, { answers, derivedFacts });
  totalLineItems += evaluation.total_line_items;
  unsupportedRuleCount += evaluation.unsupported_rule_count;
  unsupported.push(...evaluation.unsupported_rules.map((item) => ({ form_id: form.form_id, ...item })));
}

assert.equal(totalLineItems, 267, "The applicability audit must cover all 267 captured line items.");
assert.equal(unsupportedRuleCount, 0, `Unsupported required rules found: ${JSON.stringify(unsupported)}`);

console.log("Deterministic applicability engine check passed.");
console.log(`Audited ${totalLineItems} line items across ${forms.length} form catalogs.`);
console.log("This proves rule parsing and deterministic branch evaluation only, not legal correctness or source approval.");
