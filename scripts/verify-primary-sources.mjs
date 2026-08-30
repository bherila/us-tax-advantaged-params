#!/usr/bin/env node
/**
 * Bind data/retirement-parameters.json to the IRS and SSA primary sources
 * recorded under evidence/retirement-limits/.
 *
 * The conformance vectors prove the TypeScript and PHP engines agree with each
 * other. They cannot prove the encoded dollar amounts are the ones Congress and
 * the IRS actually published — two engines reading the same mistyped table agree
 * perfectly. This closes that gap by comparing the shipped parameters against
 * figures transcribed from the notices themselves.
 *
 * evidence/retirement-limits/primary-values.json is the transcription, taken
 * verbatim from the notice text. Update it from a notice, never from a summary
 * table, then update the data to match.
 *
 * Usage: node scripts/verify-primary-sources.mjs [--json]
 * Exits 0 when every comparable figure matches, 1 otherwise.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const parameters = readJson("data/retirement-parameters.json");
const primary = readJson("evidence/retirement-limits/primary-values.json");

/**
 * Scalar figures, keyed by the primary-values field name. `path` is resolved
 * against the year block in data/retirement-parameters.json.
 *
 * Fields the package does not model are listed in UNMODELLED below rather than
 * omitted silently, so that a parameter gaining coverage is a visible change
 * here instead of passing unnoticed.
 */
const SCALARS = [
  ["annualAdditions_415c1A", ["annualAdditions415c"], "IRC 415(c)(1)(A)"],
  ["electiveDeferral_402g1", ["electiveDeferral402g"], "IRC 402(g)(1)"],
  ["section457b_457e15", ["section457b", "baseDeferralLimit"], "IRC 457(e)(15)"],
  ["catchUp50_414v2Bi", ["generalAge50CatchUp"], "IRC 414(v)(2)(B)(i)"],
  ["catchUp60To63_414v2Ei", ["age60To63CatchUp"], "IRC 414(v)(2)(E)(i)"],
  ["rothCatchUpWageThreshold_414v7A", ["rothCatchUpPriorYearFicaWageThreshold"], "IRC 414(v)(7)(A)"],
  ["compensationLimit_401a17", ["annualCompensation401a17"], "IRC 401(a)(17)"],
  ["iraContribution_219b5A", ["ira", "baseContributionLimit"], "IRC 219(b)(5)(A)"],
  ["iraCatchUp50_219b5Bii", ["ira", "age50CatchUp"], "IRC 219(b)(5)(B)(ii)"],
];

/**
 * Phase-out bands. The primary file records {start, end}; the data file records
 * [start, end]. Both ends are compared: a band's width is a convention, not a
 * published figure, so inferring the end from the start would verify an
 * assumption rather than the notice.
 */
const BANDS = [
  ["traditionalCoveredPhaseout", "traditionalIraCovered", {
    singleOrHeadOfHousehold: "singleOrHeadOfHousehold",
    marriedFilingJointly: "marriedFilingJointlyOrQualifyingSurvivingSpouse",
    marriedFilingSeparately: "marriedFilingSeparatelyLivingTogether",
  }, "IRC 219(g)(3)"],
  ["traditionalSpouseCoveredPhaseout_219g7A", "traditionalIraSpouseCovered", {
    marriedFilingJointly: "marriedFilingJointly",
  }, "IRC 219(g)(7)(A)"],
  ["rothPhaseout_408Ac3", "rothIra", {
    singleOrHeadOfHousehold: "singleOrHeadOfHousehold",
    marriedFilingJointly: "marriedFilingJointlyOrQualifyingSurvivingSpouse",
    marriedFilingSeparately: "marriedFilingSeparatelyLivingTogether",
  }, "IRC 408A(c)(3)"],
];

/** Recorded in the evidence but outside what this package encodes. */
const UNMODELLED = new Set([
  "dbAnnualBenefit_415b1A", // defined-benefit annual benefit; no DB plan modelling
  "socialSecurityWageBase", // OASDI wage base; not a contribution parameter
]);

/**
 * Places where the evidence and the data deliberately differ, each with the
 * value the data is required to carry instead. These are asserted, not skipped:
 * if the data stops matching the reconciled value, that is still a failure.
 *
 * The evidence records the wage-threshold figure the IRS *published* for a
 * catch-up year. The data records the *operative* threshold, and the engine
 * reads null as "the mandatory-Roth catch-up rule does not apply this year"
 * (see catchUpTaxTreatment). Notice 2023-62 granted an administrative
 * transition period for IRC 414(v)(7)(A) as added by SECURE 2.0 section 603,
 * treating catch-up contributions for 2024 and 2025 as satisfying the
 * requirement regardless of prior-year wages. The mandate first bites for 2026,
 * which is the first year the data carries a figure.
 */
const RECONCILED = new Map([
  ["2024:rothCatchUpWageThreshold_414v7A", { value: null, why: "Notice 2023-62 transition period" }],
  ["2025:rothCatchUpWageThreshold_414v7A", { value: null, why: "Notice 2023-62 transition period" }],
]);

/** Non-figure keys in a year block. */
const METADATA = /^(source|_.*|.*_note|.*_source)$/;

const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);

const results = [];
const record = (year, label, expected, actual, citation) =>
  results.push({ year, label, expected, actual, citation, ok: expected === actual });

for (const [yearKey, block] of Object.entries(primary.planYears)) {
  const year = parameters.years[yearKey];
  if (!year) {
    results.push({
      year: yearKey,
      label: "(year block)",
      expected: "present",
      actual: "missing",
      citation: "-",
      ok: false,
    });
    continue;
  }

  for (const [field, path, citation] of SCALARS) {
    if (!(field in block)) continue;
    const override = RECONCILED.get(`${yearKey}:${field}`);
    const expected = override ? override.value : block[field];
    const label = override ? `${field} (${override.why})` : field;
    record(yearKey, label, expected, at(year, path) ?? null, citation);
  }

  for (const [field, dataKey, statuses, citation] of BANDS) {
    const band = block[field];
    if (!band) continue;
    for (const [primaryStatus, dataStatus] of Object.entries(statuses)) {
      const expected = band[primaryStatus];
      if (!expected) continue;
      const actual = at(year, ["phaseouts", dataKey, dataStatus]);
      record(yearKey, `${field}.${primaryStatus}.start`, expected.start, actual?.[0], citation);
      record(yearKey, `${field}.${primaryStatus}.end`, expected.end, actual?.[1], citation);
    }
  }
}

// The 402(g)/457(e)(15) elective series is recorded separately and spans more
// years than the plan-year blocks, so it is walked on its own.
for (const [yearKey, entry] of Object.entries(primary.electiveDeferralAndSection457b ?? {})) {
  const year = parameters.years[yearKey];
  if (!year) continue;
  record(yearKey, "electiveDeferral (series)", entry.amount, year.electiveDeferral402g, "IRC 402(g)(1)");
  record(yearKey, "section457b (series)", entry.amount, year.section457b?.baseDeferralLimit, "IRC 457(e)(15)");
}

// Any recorded figure neither compared nor explicitly excluded is a silent gap.
const compared = new Set(results.map((r) => r.label.split(".")[0]));
const uncovered = [];
for (const block of Object.values(primary.planYears)) {
  for (const key of Object.keys(block)) {
    if (METADATA.test(key) || UNMODELLED.has(key) || compared.has(key)) continue;
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
      ? `Primary-source verification passed: ${results.length} comparisons over ${range}, 0 mismatches.`
      : `Primary-source verification FAILED: ${failures.length} mismatch(es), ${uncovered.length} uncovered field(s), of ${results.length} comparisons.`,
  );
}

process.exit(failures.length === 0 && uncovered.length === 0 ? 0 : 1);
