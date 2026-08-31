# Primary-source evidence — HSA limits

HSA figures are published in an annual **Revenue Procedure**, not in the
retirement COLA notice, so they carry their own corpus and their own check.

`primary-values.json` transcribes the figures from the documents in `sources/`,
and `verifier-config.mjs` declares how each recorded field maps onto
`data/hsa-parameters.json`. The shared engine `scripts/verify-evidence.mjs`
does the comparing — the HSA figures have their own corpus, not their own
checking logic.

```
npm run validate:evidence        # every corpus under evidence/
npm run validate:evidence:hsa    # this corpus alone
```

**230 comparisons over 2004–2026, 0 mismatches.**

## What is compared

Per year: §223(b)(2)(A) self-only and §223(b)(2)(B) family annual contribution
limits, the §223(b)(3)(B) additional contribution for age 55 and over, and the
§223(c)(2)(A) HDHP minimum annual deductible and maximum annual out-of-pocket —
**both coverage tiers of each**. The family amount is not a fixed multiple of
the self-only amount in every year, so deriving one from the other would verify
an assumption rather than the Rev. Proc.

Also the three fields that are rules rather than amounts, and that drive the two
behaviours this file calls load-bearing:
`contributionLimitCappedByHdhpAnnualDeductible`, `lastMonthRuleAvailable`, and
`testingPeriodMonths`. No Rev. Proc. states any of them, so they are cited to
the Code and to the act that enacted them, the same way the age-55 amount is —
see `_policyFlagsComment` in `primary-values.json` for the full derivation.

## Sources

Twenty-six documents: the annual Rev. Proc. for every year from 2004 through
2026, plus the statute text, which carries the 2006 amendment and
effective-date notes the policy flags rest on. Fixed by `SHA256SUMS.txt`:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).

## Two things not to "fix"

**The age-55 additional contribution is not in the Rev. Procs.** It is a
statutory table at §223(b)(3)(B) — $500 for 2004 rising to $1,000 for 2009 and
after — and is not inflation-adjusted, which is why the annual Rev. Proc. is
silent on it. It is cited to the statute instead.

**Years before 2007 carry a deductible cap.** For those years §223(b)(2) capped
the monthly limitation at 1/12 of the *lesser* of the plan's annual deductible
and the dollar amount. The Tax Relief and Health Care Act of 2006 §303 removed
that cap for taxable years beginning after 2006. The data records this as
`contributionLimitCappedByHdhpAnnualDeductible`; it is a real historical rule,
not a redundant flag. The same act's §305 added the §223(b)(8) last-month rule
on the same effective date, which is why `lastMonthRuleAvailable` and
`testingPeriodMonths` turn on at the same year boundary. Both are recorded from
the statute and compared in every year.

## Adding a year

Take the amounts from the Rev. Proc. itself, never from a summary table. Add
the document to `sources/`, extend `SHA256SUMS.txt`, add the year to
`primary-values.json` citing the Rev. Proc., then update
`data/hsa-parameters.json` until `npm run validate:evidence:hsa` passes.

A figure recorded in `primary-values.json` that is compared against nothing is
reported as `UNCOVERED` and fails the run, so a new parameter cannot be
recorded and then quietly ignored.
