#!/usr/bin/env node
/**
 * Bind data/hsa-parameters.json to the IRS primary sources recorded under
 * evidence/hsa-limits/.
 *
 * The HSA figures come from an annual Revenue Procedure, not from the
 * retirement COLA notice, so they carry their own corpus and their own check.
 * evidence/hsa-limits/primary-values.json is the transcription, taken verbatim
 * from the Rev. Proc. text. Update it from a Rev. Proc., never from a summary
 * table, then update the data to match.
 *
 * Usage: node scripts/verify-hsa-sources.mjs [--json]
 * Exits 0 when every comparable figure matches, 1 otherwise.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const parameters = readJson("data/hsa-parameters.json");
const primary = readJson("evidence/hsa-limits/primary-values.json");

/** Scalar figures: primary-values field -> path within the data year block. */
const SCALARS = [
  ["annualContributionLimitSelfOnly_223b2A", ["annualContributionLimit", "selfOnly"], "IRC 223(b)(2)(A)"],
  ["annualContributionLimitFamily_223b2B", ["annualContributionLimit", "family"], "IRC 223(b)(2)(B)"],
  ["additionalContributionAmountAge55", ["additionalContributionAmountAge55"], "IRC 223(b)(3)(B)"],
];

/**
 * Figures recorded per coverage tier. Both tiers are compared: the family
 * amount is not a fixed multiple of the self-only amount in every year, so
 * deriving one from the other would verify an assumption rather than the
 * Rev. Proc.
 */
const TIERED = [
  ["hdhpMinimumAnnualDeductible_223c2Ai", ["hdhp", "minimumAnnualDeductible"], "IRC 223(c)(2)(A)(i)"],
  ["hdhpMaximumAnnualOutOfPocket_223c2Aii", ["hdhp", "maximumAnnualOutOfPocket"], "IRC 223(c)(2)(A)(ii)"],
];

/** The age-55 amount is keyed differently in the two files. */
const ALIASES = new Map([["additionalContributionAmount55_223b3B", "additionalContributionAmountAge55"]]);

/** Non-figure keys in a year block. */
const METADATA = /^(source|_.*|.*_note|.*_source)$/;

const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);

const results = [];
const record = (year, label, expected, actual, citation) =>
  results.push({ year, label, expected, actual, citation, ok: expected === actual });

for (const [yearKey, block] of Object.entries(primary.planYears)) {
  const year = parameters.years[yearKey];
  if (!year) {
    results.push({ year: yearKey, label: "(year block)", expected: "present", actual: "missing", citation: "-", ok: false });
    continue;
  }

  const normalised = {};
  for (const [k, v] of Object.entries(block)) normalised[ALIASES.get(k) ?? k] = v;

  for (const [field, path, citation] of SCALARS) {
    if (!(field in normalised)) continue;
    record(yearKey, field, normalised[field], at(year, path) ?? null, citation);
  }

  for (const [field, path, citation] of TIERED) {
    const tiers = normalised[field];
    if (!tiers) continue;
    for (const tier of ["selfOnly", "family"]) {
      if (!(tier in tiers)) continue;
      record(yearKey, `${field}.${tier}`, tiers[tier], at(year, [...path, tier]) ?? null, citation);
    }
  }
}

// Any recorded figure neither compared nor metadata is a silent gap.
const compared = new Set(results.map((r) => r.label.split(".")[0]));
const uncovered = [];
for (const block of Object.values(primary.planYears)) {
  for (const rawKey of Object.keys(block)) {
    const key = ALIASES.get(rawKey) ?? rawKey;
    if (METADATA.test(rawKey) || compared.has(key)) continue;
    if (!uncovered.includes(key)) uncovered.push(key);
  }
}

const failures = results.filter((r) => !r.ok);
const years = Object.keys(primary.planYears);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ comparisons: results.length, failures, uncovered }, null, 2));
} else {
  for (const f of failures) {
    console.error(`MISMATCH ${f.year} ${f.label}: evidence ${f.expected}, data ${f.actual}  [${f.citation}]`);
  }
  for (const key of uncovered) {
    console.error(`UNCOVERED ${key} is recorded in the evidence but compared against nothing`);
  }
  const range = `${years[0]}-${years[years.length - 1]}`;
  console.log(
    failures.length === 0 && uncovered.length === 0
      ? `HSA primary-source verification passed: ${results.length} comparisons over ${range}, 0 mismatches.`
      : `HSA primary-source verification FAILED: ${failures.length} mismatch(es), ${uncovered.length} uncovered field(s), of ${results.length} comparisons.`,
  );
}

process.exit(failures.length === 0 && uncovered.length === 0 ? 0 : 1);
