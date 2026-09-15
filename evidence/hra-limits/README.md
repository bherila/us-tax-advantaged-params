# Primary-source evidence — HRA limits

Three health reimbursement arrangement rules carry figures this package
exposes:
- the IRC §9831(d) qualified small employer HRA (QSEHRA), with self-only and family limits;
- the 26 CFR 54.9831-1(c)(3)(viii) excepted benefit HRA, with a limit on amounts newly made available each plan year;
- the 26 CFR 54.9802-4 individual coverage HRA, which has no dollar limit.

`primary-values.json` transcribes the figures and rules from the documents in
`sources/`, and `verifier-config.mjs` declares how each recorded field maps onto
`data/hra-parameters.json`. The shared engine `scripts/verify-evidence.mjs` does
the comparing. What that comparison does and does not prove is set out in the
retirement corpus README under "What this proves, and what it does not"; it
holds identically here.

```
npm run validate:evidence        # every corpus under evidence/
npm run validate:evidence:hra    # this corpus alone
```

## What is compared

For every year 2017–2026:
- **QSEHRA:** the state, and the self-only and family limits;
- **Excepted benefit HRA:** the state and, from 2020, the annual limit;
- **Individual coverage HRA:** the state.

QSEHRA rows are calendar years. The two regulatory HRAs are keyed by the year
a plan year begins.

## Three things not to "fix"

**2017's family limit is $10,050.** Rev. Proc. 2017-58 recites the statutory
$4,950 and $10,000. The statute indexes both from a 2015 base for years after
2016, though, and Notice 2017-67's footnote 5 says that raised the family figure
to $10,050 for 2017 while leaving $4,950 unchanged.

**2021's excepted benefit HRA limit is stated only in Rev. Proc. 2020-43.** The
annual HSA procedure for 2021 does not mention it. Rev. Proc. 2020-43 is
committed so that the unchanged $1,800 is sourced rather than assumed.

**The individual coverage HRA has no amount.** Every dollar figure in 26 CFR
54.9802-4 is inside an example. The `null` records that finding; it is not a gap.

## Sources

Eighteen documents:
- Rev. Procs. 2017-58 through 2025-32, for QSEHRA;
- Rev. Procs. 2020-43 and 2021-25 through 2025-19, for the excepted benefit HRA;
- Notice 2017-67;
- T.D. 9867;
- the 2024 edition of 26 U.S.C. §9831.

Several procedures are also committed in the FSA and HSA corpora. They are
repeated here so that this corpus's manifest is self-contained.

`SHA256SUMS.txt` fixes every file, and `npm run validate:evidence` verifies it in
both directions. The manual form must run from inside `sources/`:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).
