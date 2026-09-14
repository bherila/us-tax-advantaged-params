/**
 * Declarative mapping from evidence/hra-limits/primary-values.json onto
 * data/hra-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * The states are compared as well as the amounts. For the individual coverage
 * HRA the state is the whole finding -- no dollar limit applies -- and for the
 * two plan-year arrangements it records the 2020 start.
 */
export default {
  data: "data/hra-parameters.json",
  evidence: "evidence/hra-limits/primary-values.json",

  scalars: [
    ["qsehraState", ["qualifiedSmallEmployerHra", "state"], "IRC 9831(d); Pub. L. 114-255 sec. 18001"],
    ["qsehraSelfOnly_9831d2Biii", ["qualifiedSmallEmployerHra", "selfOnlyLimit"], "IRC 9831(d)(2)(B)(iii), (D)(ii)"],
    ["qsehraFamily_9831d2Biii", ["qualifiedSmallEmployerHra", "familyLimit"], "IRC 9831(d)(2)(B)(iii), (D)(ii)"],
    ["ebhraState", ["exceptedBenefitHra", "state"], "26 CFR 54.9831-1(c)(3)(viii); T.D. 9867"],
    ["ebhraAnnualLimit_549831c3viiiB1", ["exceptedBenefitHra", "annualLimit"], "26 CFR 54.9831-1(c)(3)(viii)(B)(1)"],
    ["ichraState", ["individualCoverageHra", "state"], "26 CFR 54.9802-4; T.D. 9867"],
  ],
};
