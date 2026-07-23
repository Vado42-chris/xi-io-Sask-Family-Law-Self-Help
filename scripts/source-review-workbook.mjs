#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT_DIR = path.join(ROOT, "sources", "jcc-kit-3j", "2026-03-30");
const INDEX_PATH = path.join(SNAPSHOT_DIR, "forms-index.json");
const DEFAULT_OUTPUT = path.join(ROOT, "data", "source-review", "jcc-kit-3j-2026-03-30-review.json");

const ALLOWED_DISPOSITIONS = [
  "pending",
  "verified",
  "corrected",
  "disputed",
  "blocked",
  "not_applicable"
];

function parseArguments(argv) {
  const options = {
    check: false,
    output: DEFAULT_OUTPUT,
    reviewer: "",
    reviewDate: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") {
      options.check = true;
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

  if (options.reviewDate && !/^\d{4}-\d{2}-\d{2}$/.test(options.reviewDate)) {
    throw new Error("--review-date must use YYYY-MM-DD");
  }

  return options;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
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
      reviewer_must_compare_rendered_source: true
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
      failures.push(`${form.form_id} declares ${form.declared_line_item_count} items but has ${form.entries.length} review entries`);
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
      pending: entries.filter((entry) => entry.disposition === "pending").length
    }
  };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const workbook = await buildWorkbook();
  const validation = validateWorkbook(workbook);

  if (!validation.ok) {
    for (const failure of validation.failures) {
      console.error(`ERROR: ${failure}`);
    }
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

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
