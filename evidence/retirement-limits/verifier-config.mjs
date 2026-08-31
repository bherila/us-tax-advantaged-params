/**
 * Declarative mapping from evidence/retirement-limits/primary-values.json onto
 * data/retirement-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * Declarations only — the comparison engine, the UNCOVERED gap detection, the
 * report format, and the exit convention live in the verifier and are shared
 * with every other corpus.
 */
export default {
  data: "data/retirement-parameters.json",
  evidence: "evidence/retirement-limits/primary-values.json",

  /**
   * Scalar figures, keyed by the primary-values field name. `path` is resolved
   * against the year block in data/retirement-parameters.json.
   *
   * Fields the package does not model are listed in `unmodelled` below rather
   * than omitted silently, so that a parameter gaining coverage is a visible
   * change here instead of passing unnoticed.
   */
  scalars: [
    ["annualAdditions_415c1A", ["annualAdditions415c"], "IRC 415(c)(1)(A)"],
    ["annualAdditionsCompensationFraction_415c1B", ["annualAdditionsCompensationFraction"], "IRC 415(c)(1)(B)"],
    ["electiveDeferral_402g1", ["electiveDeferral402g"], "IRC 402(g)(1)"],
    ["special403bAnnualCatchUp_402g7Ai", ["special403b15YearCatchUp", "annualLimit"], "IRC 402(g)(7)(A)(i)"],
    ["special403bLifetimeCatchUp_402g7Aii", ["special403b15YearCatchUp", "lifetimeLimit"], "IRC 402(g)(7)(A)(ii)"],
    ["special403bServiceLimit_402g7Aiii", ["special403b15YearCatchUp", "serviceLimitPerYear"], "IRC 402(g)(7)(A)(iii)"],
    ["section457b_457e15", ["section457b", "baseDeferralLimit"], "IRC 457(e)(15)"],
    ["section457bIncludibleCompensationFraction_457b2B", ["section457b", "includibleCompensationFraction"], "IRC 457(b)(2)(B)"],
    ["catchUp50_414v2Bi", ["generalAge50CatchUp"], "IRC 414(v)(2)(B)(i)"],
    ["catchUp60To63_414v2Ei", ["age60To63CatchUp"], "IRC 414(v)(2)(E)(i)"],
    ["rothCatchUpWageThreshold_414v7A", ["rothCatchUpPriorYearFicaWageThreshold"], "IRC 414(v)(7)(A)"],
    ["compensationLimit_401a17", ["annualCompensation401a17"], "IRC 401(a)(17)"],
    ["iraContribution_219b5A", ["ira", "baseContributionLimit"], "IRC 219(b)(5)(A)"],
    ["iraContribution_219b1", ["ira", "baseContributionLimit"], "IRC 219(b)(1) (historical text)"],
    ["iraCompensationFraction_219b1", ["ira", "compensationFraction"], "IRC 219(b)(1) (historical text)"],
    ["iraUniversalEligibility_219b2", ["ira", "universalEligibility"], "IRC 219(b)(2) (historical text)"],
    ["iraUniversalEligibility_219Historical", ["ira", "universalEligibility"], "IRS Statistics of Income Bulletin (1982 transition)"],
    ["iraUniversalEligibility_219", ["ira", "universalEligibility"], "IRC 219 (ERTA 1981 text)"],
    ["iraSpousalIraAvailable_220", ["ira", "spousalIraAvailable"], "IRC 220 (Tax Reform Act of 1976 text)"],
    ["iraSpousalIraAvailable_219cHistorical", ["ira", "spousalIraAvailable"], "IRS Statistics of Income Bulletin (1982 transition)"],
    ["iraSpousalIraAvailable_219c", ["ira", "spousalIraAvailable"], "IRC 219(c) (ERTA 1981 text)"],
    ["iraOneEarnerHouseholdCombinedLimit_220b1C", ["ira", "oneEarnerHouseholdCombinedLimit"], "IRC 220(b)(1)(C) (Tax Reform Act of 1976 text)"],
    ["iraOneEarnerHouseholdCombinedLimit_219c", ["ira", "oneEarnerHouseholdCombinedLimit"], "IRS Statistics of Income Bulletin (1982 transition)"],
    ["iraOneEarnerHouseholdCombinedLimit_219c2Ai", ["ira", "oneEarnerHouseholdCombinedLimit"], "IRC 219(c)(2)(A)(i) (ERTA 1981 text)"],
    ["iraTraditionalContributionAge70HalfRestriction_219b3", ["ira", "traditionalContributionAge70HalfRestriction"], "IRC 219(b)(3) (historical text)"],
    ["iraTraditionalContributionAge70HalfRestriction_219d1", ["ira", "traditionalContributionAge70HalfRestriction"], "IRC 219(d)(1) (ERTA 1981 text)"],
    ["traditionalIraAvailable_219And408", ["availability", "traditionalIra"], "IRC 219 and 408 (historical text)"],
    ["availabilityRothIra_408A", ["availability", "rothIra"], "IRC 408A, effective for years after 1997"],
    ["iraCatchUp50_219b5Bii", ["ira", "age50CatchUp"], "IRC 219(b)(5)(B)(ii)"],
    ["iraCompensationFraction_219b1", ["ira", "compensationFraction"], "IRC 219(b)(1)(B)"],
    ["iraUniversalEligibility_219Historical", ["ira", "universalEligibility"], "IRS SOI Bulletin, 1982 universal-eligibility change"],
    ["iraNondeductibleContributionAvailable_408o", ["ira", "nondeductibleContributionAvailable"], "IRC 408(o)(1)"],
    ["iraSpousalIraAvailable_219cHistorical", ["ira", "spousalIraAvailable"], "IRS SOI Bulletin, one-earner spousal IRA rule"],
    ["iraNonworkingSpouseIndividualLimit_219c", ["ira", "nonworkingSpouseIndividualLimit"], "IRC 219(c), no fixed individual spousal cap"],
    ["iraOneEarnerHouseholdCombinedLimit_219c", ["ira", "oneEarnerHouseholdCombinedLimit"], "IRC 219(c), no fixed one-earner household cap"],
    ["iraTraditionalContributionAge70HalfRestriction_219d1", ["ira", "traditionalContributionAge70HalfRestriction"], "IRC 219(d)(1), repealed for years after 2019"],
    ["iraRothAvailable_408A", ["ira", "rothAvailable"], "IRC 408A, effective for years after 1997"],
    ["simpleSalaryReduction_408p2E", ["simple", "salaryReductionLimit"], "IRC 408(p)(2)(E)"],
    ["simpleSalaryReduction_408p2A", ["simple", "salaryReductionLimit"], "IRC 408(p)(2)(A)"],
    ["availabilitySimpleIra_408p", ["availability", "simpleIra"], "IRC 408(p), effective 1997"],
    ["simpleCatchUp50_414v2Bii", ["simple", "generalAge50CatchUp"], "IRC 414(v)(2)(B)(ii)"],
    ["simpleCertainPlanEnhancedSalaryReduction_408p2EiIorII", ["simple", "certainPlanEnhancedSalaryReductionLimit"], "IRC 408(p)(2)(E)(i)(I)-(II)"],
    ["simpleCertainPlanAge50CatchUp_414v2Biii", ["simple", "certainPlanAge50CatchUp"], "IRC 414(v)(2)(B)(iii)"],
    ["simpleAdditionalNonelectiveContributionCap_408p2Aiv", ["simple", "additionalNonelectiveContributionCap"], "IRC 408(p)(2)(A)(iv)"],
    ["sepCompensation_408k2C", ["sep", "minimumEligibleCompensation"], "IRC 408(k)(2)(C)"],
    ["sepMaximumEmployerContributionRate", ["sep", "maximumEmployerContributionRate"], "IRS Publication 590 (2002), SEP contribution limit"],
    ["sepMaximumEmployerContributionRate_preEgtrra", ["sep", "maximumEmployerContributionRate"], "IRS SEP/SARSEP Audit Techniques, pre-EGTRRA rate"],
    ["sepMaximumEmployerContributionRate_404h1C", ["sep", "maximumEmployerContributionRate"], "IRC 404(h)(1)(C) (Revenue Act of 1978 text)"],
    ["sepAvailable_408k", ["sep", "available"], "IRC 408(k) (Revenue Act of 1978 text)"],
    ["availabilitySepIra_408k", ["availability", "sepIra"], "IRC 408(k), effective 1979"],
    ["newSarsepMayBeEstablished_408k6A", ["sep", "newSarsepMayBeEstablished"], "IRC 408(k)(6)(A), SBJPA transition"],
    ["grandfatheredSarsepMayOperate_408k6A", ["sep", "grandfatheredSarsepMayOperate"], "IRC 408(k)(6)(A), SBJPA transition"],
    ["section457b_457b2AndC1", ["section457b", "baseDeferralLimit"], "IRC 457(b)(2), (c)(1)"],
    ["section457bAvailable_457", ["section457b", "available"], "IRC 457 (Revenue Act of 1978 text)"],
    ["availabilityGovernmental457b_457", ["availability", "governmental457b"], "IRC 457 (governmental plans), effective 1979"],
    ["availabilityNongovernmental457b_457", ["availability", "nongovernmental457b"], "IRC 457 (tax-exempt plans), effective 1979"],
    ["section457b_457b2A", ["section457b", "baseDeferralLimit"], "IRC 457(b)(2)(A) (Revenue Act of 1978 text)"],
    ["section457bIncludibleCompensationFraction_457b2B", ["section457b", "includibleCompensationFraction"], "IRC 457(b)(2)(B) (Revenue Act of 1978 text)"],
    ["section457bSpecialLastThreeYearsMaximum_457b3A", ["section457b", "specialLastThreeYearsMaximum"], "IRC 457(b)(3)(A) (Revenue Act of 1978 text)"],
    ["traditional401kAvailable_401k", ["availability", "traditional401k"], "IRC 401(k) (Revenue Act of 1978 text)"],
    ["availabilityDesignatedRoth401k_402A", ["availability", "designatedRoth401k"], "IRC 402A, effective for taxable years after 2005"],
    ["availabilityTraditional403b_403", ["availability", "traditional403b"], "IRC 403(b)"],
    ["availabilityDesignatedRoth403b_402A", ["availability", "designatedRoth403b"], "IRC 402A, effective for taxable years after 2005"],
    ["availabilityTraditionalTsp_5usc8432", ["availability", "traditionalTsp"], "5 USC 8432, 1987 implementation"],
    ["availabilityRothTsp_5usc8432d", ["availability", "rothTsp"], "77 FR 26417, effective May 7, 2012"],
    ["availabilityRothSimpleOrSep_408k7And408p12", ["availability", "rothSimpleOrSep"], "IRC 408(k)(7), 408(p)(12)"],
    ["availabilityStarter401kOrSafeHarbor403b_401k16And403b16", ["availability", "starter401kOrSafeHarbor403b"], "IRC 401(k)(16), 403(b)(16), effective 2024"],
    ["starterDeferralOnlyBase_401k16DiII_403b16DiII", ["starterDeferralOnly", "baseDeferralLimit"], "IRC 401(k)(16)(D)(i)(II), 403(b)(16)(D)(i)(II)"],
    ["starterDeferralOnlyAge50CatchUp", ["starterDeferralOnly", "age50CatchUp"], "Notice 2024-80, 2025 starter-plan age-50 increase"],
  ],

  /**
   * Phase-out bands. The primary file records {start, end} per filing status;
   * the data file records [start, end] under `phaseouts`. Both ends of each are
   * compared by the engine: a band's width is a convention, not a published
   * figure, so inferring the end from the start would verify an assumption
   * rather than the notice. The member map translates the primary file's filing
   * status names to the data file's.
   */
  bands: [
    [
      "traditionalCoveredPhaseout",
      ["phaseouts", "traditionalIraCovered"],
      {
        singleOrHeadOfHousehold: "singleOrHeadOfHousehold",
        marriedFilingJointly: "marriedFilingJointlyOrQualifyingSurvivingSpouse",
        marriedFilingSeparately: "marriedFilingSeparatelyLivingTogether",
      },
      "IRC 219(g)(3)",
    ],
    [
      "traditionalSpouseCoveredPhaseout_219g7A",
      ["phaseouts", "traditionalIraSpouseCovered"],
      {
        marriedFilingJointly: "marriedFilingJointly",
        // No notice publishes this band. §219(g)(7)(A) replaces only the joint
        // applicable dollar amount, so a married individual filing separately
        // keeps the zero at §219(g)(3)(B)(iii), and §219(g)(7)(B) substitutes a
        // $10,000 width for §219(g)(2)(A)(ii). Until this entry existed the data
        // carried the band and the verifier compared nothing: UNCOVERED scans
        // evidence keys, not data keys, so the gap was silent.
        marriedFilingSeparately: {
          data: "marriedFilingSeparatelyLivingTogether",
          citation: "IRC 219(g)(3)(B)(iii), 219(g)(7)(B)",
        },
      },
      "IRC 219(g)(7)(A)",
    ],
    [
      "rothPhaseout_408Ac3",
      ["phaseouts", "rothIra"],
      {
        singleOrHeadOfHousehold: "singleOrHeadOfHousehold",
        marriedFilingJointly: "marriedFilingJointlyOrQualifyingSurvivingSpouse",
        marriedFilingSeparately: "marriedFilingSeparatelyLivingTogether",
      },
      "IRC 408A(c)(3)",
    ],
  ],

  /**
   * The 402(g)/457(e)(15) elective series is recorded separately and spans more
   * years than the plan-year blocks, so it is walked on its own.
   */
  series: [
    {
      section: "electiveDeferralAndSection457b",
      comparisons: [
        ["electiveDeferral (series)", ["amount"], ["electiveDeferral402g"], "IRC 402(g)(1)"],
        ["section457b (series)", ["amount"], ["section457b", "baseDeferralLimit"], "IRC 457(e)(15)"],
      ],
    },
  ],

  /** Recorded in the evidence but outside what this package encodes. */
  unmodelled: [
    "dbAnnualBenefit_415b1A", // defined-benefit annual benefit; no DB plan modelling
    "socialSecurityWageBase", // OASDI wage base; not a contribution parameter
  ],

  /**
   * Places where the evidence and the data deliberately differ, each with the
   * value the data is required to carry instead. These are asserted, not
   * skipped: if the data stops matching the reconciled value, that is still a
   * failure.
   *
   * The evidence records the wage-threshold figure the IRS *published* for a
   * catch-up year. The data records the *operative* threshold, and the engine
   * reads null as "the mandatory-Roth catch-up rule does not apply this year"
   * (see catchUpTaxTreatment). Notice 2023-62 granted an administrative
   * transition period for IRC 414(v)(7)(A) as added by SECURE 2.0 section 603,
   * treating catch-up contributions for 2024 and 2025 as satisfying the
   * requirement regardless of prior-year wages. The mandate first bites for
   * 2026, which is the first year the data carries a figure.
   */
  reconciled: {
    "2024:rothCatchUpWageThreshold_414v7A": { value: null, why: "Notice 2023-62 transition period" },
    "2025:rothCatchUpWageThreshold_414v7A": { value: null, why: "Notice 2023-62 transition period" },
  },
};
