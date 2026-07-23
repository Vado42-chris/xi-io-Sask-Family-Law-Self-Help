#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const failures = [];
const html = readFileSync(path.join(ROOT, "public/app/index.html"), "utf8");
const css = readFileSync(path.join(ROOT, "public/styles/user-app.css"), "utf8");
const js = readFileSync(path.join(ROOT, "public/src/user-app.js"), "utf8");

const viewports = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 }
];

function requireText(source, text, label) {
  if (!source.includes(text)) failures.push(`${label} missing: ${text}`);
}

requireText(css, "overflow-x: hidden", "document-level horizontal scroll guard");
requireText(css, "min-width: 0", "pane shrink guard");
requireText(css, "min-height: 44px", "minimum interactive target size");
requireText(css, "min-width: 44px", "minimum interactive target width");
requireText(css, "outline: 3px solid var(--focus)", "visible keyboard focus");
requireText(css, "prefers-reduced-motion", "reduced-motion support");
requireText(css, "@media (max-width: 900px)", "mobile one-pane layout");
requireText(css, "grid-template-columns: 1fr", "mobile single column");
requireText(js, 'setAttribute("aria-live", "polite")', "question change announced to AT");
requireText(js, "lastFocusedBeforeHelp", "focus restore after help");
requireText(js, "mark-unknown", "unknown in one interaction wiring");
requireText(html, "Mark unknown", "unknown control label");
requireText(html, "Answer review", "answer-review banner");
requireText(html, "This is not the document you will file.", "non-filing banner copy");
requireText(html, "View full work plan", "deferred full inventory");
requireText(html, "Continue", "primary continue action");

// Colour-only status is forbidden: status text must exist beside chips/banners.
requireText(html, "Nothing can be sent", "non-colour status text");
requireText(css, "var(--warn-bg)", "status not colour-only (background + text pairing)");

if (html.includes("Prepare package") || js.includes("Prepare package")) {
  failures.push("Prepare package must stay deferred from normal user mode");
}
if (html.includes("global-search") || html.includes("Ask Ibal")) {
  failures.push("Global search / always-visible Ibal branding must stay deferred from /app");
}

const media900 = css.includes("@media (max-width: 900px)");
const media640 = css.includes("@media (max-width: 640px)");
if (!media900 || !media640) {
  failures.push("mobile breakpoints incomplete for required viewports");
}

const zoomContract = css.includes("clamp(") || css.includes("rem");
if (!zoomContract) {
  failures.push("relative units required for 200% zoom usability");
}

const report = {
  status: failures.length ? "failed" : "passed",
  viewports,
  contracts: {
    no_horizontal_scroll: css.includes("overflow-x: hidden"),
    min_target_44: css.includes("min-height: 44px"),
    focus_visible: css.includes(":focus-visible"),
    reduced_motion: css.includes("prefers-reduced-motion"),
    mobile_single_pane: media900,
    answer_review_banner: html.includes("Answer review"),
    continue_first: html.includes("Continue where you left off"),
    focus_restore: js.includes("lastFocusedBeforeHelp"),
    at_announcement: js.includes('aria-live", "polite')
  },
  human_timing_checklist: [
    "Resume in under 10 seconds",
    "Find next required action in under 5 seconds",
    "Open exact court wording in under 10 seconds",
    "Mark unknown in one interaction",
    "Return to same step after restart",
    "Understand finalization blockers without reading audit data"
  ]
};

if (failures.length) {
  failures.forEach((failure) => console.error(`ERROR (user-geometry): ${failure}`));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(report, null, 2));
}
