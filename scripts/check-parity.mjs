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
const inputs = vectors.map((vector) => vector.input);
const tsResults = inputs.map((input) => {
  try {
    return USTaxAdvantagedParams.calculate(input);
  } catch (error) {
    if (error instanceof Error && typeof error.code === "string") {
      return { __error: { code: error.code, message: error.message } };
    }
    throw error;
  }
});
const php = spawnSync("php", [join(root, "scripts/php-parity-runner.php")], {
  cwd: root,
  input: JSON.stringify(inputs),
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
if (php.error) throw php.error;
if (php.status !== 0) {
  process.stderr.write(php.stderr);
  process.exit(php.status ?? 1);
}
const phpResults = JSON.parse(php.stdout);
for (let index = 0; index < vectors.length; index += 1) {
  try {
    assert.deepEqual(phpResults[index], tsResults[index]);
  } catch (error) {
    console.error(`Runtime parity failed for: ${vectors[index].name}`);
    throw error;
  }
}
console.log(`TypeScript/PHP full-output parity passed for ${vectors.length} vectors.`);
