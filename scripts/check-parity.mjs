#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import USTaxAdvantagedParams from "../dist/esm/USTaxAdvantagedParams.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vectors = JSON.parse(
  await readFile(join(root, "data/conformance-vectors.json"), "utf8"),
).vectors;
const cases = vectors.map((vector) => ({
  name: vector.name,
  input: vector.operation === "payrollTax" ? { __operation: "payrollTax", input: vector.input } : vector.input,
}));

// Every parameter-table lookup is compared too. The lookups are discovered from
// the class rather than listed here, so a table added later is covered without
// editing this script, and the PHP runner reports its own list so that a lookup
// present in only one runtime fails as well. Each table is read one year either
// side of its supported range, with its range and its source metadata.
const TABLE_LOOKUP = /(?:^p|P)arametersForYear$/;
const tableMethods = Object.getOwnPropertyNames(USTaxAdvantagedParams)
  .filter((name) => TABLE_LOOKUP.test(name) && typeof USTaxAdvantagedParams[name] === "function")
  .sort();
cases.push({ name: "parameter-table lookups exposed", input: { __operation: "tableMethods" } });
for (const method of tableMethods) {
  const prefix = method.slice(0, -"ParametersForYear".length);
  const domain = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  const rangeMethod = `supported${domain}TaxYears`;
  const metadataMethod = prefix === "" ? "sourceMetadata" : `${prefix}SourceMetadata`;
  for (const lookup of [rangeMethod, metadataMethod]) {
    cases.push({ name: `${lookup}()`, input: { __operation: "table", method: lookup, args: [] } });
  }
  const range = USTaxAdvantagedParams[rangeMethod]();
  for (let year = range.minimum - 1; year <= range.maximum + 1; year += 1) {
    cases.push({ name: `${method}(${year})`, input: { __operation: "table", method, args: [year] } });
  }
}

function runTypeScript(input) {
  try {
    if (input.__operation === "tableMethods") return tableMethods;
    if (input.__operation === "table") {
      const lookup = USTaxAdvantagedParams[input.method];
      return typeof lookup === "function"
        ? { value: lookup.apply(USTaxAdvantagedParams, input.args) }
        : { __missing: input.method };
    }
    return input.__operation === "payrollTax" ? USTaxAdvantagedParams.calculatePayrollTax(input.input) : USTaxAdvantagedParams.calculate(input);
  } catch (error) {
    if (error instanceof Error && typeof error.code === "string") {
      return { __error: { code: error.code, message: error.message } };
    }
    throw error;
  }
}

const tsResults = cases.map((entry) => runTypeScript(entry.input));
const php = spawnSync("php", [join(root, "scripts/php-parity-runner.php")], {
  cwd: root,
  input: JSON.stringify(cases.map((entry) => entry.input)),
  encoding: "utf8",
  maxBuffer: 256 * 1024 * 1024,
});
if (php.error) throw php.error;
if (php.status !== 0) {
  process.stderr.write(php.stderr);
  process.exit(php.status ?? 1);
}
const phpResults = JSON.parse(php.stdout);
assert.equal(phpResults.length, cases.length, "The PHP parity runner returned a different number of results.");
for (let index = 0; index < cases.length; index += 1) {
  try {
    assert.deepEqual(phpResults[index], tsResults[index]);
  } catch (error) {
    console.error(`Runtime parity failed for: ${cases[index].name}`);
    throw error;
  }
}
console.log(
  `TypeScript/PHP full-output parity passed for ${vectors.length} vectors and ${cases.length - vectors.length - 1} parameter-table lookups across ${tableMethods.length} tables.`,
);
