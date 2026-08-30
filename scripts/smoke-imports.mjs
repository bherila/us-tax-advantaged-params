#!/usr/bin/env node
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const esm = await import("../dist/esm/USTaxAdvantagedParams.js");
const require = createRequire(import.meta.url);
const cjs = require("../dist/cjs/USTaxAdvantagedParams.js");

for (const runtime of [esm, cjs]) {
  const U = runtime.default;
  assert.equal(typeof U, "function");
  assert.deepEqual(U.supportedTaxYears(), { minimum: 1975, maximum: 2026 });
  assert.equal(U.parametersForYear(2026).annualCompensation401a17, 360000);
  const result = U.calculate({
    taxYear: 1997,
    filingStatus: "S",
    persons: [{ id: "t", role: "taxpayer", birthYear: 1960, compensation: { w2Compensation: 500000 } }],
    accounts: [{
      id: "profit-sharing",
      ownerId: "t",
      type: "profit_sharing_plan",
      employerId: "employer",
      planRules: { planCompensation: 500000, employerNonelectiveRate: 0.15 },
    }],
  });
  assert.equal(result.accounts[0].contributionComponents.employerPreTax, 24000);
}
console.log("ESM and CommonJS smoke imports passed.");
