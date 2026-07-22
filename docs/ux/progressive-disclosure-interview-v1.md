# Progressive Disclosure Interview v1

Status: `UX contract, runtime not checked`

## Principle

Ask the smallest useful question, explain why it matters, and reveal follow-up questions only when the prior answer makes them relevant. Users answer facts, not court jargon, wherever the workflow can perform the translation deterministically.

## Interaction pattern

Each step should contain:

- one primary question,
- a plain-language explanation,
- a source or rule link,
- examples that do not imply an answer,
- `I do not know` and `save for later` paths where safe,
- immediate effect on forms and tasks,
- a way to edit earlier answers.

## Conversation and form relationship

The chatbot is a view over the same structured interview state, not a separate memory store. An answer given in chat must appear in the form-oriented review screen with source, confidence, approval, and edit controls.

## AI drafting pattern

For a narrative field:

1. Preserve the user's original wording.
2. Ask for dates, actors, actions, consequences, attempts to resolve, and supporting records.
3. Separate fact from interpretation.
4. Produce a concise suggestion labelled `AI draft`.
5. Show every source fact used.
6. Let the user accept, edit, reject, or split the draft.
7. Never silently update another form.

## Decision preview

Before committing a workflow branch, show:

- what the system understood,
- the proposed workflow,
- forms and tasks that would be added,
- answers that triggered the decision,
- alternatives considered,
- unresolved questions.

## Homework task pattern

Each task needs a verb, object, reason, source requirement, due state, blocker effect, upload or completion method, and privacy classification.

Example:

```text
Upload or identify your most recent sworn Financial Statement.
Reason: the proposed application includes support and the JCC request asks whether Form 15-47 has been filed.
Status: missing, blocks final review.
```

## No dead ends

A failed eligibility gate must explain the mismatch, preserve the user's answers, and point to an official information source or alternate workflow state. It must not discard the matter or fabricate a replacement procedure.
