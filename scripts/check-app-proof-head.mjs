#!/usr/bin/env node

/**
 * Fail when committed screenshot proof is stale relative to Git HEAD.
 *
 * Accepts either:
 * - proof.git_head === HEAD, or
 * - proof.git_head === HEAD^ and HEAD only changes test-results/screenshots/**
 *
 * That second case is required because screenshot commits cannot know their own
 * final hash before the commit exists.
 */

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const proofPath = path.join(ROOT, "test-results", "screenshots", "app-proof.json");

function git(args) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

const head = git(["rev-parse", "HEAD"]);

if (!existsSync(proofPath)) {
  console.error("ERROR (app-proof-head): missing test-results/screenshots/app-proof.json");
  console.error("Regenerate with: npm run playwright:install && npm run check:browser-proof");
  process.exit(1);
}

const proof = JSON.parse(readFileSync(proofPath, "utf8"));
if (!proof.git_head) {
  console.error("ERROR (app-proof-head): app-proof.json missing git_head");
  process.exit(1);
}

let acceptable = proof.git_head === head;
let reason = "exact HEAD match";

if (!acceptable) {
  try {
    const parent = git(["rev-parse", `${head}^`]);
    if (proof.git_head === parent) {
      const changed = git(["diff-tree", "--no-commit-id", "--name-only", "-r", head])
        .split("\n")
        .filter(Boolean);
      const onlyScreenshots =
        changed.length > 0 && changed.every((file) => file.startsWith("test-results/screenshots/"));
      if (onlyScreenshots) {
        acceptable = true;
        reason = "screenshot-only commit on top of proof head";
      }
    }
  } catch {
    // First commit or shallow history — fall through to failure.
  }
}

if (!acceptable) {
  console.error("ERROR (app-proof-head): screenshot proof is stale");
  console.error(`  app-proof.json.git_head = ${proof.git_head}`);
  console.error(`  current git HEAD        = ${head}`);
  console.error("Regenerate and commit screenshots:");
  console.error("  npm run playwright:install");
  console.error("  npm run check:browser-proof");
  console.error("  git add test-results/screenshots && git commit -m 'test: refresh /app screenshot proof'");
  process.exit(1);
}

if (!String(proof.href || "").includes("/app")) {
  console.error("ERROR (app-proof-head): proof href is not the /app route");
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "passed",
      git_head: head,
      proof_git_head: proof.git_head,
      reason,
      href: proof.href,
      captured_at: proof.captured_at || null
    },
    null,
    2
  )
);
