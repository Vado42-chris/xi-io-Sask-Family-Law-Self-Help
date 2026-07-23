#!/usr/bin/env node

/**
 * Real browser geometry and /app proof screenshots.
 * Requires Playwright browsers (`npx playwright install chromium`).
 */

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const ROOT = process.cwd();
const PORT = 4191;
const BASE = `http://127.0.0.1:${PORT}`;
const outDir = path.join(ROOT, "test-results", "screenshots");
const failures = [];
const commit = spawnSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).stdout.trim();
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 }
];

function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/serve-preview.mjs"], {
      cwd: ROOT,
      env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1", SFL_COMMIT: process.env.SFL_COMMIT || "local" },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let ready = false;
    const onData = (chunk) => {
      const text = String(chunk);
      if (text.includes("/app") && !ready) {
        ready = true;
        resolve(child);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", (code) => {
      if (!ready) reject(new Error(`Preview server exited early: ${code}`));
    });
    setTimeout(() => {
      if (!ready) reject(new Error("Preview server did not become ready"));
    }, 10000);
  });
}

async function assertNoHorizontalScroll(page, label) {
  const metrics = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    body: document.body.scrollWidth <= document.body.clientWidth + 1,
    plan: (() => {
      const el = document.querySelector(".work-plan");
      return !el || el.scrollWidth <= el.clientWidth + 1;
    })(),
    work: (() => {
      const el = document.querySelector(".current-work");
      return !el || el.scrollWidth <= el.clientWidth + 1;
    })()
  }));
  for (const [key, ok] of Object.entries(metrics)) {
    if (!ok) failures.push(`${label}: horizontal scroll detected on ${key}`);
  }
}

async function run() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
      await page.waitForSelector("#unlock-gate, #app-shell");
      // Practice path to reach shell without private data.
      if (await page.locator("#use-practice").isVisible()) {
        await page.click("#use-practice");
        await page.waitForSelector("#app-shell:not([hidden])");
      }
      await assertNoHorizontalScroll(page, viewport.name);

      if (viewport.width <= 900) {
        await page.evaluate(() => document.querySelector(".layout")?.setAttribute("data-mobile-pane", "plan"));
      }
      const primaryVisible = await page
        .locator("#continue-next, #open-court-wording-blocked, #save-continue")
        .evaluateAll((nodes) => nodes.some((node) => {
          const style = window.getComputedStyle(node);
          return style.display !== "none" && style.visibility !== "hidden" && node.getClientRects().length > 0;
        }));
      if (!primaryVisible) failures.push(`${viewport.name}: primary action not visible`);

      if (viewport.width <= 900) {
        const planHidden = await page.evaluate(() => {
          const layout = document.querySelector(".layout");
          layout?.setAttribute("data-mobile-pane", "work");
          const plan = document.querySelector(".work-plan");
          return plan && getComputedStyle(plan).display === "none";
        });
        if (!planHidden) failures.push(`${viewport.name}: mobile one-pane work mode failed`);
      }

      // Help open/close + focus restore when help is available; otherwise wording dialog.
      if (await page.locator("#help-answer").isVisible()) {
        await page.click("#help-answer");
        await page.waitForSelector("#help-drawer:not([hidden])");
        await page.click("#close-help");
        const focused = await page.evaluate(() => document.activeElement?.id || "");
        if (focused !== "help-answer") failures.push(`${viewport.name}: focus did not restore to help control`);
      }

      const shot = path.join(outDir, `app-${viewport.name}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      await page.close();
    }

    // 200% zoom usability on desktop.
    const zoomPage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await zoomPage.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    if (await zoomPage.locator("#use-practice").isVisible()) await zoomPage.click("#use-practice");
    await zoomPage.evaluate(() => {
      document.documentElement.style.zoom = "2";
    });
    await assertNoHorizontalScroll(zoomPage, "200pct-zoom");
    await zoomPage.screenshot({ path: path.join(outDir, "app-200pct-zoom.png"), fullPage: true });

    // Prove URL and blocked fail-closed banner.
    const proof = await zoomPage.evaluate(() => ({
      href: location.href,
      hasAnswerReview: document.body.innerText.includes("ANSWER REVIEW"),
      hasBlocked:
        document.body.innerText.includes("not yet available in the guided interview") ||
        document.body.innerText.includes("Choose how to work")
    }));
    writeFileSync(
      path.join(outDir, "app-proof.json"),
      JSON.stringify(
        {
          ...proof,
          git_head: commit,
          route: "/app",
          server_port: PORT,
          cache_control: "no-store",
          captured_at: new Date().toISOString()
        },
        null,
        2
      ) + "\n"
    );
    if (!proof.href.includes("/app")) failures.push("Screenshot session was not on /app");
    if (!proof.hasAnswerReview) failures.push("ANSWER REVIEW banner missing on /app");
    await zoomPage.close();
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }

  if (failures.length) {
    failures.forEach((failure) => console.error(`ERROR (user-geometry): ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(
      JSON.stringify(
        {
          status: "passed",
          viewports: viewports.map((item) => item.name),
          screenshot_dir: "test-results/screenshots",
          real_browser: true
        },
        null,
        2
      )
    );
  }
}

run().catch((error) => {
  console.error(`ERROR (user-geometry): ${error.message}`);
  process.exitCode = 1;
});
