/**
 * Declarative mapping from evidence/able-limits/primary-values.json onto
 * data/able-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * The IRC 529A(b)(2)(B)(i) limit and the IRC 2503(b) gift exclusion are both
 * transcribed and compared, each from its own sentence. Through 2025 the
 * Revenue Procedures state only the gift exclusion, which the ABLE limit
 * adopts by reference. From 2026 Rev. Proc. 2025-32 states the ABLE amount
 * separately. Comparing the two independently is what keeps a derived ABLE
 * figure from passing in a year where the two differ.
 */
export default {
  data: "data/able-parameters.json",
  evidence: "evidence/able-limits/primary-values.json",

  scalars: [
    ["ableState", ["ableAccount", "state"], "IRC 529A; Pub. L. 113-295 div. B sec. 102(f)(1)"],
    ["ableContributionLimit_529Ab2Bi", ["ableAccount", "annualContributionLimit"], "IRC 529A(b)(2)(B)(i)"],
    ["giftExclusion_2503b", ["ableAccount", "section2503bExclusion"], "IRC 2503(b)"],
    [
      "ableToWorkAvailable_529Ab2Bii",
      ["ableAccount", "ableToWorkContributionAvailable"],
      "IRC 529A(b)(2)(B)(ii); Pub. L. 115-97 sec. 11024; Pub. L. 119-21 sec. 70115(a)(2)",
    ],
    [
      "disabilityOnsetAge_529Ae1A",
      ["ableAccount", "disabilityOnsetAgeLimit"],
      "IRC 529A(e)(1)(A); Pub. L. 117-328 div. T sec. 124",
    ],
  ],
};
