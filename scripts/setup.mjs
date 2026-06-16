/**
 * First-run setup for the Builder.io App Router template.
 *
 * Run from the repo root after cloning:
 *
 *   pnpm setup
 *
 * It will:
 *   1. Prompt for your Builder.io public + private API keys and write them into
 *      the main app's .env.local (preserving any other settings).
 *   2. Optionally rename the placeholder `app-0` app to something of your own,
 *      updating every reference across the monorepo and moving the directory.
 *   3. Seed the Builder space (runs `init:builder`) so the `site-context` and
 *      `article` models exist and the app builds.
 *
 * This runs from the repo root (not from inside the app), so it can safely
 * rename the app directory as the final step. After a rename you must re-run
 * `pnpm install` to regenerate the lockfile for the new path.
 */

import readline from "node:readline";
import { spawnSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  renameSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APPS_DIR = join(ROOT, "apps");

// A SINGLE long-lived readline interface for the whole script. Creating a new
// interface per prompt breaks under piped/non-interactive stdin: once the first
// reader hits EOF, later interfaces emit neither `line` nor `close`, their
// promise hangs, and node exits silently when the event loop drains. With one
// shared reader we queue every line and hand them out one prompt at a time, and
// resolve "" after EOF so the script can never hang.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const lineQueue = [];
let pendingResolver = null;
let stdinEnded = false;

// When `muted`, suppress echoed keystrokes (for the private key) while still
// letting the prompt itself and the trailing newline through, so the terminal
// doesn't garble. Echo is only emitted on a real TTY (terminal mode); under a
// pipe there's nothing to mute.
let muted = false;
const originalWriteToOutput = rl._writeToOutput.bind(rl);
rl._writeToOutput = (str) => {
  if (muted && str !== "\n" && str !== "\r\n") return;
  originalWriteToOutput(str);
};

rl.on("line", (line) => {
  if (pendingResolver) {
    const resolve = pendingResolver;
    pendingResolver = null;
    resolve(line);
  } else {
    lineQueue.push(line);
  }
});
rl.on("close", () => {
  stdinEnded = true;
  if (pendingResolver) {
    const resolve = pendingResolver;
    pendingResolver = null;
    resolve("");
  }
});

function nextLine() {
  if (lineQueue.length) return Promise.resolve(lineQueue.shift());
  if (stdinEnded) return Promise.resolve("");
  return new Promise((resolve) => {
    pendingResolver = resolve;
  });
}

async function ask(query, { mask = false } = {}) {
  process.stdout.write(query);
  muted = mask;
  const line = await nextLine();
  if (muted) {
    muted = false;
    process.stdout.write("\n"); // we suppressed the user's Enter echo
  }
  return line.trim();
}

async function askWithDefault(label, current, { mask = false } = {}) {
  const shown = current ? (mask ? "•".repeat(8) : current) : "";
  const suffix = current ? ` (enter to keep ${shown})` : "";
  const answer = await ask(`${label}${suffix}: `, { mask });
  return answer || current || "";
}

async function askYesNo(query, defaultNo = true) {
  const answer = (await ask(`${query} ${defaultNo ? "(y/N)" : "(Y/n)"}: `))
    .toLowerCase();
  if (!answer) return !defaultNo;
  return answer === "y" || answer === "yes";
}

// --- Locate the main Next.js app (the non-storybook workspace) ---
function findMainApp() {
  for (const entry of readdirSync(APPS_DIR)) {
    const pkgPath = join(APPS_DIR, entry, "package.json");
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (pkg.name !== "storybook-app" && deps["@builder.io/sdk-react"]) {
      return { dir: entry, name: pkg.name, path: join(APPS_DIR, entry) };
    }
  }
  throw new Error("Could not find the main Next.js app under apps/.");
}

// --- .env.local writing: preserve existing lines, upsert the two keys ---
function upsertEnv(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) return content.replace(re, line);
  return `${content.replace(/\n*$/, "")}\n${line}\n`;
}

function readEnvValue(content, key) {
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

// --- Replace every occurrence of the app name token across a file ---
function replaceInFile(filePath, from, to) {
  if (!existsSync(filePath)) return;
  const original = readFileSync(filePath, "utf8");
  const updated = original.split(from).join(to);
  if (updated !== original) writeFileSync(filePath, updated);
}

function isValidAppName(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

// --- Write .claude/project-config.md from collected integration values ---
function writeProjectConfig({ jira, vercelProject }) {
  const path = join(ROOT, ".claude", "project-config.md");
  const content = `# Project Config (read by .claude/commands/*)

This file holds the per-project values the Claude Code commands need. It is
populated by \`pnpm setup\`. You can also edit it by hand.

## Jira
- Configured: ${jira ? "yes" : "no"}
- Project key: ${jira ? jira.projectKey : ""}
- Cloud ID: ${jira ? jira.cloudId : ""}
- Base URL: ${jira ? jira.baseUrl : ""}

## Vercel
- Project name: ${vercelProject || ""}
`;
  writeFileSync(path, content);
  return path;
}

// --- Read an existing project-config.md value for prompt defaults ---
function readConfigValue(label) {
  const path = join(ROOT, ".claude", "project-config.md");
  if (!existsSync(path)) return "";
  const content = readFileSync(path, "utf8");
  const match = content.match(new RegExp(`^- ${label}:\\s*(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

async function main() {
  console.log("\nBuilder.io App Router template — setup\n");

  const app = findMainApp();
  console.log(`Main app: apps/${app.dir} (package "${app.name}")\n`);

  // --- 1. Credentials ---
  const envPath = join(app.path, ".env.local");
  let envContent = existsSync(envPath)
    ? readFileSync(envPath, "utf8")
    : readFileSync(join(ROOT, "env.example"), "utf8");

  const currentPublic = readEnvValue(envContent, "NEXT_PUBLIC_BUILDER_API_KEY");
  const currentPrivate = readEnvValue(envContent, "BUILDER_PRIVATE_KEY");

  console.log("Enter your Builder.io API keys (https://builder.io → Account → API Keys):\n");
  const publicKey = await askWithDefault(
    "Public API key",
    // The env.example ships a placeholder; don't treat it as a real default.
    currentPublic === "aa26d0ed43ef421da301a1603f38faeb" ? "" : currentPublic
  );
  const privateKey = await askWithDefault("Private API key (bpk-...)", currentPrivate, {
    mask: true,
  });

  if (!publicKey || !privateKey) {
    console.error("\n✗ Both a public and private key are required. Aborting.");
    process.exit(1);
  }

  envContent = upsertEnv(envContent, "NEXT_PUBLIC_BUILDER_API_KEY", publicKey);
  envContent = upsertEnv(envContent, "BUILDER_PRIVATE_KEY", privateKey);
  writeFileSync(envPath, envContent);
  console.log(`\n✓ Wrote keys to apps/${app.dir}/.env.local`);

  // --- 1b. Claude Code command integrations (Jira + Vercel) ---
  console.log("\nClaude Code command config (.claude/project-config.md):");
  let jira = null;
  if (await askYesNo("\nConfigure Jira integration for the Claude Code commands?")) {
    const projectKey = (await askWithDefault("  Jira project key (e.g. ACME)", readConfigValue("Project key"))).toUpperCase();
    const cloudId = await askWithDefault("  Atlassian cloud ID", readConfigValue("Cloud ID"));
    const defaultBase = readConfigValue("Base URL") ||
      (projectKey ? `https://${projectKey.toLowerCase()}.atlassian.net/browse/` : "");
    const baseUrl = await askWithDefault("  Jira base URL", defaultBase);
    jira = { projectKey, cloudId, baseUrl };
  }
  const vercelProject = await askWithDefault(
    "Vercel project name (for preview-deployment detection)",
    readConfigValue("Project name") || app.dir
  );
  const cfgPath = writeProjectConfig({ jira, vercelProject });
  console.log(`✓ Wrote ${cfgPath.replace(ROOT + "/", "")}`);

  // --- 2. Optional rename ---
  let newName = null;
  if (await askYesNo(`\nRename the "${app.dir}" app to something else?`)) {
    while (true) {
      const candidate = (await ask("New app name (lowercase, e.g. acme-web): "))
        .toLowerCase();
      if (!isValidAppName(candidate)) {
        console.log("  Name must be lowercase letters, numbers, and dashes (start with a letter).");
        continue;
      }
      if (candidate === app.dir) {
        console.log("  That's the current name — pick a different one.");
        continue;
      }
      if (existsSync(join(APPS_DIR, candidate))) {
        console.log(`  apps/${candidate} already exists — pick a different name.`);
        continue;
      }
      newName = candidate;
      break;
    }
  }

  // --- 3. Seed Builder models/content (before any rename, using the current name) ---
  console.log(`\nSeeding Builder models (pnpm --filter ${app.name} init:builder)...\n`);
  const seed = spawnSync("pnpm", ["--filter", app.name, "init:builder"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (seed.status !== 0) {
    console.error("\n✗ Seeding failed. Fix the error above and re-run `pnpm setup`.");
    process.exit(1);
  }

  // --- 4. Perform the rename last (filesystem move + every reference) ---
  if (newName) {
    console.log(`\nRenaming "${app.dir}" → "${newName}"...`);
    const filesToUpdate = [
      join(ROOT, "package.json"),
      join(ROOT, "README.md"),
      join(ROOT, "CLAUDE.md"),
      join(ROOT, "env.example"),
      join(APPS_DIR, "storybook", ".storybook", "preview.ts"),
      join(APPS_DIR, "storybook", "postcss.config.mjs"),
      join(app.path, "package.json"),
      join(app.path, "scripts", "seed-builder.mjs"),
      join(ROOT, ".claude", "project-config.md"),
    ];
    for (const file of filesToUpdate) replaceInFile(file, app.dir, newName);
    renameSync(app.path, join(APPS_DIR, newName));
    console.log(`✓ Renamed app to "${newName}".`);
    console.log(
      "\n⚠ Run `pnpm install` to regenerate the lockfile for the new path before `pnpm dev`."
    );
  }

  console.log("\n✓ Setup complete.\n");
  rl.close();
}

main().catch((err) => {
  console.error("\n✗ Setup failed:", err.message || err);
  process.exit(1);
});
