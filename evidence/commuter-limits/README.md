# Primary-source evidence — commuter limits

The IRC §132(f) transit and parking limits are published in each year's
inflation-adjustment Revenue Procedure. They are also the one series in this
package that Congress repeatedly changed after publication. This corpus
therefore holds the procedures, the statutes that set and later overrode the
amounts, Notice 2016-6, and the Code.

`primary-values.json` transcribes the figures from the documents in `sources/`,
and `verifier-config.mjs` declares how each recorded field maps onto
`data/commuter-parameters.json`. The shared engine `scripts/verify-evidence.mjs`
does the comparing. What that comparison does and does not prove is set out in
the retirement corpus README under "What this proves, and what it does not"; it
holds identically here.

```
npm run validate:evidence             # every corpus under evidence/
npm run validate:evidence:commuter    # this corpus alone
```

## What is compared

For every year 1999–2026:
- the transit, parking and bicycle states;
- the transit limit as printed;
- the parking limit;
- for 2009–2017, the $20 bicycle amount.

For 2009, the January and March transit amounts are also compared against the
monthly schedule.

## The printed figure is kept, and reconciled

The data follows the law as finally applied. Where a later statute changed a
printed transit figure, the evidence records what was printed and the
`reconciled` map asserts the corrected data value:

| Year | Printed | Data | Why |
|---|---|---|---|
| 2009 | $120 | Jan–Feb $120, Mar–Dec $230 | Pub. L. 111-5 §1151 |
| 2012 | $125 | $240 | Pub. L. 112-240 §203; Rev. Proc. 2013-15 §3 |
| 2014 | $130 | $250 | Pub. L. 113-295 div. A §103 |
| 2015 | $130 | $250 | Pub. L. 114-113 div. Q §105; Notice 2016-6 |
| 2016 | $130 | $255 | Notice 2016-6 |

Where an IRS document states the corrected figure (2012, 2015 and 2016), it is
also transcribed and compared on its own.

## Sources

Thirty-nine documents:
- Rev. Procs. 99-42 through 2025-32;
- Pub. L. 105-178, 110-343, 111-5, 111-312, 112-240, 113-295, 114-113, 115-97 and 119-21;
- Notice 2016-6;
- the 2024 edition of 26 U.S.C. §132.

Several are also committed in other corpora. They are repeated here so that this
corpus's manifest is self-contained.

`SHA256SUMS.txt` fixes every file, and `npm run validate:evidence` verifies it in
both directions. The manual form must run from inside `sources/`:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).
