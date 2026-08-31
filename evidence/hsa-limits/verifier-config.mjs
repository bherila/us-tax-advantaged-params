/**
 * Declarative mapping from evidence/hsa-limits/primary-values.json onto
 * data/hsa-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * The HSA figures come from an annual Revenue Procedure, not from the
 * retirement COLA notice, so they carry their own corpus — but not their own
 * checking logic. The comparison engine, the UNCOVERED gap detection, the
 * report format, and the exit convention are shared.
 */
export default {
  data: "data/hsa-parameters.json",
  evidence: "evidence/hsa-limits/primary-values.json",

  /** Scalar figures: primary-values field -> path within the data year block. */
  scalars: [
    ["annualContributionLimitSelfOnly_223b2A", ["annualContributionLimit", "selfOnly"], "IRC 223(b)(2)(A)"],
    ["annualContributionLimitFamily_223b2B", ["annualContributionLimit", "family"], "IRC 223(b)(2)(B)"],
    ["additionalContributionAmountAge55", ["additionalContributionAmountAge55"], "IRC 223(b)(3)(B)"],
  ],

  /**
   * Figures recorded per coverage tier. Both tiers are compared: the family
   * amount is not a fixed multiple of the self-only amount in every year, so
   * deriving one from the other would verify an assumption rather than the
   * Rev. Proc.
   */
  tiered: [
    ["hdhpMinimumAnnualDeductible_223c2Ai", ["hdhp", "minimumAnnualDeductible"], ["selfOnly", "family"], "IRC 223(c)(2)(A)(i)"],
    ["hdhpMaximumAnnualOutOfPocket_223c2Aii", ["hdhp", "maximumAnnualOutOfPocket"], ["selfOnly", "family"], "IRC 223(c)(2)(A)(ii)"],
  ],

  /** The age-55 amount is keyed differently in the two files. */
  aliases: {
    additionalContributionAmount55_223b3B: "additionalContributionAmountAge55",
  },
};
