#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const parameterPath = join(root, "data", "retirement-parameters.json");
const hsaPath = join(root, "data", "hsa-parameters.json");
const fsaPath = join(root, "data", "fsa-parameters.json");
const educationPath = join(root, "data", "education-parameters.json");
const vectorPath = join(root, "data", "conformance-vectors.json");
const errors = [];

function fail(message) {
  errors.push(message);
}

async function parseCanonicalJson(path, label) {
  const raw = await readFile(path, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
    return null;
  }
  const canonical = `${JSON.stringify(parsed, null, 2)}\n`;
  if (raw !== canonical) fail(`${label} is not canonically formatted with two-space indentation.`);
  return parsed;
}

function walk(value, path) {
  if (typeof value === "number" && !Number.isFinite(value)) {
    fail(`${path} contains a non-finite number.`);
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, `${path}[${index}]`));
  } else if (value !== null && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) walk(entry, `${path}.${key}`);
  }
}

/**
 * Shared shape check for a `sources` array: every record complete, ids unique,
 * every url HTTPS, and any id the file is required to keep actually present.
 */
function validateSources(sources, label, requiredIds = []) {
  if (!Array.isArray(sources) || sources.length === 0) {
    fail(`${label}: at least one source record is required.`);
    return;
  }
  const ids = new Set();
  for (const [index, source] of sources.entries()) {
    const prefix = `${label} sources[${index}]`;
    for (const key of ["id", "title", "url", "authority"]) {
      if (typeof source?.[key] !== "string" || source[key].trim() === "") {
        fail(`${prefix}.${key} must be a nonempty string.`);
      }
    }
    if (ids.has(source.id)) fail(`${label}: duplicate source id: ${source.id}`);
    ids.add(source.id);
    if (typeof source.url === "string" && !source.url.startsWith("https://")) {
      fail(`${prefix}.url must use HTTPS.`);
    }
  }
  for (const required of requiredIds) {
    if (!ids.has(required)) fail(`${label}: required provenance source is missing: ${required}`);
  }
}

/**
 * Contiguity of the year table against the declared supported range, shared by
 * both parameter files. Returns the year list when it is usable, else null.
 */
function validateYearSpan(file, label) {
  if (!Number.isInteger(file.schemaVersion) || file.schemaVersion < 1) {
    fail(`${label}: schemaVersion must be a positive integer.`);
  }
  const minimum = file.supportedTaxYears?.minimum;
  const maximum = file.supportedTaxYears?.maximum;
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum > maximum) {
    fail(`${label}: supportedTaxYears must contain an ordered integer minimum and maximum.`);
    return null;
  }
  if (file.generatedThroughTaxYear !== maximum) {
    fail(`${label}: generatedThroughTaxYear must equal supportedTaxYears.maximum.`);
  }
  const keys = Object.keys(file.years ?? {}).map(Number).sort((a, b) => a - b);
  const expected = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index);
  if (JSON.stringify(keys) !== JSON.stringify(expected)) {
    fail(`${label}: year rows must be contiguous from ${minimum} through ${maximum}.`);
  }
  return expected;
}

/** A whole-dollar amount that must be present and above zero. */
function requirePositiveAmount(value, label) {
  if (!Number.isInteger(value) || value <= 0) fail(`${label} must be a positive whole-dollar amount.`);
}

const parameters = await parseCanonicalJson(parameterPath, "data/retirement-parameters.json");
const hsa = await parseCanonicalJson(hsaPath, "data/hsa-parameters.json");
const fsa = await parseCanonicalJson(fsaPath, "data/fsa-parameters.json");
const education = await parseCanonicalJson(educationPath, "data/education-parameters.json");
const payroll = await parseCanonicalJson(join(root, "data/payroll-tax-parameters.json"), "data/payroll-tax-parameters.json");
const conformance = await parseCanonicalJson(vectorPath, "data/conformance-vectors.json");

if (payroll) {
  walk(payroll, "payroll");
  const years = validateYearSpan(payroll, "data/payroll-tax-parameters.json");
  validateSources(payroll.sources, "data/payroll-tax-parameters.json");
  if (payroll.supportedTaxYears?.minimum !== 1991) fail("Payroll historical floor must remain 1991 without a separate expansion.");
  for (const year of years ?? []) {
    const row = payroll.years?.[String(year)];
    if (row?.taxYear !== year) fail(`Payroll row ${year} has mismatched taxYear.`);
    if (typeof row?.source !== "string" || row.source.trim() === "") fail(`Payroll row ${year} needs provenance.`);
    for (const field of ["contributionAndBenefitBase", "hospitalInsuranceWageBase", "oasdiRateEmployeePercent", "oasdiRateEmployerPercent", "hiRateEmployeePercent", "hiRateEmployerPercent", "secaOasdiRatePercent", "secaHiRatePercent", "netEarningsOasdiRateBasisPercent", "netEarningsHiRateBasisPercent", "netEarningsDeductionFraction", "selfEmploymentMinimumNetEarnings", "secaOasdiDeductionFraction", "secaHiDeductionFraction", "additionalMedicareRatePercent", "additionalMedicareJointThreshold", "additionalMedicareOtherThreshold", "additionalMedicareSeparateThresholdFraction", "additionalMedicareWithholdingThreshold"]) {
      const value = row?.[field];
      const nullable = (field === "hospitalInsuranceWageBase" && year >= 1994) || (field.startsWith("additionalMedicare") && year < 2013);
      if (nullable ? value !== null : typeof value !== "number" || !Number.isFinite(value) || value <= 0) fail(`Payroll ${year}.${field} has an invalid amount or effective-year state.`);
      if (typeof value === "number" && !field.endsWith("Percent") && !field.endsWith("Fraction") && !Number.isInteger(value)) fail(`Payroll ${year}.${field} must be published whole dollars.`);
      if (typeof value === "number" && ((field.endsWith("Percent") && value > 100) || (field.endsWith("Fraction") && value > 1))) fail(`Payroll ${year}.${field} exceeds its unit range.`);
    }
  }
}

if (parameters) {
  walk(parameters, "parameters");
  const years = validateYearSpan(parameters, "data/retirement-parameters.json");
  for (const year of years ?? []) {
    const row = parameters.years?.[String(year)];
    if (!row || row.year !== year) fail(`Year row ${year} is missing or has a mismatched year field.`);
    if (row && row.annualCompensation401a17 !== null && row.annualCompensation401a17 <= 0) {
      fail(`Year ${year} has an invalid annualCompensation401a17 value.`);
    }
    if (row && row.annualAdditions415c !== null && row.annualAdditions415c <= 0) {
      fail(`Year ${year} has an invalid annualAdditions415c value.`);
    }
    // IRC 415(b)(1)(A) is a defined-benefit *benefit* ceiling, so it is
    // independent of every defined-contribution figure and cannot be range
    // checked against one. Null means no figure is transcribed for the year;
    // anything else must be a real published whole-dollar amount, because a
    // zero or a fraction here would be an invented limit rather than an absent
    // one.
    if (row && !(row.definedBenefitAnnualBenefit415b === null
      || (Number.isInteger(row.definedBenefitAnnualBenefit415b) && row.definedBenefitAnnualBenefit415b > 0))) {
      fail(`Year ${year} definedBenefitAnnualBenefit415b must be null or a positive whole-dollar amount.`);
    }
    if (row && !("definedBenefitAnnualBenefit415b" in row)) {
      fail(`Year ${year} definedBenefitAnnualBenefit415b is required; use null where no figure is transcribed.`);
    }
    // IRC 402A(e)(3)(A)(i) caps the portion of a pension-linked emergency
    // savings account balance attributable to participant contributions. The
    // field must exist on every row so a year without one is an explicit null
    // rather than an absent key, and it must agree with the availability flag:
    // an account type that does not exist for the year cannot carry a cap, and
    // one that does exist must not carry a null that the engine would read as
    // "no encoded figure".
    if (row && !("pensionLinkedEmergencySavingsBalanceCap402A" in row)) {
      fail(`Year ${year} pensionLinkedEmergencySavingsBalanceCap402A is required; use null before IRC 402A(e) took effect.`);
    }
    if (row && !(row.pensionLinkedEmergencySavingsBalanceCap402A === null
      || (Number.isInteger(row.pensionLinkedEmergencySavingsBalanceCap402A) && row.pensionLinkedEmergencySavingsBalanceCap402A > 0))) {
      fail(`Year ${year} pensionLinkedEmergencySavingsBalanceCap402A must be null or a positive whole-dollar amount.`);
    }
    if (row && typeof row.availability?.pensionLinkedEmergencySavings !== "boolean") {
      fail(`Year ${year} availability.pensionLinkedEmergencySavings must be a boolean.`);
    }
    if (row && row.availability?.pensionLinkedEmergencySavings !== (row.pensionLinkedEmergencySavingsBalanceCap402A !== null)) {
      fail(`Year ${year} availability.pensionLinkedEmergencySavings disagrees with pensionLinkedEmergencySavingsBalanceCap402A.`);
    }
    for (const [field, value] of Object.entries(row?.special403b15YearCatchUp ?? {})) {
      requirePositiveAmount(value, `Year ${year} special403b15YearCatchUp.${field}`);
    }
    for (const field of ["annualLimit", "lifetimeLimit", "serviceLimitPerYear"]) {
      if (!(field in (row?.special403b15YearCatchUp ?? {}))) {
        fail(`Year ${year} special403b15YearCatchUp.${field} is required.`);
      }
    }
    // The IRC 414(q)(1)(B) and 416(i)(1)(A)(i) thresholds are published amounts:
    // present on every row, null where the clause states no amount, and
    // otherwise a real whole-dollar figure.
    for (const field of ["highlyCompensatedEmployeeCompensation414q", "keyEmployeeOfficerCompensation416i"]) {
      if (row && !(field in row)) {
        fail(`Year ${year} ${field} is required; use null where the clause states no amount.`);
      }
      if (row && !(row[field] === null || (Number.isInteger(row[field]) && row[field] > 0))) {
        fail(`Year ${year} ${field} must be null or a positive whole-dollar amount.`);
      }
    }
    // IRC 25B exists for taxable years beginning after December 31, 2001
    // (Pub. L. 107-16 section 618), and nothing has repealed it since.
    if (row && !("saversCredit25B" in row)) {
      fail(`Year ${year} saversCredit25B is required; use null before IRC 25B existed.`);
    }
    if (row && (year < 2002) !== (row.saversCredit25B === null)) {
      fail(`Year ${year} saversCredit25B must be null exactly for years before 2002.`);
    }
    const saver = row?.saversCredit25B;
    if (saver) {
      for (const filer of ["jointReturn", "headOfHousehold", "allOtherTaxpayers"]) {
        const limits = saver.adjustedGrossIncomeLimits?.[filer];
        for (const rate of ["fiftyPercent", "twentyPercent", "tenPercent"]) {
          requirePositiveAmount(limits?.[rate], `Year ${year} saversCredit25B.adjustedGrossIncomeLimits.${filer}.${rate}`);
        }
        if (limits && !(limits.fiftyPercent < limits.twentyPercent && limits.twentyPercent < limits.tenPercent)) {
          fail(`Year ${year} saversCredit25B ${filer} ceilings must rise from the 50 to the 10 percent rate.`);
        }
      }
      // Pub. L. 119-21 section 70116(a)(1) counts IRA contributions, elective
      // deferrals and voluntary employee contributions under IRC 25B(d)(1)(B) only
      // for taxable years beginning before January 1, 2027, without repealing the
      // credit. A later row therefore cannot copy the prior year's flag forward.
      if (saver.retirementPlanAndIraContributionsQualify !== (year <= 2026)) {
        fail(`Year ${year} saversCredit25B.retirementPlanAndIraContributionsQualify must be ${year <= 2026}; Pub. L. 119-21 section 70116(a)(1) counts retirement contributions only for taxable years beginning before January 1, 2027.`);
      }
    }
  }

  validateSources(parameters.sources, "data/retirement-parameters.json", [
    "irs-notice-2001-56",
    "irs-employee-plans-news-fall-2009",
    "irs-pub-535-2001",
    "usc-26-402",
    "usc-26-402A",
    "usc-26-25B",
    "pl-119-21",
  ]);

  const row1997 = parameters.years?.["1997"];
  if (row1997?.annualCompensation401a17 !== 160000) {
    fail("The 1997 §401(a)(17) compensation limit regression fixture must be 160000.");
  }
  if (row1997?.sep?.maximumEmployerContributionRate !== 0.15) {
    fail("The 1997 SEP employer-rate regression fixture must be 0.15.");
  }
  // Each series opens at the first year its document states a figure.
  if (parameters.years?.["1996"]?.highlyCompensatedEmployeeCompensation414q !== null
    || row1997?.highlyCompensatedEmployeeCompensation414q !== 80000) {
    fail("The IRC 414(q)(1)(B) series must open at 1997 with Notice 96-55's $80,000.");
  }
  const row2001 = parameters.years?.["2001"];
  const row2002 = parameters.years?.["2002"];
  if (row2001?.keyEmployeeOfficerCompensation416i !== null || row2002?.keyEmployeeOfficerCompensation416i !== 130000) {
    fail("The IRC 416(i)(1)(A)(i) series must open at 2002 with Pub. L. 107-16 section 613's $130,000.");
  }
  if (row2002?.saversCredit25B?.adjustedGrossIncomeLimits?.jointReturn?.tenPercent !== 50000) {
    fail("The IRC 25B series must open at 2002 with Pub. L. 107-16 section 618's $50,000 joint-return ceiling.");
  }
  // Pub. L. 117-328 section 127(g) applies IRC 402A(e) to plan years beginning
  // after December 31, 2023, and the flush text of IRC 402A(e)(3)(A) adjusts the
  // $2,500 only for contributions made in taxable years beginning after
  // December 31, 2024. 2023 therefore has no account and no cap, and 2024 is
  // pinned to the unadjusted statutory amount that no notice publishes.
  const row2023 = parameters.years?.["2023"];
  const row2024 = parameters.years?.["2024"];
  if (row2023?.pensionLinkedEmergencySavingsBalanceCap402A !== null
    || row2023?.availability?.pensionLinkedEmergencySavings !== false) {
    fail("The 2023 row must record no pension-linked emergency savings account; IRC 402A(e) first applies to plan years beginning after December 31, 2023.");
  }
  if (row2024?.pensionLinkedEmergencySavingsBalanceCap402A !== 2500
    || row2024?.availability?.pensionLinkedEmergencySavings !== true) {
    fail("The 2024 row must carry the unadjusted statutory IRC 402A(e)(3)(A)(i) amount of 2500.");
  }
  const row2026 = parameters.years?.["2026"];
  if (
    row2026?.special403b15YearCatchUp?.annualLimit !== 3000 ||
    row2026?.special403b15YearCatchUp?.lifetimeLimit !== 15000 ||
    row2026?.special403b15YearCatchUp?.serviceLimitPerYear !== 5000
  ) {
    fail("The 2026 IRC 402(g)(7) special 403(b) catch-up regression fixture must carry the statutory limits.");
  }
}

if (hsa) {
  walk(hsa, "hsa");
  const years = validateYearSpan(hsa, "data/hsa-parameters.json");
  for (const year of years ?? []) {
    const label = `HSA year ${year}`;
    const row = hsa.years?.[String(year)];
    if (!row || row.year !== year) {
      fail(`${label} row is missing or has a mismatched year field.`);
      continue;
    }

    requirePositiveAmount(row.annualContributionLimit?.selfOnly, `${label} annualContributionLimit.selfOnly`);
    requirePositiveAmount(row.annualContributionLimit?.family, `${label} annualContributionLimit.family`);
    if (row.annualContributionLimit?.family < row.annualContributionLimit?.selfOnly) {
      fail(`${label} family contribution limit is below the self-only limit.`);
    }
    if (!Number.isInteger(row.additionalContributionAmountAge55) || row.additionalContributionAmountAge55 < 0) {
      fail(`${label} additionalContributionAmountAge55 must be a whole-dollar amount of at least zero.`);
    }

    for (const tier of ["selfOnly", "family"]) {
      const deductible = row.hdhp?.minimumAnnualDeductible?.[tier];
      const outOfPocket = row.hdhp?.maximumAnnualOutOfPocket?.[tier];
      requirePositiveAmount(deductible, `${label} hdhp.minimumAnnualDeductible.${tier}`);
      requirePositiveAmount(outOfPocket, `${label} hdhp.maximumAnnualOutOfPocket.${tier}`);
      if (Number.isInteger(deductible) && Number.isInteger(outOfPocket) && outOfPocket < deductible) {
        fail(`${label} hdhp maximum out-of-pocket (${tier}) is below the minimum annual deductible.`);
      }
    }

    for (const flag of ["contributionLimitCappedByHdhpAnnualDeductible", "lastMonthRuleAvailable"]) {
      if (typeof row[flag] !== "boolean") fail(`${label} ${flag} must be a boolean.`);
    }
    // §223(b)(8)(B)(iii) defines the testing period only as part of the
    // last-month rule, so the two fields cannot disagree about whether that
    // rule exists in a year.
    if (row.lastMonthRuleAvailable === true && row.testingPeriodMonths !== 13) {
      fail(`${label} has the §223(b)(8) last-month rule available but no 13-month testing period.`);
    }
    if (row.lastMonthRuleAvailable === false && row.testingPeriodMonths !== null) {
      fail(`${label} records a testing period for a year without the §223(b)(8) last-month rule.`);
    }
  }

  validateSources(hsa.sources, "data/hsa-parameters.json", ["usc-26-223"]);

  // The 2006/2007 boundary is the one historical HSA rule change the engine
  // reads: §303 of the Tax Relief and Health Care Act of 2006 removed the
  // deductible cap and §305 added the last-month rule, both for taxable years
  // beginning after 2006.
  const row2006 = hsa.years?.["2006"];
  const row2007 = hsa.years?.["2007"];
  if (row2006?.contributionLimitCappedByHdhpAnnualDeductible !== true || row2006?.lastMonthRuleAvailable !== false) {
    fail("The 2006 HSA regression fixture must carry the deductible cap and no last-month rule.");
  }
  if (row2007?.contributionLimitCappedByHdhpAnnualDeductible !== false || row2007?.lastMonthRuleAvailable !== true) {
    fail("The 2007 HSA regression fixture must carry no deductible cap and the last-month rule.");
  }
}

if (fsa) {
  walk(fsa, "fsa");
  const years = validateYearSpan(fsa, "data/fsa-parameters.json");
  for (const year of years ?? []) {
    const label = `FSA year ${year}`;
    const row = fsa.years?.[String(year)];
    if (!row || row.year !== year) {
      fail(`${label} row is missing or has a mismatched year field.`);
      continue;
    }

    // Every row carries a state. `statutory_dollar_limit` must carry figures;
    // `available_without_statutory_dollar_limit` must carry nulls, because a
    // year with no statutory ceiling has no figure to state and a number there
    // would be an invented one. A partial block is forbidden either way.
    const STATES = ["available_without_statutory_dollar_limit", "statutory_dollar_limit"];
    for (const [program, block] of [["healthFsa", row.healthFsa], ["dependentCare", row.dependentCare]]) {
      if (!STATES.includes(block?.state)) {
        fail(`${label} ${program}.state must be one of ${STATES.join(", ")}.`);
      }
    }
    if (row.healthFsa?.state === "available_without_statutory_dollar_limit") {
      if (row.healthFsa.salaryReductionLimit !== null || row.healthFsa.carryoverLimit !== null) {
        fail(`${label} healthFsa has no statutory ceiling, so both of its amounts must be null.`);
      }
    }
    if (row.dependentCare?.state === "available_without_statutory_dollar_limit") {
      if (
        row.dependentCare.exclusionLimit !== null ||
        row.dependentCare.marriedFilingSeparatelyExclusionLimit !== null
      ) {
        fail(`${label} dependentCare has no statutory ceiling, so both of its amounts must be null.`);
      }
    }
    if (row.healthFsa?.state === "statutory_dollar_limit") {
      requirePositiveAmount(row.healthFsa?.salaryReductionLimit, `${label} healthFsa.salaryReductionLimit`);
      if (!Number.isInteger(row.healthFsa?.carryoverLimit) || row.healthFsa.carryoverLimit < 0) {
        fail(`${label} healthFsa.carryoverLimit must be a whole-dollar amount of at least zero.`);
      }
      if (row.healthFsa?.carryoverLimit > row.healthFsa?.salaryReductionLimit) {
        fail(`${label} healthFsa carryover limit exceeds the §125(i) salary-reduction limit.`);
      }
    }

    if (row.dependentCare?.state === "statutory_dollar_limit") {
      requirePositiveAmount(row.dependentCare?.exclusionLimit, `${label} dependentCare.exclusionLimit`);
      requirePositiveAmount(
        row.dependentCare?.marriedFilingSeparatelyExclusionLimit,
        `${label} dependentCare.marriedFilingSeparatelyExclusionLimit`,
      );
    }
    if (row.dependentCare?.marriedFilingSeparatelyExclusionLimit > row.dependentCare?.exclusionLimit) {
      fail(`${label} married-separate §129 exclusion exceeds the general exclusion.`);
    }
  }

  validateSources(fsa.sources, "data/fsa-parameters.json", ["usc-26-125", "usc-26-129", "pl-97-34", "pl-99-514", "pl-117-2", "pl-119-21"]);

  // The two §125(i) boundaries the engine reads: 2012 has no statutory
  // salary-reduction ceiling at all, and 2013 is the first year one exists.
  if (fsa.years?.["2012"]?.healthFsa?.state !== "available_without_statutory_dollar_limit") {
    fail("The 2012 FSA row must record the health FSA as existing with no statutory §125(i) ceiling; the limit applies only to plan years beginning after 2012.");
  }
  if (fsa.years?.["1986"]?.dependentCare?.state !== "available_without_statutory_dollar_limit") {
    fail("The 1986 FSA row must record dependent care as existing with no statutory §129(a)(2)(A) ceiling; the limitation applies only to taxable years beginning after 1986.");
  }
  if (fsa.years?.["1987"]?.dependentCare?.state !== "statutory_dollar_limit") {
    fail("The 1987 FSA row must record the first year the §129(a)(2)(A) limitation applies.");
  }
  if (fsa.years?.["2013"]?.healthFsa?.salaryReductionLimit !== 2500) {
    fail("The 2013 FSA row must carry the unindexed statutory §125(i) amount of $2,500.");
  }
}

if (education) {
  walk(education, "education");
  const years = validateYearSpan(education, "data/education-parameters.json");
  // The three programs start in different years, so unlike the FSA table the
  // unavailable state appears on rows and needs its own definition.
  const STATES = ["unavailable", "indeterminate", "available_without_statutory_dollar_limit", "statutory_dollar_limit"];
  for (const state of STATES) {
    if (typeof education.dollarLimitStates?.[state] !== "string") {
      fail(`data/education-parameters.json dollarLimitStates.${state} must be described.`);
    }
  }
  for (const scope of ["tuition", "varies_within_year", "tuition_and_other_school_expenses"]) {
    if (typeof education.elementarySecondaryExpenseScopes?.[scope] !== "string") {
      fail(`data/education-parameters.json elementarySecondaryExpenseScopes.${scope} must be described.`);
    }
  }
  for (const year of years ?? []) {
    const label = `Education year ${year}`;
    const row = education.years?.[String(year)];
    if (!row || row.year !== year) {
      fail(`${label} row is missing or has a mismatched year field.`);
      continue;
    }
    const coverdell = row.coverdellEducationSavingsAccount;
    const assistance = row.educationalAssistanceProgram;
    const qtp = row.qualifiedTuitionProgram;
    for (const [name, program] of [
      ["coverdellEducationSavingsAccount", coverdell],
      ["educationalAssistanceProgram", assistance],
      ["qualifiedTuitionProgram", qtp],
    ]) {
      if (!STATES.includes(program?.state)) fail(`${label} ${name}.state is not a known state.`);
    }
    // An amount exists exactly when the state says a statutory limit does.
    if (coverdell?.state === "statutory_dollar_limit") {
      requirePositiveAmount(coverdell.annualContributionLimit, `${label} coverdellEducationSavingsAccount.annualContributionLimit`);
      for (const filer of ["jointReturn", "otherReturns"]) {
        const band = coverdell.contributionPhaseout?.[filer];
        if (!Array.isArray(band) || band.length !== 2 || !band.every((value) => Number.isInteger(value) && value > 0) || band[0] >= band[1]) {
          fail(`${label} coverdellEducationSavingsAccount.contributionPhaseout.${filer} must be an ascending [start, end] of whole dollars.`);
        }
      }
    } else if (coverdell && (coverdell.annualContributionLimit !== null || coverdell.contributionPhaseout !== null)) {
      fail(`${label} coverdellEducationSavingsAccount carries amounts in a state without a statutory limit.`);
    }
    if (assistance?.state === "statutory_dollar_limit") {
      requirePositiveAmount(assistance.annualExclusionLimit, `${label} educationalAssistanceProgram.annualExclusionLimit`);
    } else if (assistance && assistance.annualExclusionLimit !== null) {
      fail(`${label} educationalAssistanceProgram carries an amount in a state without a statutory limit.`);
    }
    // IRC 529(b)(6) states no federal contribution limit in any year. Pub. L.
    // 104-188 section 1806(c)(1) applies IRC 529 to taxable years ending after
    // August 20, 1996, which a 1996 lookup cannot place, so 1996 alone is
    // indeterminate.
    const qtpState = year === 1996 ? "indeterminate" : "available_without_statutory_dollar_limit";
    if (qtp && (qtp.state !== qtpState || qtp.annualContributionLimit !== null)) {
      fail(`${label} qualifiedTuitionProgram must be ${qtpState} with a null contribution limit; IRC 529(b)(6) states none and Pub. L. 104-188 section 1806(c)(1) sets the first year.`);
    }
    for (const field of ["elementarySecondaryExpenseAnnualLimit", "qualifiedEducationLoanLifetimeLimit", "rothIraRolloverLifetimeLimit"]) {
      if (qtp && !(field in qtp)) {
        fail(`${label} qualifiedTuitionProgram.${field} is required; use null before it takes effect.`);
      } else if (qtp && !(qtp[field] === null || (Number.isInteger(qtp[field]) && qtp[field] > 0))) {
        fail(`${label} qualifiedTuitionProgram.${field} must be null or a positive whole-dollar amount.`);
      }
    }
    // The IRC 529(e)(3) cap counts expenses described in IRC 529(c)(7): tuition
    // from Pub. L. 115-97 section 11032, widened by Pub. L. 119-21 section 70413(a)
    // for distributions made after July 4, 2025.
    const expectedScope = year < 2018 ? null
      : year < 2025 ? "tuition"
        : year === 2025 ? "varies_within_year" : "tuition_and_other_school_expenses";
    if (qtp && qtp.elementarySecondaryExpenseScope !== expectedScope) {
      fail(`${label} qualifiedTuitionProgram.elementarySecondaryExpenseScope must be ${JSON.stringify(expectedScope)} (IRC 529(c)(7); Pub. L. 115-97 section 11032; Pub. L. 119-21 section 70413(a)).`);
    }
    if (qtp && (qtp.elementarySecondaryExpenseScope === null) !== (qtp.elementarySecondaryExpenseAnnualLimit === null)) {
      fail(`${label} qualifiedTuitionProgram states an elementary and secondary expense scope without a limit, or a limit without a scope.`);
    }
    // Pub. L. 119-21 section 70412(b) indexes IRC 127(a)(2) for taxable years
    // beginning after 2026, so a later row cannot copy the flat amount forward.
    if (year > 2026 && assistance?.annualExclusionLimit === 5250) {
      fail(`${label} educationalAssistanceProgram.annualExclusionLimit carries the unindexed $5,250; Pub. L. 119-21 section 70412(b) indexes it for taxable years beginning after 2026.`);
    }
  }

  validateSources(education.sources, "data/education-parameters.json", ["usc-26-530", "usc-26-127", "usc-26-529", "pl-104-188", "pl-105-34", "pl-107-16", "pl-119-21"]);

  // Each program's first year and each change, from the provision that sets it.
  const row = (year) => education.years?.[String(year)];
  if (row(1997)?.coverdellEducationSavingsAccount?.state !== "unavailable"
    || row(1998)?.coverdellEducationSavingsAccount?.annualContributionLimit !== 500) {
    fail("IRC 530 must first apply in 1998, at $500 (Pub. L. 105-34 section 213(f)).");
  }
  if (row(2001)?.coverdellEducationSavingsAccount?.annualContributionLimit !== 500
    || row(2002)?.coverdellEducationSavingsAccount?.annualContributionLimit !== 2000) {
    fail("IRC 530 must change from $500 to $2,000 in 2002 (Pub. L. 107-16 section 401(a)).");
  }
  if (row(2017)?.qualifiedTuitionProgram?.elementarySecondaryExpenseAnnualLimit !== null
    || row(2018)?.qualifiedTuitionProgram?.elementarySecondaryExpenseAnnualLimit !== 10000
    || row(2026)?.qualifiedTuitionProgram?.elementarySecondaryExpenseAnnualLimit !== 20000) {
    fail("IRC 529(e)(3) must be null through 2017, $10,000 from 2018 and $20,000 from 2026.");
  }
}

if (conformance) {
  walk(conformance, "conformance");
  if (!Number.isInteger(conformance.schemaVersion) || conformance.schemaVersion < 1) {
    fail("Conformance schemaVersion must be a positive integer.");
  }
  if (!Array.isArray(conformance.vectors) || conformance.vectors.length === 0) {
    fail("Conformance vectors must be a nonempty array.");
  } else {
    const names = new Set();
    for (const [index, vector] of conformance.vectors.entries()) {
      const prefix = `vectors[${index}]`;
      if (typeof vector?.name !== "string" || vector.name.trim() === "") {
        fail(`${prefix}.name must be a nonempty string.`);
      } else if (names.has(vector.name)) {
        fail(`Duplicate conformance vector name: ${vector.name}`);
      } else {
        names.add(vector.name);
      }
      if (!vector?.input || typeof vector.input !== "object" || Array.isArray(vector.input)) {
        fail(`${prefix}.input must be an object.`);
      }
      const hasExpect = Boolean(vector?.expect && typeof vector.expect === "object" && !Array.isArray(vector.expect));
      const hasExpectError = Boolean(vector?.expectError && typeof vector.expectError === "object" && !Array.isArray(vector.expectError));
      if (hasExpect === hasExpectError) {
        fail(`${prefix} must declare exactly one of expect or expectError.`);
      }
      if (hasExpectError && (typeof vector.expectError.code !== "string" || vector.expectError.code.trim() === "")) {
        fail(`${prefix}.expectError.code must be a nonempty string.`);
      }
      for (const field of ["expectDiagnosticCodes", "expectAbsentDiagnosticCodes"]) {
        if (vector?.[field] !== undefined) {
          if (hasExpectError) {
            fail(`${prefix}.${field} requires expect because throwing vectors produce no diagnostics.`);
          }
          if (!Array.isArray(vector[field])) {
            fail(`${prefix}.${field} must be an array when supplied.`);
          } else if (
            vector[field].some((code) => typeof code !== "string" || code.trim() === "")
          ) {
            fail(`${prefix}.${field} must contain only nonempty strings.`);
          }
        }
      }
      if (vector.operation !== undefined && vector.operation !== "payrollTax") fail(`${prefix}.operation is unknown.`);
      if (!hasExpectError) {
        const year = vector?.input?.taxYear;
        const minimum = parameters?.supportedTaxYears?.minimum;
        const maximum = parameters?.supportedTaxYears?.maximum;
        if (!Number.isInteger(year) || (vector.operation !== "payrollTax" && Number.isInteger(minimum) && (year < minimum || year > maximum))) {
          fail(`${prefix}.input.taxYear is outside the supported range.`);
        }
      }
    }
    for (const required of [
      "1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate",
      "1997 nonelective formula applies 401a17 compensation ceiling",
      "1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings",
      "1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings",
    ]) {
      if (!names.has(required)) fail(`Required §401(a)(17) conformance vector is missing: ${required}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(
  `Canonical data validation passed: ${Object.keys(parameters.years).length} contiguous retirement tax years, ` +
    `${Object.keys(hsa.years).length} contiguous HSA tax years, ` +
    `${Object.keys(fsa.years).length} contiguous FSA tax years, ` +
    `${Object.keys(payroll.years).length} contiguous payroll tax years, ` +
    `${Object.keys(education.years).length} contiguous education tax years, ` +
    `${parameters.sources.length + hsa.sources.length + fsa.sources.length + payroll.sources.length + education.sources.length} sources, ` +
    `${conformance.vectors.length} conformance vectors.`,
);
