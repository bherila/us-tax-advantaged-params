import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import USTaxAdvantagedParams from "../src/USTaxAdvantagedParams.js";

interface ConformanceVector {
  name: string;
  operation?: "payrollTax" | "tableLookup";
  input: Record<string, unknown>;
  expect?: Record<string, unknown>;
  expectDiagnosticCodes?: string[];
  expectAbsentDiagnosticCodes?: string[];
  expectError?: { code: string };
}

const TABLE_LOOKUP = /(?:^p|P)arametersForYear$/;

function invoke(vector: ConformanceVector): unknown {
  if (vector.operation === "payrollTax") {
    return USTaxAdvantagedParams.calculatePayrollTax(vector.input as unknown as Parameters<typeof USTaxAdvantagedParams.calculatePayrollTax>[0]);
  }
  if (vector.operation === "tableLookup") {
    const method = vector.input.method;
    if (typeof method !== "string" || !TABLE_LOOKUP.test(method)) {
      throw new Error(`${vector.name}: tableLookup.method must name a parameter-table lookup.`);
    }
    const lookup = (USTaxAdvantagedParams as unknown as Record<string, unknown>)[method];
    if (typeof lookup !== "function") throw new Error(`${vector.name}: unknown lookup ${method}.`);
    return lookup.call(USTaxAdvantagedParams, vector.input.taxYear);
  }
  return USTaxAdvantagedParams.calculate(vector.input as unknown as Parameters<typeof USTaxAdvantagedParams.calculate>[0]);
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
  const calculate = () => invoke(vector);
  test(`conformance: ${vector.name}`, () => {
    if (vector.expectError) {
      assert.throws(
        calculate,
        (error: unknown) =>
          (error as { code?: string } | null)?.code === vector.expectError!.code,
        `${vector.name}: expected error ${vector.expectError.code}`,
      );
      return;
    }
    const result = calculate();
    for (const [path, expected] of Object.entries(vector.expect ?? {})) {
      assert.deepEqual(readPath(result, path), expected, `${vector.name}: ${path}`);
    }
    const codes = new Set(vector.operation === "tableLookup"
      ? []
      : (result as { diagnostics: Array<{ code: string }> }).diagnostics.map((entry) => entry.code));
    for (const expectedCode of vector.expectDiagnosticCodes ?? []) {
      assert.ok(codes.has(expectedCode), `${vector.name}: missing diagnostic ${expectedCode}`);
    }
    for (const absentCode of vector.expectAbsentDiagnosticCodes ?? []) {
      assert.ok(!codes.has(absentCode), `${vector.name}: unexpected diagnostic ${absentCode}`);
    }
  });
}
