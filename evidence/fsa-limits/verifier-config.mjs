/**
 * Declarative mapping from evidence/fsa-limits/primary-values.json onto
 * data/fsa-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * Two statutes with two different publication habits share one corpus. The
 * §125(i) health FSA salary-reduction limit is indexed and appears in the
 * annual inflation-adjustment revenue procedure; the §129 dependent care
 * exclusion is a fixed statutory amount that appears in no revenue procedure at
 * all and is cited to the Code and to the two acts that changed it. Neither
 * brings its own checking logic — the comparison engine, the UNCOVERED gap
 * detection, the report format, and the exit convention are shared.
 */
export default {
  data: "data/fsa-parameters.json",
  evidence: "evidence/fsa-limits/primary-values.json",

  /**
   * Scalar figures: primary-values field -> path within the data year block.
   *
   * Both live under `healthFsa`, which is null for 1987 through 2012 because
   * §125(i) did not exist. Those year blocks simply do not record the fields,
   * so nothing is compared for them and nothing is silently defaulted.
   *
   * The carryover is not a statutory figure and not always a Rev. Proc. one:
   * Notice 2013-71 created it at a fixed $500, Notice 2020-33 indexed it at 20
   * percent of the §125(i) limit, and Rev. Proc. 2020-45 is the first annual
   * procedure in this sequence to state one itself. Each year block's
   * `healthFsaCarryoverLimit_source` names which of those it came from.
   */
  scalars: [
    ["healthFsaSalaryReductionLimit_125i", ["healthFsa", "salaryReductionLimit"], "IRC 125(i)"],
    ["healthFsaCarryoverLimit", ["healthFsa", "carryoverLimit"], "Notice 2013-71; Notice 2020-33"],
    // The transitions themselves, bound on both sides. Vectors already exercise
    // the behaviour, but a vector is the engine agreeing with itself; these make
    // the effective dates a claim the corpus checks against the data.
    ["healthFsaDollarLimitState", ["healthFsa", "state"], "IRC 125(i); Pub. L. 111-148 s.9005; Notice 2012-40"],
    ["dependentCareDollarLimitState", ["dependentCare", "state"], "IRC 129(a)(2)(A); Pub. L. 99-514 s.1163(a)"],
  ],

  /**
   * The §129(a)(2)(A) exclusion is recorded per return type and compared member
   * by member. The married-separate amount is half the general amount in every
   * year encoded, but that is a pattern rather than a published rule — the
   * statute writes both figures out, and Pub. L. 117-2 §9632 wrote its 2021
   * substitution as "$10,500 (half such dollar amount" rather than as two
   * numbers — so deriving one from the other would verify an assumption instead
   * of the statute.
   */
  tiered: [
    [
      "dependentCareExclusion_129a2A",
      ["dependentCare"],
      ["exclusionLimit", "marriedFilingSeparatelyExclusionLimit"],
      "IRC 129(a)(2)(A); Pub. L. 117-2 s.9632; Pub. L. 119-21 s.70404",
    ],
  ],
};
