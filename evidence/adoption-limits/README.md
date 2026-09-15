# Primary-source evidence — adoption limits

The IRC §23 adoption credit and the IRC §137 adoption assistance exclusion
started as statutory amounts in 1997 and have been indexed since 2003. This
corpus holds the enacted laws for the unindexed years and the change points, the
annual Revenue Procedure for every indexed year, and the Code for its amendment
notes.

`primary-values.json` transcribes the figures and rules from the documents in
`sources/`, and `verifier-config.mjs` declares how each recorded field maps onto
`data/adoption-parameters.json`. The shared engine `scripts/verify-evidence.mjs`
does the comparing. What that comparison does and does not prove is set out in
the retirement corpus README under "What this proves, and what it does not"; it
holds identically here.

```
npm run validate:evidence             # every corpus under evidence/
npm run validate:evidence:adoption    # this corpus alone
```

## What is compared

For every year 1997–2026, and separately for the credit and for the exclusion:
- the state;
- the dollar limit;
- the special-needs expense limit;
- both ends of the phase-out;
- from 2003, the flat special-needs amount.

For the credit only:
- which section it sat in (§23, or §36C for 2010 and 2011);
- whether it was refundable;
- from 2025, the §23(a)(4) refundable portion.

## Three things not to "fix"

**2010 is $13,170, not the $12,170 Rev. Proc. 2009-50 printed.** The Affordable
Care Act §10909 raised the maximum after that procedure was published.
Rev. Proc. 2010-35 rewrites its adoption sections, and the data follows
Rev. Proc. 2010-35. Both procedures are committed.

**2012 is not refundable.** Pub. L. 111-312 §101(b) ended the ACA amendments for
taxable years beginning after December 31, 2011. The credit returned to §23, at
the amount indexed from EGTRRA's $10,000.

**2002 has no flat special-needs amount.** EGTRRA §202(g) applies the
$10,000/$150,000 changes to taxable years beginning after 2001, but the flat
amount under §202(a), and indexing, only after 2002. No Revenue Procedure states
2002; Rev. Proc. 2001-59 has no adoption section.

## Sources

Thirty-two documents:
- Rev. Procs. 2002-70 through 2025-32: one for each year from 2003 to 2026, plus Rev. Proc. 2010-35 for 2010 and the superseded Rev. Proc. 2009-50;
- Pub. L. 104-188, 107-16, 107-147, 111-312 and 119-21;
- the 2024 edition of 26 U.S.C. §§23 and 137.

Several are also committed in other corpora. They are repeated here so that this
corpus's manifest is self-contained.

`SHA256SUMS.txt` fixes every file, and `npm run validate:evidence` verifies it in
both directions. The manual form must run from inside `sources/`:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).
