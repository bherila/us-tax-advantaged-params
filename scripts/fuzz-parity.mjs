#!/usr/bin/env node
/**
 * Seeded property-based TypeScript/PHP differential harness.
 *
 * `scripts/check-parity.mjs` compares the two engines on the conformance
 * vectors only, so any behaviour outside those inputs is unchecked. This
 * harness generates randomized scenarios across the supported tax years,
 * account types, HSA coverage shapes, existing contributions, conversions,
 * filing statuses, and deliberately malformed inputs, then diffs the complete
 * serialized output of both engines — including thrown error codes and
 * messages.
 *
 * It is deterministic: every run prints its seed, and `--seed=<n>` replays a
 * failure exactly. A divergence prints the offending input, both outputs, and
 * the first differing path, then exits non-zero.
 *
 *   node scripts/fuzz-parity.mjs                 # default case count, random seed
 *   node scripts/fuzz-parity.mjs --seed=12345    # replay
 *   node scripts/fuzz-parity.mjs --cases=5000    # deeper sweep
 */
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import USTaxAdvantagedParams from "../dist/esm/USTaxAdvantagedParams.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseOption(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((argument) => argument.startsWith(prefix));
  if (found === undefined) return fallback;
  const parsed = Number.parseInt(found.slice(prefix.length), 10);
  if (!Number.isFinite(parsed)) throw new Error(`--${name} must be an integer.`);
  return parsed;
}

const seed = parseOption("seed", (Math.random() * 0xffffffff) >>> 0) >>> 0;
const caseCount = parseOption("cases", 5000);
const batchSize = parseOption("batch", 200);

/** mulberry32 — a small, fast, fully deterministic 32-bit PRNG. */
function makeRandom(initialSeed) {
  let state = initialSeed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const random = makeRandom(seed);
const pick = (values) => values[Math.floor(random() * values.length)];
const chance = (probability) => random() < probability;
const integer = (low, high) => low + Math.floor(random() * (high - low + 1));
/** Money-shaped values, biased toward the boundaries where limits bind. */
const money = () => pick([0, 0.01, 1, 500, 3500, 7000, 7500, 12000, 23500, 24500, 47000, 70000, 100000, 350000, 1000000])
  + (chance(0.25) ? integer(0, 999) : 0);

const ACCOUNT_TYPES = [
  "traditional_ira", "roth_ira", "rollover_ira", "payroll_deduction_ira",
  "deemed_traditional_ira", "deemed_roth_ira", "inherited_traditional_ira", "inherited_roth_ira",
  "sep_ira", "roth_sep_ira", "simple_ira", "roth_simple_ira", "sarsep_ira",
  "traditional_401k", "roth_401k", "solo_401k", "roth_solo_401k",
  "simple_401k", "roth_simple_401k", "starter_401k", "pension_linked_emergency_savings",
  "traditional_403b", "roth_403b", "safe_harbor_403b_deferral_only",
  "governmental_457b", "roth_governmental_457b", "nongovernmental_457b", "section_457f",
  "traditional_tsp", "roth_tsp",
  "section_401a", "profit_sharing_plan", "money_purchase_plan", "keogh_plan", "esop",
  "defined_benefit_plan", "cash_balance_plan",
  "hsa",
  "health_fsa",
  "dependent_care_fsa",
];
const FILING_STATUSES = [
  "single", "married_filing_jointly", "married_filing_separately",
  "head_of_household", "qualifying_surviving_spouse",
  "MFJ", "MFS", "HOH", "QSS", "S",
];
const CONVERSION_TYPES = ["ira_to_roth_ira", "qualified_plan_to_roth_ira", "in_plan_roth_rollover"];
const CONTRIBUTION_PREFERENCES = ["account_type", "pretax_first", "roth_first"];
const EMPLOYER_TAX_TREATMENTS = ["pretax", "roth"];
const SIMPLE_METHODS = ["match_3_percent", "nonelective_2_percent", "custom"];
const COVERAGE_TIERS = ["self_only", "family"];
const HEALTH_FSA_PURPOSES = ["general_purpose", "limited_purpose", "post_deductible"];
const EXISTING_KEYS = [
  "employeePreTaxDeferral", "employeeRothDeferral", "employeePreTaxCatchUp", "employeeRothCatchUp",
  "employeeAfterTax", "employerPreTax", "employerRoth", "deductibleIra", "nondeductibleIra",
  "rothIra", "special403bCatchUp", "special457CatchUp", "hsaDeductible", "hsaEmployerOrCafeteria",
  "healthFsaSalaryReduction", "dependentCareAssistanceProvided",
];

/**
 * Values that should be rejected identically by both engines. Malformed inputs
 * are where the two validators drift, so they are generated at a deliberate
 * rate rather than left to chance.
 */
const JUNK = [
  // "0" and [] are truthy in JavaScript and falsy in PHP, so they belong here
  // deliberately: they are the values a coercing flag check disagrees about.
  null, true, false, "", " ", "0", "1", "yes", "PRETAX", "rothFirst", "Roth_First",
  "SELF_ONLY", "familyCoverage", -1, -0.5, 1.5, 2, Number.NaN, Number.POSITIVE_INFINITY,
  [], {}, [1, 2], { nested: true },
];
const junk = () => JUNK[Math.floor(random() * JUNK.length)];

function randomHsaRules() {
  const rules = {};
  if (chance(0.3)) {
    const count = integer(0, 12);
    const months = [];
    for (let month = 1; month <= 12; month += 1) {
      if (months.length < count && chance(count / 12)) {
        months.push({ month, coverage: pick(COVERAGE_TIERS) });
      }
    }
    rules.monthlyCoverage = months;
  } else if (chance(0.9)) {
    rules.coverageTier = pick(COVERAGE_TIERS);
    if (chance(0.5)) {
      const months = [];
      for (let month = 1; month <= 12; month += 1) if (chance(0.6)) months.push(month);
      rules.eligibleMonths = months;
    }
  }
  if (chance(0.25)) rules.hdhpAnnualDeductible = pick([0, 1000, 1500, 2650, 5150, 10500]);
  if (chance(0.3)) rules.useLastMonthRule = chance(0.05) ? junk() : chance(0.7);
  if (chance(0.25)) rules.testingPeriodSatisfied = chance(0.5);
  if (chance(0.15)) rules.testingPeriodFailureByDeathOrDisability = chance(0.5);
  if (chance(0.25)) rules.familyLimitShare = pick([0, 0.25, 0.5, 0.75, 1, 0.6]);
  if (chance(0.04)) rules[pick(["coverageTier", "eligibleMonths", "monthlyCoverage", "familyLimitShare", "hdhpAnnualDeductible"])] = junk();
  return rules;
}

/**
 * IRC 125(i) plan facts. The carryover and grace-period flags are generated
 * independently and at a high rate so the Notice 2013-71 mutually-exclusive
 * combination, and every incomplete supply of the pair, are all reached.
 */
function randomHealthFsaRules() {
  const rules = {};
  if (chance(0.7)) rules.purpose = chance(0.05) ? junk() : pick(HEALTH_FSA_PURPOSES);
  if (chance(0.5)) rules.offersCarryover = chance(0.05) ? junk() : chance(0.6);
  if (chance(0.4)) rules.offersGracePeriod = chance(0.05) ? junk() : chance(0.5);
  // Straddles the carryover caps ($500 fixed, then 20 percent of the limit) so
  // the lesser-of and the forfeiture both bind and both fall away.
  if (chance(0.5)) rules.priorYearUnusedAmount = pick([0, 0.01, 100, 500, 550, 570, 660, 680, 5000, money()]);
  if (chance(0.35)) rules.employerFlexCredit = pick([0, 1, 500, 2750, 3400, 10000, money()]);
  if (chance(0.6)) rules.flexCreditElectableAsCash = chance(0.05) ? junk() : chance(0.5);
  if (chance(0.25)) rules.planDocumentLimit = pick([0, 1, 500, 2500, 3400, 100000, money()]);
  if (chance(0.25)) rules.planYearIsCalendarYear = chance(0.05) ? junk() : chance(0.6);
  if (chance(0.04)) {
    rules[pick(["purpose", "offersCarryover", "priorYearUnusedAmount", "employerFlexCredit", "planDocumentLimit"])] = junk();
  }
  return rules;
}

/**
 * IRC 129 facts. Earned income is generated below, at, and above the
 * IRC 129(a)(2)(A) amounts for every encoded year so the IRC 129(b)(1)
 * limitation binds and falls away, and each of the employee-only, spouse-only
 * and neither-supplied shapes is reached.
 */
function randomDependentCareRules() {
  const rules = {};
  if (chance(0.5)) {
    rules.planDocumentLimit = chance(0.05) ? junk() : pick([0, 1, 2000, 2500, 3750, 5000, 7500, money()]);
  }
  return rules;
}

/**
 * The IRC 129(b)(1) facts live on the person, so they are generated there. The
 * values run below, at and above the IRC 129(a)(2)(A) amounts for every encoded
 * year, so the limitation binds and falls away, and the employee-only,
 * spouse-only and neither-supplied shapes are all reached across a run.
 */
function addDependentCareFactsToPerson(person) {
  if (chance(0.6)) {
    person.dependentCareEarnedIncome = chance(0.05)
      ? junk()
      : pick([0, 0.01, 1, 2500, 3750, 5000, 7500, 10500, 60000, money()]);
  }
  if (chance(0.3)) person.isStudentOrIncapableOfSelfCare = chance(0.05) ? junk() : chance(0.5);
  if (chance(0.04)) person[pick(["dependentCareEarnedIncome", "isStudentOrIncapableOfSelfCare"])] = junk();
}

function randomPlanRules(type) {
  const rules = {};
  if (chance(0.8)) rules.planCompensation = money();
  if (chance(0.2)) rules.includibleCompensation457 = money();
  if (chance(0.2)) rules.annualAdditionsGroupId = pick(["g1", "g2"]);
  if (chance(0.15)) rules.planDocumentEmployeeDeferralLimit = money();
  if (chance(0.15)) rules.planDocumentAnnualAdditionsLimit = money();
  if (chance(0.4)) rules.permitsRothContributions = chance(0.05) ? junk() : chance(0.7);
  if (chance(0.25)) rules.permitsRothCatchUp = chance(0.7);
  if (chance(0.3)) rules.permitsAfterTaxEmployeeContributions = chance(0.6);
  if (chance(0.15)) rules.permitsInPlanRothRollover = chance(0.6);
  if (chance(0.35)) rules.contributionPreference = pick(CONTRIBUTION_PREFERENCES);
  if (chance(0.3)) rules.expectedEmployerContribution = money();
  if (chance(0.25)) rules.employerMatchRate = pick([0, 0.25, 0.5, 1]);
  if (chance(0.25)) rules.employerMatchCompensationFraction = pick([0, 0.03, 0.06, 1]);
  if (chance(0.25)) rules.employerNonelectiveRate = pick([0, 0.02, 0.03, 0.1, 0.25]);
  if (chance(0.25)) rules.employerContributionTaxTreatment = pick(EMPLOYER_TAX_TREATMENTS);
  if (chance(0.2)) rules.simpleEmployerContributionMethod = pick(SIMPLE_METHODS);
  if (chance(0.1)) rules.simpleCustomEmployerContribution = money();
  if (chance(0.15)) rules.simpleEnhancedLimitEligible = chance(0.6);
  if (chance(0.2)) rules.isSelfEmployedOwner = chance(0.6);
  if (chance(0.2)) rules.netEarningsFromSelfEmploymentAfterHalfSETax = money();
  if (chance(0.15)) {
    rules.special403bCatchUp = {
      eligible: chance(0.8),
      yearsOfService: integer(0, 30),
      priorElectiveDeferrals: money(),
      priorSpecialCatchUpUsed: money(),
    };
  }
  if (chance(0.15)) {
    rules.section457SpecialCatchUp = { eligible: chance(0.8), unusedDeferralsFromPriorYears: money() };
  }
  if (chance(0.1)) rules.grandfatheredSarsep = chance(0.5);
  if (chance(0.1)) rules.simpleAdditionalNonelectiveContribution = money();
  // Present most of the time on a pension-linked emergency savings account and
  // occasionally elsewhere, so both the supplied and the missing branch of the
  // IRC 402A(e)(3)(A) balance rule are differentially tested.
  if (type === "pension_linked_emergency_savings" ? chance(0.7) : chance(0.08)) {
    rules.pensionLinkedEmergencySavingsParticipantContributionBalance = chance(0.05) ? junk() : money();
  }
  if (type === "hsa" || chance(0.05)) rules.hsa = randomHsaRules();
  if (type === "health_fsa" || chance(0.05)) rules.healthFsa = randomHealthFsaRules();
  if (type === "dependent_care_fsa" || chance(0.05)) rules.dependentCareFsa = randomDependentCareRules();
  if (chance(0.04)) {
    rules[pick([
      "planCompensation", "employerMatchRate", "employerNonelectiveRate",
      "contributionPreference", "employerContributionTaxTreatment",
      "simpleEmployerContributionMethod", "expectedEmployerContribution",
    ])] = junk();
  }
  return rules;
}

function randomExisting() {
  const existing = {};
  for (const key of EXISTING_KEYS) if (chance(0.12)) existing[key] = money();
  if (chance(0.03)) existing[pick(EXISTING_KEYS)] = junk();
  return existing;
}

function randomPerson(id, role, taxYear) {
  const person = { id, role };
  addDependentCareFactsToPerson(person);
  if (chance(0.9)) {
    if (chance(0.5)) person.birthYear = integer(taxYear - 85, taxYear - 18);
    else person.birthDate = `${integer(taxYear - 85, taxYear - 18)}-${String(integer(1, 12)).padStart(2, "0")}-${String(integer(1, 28)).padStart(2, "0")}`;
  }
  if (chance(0.8)) {
    person.compensation = {};
    if (chance(0.8)) person.compensation.w2Compensation = money();
    if (chance(0.4)) person.compensation.iraCompensation = money();
    if (chance(0.3)) person.compensation.selfEmploymentNetEarnings = money();
  }
  if (chance(0.6)) {
    person.magi = {};
    if (chance(0.8)) person.magi.rothIra = money();
    if (chance(0.8)) person.magi.traditionalIraDeduction = money();
    if (chance(0.3)) person.magi.rothConversion = money();
  }
  if (chance(0.5)) person.coveredByEmployerRetirementPlan = chance(0.05) ? junk() : chance(0.6);
  if (chance(0.3)) person.livedWithSpouseDuringYear = chance(0.5);
  if (chance(0.15)) person.priorYearFicaWagesByEmployer = { e1: money() };
  if (chance(0.2)) person.traditionalSepSimpleIraBasis = money();
  if (chance(0.2)) person.yearEndTraditionalSepSimpleIraValue = money();
  if (chance(0.1)) person.otherTraditionalSepSimpleIraDistributions = money();
  if (chance(0.3)) person.archerMsaContributions = chance(0.05) ? junk() : pick([0, 1, 750, 2400, 5150, 12000, money()]);
  // IRC 223(b)(4)(C). Values straddle the IRC 223(b)(1) limitation so the
  // reduction lands wholly inside it, spills into the IRC 223(b)(3) amount, and
  // exhausts both.
  if (chance(0.3)) {
    person.qualifiedHsaFundingDistributions = chance(0.05) ? junk() : pick([0, 1, 900, 3400, 4400, 8750, 20000, money()]);
  }
  // Person-level IRC 223(c)(2) coverage. randomHsaRules() also emits the
  // account-only keys, which both engines must ignore identically here.
  if (chance(0.3)) person.hsaCoverage = chance(0.1) ? {} : randomHsaRules();
  if (chance(0.03)) person[pick(["birthYear", "role", "compensation", "magi", "coveredByEmployerRetirementPlan"])] = junk();
  return person;
}

function randomScenario() {
  const hsaHeavy = chance(0.35);
  const fsaHeavy = chance(0.3);
  const taxYear = hsaHeavy
    ? integer(2002, 2028)
    : fsaHeavy
      ? pick([integer(1979, 1990), integer(2009, 2028)])
      : pick([integer(1973, 1980), integer(1981, 2000), integer(2001, 2015), integer(2016, 2028)]);
  const filingStatus = pick(FILING_STATUSES);
  const personCount = chance(0.55) ? 2 : 1;
  const persons = [randomPerson("t", "taxpayer", taxYear)];
  if (personCount === 2) persons.push(randomPerson("s", chance(0.9) ? "spouse" : "other", taxYear));

  const accounts = [];
  const accountCount = integer(0, 3);
  for (let index = 0; index < accountCount; index += 1) {
    const type = hsaHeavy && chance(0.7)
      ? "hsa"
      : fsaHeavy && chance(0.8)
        ? pick(["health_fsa", "dependent_care_fsa", "dependent_care_fsa", "hsa"])
        : pick(ACCOUNT_TYPES);
    const account = {
      id: `a${index}`,
      ownerId: chance(0.03) ? "ghost" : pick(persons).id,
      type: chance(0.03) ? pick(["401K", "not_a_type", "", "hsa "]) : type,
    };
    if (chance(0.3)) account.employerId = pick(["e1", "e2"]);
    if (chance(0.3)) account.priority = integer(1, 200);
    if (chance(0.85)) account.planRules = randomPlanRules(type);
    if (chance(0.4)) account.existingContributions = randomExisting();
    accounts.push(account);
  }

  const scenario = { taxYear, filingStatus, persons, accounts };

  if (chance(0.25)) {
    const conversions = [];
    for (let index = 0; index < integer(1, 2); index += 1) {
      const conversion = {
        id: `c${index}`,
        ownerId: chance(0.1) ? undefined : pick(persons).id,
        type: chance(0.05) ? "not_a_conversion" : pick(CONVERSION_TYPES),
        amount: money(),
      };
      if (conversion.ownerId === undefined) delete conversion.ownerId;
      if (chance(0.3)) conversion.afterTaxBasisInConvertedAmount = money();
      if (chance(0.3)) conversion.aggregateIraBasisOverride = money();
      if (chance(0.3)) conversion.yearEndAggregateIraValueOverride = money();
      if (chance(0.2)) conversion.otherwiseDistributableAmount = chance(0.5);
      if (chance(0.2)) conversion.sourceAccountId = accounts.length > 0 && chance(0.7) ? accounts[0].id : "missing";
      conversions.push(conversion);
    }
    scenario.conversions = conversions;
  }

  // Structurally malformed scenarios: the shape checks themselves must agree.
  if (chance(0.03)) scenario.persons = chance(0.5) ? [junk()] : junk();
  if (chance(0.03)) scenario.accounts = chance(0.5) ? [junk()] : junk();
  if (chance(0.02)) scenario.conversions = chance(0.5) ? [junk()] : junk();
  if (chance(0.02)) scenario.taxYear = junk();
  if (chance(0.02)) scenario.filingStatus = junk();

  return scenario;
}

function runTypeScript(input) {
  try {
    return USTaxAdvantagedParams.calculate(input);
  } catch (error) {
    if (error instanceof Error && typeof error.code === "string") {
      return { __error: { code: error.code, message: error.message } };
    }
    return { __throw: `${error?.constructor?.name ?? "Error"}: ${error?.message ?? String(error)}` };
  }
}

function runPhp(inputs) {
  const php = spawnSync("php", [join(root, "scripts/fuzz-parity-runner.php")], {
    cwd: root,
    input: JSON.stringify(inputs),
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  if (php.error) throw php.error;
  if (php.status !== 0) {
    throw new Error(`fuzz-parity-runner exited ${php.status}:\n${php.stderr}`);
  }
  return JSON.parse(php.stdout);
}

/** First path at which two JSON-serializable values differ, or null. */
function firstDifference(left, right, path = "") {
  if (Object.is(left, right)) return null;
  const leftIsObject = left !== null && typeof left === "object";
  const rightIsObject = right !== null && typeof right === "object";
  if (!leftIsObject || !rightIsObject) {
    return { path: path || "<root>", left, right };
  }
  if (Array.isArray(left) !== Array.isArray(right)) {
    return { path: path || "<root>", left, right };
  }
  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])];
  for (const key of keys) {
    const next = Array.isArray(left) ? `${path}[${key}]` : path ? `${path}.${key}` : key;
    const difference = firstDifference(left[key], right[key], next);
    if (difference !== null) return difference;
  }
  return null;
}

/**
 * JSON round-trip. PHP emits its result through json_encode, so comparing the
 * TypeScript object directly would report differences that are artifacts of
 * `undefined` keys rather than real divergence — the same normalization the
 * parity runner already applies to the PHP side.
 */
const serializable = (value) => JSON.parse(JSON.stringify(value));

const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
console.log(
  `fuzz-parity: ${caseCount} cases, seed ${seed} (replay with --seed=${seed}), engine ${packageJson.version}`,
);

const maxReported = parseOption("report", 5);
/** Array indices collapsed, so repeats of one bug group into one signature. */
const signatureOf = (path) => path.replace(/\[\d+\]/g, "[]");
const truncate = (value, limit = 400) => {
  const text = JSON.stringify(value) ?? "undefined";
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

let compared = 0;
let errorCases = 0;
const failures = [];
const signatures = new Map();

for (let start = 0; start < caseCount; start += batchSize) {
  const size = Math.min(batchSize, caseCount - start);
  /*
   * Round-trip every generated scenario through JSON before either engine sees
   * it. PHP receives the input as JSON, so handing TypeScript the live object
   * would let values JSON cannot carry — NaN and Infinity both serialize to
   * null — reach one engine and not the other, and report a harness artifact
   * as a divergence.
   */
  const inputs = Array.from({ length: size }, () => JSON.parse(JSON.stringify(randomScenario())));
  const tsResults = inputs.map((input) => runTypeScript(input));
  const phpResults = runPhp(inputs);
  for (let index = 0; index < size; index += 1) {
    const tsResult = serializable(tsResults[index]);
    const phpResult = phpResults[index];
    if (tsResult?.__error) errorCases += 1;
    compared += 1;
    const difference = firstDifference(tsResult, phpResult);
    if (difference === null) continue;
    const signature = signatureOf(difference.path);
    const seen = signatures.get(signature) ?? 0;
    signatures.set(signature, seen + 1);
    // One worked example per distinct signature, so a single run shows every
    // kind of divergence rather than five repeats of the loudest one.
    if (seen === 0 && failures.length < maxReported) {
      failures.push({ caseIndex: start + index, signature, input: inputs[index], difference, tsResult, phpResult });
    }
  }
}

if (signatures.size > 0) {
  for (const failure of failures) {
    console.error(`\n=== TypeScript/PHP divergence [${failure.signature}], case ${failure.caseIndex} (seed ${seed}) ===`);
    console.error(`path: ${failure.difference.path}`);
    console.error(`  TS : ${truncate(failure.difference.left)}`);
    console.error(`  PHP: ${truncate(failure.difference.right)}`);
    console.error(`  TS result : ${truncate(failure.tsResult, 300)}`);
    console.error(`  PHP result: ${truncate(failure.phpResult, 300)}`);
    console.error(`input: ${JSON.stringify(failure.input)}`);
  }
  const divergent = [...signatures.values()].reduce((sum, count) => sum + count, 0);
  console.error("\ndivergence signatures:");
  for (const [signature, count] of [...signatures].sort((a, b) => b[1] - a[1])) {
    console.error(`  ${String(count).padStart(5)}  ${signature}`);
  }
  console.error(
    `\nfuzz-parity FAILED: ${divergent} divergent case(s) out of ${compared} compared. Replay with --seed=${seed}.`,
  );
  process.exit(1);
}

console.log(
  `fuzz-parity passed: ${compared} randomized scenarios agreed byte for byte (${errorCases} rejected identically by both engines).`,
);
