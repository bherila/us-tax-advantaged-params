#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const built = process.argv.includes("--built");
const errors = [];

function fail(message) {
  errors.push(message);
}

async function exists(relativePath) {
  try {
    await access(join(root, relativePath), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function parseJson(relativePath) {
  try {
    return JSON.parse(await readFile(join(root, relativePath), "utf8"));
  } catch (error) {
    fail(`${relativePath} could not be parsed: ${error.message}`);
    return {};
  }
}

const packageJson = await parseJson("package.json");
const lock = await parseJson("package-lock.json");
const composer = await parseJson("composer.json");

if (packageJson.name !== "us-tax-advantaged-params") fail("package.json name is incorrect");
if (typeof packageJson.version !== "string" || !/^\d+\.\d+\.\d+(?:[-+].+)?$/.test(packageJson.version)) {
  fail("package.json version must be semantic");
}
if (packageJson.type !== "module") fail("package.json must use type=module for ESM source tooling");
if (packageJson.license !== "MIT") fail("package.json license must be MIT");
if (packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0) {
  fail("runtime npm dependencies are not expected");
}
if (packageJson.engines?.node !== ">=22") fail("package.json engines.node must be >=22");
if (packageJson.sideEffects !== false) fail("package.json sideEffects must be false");
if (packageJson.main !== "./dist/cjs/USTaxAdvantagedParams.js") fail("CommonJS main target is incorrect");
if (packageJson.module !== "./dist/esm/USTaxAdvantagedParams.js") fail("ESM module target is incorrect");
if (packageJson.types !== "./dist/types/USTaxAdvantagedParams.d.ts") fail("Top-level types target is incorrect");
if (packageJson.exports?.["."]?.import?.default !== "./dist/esm/USTaxAdvantagedParams.js") {
  fail("ESM export target is incorrect");
}
if (packageJson.exports?.["."]?.require?.default !== "./dist/cjs/USTaxAdvantagedParams.js") {
  fail("CommonJS export target is incorrect");
}
if (packageJson.exports?.["."]?.import?.types !== "./dist/types/USTaxAdvantagedParams.d.ts") {
  fail("ESM type declaration export target is incorrect");
}
if (packageJson.exports?.["."]?.require?.types !== "./dist/types/USTaxAdvantagedParams.d.cts") {
  fail("CommonJS type declaration export target is incorrect");
}
if (packageJson.exports?.["./data/retirement-parameters.json"] !== "./data/retirement-parameters.json") {
  fail("data file export target is incorrect");
}
for (const dataFile of ["hsa-parameters.json", "fsa-parameters.json"]) {
  if (packageJson.exports?.[`./data/${dataFile}`] !== `./data/${dataFile}`) {
    fail(`data/${dataFile} export target is incorrect`);
  }
  if (!packageJson.files?.includes(`data/${dataFile}`)) {
    fail(`data/${dataFile} is missing from the package files allowlist`);
  }
}
for (const script of [
  "build",
  "test:ts",
  "test:php",
  "test:parity",
  "verify",
  "validate:release",
  "release:archives",
]) {
  if (typeof packageJson.scripts?.[script] !== "string") fail(`package.json is missing script ${script}`);
}
for (const dependency of ["@types/node", "typescript"]) {
  if (typeof packageJson.devDependencies?.[dependency] !== "string") {
    fail(`package.json devDependencies is missing ${dependency}`);
  }
}

if (lock.name !== packageJson.name || lock.version !== packageJson.version) {
  fail("package-lock root identity must match package.json");
}
if (lock.lockfileVersion !== 3) fail("package-lock.json must use lockfileVersion 3");
if (lock.packages?.[""]?.version !== packageJson.version) {
  fail("package-lock root package version must match package.json");
}
for (const dependency of ["@types/node", "typescript", "undici-types"]) {
  if (!lock.packages?.[`node_modules/${dependency}`]) fail(`package-lock is missing ${dependency}`);
}

if (composer.name !== "bherila/us-tax-advantaged-params") fail("composer.json package name is incorrect");
if (composer.type !== "library") fail("composer.json type must be library");
if (composer.license !== "MIT") fail("composer.json license must be MIT");
if (composer.require?.php !== ">=8.5") fail("composer.json must require PHP >=8.5");
if (!composer.autoload?.classmap?.includes("php/src/USTaxAdvantagedParams.php")) {
  fail("composer.json must classmap-autoload the native PHP implementation");
}
if (!composer.scripts?.test) fail("composer.json must expose a test script");

const requiredSourceFiles = [
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  ".github/workflows/ci.yml",
  "LICENSE",
  "README.md",
  "DESIGN.md",
  "SOURCES.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "package.json",
  "package-lock.json",
  "composer.json",
  "tsconfig.json",
  "tsconfig.esm.json",
  "tsconfig.cjs.json",
  "tsconfig.types.json",
  "tsconfig.tests.json",
  "src/USTaxAdvantagedParams.ts",
  "tests/USTaxAdvantagedParams.test.ts",
  "tests/conformance.test.ts",
  "php/src/USTaxAdvantagedParams.php",
  "php/tests/USTaxAdvantagedParamsTest.php",
  "php/tests/ConformanceVectorsTest.php",
  "data/retirement-parameters.json",
  "data/hsa-parameters.json",
  "data/fsa-parameters.json",
  "data/conformance-vectors.json",
  "scripts/generate.mjs",
  "scripts/validate-data.mjs",
  "scripts/verify-evidence.mjs",
  "evidence/retirement-limits/verifier-config.mjs",
  "evidence/hsa-limits/verifier-config.mjs",
  "evidence/fsa-limits/verifier-config.mjs",
  "evidence/fsa-limits/primary-values.json",
  "evidence/fsa-limits/SHA256SUMS.txt",
  "scripts/check-parity.mjs",
  "scripts/php-parity-runner.php",
  "scripts/smoke-imports.mjs",
  "scripts/smoke-packed-package.mjs",
  "scripts/validate-release.mjs",
  "scripts/create-release-archives.mjs"
];
for (const path of requiredSourceFiles) if (!(await exists(path))) fail(`${path} is missing`);

for (const obsoletePath of [
  "rules/retirement-parameters.json",
  "src/USTaxAdvantagedParams.php",
  "tests/USTaxAdvantagedParamsTest.php",
  "src/USTaxAdvantagedParams.ts.tmp",
  // Pre-rename filenames (the package was usa-retirement-account-parameters
  // through 0.1.0); a leftover copy would silently shadow the renamed engine.
  "src/USARetirementAccountParameters.ts",
  "tests/USARetirementAccountParameters.test.ts",
  "php/src/USARetirementAccountParameters.php",
  "php/tests/USARetirementAccountParametersTest.php",
  // Superseded per-corpus evidence verifiers, collapsed into
  // scripts/verify-evidence.mjs; a leftover copy would drift from the shared
  // comparison engine while still looking authoritative.
  "scripts/verify-primary-sources.mjs",
  "scripts/verify-hsa-sources.mjs",
]) {
  if (await exists(obsoletePath)) fail(`obsolete duplicate remains: ${obsoletePath}`);
}

if (built) {
  for (const path of [
    "dist/esm/USTaxAdvantagedParams.js",
    "dist/esm/USTaxAdvantagedParams.js.map",
    "dist/cjs/USTaxAdvantagedParams.js",
    "dist/cjs/USTaxAdvantagedParams.js.map",
    "dist/cjs/package.json",
    "dist/types/USTaxAdvantagedParams.d.ts",
    "dist/types/USTaxAdvantagedParams.d.cts",
  ]) {
    if (!(await exists(path))) fail(`built artifact is missing: ${path}`);
  }
}

const phpSource = await readFile(join(root, "php/src/USTaxAdvantagedParams.php"), "utf8");
if (!phpSource.includes("namespace USTaxAdvantagedParams;")) {
  fail("PHP namespace does not match the documented Composer namespace");
}
const tsSource = await readFile(join(root, "src/USTaxAdvantagedParams.ts"), "utf8");
if (!tsSource.includes("export class USTaxAdvantagedParams")) {
  fail("TypeScript public class export is missing");
}
if (!tsSource.includes("recognizedCompensationForEmployerAllocation")) {
  fail("TypeScript §401(a)(17) employer-allocation helper is missing");
}
if (!phpSource.includes("recognizedCompensationForEmployerAllocation")) {
  fail("PHP §401(a)(17) employer-allocation helper is missing");
}
const tsEngineVersion = tsSource.match(/export const ENGINE_VERSION = "([^"]+)"/)?.[1];
const phpEngineVersion = phpSource.match(/const ENGINE_VERSION = '([^']+)';/)?.[1];
if (tsEngineVersion !== packageJson.version) {
  fail(`TypeScript ENGINE_VERSION (${tsEngineVersion}) must match package.json version (${packageJson.version})`);
}
if (phpEngineVersion !== packageJson.version) {
  fail(`PHP ENGINE_VERSION (${phpEngineVersion}) must match package.json version (${packageJson.version})`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log(`Manifest validation passed${built ? " with built artifacts" : ""}.`);
