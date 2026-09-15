# Primary-source evidence — education limits

The IRC §530, §127 and §529 figures are statutory. None of them was inflation
adjusted through 2026, so no annual notice or Revenue Procedure publishes them.
This corpus therefore holds the enacted laws that set and changed each amount,
and the 2024 edition of the Code, whose amendment and effective-date notes
record the rest.

`primary-values.json` transcribes the figures and rules from the documents in
`sources/`, and `verifier-config.mjs` declares how each recorded field maps onto
`data/education-parameters.json`. The shared engine `scripts/verify-evidence.mjs`
does the comparing. What that comparison does and does not prove is set out in
the retirement corpus README under "What this proves, and what it does not"; it
holds identically here.

```
npm run validate:evidence              # every corpus under evidence/
npm run validate:evidence:education    # this corpus alone
```

## What is compared

For every year 1996–2026:

- **§530 Coverdell education savings accounts:** the state, the
  §530(b)(1)(A)(iii) contribution limit, and both ends of the §530(c)(1)
  phase-out for a joint return and for other returns. 1996 and 1997 are
  `unavailable`, because Pub. L. 105-34 §213(f) applies §530 to taxable years
  beginning after December 31, 1997.
- **§127 educational assistance programs:** the state and the §127(a)(2)
  exclusion limit.
- **§529 qualified tuition programs:** the state, and each of the three §529
  distribution caps from the year it takes effect. The state is
  `available_without_statutory_dollar_limit` from 1997 because §529(b)(6) states
  no dollar limit. It is `indeterminate` for 1996 because Pub. L. 104-188
  §1806(c)(1) reaches only taxable years ending after August 20, 1996. For the
  §529(e)(3) cap the corpus also records which expenses §529(c)(7) describes:
  tuition through 2024, a change for distributions after July 4, 2025
  (Pub. L. 119-21 §70413(a)), and eight categories from 2026.

Each year block records, per figure, the provision and the effective-date text
it rests on.

## Two things not to "fix"

**§127 is not carried back before 1996.** It lapsed and was retroactively
reinstated several times before then. From 1996 it runs without a gap, through
Pub. L. 104-188 §1202, Pub. L. 105-34 §221, the Pub. L. 106-170 extension
recorded in the Code's notes, and Pub. L. 107-16 §411, whose sunset
Pub. L. 111-312 §101(a)(1) moved and Pub. L. 112-240 §101(a) removed.

**§127 stops being flat in 2027.** Pub. L. 119-21 §70412(b) indexes the $5,250
for taxable years beginning after 2026. A 2027 row takes the published amount,
not a copy of 2026.

## Sources

Nine documents:
- the 2024 edition of 26 U.S.C. §§127, 529 and 530;
- Pub. L. 104-188, 105-34, 107-16, 111-312, 112-240 and 119-21.

The last three public laws are also committed in other corpora. They are
repeated here so that this corpus's manifest is self-contained.

`SHA256SUMS.txt` fixes every file, and `npm run validate:evidence` verifies it in
both directions. The manual form must run from inside `sources/`, because the
manifest lists bare filenames:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).
