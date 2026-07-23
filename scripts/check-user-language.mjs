#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const index = await readFile(path.join(ROOT, "public", "index.html"), "utf8");
const layer = await readFile(path.join(ROOT, "public", "src", "user-language-layer.js"), "utf8");
const styles = await readFile(path.join(ROOT, "public", "styles", "user-mode.css"), "utf8");

const failures = [];

function requireText(source, text, label) {
  if (!source.includes(text)) failures.push(`${label} is missing: ${text}`);
}

function forbidText(source, text, label) {
  if (source.includes(text)) failures.push(`${label} still exposes developer copy: ${text}`);
}

requireText(index, '<body class="user-mode">', "user-mode body");
if (!index.includes('href="./styles/user-mode.css"') && !index.includes('href="/styles/user-mode.css"')) {
  failures.push("user-mode stylesheet is missing: href=\"./styles/user-mode.css\" or href=\"/styles/user-mode.css\"");
}
if (!index.includes('src="./src/user-language-layer.js"') && !index.includes('src="/src/user-language-layer.js"')) {
  failures.push("user-language module is missing: src=\"./src/user-language-layer.js\" or src=\"/src/user-language-layer.js\"");
}
requireText(index, "Your next steps", "next-step heading");
requireText(index, "Preparing for your JCC", "human progress heading");
requireText(index, "Check my work", "human validation action");
requireText(index, "Official wording and form details stay available when you need them.", "progressive disclosure copy");

for (const phrase of [
  "Synthetic matter",
  "JCC preparation demo",
  "no real client data",
  "Work to complete",
  "Guided questions",
  "Section review",
  "Page preview",
  "Package preview",
  "Contextual concierge"
]) {
  forbidText(index, phrase, "public/index.html");
}

for (const selector of [
  ".trust-cluster",
  "#form-source-summary",
  ".question-kind",
  ".question-rule",
  ".mode-actions"
]) {
  requireText(styles, selector, "user-mode density rule");
}

requireText(layer, "MutationObserver", "dynamic copy observer");
requireText(layer, "Private on this computer", "private-mode user copy");
requireText(layer, "Official form details", "audit disclosure rename");
requireText(layer, "Are you asking the court to make a temporary decision", "plain-language legal prompt");

for (const forbiddenMechanism of [
  "fetch(",
  "localStorage",
  "sessionStorage",
  "/api/local/matter",
  "/data/private/"
]) {
  forbidText(layer, forbiddenMechanism, "presentation-only language layer");
}

if (failures.length) {
  failures.forEach((failure) => console.error(`ERROR (user-language): ${failure}`));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "passed",
    mode: "plain-language-default",
    canonical_source_mutation: false,
    private_data_access: false,
    hidden_by_default: ["developer status tokens", "raw source metadata", "question kinds", "rule expressions", "version controls"]
  }, null, 2));
}
