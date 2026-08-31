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
    ["electiveDeferral_402g1", ["electiveDeferral402g"], "IRC 402(g)(1)"],
    ["section457b_457e15", ["section457b", "baseDeferralLimit"], "IRC 457(e)(15)"],
    ["catchUp50_414v2Bi", ["generalAge50CatchUp"], "IRC 414(v)(2)(B)(i)"],
    ["catchUp60To63_414v2Ei", ["age60To63CatchUp"], "IRC 414(v)(2)(E)(i)"],
    ["rothCatchUpWageThreshold_414v7A", ["rothCatchUpPriorYearFicaWageThreshold"], "IRC 414(v)(7)(A)"],
    ["compensationLimit_401a17", ["annualCompensation401a17"], "IRC 401(a)(17)"],
    ["iraContribution_219b5A", ["ira", "baseContributionLimit"], "IRC 219(b)(5)(A)"],
    ["iraCatchUp50_219b5Bii", ["ira", "age50CatchUp"], "IRC 219(b)(5)(B)(ii)"],
    ["simpleSalaryReduction_408p2E", ["simple", "salaryReductionLimit"], "IRC 408(p)(2)(E)"],
    ["simpleCatchUp50_414v2Bii", ["simple", "generalAge50CatchUp"], "IRC 414(v)(2)(B)(ii)"],
    ["sepCompensation_408k2C", ["sep", "minimumEligibleCompensation"], "IRC 408(k)(2)(C)"],
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
      { marriedFilingJointly: "marriedFilingJointly" },
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
