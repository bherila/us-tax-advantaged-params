import test from "node:test";
import assert from "node:assert/strict";
import USARetirementAccountParameters, {
  AccountType,
  CalculationStatus,
  ConversionType,
  FilingStatus,
  RetirementParameterError,
  UnsupportedTaxYearError,
} from "../src/USARetirementAccountParameters.js";

const U = USARetirementAccountParameters;

function account(result: ReturnType<typeof U.calculate>, id: string) {
  const found = result.accounts.find((entry) => entry.accountId === id);
  assert.ok(found, `Missing account result ${id}`);
  return found;
}

test("supports the first general IRA year through the generated year without extrapolation", () => {
  assert.deepEqual(U.supportedTaxYears(), { minimum: 1975, maximum: 2026 });
  assert.equal(U.parametersForYear(1975).ira.baseContributionLimit, 1_500);
  assert.equal(U.parametersForYear(2026).ira.baseContributionLimit, 7_500);
  assert.throws(() => U.parametersForYear(2027), (error: unknown) => error instanceof UnsupportedTaxYearError);
});

test("normalizes common filing-status and account aliases", () => {
  assert.equal(U.normalizeFilingStatus("S"), FilingStatus.SINGLE);
  assert.equal(U.normalizeFilingStatus("MFJ"), FilingStatus.MARRIED_FILING_JOINTLY);
  assert.equal(U.normalizeFilingStatus("HOH"), FilingStatus.HEAD_OF_HOUSEHOLD);
  assert.equal(U.normalizeAccountType("401(k)"), AccountType.TRADITIONAL_401K);
  assert.equal(U.normalizeAccountType("457b"), AccountType.GOVERNMENTAL_457B);
});

test("2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity", () => {
  const result = U.forTaxYear(2026)
    .filingStatus("S")
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(200_000))
    .account("k", "t", "401k", (plan) => plan.employer("e").planCompensation(200_000))
    .calculate();
  const k = account(result, "k");
  assert.equal(k.statutoryMaximumAnnualContribution, 72_000);
  assert.equal(k.maximumAnnualContributionBasedOnInputs, 24_500);
  assert.equal(k.planTermDependentCapacity, 47_500);
  assert.equal(k.contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(k.status, CalculationStatus.DETERMINATE_WITH_ASSUMPTIONS);
});

test("2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold", () => {
  const result = U.forTaxYear(2026)
    .filingStatus("S")
    .taxpayer("t", (person) =>
      person.bornIn(1965).w2Compensation(250_000).priorYearFicaWages("e", 150_001),
    )
    .account("k", "t", AccountType.TRADITIONAL_401K, (plan) =>
      plan
        .employer("e")
        .planCompensation(250_000)
        .permitsRothContributions()
        .permitsRothCatchUp(),
    )
    .calculate();
  const k = account(result, "k");
  assert.equal(k.contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(k.contributionComponents.employeeRothCatchUp, 11_250);
  assert.equal(k.contributionComponents.employeePreTaxCatchUp, 0);
  assert.equal(k.maximumAnnualContributionBasedOnInputs, 35_750);
});

test("high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) =>
      person.bornIn(1965).w2Compensation(250_000).priorYearFicaWages("e", 200_000),
    )
    .account("k", "t", "401k", (plan) => plan.employer("e").planCompensation(250_000))
    .calculate();
  const k = account(result, "k");
  assert.equal(k.contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(k.contributionComponents.employeePreTaxCatchUp, 0);
  assert.equal(k.contributionComponents.employeeRothCatchUp, 0);
  assert.ok(k.diagnostics.some((entry) => entry.code === "HIGH_WAGE_CATCH_UP_REQUIRES_ROTH_BUT_PLAN_DOES_NOT_OFFER_IT"));
});

test("2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method", () => {
  const result = U.forTaxYear(2026)
    .filingStatus("MFJ")
    .taxpayer("t", (person) =>
      person.bornIn(1980).iraCompensation(100_000).rothIraMagi(247_000).coveredByEmployerPlan(false),
    )
    .spouse("s", (person) =>
      person.bornIn(1980).iraCompensation(100_000).rothIraMagi(247_000).coveredByEmployerPlan(false),
    )
    .account("roth", "t", AccountType.ROTH_IRA)
    .calculate();
  assert.equal(account(result, "roth").contributionComponents.rothIra, 3_750);
});

test("2026 active-participant traditional IRA deduction phases out while total contribution remains available", () => {
  const result = U.forTaxYear(2026)
    .filingStatus("MFJ")
    .taxpayer("t", (person) =>
      person
        .bornIn(1980)
        .iraCompensation(100_000)
        .traditionalIraDeductionMagi(139_000)
        .coveredByEmployerPlan(true),
    )
    .spouse("s", (person) =>
      person.bornIn(1980).iraCompensation(100_000).coveredByEmployerPlan(false),
    )
    .account("ira", "t", AccountType.TRADITIONAL_IRA)
    .calculate();
  const ira = account(result, "ira");
  assert.equal(ira.contributionComponents.deductibleIra, 3_750);
  assert.equal(ira.contributionComponents.nondeductibleIra, 3_750);
  assert.equal(ira.maximumAnnualContributionBasedOnInputs, 7_500);
});

test("traditional and Roth IRAs share one owner-level contribution pool", () => {
  const result = U.forTaxYear(2026)
    .filingStatus("S")
    .taxpayer("t", (person) =>
      person
        .bornIn(1980)
        .iraCompensation(100_000)
        .rothIraMagi(158_000)
        .traditionalIraDeductionMagi(50_000)
        .coveredByEmployerPlan(false),
    )
    .account("roth", "t", AccountType.ROTH_IRA, (plan) => plan.priority(1))
    .account("traditional", "t", AccountType.TRADITIONAL_IRA, (plan) => plan.priority(2))
    .calculate();
  assert.equal(account(result, "roth").contributionComponents.rothIra, 5_000);
  assert.equal(account(result, "traditional").contributionComponents.deductibleIra, 2_500);
  assert.equal(result.totals.deductibleIraContribution + account(result, "roth").contributionComponents.rothIra, 7_500);
});

test("401(k) and 457(b) employee limits are separate", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(200_000))
    .account("k", "t", "401k", (plan) => plan.employer("private").planCompensation(200_000))
    .account("g457", "t", "457b", (plan) =>
      plan.employer("government").includible457Compensation(200_000),
    )
    .calculate();
  assert.equal(account(result, "k").contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(account(result, "g457").contributionComponents.employeePreTaxDeferral, 24_500);
});

test("two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(300_000))
    .account("first", "t", "401k", (plan) => plan.employer("a").planCompensation(150_000).priority(1))
    .account("second", "t", "401k", (plan) => plan.employer("b").planCompensation(150_000).priority(2))
    .calculate();
  assert.equal(account(result, "first").contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(account(result, "second").contributionComponents.employeePreTaxDeferral, 0);
  assert.ok(account(result, "first").sharedLimits.some((limit) => limit.legalLimit.includes("402(g)")));
});

test("mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(200_000))
    .account("k", "t", "401k", (plan) =>
      plan
        .employer("e")
        .planCompensation(200_000)
        .expectedEmployerContribution(10_000)
        .permitsAfterTaxContributions(),
    )
    .calculate();
  const k = account(result, "k");
  assert.equal(k.contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(k.contributionComponents.employerPreTax, 10_000);
  assert.equal(k.contributionComponents.employeeAfterTax, 37_500);
  assert.equal(k.maximumAnnualContributionBasedOnInputs, 72_000);
});

test("self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).selfEmploymentNetEarnings(200_000))
    .account("solo", "t", AccountType.SOLO_401K, (plan) =>
      plan.selfEmployedOwner(200_000).planCompensation(200_000).permitsAfterTaxContributions(),
    )
    .calculate();
  const solo = account(result, "solo");
  assert.equal(solo.contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(solo.contributionComponents.employerPreTax, 40_000);
  assert.equal(solo.contributionComponents.employeeAfterTax, 7_500);
  assert.equal(solo.maximumAnnualContributionBasedOnInputs, 72_000);
});

test("self-employed SEP maximum uses the reduced 20% net-earnings rate", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).selfEmploymentNetEarnings(200_000))
    .account("sep", "t", AccountType.SEP_IRA, (plan) =>
      plan.selfEmployedOwner(200_000).planCompensation(200_000),
    )
    .calculate();
  assert.equal(account(result, "sep").contributionComponents.employerPreTax, 40_000);
});

test("403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(200_000))
    .account("b", "t", "403b", (plan) =>
      plan
        .employer("school")
        .planCompensation(200_000)
        .special403bCatchUp({
          eligible: true,
          yearsOfService: 15,
          priorElectiveDeferrals: 20_000,
          priorSpecialCatchUpUsed: 0,
        }),
    )
    .calculate();
  const b = account(result, "b");
  assert.equal(b.contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(b.contributionComponents.special403bCatchUp, 3_000);
});

test("457(b) last-three-years catch-up is selected when larger than the age catch-up", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) =>
      person.bornIn(1970).w2Compensation(150_000).priorYearFicaWages("gov", 100_000),
    )
    .account("g457", "t", AccountType.GOVERNMENTAL_457B, (plan) =>
      plan
        .employer("gov")
        .includible457Compensation(150_000)
        .special457CatchUp({ eligible: true, unusedDeferralsFromPriorYears: 30_000 }),
    )
    .calculate();
  const g457 = account(result, "g457");
  assert.equal(g457.contributionComponents.employeePreTaxDeferral, 24_500);
  assert.equal(g457.contributionComponents.special457CatchUp, 24_500);
  assert.equal(g457.maximumAnnualContributionBasedOnInputs, 49_000);
});

test("1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values", () => {
  const result = U.forTaxYear(1994)
    .taxpayer("t", (person) => person.bornIn(1960).w2Compensation(100_000))
    .account("k", "t", "401k", (plan) => plan.employer("e").planCompensation(100_000))
    .calculate();
  const k = account(result, "k");
  assert.equal(k.contributionComponents.employeePreTaxDeferral, 9_240);
  assert.equal(k.statutoryMaximumAnnualContribution, 25_000);
});

test("pre-1987 401(k) maximum is explicitly indeterminate rather than invented", () => {
  const result = U.forTaxYear(1985)
    .taxpayer("t", (person) => person.bornIn(1950).w2Compensation(100_000))
    .account("k", "t", "401k", (plan) => plan.employer("e").planCompensation(100_000))
    .calculate();
  const k = account(result, "k");
  assert.equal(k.status, CalculationStatus.INDETERMINATE);
  assert.equal(k.statutoryMaximumAnnualContribution, null);
});

test("1981 active employer-plan participant is ineligible for the modeled IRA contribution", () => {
  const result = U.forTaxYear(1981)
    .taxpayer("t", (person) =>
      person.bornIn(1950).iraCompensation(20_000).coveredByEmployerPlan(true),
    )
    .account("ira", "t", AccountType.TRADITIONAL_IRA)
    .calculate();
  assert.equal(account(result, "ira").maximumAnnualContributionBasedOnInputs, 0);
  assert.equal(account(result, "ira").status, CalculationStatus.INELIGIBLE);
});

test("1982 one-earner spousal IRA preserves the historical $250 nonworking-spouse cap", () => {
  const result = U.forTaxYear(1982)
    .filingStatus("MFJ")
    .taxpayer("t", (person) =>
      person.bornIn(1950).iraCompensation(20_000).coveredByEmployerPlan(true),
    )
    .spouse("s", (person) =>
      person.bornIn(1950).iraCompensation(0).coveredByEmployerPlan(false),
    )
    .account("spouse-ira", "s", AccountType.TRADITIONAL_IRA)
    .calculate();
  assert.equal(account(result, "spouse-ira").contributionComponents.deductibleIra, 250);
});

test("pre-2020 traditional IRA age-70½ restriction is enforced", () => {
  const result = U.forTaxYear(2019)
    .taxpayer("t", (person) =>
      person.bornOn("1948-01-01").iraCompensation(100_000).coveredByEmployerPlan(false),
    )
    .account("ira", "t", AccountType.TRADITIONAL_IRA)
    .calculate();
  assert.equal(account(result, "ira").status, CalculationStatus.INELIGIBLE);
  assert.equal(account(result, "ira").maximumAnnualContributionBasedOnInputs, 0);
});

test("IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) =>
      person
        .bornIn(1980)
        .aggregateTraditionalSepSimpleIraBasis(20_000)
        .yearEndTraditionalSepSimpleIraValue(80_000)
        .otherTraditionalSepSimpleIraDistributions(0),
    )
    .conversion("c", "t", ConversionType.IRA_TO_ROTH_IRA, 20_000)
    .calculate();
  const conversion = result.conversions[0];
  assert.equal(conversion.nontaxableBasisAmount, 4_000);
  assert.equal(conversion.taxableAmount, 16_000);
  assert.equal(conversion.consumesAnnualContributionLimit, false);
});

test("in-plan Roth rollover reports only the pre-tax portion as taxable", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(100_000))
    .account("k", "t", "401k", (plan) =>
      plan.employer("e").planCompensation(100_000).permitsInPlanRothRollover(),
    )
    .conversion("c", "t", ConversionType.IN_PLAN_ROTH_ROLLOVER, 50_000, (conversion) =>
      conversion.sourceAccount("k").afterTaxBasis(10_000),
    )
    .calculate();
  assert.equal(result.conversions[0].taxableAmount, 40_000);
  assert.equal(result.conversions[0].nontaxableBasisAmount, 10_000);
});

test("defined-benefit and cash-balance contributions remain actuarially indeterminate", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(200_000))
    .account("cb", "t", AccountType.CASH_BALANCE_PLAN, (plan) => plan.employer("e"))
    .calculate();
  assert.equal(account(result, "cb").statutoryMaximumAnnualContribution, null);
  assert.equal(account(result, "cb").status, CalculationStatus.INDETERMINATE);
});

test("2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) =>
      person.bornIn(1965).w2Compensation(100_000).priorYearFicaWages("e", 100_000),
    )
    .account("simple", "t", AccountType.SIMPLE_IRA, (plan) =>
      plan
        .employer("e")
        .planCompensation(100_000)
        .simpleEnhancedLimitEligible()
        .simpleEmployerMethod("match_3_percent"),
    )
    .calculate();
  const simple = account(result, "simple");
  assert.equal(simple.contributionComponents.employeePreTaxDeferral, 18_100);
  assert.equal(simple.contributionComponents.employeePreTaxCatchUp, 5_250);
  assert.equal(simple.contributionComponents.employerPreTax, 3_000);
  assert.equal(simple.maximumAnnualContributionBasedOnInputs, 26_350);
});

test("self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) =>
      person
        .bornIn(1980)
        .selfEmploymentNetEarnings(200_000)
        .iraCompensation(200_000)
        .traditionalIraDeductionMagi(50_000)
        .coveredByEmployerPlan(false),
    )
    .account("solo", "t", AccountType.SOLO_401K, (plan) =>
      plan.selfEmployedOwner(200_000).planCompensation(200_000),
    )
    .account("ira", "t", AccountType.TRADITIONAL_IRA)
    .calculate();
  assert.equal(account(result, "solo").federalTaxEffects.selfEmployedRetirementDeduction, 64_500);
  assert.equal(account(result, "solo").federalTaxEffects.federalAgiReduction, 64_500);
  assert.equal(account(result, "ira").federalTaxEffects.selfEmployedRetirementDeduction, 0);
  assert.equal(account(result, "ira").federalTaxEffects.federalAgiReduction, 7_500);
});

test("pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling", () => {
  const result = U.forTaxYear(2009)
    .filingStatus(FilingStatus.MARRIED_FILING_SEPARATELY)
    .taxpayer("t", (person) =>
      person
        .bornIn(1980)
        .livedWithSpouseDuringYear(false)
        .rothConversionMagi(90_000)
        .aggregateTraditionalSepSimpleIraBasis(10_000)
        .yearEndTraditionalSepSimpleIraValue(10_000),
    )
    .conversion("c", "t", ConversionType.IRA_TO_ROTH_IRA, 10_000)
    .calculate();
  assert.equal(result.conversions[0].status, CalculationStatus.DETERMINATE);
  assert.equal(result.conversions[0].nontaxableBasisAmount, 5_000);
  assert.equal(result.conversions[0].taxableAmount, 5_000);
});

test("additional SIMPLE nonelective contribution is capped by 10% of recognized compensation", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(20_000))
    .account("simple", "t", AccountType.SIMPLE_IRA, (plan) =>
      plan
        .employer("e")
        .planCompensation(20_000)
        .simpleEmployerMethod("nonelective_2_percent")
        .simpleAdditionalNonelectiveContribution(5_300),
    )
    .calculate();
  const simple = account(result, "simple");
  assert.equal(simple.contributionComponents.employerPreTax, 2_400);
  assert.equal(simple.statutoryMaximumAnnualContribution, 19_600);
  assert.ok(simple.diagnostics.some((entry) => entry.code === "SIMPLE_ADDITIONAL_NONELECTIVE_CONTRIBUTION_CAPPED"));
});

test("SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1965).w2Compensation(100_000))
    .account("simple", "t", AccountType.SIMPLE_IRA, (plan) =>
      plan.employer("e").planCompensation(100_000).simpleEmployerMethod("match_3_percent"),
    )
    .calculate();
  const simple = account(result, "simple");
  assert.equal(simple.contributionComponents.employeePreTaxCatchUp, 5_250);
  assert.equal(simple.contributionComponents.employeeRothCatchUp, 0);
  assert.ok(!simple.diagnostics.some((entry) => entry.code.includes("ROTH_CATCH_UP")));
});

test("multiple 403(b) accounts share one owner-level 15-year catch-up pool", () => {
  const special = {
    eligible: true,
    yearsOfService: 15,
    priorElectiveDeferrals: 20_000,
    priorSpecialCatchUpUsed: 0,
  };
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(300_000))
    .account("first", "t", AccountType.TRADITIONAL_403B, (plan) =>
      plan.employer("school-a").planCompensation(150_000).priority(1).special403bCatchUp(special),
    )
    .account("second", "t", AccountType.TRADITIONAL_403B, (plan) =>
      plan.employer("school-b").planCompensation(150_000).priority(2).special403bCatchUp(special),
    )
    .calculate();
  assert.equal(account(result, "first").contributionComponents.special403bCatchUp, 3_000);
  assert.equal(account(result, "second").contributionComponents.special403bCatchUp, 0);
  assert.equal(
    account(result, "first").contributionComponents.special403bCatchUp +
      account(result, "second").contributionComponents.special403bCatchUp,
    3_000,
  );
});

test("Roth employer contributions are rejected before their 2023 effective year", () => {
  const result = U.forTaxYear(2022)
    .taxpayer("t", (person) => person.bornIn(1980).w2Compensation(100_000))
    .account("k", "t", AccountType.TRADITIONAL_401K, (plan) =>
      plan
        .employer("e")
        .planCompensation(100_000)
        .expectedEmployerContribution(10_000, "roth"),
    )
    .calculate();
  const k = account(result, "k");
  assert.equal(k.contributionComponents.employerRoth, 0);
  assert.equal(k.status, CalculationStatus.INDETERMINATE);
  assert.ok(k.diagnostics.some((entry) => entry.code === "ROTH_EMPLOYER_CONTRIBUTIONS_NOT_AVAILABLE_FOR_YEAR"));
});

test("multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation", () => {
  const result = U.forTaxYear(2026)
    .taxpayer("t", (person) =>
      person
        .bornIn(1980)
        .aggregateTraditionalSepSimpleIraBasis(1)
        .yearEndTraditionalSepSimpleIraValue(147),
    )
    .conversion("c1", "t", ConversionType.IRA_TO_ROTH_IRA, 1)
    .conversion("c2", "t", ConversionType.IRA_TO_ROTH_IRA, 1)
    .conversion("c3", "t", ConversionType.IRA_TO_ROTH_IRA, 1)
    .calculate();
  assert.deepEqual(result.conversions.map((entry) => entry.nontaxableBasisAmount), [0.01, 0.01, 0]);
  assert.equal(
    result.conversions.reduce((sum, entry) => sum + (entry.nontaxableBasisAmount ?? 0), 0),
    0.02,
  );
});

test("duplicate taxpayer or spouse roles are rejected", () => {
  assert.throws(
    () =>
      U.calculate({
        taxYear: 2026,
        filingStatus: "MFJ",
        persons: [
          { id: "t1", role: "taxpayer", birthYear: 1980 },
          { id: "t2", role: "taxpayer", birthYear: 1981 },
        ],
        accounts: [],
      }),
    (error: unknown) => error instanceof RetirementParameterError && error.code === "DUPLICATE_PERSON_ROLE",
  );
});

test("ambiguous M alias is accepted but produces a diagnostic", () => {
  const result = U.forTaxYear(2026)
    .filingStatus("M")
    .taxpayer("t", (person) => person.bornIn(1980))
    .spouse("s", (person) => person.bornIn(1980))
    .calculate();
  assert.equal(result.filingStatus, FilingStatus.MARRIED_FILING_JOINTLY);
  assert.ok(result.diagnostics.some((entry) => entry.code === "AMBIGUOUS_M_ALIAS_ASSUMED_MFJ"));
});

test("1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate", () => {
  const result = U.forTaxYear(1997)
    .taxpayer("t", (person) => person.bornIn(1960).w2Compensation(500_000))
    .account("sep", "t", AccountType.SEP_IRA, (plan) =>
      plan.employer("e").planCompensation(500_000),
    )
    .calculate();
  const sep = account(result, "sep");
  assert.equal(sep.statutoryMaximumAnnualContribution, 24_000);
  assert.equal(sep.contributionComponents.employerPreTax, 24_000);
});

test("1997 employer nonelective formula applies the 401(a)(17) compensation ceiling", () => {
  const result = U.forTaxYear(1997)
    .taxpayer("t", (person) => person.bornIn(1960).w2Compensation(500_000))
    .account("profit-sharing", "t", AccountType.PROFIT_SHARING_PLAN, (plan) =>
      plan.employer("e").planCompensation(500_000).employerNonelective(0.15),
    )
    .calculate();
  const plan = account(result, "profit-sharing");
  assert.equal(plan.statutoryMaximumAnnualContribution, 30_000);
  assert.equal(plan.contributionComponents.employerPreTax, 24_000);
});

test("1997 employer match uses recognized compensation without capping employee elective deferrals", () => {
  const result = U.forTaxYear(1997)
    .taxpayer("t", (person) => person.bornIn(1960).w2Compensation(500_000))
    .account("k", "t", AccountType.TRADITIONAL_401K, (plan) =>
      plan.employer("e").planCompensation(500_000).employerMatch(1, 0.01),
    )
    .calculate();
  const k = account(result, "k");
  assert.equal(k.contributionComponents.employeePreTaxDeferral, 9_500);
  assert.equal(k.contributionComponents.employerPreTax, 1_600);
});

test("1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings", () => {
  const result = U.forTaxYear(1997)
    .taxpayer("t", (person) => person.bornIn(1960).selfEmploymentNetEarnings(500_000))
    .account("sep", "t", AccountType.SEP_IRA, (plan) =>
      plan.employer("sole-proprietor").selfEmployedOwner(500_000).planCompensation(500_000),
    )
    .calculate();
  const sep = account(result, "sep");
  assert.equal(sep.statutoryMaximumAnnualContribution, 24_000);
  assert.equal(sep.contributionComponents.employerPreTax, 24_000);
});

test("1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings", () => {
  const result = U.forTaxYear(1997)
    .taxpayer("t", (person) => person.bornIn(1960).selfEmploymentNetEarnings(500_000))
    .account("profit-sharing", "t", AccountType.PROFIT_SHARING_PLAN, (plan) =>
      plan
        .employer("sole-proprietor")
        .selfEmployedOwner(500_000)
        .planCompensation(500_000),
    )
    .calculate();
  const plan = account(result, "profit-sharing");
  assert.equal(plan.statutoryMaximumAnnualContribution, 30_000);
  assert.equal(plan.contributionComponents.employerPreTax, 24_000);
});
