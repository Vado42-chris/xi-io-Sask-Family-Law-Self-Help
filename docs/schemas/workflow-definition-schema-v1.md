# Workflow Definition Schema v1

Status: `conceptual schema, not executable`

## Purpose

Represent a versioned court-kit procedure as deterministic rules, questions, tasks, forms, dependencies, deadlines, safety gates, and source anchors.

## Top-level shape

```yaml
workflow_id:
workflow_version:
jurisdiction:
court:
judicial_centres: []
source_records: []
source_state:
eligibility_rules: []
exclusion_rules: []
questions: []
relief_categories: []
forms: []
tasks: []
dependencies: []
deadline_rules: []
service_rules: []
filing_rules: []
external_awaited_inputs: []
escalation_rules: []
completion_gates: []
explanations: []
```

## Rule record

```yaml
rule_id:
rule_type: eligibility | exclusion | dependency | deadline | service | filing | escalation
source_anchor:
conditions: []
outcome:
explanation:
confidence: verified | reviewed | draft | stale | unknown
```

## Question record

```yaml
question_id:
plain_language_prompt:
legal_term_label:
why_asked:
answer_type:
allowed_answers: []
unknown_allowed:
follow_up_rules: []
privacy_class:
source_anchor:
```

## Task record

```yaml
task_id:
verb:
object:
reason:
responsible_actor: user | other_party | lawyer | court | third_party
required_state: required | recommended | optional | not_applicable
blocker_effect:
due_rule_ref:
completion_evidence:
privacy_class:
```

## Form record

```yaml
form_id:
official_name:
version:
source_ref:
produced_by: user | court | other_party
required_when: []
semantic_field_map_ref:
signature_requirement:
oath_or_commission_requirement:
service_requirement:
filing_requirement:
```

## Rules

- Source anchors are mandatory for procedural rules.
- Stale sources block final-ready workflow state.
- AI cannot alter rule outcomes.
- Deadline rules must record calendar assumptions and uncertainty.
- External awaited inputs cannot be fabricated.
- Every exclusion has a user-facing explanation and referral state.
