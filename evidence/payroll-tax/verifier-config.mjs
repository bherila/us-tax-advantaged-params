export default {
  data: "data/payroll-tax-parameters.json",
  evidence: "evidence/payroll-tax/primary-values.json",
  yearBlocks: "years",
  scalars: [
  [
    "contributionAndBenefitBase",
    [
      "contributionAndBenefitBase"
    ],
    "Social Security Act 230 (42 U.S.C. 430); IRC 3121(a)(1), 1402(b)(1)"
  ],
  [
    "hospitalInsuranceWageBase",
    [
      "hospitalInsuranceWageBase"
    ],
    "IRC 3121(a)(1) and 1402(b)(1) as in effect before 1994; Pub. L. 103-66 section 13207 repealed the HI cap"
  ],
  [
    "oasdiRateEmployeePercent",
    [
      "oasdiRateEmployeePercent"
    ],
    "IRC 3101(a)"
  ],
  [
    "oasdiRateEmployerPercent",
    [
      "oasdiRateEmployerPercent"
    ],
    "IRC 3111(a)"
  ],
  [
    "hiRateEmployeePercent",
    [
      "hiRateEmployeePercent"
    ],
    "IRC 3101(b)(1)"
  ],
  [
    "hiRateEmployerPercent",
    [
      "hiRateEmployerPercent"
    ],
    "IRC 3111(b)"
  ],
  [
    "secaOasdiRatePercent",
    [
      "secaOasdiRatePercent"
    ],
    "IRC 1401(a)"
  ],
  [
    "secaHiRatePercent",
    [
      "secaHiRatePercent"
    ],
    "IRC 1401(b)(1)"
  ],
  [
    "netEarningsOasdiRateBasisPercent",
    [
      "netEarningsOasdiRateBasisPercent"
    ],
    "IRC 1402(a)(12)"
  ],
  [
    "netEarningsHiRateBasisPercent",
    [
      "netEarningsHiRateBasisPercent"
    ],
    "IRC 1402(a)(12)"
  ],
  [
    "netEarningsDeductionFraction",
    [
      "netEarningsDeductionFraction"
    ],
    "IRC 1402(a)(12)"
  ],
  [
    "selfEmploymentMinimumNetEarnings",
    [
      "selfEmploymentMinimumNetEarnings"
    ],
    "IRC 1402(b)(2)"
  ],
  [
    "secaOasdiDeductionFraction",
    [
      "secaOasdiDeductionFraction"
    ],
    "IRC 164(f)"
  ],
  [
    "secaHiDeductionFraction",
    [
      "secaHiDeductionFraction"
    ],
    "IRC 164(f)"
  ],
  [
    "additionalMedicareRatePercent",
    [
      "additionalMedicareRatePercent"
    ],
    "IRC 3101(b)(2), 1401(b)(2)(A)"
  ],
  [
    "additionalMedicareJointThreshold",
    [
      "additionalMedicareJointThreshold"
    ],
    "IRC 3101(b)(2)(A), 1401(b)(2)(A)"
  ],
  [
    "additionalMedicareOtherThreshold",
    [
      "additionalMedicareOtherThreshold"
    ],
    "IRC 3101(b)(2)(C), 1401(b)(2)(A)"
  ],
  [
    "additionalMedicareSeparateThresholdFraction",
    [
      "additionalMedicareSeparateThresholdFraction"
    ],
    "IRC 3101(b)(2)(B), 1401(b)(2)(A)"
  ],
  [
    "additionalMedicareWithholdingThreshold",
    [
      "additionalMedicareWithholdingThreshold"
    ],
    "IRC 3102(f)(1)"
  ]
],

  /**
   * Group source keys in this corpus's year blocks: keys that cover several
   * figures rather than one field. scripts/derive-figure-sources.mjs applies
   * the first group, in this order, that is present in a block and whose
   * pattern matches the raw field name. A field no group matches keeps a
   * `<field>_source` key if it has one, else the year's `source`.
   */
  sources: {
    groups: [
      // The six FICA/SECA rates of §§3101, 3111, 1401; the wage bases keep the year source.
      ["_rates_source", /^(?:(?:oasdi|hi)Rate(?:Employee|Employer)Percent|seca(?:Oasdi|Hi)RatePercent)$/],
      // §1402(a)(12)/(b)(2), §164(f) and Additional Medicare mechanics; contributionAndBenefitBase and hospitalInsuranceWageBase keep the year source.
      ["_mechanics_source", /^(?:netEarnings(?:OasdiRateBasisPercent|HiRateBasisPercent|DeductionFraction)|selfEmploymentMinimumNetEarnings|seca(?:Oasdi|Hi)DeductionFraction|additionalMedicare(?:RatePercent|JointThreshold|OtherThreshold|SeparateThresholdFraction|WithholdingThreshold))$/],
    ],
  },
};
