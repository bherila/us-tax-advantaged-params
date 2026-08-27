import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import USARetirementAccountParameters from "../src/USARetirementAccountParameters.js";

interface ConformanceVector {
  name: string;
  input: Parameters<typeof USARetirementAccountParameters.calculate>[0];
  expect?: Record<string, unknown>;
  expectDiagnosticCodes?: string[];
  expectError?: { code: string };
}

interface ConformanceFile {
  schemaVersion: number;
  vectors: ConformanceVector[];
}

const conformance = JSON.parse(
  readFileSync(new URL("../../data/conformance-vectors.json", import.meta.url), "utf8"),
) as ConformanceFile;

function readPath(value: unknown, path: string): unknown {
  let cursor: unknown = value;
  for (const segment of path.split(".")) {
    if (cursor === null || typeof cursor !== "object") {
      throw new Error(`Cannot resolve ${path}: ${segment} follows a non-object value.`);
    }
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return cursor;
}

for (const vector of conformance.vectors) {
  test(`conformance: ${vector.name}`, () => {
    if (vector.expectError) {
      assert.throws(
        () => USARetirementAccountParameters.calculate(vector.input),
        (error: unknown) =>
          (error as { code?: string } | null)?.code === vector.expectError!.code,
        `${vector.name}: expected error ${vector.expectError.code}`,
      );
      return;
    }
    const result = USARetirementAccountParameters.calculate(vector.input);
    for (const [path, expected] of Object.entries(vector.expect ?? {})) {
      assert.deepEqual(readPath(result, path), expected, `${vector.name}: ${path}`);
    }
    const codes = new Set(result.diagnostics.map((entry) => entry.code));
    for (const expectedCode of vector.expectDiagnosticCodes ?? []) {
      assert.ok(codes.has(expectedCode), `${vector.name}: missing diagnostic ${expectedCode}`);
    }
  });
}
