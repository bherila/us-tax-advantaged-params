#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const parent = dirname(root);
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const baseName = `${packageJson.name}-${packageJson.version}`;
const tarballPath = join(parent, `${baseName}.tgz`);
const zipPath = join(parent, `${baseName}.zip`);
const tarballChecksumPath = `${tarballPath}.sha256`;
const zipChecksumPath = `${zipPath}.sha256`;

function run(command, args, cwd = root, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: capture ? "pipe" : "inherit",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (capture) {
      process.stderr.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
    }
    throw new Error(`${command} ${args.join(" ")} exited with status ${result.status}`);
  }
  return result.stdout ?? "";
}

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

await Promise.all([
  rm(tarballPath, { force: true }),
  rm(zipPath, { force: true }),
  rm(tarballChecksumPath, { force: true }),
  rm(zipChecksumPath, { force: true }),
]);

run("node", ["scripts/validate-release.mjs"]);

const packOutput = run(
  "npm",
  ["pack", "--ignore-scripts", "--pack-destination", parent, "--json"],
  root,
  true,
);
const packed = JSON.parse(packOutput);
if (!Array.isArray(packed) || packed.length !== 1 || packed[0].filename !== `${baseName}.tgz`) {
  throw new Error(`Unexpected npm pack output: ${packOutput}`);
}
run("node", ["scripts/smoke-packed-package.mjs", tarballPath]);

run(
  "zip",
  [
    "-q",
    "-r",
    zipPath,
    packageJson.name,
    "-x",
    `${packageJson.name}/node_modules/*`,
    `${packageJson.name}/dist-tests/*`,
    `${packageJson.name}/vendor/*`,
    `${packageJson.name}/.git/*`,
  ],
  parent,
);

const tarballHash = await sha256(tarballPath);
const zipHash = await sha256(zipPath);
await writeFile(tarballChecksumPath, `${tarballHash}  ${baseName}.tgz\n`);
await writeFile(zipChecksumPath, `${zipHash}  ${baseName}.zip\n`);

console.log(`Created ${tarballPath}`);
console.log(`Created ${zipPath}`);
console.log(`SHA-256 ${baseName}.tgz: ${tarballHash}`);
console.log(`SHA-256 ${baseName}.zip: ${zipHash}`);
