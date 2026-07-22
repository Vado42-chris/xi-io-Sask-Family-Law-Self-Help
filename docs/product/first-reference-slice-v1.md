# First Reference Slice v1

Status: `planned, implementation blocked by bootstrap review`  
Gate: `SFL-TRIAGE-001` and `SFL-TASKPLAN-001`

## Slice

Eligibility triage and initial task-plan generation for Saskatchewan Court of King's Bench Kit #3J, Request for a Judicial Case Conference Order.

## Human-only flow

1. User chooses Saskatchewan family law.
2. User answers whether an existing Court of King's Bench family file exists.
3. User identifies Regina or Saskatoon Judicial Centre.
4. User identifies whether the requested relief is interim, varies an interim order, varies a final order, or seeks corollary relief after divorce.
5. User identifies petitioner or respondent role.
6. User identifies initiating or responding request.
7. User identifies whether a JCC date and Form FAM-PD #7-4 already exist.
8. System explains the result and asks the user to confirm the workflow.
9. System creates an initial required-form and homework plan.

## Deterministic outputs

When the kit appears applicable, the initial plan can include:

- Form FAM-PD #7-2
- Form 10-3 draft order
- Separate Form 10-3 child-support order when child support applies
- One applicable proof-of-service path
- Later Form FAM-PD #7-5 after the court schedules the JCC
- Court-supplied Form FAM-PD #7-4 and endorsement as awaited inputs

## Required explanations

Every outcome must explain:

- which answer triggered the result,
- which source rule supports it,
- what remains unknown,
- what the system will and will not prepare,
- what the user should do next.

## Synthetic test cases

1. Existing Saskatoon file, interim spousal support, initiating request, no JCC date.
2. Existing Regina file, response request, JCC date already set.
3. File located outside Regina or Saskatoon.
4. Request to vary a final order.
5. Corollary relief after divorce.
6. No existing court file.
7. Unclear order type.

## Acceptance criteria

- Same inputs always produce the same result.
- AI disabled does not remove core functionality.
- No legal outcome prediction is generated.
- No private data leaves the synthetic test environment.
- Source version is visible.
- Unknown and stale source states do not produce a final-ready result.
- The user can revise any answer and see the plan update.
