/**
 * Declarative mapping from evidence/education-limits/primary-values.json onto
 * data/education-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * Every figure here is statutory rather than inflation adjusted, so the
 * documents are the enacted laws and the Code with its amendment and
 * effective-date notes, not an annual Revenue Procedure. The comparison
 * engine, the UNCOVERED gap detection, the report format and the exit
 * convention are shared with the other corpora.
 *
 * The state fields are compared as well as the amounts. For IRC 529 the state
 * is the whole finding -- no federal contribution limit applies -- so an
 * amount-only comparison would verify nothing about it.
 */
export default {
  data: "data/education-parameters.json",
  evidence: "evidence/education-limits/primary-values.json",

  scalars: [
    ["coverdellState", ["coverdellEducationSavingsAccount", "state"], "IRC 530; Pub. L. 105-34 sec. 213(f)"],
    [
      "coverdellContributionLimit_530b1Aiii",
      ["coverdellEducationSavingsAccount", "annualContributionLimit"],
      "IRC 530(b)(1)(A)(iii)",
    ],
    ["educationalAssistanceState", ["educationalAssistanceProgram", "state"], "IRC 127"],
    ["educationalAssistanceExclusion_127a2", ["educationalAssistanceProgram", "annualExclusionLimit"], "IRC 127(a)(2)"],
    ["qualifiedTuitionProgramState", ["qualifiedTuitionProgram", "state"], "IRC 529(b)(6)"],
    [
      "qtpElementarySecondaryTuition_529e3",
      ["qualifiedTuitionProgram", "elementarySecondaryTuitionAnnualLimit"],
      "IRC 529(e)(3)",
    ],
    [
      "qtpQualifiedEducationLoanLifetime_529c9B",
      ["qualifiedTuitionProgram", "qualifiedEducationLoanLifetimeLimit"],
      "IRC 529(c)(9)(B)",
    ],
    [
      "qtpRothIraRolloverLifetime_529c3EiiII",
      ["qualifiedTuitionProgram", "rothIraRolloverLifetimeLimit"],
      "IRC 529(c)(3)(E)(ii)(II)",
    ],
  ],

  /**
   * The IRC 530(c)(1) phase-out. The Code states a starting amount and a width,
   * not a range; the evidence records the resulting {start, end} so both ends
   * are compared rather than one inferred from the other.
   */
  bands: [
    [
      "coverdellPhaseout_530c1",
      ["coverdellEducationSavingsAccount", "contributionPhaseout"],
      { jointReturn: "jointReturn", otherReturns: "otherReturns" },
      "IRC 530(c)(1)",
    ],
  ],
};
