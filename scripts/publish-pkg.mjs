#!/usr/bin/bin/env node

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: pnpm publish:pkg <package-dir> [patch|minor|major]");
  console.error("  e.g. pnpm publish:pkg packages/sdk patch");
  console.error("  e.g. pnpm publish:pkg packages/ui minor");
  process.exit(1);
}

const pkgDir = resolve(args[0]);
const bump = args[1] || "patch";

if (!["patch", "minor", "major"].includes(bump)) {
  console.error(`Invalid bump type: "${bump}". Use patch, minor, or major.`);
  process.exit(1);
}

const pkgPath = resolve(pkgDir, "package.json");
let pkg;

try {
  pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
} catch {
  console.error(`No package.json found at ${pkgPath}`);
  process.exit(1);
}

const oldVersion = pkg.version;
const [major, minor, patch] = oldVersion.split(".").map(Number);

let newVersion;
if (bump === "major") newVersion = `${major + 1}.0.0`;
else if (bump === "minor") newVersion = `${major}.${minor + 1}.0`;
else newVersion = `${major}.${minor}.${patch + 1}`;

pkg.version = newVersion;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`${pkg.name}: ${oldVersion} → ${newVersion}`);

// Build the package before publishing
console.log("Building...");
execSync("pnpm build", { stdio: "inherit", cwd: pkgDir });

// Publish
console.log(`Publishing ${pkg.name}@${newVersion}...`);
execSync("npm publish --access public", { stdio: "inherit", cwd: pkgDir });

console.log(`✓ Published ${pkg.name}@${newVersion}`);
