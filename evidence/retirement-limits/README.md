# Primary-source evidence — retirement limits

The conformance vectors prove the TypeScript and PHP engines agree with each
other. They cannot prove the encoded dollar amounts are the ones the IRS
actually published: two engines reading the same mistyped table agree
perfectly. This directory closes that gap.

`primary-values.json` transcribes the figures from the notices in `sources/`,
and `verifier-config.mjs` declares how each recorded field maps onto
`data/retirement-parameters.json`. The shared engine
`scripts/verify-evidence.mjs` does the comparing, so the shipped parameters are
anchored to the documents that create them rather than merely self-consistent.

```
npm run validate:evidence               # every corpus under evidence/
npm run validate:evidence:retirement    # this corpus alone
```

**350 comparisons over 2013–2026, 0 mismatches.**

## What is compared

Per plan year: §415(c)(1)(A) annual additions, §402(g)(1) elective deferral,
§457(e)(15), §414(v)(2)(B)(i) age-50 catch-up, §414(v)(2)(E)(i) age 60–63
catch-up, §414(v)(7)(A) Roth catch-up wage threshold, §401(a)(17) compensation,
§219(b)(5)(A) IRA contribution, and §219(b)(5)(B)(ii) IRA catch-up.

All six IRA phase-out bands, **both ends of each**: §219(g)(3) covered,
§219(g)(7)(A) spouse-covered, and §408A(c)(3) Roth. A band's width is a
convention rather than a published figure, so inferring the end from the start
would verify an assumption instead of the notice.

The §402(g)/§457(e)(15) elective series is compared for every year it records.

## Sources

Nineteen documents: IRS COLA notices from 2008 through 2025, the IR-series
releases that carried the figures before the notice format, and SSA Federal
Register wage-base determinations. Every file is fixed by `SHA256SUMS.txt`:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).

## Two things not to "fix"

**The §414(v)(7)(A) wage threshold is keyed by the catch-up year, not the wage
year.** The IRS describes the 2025 threshold as the figure applied to 2025
wages to determine whether *2026* catch-up contributions must be Roth. The
transcription keys it by the catch-up year and the engine compares against
prior-year wages. The pairing reproduces the statute exactly; changing either
half alone breaks it.

**The data carries `null` for catch-up years 2024 and 2025 where the evidence
records $145,000.** This is a deliberate divergence, asserted rather than
skipped by the verifier. The evidence records the figure the IRS *published*;
the data records the *operative* threshold, and the engine reads `null` as "the
mandatory-Roth catch-up rule does not apply this year". Notice 2023-62 granted
an administrative transition period for §414(v)(7)(A) as added by SECURE 2.0
§603, so catch-up contributions for 2024 and 2025 satisfy the requirement
regardless of prior-year wages. The mandate first bites for 2026.

## Adding a year

Take the amounts from the notice itself, never from a summary table — summary
tables are where transcription errors originate. Add the document to
`sources/`, extend `SHA256SUMS.txt`, add the year to `primary-values.json`
citing the notice, then update `data/retirement-parameters.json` until
`npm run validate:evidence:retirement` passes.

Any figure recorded in `primary-values.json` that the verifier compares against
nothing is reported as `UNCOVERED` and fails the run, so a new parameter cannot
be recorded and then quietly ignored. Figures outside what the package models
are listed explicitly in this corpus's `unmodelled` declaration.
