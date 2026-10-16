/**
 * Declarative mapping from evidence/commuter-limits/primary-values.json onto
 * data/commuter-parameters.json, consumed by scripts/verify-evidence.mjs.
 *
 * transitMonthly_132f2A records the transit amount exactly as each year's
 * revenue procedure printed it. The data carries the amount the law finally
 * applied. Where Congress retroactively raised transit to parking parity after
 * the procedure was published, the divergence is asserted through `reconciled`,
 * never skipped: a data value that drifts back to the printed figure fails.
 * The corrected figure is also transcribed separately wherever an IRS document
 * states it (transitMonthlyCorrected_132f2A).
 */
export default {
  data: "data/commuter-parameters.json",
  evidence: "evidence/commuter-limits/primary-values.json",

  scalars: [
    ["transitState", ["transitAndVanpool", "state"], "IRC 132(f)(2)(A)"],
    ["parkingState", ["parking", "state"], "IRC 132(f)(2)(B)"],
    ["bicycleState", ["bicycleCommuting", "state"], "IRC 132(f)(1)(D), (8); Pub. L. 119-21 sec. 70112(a)"],
    ["transitMonthly_132f2A", ["transitAndVanpool", "monthlyLimit"], "IRC 132(f)(2)(A)"],
    ["transitMonthlyCorrected_132f2A", ["transitAndVanpool", "monthlyLimit"], "IRC 132(f)(2)(A), as corrected"],
    ["transitMonthlyJanuary2009_132f2A", ["transitAndVanpool", "monthlyLimitsByMonth", "0"], "IRC 132(f)(2)(A) before Pub. L. 111-5 sec. 1151"],
    ["transitMonthlyMarch2009_132f2A", ["transitAndVanpool", "monthlyLimitsByMonth", "2"], "IRC 132(f)(2) parity sentence, Pub. L. 111-5 sec. 1151"],
    ["parkingMonthly_132f2B", ["parking", "monthlyLimit"], "IRC 132(f)(2)(B)"],
    ["bicycleMonthly_132f5Fii", ["bicycleCommuting", "monthlyAmount"], "IRC 132(f)(5)(F)(ii)"],
  ],

  reconciled: {
    "2009:transitMonthly_132f2A": { value: null, why: "Pub. L. 111-5 sec. 1151 changed transit from March 2009; the year carries a monthly schedule" },
    "2012:transitMonthly_132f2A": { value: 240, why: "Pub. L. 112-240 sec. 203 parity; Rev. Proc. 2013-15 sec. 3" },
    "2014:transitMonthly_132f2A": { value: 250, why: "Pub. L. 113-295 div. A sec. 103 parity" },
    "2015:transitMonthly_132f2A": { value: 250, why: "Pub. L. 114-113 div. Q sec. 105; Notice 2016-6" },
    "2016:transitMonthly_132f2A": { value: 255, why: "Pub. L. 114-113 div. Q sec. 105; Notice 2016-6" },
  },

  /**
   * Group source keys in this corpus's year blocks: keys that cover several
   * figures rather than one field. scripts/derive-figure-sources.mjs applies
   * the first group, in this order, that is present in a block and whose
   * pattern matches the raw field name. A field no group matches keeps a
   * `<field>_source` key if it has one, else the year's `source`.
   */
  sources: {
    groups: [
      // 2009, 2012, 2014-2016: the data carries the as-corrected transit amount (and 2009's within-year state), which the printed Rev. Proc. did not publish; transitMonthlyJanuary2009 keeps the printed $120 and is excluded.
      ["transitCorrection_source", /^(?:transitState|transitMonthly(?:Corrected|March2009)?_132f2A)$/],
      // 2002 only; the statutory $100 transit amount. It shadows amounts_source (rp-01-59) for that one figure.
      ["transitIncrease_source", /^transitMonthly_132f2A$/],
      // Every bicycle field; the Rev. Procs. never state the unindexed $20 or the suspension and repeal.
      ["bicycle_source", /^bicycle(?:State|Monthly_132f5Fii)$/],
      // The Qualified Transportation Fringe item: printed transit and parking amounts and their states, in years no correction overrides.
      ["amounts_source", /^(?:transitState|parkingState|transitMonthly(?:January2009)?_132f2A|parkingMonthly_132f2B)$/],
    ],
  },
};
