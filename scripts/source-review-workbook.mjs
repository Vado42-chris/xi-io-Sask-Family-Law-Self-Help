#!/usr/bin/env node

/**
 * Deterministic validators for Kit #3J source-review workbooks.
 *
 * Modes:
 *   --check                 Structural integrity of a freshly generated workbook
 *   --check-dispositions    Disposition gate rules (fixtures + generated pending workbook)
 *   --validate-file PATH    Structure + disposition rules for a saved workbook
 *   (default write mode)    Create a pending workbook at --output
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT_DIR = path.join(ROOT, "sources", "jcc-kit-3j", "2026-03-30");
const INDEX_PATH = path.join(SNAPSHOT_DIR, "forms-index.json");
const DEFAULT_OUTPUT = path.join(ROOT, "data", "source-review", "jcc-kit-3j-2026-03-30-review.json");

export const ALLOWED_DISPOSITIONS = [
  "pending",
  "verified",
  "corrected",
  "disputed",
  "blocked",
  "not_applicable"
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseArguments(argv) {
  const options = {
    check: false,
    checkDispositions: false,
    validateFile: null,
    output: DEFAULT_OUTPUT,
    reviewer: "",
    reviewDate: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") {
      options.check = true;
    } else if (argument === "--check-dispositions") {
      options.checkDispositions = true;
    } else if (argument === "--validate-file") {
      options.validateFile = path.resolve(ROOT, argv[++index]);
    } else if (argument === "--output") {
      options.output = path.resolve(ROOT, argv[++index]);
    } else if (argument === "--reviewer") {
      options.reviewer = argv[++index] ?? "";
    } else if (argument === "--review-date") {
      options.reviewDate = argv[++index] ?? "";
    } else {
      throw new Error(`Unsupported argument: ${argument}`);
    }
  }

  if (options.reviewDate && !DATE_RE.test(options.reviewDate)) {
    throw new Error("--review-date must use YYYY-MM-DD");
  }

  return options;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function buildReviewEntry(form, item) {
  return {
    review_key: `${form.form_id}::${item.line_item_id}`,
    form_id: form.form_id,
    official_number: form.official_number,
    form_title: form.title,
    source_pages: form.source_pages,
    line_item_id: item.line_item_id,
    source_label: item.source_label,
    kind: item.kind,
    required_rule: item.required_rule,
    options: item.options ?? null,
    disposition: "pending",
    rendered_source_verified: false,
    transcription_verified: false,
    rule_verified: false,
    reviewer: null,
    reviewed_at: null,
    source_location_note: null,
    correction_proposed: null,
    dispute_or_blocker: null,
    evidence_reference: null,
    notes: null
  };
}

export async function buildWorkbook() {
  const index = await readJson(INDEX_PATH);
  const forms = [];

  for (const indexedForm of index.forms_included) {
    const catalogPath = path.join(SNAPSHOT_DIR, "forms", `${indexedForm.form_id}.json`);
    const catalog = await readJson(catalogPath);

    forms.push({
      form_id: catalog.form_id,
      official_number: catalog.official_number,
      title: catalog.title,
      source_pages: catalog.source_pages,
      declared_line_item_count: catalog.line_item_count,
      entries: catalog.line_items.map((item) => buildReviewEntry(catalog, item))
    });
  }

  return {
    workbook_version: 1,
    snapshot_id: index.snapshot_id,
    source_date: index.source_date,
    captured_at: index.captured_at,
    source_sha256: index.source_sha256,
    purpose: "Independent rendered-page verification of every normalized source line item.",
    allowed_dispositions: ALLOWED_DISPOSITIONS,
    review_policy: {
      canonical_catalogs_are_read_only: true,
      corrections_require_new_catalog_version: true,
      court_readiness_not_implied: true,
      reviewer_must_compare_rendered_source: true,
      verified_requires_reviewer_date_rendered_transcription_evidence: true
    },
    reviewer: null,
    review_started_at: null,
    forms
  };
}

export function validateWorkbook(workbook) {
  const failures = [];
  const entries = workbook.forms.flatMap((form) => form.entries);
  const keys = new Set();

  if (workbook.snapshot_id !== "jcc-kit-3j-2026-03-30") {
    failures.push(`Unexpected snapshot_id: ${workbook.snapshot_id}`);
  }

  if (workbook.forms.length !== 6) {
    failures.push(`Expected 6 forms, received ${workbook.forms.length}`);
  }

  if (entries.length !== 267) {
    failures.push(`Expected 267 review entries, received ${entries.length}`);
  }

  for (const form of workbook.forms) {
    if (form.entries.length !== form.declared_line_item_count) {
      failures.push(
        `${form.form_id} declares ${form.declared_line_item_count} items but has ${form.entries.length} review entries`
      );
    }

    for (const entry of form.entries) {
      if (keys.has(entry.review_key)) {
        failures.push(`Duplicate review key: ${entry.review_key}`);
      }
      keys.add(entry.review_key);

      if (!entry.line_item_id || !entry.source_label || !entry.kind || !entry.required_rule) {
        failures.push(`Incomplete review entry: ${entry.review_key}`);
      }

      if (!ALLOWED_DISPOSITIONS.includes(entry.disposition)) {
        failures.push(`Unsupported disposition ${entry.disposition} for ${entry.review_key}`);
      }
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      snapshot_id: workbook.snapshot_id,
      forms: workbook.forms.length,
      entries: entries.length,
      pending: entries.filter((entry) => entry.disposition === "pending").length,
      verified: entries.filter((entry) => entry.disposition === "verified").length,
      corrected: entries.filter((entry) => entry.disposition === "corrected").length,
      disputed: entries.filter((entry) => entry.disposition === "disputed").length,
      blocked: entries.filter((entry) => entry.disposition === "blocked").length,
      not_applicable: entries.filter((entry) => entry.disposition === "not_applicable").length
    }
  };
}

function requireReviewerAndDate(entry, failures) {
  if (!nonEmptyString(entry.reviewer)) {
    failures.push(`${entry.review_key}: disposition ${entry.disposition} requires reviewer identity`);
  }
  if (!nonEmptyString(entry.reviewed_at) || !DATE_RE.test(entry.reviewed_at)) {
    failures.push(`${entry.review_key}: disposition ${entry.disposition} requires reviewed_at as YYYY-MM-DD`);
  }
}

/**
 * Disposition integrity rules for completed or in-progress workbooks.
 * A disposition of "verified" is invalid unless reviewer, date, rendered-source,
 * transcription, and evidence are all present/confirmed.
 */
export function validateEntryDisposition(entry) {
  const failures = [];
  const key = entry.review_key || `${entry.form_id}::${entry.line_item_id || "unknown"}`;

  if (!ALLOWED_DISPOSITIONS.includes(entry.disposition)) {
    return [`${key}: unsupported disposition ${entry.disposition}`];
  }

  if (entry.disposition === "pending") {
    if (entry.rendered_source_verified === true) {
      failures.push(`${key}: pending entry must not set rendered_source_verified=true`);
    }
    if (entry.transcription_verified === true) {
      failures.push(`${key}: pending entry must not set transcription_verified=true`);
    }
    if (entry.rule_verified === true) {
      failures.push(`${key}: pending entry must not set rule_verified=true`);
    }
    return failures;
  }

  requireReviewerAndDate(entry, failures);

  if (entry.disposition === "verified") {
    if (entry.rendered_source_verified !== true) {
      failures.push(`${key}: verified requires rendered_source_verified=true`);
    }
    if (entry.transcription_verified !== true) {
      failures.push(`${key}: verified requires transcription_verified=true`);
    }
    if (!nonEmptyString(entry.evidence_reference)) {
      failures.push(`${key}: verified requires evidence_reference`);
    }
    if (nonEmptyString(entry.correction_proposed)) {
      failures.push(`${key}: verified must not carry correction_proposed; use corrected disposition`);
    }
  }

  if (entry.disposition === "corrected") {
    if (!nonEmptyString(entry.correction_proposed)) {
      failures.push(`${key}: corrected requires correction_proposed`);
    }
    if (!nonEmptyString(entry.evidence_reference)) {
      failures.push(`${key}: corrected requires evidence_reference`);
    }
    if (entry.rendered_source_verified !== true) {
      failures.push(`${key}: corrected requires rendered_source_verified=true`);
    }
  }

  if (entry.disposition === "disputed") {
    if (!nonEmptyString(entry.dispute_or_blocker)) {
      failures.push(`${key}: disputed requires dispute_or_blocker`);
    }
    if (!nonEmptyString(entry.evidence_reference)) {
      failures.push(`${key}: disputed requires evidence_reference`);
    }
  }

  if (entry.disposition === "blocked") {
    if (!nonEmptyString(entry.dispute_or_blocker) && !nonEmptyString(entry.notes)) {
      failures.push(`${key}: blocked requires dispute_or_blocker or notes`);
    }
  }

  if (entry.disposition === "not_applicable") {
    if (!nonEmptyString(entry.notes) && !nonEmptyString(entry.source_location_note)) {
      failures.push(`${key}: not_applicable requires notes or source_location_note`);
    }
  }

  return failures;
}

export function validateWorkbookDispositions(workbook) {
  const entries = workbook.forms.flatMap((form) => form.entries);
  const failures = entries.flatMap((entry) => validateEntryDisposition(entry));
  const counts = Object.fromEntries(ALLOWED_DISPOSITIONS.map((name) => [name, 0]));
  for (const entry of entries) {
    if (counts[entry.disposition] !== undefined) {
      counts[entry.disposition] += 1;
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      snapshot_id: workbook.snapshot_id,
      entries: entries.length,
      ...counts
    }
  };
}

export function validateCompletedWorkbook(workbook) {
  const structure = validateWorkbook(workbook);
  const dispositions = validateWorkbookDispositions(workbook);
  const failures = [...structure.failures, ...dispositions.failures];
  return {
    ok: failures.length === 0,
    failures,
    summary: {
      ...structure.summary,
      disposition_ok: dispositions.ok
    }
  };
}

function baseEntry(overrides = {}) {
  return {
    review_key: "fixture-form::fixture.item",
    form_id: "fixture-form",
    official_number: "FIXTURE",
    form_title: "Fixture",
    source_pages: [1, 1],
    line_item_id: "fixture.item",
    source_label: "Fixture label",
    kind: "text",
    required_rule: "always",
    options: null,
    disposition: "pending",
    rendered_source_verified: false,
    transcription_verified: false,
    rule_verified: false,
    reviewer: null,
    reviewed_at: null,
    source_location_note: null,
    correction_proposed: null,
    dispute_or_blocker: null,
    evidence_reference: null,
    notes: null,
    ...overrides
  };
}

export function dispositionFixtureCases() {
  return [
    {
      name: "pending_ok",
      entry: baseEntry(),
      expectOk: true
    },
    {
      name: "verified_missing_gates_fails",
      entry: baseEntry({
        disposition: "verified",
        reviewer: "Reviewer A",
        reviewed_at: "2026-07-23",
        rendered_source_verified: false,
        transcription_verified: false,
        evidence_reference: null
      }),
      expectOk: false,
      mustInclude: [
        "rendered_source_verified=true",
        "transcription_verified=true",
        "evidence_reference"
      ]
    },
    {
      name: "verified_complete_ok",
      entry: baseEntry({
        disposition: "verified",
        reviewer: "Reviewer A",
        reviewed_at: "2026-07-23",
        rendered_source_verified: true,
        transcription_verified: true,
        rule_verified: true,
        evidence_reference: "kit-page-18-line-court-file-number"
      }),
      expectOk: true
    },
    {
      name: "verified_without_reviewer_fails",
      entry: baseEntry({
        disposition: "verified",
        reviewed_at: "2026-07-23",
        rendered_source_verified: true,
        transcription_verified: true,
        evidence_reference: "kit-page-18"
      }),
      expectOk: false,
      mustInclude: ["reviewer identity"]
    },
    {
      name: "corrected_without_proposal_fails",
      entry: baseEntry({
        disposition: "corrected",
        reviewer: "Reviewer A",
        reviewed_at: "2026-07-23",
        rendered_source_verified: true,
        evidence_reference: "kit-page-18",
        correction_proposed: null
      }),
      expectOk: false,
      mustInclude: ["correction_proposed"]
    },
    {
      name: "disputed_without_blocker_fails",
      entry: baseEntry({
        disposition: "disputed",
        reviewer: "Reviewer A",
        reviewed_at: "2026-07-23",
        evidence_reference: "kit-page-18",
        dispute_or_blocker: null
      }),
      expectOk: false,
      mustInclude: ["dispute_or_blocker"]
    },
    {
      name: "pending_with_verified_flags_fails",
      entry: baseEntry({
        disposition: "pending",
        rendered_source_verified: true
      }),
      expectOk: false,
      mustInclude: ["pending entry must not set rendered_source_verified=true"]
    }
  ];
}

export function runDispositionFixtureAudit() {
  const failures = [];
  for (const testCase of dispositionFixtureCases()) {
    const resultFailures = validateEntryDisposition(testCase.entry);
    const ok = resultFailures.length === 0;
    if (ok !== testCase.expectOk) {
      failures.push(
        `Fixture ${testCase.name}: expected ok=${testCase.expectOk}, got ok=${ok} (${resultFailures.join("; ") || "no failures"})`
      );
      continue;
    }
    if (!testCase.expectOk && testCase.mustInclude) {
      for (const fragment of testCase.mustInclude) {
        if (!resultFailures.some((failure) => failure.includes(fragment))) {
          failures.push(`Fixture ${testCase.name}: expected failure mentioning "${fragment}"`);
        }
      }
    }
  }
  return {
    ok: failures.length === 0,
    failures,
    summary: {
      fixture_cases: dispositionFixtureCases().length
    }
  };
}

function reportFailures(label, failures) {
  for (const failure of failures) {
    console.error(`ERROR (${label}): ${failure}`);
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));

  if (options.checkDispositions) {
    const fixtureAudit = runDispositionFixtureAudit();
    if (!fixtureAudit.ok) {
      reportFailures("disposition-fixtures", fixtureAudit.failures);
      process.exitCode = 1;
      return;
    }

    const workbook = await buildWorkbook();
    const structure = validateWorkbook(workbook);
    const dispositions = validateWorkbookDispositions(workbook);
    if (!structure.ok) {
      reportFailures("structure", structure.failures);
      process.exitCode = 1;
      return;
    }
    if (!dispositions.ok) {
      reportFailures("dispositions", dispositions.failures);
      process.exitCode = 1;
      return;
    }

    console.log(
      JSON.stringify(
        {
          disposition_fixtures: fixtureAudit.summary,
          generated_workbook: dispositions.summary,
          note: "No line item is auto-verified. Generated workbook remains all pending."
        },
        null,
        2
      )
    );
    return;
  }

  if (options.validateFile) {
    const workbook = await readJson(options.validateFile);
    const result = validateCompletedWorkbook(workbook);
    if (!result.ok) {
      reportFailures("validate-file", result.failures);
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify({ file: path.relative(ROOT, options.validateFile), ...result.summary }, null, 2));
    return;
  }

  const workbook = await buildWorkbook();
  const validation = validateWorkbook(workbook);

  if (!validation.ok) {
    reportFailures("structure", validation.failures);
    process.exitCode = 1;
    return;
  }

  if (options.check) {
    console.log(JSON.stringify(validation.summary, null, 2));
    return;
  }

  workbook.reviewer = options.reviewer || null;
  workbook.review_started_at = options.reviewDate || null;

  await mkdir(path.dirname(options.output), { recursive: true });
  await writeFile(options.output, `${JSON.stringify(workbook, null, 2)}\n`, "utf8");
  console.log(`Created ${path.relative(ROOT, options.output)} with ${validation.summary.entries} pending review entries.`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
