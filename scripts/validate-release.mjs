#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const startedAt = new Date();
const checks = [];

function run(name, command, args, options = {}) {
  const started = performance.now();
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  const check = {
    name,
    command: [command, ...args].join(" "),
    passed: result.status === 0 && !result.error,
    skipped: false,
    exitCode: result.status,
    durationMs: Math.round(performance.now() - started),
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
  if (result.error) check.stderr += `${result.error.name}: ${result.error.message}\n`;
  if (options.optionalMissing && result.error?.code === "ENOENT") {
    check.passed = true;
    check.skipped = true;
    check.exitCode = null;
    check.stderr = `${command} is not installed in this local environment; the CI workflow performs this check.\n`;
  }
  checks.push(check);
  const label = check.skipped ? "SKIP" : check.passed ? "PASS" : "FAIL";
  console.log(`${label.padEnd(4)} ${name} (${check.durationMs} ms)`);
  return check;
}

function version(command, args = ["--version"]) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  return result.error ? null : `${result.stdout ?? ""}${result.stderr ?? ""}`.trim().split("\n")[0];
}

run("Canonical parameter and vector validation", "node", ["scripts/validate-data.mjs"]);
run("Generated native parameter blocks", "node", ["scripts/generate.mjs", "--check"]);
run("Source manifests and publication files", "node", ["scripts/validate-manifests.mjs"]);
run("Strict TypeScript typecheck", "tsc", ["-p", "tsconfig.json", "--noEmit"]);
run("TypeScript unit and conformance tests", "npm", ["run", "test:ts"]);
run("PHP engine syntax", "php", ["-l", "php/src/USTaxAdvantagedParams.php"]);
run("PHP unit-test syntax", "php", ["-l", "php/tests/USTaxAdvantagedParamsTest.php"]);
run("PHP conformance-test syntax", "php", ["-l", "php/tests/ConformanceVectorsTest.php"]);
run("PHP parity runner syntax", "php", ["-l", "scripts/php-parity-runner.php"]);
run("PHP unit tests", "php", ["php/tests/USTaxAdvantagedParamsTest.php"]);
run("PHP conformance vectors", "php", ["php/tests/ConformanceVectorsTest.php"]);
run("ESM, CommonJS, and declaration build", "npm", ["run", "build"]);
run("ESM/CommonJS smoke imports", "node", ["scripts/smoke-imports.mjs"]);
run("Complete TypeScript/PHP output parity", "node", ["scripts/check-parity.mjs"]);
run("Built-package manifest validation", "node", ["scripts/validate-manifests.mjs", "--built"]);
run("npm package dry run", "npm", ["pack", "--dry-run", "--ignore-scripts", "--json"]);
run("Composer manifest validation", "composer", ["validate", "--strict"], { optionalMissing: true });

const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const parameters = JSON.parse(await readFile(join(root, "data/retirement-parameters.json"), "utf8"));
const vectors = JSON.parse(await readFile(join(root, "data/conformance-vectors.json"), "utf8"));
const failed = checks.filter((check) => !check.passed);
const phpVersion = version("php", ["-r", "echo PHP_VERSION;"]);
const nodeVersion = version("node", ["--version"]);
const npmVersion = version("npm", ["--version"]);
const tscVersion = version("tsc", ["--version"]);
const composerVersion = version("composer", ["--version"]);
const phpTargetValidatedLocally = phpVersion !== null && /^8\.(?:[2-9]|\d{2,})\./.test(phpVersion);
const finishedAt = new Date();

const status = {
  package: packageJson.name,
  version: packageJson.version,
  startedAt: startedAt.toISOString(),
  finishedAt: finishedAt.toISOString(),
  passed: failed.length === 0,
  phpTargetValidatedLocally,
  supportedTaxYears: parameters.supportedTaxYears,
  generatedThroughTaxYear: parameters.generatedThroughTaxYear,
  conformanceVectorCount: vectors.vectors.length,
  runtimes: {
    node: nodeVersion,
    npm: npmVersion,
    typescript: tscVersion,
    php: phpVersion,
    composer: composerVersion,
  },
  checks,
};
await writeFile(join(root, "validation-status.json"), `${JSON.stringify(status, null, 2)}\n`);

function fenced(text) {
  const value = text.trimEnd();
  return value === "" ? "_(no output)_" : `\`\`\`text\n${value.replaceAll("```", "` ` `")}\n\`\`\``;
}

const validationLines = [
  "# Validation Report",
  "",
  `- **Package:** \`${packageJson.name}@${packageJson.version}\``,
  `- **Run:** ${startedAt.toISOString()} through ${finishedAt.toISOString()}`,
  `- **Overall:** ${failed.length === 0 ? "PASS" : "FAIL"}`,
  `- **Tax years:** ${parameters.supportedTaxYears.minimum}-${parameters.supportedTaxYears.maximum}`,
  `- **Shared vectors:** ${vectors.vectors.length}`,
  `- **Node:** ${nodeVersion ?? "unavailable"}`,
  `- **npm:** ${npmVersion ?? "unavailable"}`,
  `- **TypeScript:** ${tscVersion ?? "unavailable"}`,
  `- **PHP:** ${phpVersion ?? "unavailable"}`,
  `- **Composer:** ${composerVersion ?? "not installed locally"}`,
  "",
  "## Check summary",
  "",
  "| Check | Result | Exit | Duration |",
  "|---|---:|---:|---:|",
  ...checks.map((check) =>
    `| ${check.name.replaceAll("|", "\\|")} | ${check.skipped ? "SKIPPED" : check.passed ? "PASS" : "FAIL"} | ${check.exitCode ?? "—"} | ${check.durationMs} ms |`,
  ),
  "",
  "## Runtime qualification note",
  "",
  phpTargetValidatedLocally
    ? "The local PHP run satisfied the Composer PHP requirement."
    : `The local container provides PHP ${phpVersion ?? "unknown"}, below the declared PHP 8.2 floor. The GitHub Actions workflow tests PHP 8.2 through 8.5. Do not publish without a green PHP CI matrix.`,
  "",
  "## Detailed output",
  "",
];
for (const check of checks) {
  validationLines.push(`### ${check.name}`, "", `Command: \`${check.command}\``, "", "**stdout**", "", fenced(check.stdout), "", "**stderr**", "", fenced(check.stderr), "");
}
await writeFile(join(root, "VALIDATION.md"), `${validationLines.join("\n")}\n`);

const releaseLines = [
  "# Release Status",
  "",
  `## ${packageJson.name}@${packageJson.version}`,
  "",
  `**Local validation:** ${failed.length === 0 ? "PASS" : "FAIL"}`,
  "",
  `The engines encode ${parameters.supportedTaxYears.minimum}-${parameters.supportedTaxYears.maximum}, include ${vectors.vectors.length} shared conformance vectors, and produce ESM, CommonJS, declaration, and native PHP artifacts.`,
  "",
  "### Completed",
  "",
  "- §401(a)(17) recognized-compensation correction in TypeScript and PHP.",
  "- Common-law SEP, employer nonelective, matching-formula, and self-employed worksheet regression coverage.",
  "- Canonical data validation and regenerated native parameter blocks.",
  "- npm and Composer manifests, lockfile, MIT license, documentation, security/contribution policies, and CI.",
  "- Native unit tests, shared conformance tests, complete serialized-output parity, and dual-module smoke imports.",
  "- npm package-content dry run.",
  "",
  "### Publication gate",
  "",
  failed.length === 0
    ? "All checks available in this local environment passed."
    : `${failed.length} local validation check(s) failed; the package is not ready for publication.`,
  phpTargetValidatedLocally
    ? "The PHP target was validated locally on a supported PHP version."
    : `The local runtime is PHP ${phpVersion ?? "unknown"}; the PHP 8.2-8.5 CI matrix remains a publication gate.`,
  composerVersion
    ? "Composer manifest validation ran locally."
    : "Composer was not installed locally; `composer validate --strict` and `composer test` are configured in CI.",
  "",
  "See `VALIDATION.md` and `validation-status.json` for exact commands and output.",
];
await writeFile(join(root, "RELEASE_STATUS.md"), `${releaseLines.join("\n")}\n`);

if (failed.length > 0) process.exit(1);
