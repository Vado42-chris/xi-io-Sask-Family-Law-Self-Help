# Accessibility and Cognitive Load v1

Status: `required design contract, runtime not checked`

## Baseline

The product must target WCAG 2.2 AA and reduce executive-function demand beyond minimum conformance. Legal stress, disability, low literacy, limited English, trauma, fatigue, and intermittent attention are expected operating conditions.

## Requirements

- Complete keyboard operation and visible focus.
- Semantic headings, landmarks, labels, errors, and status messages.
- Screen-reader announcement of task, validation, and plan changes.
- No information conveyed by colour alone.
- Plain-language mode without removing access to exact court terminology.
- One primary decision per screen where practical.
- Persistent progress and resumable state.
- Explicit save state, no silent data loss.
- User-controlled text size and comfortable line length.
- No forced time limits for drafting.
- Error recovery that preserves entered information.
- Printable task lists and package summaries.
- Reduced-motion support.
- Mobile and desktop layouts that preserve document review context.

## Cognitive scaffolding

- Explain what is happening now, what comes next, and what is waiting on someone else.
- Separate `you can do now`, `you need to obtain`, `another party must do`, and `the court will provide`.
- Use short sections with expandable detail.
- Summarize before asking for confirmation.
- Permit uncertainty without forcing a false answer.
- Highlight contradictions without accusatory language.
- Distinguish required, recommended, optional, and not applicable.

## High-stress mode

The first runtime design should include a low-density mode that shows only the active step, the immediate reason, and one next action, while preserving access to the full plan.

## Validation evidence required later

Keyboard matrix, screen-reader review, zoom and reflow checks, colour contrast, error recovery, reduced motion, mobile review, print output, and testing with people who have relevant lived experience.
