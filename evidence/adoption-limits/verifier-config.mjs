/**
 * Declarative mapping from evidence/adoption-limits/primary-values.json onto
 * data/adoption-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * The IRC 23 credit and the IRC 137 exclusion are transcribed and compared
 * separately even though every revenue procedure prints the same amounts for
 * both: they are two statutory provisions indexed in parallel, and comparing
 * one against the other's sentence would verify the parallel rather than the
 * procedure. Both ends of each phase-out are compared; the $40,000 width is a
 * statutory constant that validate:data enforces on its own.
 */
export default {
  data: "data/adoption-parameters.json",
  evidence: "evidence/adoption-limits/primary-values.json",

  scalars: [
    ["adoptionCreditState", ["adoptionCredit", "state"], "IRC 23; Pub. L. 104-188 sec. 1807"],
    ["creditCodeSection", ["adoptionCredit", "codeSection"], "IRC 23; IRC 36C for 2010-2011 (Pub. L. 111-148 sec. 10909)"],
    ["creditRefundability", ["adoptionCredit", "refundability"], "IRC 36C (2010-2011); IRC 23(a)(4) from 2025"],
    ["creditDollarLimit_23b1", ["adoptionCredit", "dollarLimit"], "IRC 23(b)(1)"],
    ["creditSpecialNeedsDollarLimit_23b1", ["adoptionCredit", "specialNeedsDollarLimit"], "IRC 23(b)(1)"],
    ["creditSpecialNeedsAmount_23a3", ["adoptionCredit", "specialNeedsCreditAmount"], "IRC 23(a)(3)"],
    ["creditRefundablePortion_23a4", ["adoptionCredit", "refundablePortionLimit"], "IRC 23(a)(4)"],
    ["adoptionAssistanceState", ["adoptionAssistanceExclusion", "state"], "IRC 137; Pub. L. 104-188 sec. 1807"],
    ["exclusionDollarLimit_137b1", ["adoptionAssistanceExclusion", "dollarLimit"], "IRC 137(b)(1)"],
    ["exclusionSpecialNeedsDollarLimit_137b1", ["adoptionAssistanceExclusion", "specialNeedsDollarLimit"], "IRC 137(b)(1)"],
    ["exclusionSpecialNeedsAmount_137a2", ["adoptionAssistanceExclusion", "specialNeedsExclusionAmount"], "IRC 137(a)(2)"],
  ],

  bands: [
    ["creditPhaseout_23b2A", ["adoptionCredit"], { phaseout: "phaseout" }, "IRC 23(b)(2)(A)"],
    ["exclusionPhaseout_137b2A", ["adoptionAssistanceExclusion"], { phaseout: "phaseout" }, "IRC 137(b)(2)(A)"],
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
      // 2025-2026 only; the §23(a)(4) portion and the resulting 'partially_refundable' status, which the pre-enactment Rev. Proc. 2024-40 cannot fix.
      ["refundablePortion_source", /^creditRefundab(?:lePortion_23a4|ility)$/],
      // 2010-2012 only; the §36C redesignation, its refundability and the 2012 return to §23.
      ["codeSection_source", /^credit(?:CodeSection|Refundability)$/],
      // Every dollar amount and phase-out in the Adoption Credit / Assistance sections; the state, code-section and refundability fields stay with the year source or the narrower groups.
      ["amounts_source", /^(?:credit(?:DollarLimit|SpecialNeedsDollarLimit)_23b1|creditSpecialNeedsAmount_23a3|creditPhaseout_23b2A|exclusion(?:DollarLimit|SpecialNeedsDollarLimit)_137b1|exclusionSpecialNeedsAmount_137a2|exclusionPhaseout_137b2A)$/],
    ],
  },
};
