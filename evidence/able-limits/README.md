# Primary-source evidence — ABLE limits

The IRC §529A(b)(2)(B)(i) contribution limit was the IRC §2503(b) gift exclusion
through 2025, so no document published it separately before 2026. This corpus
therefore holds each year's inflation-adjustment Revenue Procedure for the gift
exclusion, Rev. Proc. 2025-32 for the first separately stated ABLE amount, the
ABLE Act and Pub. L. 119-21 for the rule, and the Code for the amendment notes.

`primary-values.json` transcribes the figures and rules from the documents in
`sources/`, and `verifier-config.mjs` declares how each recorded field maps onto
`data/able-parameters.json`. The shared engine `scripts/verify-evidence.mjs`
does the comparing. What that comparison does and does not prove is set out in
the retirement corpus README under "What this proves, and what it does not"; it
holds identically here.

```
npm run validate:evidence         # every corpus under evidence/
npm run validate:evidence:able    # this corpus alone
```

## What is compared

For every year 2015–2026:
- the state;
- the §529A(b)(2)(B)(i) contribution limit;
- the §2503(b) gift exclusion, from its own Revenue Procedure sentence;
- whether the §529A(b)(2)(B)(ii) employed-beneficiary contribution applies;
- the §529A(e)(1)(A) disability-onset age.

`equalsSection2503bExclusion` is not transcribed. It follows from the two
amounts, and `validate:data` checks that it agrees with them.

## Two things not to "fix"

**2026's ABLE limit is not the gift exclusion.** Pub. L. 119-21 §70115(a)(1)
adjusts the ABLE limit from a 1996 base where the gift exclusion uses 1997.
Rev. Proc. 2025-32 states $20,000 in §4.34 and $19,000 in §4.42(1). Deriving the
ABLE figure from the gift exclusion reproduces every year through 2025 and gets
2026 wrong.

**A later year may show the two equal again.** Each amount rounds down to a
multiple of $1,000, so the different bases can still land on the same figure.
Equality is recorded per year rather than asserted as a rule.

## Sources

Sixteen documents:
- Rev. Procs. 2014-61 through 2025-32, one for each year;
- the Stephen Beck, Jr., ABLE Act of 2014 (Pub. L. 113-295);
- Pub. L. 119-21;
- the 2024 edition of 26 U.S.C. §§529A and 2503.

The Revenue Procedures and Pub. L. 119-21 are also committed in the FSA corpus.
They are repeated here so that this corpus's manifest is self-contained.

`SHA256SUMS.txt` fixes every file, and `npm run validate:evidence` verifies it in
both directions. The manual form must run from inside `sources/`:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).
